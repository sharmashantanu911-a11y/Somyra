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
  const [extActive, setExtActive] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const { data, error } = await supabase
          .from('engage_state')
          .select('connected,linkedin_tab_open,last_heartbeat')
          .eq('user_id', props.user.id)
          .maybeSingle();
        if (error) throw error;
        if (data?.connected && data.last_heartbeat && Date.now() - new Date(data.last_heartbeat).getTime() < 70000) {
          setExtConnected(true);
          setExtActive(!!data.linkedin_tab_open);
        } else {
          setExtConnected(false);
          setExtActive(false);
        }
      } catch { setExtConnected(false); }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [props.user.id]);

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
                  extActive ? 'text-teal-accent' : 'text-muted'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${extActive ? 'bg-teal-accent' : 'bg-gray-400'}`} />
                  {extActive ? 'Connected · Active' : 'Connected'}
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
