import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, Loader2, Check, Bookmark, Copy } from 'lucide-react';
import { generateBio, generateStyleReport, type StyleReport, type SomyraProfileAnalysis } from '../services/aiService';

interface BioGeneratorProps {
  bioForm: { role: string; skills: string; achievements: string; goal: string };
  setBioForm: React.Dispatch<React.SetStateAction<{ role: string; skills: string; achievements: string; goal: string }>>;
  results: any;
  setResults: React.Dispatch<React.SetStateAction<any>>;
  checkGenerationLimit: (feature: any) => boolean;
  trackEvent: (eventName: string, params?: any) => void;
  voicePosts: { content: string }[];
  profile: SomyraProfileAnalysis | null;
  incrementUsage: (feature: any) => Promise<void>;
  showToast: (toastData: any) => void;
  setToast: React.Dispatch<React.SetStateAction<any>>;
  GenerationCounter: React.ComponentType<{ feature?: string }>;
  handleSave: (type: string, content: string, id: string) => Promise<void>;
  handleCopy: (text: string, id: string) => void;
  saving: string | null;
  copied: string | null;
  usageLimits: any;
}

export function BioGenerator({
  bioForm,
  setBioForm,
  results,
  setResults,
  checkGenerationLimit,
  trackEvent,
  voicePosts,
  profile,
  incrementUsage,
  showToast,
  setToast,
  GenerationCounter,
  handleSave,
  handleCopy,
  saving,
  copied,
  usageLimits
}: BioGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'analyzing' | 'crafting' | 'completed'>('idle');

  const handleGenerateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkGenerationLimit('bio_headline')) return;

    trackEvent('generate_profile_content');
    setLoading(true);
    setGenerationPhase('analyzing');
    setToast(null);

    let styleReport: StyleReport | null = null;
    try {
      styleReport = await generateStyleReport(voicePosts.map(p => p.content), profile || undefined);
    } catch (err) {
      console.log(`Style report fetch error silently ignored: ${err}`);
    }

    try {
      setGenerationPhase('crafting');
      const data = await generateBio(bioForm.role, bioForm.skills, bioForm.achievements, bioForm.goal, styleReport);
      setResults((prev: any) => ({ ...prev, bio: data }));
      setToast(null);
      await incrementUsage('bio_headline');
    } catch (err) {
      showToast({
        message: 'Failed to generate bio and headline. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setGenerationPhase('idle');
    }
  };

  return (
    <div className="space-y-8">
      <div className="section-heading">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Bio & Headline</h2>
          <p className="type-sm text-muted">Optimize your profile to convert visitors into connections.</p>
        </div>
        <div className="flex items-start gap-2 sm:gap-4">
          {voicePosts.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-accent/10 border border-teal-accent/20">
              <div className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-pulse" />
              <span className="text-xs font-bold text-teal-accent uppercase tracking-wider">Voice Active</span>
            </div>
          )}
          <GenerationCounter feature="bio_headline" />
        </div>
      </div>

      <form onSubmit={handleGenerateBio} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Current Role</label>
          <input 
            required
            value={bioForm.role}
            onChange={(e) => setBioForm({...bioForm, role: e.target.value})}
            placeholder="e.g. Freelance Developer"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Primary Goal</label>
          <input 
            required
            value={bioForm.goal}
            onChange={(e) => setBioForm({...bioForm, goal: e.target.value})}
            placeholder="e.g. Attract high-ticket clients"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Key Skills</label>
          <textarea 
            required
            value={bioForm.skills}
            onChange={(e) => setBioForm({...bioForm, skills: e.target.value})}
            placeholder="e.g. React, Node.js, UI/UX Design"
            rows={2}
            className="input-field resize-none custom-scrollbar"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Achievements</label>
          <textarea 
            required
            value={bioForm.achievements}
            onChange={(e) => setBioForm({...bioForm, achievements: e.target.value})}
            placeholder="e.g. Built 10+ apps, 5 years experience"
            rows={2}
            className="input-field resize-none custom-scrollbar"
          />
        </div>
        <div className="md:col-span-2">
          <button 
            disabled={loading}
            className="w-full btn-gradient min-h-[48px]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {generationPhase === 'analyzing' ? 'Analyzing your style...' : 'Crafting your content...'}
                </span>
              </div>
            ) : (
              <>
                <UserCircle className="w-4 h-4" />
                <span>Generate Profile Content</span>
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {results.bio && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 pt-6 border-t border-white/5"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-widest">Headline Options</h3>
              <div className="grid gap-3">
                {results.bio.headlines.map((headline: string, i: number) => (
                  <div key={i} className="group bg-bg-secondary border border-border-card p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-accent hover:shadow-[0_0_30px_rgba(45,212,191,0.05)] transition-all duration-300">
                    <p className="text-sm text-slate-200 leading-relaxed">{headline}</p>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button 
                        onClick={() => handleSave('Headline', headline, `save-headline-${i}`)}
                        disabled={saving === `save-headline-${i}`}
                        className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 text-muted hover:text-teal-accent active:scale-90"
                      >
                        {saving === `save-headline-${i}` ? <Loader2 className="w-4 h-4 animate-spin" /> : (copied === `save-headline-${i}` ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />)}
                      </button>
                      <button 
                        onClick={() => handleCopy(headline, `headline-${i}`)}
                        className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 text-muted hover:text-teal-accent active:scale-90"
                      >
                        {copied === `headline-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="type-overline font-semibold text-muted">About Section</h3>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button 
                    onClick={() => handleSave('About', results.bio!.about, 'save-about')}
                    disabled={saving === 'save-about'}
                    className="flex items-center gap-2 type-overline font-medium text-teal-accent hover:opacity-80 transition-colors disabled:opacity-50"
                  >
                    {saving === 'save-about' ? <Loader2 className="w-3 h-3 animate-spin" /> : (copied === 'save-about' ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />)}
                    {copied === 'save-about' ? 'Saved!' : 'Save About'}
                  </button>
                  <button 
                    onClick={() => handleCopy(results.bio!.about, 'about')}
                    className="flex items-center gap-2 type-overline font-medium text-teal-accent hover:opacity-80 transition-colors"
                  >
                    {copied === 'about' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'about' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-card p-5 md:p-6 rounded-2xl hover:border-teal-accent/30 transition-colors duration-300">
                <p className="type-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {results.bio.about}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
