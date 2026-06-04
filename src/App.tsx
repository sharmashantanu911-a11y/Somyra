/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  PenTool, 
  UserCircle, 
  Send, 
  Loader2, 
  Copy, 
  Check,
  ChevronRight,
  ChevronDown,
  Linkedin,
  Target,
  Rocket,
  MessageSquare,
  Globe,
  Info,
  BarChart3,
  Lightbulb,
  Bookmark,
  Trash2,
  Bolt,
  History as HistoryIcon,
  X,
  Menu,
  LogOut,
  Home,
  LayoutDashboard,
  Mic,
  Crown,
  FileText,
  AlertCircle,
  Plus,
  Zap,
  ClipboardList,
  Briefcase,
  Award,
  TrendingUp,
  Users,
  HelpCircle,
  Search,
  Star,
  Edit,
  ArrowLeft,
  Download,
  Clock
} from 'lucide-react';
import { generateTopics, generatePost, generatePostThreeStep, generateBio, analyzeProfile, analyzeTone, generateStyleReport, type SomyraProfileAnalysis, type SomyraProfileInput, type StyleReport, generateSmartOutreach, scoreOutreachMessage, generateFollowUp, generateICPClarity } from './services/aiService';
import { ProfileAnalysis } from './components/ProfileAnalysis';
import { supabase } from './lib/supabase';

import Auth from './components/Auth';
import { PostWriterLoading } from './components/PostWriterLoading';
import { LinkedInPreview } from './components/LinkedInPreview';
import { DashboardHome } from './components/DashboardHome';
import { PricingModal, LimitReachedModal, SuccessModal } from './components/PricingModals';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChangelogModal } from './components/ChangelogModal';
import { ReviewModal } from './components/ReviewModal';
import { useUsageLimits, FeatureKey } from './hooks/useUsageLimits';

import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';
import { Contact } from './components/Contact';

const VoiceProfile = React.lazy(() => import('./features/VoiceProfile').then(m => ({ default: m.VoiceProfile })));
const TopicGenerator = React.lazy(() => import('./features/TopicGenerator').then(m => ({ default: m.TopicGenerator })));
const PostWriter = React.lazy(() => import('./features/PostWriter').then(m => ({ default: m.PostWriter })));
const BioGenerator = React.lazy(() => import('./features/BioGenerator').then(m => ({ default: m.BioGenerator })));
const SmartOutreach = React.lazy(() => import('./features/SmartOutreach').then(m => ({ default: m.SmartOutreach })));
const SavedLibrary = React.lazy(() => import('./features/SavedLibrary').then(m => ({ default: m.SavedLibrary })));
import { LandingPage } from './components/LandingPage';
import SomyraFooter from './components/SomyraFooter';

const dailyTips = [
  "LinkedIn's algorithm favors conversational posts that start with a strong hook. Avoid using more than 3 hashtags.",
  "Engage with at least 5 posts in your feed before you publish your own post to boost visibility.",
  "The first 3 lines of your post are the most important. They determine if someone clicks 'see more'.",
  "Tagging people in posts only helps if they actually engage. Irrelevant tagging can hurt your reach.",
  "Native video and document carousels currently get the highest organic reach on LinkedIn.",
  "Consistency is better than frequency. Posting 3 times a week consistently is better than 5 times one week and 0 the next.",
  "Your profile headline should focus on the value you provide, not just your job title."
];

const tabs = [
  { id: 'home', label: 'Home', icon: Home, isPro: false },
  { id: 'voice', label: 'Voice Profile', icon: Mic, isPro: false },
  { id: 'profile', label: 'Profile Audit', icon: UserCircle, isPro: false },
  { id: 'topics', label: 'Topics', icon: Lightbulb, isPro: false },
  { id: 'writer', label: 'Writer', icon: PenTool, isPro: false },
  { id: 'outreach', label: 'Smart Outreach', icon: Send, isPro: false },
  { id: 'saved', label: 'Saved Library', icon: Bookmark, isPro: false },
  { id: 'settings', label: 'Settings', icon: Bolt, isPro: false }
];

const sidebarGroups = [
  { label: 'Personal Brand', items: ['voice', 'profile'] },
  { label: 'Content Factory', items: ['topics', 'writer'] },
  { label: 'Sales & Outreach', items: ['outreach'] },
  { label: 'Account', items: ['saved', 'settings'] }
];

type Tab = 'home' | 'voice' | 'profile' | 'topics' | 'writer' | 'bio' | 'outreach' | 'saved' | 'settings'; // 'bio' kept in type for backward compat but removed from tabs/sidebar

interface VoicePost {
  id: string;
  content: string;
  created_at: string;
}

interface SavedItem {
  id: number;
  type: string;
  content: string;
  created_at: string;
}

interface AppError {
  message: string;
  suggestion?: string;
}

const getUTCDateString = () => new Date().toISOString().split("T")[0];

