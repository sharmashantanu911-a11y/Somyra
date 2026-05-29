import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SomyraFooter from './SomyraFooter';
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
  Lock,
  AlertTriangle
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */
interface LandingPageProps {
  setActiveTab: (tab: any) => void;
  setShowAuth: (show: boolean) => void;
  setAuthMode?: (mode: 'login' | 'signup') => void;
  setShowPricingModal: (show: boolean) => void;
  onOpenChangelog?: () => void;
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
    title: 'Write posts that get noticed, not skipped',
    body: 'Tell Somyra what you want to write about. Choose your style. Hit generate. Get a post that sounds like your best writing on your best day. Every single time.',
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
    title: 'Turn your profile into a lead magnet',
    body: 'Paste your About and Experience. Get a surgical audit of every element that is hurting your visibility and credibility. Then get the exact rewrite to fix it.',
    dots: [
      'Quick Audit for fast wins',
      'Deep Strategy for full transformation',
      'Headline, About and positioning fixes',
      'Actionable roadmap, not vague suggestions'
    ],
    icon: UserCircle
  },
  {
    id: 'topic-generator',
    label: 'Topic Generator',
    tag: 'CONTENT FACTORY',
    title: 'Never wonder what to post again',
    body: 'Tell us your niche, your audience, and your goals. Get five story driven post topics tailored to what your specific audience actually engages with.',
    dots: [
      'Niche specific ideas, not generic topics',
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
    title: 'Turn cold DMs into warm conversations',
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
    title: 'The AI that actually sounds like you',
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
    title: 'Never lose your best content',
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
    a: 'No. Every AI writing tool gives you generic output because it knows nothing about you. Somyra learns your actual voice from your real posts, understands your niche from your profile, and writes content that sounds like you on your best day. Your audience will not be able to tell the difference.'
  },
  {
    q: 'What if I have never posted on LinkedIn?',
    a: 'Then this is exactly where you start. Profile Analysis tells you what to fix first. Topic Generator gives you ideas instantly. Post Writer helps you find your voice. You do not need existing content to get value. You just need to show up.'
  },
  {
    q: 'Why not just use ChatGPT?',
    a: 'ChatGPT forgets everything the moment you close the tab. Voice Profile saves your style permanently. Every feature across Somyra pulls from it automatically. Set it once and every generation sounds like you from that point forward. No prompting. No explaining yourself every time.'
  },
  {
    q: 'Is there a contract or can I leave?',
    a: 'No contracts. Cancel from your account settings in under 10 seconds. No questions, no fees, no friction. We would rather earn your subscription every month than trap you into one.'
  },
  {
    q: 'Who is Somyra built for?',
    a: 'Founders, executives, consultants, and sales professionals who know LinkedIn is important but cannot show up consistently because creating content takes too long. If you have ever closed a tab because you did not know what to write, Somyra was built for you.'
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'You will see a clear counter throughout the app so you always know where you stand. When you hit your limit, upgrade to Pro instantly or wait for the monthly reset. No surprise charges. Ever.'
  }
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.p 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.3em] text-[#2DD4BF] mb-5 md:mb-7"
  >
    {children}
  </motion.p>
);

const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`w-full text-[28px] md:text-[40px] lg:text-[52px] font-extrabold text-white leading-[1.1] tracking-tight ${className}`}
  >
    {children}
  </motion.h2>
);

/* ─────────────────────────────────────────────
   CONSTANTS & HELPERS
   ───────────────────────────────────────────── */
const hardcodedReviewsRow1 = [
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
];

const hardcodedReviewsRow2 = [
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
];

/* ─────────────────────────────────────────────
   FAQ ACCORDION ITEM
   ───────────────────────────────────────────── */
