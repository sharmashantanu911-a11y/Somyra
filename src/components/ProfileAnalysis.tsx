import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  UserCircle, 
  Info, 
  Check, 
  Target, 
  BarChart3, 
  PenTool, 
  Zap, 
  ClipboardList, 
  Briefcase, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Users, 
  HelpCircle, 
  Search, 
  Star, 
  Edit, 
  FileText,
  Eye,
  Layout,
  RefreshCw,
  Save,
  RotateCcw,
  ArrowRight,
  ArrowLeft, 
  Download,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Plus,
  X,
  Loader2,
  Copy,
  Rocket,
  Lightbulb,
  ChevronDown,
  Share2,
  Bookmark,
  Trash2,
  Mic,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Crown,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Scale,
  ArrowUpRight,
  Lock,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { type SomyraProfileAnalysis, type SomyraProfileInput, generateTargetAudience } from '../services/aiService';
import { supabase } from '../lib/supabase';
import { commonAudiences, commonFocusAreas, commonIndustries, commonRoles, goalOptions, struggleOptions } from './profile-analysis/constants';
import { ProfileAnalysisResults } from './profile-analysis/ProfileAnalysisResults';
import { FloatingLabelInput, GoalCard, LoadingScanner, SegmentedControl, SmartSelector } from './profile-analysis/shared';
import { sanitizeProfileText } from './profile-analysis/utils';

interface ProfileAnalysisProps {
  onAnalyze: (e: React.FormEvent) => void;
  profile: SomyraProfileAnalysis | null;
  setProfile: (profile: SomyraProfileAnalysis | null) => void;
  loading: boolean;
  error: { message: string; suggestion?: string } | null;
  setError: (error: { message: string; suggestion?: string } | null) => void;
  profileMode: 'quick' | 'strategic';
  setProfileMode: (mode: 'quick' | 'strategic') => void;
  quickForm: {
    whoAreYou: string;
    currentHeadline: string;
    headlineOption: 'have' | 'none' | 'rewrite';
    aboutSection: string;
    aboutOption: 'have' | 'none' | 'rewrite';
    whatDoYouWant: string;
    goals: string[];
    primaryAudience: string;
    secondaryAudience: string;
  };
  setQuickForm: React.Dispatch<React.SetStateAction<{
    whoAreYou: string;
    currentHeadline: string;
    headlineOption: 'have' | 'none' | 'rewrite';
    aboutSection: string;
    aboutOption: 'have' | 'none' | 'rewrite';
    whatDoYouWant: string;
    goals: string[];
    primaryAudience: string;
    secondaryAudience: string;
  }>>;
  deepStep: number;
  setDeepStep: React.Dispatch<React.SetStateAction<number>>;
  deepForm: {
    role: string;
    specificFocus: string;
    experienceLevel: string;
    industry: string;
    headline: string;
    headlineOption: 'have' | 'none' | 'rewrite';
    about: string;
    aboutOption: 'have' | 'none' | 'rewrite';
    aboutAnswers: {
      whatDoYouDo: string;
      whoDoYouHelp: string;
      result: string;
      different: string;
    };
    experience: string;
    experienceDetails: string;
    featured: string;
    recentPosts: string;
    primaryGoal: string;
    goalDetail: string;
    idealAudience: string;
    audience: string[];
    struggles: string[];
    otherStruggle: string;
    otherGoal: string;
    achievements: string;
    skills: string;
    primaryAudience: string;
    secondaryAudience: string;
  };
  setDeepForm: React.Dispatch<React.SetStateAction<{
    role: string;
    specificFocus: string;
    experienceLevel: string;
    industry: string;
    headline: string;
    headlineOption: 'have' | 'none' | 'rewrite';
    about: string;
    aboutOption: 'have' | 'none' | 'rewrite';
    aboutAnswers: {
      whatDoYouDo: string;
      whoDoYouHelp: string;
      result: string;
      different: string;
    };
    experience: string;
    experienceDetails: string;
    featured: string;
    recentPosts: string;
    primaryGoal: string;
    goalDetail: string;
    idealAudience: string;
    audience: string[];
    struggles: string[];
    otherStruggle: string;
    otherGoal: string;
    achievements: string;
    skills: string;
    primaryAudience: string;
    secondaryAudience: string;
  }>>;
  voicePosts: any[];
  isPro: boolean;
  isMax: boolean;
  setShowPricingModal: (show: boolean) => void;
  GenerationCounter: React.ComponentType<{ feature?: string }>;
  handleCopy: (text: string, id: string) => void;
  copied: string | null;
  setActiveTab: (tab: any) => void;
  user: any;
  usageLimits: any;
  showToast: (toast: any) => void;
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.35 } }
};

