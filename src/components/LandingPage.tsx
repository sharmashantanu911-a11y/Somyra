import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  UserCircle,
  MessageSquare,
  PenTool,
  Search,
  Sparkles,
  Send,
  Mic,
  Bookmark,
  Check,
  X,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Globe,
  Shield,
  Zap,
  Target,
  ArrowRight,
  Crown,
  ChevronDown,
  Loader2,
  Lock
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */
interface LandingPageProps {
  setActiveTab: (tab: any) => void;
  setShowAuth: (show: boolean) => void;
  setShowPricingModal: (show: boolean) => void;
  testimonials: any[];
  loadingTestimonials: boolean;
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  user: any;
}

interface FeatureTabData {
  id: string;
  label: string;
  tag: string;
  title: string;
  body: string;
  dots: string[];
  icon: React.ComponentType<{ className?: string }>;
}

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const featureTabs: FeatureTabData[] = [
  {
    id: 'post-writer',
    label: 'Post Writer',
    tag: 'CONTENT FACTORY',
    title: 'Posts that actually sound like you',
    body: 'Tell Somyra what you want to write about. Choose your style. Hit generate. Get a post that sounds like your best writing on your best day. Every time.',
    dots: [
      'Storytelling, Educational, Controversial and Personal styles',
      'Deep Mode for maximum authenticity',
      'Voice Profile integration for Pro users',
      'LinkedIn post preview before you publish'
    ],
    icon: PenTool
  },
  {
    id: 'profile-analysis',
    label: 'Profile Analysis',
    tag: 'PERSONAL BRAND',
    title: 'Know exactly what is killing your profile',
    body: 'Paste your About and Experience. Get a surgical audit of every element hurting your visibility and credibility. Then get the exact rewrite to fix it.',
    dots: [
      'Quick Audit for fast wins',
      'Deep Strategy for full transformation',
      'Headline, About and positioning fixes',
      'Actionable roadmap not vague suggestions'
    ],
    icon: UserCircle
  },
  {
    id: 'topic-generator',
    label: 'Topic Generator',
    tag: 'CONTENT FACTORY',
    title: 'Five post ideas in 20 seconds',
    body: 'Tell us your niche, your audience, and your goals. Get five story driven post topics tailored to what your specific audience actually engages with.',
    dots: [
      'Niche specific not generic ideas',
      'Based on real LinkedIn engagement patterns',
      'Saves to your library for later',
      'Refreshes every time you generate'
    ],
    icon: Sparkles
  },
  {
    id: 'smart-outreach',
    label: 'Smart Outreach',
    tag: 'SALES AND OUTREACH',
    title: 'DMs that get real replies',
    body: 'Paste what you know about your prospect. Get a message that references their actual work, speaks to their real pain, and feels like you spent an hour researching them. Because Somyra did.',
    dots: [
      'Message Builder with prospect context',
      'Follow Up Intelligence sequence generator',
      'CRM Tracker for pipeline management',
      'ICP Clarity to find your ideal buyer',
      'Templates library for fast execution'
    ],
    icon: Send
  },
  {
    id: 'voice-profile',
    label: 'Voice Profile',
    tag: 'PRO FEATURE',
    title: 'The AI that writes like you not like AI',
    body: 'Add your best posts. Somyra studies how you structure ideas, what words you use, how you open and close. Every generation after that sounds unmistakably like you.',
    dots: [
      'Add 3 to 10 sample posts',
      'Gets sharper with every use',
      'Works across all features',
      'The reason Pro users never go back'
    ],
    icon: Mic
  },
  {
    id: 'saved-library',
    label: 'Saved Library',
    tag: 'PRO FEATURE',
    title: 'Your personal content vault',
    body: 'Every post, DM, and audit you generate can be saved. Build a library of your best work. Repurpose it. Reference it. Never start from zero again.',
    dots: [
      'Save anything from any feature',
      'Organize and search your library',
      'Up to 200 saves for Pro users',
      'Access across all devices'
    ],
    icon: Bookmark
  }
];

