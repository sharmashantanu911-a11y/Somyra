import React, { useState, useEffect } from 'react';
import { Zap, Settings, ListOrdered, Activity, BarChart3, MessageCircle } from 'lucide-react';
import { EngageSettings } from './EngageSettings';
import { EngageQueue } from './EngageQueue';
import { EngageActivityLog } from './EngageActivityLog';
import { EngageAnalytics } from './EngageAnalytics';
import { ExtensionStatusBanner } from './ExtensionStatusBanner';
import { EngageDebugPanel } from './EngageDebugPanel';
import { supabase } from '../../lib/supabase';

interface EngageProps {
  user: any;
  isMax: boolean;
  isPro: boolean;
  showToast: (toast: any) => void;
  trackEvent: (name: string, params?: any) => void;
  usageLimits: any;
}

const ENGAGE_SUB_TABS = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'queue', label: 'Queue', icon: ListOrdered },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const;

type EngageSubTab = typeof ENGAGE_SUB_TABS[number]['id'];

export function Engage(props: EngageProps) {
  const [activeTab, setActiveTab] = useState<EngageSubTab>('settings');
  const [userContext, setUserContext] = useState<any>(null);
  const [extConnected, setExtConnected] = useState(false);

  const [extIsActive, setExtIsActive] = useState(false);
  const [extLastSync, setExtLastSync] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'SOMYRA_ENGAGE_PRESENT') {
        const extensionId = event.data.extensionId;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('engage_config').upsert({
            key: session.user.id,
            value: '',
            user_id: session.user.id,
            extension_id: extensionId,
            last_detected: new Date().toISOString(),
            connected: true,
          });
          setExtConnected(true);
        }
        window.postMessage({ type: 'SOMYRA_CONNECTION_CONFIRMED' }, window.location.origin);
      }
    };
    window.addEventListener('message', handleMessage);

    setTimeout(() => {
      window.postMessage({ type: 'SOMYRA_DASHBOARD_READY' }, window.location.origin);
    }, 100);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!props.user?.id) return;

    const checkConnection = async () => {
      try {
        const { data } = await supabase
          .from('engage_config')
          .select('connected,last_sync,is_active,extension_id')
          .eq('user_id', props.user.id)
          .maybeSingle();

        if (data?.connected && data?.extension_id) {
          setExtConnected(true);
          setExtIsActive(!!data.is_active);
          setExtLastSync(data.last_sync);
        } else {
          setExtConnected(false);
          setExtIsActive(false);
          setExtLastSync(null);
        }
      } catch {
        setExtConnected(false);
        setExtIsActive(false);
        setExtLastSync(null);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [props.user?.id]);

  useEffect(() => {
    if (!props.user?.id) return;

    const channel = supabase
      .channel('engage-config-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'engage_config',
          filter: `user_id=eq.${props.user.id}`,
        },
        (payload) => {
          const data = payload.new as any;
          if (data?.connected) {
            setExtConnected(true);
            setExtIsActive(!!data.is_active);
            setExtLastSync(data.last_sync);
          } else {
            setExtConnected(false);
            setExtIsActive(false);
            setExtLastSync(null);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [props.user?.id]);

  if (!props.isMax && !props.isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 px-4">
        <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center">
          <Zap className="w-8 h-8 text-teal-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Upgrade to Engage</h2>
          <p className="text-muted text-sm max-w-xs">Signal Engage is available on Pro and Max plans. Upgrade to auto-engage on LinkedIn with your authentic voice.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="section-heading">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-accent/10 rounded-xl">
            <Zap className="w-5 h-5 text-teal-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">Signal Engage</h2>
              <span className="type-overline font-bold bg-teal-accent/10 text-teal-accent px-2 py-0.5 rounded border border-teal-accent/20">
                {props.isMax ? 'MAX' : 'PRO'}
              </span>
              {extConnected && (
                <span className={`ml-auto flex items-center gap-1 text-xs font-medium ${
                  extIsActive ? 'text-teal-accent' : 'text-muted'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${extIsActive ? 'bg-teal-accent' : 'bg-gray-400'}`} />
                  {extIsActive ? 'Connected · Active' : 'Connected'}
                </span>
              )}
            </div>
            <p className="type-sm text-muted">Auto-engage on LinkedIn with AI comments in your voice.</p>
          </div>
        </div>
      </div>

      <ExtensionStatusBanner />

      <div className="flex border-b border-border-card overflow-x-auto custom-scrollbar no-scrollbar-mobile pb-1">
        {ENGAGE_SUB_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-teal-accent text-teal-accent'
                : 'border-transparent text-muted hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeTab === 'settings' && <EngageSettings {...props} userContext={userContext} setUserContext={setUserContext} />}
        {activeTab === 'queue' && <EngageQueue {...props} />}
        {activeTab === 'activity' && <EngageActivityLog {...props} />}
        {activeTab === 'analytics' && <EngageAnalytics {...props} />}
      </div>

      <EngageDebugPanel />
    </div>
  );
}
