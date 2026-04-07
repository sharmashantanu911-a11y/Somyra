import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Check, Bookmark, Copy } from 'lucide-react';
import { generateTopics, generateStyleReport, type StyleReport, type SomyraProfileAnalysis } from '../services/aiService';

interface TopicGeneratorProps {
  topicForm: { profession: string; goals: string; audience: string };
  setTopicForm: React.Dispatch<React.SetStateAction<{ profession: string; goals: string; audience: string }>>;
  results: any;
  setResults: React.Dispatch<React.SetStateAction<any>>;
  checkGenerationLimit: (feature: any) => boolean;
  trackEvent: (eventName: string, params?: any) => void;
  voicePosts: { content: string }[];
  profile: SomyraProfileAnalysis | null;
  incrementUsage: (feature: any, count?: number) => Promise<void>;
  showToast: (toastData: any) => void;
  setToast: React.Dispatch<React.SetStateAction<any>>;
  GenerationCounter: React.ComponentType<{ feature?: 'profile_audit' | 'topic_generator' | 'post_writer' | 'smart_outreach' | 'bio_headline' | 'voice_profile' }>;
  handleSave: (type: string, content: string, id: string) => Promise<void>;
  handleCopy: (text: string, id: string) => void;
  saving: string | null;
  copied: string | null;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  usageLimits: any;
}

export function TopicGenerator({
  topicForm,
  setTopicForm,
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
  setStats,
  usageLimits
}: TopicGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'analyzing' | 'crafting' | 'completed'>('idle');
  const isGeneratingRef = React.useRef(false);

  const handleGenerateTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    // C4: Race condition guard — prevent double-submit
    if (isGeneratingRef.current) return;
    if (!checkGenerationLimit('topic_generator')) return;

    trackEvent('generate_topics');
    setLoading(true);
    isGeneratingRef.current = true;
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
      const data = await generateTopics(topicForm.profession, topicForm.goals, topicForm.audience, styleReport);
      // C6: Only update state and increment if we actually got topics
      if (data && data.length > 0) {
        setResults((prev: any) => ({ ...prev, topics: data }));
        setStats((prev: any) => ({ ...prev, topics: prev.topics + 1 }));
        setToast(null);
        // C5: Increment by actual number of topics generated (8), not 1
        await incrementUsage('topic_generator', data.length);
      } else {
        showToast({
          message: 'No topics were generated. Please try again.',
          type: 'error'
        });
      }
    } catch (err) {
      showToast({
        message: 'Failed to generate topics. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
      setGenerationPhase('idle');
    }
  };

  return (
    <div className="space-y-8">
      <div className="section-heading">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Topic Generator</h2>
          <p className="text-[13px] md:text-sm text-muted">Find your next viral post idea based on your expertise.</p>
        </div>
        <div className="flex items-start gap-2 sm:gap-4">
          {voicePosts.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-accent/10 border border-teal-accent/20">
              <div className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-pulse" />
              <span className="text-xs font-bold text-teal-accent uppercase tracking-wider">Voice Active</span>
            </div>
          )}
          <GenerationCounter feature="topic_generator" />
        </div>
      </div>
      
      <form onSubmit={handleGenerateTopics} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Profession</label>
          <input 
            required
            value={topicForm.profession}
            onChange={(e) => setTopicForm({...topicForm, profession: e.target.value})}
            placeholder="e.g. Senior Product Designer"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Target Audience</label>
          <input 
            required
            value={topicForm.audience}
            onChange={(e) => setTopicForm({...topicForm, audience: e.target.value})}
            placeholder="e.g. Tech Founders, Hiring Managers"
            className="input-field"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Goals</label>
          <textarea 
            required
            value={topicForm.goals}
            onChange={(e) => setTopicForm({...topicForm, goals: e.target.value})}
            placeholder="e.g. Build authority in AI design, get more inbound leads"
            rows={3}
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
                <Sparkles className="w-4 h-4" />
                <span>Generate Topics</span>
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {results.topics && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 pt-6 border-t border-white/5"
          >
            <h3 className="text-sm font-semibold text-muted uppercase tracking-widest">Generated Ideas</h3>
            <div className="grid gap-3">
              {results.topics.map((topic: string, i: number) => (
                <div key={i} className="group bg-bg-secondary border border-border-card p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-accent hover:shadow-[0_0_30px_rgba(45,212,191,0.05)] transition-all duration-300">
                  <p className="text-sm text-slate-200 flex-1 leading-relaxed">{topic}</p>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button 
                      onClick={() => handleSave('Topic', topic, `save-topic-${i}`)}
                      disabled={saving === `save-topic-${i}`}
                      className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 text-muted hover:text-teal-accent active:scale-90"
                    >
                      {saving === `save-topic-${i}` ? <Loader2 className="w-4 h-4 animate-spin" /> : (copied === `save-topic-${i}` ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />)}
                    </button>
                    <button 
                      onClick={() => handleCopy(topic, `topic-${i}`)}
                      className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 text-muted hover:text-teal-accent active:scale-90"
                    >
                      {copied === `topic-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
