import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SomyraFooter from './SomyraFooter';
import { SEO } from './SEO';
import { useAnimationInView } from '../hooks/useAnimationInView';
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
  Menu,
  ChevronRight,
  Star,
  Plus,
  Mail,
  Users,
  Clock,
  Globe,
  Shield,
  Zap,
  Target,
  ArrowRight,
  Crown,
  ChevronDown,
  Loader2,
  Lock,
  AlertTriangle,
  Play,
  Infinity
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */
interface LandingPageProps {
  setActiveTab: (tab: any) => void;
  setShowAuth: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
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
  desc: string;
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
    desc: 'Write posts that sound like you',
    tag: 'CONTENT FACTORY',
    title: 'Write posts that people actually read',
    body: 'Tell Somyra what you want to write about. Pick your style. Get a post that sounds like your best writing on your best day.',
    dots: [
      'Get a post that reads like your best writing, every time',
      'Deep Mode keeps reworking it until it matches your voice',
      'Voice Profile learns what makes your writing yours',
      'Preview exactly how it looks on LinkedIn before publishing'
    ],
    icon: PenTool
  },
  {
    id: 'profile-analysis',
    label: 'Profile Analysis',
    desc: 'Audit and rewrite your entire profile',
    tag: 'PERSONAL BRAND',
    title: 'Turn your profile into something that works for you',
    body: 'Paste your About and Experience. Somyra finds what is holding your profile back and rewrites it so the right people notice you.',
    dots: [
      'Get a complete review of your profile in seconds',
      'Rewrite your About, Headline, and Experience from scratch',
      'Fix the parts that push people away instead of pulling them in',
      'Walk away with a rewrite that is yours, not a template'
    ],
    icon: UserCircle
  },
  {
    id: 'topic-generator',
    label: 'Topic Generator',
    desc: 'Never run out of content ideas',
    tag: 'CONTENT FACTORY',
    title: 'Never wonder what to post again',
    body: 'Tell us your niche, your audience, and your goals. Get five post topics your specific audience actually wants to read.',
    dots: [
      'Get topics your audience actually clicks on',
      'Ideas that start conversations, not just scrolls',
      'Save the good ones and post them when you are ready',
      'Fresh ideas every time, so you never stare at a blank screen'
    ],
    icon: Sparkles
  },
  {
    id: 'smart-outreach',
    label: 'Smart Outreach',
    desc: 'Personalized DMs that get replies',
    tag: 'SALES AND OUTREACH',
    title: 'Turn cold DMs into conversations that actually go somewhere',
    body: 'Paste what you know about your prospect. Get a message that references their actual work, speaks to what matters to them, and feels like you spent an hour researching them. Because Somyra did.',
    dots: [
      'Personalized DMs that show you actually did your homework',
      'Follow-ups that feel natural, not scripted',
      'Track every conversation without leaving Somyra',
      'Know exactly who to reach out to and why'
    ],
    icon: Send
  },
  {
    id: 'voice-profile',
    label: 'Voice Profile',
    desc: 'Teach Somyra how you write',
    tag: 'PRO FEATURE',
    title: 'The AI that actually sounds like you',
    body: 'Add your best posts. Somyra studies how you structure ideas, what words you use, how you open and close. Everything after that sounds more like you.',
    dots: [
      'Teach Somyra your voice in under 2 minutes',
      'Every post sounds more like you over time',
      'Your voice carries into posts, DMs, and profile rewrites',
      'The one feature that makes every other tool feel generic'
    ],
    icon: Mic
  },
  {
    id: 'saved-library',
    label: 'Saved Library',
    desc: 'Save your best posts and drafts',
    tag: 'PRO FEATURE',
    title: 'Keep your best content in one place',
    body: 'Every post, DM, and audit you generate can be saved. Build a library of your best work. Never start from zero again.',
    dots: [
      'Save your best posts, DMs, and audits in one place',
      'Find exactly what you need in seconds',
      'Build a library of your best content over time',
      'Access your library anywhere, anytime'
    ],
    icon: Bookmark
  }
];

const faqData = [
  {
    q: 'Is this just another AI writing tool?',
    a: 'No. That is the whole point. Most AI tools give everyone the same output. Somyra learns how you write, your sentence length, your word choices, how you open and close, and generates content that actually sounds like you.'
  },
  {
    q: 'What if I have never posted on LinkedIn?',
    a: 'You are the ideal user for this. Somyra helps you build a voice from scratch. You do not need existing posts to get started. Paste your profile, describe how you want to sound, and Somyra builds from there. Most users publish their first post within 10 minutes of signing up.'
  },
  {
    q: 'Why not just use ChatGPT?',
    a: 'ChatGPT writes for everyone. Somyra writes for you. ChatGPT has no idea what your niche is, who your audience is, or how you naturally communicate. Somyra is built for LinkedIn content, knows what actually works, and writes in your voice, not some generic AI tone.'
  },
  {
    q: 'Is there a contract or can I leave?',
    a: 'Zero contracts. Cancel from your dashboard in one click, anytime. You keep access until the end of your billing period. No fees, no questions, no hassle.',
  },
  {
    q: 'Who is Somyra built for?',
    a: 'Founders, executives, consultants, and sales pros who want LinkedIn to work for them without spending hours every week. If your personal brand brings in business, Somyra is built for you.',
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'You will see a warning before you hit it so there are no surprises. When you do, upgrade instantly from your dashboard or wait for the next month. Nothing gets deleted. Your Voice Profile, saved content, and settings stay exactly where they are.'
  }
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p 
    ref={useAnimationInView()}
    data-animate="fade-in-up"
    className="type-overline text-[#2DD4BF] mb-5 md:mb-7"
  >
    {children}
  </p>
);

const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 
    ref={useAnimationInView()}
    data-animate="fade-in-up"
    className={`type-display text-white ${className}`}
  >
    {children}
  </h2>
);

const avatarColors = [
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-blue-500',
  'from-teal-400 to-cyan-500',
  'from-fuchsia-400 to-pink-500',
  'from-lime-400 to-green-500',
  'from-indigo-400 to-violet-500',
  'from-red-400 to-rose-500'
];

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const avatarMap: Record<string, string> = {
  'Olivia Collins': '/user-images/Ama.webp',
  'Jordan Smith': '/user-images/Alex.webp',
  'Ryan Gallagher': '/user-images/Mark.webp',
  'Leo Kim': '/user-images/Charlie.webp',
  'Chloe Chen': '/user-images/Lisa.webp',
  'Aurora Murphy': '/user-images/Arora.webp',
  'Emma Watson': '/user-images/Sophie.webp',
  'Sarah Jenkins': '/user-images/Claire.webp',
  'Aaron Brooks': '/user-images/James.webp',
  'Sofia Gomez': '/user-images/Maya.webp',
  'Trey Washington': '/user-images/Marcus.webp',
  'Lily Edwards': '/user-images/Charlotte.webp',
  'Elena Petrova': '/user-images/Natalia.webp',
  'Tariq Mansoor': '/user-images/Malik.webp',
  'Jack Reynolds': '/user-images/Tom.webp',
  'Maria Lopez': '/user-images/Nina.webp',
  'Mateo Silva': '/user-images/Carlos.webp',
  'Ben Kaplan': '/user-images/Max.webp',
  'Emily Larson': '/user-images/Hannah.webp',
  'Adam Klein': '/user-images/David.webp'
};

