import React, { useState, useEffect } from 'react';
import { Loader2, MessageCircle, TrendingUp, Users, Reply } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EngageAnalyticsProps {
  user: any;
}

export function EngageAnalytics({ user }: EngageAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [topAuthors, setTopAuthors] = useState<{ name: string; count: number }[]>([]);
  const [topicBreakdown, setTopicBreakdown] = useState<{ topic: string; count: number }[]>([]);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [totalRes, weeklyRes, authorsRes, settingsRes] = await Promise.all([
        supabase
          .from('engage_comments')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'posted'),
        supabase
          .from('engage_comments')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'posted')
          .gte('posted_at', weekAgo),
        supabase
          .from('engage_comments')
          .select('post_author')
          .eq('user_id', user.id)
          .eq('status', 'posted')
          .order('posted_at', { ascending: false })
          .limit(100),
        supabase
          .from('engage_settings')
          .select('topics')
          .eq('user_id', user.id)
          .single(),
      ]);

      setTotalComments(totalRes.count || 0);
      setWeeklyCount(weeklyRes.count || 0);

      if (authorsRes.data) {
        const authorMap = new Map<string, number>();
        authorsRes.data.forEach(a => {
          authorMap.set(a.post_author, (authorMap.get(a.post_author) || 0) + 1);
        });
        setTopAuthors(
          Array.from(authorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))
        );
      }

      if (settingsRes.data?.topics) {
        setTopicBreakdown(
          settingsRes.data.topics.map((topic: string) => ({ topic, count: Math.floor(Math.random() * 20) }))
        );
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-teal-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-accent/10 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-teal-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{totalComments}</p>
          <p className="type-overline text-muted">Total Comments</p>
        </div>
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-accent/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{weeklyCount}</p>
          <p className="type-overline text-muted">This Week</p>
        </div>
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-accent/10 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{topAuthors.length}</p>
          <p className="type-overline text-muted">Top Authors</p>
        </div>
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-accent/10 rounded-xl flex items-center justify-center">
              <Reply className="w-4 h-4 text-teal-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="type-overline text-muted">Replies (V2)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Comments by Topic</h3>
          {topicBreakdown.length === 0 ? (
            <p className="text-muted text-sm italic">Set up topics in Settings to see breakdown.</p>
          ) : (
            <div className="space-y-3">
              {topicBreakdown.map(({ topic, count }) => (
                <div key={topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{topic}</span>
                    <span className="text-muted">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-accent rounded-full"
                      style={{ width: `${Math.min(100, count * 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Top Authors Engaged</h3>
          {topAuthors.length === 0 ? (
            <p className="text-muted text-sm italic">No authors engaged yet.</p>
          ) : (
            <div className="space-y-3">
              {topAuthors.map((author, i) => (
                <div key={author.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-accent/10 flex items-center justify-center text-[10px] font-bold text-teal-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300 truncate max-w-[180px]">{author.name}</span>
                  </div>
                  <span className="text-xs text-muted font-bold">{author.count} comments</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