const FaqItem = ({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) => (
  <div className="border-b border-white/5">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-6 md:py-7 text-left gap-4 group transition-all"
    >
      <span className="text-[15px] md:text-lg font-bold text-white group-hover:text-teal-accent transition-colors leading-relaxed">{q}</span>
      <div className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-teal-accent/30 transition-all group-hover:bg-teal-accent/5">
        {isOpen ? <Minus className="w-4 h-4 text-teal-accent" /> : <Plus className="w-4 h-4 text-[#555] group-hover:text-teal-accent/70" />}
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
  <motion.div 
    variants={fadeInUp}
    whileHover="hover"
    className={`relative flex flex-col rounded-3xl p-5 md:p-7 transition-all duration-500 border h-full shadow-premium backdrop-blur-sm ${
      name === 'Pro' ? 'border-2 border-teal-accent bg-[#0A1A19]/40 shadow-[0_0_50px_rgba(45,212,191,0.05)]' : 
      name === 'Max' ? 'border border-red-500/30 bg-red-500/[0.01] hover:border-red-500/50' : 
      'border-white/5 bg-white/[0.02] hover:border-white/10'
    } ${cardStyle}`}
  >
    <motion.div variants={hoverScale} className="absolute inset-0 pointer-events-none rounded-3xl z-10 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

    {badge && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg z-20">
        <div className={`rounded-full px-3 py-0.5 ${
          name === 'Max' ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-red-500/20' : 
          'bg-teal-accent text-black shadow-teal-accent/20'
        }`}>
          {badge}
        </div>
      </div>
    )}
    
    <div className="mb-6 text-left">
      <span className={`text-[10px] font-bold tracking-[2px] uppercase ${
        name === 'Pro' ? 'text-teal-accent' : 
        name === 'Max' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-[#888888]'
      }`}>{name === 'Free' ? 'FREE' : name === 'Pro' ? 'PRO' : 'MAX'}</span>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`text-[32px] md:text-[44px] font-black text-white ${name === 'Max' ? 'text-red-500' : ''}`}>{isAnnual ? annualPrice : monthlyPrice}</span>
        <span className="text-[13px] text-[#555555]">/mo</span>
      </div>
      {isAnnual && annualBilling && (
        <div className="mt-1">
          <p className={`text-[11px] font-bold ${name === 'Pro' ? 'text-teal-accent' : name === 'Max' ? 'text-red-400' : 'text-muted'}`}>{annualBilling} {savings && <span className="opacity-60 text-[10px] font-normal italic ml-1">({savings})</span>}</p>
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
                name === 'Max' ? 'bg-red-500/20' : 'bg-teal-accent/20'
              }`}>
                <Check className={`w-3 h-3 ${name === 'Max' ? 'text-red-400' : 'text-teal-accent'}`} />
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
        name === 'Pro' ? 'bg-teal-accent text-black hover:shadow-teal-accent/40 shadow-teal-accent/20' : 
        name === 'Max' ? 'bg-red-500 text-white hover:shadow-red-500/40 shadow-red-500/20' : 
        'border border-white/10 text-white hover:bg-white/[0.03]'
      }`}
    >
      {buttonLabel}
    </button>
  </motion.div>
);


/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────── */
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
} as any;

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
} as any;

