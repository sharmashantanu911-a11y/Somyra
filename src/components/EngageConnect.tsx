import { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle, Zap, ExternalLink } from 'lucide-react';
import {
  listenForExtensionId,
  listenForSyncComplete,
  listenForExtensionConnected,
  connectToExtension,
  isExtensionInstalled,
} from '../lib/extension-bridge';

type ConnectState = 'checking' | 'detecting' | 'ready' | 'connecting' | 'connected' | 'error' | 'no_extension' | 'no_session';

export function EngageConnect() {
  const [state, setState] = useState<ConnectState>('checking');
  const [errorMsg, setErrorMsg] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [extensionId, setExtensionId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = listenForExtensionId((id) => {
      setExtensionId(id);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = listenForSyncComplete((data) => {
      if (data.settingsLoaded) {
        setState('connected');
        setDisplayName(data.displayName || '');
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = listenForExtensionConnected((data) => {
      setState('connected');
      setDisplayName(data.displayName || '');
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (extensionId) {
      setState('detecting');
      checkInstalledAndSession();
    }
  }, [extensionId]);

  async function checkInstalledAndSession() {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState('no_session');
        return;
      }

      const installed = await isExtensionInstalled();
      if (!installed) {
        setState('no_extension');
        return;
      }

      setState('ready');
    } catch {
      setState('no_session');
    }
  }

  async function handleConnect() {
    setState('connecting');
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState('no_session');
        return;
      }

      const displayName =
        session.user?.user_metadata?.full_name ||
        session.user?.user_metadata?.name ||
        session.user?.email?.split('@')[0] ||
        'User';

      const result = await connectToExtension(
        session.access_token,
        session.user.id,
        displayName
      );

      if (result.success) {
        setDisplayName(displayName);
      } else {
        setState('error');
        setErrorMsg(result.error || 'Extension rejected the connection.');
      }
    } catch (err: any) {
      setState('error');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  }

  const storeUrl = 'https://chrome.google.com/webstore/detail/somyra-engage';

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-[32px] p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-teal-accent/10 rounded-2xl flex items-center justify-center">
            {state === 'connected' ? (
              <Check className="w-8 h-8 text-teal-accent" />
            ) : (
              <Zap className="w-8 h-8 text-teal-accent" />
            )}
          </div>

          {(state === 'checking' || state === 'detecting') && (
            <div className="space-y-3">
              <Loader2 className="w-6 h-6 text-teal-accent animate-spin mx-auto" />
              <p className="text-white font-bold">
                {state === 'checking' ? 'Looking for Extension...' : 'Checking connection...'}
              </p>
              <p className="text-muted text-xs">Make sure the Somyra Engage extension is installed and enabled.</p>
            </div>
          )}

          {state === 'no_extension' && (
            <div className="space-y-4">
              <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
              <div>
                <p className="text-white font-bold mb-1">Extension Not Found</p>
                <p className="text-muted text-sm">
                  Install the Somyra Engage Chrome extension to connect.
                </p>
              </div>
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm"
              >
                Install Extension
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={checkInstalledAndSession}
                className="block w-full text-xs text-muted hover:text-white"
              >
                Already installed? Click to check again
              </button>
            </div>
          )}

          {state === 'no_session' && (
            <div className="space-y-4">
              <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
              <p className="text-white font-bold">Not Signed In</p>
              <p className="text-muted text-sm">
                Sign in to your Somyra account first, then return here to connect.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm"
              >
                Sign In
              </a>
            </div>
          )}

          {state === 'ready' && (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-teal-accent/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-teal-accent" />
              </div>
              <p className="text-white font-bold">Extension Detected</p>
              <p className="text-muted text-sm">
                Click below to connect your Somyra account to the extension.
              </p>
              <button
                onClick={handleConnect}
                className="w-full px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm hover:bg-teal-accent/80 transition-all"
              >
                Connect Now
              </button>
            </div>
          )}

          {state === 'connecting' && (
            <div className="space-y-3">
              <Loader2 className="w-6 h-6 text-teal-accent animate-spin mx-auto" />
              <p className="text-white font-bold">Connecting...</p>
              <p className="text-muted text-xs">Sending your session to the extension.</p>
            </div>
          )}

          {state === 'connected' && (
            <div className="space-y-3">
              <p className="text-white font-bold">Connected!</p>
              {displayName && (
                <p className="text-teal-accent text-sm font-medium">{displayName}</p>
              )}
              <p className="text-muted text-xs">
                Your extension is synced and ready. You can close this tab.
              </p>
              <button
                onClick={() => window.close()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm"
              >
                Close Tab
              </button>
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-white font-bold">Connection Failed</p>
              <p className="text-muted text-sm">{errorMsg}</p>
              <button
                onClick={handleConnect}
                className="w-full px-6 py-3 bg-teal-accent text-black font-bold rounded-xl text-sm hover:bg-teal-accent/80 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="block w-full text-xs text-muted hover:text-white"
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
