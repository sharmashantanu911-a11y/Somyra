import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

type ExtensionState = 'checking' | 'not_installed' | 'installed_not_connected' | 'connected' | 'paused';

export function ExtensionStatusBanner() {
  const [state, setState] = useState<ExtensionState>('checking');
  const [todayCount, setTodayCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(25);

  useEffect(() => {
    const check = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setState('not_installed');
          return;
        }

        const { data: settings } = await supabase
          .from('engage_settings')
          .select('is_active')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (settings?.is_active) {
          setState('connected');
        } else {
          setState('installed_not_connected');
        }
      } catch {
        setState('not_installed');
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (state === 'checking') return null;

  const storeUrl = 'https://chrome.google.com/webstore/detail/somyra-engage';

  const banners: Record<ExtensionState, { icon: React.ReactNode; message: string; action?: { label: string; url?: string; onClick?: () => void }; color: string }> = {
    not_installed: {
      icon: <AlertCircle className="w-4 h-4" />,
      message: 'Install the Somyra Engage Chrome Extension to start auto-commenting on LinkedIn.',
      action: { label: 'Install Extension', url: storeUrl },
      color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    },
    installed_not_connected: {
      icon: <Zap className="w-4 h-4" />,
      message: 'Extension detected! Open the extension and connect your Somyra account.',
      action: { label: 'Connect Now', onClick: () => window.open('https://somyra.online/engage-connect', '_blank') },
      color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    },
    connected: {
      icon: <CheckCircle className="w-4 h-4" />,
      message: `Extension connected and active. ${todayCount}/${dailyLimit} comments posted today.`,
      color: 'bg-teal-accent/10 border-teal-accent/20 text-teal-accent',
    },
    paused: {
      icon: <Zap className="w-4 h-4" />,
      message: 'Auto-engage is paused. Resume from the extension popup.',
      color: 'bg-white/5 border-white/10 text-muted',
    },
    checking: {
      icon: null,
      message: '',
      color: '',
    },
  };

  const banner = banners[state];

  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border ${banner.color}`}>
      <div className="flex items-center gap-3">
        {banner.icon}
        <span className="text-sm font-medium">{banner.message}</span>
      </div>
      {banner.action && (
        <a
          href={banner.action.url}
          onClick={(e) => {
            if (banner.action?.onClick) {
              e.preventDefault();
              banner.action.onClick();
            }
          }}
          target={banner.action.url ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
        >
          {banner.action.label}
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