const getTimeUntilMidnightUTC = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'analyzing' | 'crafting' | 'refining' | 'completed'>('idle');
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authFeature, setAuthFeature] = useState<string | undefined>();
  const [authCallback, setAuthCallback] = useState<(() => void) | null>(null);

  const handleRequireAuth = (feature: string, callback: () => void) => {
    setAuthFeature(feature);
    setAuthCallback(() => callback);
    setShowAuth(true);
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [showDeleteAllSavedConfirm, setShowDeleteAllSavedConfirm] = useState(false);
  const [outreachForm, setOutreachForm] = useState({ target: '', reason: '', goal: '' });

  const [isPro, setIsPro] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [guestSaves, setGuestSaves] = useState(0);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [bottomBarDismissed, setBottomBarDismissed] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationRequested, setCancellationRequested] = useState(false);
  const [isSubmittingCancellation, setIsSubmittingCancellation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const navigateTo = (path: string) => navigate(path);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const fetchProStatus = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || userId;
      if (!currentUserId) return;

      if (!currentUserId) return;

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, is_pro, is_max, subscription_id, subscription_status, current_period_end')
        .eq('id', currentUserId)
        .single();

      let isProValue = false;
      let isMaxValue = false;
      let statusValue = null;
      let periodEndValue = null;

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          await supabase
            .from('profiles')
            .insert({ 
              id: currentUserId, 
              is_pro: false, 
              is_max: false,
              created_at: new Date().toISOString() 
            });
        }
      } else if (existingProfile) {
        isProValue = existingProfile.is_pro;
        isMaxValue = existingProfile.is_max;
        statusValue = existingProfile.subscription_status;
        periodEndValue = (existingProfile as any).current_period_end;
        setSubscriptionId(existingProfile.subscription_id);
      }

      setIsPro(isProValue);
      setIsMax(isMaxValue);
      setSubscriptionStatus(statusValue);
      setCurrentPeriodEnd(periodEndValue);
      
      sessionStorage.setItem("somyra_is_pro", String(isProValue));
      sessionStorage.setItem("somyra_is_max", String(isMaxValue));
      return { isPro: isProValue, isMax: isMaxValue };
    } catch (err: any) {
      console.log(`Pro/Max status fetch error silently ignored: ${err.message}`);
      return { isPro: false, isMax: false };
    }
  };
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoadingTestimonials(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const usageLimits = useUsageLimits(user, isPro, isMax);


  // Session Stats
  const [stats, setStats] = useState({ posts: 0, topics: 0, profiles: 0 });

  // Voice Profile State
  const [voicePosts, setVoicePosts] = useState<VoicePost[]>([]);
  const [previousUser, setPreviousUser] = useState<any>(null);

  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgraded') !== 'true' || !user) return;

    window.history.replaceState({}, '', window.location.pathname);

    if (isPro || isMax) {
      setShowSuccessModal(true);
      return;
    }

    setIsActivating(true);
    let attempts = 0;
    const maxAttempts = 15;
    let cancelled = false;

    const poll = setInterval(async () => {
      if (cancelled) return;
      attempts++;
      
      try {
        const status = await fetchProStatus(user.id);
        
        if (status?.isPro || status?.isMax) {
          clearInterval(poll);
          if (!cancelled) {
            setIsActivating(false);
            setShowSuccessModal(true);
          }
          return;
        }
      } catch (e) {
      }

      if (attempts >= maxAttempts && !cancelled) {
        clearInterval(poll);
        setIsActivating(false);
        fetchProStatus(user.id);
        setShowSuccessModal(true);
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [user?.id]);

  useEffect(() => {
    setPreviousUser(user);
    if (!user) {
      localStorage.removeItem('somyra_upgrade_success_shown');
    }
  }, [user]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
      
  const fetchVoiceProfile = async () => {
    if (!user) return;
    try {
      const { data, error: fetchError } = await supabase
        .from('voice_profile')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setVoicePosts(data.map(p => ({ id: p.id, content: p.post_text, created_at: p.created_at })));
    } catch (err: any) {
      showToast({
        message: 'Could not load your voice profile. Please refresh.',
        type: 'error'
      });
    }
  };

  const [profileMode, setProfileMode] = useState<'quick' | 'strategic'>('quick');
  const [quickForm, setQuickForm] = useState({
    whoAreYou: '',
    currentHeadline: '',
    headlineOption: 'have' as 'have' | 'none' | 'rewrite',
    aboutSection: '',
    aboutOption: 'have' as 'have' | 'none' | 'rewrite',
    whatDoYouWant: '',
    goals: [] as string[],
    primaryAudience: '',
    secondaryAudience: ''
  });
  const [deepStep, setDeepStep] = useState(1);
  const [deepForm, setDeepForm] = useState({
    role: '',
    specificFocus: '',
    experienceLevel: '',
    industry: '',
    headline: '',
    headlineOption: 'have' as 'have' | 'none' | 'rewrite',
    about: '',
    aboutOption: 'have' as 'have' | 'none' | 'rewrite',
    aboutAnswers: {
      whatDoYouDo: '',
      whoDoYouHelp: '',
      result: '',
      different: ''
    },
    experience: '',
    experienceDetails: '',
    featured: '',
    recentPosts: '',
    primaryGoal: '',
    goalDetail: '',
    idealAudience: '',
    audience: [] as string[],
    struggles: [] as string[],
    otherStruggle: '',
    otherGoal: '',
    achievements: '',
    skills: '',
    primaryAudience: '',
    secondaryAudience: ''
  });
  const [profile, setProfile] = useState<SomyraProfileAnalysis | null>(null);
  const [profileText, setProfileText] = useState('');

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const [topicForm, setTopicForm] = useState({ profession: '', goals: '', audience: '' });
  const [writerForm, setWriterForm] = useState({ topic: '', style: 'storytelling' });
  const [bioForm, setBioForm] = useState({ role: '', skills: '', achievements: '', goal: '' });
  
  const [results, setResults] = useState<{
    topics?: string[];
    post?: string;
    bio?: { headlines: string[]; about: string };
    outreach?: string;
    toneAnalysis?: { tone: string; suggestions: string[] };
  }>({});

  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error' | 'info';
    headline?: string;
    subtext?: string;
    action?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; href: string };
  } | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    const pendingData = localStorage.getItem('somyra_pending_checkout');
    if (pendingData && user) {
      setShowPricingModal(true);
    }
  }, [user]);

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitTriggerFeature, setLimitTriggerFeature] = useState<string | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem('somyra_changelog_seen');
    const today = getUTCDateString();
    if (lastSeen !== today) {
      setHasNewUpdates(true);
    }
  }, []);

  const openChangelog = () => {
    setShowChangelog(true);
    setHasNewUpdates(false);
    localStorage.setItem('somyra_changelog_seen', getUTCDateString());
  };

  useEffect(() => {
    const dismissed = localStorage.getItem('somyra_bottom_bar_dismissed');
    if (dismissed) setBottomBarDismissed(true);

    const handleScroll = () => {
      if (user || bottomBarDismissed) return;
      const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollDepth > 0.6) {
        setShowBottomBar(true);
      }
    };

    if (activeTab === 'home') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, bottomBarDismissed, activeTab]);

  const checkGenerationLimit = (feature: any) => {
    if (usageLimits.checkLimit(feature)) return true;
    setLimitTriggerFeature(feature);
    setShowLimitModal(true);
    trackEvent('limit_reached', { feature, tier: usageLimits.tier });
    return false;
  };

  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchProStatus(user.id);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const GenerationCounter = ({ feature = 'profile_audit' }: { feature?: FeatureKey }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const status = usageLimits.getStatus(feature);
    const remaining = status.remaining;
    const limit = status.limit;
    const isUnlimited = limit === 'unlimited';

    useEffect(() => {
      const handleGen = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
      };
      window.addEventListener('generationUsed', handleGen);
      return () => window.removeEventListener('generationUsed', handleGen);
    }, []);

    // Hide counter for unauthenticated users
    if (!user) return null;

    const getFeatureName = () => {
      switch (feature) {
        case 'profile_audit': return 'Profile Audits';
        case 'post_writer': return 'Posts';
        case 'smart_outreach': return 'Outreach messages';
        case 'topic_generator': return 'Topic Generations';
        case 'bio_headline': return 'Bio & Headlines';
        case 'voice_profile': return 'Voice posts';
        default: return 'generations';
      }
    };

    if (isUnlimited) {
      return (
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-teal-accent" />
          <span className="text-xs font-bold text-teal-accent">Unlimited</span>
        </div>
      );
    }

    const lowThreshold = typeof limit === 'number' ? Math.max(2, limit * 0.2) : 3;
    const stateColor = remaining === 0 ? 'text-red-500' : remaining < lowThreshold ? 'text-orange-500' : 'text-[#888888]';
    const iconColor = remaining === 0 ? 'text-red-500' : remaining < lowThreshold ? 'text-orange-500' : 'text-[#888888]';

    return (
      <div className="flex flex-col items-end gap-1">
      <div className={`bg-[#141414] border border-[#1f1f1f] rounded-full px-3.5 py-1.5 sm:py-2 flex items-center gap-1.5 transition-all duration-300 whitespace-nowrap min-h-[30px] sm:min-h-[34px] ${remaining === 0 ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.15)] border-red-500/30' : ''}`}>
          <Bolt className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${iconColor}`} />
          <motion.span 
            animate={isAnimating ? { scale: 1.3 } : { scale: 1 }}
            className={`type-overline font-bold ${stateColor}`}
          >
            {remaining} of {limit} {getFeatureName()} <span className="hidden sm:inline">left this month</span><span className="sm:hidden">left</span>
          </motion.span>
        </div>
        {feature === 'smart_outreach' && (isPro || isMax) && (limit === 500 || limit === 1000) && (
          <span className="type-overline text-[#555555] font-medium mr-2">that is {limit === 500 ? 25 : 50} per working day</span>
        )}
      </div>
    );
  };

  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = (text: string, id: string) => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    try {
      navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(id);
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(null);
      copyTimeoutRef.current = null;
    }, 2000);
  };

  const trackEvent = (eventName: string, params?: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  };

  const sanitizeProfileField = (value: string) =>
    value
      .trim()
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ');

  const handleAnalyzeProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      handleRequireAuth('Profile Audit', () => handleAnalyzeProfile());
      return;
    }

    if (isGenerating) return;
    setIsGenerating(true);

    if (!checkGenerationLimit('profile_audit')) {
      setIsGenerating(false);
      return;
    }
    
    if (abortController) {
      abortController.abort();
    }

    const MAX_FIELD_LENGTH = profileMode === 'quick' ? 3000 : 5000;
    const truncate = (val: string) => val.slice(0, MAX_FIELD_LENGTH);

    const controller = new AbortController();
    setAbortController(controller);

    const sanitizedQuickForm = {
      ...quickForm,
      whoAreYou: truncate(sanitizeProfileField(quickForm.whoAreYou)),
      currentHeadline: sanitizeProfileField(quickForm.currentHeadline),
      aboutSection: truncate(sanitizeProfileField(quickForm.aboutSection)),
      whatDoYouWant: sanitizeProfileField(quickForm.whatDoYouWant),
      primaryAudience: sanitizeProfileField(quickForm.primaryAudience),
      secondaryAudience: sanitizeProfileField(quickForm.secondaryAudience)
    };
    const sanitizedDeepForm = {
      ...deepForm,
      role: sanitizeProfileField(deepForm.role),
      specificFocus: sanitizeProfileField(deepForm.specificFocus),
      industry: sanitizeProfileField(deepForm.industry),
      headline: sanitizeProfileField(deepForm.headline),
      about: truncate(sanitizeProfileField(deepForm.about)),
      experienceDetails: truncate(sanitizeProfileField(deepForm.experienceDetails)),
      primaryGoal: sanitizeProfileField(deepForm.primaryGoal),
      goalDetail: sanitizeProfileField(deepForm.goalDetail),
      idealAudience: sanitizeProfileField(deepForm.idealAudience),
      otherStruggle: sanitizeProfileField(deepForm.otherStruggle),
      otherGoal: sanitizeProfileField(deepForm.otherGoal),
      achievements: truncate(sanitizeProfileField(deepForm.achievements)),
      skills: truncate(sanitizeProfileField(deepForm.skills)),
      featured: truncate(sanitizeProfileField(deepForm.featured)),
      recentPosts: truncate(sanitizeProfileField(deepForm.recentPosts)),
      audience: deepForm.audience.map(sanitizeProfileField),
      struggles: deepForm.struggles.map(sanitizeProfileField),
      primaryAudience: sanitizeProfileField(deepForm.primaryAudience),
      secondaryAudience: sanitizeProfileField(deepForm.secondaryAudience)
    };

    const input: SomyraProfileInput = profileMode === 'quick' 
      ? {
          headline: sanitizedQuickForm.currentHeadline,
          about: sanitizedQuickForm.whoAreYou,
          experience: sanitizedQuickForm.whatDoYouWant || sanitizedQuickForm.goals.join(', ')
        }
      : {
          headline: sanitizedDeepForm.headline,
          about: sanitizedDeepForm.about,
          experience: sanitizedDeepForm.experienceDetails,
          fullRawText: `Role: ${sanitizedDeepForm.role}\nFocus: ${sanitizedDeepForm.specificFocus}\nIndustry: ${sanitizedDeepForm.industry}\nGoals: ${sanitizedDeepForm.primaryGoal || sanitizedDeepForm.goalDetail}\nTargets: ${sanitizedDeepForm.primaryAudience} & ${sanitizedDeepForm.secondaryAudience}\nStruggles: ${sanitizedDeepForm.struggles.join(', ')}\nExperience Level: ${sanitizedDeepForm.experience}`
        };

    trackEvent('analyze_profile', { mode: profileMode });
    setLoading(true);
    setError(null);
    setToast(null);

    const timeoutId = setTimeout(() => {
      controller.abort();
      setLoading(false);
      showToast({
        message: 'Request timed out. Please try again.',
        type: 'error'
      });
    }, 25000);

    try {
      const data = await analyzeProfile(input, profileMode, undefined, sanitizedDeepForm, sanitizedQuickForm, controller.signal);
      clearTimeout(timeoutId);

      const inferredRole = data.mode === 'strategic'
        ? sanitizedDeepForm.role
        : sanitizedQuickForm.whoAreYou;
      const inferredAudience = data.mode === 'strategic'
        ? [sanitizedDeepForm.primaryAudience, sanitizedDeepForm.secondaryAudience].filter(Boolean).join(' & ') || sanitizedDeepForm.audience.join(', ')
        : [sanitizedQuickForm.primaryAudience, sanitizedQuickForm.secondaryAudience].filter(Boolean).join(' & ') || sanitizedQuickForm.whoAreYou;
      const inferredGoal = data.mode === 'strategic'
        ? sanitizedDeepForm.primaryGoal
        : sanitizedQuickForm.whatDoYouWant || sanitizedQuickForm.goals.join(', ');
      const inferredWriterTopic =
        data.nextStep?.action ||
        data.nextStep?.description ||
        data.biggestMissedOpportunity ||
        data.verdict ||
        inferredGoal;
      const inferredOutreachReason =
        data.communicates ||
        data.nextStep?.description ||
        data.verdict ||
        'I found your profile and wanted to start a relevant conversation.';
      
      setProfile(data);
      setStats(prev => ({ ...prev, profiles: prev.profiles + 1 }));
      localStorage.setItem('somyra_last_analysis_score', String(data.overallScore));
      
      if (user) {
        try {
          await supabase.from('profile_analyses').insert({
            user_id: user.id,
            overall_score: data.overallScore,
            full_json_result: data,
            mode: profileMode
          });
        } catch (dbErr) {
          console.error('Error saving profile analysis to history:', dbErr);
        }
      }

      if (profileMode === 'quick') {
        localStorage.removeItem('somyra_quick_audit_draft');
      }

      setTopicForm(prev => ({
        ...prev,
        profession: inferredRole,
        audience: inferredAudience,
        goals: inferredGoal
      }));
      setWriterForm(prev => ({
        ...prev,
        topic: inferredWriterTopic
      }));
      
      setBioForm(prev => ({
        ...prev,
        role: inferredRole,
        skills: data.mode === 'strategic' ? sanitizedDeepForm.skills : '',
        achievements: data.mode === 'strategic' ? sanitizedDeepForm.achievements : '',
        goal: inferredGoal
      }));
      
      const industry = profileMode === 'strategic' ? sanitizedDeepForm.industry : '';
      if (industry) {
        localStorage.setItem('somyra_industry', industry);
      }

      await usageLimits.incrementUsage('profile_audit');
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.log('Profile analysis aborted');
        return;
      }
      showToast({
        message: 'Failed to analyze profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setAbortController(null);
      setIsGenerating(false);
    }
  };

  const fetchSavedItems = async () => {
    if (!user) {
      try {
        const localItems = localStorage.getItem('somyra_local_library');
        if (localItems) {
          setSavedItems(JSON.parse(localItems));
        } else {
          setSavedItems([]);
        }
      } catch (err) {
        console.error('Could not load local library');
        setSavedItems([]);
      }
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedItems(data || []);
    } catch (err) {
      console.error('Could not load saved items from Supabase');
    }
  };

  const handleSave = async (type: string, content: string, id: string) => {
    const saveLimit = usageLimits.getSavedLibraryLimit();

    if (!user) {
      return;
    }

    if (saveLimit !== 'unlimited' && savedItems.length >= (saveLimit as number)) {
      const isProUser = isPro && !isMax;
      showToast({
        message: isProUser
          ? "You've reached your Pro limit. Upgrade to Max for more."
          : "You've reached your limit. Upgrade to Pro to add more.",
        type: 'error',
        headline: 'Limit Reached',
        action: { label: isProUser ? 'Upgrade to Max' : 'Upgrade to Pro', onClick: () => setShowPricingModal(true) }
      });
      trackEvent('saved_library_limit_hit', { tier: usageLimits.tier, limit: saveLimit });
      return;
    }

    setSaving(id);
    setError(null);
    
    try {
      const { data, error: saveError } = await supabase
        .from('saved_items')
        .insert([
          { user_id: user.id, type, content }
        ])
        .select();

      if (saveError) throw saveError;
      
      if (data) {
        setSavedItems([data[0], ...savedItems]);
      }
      
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      showToast({
        message: 'Saved to your library.',
        type: 'success',
        headline: 'Saved'
      });
    } catch (err: any) {
      showToast({
        message: 'Failed to save to library. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteSaved = async (id: number) => {
    setError(null);
    
    if (!user) {
      return;
    }
    
    try {
      const { error: deleteError } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setSavedItems(savedItems.filter(item => item.id !== id));
    } catch (err: any) {
      showToast({
        message: 'Failed to delete item. Please try again.',
        type: 'error'
      });
    }
  };

  const handleDeleteAllSaved = async () => {
    setError(null);

    if (!user) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setSavedItems([]);
      
    } catch (err: any) {
      showToast({
        message: 'Failed to delete saved items. Please try again.',
        type: 'error'
      });
    }
  };

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchProStatus(session.user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        setIsAuthLoading(false);
        setAuthChecked(true);
        fetchProStatus(currentUser.id);
        
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          const redirectFeature = localStorage.getItem('somyra_redirect_feature');
          if (redirectFeature) {
            setActiveTab(redirectFeature as Tab);
            localStorage.removeItem('somyra_redirect_feature');
          }
          
          localStorage.removeItem('somyra_guest_generations');
          localStorage.removeItem('somyra_guest_voice_count');
          localStorage.removeItem('somyra_guest_saves');
          localStorage.removeItem('somyra_guest_generations_used');
          localStorage.removeItem('somyra_local_library');
          localStorage.removeItem('somyra_last_analysis_score');
          localStorage.removeItem('somyra_industry');
          localStorage.removeItem('somyra_quick_audit_draft');
          localStorage.removeItem('somyra_crm_prospects');
          setGuestSaves(0);
        }
      } else {
        setIsPro(false);
        setIsMax(false);
        setIsAuthLoading(false);
        setAuthChecked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showAuth) { setShowAuth(false); return; }
      if (showPricingModal) { setShowPricingModal(false); return; }
      if (showLimitModal) { setShowLimitModal(false); return; }
      if (showChangelog) { setShowChangelog(false); return; }
      if (isMobileMenuOpen) { setIsMobileMenuOpen(false); return; }
      if (showDeleteAllSavedConfirm) { setShowDeleteAllSavedConfirm(false); return; }
      if (showCancelModal) { setShowCancelModal(false); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAuth, showPricingModal, showLimitModal, showChangelog, isMobileMenuOpen, showDeleteAllSavedConfirm, showCancelModal]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    fetchSavedItems();
    if (user) {
      fetchVoiceProfile();
    } else {
      setVoicePosts([]);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const showToast = (toastData: typeof toast) => {
    setToast(toastData);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'pricing') {
      setShowPricingModal(true);
      trackEvent('pricing_modal_opened');
      return;
    }
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem("somyra_is_pro");
      sessionStorage.removeItem("somyra_is_max");
      setIsPro(false);
      setIsMax(false);
      setUser(null);
      setVoicePosts([]);
      setSavedItems([]);
      setResults({});
      setProfile(null);
      setActiveTab('home');
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const handleTabClick = (tabId: Tab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-teal-accent/30">
      {!authChecked ? (
        <div className="min-h-screen bg-[#080808]" />
      ) : !user ? (
        <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
          <LandingPage 
            setActiveTab={handleTabClick}
            setShowAuth={setShowAuth}
            setAuthMode={setAuthMode}
            setShowPricingModal={setShowPricingModal}
            onOpenChangelog={openChangelog}
            testimonials={testimonials}
            loadingTestimonials={loadingTestimonials}
            showReviewModal={showReviewModal}
            setShowReviewModal={setShowReviewModal}
            user={user}
          />
        </Suspense>
      ) : (
      <>
      <header className="fixed top-0 left-0 right-0 z-[40] border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-teal-accent/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center justify-center w-10 h-10 bg-[#0F0F0F] rounded-xl border border-white/10">
                <svg className="w-6 h-6 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">Somyra</h1>
              <p className="type-overline text-muted font-bold mt-1">LINKEDIN ELEVATED</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6 type-body font-semibold text-slate-400">
              <span onClick={() => scrollToSection('how-it-works')} className="cursor-pointer transition-colors hover:text-white">How it Works</span>
              
              <div 
                className="relative"
                onMouseEnter={() => setShowToolsDropdown(true)}
                onMouseLeave={() => setShowToolsDropdown(false)}
              >
                <button className="flex items-center gap-1 transition-colors hover:text-slate-200 py-2 focus:outline-none font-semibold">
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showToolsDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showToolsDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-1 w-56 rounded-xl border border-white/10 bg-[#0D0D0D] p-2 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-0.5"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/blog" className="cursor-pointer transition-colors hover:text-white">Blog</Link>
              <span onClick={() => scrollToSection('pricing')} className="cursor-pointer transition-colors hover:text-white">Pricing</span>
              <span onClick={openChangelog} className="cursor-pointer transition-colors hover:text-white relative">
                What's New
                {hasNewUpdates && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                )}
              </span>
            </nav>
            
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="relative flex max-w-[320px] cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 group">
                  <div className="w-6 h-6 bg-teal-accent/20 rounded-full flex items-center justify-center group-hover:bg-teal-accent/30 transition-colors">
                    <UserCircle className="w-4 h-4 text-teal-accent" />
                  </div>
                  <span className="truncate text-xs font-bold text-slate-200">{user.email}</span>
                  {(isPro || isMax) && (
                    <div className="flex items-center gap-1 ml-1" title={isMax ? 'Somyra Max' : 'Somyra Pro'}>
                      <Crown className="w-3.5 h-3.5 text-teal-accent" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted hover:text-red-400 transition-colors bg-white/5 rounded-full border border-white/10"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowAuth(true)}
                  className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-xs font-bold text-white transition-all active:scale-95 hover:border-teal-accent/40 hover:text-teal-accent"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleTabClick('profile')}
                  className="rounded-full bg-teal-accent px-5 py-2.5 text-xs font-bold text-black shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all active:scale-95 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:bg-teal-accent/90"
                >
                  Start Free
                </button>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-4">
            {!user && (
              <button 
                onClick={() => setShowAuth(true)}
                className="rounded-full border border-white/10 bg-transparent px-5 py-2 text-xs font-bold text-white transition-all active:scale-95 hover:border-teal-accent/40 hover:text-teal-accent"
              >
                Sign In
              </button>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-muted hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-bg-sidebar border-r border-white/5 z-[70] lg:hidden p-6 pb-12 flex flex-col overflow-y-auto custom-scrollbar"
            >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <div className="relative flex items-center justify-center w-10 h-10 bg-[#080808] rounded-xl border border-white/10">
                            <svg className="w-5 h-5 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white leading-none">Somyra</span>
                          <span className="text-[8px] text-muted font-bold tracking-widest mt-1 uppercase">ELEVATED</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-muted hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

              <nav className="flex flex-col">
                {tabs.filter(t => t.id === 'home').map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabClick(tab.id as Tab);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 mb-2 ${
                      activeTab === tab.id 
                      ? 'text-teal-accent border-l-[4px] border-teal-accent bg-teal-accent/5' 
                      : 'text-muted hover:bg-white/5 hover:text-white border-l-[4px] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-teal-accent' : 'text-muted'}`} />
                      {tab.label}
                    </div>
                  </button>
                ))}

                {sidebarGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col">
                    {group.label && (
                      <p className="type-overline font-bold text-muted mb-2 mt-4 ml-4">{group.label}</p>
                    )}
                    <div className="flex flex-col gap-1">
                      {group.items.map((itemId) => {
                        const tab = tabs.find(t => t.id === itemId);
                        if (!tab) return null;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              handleTabClick(tab.id as Tab);
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              activeTab === tab.id 
                              ? 'text-teal-accent border-l-[4px] border-teal-accent' 
                              : 'text-muted hover:bg-white/5 hover:text-white border-l-[4px] border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <tab.icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-teal-accent' : 'text-muted'}`} />
                              {tab.label}
                            </div>
                            {tab.isPro && (
                              <span className="text-[9px] font-bold bg-teal-accent/10 text-teal-accent px-1.5 py-0.5 rounded border border-teal-accent/20 uppercase">PRO</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {groupIdx < sidebarGroups.length - 1 && (
                      <div className="h-[1px] bg-white/5 my-4 mx-4" />
                    )}
                  </div>
                ))}

                <div className="h-[1px] bg-white/5 my-4 mx-4" />
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-all"
                  >
                    How it Works
                  </button>
                  <button 
                    onClick={() => scrollToSection('pricing')}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-all"
                  >
                    Pricing
                  </button>
                  <button 
                    onClick={() => {
                      openChangelog();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-all"
                  >
                    <span>What's New</span>
                    {hasNewUpdates && (
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                    )}
                  </button>
                </div>
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                {user && (
                  <div className="px-4 space-y-4">
                    <div className="flex flex-col">
                      <span className="type-overline text-muted font-medium mb-1">Logged in as</span>
                      <span className="text-xs text-slate-300 font-medium truncate">{user.email}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-sm font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
                <div className="pro-tip bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-teal-accent" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pro Tip</h3>
                  </div>
                  <p className="type-overline text-muted leading-relaxed">
                    Analyze your profile first to get personalized content suggestions.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActivating && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-teal-accent/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-teal-accent rounded-full animate-spin" />
                <Zap className="absolute inset-0 m-auto w-10 h-10 text-teal-accent animate-pulse" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Activating your account...</h2>
              <p className="text-[#888888] text-sm max-w-sm mx-auto leading-relaxed">
                We've received your payment! We're now syncing your account with Dodo Payments. This usually takes just a few seconds.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      <main className="container-max pt-28 pb-12 md:pb-16">
        {subscriptionStatus === 'cancelled' && currentPeriodEnd && (
          <div className="mb-8 p-6 rounded-[24px] bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle className="w-24 h-24 text-amber-500 -mr-8 -mt-8" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Your plan will end soon</h3>
                  <p className="text-sm text-[#888888]">
                    Your subscription is currently cancelled and will expire on <span className="text-amber-500 font-bold">{new Date(currentPeriodEnd).toLocaleDateString()}</span>.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPricingModal(true)}
                className="px-8 py-3.5 bg-amber-500 text-black font-semibold rounded-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all transform hover:scale-[1.02] active:scale-100 text-sm whitespace-nowrap"
              >
                Renew Subscription
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10 items-start">
          
          {user && (
          <aside className="sticky top-28 hidden lg:flex flex-col col-span-1 lg:col-span-3 max-h-[calc(100vh-140px)] overflow-y-auto rounded-[28px] border border-white/5 bg-bg-sidebar p-5 custom-scrollbar">
            <div className="space-y-1">
              <nav className="flex flex-col">
                {tabs.filter(t => t.id === 'home').map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabClick(tab.id as Tab);
                    }}
                    className={`group relative mb-2 flex items-center justify-between overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id 
                      ? 'text-teal-accent border-l-[4px] border-teal-accent bg-teal-accent/5' 
                      : 'text-muted hover:text-white hover:bg-white/5 border-l-[4px] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <tab.icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${activeTab === tab.id ? 'text-teal-accent' : 'text-muted'}`} />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}

                {sidebarGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col">
                    {group.label && (
                      <p className="type-overline font-bold text-muted mb-2 mt-4 ml-4">{group.label}</p>
                    )}
                    <div className="flex flex-col gap-1">
                      {group.items.map((itemId) => {
                        const tab = tabs.find(t => t.id === itemId);
                        if (!tab) return null;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              handleTabClick(tab.id as Tab);
                            }}
                            className={`group relative flex items-center justify-between overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                              activeTab === tab.id 
                              ? 'text-teal-accent border-l-[4px] border-teal-accent bg-teal-accent/5' 
                              : 'text-muted hover:text-white hover:bg-white/5 border-l-[4px] border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 relative z-10">
                              <tab.icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${activeTab === tab.id ? 'text-teal-accent' : 'text-muted'}`} />
                              <span>{tab.label}</span>
                            </div>
                            {tab.isPro && (
                              <span className="relative z-10 text-[9px] font-bold bg-teal-accent/10 text-teal-accent px-1.5 py-0.5 rounded border border-teal-accent/20 uppercase">PRO</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>
          )}

          <div className="col-span-1 lg:col-span-9 w-full min-w-0 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`w-full min-w-0 ${activeTab === 'home' ? 'space-y-10' : activeTab === 'profile' ? 'space-y-8' : 'card-premium'}`}
              >
                {activeTab === 'home' && (
                  <DashboardHome 
                    user={user}
                    isPro={isPro}
                    isMax={isMax}
                    stats={stats}
                    voicePostsCount={voicePosts.length}
                    usageLimits={usageLimits}
                    setActiveTab={handleTabClick}
                    setShowAuth={setShowAuth}
                    onUpgrade={() => setShowPricingModal(true)}
                    setToast={setToast}
                    setShowReviewModal={setShowReviewModal}
                  />
                )}

                {/* Tab Content: Voice Profile */}
                {activeTab === 'voice' && (
                  <Suspense fallback={<PostWriterLoading />}>
                    <VoiceProfile
                      user={user}
                      isPro={isPro}
                      isMax={isMax}
                      voicePosts={voicePosts}
                      setVoicePosts={setVoicePosts}
                      authChecked={authChecked}
                      setShowAuth={setShowAuth}
                      onRequireAuth={handleRequireAuth}
                      setShowPricingModal={setShowPricingModal}
                      setError={setError}
                      showToast={showToast}
                      trackEvent={trackEvent}
                      usageLimits={usageLimits}
                    />
                  </Suspense>
                )}

                {/* Tab Content: Profile Analysis */}
                {activeTab === 'profile' && (
                  <ProfileAnalysis 
                    profile={profile}
                    setProfile={setProfile}
                    loading={loading}
                    error={error}
                    setError={setError}
                    onAnalyze={handleAnalyzeProfile}
                    profileMode={profileMode}
                    setProfileMode={setProfileMode}
                    quickForm={quickForm}
                    setQuickForm={setQuickForm}
                    deepStep={deepStep}
                    setDeepStep={setDeepStep}
                    deepForm={deepForm}
                    setDeepForm={setDeepForm}
                    voicePosts={voicePosts}
                    isPro={isPro}
                    isMax={isMax}
                    setShowPricingModal={setShowPricingModal}
                    GenerationCounter={GenerationCounter}
                    handleCopy={handleCopy}
                    copied={copied}
                    setActiveTab={setActiveTab}
                    user={user}
                    onRequireAuth={handleRequireAuth}
                    usageLimits={usageLimits}
                    showToast={showToast}
                  />
                )}

                {/* Tab Content: Topic Generator */}
                {activeTab === 'topics' && (
                  <Suspense fallback={<PostWriterLoading />}>
                    <TopicGenerator
                      topicForm={topicForm}
                      setTopicForm={setTopicForm}
                      results={results}
                      setResults={setResults}
                      checkGenerationLimit={checkGenerationLimit}
                      trackEvent={trackEvent}
                      voicePosts={voicePosts}
                      profile={profile}
                      incrementUsage={usageLimits.incrementUsage}
                      showToast={showToast}
                      setToast={setToast}
                      GenerationCounter={GenerationCounter}
                      handleSave={handleSave}
                      handleCopy={handleCopy}
                      saving={saving}
                      copied={copied}
                      setStats={setStats}
                      usageLimits={usageLimits}
                      user={user}
                      onRequireAuth={handleRequireAuth}
                    />
                  </Suspense>
                )}

                {/* Tab Content: Post Writer */}
                {activeTab === 'writer' && (
                  <Suspense fallback={<PostWriterLoading />}>
                    <PostWriter
                      writerForm={writerForm}
                      setWriterForm={setWriterForm}
                      results={results}
                      setResults={setResults}
                      checkGenerationLimit={checkGenerationLimit}
                      trackEvent={trackEvent}
                      voicePosts={voicePosts}
                      profile={profile}
                      incrementUsage={usageLimits.incrementUsage}
                      showToast={showToast}
                      setToast={setToast}
                      GenerationCounter={GenerationCounter}
                      handleSave={handleSave}
                      handleCopy={handleCopy}
                      saving={saving}
                      copied={copied}
                      isDeepMode={isDeepMode}
                      setIsDeepMode={setIsDeepMode}
                      user={user}
                      onRequireAuth={handleRequireAuth}
                      isPro={isPro}
                      isMax={isMax}
                      setError={setError}
                      setStats={setStats}
                      usageLimits={usageLimits}
                    />
                  </Suspense>
                )}

                {/* Tab Content: Bio & Headline */}
                {activeTab === 'bio' && (
                  <Suspense fallback={<PostWriterLoading />}>
                    <BioGenerator
                      bioForm={bioForm}
                      setBioForm={setBioForm}
                      results={results}
                      setResults={setResults}
                      checkGenerationLimit={checkGenerationLimit}
                      trackEvent={trackEvent}
                      voicePosts={voicePosts}
                      profile={profile}
                      incrementUsage={usageLimits.incrementUsage}
                      showToast={showToast}
                      setToast={setToast}
                      GenerationCounter={GenerationCounter}
                      handleSave={handleSave}
                      handleCopy={handleCopy}
                      saving={saving}
                      copied={copied}
                      usageLimits={usageLimits}
                      user={user}
                      onRequireAuth={handleRequireAuth}
                    />
                  </Suspense>
                )}

                {/* Tab Content: DM & Outreach */}
                {activeTab === 'outreach' && (
                  <Suspense fallback={<PostWriterLoading />}>
                    <SmartOutreach
                      checkGenerationLimit={checkGenerationLimit}
                      trackEvent={trackEvent}
                      voicePosts={voicePosts}
                      profile={profile}
                      incrementUsage={usageLimits.incrementUsage}
                      showToast={showToast}
                      setToast={setToast}
                      GenerationCounter={GenerationCounter}
                      handleSave={handleSave}
                      handleCopy={handleCopy}
                      saving={saving}
                      copied={copied}
                      usageLimits={usageLimits}
                      user={user}
                      onRequireAuth={handleRequireAuth}
                    />
                  </Suspense>
                )}

                {/* Tab Content: Saved Library */}
                {activeTab === 'saved' && (
                  <Suspense fallback={<PostWriterLoading />}>
                    <SavedLibrary
                      savedItems={savedItems}
                      user={user}
                      isPro={isPro}
                      isMax={isMax}
                      setShowAuth={setShowAuth}
                      setShowPricingModal={setShowPricingModal}
                      handleCopy={handleCopy}
                      copied={copied}
                      handleDeleteSaved={handleDeleteSaved}
                      handleDeleteAllSaved={handleDeleteAllSaved}
                      authChecked={authChecked}
                      usageLimits={usageLimits}
                    />
                  </Suspense>
                )}

                {/* Tab Content: Settings */}
                {activeTab === 'settings' && (
                  !user ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 px-4">
                      <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-teal-accent" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2">Sign in to access Settings</h2>
                        <p className="text-muted text-sm max-w-xs">Create a free account to manage your preferences and usage limits.</p>
                      </div>
                      <button onClick={() => setShowAuth(true)} className="btn-gradient px-8 py-3">
                        Sign In / Sign Up
                      </button>
                    </div>
                  ) : (
                  <div className="w-full max-w-4xl mx-auto space-y-10 pb-20 px-4 sm:px-0">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-3xl font-semibold text-white tracking-tight">Account Settings</h2>
                      <p className="text-muted text-sm font-medium">Manage your global preferences, subscription, and usage limits.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Plan & Profile Card */}
                      <div className="space-y-6">
                        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="type-overline text-white font-bold">Your Profile</h3>
                            <div className="px-3 py-1 rounded-full bg-teal-accent/10 border border-teal-accent/20">
                              <span className="type-overline text-teal-accent">
                                {isMax ? 'MAX PLAN' : isPro ? 'PRO PLAN' : 'FREE PLAN'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-accent/20 rounded-2xl flex items-center justify-center">
                              <UserCircle className="w-6 h-6 text-teal-accent" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-bold truncate">{user.email}</p>
                              <p className="text-muted text-xs font-medium">ID: {user.id.slice(0, 12)}...</p>
                            </div>
                          </div>
                        </div>

                        {/* Subscription Management */}
                        {(isPro || isMax) && (
                          <div className="p-8 rounded-[32px] bg-red-500/[0.03] border border-red-500/10 hover:border-red-500/20 transition-colors">
                            <div className="flex items-center gap-2 mb-6">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <h3 className="type-overline text-red-400 font-bold">Manage Subscription</h3>
                            </div>
                            
                            <div className="space-y-4">
                              <p className="text-[#A0A0A0] text-sm leading-relaxed">
                                You are currently on the <span className="text-white font-bold">{isMax ? 'Max' : 'Pro'}</span> plan. 
                                Your subscription and billing are managed via Dodo Payments.
                              </p>
                              
                              {!cancellationRequested ? (
                                <button 
                                  onClick={() => setShowCancelModal(true)}
                                  className="w-full sm:w-auto px-6 py-3 border border-red-500/30 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500/10 transition-all active:scale-95"
                                >
                                  Request Cancellation
                                </button>
                              ) : (
                                <div className="p-4 rounded-xl bg-red-500/5 text-red-400/70 text-sm font-medium border border-red-500/10 text-center">
                                  Cancellation requested. Processing...
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {!isMax && (
                          <button 
                            onClick={() => setShowPricingModal(true)}
                            className="w-full p-8 rounded-[32px] bg-gradient-to-r from-teal-accent/10 to-transparent border border-teal-accent/20 text-left group hover:border-teal-accent/40 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="text-white font-semibold text-lg group-hover:text-teal-accent transition-colors">Upgrade your reach</h3>
                                <p className="text-muted text-sm">Unlock unlimited topics and deep strategy audits.</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-teal-accent group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Usage & Limits Sidebar */}
                      <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="type-overline text-white font-bold">Usage & Limits</h3>
                          <span className="type-overline text-muted font-bold">{usageLimits.getResetDate()}</span>
                        </div>

                        <div className="space-y-8">
                          {[
                            { key: 'profile_audit', label: 'Profile Audits', icon: UserCircle },
                            { key: 'post_writer', label: 'Post Writing', icon: PenTool },
                            { key: 'smart_outreach', label: 'Smart Outreach', icon: Send }
                          ].map(feature => {
                            const status = usageLimits.getStatus(feature.key as any);
                            const percent = status.limit === 'unlimited' ? 10 : Math.min(100, (status.used / (status.limit as number)) * 100);
                            
                            return (
                              <div key={feature.key} className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <feature.icon className="w-3.5 h-3.5 text-teal-accent/60" />
                                    <span className="text-xs font-bold text-white">{feature.label}</span>
                                  </div>
                                  <span className="type-caption text-muted tabular-nums">
                                    {status.used} / <span className="text-white">{status.limit === 'unlimited' ? '∞' : status.limit}</span>
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    className={`h-full rounded-full ${percent > 90 ? 'bg-red-500' : 'bg-teal-accent'}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-accent/5 border border-teal-accent/10">
                            <Zap className="w-4 h-4 text-teal-accent shrink-0" />
                            <p className="type-overline text-[#A0A0A0] leading-relaxed">
                              Limits are refreshed on the 1st of every month. {isMax ? 'You are on the highest tier.' : 'Upgrade to increase your monthly capacity.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Confirmation Modal */}
                    <AnimatePresence>
                      {showCancelModal && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCancelModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                          />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#0F0F0F] border border-[#1f1f1f] rounded-[32px] p-8 shadow-2xl overflow-hidden"
                          >
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
                            <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">Are you sure?</h2>
                             <p className="text-[#888888] text-sm leading-relaxed mb-8">
                               Your {isMax ? 'Max' : 'Pro'} access will remain active until the end of your current billing period. 
                               Your subscription will be cancelled immediately with Dodo Payments.
                             </p>
                            
                            <div className="flex flex-col gap-3">
                              <button 
                                onClick={async () => {
                                  try {
                                    setIsSubmittingCancellation(true);
                                    
                                    const response = await fetch('/api/cancel-subscription', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        subscriptionId: subscriptionId,
                                        userId: user.id
                                      })
                                    });

                                    if (!response.ok) throw new Error('Failed to cancel');
                                    
                                    setCancellationRequested(true);
                                    setShowCancelModal(false);
                                    setToast({
                                      message: "Your subscription has been cancelled. You will retain access until the end of this billing period.",
                                      type: 'success'
                                    });
                                    fetchProStatus(user.id);
                                  } catch (err) {
                                    console.error('Cancellation failed:', err);
                                    setError({ message: 'Failed to cancel subscription. Please try again or contact support.' });
                                  } finally {
                                    setIsSubmittingCancellation(false);
                                  }
                                }}
                                disabled={isSubmittingCancellation}
                                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                              >
                                {isSubmittingCancellation ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel My Subscription'}
                              </button>
                              <button 
                                onClick={() => setShowCancelModal(false)}
                                className="w-full py-4 border border-teal-accent/30 text-teal-accent font-bold rounded-2xl hover:bg-teal-accent/5 transition-all"
                              >
                                Keep My Subscription
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                   </div>
                  )
                )}

                {error && (
                  <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-2 relative group">
                    <button 
                      onClick={() => setError(null)}
                      className="absolute top-4 right-4 p-1 hover:bg-red-500/20 rounded-lg transition-colors text-red-400/50 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 text-red-400">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold">{error.message}</span>
                    </div>
                    {error.suggestion && (
                      <p className="text-xs text-red-400/70 ml-3.5 leading-relaxed pr-8">
                        <span className="font-bold">Suggestion:</span> {error.suggestion}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stats / Footer Area */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              <div className="bg-bg-secondary border border-border-card p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-5 hover:border-teal-accent/20 transition-all duration-500 group">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-teal-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-teal-accent" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="type-overline text-muted font-bold mb-0.5 sm:mb-1">Used This Month</p>
                  <p className="text-sm sm:text-xl font-bold text-white">{usageLimits.getStatus('profile_audit').used + usageLimits.getStatus('post_writer').used + usageLimits.getStatus('topic_generator').used}</p>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-card p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-5 hover:border-teal-accent/20 transition-all duration-500 group">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-teal-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Rocket className="w-4 h-4 sm:w-6 sm:h-6 text-teal-accent" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="type-overline text-muted font-bold mb-0.5 sm:mb-1">Posts Written</p>
                  <p className="text-sm sm:text-xl font-bold text-white">{stats.posts}</p>
                </div>
              </div>
              <div className="bg-bg-secondary border border-border-card p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-5 hover:border-teal-accent/20 transition-all duration-500 group">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-teal-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-teal-accent" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="type-overline text-muted font-bold mb-0.5 sm:mb-1">Topics Created</p>
                  <p className="text-sm sm:text-xl font-bold text-white">{stats.topics}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SomyraFooter onStartFree={() => { setAuthMode('signup'); setShowAuth(true); }} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-md p-[12px_16px] rounded-[12px] shadow-2xl backdrop-blur-xl border ${
              toast.type === 'error' 
                ? 'bg-[#1a1a1a] border-[#FF4444] text-white' 
                : 'bg-[#141414] border-teal-accent/30 text-white'
            }`}
          >
            <div className="flex gap-4">
              {toast.type === 'error' && (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-grow">
                {toast.headline && <h4 className="font-bold text-base mb-1">{toast.headline}</h4>}
                <p className={`text-sm ${toast.type === 'error' ? 'text-white/90' : 'text-slate-300'}`}>
                  {toast.subtext || toast.message}
                </p>
                
                {(toast.action || toast.secondaryAction) && (
                  <div className="flex gap-3 mt-4">
                    {toast.action && (
                      <button 
                        onClick={() => {
                          toast.action?.onClick();
                          setToast(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          toast.type === 'error' 
                            ? 'bg-white text-red-500 hover:bg-white/90' 
                            : 'bg-teal-accent text-black hover:bg-teal-accent/80'
                        }`}
                      >
                        {toast.action.label}
                      </button>
                    )}
                    {toast.secondaryAction && (
                      <a 
                        href={toast.secondaryAction.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                          toast.type === 'error'
                            ? 'border-white/30 text-white hover:bg-white/10'
                            : 'border-white/10 text-white hover:bg-white/5'
                        }`}
                      >
                        {toast.secondaryAction.label}
                      </a>
                    )}
                  </div>
                )}
              </div>
              <button 
                  onClick={() => setToast(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors h-fit shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
      {/* Modals */}
      <AnimatePresence>
        {showAuth && (
          <Auth 
            initialMode={authMode}
            feature={authFeature}
            onAuthSuccess={(userData) => {
              setUser(userData);
              if (authCallback) {
                authCallback();
                setAuthCallback(null);
              }
              setAuthFeature(undefined);
              setShowAuth(false);
            }} 
            onClose={() => {
              setShowAuth(false);
              setAuthCallback(null);
              setAuthFeature(undefined);
            }} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPricingModal && (
          <PricingModal 
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
            user={user}
            isPro={isPro}
            isMax={isMax}
            setShowAuth={setShowAuth}
            trackEvent={trackEvent}
          />
        )}
      </AnimatePresence>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        user={user}
        onSuccess={fetchTestimonials}
      />



      <LimitReachedModal 
        isOpen={showLimitModal}
        onClose={() => {
          setShowLimitModal(false);
          setLimitTriggerFeature(null);
        }}
        onPricing={() => {
          setShowLimitModal(false);
          setShowPricingModal(true);
          setLimitTriggerFeature(null);
        }}
        onAuth={() => {
          setShowLimitModal(false);
          setShowAuth(true);
          setLimitTriggerFeature(null);
        }}
        user={user}
        isPro={isPro}
        isMax={isMax}
        triggerFeature={limitTriggerFeature}
      />

      <ChangelogModal 
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </div>
  );
}
