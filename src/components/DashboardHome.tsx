import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Sparkles, 
  PenTool, 
  UserCircle, 
  Send, 
  Bookmark, 
  Crown, 
  Bolt, 
  Star, 
  Plus, 
  Clock, 
  ChevronRight, 
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Linkedin,
  Check,
  X,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Search,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LandingPage } from './LandingPage';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  linkedin_url?: string;
  star_rating: number;
  usage_context?: string;
  created_at: string;
}

interface DashboardHomeProps {
  user: any;
  isPro: boolean;
  isMax: boolean;
  stats: { posts: number; topics: number; profiles: number };
  voicePostsCount: number;
  usageLimits: any;
  setActiveTab: (tab: any) => void;
  setShowAuth: (show: boolean) => void;
  onUpgrade: () => void;
  setToast: (toast: any) => void;
}

const FeatureCard = ({ icon: Icon, name, tier, description, time, onClick, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + delay }}
      onClick={onClick}
      className="group relative flex min-h-[208px] cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#141414] p-4 transition-all duration-300 active:translate-y-0 hover:-translate-y-0.5 hover:border-[#2DD4BF] hover:shadow-[0_0_20px_rgba(45,212,191,0.08)] md:min-h-[224px] md:p-6"
    >
      {/* Subtle gradient on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-[#2DD4BF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-2.5 bg-[#2DD4BF]/10 rounded-[10px] md:rounded-xl w-9 h-9 md:w-auto md:h-auto flex items-center justify-center">
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#2DD4BF]" />
          </div>
          <h3 className="text-white font-semibold text-sm md:text-base">{name}</h3>
        </div>
        <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
          tier === 'PRO' ? 'bg-[#FFB800]/10 text-[#FFB800]' : 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
        }`}>
          {tier}
        </span>
      </div>

      <p className="flex-grow text-[13px] leading-6 text-[#888888] md:text-sm md:leading-7">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2DD4BF] md:text-[13px]">
          Start creating
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#555555] md:text-xs">
          <Clock className="w-3.5 h-3.5" />
          {time}
        </div>
      </div>
    </motion.div>
  );
};

const StatCounter = ({ value, label, delay }: { value: number; label: string; delay: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 1500;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={countRef} className="bg-[#141414] border border-[#1f1f1f] rounded-[10px] md:rounded-xl p-4 md:p-5 text-center flex-1 min-w-[200px]">
      <div className="text-[#2DD4BF] text-2xl md:text-3xl font-extrabold mb-1">
        {count}+
      </div>
      <div className="text-[#888888] text-xs md:text-[13px]">{label}</div>
    </div>
  );
};

export const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  user, 
  isPro, 
  isMax,
  stats, 
  voicePostsCount, 
  usageLimits,
  setActiveTab,
  setShowAuth,
  onUpgrade,
  setToast
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Usage tracking logic for sticky banner
  const getNearingLimitFeature = () => {
    if (!user || isMax) return null;
    
    const features: ('profile_audit' | 'topic_generator' | 'post_writer' | 'smart_outreach')[] = 
      ['profile_audit', 'topic_generator', 'post_writer', 'smart_outreach'];
    
    // Safety check for usageLimits
    if (!usageLimits || !usageLimits.getStatus) return null;

    const statuses = features.map(f => ({ name: f, ...usageLimits.getStatus(f) }));
    
    const nearing = statuses
      .filter(s => s.limit !== 'unlimited' && s.limit > 0)
      .sort((a, b) => (a.remaining / (a.limit as number)) - (b.remaining / (b.limit as number)));
      
    if (nearing.length > 0 && nearing[0].remaining <= 2) {
      return nearing[0];
    }
    return null;
  };
  
  const nearingLimit = getNearingLimitFeature();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialError, setTestimonialError] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ 
    name: '',
    title: '',
    quote: '',
    linkedin_url: '',
    star_rating: 5,
    usage_context: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const trackEvent = (eventName: string, params?: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    setTestimonialError(null);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      console.error('Failed to fetch testimonials:', err);
      setTestimonialError('Could not load reviews right now.');
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (reviewForm.quote.length < 10) {
      setReviewError('Review must be at least 10 characters.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    
    try {
      // Strip LinkedIn URL if provided
      let cleanLinkedin = reviewForm.linkedin_url.trim();
      if (cleanLinkedin) {
        cleanLinkedin = cleanLinkedin.replace(/\/$/, ''); // remove trailing slash
        if (!cleanLinkedin.startsWith('http')) {
          cleanLinkedin = `https://${cleanLinkedin}`;
        }
      }

      const { error } = await supabase
        .from('testimonials')
        .insert([{
          name: reviewForm.name,
          title: reviewForm.title,
          quote: reviewForm.quote,
          linkedin_url: cleanLinkedin || null,
          star_rating: reviewForm.star_rating,
          usage_context: reviewForm.usage_context || null,
          user_id: user.id,
          approved: false
        }]);
      
      if (error) throw error;
      
      setReviewSuccess(true);
      trackEvent('review_submitted', { 
        rating: reviewForm.star_rating,
        has_linkedin: !!cleanLinkedin
      });
      if (cleanLinkedin) {
        trackEvent('review_linkedin_added');
      }

      // Reset form after success
      setReviewForm({
        name: '',
        title: '',
        quote: '',
        linkedin_url: '',
        star_rating: 5,
        usage_context: ''
      });
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setToast({
        type: 'error',
        headline: 'Submission Failed',
        subtext: 'Something went wrong. Please try again or reach out to Shantanu on LinkedIn.',
        action: {
          label: 'Retry',
          onClick: () => setShowReviewModal(true)
        },
        secondaryAction: {
          label: 'Contact Support',
          href: 'https://www.linkedin.com/in/sharmashantanu911'
        }
      });
      setShowReviewModal(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  const firstName = user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : '';

  const dailyTips = [
    "Posts between 7am and 9am get 20% more reach.",
    "Your first line is all most people see — make it impossible to scroll past.",
    "Comment on 10 posts before publishing yours to boost algorithm reach.",
    "Posts with a specific number in the first line get 37% more engagement.",
    "Your headline gets searched more than your posts — update it every 90 days.",
    "Posts ending with a genuine question get 3x more comments.",
    "3 posts per week for 3 months beats one viral post."
  ];
  const currentDayTip = dailyTips[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

  const features = [
    { id: 'profile', icon: Globe, name: "Know exactly why your profile isn't converting", tier: 'FREE', description: 'Understand your LinkedIn positioning and get personalized insights.', time: '30 sec' },
    { id: 'topics', icon: Sparkles, name: 'Never stare at a blank screen again', tier: 'FREE', description: 'Never run out of ideas. Get 5 story-driven topics tailored to your niche.', time: '20 sec' },
    { id: 'writer', icon: PenTool, name: 'Posts that sound like you. Not like ChatGPT.', tier: 'FREE', description: 'Write scroll-stopping posts in your exact voice using Voice Profile.', time: '45 sec' },
    { id: 'outreach', icon: Send, name: 'DMs that get replies. Not ignored.', tier: 'FREE', description: 'Craft personalized outreach messages that actually get replies.', time: '25 sec' },
    { id: 'saved', icon: Bookmark, name: 'Your best work, always one click away', tier: 'PRO', description: 'Your personal content collection. Save your best posts and access them anytime.', time: 'Instant' },
  ];

  const sections = [
    // SECTION 1: HERO
    <section key="hero" className="flex flex-col items-center pt-8 pb-6 text-center md:pt-12 md:pb-16">
      <div className="inline-flex items-center gap-2.5 px-3 md:px-4 py-1.5 rounded-full border border-[#2DD4BF]/40 bg-gradient-to-br from-[#2DD4BF]/[0.08] to-[#2DD4BF]/[0.03] backdrop-blur-[10px] shadow-[inset_0_0_20px_rgba(45,212,191,0.1)] mb-8 md:mb-10">
        <div className="w-1.5 h-1.5 bg-[#2DD4BF] rounded-full animate-pulse shadow-[0_0_6px_#2DD4BF]" />
        <span className="text-[10px] md:text-[11px] font-semibold text-[#2DD4BF] uppercase tracking-[2px] md:tracking-[3px]">AI-POWERED LINKEDIN COPILOT</span>
      </div>

      <h1 className="text-[28px] md:text-[40px] lg:text-[60px] font-extrabold text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
        {user ? `Welcome back, ${firstName}` : 'LinkedIn is the highest-ROI channel for founders. Most are wasting it.'}
      </h1>

      <p className="mb-10 max-w-full text-[15px] leading-8 text-[#888888] md:mb-12 md:max-w-[720px] md:text-lg lg:text-xl">
        {user ? 'What are we creating today?' : 'Stop staring at a blank screen and posting generic AI content. Somyra is your strategic copilot that writes in your exact voice to build a personal brand that converts.'}
      </p>

      {!user ? (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-4.5 bg-[#2DD4BF] text-black font-bold rounded-xl md:rounded-2xl text-base md:text-lg hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-all transform hover:scale-[1.02] active:scale-100"
            >
              Start for Free
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-4.5 bg-transparent border border-[#333333] text-white rounded-xl md:rounded-2xl text-base md:text-lg hover:border-[#2DD4BF] hover:text-[#2DD4BF] transition-all"
            >
              See How it Works
            </button>
          </div>
          <p className="text-[#555555] text-[12px] md:text-sm font-medium tracking-wide">
            Used by founders in 10+ countries. No credit card required.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {[
            { label: 'Posts Generated', value: stats.posts },
            { label: 'Topics Created', value: stats.topics },
            { label: 'Profiles Analyzed', value: stats.profiles },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-full border border-[#1f1f1f] bg-[#141414] px-4 py-2 md:px-5 md:py-2.5 text-[12px] md:text-[14px]">
              <span className="text-[#2DD4BF] font-bold">{stat.value}</span>
              <span className="text-[#888888]">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/30 to-transparent mt-16 md:mt-24" />
    </section>,

    // SECTION 1.5: PROBLEM SECTION
    !user && (
      <section key="problem" className="py-12 md:py-24 border-t border-white/5">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            LinkedIn should be your #1 growth channel. <br className="hidden md:block" />
            <span className="text-[#2DD4BF]">Here's why it isn't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "You don't know what to post",
              desc: "You open LinkedIn, stare at the screen, close it. Every. Single. Day.",
              icon: Search
            },
            {
              title: "Your profile isn't doing the work",
              desc: "Recruiters, clients and investors visit your profile and leave. You never know why.",
              icon: UserCircle
            },
            {
              title: "Your outreach gets ignored",
              desc: "Copy-paste DMs get copy-paste results. Zero replies. Zero meetings.",
              icon: MessageSquare
            }
          ].map((card, i) => (
            <div key={i} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 hover:border-[#2DD4BF]/30 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2DD4BF]/10 transition-colors">
                <card.icon className="w-6 h-6 text-[#888888] group-hover:text-[#2DD4BF] transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
              <p className="text-[#888888] leading-relaxed italic">"{card.desc}"</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg md:text-xl font-semibold text-white/80">
            Somyra fixes all three. <span className="text-[#2DD4BF]">In one place.</span>
          </p>
        </div>
      </section>
    ),

    // SECTION 2: FEATURE CARDS
    <section key="features" id="features" className="py-8 md:py-16">
      <h2 className="text-white font-bold text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8">What do you want to create today?</h2>
      
      {isPro ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="bg-teal-accent/10 border border-teal-accent/20 rounded-full px-6 py-2.5 flex items-center gap-3 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
            <Crown className="w-5 h-5 text-teal-accent fill-teal-accent/20" />
            <span className="text-teal-accent font-bold tracking-wide">
              {isMax ? 'MAX MEMBER — FULL UNLIMITED ACCESS' : 'PRO MEMBER — UNLIMITED ACCESS'}
            </span>
          </div>
        </motion.div>
      ) : (
        /* Generation Limit Bar */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 md:mb-16"
        >
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl md:rounded-[2rem] p-6 md:p-10 relative overflow-hidden group">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-accent/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-teal-accent/10 transition-all duration-700" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-accent/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex-grow space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <Bolt className="w-5 h-5 text-teal-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {usageLimits.tier === 'guest'
                          ? `${usageLimits.getRemainingCount('profile_audit')} free generations left`
                          : nearingLimit 
                            ? (nearingLimit.name === 'profile_audit' ? `Only ${nearingLimit.remaining} Profile Audits left` :
                               nearingLimit.name === 'post_writer' ? `Only ${nearingLimit.remaining} Post Writers left` :
                               nearingLimit.name === 'smart_outreach' ? `Only ${nearingLimit.remaining} outreach messages left` :
                               `Only ${nearingLimit.remaining} Topic Generators left`)
                            : `System Active`}
                      </h3>
                      <p className="text-xs text-[#888888] mt-0.5">
                        {user && nearingLimit
                         ? `${isPro ? (nearingLimit.name === 'smart_outreach' ? 'Max gives you 1000.' : 'Max gives you Unlimited.') : 
                             (nearingLimit.name === 'profile_audit' ? 'Pro gives you 30.' : 
                              nearingLimit.name === 'post_writer' ? 'Pro gives you 60.' : 
                              nearingLimit.name === 'smart_outreach' ? 'Pro gives you 500.' : 
                              'Pro gives you Unlimited.')}`
                         : user ? usageLimits.getResetDate() 
                         : `Sign up to unlock higher limits.`}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-2xl font-black text-white/20 tracking-tighter">
                      {usageLimits.getStatus('profile_audit').limit === 'unlimited' 
                        ? '∞' 
                        : `${usageLimits.getRemainingCount('profile_audit')}/${usageLimits.getStatus('profile_audit').limit}`}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
                    {/* Shimmer Effect */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-10"
                    />
                    
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: (nearingLimit || usageLimits.getStatus('profile_audit')).limit === 'unlimited' 
                          ? '100%' 
                          : `${((nearingLimit || usageLimits.getStatus('profile_audit')).remaining / ((nearingLimit || usageLimits.getStatus('profile_audit')).limit as number)) * 100}%` 
                      }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                      className={`h-full rounded-full relative z-0 shadow-[0_0_15px_rgba(45,212,191,0.2)] ${
                        (nearingLimit || usageLimits.getStatus('profile_audit')).limit === 'unlimited' || (nearingLimit || usageLimits.getStatus('profile_audit')).remaining > 5 
                          ? 'bg-teal-accent' 
                          : (nearingLimit || usageLimits.getStatus('profile_audit')).remaining >= 2 
                            ? 'bg-orange-500' 
                            : 'bg-red-500'
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${(nearingLimit || usageLimits.getStatus('profile_audit')).isLimitReached ? 'bg-red-500' : 'bg-teal-accent animate-pulse'}`} />
                        <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest">
                          {(nearingLimit || usageLimits.getStatus('profile_audit')).isLimitReached ? 'Limit Reached' : 'System Active'}
                        </span>
                      </div>
                      {((nearingLimit || usageLimits.getStatus('profile_audit')).remaining <= 2 && (nearingLimit || usageLimits.getStatus('profile_audit')).remaining > 0 && (nearingLimit || usageLimits.getStatus('profile_audit')).limit !== 'unlimited') && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 text-orange-500"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Running Low</span>
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest">
                      {(nearingLimit || usageLimits.getStatus('profile_audit')).limit === 'unlimited' 
                        ? '100% Available' 
                        : `${Math.round(((nearingLimit || usageLimits.getStatus('profile_audit')).remaining / ((nearingLimit || usageLimits.getStatus('profile_audit')).limit as number)) * 100)}% Available`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={user ? onUpgrade : () => setShowAuth(true)}
                  className="group relative px-8 py-4 bg-teal-accent text-black rounded-2xl text-sm font-bold transition-all overflow-hidden hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transform hover:scale-[1.02] active:scale-100"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {user ? <Crown className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {user ? 'Upgrade to Pro' : 'Sign Up Free'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </button>
                {user && (
                  <p className="text-[10px] text-center text-[#555555] font-medium">
                    Unlimited saves & deep mode included
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {features.map((feature, i) => (
          <FeatureCard 
            key={feature.id} 
            {...feature} 
            delay={i * 0.08} 
            onClick={() => setActiveTab(feature.id)}
          />
        ))}
      </div>
    </section>,

    // SECTION 3: VOICE PROFILE BANNER
    user && voicePostsCount === 0 && (
      <section key="voice-banner" className="py-6 md:py-8">
        <div className="bg-gradient-to-br from-[#2DD4BF]/[0.06] to-[#2DD4BF]/[0.02] border border-[#2DD4BF]/20 rounded-2xl md:rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 bg-[#2DD4BF]/10 rounded-2xl">
              <Crown className="w-8 h-8 text-[#2DD4BF]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg md:text-xl">Unlock your true voice</h3>
              <p className="text-[#888888] text-[14px] md:text-base leading-relaxed">Add your sample posts and Somyra will write in your exact style — not generic AI.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('voice')}
            className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] font-bold rounded-xl md:rounded-2xl hover:bg-[#2DD4BF]/20 transition-all text-sm md:text-base whitespace-nowrap"
          >
            Set Up Voice Profile
          </button>
        </div>
      </section>
    ),

    // SECTION 4: GENERATION LIMIT BAR
    !isPro && (
      <section key="limit-bar" id="pricing" className="py-4 md:py-6">
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-[10px] md:rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="p-2 bg-[#2DD4BF]/10 rounded-lg">
              <Bolt className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <div className="flex-grow w-full">
              <h3 className="text-white font-semibold text-[13px] md:text-sm mb-2 text-center md:text-left">
                {usageLimits.tier === 'guest'
                  ? `${usageLimits.getRemainingCount('profile_audit')} free generations left — Sign up to unlock more`
                  : nearingLimit 
                    ? (nearingLimit.name === 'profile_audit' ? `Only ${nearingLimit.remaining} Profile Audits left this month. ${isPro ? 'Max gives you Unlimited.' : 'Pro gives you 30.'}` :
                       nearingLimit.name === 'post_writer' ? `Only ${nearingLimit.remaining} Post Writers left this month. ${isPro ? 'Max gives you Unlimited.' : 'Pro gives you 60.'}` :
                       nearingLimit.name === 'smart_outreach' ? `Only ${nearingLimit.remaining} outreach messages left this month. ${isPro ? 'Max gives you 1000.' : 'Pro gives you 500.'}` :
                       `Only ${nearingLimit.remaining} Topic Generators left this month. ${isPro ? 'Max gives you Unlimited.' : 'Pro gives you Unlimited.'}`)
                    : `System Active — ${usageLimits.getResetDate()}`}
              </h3>
              <div className="w-full h-1 md:h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    (nearingLimit || usageLimits.getStatus('profile_audit')).limit === 'unlimited' 
                      ? 'bg-[#2DD4BF]'
                      : ((nearingLimit || usageLimits.getStatus('profile_audit')).remaining < ((nearingLimit || usageLimits.getStatus('profile_audit')).limit as number / 2)) ? 'bg-[#FF6B6B]' : 'bg-[#2DD4BF]'
                  }`}
                  style={{ 
                    width: (nearingLimit || usageLimits.getStatus('profile_audit')).limit === 'unlimited' 
                      ? '100%' 
                      : `${((nearingLimit || usageLimits.getStatus('profile_audit')).remaining / ((nearingLimit || usageLimits.getStatus('profile_audit')).limit as number)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => user ? onUpgrade() : setShowAuth(true)}
            className="w-full md:w-auto px-6 py-2 border border-[#2DD4BF] text-[#2DD4BF] font-semibold rounded-[10px] md:rounded-xl hover:bg-[#2DD4BF]/5 transition-all text-[13px] md:text-base"
          >
            {user ? 'Upgrade to Pro' : 'Sign Up Free'}
          </button>
        </div>
      </section>
    ),

    // SECTION 5: STATS BANNER (Logged out only)
    !user && (
      <section key="stats-banner" className="py-6 md:py-12">
        <div className="flex flex-row md:flex-wrap justify-start md:justify-center gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar">
          <StatCounter value={2400} label="Posts that got replies, not just likes" delay={0} />
          <StatCounter value={24} label="Avg. engagement increase reported by Pro users" delay={0.1} />
          <StatCounter value={10} label="Countries using Somyra" delay={0.2} />
        </div>
        <p className="text-center text-[#888888] text-xs md:text-sm font-medium mt-4 md:mt-6">
          Join professionals from 10+ countries including India, USA, Germany and Canada already using Somyra.
        </p>
      </section>
    ),

    // SECTION 6: SOCIAL PROOF TESTIMONIALS
    (loadingTestimonials || testimonials.length > 0 || testimonialError) && (
      <section key="testimonials" className="py-8 md:py-16">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-white font-bold text-lg md:text-2xl lg:text-3xl">What happens when your LinkedIn finally works</h2>
          {testimonials.length > 0 && (
            <button 
              onClick={() => {
                setShowReviewModal(true);
                trackEvent('review_modal_opened');
              }}
              className="hidden md:flex items-center gap-2 text-[#2DD4BF] text-sm md:text-base font-bold hover:underline"
            >
              <Star className="w-5 h-5" />
              Leave a Review
            </button>
          )}
        </div>

        {testimonialError ? (
          <div className="text-[#888888] text-sm italic py-4">{testimonialError}</div>
        ) : loadingTestimonials ? (
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 no-scrollbar">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#141414] border border-[#1f1f1f] rounded-[10px] md:rounded-xl p-4 md:p-6 min-w-[280px] md:min-w-[360px] h-[200px] animate-pulse">
                <div className="w-24 h-4 bg-[#1f1f1f] rounded mb-4" />
                <div className="w-full h-3 bg-[#1f1f1f] rounded mb-2" />
                <div className="w-4/5 h-3 bg-[#1f1f1f] rounded mb-6" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1f1f1f] rounded-full" />
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-[#1f1f1f] rounded" />
                    <div className="w-24 h-2 bg-[#1f1f1f] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 snap-x no-scrollbar">
            {testimonials.slice(0, 3).map((t) => {
              const rawUrl = t.linkedin_url?.trim();
              let finalUrl = rawUrl;
              let isLinkedin = false;

              if (finalUrl && finalUrl !== '') {
                if (!finalUrl.startsWith('http')) {
                  finalUrl = `https://${finalUrl}`;
                }
                isLinkedin = finalUrl.toLowerCase().includes('linkedin.com');
              }

              const renderName = () => {
                if (finalUrl && finalUrl !== '') {
                  try {
                    // Basic validation check
                    new URL(finalUrl);
                    return (
                      <a 
                        href={finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold text-[13px] md:text-sm hover:text-[#2DD4BF] hover:underline transition-all duration-200 decoration-[#2DD4BF]"
                      >
                        {t.name}
                      </a>
                    );
                  } catch (e) {
                    return <span className="text-white font-semibold text-[13px] md:text-sm">{t.name}</span>;
                  }
                }
                return <span className="text-white font-semibold text-[13px] md:text-sm">{t.name}</span>;
              };

              return (
                <div 
                  key={t.id} 
                  className="bg-[#141414] border border-[#1f1f1f] rounded-[10px] md:rounded-xl p-4 md:p-6 min-w-[280px] md:min-w-0 snap-start flex flex-col hover:border-[#2DD4BF]/30 transition-all group"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < t.star_rating ? 'text-[#2DD4BF] fill-[#2DD4BF]' : 'text-[#333333]'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-[#CCCCCC] text-[13px] md:text-[15px] italic leading-relaxed flex-grow mb-6">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-[10px] flex-wrap mt-auto pt-4 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2DD4BF]/20 to-[#2DD4BF]/5 flex items-center justify-center text-[#2DD4BF] font-bold text-sm shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-[6px] flex-wrap">
                        {renderName()}
                        {isLinkedin && (
                          <>
                            <a 
                              href={finalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View LinkedIn profile"
                              className="text-[#0A66C2] hover:text-[#0077B5] transition-colors"
                            >
                              <Linkedin className="w-[14px] h-[14px] fill-current" />
                            </a>
                            <div 
                              className="text-[#2DD4BF] cursor-help"
                              title="Verified LinkedIn profile"
                            >
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-[#888888] text-[12px] line-clamp-1">{t.title}</div>
                      <div className="text-[#2DD4BF] text-[11px] font-bold mt-0.5">
                        {t.usage_context || "3x replies in first week"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-center mt-8 md:mt-12">
          <button 
            onClick={() => {
              setShowReviewModal(true);
              trackEvent('review_modal_opened');
            }}
            className="group flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 rounded-full text-white font-bold text-sm md:text-base hover:bg-[#2DD4BF] hover:text-black hover:border-[#2DD4BF] transition-all duration-300 shadow-xl"
          >
            <Star className="w-5 h-5 text-[#2DD4BF] group-hover:text-black transition-colors" />
            {testimonials.length === 0 ? 'Be the first to leave a review' : 'Leave a Review'}
          </button>
        </div>
      </section>
    ),

    // SECTION 7: HOW IT WORKS
    <section key="how-it-works" id="how-it-works" className="py-10 md:py-20">
      <h2 className="text-white font-bold text-lg md:text-2xl lg:text-3xl text-center mb-10 md:mb-16">How Somyra works</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-16 relative">
        {/* Connecting Lines (Desktop) */}
        <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#2DD4BF]/30 z-0" />
        
        {[
          { 
            num: 1, 
            title: 'Analyze Your Profile', 
            desc: 'Paste your LinkedIn profile — Somyra reads your positioning, niche, and gaps in 30 seconds' 
          },
          { 
            num: 2, 
            title: 'Set Your Voice', 
            desc: 'Add 3-10 of your best posts — Somyra learns your exact voice, not a generic AI voice' 
          },
          { 
            num: 3, 
            title: 'Create and Grow', 
            desc: 'Generate posts, DMs, and profile rewrites that sound exactly like you wrote them at your best' 
          },
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center flex-1 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#2DD4BF] bg-[#080808] flex items-center justify-center text-[#2DD4BF] font-extrabold text-base md:text-xl mb-4 md:mb-6">
              {step.num}
            </div>
            <h3 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4">{step.title}</h3>
            <p className="text-[#888888] text-[14px] md:text-base leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>,

    // SECTION 7.5: COMPETITOR COMPARISON
    !user && (
      <section key="comparison" className="py-12 md:py-24 border-t border-white/5">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Why not just use ChatGPT or other AI Tools?</h2>
          <p className="text-[#888888] max-w-2xl mx-auto italic">"AI content sounds like a robot." We agree.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
          {/* Generic AI Side */}
          <div className="bg-[#1a1313] p-10 md:p-16 border-b md:border-b-0 md:border-r border-white/5 relative group">
            <div className="absolute top-8 left-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <X className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-10 text-center uppercase tracking-widest">ChatGPT / Generic AI</h3>
            <ul className="space-y-6">
              {[
                "Sounds like AI wrote it",
                "No LinkedIn context",
                "No voice learning",
                "No outreach tools",
                "No profile strategy",
                "You need 10 different tools"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-[#888888] opacity-60">
                   <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                   {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Somyra Side */}
          <div className="bg-[#0D1F1E] p-10 md:p-16 relative group">
            <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <CheckCircle2 className="w-12 h-12 text-[#2DD4BF]" />
            </div>
            <h3 className="text-xl font-bold text-[#2DD4BF] mb-10 text-center uppercase tracking-widest">Somyra</h3>
            <ul className="space-y-6">
              {[
                "Sounds exactly like you",
                "Built only for LinkedIn",
                "Learns your writing style",
                "Smart Outreach built in",
                "Full profile strategy",
                "Everything in one place"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-white font-medium">
                   <Check className="w-5 h-5 text-[#2DD4BF]" />
                   {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    ),

    // SECTION 8: DAILY TIP
    <section key="daily-tip" className="py-8 md:py-16">
      <div className="bg-[#0D1F1E] border border-[#2DD4BF]/15 rounded-2xl md:rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
        <div className="p-4 bg-[#2DD4BF]/10 rounded-2xl shrink-0">
          <Lightbulb className="w-8 h-8 md:w-10 md:h-10 text-[#2DD4BF]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg md:text-xl mb-2 md:mb-3">Pro Tip of the Day — {dayName}</h3>
          <p className="text-[#CCCCCC] text-[14px] md:text-base leading-relaxed">{currentDayTip}</p>
        </div>
      </div>
    </section>,

    // SECTION 8.5: URGENCY / FOMO
    !user && (
      <section key="urgency" className="py-12 md:py-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
          While you're thinking about it, <br />
          your competitors are posting.
        </h2>
        <p className="text-[#888888] text-[15px] md:text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
          LinkedIn rewards consistency. The founders who show up every week 
          are the ones getting inbound. Not the smartest ones. Not the most experienced. 
          <span className="text-white font-bold"> The most consistent ones.</span>
        </p>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
          <TrendingUp className="w-5 h-5 text-[#2DD4BF]" />
          <span className="text-sm md:text-base font-medium">
            Top 1% of LinkedIn creators post 4x per week. <span className="text-[#2DD4BF] font-bold text-lg">Somyra users average 3.8x.</span>
          </span>
        </div>
      </section>
    ),

    // SECTION 9: FINAL CTA BANNER (Logged out only)
    !user && (
      <section key="final-cta" className="py-10 md:py-20">
        <div className="bg-gradient-to-br from-[#2DD4BF]/[0.08] to-[#2DD4BF]/[0.03] border border-[#2DD4BF]/30 rounded-2xl md:rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden group">
          {/* Animated background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2DD4BF]/10 blur-[100px] group-hover:bg-[#2DD4BF]/20 transition-all duration-700 rounded-full" />
          
          <h2 className="text-[28px] md:text-[48px] font-extrabold text-white mb-6 leading-tight relative z-10 tracking-tight">
            Your next client is already on LinkedIn. <br />
            Are you showing up?
          </h2>
          <p className="text-white/80 text-[16px] md:text-xl font-bold mb-10 max-w-2xl mx-auto relative z-10">
            Build your authority. Own your niche. Starting today.
          </p>
          <button 
            onClick={() => setShowAuth(true)}
            className="w-full md:w-auto px-12 py-5 bg-[#2DD4BF] text-black font-black rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all transform hover:scale-[1.05] active:scale-100 mb-8 relative z-10"
          >
            Start Free — No Card Needed
          </button>
          
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="flex items-center gap-2 text-[#555555] text-xs font-bold uppercase tracking-widest">
              <Check className="w-4 h-4" /> No Credit Card Required
              <span className="mx-2">•</span>
              <Check className="w-4 h-4" /> 5 Free Generations to Start
            </div>
          </div>
        </div>
      </section>
    )
  ];

  // ─── For guests, render the full landing page ───
  if (!user) {
    return (
      <div className="w-full min-w-0">
        <LandingPage
          setActiveTab={setActiveTab}
          setShowAuth={setShowAuth}
          setShowPricingModal={onUpgrade}
          testimonials={testimonials}
          loadingTestimonials={loadingTestimonials}
          showReviewModal={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          user={user}
        />

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="overlay-shell z-[100] p-0 md:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { if (!submittingReview) { setShowReviewModal(false); setReviewSuccess(false); setReviewError(null); } }}
                className="overlay-backdrop bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="overlay-content w-full max-w-[576px] max-h-[90vh] bg-[#0F0F0F] border border-[#1f1f1f] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 md:px-10 md:py-6 border-b border-white/5 shrink-0">
                  <h2 className="text-lg font-bold text-white">Leave a Review</h2>
                  <button onClick={() => { setShowReviewModal(false); setReviewSuccess(false); setReviewError(null); }} className="p-2 text-muted hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 md:px-10 md:py-8 overflow-y-auto flex-grow">
                  <p className="text-[#888] text-sm mb-6">Your feedback helps other founders discover Somyra.</p>
                  {reviewSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 text-teal-accent mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                      <p className="text-[#888] text-sm">Your review has been submitted and will appear after approval.</p>
                    </div>
                  ) : (
                    <form id="review-form" onSubmit={handleReviewSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Your Name</label><input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} required placeholder="Full name" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all" /></div>
                        <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Title / Role</label><input value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Founder at Acme" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all" /></div>
                      </div>
                      <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Your Review</label><textarea value={reviewForm.quote} onChange={e => setReviewForm(p => ({ ...p, quote: e.target.value }))} required rows={4} placeholder="What has Somyra helped you with?" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all resize-none" /></div>
                      <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">LinkedIn Profile (optional)</label><input value={reviewForm.linkedin_url} onChange={e => setReviewForm(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="linkedin.com/in/yourname" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all" /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Rating</label><div className="flex gap-1">{[1,2,3,4,5].map(s => (<button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, star_rating: s }))} className="p-1"><Star className={`w-6 h-6 ${s <= reviewForm.star_rating ? 'text-[#FFB800] fill-[#FFB800]' : 'text-[#333]'}`} /></button>))}</div></div>
                        <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Context</label><select value={reviewForm.usage_context} onChange={e => setReviewForm(p => ({ ...p, usage_context: e.target.value }))} className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm focus:border-teal-accent outline-none transition-all appearance-none"><option value="" className="bg-[#0F0F0F]">Select context...</option><option value="Personal Branding" className="bg-[#0F0F0F]">Personal Branding</option><option value="Client Content" className="bg-[#0F0F0F]">Client Content</option><option value="Job Hunting" className="bg-[#0F0F0F]">Job Hunting</option><option value="Company Page" className="bg-[#0F0F0F]">Company Page</option></select></div>
                      </div>
                      {reviewError && (<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{reviewError}</div>)}
                    </form>
                  )}
                </div>
                {!reviewSuccess && (
                  <div className="p-6 md:px-10 md:py-6 border-t border-white/5 bg-[#0F0F0F] shrink-0">
                    <button type="submit" form="review-form" disabled={submittingReview} className="w-full py-4 bg-[#2DD4BF] text-black font-extrabold rounded-2xl text-base hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                      {submittingReview ? (<><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>) : 'Submit My Review'}
                    </button>
                    <p className="text-center text-[10px] text-[#555555] mt-4 font-medium">By submitting, you agree to let us feature your review on our website.</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── For logged-in users, render the dashboard ───
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8 md:space-y-12">
      {sections.map((section, i) => (
        section && (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
          >
            {section}
          </motion.div>
        )
      ))}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="overlay-shell z-[100] p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!submittingReview) { setShowReviewModal(false); setReviewSuccess(false); setReviewError(null); } }}
              className="overlay-backdrop bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="overlay-content w-full max-w-xl max-h-[90vh] bg-[#0F0F0F] border border-[#1f1f1f] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 md:px-10 md:py-6 border-b border-white/5 shrink-0">
                <h2 className="text-lg font-bold text-white">Leave a Review</h2>
                <button onClick={() => { setShowReviewModal(false); setReviewSuccess(false); setReviewError(null); }} className="p-2 text-muted hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 md:px-10 md:py-8 overflow-y-auto flex-grow">
                <p className="text-[#888] text-sm mb-6">Your feedback helps other founders discover Somyra.</p>
                {reviewSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-teal-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                    <p className="text-[#888] text-sm">Your review has been submitted and will appear after approval.</p>
                  </div>
                ) : (
                  <form id="review-form" onSubmit={handleReviewSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Your Name</label><input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} required placeholder="Full name" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all" /></div>
                      <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Title / Role</label><input value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Founder at Acme" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all" /></div>
                    </div>
                    <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Your Review</label><textarea value={reviewForm.quote} onChange={e => setReviewForm(p => ({ ...p, quote: e.target.value }))} required rows={4} placeholder="What has Somyra helped you with?" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all resize-none" /></div>
                    <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">LinkedIn Profile (optional)</label><input value={reviewForm.linkedin_url} onChange={e => setReviewForm(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="linkedin.com/in/yourname" className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm placeholder:text-[#555] focus:border-teal-accent focus:ring-1 focus:ring-teal-accent/20 outline-none transition-all" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Rating</label><div className="flex gap-1">{[1,2,3,4,5].map(s => (<button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, star_rating: s }))} className="p-1"><Star className={`w-6 h-6 ${s <= reviewForm.star_rating ? 'text-[#FFB800] fill-[#FFB800]' : 'text-[#333]'}`} /></button>))}</div></div>
                      <div><label className="text-xs font-bold text-[#555] uppercase tracking-wider mb-2 block">Context</label><select value={reviewForm.usage_context} onChange={e => setReviewForm(p => ({ ...p, usage_context: e.target.value }))} className="w-full px-4 py-3 bg-[#141414] border border-[#1f1f1f] rounded-xl text-white text-sm focus:border-teal-accent outline-none transition-all appearance-none"><option value="" className="bg-[#0F0F0F]">Select context...</option><option value="Personal Branding" className="bg-[#0F0F0F]">Personal Branding</option><option value="Client Content" className="bg-[#0F0F0F]">Client Content</option><option value="Job Hunting" className="bg-[#0F0F0F]">Job Hunting</option><option value="Company Page" className="bg-[#0F0F0F]">Company Page</option></select></div>
                    </div>
                    {reviewError && (<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{reviewError}</div>)}
                  </form>
                )}
              </div>
              {!reviewSuccess && (
                <div className="p-6 md:px-10 md:py-6 border-t border-white/5 bg-[#0F0F0F] shrink-0">
                  <button type="submit" form="review-form" disabled={submittingReview} className="w-full py-4 bg-[#2DD4BF] text-black font-extrabold rounded-2xl text-base hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                    {submittingReview ? (<><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>) : 'Submit My Review'}
                  </button>
                  <p className="text-center text-[10px] text-[#555555] mt-4 font-medium">By submitting, you agree to let us feature your review on our website.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SQL REMINDER:
// ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS star_rating integer DEFAULT 5;
// ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS usage_context text;
// ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS linkedin_url text;
// ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;
// 
// ADMIN REMINDER:
// To approve a review, go to Supabase Dashboard -> Table Editor -> testimonials
// Set 'approved' to true for the reviews you want to show on the homepage.

