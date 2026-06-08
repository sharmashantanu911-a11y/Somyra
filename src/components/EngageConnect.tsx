import { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle, Zap } from 'lucide-react';

type ConnectState = 'checking' | 'connected' | 'error';

export function EngageConnect() {
  const [state, setState] = useState<ConnectState>('checking');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();

        setState(session?.access_token ? 'connected' : 'error');
        setErrorMsg(session?.access_token
          ? ''
          : 'You are not logged in. Sign in to Somyra and try again.'
        );
      } catch (err: any) {
        if (!cancelled) {
          setState('error');
          setErrorMsg(err.message || 'Something went wrong.');
        }
      }
    };

    check();

    const interval = setInterval(check, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
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
              <p className="text-white font-bold">Waiting for Extension...</p>
              <p className="text-muted text-xs">The Somyra Engage extension will handle the connection automatically.</p>
              <p className="text-muted text-xs">
                Open the browser console (F12) to check for <span className="text-teal-accent">[Somyra Engage]</span> logs.
              </p>
            </div>
          )}

          {state === 'connected' && (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-teal-accent/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-teal-accent" />
              </div>
              <p className="text-white font-bold">Session Active</p>
              <p className="text-teal-accent text-sm">The extension should connect automatically. If not, refresh the page.</p>
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
              <div>
                <p className="text-white font-bold mb-1">Waiting for Connection</p>
                <p className="text-muted text-sm">
                  {errorMsg}
                  {' '}If you have the Somyra Engage extension installed, the connection happens automatically.
                  Make sure the extension is enabled and has permission to access somyra.online.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
