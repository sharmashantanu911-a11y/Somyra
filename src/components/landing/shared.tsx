/**
 * Shared helpers and constants used by LandingPage and its lazy-loaded
 * mid/below sections. Centralized here so chunks don't duplicate definitions.
 */
import React, { useRef, useEffect } from 'react';
import { useAnimationInView } from '../../hooks/useAnimationInView';
import {
  PenTool, UserCircle, Sparkles, Send, Mic, Bookmark,
  Plus, Check, Star,
} from 'lucide-react';

export interface FeatureTabData {
  id: string;
  label: string;
  desc: string;
  tag: string;
  title: string;
  body: string;
  dots: string[];
  icon: any;
}

export const featureTabs: FeatureTabData[] = [
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

export const faqData = [
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
    a: 'Zero contracts. Cancel from your dashboard in one click, anytime. You keep access until the end of your billing period. No fees, no questions, no hassle.'
  },
  {
    q: 'Who is Somyra built for?',
    a: 'Founders, executives, consultants, and sales pros who want LinkedIn to work for them without spending hours every week. If your personal brand brings in business, Somyra is built for you.'
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'You will see a warning before you hit it so there are no surprises. When you do, upgrade instantly from your dashboard or wait for the next month. Nothing gets deleted. Your Voice Profile, saved content, and settings stay exactly where they are.'
  }
];

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

export const hardcodedReviewsRow1 = [
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

export const hardcodedReviewsRow2 = [
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
    badge: "RECRUITER INBOUND WEEKLY"
  },
  {
    name: "Adam Klein",
    title: "Founder at B2B Marketplace",
    text: "Best 19 dollars I spend every month. I went from 12 inbound leads a quarter to over 40. Somyra paid for itself in the first week.",
    badge: "3X INBOUND LEADS"
  }
];

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    ref={useAnimationInView()}
    data-animate="fade-in-up"
    className="type-overline text-[#2DD4BF] mb-5 md:mb-7"
  >
    {children}
  </p>
);

export const SectionHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2
    ref={useAnimationInView()}
    data-animate="fade-in-up"
    className={`type-display text-white ${className}`}
  >
    {children}
  </h2>
);

export const ReviewCard: React.FC<{ review: typeof hardcodedReviewsRow1[0]; idx: number }> = ({ review, idx }) => (
  <div className="min-w-[260px] md:min-w-[320px] max-w-[360px] bg-[#141414] border border-white/[0.06] rounded-[14px] p-4 md:p-6 flex flex-col shadow-xl relative overflow-hidden group hover:border-[#2DD4BF]/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent" />
    <div className="flex gap-1 mb-3 md:mb-4">
      {[...Array(5)].map((_, s) => (
        <Star key={s} className="w-3 md:w-4 h-3 md:w-4 text-[#F59E0B] fill-[#F59E0B]" />
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

export const FaqItem: React.FC<{ q: string; a: string; isOpen: boolean; onToggle: () => void }> = ({ q, a, isOpen, onToggle }) => {
  return (
    <div
      className={`faq-item bg-[#0D0D0D] rounded-[12px] ds:rounded-[16px] overflow-hidden${isOpen ? ' is-open' : ''}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 ds:p-[20px_24px] text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="faq-q text-[14px] ds:text-[15px] font-medium leading-[1.4] pr-4">
          {q}
        </span>
        <span className="faq-icon shrink-0 w-6 h-6 ds:w-7 ds:h-7 rounded-full flex items-center justify-center">
          <span className="faq-icon-inner">
            <Plus className="w-3 h-3 ds:w-3.5 ds:h-3.5 text-[#999]" />
          </span>
        </span>
      </button>
      <div className="faq-panel">
        <div className="faq-panel-inner">
          <p className="text-[13px] ds:text-[14px] text-[#888] leading-[1.8] px-4 ds:px-6 pb-4 ds:pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
};

export const PricingCard: React.FC<{
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
}> = ({
  name, monthlyPrice, annualPrice, annualBilling, savings, subtext, badge,
  features, excluded, buttonLabel, buttonStyle, cardStyle, isAnnual, onClick
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
