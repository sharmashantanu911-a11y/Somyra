import React, { useState, useEffect } from 'react';
import { Loader2, ThumbsUp, ThumbsDown, Filter, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EngageFeedbackProps {
  user: any;
}

interface FeedbackEntry {
  id: string;
  post_url: string;
  post_author: string;
  comment_text: string;
  strategy_used: string;
  rating: 'good' | 'bad';
  created_at: string;
}

export function EngageFeedback({ user }: EngageFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) fetchFeedback();
  }, [user]);

  async function fetchFeedback() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/engage-feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: 'get_feedback', limit: 100 }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setFeedback(data || []);
      } else {
        const { data } = await supabase
          .from('engage_feedback')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        setFeedback(data || []);
      }
    } catch {
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = feedback.filter(f => {
    if (filter !== 'all' && f.rating !== filter) return false;
    if (search && !f.post_author?.toLowerCase().includes(search.toLowerCase()) && !f.comment_text?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const goodCount = feedback.filter(f => f.rating === 'good').length;
  const badCount = feedback.filter(f => f.rating === 'bad').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-teal-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-teal-accent">
            <ThumbsUp className="w-4 h-4 inline mr-1" />{goodCount}
          </span>
          <span className="text-sm font-bold text-red-400">
            <ThumbsDown className="w-4 h-4 inline mr-1" />{badCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'good', 'bad'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-teal-accent text-black'
                  : 'bg-white/5 text-muted hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'good' ? '👍 Good' : '👎 Bad'}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search comments..."
            className="w-56 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-teal-accent/50"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <ThumbsUp className="w-6 h-6 text-muted/30" />
          </div>
          <p className="text-muted text-sm italic">No feedback yet. Rate your posted comments in the extension popup.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => (
            <div key={entry.id} className="flex items-start gap-3 px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl hover:border-white/10 transition-all">
              <div className="mt-0.5 shrink-0">
                {entry.rating === 'good'
                  ? <ThumbsUp className="w-4 h-4 text-teal-accent" />
                  : <ThumbsDown className="w-4 h-4 text-red-400" />
                }
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white">{entry.post_author}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    entry.rating === 'good' ? 'bg-teal-accent/10 text-teal-accent' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {entry.rating}
                  </span>
                  <span className="type-overline text-muted ml-auto">
                    {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{entry.comment_text}</p>
                {entry.strategy_used && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-muted uppercase">
                    {entry.strategy_used}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
