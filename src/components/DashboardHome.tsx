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
  TrendingUp,
  Target,
  Mic,
  Calendar,
  Magnet,
  Pencil
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { updateDisplayName } from '../services/userService';

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
  stats: { posts: number; topics: number; profiles: number; savedItems?: number };
  voicePostsCount: number;
  usageLimits: any;
  setActiveTab: (tab: any) => void;
  setShowAuth: (show: boolean) => void;
  onUpgrade: () => void;
  setToast: (toast: any) => void;
  setShowReviewModal: (show: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── REDESIGN SYSTEM CONSTANTS ───
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = {
  bg: '#080808',
  sidebar: '#0D0D0D',
  card: '#141414',
  cardMax: '#111111',
  teal: '#2DD4BF',
  muted: '#A0A0A0',
  border: 'rgba(255,255,255,0.06)'
};

const DashboardSkeleton = ({ isPro, isMax }: { isPro: boolean, isMax: boolean }) => (
  <div className="max-w-[900px] mx-auto px-6 py-8 md:py-16 space-y-10 animate-pulse">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <div className="h-4 w-24 bg-[#1A1A1A] rounded" />
      <div className="h-10 w-64 bg-[#1A1A1A] rounded" />
      <div className="h-6 w-32 bg-[#1A1A1A] rounded-full" />
    </div>
    
    {(isPro || isMax) && (
      <div className="flex gap-4 overflow-hidden pb-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="min-w-[130px] h-24 bg-[#1A1A1A] rounded-xl" />
        ))}
      </div>
    )}

    {/* Tools Grid Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="h-40 bg-[#1A1A1A] rounded-2xl" />
      ))}
    </div>

    {/* Usage Card Skeleton */}
    <div className="h-64 bg-[#1A1A1A] rounded-2xl" />
  </div>
);

const InteractiveCard = ({ children, onClick, isMax }: any) => (
  <div 
    onClick={onClick}
    className={`
      ${isMax ? 'bg-[#111111] border-[rgba(45,212,191,0.12)]' : 'bg-[#141414] border-[rgba(255,255,255,0.06)]'}
      border rounded-[14px] p-5 cursor-pointer flex flex-col gap-1 transition-all duration-200 ease-in-out
      hover:bg-[#1A1A1A] hover:border-[rgba(45,212,191,0.2)]
      ${isMax ? 'hover:shadow-[0_0_20px_rgba(45,212,191,0.06)]' : ''}
    `}
  >
    {children}
  </div>
);

