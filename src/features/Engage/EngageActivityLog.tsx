import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle, XCircle, SkipForward, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EngageActivityLogProps {
  user: any;
}

const STATUS_FILTERS = ['all', 'posted', 'failed', 'skipped'] as const;

export function EngageActivityLog({ user }: EngageActivityLogProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchLogs();

    const channel = supabase
      .channel(`engage-comments-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'engage_comments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          if (payload.new) {
            setLogs((prev) => [payload.new, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchLogs = async () => {
    try {
      let query = supabase
        .from('engage_comments')
        .select('*')
        .eq('user_id', user.id)
        .order('posted_at', { ascending: false })
        .limit(50);

      const { data } = await query;
      setLogs(data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.status !== filter) return false;
    if (search && !log.post_author?.toLowerCase().includes(search.toLowerCase()) && !log.comment_text?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'posted': return <CheckCircle className="w-4 h-4 text-teal-accent" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'skipped': return <SkipForward className="w-4 h-4 text-muted" />;
      default: return null;
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
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-3 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f
                ? 'bg-teal-accent text-black'
                : 'bg-white/5 text-muted hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search authors or comments..."
            className="w-56 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-teal-accent/50"
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted text-sm italic">No activity found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl hover:border-white/10 transition-all">
              <div className="mt-0.5 shrink-0">{statusIcon(log.status)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white">{log.post_author}</span>
                  <span className="type-overline text-muted">
                    {new Date(log.posted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{log.comment_text}</p>
                {log.post_snippet && (
                  <p className="text-[10px] text-muted mt-0.5 truncate">Post: {log.post_snippet}</p>
                )}
              </div>
              {log.strategy_used && (
                <span className="text-[9px] text-muted font-bold uppercase shrink-0">{log.strategy_used}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
