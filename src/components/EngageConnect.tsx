import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Check, AlertCircle, Zap } from 'lucide-react';

type ConnectState = 'checking' | 'not_logged_in' | 'detecting' | 'sending' | 'connected' | 'error';

export function EngageConnect() {
  const [state, setState] = useState<ConnectState>('checking');
  const [errorMsg, setErrorMsg] = useState('');
  const tokenRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setState('not_logged_in');
        return;
      }

      tokenRef.current = session.access_token;
      setState('detecting');
    };
    init();

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;

      if (event.data?.type === 'SOMYRA_EXTENSION_DETECTED') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setState('sending');
        window.postMessage({ type: 'SOMYRA_AUTH_TOKEN', token: tokenRef.current }, '*');
      }

      if (event.data?.type === 'SOMYRA_EXTENSION_CONNECTED') {
        if (event.data.ok) {
          setState('connected');
          setTimeout(() => window.close(), 2000);
        } else {
          setState('error');
          setErrorMsg('Extension rejected the connection. Try refreshing.');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    timeoutRef.current = window.setTimeout(() => {
      if (state === 'detecting' || state === 'checking') {
        setState('error');
        setErrorMsg('Extension not found. Make sure Somyra Engage is installed and enabled, then refresh this page.');
      }
    }, 3000);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-[32px] p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-teal-accent/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-teal-accent" />
          </div>

          {state === 'checking' && (
            <div className="space-y-3">
              <Loader2 className="w-6 h-6 text-teal-accent animate-spin mx-auto" />
              <p className="text-white font-bold">Checking your session...</p>
            </div>
          )}

          {state === 'detecting' && (
            <div className="space-y-3">
              <Loader2 className="w-6 h-6 text-teal-accent animate-spin mx-auto" />
              <p className="text-white font-bold">Looking for Extension...</p>
              <p className="text-muted text-xs">Make sure Somyra Engage is installed</p>
            </div>
          )}

          {state === 'not_logged_in' && (
            <div className="space-y-4">
              <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
              <div>
                <p className="text-white font-bold mb-1">Not logged in</p>
                <p className="text-muted text-sm">Please sign in to Somyra first, then try connecting again.</p>
              </div>
              <a
                href="https://somyra.online"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm"
              >
                Go to Somyra
              </a>
            </div>
          )}

          {state === 'sending' && (
            <div className="space-y-3">
              <Loader2 className="w-6 h-6 text-teal-accent animate-spin mx-auto" />
              <p className="text-white font-bold">Connecting to Extension...</p>
              <p className="text-muted text-xs">Sending your session token to Somyra Engage</p>
            </div>
          )}

          {state === 'connected' && (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-teal-accent/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-teal-accent" />
              </div>
              <p className="text-white font-bold">Connected!</p>
              <p className="text-teal-accent text-sm">You can close this tab.</p>
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <div>
                <p className="text-white font-bold mb-1">Connection Failed</p>
                <p className="text-muted text-sm">{errorMsg}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