const ReviewCard = ({ review, idx }: { review: typeof hardcodedReviewsRow1[0]; idx: number }) => (
  <div className="min-w-[260px] md:min-w-[320px] max-w-[360px] bg-[#141414] border border-white/[0.06] rounded-[14px] p-4 md:p-6 flex flex-col shadow-xl relative overflow-hidden group hover:border-[#2DD4BF]/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent" />
    <div className="flex gap-1 mb-3 md:mb-4">
      {[...Array(5)].map((_, s) => (
        <Star key={s} className="w-3 md:w-4 h-3 md:h-4 text-[#F59E0B] fill-[#F59E0B]" />
      ))}
    </div>
    <div className="relative">
      <span className="absolute -top-1 -left-0.5 text-[44px] leading-none text-[#2DD4BF]/8 font-serif select-none pointer-events-none">{"\u201C"}</span>
      <p className="text-[13px] leading-[1.7] text-[#D1D5DB] mb-4 md:mb-5 pl-4 relative z-10 font-medium">{"\u201C"}{review.text}{"\u201D"}</p>
    </div>
    <div className="mt-auto flex items-center gap-3">
      {avatarMap[review.name] ? (
        <img src={avatarMap[review.name]} alt={review.name} width={32} height={32} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0 shadow-[0_0_0_2px_rgba(45,212,191,0.15)]" loading="lazy" />
      ) : (
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-[11px] md:text-[12px] font-bold text-white shrink-0 shadow-lg`}>
          {getInitials(review.name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-white font-bold text-[13px] md:text-[14px] leading-tight">{review.name}</p>
        <p className="text-[#9CA3AF] text-[11px] md:text-[12px] mt-0.5 leading-tight">{review.title}</p>
      </div>
    </div>
    <div className="mt-3 md:mt-4">
      <span className="inline-block px-[10px] py-[4px] rounded-[20px] bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 type-overline">
        {review.badge}
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   CONSTANTS & HELPERS
   ───────────────────────────────────────────── */
const hardcodedReviewsRow1 = [
  {
    name: "Olivia Collins",
    title: "Product Manager at FinTech Startup",
    text: "I was skeptical at first but Somyra rewrote my headline and about section in a way I never could have. Three recruiters reached out the following week.",
    badge: "3 RECRUITER CALLS IN A WEEK"
  },
  {
    name: "Jordan Smith",
    title: "B2B Sales Consultant",
    text: "The Smart Outreach feature alone is worth every penny. My reply rate went from basically zero to getting real conversations started.",
    badge: "REPLY RATE UP 4X"
  },
  {
    name: "Ryan Gallagher",
    title: "Personal Brand Strategist",
    text: "I have tried every LinkedIn tool out there. Somyra is the first one that actually sounds like me and not like a robot wrote it.",
    badge: "3X INBOUND IN 2 WEEKS"
  },
  {
    name: "Leo Kim",
    title: "AI Workflow Specialist",
    text: "The profile audit gave me more clarity in 30 seconds than months of guessing what was wrong with my LinkedIn presence.",
    badge: "FIRST REPLY IN 24 HOURS"
  },
  {
    name: "Chloe Chen",
    title: "LinkedIn Ghostwriter",
    text: "As a ghostwriter I was worried AI would sound generic. Somyra proved me completely wrong. The voice matching is genuinely impressive.",
    badge: "PROFILE VIEWS DOUBLED"
  },
  {
    name: "Aurora Murphy",
    title: "Marketing Director, B2B Tech",
    text: "I have tried every LinkedIn growth tool on the market. Somyra is the only one that writes content I do not have to rewrite before posting.",
    badge: "HOURS SAVED PER WEEK"
  },
  {
    name: "Emma Watson",
    title: "Founder at DevTools SaaS",
    text: "My LinkedIn used to get maybe 200 impressions per post. Now I average over 2,000. The topic generator alone changed my entire content strategy.",
    badge: "10X IMPRESSION GROWTH"
  },
  {
    name: "Sarah Jenkins",
    title: "Executive Career Coach",
    text: "I recommend Somyra to every client I work with. The profile audit catches things I miss even as a trained career coach. It is that thorough.",
    badge: "RECOMMENDED TO CLIENTS"
  },
  {
    name: "Aaron Brooks",
    title: "Demand Gen Director",
    text: "The Smart Outreach CRM integration is a game changer. I track every prospect, every follow up, and every conversion. All inside one tool.",
    badge: "PIPELINE GROWTH 3X"
  },
  {
    name: "Sofia Gomez",
    title: "Content Strategist",
    text: "I manage three brand accounts on LinkedIn. Somyra keeps each voice distinct and authentic. My clients cannot believe I am using AI.",
    badge: "3 BRANDS, 1 TOOL"
  }
];

const hardcodedReviewsRow2 = [
  {
    name: "Trey Washington",
    title: "Operations Consultant",
    text: "I landed my first consulting client directly from LinkedIn within 10 days of using Somyra. I had been trying for months before that.",
    badge: "FIRST CLIENT IN 10 DAYS"
  },
  {
    name: "Lily Edwards",
    title: "Founder at EdTech SaaS",
    text: "The topic generator alone saves me hours every week. I never stare at a blank screen anymore. Ideas on demand.",
    badge: "SAVES 3 HOURS EVERY WEEK"
  },
  {
    name: "Elena Petrova",
    title: "Growth Advisor",
    text: "My connection requests went from getting ignored to a 60 percent acceptance rate. The outreach messages feel genuinely personal.",
    badge: "60% CONNECTION ACCEPTANCE"
  },
  {
    name: "Tariq Mansoor",
    title: "Executive Coach",
    text: "Somyra helped me go from invisible on LinkedIn to getting inbound leads every week. This is the tool I wished existed two years ago.",
    badge: "WEEKLY INBOUND LEADS"
  },
  {
    name: "Jack Reynolds",
    title: "SaaS Founder",
    text: "I upgraded to Pro after the free trial and have not looked back. The Deep Strategy audit completely changed how I position myself online.",
    badge: "POSITIONING TRANSFORMED"
  },
  {
    name: "Maria Lopez",
    title: "CEO at HealthTech Startup",
    text: "I was posting once a month because writing felt like a chore. Somyra made it effortless. Now I post three times a week and the engagement keeps climbing.",
    badge: "3X POST FREQUENCY"
  },
  {
    name: "Mateo Silva",
    title: "Brand Strategist",
    text: "The Voice Profile feature is witchcraft. It captured my tone so accurately that my long time clients asked if I had hired a ghostwriter.",
    badge: "SPOT ON VOICE MATCH"
  },
  {
    name: "Ben Kaplan",
    title: "Lead Product Designer",
    text: "I closed two enterprise deals from LinkedIn DMs written by Somyra. The personalized outreach makes prospects feel like you actually did your homework.",
    badge: "2 ENTERPRISE DEALS CLOSED"
  },
  {
    name: "Emily Larson",
    title: "Freelance Product Designer",
    text: "I went from zero LinkedIn presence to getting inbound messages from recruiters every week. All because I finally had content worth engaging with.",
    badge: "WEEKLY INBOUND MESSAGES"
  },
  {
    name: "Adam Klein",
    title: "HR Director at Tech Corp",
    text: "We use Somyra for our entire leadership team's LinkedIn presence. Consistent, authentic, professional. Exactly what a modern company brand needs.",
    badge: "TEAM WIDE ADOPTION"
  }
];

/* ─────────────────────────────────────────────
   FAQ ACCORDION ITEM
   ───────────────────────────────────────────── */
const FaqItem = ({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="bg-[#0D0D0D] rounded-[12px] ds:rounded-[16px] overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      animate={{ borderColor: isOpen ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.06)' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 ds:p-[20px_24px] text-left cursor-pointer"
      >
        <motion.span
          className="text-[14px] ds:text-[15px] font-medium leading-[1.4] pr-4"
          animate={{ color: isOpen ? '#2DD4BF' : '#FFFFFF' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {q}
        </motion.span>
        <motion.div
          className="shrink-0 w-6 h-6 ds:w-7 ds:h-7 rounded-full flex items-center justify-center"
          animate={{
            backgroundColor: isOpen ? 'rgba(45,212,191,0.08)' : '#141414',
            borderColor: isOpen ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.08)',
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ border: '1px solid' }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Plus className="w-3 h-3 ds:w-3.5 ds:h-3.5 text-[#999]" />
          </motion.div>
        </motion.div>
      </button>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          height: isOpen ? contentRef.current?.scrollHeight ?? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div ref={contentRef}>
          <p className="text-[13px] ds:text-[14px] text-[#888] leading-[1.8] px-4 ds:px-6 pb-4 ds:pb-5">{a}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

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
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.dataset.inview = 'true';
        observer.unobserve(el);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
  <div 
    ref={cardRef}
    data-animate="fade-in-up"
    className={`relative flex flex-col rounded-2xl ds:rounded-3xl p-5 md:p-7 transition-all duration-500 border h-full shadow-premium backdrop-blur-sm ${
      name === 'Pro' ? 'border-2 border-teal-accent bg-[#0A1A19]/40 shadow-[0_0_50px_rgba(45,212,191,0.05)]' : 
      name === 'Max' ? 'border border-red-500/30 bg-red-500/[0.01] hover:border-red-500/50' : 
      'border-white/5 bg-white/[0.02] hover:border-white/10'
    } ${cardStyle}`}
  >
    <div className="absolute inset-0 pointer-events-none rounded-3xl z-10 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

    {badge && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 type-overline shadow-lg z-20">
        <div className={`rounded-full px-3 py-0.5 ${
          name === 'Max' ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-red-500/20' : 
          'bg-teal-accent text-black shadow-teal-accent/20'
        }`}>
          {badge}
        </div>
      </div>
    )}
    
    <div className="mb-6 text-left">
      <span className={`type-overline ${
        name === 'Pro' ? 'text-teal-accent' : 
        name === 'Max' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-[#888888]'
      }`}>{name === 'Free' ? 'FREE' : name === 'Pro' ? 'PRO' : 'MAX'}</span>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`text-[32px] ds:text-[44px] font-semibold text-white leading-none ${name === 'Max' ? 'text-red-500' : ''}`}>{isAnnual ? annualPrice : monthlyPrice}</span>
        <span className="text-[13px] text-[#888888]">/mo</span>
      </div>
      {isAnnual && annualBilling && (
        <div className="mt-1">
          <p className={`text-[11px] font-bold ${name === 'Pro' ? 'text-teal-accent' : name === 'Max' ? 'text-red-400' : 'text-muted'}`}>{annualBilling} {savings && <span className="opacity-60 text-[10px] font-normal italic ml-1">({savings})</span>}</p>
        </div>
      )}
      <p className="mt-3 text-[13px] text-[#888888] leading-relaxed font-medium">{subtext}</p>
    </div>

    <div className="space-y-4 mb-8 flex-grow">
      {name === 'Free' && <p className="type-overline text-[#888888]">INCLUDES</p>}
      <ul className="space-y-3 mt-4">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-[13px] leading-snug text-white/90">
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
      className={`w-full py-4 rounded-2xl text-[14px] font-bold transition-all shadow-xl ${
        name === 'Pro' ? 'bg-teal-accent text-black hover:shadow-teal-accent/40 shadow-teal-accent/20' : 
        name === 'Max' ? 'bg-red-500 text-white hover:shadow-red-500/40 shadow-red-500/20' : 
        'border border-white/10 text-white hover:bg-white/[0.03]'
      }`}
    >
      {buttonLabel}
    </button>
  </div>
);
};


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
      <p 
        ref={useAnimationInView()}
        data-animate="fade-in-scale"
        className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tighter tabular-nums mb-2.5"
      >
        {count.toLocaleString()}{suffix}
      </p>
      <div className="h-[2.5rem] flex items-start justify-center">
        <p className="type-overline text-[#888] leading-tight max-w-[100px] md:max-w-[130px]">
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
  const [scrolled, setScrolled] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState('post-writer');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [bottomBarDismissed, setBottomBarDismissed] = useState(() => {
    return localStorage.getItem('somyra_bottom_bar_dismissed') === 'true';
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
    <>
      <SEO
        title="Somyra | The LinkedIn Copilot That Sounds Like You"
        description="Elevate your LinkedIn presence with Somyra. AI-powered strategy, profile audits, and smart outreach designed for founders who take LinkedIn seriously."
        canonical="https://somyra.online/"
      />
      <div className="w-full max-w-full overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav className={`landing-nav${scrolled ? ' landing-nav-scrolled' : ''}`}>
        <button onClick={() => { scrollToHero(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
            </svg>
          </div>
          <span className="font-semibold text-[17px] text-white tracking-tight -mb-0.5">Somyra</span>
        </button>
        <div className="hidden md:flex items-center gap-5">
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="landing-nav-link">
            Explore
          </button>
          <div className="relative group/tools">
            <button className="landing-nav-link flex items-center gap-1">
              Features
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[280px] rounded-xl border border-white/[0.08] bg-[#0D0D0D] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] opacity-0 invisible group-hover/tools:opacity-100 group-hover/tools:visible transition-all duration-200 z-50">
              <Link to="/linkedin-post-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-all text-left">
                <PenTool className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white leading-tight">Post Generator</p>
                  <p className="text-[12px] text-[#999] leading-tight mt-0.5">Write posts that sound like you</p>
                </div>
              </Link>
              <Link to="/linkedin-profile-audit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-all text-left">
                <UserCircle className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white leading-tight">Profile Audit</p>
                  <p className="text-[12px] text-[#999] leading-tight mt-0.5">Fix your profile to attract opportunity</p>
                </div>
              </Link>
              <Link to="/linkedin-dm-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-all text-left">
                <Send className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white leading-tight">DM Generator</p>
                  <p className="text-[12px] text-[#999] leading-tight mt-0.5">Turn cold DMs into warm conversations</p>
                </div>
              </Link>
              <Link to="/linkedin-hook-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-all text-left">
                <Sparkles className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white leading-tight">Hook Generator</p>
                  <p className="text-[12px] text-[#999] leading-tight mt-0.5">Hooks that actually grab attention</p>
                </div>
              </Link>
              <Link to="/linkedin-topic-generator" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#141414] transition-all text-left">
                <FileText className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-white leading-tight">Topic Generator</p>
                  <p className="text-[12px] text-[#999] leading-tight mt-0.5">Never wonder what to post again</p>
                </div>
              </Link>
            </div>
          </div>
          <button onClick={() => { setShowPricingModal(true); }} className="landing-nav-link">
            Pricing
          </button>
          <button onClick={() => { document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="landing-nav-link">
            FAQ
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setShowAuth(true); }}
            className="landing-nav-signin hidden sm:block"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
            className="landing-nav-cta"
          >
            Start for Free
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="landing-hamburger"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99] pt-20 px-4 md:hidden">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-[0_32px_64px_rgba(0,0,0,0.6)]" style={{ animation: 'fadeInDownMobile 0.25s ease forwards' }}>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Explore
              </button>
              <div className="px-4 py-3">
                <p className="type-overline text-[#888] mb-3">Features</p>
                <div className="flex flex-col gap-0.5">
                  <Link to="/linkedin-post-generator" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <PenTool className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>Post Generator</span>
                  </Link>
                  <Link to="/linkedin-profile-audit" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <UserCircle className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>Profile Audit</span>
                  </Link>
                  <Link to="/linkedin-dm-generator" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Send className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>DM Generator</span>
                  </Link>
                  <Link to="/linkedin-hook-generator" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Sparkles className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>Hook Generator</span>
                  </Link>
                  <Link to="/linkedin-topic-generator" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <FileText className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>Topic Generator</span>
                  </Link>
                </div>
              </div>
              <button
                onClick={() => { setShowPricingModal(true); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Pricing
              </button>
              <button
                onClick={() => { document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                FAQ
              </button>
              <hr className="border-white/[0.06] my-2" />
              <button
                onClick={() => { setAuthMode('login'); setShowAuth(true); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium text-white hover:bg-white/[0.04] transition-all"
              >
                Log in
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setShowAuth(true); setIsMobileMenuOpen(false); }}
                className="w-full text-center px-4 py-3.5 rounded-xl bg-[#2DD4BF] text-black font-semibold text-[15px] hover:shadow-[0_0_24px_rgba(45,212,191,0.3)] transition-all"
              >
                Start for Free
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
      {/* ── HERO ── */}
      <section id="landing-hero" className="relative flex flex-col items-center justify-center px-5 md:px-6 pt-[108px] md:pt-[130px] ds:pt-[164px] pb-10 md:pb-[60px] text-center overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-accent/[0.06] blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-[720px] w-full">
          {/* Badge — social proof with real headshots */}
          <div className="flex justify-center mb-6 sm:mb-8" style={{ animation: 'none' }}>
            <div className="inline-flex items-center gap-[10px] w-auto max-w-[calc(100vw-48px)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[999px] p-[6px_14px_6px_6px] shadow-[0_0_30px_rgba(45,212,191,0.04)] hover:shadow-[0_0_40px_rgba(45,212,191,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300" style={{ animation: 'trustPillDrop 0.6s ease-out 0.2s forwards', opacity: 0 }}>
              <div className="flex flex-row items-center pl-[4px]">
                <img src="/user-images/Alex.webp" alt="" width={28} height={28} className="w-[28px] h-[28px] max-[360px]:w-[24px] max-[360px]:h-[24px] rounded-full object-cover shadow-[0_0_0_2px_#0D0D0D]" loading="lazy" />
                <img src="/user-images/Ama.webp" alt="" width={28} height={28} className="w-[28px] h-[28px] max-[360px]:w-[24px] max-[360px]:h-[24px] rounded-full object-cover -ml-[10px] max-[360px]:-ml-[8px] shadow-[0_0_0_2px_#0D0D0D]" loading="lazy" />
                <img src="/user-images/Arora.webp" alt="" width={28} height={28} className="w-[28px] h-[28px] max-[360px]:w-[24px] max-[360px]:h-[24px] rounded-full object-cover -ml-[10px] max-[360px]:-ml-[8px] shadow-[0_0_0_2px_#0D0D0D]" loading="lazy" />
                <img src="/user-images/Charlie.webp" alt="" width={28} height={28} className="w-[28px] h-[28px] max-[360px]:w-[24px] max-[360px]:h-[24px] rounded-full object-cover -ml-[10px] max-[360px]:-ml-[8px] shadow-[0_0_0_2px_#0D0D0D]" loading="lazy" />
                <img src="/user-images/Lisa.webp" alt="" width={28} height={28} className="w-[28px] h-[28px] max-[360px]:w-[24px] max-[360px]:h-[24px] rounded-full object-cover -ml-[10px] max-[360px]:-ml-[8px] shadow-[0_0_0_2px_#0D0D0D]" loading="lazy" />
                <img src="/user-images/Mark.webp" alt="" width={28} height={28} className="w-[28px] h-[28px] max-[360px]:w-[24px] max-[360px]:h-[24px] rounded-full object-cover -ml-[10px] max-[360px]:-ml-[8px] shadow-[0_0_0_2px_#0D0D0D]" loading="lazy" />
              </div>
              <div className="w-[1px] h-[16px] bg-[rgba(255,255,255,0.1)] shrink-0" />
              <div className="flex flex-col gap-[1px] shrink-0">
                <span className="text-white text-[13px] max-[360px]:text-[12px] font-bold leading-[1.3] whitespace-nowrap">2,400+ founders</span>
                <span className="text-[#999] text-[11px] max-[360px]:text-[10px] font-normal whitespace-nowrap">building their brand on LinkedIn</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(36px,6vw,60px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white mb-5 opacity-0 animate-[fadeUp_0.7s_0.35s_ease_forwards]">
            Your LinkedIn sounds like everyone else.
            <br />
            Somyra makes it sound like{' '}
            <span className="text-teal-accent relative">you.
              <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-teal-accent/45 rounded-full origin-left scale-x-0 animate-[scale-in-x_0.5s_1s_ease_forwards]" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] md:text-[18px] text-[#999] max-w-[480px] mx-auto mb-10 opacity-0 animate-[fadeUp_0.7s_0.5s_ease_forwards]">
            Most AI tools strip your personality. Somyra learns your voice and writes like you on your best day.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 mb-5 opacity-0 animate-[fadeUp_0.7s_0.65s_ease_forwards]">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                id="hero-start-free"
                onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                className="inline-flex items-center justify-center gap-2 bg-teal-accent text-[#080808] font-bold text-[15px] px-7 py-3.5 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(45,212,191,0.3)] hover:opacity-90 active:translate-y-0 w-full sm:w-auto"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-medium text-[15px] px-7 py-3.5 rounded-xl border border-white/[0.07] transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white w-full sm:w-auto"
              >
                Watch it in action
              </button>
            </div>
            <div className="flex flex-row items-center justify-center gap-[6px] flex-nowrap text-[12px] text-[#999] whitespace-nowrap">
              <span className="inline-flex items-center gap-[4px]">No credit card</span>
              <span className="text-[#444] text-[10px]">·</span>
              <span className="inline-flex items-center gap-[4px] font-medium">Free forever</span>
              <span className="text-[#444] text-[10px]">·</span>
              <span className="inline-flex items-center gap-[4px]">Takes 30 seconds</span>
            </div>
          </div>
        </div>

        {/* Product Demo Video */}
        <div
          className="mt-10 sm:mt-[60px] relative z-10 w-full max-w-[860px] mx-auto opacity-0"
          style={{ animation: 'fadeUpVideo 0.7s 0.2s ease-out forwards' }}
        >
          <div
            className="w-full rounded-xl overflow-hidden bg-[#0D0D0D]"
            style={{
              border: '1px solid rgba(45,212,191,0.15)',
              boxShadow: '0 0 80px rgba(45,212,191,0.07), 0 0 160px rgba(45,212,191,0.03)'
            }}
          >
            {/* Browser chrome bar */}
            <div
              className="flex items-center h-9 px-3.5 bg-[#141414]"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
              </div>
              <span className="flex-1 text-center text-[12px] text-[#888] font-sans">
                somyra.online
              </span>
              <div className="w-[52px]" />
            </div>
            <div className="w-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/Somyra_postwriter_poster.webp"
                className="w-full block aspect-video"
                width={400}
                height={250}
                fetchpriority="high"
              >
                <source src="/Somyra_postwriter.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="w-full px-4 pt-5 md:pt-10 ds:pt-[60px] pb-[60px] md:pb-[70px] ds:pb-[100px] relative z-10">
        <div className="max-w-[896px] mx-auto">
          {/* Label */}
          <div className="text-center mb-6 sm:mb-8 ds:mb-10">
            <span className="type-overline text-[#2DD4BF]">
              WHAT YOU GET
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-[28px] ds:text-[40px] font-semibold text-white leading-[1.2] ds:leading-[1.15] tracking-tight text-center mb-5 sm:mb-6">
            Go from invisible to someone people<br />
            actually notice on LinkedIn.
          </h2>

          {/* Subtext */}
          <p className="text-[#888] text-base leading-[1.6] text-center mx-auto mb-8 sm:mb-10 ds:mb-12" style={{ maxWidth: '440px' }}>
            Three ways Somyra turns your LinkedIn into your biggest advantage.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 ds:grid-cols-3 gap-3 md:gap-5 ds:gap-6 max-w-[480px] ds:max-w-none mx-auto ds:mx-0">
            {[
              {
                icon: FileText,
                title: 'Write posts that sound like you',
                body: 'Pick a topic, choose your style, and get a post that sounds like you wrote it on your best day.'
              },
              {
                icon: UserCircle,
                title: 'Fix your profile to attract opportunity',
                body: 'Somyra audits every line of your profile and rewrites it so the right people reach out to you.'
              },
              {
                icon: MessageSquare,
                title: 'Send DMs that get real replies',
                body: 'Somyra writes personalized outreach that references each prospect and speaks to what actually matters to them.'
              }
            ].map((card, i) => (
              <div
                key={i}
                ref={useAnimationInView()}
                data-animate="fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                className="bg-[#0D0D0D] border border-white/[0.06] hover:border-[#2DD4BF]/20 rounded-[16px] p-5 md:p-7 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.05)]"
              >
                <div
                  className="w-9 h-9 ds:w-10 ds:h-10 rounded-[10px] flex items-center justify-center mb-4 shrink-0"
                  style={{ backgroundColor: 'rgba(45,212,191,0.08)' }}
                >
                  <card.icon className="w-[18px] h-[18px] ds:w-5 ds:h-5 text-[#2DD4BF]" />
                </div>
                <h3 className="font-semibold text-[17px] text-white mb-2 leading-snug">{card.title}</h3>
                <p className="text-[#888] text-[14px] leading-[1.7] flex-grow">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES (Value Proofs) ── */}
      <section 
        id="features"
        ref={useAnimationInView()}
        data-animate="fade-in-up"
        className="w-full px-4 py-8 md:py-[60px] ds:py-[80px] relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-5 sm:mb-6">
            <span className="text-[#2DD4BF] uppercase type-overline">
              EVERYTHING YOU NEED
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-8 sm:mb-10 ds:mb-12">
            Six tools that all write<br />
            in your voice.
          </h2>

          {/* Desktop: two-column grid | Mobile/Tablet: stacked */}
          <div className="flex flex-col gap-6 ds:grid ds:grid-cols-[1fr_2fr] ds:gap-8 ds:items-center">
            {/* ── Desktop vertical tab list ── */}
            <div className="hidden ds:flex ds:flex-col gap-1">
              {featureTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`flex items-start gap-3 w-full text-left rounded-[10px] transition-all duration-200 border-l-2 ${
                    activeFeatureTab === tab.id
                      ? 'bg-[#141414] border-l-[#2DD4BF] text-white shadow-[0_0_20px_rgba(45,212,191,0.06)]'
                      : 'bg-transparent border-l-transparent text-[#999] hover:bg-[#0D0D0D] hover:text-[#999]'
                  } ${activeFeatureTab === tab.id ? 'border border-[rgba(45,212,191,0.2)]' : 'border border-transparent'} px-5 py-[14px]`}
                >
                  <tab.icon className={`w-4 h-4 shrink-0 mt-0.5 ${activeFeatureTab === tab.id ? 'text-[#2DD4BF]' : 'text-[#444]'}`} />
                  <div className="min-w-0">
                    <span className="block text-[14px] font-medium leading-tight">{tab.label}</span>
                    <span className={`block text-[12px] leading-tight mt-0.5 ${activeFeatureTab === tab.id ? 'text-[#999]' : 'text-[#888]'}`}>
                      {tab.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Mobile/Tablet horizontal pills ── */}
            <div className="flex ds:hidden overflow-x-auto gap-2 snap-x no-scrollbar pb-2 -mx-4 px-4">
              {featureTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`shrink-0 snap-start rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeFeatureTab === tab.id
                      ? 'bg-[#141414] border border-[#2DD4BF] text-white'
                      : 'bg-[#141414] border border-white/[0.08] text-[#999]'
                  } px-3.5 py-2 md:px-4 md:py-2 text-[12px] md:text-[13px] font-medium`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Content Panel ── */}
            <div
              className="bg-[#0D0D0D] rounded-[16px] p-5 sm:p-8 md:p-9"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: '2px solid #2DD4BF'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "ease" }}
                >
                  <span className="text-[#2DD4BF] uppercase type-overline mb-3 block">{activeFeature.tag}</span>
                  <h3 className="font-semibold text-[18px] md:text-2xl text-white mb-4 leading-tight">{activeFeature.title}</h3>
                  <p className="text-[#A0A0A0] text-[14px] md:text-[15px] leading-[1.7] mb-6 max-w-full">{activeFeature.body}</p>
                  <div className="space-y-3">
                    {activeFeature.dots.map((dot, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#2DD4BF] mt-0.5 shrink-0" />
                        <span className="text-[13px] md:text-[15px] text-[#ccc] leading-[1.7]">{dot}</span>
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
         SECTION: HOW IT WORKS
         ════════════════════════════════════════ */}
      <section id="how-it-works" className="relative px-4 sm:px-6 py-8 md:py-[60px] ds:py-[80px] overflow-hidden">
        <div id="process" className="absolute -top-24" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-accent/[0.07] blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-[1060px] mx-auto relative z-10">
          {/* Label */}
          <div className="text-center mb-5">
            <span className="text-[#2DD4BF] uppercase type-overline">
              THE PROCESS
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-4 sm:mb-5">
            From signup to your first post.<br />
            Takes less than five minutes.
          </h2>

          {/* Subtext */}
          <p className="text-[#888] text-base leading-[1.6] text-center mx-auto mb-8 sm:mb-10 ds:mb-12" style={{ maxWidth: '420px' }}>
            No learning curve, no setup headache. Three steps and you are posting.
          </p>

          {/* Steps + connector */}
          <div className="relative z-0">
            {/* Desktop connector — behind cards, visible only in gaps */}
            <div className="absolute top-[18px] left-0 right-0 h-0 border-t border-dashed border-[rgba(45,212,191,0.2)] pointer-events-none -z-10 hidden ds:block" />

            {/* Step cards */}
            <div className="grid grid-cols-1 ds:grid-cols-3 gap-3 ds:gap-6 max-w-[480px] ds:max-w-none mx-auto ds:mx-0">
              {[
                {
                  num: '01',
                  title: 'Paste your LinkedIn profile',
                  body: 'Drop your profile URL. Somyra reads your About, Experience, and recent posts to understand exactly who you are.'
                },
                {
                  num: '02',
                  title: 'Teach Somyra your voice',
                  body: 'Add three of your best posts. Somyra learns your structure, your words, and what makes your writing yours.'
                },
                {
                  num: '03',
                  title: 'Generate content that wins',
                  body: 'Posts, DMs, profile rewrites, topic ideas. Everything sounding like you wrote it on your best day.'
                }
              ].map((step, i) => (
                <div
                  key={i}
                  ref={useAnimationInView()}
                  data-animate="fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  className="bg-[#0D0D0D] border border-white/[0.06] hover:border-[#2DD4BF]/15 rounded-[16px] p-5 md:p-7 flex flex-col transition-all duration-300 hover:shadow-[0_0_24px_rgba(45,212,191,0.05)]"
                >
                  {/* Step number circle */}
                  <div className="w-8 h-8 ds:w-9 ds:h-9 rounded-full flex items-center justify-center text-[12px] ds:text-[13px] font-semibold text-[#2DD4BF] mb-4 ds:mb-5 shrink-0"
                    style={{ backgroundColor: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)' }}>
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-[17px] text-white leading-snug mb-2">{step.title}</h3>
                  <p className="text-[#888] text-[14px] leading-[1.7] flex-grow">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video container — Coming Soon */}
          <div
            ref={useAnimationInView()}
            data-animate="fade-in-up"
            className="max-w-[860px] mx-auto mt-10 sm:mt-16"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', background: '#0D0D0D' }}
          >
            {/* Chrome bar */}
            <div className="h-9 bg-[#141414] flex items-center gap-2 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[12px] text-[#888] flex-1 text-center">app.somyra.ai</span>
            </div>

            {/* Placeholder area */}
            <div className="relative h-[200px] md:h-[380px] bg-[#080808] flex flex-col items-center justify-center gap-3 md:gap-4 overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Play button with pulse */}
              <div className="w-[52px] md:w-16 h-[52px] md:h-16 rounded-full flex items-center justify-center animate-[pulse-play_2s_ease-in-out_infinite] cursor-pointer"
                style={{ backgroundColor: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)' }}
              >
                <Play className="w-5 h-5 md:w-6 md:h-6 text-[#2DD4BF] ml-0.5" />
              </div>

              <div className="text-center">
                <p className="text-white text-[14px] md:text-base font-medium">Full product walkthrough</p>
                <p className="type-overline text-[#2DD4BF] mt-1">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="w-full px-4 py-8 md:py-[60px] ds:py-[80px] bg-[#0D0D0D] relative z-10 border-t border-white/5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-6 sm:mb-8 ds:mb-10">
            <span className="text-[#2DD4BF] uppercase type-overline">
              WHY SOMYRA
            </span>
          </div>

          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-4 sm:mb-5">
            Other tools cost more and<br />
            none of them write like you.
          </h2>

          <p className="text-[#888] text-base leading-[1.6] text-center mx-auto mb-8 sm:mb-10 ds:mb-12" style={{ maxWidth: '380px' }}>
            We did the research so you do not have to.
          </p>

          {/* Table with scroll + entrance animation */}
              <div
                ref={useAnimationInView()}
                data-animate="fade-in-up"
                className="w-full max-w-4xl mx-auto text-center mb-4"
              >
            <div className="min-w-[580px]">
              {/* Table container */}
              <div className="bg-[#0D0D0D] rounded-[16px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Header Row */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] bg-[#141414] text-[13px] font-semibold" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="p-[16px_20px] text-white">Features</div>
                  <div className="p-[16px_20px] text-center relative" style={{ background: 'rgba(45,212,191,0.06)', borderLeft: '1px solid rgba(45,212,191,0.15)', borderRight: '1px solid rgba(45,212,191,0.15)' }}>
                    <span className="px-[10px] py-[3px] rounded-full bg-[#2DD4BF] text-[#080808] type-overline mb-1.5 inline-block">
                      BEST VALUE
                    </span>
                    <div className="text-white">Somyra</div>
                    <span className="block text-[12px] text-[#2DD4BF] font-semibold">From $19/mo</span>
                  </div>
                  {[
                    { name: 'Taplio', price: '$69/mo' },
                    { name: 'Supergrow', price: '$19/mo' },
                    { name: 'MagicPost', price: '$27/mo' }
                  ].map((comp, idx) => (
                    <div key={idx} className="p-[16px_20px] text-center">
                      <div className="text-white">{comp.name}</div>
                      <span className="block text-[12px] text-[#999] font-normal">{comp.price}</span>
                    </div>
                  ))}
                </div>

                {/* Data Rows */}
                {[
                  { feature: 'Writes in your exact voice', somyra: true, others: [false, 'Limited', 'Basic AI'] },
                  { feature: 'Profile audit with rewrite', somyra: true, others: [false, false, false] },
                  { feature: 'Smart outreach with CRM', somyra: true, others: ['$199/mo', false, false] },
                  { feature: 'Voice learning from your posts', somyra: true, others: ['Basic', 'Basic', 'Basic'] },
                  { feature: 'Unlimited topic ideas', somyra: true, others: ['Limited', true, true] },
                  { feature: 'Account safe, no automation', somyra: true, others: ['At risk', true, true] },
                  { feature: 'Follow up sequences', somyra: true, others: ['Basic', false, false] },
                  { feature: 'ICP targeting tool', somyra: true, others: [false, false, false] },
                  { feature: 'Full AI included at base price', somyra: true, others: ['$69/mo', 'Limited', 'Basic'] },
                  { feature: 'Built specifically for LinkedIn', somyra: true, others: [false, false, false] }
                ].map((row, i) => {
                  const renderCell = (val: any, isSomyra: boolean) => {
                    if (val === true) {
                      return <div className="w-[22px] h-[22px] rounded-full bg-[#2DD4BF]/[0.15] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-[#2DD4BF]" /></div>;
                    }
                    if (val === false) {
                      return <div className="w-[22px] h-[22px] rounded-full bg-red-500/[0.1] flex items-center justify-center"><X className="w-3 h-3 text-[#EF4444]" /></div>;
                    }
                    if (val === 'At risk') {
                      return <div className="w-[22px] h-[22px] rounded-full bg-red-500/[0.1] flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-[#EF4444]" /></div>;
                    }
                    if (val.toString().startsWith('$')) {
                      return <span className="text-[13px] font-medium leading-snug text-[#999]">{val}</span>;
                    }
                    return <span className="text-[13px] text-[#999] leading-snug">{val}</span>;
                  };

                  return (
                    <div
                      key={i}
                      className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center min-h-[52px]"
                      style={{
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : '#0D0D0D',
                        borderBottom: i < 10 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                      }}
                    >
                      <div className="p-[16px_20px] text-[14px] text-[#ccc] font-normal">{row.feature}</div>
                      <div className="p-[16px_20px] flex flex-col items-center justify-center" style={{ background: 'rgba(45,212,191,0.03)', borderLeft: '1px solid rgba(45,212,191,0.15)', borderRight: '1px solid rgba(45,212,191,0.15)' }}>
                        {renderCell(row.somyra, true)}
                      </div>
                      {row.others.map((val, ci) => (
                        <div key={ci} className="p-[16px_20px] flex flex-col items-center justify-center">
                          {renderCell(val, false)}
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Summary Row */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center min-h-[52px] bg-[#141414]">
                  <div className="p-[16px_20px] text-[14px] font-semibold text-white">Starting price</div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center" style={{ background: 'rgba(45,212,191,0.03)', borderLeft: '1px solid rgba(45,212,191,0.15)', borderRight: '1px solid rgba(45,212,191,0.15)' }}>
                    <span className="text-[15px] font-bold text-[#2DD4BF]">$19/mo</span>
                  </div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center"><span className="text-[13px] text-[#999]">$69/mo</span></div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center"><span className="text-[13px] text-[#999]">$19/mo</span></div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center"><span className="text-[13px] text-[#999]">$27/mo</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile scroll hint */}
          <div className="text-right mt-2 ds:hidden">
            <span className="text-[12px] text-[#888]">Scroll to compare &rarr;</span>
          </div>

          <p className="mt-4 text-[11px] text-[#888] font-medium italic px-4">
            *AI features require $69/mo plan on Taplio.
          </p>

          {/* Bottom CTA */}
          <div className="mt-10 sm:mt-16 text-center">
            <div className="text-center mb-5">
              <span className="text-[#2DD4BF] uppercase type-overline">THE BOTTOM LINE</span>
            </div>
            <h3 className="font-semibold text-[24px] ds:text-[32px] text-white mb-5 leading-tight">
              More features. Lower price.<br />No risk to your account.
            </h3>
            <button
              onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
              className="px-9 py-[14px] bg-[#2DD4BF] text-black font-bold rounded-xl text-base hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02] w-full sm:w-auto"
            >
              Start for Free
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 9: PRICING PREVIEW
         ════════════════════════════════════════ */}
      <section 
        id="pricing-section"
        ref={useAnimationInView()}
        data-animate="fade-in-up"
        className="w-full px-4 sm:px-6 py-8 md:py-20 ds:py-24 relative z-10 border-t border-white/5"
      >
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <SectionLabel>PRICING</SectionLabel>
            <SectionHeading className="mb-6 sm:mb-8">
              Start free forever.<br />
              Upgrade when you need<br />
              more firepower.
            </SectionHeading>

            {/* Toggle */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 sm:gap-3 bg-[#141414] border border-[#1f1f1f] rounded-full p-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full type-caption font-semibold transition-all whitespace-nowrap ${
                    !isAnnual ? 'bg-white/10 text-white shadow-xl' : 'text-[#888] hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full type-caption font-semibold transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    isAnnual ? 'bg-teal-accent/10 text-teal-accent border border-teal-accent/20' : 'text-[#888] hover:text-white'
                  }`}
                >
                  Annual
                </button>
                {isAnnual && (
                  <span className="type-overline text-teal-accent font-semibold mr-1 sm:mr-2 animate-pulse whitespace-nowrap">Save up to 35%</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 ds:grid-cols-3 gap-4 ds:gap-6 items-start max-w-[420px] mx-auto ds:max-w-none ds:mx-0">
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
              onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
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

          <p className="text-center text-[#999] text-sm md:text-base mt-10 max-w-[672px] mx-auto leading-relaxed">
            Every plan comes with Post Writer, Profile Analysis, Topic Generator, Smart Outreach, and LinkedIn Preview. Move up or down anytime.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 10: TESTIMONIALS
         ════════════════════════════════════════ */}
      <section 
        ref={useAnimationInView()}
        data-animate="fade-in-up"
        className="w-full py-8 md:py-16 ds:py-24 relative overflow-hidden border-y border-white/5 bg-[#080808]"
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
              animation-duration: 28s;
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

        <div className="max-w-[896px] mx-auto px-5 sm:px-6 text-center mb-10 sm:mb-12 md:mb-16">
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
                    testimonials
                      .filter(t => {
                        const name = (t.user_name || '').trim();
                        const text = (t.content || '').trim();
                        const rating = Number(t.rating) || 0;
                        return name !== 'Anonymous' && name.length > 2 && text.length > 20 && rating > 0;
                      })
                      .map(t => ({
                        name: t.user_name,
                        title: t.user_title || 'LinkedIn User',
                        text: t.content,
                        badge: t.badge_text || 'VERIFIED USER'
                      })).concat(hardcodedReviewsRow1) : 
                    hardcodedReviewsRow1
                  ).slice(0, 5).map((review, idx) => (
                    <ReviewCard key={idx} review={review} idx={idx} />
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
                    testimonials
                      .filter(t => {
                        const name = (t.user_name || '').trim();
                        const text = (t.content || '').trim();
                        const rating = Number(t.rating) || 0;
                        return name !== 'Anonymous' && name.length > 2 && text.length > 20 && rating > 0;
                      })
                      .slice(5).map(t => ({
                        name: t.user_name,
                        title: t.user_title || 'LinkedIn User',
                        text: t.content,
                        badge: t.badge_text || 'VERIFIED USER'
                      })).concat(hardcodedReviewsRow2) : 
                    hardcodedReviewsRow2
                  ).slice(0, 5).map((review, idx) => (
                    <ReviewCard key={idx} review={review} idx={idx} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16 px-5 sm:px-0">
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 text-sm font-bold text-white hover:border-[#2DD4BF]/30 hover:text-[#2DD4BF] transition-all bg-white/5 active:scale-95"
          >
            Leave a Review
          </button>
        </div>
      </section>

      {/* ── SECTION 11: FAQ ── */}
      <section 
        id="faq-section"
        className="w-full px-4 sm:px-6 py-8 md:py-[60px] ds:py-[80px] relative z-10 border-t border-white/5"
      >
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-5 sm:mb-6 ds:mb-8">
            <span className="text-[#2DD4BF] uppercase type-overline">
              QUESTIONS
            </span>
          </div>

          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-8 sm:mb-10 ds:mb-12">
            Stuff people ask<br />
            before signing up.
          </h2>

          <div className="grid grid-cols-1 ds:grid-cols-2 gap-4">
            {faqData.map((item, i) => {
              const colIndex = i % 2;
              const rowIndex = Math.floor(i / 2);
              const delay = rowIndex * 80 + colIndex * 40;

              return (
                <div
                  key={i}
                  ref={useAnimationInView()}
                  data-animate="fade-in-up"
                  style={{ animationDelay: `${delay / 1000}s` }}
                >
                  <FaqItem
                    q={item.q}
                    a={item.a}
                    isOpen={openFaqIndex === i}
                    onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  />
                </div>
              );
            })}
          </div>

          {/* Still have questions? */}
          <div className="text-center mt-10 sm:mt-12">
            <p className="text-[13px] sm:text-[14px] text-[#999] mb-1">Still have questions?</p>
            <Link
              to="/contact"
              className="text-[#2DD4BF] text-[13px] sm:text-[14px] font-medium hover:underline transition-all"
            >
              Talk to us &rarr;
            </Link>
          </div>
        </div>
      </section>



      {/* ════════════════════════════════════════
         SECTION 12: GET IN TOUCH
         ════════════════════════════════════════ */}
      <section className="w-full px-4 sm:px-8 py-12 md:py-24 relative z-10 border-t border-white/5 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2DD4BF]/3 blur-[120px]" />
        </div>

        <div className="max-w-[480px] mx-auto relative">
          {/* Section label */}
          <div className="text-center mb-6">
            <span className="type-overline text-[#2DD4BF] tracking-[0.15em]">CONTACT</span>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold text-white leading-[1.15] tracking-tight mb-4">
              Have a question?<br />
              <span className="text-[#2DD4BF]">Just reach out.</span>
            </h2>
            <p className="text-[#888888] text-[15px] leading-relaxed max-w-[360px] mx-auto">
              No support tickets. No bots. You&rsquo;re talking directly to the founder.
            </p>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-[#999] backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>500+ founders helped</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-[#999] backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>4.9&star; avg rating</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-[#999] backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>&lt;4hr response time</span>
            </div>
          </div>

          {/* Contact card */}
          <div className="relative group mx-4 sm:mx-0">
            {/* Glow behind card */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#2DD4BF]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#141414] border border-white/[0.06] rounded-2xl p-8 sm:p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:border-white/[0.10] transition-all duration-300">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/40 to-transparent" />

              {/* Founder photo */}
              <div className="relative inline-block mb-5">
                <img
                  src="/images/founder.png"
                  alt="Shantanu Sharma"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#2DD4BF] flex items-center justify-center shadow-[0_0_12px_rgba(45,212,191,0.3)]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              {/* Name + title */}
              <h3 className="text-xl font-semibold text-white mb-0.5">Shantanu</h3>
              <p className="text-[#888888] text-sm mb-7">Founder, Somyra</p>

              {/* Divider */}
              <div className="w-12 h-[1px] bg-white/[0.06] mx-auto mb-7" />

              {/* Primary CTA */}
              <a
                href="mailto:somyra@proton.me"
                className="group/btn inline-flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#2DD4BF] text-[#080808] font-semibold text-[15px] rounded-xl hover:brightness-110 hover:shadow-[0_0_24px_rgba(45,212,191,0.25)] hover:scale-[1.02] active:scale-100 transition-all duration-200"
              >
                <Mail className="w-[18px] h-[18px]" />
                Send a Message
                <ArrowRight className="w-[18px] h-[18px] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </a>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#555555]" />
                <span className="text-[12px] text-[#555555] font-mono">somyra@proton.me</span>
                <span className="w-1 h-1 rounded-full bg-[#555555]" />
              </div>

              {/* Response time badge */}
              <div className="mt-6 pt-5 border-t border-white/[0.04]">
                <p className="text-[12px] text-[#555555] flex items-center justify-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Usually replies within a few hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
         SECTION 13: FINAL CTA
         ════════════════════════════════════════ */}
      <section className="w-full px-4 sm:px-8 ds:px-0 py-12 md:py-20 ds:py-[120px] text-center relative z-10 border-t border-white/5"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45,212,191,0.04) 0%, transparent 70%)'
        }}
      >
        <div className="max-w-[700px] mx-auto relative z-10">
          {/* Quote pill */}
          <div className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-[10px] px-4 py-2 rounded-[999px] bg-[#141414] border border-white/[0.08] max-w-[calc(100vw-48px)] overflow-hidden">
              <Star className="w-[14px] h-[14px] text-[#F59E0B] fill-[#F59E0B] shrink-0" />
              <span className="text-[13px] text-[#999] whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="hidden max-[400px]:inline">&ldquo;Sounds like me.&rdquo; <span className="text-white font-semibold">&mdash; James O.</span></span>
                <span className="max-[400px]:hidden">&ldquo;The first tool that actually sounds like me.&rdquo; <span className="text-white font-semibold">&mdash; James O.</span></span>
              </span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-[26px] sm:text-[32px] ds:text-[44px] font-semibold text-white leading-[1.2] mx-auto" style={{ maxWidth: '640px' }}>
              Every week you stay quiet is a week<br />
              someone else takes your spot.
            </h2>
          </div>

          {/* Subtext */}
          <div>
            <p className="text-[#999] text-base mt-4">
              Start free forever. No credit card. Takes 30 seconds.
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <button
              onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
              className="mt-8 px-12 py-4 bg-[#2DD4BF] text-[#080808] font-bold text-[17px] rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-100 transition-all duration-200 btn-glow w-full sm:w-auto"
            >
              Start for Free
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-4">
            <div className="flex flex-row items-center justify-center gap-4 flex-nowrap max-[360px]:gap-[10px]">
              <div className="inline-flex items-center gap-[5px] whitespace-nowrap text-[12px] max-[360px]:text-[11px] text-[#999]">
                <Lock className="w-[13px] h-[13px] max-[360px]:w-[11px] max-[360px]:h-[11px] text-[#2DD4BF] shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="inline-flex items-center gap-[5px] whitespace-nowrap text-[12px] max-[360px]:text-[11px] text-[#999]">
                <Infinity className="w-[13px] h-[13px] max-[360px]:w-[11px] max-[360px]:h-[11px] text-[#2DD4BF] shrink-0" />
                <span>Free forever</span>
              </div>
              <div className="inline-flex items-center gap-[5px] whitespace-nowrap text-[12px] max-[360px]:text-[11px] text-[#999]">
                <Zap className="w-[13px] h-[13px] max-[360px]:w-[11px] max-[360px]:h-[11px] text-[#2DD4BF] shrink-0" />
                <span>30 second signup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#141414] border-t border-white/5 border-l-4 border-l-[#2DD4BF] px-4 md:px-6 py-3 md:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]"
          >
            <p className="text-white text-[13px] sm:text-sm font-medium text-center sm:text-left">Start building your brand today for free.</p>
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
    </main>
    </div>
    </>
  );
};
