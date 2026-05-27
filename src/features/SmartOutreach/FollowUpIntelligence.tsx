import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Reply, Loader2, Check, Bookmark, Copy } from 'lucide-react';
import { generateFollowUp, generateStyleReport } from '../../services/aiService';

interface FollowUpProps {
  checkGenerationLimit: (feature: any) => boolean;
  trackEvent: (eventName: string, params?: any) => void;
  voicePosts: { content: string }[];
  profile: any;
  incrementUsage: (feature: any) => Promise<void>;
  showToast: (toastData: any) => void;
  setToast: React.Dispatch<React.SetStateAction<any>>;
  handleSave: (type: string, content: string, id: string) => Promise<void>;
  handleCopy: (text: string, id: string) => void;
  saving: string | null;
  copied: string | null;
  user?: any;
  onRequireAuth?: (feature: string, callback: () => void) => void;
}

export function FollowUpIntelligence({
  checkGenerationLimit,
  trackEvent,
  voicePosts,
  profile,
  incrementUsage,
  showToast,
  setToast,
  handleSave,
  handleCopy,
  saving,
  copied,
  user,
  onRequireAuth
}: FollowUpProps) {
  const [firstMessage, setFirstMessage] = useState('');
  const [scenario, setScenario] = useState('No reply after 5 days');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const scenarios = [
    'No reply after 5 days',
    'Profile view but no reply',
    'Replied with interest but went quiet',
    'Said not now',
    'Said not interested'
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user && onRequireAuth) {
      onRequireAuth('Follow-Up Intelligence', () => handleGenerate());
      return;
    }
    if (!checkGenerationLimit('smart_outreach')) return;

    trackEvent('generate_followup', { scenario });
    setLoading(true);
    setToast(null);

    try {
      let styleReport = null;
      if (voicePosts && voicePosts.length > 0) {
        styleReport = await generateStyleReport(voicePosts.map(p => p.content), profile || undefined);
      }
      const data = await generateFollowUp(scenario, firstMessage, styleReport);
      setDraft(data);
      await incrementUsage('smart_outreach');
    } catch (err) {
      showToast({ message: 'Generation failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-teal-accent/5 border border-teal-accent/20 rounded-2xl p-5 mb-6">
        <p className="text-[13px] text-teal-accent font-medium leading-relaxed">
          Follow-ups shouldn't just bump the thread. They should deliver micro-value, reignite curiosity, or gracefully pause the interaction based on exactly what happened.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">What was your initial message?</label>
          <textarea 
            required
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            placeholder="Paste the message you already sent them..."
            rows={3}
            className="input-field resize-none custom-scrollbar"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">What is the current situation?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {scenarios.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScenario(s)}
                className={`py-3 px-4 text-xs font-medium rounded-xl border text-left transition-all ${
                  scenario === s 
                  ? 'bg-teal-accent/10 border-teal-accent text-teal-accent' 
                  : 'bg-bg-secondary border-border-card text-muted hover:border-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button disabled={loading} className="w-full btn-gradient min-h-[48px]">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Writing follow-up...</span>
            </div>
          ) : (
            <>
              <Reply className="w-4 h-4" />
              <span>Generate Follow-Up</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {draft && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-[11px] md:text-sm font-semibold text-muted uppercase tracking-widest">Follow-Up Draft</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSave('Outreach', draft, 'save-fup')}
                  disabled={saving === 'save-fup'}
                  className="flex items-center gap-2 text-xs font-medium text-teal-accent hover:opacity-80 transition-colors disabled:opacity-50"
                >
                  {saving === 'save-fup' ? <Loader2 className="w-3 h-3 animate-spin" /> : (copied === 'save-fup' ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />)}
                  Save
                </button>
                <div className="w-[1px] h-4 bg-white/10" />
                <button 
                  onClick={() => handleCopy(draft, 'fup')}
                  className="flex items-center gap-2 text-xs font-medium text-teal-accent hover:opacity-80 transition-colors"
                >
                  {copied === 'fup' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
            </div>
            <div className="bg-bg-secondary border border-border-card p-5 md:p-6 rounded-2xl hover:border-teal-accent/30 transition-colors duration-300">
              <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{draft}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
