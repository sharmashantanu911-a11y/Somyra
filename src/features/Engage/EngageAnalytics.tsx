import React, { useState, useEffect } from 'react';
import { Loader2, MessageCircle, TrendingUp, Users, ThumbsUp, ThumbsDown, Activity, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EngageAnalyticsProps {
  user: any;
}

interface AnalyticsData {
  summary: {
    totalPosted: number;
    totalFailed: number;
    totalGenerated: number;
    successRate: number;
    uniqueAuthors: number;
  };
  daily: any[];
  strategyPerformance: {
    strategy: string;
    success: number;
    fail: number;
    total: number;
    successRate: number;
  }[];
  feedbackSummary: {
    good: number;
    bad: number;
    byStrategy: Record<string, { good: number; bad: number }>;
  };
  topAuthors: { name: string; count: number }[];
}

export function EngageAnalytics({ user }: EngageAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('30d');
  const [showStrategyDetail, setShowStrategyDetail] = useState(false);
  const [showDailyDetail, setShowDailyDetail] = useState(false);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user, period]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/engage-analytics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ period }),
        },
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setData(result);
    } catch {
      await fetchLocalAnalytics();
    } finally {
      setLoading(false);
    }
  }

  async function fetchLocalAnalytics() {
    try {
      const [totalRes, strategyRes, feedbackRes] = await Promise.all([
        supabase
          .from('engage_comments')
          .select('id,status,post_author,strategy_used,posted_at')
          .eq('user_id', user.id)
          .order('posted_at', { ascending: false })
          .limit(200),
        supabase
          .from('engage_comments')
          .select('strategy_used,status')
          .eq('user_id', user.id)
          .not('strategy_used', 'is', null),
        supabase
          .from('engage_feedback')
          .select('id,rating,strategy_used')
          .eq('user_id', user.id),
      ]);

      const comments = totalRes.data || [];
      const strategies = strategyRes.data || [];
      const feedback = feedbackRes.data || [];

      const posted = comments.filter(c => c.status === 'posted');
      const failed = comments.filter(c => c.status === 'failed');

      const stratPerfMap: Record<string, { success: number; fail: number; total: number }> = {};
      for (const s of strategies) {
        const key = s.strategy_used || 'unknown';
        if (!stratPerfMap[key]) stratPerfMap[key] = { success: 0, fail: 0, total: 0 };
        stratPerfMap[key].total++;
        if (s.status === 'posted') stratPerfMap[key].success++;
        else if (s.status === 'failed') stratPerfMap[key].fail++;
      }

      const authorCounts: Record<string, number> = {};
      for (const c of posted) {
        if (c.post_author) authorCounts[c.post_author] = (authorCounts[c.post_author] || 0) + 1;
      }

      const fbSummary: Record<string, { good: number; bad: number }> = {};
      let fbGood = 0, fbBad = 0;
      for (const f of feedback) {
        const key = f.strategy_used || 'unknown';
        if (!fbSummary[key]) fbSummary[key] = { good: 0, bad: 0 };
        if (f.rating === 'good') { fbGood++; fbSummary[key].good++; }
        else { fbBad++; fbSummary[key].bad++; }
      }

      setData({
        summary: {
          totalPosted: posted.length,
          totalFailed: failed.length,
          totalGenerated: comments.length,
          successRate: comments.length > 0 ? Math.round((posted.length / comments.length) * 100) : 0,
          uniqueAuthors: Object.keys(authorCounts).length,
        },
        daily: [],
        strategyPerformance: Object.entries(stratPerfMap).map(([strategy, stats]) => ({
          strategy,
          ...stats,
          successRate: stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0,
        })),
        feedbackSummary: { good: fbGood, bad: fbBad, byStrategy: fbSummary },
        topAuthors: Object.entries(authorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, count]) => ({ name, count })),
      });
    } catch {
      setData(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-teal-accent animate-spin" />
      </div>
    );
  }

  const summaryCards = data ? [
    { label: 'Total Posted', value: data.summary.totalPosted, icon: MessageCircle, color: 'text-teal-accent' },
    { label: 'Success Rate', value: `${data.summary.successRate}%`, icon: Activity, color: data.summary.successRate > 50 ? 'text-teal-accent' : 'text-yellow-400' },
    { label: 'Authors Engaged', value: data.summary.uniqueAuthors, icon: Users, color: 'text-teal-accent' },
    { label: 'Failed', value: data.summary.totalFailed, icon: TrendingUp, color: data.summary.totalFailed > 0 ? 'text-red-400' : 'text-teal-accent' },
  ] : [];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Period filter */}
      <div className="flex items-center gap-2">
        {['7d', '30d', '90d'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === p ? 'bg-teal-accent text-black' : 'bg-white/5 text-muted hover:text-white'
            }`}
          >
            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted text-sm italic">No analytics data available yet.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map(card => (
              <div key={card.label} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-teal-accent/10 rounded-xl flex items-center justify-center">
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="type-overline text-muted">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Feedback summary */}
          {data.feedbackSummary && (data.feedbackSummary.good > 0 || data.feedbackSummary.bad > 0) && (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-4 h-4 text-teal-accent" />
                <h3 className="text-white font-bold">Comment Feedback</h3>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-teal-accent" />
                  <span className="text-lg font-bold text-teal-accent">{data.feedbackSummary.good}</span>
                  <span className="text-xs text-muted">good</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-red-400" />
                  <span className="text-lg font-bold text-red-400">{data.feedbackSummary.bad}</span>
                  <span className="text-xs text-muted">bad</span>
                </div>
                <div className="text-xs text-muted">
                  {data.feedbackSummary.good + data.feedbackSummary.bad > 0
                    ? `${Math.round((data.feedbackSummary.good / (data.feedbackSummary.good + data.feedbackSummary.bad)) * 100)}% positive`
                    : 'No ratings yet'}
                </div>
              </div>
              {Object.keys(data.feedbackSummary.byStrategy).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(data.feedbackSummary.byStrategy).map(([strategy, { good, bad }]) => (
                    <div key={strategy} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-300 font-medium w-28 capitalize truncate">{strategy}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
                        {good + bad > 0 && (
                          <>
                            <div className="h-full bg-teal-accent" style={{ width: `${(good / (good + bad)) * 100}%` }} />
                            <div className="h-full bg-red-400/50" style={{ width: `${(bad / (good + bad)) * 100}%` }} />
                          </>
                        )}
                      </div>
                      <span className="text-muted w-16 text-right">{good}/{bad}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Strategy performance */}
          {data.strategyPerformance.length > 0 && (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
              <button
                onClick={() => setShowStrategyDetail(!showStrategyDetail)}
                className="flex items-center gap-2 w-full text-left"
              >
                <Zap className="w-4 h-4 text-teal-accent" />
                <h3 className="text-white font-bold flex-1">Strategy Performance</h3>
                {showStrategyDetail ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>
              {showStrategyDetail && (
                <div className="mt-4 space-y-3">
                  {data.strategyPerformance.map(({ strategy, success, fail, total, successRate }) => (
                    <div key={strategy}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium capitalize">{strategy}</span>
                        <span className="text-muted">{success}/{fail} ({successRate}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                        {total > 0 && (
                          <>
                            <div className="h-full bg-teal-accent" style={{ width: `${(success / total) * 100}%` }} />
                            <div className="h-full bg-red-400/50" style={{ width: `${(fail / total) * 100}%` }} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Daily activity (from edge function only) */}
          {data.daily.length > 0 && (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
              <button
                onClick={() => setShowDailyDetail(!showDailyDetail)}
                className="flex items-center gap-2 w-full text-left"
              >
                <Activity className="w-4 h-4 text-teal-accent" />
                <h3 className="text-white font-bold flex-1">Daily Activity</h3>
                {showDailyDetail ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>
              {showDailyDetail && (
                <div className="mt-4 space-y-1">
                  {data.daily.slice(-14).map((day: any) => (
                    <div key={day.date} className="flex items-center gap-3 text-xs">
                      <span className="text-muted w-20">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden flex">
                        {day.comments_posted > 0 && <div className="h-full bg-teal-accent" style={{ width: `${day.comments_posted * 10}%` }} />}
                        {day.comments_failed > 0 && <div className="h-full bg-red-400/50" style={{ width: `${day.comments_failed * 10}%` }} />}
                      </div>
                      <span className="text-muted w-12 text-right">{day.comments_posted || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Top authors */}
          {data.topAuthors.length > 0 && (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-teal-accent" />
                <h3 className="text-white font-bold">Top Authors Engaged</h3>
              </div>
              <div className="space-y-3">
                {data.topAuthors.map((author, i) => (
                  <div key={author.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-accent/10 flex items-center justify-center text-[10px] font-bold text-teal-accent">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-300 truncate max-w-[200px]">{author.name}</span>
                    </div>
                    <span className="text-xs text-muted font-bold">{author.count} comments</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily rollup streak */}
          {data.summary.totalGenerated > 0 && (
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-teal-accent" />
                <h3 className="text-white font-bold">Performance Summary</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{data.summary.totalGenerated}</p>
                  <p className="type-overline text-muted">Total Attempts</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-teal-accent">{data.summary.totalPosted}</p>
                  <p className="type-overline text-muted">Successful</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-400">{data.summary.totalFailed}</p>
                  <p className="type-overline text-muted">Failed</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{data.summary.successRate}%</p>
                  <p className="type-overline text-muted">Success Rate</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