export const ProfileAnalysis: React.FC<ProfileAnalysisProps> = ({
  profile,
  setProfile,
  loading,
  error,
  setError,
  onAnalyze,
  profileMode,
  setProfileMode,
  quickForm,
  setQuickForm,
  deepStep,
  setDeepStep,
  deepForm,
  setDeepForm,
  voicePosts,
  isPro,
  isMax,
  setShowPricingModal,
  GenerationCounter,
  handleCopy,
  copied,
  setActiveTab,
  user,
  usageLimits,
  showToast
}) => {
  const [isGeneratingAudience, setIsGeneratingAudience] = useState(false);

  const handleGenerateAudience = async (target?: 'primary' | 'secondary') => {
    // Gate on usage limit
    if (!usageLimits.checkLimit('profile_audit')) {
      return; 
    }

    if (profileMode === 'quick') {
      if (!quickForm.whoAreYou || !quickForm.goals.length) {
        setValidationError("Please tell us who you are and select at least one goal first.");
        return;
      }
    } else {
      // In Deep Mode, we check based on the current step or required fields
      if (!deepForm.role || !deepForm.primaryGoal) {
        setValidationError("Please select your role and primary goal first.");
        return;
      }
    }

    setIsGeneratingAudience(true);
    try {
      const role = profileMode === 'quick' ? quickForm.whoAreYou : deepForm.role;
      const goals = profileMode === 'quick' ? quickForm.goals.join(', ') : `${deepForm.primaryGoal}: ${deepForm.goalDetail}`;
      const industry = profileMode === 'quick' ? '' : deepForm.industry;
      const experience = profileMode === 'quick' ? '' : deepForm.experienceLevel;

      // Extract more context for Deep Strategy
      let additionalContext = "";
      if (profileMode === 'strategic') {
        const answers = deepForm.aboutAnswers;
        additionalContext = [
          answers.whoDoYouHelp ? `Who I help: ${answers.whoDoYouHelp}` : "",
          answers.result ? `Result: ${answers.result}` : "",
          deepForm.achievements ? `Achievements: ${deepForm.achievements}` : "",
          deepForm.skills ? `Skills: ${deepForm.skills}` : ""
        ].filter(Boolean).join(" | ");
      }

      const result = await generateTargetAudience(role, industry, experience, goals, additionalContext, target);
      
      if (profileMode === 'quick') {
        setQuickForm(prev => ({
          ...prev,
          primaryAudience: target === 'secondary' ? prev.primaryAudience : result.primaryAudience,
          secondaryAudience: target === 'primary' ? prev.secondaryAudience : result.secondaryAudience
        }));
      } else {
        setDeepForm(prev => ({
          ...prev,
          primaryAudience: target === 'secondary' ? prev.primaryAudience : result.primaryAudience,
          secondaryAudience: target === 'primary' ? prev.secondaryAudience : result.secondaryAudience
        }));
      }
      showToast({ 
        message: target ? `${target === 'primary' ? 'Primary' : 'Secondary'} audience regenerated!` : "Audiences generated! Somyra has defined your targets based on Marcus Reid's strategy.", 
        type: 'success' 
      });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to generate audience. Please try again.", type: 'error' });
    } finally {
      setIsGeneratingAudience(false);
    }
  };
  const TOTAL_DEEP_STEPS = 6;
  const isMountedRef = useRef(true);
  const recentScansRef = useRef<HTMLDivElement>(null);

  const hasText = (value?: string | null) => typeof value === 'string' && value.trim().length > 0;
  const hasObjectContent = (value?: Record<string, any> | null) =>
    !!value &&
    Object.values(value).some((entry) => {
      if (typeof entry === 'string') return hasText(entry);
      if (typeof entry === 'number') return Number.isFinite(entry) && entry > 0;
      if (Array.isArray(entry)) return entry.length > 0;
      if (entry && typeof entry === 'object') return hasObjectContent(entry as Record<string, any>);
      return false;
    });

  // FIX 1 — SAFE DATA LAYER (MANDATORY)
  const safeProfile = useMemo(() => {
    if (!profile) return null;
    const rawRewrites = profile.rewrites;
    const normalizedRewrites = Array.isArray(rawRewrites)
      ? rawRewrites
      : rawRewrites && typeof rawRewrites === 'object'
        ? rawRewrites
        : [];
    const detailedAnalysis =
      profile.detailedAnalysis && typeof profile.detailedAnalysis === 'object' && !Array.isArray(profile.detailedAnalysis)
        ? profile.detailedAnalysis
        : {};
    return {
      ...profile,
      headline: profile.headline || profile.quickFix?.improvedHeadline || '',
      about: (profile as any).about || profile.quickFix?.improvedAbout || profile.quickFix?.aboutDirection || '',
      communicates: profile.communicates || '',
      verdict: profile.verdict || 'Analysis complete.',
      overallScore: profile.overallScore || 0,
      completeness: profile.completeness ?? profile.overallScore ?? 0,
      problems: Array.isArray(profile.problems) ? profile.problems : [],
      theGood: Array.isArray(profile.theGood) ? profile.theGood : [],
      theBad: Array.isArray(profile.theBad) ? profile.theBad : [],
      semanticGaps: Array.isArray(profile.semanticGaps) ? profile.semanticGaps : [],
      nextSteps: Array.isArray(profile.nextSteps) ? profile.nextSteps : [],
      actionPlan: Array.isArray(profile.actionPlan) ? profile.actionPlan : [],
      rewrites: normalizedRewrites,
      detailedAnalysis,
      scores: profile.scores || { headline: 0, about: 0, experience: 0, skills: 0 },
      lenses: profile.lenses || {
        seo: { score: 0, feedback: '' },
        authority: { score: 0, feedback: '' },
        narrative: { score: 0, feedback: '' }
      },
      firstImpression: profile.firstImpression || { recruiter: '', client: '', peer: '' },
      messagingClarity: profile.messagingClarity || { who: '', result: '', how: '', why: '' },
      authorityBreakdown: profile.authorityBreakdown || {},
      positioning: profile.positioning || { currentIdentity: '', category: '', unfairAdvantage: '', newIdentity: '', perceivedProblem: '' },
      transformation: profile.transformation || { before: '', after: '', bridge: '' },
      contentEngine: profile.contentEngine || { pillars: [], angles: [], authorityPlan: '' },
      monetization: profile.monetization || { bestOffer: '', whyItFits: '', pricingAngle: '' },
      nextStep: profile.nextStep || { action: '', description: '', effort: '' }
    };
  }, [profile]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    perception: true,
    problems: true,
    goodBad: true,
    nextSteps: true
  });
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [showRecentScans, setShowRecentScans] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [randomInsight, setRandomInsight] = useState("");
  const [showCompletionSignal, setShowCompletionSignal] = useState(false);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  
  // Quick Form States
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [customGoalText, setCustomGoalText] = useState("");
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    const confirmed = localStorage.getItem('somyra_identity_confirmed') === 'true';
    setIdentityConfirmed(confirmed);

    const insights = [
      "Most profiles fail because they sound like everyone else.",
      "Clarity beats cleverness every single time on LinkedIn.",
      "Your headline is an ad for your profile, not a job title.",
      "Authority is built through specific results, not generic claims.",
      "The best profiles speak directly to one person's struggle."
    ];
    setRandomInsight(insights[Math.floor(Math.random() * insights.length)]);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (profile) {
      setShowGlow(true);
      const timer = setTimeout(() => setShowGlow(false), 2000);
      
      const lastScore = localStorage.getItem('somyra_last_analysis_score');
      if (lastScore) {
        const delta = profile.overallScore - parseInt(lastScore);
        if (delta !== 0) setScoreDelta(delta);
      }
      
      setShowCompletionSignal(true);
      const signalTimer = setTimeout(() => setShowCompletionSignal(false), 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(signalTimer);
      };
    }
  }, [profile]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (recentScansRef.current && !recentScansRef.current.contains(event.target as Node)) {
        setShowRecentScans(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setShowRecentScans(false);
      }
    };

    if (isDropdownOpen || showRecentScans) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen, showRecentScans]);

  // Local Storage Persistence for Forms
  useEffect(() => {
    const savedQuickDraft = localStorage.getItem('somyra_quick_audit_draft');
    const savedDeepDraft = localStorage.getItem('somyra_deep_audit_draft');
    
    if (savedQuickDraft) {
      try {
        const parsed = JSON.parse(savedQuickDraft);
        setQuickForm(prev => ({ ...prev, ...parsed }));
        setDraftRestored(true);
      } catch (err) {
        console.error('Failed to restore quick audit draft');
      }
    }

    if (savedDeepDraft) {
      try {
        const parsed = JSON.parse(savedDeepDraft);
        setDeepForm(prev => ({ ...prev, ...parsed }));
        setDraftRestored(true);
      } catch (err) {
        console.error('Failed to restore deep audit draft');
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (profileMode === 'quick') {
        localStorage.setItem('somyra_quick_audit_draft', JSON.stringify(quickForm));
      } else {
        localStorage.setItem('somyra_deep_audit_draft', JSON.stringify(deepForm));
      }
    }, 300); // Debounced save

    return () => clearTimeout(timeoutId);
  }, [quickForm, deepForm, profileMode]);

  const clearDraft = () => {
    localStorage.removeItem('somyra_quick_audit_draft');
    localStorage.removeItem('somyra_deep_audit_draft');
    setQuickForm({
      whoAreYou: '',
      currentHeadline: '',
      headlineOption: 'have',
      aboutSection: '',
      aboutOption: 'have',
      whatDoYouWant: '',
      goals: [],
      primaryAudience: '',
      secondaryAudience: ''
    });
    setDeepForm({
      role: '',
      specificFocus: '',
      experienceLevel: 'Mid-Level',
      industry: '',
      headline: '',
      headlineOption: 'have',
      about: '',
      aboutOption: 'have',
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
      audience: [],
      struggles: [],
      otherStruggle: '',
      otherGoal: '',
      achievements: '',
      skills: '',
      primaryAudience: '',
      secondaryAudience: ''
    });
    setDeepStep(1);
    setDraftRestored(false);
    setCustomGoals([]);
    setProfile(null);
  };

  useEffect(() => {
    if (user) {
      fetchRecentScans();
    }
  }, [user]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRecentScans = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const { data, error: dbErr } = await supabase
        .from('profile_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (dbErr) throw dbErr;
      if (isMountedRef.current) {
        setRecentScans(data || []);
      }
    } catch (err) {
      console.error('Error fetching recent scans:', err);
    } finally {
      if (isMountedRef.current) {
        setLoadingHistory(false);
      }
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const triggerAnalyze = () => {
    onAnalyze({ preventDefault: () => {} } as React.FormEvent);
  };

  const [customStruggles, setCustomStruggles] = useState<string[]>([]);
  const [isAddingCustomStruggle, setIsAddingCustomStruggle] = useState(false);
  const [customStruggleInput, setCustomStruggleInput] = useState("");


  const toggleExample = (fieldId: string) => {
    setShowExamples(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const getInputQuality = (text: string, field: string) => {
    if (!text || text.trim().length === 0) return null;
    const trimmed = text.trim();
    
    if (field === 'whoAreYou' || field === 'role' || field === 'primaryGoal') {
      if (trimmed.length < 15 || !trimmed.includes(' ')) {
        return { type: 'vague', message: "This is too vague — be more specific about who you help" };
      }
      if (trimmed.length > 40) {
        return { type: 'strong', message: "Good — this is clear and specific" };
      }
    }
    return null;
  };

  const renderInputPreview = () => {
    if (profileMode === 'quick') {
      if (quickForm.whoAreYou.length > 10 && quickForm.goals.length > 0) {
        const goalText = quickForm.goals.length > 0 ? goalOptions.find(g => g.id === quickForm.goals[0])?.title || quickForm.goals[0] : 'your goals';
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 mt-6"
          >
            <p className="text-[10px] font-bold text-teal-accent uppercase tracking-widest mb-2">Direction Preview</p>
            <p className="text-xs text-[#777777] leading-relaxed">
              "You appear as <span className="text-white font-medium">{quickForm.whoAreYou.split(' ').slice(0, 5).join(' ')}...</span> working towards <span className="text-white font-medium">{goalText}</span>."
            </p>
          </motion.div>
        );
      }
    } else {
      if (deepForm.role && deepForm.primaryGoal) {
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 mt-6"
          >
            <p className="text-[10px] font-bold text-teal-accent uppercase tracking-widest mb-2">Direction Preview</p>
            <p className="text-xs text-[#777777] leading-relaxed">
              "You appear as <span className="text-white font-medium">{deepForm.role}</span> {deepForm.specificFocus ? `specializing in ${deepForm.specificFocus}` : ''} helping <span className="text-white font-medium">{deepForm.audience.length > 0 ? deepForm.audience[0] : 'your audience'}</span> achieve <span className="text-white font-medium">{deepForm.primaryGoal}</span>."
            </p>
          </motion.div>
        );
      }
    }
    return null;
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickForm.whoAreYou.trim().length < 10) {
      setValidationError("This helps us give you accurate results — please tell us a little about yourself.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const textarea = document.getElementById('whoAreYou');
      if (textarea) textarea.focus();
      return;
    }

    if (!usageLimits.checkLimit('profile_audit')) {
      return; // Modal shown by App.tsx through usageLimits.checkLimit potentially? 
      // Actually, checkLimit in App.tsx sets setShowLimitModal(true). 
      // But here usageLimits is passed down, so we should check its internal checkLimit which might not show the modal.
      // Wait, usageLimits in App.tsx is just the hook return.
    }

    // Sanitize
    const sanitizedForm = {
      ...quickForm,
      whoAreYou: sanitizeProfileText(quickForm.whoAreYou),
      currentHeadline: sanitizeProfileText(quickForm.currentHeadline),
      aboutSection: sanitizeProfileText(quickForm.aboutSection)
    };
    setQuickForm(sanitizedForm);

    onAnalyze(e);
  };

  const handleDeepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!deepForm.role.trim()) {
      setValidationError("Please select your role in Step 1.");
      setDeepStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!deepForm.primaryGoal.trim()) {
      setValidationError("Please select your primary goals in Step 5.");
      setDeepStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!usageLimits.checkLimit('profile_audit')) {
      return;
    }

    // Sanitize all text fields in deepForm
    const sanitizedForm = {
      ...deepForm,
      role: sanitizeProfileText(deepForm.role),
      industry: sanitizeProfileText(deepForm.industry),
      specificFocus: sanitizeProfileText(deepForm.specificFocus),
      headline: sanitizeProfileText(deepForm.headline),
      about: sanitizeProfileText(deepForm.about),
      achievements: sanitizeProfileText(deepForm.achievements),
      skills: sanitizeProfileText(deepForm.skills),
      experienceDetails: sanitizeProfileText(deepForm.experienceDetails),
      primaryGoal: sanitizeProfileText(deepForm.primaryGoal),
      audience: deepForm.audience.map(sanitizeProfileText),
      featured: sanitizeProfileText(deepForm.featured),
      recentPosts: sanitizeProfileText(deepForm.recentPosts)
    };
    
    setDeepForm(sanitizedForm);
    onAnalyze(e);
  };

  const calculateProgress = () => {
    let progress = 0;
    if (quickForm.whoAreYou.trim().length >= 10) progress += 25;
    if (quickForm.headlineOption !== 'have' || quickForm.currentHeadline.trim().length > 0) progress += 25;
    if (quickForm.aboutOption !== 'have' || quickForm.aboutSection.trim().length > 0) progress += 25;
    if (quickForm.goals.length >= 1) progress += 25;
    return progress;
  };

  const calculateDeepProgress = () => {
    return Math.round((deepStep / TOTAL_DEEP_STEPS) * 100);
  };

  const toggleGoal = (goalId: string) => {
    const current = [...quickForm.goals];
    if (current.includes(goalId)) {
      setQuickForm({ ...quickForm, goals: current.filter(g => g !== goalId) });
    } else {
      setQuickForm({ ...quickForm, goals: [...current, goalId] });
    }
  };

  const renderError = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 space-y-6 text-center"
    >
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold text-white">Analysis Failed</h3>
        <p className="text-[#888888] text-sm leading-relaxed">
          {error?.message || "Something went wrong while analyzing your profile. This could be due to a network issue or an AI timeout."}
        </p>
        {error?.suggestion && <p className="text-xs text-red-400/80 italic">{error.suggestion}</p>}
      </div>
      <button
        type="button"
        onClick={() => {
          setError(null);
          triggerAnalyze();
        }}
        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-[#CCCCCC] transition-all active:scale-95 flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Analysis
      </button>
    </motion.div>
  );

  const renderResults = () => {
    if (!safeProfile) return null;

    return (
      <ProfileAnalysisResults
        profile={safeProfile}
        deepForm={deepForm}
        quickForm={quickForm}
        copied={copied}
        handleCopy={handleCopy}
        scoreDelta={scoreDelta}
        randomInsight={randomInsight}
        isPro={isPro}
        setProfile={setProfile}
        setProfileMode={setProfileMode}
        setDeepStep={setDeepStep}
        setShowPricingModal={setShowPricingModal}
        setActiveTab={setActiveTab}
        triggerAnalyze={triggerAnalyze}
        usageLimits={usageLimits}
      />
    );

    const isStrategic = safeProfile.mode === 'strategic';
    const status = getStatusPill(safeProfile.overallScore);

    const CollapsibleSection = ({ id, title, icon: Icon, children, defaultExpanded = false, badge }: any) => {
      const isExpanded = expandedSections[id] ?? defaultExpanded;
      return (
        <motion.div variants={itemVariants} className="space-y-4">
          <button
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between px-2 group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-teal-accent/10 text-teal-accent' : 'bg-white/5 text-[#555555] group-hover:text-[#888888]'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
                {badge && (
                  <span className="px-2 py-0.5 rounded bg-teal-accent/10 border border-teal-accent/20 text-[8px] font-bold text-teal-accent uppercase tracking-widest">
                    {badge}
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#555555] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-2">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-10 max-w-[1100px] mx-auto px-4 sm:px-6"
      >
        {/* RESULT HEADER BAR */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                // Smooth exit animation
                const container = document.getElementById('profile-results-container');
                if (container) {
                  container.style.opacity = '0';
                  container.style.transform = 'translateY(20px)';
                  container.style.transition = 'all 0.3s ease-in-out';
                }
                setTimeout(() => {
                  setProfile(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 300);
              }}
              className="flex items-center gap-2 text-xs font-bold text-teal-accent uppercase tracking-wider hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </button>
            {scoreDelta !== null && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${scoreDelta > 0 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {scoreDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} Improvement
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const text = `I just got a ${safeProfile.overallScore}/100 S-Tier Profile Audit from Somyra! 🚀\n\nAudit Verdict: ${safeProfile.verdict}\n\nGet yours at: ${window.location.origin}`;
                handleCopy(text, 'share-score');
                // Zero friction sharing toast is handled by handleCopy
              }}
              className="flex items-center gap-2 text-[10px] font-bold text-[#555555] uppercase tracking-wide hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied === 'share-score' ? 'Copied Link!' : 'Share Score'}
            </button>
          </div>
        </motion.div>

        <div id="profile-results-container" className="space-y-6">
          {/* SECTION 1: THE DIAGNOSIS (HERO CARD) */}
          <motion.div
            ref={heroRef}
            variants={itemVariants}
            className={`bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10 relative overflow-hidden bg-gradient-to-br from-[#141414] via-[#141414] to-teal-accent/5 transition-all duration-1000 ${showGlow ? 'shadow-[0_0_40px_rgba(45,212,191,0.15)] border-teal-accent/30' : ''}`}
          >
            {showCompletionSignal && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-accent/10 to-transparent skew-x-12 pointer-events-none z-20"
              />
            )}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-accent/5 blur-[120px] -mr-48 -mt-48 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-center relative z-10">
            <div className="relative flex-shrink-0">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-[#1a1a1a] fill-none"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-teal-accent fill-none"
                    strokeWidth="10"
                    strokeDasharray="100 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - safeProfile.overallScore }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{safeProfile.overallScore}</span>
                  <span className="text-[11px] font-bold text-[#555555] uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left w-full">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border shrink-0 ${status.color}`}>
                  {status.text}
                </span>
                <div className="hidden sm:block h-px w-8 bg-white/10" />
                <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest shrink-0">The Diagnosis</span>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight break-words">
                  As a {deepForm.role || quickForm.whoAreYou.split(' ')[0] || 'professional'}, {safeProfile.verdict}
                </h2>
                <p className="text-sm text-[#888888] font-medium max-w-2xl mx-auto lg:mx-0">Based on real LinkedIn growth patterns and authority signals.</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-accent/5 border border-teal-accent/10">
                  <Sparkles className="w-3 h-3 text-teal-accent" />
                  <p className="text-[10px] text-teal-accent/80 font-bold uppercase tracking-widest">
                    You’re 1 step closer to a high-converting profile
                  </p>
                </div>
              </div>
              
              <div className="h-px bg-white/5 w-full" />
              
              <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-left group/truth hover:border-red-500/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/truth:bg-red-500/20 transition-colors">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block">The Hard Truth</span>
                  <p className="text-sm text-[#AAAAAA] leading-relaxed italic">
                    "{safeProfile.communicates}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 1.5: STRATEGIC LENSES (STRATEGIC ONLY) */}
        {isStrategic && hasObjectContent(safeProfile.lenses) && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(safeProfile.lenses).map(([key, lens]: [string, any]) => (
              <div key={key} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4 relative overflow-hidden group hover:border-teal-accent/30 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-teal-accent/10 transition-colors" />
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest">{key} Lens</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse" />
                    <span className="text-xs font-black text-teal-accent">{lens.score}/100</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${lens.score}%` }}
                    className="h-full bg-teal-accent"
                  />
                </div>
                <p className="text-xs text-[#AAAAAA] leading-relaxed italic relative z-10">"{lens.feedback}"</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* SECTION 2: WHAT YOUR PROFILE COMMUNICATES (PERCEPTION VS REALITY) */}
        {hasObjectContent(safeProfile.firstImpression) && (
          <CollapsibleSection id="perception" title="What Your Profile Communicates" icon={Eye} defaultExpanded={true} badge="Perception Audit">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4 relative overflow-hidden group hover:border-teal-accent/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-teal-accent/10 transition-colors" />
                <div className="flex items-center gap-2 text-teal-accent relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-teal-accent/10 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Recruiter View</span>
                </div>
                <p className="text-sm text-[#AAAAAA] leading-relaxed italic relative z-10">"{safeProfile.firstImpression?.recruiter || 'Analyzing perception...'}"</p>
              </div>
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4 relative overflow-hidden group hover:border-teal-accent/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-teal-accent/10 transition-colors" />
                <div className="flex items-center gap-2 text-teal-accent relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-teal-accent/10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Client View</span>
                </div>
                <p className="text-sm text-[#AAAAAA] leading-relaxed italic relative z-10">"{safeProfile.firstImpression?.client || 'Analyzing perception...'}"</p>
              </div>
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 space-y-4 relative overflow-hidden group hover:border-teal-accent/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-accent/5 blur-2xl -mr-12 -mt-12 group-hover:bg-teal-accent/10 transition-colors" />
                <div className="flex items-center gap-2 text-teal-accent relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-teal-accent/10 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Peer View</span>
                </div>
                <p className="text-sm text-[#AAAAAA] leading-relaxed italic relative z-10">"{safeProfile.firstImpression?.peer || 'Analyzing perception...'}"</p>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 3: CRITICAL FRICTION POINTS */}
        {safeProfile.problems && safeProfile.problems.length > 0 && (
          <CollapsibleSection id="friction-points" title="Critical Friction Points" icon={AlertTriangle} defaultExpanded={true} badge="Audit Results">
            <div className="space-y-4">
              {safeProfile.problems.slice(0, 3).map((problem: any, idx: number) => (
                <div key={idx} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 group hover:border-red-500/20 transition-all">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 font-black text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <h4 className="text-lg font-bold text-white leading-tight">{problem.title}</h4>
                    </div>
                    <div className="pl-0 lg:pl-13">
                      <p className="text-sm text-[#888888] leading-relaxed">
                        <span className="text-[#AAAAAA] font-bold">Impact:</span> {problem.impact}
                      </p>
                    </div>
                  </div>
                  <div className="lg:w-1/3 bg-teal-accent/5 border border-teal-accent/10 rounded-2xl p-6 flex items-center group-hover:bg-teal-accent/10 transition-colors">
                    <div className="space-y-3 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-accent" />
                        <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest">The Fix</span>
                      </div>
                      <p className="text-sm text-teal-accent leading-relaxed font-medium">
                        {problem.fix}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 3.2: STRATEGIC MESSAGING (STRATEGIC ONLY) */}
        {isStrategic && hasObjectContent(safeProfile.messagingClarity) && (
          <CollapsibleSection id="messaging" title="Strategic Messaging" icon={MessageSquare} defaultExpanded={false} badge="Deep Strategy">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#555555]" />
                      <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest block">The Who</span>
                    </div>
                    <p className="text-xl font-bold text-white leading-tight">{safeProfile.messagingClarity.who}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-teal-accent" />
                      <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest block">The Result</span>
                    </div>
                    <p className="text-xl font-bold text-teal-accent leading-tight">{safeProfile.messagingClarity.result}</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#555555]" />
                      <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest block">The How</span>
                    </div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed">{safeProfile.messagingClarity.how}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#555555]" />
                      <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest block">The Why</span>
                    </div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed">{safeProfile.messagingClarity.why}</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 3.3: AUTHORITY BREAKDOWN (STRATEGIC ONLY) */}
        {isStrategic && hasObjectContent(safeProfile.authorityBreakdown) && (
          <CollapsibleSection id="authority-breakdown" title="Authority Breakdown" icon={ShieldCheck} defaultExpanded={false} badge="Deep Strategy">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                {Object.entries(safeProfile.authorityBreakdown).map(([key, val]: [string, any]) => (
                  <div key={key} className="space-y-4 text-center group">
                    <span className="text-[9px] font-black text-[#555555] group-hover:text-teal-accent uppercase tracking-widest block transition-colors">{key}</span>
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                        <motion.circle
                          cx="40" cy="40" r="36" fill="transparent" stroke="var(--teal-accent)" strokeWidth="6"
                          strokeDasharray={2 * Math.PI * 36}
                          initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - (val as number) / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black text-white">{val}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 3.4: THE GOOD & THE BAD (STRATEGIC ONLY) */}
        {isStrategic && (safeProfile.theGood?.length > 0 || safeProfile.theBad?.length > 0) && (
          <CollapsibleSection id="good-bad" title="The Good & The Bad" icon={Scale} defaultExpanded={false} badge="Deep Strategy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 space-y-6 group hover:border-green-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">What's Working</span>
                </div>
                <div className="space-y-4">
                  {safeProfile.theGood?.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-[#AAAAAA] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 space-y-6 group hover:border-red-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">What's Failing</span>
                </div>
                <div className="space-y-4">
                  {safeProfile.theBad?.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-[#AAAAAA] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 3.5: STRATEGIC POSITIONING (STRATEGIC ONLY) */}
        {isStrategic && hasObjectContent(safeProfile.positioning) && (
          <CollapsibleSection id="positioning" title="Strategic Positioning" icon={Target} defaultExpanded={false} badge="Deep Strategy">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-accent/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                 <div className="space-y-8">
                   <div className="space-y-3">
                     <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest block">Category Ownership</span>
                     <p className="text-xl font-bold text-white leading-tight">{safeProfile.positioning.category}</p>
                   </div>
                   <div className="space-y-3">
                     <span className="text-[10px] font-black text-[#555555] uppercase tracking-widest block">Unfair Advantage</span>
                     <p className="text-sm text-[#AAAAAA] leading-relaxed">{safeProfile.positioning.unfairAdvantage}</p>
                   </div>
                 </div>
                 <div className={`space-y-6 bg-white/[0.02] border rounded-2xl p-6 md:p-8 transition-all duration-1000 ${showGlow ? 'border-teal-accent/40 shadow-[0_0_30px_rgba(45,212,191,0.1)]' : 'border-white/5'}`}>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest block">New Identity</span>
                     {identityConfirmed ? (
                       <div className="flex items-center gap-1 text-[9px] font-bold text-teal-accent uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3" />
                         Confirmed
                       </div>
                     ) : (
                       <button 
                         onClick={() => {
                           localStorage.setItem('somyra_identity_confirmed', 'true');
                           setIdentityConfirmed(true);
                           handleCopy('Identity confirmed!', 'identity-confirm');
                         }}
                         className="text-[9px] font-bold text-[#555555] hover:text-teal-accent uppercase tracking-widest transition-colors border border-[#333333] px-2 py-1 rounded-lg hover:border-teal-accent/30"
                       >
                         This feels right
                       </button>
                     )}
                   </div>
                   <p className="text-xl font-bold text-white leading-tight">{safeProfile.positioning.newIdentity}</p>
                   <div className="h-px bg-white/5 w-full" />
                   <div className="space-y-2">
                     <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">Perceived Problem</span>
                     <p className="text-sm text-[#888888] italic leading-relaxed">"{safeProfile.positioning.perceivedProblem}"</p>
                   </div>
                 </div>
               </div>
            </div>
          </CollapsibleSection>
        )}
        {/* SECTION 4: THE TRANSFORMATION */}
        {hasObjectContent(safeProfile.transformation) && (
          <CollapsibleSection id="transformation" title="The Transformation" icon={RefreshCw} defaultExpanded={true} badge="Strategic Shift">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl overflow-hidden group hover:border-teal-accent/20 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1f1f1f]">
                <div className="p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <X className="w-16 h-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest">Current Positioning (Before)</span>
                  </div>
                  <p className="text-sm text-[#888888] italic leading-relaxed relative z-10">
                    "{safeProfile.transformation.before}"
                  </p>
                </div>
                <div className="p-8 space-y-6 bg-teal-accent/[0.02] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="w-16 h-16 text-teal-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-accent" />
                    <span className="text-[10px] font-bold text-teal-accent uppercase tracking-widest">Strategic Positioning (After)</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-relaxed relative z-10">
                    "{safeProfile.transformation.after}"
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] border-t border-[#1f1f1f] text-center">
                <p className="text-xs text-[#555555] font-medium italic">
                  <span className="text-teal-accent/50 font-bold not-italic mr-2">BRIDGE:</span> {safeProfile.transformation.bridge}
                </p>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 4.5: PROFILE REWRITES */}
        {((isStrategic && Array.isArray(safeProfile.rewrites) && safeProfile.rewrites.length > 0) || (!isStrategic && hasObjectContent(safeProfile.rewrites as Record<string, any>) && !Array.isArray(safeProfile.rewrites))) && (
          <CollapsibleSection id="rewrites" title="Strategic Rewrites" icon={PenTool} defaultExpanded={true} badge={isStrategic ? "Deep Strategy" : "Optimization"}>
            <div className="space-y-6">
              {isStrategic && Array.isArray(safeProfile.rewrites) ? (
                safeProfile.rewrites.map((rewrite: any, idx: number) => (
                  <div key={idx} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl overflow-hidden group hover:border-teal-accent/20 transition-all">
                    <div className="p-4 bg-white/[0.02] border-b border-[#1f1f1f] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-accent/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-teal-accent" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{rewrite.section} Rewrite</span>
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-teal-accent/10 text-[8px] font-bold text-teal-accent uppercase tracking-widest">Deep Strategy</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopy(rewrite.suggested, `rewrite-${idx}`)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-[#888888] hover:text-teal-accent hover:border-teal-accent/30 transition-all"
                      >
                        {copied === `rewrite-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === `rewrite-${idx}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="p-6 md:p-8 space-y-8">
                      <div className="flex items-start gap-3 bg-teal-accent/5 rounded-xl p-4 border border-teal-accent/10">
                        <Info className="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-teal-accent uppercase tracking-widest block">The Strategy</span>
                          <p className="text-xs text-teal-accent/80 leading-relaxed italic">"{rewrite.strategy}"</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <span className="text-[9px] font-bold text-red-400/50 uppercase tracking-widest block">Current (Before)</span>
                          <div className="p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10">
                            <p className="text-xs text-[#555555] leading-relaxed line-through opacity-50">{rewrite.original || 'No original content provided.'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-[9px] font-bold text-teal-accent uppercase tracking-widest block">Somyra's Suggestion (After)</span>
                          <div className="p-4 rounded-xl bg-teal-accent/[0.02] border border-teal-accent/20">
                            <p className="text-sm text-white leading-relaxed font-medium">{rewrite.suggested}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Headline Rewrite (Quick Mode) */}
                  <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 space-y-6 group hover:border-teal-accent/20 transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-accent/10 flex items-center justify-center">
                          <Layout className="w-5 h-5 text-teal-accent" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Improved Headline</h4>
                          <p className="text-[10px] text-[#555555] font-bold uppercase tracking-widest">The Conversion Hook</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy((safeProfile.rewrites as any).headline || '', 'headline')}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl transition-all text-[#555555] hover:text-teal-accent hover:border-teal-accent/30"
                      >
                        {copied === 'headline' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex-1 p-6 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-center">
                      <p className="text-lg font-bold text-white leading-relaxed italic">
                        "{(safeProfile.rewrites as any).headline || 'Generating headline...'}"
                      </p>
                    </div>
                    {((safeProfile.rewrites as any).headlineStrategy) && (
                      <div className="mt-6 flex items-start gap-3 bg-teal-accent/5 rounded-xl p-4 border border-teal-accent/10">
                        <Info className="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-teal-accent/80 leading-relaxed">
                          <span className="font-bold">Strategy:</span> {(safeProfile.rewrites as any).headlineStrategy}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* About Section Rewrite (Quick Mode) */}
                  <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 space-y-6 group hover:border-teal-accent/20 transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-accent/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-teal-accent" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Improved About Section</h4>
                          <p className="text-[10px] text-[#555555] font-bold uppercase tracking-widest">The Authority Narrative</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy((safeProfile.rewrites as any).about || '', 'about')}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl transition-all text-[#555555] hover:text-teal-accent hover:border-teal-accent/30"
                      >
                        {copied === 'about' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex-1 p-6 bg-black/40 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                      <p className="text-sm text-[#AAAAAA] leading-relaxed whitespace-pre-wrap">
                        {(safeProfile.rewrites as any).about || 'Generating about section...'}
                      </p>
                    </div>
                    {((safeProfile.rewrites as any).aboutStrategy) && (
                      <div className="mt-6 flex items-start gap-3 bg-teal-accent/5 rounded-xl p-4 border border-teal-accent/10">
                        <Info className="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-teal-accent/80 leading-relaxed">
                          <span className="font-bold">Strategy:</span> {(safeProfile.rewrites as any).aboutStrategy}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}
        {safeProfile.actionPlan && safeProfile.actionPlan.length > 0 && (
          <CollapsibleSection id="action-plan" title="24-Hour Action Plan" icon={Zap} defaultExpanded={true} badge="Execution">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-xl">
              <div className="divide-y divide-[#1f1f1f]">
                {safeProfile.actionPlan.map((step: any, idx: number) => (
                  <div key={idx} className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 group hover:bg-white/[0.02] transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-[#222222] flex items-center justify-center shrink-0 text-sm font-black text-[#555555] group-hover:bg-teal-accent group-hover:text-black group-hover:border-teal-accent transition-all duration-300 shadow-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="text-lg font-bold text-white group-hover:text-teal-accent transition-colors">{step.title}</h4>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                          <div className={`w-1.5 h-1.5 rounded-full ${step.effort === 'Low' ? 'bg-green-500' : step.effort === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <span className="text-[9px] font-black text-[#888888] uppercase tracking-widest">
                            Effort: {step.effort}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-[#888888] leading-relaxed group-hover:text-[#AAAAAA] transition-colors">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 5.5: CONTENT ENGINE (STRATEGIC ONLY) */}
        {isStrategic && hasObjectContent(safeProfile.contentEngine) && (
          <CollapsibleSection id="content-engine" title="Content Engine" icon={TrendingUp} defaultExpanded={false} badge="Deep Strategy">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-teal-accent/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-accent/10 flex items-center justify-center group-hover:bg-teal-accent group-hover:text-black transition-all">
                      <Target className="w-5 h-5 text-teal-accent group-hover:text-black" />
                    </div>
                    <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest block">Content Pillars</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {safeProfile.contentEngine.pillars?.map((pillar: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-[#888888] hover:text-white hover:border-white/20 transition-all">
                        {pillar}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-teal-accent/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-accent/10 flex items-center justify-center group-hover:bg-teal-accent group-hover:text-black transition-all">
                      <Zap className="w-5 h-5 text-teal-accent group-hover:text-black" />
                    </div>
                    <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest block">Strategic Angles</span>
                  </div>
                  <div className="space-y-3">
                    {safeProfile.contentEngine.angles?.map((angle: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 group/item">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-accent mt-1.5 shrink-0 group-hover/item:scale-125 transition-transform" />
                        <p className="text-xs text-[#AAAAAA] leading-relaxed group-hover/item:text-white transition-colors">{angle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 bg-teal-accent/[0.02] border border-teal-accent/10 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldCheck className="w-20 h-20 text-teal-accent" />
                </div>
                <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest block mb-3 relative z-10">Authority Plan</span>
                <p className="text-sm text-white leading-relaxed italic relative z-10">"{safeProfile.contentEngine.authorityPlan}"</p>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 5.6: MONETIZATION STRATEGY (STRATEGIC ONLY) */}
        {isStrategic && hasObjectContent(safeProfile.monetization) && (
          <CollapsibleSection id="monetization" title="Monetization Strategy" icon={Crown} defaultExpanded={false} badge="Deep Strategy">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-center group hover:border-teal-accent/20 transition-all">
              <div className="w-24 h-24 rounded-3xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(45,212,191,0.1)] group-hover:scale-110 transition-transform duration-500">
                <Crown className="w-12 h-12 text-teal-accent" />
              </div>
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest">The High-Ticket Offer</span>
                  <h4 className="text-2xl font-black text-white leading-tight">{safeProfile.monetization.bestOffer}</h4>
                </div>
                <p className="text-sm text-[#888888] leading-relaxed max-w-2xl mx-auto lg:mx-0 italic">"{safeProfile.monetization.whyItFits}"</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:border-teal-accent/30 transition-all">
                    <Zap className="w-3.5 h-3.5 text-teal-accent" />
                    Pricing Angle: {safeProfile.monetization.pricingAngle}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 5.7: SEMANTIC GAPS (STRATEGIC ONLY) */}
        {isStrategic && safeProfile.semanticGaps && safeProfile.semanticGaps.length > 0 && (
          <CollapsibleSection id="semantic-gaps" title="Semantic Gaps" icon={Search} defaultExpanded={false} badge="Deep Strategy">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeProfile.semanticGaps.map((gap: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-red-500/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-all">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed group-hover:text-white transition-colors italic">"{gap}"</p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}
        {isStrategic && safeProfile.scores && (
          <CollapsibleSection id="detailed-breakdown" title="Detailed Section Breakdown" icon={Layout} defaultExpanded={false} badge="Deep Strategy">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(safeProfile.scores).map(([key, score]: [string, any], idx: number) => {
                if (key === 'coherence') return null;
                const sectionData = safeProfile.detailedAnalysis?.[key as keyof typeof safeProfile.detailedAnalysis];
                return (
                  <div key={key} className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-8 space-y-6 group hover:border-teal-accent/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-teal-accent transition-colors">{key}</span>
                      <span className={`text-sm font-black ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-teal-accent' : 'text-amber-400'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full rounded-full ${score >= 80 ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : score >= 60 ? 'bg-teal-accent shadow-[0_0_10px_rgba(45,212,191,0.3)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'}`}
                      />
                    </div>
                    {sectionData && (
                      <div className="pt-2">
                        <p className="text-xs text-[#777777] leading-relaxed italic group-hover:text-[#AAAAAA] transition-colors">
                          "{typeof sectionData === 'string' ? sectionData : 'Analysis available in full report'}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* SECTION 7: COMPLETENESS & NEXT STEPS */}
        <CollapsibleSection id="completeness" title="Completeness & Next Steps" icon={Rocket} defaultExpanded={true} badge="Final Verdict">
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 md:p-10 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-black text-white uppercase tracking-tighter">Overall Profile Completeness</span>
                  <p className="text-xs text-[#555555] font-medium">Based on Somyra's 50-point surgical analysis</p>
                </div>
                <span className="text-2xl font-black text-teal-accent">{safeProfile.completeness || 0}%</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${safeProfile.completeness || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-teal-accent/40 via-teal-accent to-teal-accent/40 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                />
              </div>
            </div>

            {hasObjectContent(safeProfile.nextStep) && (
              <div className="p-8 bg-teal-accent/[0.02] border border-teal-accent/10 rounded-3xl flex flex-col lg:flex-row gap-8 items-center group hover:border-teal-accent/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Rocket className="w-32 h-32 text-teal-accent" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-teal-accent flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.3)] group-hover:scale-110 transition-transform">
                  <Rocket className="w-8 h-8 text-black" />
                </div>
                <div className="flex-1 text-center lg:text-left space-y-3 relative z-10">
                  <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest block">The One Thing</span>
                  <h4 className="text-xl font-black text-white leading-tight">{safeProfile.nextStep.action}</h4>
                  <p className="text-sm text-[#888888] leading-relaxed max-w-2xl mx-auto lg:mx-0">{safeProfile.nextStep.description}</p>
                </div>
                <div className="shrink-0 relative z-10">
                  <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest group-hover:border-teal-accent/30 transition-all">
                    Effort: {safeProfile.nextStep.effort}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* SECTION 8: DEEP STRATEGY CTA (FOR QUICK MODE) */}
        {safeProfile.mode === 'quick' && (
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-teal-accent/10 to-transparent border border-teal-accent/20 rounded-2xl p-10 text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-accent/20 border border-teal-accent/30 text-[10px] font-bold text-teal-accent uppercase tracking-widest">
                <Crown className="w-3 h-3" /> Deep Strategy Available
              </div>
              <h3 className="text-2xl font-bold text-white">Ready for the full transformation?</h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                See exactly how to turn this into a high-authority profile. Our Deep Strategy audit performs a 50-point surgical analysis of your profile, positioning, and content engine.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="btn-gradient px-8 py-4 text-base"
                >
                  Unlock Full Deep Strategy
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 9: NEXT STEPS & LOOP */}
        <motion.div variants={itemVariants} className="pt-10 space-y-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">What's next?</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Analysis is just the start. Now it's time to execute. If you follow this plan, your profile will feel completely different within days.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setActiveTab('writer')}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#CCCCCC] transition-all active:scale-95"
                  >
                  <PenTool className="w-4 h-4" />
                  Rewrite my profile
                </button>
                <button 
                  onClick={() => setActiveTab('topics')}
                  className="w-full bg-[#141414] border border-[#1f1f1f] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate posts
                </button>
                {!isStrategic && (
                  <button 
                    onClick={() => {
                      if (!isPro) {
                        setShowPricingModal(true);
                        return;
                      }
                      setProfileMode('strategic');
                      setProfile(null);
                      setDeepStep(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-teal-accent/10 border border-teal-accent/20 text-teal-accent font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-accent/20 transition-all active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Run Deep Strategy
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles className="w-16 h-16" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest">Daily Insight</span>
                <p className="text-sm text-white font-medium leading-relaxed italic">
                  "{randomInsight}"
                </p>
              </div>
              <div className="pt-6">
                <p className="text-[11px] text-[#555555] font-medium leading-relaxed">
                  Come back after updating your profile — you’ll see the difference.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-10">
            <p className="text-[10px] text-[#333333] uppercase tracking-[0.3em] font-black">
              End of Analysis • Somyra Intelligence
            </p>
          </div>
        </motion.div>

        <p className="text-center text-[11px] text-[#555555] font-medium pt-4">
          This is fixable. You just need the right positioning.
        </p>

        {/* STICKY ACTION BAR */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[600px] bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 flex items-center justify-between shadow-2xl z-[100]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-accent/10 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-teal-accent" />
                </div>
                <span className="text-xs font-bold text-white hidden sm:inline">Ready for the full strategy?</span>
                <span className="text-xs font-bold text-white sm:hidden">Ready?</span>
              </div>
              <button
                onClick={() => {
                  if (safeProfile.mode === 'quick') {
                    setShowPricingModal(true);
                  } else {
                    triggerAnalyze();
                  }
                }}
                className="bg-teal-accent text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-accent/90 transition-all"
              >
                {safeProfile.mode === 'quick' ? 'Upgrade Now' : 'Reanalyze'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

  const handleAddCustomGoal = () => {
    const newGoal = customGoalText.trim();
    if (newGoal && !quickForm.goals.includes(newGoal)) {
      setCustomGoals(prev => [...prev, newGoal]);
      setQuickForm(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
      setCustomGoalText("");
      setIsAddingGoal(false);
    }
  };

  const removeCustomGoal = (goal: string) => {
    setCustomGoals(prev => prev.filter(g => g !== goal));
    setQuickForm(prev => ({ ...prev, goals: prev.goals.filter(g => g !== goal) }));
  };

  const handleAddCustomStruggle = () => {
    const newStruggle = customStruggleInput.trim();
    if (newStruggle && !deepForm.struggles.includes(newStruggle)) {
      setCustomStruggles(prev => [...prev, newStruggle]);
      setDeepForm(prev => ({ ...prev, struggles: [...prev.struggles, newStruggle] }));
      setCustomStruggleInput("");
      setIsAddingCustomStruggle(false);
    }
  };

  // --- Render Functions ---
  const getStatusPill = (score: number) => {
    if (score >= 85) return { text: 'Elite', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    if (score >= 70) return { text: 'Strong', color: 'bg-teal-accent/10 text-teal-accent border-teal-accent/20' };
    if (score >= 50) return { text: 'Average', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { text: 'Needs Work', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
  };

  const renderQuickMode = () => {
    const progress = calculateProgress();
    
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8"
      >
        {/* Draft Restored Note */}
        <AnimatePresence>
          {draftRestored && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-[#555555]" />
                <span className="text-xs text-[#555555]">We saved your previous answers.</span>
              </div>
              <button 
                onClick={clearDraft}
                className="text-xs text-[#555555] hover:text-white transition-colors"
              >
                Clear and start fresh
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-teal-accent rounded-full transition-all duration-700 ease-out"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-[#555555]">Complete your profile for a more accurate analysis.</span>
            {progress > 0 && (
              <span className="text-[11px] font-bold text-teal-accent">{progress}% complete</span>
            )}
          </div>
        </div>

        <form onSubmit={handleQuickSubmit} className="space-y-6 md:space-y-8">
          {/* FIELD 1: WHO ARE YOU */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-teal-accent" />
                <label className="text-xs font-bold uppercase tracking-widest text-white">WHO ARE YOU</label>
                <span className="ml-2 text-[10px] bg-teal-accent/10 border border-teal-accent/20 text-teal-accent rounded-full px-2 py-0.5 font-bold uppercase tracking-wide">Required</span>
              </div>
              <button 
                type="button"
                onClick={() => toggleExample('whoAreYou')}
                className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent uppercase tracking-widest transition-colors"
              >
                {showExamples['whoAreYou'] ? 'Hide Example' : 'Show Example'}
              </button>
            </div>

            <AnimatePresence>
              {showExamples['whoAreYou'] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl p-4 mb-3"
                >
                  <p className="text-[11px] text-teal-accent/80 leading-relaxed">
                    "I am a B2B Sales Consultant helping SaaS founders build outbound systems that actually convert. I have 8 years of experience and have helped 20+ startups scale from $0 to $1M ARR."
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              id="whoAreYou"
              value={quickForm.whoAreYou}
              onChange={(e) => {
                setQuickForm({ ...quickForm, whoAreYou: e.target.value });
                if (e.target.value.trim().length >= 10) setValidationError(null);
              }}
              placeholder="Tell us about yourself and what you do. For example — I am a freelance designer with 5 years of experience helping startups build their brand identity. Or I am a B2B sales consultant helping SaaS companies close enterprise deals. One to three sentences is perfect."
              rows={4}
              className={`w-full bg-[#0D0D0D] border rounded-2xl px-5 py-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-[#444444] focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 resize-none leading-relaxed hover:border-white/10 ${
                validationError ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-white/5'
              }`}
            />
            
            {getInputQuality(quickForm.whoAreYou, 'whoAreYou') && (
              <div className={`text-[10px] mt-1 flex items-center gap-1.5 ${
                getInputQuality(quickForm.whoAreYou, 'whoAreYou')?.type === 'vague' ? 'text-amber-400' : 'text-teal-accent'
              }`}>
                {getInputQuality(quickForm.whoAreYou, 'whoAreYou')?.type === 'vague' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                {getInputQuality(quickForm.whoAreYou, 'whoAreYou')?.message}
              </div>
            )}

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-accent" />
                <span className="text-[11px] text-[#555555] italic">One sentence is enough — we figure out the rest.</span>
              </div>
              <span className={`text-[11px] ${quickForm.whoAreYou.length < 10 ? 'text-orange-400' : quickForm.whoAreYou.length > 50 ? 'text-green-400' : 'text-[#555555]'}`}>
                {quickForm.whoAreYou.length} characters
              </span>
            </div>
            <AnimatePresence>
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400 mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3 h-3" />
                  {validationError}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FIELD 2: YOUR CURRENT HEADLINE */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <PenTool className="w-4 h-4 text-teal-accent" />
              <label className="text-xs font-bold uppercase tracking-widest text-white">YOUR CURRENT HEADLINE</label>
              <span className="ml-2 text-[10px] bg-[#141414] border border-[#1f1f1f] text-[#555555] rounded-full px-2 py-0.5 font-bold uppercase tracking-wide">Optional</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              {[
                { id: 'have', label: 'I have one' },
                { id: 'none', label: 'I do not have one yet' },
                { id: 'rewrite', label: 'I want a full rewrite' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuickForm({ ...quickForm, headlineOption: opt.id as any })}
                  className={`flex-1 text-center px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border min-h-[40px] flex items-center justify-center whitespace-nowrap ${
                    quickForm.headlineOption === opt.id
                      ? 'bg-teal-accent/10 border-teal-accent/30 text-teal-accent'
                      : 'bg-[#141414] border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {quickForm.headlineOption === 'have' && (
                <motion.div
                  key="have-headline"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    value={quickForm.currentHeadline}
                    onChange={(e) => setQuickForm({ ...quickForm, currentHeadline: e.target.value })}
                    placeholder="Paste your current LinkedIn headline here."
                    className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 h-12 hover:border-white/10"
                  />
                  <div className="flex justify-between mt-1.5">
                    <div />
                    <span className={`text-[11px] ${quickForm.currentHeadline.length > 210 ? 'text-red-400' : quickForm.currentHeadline.length > 180 ? 'text-orange-400' : 'text-[#555555]'}`}>
                      {quickForm.currentHeadline.length} of 220
                    </span>
                  </div>
                </motion.div>
              )}

              {quickForm.headlineOption === 'none' && (
                <motion.div
                  key="none-headline"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl px-4 py-3 flex items-start gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-teal-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#CCCCCC] leading-relaxed">
                    No problem at all — we will write a powerful headline from scratch based on your role and goals.
                  </p>
                </motion.div>
              )}

              {quickForm.headlineOption === 'rewrite' && (
                <motion.div
                  key="rewrite-headline"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <input
                    type="text"
                    value={quickForm.currentHeadline}
                    onChange={(e) => setQuickForm({ ...quickForm, currentHeadline: e.target.value })}
                    placeholder="Paste your current LinkedIn headline here."
                    className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 h-12 hover:border-white/10"
                  />
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3 mt-2 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300/70 leading-relaxed">
                      Got it — we will use this as context only and write something completely new.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* FIELD 3: YOUR ABOUT SECTION */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-teal-accent" />
              <label className="text-xs font-bold uppercase tracking-widest text-white">YOUR ABOUT SECTION</label>
              <span className="ml-2 text-[10px] bg-[#141414] border border-[#1f1f1f] text-[#555555] rounded-full px-2 py-0.5 font-bold uppercase tracking-wide">Optional</span>
            </div>
            <p className="text-xs text-[#555555] mb-3 leading-relaxed">
              This is the summary section on your LinkedIn profile — below your photo. It is the most important section after your headline.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              {[
                { id: 'have', label: 'I have one' },
                { id: 'none', label: 'I do not have one yet' },
                { id: 'rewrite', label: 'I want a full rewrite' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuickForm({ ...quickForm, aboutOption: opt.id as any })}
                  className={`flex-1 text-center px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border min-h-[40px] flex items-center justify-center whitespace-nowrap ${
                    quickForm.aboutOption === opt.id
                      ? 'bg-teal-accent/10 border-teal-accent/30 text-teal-accent'
                      : 'bg-[#141414] border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {quickForm.aboutOption === 'have' && (
                <motion.div
                  key="have-about"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <textarea
                    value={quickForm.aboutSection}
                    onChange={(e) => setQuickForm({ ...quickForm, aboutSection: e.target.value })}
                    placeholder="Paste your current About section here. Do not worry about formatting — just paste it exactly as it appears on LinkedIn."
                    rows={6}
                    className="w-full bg-[#0D0D0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-[#444444] focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 resize-none leading-relaxed hover:border-white/10"
                  />
                  <div className="flex justify-between mt-1.5">
                    <div />
                    <span className={`text-[11px] ${quickForm.aboutSection.length > 2400 ? 'text-red-400' : quickForm.aboutSection.length > 2000 ? 'text-orange-400' : 'text-[#555555]'}`}>
                      {quickForm.aboutSection.length} of 2600
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Sparkles className="w-3 h-3 text-teal-accent/70" />
                    <span className="text-[11px] text-teal-accent/60 italic">Your first line is everything — does it immediately tell visitors who you help and why they should care?</span>
                  </div>
                </motion.div>
              )}

              {quickForm.aboutOption === 'none' && quickForm.headlineOption !== 'none' && (
                <motion.div
                  key="none-about"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl px-4 py-3 flex items-start gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-teal-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#CCCCCC] leading-relaxed">
                    No problem — we will write your About section from scratch based on everything you share.
                  </p>
                </motion.div>
              )}

              {quickForm.aboutOption === 'rewrite' && (
                <motion.div
                  key="rewrite-about"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <textarea
                    value={quickForm.aboutSection}
                    onChange={(e) => setQuickForm({ ...quickForm, aboutSection: e.target.value })}
                    placeholder="Paste your current About section here. Do not worry about formatting — just paste it exactly as it appears on LinkedIn."
                    rows={6}
                    className="w-full bg-[#0D0D0D] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-[#444444] focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 resize-none leading-relaxed hover:border-white/10"
                  />
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3 mt-2 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300/70 leading-relaxed">
                      Got it — we will use this as context only and write something completely new.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Combined Note */}
            {quickForm.headlineOption === 'none' && quickForm.aboutOption === 'none' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-teal-accent/5 border border-teal-accent/15 rounded-2xl px-5 py-4 flex items-start gap-3"
              >
                <Sparkles className="w-5 h-5 text-teal-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">We will write both from scratch.</p>
                  <p className="text-xs text-[#888888] leading-relaxed">
                    Just tell us your goals below and we will craft a powerful headline and About section tailored to exactly what you want from LinkedIn.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* FIELD 4: WHAT DO YOU WANT FROM LINKEDIN */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-teal-accent" />
              <label className="text-xs font-bold uppercase tracking-widest text-white">WHAT DO YOU WANT FROM LINKEDIN</label>
              <span className="ml-2 text-[10px] bg-[#141414] border border-[#1f1f1f] text-[#555555] rounded-full px-2 py-0.5 font-bold uppercase tracking-wide">Optional</span>
            </div>
            <p className="text-xs text-[#555555] mb-4 mt-1 leading-relaxed">
              Select all that apply. The more specific you are the sharper and more personalized your analysis will be.
            </p>

            {/* Custom Multi-Select Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-[#0D0D0D] border rounded-2xl px-4 py-3 min-h-[52px] flex flex-wrap items-center gap-2 cursor-pointer transition-all duration-200 hover:border-white/10 relative ${
                  isDropdownOpen ? 'border-teal-accent/40 ring-2 ring-teal-accent/10' : 'border-white/5'
                }`}
              >
                {quickForm.goals.length === 0 ? (
                  <span className="text-sm text-[#444444]">Select your LinkedIn goals — you can choose multiple.</span>
                ) : (
                  <div className="flex flex-wrap gap-2 pr-8">
                    {quickForm.goals.map((goalId) => {
                      const goal = goalOptions.find(g => g.id === goalId) || { title: goalId };
                      return (
                        <div 
                          key={goalId}
                          className="bg-teal-accent/10 border border-teal-accent/20 rounded-full px-3 py-1 text-xs font-semibold text-teal-accent flex items-center gap-1.5"
                        >
                          <span>{goal.title}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGoal(goalId);
                            }}
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-teal-accent/20 transition-colors"
                          >
                            <X className="w-2.5 h-2.5 text-teal-accent" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <ChevronDown 
                  className={`w-4 h-4 text-[#555555] transition-transform duration-200 flex-shrink-0 ml-auto ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-[#1f1f1f] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#555555]">Select all that apply</span>
                      {quickForm.goals.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setQuickForm({ ...quickForm, goals: [] })}
                          className="text-[10px] font-bold text-teal-accent cursor-pointer hover:text-teal-accent/70 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-[#1f1f1f] max-h-[280px] overflow-y-auto custom-scrollbar">
                      {/* Predefined Options */}
                      {goalOptions.map((goal) => {
                        const isSelected = quickForm.goals.includes(goal.id);
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => toggleGoal(goal.id)}
                            className={`w-full px-4 py-3.5 flex items-center gap-3 transition-all duration-150 text-left hover:bg-white/[0.02] min-h-[52px] ${
                              isSelected ? 'bg-teal-accent/[0.04]' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected ? 'bg-teal-accent/10 border border-teal-accent/20 text-teal-accent' : 'bg-[#1a1a1a] border border-[#222222] text-[#555555]'
                            }`}>
                              <goal.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white leading-tight">{goal.title}</h4>
                              <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">{goal.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-teal-accent' : 'border border-[#333333]'
                            }`}>
                              {isSelected && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                  <Check className="w-3 h-3 text-black" />
                                </motion.div>
                              )}
                            </div>
                          </button>
                        );
                      })}

                      {/* Custom Goals in List */}
                      {customGoals.map((goal, idx) => {
                        const isSelected = quickForm.goals.includes(goal);
                        return (
                          <button
                            key={`custom-opt-${idx}`}
                            type="button"
                            onClick={() => toggleGoal(goal)}
                            className={`w-full px-4 py-3.5 flex items-center gap-3 transition-all duration-150 text-left hover:bg-white/[0.02] min-h-[52px] ${
                              isSelected ? 'bg-teal-accent/[0.04]' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected ? 'bg-teal-accent/10 border border-teal-accent/20 text-teal-accent' : 'bg-[#1a1a1a] border border-[#222222] text-[#555555]'
                            }`}>
                              <Plus className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white leading-tight">{goal}</h4>
                              <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">Custom goal</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-teal-accent' : 'border border-[#333333]'
                            }`}>
                              {isSelected && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                  <Check className="w-3 h-3 text-black" />
                                </motion.div>
                              )}
                            </div>
                          </button>
                        );
                      })}

                      {/* Add Your Own Goal Option */}
                      {customGoals.length < 2 && (
                        <div className="border-t border-[#1f1f1f]">
                          {!isAddingGoal ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingGoal(true);
                              }}
                              className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors min-h-[52px]"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-dashed border-[#333333] flex items-center justify-center flex-shrink-0">
                                <Plus className="w-4 h-4 text-[#555555]" />
                              </div>
                              <span className="text-sm text-[#555555]">Add your own goal</span>
                            </button>
                          ) : (
                            <div className="px-4 py-3 flex items-center gap-3 min-h-[52px]">
                              <input
                                autoFocus
                                type="text"
                                value={customGoalText}
                                onChange={(e) => setCustomGoalText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomGoal();
                                  } else if (e.key === 'Escape') {
                                    setIsAddingGoal(false);
                                    setCustomGoalText("");
                                  }
                                }}
                                placeholder="Type your goal and press Enter"
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-[#444444]"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomGoal}
                                className="w-7 h-7 bg-teal-accent rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-teal-accent/80 transition-colors"
                              >
                                <Check className="w-3 h-3 text-black" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingGoal(false);
                                  setCustomGoalText("");
                                }}
                                className="w-7 h-7 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-[#222222] transition-colors"
                              >
                                <X className="w-3 h-3 text-[#555555]" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {quickForm.goals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5 mt-2"
                >
                  <CheckCircle2 className="w-3 h-3 text-teal-accent" />
                  <span className="text-xs text-[#555555]">
                    <span className="text-teal-accent font-bold">{quickForm.goals.length}</span> goals selected
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* NEW FIELD: TARGET AUDIENCE */}
          <motion.div variants={itemVariants} className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-accent" />
                <label className="text-xs font-bold uppercase tracking-widest text-white">TARGET AUDIENCE</label>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[10px] bg-teal-accent/10 border border-teal-accent/20 text-teal-accent rounded-full px-2 py-0.5 font-bold uppercase tracking-wide">AI Recommended</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleGenerateAudience()}
                disabled={isGeneratingAudience}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-accent/10 border border-teal-accent/20 text-[10px] font-bold text-teal-accent hover:bg-teal-accent/20 transition-all disabled:opacity-50"
              >
                {isGeneratingAudience ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {quickForm.primaryAudience ? 'Regenerate' : 'Magic Wand'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#555555] uppercase tracking-widest ml-1">Primary Audience</label>
                <input
                  type="text"
                  value={quickForm.primaryAudience}
                  onChange={(e) => setQuickForm({ ...quickForm, primaryAudience: e.target.value })}
                  placeholder="e.g. Early-stage SaaS founders at $0 to $1M ARR"
                  className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 hover:border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#555555] uppercase tracking-widest ml-1">Secondary Audience</label>
                <input
                  type="text"
                  value={quickForm.secondaryAudience}
                  onChange={(e) => setQuickForm({ ...quickForm, secondaryAudience: e.target.value })}
                  placeholder="e.g. VC associates and startup accelerators"
                  className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 hover:border-white/10"
                />
              </div>
            </div>
          </motion.div>

          {renderInputPreview()}

          {/* GENERATE BUTTON */}
          <motion.div variants={itemVariants} className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-accent text-black font-bold text-[15px] rounded-2xl py-4 px-6 flex items-center justify-center gap-2.5 transition-all duration-200 hover:shadow-[0_0_28px_rgba(45,212,191,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-h-[52px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your profile...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Run Quick Audit
                </>
              )}
            </button>
            
            <div className="text-center mt-3 space-y-1.5">
              <p className="text-xs text-[#555555] italic">Takes about 15 seconds. The more you share the sharper your analysis.</p>
              <div className="flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-[#444444]" />
                <span className="text-[11px] text-[#444444]">Your profile data is never stored or shared.</span>
              </div>
            </div>
          </motion.div>
        </form>
      </motion.div>
    );
  };

  const renderDeepMode = () => {
    const steps = [
      { id: 1, title: 'Basics', icon: UserCircle },
      { id: 2, title: 'Headline', icon: Edit },
      { id: 3, title: 'About', icon: FileText },
      { id: 4, title: 'Experience', icon: Briefcase },
      { id: 5, title: 'Goals', icon: Target },
      { id: 6, title: 'Content', icon: LayoutDashboard }
    ];

    const progress = calculateDeepProgress();

    const isStepValid = () => {
      switch (deepStep) {
        case 1: return !!deepForm.role && !!deepForm.industry;
        case 2: return deepForm.headlineOption === 'none' || !!deepForm.headline.trim();
        case 3: return deepForm.aboutOption === 'none' || !!deepForm.about.trim();
        case 4: return true;
        case 5: return !!deepForm.primaryGoal.trim() && deepForm.audience.length > 0;
        default: return true;
      }
    };

    const handleNextStep = () => {
      if (!isStepValid()) {
        setValidationError("Please fill in all required fields to proceed.");
        setTimeout(() => setValidationError(null), 3000);
        return;
      }
      setDeepStep(prev => Math.min(TOTAL_DEEP_STEPS, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-[24px] md:space-y-[32px]"
      >
        {/* Numeric Progress Bar */}
        <div className="max-w-4xl mx-auto w-full px-2">
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4" />
                {validationError}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-between items-end mb-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-accent uppercase tracking-widest">Step {deepStep} of {TOTAL_DEEP_STEPS}</span>
              <h3 className="text-lg font-bold text-white">{steps[deepStep - 1].title}</h3>
            </div>
            <span className="text-xs font-bold text-teal-accent">{progress}%</span>
          </div>
          <div className="w-full h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-teal-accent rounded-full transition-all duration-700 ease-out"
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="sticky top-0 z-20 bg-[#080808]/95 backdrop-blur-md py-6 -mx-4 px-4 border-b border-[#1f1f1f] sm:relative sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:py-0 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[420px] sm:min-w-0 max-w-4xl mx-auto px-2">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer group transition-all duration-300 shrink-0 ${
                    deepStep >= step.id ? 'text-teal-accent' : 'text-[#555555]'
                  }`}
                  onClick={() => deepStep > step.id && setDeepStep(step.id)}
                >
                  <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    deepStep === step.id 
                      ? 'bg-teal-accent/10 border-teal-accent shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                      : deepStep > step.id 
                        ? 'bg-teal-accent border-teal-accent text-black' 
                        : 'bg-[#141414] border-[#1f1f1f] group-hover:border-[#333333]'
                  }`}>
                    {deepStep > step.id ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : <step.icon className="w-3 h-3 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="text-[7px] sm:text-[10px] font-bold uppercase tracking-widest">{step.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-[1px] mx-1 sm:mx-2 transition-all duration-500 min-w-[10px] sm:min-w-[20px] ${
                    deepStep > step.id ? 'bg-teal-accent' : 'bg-[#1f1f1f]'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={deepStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="card-premium p-6 md:p-10 min-h-[450px]"
          >
            {deepStep === 1 && (
              <div className="space-y-[24px] md:space-y-[32px]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">Your Role & Industry</label>
                  <button 
                    type="button"
                    onClick={() => toggleExample('role')}
                    className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent uppercase tracking-widest transition-colors"
                  >
                    {showExamples['role'] ? 'Hide Example' : 'Show Example'}
                  </button>
                </div>

                <AnimatePresence>
                  {showExamples['role'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl p-4 mb-3"
                    >
                      <p className="text-[11px] text-teal-accent/80 leading-relaxed">
                        "B2B Sales Consultant", "SaaS Founder", "UX Designer", "Content Strategist", "Real Estate Agent"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[20px]">
                  <SmartSelector
                    label="What do you do?"
                    options={commonRoles}
                    value={deepForm.role}
                    onChange={(val: any) => setDeepForm({...deepForm, role: val})}
                    placeholder="Search or select your role..."
                  />
                  <SmartSelector
                    label="Industry"
                    options={commonIndustries}
                    value={deepForm.industry}
                    onChange={(val: any) => setDeepForm({...deepForm, industry: val})}
                    placeholder="Search or select industry..."
                  />
                </div>

                <div className="space-y-[16px] md:space-y-[20px]">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">Experience Level</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[16px]">
                    {['Junior', 'Mid-Level', 'Senior', 'Executive'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDeepForm({...deepForm, experience: level})}
                        className={`py-3 px-4 rounded-[12px] md:rounded-[16px] border text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          deepForm.experience === level
                            ? 'bg-teal-accent/10 border-teal-accent text-teal-accent shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                            : 'bg-[#080808] border-[#1f1f1f] text-[#888888] hover:border-[#333333]'
                        }`}
                      >
                        {deepForm.experience === level && <Check className="w-4 h-4" />}
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                {deepForm.role && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-[12px] md:pt-[16px]"
                  >
                    <SmartSelector
                      label={`Specific focus in ${deepForm.role}?`}
                      options={commonFocusAreas}
                      value={deepForm.specificFocus}
                      onChange={(val: any) => setDeepForm({...deepForm, specificFocus: val})}
                      placeholder="e.g. B2B Strategy, UX Research..."
                    />
                  </motion.div>
                )}

                {/* NEW FIELD: TARGET AUDIENCE (DEEP) - MOVED TO STEP 5 */}
                {profileMode === 'quick' && (
                  <div className="space-y-4 pt-6 border-t border-[#1f1f1f]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-teal-accent" />
                          <label className="text-xs font-bold uppercase tracking-widest text-white">TARGET AUDIENCE</label>
                        </div>
                        <span className="text-[10px] bg-teal-accent/10 border border-teal-accent/20 text-teal-accent rounded-full px-2 py-0.5 font-bold uppercase tracking-wide whitespace-nowrap">AI Powered</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenerateAudience()}
                        disabled={isGeneratingAudience}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-teal-accent/10 border border-teal-accent/20 text-[10px] font-bold text-teal-accent hover:bg-teal-accent/20 transition-all disabled:opacity-50"
                      >
                        {isGeneratingAudience ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {quickForm.primaryAudience ? 'Regenerate' : 'Magic Wand'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#555555] uppercase tracking-widest ml-1">Primary Audience</label>
                        <input
                          type="text"
                          value={quickForm.primaryAudience}
                          onChange={(e) => setQuickForm({ ...quickForm, primaryAudience: e.target.value })}
                          placeholder="e.g. Early-stage SaaS founders at $0 to $1M ARR"
                          className="w-full bg-[#080808] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 hover:border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#555555] uppercase tracking-widest ml-1">Secondary Audience</label>
                        <input
                          type="text"
                          value={quickForm.secondaryAudience}
                          onChange={(e) => setQuickForm({ ...quickForm, secondaryAudience: e.target.value })}
                          placeholder="e.g. VC associates and startup accelerators"
                          className="w-full bg-[#080808] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 hover:border-white/10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {deepStep === 2 && (
              <div className="space-y-[24px] md:space-y-[32px]">
                <div className="space-y-[12px] md:space-y-[16px]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">Current Headline</label>
                    <button 
                      type="button"
                      onClick={() => toggleExample('headline')}
                      className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent uppercase tracking-widest transition-colors"
                    >
                      {showExamples['headline'] ? 'Hide Example' : 'Show Example'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showExamples['headline'] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl p-4 mb-3"
                      >
                        <p className="text-[11px] text-teal-accent/80 leading-relaxed">
                          "Product Designer helping SaaS startups scale to 10k users through data-driven UX."
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FloatingLabelInput
                    label="Paste your current headline"
                    value={deepForm.headline}
                    onChange={(e: any) => setDeepForm({...deepForm, headline: e.target.value})}
                    placeholder="e.g. Product Designer at Google..."
                  />

                  {getInputQuality(deepForm.headline, 'headline') && (
                    <div className={`text-[10px] mt-1 flex items-center gap-1.5 ${
                      getInputQuality(deepForm.headline, 'headline')?.type === 'vague' ? 'text-amber-400' : 'text-teal-accent'
                    }`}>
                      {getInputQuality(deepForm.headline, 'headline')?.type === 'vague' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {getInputQuality(deepForm.headline, 'headline')?.message}
                    </div>
                  )}

                  <SegmentedControl
                    options={[
                      { id: 'have', label: 'I have one' },
                      { id: 'none', label: 'Writing one for me' },
                      { id: 'rewrite', label: 'Full rewrite' }
                    ]}
                    active={deepForm.headlineOption}
                    onChange={(id: any) => setDeepForm({...deepForm, headlineOption: id})}
                  />
                  {deepForm.headlineOption === 'rewrite' && (
                    <div className="flex items-start gap-3 p-[16px] md:p-[24px] bg-amber-500/5 border border-amber-500/20 rounded-[12px] md:rounded-[16px]">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200/80 leading-relaxed">
                        Full rewrite will ignore your current headline and build a new one from scratch based on your role and goals.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-[16px] md:pt-[24px] border-t border-[#1f1f1f]">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-accent/10 flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-teal-accent" />
                        </div>
                        <span className="text-sm font-medium text-white">Need help with your headline?</span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-[#555555] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pt-[12px] md:pt-[16px] pl-11 space-y-[8px] md:space-y-[12px]">
                      <p className="text-xs text-[#888888] leading-relaxed">
                        A great headline follows this formula:
                      </p>
                      <ol className="text-xs text-[#CCCCCC] space-y-[8px] list-decimal list-inside">
                        <li>What you do (Role)</li>
                        <li>Who you help (Audience)</li>
                        <li>The result you deliver (Value)</li>
                        <li>Social proof or unique skill</li>
                      </ol>
                      <p className="text-xs text-[#888888] italic">
                        Example: "Product Designer helping SaaS startups scale to 10k users through data-driven UX."
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            )}

            {deepStep === 3 && (
              <div className="space-y-[24px] md:space-y-[32px]">
                <div className="space-y-[12px] md:space-y-[16px]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">About Section</label>
                    <button 
                      type="button"
                      onClick={() => toggleExample('about')}
                      className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent uppercase tracking-widest transition-colors"
                    >
                      {showExamples['about'] ? 'Hide Example' : 'Show Example'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showExamples['about'] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl p-4 mb-3"
                      >
                        <p className="text-[11px] text-teal-accent/80 leading-relaxed">
                          "I've spent the last decade building products that people love. From early-stage startups to Fortune 500 companies, I focus on the intersection of user needs and business goals..."
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FloatingLabelInput
                    label="Paste your current About section"
                    value={deepForm.about}
                    onChange={(e: any) => setDeepForm({...deepForm, about: e.target.value})}
                    placeholder="Your story goes here..."
                    rows={8}
                  />

                  {getInputQuality(deepForm.about, 'about') && (
                    <div className={`text-[10px] mt-1 flex items-center gap-1.5 ${
                      getInputQuality(deepForm.about, 'about')?.type === 'vague' ? 'text-amber-400' : 'text-teal-accent'
                    }`}>
                      {getInputQuality(deepForm.about, 'about')?.type === 'vague' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {getInputQuality(deepForm.about, 'about')?.message}
                    </div>
                  )}

                  <SegmentedControl
                    options={[
                      { id: 'have', label: 'I have one' },
                      { id: 'none', label: 'Write one for me' }
                    ]}
                    active={deepForm.aboutOption}
                    onChange={(id: any) => setDeepForm({...deepForm, aboutOption: id})}
                  />
                </div>

                {deepForm.aboutOption === 'none' && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
                  >
                    <motion.div variants={itemVariants}>
                      <FloatingLabelInput
                        label="Biggest Achievement"
                        value={deepForm.achievements}
                        onChange={(e: any) => setDeepForm({...deepForm, achievements: e.target.value})}
                        placeholder="e.g. Increased revenue by 40%..."
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FloatingLabelInput
                        label="Core Skills"
                        value={deepForm.skills}
                        onChange={(e: any) => setDeepForm({...deepForm, skills: e.target.value})}
                        placeholder="e.g. React, Node, AWS..."
                      />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}

            {deepStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">Experience Section</label>
                      <span className="text-[10px] bg-[#1f1f1f] text-[#888888] px-2 py-0.5 rounded-full font-bold">OPTIONAL</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleExample('experience')}
                      className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent uppercase tracking-widest transition-colors"
                    >
                      {showExamples['experience'] ? 'Hide Example' : 'Show Example'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showExamples['experience'] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-teal-accent/5 border border-teal-accent/10 rounded-xl p-4 mb-3"
                      >
                        <p className="text-[11px] text-teal-accent/80 leading-relaxed">
                          "Senior Product Designer @ Google (2020-Present): Led the redesign of the search results page, resulting in a 15% increase in user engagement..."
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FloatingLabelInput
                    label="Paste your experience details"
                    value={deepForm.experienceDetails}
                    onChange={(e: any) => setDeepForm({...deepForm, experienceDetails: e.target.value})}
                    placeholder="List your roles and key responsibilities..."
                    rows={10}
                  />

                  {getInputQuality(deepForm.experienceDetails, 'experience') && (
                    <div className={`text-[10px] mt-1 flex items-center gap-1.5 ${
                      getInputQuality(deepForm.experienceDetails, 'experience')?.type === 'vague' ? 'text-amber-400' : 'text-teal-accent'
                    }`}>
                      {getInputQuality(deepForm.experienceDetails, 'experience')?.type === 'vague' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {getInputQuality(deepForm.experienceDetails, 'experience')?.message}
                    </div>
                  )}
                </div>
              </div>
            )}

            {deepStep === 5 && (
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">Primary Goals</label>
                      <p className="text-xs text-[#888888] ml-1">What's the #1 thing you want from LinkedIn?</p>
                    </div>
                    {deepForm.primaryGoal.split(', ').filter(Boolean).length > 0 && (
                      <span className="text-[10px] text-teal-accent font-bold px-2 py-1 bg-teal-accent/10 rounded-lg">
                        {deepForm.primaryGoal.split(', ').filter(Boolean).length} SELECTED
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goalOptions.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        {...goal}
                        selected={deepForm.primaryGoal.includes(goal.title)}
                        onClick={() => {
                          const current = deepForm.primaryGoal.split(', ').filter(Boolean);
                          if (current.includes(goal.title)) {
                            setDeepForm({...deepForm, primaryGoal: current.filter(g => g !== goal.title).join(', ')});
                          } else {
                            setDeepForm({...deepForm, primaryGoal: [...current, goal.title].join(', ')});
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#1f1f1f]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-accent" />
                        <label className="text-xs font-bold uppercase tracking-widest text-white">TARGET AUDIENCE</label>
                      </div>
                      <span className="text-[10px] bg-teal-accent/10 border border-teal-accent/20 text-teal-accent rounded-full px-2 py-0.5 font-bold uppercase tracking-wide whitespace-nowrap">AI Powered</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerateAudience()}
                      disabled={isGeneratingAudience}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-accent/10 border border-teal-accent/20 text-xs font-bold text-teal-accent hover:bg-teal-accent/20 transition-all disabled:opacity-50"
                    >
                      {isGeneratingAudience ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {deepForm.primaryAudience ? 'REGENERATE ALL' : 'MAGIC WAND'}
                    </button>
                  </div>

                  <p className="text-xs text-[#888888] leading-relaxed -mt-2">
                    Who do you want to reach on LinkedIn? The more specific you are the sharper your strategy will be.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#555555] uppercase tracking-widest ml-1">Primary Audience</label>
                        {deepForm.primaryAudience && (
                          <button
                            type="button"
                            onClick={() => handleGenerateAudience('primary')}
                            disabled={isGeneratingAudience}
                            className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className={`w-2.5 h-2.5 ${isGeneratingAudience ? 'animate-spin' : ''}`} />
                            REGENERATE
                          </button>
                        )}
                      </div>
                      <textarea
                        value={deepForm.primaryAudience}
                        onChange={(e) => setDeepForm({ ...deepForm, primaryAudience: e.target.value })}
                        placeholder="e.g. Early-stage SaaS founders at $0 to $1M ARR"
                        rows={2}
                        className="w-full bg-[#080808] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 hover:border-white/10 resize-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#555555] uppercase tracking-widest ml-1">Secondary Audience</label>
                        {deepForm.secondaryAudience && (
                          <button
                            type="button"
                            onClick={() => handleGenerateAudience('secondary')}
                            disabled={isGeneratingAudience}
                            className="text-[10px] font-bold text-teal-accent/60 hover:text-teal-accent transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className={`w-2.5 h-2.5 ${isGeneratingAudience ? 'animate-spin' : ''}`} />
                            REGENERATE
                          </button>
                        )}
                      </div>
                      <textarea
                        value={deepForm.secondaryAudience}
                        onChange={(e) => setDeepForm({ ...deepForm, secondaryAudience: e.target.value })}
                        placeholder="e.g. VC associates and startup accelerators"
                        rows={2}
                        className="w-full bg-[#080808] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-2 focus:ring-teal-accent/10 hover:border-white/10 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">Biggest Struggle</label>
                  <div className="flex flex-wrap gap-2.5 md:gap-3">
                    {struggleOptions.map((struggle) => (
                      <button
                        key={struggle}
                        onClick={() => {
                          const current = deepForm.struggles;
                          if (current.includes(struggle)) {
                            setDeepForm({...deepForm, struggles: current.filter(s => s !== struggle)});
                          } else {
                            setDeepForm({...deepForm, struggles: [...current, struggle]});
                          }
                        }}
                        className={`px-[12px] py-[8px] sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-xs font-medium border transition-all duration-300 flex items-center gap-2 max-w-full truncate ${
                          deepForm.struggles.includes(struggle)
                            ? 'bg-teal-accent/10 border-teal-accent text-teal-accent shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                            : 'bg-[#080808] border-[#1f1f1f] text-[#888888] hover:border-[#333333]'
                        }`}
                      >
                        {deepForm.struggles.includes(struggle) && <Check className="w-3 h-3" />}
                        {struggle}
                      </button>
                    ))}
                    
                    {customStruggles.map((struggle) => (
                      <button
                        key={struggle}
                        onClick={() => {
                          setCustomStruggles(customStruggles.filter(s => s !== struggle));
                          setDeepForm(prev => ({ ...prev, struggles: prev.struggles.filter(s => s !== struggle) }));
                        }}
                        className="px-[12px] py-[8px] sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-xs font-medium border bg-teal-accent/10 border-teal-accent text-teal-accent flex items-center gap-2 max-w-full truncate"
                      >
                        <Check className="w-3 h-3" />
                        {struggle}
                        <X className="w-3.5 h-3.5 ml-1 opacity-50 hover:opacity-100" />
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setIsAddingCustomStruggle(true)}
                      className="px-4 py-2 rounded-full text-xs font-medium border border-dashed border-[#1f1f1f] text-[#555555] hover:border-[#333333] flex items-center gap-2"
                    >
                      {isAddingCustomStruggle ? (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <input
                            autoFocus
                            type="text"
                            value={customStruggleInput}
                            onChange={e => setCustomStruggleInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddCustomStruggle()}
                            className="bg-transparent outline-none w-24"
                            placeholder="Type..."
                          />
                          <Check className="w-3 h-3 text-teal-accent cursor-pointer" onClick={handleAddCustomStruggle} />
                        </div>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          Add custom
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {deepStep === 6 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]">Featured Section</label>
                    <span className="text-[10px] bg-[#1f1f1f] text-[#888888] px-2 py-0.5 rounded-full font-bold">OPTIONAL</span>
                  </div>
                  <p className="text-xs text-[#888888]">List links or descriptions of items in your Featured section.</p>
                  <FloatingLabelInput
                    label="Featured items"
                    value={deepForm.featured}
                    onChange={(e: any) => setDeepForm({...deepForm, featured: e.target.value})}
                    placeholder="e.g. Portfolio link, specific case study, top-performing post..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]">Recent Posts</label>
                    <span className="text-[10px] bg-[#1f1f1f] text-[#888888] px-2 py-0.5 rounded-full font-bold">OPTIONAL</span>
                  </div>
                  <p className="text-xs text-[#888888]">Paste 2-3 of your most recent or best-performing posts for tone analysis.</p>
                  <FloatingLabelInput
                    label="Recent posts content"
                    value={deepForm.recentPosts}
                    onChange={(e: any) => setDeepForm({...deepForm, recentPosts: e.target.value})}
                    placeholder="Paste post text here..."
                    rows={8}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={() => setDeepStep(prev => Math.max(1, prev - 1))}
            disabled={deepStep === 1}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#1f1f1f] text-sm font-bold text-[#888888] hover:bg-[#141414] disabled:opacity-0 transition-all min-h-[48px]"
          >
            Back
          </button>
          
          {deepStep < TOTAL_DEEP_STEPS ? (
            <button
              type="button"
              onClick={handleNextStep}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[48px] ${
                isStepValid() 
                  ? 'bg-white text-black hover:bg-[#CCCCCC]' 
                  : 'bg-[#1f1f1f] text-[#555555] cursor-not-allowed'
              }`}
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDeepSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-teal-accent text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[56px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run Deep Analysis
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="profile-analysis-container section-gap">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Profile Audit & Strategy</h2>
            <p className="text-[13px] md:text-sm text-muted">Get a surgical analysis of your LinkedIn presence and an exact roadmap to fix it.</p>
          </div>
          <div className="flex items-start gap-2 sm:gap-4">
            <GenerationCounter feature="profile_audit" />
          </div>
        </div>
      </div>

      {/* Section 1 — MODE SELECTOR (QUICK VS STRATEGIC) */}
      {!profile && !loading && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="w-full lg:w-auto">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Analyze Your Profile</h2>
            <div className="text-sm sm:text-base text-[#666666] mt-1.5 leading-relaxed flex flex-col sm:flex-row sm:items-center sm:gap-0 gap-1">
              <span>Quick Audit <span className="mx-1 opacity-30">→</span> fast clarity</span>
              <span className="hidden sm:inline mx-4 opacity-10">|</span>
              <span>Deep Strategy <span className="mx-1 opacity-30">→</span> full transformation</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:flex p-1 bg-[#0D0D0D] border border-[#1f1f1f] rounded-2xl lg:rounded-full w-full lg:w-auto">
            <button
              onClick={() => {
                setProfileMode('quick');
                setDeepStep(1);
              }}
              className={`flex-1 lg:flex-none px-4 sm:px-6 py-3 sm:py-2 text-xs sm:text-sm font-bold rounded-xl lg:rounded-full transition-all flex items-center justify-center ${
                profileMode === 'quick' ? 'bg-teal-accent text-black shadow-[0_0_20px_rgba(45,212,191,0.2)]' : 'text-[#888888] hover:text-white'
              }`}
            >
              Quick Audit
            </button>
            <button
              onClick={() => {
                if (!isPro) {
                  setShowPricingModal(true);
                } else {
                  setProfileMode('strategic');
                  setDeepStep(1);
                }
              }}
              className={`flex-1 lg:flex-none px-4 sm:px-6 py-3 sm:py-2 text-xs sm:text-sm font-bold rounded-xl lg:rounded-full transition-all flex items-center justify-center gap-2 ${
                profileMode === 'strategic' ? 'bg-teal-accent text-black shadow-[0_0_20px_rgba(45,212,191,0.2)]' : 'text-[#888888] hover:text-white'
              }`}
            >
              {!isPro && <Lock className="w-3 h-3" />}
              Deep Strategy
              {!isPro && <span className="bg-teal-accent text-black text-[9px] px-1.5 py-0.5 rounded font-black ml-1">PRO</span>}
            </button>
          </div>
        </div>
      )}

      {/* Section 2 — PROGRESS INDICATOR (STRATEGIC MODE ONLY) */}
      {!profile && !loading && profileMode === 'strategic' && (
        <div className="mb-6">
          <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(deepStep / TOTAL_DEEP_STEPS) * 100}%` }}
              className="h-full bg-teal-accent transition-all duration-500"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#555555] mt-2">
            <span>Step {deepStep} of {TOTAL_DEEP_STEPS}</span>
            <span>
              {deepStep === 1 && "Step 1: Basics"}
              {deepStep === 2 && "Step 2: Headline"}
              {deepStep === 3 && "Step 3: About"}
              {deepStep === 4 && "Step 4: Experience"}
              {deepStep === 5 && "Step 5: Goals"}
              {deepStep === 6 && "Step 6: Content"}
            </span>
          </div>
        </div>
      )}

      {user && recentScans.length > 0 && !profile && !loading && (
        <div className="flex justify-end mb-6">
          <div className="relative" ref={recentScansRef}>
            <button
              type="button"
              onClick={() => setShowRecentScans(!showRecentScans)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#888888] hover:text-white transition-all"
            >
              <History className="w-4 h-4" />
              {loadingHistory ? 'Loading...' : 'Recent Scans'}
            </button>
            
            <AnimatePresence>
              {showRecentScans && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-[#141414] border border-[#1f1f1f] rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-[#1f1f1f]">
                    <p className="text-[10px] font-bold text-[#555555] uppercase tracking-widest">Your Last 3 Audits</p>
                  </div>
                  <div className="divide-y divide-[#1f1f1f]">
                    {recentScans.map((scan) => (
                      <button
                        key={scan.id}
                        onClick={() => {
                          setProfile(scan.full_json_result);
                          setProfileMode(scan.mode);
                          setShowRecentScans(false);
                        }}
                        className="w-full p-4 text-left hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white group-hover:text-teal-accent transition-colors">
                            Score: {scan.overall_score}/100
                          </span>
                          <span className="text-[9px] text-[#555555] uppercase font-bold">{scan.mode}</span>
                        </div>
                        <p className="text-[10px] text-[#555555]">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScanner />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderError()}
          </motion.div>
        ) : profile ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderResults()}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {profileMode === 'quick' ? renderQuickMode() : renderDeepMode()}
            
            {/* Dashboard Mockup Placeholder */}
            <div className="relative pt-12">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A] z-10" />
              <div className="opacity-10 pointer-events-none filter blur-[2px] scale-[0.98]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:row-span-2 card-premium h-[400px] flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-8 border-white/5" />
                    <div className="w-24 h-4 bg-white/5 rounded mt-8" />
                  </div>
                  <div className="md:col-span-2 card-premium h-[180px]" />
                  <div className="md:col-span-2 card-premium h-[200px]" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-teal-accent/5 border border-teal-accent/10 rounded-2xl backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-teal-accent uppercase tracking-[0.3em]">Awaiting Analysis</p>
                  </div>
                  <p className="text-xs text-[#555555] font-medium">Your results dashboard will appear here.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