const faqData = [
  {
    q: 'Is this just another AI writing tool?',
    a: 'No. Every AI writing tool gives you generic output because it knows nothing about you. Somyra learns your actual voice from your real posts, understands your niche from your profile, and writes content that sounds like you on your best day. The output is so specific to you that your audience will not be able to tell the difference.'
  },
  {
    q: 'What if I have never posted on LinkedIn?',
    a: 'Then this is exactly where you start. Profile Analysis tells you what to fix first. Topic Generator gives you ideas immediately. Post Writer helps you find your voice. You do not need existing content to get value from Somyra. You just need to show up.'
  },
  {
    q: 'How is Voice Profile different from just prompting ChatGPT with my writing style?',
    a: 'ChatGPT forgets everything the moment you close the tab. Voice Profile saves your style permanently. Every feature across Somyra pulls from it automatically. You set it once and every generation sounds like you from that point forward. No prompting. No explaining yourself every single time.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No questions, no friction, no cancellation fees. Cancel from your account settings in under 10 seconds. We would rather earn your subscription every month than trap you into one.'
  },
  {
    q: 'Who is Somyra built for?',
    a: 'Founders, executives, consultants, and sales professionals who know LinkedIn is important but cannot show up consistently because creating content takes too long and hiring a ghostwriter costs too much. If you have ever closed a tab because you did not know what to write, Somyra was built for you.'
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'You will see a clear counter throughout the app so you always know where you stand. When you hit your limit you can upgrade to Pro instantly or wait for the monthly reset. No surprise charges. Ever.'
  }
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.3em] text-[#2DD4BF] mb-5 md:mb-7">{children}</p>
);

const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`w-full text-[28px] md:text-[40px] lg:text-[52px] font-extrabold text-white leading-[1.1] tracking-tight ${className}`}>
    {children}
  </h2>
);

/* ─────────────────────────────────────────────
   FAQ ACCORDION ITEM
   ───────────────────────────────────────────── */
