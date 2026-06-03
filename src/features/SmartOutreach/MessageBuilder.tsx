import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Check, Bookmark, Copy, BarChart3, Info } from 'lucide-react';
import { generateSmartOutreach, scoreOutreachMessage, generateStyleReport } from '../../services/aiService';

interface MessageBuilderProps {
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

export function MessageBuilder({
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
}: MessageBuilderProps) {
  const [form, setForm] = useState({ target: '', researchContext: '', relationship: 'Cold', goal: '' });
  const [loading, setLoading] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'analyzing' | 'crafting' | 'scoring' | 'completed'>('idle');
  const [draft, setDraft] = useState<string | null>(null);
  const [score, setScore] = useState<any>(null);
  const isGeneratingRef = React.useRef(false);

  const relationships = [
    { id: 'Cold', label: 'Cold Outreach', desc: 'First time reaching out without interaction' },
    { id: 'Warm', label: 'Warm (Engaged)', desc: 'They post or engage with your content' },
    { id: 'Reconnect', label: 'Reconnect', desc: 'Spoke previously but went quiet' },
    { id: 'Referral', label: 'Referral', desc: 'Mutual connection exists' }
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user && onRequireAuth) {
      onRequireAuth('Message Builder', () => handleGenerate());
      return;
    }
    if (isGeneratingRef.current) return;
    if (!checkGenerationLimit('smart_outreach')) return;

    trackEvent('generate_smart_outreach', { relationship: form.relationship });
    setLoading(true);
    isGeneratingRef.current = true;
    setGenerationPhase('analyzing');
    setToast(null);
    setDraft(null);
    setScore(null);

    let styleReport = null;
    try {
      if (voicePosts && voicePosts.length > 0) {
        setGenerationPhase('analyzing');
        styleReport = await generateStyleReport(voicePosts.map(p => p.content), profile || undefined);
      }
    } catch (err) {}

    try {
      setGenerationPhase('crafting');
      const messageData = await generateSmartOutreach(
        form.target,
        form.researchContext,
        form.relationship,
        form.goal,
        styleReport
      );
      
      setDraft(messageData);

      setGenerationPhase('scoring');
      const scoreData = await scoreOutreachMessage(messageData);
      setScore(scoreData);

      await incrementUsage('smart_outreach');
    } catch (err) {
      showToast({ message: 'Generation failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
      setGenerationPhase('idle');
    }
  };

  const ScoreBadge = ({ label, value }: { label: string, value: string }) => {
    let colorClass = 'bg-slate-500/20 text-slate-400';
    if (value === 'Green') colorClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (value === 'Yellow') colorClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (value === 'Red') colorClass = 'bg-red-500/10 text-red-400 border border-red-500/20';
    
    return (
      <div className="flex flex-col items-center p-3 bg-bg-secondary rounded-xl border border-border-card">
        <span className="type-overline font-semibold text-muted mb-2">{label}</span>
        <div className={`px-3 py-1 rounded-full type-overline font-bold ${colorClass}`}>
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Target Prospect</label>
            <input 
              required
              value={form.target}
              onChange={(e) => setForm({...form, target: e.target.value})}
              placeholder="e.g. VP of Sales at Stripe"
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Goal of Message</label>
            <input 
              required
              value={form.goal}
              onChange={(e) => setForm({...form, goal: e.target.value})}
              placeholder="e.g. Schedule a 15 min discovery call"
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">Prospect Research Context</label>
            <span className="type-overline text-muted font-medium bg-white/5 px-2 py-0.5 rounded">Crucial</span>
          </div>
          <textarea 
            required
            value={form.researchContext}
            onChange={(e) => setForm({...form, researchContext: e.target.value})}
            placeholder="Paste their LinkedIn 'About' section, a recent post they wrote, or their company's core pain point..."
            rows={4}
            className="input-field resize-none custom-scrollbar"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Relationship Level</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {relationships.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => setForm({...form, relationship: rel.id})}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                  form.relationship === rel.id 
                  ? 'bg-teal-accent/10 border-teal-accent shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
                  : 'bg-bg-secondary border-border-card hover:border-teal-accent/50'
                }`}
              >
                <h4 className={`text-sm font-bold mb-1 ${form.relationship === rel.id ? 'text-teal-accent' : 'text-slate-300'}`}>{rel.label}</h4>
                <p className="type-overline text-muted leading-relaxed hidden sm:block">{rel.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          disabled={loading}
          className="w-full btn-gradient min-h-[48px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {generationPhase === 'analyzing' ? 'Analyzing research...' : 
                 generationPhase === 'crafting' ? 'Writing message...' : 'Scoring output...'}
              </span>
            </div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Smart Message</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {draft && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-6 border-t border-white/5"
          >
            {score && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  <BarChart3 className="w-4 h-4" /> Message Score
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <ScoreBadge label="Specificity" value={score.specificity} />
                  <ScoreBadge label="Length" value={score.length} />
                  <ScoreBadge label="Pitch Level" value={score.pitchLevel} />
                  <ScoreBadge label="Human Feel" value={score.humanFeel} />
                </div>
                <p className="text-xs text-muted bg-white/5 p-3 rounded-lg border border-white/10 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-teal-accent" />
                  {score.explanation}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="type-overline font-semibold text-muted">Final Draft</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSave('Outreach', draft, 'save-smartoutreach')}
                    disabled={saving === 'save-smartoutreach'}
                    className="flex items-center gap-2 text-xs font-medium text-teal-accent hover:opacity-80 transition-colors disabled:opacity-50"
                  >
                    {saving === 'save-smartoutreach' ? <Loader2 className="w-3 h-3 animate-spin" /> : (copied === 'save-smartoutreach' ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />)}
                    Save
                  </button>
                  <div className="w-[1px] h-4 bg-white/10" />
                  <button 
                    onClick={() => handleCopy(draft, 'smartoutreach')}
                    className="flex items-center gap-2 text-xs font-medium text-teal-accent hover:opacity-80 transition-colors"
                  >
                    {copied === 'smartoutreach' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-card p-5 md:p-6 rounded-2xl hover:border-teal-accent/30 transition-colors duration-300">
                <p className="type-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {draft}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
