import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  AlignLeft, 
  Layout, 
  ArrowRight, 
  Settings, 
  Briefcase, 
  MessageCircle, 
  Zap, 
  Star, 
  BookOpen, 
  Flame, 
  Ruler, 
  List, 
  HelpCircle, 
  BarChart, 
  MessageSquare, 
  Mail, 
  Users, 
  Minus, 
  Tag, 
  Sparkles, 
  Flag, 
  Info, 
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  PenTool,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { GenerationControls } from '../services/aiService';

interface UniversalControlsProps {
  user: any;
  isPro: boolean;
  isVoiceProfileActive: boolean;
  onGenerate: (controls: GenerationControls) => void;
  isLoading: boolean;
  feature: string;
  voicePosts?: any[];
  styleReport?: any;
}

const DEFAULT_PREFERENCES: GenerationControls & { quick_generate: boolean; customize_open: boolean; save_as_default: boolean } = {
  tone: 'conversational',
  length: 'medium',
  format: 'story',
  cta: 'question',
  substance: '',
  quick_generate: true,
  customize_open: false,
  save_as_default: false,
  hookStyle: 'number',
  contentStructure: 'problem-solution-action',
  proofElements: ['personal-experience'],
  engagementElements: ['line-breaks'],
  hashtagStrategy: 'none',
  writingPerspective: 'first-person',
  emotionalCore: 'educated-informed',
  industryContext: '',
  audienceDefinition: ''
};

const hookStyleOptions = [
  { id: 'number', label: 'Number/Stat', description: 'Start with a specific number or statistic.' },
  { id: 'moment', label: 'Middle of Moment', description: 'Start in the middle of a specific action or conversation.' },
  { id: 'bold', label: 'Bold Claim', description: 'Start with a strong, potentially controversial statement.' },
  { id: 'question', label: 'Provocative Question', description: 'Start with a question that challenges the reader.' },
  { id: 'contrarian', label: 'Contrarian Take', description: 'Start by challenging a common belief.' },
  { id: 'realization', label: 'I Just Realized Moment', description: 'Start with a fresh, personal epiphany.' }
];

const contentStructureOptions = [
  { id: 'problem-solution-action', label: 'Problem/Solution/Action', description: 'Identify a pain point, offer a fix, and give a clear next step.' },
  { id: 'hook-story-lesson-cta', label: 'Hook/Story/Lesson/CTA', description: 'Grab attention, share a narrative, extract the value, and end with an ask.' },
  { id: 'observation-why-what', label: 'Observation/Why/What to Do', description: 'Notice something, explain its importance, and provide a practical takeaway.' },
  { id: 'mistake-consequence-fix', label: 'Mistake/Consequence/Fix', description: 'Highlight a common error, show the damage it causes, and how to avoid it.' },
  { id: 'before-after-how', label: 'Before/After/How', description: 'Show the transformation and the specific steps taken to get there.' }
];

const proofOptions = [
  { id: 'personal-experience', label: 'Personal experience or example' },
  { id: 'numbers-data', label: 'Specific numbers or data points' },
  { id: 'client-case-study', label: 'Client story or case study' },
  { id: 'industry-stat', label: 'Industry stat or research' },
  { id: 'expert-reference', label: 'Expert reference or quote' }
];

const engagementOptions = [
  { id: 'emojis', label: 'Use emojis sparingly for visual breaks' },
  { id: 'line-breaks', label: 'Use line breaks for breathing room' },
  { id: 'bold-phrases', label: 'Bold key phrases for scannability' },
  { id: 'ps-tip', label: 'Add a P.S. or bonus tip at the end' }
];

const hashtagOptions = [
  { id: 'none', label: 'None', description: 'Clean look, zero hashtags.' },
  { id: 'niche', label: '3-5 Niche', description: 'Specific to your industry.' },
  { id: 'mix', label: 'Mix Popular/Niche', description: 'Broad reach + targeted.' },
  { id: 'trending', label: 'Trending Only', description: 'Ride current waves.' }
];

const perspectiveOptions = [
  { id: 'first-person', label: 'First Person', description: 'I, me, my (Personal and direct)' },
  { id: 'second-person', label: 'Second Person', description: 'You, your (Reader-focused)' },
  { id: 'third-person', label: 'Third Person', description: 'They, them (Observational)' }
];

const emotionOptions = [
  { id: 'educated-informed', label: 'Educated/Informed' },
  { id: 'motivated-act', label: 'Motivated to Act' },
  { id: 'validated-understood', label: 'Validated/Understood' },
  { id: 'challenged-uncomfortable', label: 'Challenged/Uncomfortable' },
  { id: 'entertained-amused', label: 'Entertained/Amused' },
  { id: 'curious-wanting-more', label: 'Curious/Wanting More' }
];