const FaqItem = ({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) => (
  <div className="border-b border-white/5">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-6 md:py-7 text-left gap-4 group"
    >
      <span className="text-[15px] md:text-lg font-bold text-white group-hover:text-[#2DD4BF] transition-colors leading-relaxed">{q}</span>
      <div className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#2DD4BF]/30 transition-colors">
        {isOpen ? <Minus className="w-4 h-4 text-[#2DD4BF]" /> : <Plus className="w-4 h-4 text-[#555]" />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="pb-7 text-[15px] md:text-base text-[#A0A0A0] leading-[1.8] max-w-3xl">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ─────────────────────────────────────────────
   PRICING CARD
   ───────────────────────────────────────────── */
const PricingCard = ({
  name,
  monthlyPrice,
  annualPrice,
  annualBilling,
  savings,
  subtext,
  badge,
  features,
  excluded,
  buttonLabel,
  buttonStyle,
  cardStyle,
  isAnnual,
  onClick
}: {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  annualBilling: string;
  savings: string;
  subtext: string;
  badge?: string;
  features: string[];
  excluded?: string[];
  buttonLabel: string;
  buttonStyle: string;
  cardStyle: string;
  isAnnual: boolean;
  onClick: () => void;
}) => (
  <div className={`relative flex flex-col rounded-3xl p-5 md:p-7 transition-all duration-300 hover:scale-[1.01] border h-full group ${
    name === 'Pro' ? 'border-2 border-teal-accent bg-[#0A1A19]/40 shadow-[0_0_50px_rgba(45,212,191,0.05)]' : 
    name === 'Max' ? 'border border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-500/50' : 
    'border-white/5 bg-white/[0.02] hover:border-white/10'
  } ${cardStyle}`}>
    {badge && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg z-20">
        <div className={`rounded-full px-3 py-0.5 ${
          name === 'Max' ? 'bg-gradient-to-r from-amber-400 to-orange-600 text-white shadow-amber-500/20' : 
          'bg-teal-accent text-black shadow-teal-accent/20'
        }`}>
          {badge}
        </div>
      </div>
    )}
    
    <div className="mb-6 text-left">
      <span className={`text-[10px] font-bold tracking-[2px] uppercase ${
        name === 'Pro' ? 'text-teal-accent' : 
        name === 'Max' ? 'text-amber-500' : 'text-[#888888]'
      }`}>{name === 'Free' ? 'FREE' : name === 'Pro' ? 'PRO' : 'MAX'}</span>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[32px] md:text-[44px] font-black text-white">{isAnnual ? annualPrice : monthlyPrice}</span>
        <span className="text-[13px] text-[#555555]">/mo</span>
      </div>
      {isAnnual && annualBilling && (
        <div className="mt-1">
          <p className={`text-[11px] font-bold ${name === 'Pro' ? 'text-teal-accent' : name === 'Max' ? 'text-amber-500' : 'text-muted'}`}>{annualBilling} {savings && <span className="opacity-60 text-[10px] font-normal italic ml-1">({savings})</span>}</p>
        </div>
      )}
      <p className="mt-3 text-[13px] text-[#888888] leading-relaxed font-medium">{subtext}</p>
    </div>

    <div className="space-y-4 mb-8 flex-grow">
      {name === 'Free' && <p className="text-[10px] font-bold text-[#555555] tracking-[2px] uppercase">INCLUDES</p>}
      <ul className="space-y-3 mt-4">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-[12px] leading-snug text-white/90">
            {name === 'Free' ? (
              <Check className="w-3.5 h-3.5 text-teal-accent mt-0.5 shrink-0" />
            ) : (
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                name === 'Max' ? 'bg-amber-500/20' : 'bg-teal-accent/20'
              }`}>
                <Check className={`w-3 h-3 ${name === 'Max' ? 'text-amber-500' : 'text-teal-accent'}`} />
              </div>
            )}
            {f}
          </li>
        ))}
      </ul>
    </div>

    <button 
      onClick={onClick}
      className={`w-full py-4 rounded-2xl text-[14px] font-black transition-all transform hover:scale-[1.02] active:scale-100 shadow-xl ${
        name === 'Pro' ? 'bg-teal-accent text-black hover:shadow-teal-accent/40' : 
        name === 'Max' ? 'bg-gradient-to-r from-amber-400 to-orange-600 text-white hover:shadow-amber-500/30' : 
        'border border-white/10 text-white hover:bg-white/[0.03]'
      }`}
    >
      {buttonLabel}
    </button>
  </div>
);


/* ─────────────────────────────────────────────
   MAIN LANDING PAGE COMPONENT
   ───────────────────────────────────────────── */
export function LandingPage({
  setActiveTab,
  setShowAuth,
  setShowPricingModal,
  testimonials,
  loadingTestimonials,
  showReviewModal,
  setShowReviewModal,
  user
}: LandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('post-writer');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [bottomBarDismissed, setBottomBarDismissed] = useState(() => {
    return localStorage.getItem('somyra_bottom_bar_dismissed') === 'true';
  });

  const activeFeature = featureTabs.find(f => f.id === activeFeatureTab) || featureTabs[0];

  // Scroll-triggered bottom bar
  useEffect(() => {
    if (bottomBarDismissed || user) return;

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.6) {
        setShowBottomBar(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bottomBarDismissed, user]);

  const dismissBottomBar = () => {
    setShowBottomBar(false);
    setBottomBarDismissed(true);
    localStorage.setItem('somyra_bottom_bar_dismissed', 'true');
  };

  const scrollToHero = () => {
    const hero = document.getElementById('landing-hero');
    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    // Briefly highlight the Start Free button
    setTimeout(() => {
      const btn = document.getElementById('hero-start-free');
      if (btn) {
        btn.classList.add('ring-4', 'ring-teal-accent/50');
        setTimeout(() => btn.classList.remove('ring-4', 'ring-teal-accent/50'), 2000);
      }
    }, 600);
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2500);
  };

  const testimonialBadges: Record<string, string> = {
    'Pradeep Kumar': '3x inbound in 2 weeks',
    'Aditya Singh': 'First reply in 24 hours',
    'Shehzadi Rabia': 'Profile views doubled'
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* ════════════════════════════════════════
      {/* ════════════════════════════════════════
         SECTION 2: HERO
         ════════════════════════════════════════ */}
      <section id="landing-hero" className="w-full px-6 pt-6 pb-16 md:pt-8 md:pb-24 lg:pt-12 lg:pb-32 flex flex-col items-center text-center relative z-10">
        {/* Badge pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#2DD4BF]/40 bg-gradient-to-br from-[#2DD4BF]/[0.08] to-[#2DD4BF]/[0.03] backdrop-blur-[10px] shadow-[inset_0_0_20px_rgba(45,212,191,0.1)] mb-10">
          <div className="w-1.5 h-1.5 bg-[#2DD4BF] rounded-full animate-pulse shadow-[0_0_6px_#2DD4BF]" />
          <span className="text-[10px] md:text-[11px] font-semibold text-[#2DD4BF] uppercase tracking-[2px] md:tracking-[3px]">AI POWERED LINKEDIN COPILOT</span>
        </div>

        {/* Headline */}
        <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-extrabold text-white leading-[1.05] mb-6 max-w-[1024px] tracking-tight">
          Stop posting into the void.<br />
          Start building a brand that pays.
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-[672px] text-[16px] md:text-[19px] text-[#A0A0A0] leading-[1.7]">
          Somyra writes posts, rewrites your profile, and crafts outreach DMs in your exact voice. Not generic AI. You.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 w-full sm:w-auto max-w-[384px] sm:max-w-none mx-auto">
          <button
            id="hero-start-free"
            onClick={() => setActiveTab('profile')}
            className="w-full sm:w-auto px-8 md:px-10 py-4 bg-[#2DD4BF] text-black font-bold rounded-2xl text-base md:text-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all transform hover:scale-[1.02] active:scale-100"
          >
            Start for Free
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 md:px-10 py-4 bg-transparent border border-[#333] text-white rounded-2xl text-base md:text-lg hover:border-[#2DD4BF] hover:text-[#2DD4BF] hover:shadow-[0_0_20px_rgba(45,212,191,0.15)] transition-all"
          >
            Watch it Work
          </button>
        </div>

        {/* Trust line */}
        <p className="text-[#555] text-[12px] md:text-sm font-medium tracking-wide mb-16">
          No credit card required. Used by founders across 10 countries. Cancel anytime.
        </p>

        {/* Product Mockup Card */}
        <div className="w-full max-w-[672px] mx-auto" style={{ perspective: '1200px' }}>
          <div
            className="relative rounded-[24px] border border-white/10 bg-[#0D0D0D]/60 backdrop-blur-xl p-6 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_60px_rgba(45,212,191,0.05)] overflow-hidden"
            style={{ transform: 'rotateX(2deg) rotateY(-1deg)' }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2DD4BF]/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Mockup header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3.5 h-3.5 rounded-full bg-[#2DD4BF]/40" />
              <span className="text-[11px] font-black text-[#2DD4BF] uppercase tracking-[0.2em]">Post Writer</span>
            </div>

            {/* Input area */}
            <div className="rounded-xl border border-white/10 bg-[#141414]/80 p-5 mb-5 shadow-inner">
              <p className="text-[14px] md:text-[15px] text-white/90 leading-relaxed font-medium">How I landed my first enterprise client without a single cold email</p>
            </div>

            {/* Generate button */}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 ${isGenerating ? 'bg-[#2DD4BF]/20 cursor-not-allowed' : 'bg-[#2DD4BF] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]'} text-black font-black rounded-xl text-sm mb-6 transition-all duration-300 flex items-center justify-center gap-2`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : 'Generate Post'}
            </button>

            {/* Blurred preview */}
            <div className="relative rounded-xl border border-white/5 bg-[#141414]/50 p-5 overflow-hidden min-h-[140px]">
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <div className="space-y-3">
                      <p className="text-[13px] md:text-[14px] text-white/90 leading-relaxed font-medium [mask-image:linear-gradient(to_bottom,black_40%,transparent_90%)]">
                        I spent 100 hours analyzing why some LinkedIn posts go viral while others die in silence. <br /><br />
                        The secret isn't the algorithm. It's the hook. Most people fail because they start with "I'm so excited to announce..." instead of talking about the reader's pain. <br /><br />
                        Here are 3 frameworks that work every single time...
                      </p>
                    </div>
                    {/* Floating Premium Badge */}
                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                      <div className="px-5 py-2.5 bg-black/80 backdrop-blur-md rounded-full border border-teal-accent/40 shadow-[0_0_30px_rgba(45,212,191,0.2)] flex items-center gap-2.5 transform hover:scale-[1.02] transition-transform cursor-pointer">
                        <Lock className="w-4 h-4 text-teal-accent" />
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Upgrade to see full post</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-3 opacity-20">
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/8 rounded w-[90%]" />
                    <div className="h-3 bg-white/6 rounded w-[95%]" />
                  </div>
                )}
              </AnimatePresence>
              
              {/* Teal gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 3: SOCIAL PROOF BAR
         ════════════════════════════════════════ */}
      <section className="w-full py-10 md:py-12 relative z-10 border-y border-white/5">
        <div className="max-w-[896px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-8 md:gap-0">
            {[
              { value: '2,400+', label: 'Posts Written' },
              { value: '850+', label: 'Profiles Analyzed' },
              { value: '10+', label: 'Countries' },
              { value: '24%', label: 'Avg Engagement Lift' }
            ].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="hidden md:block w-[1px] h-10 bg-white/10 mx-8" />}
                <div className="text-center px-2 md:px-4">
                  <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                  <p className="text-[11px] md:text-xs text-[#888] font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-sm text-[#666] italic mt-8 max-w-[576px] mx-auto leading-relaxed">
            Founders from India, USA, Germany and Canada are already building their brand on Somyra.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 4: PROBLEM
         ════════════════════════════════════════ */}
      <section className="w-full px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <SectionHeading>
              You already know LinkedIn matters.<br />
              You just never know what to say.
            </SectionHeading>
            <p className="text-[#2DD4BF] text-lg md:text-xl font-semibold mt-6">That changes today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: FileText,
                title: 'The blank screen problem',
                body: 'You have something to say. The words never come out right. So you close the tab and tell yourself you will post tomorrow.'
              },
              {
                icon: UserCircle,
                title: 'The invisible profile problem',
                body: 'People visit your profile every day. Most leave without doing anything. You have no idea why. That is the real cost.'
              },
              {
                icon: MessageSquare,
                title: 'The ignored outreach problem',
                body: 'You write the DM. You send it. Nothing. Because it reads like every other DM they got that week. Because it is.'
              }
            ].map((card, i) => (
              <div key={i} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 relative overflow-hidden group hover:border-[#2DD4BF]/30 transition-all duration-300 h-full flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2DD4BF]/40 via-[#2DD4BF]/60 to-[#2DD4BF]/40" />
                <div className="w-12 h-12 bg-[#2DD4BF]/10 rounded-xl flex items-center justify-center mb-6 shrink-0">
                  <card.icon className="w-6 h-6 text-[#2DD4BF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                <p className="text-[#A0A0A0] leading-[1.7] text-[15px] flex-grow">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-16 text-lg md:text-xl font-bold text-white">
            Somyra was built to solve all three.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 5: FEATURES (Superhuman-style)
         ════════════════════════════════════════ */}
      <section className="w-full px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>WHAT SOMYRA DOES</SectionLabel>
          <SectionHeading className="mb-4">
            One tool that handles<br />
            everything LinkedIn
          </SectionHeading>
          <p className="text-[#A0A0A0] text-base md:text-lg leading-[1.7] mb-12 max-w-[672px]">
            Most people use five different tools and still get average results. Somyra replaces all of them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Tab list (left) */}
            <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto snap-x md:overflow-visible pb-4 md:pb-0 no-scrollbar">
              {featureTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap md:whitespace-normal text-[13px] md:text-sm font-medium transition-all duration-300 shrink-0 snap-start md:shrink ${
                    activeFeatureTab === tab.id
                      ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[inset_0_0_20px_rgba(45,212,191,0.05)]'
                      : 'text-[#888] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 shrink-0 col-span-1 ${activeFeatureTab === tab.id ? 'text-[#2DD4BF]' : 'text-[#666]'}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Detail panel (right) */}
            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#0D0D0D] border border-[#1f1f1f] rounded-[24px] p-8 md:p-10"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/70 mb-3 block">{activeFeature.tag}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">{activeFeature.title}</h3>
                  <p className="text-[#A0A0A0] text-[14px] md:text-[15px] leading-[1.7] mb-6 max-w-full">{activeFeature.body}</p>
                  <div className="space-y-3">
                    {activeFeature.dots.map((dot, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[#2DD4BF] mt-1.5 text-lg leading-none">·</span>
                        <span className="text-[14px] text-[#ccc] leading-relaxed">{dot}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 6: HOW IT WORKS
         ════════════════════════════════════════ */}
      <section id="how-it-works" className="px-4 py-12 md:py-16 relative z-10 border-t border-white/5">
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <SectionLabel>THE PROCESS</SectionLabel>
            <SectionHeading>
              From signup to your best<br />
              post ever. In under 5 minutes.
            </SectionHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Dotted connecting line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[16.66%] right-[16.66%] h-0 border-t-2 border-dashed border-[#2DD4BF]/20 z-0" />

            {[
              {
                num: '01',
                title: 'Tell Somyra who you are',
                body: 'Paste your LinkedIn About and Experience sections. Somyra maps your niche, your positioning, and the gaps that are costing you opportunities.'
              },
              {
                num: '02',
                title: 'Show Somyra how you write',
                body: 'Add three to ten of your real posts. This is what separates Somyra from every other AI tool. It learns your actual voice not a generic one.'
              },
              {
                num: '03',
                title: 'Generate everything. Sound like yourself.',
                body: 'Posts, DMs, profile rewrites, topic ideas. All of it sounds like you wrote it on your sharpest day. Because in a way you did.'
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-[72px] h-[72px] rounded-full bg-[#141414] border-2 border-[#2DD4BF]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                  <span className="text-[#2DD4BF] text-lg font-black">{step.num}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-tight">{step.title}</h3>
                <p className="text-[#A0A0A0] text-[14px] md:text-[15px] leading-[1.7] max-w-[320px]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 7: TESTIMONIALS
         ════════════════════════════════════════ */}
      <section className="w-full py-16 md:py-24 relative overflow-hidden border-y border-white/5 bg-[#080808]">
        <style>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-container {
            display: flex;
            width: fit-content;
            will-change: transform;
          }
          .marquee-row-left {
            animation: scrollLeft 35s linear infinite;
          }
          .marquee-row-right {
            animation: scrollRight 35s linear infinite;
          }
          @media (max-width: 768px) {
            .marquee-row-left, .marquee-row-right {
              animation-duration: 25s;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-row-left, .marquee-row-right {
              animation-play-state: paused;
            }
          }
          .marquee-row-left:hover, .marquee-row-right:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-[896px] mx-auto px-6 text-center mb-12 md:mb-16">
          <SectionLabel>REAL RESULTS</SectionLabel>
          <SectionHeading>
            What happens when your<br />
            LinkedIn finally works
          </SectionHeading>
        </div>

        <div className="relative w-full space-y-6 md:space-y-8">
          {/* Gradient Fades */}
          <div className="absolute inset-y-0 left-0 w-[100px] md:w-[200px] bg-gradient-to-r from-[#080808] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[100px] md:w-[200px] bg-gradient-to-l from-[#080808] to-transparent z-20 pointer-events-none" />

          {/* Row 1: Scrolls Left */}
          <div className="flex overflow-hidden">
            <div className="marquee-container marquee-row-left gap-4 md:gap-5 px-4">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {[
                    {
                      name: "Sarah Mitchell",
                      title: "Product Manager at FinTech Startup",
                      text: "I was skeptical at first but Somyra rewrote my headline and about section in a way I never could have. Three recruiters reached out the following week.",
                      badge: "3 RECRUITER CALLS IN A WEEK"
                    },
                    {
                      name: "James Okonkwo",
                      title: "B2B Sales Consultant",
                      text: "The Smart Outreach feature alone is worth every penny. My reply rate went from basically zero to getting real conversations started.",
                      badge: "REPLY RATE UP 4X"
                    },
                    {
                      name: "Pradeep Kumar",
                      title: "Personal Brand Strategist",
                      text: "I have tried every LinkedIn tool out there. Somyra is the first one that actually sounds like me and not like a robot wrote it.",
                      badge: "3X INBOUND IN 2 WEEKS"
                    },
                    {
                      name: "Aditya Singh",
                      title: "AI Workflow Specialist",
                      text: "The profile audit gave me more clarity in 30 seconds than months of guessing what was wrong with my LinkedIn presence.",
                      badge: "FIRST REPLY IN 24 HOURS"
                    },
                    {
                      name: "Shehzadi Rabia",
                      title: "LinkedIn Ghostwriter",
                      text: "As a ghostwriter I was worried AI would sound generic. Somyra proved me completely wrong. The voice matching is genuinely impressive.",
                      badge: "PROFILE VIEWS DOUBLED"
                    }
                  ].map((review, idx) => (
                    <div key={idx} className="min-w-[260px] md:min-w-[320px] max-w-[360px] bg-[#141414] border border-white/[0.06] rounded-[12px] p-5 flex flex-col h-full shadow-xl">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="text-[14px] leading-[1.6] text-[#D1D5DB] mb-6 flex-grow italic font-medium">"{review.text}"</p>
                      <div>
                        <p className="text-white font-bold text-[15px]">{review.name}</p>
                        <p className="text-[#9CA3AF] text-[13px] mt-0.5">{review.title}</p>
                        <div className="mt-4">
                          <span className="inline-block px-[10px] py-[4px] rounded-[20px] bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 text-[11px] font-semibold tracking-[0.05em] uppercase">
                            {review.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolls Right */}
          <div className="flex overflow-hidden">
            <div className="marquee-container marquee-row-right gap-4 md:gap-5 px-4">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {[
                    {
                      name: "Marcus Webb",
                      title: "Operations Consultant",
                      text: "I landed my first consulting client directly from LinkedIn within 10 days of using Somyra. I had been trying for months before that.",
                      badge: "FIRST CLIENT IN 10 DAYS"
                    },
                    {
                      name: "Priya Nair",
                      title: "Founder at EdTech SaaS",
                      text: "The topic generator alone saves me hours every week. I never stare at a blank screen anymore. Ideas on demand.",
                      badge: "SAVES 3 HOURS EVERY WEEK"
                    },
                    {
                      name: "Daniel Ferreira",
                      title: "Growth Advisor",
                      text: "My connection requests went from getting ignored to a 60 percent acceptance rate. The outreach messages feel genuinely personal.",
                      badge: "60% CONNECTION ACCEPTANCE"
                    },
                    {
                      name: "Ananya Sharma",
                      title: "Executive Coach",
                      text: "Somyra helped me go from invisible on LinkedIn to getting inbound leads every week. This is the tool I wished existed two years ago.",
                      badge: "WEEKLY INBOUND LEADS"
                    },
                    {
                      name: "Tom Blackwell",
                      title: "SaaS Founder",
                      text: "I upgraded to Pro after the free trial and have not looked back. The Deep Strategy audit completely changed how I position myself online.",
                      badge: "POSITIONING TRANSFORMED"
                    }
                  ].map((review, idx) => (
                    <div key={idx} className="min-w-[260px] md:min-w-[320px] max-w-[360px] bg-[#141414] border border-white/[0.06] rounded-[12px] p-5 flex flex-col h-full shadow-xl">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="text-[14px] leading-[1.6] text-[#D1D5DB] mb-6 flex-grow italic font-medium">"{review.text}"</p>
                      <div>
                        <p className="text-white font-bold text-[15px]">{review.name}</p>
                        <p className="text-[#9CA3AF] text-[13px] mt-0.5">{review.title}</p>
                        <div className="mt-4">
                          <span className="inline-block px-[10px] py-[4px] rounded-[20px] bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 text-[11px] font-semibold tracking-[0.05em] uppercase">
                            {review.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-8 py-4 rounded-xl border border-white/10 text-sm font-bold text-white hover:border-[#2DD4BF]/30 hover:text-[#2DD4BF] transition-all bg-white/5 active:scale-95"
          >
            Leave a Review
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 8: COMPARISON
         ════════════════════════════════════════ */}
      <section className="w-full px-6 py-16 md:py-24 relative z-10">
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>THE HONEST TRUTH</SectionLabel>
            <SectionHeading className="mb-4">Why not just use ChatGPT?</SectionHeading>
            <p className="text-[#A0A0A0] text-[15px] md:text-base leading-[1.7] max-w-[672px] mx-auto">
              We asked the same thing. Then we saw what it actually produces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 md:mt-24">
            {/* ChatGPT card */}
            <div className="rounded-2xl border border-red-500/15 bg-[#141414] p-6 md:p-10 flex flex-col h-full hover:border-red-500/30 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-red-400">ChatGPT and Generic AI</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  'Sounds like AI wrote it',
                  'No LinkedIn context whatsoever',
                  'Does not learn your voice',
                  'No outreach tools built in',
                  'No profile strategy',
                  'You need ten different tools',
                  'Starts from zero every single time'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                    <span className="text-[14px] text-[#ccc] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Somyra card */}
            <div className="rounded-2xl border border-[#2DD4BF]/30 bg-[#141414] p-6 md:p-10 flex flex-col h-full hover:border-[#2DD4BF]/50 shadow-[0_0_30px_rgba(45,212,191,0.05)] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#2DD4BF]" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[#2DD4BF]">Somyra</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  'Sounds exactly like you',
                  'Built only for LinkedIn',
                  'Learns and remembers your voice',
                  'Smart Outreach built in',
                  'Full profile strategy included',
                  'Everything in one place',
                  'Gets better the more you use it'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#ccc] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 9: PRICING PREVIEW
         ════════════════════════════════════════ */}
      <section className="w-full px-6 py-16 md:py-24 relative z-10 border-t border-white/5">
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>PRICING</SectionLabel>
            <SectionHeading className="mb-8">
              Start free.<br />
              Upgrade when LinkedIn<br />
              starts working.
            </SectionHeading>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-[#141414] border border-[#1f1f1f] rounded-full p-1.5 mb-2">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${!isAnnual ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${isAnnual ? 'bg-teal-accent/10 text-teal-accent border border-teal-accent/20' : 'text-[#888] hover:text-white'}`}
              >
                Annual
              </button>
              {isAnnual && <span className="text-[10px] text-teal-accent font-bold mr-2">Save up to 35%</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-start">
            <PricingCard
              name="Free"
              monthlyPrice="$0"
              annualPrice="$0"
              annualBilling=""
              savings=""
              subtext="Forever free. No card needed."
              features={[
                '5 generations to try instantly',
                '20 generations per month after signup',
                'Profile Audit: 5 per month',
                'Topic Generator: 30 topics per month',
                'Post Writer: 10 per month',
                'Smart Outreach: 10 messages per month',
                'Voice Profile: up to 5 sample posts',
                'Saved Library: up to 10 saves'
              ]}
              excluded={[
                'Deep Strategy',
                'Deep Mode',
                'Unlimited Topic Generator',
                'Priority AI responses',
                'Early access to new features',
                'Direct founder access'
              ]}
              buttonLabel="Start for Free"
              buttonStyle="bg-white/5 text-white hover:bg-white/10"
              cardStyle=""
              isAnnual={isAnnual}
              onClick={() => setActiveTab('profile')}
            />

            <PricingCard
              name="Pro"
              monthlyPrice="$19"
              annualPrice="$13"
              annualBilling="Billed $156/year"
              savings="Save $72 per year"
              subtext="Everything in Free plus:"
              badge="Most Popular"
              features={[
                'Profile Audit: 30 per month',
                'Topic Generator: Unlimited',
                'Post Writer: 60 per month',
                'Smart Outreach: 500 messages per month (that is 25 per working day)',
                'Voice Profile: up to 10 sample posts',
                'Saved Library: up to 200 saves',
                'Deep Strategy',
                'Deep Mode',
                'Full Smart Outreach suite',
                'Priority AI responses',
                'Early access to new features'
              ]}
              buttonLabel="Get Pro"
              buttonStyle=""
              cardStyle=""
              isAnnual={isAnnual}
              onClick={() => setShowPricingModal(true)}
            />

            <PricingCard
              name="Max"
              monthlyPrice="$39"
              annualPrice="$29"
              annualBilling="Billed $348/year"
              savings="Save $120 per year"
              subtext="Everything in Pro plus:"
              badge="For Power Users"
              features={[
                'Profile Audit: Unlimited',
                'Topic Generator: Unlimited',
                'Post Writer: Unlimited',
                'Smart Outreach: 1000 messages per month (that is 50 per working day)',
                'Voice Profile: up to 20 sample posts',
                'Saved Library: Unlimited',
                'Deep Strategy',
                'Deep Mode',
                'Full Smart Outreach suite',
                'Priority AI fastest response times',
                'Early access before Pro users',
                'Direct founder access for feedback'
              ]}
              buttonLabel="Get Max Access"
              buttonStyle=""
              cardStyle=""
              isAnnual={isAnnual}
              onClick={() => setShowPricingModal(true)}
            />
          </div>

          <p className="text-center text-[#666] text-sm md:text-base mt-10 max-w-[672px] mx-auto leading-relaxed">
            All plans include LinkedIn Post Preview, Topic Generator, Profile Analysis, Post Writer and Smart Outreach. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 10: FAQ
         ════════════════════════════════════════ */}
      <section className="w-full px-6 py-16 md:py-24 relative z-10 border-t border-white/5">
        <div className="max-w-[768px] mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>QUESTIONS</SectionLabel>
            <SectionHeading>Stuff people ask before signing up</SectionHeading>
          </div>

          <div className="divide-y divide-white/5">
            {faqData.map((item, i) => (
              <FaqItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openFaqIndex === i}
                onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 11: URGENCY
         ════════════════════════════════════════ */}
      <section className="px-4 py-16 md:py-24 text-center relative z-10 border-t border-white/5">
        <div className="max-w-[672px] mx-auto">
          <SectionHeading className="mb-8">
            Every week you stay quiet,<br />
            someone in your space gets louder.
          </SectionHeading>
          <p className="text-[#A0A0A0] text-base md:text-lg leading-[1.7] mb-10 max-w-[576px] mx-auto">
            LinkedIn does not reward the most talented person in the room. It rewards the most visible one. The founders winning right now are not smarter than you. They just show up every week with something worth reading. Somyra makes that effortless.
          </p>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#2DD4BF]">
            PRO USERS AVERAGE 3.8 POSTS PER WEEK
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 12: FINAL CTA
         ════════════════════════════════════════ */}
      <section className="w-full px-6 py-16 md:py-24 text-center relative z-10 border-t border-white/5">
        <div className="max-w-[672px] mx-auto">
          <SectionHeading className="mb-6">
            Your next client is on LinkedIn.<br />
            Are you showing up?
          </SectionHeading>
          <p className="text-[#A0A0A0] text-base mb-10">
            Start free today. No card needed. Takes 30 seconds.
          </p>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-10 py-4.5 bg-[#2DD4BF] text-black font-bold rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-all transform hover:scale-[1.02] active:scale-100"
          >
            Start for Free
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SCROLL-TRIGGERED BOTTOM BAR
         ════════════════════════════════════════ */}
      <AnimatePresence>
        {showBottomBar && !bottomBarDismissed && !user && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#141414] border-t border-white/5 border-l-4 border-l-[#2DD4BF] px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]"
          >
            <p className="text-white text-sm font-medium">You have 5 free generations waiting.</p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  dismissBottomBar();
                  scrollToHero();
                }}
                className="px-5 py-2 bg-[#2DD4BF] text-black font-bold rounded-lg text-xs hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all"
              >
                Claim Them
              </button>
              <button
                onClick={dismissBottomBar}
                className="p-1.5 text-[#888] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
