import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Save, Clock, Globe, PauseCircle, PlayCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EngageSettingsProps {
  user: any;
  showToast: (toast: any) => void;
  userContext: any;
  setUserContext: (ctx: any) => void;
}

export function EngageSettings({ user, showToast, userContext, setUserContext }: EngageSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [targetAccounts, setTargetAccounts] = useState<string[]>([]);
  const [newAccount, setNewAccount] = useState('');
  const [activeHoursStart, setActiveHoursStart] = useState(9);
  const [activeHoursEnd, setActiveHoursEnd] = useState(19);
  const [isActive, setIsActive] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('engage_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setTopics(data.topics || []);
        setTargetAccounts(data.target_accounts || []);
        setActiveHoursStart(data.active_hours_start ?? 9);
        setActiveHoursEnd(data.active_hours_end ?? 19);
        setIsActive(data.is_active ?? false);
        setReviewMode(data.review_mode ?? false);
      }
    } catch (err) {
      console.error('[Engage] Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('engage_settings')
        .upsert({
          user_id: user.id,
          topics,
          target_accounts: targetAccounts,
          active_hours_start: activeHoursStart,
          active_hours_end: activeHoursEnd,
          is_active: isActive,
          review_mode: reviewMode,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      showToast({ message: 'Settings saved — extension will pick up changes within 30s', type: 'success' });
    } catch (err: any) {
      showToast({ message: 'Failed to save settings', type: 'error', headline: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addTopic = () => {
    const trimmed = newTopic.trim().toLowerCase();
    if (!trimmed || topics.length >= 5) return;
    if (topics.includes(trimmed)) return;
    setTopics([...topics, trimmed]);
    setNewTopic('');
  };

  const removeTopic = (topic: string) => setTopics(topics.filter(t => t !== topic));

  const addAccount = () => {
    const trimmed = newAccount.trim();
    if (!trimmed || targetAccounts.length >= 10) return;
    const url = trimmed.startsWith('http') ? trimmed
      : trimmed.startsWith('www.') ? `https://${trimmed}`
      : trimmed.includes('linkedin.com') ? `https://${trimmed}`
      : `https://www.linkedin.com/in/${trimmed}`;
    setTargetAccounts([...targetAccounts, url]);
    setNewAccount('');
  };

  const removeAccount = (account: string) => setTargetAccounts(targetAccounts.filter(a => a !== account));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-teal-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Topics */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Topics to Engage On</h3>
          <span className="type-overline text-muted">{topics.length}/5</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => (
            <span key={topic} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-accent/10 border border-teal-accent/20 rounded-lg text-xs font-bold text-teal-accent">
              {topic}
              <button onClick={() => removeTopic(topic)} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTopic()}
            placeholder="Add a topic (e.g., SaaS, AI, growth)"
            maxLength={30}
            className="flex-1 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-accent/50"
          />
          <button
            onClick={addTopic}
            disabled={topics.length >= 5 || !newTopic.trim()}
            className="px-4 py-2.5 bg-teal-accent text-black font-bold rounded-xl text-xs hover:bg-teal-accent/80 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Accounts */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Target Accounts</h3>
          <span className="type-overline text-muted">{targetAccounts.length}/10</span>
        </div>
        <div className="space-y-2">
          {targetAccounts.map(account => (
            <div key={account} className="flex items-center justify-between px-4 py-2.5 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl">
              <span className="text-sm text-slate-300 truncate">{account}</span>
              <button onClick={() => removeAccount(account)} className="text-muted hover:text-red-400 transition-colors shrink-0 ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newAccount}
            onChange={e => setNewAccount(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addAccount()}
            placeholder="Paste LinkedIn URL or username"
            className="flex-1 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-accent/50"
          />
          <button
            onClick={addAccount}
            disabled={targetAccounts.length >= 10 || !newAccount.trim()}
            className="px-4 py-2.5 bg-teal-accent text-black font-bold rounded-xl text-xs hover:bg-teal-accent/80 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Hours */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-accent" />
          <h3 className="text-white font-bold">Active Hours</h3>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-muted text-sm font-medium">Start:</span>
            <input
              type="time"
              value={`${String(activeHoursStart).padStart(2, '0')}:00`}
              onChange={e => setActiveHoursStart(parseInt(e.target.value.split(':')[0]))}
              className="bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-accent/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted text-sm font-medium">End:</span>
            <input
              type="time"
              value={`${String(activeHoursEnd).padStart(2, '0')}:00`}
              onChange={e => setActiveHoursEnd(parseInt(e.target.value.split(':')[0]))}
              className="bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-teal-accent/50"
            />
          </div>
          <div className="flex items-center gap-1.5 text-muted text-xs">
            <Globe className="w-3 h-3" />
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </div>
        </div>
      </div>

      {/* Posting Mode */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-bold">Posting Mode</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl cursor-pointer hover:border-teal-accent/30 transition-all">
            <input
              type="radio"
              name="reviewMode"
              checked={!reviewMode}
              onChange={() => setReviewMode(false)}
              className="accent-teal-accent"
            />
            <div>
              <p className="text-sm font-bold text-white">Fully Autonomous</p>
              <p className="text-xs text-muted">AI selects best variant and posts automatically</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl cursor-pointer hover:border-teal-accent/30 transition-all">
            <input
              type="radio"
              name="reviewMode"
              checked={reviewMode}
              onChange={() => setReviewMode(true)}
              className="accent-teal-accent"
            />
            <div>
              <p className="text-sm font-bold text-white">Review Before Posting</p>
              <p className="text-xs text-muted">Comments go to queue for your approval first</p>
            </div>
          </label>
        </div>
      </div>

      {/* Toggle + Save */}
      <div className="flex items-center justify-between p-6 bg-[#141414] border border-[#1f1f1f] rounded-2xl">
        <div className="flex items-center gap-3">
          {isActive ? (
            <button onClick={() => setIsActive(false)} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all">
              <PauseCircle className="w-4 h-4" /> Pause
            </button>
          ) : (
            <button onClick={() => setIsActive(true)} className="flex items-center gap-2 px-4 py-2.5 bg-teal-accent/10 border border-teal-accent/20 text-teal-accent rounded-xl text-xs font-bold hover:bg-teal-accent/20 transition-all">
              <PlayCircle className="w-4 h-4" /> Activate
            </button>
          )}
          <span className={`text-sm font-medium ${isActive ? 'text-teal-accent' : 'text-muted'}`}>
            {isActive ? 'Active — engaging on LinkedIn' : 'Inactive — not posting'}
          </span>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-accent text-black font-bold rounded-xl text-xs hover:bg-teal-accent/80 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
