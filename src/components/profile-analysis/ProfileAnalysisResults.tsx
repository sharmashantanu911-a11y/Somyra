import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Check,
  Copy,
  Eye,
  FileText,
  Loader2,
  Lock,
  PenTool,
  RefreshCw,
  RotateCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import { regenerateProfileSection } from '../../services/aiService';

const hasText = (value?: string | null) => typeof value === 'string' && value.trim().length > 0;
const hasObjectContent = (value?: Record<string, any> | null) =>
  !!value &&
  Object.values(value).some((entry) =>
    typeof entry === 'string'
      ? hasText(entry)
      : Array.isArray(entry)
        ? entry.length > 0
        : entry && typeof entry === 'object'
          ? hasObjectContent(entry as Record<string, any>)
          : typeof entry === 'number'
            ? entry > 0
            : false
  );
const formatLabel = (value: string) =>
  value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

function Section({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[#101010] p-5 sm:p-7">
      <div className="mb-5 space-y-2">
        {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.22em] text-teal-accent/80">{eyebrow}</p>}
        <h3 className="text-2xl font-black text-white sm:text-[30px]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function RewriteCard({
  id,
  title,
  strategy,
  body,
  copied,
  handleCopy,
  icon: Icon,
  onRegenerate,
  isRegenerating,
  isLocked
}: {
  id: string;
  title: string;
  strategy?: string;
  body: string;
  copied: string | null;
  handleCopy: (text: string, id: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  isLocked?: boolean;
}) {
  const canRegenerate = (id === 'headline' || id === 'about') && onRegenerate;

  return (
    <div className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5 sm:p-6 transition-all duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-accent/10">
            <Icon className="h-5 w-5 text-teal-accent" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-accent">{title}</p>
              {isLocked && canRegenerate && (
                <div className="group relative">
                  <Lock className="h-3 w-3 text-[#555555]" />
                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 scale-0 rounded-lg bg-black px-2 py-1 text-[10px] font-bold text-white transition-transform group-hover:scale-100 whitespace-nowrap z-10 border border-white/10 shadow-xl">
                    Upgrade to Pro to unlock unlimited regenerations.
                  </div>
                </div>
              )}
            </div>
            {hasText(strategy) && <p className="mt-2 text-sm leading-7 text-[#9a9a9a]">{strategy}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canRegenerate && (
            <button
              type="button"
              disabled={isRegenerating}
              onClick={onRegenerate}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#d4d4d4] transition-all hover:bg-white/10 hover:border-teal-accent/30 group relative ${isRegenerating ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isRegenerating ? (
                <Loader2 className="h-4 w-4 animate-spin text-teal-accent" />
              ) : (
                <RotateCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
              )}
              {isLocked && !isRegenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <Lock className="h-3 w-3 text-white/50" />
                </div>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => handleCopy(body, id)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#d4d4d4] hover:bg-white/10"
          >
            {copied === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-teal-accent/14 bg-teal-accent/[0.05] p-5 relative overflow-hidden">
        {isRegenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#0d1514]/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20"
          >
            <Loader2 className="h-6 w-6 animate-spin text-teal-accent mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-accent">Regenerating {title}...</p>
          </motion.div>
        )}
        <p className="whitespace-pre-wrap text-base leading-8 text-white">{body}</p>
      </div>
    </div>
  );
}

export function ProfileAnalysisResults(props: {
  profile: any;
  deepForm: any;
  quickForm: any;
  copied: string | null;
  handleCopy: (text: string, id: string) => void;
  scoreDelta: number | null;
  randomInsight: string;
  isPro: boolean;
  setProfile: (profile: any) => void;
  setProfileMode: (mode: 'quick' | 'strategic') => void;
  setDeepStep: React.Dispatch<React.SetStateAction<number>>;
  setShowPricingModal: (show: boolean) => void;
  setActiveTab: (tab: any) => void;
  triggerAnalyze: () => void;
  usageLimits: any;
}) {
  const {
    profile,
    deepForm,
    quickForm,
    copied,
    handleCopy,
    scoreDelta,
    randomInsight,
    isPro,
    setProfile,
    setProfileMode,
    setDeepStep,
    setShowPricingModal,
    setActiveTab,
    triggerAnalyze,
    usageLimits
  } = props;

  const [regeneratingHeadline, setRegeneratingHeadline] = useState(false);
  const [regeneratingAbout, setRegeneratingAbout] = useState(false);

  const usageStatus = usageLimits?.getStatus('profile_audit');
  const isLimitReached = usageStatus?.isLimitReached;

  const handleRegenerate = async (section: 'headline' | 'about') => {
    console.log('Regenerating:', section);
    // 1. Check limit
    if (isLimitReached) {
      setShowPricingModal(true);
      return;
    }

    // 2. Set loading
    if (section === 'headline') setRegeneratingHeadline(true);
    else setRegeneratingAbout(true);

    try {
      // 3. Prepare data
      const isQuick = profile.mode === 'quick';
      const originalInput = isQuick 
        ? (section === 'headline' ? quickForm.currentHeadline || quickForm.whoAreYou : quickForm.aboutSection || quickForm.whoAreYou)
        : (section === 'headline' ? deepForm.headline || deepForm.role : deepForm.about || deepForm.role);
      
      const previousContent = section === 'headline' ? profile.headline : profile.about;
      
      const primaryAudience = isQuick ? quickForm.primaryAudience : deepForm.primaryAudience;
      const secondaryAudience = isQuick ? quickForm.secondaryAudience : deepForm.secondaryAudience;

      // 4. Call AI
      const newCopy = await regenerateProfileSection(section, originalInput, previousContent, primaryAudience, secondaryAudience);

      // 5. Update local profile state
      if (newCopy && newCopy !== "Generation failed. Please try again.") {
        const updatedProfile = { ...profile };
        if (section === 'headline') {
          updatedProfile.headline = newCopy;
          // Sync with Strategic Rewrites (Array)
          if (Array.isArray(updatedProfile.rewrites)) {
             updatedProfile.rewrites = updatedProfile.rewrites.map((r: any) => 
               r.section === 'Headline' ? { ...r, suggested: newCopy } : r
             );
          } 
          // Sync with Quick Rewrites (Object)
          else if (updatedProfile.rewrites && typeof updatedProfile.rewrites === 'object') {
            updatedProfile.rewrites = { ...updatedProfile.rewrites, headline: newCopy };
          }
        } else {
          updatedProfile.about = newCopy;
          // Sync with Strategic Rewrites (Array)
          if (Array.isArray(updatedProfile.rewrites)) {
             updatedProfile.rewrites = updatedProfile.rewrites.map((r: any) => 
               r.section === 'About' ? { ...r, suggested: newCopy } : r
             );
          }
          // Sync with Quick Rewrites (Object)
          else if (updatedProfile.rewrites && typeof updatedProfile.rewrites === 'object') {
            // Update both possible field names for robust mapping
            updatedProfile.rewrites = { 
              ...updatedProfile.rewrites, 
              aboutSection: newCopy,
              about: newCopy 
            };
          }
        }
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error(`Failed to regenerate ${section}:`, err);
    } finally {
      if (section === 'headline') setRegeneratingHeadline(false);
      else setRegeneratingAbout(false);
    }
  };

  const isStrategic = profile.mode === 'strategic';
  const roleLabel = deepForm.role || quickForm.whoAreYou.split(' ')[0] || 'professional';
  const statusTone =
    profile.overallScore >= 85
      ? 'text-green-400 border-green-500/20 bg-green-500/10'
      : profile.overallScore >= 70
        ? 'text-teal-accent border-teal-accent/20 bg-teal-accent/10'
        : profile.overallScore >= 50
          ? 'text-amber-400 border-amber-500/20 bg-amber-500/10'
          : 'text-red-400 border-red-500/20 bg-red-500/10';
  const statusLabel =
    profile.overallScore >= 85 ? 'Elite' : profile.overallScore >= 70 ? 'Strong' : profile.overallScore >= 50 ? 'Average' : 'Needs Work';

  const quickRewrites = !Array.isArray(profile.rewrites) && profile.rewrites
    ? {
        headline: profile.rewrites.headline || profile.headline || '',
        headlineStrategy: profile.rewrites.headlineStrategy || '',
        about: profile.rewrites.aboutSection || profile.rewrites.about || profile.about || '',
        aboutStrategy: profile.rewrites.aboutStrategy || profile.rewrites.aboutSectionStrategy || ''
      }
    : !isStrategic
      ? {
          headline: profile.headline || profile.quickFix?.improvedHeadline || '',
          headlineStrategy: profile.quickFix?.headlineStrategy || '',
          about: profile.about || profile.quickFix?.improvedAbout || profile.quickFix?.aboutDirection || '',
          aboutStrategy: profile.quickFix?.aboutStrategy || profile.biggestMissedOpportunity || profile.quickFix?.aboutDirection || ''
        }
      : null;
  const strategicRewrites = Array.isArray(profile.rewrites) ? profile.rewrites : [];
  const primaryRewrites = strategicRewrites.filter((rewrite: any) => rewrite.section === 'Headline' || rewrite.section === 'About');
  const extraRewrites = strategicRewrites.filter((rewrite: any) => rewrite.section !== 'Headline' && rewrite.section !== 'About');

  const rewriteCards = quickRewrites
    ? [
        {
          id: 'headline',
          title: 'HEADLINE',
          body: quickRewrites.headline,
          strategy: quickRewrites.headlineStrategy,
          icon: PenTool
        },
        {
          id: 'about',
          title: 'ABOUT SECTION',
          body: quickRewrites.about,
          strategy: quickRewrites.aboutStrategy,
          icon: FileText
        }
      ]
    : primaryRewrites.map((rewrite: any) => ({
        id: rewrite.section.toLowerCase() === 'headline' ? 'headline' : 'about',
        title: rewrite.section.toLowerCase() === 'headline' ? 'HEADLINE' : 'ABOUT SECTION',
        body: rewrite.suggested,
        strategy: rewrite.strategy,
        icon: rewrite.section === 'Headline' ? PenTool : FileText
      }));

  const firstImpressions = hasObjectContent(profile.firstImpression)
    ? [
        { label: 'Recruiter', value: profile.firstImpression.recruiter, icon: Search },
        { label: 'Client', value: profile.firstImpression.client, icon: Briefcase },
        { label: 'Peer', value: profile.firstImpression.peer, icon: Users }
      ].filter((item) => hasText(item.value))
    : [];

  const lensEntries = hasObjectContent(profile.lenses) ? Object.entries(profile.lenses) : [];
  const scoreEntries = profile.scores ? Object.entries(profile.scores).filter(([key]) => key !== 'coherence') : [];
  const shareText = `I just got a ${profile.overallScore}/100 Somyra profile audit.\n\nVerdict: ${profile.verdict}\n\nTry it at ${window.location.origin}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-[1200px] space-y-6 pb-12">
      <div className="flex flex-col gap-3 rounded-[24px] border border-white/8 bg-[#0d0d0d] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setProfile(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-teal-accent/20 bg-teal-accent/10 px-4 text-xs font-bold uppercase tracking-[0.18em] text-teal-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Start over
          </button>
          <span className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${statusTone}`}>
            {statusLabel}
          </span>
          {scoreDelta !== null && (
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                scoreDelta >= 0
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : 'border-red-500/20 bg-red-500/10 text-red-400'
              }`}
            >
              {scoreDelta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} from last scan
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleCopy(shareText, 'share-score')}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#d0d0d0]"
          >
            <Share2 className="h-4 w-4" />
            {copied === 'share-score' ? 'Copied' : 'Share'}
          </button>
          <button
            type="button"
            onClick={triggerAnalyze}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-teal-accent px-4 text-xs font-bold uppercase tracking-[0.18em] text-black"
          >
            <RefreshCw className="h-4 w-4" />
            Reanalyze
          </button>
        </div>
      </div>

      <section className="panel-fluid rounded-[32px] border border-teal-accent/12 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.14),transparent_30%),linear-gradient(180deg,#121212_0%,#0b0b0b_100%)] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8f8f8f]">
              Profile diagnosis
            </span>
            <span className="rounded-full border border-teal-accent/20 bg-teal-accent/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-accent">
              Built for {roleLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Score {profile.overallScore || 0}/100
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#b9b9b9]">
              {isStrategic ? 'Deep Strategy' : 'Quick Audit'}
            </span>
          </div>

          <div className="min-w-0 space-y-5">
            <h2 className="wrap-safe max-w-5xl text-4xl font-black leading-[1.08] text-white sm:text-5xl">
              {profile.verdict || 'Your profile has clear room to improve.'}
            </h2>
            <p className="wrap-safe max-w-3xl text-base leading-8 text-[#b9b9b9]">
              This report should feel simple to act on. First, understand the story your profile is telling right now. Then
              use the rewritten headline and about section below to fix the highest-impact parts first.
            </p>
            <div className="max-w-[360px]">
              <div className="h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-teal-accent"
                  style={{ width: `${Math.max(0, Math.min(100, profile.overallScore || 0))}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-[#949494]">Completeness: {profile.completeness || profile.overallScore || 0}%</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-red-500/14 bg-red-500/[0.05] p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">What it says now</p>
              <p className="wrap-safe mt-4 text-base leading-8 text-white">
                {profile.communicates || 'The current positioning is unclear.'}
              </p>
            </div>
            <div className="rounded-[24px] border border-teal-accent/14 bg-teal-accent/[0.05] p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-accent">What to do next</p>
              <p className="wrap-safe mt-4 text-base leading-8 text-[#effffb]">
                {profile.nextStep?.description ||
                  'Tighten your positioning, then rebuild the headline and about section around a clearer result.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="About your profile" eyebrow="Read this before editing anything">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <div className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-6 sm:p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-accent">Current story</p>
            <p className="mt-5 text-lg leading-9 text-white">
              {profile.communicates || profile.verdict || 'Your profile currently communicates an unclear value proposition.'}
            </p>

            {hasText(profile.nextStep?.action) && (
              <div className="mt-6 rounded-[20px] border border-teal-accent/14 bg-teal-accent/[0.05] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-accent">Most important move</p>
                <p className="mt-3 text-lg font-bold text-white">{profile.nextStep.action}</p>
                {hasText(profile.nextStep?.description) && (
                  <p className="mt-3 text-base leading-8 text-[#e8fffb]">{profile.nextStep.description}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8a8a8a]">Status</p>
              <p className="mt-3 text-3xl font-black text-white">{statusLabel}</p>
              <p className="mt-3 text-base leading-8 text-[#bdbdbd]">
                {profile.overallScore >= 85
                  ? 'Your profile already reads as highly credible. The main job now is sharpening conversion.'
                  : profile.overallScore >= 70
                    ? 'The foundation is strong, but your positioning and wording still leave value on the table.'
                    : profile.overallScore >= 50
                      ? 'You have useful raw material, but the message still feels too generic or incomplete.'
                      : 'The profile needs a clearer promise, stronger proof, and tighter writing to create trust.'}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8a8a8a]">Best next use</p>
              <p className="mt-3 text-base leading-8 text-[#e5e5e5]">
                Update your headline and about section first. Those are the two blocks that decide whether someone
                understands you and keeps reading.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {rewriteCards.filter((item) => hasText(item.body)).length > 0 && (
        <Section title="Headline and about rewrite" eyebrow="This is the part you should actually use">
          <div className="space-y-5">
            {rewriteCards
              .filter((item) => hasText(item.body))
              .map((item) => (
                <RewriteCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  strategy={item.strategy}
                  body={item.body}
                  copied={copied}
                  handleCopy={handleCopy}
                  icon={item.icon}
                  onRegenerate={() => handleRegenerate(item.id as any)}
                  isRegenerating={item.id === 'headline' ? regeneratingHeadline : (item.id === 'about' ? regeneratingAbout : false)}
                  isLocked={isLimitReached}
                />
              ))}
          </div>
        </Section>
      )}

      {profile.problems?.length > 0 && (
        <Section title="Top friction points" eyebrow="What is hurting conversion">
          <div className="space-y-4">
            {profile.problems.slice(0, 4).map((problem: any, index: number) => (
              <div key={`${problem.title}-${index}`} className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-sm font-black text-red-400">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xl font-bold text-white">{problem.title}</h4>
                        <p className="mt-3 text-base leading-8 text-[#bebebe]">{problem.impact}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-teal-accent/14 bg-teal-accent/[0.06] p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-accent">Fix</p>
                    <p className="mt-3 text-base leading-8 text-[#effffb]">{problem.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {firstImpressions.length > 0 && (
        <Section title="How your profile is being read" eyebrow="Perception">
          <div className="grid gap-4 md:grid-cols-3">
            {firstImpressions.map((entry) => (
              <div key={entry.label} className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-accent/10">
                    <entry.icon className="h-4 w-4 text-teal-accent" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#808080]">{entry.label}</p>
                </div>
                <p className="mt-4 text-base leading-8 text-[#e4e4e4]">{entry.value}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {lensEntries.length > 0 && (
        <Section title="Strategic lenses" eyebrow="Why the score landed here">
          <div className="grid gap-4 md:grid-cols-3">
            {lensEntries.map(([key, lens]: [string, any]) => (
              <div key={key} className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#808080]">{formatLabel(key)}</p>
                  <p className="text-sm font-black text-white">{lens?.score ?? 0}/100</p>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-teal-accent"
                    style={{ width: `${Math.max(0, Math.min(100, lens?.score ?? 0))}%` }}
                  />
                </div>
                <p className="mt-4 text-base leading-8 text-[#b5b5b5]">{lens?.feedback || 'No lens summary available.'}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {scoreEntries.length > 0 && (
        <Section title="Section scores" eyebrow="Where the profile is stronger or weaker">
          <div className="grid gap-4 md:grid-cols-2">
            {scoreEntries.map(([key, value]: [string, any]) => (
              <div key={key} className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a8a8a8]">{formatLabel(key)}</p>
                  <p className="text-sm font-black text-white">{value}%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-teal-accent" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {extraRewrites.length > 0 && (
        <Section title="Additional section rewrites" eyebrow="Extra profile edits">
          <div className="space-y-4">
            {extraRewrites.map((rewrite: any, index: number) => (
              <div key={`${rewrite.section}-${index}`} className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-accent">{rewrite.section}</p>
                    {hasText(rewrite.strategy) && <p className="mt-2 text-base leading-8 text-[#999999]">{rewrite.strategy}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(rewrite.suggested || '', `rewrite-${index}`)}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-bold uppercase tracking-[0.14em] text-[#d8d8d8]"
                  >
                    {copied === `rewrite-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === `rewrite-${index}` ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[20px] border border-red-500/10 bg-red-500/[0.03] p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-red-400">Before</p>
                    <p className="mt-3 text-base leading-8 text-[#a5a5a5]">{rewrite.original || 'No original content provided.'}</p>
                  </div>
                  <div className="rounded-[20px] border border-teal-accent/12 bg-teal-accent/[0.05] p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-teal-accent">After</p>
                    <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-white">{rewrite.suggested}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {profile.semanticGaps?.length > 0 && (
        <Section title="Missing signals" eyebrow="What is absent from the profile">
          <div className="space-y-3">
            {profile.semanticGaps.map((gap: string, index: number) => (
              <div
                key={`${gap}-${index}`}
                className="flex items-start gap-3 rounded-[18px] border border-red-500/10 bg-red-500/[0.03] p-4"
              >
                <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-base leading-8 text-[#e2e2e2]">{gap}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {profile.actionPlan?.length > 0 && (
        <Section title="24-hour action plan" eyebrow="What to do after this page">
          <div className="space-y-4">
            {profile.actionPlan.map((step: any, index: number) => (
              <div key={`${step.title}-${index}`} className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-accent text-sm font-black text-black">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xl font-bold text-white">{step.title}</p>
                      {hasText(step.effort) && (
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#bcbcbc]">
                          {step.effort} effort
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-base leading-8 text-[#bebebe]">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Next move" eyebrow="Continue the workflow">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('writer')}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] bg-white px-5 text-sm font-bold text-black sm:w-auto sm:min-w-[220px]"
            >
              <PenTool className="h-4 w-4" />
              Open post writer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('topics')}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-white sm:w-auto sm:min-w-[220px]"
            >
              <Sparkles className="h-4 w-4" />
              Generate posts
            </button>
            {!isStrategic && (
              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    setShowPricingModal(true);
                    return;
                  }
                  setProfileMode('strategic');
                  setDeepStep(1);
                  setProfile(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] border border-teal-accent/20 bg-teal-accent/10 px-5 text-sm font-bold text-teal-accent sm:w-auto sm:min-w-[220px]"
              >
                <ShieldCheck className="h-4 w-4" />
                Run deep strategy
              </button>
            )}
          </div>

          <div className="rounded-[24px] border border-white/8 bg-[#0c0c0c] p-5">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-teal-accent" />
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-accent">Insight</p>
            </div>
            <p className="mt-3 text-base leading-8 text-white">{randomInsight}</p>
          </div>
        </div>
      </Section>
    </motion.div>
  );
}
