/**
 * LandingPage - top-level page component for somyra.online/
 * Renders the above-the-fold content eagerly. Mid-fold (social proof,
 * six tools, how-it-works, comparison) and below-fold (pricing,
 * testimonials, FAQ, get in touch, final CTA, footer) are split into
 * separate chunks via React.lazy and loaded after first paint.
 *
 * State management: all 9 useState hooks stay in the root component.
 * Mid/below chunks are presentational and receive state via props.
 *
 * SSR support: the prerender script can pass eager-loaded versions of
 * LandingMid / LandingBelow via _midEager / _belowEager props so that
 * the initial HTML contains the full rendered content for SEO.
 */
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';
import { useAnimationInView } from '../hooks/useAnimationInView';
import {
  FileText, UserCircle, MessageSquare, PenTool, Search, Sparkles, Send, Mic, Bookmark,
  Check, X, Menu, ChevronRight, Star, Plus, Mail, Users, Clock, Globe, Shield, Zap,
  Target, ArrowRight, Crown, ChevronDown, Loader2, Lock, AlertTriangle, Play, Infinity
} from 'lucide-react';
import type { LandingMidProps } from './landing/LandingMid';
import type { LandingBelowProps } from './landing/LandingBelow';

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
  _midEager?: React.ComponentType<LandingMidProps>;
  _belowEager?: React.ComponentType<LandingBelowProps>;
}

const LazyLandingMid = lazy(() => import('./landing/LandingMid').then(m => ({ default: m.LandingMid })));
const LazyLandingBelow = lazy(() => import('./landing/LandingBelow').then(m => ({ default: m.LandingBelow })));

const Counter = ({ value, label }: { value: string; label: string }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '').trim();
  const nodeRef = useRef(null);
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000;
    let animationStarted = false;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * numericValue);
      setCount(currentCount);
      if (progress < 1) requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          requestAnimationFrame(animate);
        } else if (!entry.isIntersecting) {
          animationStarted = false;
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [numericValue]);
  return (
    <div ref={nodeRef} className="flex flex-col items-center justify-start text-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px] h-full py-4 relative">
      <div className="flex items-baseline gap-0.5">
        <span className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold text-white leading-none tracking-tight">{count}</span>
        <span className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-[#2DD4BF] leading-none tracking-tight">{suffix}</span>
      </div>
      <span className="text-[#888] text-[11px] sm:text-[12px] mt-2 sm:mt-3 tracking-wide leading-tight uppercase">{label}</span>
    </div>
  );
};

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
  user,
  _midEager,
  _belowEager,
}: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState('post-writer');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [bottomBarDismissed, setBottomBarDismissed] = useState(() => {
    try {
      return localStorage.getItem('somyra_bottom_bar_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (bottomBarDismissed || user) return;
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.6) setShowBottomBar(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bottomBarDismissed, user]);

  const dismissBottomBar = () => {
    setShowBottomBar(false);
    setBottomBarDismissed(true);
    try { localStorage.setItem('somyra_bottom_bar_dismissed', 'true'); } catch {}
  };

  const scrollToHero = () => {
    const hero = document.getElementById('landing-hero');
    if (hero) hero.scrollIntoView({ behavior: 'smooth' });
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

  const MidComponent = _midEager || LazyLandingMid;
  const BelowComponent = _belowEager || LazyLandingBelow;

  const midProps: LandingMidProps = {
    activeFeatureTab,
    setActiveFeatureTab,
    onSignupClick: () => { setAuthMode('signup'); setShowAuth(true); },
  };
  const belowProps: LandingBelowProps = {
    isAnnual,
    setIsAnnual,
    openFaqIndex,
    setOpenFaqIndex,
    testimonials,
    loadingTestimonials,
    showReviewModal,
    setShowReviewModal,
    user,
    isGenerating,
    setIsGenerating,
    showResult,
    setShowResult,
    onSignupClick: () => { setAuthMode('signup'); setShowAuth(true); },
    onShowPricingModal: () => setShowPricingModal(true),
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-teal-accent/30">
      <SEO
        title="Somyra | AI LinkedIn Copilot for Founders and Executives"
        description="Somyra writes LinkedIn posts in your voice, audits your profile, and automates outreach. Build authority without spending hours on content."
        canonical="https://somyra.online/"
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://somyra.online/#organization",
            "name": "Somyra",
            "url": "https://somyra.online",
            "logo": "https://somyra.online/og-image.webp",
            "description": "Somyra writes LinkedIn posts in your voice, audits your profile, and automates outreach.",
            "sameAs": ["https://linkedin.com/company/somyra"]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://somyra.online/#website",
            "url": "https://somyra.online",
            "name": "Somyra",
            "publisher": { "@id": "https://somyra.online/#organization" }
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Somyra",
            "description": "AI LinkedIn copilot for founders and executives",
            "brand": { "@id": "https://somyra.online/#organization" },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "0",
              "highPrice": "39",
              "priceCurrency": "USD"
            }
          }
        ]}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'
        }`}
      >
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="landing-hamburger"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* ΓöÇΓöÇ MOBILE MENU ΓöÇΓöÇ */}
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
      </header>

      <main>
        <section id="landing-hero" className="relative flex flex-col items-center justify-center px-5 md:px-6 pt-[108px] md:pt-[130px] ds:pt-[164px] pb-10 md:pb-[60px] text-center overflow-hidden">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-accent/[0.06] blur-[120px] rounded-full pointer-events-none z-0" />
          <div className="relative z-10 max-w-[720px] w-full">
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

            <h1 className="text-[clamp(36px,6vw,60px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white mb-5">
              Your LinkedIn sounds like everyone else.
              <br />
              Somyra makes it sound like{' '}
              <span className="text-teal-accent relative">you.
                <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-teal-accent/45 rounded-full origin-left scale-x-0 animate-[scale-in-x_0.5s_1s_ease_forwards]" />
              </span>
            </h1>

            <p className="text-[16px] md:text-[18px] text-[#999] max-w-[480px] mx-auto mb-10 opacity-0 animate-[fadeUp_0.7s_0.5s_ease_forwards]">
              Most AI tools strip your personality. Somyra learns your voice and writes like you on your best day.
            </p>

            <div className="flex flex-col items-center gap-4 mb-5 opacity-0 animate-[fadeUp_0.7s_0.65s_ease_forwards]">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  id="hero-start-free"
                  type="button"
                  onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                  className="inline-flex items-center justify-center gap-2 bg-teal-accent text-[#080808] font-bold text-[15px] px-7 py-3.5 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(45,212,191,0.3)] hover:opacity-90 active:translate-y-0 w-full sm:w-auto"
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
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
        </section>

        <Suspense fallback={<div className="min-h-[60vh] bg-[#080808]" />}>
          <MidComponent {...midProps} />
        </Suspense>

        <Suspense fallback={<div className="min-h-[60vh] bg-[#080808]" />}>
          <BelowComponent {...belowProps} />
        </Suspense>
      </main>

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
                onClick={() => { dismissBottomBar(); scrollToHero(); }}
                className="px-5 py-2 bg-[#2DD4BF] text-black font-bold rounded-lg text-xs hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all"
              >
                Claim Them
              </button>
              <button onClick={dismissBottomBar} className="p-1.5 text-[#888] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
