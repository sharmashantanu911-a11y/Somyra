import React, { useState, useEffect, useRef } from 'react';
import { Zap, AlertCircle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  listenForExtensionId,
  connectViaBridge,
  isExtensionInstalled,
  getCachedExtensionId,
  setCachedExtensionId,
} from '../../lib/extension-bridge';

type PillState = 'grey' | 'yellow' | 'green' | 'red';

export function ExtensionStatusBanner() {
  const [pill, setPill] = useState<PillState>('grey');
  const [message, setMessage] = useState('Checking...');
  const [displayName, setDisplayName] = useState('');
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const mountedRef = useRef(true);

  const storeUrl = 'https://chrome.google.com/webstore/detail/somyra-engage';

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const unsub = listenForExtensionId(() => {
      if (mountedRef.current) checkConnection();
    });
    return unsub;
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(() => {
      if (mountedRef.current) checkConnection();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  async function checkConnection() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setPill('grey');
        setMessage('Not signed in');
        return;
      }

      const { data, error } = await supabase
        .from('engage_config')
        .select('connected,last_heartbeat,linkedin_tab_open')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.connected) {
        const heartbeatAge = data.last_heartbeat ? Date.now() - new Date(data.last_heartbeat).getTime() : Infinity;
        if (heartbeatAge < 70000) {
          setPill('green');
          setLastSyncAt(Date.now());
          setMessage(data.linkedin_tab_open ? 'Connected and active' : 'Connected — waiting for LinkedIn');
          return;
        }
        setPill('red');
        setMessage('Connection lost — extension unreachable');
        return;
      }

      const installed = getCachedExtensionId() ? await isExtensionInstalled() : null;
      if (installed) {
        setPill('yellow');
        setMessage('Extension detected, connect your account');
      } else if (installed === null) {
        const { data: stateData } = await supabase
          .from('engage_config')
          .select('extension_id')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (stateData?.extension_id) {
          setCachedExtensionId(stateData.extension_id);
          const retry = await isExtensionInstalled();
          if (retry) {
            setPill('yellow');
            setMessage('Extension detected, connect your account');
          } else {
            setPill('grey');
            setMessage('Extension not installed');
          }
        } else {
          setPill('yellow');
          setMessage('Detecting extension...');
        }
      } else {
        setPill('grey');
        setMessage('Extension not installed');
      }
    } catch {
      if (getCachedExtensionId()) {
        setPill('red');
        setMessage('Connection lost');
      } else {
        setPill('yellow');
        setMessage('Detecting extension...');
      }
    }
  }

  async function handleConnect() {
    setConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setPill('yellow');
        setMessage('Please sign in first');
        setConnecting(false);
        return;
      }

      const name =
        session.user?.user_metadata?.full_name ||
        session.user?.user_metadata?.name ||
        session.user?.email?.split('@')[0] ||
        'User';

      const result = await connectViaBridge(session.access_token, session.user.id, name);
      if (result.success) {
        setPill('green');
        setDisplayName(name);
        setLastSyncAt(Date.now());
        setMessage('Connected');
      } else {
        setPill('red');
        setMessage(result.error || 'Connection failed');
      }
    } catch {
      setPill('red');
      setMessage('Connection failed');
    }
    setConnecting(false);
  }

  const pillConfig: Record<PillState, {
    bg: string; border: string; text: string; dot: string; icon: React.ReactNode;
  }> = {
    grey: {
      bg: 'bg-white/5', border: 'border-white/10', text: 'text-muted', dot: 'bg-gray-400',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    yellow: {
      bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    green: {
      bg: 'bg-teal-accent/10', border: 'border-teal-accent/20', text: 'text-teal-accent', dot: 'bg-teal-accent',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    red: {
      bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const cfg = pillConfig[pill];

  const syncText = lastSyncAt
    ? `Synced ${Math.floor((Date.now() - lastSyncAt) / 60000)}m ago`
    : '';

  if (pill === 'green') return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${cfg.bg} ${cfg.border}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
      <span className={`text-xs font-medium ${cfg.text} flex-1`}>
        {pill === 'green' && displayName ? `${displayName} — ` : ''}
        {message}
        {pill === 'green' && syncText && (
          <span className="text-muted ml-1">({syncText})</span>
        )}
      </span>

      {pill === 'grey' && (
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
        >
          Install
          <ExternalLink className="w-3 h-3" />
        </a>
      )}

      {pill === 'yellow' && (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-xs font-bold transition-all whitespace-nowrap disabled:opacity-50"
        >
          {connecting ? 'Connecting...' : 'Connect Now'}
        </button>
      )}

      {pill === 'red' && (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-all whitespace-nowrap disabled:opacity-50"
        >
          {connecting ? 'Connecting...' : 'Reconnect'}
        </button>
      )}
    </div>
  );
}