const hoverScale = {
  hover: { scale: 1.03, y: -5, transition: { duration: 0.3, ease: 'easeOut' } }
} as any;

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */
const Counter = ({ value, label }: { value: string; label: string }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '').trim();
  const nodeRef = useRef(null);
  
  // Use Intersection Observer to trigger animation
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds
    let animationStarted = false;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * numericValue);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          requestAnimationFrame(animate);
        } else if (!entry.isIntersecting) {
            // Reset for "every time" behavior if desired, 
            // but let's stick to first time or standard SaaS behavior
            // User said "every time", so we allow reset
            animationStarted = false;
            setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, [numericValue]);

  return (
    <div ref={nodeRef} className="flex flex-col items-center justify-start text-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px] h-full py-4 relative">
      <motion.p 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter tabular-nums mb-2.5"
      >
        {count.toLocaleString()}{suffix}
      </motion.p>
      <div className="h-[2.5rem] flex items-start justify-center">
        <p className="text-[10px] md:text-[11px] text-[#888] font-bold uppercase tracking-[0.2em] leading-tight max-w-[100px] md:max-w-[130px]">
          {label}
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE COMPONENT
   ───────────────────────────────────────────── */
export function LandingPage({
  setActiveTab,
  setShowAuth,
  setAuthMode,
  setShowPricingModal,
  onOpenChangelog,
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      document.body.style.setProperty('--mouse-x', `${xPercent}%`);
      document.body.style.setProperty('--mouse-y', `${yPercent}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <button onClick={() => scrollToHero()} className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
            </svg>
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-[17px] text-white tracking-tight -mb-0.5">Somyra</span>
        </button>
        <div className="flex items-center gap-6 hidden md:flex">
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="landing-nav-link">
            Explore
          </button>
          <div className="relative group/tools">
            <button className="landing-nav-link flex items-center gap-1">
              Features
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-56 rounded-xl border border-white/10 bg-[#0D0D0D] p-2 shadow-2xl opacity-0 invisible group-hover/tools:opacity-100 group-hover/tools:visible transition-all duration-200 z-50">
              <Link to="/linkedin-post-generator" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left">
                LinkedIn Post Generator
              </Link>
              <Link to="/linkedin-profile-audit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left">
                LinkedIn Profile Audit
              </Link>
              <Link to="/linkedin-dm-generator" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left">
                LinkedIn DM Generator
              </Link>
              <Link to="/linkedin-hook-generator" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left">
                LinkedIn Hook Generator
              </Link>
              <Link to="/linkedin-topic-generator" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left">
                Topic Generator
              </Link>
            </div>
          </div>
          <button onClick={() => setShowPricingModal(true)} className="landing-nav-link">
            Pricing
          </button>
          <button onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })} className="landing-nav-link">
            FAQ
          </button>
        </div>
        <div className="flex items-center">
          <button type="button" onClick={() => { setAuthMode?.('login'); setShowAuth(true); }} className="landing-nav-signin hidden sm:block">
            Log in
          </button>
          <button type="button" onClick={() => { setAuthMode?.('signup'); setShowAuth(true); }} className="landing-nav-cta">
            Sign up
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="landing-hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-[120px] pb-20 md:pb-28 text-center overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-accent/[0.06] blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-[720px] w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8 opacity-0 animate-[fadeUp_0.7s_0.2s_ease_forwards]">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border-2 border-[#080808] -mr-1.5 bg-gradient-to-br from-teal-accent/30 to-teal-accent/50 flex items-center justify-center text-[8px] font-bold text-[#080808] z-[4]">PK</div>
              <div className="w-5 h-5 rounded-full border-2 border-[#080808] -mr-1.5 bg-gradient-to-br from-indigo-500/30 to-indigo-500/50 flex items-center justify-center text-[8px] font-bold text-[#080808] z-[3]">AS</div>
              <div className="w-5 h-5 rounded-full border-2 border-[#080808] bg-gradient-to-br from-amber-500/30 to-amber-500/50 flex items-center justify-center text-[8px] font-bold text-[#080808] z-[2]">TB</div>
            </div>
            <span className="text-[12px] font-medium text-white/60">Trusted by <strong className="text-white/90 font-semibold">2,400+ founders</strong></span>
          </div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,56px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-white mb-5 opacity-0 animate-[fadeUp_0.7s_0.35s_ease_forwards]">
            Your LinkedIn sounds like everyone else.
            <br />
            Somyra makes it sound like{' '}
            <span className="text-teal-accent relative">you.
              <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-teal-accent/45 rounded-full origin-left scale-x-0 animate-[scale-in-x_0.5s_1s_ease_forwards]" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[clamp(16px,2.5vw,18px)] font-light leading-[1.7] text-white/60 max-w-[540px] mx-auto mb-10 opacity-0 animate-[fadeUp_0.7s_0.5s_ease_forwards]">
            Most AI tools strip away your personality. Somyra learns your actual voice from your real posts and writes content that sounds unmistakably like you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 mb-5 opacity-0 animate-[fadeUp_0.7s_0.65s_ease_forwards]">
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => setActiveTab('profile')}
                className="inline-flex items-center gap-2 bg-teal-accent text-[#080808] font-bold text-[15px] px-7 py-3.5 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(45,212,191,0.3)] hover:opacity-90 active:translate-y-0"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-transparent text-white/80 font-medium text-[15px] px-7 py-3.5 rounded-xl border border-white/[0.07] transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                See how it works
              </button>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center text-[13px] text-white/40 font-normal">
              <span>No credit card</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="text-white/60 font-medium">Free forever</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span>Takes 30 seconds</span>
            </div>
          </div>
        </div>

        {/* Product Mockup */}
        <div className="mt-[60px] relative z-10 w-full max-w-[800px] opacity-0 animate-[fadeUp_0.8s_0.8s_ease_forwards]">
          <div className="mockup-frame">
            {/* Browser bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[11px] text-white/30 font-medium">app.somyra.ai</span>
              <div className="w-12" />
            </div>

            {/* Mockup content - clean static preview */}
            <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-5 gap-5">
              {/* Left panel */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-accent" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-teal-accent/70">Post Writer</span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                  <div className="text-[13px] text-white/70 leading-relaxed">
                    How I landed my first enterprise client without spending a single dollar on ads
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Style:</span>
                  <div className="flex gap-1.5">
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-teal-accent/15 text-teal-accent border border-teal-accent/20 font-medium">Storytelling</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06]">Educational</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06]">Hot Take</span>
                  </div>
                </div>
                <div className="bg-teal-accent/10 border border-teal-accent/15 rounded-lg p-2.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
                  <span className="text-[11px] font-medium text-teal-accent/80">Voice Profile active {'\u2022'} Writing in your style</span>
                </div>
              </div>

              {/* Right panel */}
              <div className="md:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 flex flex-col">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mb-3">Generated Post</span>
                <div className="text-[12px] leading-relaxed text-white/60 flex-grow">
                  <strong className="text-white/80 font-medium">Three years ago I was broke, unheard of, and sending cold emails into a void.</strong>
                  <br /><br />
                  No agency. No ad budget. No warm intros.
                  <br /><br />
                  The only thing I had was one clear message and the discipline to show up on LinkedIn every week.
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-teal-accent/70">
                  <span className="w-1 h-1 bg-teal-accent rounded-full" />
                  Matched to your voice
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="w-full px-6 py-12 md:py-16 border-t border-white/[0.04]">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap mb-5">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#080808] -mr-2 bg-gradient-to-br from-teal-accent/20 to-teal-accent/40 flex items-center justify-center text-[10px] font-bold text-teal-accent z-[4]">PK</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#080808] -mr-2 bg-gradient-to-br from-indigo-500/20 to-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-400 z-[3]">AS</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#080808] -mr-2 bg-gradient-to-br from-amber-500/20 to-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-400 z-[2]">TB</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#080808] bg-gradient-to-br from-pink-500/20 to-pink-500/40 flex items-center justify-center text-[10px] font-bold text-pink-400 z-[1]">MW</div>
            </div>
            <span className="text-[14px] text-white/50">Join <strong className="text-white/80 font-semibold">2,400+ founders</strong> growing on LinkedIn with Somyra</span>
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-[24px] font-extrabold text-white tracking-tight">10+</p>
              <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Countries</span>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-[24px] font-extrabold text-white tracking-tight">24%</p>
              <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Avg Engagement Lift</span>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-[24px] font-extrabold text-white tracking-tight">Zero</p>
              <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Risk to Start</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="w-full px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-[896px] mx-auto">
          <SectionLabel>WHAT YOU GET</SectionLabel>
          <SectionHeading className="mb-4">
            From invisible to unstoppable<br />
            on LinkedIn.
          </SectionHeading>
          <p className="text-[#A0A0A0] text-base md:text-lg leading-[1.7] mb-14 max-w-[576px] mx-auto text-center">
            Three ways Somyra turns your profile into your biggest asset.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: FileText,
                title: 'Write posts that sound like you',
                body: 'No more staring at a blank screen. You pick the topic, choose your style, and Somyra writes a post that sounds like you on your best day. Ready to publish in 30 seconds.'
              },
              {
                icon: UserCircle,
                title: 'Fix your profile to attract opportunity',
                body: 'People visit your profile every day. Most leave because something is off. Somyra audits every line of your About and Experience and rewrites it so the right people reach out to you.'
              },
              {
                icon: MessageSquare,
                title: 'Send DMs that get real replies',
                body: 'Generic outreach gets ignored. Somyra writes personalized messages that reference each prospect and speak to their real pain. Your reply rate goes up from the first message.'
              }
            ].map((card, i) => (
              <div key={i} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 relative overflow-hidden group hover:border-[#2DD4BF]/30 transition-all duration-300 h-full flex flex-col shadow-premium hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2DD4BF]/40 via-[#2DD4BF]/60 to-[#2DD4BF]/40 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-[#2DD4BF]/10 rounded-xl flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <card.icon className="w-6 h-6 text-[#2DD4BF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                <p className="text-[#A0A0A0] leading-[1.7] text-[15px] flex-grow">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES (Value Proofs) ── */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full px-4 py-16 md:py-24 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <SectionLabel>EVERYTHING YOU NEED</SectionLabel>
          <SectionHeading className="mb-4">
            Six tools in one.<br />
            All sounding like you.
          </SectionHeading>
          <p className="text-[#A0A0A0] text-base md:text-lg leading-[1.7] mb-12 max-w-[672px]">
            Most people juggle five different tools and still sound generic. Somyra does everything in one place, and everything sounds like you.
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
      </motion.section>

      {/* ════════════════════════════════════════
         SECTION: HOW IT WORKS (new design)
         ════════════════════════════════════════ */}
      <section id="how-it-works" className="relative px-6 py-24 md:py-28 overflow-hidden">
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-accent/[0.07] blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-[1060px] mx-auto relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span className="w-8 h-px bg-teal-accent/40" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-teal-accent/85">The Process</span>
            <span className="w-8 h-px bg-teal-accent/40" />
          </div>

          {/* Headline */}
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white text-center max-w-[640px] mx-auto mb-3">
            From signup to your best post ever. In under 5 minutes.
          </h2>

          <p className="text-[clamp(15px,2vw,17px)] font-light leading-[1.7] text-white/50 text-center max-w-[480px] mx-auto mb-14">
            Most tools make you do the work. Somyra does it with you. Three steps and you are live.
          </p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.07] rounded-[20px] overflow-hidden mb-16">
            {[
              {
                num: '01',
                title: 'Paste your profile',
                body: 'Share your LinkedIn link. Somyra scans your About, Experience, and recent posts to understand your niche, your positioning, and what makes you different from everyone else.'
              },
              {
                num: '02',
                title: 'Teach Somyra your voice',
                body: 'Add three of your best posts. Somyra studies how you structure ideas, the words you choose, and how you open and close. This is how it learns to write like you.'
              },
              {
                num: '03',
                title: 'Generate content that sounds like you',
                body: 'Posts, DMs, profile rewrites, topic ideas. All of it sounds like you wrote it on your best day. Because that is exactly what Somyra is trained to do.'
              }
            ].map((step, i) => (
              <div key={i} className="bg-[#0d0d0d] p-8 md:p-10 relative group transition-colors hover:bg-[#111]">
                {/* Large faded number */}
                <div className="absolute top-4 right-5 font-[family-name:var(--font-display)] text-[80px] font-extrabold text-teal-accent/[0.04] leading-none pointer-events-none select-none tracking-[-0.04em]">
                  {step.num}
                </div>
                {/* Step number badge */}
                <div className="w-9 h-9 rounded-xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[14px] font-extrabold text-teal-accent mb-6 tracking-tight">
                  {step.num}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white leading-snug tracking-[-0.02em] mb-3">{step.title}</h3>
                <p className="text-[14.5px] font-light leading-[1.72] text-white/50">{step.body}</p>
                {/* Arrow between steps (desktop) */}
                {i < 2 && <div className="hidden md:block absolute top-10 -right-[9px] text-teal-accent/30 text-lg z-10">→</div>}
              </div>
            ))}
          </div>

          {/* Interactive Demo Card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            <div className="preview-card rounded-2xl">
              <div className="preview-bar">
                <div className="flex gap-1.5">
                  <span className="preview-dot bg-[#FF5F57]" />
                  <span className="preview-dot bg-[#FFBD2E]" />
                  <span className="preview-dot bg-[#28C840]" />
                </div>
                <span className="text-[11.5px] text-white/50 font-medium tracking-widest uppercase">Post Writer</span>
                <span className="text-[10px] font-semibold text-teal-accent bg-teal-accent/10 border border-teal-accent/20 px-2 py-[3px] rounded uppercase tracking-wider">Live Preview</span>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-teal-accent/80">What do you want to write about?</span>
                  <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white/80 leading-relaxed">
                    How I landed my first enterprise client without spending a single dollar on ads
                  </div>

                  <span className="text-[10px] font-semibold tracking-widest uppercase text-teal-accent/80">Post Style</span>
                  <div className="flex gap-2">
                    <span className="preview-chip active">Storytelling</span>
                    <span className="preview-chip">Educational</span>
                    <span className="preview-chip">Hot Take</span>
                  </div>

                  <span className="text-[10px] font-semibold tracking-widest uppercase text-teal-accent/80">Voice Mode</span>
                  <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-[12px] text-white/50">
                    Voice Profile active ✓
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full ${isGenerating ? 'bg-teal-accent/20 cursor-not-allowed text-teal-accent/60' : 'bg-teal-accent hover:opacity-88 text-[#080808]'} font-bold text-[13px] py-2.5 rounded-lg transition-opacity`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </span>
                    ) : 'Generate Post'}
                  </button>
                </div>

                <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2.5">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50">Generated Post</span>
                  <div className="text-[12px] leading-relaxed text-white/60">
                    <strong className="text-white/90 font-medium">Three years ago I was broke, unheard of, and sending cold emails into a void.</strong>
                    <br /><br />
                    No agency. No ad budget. No warm intros.<br /><br />
                    The only thing I had was one clear message and the discipline to show up on LinkedIn every week.<span className="typing-cursor" />
                  </div>
                  <div className="mt-auto inline-flex items-center gap-1.5 text-[10px] font-semibold text-teal-accent bg-teal-accent/10 border border-teal-accent/15 px-2 py-1 rounded self-start">
                    <span className="w-[5px] h-[5px] bg-teal-accent rounded-full animate-[pulse-dot_1.5s_infinite]" />
                    Writing in your voice
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="w-full px-4 py-16 md:py-20 bg-[#0D0D0D] relative z-10 border-t border-white/5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>WHY SOMYRA</SectionLabel>
            <SectionHeading className="mb-4">
              More tools. Higher prices.<br />
              None of them sound like you.
            </SectionHeading>
            <p className="text-[#888] text-[15px] md:text-lg leading-[1.7] max-w-[576px] mx-auto">
              We built the comparison so you do not have to spend hours researching.
            </p>
          </div>

          {/* Table Container */}
          <div className="relative">
            <div className="md:hidden text-center mb-4">
              <span className="text-[11px] text-[#555] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ChevronRight className="w-3 h-3 rotate-180" />
                Scroll to compare
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            <div className="overflow-x-auto pb-4 no-scrollbar">
              <div className="min-w-[800px] md:min-w-full">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-end">
                  <div className="pb-5 pl-4">
                    <span className="text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Feature</span>
                  </div>

                  {/* Somyra */}
                  <div className="bg-[#2DD4BF]/[0.06] border-t-[3px] border-[#2DD4BF] rounded-t-2xl p-5 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[14px] font-bold text-white">Somyra</span>
                      <span className="text-[12px] font-bold text-[#2DD4BF]">From $19/mo</span>
                    </div>
                  </div>

                  {/* Competitors */}
                  {[
                    { name: 'Taplio', note: 'AI at $69/mo' },
                    { name: 'Supergrow', note: 'From $19/mo' },
                    { name: 'MagicPost', note: 'From $27/mo' }
                  ].map((comp, idx) => (
                    <div key={idx} className="bg-white/[0.02] p-5 text-center border-t border-x border-white/5 rounded-t-xl mx-px">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[14px] font-bold text-white">{comp.name}</span>
                        <span className="text-[12px] text-[#666] font-medium">{comp.note}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Rows */}
                <div className="border border-white/5 rounded-b-2xl overflow-hidden">
                  {[
                    {
                      feature: 'Writes in your exact voice',
                      somyra: true,
                      others: [false, 'Limited', 'Basic AI']
                    },
                    {
                      feature: 'Profile audit with rewrite',
                      somyra: true,
                      others: [false, false, false]
                    },
                    {
                      feature: 'Smart outreach with CRM',
                      somyra: true,
                      others: ['$199/mo', false, false]
                    },
                    {
                      feature: 'Voice learning from your posts',
                      somyra: true,
                      others: ['Basic', 'Basic', 'Basic']
                    },
                    {
                      feature: 'Unlimited topic ideas',
                      somyra: true,
                      others: ['Limited', true, true]
                    },
                    {
                      feature: 'Account safe, no automation',
                      somyra: true,
                      others: ['At risk', true, true]
                    },
                    {
                      feature: 'Follow up sequences',
                      somyra: true,
                      others: ['Basic', false, false]
                    },
                    {
                      feature: 'ICP targeting tool',
                      somyra: true,
                      others: [false, false, false]
                    },
                    {
                      feature: 'Full AI included at base price',
                      somyra: true,
                      others: ['$69/mo', 'Limited', 'Basic']
                    }
                  ].map((row, i) => {
                    const renderCell = (val: any, isSomyra: boolean) => {
                      if (val === true) return <Check className={`w-4 h-4 ${isSomyra ? 'text-[#2DD4BF]' : 'text-[#2DD4BF]'} mb-1`} />;
                      if (val === false) return <X className="w-4 h-4 text-red-500/50 mb-1" />;
                      return <span className="text-[12px] md:text-[13px] font-medium text-[#777] leading-snug">{val}</span>;
                    };

                    return (
                      <div key={i} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center ${i % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent'}`}>
                        <div className="p-4 md:p-5 text-[13px] font-bold text-white pl-5">{row.feature}</div>
                        <div className="p-4 md:p-5 flex flex-col items-center justify-center bg-[#2DD4BF]/[0.03] border-x border-white/5 h-full">
                          {renderCell(row.somyra, true)}
                        </div>
                        {row.others.map((val, ci) => (
                          <div key={ci} className="p-4 md:p-5 flex flex-col items-center justify-center h-full border-r border-white/5 last:border-r-0">
                            {renderCell(val, false)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-[#555] font-medium italic px-4">
              *AI features require $69/mo plan on Taplio.
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 mb-5">
              <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.2em]">The bottom line</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
              More features. Lower price.<br />Zero account risk.
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className="px-8 py-4 bg-[#2DD4BF] text-black font-bold rounded-xl text-sm hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02]"
              >
                Start for Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 9: PRICING PREVIEW
         ════════════════════════════════════════ */}
      <motion.section 
        id="pricing-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full px-6 py-16 md:py-24 relative z-10 border-t border-white/5"
      >
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>PRICING</SectionLabel>
            <SectionHeading className="mb-8">
              Start free forever.<br />
              Upgrade when you are ready<br />
              for more.
            </SectionHeading>

            {/* Toggle */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 bg-[#141414] border border-[#1f1f1f] rounded-full p-1.5 mb-2">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${
                    !isAnnual ? 'bg-white/10 text-white shadow-xl' : 'text-[#888] hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 ${
                    isAnnual ? 'bg-teal-accent/10 text-teal-accent border border-teal-accent/20' : 'text-[#888] hover:text-white'
                  }`}
                >
                  Annual
                </button>
                {isAnnual && (
                  <span className="text-[10px] text-teal-accent font-bold mr-2 ml-1 animate-pulse">Save up to 35%</span>
                )}
              </div>
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
      </motion.section>

      {/* ════════════════════════════════════════
         SECTION 10: TESTIMONIALS
         ════════════════════════════════════════ */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full py-16 md:py-24 relative overflow-hidden border-y border-white/5 bg-[#080808]"
      >
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
                  {(testimonials?.length > 0 ? 
                    testimonials.map(t => ({
                      name: t.user_name || 'Anonymous',
                      title: t.user_title || 'LinkedIn User',
                      text: t.content,
                      badge: t.badge_text || 'VERIFIED USER'
                    })).concat(hardcodedReviewsRow1) : 
                    hardcodedReviewsRow1
                  ).slice(0, 10).map((review, idx) => (
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
                  {(testimonials?.length > 5 ? 
                    testimonials.slice(5).map(t => ({
                      name: t.user_name || 'Anonymous',
                      title: t.user_title || 'LinkedIn User',
                      text: t.content,
                      badge: t.badge_text || 'VERIFIED USER'
                    })).concat(hardcodedReviewsRow2) : 
                    hardcodedReviewsRow2
                  ).slice(0, 10).map((review, idx) => (
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
      </motion.section>

      {/* ── SECTION 11: FAQ ── */}
      <motion.section 
        id="faq-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full px-6 py-16 md:py-24 relative z-10 border-t border-white/5"
      >
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
      </motion.section>



      {/* ════════════════════════════════════════
         SECTION 12: FINAL CTA
         ════════════════════════════════════════ */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full px-6 py-16 md:py-24 text-center relative z-10 border-t border-white/5"
      >
        <div className="max-w-[672px] mx-auto">
          <SectionHeading className="mb-6">
            Every week you stay quiet,<br />
            someone in your space gets louder.
          </SectionHeading>
          <p className="text-[#A0A0A0] text-base mb-10">
            Start free forever. No credit card. Takes 30 seconds.
          </p>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-10 py-4.5 bg-[#2DD4BF] text-black font-bold rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-all transform hover:scale-[1.02] active:scale-100"
          >
            Start for Free
          </button>
        </div>
      </motion.section>

      <SomyraFooter />

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
            <p className="text-white text-sm font-medium">Start building your brand today for free.</p>
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
};
