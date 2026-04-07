import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Info, Loader2, Check, Bookmark, Copy, BarChart3 } from 'lucide-react';
import { generatePostThreeStep, analyzeTone, type SomyraProfileAnalysis } from '../services/aiService';
import { PostWriterLoading } from '../components/PostWriterLoading';
import { LinkedInPreview } from '../components/LinkedInPreview';

interface PostWriterProps {
  writerForm: { topic: string; style: string };
  setWriterForm: React.Dispatch<React.SetStateAction<{ topic: string; style: string }>>;
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
  isDeepMode: boolean;
  setIsDeepMode: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  isPro: boolean;
  isMax: boolean;
  setError: React.Dispatch<React.SetStateAction<any>>;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  usageLimits: any;
}

export function PostWriter({
  writerForm,
  setWriterForm,
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
  isDeepMode,
  setIsDeepMode,
  user,
  isPro,
  isMax,
  setError,
  setStats,
  usageLimits
}: PostWriterProps) {
  const [loading, setLoading] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'analyzing' | 'crafting' | 'refining' | 'completed'>('idle');
  const [showLinkedInPreview, setShowLinkedInPreview] = useState(false);
  const [analyzingTone, setAnalyzingTone] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const isGeneratingRef = React.useRef(false);

  const handleGeneratePost = async (e: React.FormEvent) => {
    e.preventDefault();
    // C4: Race condition guard
    if (isGeneratingRef.current) return;
    if (!checkGenerationLimit('post_writer')) return;

    trackEvent('generate_post');
    
    const controller = new AbortController();
    setAbortController(controller);
    
    setLoading(true);
    isGeneratingRef.current = true;
    setGenerationPhase('analyzing');
    setError(null);
    setToast(null);
    setResults((prev: any) => ({ ...prev, toneAnalysis: undefined, post: undefined }));
    setShowLinkedInPreview(false);
    
    let voiceSamplePosts: string[] = [];
    let profileContext: SomyraProfileAnalysis | null = null;
    try {
      voiceSamplePosts = voicePosts.map(p => p.content);
      profileContext = profile || null;
    } catch (err) {
      console.log(`Profile/Voice fetch error silently ignored: ${err}`);
    }

    try {
      const data = await generatePostThreeStep(
        writerForm.topic, 
        voiceSamplePosts, 
        profileContext,
        (phase) => setGenerationPhase(phase as any),
        isDeepMode,
        controller.signal
      );
      
      // C6: Only increment if we got a valid post (not an error string)
      const isSuccessful = data && typeof data === 'string' && data.trim().length > 20 && !data.startsWith('Generation failed');
      
      setGenerationPhase('completed');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setResults((prev: any) => ({ ...prev, post: data }));
      setStats((prev: any) => ({ ...prev, posts: prev.posts + 1 }));
      setToast(null);
      
      if (isSuccessful) {
        await incrementUsage('post_writer');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        console.log('Generation cancelled by user');
        return;
      }
      showToast({
        message: 'Failed to generate post. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
      setGenerationPhase('idle');
      setAbortController(null);
    }
  };

  const handleCancelGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
      setGenerationPhase('idle');
    }
  };

  const handleAnalyzeTone = async () => {
    if (!results.post) return;
    setAnalyzingTone(true);
    setError(null);
    setToast(null);

    let voiceSamplePosts: string[] = [];
    try {
      voiceSamplePosts = voicePosts.map(p => p.content);
    } catch (err) {
      console.log(`Voice profile fetch error silently ignored: ${err}`);
    }

    try {
      const data = await analyzeTone(results.post, voiceSamplePosts);
      setResults((prev: any) => ({ ...prev, toneAnalysis: data }));
      setToast(null);
    } catch (err) {
      showToast({
        message: 'Tone analysis failed. Please try again.',
        type: 'error'
      });
    } finally {
      setAnalyzingTone(false);
    }
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <PostWriterLoading 
          phase={generationPhase}
          isDeepMode={isDeepMode}
          voiceProfileWordCount={voicePosts.reduce((acc, post) => acc + post.content.split(/\s+/).length, 0)}
          onCancel={handleCancelGeneration}
        />
      ) : (
        <>
          <div className="section-heading">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Post Writer</h2>
              <p className="text-[13px] md:text-sm text-muted">Turn a simple idea into a high-engagement LinkedIn post.</p>
            </div>
            <div className="flex items-start gap-2 sm:gap-4">
              {voicePosts.length > 0 && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-accent/10 border border-teal-accent/20">
                  <div className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-teal-accent uppercase tracking-wider">Voice Active</span>
                </div>
              )}
              <GenerationCounter feature="post_writer" />
            </div>
          </div>

          <form onSubmit={handleGeneratePost} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Topic or Hook</label>
              <textarea 
                required
                value={writerForm.topic}
                onChange={(e) => setWriterForm({...writerForm, topic: e.target.value})}
                placeholder="What do you want to write about?"
                rows={3}
                className="input-field resize-none custom-scrollbar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Writing Style</label>
              <div className="flex flex-wrap gap-[6px] md:grid md:grid-cols-4 md:gap-3">
                {['storytelling', 'educational', 'controversial', 'personal'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setWriterForm({...writerForm, style})}
                    className={`px-2 py-1 min-[375px]:px-[10px] min-[375px]:py-[6px] md:px-4 md:py-2 rounded-full md:rounded-xl text-[10px] min-[375px]:text-[11px] md:text-xs font-medium border transition-all duration-300 ${
                      writerForm.style === style 
                      ? 'bg-teal-accent text-black border-transparent shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                      : 'bg-bg-secondary border-border-card text-muted hover:border-teal-accent/50'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-b border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium transition-colors ${(!user || (!isPro && !isMax)) ? 'text-white/40' : 'text-white'}`}>
                  Deep Mode
                </span>
                {(!user || (!isPro && !isMax)) && (
                  <span className="px-1.5 py-0.5 rounded bg-teal-accent/10 border border-teal-accent/20 text-[8px] font-bold text-teal-accent uppercase tracking-widest">
                    PRO
                  </span>
                )}
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-teal-accent/60 cursor-help group-hover:text-teal-accent transition-colors" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[10px] text-muted leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
                    Deep Mode adds an extra AI review pass to ensure maximum authenticity and human-like rhythm. Takes ~15s longer.
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  if (!user || (!isPro && !isMax)) {
                    showToast({
                      message: 'Upgrade to Pro or Max to unlock Deep Mode for maximum authenticity.',
                      type: 'error',
                      headline: 'Pro Feature'
                    });
                    return;
                  }
                  setIsDeepMode(!isDeepMode);
                }}
                className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                  isDeepMode 
                    ? 'bg-[#2DD4BF]/30 border border-[#2DD4BF]' 
                    : 'bg-[#2a2a2a] border border-white/5'
                } ${(!user || (!isPro && !isMax)) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <motion.div
                  animate={{ x: isDeepMode ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            <button 
              disabled={loading}
              className="w-full btn-gradient min-h-[48px]"
            >
              <PenTool className="w-4 h-4" />
              <span>Generate Post</span>
            </button>
          </form>

          <AnimatePresence mode="wait">
            {results.post && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pt-6 border-t border-white/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-[11px] md:text-sm font-semibold text-muted uppercase tracking-widest">Draft</h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button 
                      onClick={handleAnalyzeTone}
                      disabled={analyzingTone}
                      className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-teal-accent hover:opacity-80 transition-colors disabled:opacity-50"
                    >
                      {analyzingTone ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />}
                      Analyze Tone
                    </button>
                    <button 
                      onClick={() => handleSave('Post', results.post!, 'save-post')}
                      disabled={saving === 'save-post'}
                      className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-teal-accent hover:opacity-80 transition-colors disabled:opacity-50"
                    >
                      {saving === 'save-post' ? <Loader2 className="w-3 h-3 animate-spin" /> : (copied === 'save-post' ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />)}
                      {copied === 'save-post' ? 'Saved!' : 'Save Post'}
                    </button>
                    <button 
                      onClick={() => handleCopy(results.post!, 'post')}
                      className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-teal-accent hover:opacity-80 transition-colors"
                    >
                      {copied === 'post' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === 'post' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="bg-bg-secondary border border-border-card p-5 md:p-6 rounded-2xl hover:border-teal-accent/30 transition-colors duration-300">
                  <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {results.post}
                  </p>
                </div>

                <div className="flex justify-center flex-col items-center">
                  <button
                    onClick={() => setShowLinkedInPreview(!showLinkedInPreview)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2] text-[#0A66C2] rounded-full text-[13px] font-semibold hover:bg-[#0A66C2]/5 transition-all mt-2"
                  >
                    <span>{showLinkedInPreview ? 'Hide Preview' : 'Preview on LinkedIn'}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showLinkedInPreview && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <LinkedInPreview content={results.post!} user={user} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {results.toneAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-teal-accent/5 border border-teal-accent/20 rounded-2xl p-6 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-teal-accent" />
                        <h4 className="text-sm font-bold text-white">Tone Analysis</h4>
                      </div>
                      <span className="px-3 py-1 bg-teal-accent/10 border border-teal-accent/20 rounded-full text-[10px] font-bold text-teal-accent uppercase tracking-wider">
                        {results.toneAnalysis.tone}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
                        <Info className="w-3 h-3 text-teal-accent" />
                        Suggestions for Improvement
                      </div>
                      <ul className="space-y-2">
                        {results.toneAnalysis.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <div className="w-1 h-1 bg-teal-accent rounded-full mt-1.5 shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
