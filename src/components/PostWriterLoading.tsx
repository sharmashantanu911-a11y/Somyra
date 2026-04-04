import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Lightbulb, Check } from 'lucide-react';

interface PostWriterLoadingProps {
  phase: 'idle' | 'analyzing' | 'crafting' | 'refining' | 'completed';
  isDeepMode: boolean;
  voiceProfileWordCount: number;
  onCancel: () => void;
}

const insights = [
  "LinkedIn posts with 1,200 to 1,600 characters get the most engagement.",
  "The 'See More' button is your biggest hurdle. Hook them in the first 2 lines.",
  "Posts that share a personal failure or lesson perform 45% better than 'wins'.",
  "Tagging people only works if they comment. Otherwise, it hurts your reach.",
  "Carousels (PDFs) are currently the highest-reach format on the platform.",
  "Reply to every comment in the first 60 minutes to trigger the viral loop.",
  "Formatting matters. Use white space to make your post skimmable on mobile.",
  "Your 'About' section should be a sales page, not a resume."
];

export const PostWriterLoading: React.FC<PostWriterLoadingProps> = ({
  phase,
  isDeepMode,
  voiceProfileWordCount,
  onCancel
}) => {
  const [insightIndex, setInsightIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const insightInterval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 4000);

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(insightInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const getStatusMessage = (time: number) => {
    if (time <= 10) return "Analyzing your writing style";
    if (time <= 20) return "Building your voice profile";
    if (time <= 35) return "Crafting your post";
    if (time <= 50) return "Refining every word";
    return "Almost there — adding final touches";
  };

  useEffect(() => {
    if (voiceProfileWordCount > 0) {
      const duration = 2000; // 2 seconds to count up
      const increment = voiceProfileWordCount / (duration / 16);
      let current = 0;
      const counter = setInterval(() => {
        current += increment;
        if (current >= voiceProfileWordCount) {
          setWordCount(voiceProfileWordCount);
          clearInterval(counter);
        } else {
          setWordCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(counter);
    }
  }, [voiceProfileWordCount]);

  const getPhaseText = () => {
    switch (phase) {
      case 'analyzing': return "Getting inside your head...";
      case 'crafting': return "Writing in your voice...";
      case 'refining': return "Perfecting every word...";
      case 'completed': return "Post ready!";
      default: return "Processing...";
    }
  };

  const phases = isDeepMode ? ['analyzing', 'crafting', 'refining'] : ['analyzing', 'crafting'];
  const currentPhaseIndex = phases.indexOf(phase);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="relative w-full overflow-hidden rounded-[28px] border border-teal-accent/20 bg-[#0D0D0D] p-6 sm:p-8 lg:p-10"
    >
      {/* Deep Mode Indicator */}
      {isDeepMode && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-1.5 md:gap-2 px-1.5 py-0.5 min-[375px]:px-2 min-[375px]:py-0.5 md:px-3 md:py-1 bg-teal-accent/10 border border-teal-accent/20 rounded-full">
          <Zap className="w-[10px] h-[10px] md:w-3 md:h-3 text-teal-accent fill-teal-accent" />
          <span className="text-[9px] min-[375px]:text-[10px] md:text-[10px] font-bold text-teal-accent uppercase tracking-widest">Deep Mode Active</span>
        </div>
      )}

      <div className="mx-auto flex min-h-[460px] w-full max-w-[860px] flex-col justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute h-[60px] w-[60px] rounded-full border border-teal-accent/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute h-[44px] w-[44px] rounded-full border border-teal-accent/40"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-[28px] w-[28px] rounded-full border border-teal-accent bg-teal-accent/10"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-2 rounded-full bg-teal-accent shadow-[0_0_10px_#2DD4BF]"
            />
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-[30px]">
            {getPhaseText()}
          </h3>

          <div className="mt-5 flex items-center gap-3">
            {phases.map((p, i) => (
              <div key={p} className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    currentPhaseIndex >= i ? 'bg-teal-accent shadow-[0_0_8px_#2DD4BF]' : 'bg-white/10'
                  }`}
                />
                {i < phases.length - 1 && (
                  <div className={`h-[1px] w-10 ${currentPhaseIndex > i ? 'bg-teal-accent' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            {voiceProfileWordCount > 0 ? (
              <p className="text-sm font-medium text-muted sm:text-[15px]">
                Analyzing <span className="font-bold text-teal-accent">{wordCount}</span> words from your voice profile...
              </p>
            ) : (
              <p className="text-sm font-medium text-muted sm:text-[15px]">Crafting your post...</p>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={insightIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-teal-accent" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-accent/80">Pro tip</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300 sm:text-[15px]">
                    {insights[insightIndex]}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-accent animate-pulse" />
              Time elapsed
            </div>
            <p className="mt-3 text-3xl font-black text-white">{elapsedTime}s</p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-accent/70">
              {getStatusMessage(elapsedTime)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center lg:justify-end">
          <button
            onClick={onCancel}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[12px] font-bold text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 group"
          >
            <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Cancel generation
          </button>
        </div>
      </div>

      {/* Completion Overlay */}
      {phase === 'completed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 bg-teal-accent rounded-full flex items-center justify-center mb-4"
          >
            <Check className="w-8 h-8 text-black" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">Generation Complete</h3>
        </motion.div>
      )}
    </motion.div>
  );
};
