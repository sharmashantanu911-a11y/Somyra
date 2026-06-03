import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Loader2, Check, Bookmark, Copy, Sparkles } from 'lucide-react';
import { generateICPClarity } from '../../services/aiService';

interface ICPBuilderProps {
  checkGenerationLimit: (feature: any) => boolean;
  trackEvent: (eventName: string, params?: any) => void;
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

export function ICPBuilder({
  checkGenerationLimit,
  trackEvent,
  incrementUsage,
  showToast,
  setToast,
  handleSave,
  handleCopy,
  saving,
  copied,
  user,
  onRequireAuth
}: ICPBuilderProps) {
  const [form, setForm] = useState({ best: '', worst: '', unique: '' });
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user && onRequireAuth) {
      onRequireAuth('ICP Clarity', () => handleGenerate());
      return;
    }
    if (!checkGenerationLimit('smart_outreach')) return;

    trackEvent('generate_icp');
    setLoading(true);
    setToast(null);

    try {
      const data = await generateICPClarity(form.best, form.worst, form.unique);
      setDraft(data);
      await incrementUsage('smart_outreach');
    } catch (err) {
      showToast({ message: 'Failed to extract ICP. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-teal-accent/5 border border-teal-accent/20 rounded-2xl p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all">
         <div className="w-12 h-12 bg-teal-accent/10 rounded-full flex items-center justify-center shrink-0 border border-teal-accent/20 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
            <Target className="w-6 h-6 text-teal-accent" />
         </div>
         <div>
            <h3 className="text-white font-bold text-base mb-1.5">Stop Targeting Everyone</h3>
            <p className="type-sm text-muted leading-relaxed max-w-2xl">
              If your outreach applies to 1,000 people, it will resonate with no one. Answer these 3 questions using your own words, and we'll crystalize exactly who you should be dropping DMs to.
            </p>
         </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">1. Who is your best current/past client and why?</label>
          <textarea 
            required
            value={form.best}
            onChange={(e) => setForm({...form, best: e.target.value})}
            placeholder="e.g. A bootstrapped SaaS founder scaling past $1M ARR because they actually value speed."
            rows={2}
            className="input-field resize-none custom-scrollbar"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">2. Who do you never want to work with again and why?</label>
          <textarea 
            required
            value={form.worst}
            onChange={(e) => setForm({...form, worst: e.target.value})}
            placeholder="e.g. Enterprises. Too much bureaucracy, red tape, and design by committee."
            rows={2}
            className="input-field resize-none custom-scrollbar"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">3. What specific problem do you solve that others cannot?</label>
          <textarea 
            required
            value={form.unique}
            onChange={(e) => setForm({...form, unique: e.target.value})}
            placeholder="e.g. I can ship a fully production-ready MVP in under 14 days, not 6 months."
            rows={2}
            className="input-field resize-none custom-scrollbar"
          />
        </div>

        <button disabled={loading} className="w-full btn-gradient min-h-[48px]">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Crystallizing ICP...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Clarify My ICP</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {draft && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="type-overline font-semibold text-muted">Your True ICP</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSave('ICP', draft, 'save-icp')}
                  disabled={saving === 'save-icp'}
                  className="flex items-center gap-2 text-xs font-medium text-teal-accent hover:opacity-80 transition-colors disabled:opacity-50"
                >
                  {saving === 'save-icp' ? <Loader2 className="w-3 h-3 animate-spin" /> : (copied === 'save-icp' ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />)}
                  Save
                </button>
                <div className="w-[1px] h-4 bg-white/10" />
                <button 
                  onClick={() => handleCopy(draft, 'icp')}
                  className="flex items-center gap-2 text-xs font-medium text-teal-accent hover:opacity-80 transition-colors"
                >
                  {copied === 'icp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
            </div>
            <div className="bg-bg-secondary border border-border-card p-5 md:p-6 rounded-2xl hover:border-teal-accent/30 transition-colors duration-300">
               {/* The markdown response has formatting, so let's preserve the style */}
              <div className="type-sm text-slate-300 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                {draft}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
