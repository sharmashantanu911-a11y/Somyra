import React, { useState, useEffect } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EngageQueueProps {
  user: any;
}

export function EngageQueue({ user }: EngageQueueProps) {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchRecentComments();

    const channel = supabase
      .channel('engage-queue-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'engage_comments',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchRecentComments(),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchRecentComments = async () => {
    try {
      const { data } = await supabase
        .from('engage_comments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'posted')
        .order('posted_at', { ascending: false })
        .limit(10);

      setQueue(data || []);
    } catch {
      setQueue([]);
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
    <div className="space-y-4 max-w-3xl">
      <p className="type-sm text-muted">
        Comments awaiting posting will appear here. At the moment, you can review your recently posted comments.
        Queue preview with edit/delete will be available once the extension submits items via Supabase sync.
      </p>

      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-muted/30" />
          </div>
          <p className="text-muted text-sm italic max-w-xs">No comments posted yet. Set up your topics and activate the extension.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((item) => (
            <div key={item.id} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-5 space-y-3 hover:border-teal-accent/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white truncate">{item.post_author}</span>
                    <span className="px-1.5 py-0.5 bg-teal-accent/10 rounded text-[9px] font-bold text-teal-accent uppercase">
                      {item.status}
                    </span>
                    <span className="type-overline text-muted ml-auto shrink-0">
                      {item.posted_at ? new Date(item.posted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  {item.post_snippet && (
                    <p className="text-xs text-muted truncate mb-2">{item.post_snippet}</p>
                  )}
                  <div className="p-3 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl">
                    <p className="text-sm text-slate-300 leading-relaxed">{item.comment_text}</p>
                  </div>
                  {item.strategy_used && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold text-muted uppercase">
                      Strategy: {item.strategy_used}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