const ProgressBar = ({ percentage, color = '#2DD4BF' }: { percentage: number, color?: string }) => (
  <div className="h-[5px] w-full bg-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full rounded-[3px]"
      style={{ backgroundColor: color }}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ─── TIERED SUB-COMPONENTS ───
// ─────────────────────────────────────────────────────────────────────────────

const HeaderSection = ({ 
  firstName, 
  displayName, 
  isEditing, 
  setIsEditing, 
  newName, 
  setNewName, 
  onSaveName, 
  tier, 
  streakCount, 
  created_at,
  setActiveTab
}: any) => {
  const memberSince = created_at ? new Date(created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...';
  
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
      <div className="space-y-1">
        <p className="type-sm text-[#A0A0A0]">
          {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
        </p>
        
        <div className="flex items-center gap-2 group">
          {isEditing ? (
            <input 
              autoFocus
              className="bg-transparent text-[32px] font-bold text-white outline-none border-b border-teal-accent/50 max-w-[300px]"
              value={newName}
              onChange={(e) => setNewName(e.target.value.slice(0, 30))}
              onBlur={onSaveName}
              onKeyDown={(e) => e.key === 'Enter' && onSaveName()}
            />
          ) : (
            <>
              <h1 className="text-[32px] font-bold text-white tracking-tight">{displayName || firstName}</h1>
              <button 
                onClick={() => { setNewName(displayName || firstName); setIsEditing(true); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#A0A0A0] hover:text-white"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          {tier === 'MAX' ? (
            <div className="type-overline bg-[rgba(45,212,191,0.08)] border border-[rgba(45,212,191,0.3)] text-teal-accent px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(45,212,191,0.15)]">
              <Crown className="w-3 h-3 filter drop-shadow-[0_0_3px_rgba(45,212,191,0.5)]" />
              MAX
            </div>
          ) : tier === 'PRO' ? (
            <div className="type-overline bg-[rgba(45,212,191,0.1)] border border-[rgba(45,212,191,0.25)] text-teal-accent px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
              <Crown className="w-3 h-3" />
              PRO
            </div>
          ) : (
            <div className="type-overline bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#A0A0A0] px-2.5 py-0.5 rounded-full font-bold">
              FREE PLAN
            </div>
          )}

          {tier !== 'FREE' && (
            <button 
              onClick={() => setActiveTab('settings')}
              className="type-sm text-[#A0A0A0] hover:text-teal-accent transition-colors"
            >
              Manage plan →
            </button>
          )}

          {streakCount > 1 && (
            <div className="type-overline bg-[rgba(45,212,191,0.1)] border border-[rgba(45,212,191,0.2)] text-teal-accent px-2.5 py-0.5 rounded-full font-bold">
              🔥 {streakCount} day streak
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block type-sm text-[#A0A0A0]">
        Member since {memberSince}
      </div>
    </div>
  );
};

const UpgradeNudge = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <div className="bg-[#141414] border border-[rgba(45,212,191,0.15)] rounded-[14px] p-4 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <Crown className="w-[18px] h-[18px] text-teal-accent" />
      <span className="type-sm text-[#A0A0A0]">Unlock Pro — 500 DMs, 60 posts and 30 audits every month</span>
    </div>
    <button 
      onClick={onUpgrade}
      className="type-sm font-bold text-teal-accent whitespace-nowrap hover:opacity-80 transition-opacity"
    >
      Get Pro →
    </button>
  </div>
);

const QuickActions = ({ tier, usageLimits, setActiveTab, isMax, voicePostsCount, savedItemsCount }: any) => {
  const isFree = tier === 'FREE';
  const tools = [
    { 
      id: 'profile', 
      icon: Target, 
      name: 'Profile Audit', 
      desc: tier === 'MAX' ? 'Deep Strategy with full identity transformation' : 'Find what is killing your conversions',
      status: tier === 'MAX' ? 'Unlimited' : usageLimits.getStatus('profile_audit'),
      limit_ref: tier === 'MAX' ? '' : (tier === 'PRO' ? 30 : 5)
    },
    { 
      id: 'writer', 
      icon: PenTool, 
      name: 'Post Writer', 
      desc: tier === 'MAX' ? 'Unlimited posts. Deep Mode. Your exact voice every time.' : (tier === 'PRO' ? 'Deep Mode active for maximum authenticity' : 'Posts in your exact writing style'),
      status: (tier === 'MAX' || tier === 'PRO') ? 'Unlimited' : usageLimits.getStatus('post_writer'),
      limit_ref: tier === 'MAX' ? 'unlimited' : (tier === 'PRO' ? 'unlimited' : 10)
    },
    { 
      id: 'topics', 
      icon: Lightbulb, 
      name: 'Topic Generator', 
      desc: (tier === 'MAX' || tier === 'PRO') ? 'Unlimited ideas. Never run out.' : 'Never run out of post ideas',
      status: (tier === 'MAX' || tier === 'PRO') ? 'Unlimited' : usageLimits.getStatus('topic_generator'),
      limit_ref: tier === 'MAX' ? 'unlimited' : (tier === 'PRO' ? 'unlimited' : 30)
    },
    { 
      id: 'outreach', 
      icon: Send, 
      name: 'Smart Outreach', 
      desc: tier === 'MAX' ? '1000 messages per month. Full outreach command center.' : (tier === 'PRO' ? 'Full suite including ICP, Follow-ups and CRM' : 'DMs that get real replies'),
      status: usageLimits.getStatus('smart_outreach'),
      limit_ref: tier === 'MAX' ? 1000 : (tier === 'PRO' ? 500 : 10)
    },
    { 
      id: 'voice', 
      icon: Mic, 
      name: 'Voice Profile', 
      desc: tier === 'MAX' ? 'Up to 20 sample posts for the sharpest voice matching.' : (tier === 'PRO' ? 'Train Somyra on your exact writing style' : 'Train Somyra on your writing style'),
      status: 'voice',
      used: voicePostsCount,
      limit_ref: tier === 'MAX' ? 20 : (tier === 'PRO' ? 10 : 5)
    },
    { 
      id: 'saved', 
      icon: Bookmark, 
      name: 'Saved Library', 
      desc: tier === 'MAX' ? 'Unlimited saves. Your entire content vault. Always accessible.' : (tier === 'PRO' ? 'Save up to 200 pieces of content' : 'Your best work in one place'),
      status: tier === 'MAX' ? 'Unlimited' : 'saved',
      used: savedItemsCount,
      limit_ref: tier === 'PRO' ? 200 : 10
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="type-overline font-bold text-[#A0A0A0]">
        {tier === 'FREE' ? 'TOOLS' : tier === 'PRO' ? 'YOUR PRO TOOLS' : 'YOUR MAX TOOLS'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tools.map(tool => {
          let badge = null;
          if (tool.status === 'Unlimited') {
            badge = <span className="type-overline font-bold text-teal-accent">Unlimited</span>;
          } else if (tool.status === 'voice') {
            if (tool.used === 0) badge = <span className="type-overline font-bold text-amber-500">Not set up</span>;
            else badge = <span className="type-overline text-[#A0A0A0]">{tool.used} of {tool.limit_ref} posts</span>;
          } else if (tool.status === 'saved') {
            badge = <span className="type-overline text-[#A0A0A0]">{tool.used} of {tool.limit_ref} saved</span>;
          } else if (tool.limit_ref === 'unlimited') {
            badge = <span className="type-overline font-bold text-teal-accent">Unlimited</span>;
          } else {
            const used = tool.status?.used || 0;
            const limit = tool.limit_ref;
            if (used >= limit) {
              badge = <div className="bg-red-500/10 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Limit reached</div>;
            } else {
              badge = <span className="type-overline text-[#A0A0A0]">{limit - used} {tool.id === 'topics' ? 'topics ' : ''}left</span>;
            }
          }

          return (
            <InteractiveCard key={tool.id} onClick={() => setActiveTab(tool.id === 'voice' ? 'voice' : tool.id === 'saved' ? 'saved' : tool.id === 'profile' ? 'profile' : tool.id)} isMax={isMax}>
              <div className="flex items-start justify-between">
                <tool.icon className="w-5 h-5 text-teal-accent" />
                {badge}
              </div>
              <div className="mt-4">
                <h3 className="type-body font-bold text-white">{tool.name}</h3>
                <p className="type-sm text-[#A0A0A0] leading-tight mt-0.5">{tool.desc}</p>
              </div>
            </InteractiveCard>
          );
        })}
      </div>
    </div>
  );
};

const UsageOverview = ({ tier, status, onUpgrade, isMax }: any) => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const resetText = nextMonth.toLocaleDateString('en-US', { month: 'long' }) + ' 1st';

  const rows = [
    { label: 'Profile Audit', ...status.audit },
    { label: 'Post Writer', ...status.writer },
    { label: 'Topic Generator', ...status.topics },
    { label: 'Smart Outreach', ...status.outreach, sub: tier === 'MAX' ? '50 per working day' : tier === 'PRO' ? '25 per working day' : '' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="type-overline font-bold text-[#A0A0A0]">THIS MONTH</h2>
      <div className={`
        ${isMax ? 'bg-[#111111] border-[rgba(45,212,191,0.12)]' : 'bg-[#141414] border-[rgba(255,255,255,0.06)]'}
        border rounded-[14px] p-5 space-y-6
      `}>
        <div className="flex justify-between items-center type-sm text-[#A0A0A0]">
          <span>Usage</span>
          <span>Resets {resetText}</span>
        </div>
        
        <div className="space-y-5">
          {rows.map((row, i) => {
            const isUnlimited = row.limit === 'unlimited';
            const pct = isUnlimited ? 100 : Math.min(100, (row.used / row.limit) * 100);
            const color = isUnlimited ? '#2DD4BF' : pct >= 80 ? '#EF4444' : pct >= 50 ? '#F59E0B' : '#2DD4BF';

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between type-sm">
                  <span className="text-white">{row.label}</span>
                  <span className={isUnlimited ? 'text-teal-accent font-bold' : 'text-[#A0A0A0]'}>
                    {isUnlimited ? 'Unlimited' : `${row.used} of ${row.limit}`}
                  </span>
                </div>
                <ProgressBar percentage={pct} color={color} />
                {row.sub && <p className="type-overline text-[#A0A0A0]">{row.sub}</p>}
              </div>
            );
          })}
        </div>

        {tier === 'PRO' && (
          <div className="pt-4 text-center">
            <p className="type-caption text-[#A0A0A0]">
              Need more? <button onClick={onUpgrade} className="text-teal-accent hover:underline">Upgrade to Max</button> for unlimited posts and 1000 DMs.
            </p>
          </div>
        )}

        {tier === 'MAX' && (
          <p className="type-caption text-teal-accent text-center pt-4">
            You have full access. No limits on what you can build.
          </p>
        )}
      </div>
    </div>
  );
};

const StatsRow = ({ isMax, stats, voicePostsCount, savedItemsCount }: any) => {
  const items = [
    { icon: PenTool, val: stats.posts, label: 'Posts Written' },
    { icon: Lightbulb, val: stats.topics, label: 'Topics Created' },
    { icon: UserCircle, val: stats.profiles, label: 'Profiles Analyzed' },
    { icon: Bookmark, val: savedItemsCount, label: 'Items Saved' }
  ];
  if (isMax) items.push({ icon: Mic, val: voicePostsCount, label: voicePostsCount === 0 ? 'Not Set Up' : 'Voice Posts' });

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2">
      {items.map((item, i) => (
        <div 
          key={i} 
          className={`
            min-w-[140px] flex-1 snap-start p-5 rounded-[14px] flex flex-col gap-1 border-t-2 border-t-[#2DD4BF]
            ${isMax ? 'bg-[#111111] border-[rgba(45,212,191,0.12)] border-t-[rgba(45,212,191,0.5)]' : 'bg-[#141414] border-[rgba(255,255,255,0.06)] border-t-[#2DD4BF]'}
            border
          `}
        >
          <item.icon className="w-[18px] h-[18px] text-teal-accent" />
          <span className="text-[28px] font-bold text-white leading-none mt-2">{item.val}</span>
          <span className={`type-overline font-bold ${item.label === 'Not Set Up' ? 'text-amber-500' : 'text-[#A0A0A0]'}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const VoiceProfilePrompt = ({ isMax, voicePostsCount, setActiveTab }: any) => {
  if (voicePostsCount > 0) return null;
  return (
    <div className={`
      ${isMax ? 'bg-[#111111] border-[rgba(45,212,191,0.12)]' : 'bg-[#141414] border-[rgba(255,255,255,0.06)]'}
      border rounded-[14px] p-5 flex items-center gap-5
    `}>
      <Mic className="w-8 h-8 text-teal-accent shrink-0" />
      <div className="flex-grow">
        <h3 className="type-body font-bold text-white">Set up Voice Profile</h3>
        <p className="type-sm text-[#A0A0A0]">
          {isMax 
            ? 'Add up to 20 posts so every generation sounds unmistakably like you. This is your most powerful Max feature.'
            : 'Add up to 10 posts so every generation sounds like you.'}
        </p>
      </div>
      <button 
        onClick={() => setActiveTab('voice')}
        className="type-sm font-bold text-teal-accent whitespace-nowrap px-4 py-2 border border-teal-accent/20 rounded-lg hover:bg-teal-accent/5 transition-colors"
      >
        {isMax ? 'Set Up Now →' : 'Set Up →'}
      </button>
    </div>
  );
};

const ComingSoonSection = () => (
  <div className="space-y-4">
    <h2 className="type-overline font-bold text-[#A0A0A0]">COMING SOON FOR YOU</h2>
    <div className="bg-[#111111] border border-[rgba(45,212,191,0.12)] rounded-[16px] p-5 space-y-6">
      <p className="type-sm text-[#A0A0A0]">As a Max member you get first access to every new feature before anyone else.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Calendar, name: 'Content Calendar', body: 'Plan your entire month of LinkedIn content in one view.' },
          { icon: Magnet, name: 'Lead Magnet Creator', body: 'Build LinkedIn lead magnets that grow your email list.' }
        ].map((feat, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <feat.icon className="w-4 h-4 text-teal-accent" />
                <span className="type-body font-bold text-white">{feat.name}</span>
              </div>
              <div className="type-overline bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">COMING SOON</div>
            </div>
            <p className="type-sm text-[#A0A0A0]">{feat.body}</p>
          </div>
        ))}
      </div>
      <div className="pt-2 type-sm text-[#A0A0A0]">
        Have a feature request? <a href="mailto:somyra@proton.me?subject=Feature Request - Max Member" className="text-teal-accent hover:underline">Send feedback →</a>
      </div>
    </div>
  </div>
);


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
  setToast,
  setShowReviewModal
}) => {
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fetch local profile for displayName and streak
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, streak_count, created_at')
          .eq('id', user.id)
          .single();
        if (data) setLocalProfile(data);
      } catch (err) {
        console.error('Error fetching dashboard profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    fetchTestimonials();
  }, [user]);

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (data) setTestimonials(data);
    } catch (err) {
      console.error('Failed to fetch testimonials');
    }
  };

  const handleSaveName = async () => {
    if (!user || !newName.trim()) {
      setIsEditing(false);
      return;
    }
    const result = await updateDisplayName(user.id, newName.trim());
    if (result.success) {
      setLocalProfile((p: any) => ({ ...p, display_name: newName.trim() }));
      setToast({ type: 'success', headline: 'Name updated', subtext: 'Your display name has been saved.' });
    } else {
      setToast({ type: 'error', headline: 'Update failed', subtext: result.error || 'Please try again.' });
    }
    setIsEditing(false);
  };

  const firstName = user?.email 
    ? user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1) 
    : 'there';

  const tier = isMax ? 'MAX' : isPro ? 'PRO' : 'FREE';

  // Derived Usage for Overview
  const usageStatus = {
    audit: usageLimits.getStatus('profile_audit'),
    writer: usageLimits.getStatus('post_writer'),
    topics: usageLimits.getStatus('topic_generator'),
    outreach: usageLimits.getStatus('smart_outreach')
  };

  const dailyTips = [
    "Posts between 7am and 9am local time get 20% more organic reach.",
    "Your first line is all most people see — make it impossible to scroll past.",
    "Comment on 10 relevant posts before publishing yours to boost initial reach.",
    "Posts with a specific number in the first line get 37% more engagement.",
    "Your headline is searched more than your posts — update it every 90 days.",
    "Posts ending with a genuine question get 3x more comments.",
    "Posting 3 times per week consistently beats one viral post once a month."
  ];
  const currentDayTip = dailyTips[new Date().getDay()];

  if (loadingProfile || usageLimits.isLoading) {
    return <DashboardSkeleton isPro={isPro} isMax={isMax} />;
  }

  const savedItemsCount = stats.savedItems || usageLimits.getStatus('saved_items').used;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 md:py-16 space-y-10">
      <HeaderSection 
        firstName={firstName}
        displayName={localProfile?.display_name}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        newName={newName}
        setNewName={setNewName}
        onSaveName={handleSaveName}
        tier={tier}
        streakCount={localProfile?.streak_count || 0}
        created_at={localProfile?.created_at || user.created_at}
        setActiveTab={setActiveTab}
      />

      {tier === 'FREE' && <UpgradeNudge onUpgrade={onUpgrade} />}

      {(tier === 'PRO' || tier === 'MAX') && (
        <StatsRow 
          isMax={isMax} 
          stats={stats} 
          voicePostsCount={voicePostsCount} 
          savedItemsCount={savedItemsCount} 
        />
      )}

      <QuickActions 
        tier={tier} 
        usageLimits={usageLimits} 
        setActiveTab={setActiveTab} 
        isMax={isMax}
        voicePostsCount={voicePostsCount}
        savedItemsCount={savedItemsCount}
      />

      <UsageOverview 
        tier={tier} 
        status={usageStatus} 
        onUpgrade={onUpgrade} 
        isMax={isMax} 
      />

      {/* Daily Insight Section */}
      <div className={`
        ${isMax ? 'bg-[#111111] border-[rgba(45,212,191,0.12)]' : 'bg-[#0D1F1E] border-teal-accent/10'}
        border rounded-[14px] p-8 flex flex-col md:flex-row items-center gap-8
      `}>
        <div className="w-16 h-16 bg-teal-accent/10 rounded-2xl flex items-center justify-center shrink-0">
          <Lightbulb className="w-8 h-8 text-teal-accent" />
        </div>
        <div>
          <div className="type-overline font-bold text-teal-accent mb-2">DAILY INSIGHT</div>
          <h3 className="text-xl font-bold text-white mb-2">Pro Tip of the Day</h3>
          <p className="type-body text-[#A0A0A0] leading-relaxed">{currentDayTip}</p>
        </div>
      </div>

      <VoiceProfilePrompt 
        isMax={isMax} 
        voicePostsCount={voicePostsCount} 
        setActiveTab={setActiveTab} 
      />

      {isMax && <ComingSoonSection />}
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