export const UniversalControls: React.FC<UniversalControlsProps> = ({ 
  user, 
  isPro, 
  isVoiceProfileActive, 
  onGenerate, 
  isLoading,
  feature,
  styleReport
}) => {
  const [controls, setControls] = useState<GenerationControls>(DEFAULT_PREFERENCES);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<{ tone: string; length: string; format: string } | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [substanceDraft, setSubstanceDraft] = useState('');
  const [isPostWriterOptionsCollapsed, setIsPostWriterOptionsCollapsed] = useState(false);
  const [isVoiceProfileSummaryDismissed, setIsVoiceProfileSummaryDismissed] = useState(false);

  // Initialize from localStorage and Supabase
  useEffect(() => {
    const init = async () => {
      // 1. Load from localStorage
      const localPrefs = localStorage.getItem('somyra_preferences');
      let initialPrefs = localPrefs ? JSON.parse(localPrefs) : { ...DEFAULT_PREFERENCES };
      
      // 2. If logged in, try Supabase
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferences')
            .eq('user_id', user.id)
            .single();
          
          if (data && data.preferences) {
            initialPrefs = { ...initialPrefs, ...data.preferences };
          }
        } catch (err) {
          console.error('Error fetching preferences from Supabase:', err);
        }
      }

      setControls({
        tone: initialPrefs.tone || 'conversational',
        length: initialPrefs.length || 'medium',
        format: initialPrefs.format || 'story',
        cta: initialPrefs.cta || 'question',
        substance: '',
        hookStyle: initialPrefs.hookStyle || 'number',
        contentStructure: initialPrefs.contentStructure || 'problem-solution-action',
        proofElements: initialPrefs.proofElements || ['personal-experience'],
        engagementElements: initialPrefs.engagementElements || ['line-breaks'],
        hashtagStrategy: initialPrefs.hashtagStrategy || 'none',
        writingPerspective: initialPrefs.writingPerspective || 'first-person',
        emotionalCore: initialPrefs.emotionalCore || 'educated-informed',
        industryContext: localStorage.getItem('somyra_industry') || initialPrefs.industryContext || '',
        audienceDefinition: localStorage.getItem('somyra_audience') || initialPrefs.audienceDefinition || ''
      });
      
      const openState = localStorage.getItem('somyra_customize_open');
      setIsCustomizeOpen(openState === 'true' || initialPrefs.customize_open || false);
      setSaveAsDefault(user ? true : false); // Default on for logged in, off for logged out

      // Substance draft
      const draft = localStorage.getItem('somyra_substance_draft');
      if (draft) {
        setSubstanceDraft(draft);
        setControls(prev => ({ ...prev, substance: draft }));
      }

      // History for suggestions
      const localHistory = localStorage.getItem('somyra_generation_history');
      if (localHistory) {
        const parsedHistory = JSON.parse(localHistory);
        setHistory(parsedHistory);
        if (parsedHistory.length >= 5) {
          analyzeHistory(parsedHistory);
        }
      }

      // FTUX
      const hasPrefs = localStorage.getItem('somyra_preferences');
      if (!hasPrefs && !localHistory) {
        setShowOnboarding(true);
      }
    };

    init();
  }, [user]);

  const analyzeHistory = (genHistory: any[]) => {
    const counts = {
      tone: {} as Record<string, number>,
      length: {} as Record<string, number>,
      format: {} as Record<string, number>
    };

    genHistory.forEach(item => {
      counts.tone[item.tone] = (counts.tone[item.tone] || 0) + 1;
      counts.length[item.length] = (counts.length[item.length] || 0) + 1;
      counts.format[item.format] = (counts.format[item.format] || 0) + 1;
    });

    const getMostFrequent = (obj: Record<string, number>) => {
      return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0];
    };

    const mostUsed = {
      tone: getMostFrequent(counts.tone),
      length: getMostFrequent(counts.length),
      format: getMostFrequent(counts.format)
    };

    if (mostUsed.tone && mostUsed.length && mostUsed.format) {
      setSuggestion(mostUsed);
      const dismissed = sessionStorage.getItem('somyra_suggestion_dismissed');
      if (!dismissed) {
        setShowSuggestion(true);
      }
    }
  };

  const savePreferences = async (newControls: GenerationControls) => {
    if (!saveAsDefault) return;

    const prefsToSave = {
      tone: newControls.tone,
      length: newControls.length,
      format: newControls.format,
      cta: newControls.cta,
      hookStyle: newControls.hookStyle,
      contentStructure: newControls.contentStructure,
      proofElements: newControls.proofElements,
      engagementElements: newControls.engagementElements,
      hashtagStrategy: newControls.hashtagStrategy,
      writingPerspective: newControls.writingPerspective,
      emotionalCore: newControls.emotionalCore,
      industryContext: newControls.industryContext,
      audienceDefinition: newControls.audienceDefinition,
      last_updated: Date.now()
    };

    localStorage.setItem('somyra_preferences', JSON.stringify(prefsToSave));

    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferences: prefsToSave,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } catch (err) {
        console.error('Error saving preferences to Supabase:', err);
      }
    }
  };

  const updateControl = (key: keyof GenerationControls, value: any) => {
    const newControls = { ...controls, [key]: value };
    setControls(newControls);

    if (key === 'industryContext') {
      localStorage.setItem('somyra_industry', value);
    }
    if (key === 'audienceDefinition') {
      localStorage.setItem('somyra_audience', value);
    }
  };

  const toggleCheckboxControl = (key: 'proofElements' | 'engagementElements', value: string) => {
    const currentValues = (controls[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateControl(key, newValues);
  };

  const handleSubstanceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSubstanceDraft(val);
    setControls(prev => ({ ...prev, substance: val }));
    localStorage.setItem('somyra_substance_draft', val);
  };

  const toggleCustomize = () => {
    const newState = !isCustomizeOpen;
    setIsCustomizeOpen(newState);
    localStorage.setItem('somyra_customize_open', String(newState));
    if (showOnboarding) setShowOnboarding(false);
  };

  const handleQuickGenerate = () => {
    if (!controls.substance.trim()) {
      const nudgeShown = localStorage.getItem('somyra_substance_nudge_shown');
      if (!nudgeShown) {
        setShowNudge(true);
        return;
      }
    }
    onGenerate(controls);
    trackGeneration();
  };

  const handleCustomGenerate = () => {
    onGenerate(controls);
    trackGeneration();
  };

  const trackGeneration = () => {
    const newEntry = {
      timestamp: Date.now(),
      tone: controls.tone,
      length: controls.length,
      format: controls.format,
      cta: controls.cta,
      feature,
      had_substance: !!controls.substance.trim()
    };

    const newHistory = [newEntry, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('somyra_generation_history', JSON.stringify(newHistory));
  };

  const applySuggestion = () => {
    if (suggestion) {
      const newControls = {
        ...controls,
        tone: suggestion.tone,
        length: suggestion.length,
        format: suggestion.format
      };
      setControls(newControls);
      savePreferences(newControls);
      setShowSuggestion(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (e.shiftKey) {
          // Cmd + Shift + Enter
          if (!isCustomizeOpen) {
            toggleCustomize();
          }
          handleCustomGenerate();
        } else {
          // Cmd + Enter
          handleQuickGenerate();
        }
      } else if (e.key === 'Escape' && isCustomizeOpen) {
        toggleCustomize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controls, isCustomizeOpen]);

  const toneOptions = [
    { id: 'professional', label: 'Professional and authoritative', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'conversational', label: 'Casual and relatable', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'contrarian', label: 'Bold and contrarian', icon: <Zap className="w-4 h-4" /> },
    { id: 'inspirational', label: 'Inspirational and motivational', icon: <Star className="w-4 h-4" /> },
    { id: 'educational', label: 'Educational and helpful', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'provocative', label: 'Provocative and debate starting', icon: <Flame className="w-4 h-4" /> },
  ];

  const lengthOptions = [
    { id: 'short', label: 'Short and punchy', sub: '50 to 100 words' },
    { id: 'medium', label: 'Medium', sub: '100 to 200 words' },
    { id: 'long', label: 'Long form', sub: '200 to 300 words' },
    { id: 'thread', label: 'Thread worthy', sub: '300 plus words', pro: true },
  ];

  const formatOptions = [
    { id: 'story', label: 'Story driven', sub: 'hook story lesson', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'list', label: 'List based', sub: 'numbered points', icon: <List className="w-4 h-4" /> },
    { id: 'question', label: 'Question focused', sub: 'Socratic approach', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'data', label: 'Data and stats led', sub: 'numbers and insights', icon: <BarChart className="w-4 h-4" /> },
    { id: 'opinion', label: 'Pure opinion', sub: 'hot take', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const ctaOptions = [
    { id: 'question', label: 'Ask a question', sub: 'engagement', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'dm', label: 'Invite to DM', sub: 'lead generation', icon: <Mail className="w-4 h-4" /> },
    { id: 'experience', label: 'Share experience', sub: 'community building', icon: <Users className="w-4 h-4" /> },
    { id: 'none', label: 'No CTA', sub: 'just value', icon: <Minus className="w-4 h-4" /> },
    { id: 'pitch', label: 'Pitch and offer', sub: 'product mention', icon: <Tag className="w-4 h-4" />, pro: true },
  ];

  return (
    <div className="w-full">
      {/* Quick Generate Bar */}
      {!isCustomizeOpen && (
        <div className="bg-[#0D0D0D] border border-[#1f1f1f] rounded-[10px] tab:rounded-xl p-[12px] ml:p-[12px] flex flex-col tab:flex-row tab:items-center justify-between gap-[8px] tab:gap-[16px] mb-4 relative min-h-[52px] tab:h-[52px]">
          {showOnboarding && (
            <div className="hidden tab:block absolute -top-12 left-0 bg-[#2DD4BF] text-black text-xs font-bold px-3 py-2 rounded-lg shadow-lg animate-bounce z-20">
              These are your generation settings. Click Customize to change them.
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-[#2DD4BF] rotate-45"></div>
            </div>
          )}
          
          <div className="flex animate-in fade-in slide-in-from-left-2 duration-500 flex-wrap tab:flex-nowrap gap-[6px]">
            <div className={`bg-[#141414] border border-[#1f1f1f] rounded-full px-[8px] py-[3px] ds:px-2.5 ds:py-1 text-[10px] ds:text-[11px] text-[#888888] flex items-center gap-1.5 whitespace-nowrap ${isLoading ? 'animate-pulse opacity-60' : ''}`}>
              <Mic className="w-3 h-3" />
              <span className="truncate max-w-[60px] ml:max-w-[80px]">{toneOptions.find(o => o.id === controls.tone)?.id || controls.tone}</span>
            </div>
            <div className={`bg-[#141414] border border-[#1f1f1f] rounded-full px-[8px] py-[3px] ds:px-2.5 ds:py-1 text-[10px] ds:text-[11px] text-[#888888] flex items-center gap-1.5 whitespace-nowrap ${isLoading ? 'animate-pulse opacity-60' : ''}`}>
              <AlignLeft className="w-3 h-3" />
              <span>{controls.length}</span>
            </div>
            <div className={`bg-[#141414] border border-[#1f1f1f] rounded-full px-[8px] py-[3px] ds:px-2.5 ds:py-1 text-[10px] ds:text-[11px] text-[#888888] flex items-center gap-1.5 whitespace-nowrap ${isLoading ? 'animate-pulse opacity-60' : ''}`}>
              <Layout className="w-3 h-3" />
              <span>{controls.format}</span>
            </div>
            <div className={`bg-[#141414] border border-[#1f1f1f] rounded-full px-[8px] py-[3px] ds:px-2.5 ds:py-1 text-[10px] ds:text-[11px] text-[#888888] flex items-center gap-1.5 whitespace-nowrap ${isLoading ? 'animate-pulse opacity-60' : ''}`}>
              <ArrowRight className="w-3 h-3" />
              <span>{controls.cta}</span>
            </div>
            {isVoiceProfileActive && (
              <div className={`bg-[rgba(45,212,191,0.08)] border border-[rgba(45,212,191,0.2)] rounded-full px-[8px] py-[3px] ds:px-2.5 ds:py-1 text-[10px] ds:text-[11px] text-[#2DD4BF] flex items-center gap-1.5 whitespace-nowrap ${isLoading ? 'animate-pulse opacity-60' : ''}`}>
                <div className="w-[6px] h-[6px] bg-[#2DD4BF] rounded-full"></div>
                <span className="hidden ml:inline">Voice Active</span>
              </div>
            )}
          </div>

          <div className="flex flex-col tab:flex-row gap-[8px] tab:gap-2 w-full tab:w-auto">
            <button 
              onClick={toggleCustomize}
              className="w-full tab:w-auto bg-transparent border border-[#1f1f1f] text-[#888888] ds:hover:border-[#2DD4BF] ds:hover:text-[#2DD4BF] rounded-lg px-4 tab:px-[14px] ds:px-4 py-2.5 tab:py-[8px] ds:py-2.5 text-[13px] ds:text-sm flex items-center justify-center gap-2 transition-all min-h-[44px] tab:min-h-0"
            >
              <Settings className="w-3.5 h-3.5" />
              Customize
            </button>
            <button 
              onClick={handleQuickGenerate}
              disabled={isLoading}
              className="w-full tab:w-auto bg-[#2DD4BF] text-black font-bold rounded-lg px-5 tab:px-[14px] ds:px-5 py-2.5 tab:py-[8px] ds:py-2.5 text-[13px] ds:text-sm ds:hover:shadow-[0_0_16px_rgba(45,212,191,0.3)] ds:hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] tab:min-h-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isLoading ? 'Generating...' : 'Quick Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Customize Panel */}
      <AnimatePresence>
        {isCustomizeOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden mb-4"
          >
            {showSuggestion && suggestion && (
              <div className="bg-[#141414] border border-[#2DD4BF]/20 rounded-xl p-3 ml:p-[12px] ds:p-[12px_16px] mb-3 flex flex-col ml:flex-col tab:flex-row items-start tab:items-center justify-between gap-3 relative">
                <div className="flex items-center gap-2 text-[#2DD4BF] text-[11px] ds:text-xs pr-8 ml:pr-0">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Based on your last {history.length} posts you usually prefer {suggestion.tone}, {suggestion.length}, {suggestion.format}.</span>
                </div>
                <div className="flex items-center gap-3 w-full tab:w-auto">
                  <button 
                    onClick={applySuggestion}
                    className="w-full tab:w-auto text-center tab:text-left text-[#2DD4BF] text-[11px] ds:text-xs font-bold ds:underline ds:hover:text-[#2DD4BF]/80 border border-[#2DD4BF]/30 tab:border-0 rounded-lg tab:rounded-none py-2 tab:py-0"
                  >
                    Apply my usual?
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setShowSuggestion(false);
                    sessionStorage.setItem('somyra_suggestion_dismissed', 'true');
                  }}
                  className="absolute top-3 right-3 tab:static text-[#888888] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="bg-[#0D0D0D] border border-[#1f1f1f] rounded-[10px] ml:rounded-[12px] tab:rounded-[14px] ds:rounded-[16px] p-[12px] ml:p-[16px] tab:p-[20px] ds:p-[24px] w-full max-w-full">
              <div className="grid grid-cols-1 ds:grid-cols-2 gap-[10px] ml:gap-[12px] tab:gap-[16px] ds:gap-[20px]">
                {/* Tone Selector */}
                <div className="ds:col-span-2">
                  <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                    <span className="text-[9px] ms:text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Voice and Tone</span>
                    <div className="group relative">
                      <Info className="w-[11px] ds:w-[12px] h-[11px] ds:h-[12px] text-[#888888] cursor-help" />
                      <div className="hidden ds:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[12px] text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        This controls how your post sounds to the reader.
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                    {toneOptions.map(option => {
                      const shortLabels: Record<string, string> = {
                        professional: 'Professional',
                        conversational: 'Conversational',
                        contrarian: 'Contrarian',
                        inspirational: 'Inspirational',
                        educational: 'Educational',
                        provocative: 'Provocative'
                      };
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => updateControl('tone', option.id)}
                          className={`flex items-center justify-center gap-2 px-[12px] ds:px-4 py-2 rounded-full text-[11px] ds:text-xs transition-all min-h-[40px] ds:min-h-[36px] whitespace-nowrap ${
                            controls.tone === option.id 
                              ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                              : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] ds:hover:border-[#333333] ds:hover:text-[#CCCCCC]'
                          }`}
                        >
                          <span className="shrink-0">{option.icon}</span>
                          <span>{shortLabels[option.id]}</span>
                        </button>
                      );
                    })}
                  </div>
                  {isVoiceProfileActive && (
                    <p className="mt-2 text-[11px] text-[#888888]">
                      Your Voice Profile is guiding the tone. You can override it here for this post.
                    </p>
                  )}
                </div>

                {/* Length Selector */}
                <div>
                  <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                    <span className="text-[9px] ms:text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Post Length</span>
                    <div className="group relative">
                      <Ruler className="w-[11px] ds:w-[12px] h-[11px] ds:h-[12px] text-[#888888] cursor-help" />
                      <div className="hidden ds:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[12px] text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        Approximate word count of the final post.
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 tab:flex tab:flex-row gap-[8px] ds:gap-[8px]">
                    {lengthOptions.map(option => {
                      const shortLabels: Record<string, string> = {
                        short: 'Short',
                        medium: 'Medium',
                        long: 'Long',
                        thread: 'Thread'
                      };
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            if (option.pro && !isPro) return;
                            updateControl('length', option.id);
                          }}
                          className={`group relative flex items-center justify-center gap-2 px-[12px] ds:px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all min-h-[44px] ml:min-h-[40px] ds:min-h-[36px] w-full tab:flex-1 ${
                            controls.length === option.id 
                              ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                              : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] ds:hover:border-[#333333] ds:hover:text-[#CCCCCC]'
                          } ${option.pro && !isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="hidden ml:inline">{option.label.split(' ')[0]}</span>
                          <span className="ml:hidden">{shortLabels[option.id]}</span>
                          {option.pro && (
                            <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] text-[8px] px-1 ml:px-[4px] py-[1px] rounded font-bold uppercase">Pro</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Format Selector */}
                <div>
                  <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                    <span className="text-[9px] ms:text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Post Format</span>
                    <div className="group relative">
                      <Layout className="w-[11px] ds:w-[12px] h-[11px] ds:h-[12px] text-[#888888] cursor-help" />
                      <div className="hidden ds:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[12px] text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        The structure and flow of your post.
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 ml:flex ml:flex-wrap gap-[6px] ds:gap-[8px]">
                    {formatOptions.map(option => {
                      const shortLabels: Record<string, string> = {
                        story: 'Story',
                        list: 'List',
                        question: 'Question',
                        data: 'Data',
                        opinion: 'Opinion'
                      };
                      return (
                        <button
                          key={option.id}
                          onClick={() => updateControl('format', option.id)}
                          className={`flex items-center justify-center ml:justify-start gap-2 px-[12px] ds:px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all min-h-[44px] ml:min-h-[40px] ds:min-h-[36px] w-full ml:w-auto ${
                            controls.format === option.id 
                              ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                              : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] ds:hover:border-[#333333] ds:hover:text-[#CCCCCC]'
                          }`}
                        >
                          {option.icon}
                          <span className="hidden ml:inline">{option.label.split(' ')[0]}</span>
                          <span className="ml:hidden">{shortLabels[option.id]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Style */}
                <div className="ds:col-span-2">
                  <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                    <span className="text-[9px] ms:text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">How should it end</span>
                    <div className="group relative">
                      <Flag className="w-[11px] ds:w-[12px] h-[11px] ds:h-[12px] text-[#888888] cursor-help" />
                      <div className="hidden ds:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[12px] text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        What action or feeling should the reader leave with.
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                    {ctaOptions.map(option => {
                      const shortLabels: Record<string, string> = {
                        question: 'Ask Question',
                        dm: 'Invite DM',
                        experience: 'Share Exp',
                        none: 'No CTA',
                        pitch: 'Soft Pitch'
                      };
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (option.pro && !isPro) return;
                            updateControl('cta', option.id);
                          }}
                          className={`group relative flex items-center justify-center gap-2 px-[12px] ds:px-4 py-2 rounded-full text-[11px] ds:text-xs transition-all min-h-[40px] ds:min-h-[36px] whitespace-nowrap ${
                            controls.cta === option.id 
                              ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                              : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] ds:hover:border-[#333333] ds:hover:text-[#CCCCCC]'
                          } ${option.pro && !isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="shrink-0">{option.icon}</span>
                          <span>{shortLabels[option.id]}</span>
                          {option.pro && (
                            <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] text-[8px] px-1 py-[1px] rounded font-bold uppercase">Pro</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#1a1a1a] my-[16px] ds:my-[20px]"></div>

              {/* Substance Question */}
              <div className="mt-[16px] ds:mt-[20px] mb-[16px] ds:mb-[20px]">
                <div className="flex flex-col ml:flex-row ml:items-center justify-between gap-2 mb-[8px] ds:mb-[10px]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span className="text-[9px] ms:text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">What is the real story or moment behind this?</span>
                    <div className="group relative">
                      <Info className="w-[11px] ds:w-[12px] h-[11px] ds:h-[12px] text-[#888888] cursor-help" />
                      <div className="hidden ds:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[12px] text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        This single field transforms generic AI output into something specific and human. Even one sentence helps.
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#444444] self-end ml:self-auto">{substanceDraft.length} characters</span>
                </div>
                <textarea
                  value={substanceDraft}
                  onChange={handleSubstanceChange}
                  onFocus={(e) => {
                    if (window.innerWidth < 768) {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  placeholder="What actually happened? What did you notice? What changed your mind? Even one sentence makes your post 10x more specific and human."
                  className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 text-white text-[13px] ds:text-sm h-[120px] ml:h-[120px] ds:h-[100px] resize-none focus:border-[#2DD4BF] focus:ring-4 focus:ring-[#2DD4BF]/5 transition-all outline-none"
                />
                <div className="flex items-center gap-1.5 mt-2 text-[#2DD4BF]/70 text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  <span>Posts with a real moment perform 3x better on LinkedIn.</span>
                </div>
              </div>

              {/* Post Writer Specific Options */}
              {feature === 'Post Writer' && (
                <div className="mt-8 pt-8 border-t border-[#1a1a1a] space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#2DD4BF]" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">Post Writer Options</h3>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsPostWriterOptionsCollapsed(!isPostWriterOptionsCollapsed)}
                      className="text-[#2DD4BF] text-[11px] font-medium hover:underline"
                    >
                      {isPostWriterOptionsCollapsed ? 'Expand' : 'Collapse'}
                    </button>
                  </div>

                  {!isPostWriterOptionsCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-8"
                    >
                      {/* Voice Profile Intelligence Summary */}
                      {isVoiceProfileActive && !isVoiceProfileSummaryDismissed && styleReport && (
                        <div className="bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 rounded-2xl p-4 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2">
                            <button 
                              type="button"
                              onClick={() => setIsVoiceProfileSummaryDismissed(true)}
                              className="text-[#888888] hover:text-white transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                            <span className="text-[10px] font-bold text-[#2DD4BF] uppercase tracking-wider">Voice Profile Intelligence</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="text-[11px]">
                              <span className="text-[#888888]">Hook Style:</span>
                              <span className="text-white ml-1.5 font-medium capitalize">{styleReport.hook_style || 'Detected'}</span>
                            </div>
                            <div className="text-[11px]">
                              <span className="text-[#888888]">Structure:</span>
                              <span className="text-white ml-1.5 font-medium capitalize">{styleReport.structure || 'Detected'}</span>
                            </div>
                            <div className="text-[11px]">
                              <span className="text-[#888888]">Perspective:</span>
                              <span className="text-white ml-1.5 font-medium capitalize">{styleReport.perspective || 'Detected'}</span>
                            </div>
                            <div className="text-[11px]">
                              <span className="text-[#888888]">Emojis:</span>
                              <span className="text-white ml-1.5 font-medium">{styleReport.emoji_usage ? 'Active' : 'None'}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-[#888888] mt-3 italic">All controls pre-filled based on your writing. Override anything for this post.</p>
                        </div>
                      )}

                      {/* Hook Style */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Hook Style</span>
                          <div className="group relative">
                            <HelpCircle className="w-[11px] ds:w-[12px] h-[11px] ds:h-[12px] text-[#888888] cursor-help" />
                            <div className="hidden ds:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[12px] text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                              The very first line of your post.
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                          {hookStyleOptions.map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateControl('hookStyle', option.id)}
                              className={`px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all ${
                                controls.hookStyle === option.id 
                                  ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                                  : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-[#CCCCCC]'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Content Structure */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Content Structure</span>
                        </div>
                        <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                          {contentStructureOptions.map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateControl('contentStructure', option.id)}
                              className={`px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all ${
                                controls.contentStructure === option.id 
                                  ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                                  : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-[#CCCCCC]'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Proof and Credibility */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Proof and Credibility</span>
                        </div>
                        <div className="space-y-3">
                          {proofOptions.map(option => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox"
                                  checked={controls.proofElements?.includes(option.id)}
                                  onChange={() => toggleCheckboxControl('proofElements', option.id)}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border transition-all ${
                                  controls.proofElements?.includes(option.id)
                                    ? 'bg-[#2DD4BF] border-[#2DD4BF]'
                                    : 'bg-[#141414] border-[#333333] group-hover:border-[#444444]'
                                }`}>
                                  {controls.proofElements?.includes(option.id) && (
                                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                                  )}
                                </div>
                              </div>
                              <span className={`text-[13px] transition-colors ${
                                controls.proofElements?.includes(option.id) ? 'text-white' : 'text-[#888888] group-hover:text-[#CCCCCC]'
                              }`}>
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Engagement Elements */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Engagement Elements</span>
                        </div>
                        <div className="space-y-3">
                          {engagementOptions.map(option => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox"
                                  checked={controls.engagementElements?.includes(option.id)}
                                  onChange={() => toggleCheckboxControl('engagementElements', option.id)}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border transition-all ${
                                  controls.engagementElements?.includes(option.id)
                                    ? 'bg-[#2DD4BF] border-[#2DD4BF]'
                                    : 'bg-[#141414] border-[#333333] group-hover:border-[#444444]'
                                }`}>
                                  {controls.engagementElements?.includes(option.id) && (
                                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                                  )}
                                </div>
                              </div>
                              <span className={`text-[13px] transition-colors ${
                                controls.engagementElements?.includes(option.id) ? 'text-white' : 'text-[#888888] group-hover:text-[#CCCCCC]'
                              }`}>
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Hashtag Strategy */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Hashtag Strategy</span>
                        </div>
                        <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                          {hashtagOptions.map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateControl('hashtagStrategy', option.id)}
                              className={`px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all ${
                                controls.hashtagStrategy === option.id 
                                  ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                                  : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-[#CCCCCC]'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Writing Perspective */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Writing Perspective</span>
                        </div>
                        <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                          {perspectiveOptions.map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateControl('writingPerspective', option.id)}
                              className={`px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all ${
                                controls.writingPerspective === option.id 
                                  ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                                  : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-[#CCCCCC]'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emotional Core */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Emotional Core</span>
                        </div>
                        <div className="flex flex-wrap gap-[6px] ds:gap-[8px]">
                          {emotionOptions.map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateControl('emotionalCore', option.id)}
                              className={`px-3.5 py-2 rounded-full text-[11px] ds:text-xs transition-all ${
                                controls.emotionalCore === option.id 
                                  ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF] text-[#2DD4BF] font-semibold' 
                                  : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] hover:border-[#333333] hover:text-[#CCCCCC]'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Industry Context */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Industry Context</span>
                        </div>
                        <input 
                          type="text"
                          value={controls.industryContext}
                          onChange={(e) => updateControl('industryContext', e.target.value)}
                          placeholder="e.g. SaaS founder, marketing consultant, fitness coach"
                          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white text-[13px] ds:text-sm focus:border-[#2DD4BF] focus:ring-4 focus:ring-[#2DD4BF]/5 transition-all outline-none"
                        />
                      </div>

                      {/* Audience Definition */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-[8px] ds:mb-[10px]">
                          <span className="text-[9px] ds:text-[10px] uppercase tracking-[1.5px] ds:tracking-[2px] font-semibold text-[#888888]">Audience Definition</span>
                        </div>
                        <input 
                          type="text"
                          value={controls.audienceDefinition}
                          onChange={(e) => updateControl('audienceDefinition', e.target.value)}
                          placeholder="e.g. early stage founders, freelance designers, mid-level marketers"
                          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-white text-[13px] ds:text-sm focus:border-[#2DD4BF] focus:ring-4 focus:ring-[#2DD4BF]/5 transition-all outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Save Preferences Row */}
              <div className="flex items-center justify-between gap-4 mt-8 bg-[#141414]/50 p-4 rounded-xl border border-[#1f1f1f]">
                <div className="flex flex-col">
                  <span className="text-white text-[13px] font-medium">Set as Defaults</span>
                  <span className="text-[#888888] text-[11px]">Quick Generate will use these settings.</span>
                </div>
                <div className="flex items-center gap-3">
                  <AnimatePresence>
                    {showSavedIndicator && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#2DD4BF] text-[11px] font-medium"
                      >
                        Saved
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button 
                    type="button"
                    onClick={() => {
                      const newState = !saveAsDefault;
                      setSaveAsDefault(newState);
                      if (newState) {
                        savePreferences(controls);
                        setShowSavedIndicator(true);
                        setTimeout(() => setShowSavedIndicator(false), 2000);
                      }
                    }}
                    className={`w-10 h-5 rounded-full relative transition-all duration-300 ${saveAsDefault ? 'bg-[#2DD4BF]' : 'bg-[#333333]'} cursor-pointer outline-none focus:ring-2 focus:ring-[#2DD4BF]/20`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${saveAsDefault ? 'left-[22px]' : 'left-[4px]'}`}></div>
                  </button>
                </div>
              </div>

              {/* Generate Button Container with Sticky Behavior */}
              <div className="relative mt-6">
                <div className="ml:hidden sticky bottom-[52px] h-[60px] bg-gradient-to-t from-[#080808] to-transparent pointer-events-none z-10"></div>
                <button
                  onClick={handleCustomGenerate}
                  disabled={isLoading}
                  className="w-full bg-[#2DD4BF] text-black font-bold rounded-xl h-[52px] tab:h-[46px] ds:h-[48px] text-[15px] tab:text-[14px] ds:text-[15px] ds:hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] ds:hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml:sticky ml:bottom-[16px] z-10"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isLoading ? 'Generating your post...' : 'Generate Post'}
                </button>
                
                <div className="hidden ds:block text-center mt-2 text-[11px] text-[#888888]">
                  Cmd Enter to Quick Generate
                </div>

                <button 
                  onClick={toggleCustomize}
                  className="w-full text-center text-[#888888] text-xs mt-4 ds:hover:text-[#888888] transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Collapse options
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nudge Tooltip */}
      <AnimatePresence>
        {showNudge && (
          <div className="overlay-shell z-50 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="dialog-panel max-w-sm border-[#1f1f1f] bg-[#141414]"
            >
              <div className="action-row-safe mb-4">
                <div className="bg-[#2DD4BF]/10 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
                </div>
                <h3 className="text-white font-bold">Make it human?</h3>
              </div>
              <p className="text-safe text-[#888888] text-sm mb-6 leading-relaxed">
                Adding a real story or moment makes posts significantly better. Want to add one before generating?
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setShowNudge(false);
                    if (!isCustomizeOpen) toggleCustomize();
                    // Focus textarea after a short delay for animation
                    setTimeout(() => {
                      const textarea = document.querySelector('textarea');
                      if (textarea) textarea.focus();
                    }, 500);
                  }}
                  className="w-full bg-[#2DD4BF] text-black font-bold py-3 rounded-xl text-sm"
                >
                  Yes, add a moment
                </button>
                <button 
                  onClick={() => {
                    setShowNudge(false);
                    localStorage.setItem('somyra_substance_nudge_shown', 'true');
                    onGenerate(controls);
                    trackGeneration();
                  }}
                  className="w-full bg-transparent text-[#888888] py-3 rounded-xl text-sm hover:text-white"
                >
                  No, generate anyway
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversalControls;
