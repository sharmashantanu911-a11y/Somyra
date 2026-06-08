import React, { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle, Zap } from 'lucide-react';

type ConnectState = 'checking' | 'not_logged_in' | 'sending' | 'connected' | 'error';

export function EngageConnect() {
  const [state, setState] = useState<ConnectState>('checking');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const connect = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setState('not_logged_in');
          return;
        }

        setState('sending');

        const extensionId = window.__SOMYRA_EXTENSION_ID__;
        if (!extensionId) {
          setState('error');
          setErrorMsg('Extension not found. Make sure Somyra Engage is installed and enabled, then refresh this page.');
          return;
        }

        try {
          await chrome.runtime.sendMessage(extensionId, { type: 'SOMYRA_AUTH_TOKEN', token: session.access_token });
          setState('connected');
          setTimeout(() => window.close(), 2000);
        } catch {
          setState('error');
          setErrorMsg('Could not connect to the extension. Make sure it is installed and enabled.');
        }
      } catch (err: any) {
        setState('error');
        setErrorMsg(err.message || 'Something went wrong.');
      }
    };

    connect();
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

declare global {
  interface Window {
    __SOMYRA_EXTENSION_ID__?: string;
  }
}
