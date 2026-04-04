import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  ChevronDown, 
  Shield, 
  Clock, 
  Heart, 
  Lock, 
  Crown, 
  Plus, 
  Star, 
  Bolt,
  Linkedin,
  Loader2,
  Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.3em] text-teal-accent mb-5 md:mb-7">{children}</p>
);

const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`w-full text-[24px] md:text-[32px] lg:text-[40px] font-black text-white leading-tight tracking-tight ${className}`}>
    {children}
  </h2>
);

const countries = [
  { name: 'India', code: '+91', flag: '🇮🇳', placeholder: '98765 43210' },
  { name: 'United States', code: '+1', flag: '🇺🇸', placeholder: '201 555 0123' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', placeholder: '7911 123456' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', placeholder: 'Phone number' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', placeholder: 'Phone number' },
  { name: 'UAE', code: '+971', flag: '🇦🇪', placeholder: 'Phone number' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', placeholder: 'Phone number' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', placeholder: 'Phone number' },
  { name: 'France', code: '+33', flag: '🇫🇷', placeholder: 'Phone number' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', placeholder: 'Phone number' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪', placeholder: 'Phone number' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿', placeholder: 'Phone number' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', placeholder: 'Phone number' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩', placeholder: 'Phone number' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', placeholder: 'Phone number' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰', placeholder: 'Phone number' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵', placeholder: 'Phone number' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾', placeholder: 'Phone number' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭', placeholder: 'Phone number' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩', placeholder: 'Phone number' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷', placeholder: 'Phone number' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽', placeholder: 'Phone number' },
  { name: 'Japan', code: '+81', flag: '🇯🇵', placeholder: 'Phone number' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷', placeholder: 'Phone number' },
  { name: 'Israel', code: '+972', flag: '🇮🇱', placeholder: 'Phone number' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', placeholder: 'Phone number' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦', placeholder: 'Phone number' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼', placeholder: 'Phone number' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', placeholder: 'Phone number' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪', placeholder: 'Phone number' },
];

const PhoneInput = ({ value, onChange, onCountryChange, error }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 250);
    }
  }, [isOpen]);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className={`flex bg-[#141414] border rounded-xl overflow-hidden transition-all duration-300 ${
        isFocused ? 'border-teal-accent ring-4 ring-teal-accent/10' : 'border-[#1f1f1f]'
      }`}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-[110px] shrink-0 border-r border-[#1f1f1f] px-2 py-3 cursor-pointer flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors"
        >
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm font-medium text-white">{selectedCountry.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#555555] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        <input 
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={selectedCountry.placeholder}
          className="flex-grow bg-transparent border-none px-4 py-3 text-sm text-white outline-none placeholder:text-[#555555]"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={dropdownRef}
            initial={{ opacity: 0, y: openUpward ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpward ? -10 : 10 }}
            className={`absolute left-0 right-0 md:right-auto md:w-[280px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl z-[1000] overflow-hidden ${
              openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <div className="p-2 bg-[#141414] border-b border-[#2a2a2a] flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#555555]" />
              <input 
                type="text"
                autoFocus
                placeholder="Search country or code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-1.5 text-xs text-white outline-none"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
              {filteredCountries.map((c) => (
                <div 
                  key={c.name}
                  onClick={() => {
                    setSelectedCountry(c);
                    onCountryChange(c);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-teal-accent/5 transition-colors group min-h-[44px]"
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-[13px] text-white flex-grow">{c.name}</span>
                  <span className="text-[13px] text-[#555555] group-hover:text-teal-accent transition-colors">{c.code}</span>
                  {selectedCountry.name === c.name && <Check className="w-4 h-4 text-teal-accent" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  user: any;
  isPro: boolean;
  trackEvent: (name: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  user, 
  isPro,
  trackEvent 
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState('90vh');
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    const updateMaxHeight = () => {
      const h = window.innerHeight;
      if (h < 900) setMaxHeight('80vh');
      else if (h < 1200) setMaxHeight('85vh');
      else setMaxHeight('90vh');
    };
    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "Is the free plan really free forever?",
      a: "Yes completely. No credit card. No trial period. No hidden charges. The free plan gives you 10 generations per day after signing up and that never changes."
    },
    {
      q: "How does Pro activation work?",
      a: "After you submit your request Shantanu personally reviews it and activates your account within 24 hours. You will get a WhatsApp confirmation before any payment is collected."
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. No contracts. No lock-in. Cancel anytime with zero questions asked. Just send a message on WhatsApp or LinkedIn."
    },
    {
      q: "Is Somyra better than Taplio or Supergrow?",
      a: "Somyra costs 4x less than Taplio and writes in your exact voice using Voice Profile — something Taplio cannot do."
    },
    {
      q: "What happens after I request Pro access?",
      a: "You will receive a WhatsApp message from Shantanu within 24 hours confirming your activation and payment details. No automated billing — everything is confirmed personally."
    }
  ];

  return (
    <div className="overlay-shell z-[100] p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="overlay-backdrop bg-black/85 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative min-w-0 bg-[#0D0D0D] border border-white/10 md:border-teal-accent/20 md:rounded-[20px] w-full h-full md:h-auto md:max-w-[960px] lg:max-w-[1100px] md:max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
        style={{ maxHeight: window.innerWidth < 768 ? '100vh' : maxHeight }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full bg-[#141414] border border-[#1f1f1f] flex items-center justify-center text-[#888888] hover:text-white hover:border-teal-accent transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-4 md:p-7">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6 md:mb-10 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-accent/40 bg-teal-accent/5 backdrop-blur-sm mb-3">
              <div className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-teal-accent uppercase tracking-widest">AI-POWERED LINKEDIN COPILOT</span>
            </div>
            
            <SectionHeading className="mb-2 w-full max-w-[672px] mx-auto">
              Simple, transparent pricing.
            </SectionHeading>
            <div className="w-full max-w-[512px] mx-auto">
              <p className="text-[13px] md:text-sm text-[#888888] mb-6 leading-relaxed px-4">
                Start free. Upgrade when you are ready to scale your LinkedIn presence globally.
              </p>
            </div>
            
            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-[#141414] border border-[#1f1f1f] rounded-full p-1.5 mb-2">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${!isAnnual ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all ${isAnnual ? 'bg-teal-accent/10 text-teal-accent border border-teal-accent/20' : 'text-[#888] hover:text-white'}`}
              >
                Annual
              </button>
              {isAnnual && <span className="text-[10px] text-teal-accent font-bold mr-2">Save up to 35%</span>}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
            {/* Free Card */}
            <div className="flex min-w-0 flex-1 flex-col rounded-3xl border border-white/5 bg-white/[0.02] p-5 md:p-7 hover:border-white/10 transition-colors">
              <div className="mb-6">
                <span className="text-[10px] font-bold text-[#888888] tracking-[2px] uppercase">FREE</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[44px] font-black text-white">$0</span>
                  <span className="text-[13px] text-[#555555]">/mo</span>
                </div>
                <p className="text-[13px] text-[#888888] mt-2">Forever free — start building your brand without compromise.</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[10px] font-bold text-[#555555] tracking-[2px] uppercase">INCLUDES</p>
                <ul className="space-y-3">
                  {[
                    "5 generations to try instantly",
                    "20 generations per month after signup",
                    "Profile Audit: 5 per month",
                    "Topic Generator: 30 topics per month",
                    "Post Writer: 10 per month",
                    "Smart Outreach: 10 messages per month",
                    "Voice Profile: up to 5 sample posts",
                    "Saved Library: up to 10 saves"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12px] text-[#A0A0A0] leading-snug">
                      <Check className="w-3.5 h-3.5 text-teal-accent mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {[
                    "Deep Strategy",
                    "Deep Mode",
                    "Unlimited Topic Generator",
                    "Priority AI responses",
                    "Early access to new features",
                    "Direct founder access"
                  ].map((f, i) => (
                    <li key={`not-${i}`} className="flex items-start gap-3 text-[12px] text-[#555555] leading-snug line-through opacity-70">
                      <X className="w-3.5 h-3.5 text-[#555555] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                disabled={!!user}
                className="mt-auto w-full py-3.5 rounded-2xl text-[14px] font-bold border border-white/10 text-white hover:bg-white/[0.03] transition-all disabled:opacity-50 disabled:cursor-default"
              >
                {user ? 'You are on Free Plan' : 'Get Started Free'}
              </button>
            </div>

            {/* Pro Card */}
            <div className="relative flex min-w-0 flex-1 flex-col rounded-3xl border-2 border-teal-accent bg-[#0A1A19]/40 p-5 md:p-7 shadow-[0_0_50px_rgba(45,212,191,0.05)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-accent px-4 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-lg shadow-teal-accent/20">
                Most Popular
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-bold text-teal-accent tracking-[2px] uppercase">PRO</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[44px] font-black text-white">${isAnnual ? '13' : '19'}</span>
                  <span className="text-[13px] text-[#888888]">/mo</span>
                </div>
                {isAnnual && <p className="text-[11px] text-teal-accent font-bold">Billed $156/year (Save $72)</p>}
                <p className="text-[13px] text-[#A0A0A0] mt-2">Everything in Free plus:</p>
              </div>

              <div className="space-y-4 mb-8">
                <ul className="space-y-3">
                  {[
                    "Profile Audit: 30 per month",
                    "Topic Generator: Unlimited",
                    "Post Writer: 60 per month",
                    "Smart Outreach: 500 messages per month (that is 25 per working day)",
                    "Voice Profile: up to 10 sample posts",
                    "Saved Library: up to 200 saves",
                    "Deep Strategy",
                    "Deep Mode",
                    "Full Smart Outreach suite",
                    "Priority AI responses",
                    "Early access to new features"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12px] text-white leading-snug">
                      <div className="w-4 h-4 rounded-full bg-teal-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-teal-accent" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => {
                  onUpgrade();
                  trackEvent('upgrade_button_clicked');
                }}
                className="mt-auto w-full py-4 bg-teal-accent text-black rounded-2xl text-[14px] font-black hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02] active:scale-100"
              >
                Get Pro Access
              </button>
            </div>

            {/* Max Card */}
            <div className="relative flex min-w-0 flex-1 flex-col rounded-3xl border border-amber-500/30 bg-amber-500/[0.03] p-5 md:p-7 hover:border-amber-500/50 transition-colors">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-4 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 text-white">
                For Power Users
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-bold text-amber-500 tracking-[2px] uppercase">MAX</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[44px] font-black text-white">${isAnnual ? '29' : '39'}</span>
                  <span className="text-[13px] text-[#888888]">/mo</span>
                </div>
                {isAnnual && <p className="text-[11px] text-amber-500 font-bold">Billed $348/year (Save $120)</p>}
                <p className="text-[13px] text-[#A0A0A0] mt-2">Everything in Pro plus:</p>
              </div>

              <div className="space-y-4 mb-8">
                <ul className="space-y-3">
                  {[
                    "Profile Audit: Unlimited",
                    "Topic Generator: Unlimited",
                    "Post Writer: Unlimited",
                    "Smart Outreach: 1000 messages per month (that is 50 per working day)",
                    "Voice Profile: up to 20 sample posts",
                    "Saved Library: Unlimited",
                    "Deep Strategy",
                    "Deep Mode",
                    "Full Smart Outreach suite",
                    "Priority AI fastest response times",
                    "Early access before Pro users",
                    "Direct founder access for feedback"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12px] text-white leading-snug">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-500" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => {
                  onUpgrade(); // For now same upgrade modal, but we can track the intent
                  trackEvent('max_upgrade_button_clicked');
                }}
                className="mt-auto w-full py-4 bg-gradient-to-r from-amber-400 to-orange-600 text-white rounded-2xl text-[14px] font-black hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all transform hover:scale-[1.02] active:scale-100"
              >
                Get Max Access
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-7 md:mt-12">
            <h3 className="text-lg font-bold text-white text-center mb-5 md:mb-7">Frequently asked questions</h3>
            <div className="panel-fluid mx-auto flex max-w-3xl flex-col gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="panel-fluid rounded-2xl border border-[#1f1f1f] bg-[#141414] px-4 py-3.5 transition-all hover:border-teal-accent/30 md:px-5 md:py-4"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="panel-fluid flex min-w-0 items-start justify-between gap-4 text-left"
                  >
                    <span className="wrap-safe block min-w-0 flex-1 text-[14px] font-bold leading-7 text-white md:text-[15px]">
                      {faq.q}
                    </span>
                    <Plus className={`h-4 w-4 shrink-0 text-teal-accent transition-transform duration-300 ${expandedFaq === i ? 'rotate-45' : ''}`} />
                  </button>
                  <div className={`min-w-0 overflow-hidden transition-all duration-300 ${expandedFaq === i ? 'mt-3 max-h-48' : 'max-h-0'}`}>
                    <p className="wrap-safe min-w-0 pr-6 text-[13px] leading-7 text-[#888888] md:text-[14px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Bar */}
          <div className="mt-9 grid grid-cols-1 gap-6 border-t border-white/5 pt-9 md:mt-12 md:grid-cols-3">
            {[
              { icon: Shield, title: "No Credit Card Required", sub: "Start completely free today" },
              { icon: Clock, title: "24 Hour Activation", sub: "Pro goes live within one business day" },
              { icon: Heart, title: "Cancel Anytime", sub: "Zero lock-in zero questions asked" }
            ].map((s, i) => (
              <div key={i} className="panel-fluid flex min-w-0 flex-col items-center text-center">
                <s.icon className="w-5 h-5 text-teal-accent mb-2" />
                <h4 className="text-[11px] md:text-[12px] font-bold text-white mb-1">{s.title}</h4>
                <p className="wrap-safe text-[11px] text-[#888888]">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-[#555555] italic">Made with ❤️ in India for professionals worldwide.</p>
          </div>
          
          {/* Sticky Fade Gradient */}
          <div className="sticky bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none -mx-4 md:-mx-7 -mb-4 md:-mb-7" />
        </div>
      </motion.div>
    </div>
  );
};

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  trackEvent: (name: string) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, user, trackEvent }) => {
  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    whatsapp: '',
    message: ''
  });
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.email) {
      setForm(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.length < 2) newErrors.name = 'Full name is required (min 2 characters)';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    
    const cleanPhone = form.whatsapp.replace(/\D/g, '');
    if (selectedCountry.code === '+91') {
      if (cleanPhone.length !== 10) newErrors.whatsapp = 'WhatsApp number must be exactly 10 digits';
    } else {
      if (cleanPhone.length < 7 || cleanPhone.length > 15) newErrors.whatsapp = 'Phone number must be between 7 and 15 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const fullNumber = `${selectedCountry.code} ${form.whatsapp.replace(/\D/g, '')}`;
      const { error: insertError } = await supabase
        .from('pro_requests')
        .insert([{
          name: form.name,
          email: form.email,
          whatsapp: fullNumber,
          message: form.message
        }]);

      if (insertError) throw insertError;

      setStatus('success');
      trackEvent('pro_request_submitted');
    } catch (err) {
      console.error(err);
      setStatus('error');
      trackEvent('pro_request_failed');
    }
  };

  if (status === 'success') {
    return (
      <div className="overlay-shell z-[110]">
        <div className="overlay-backdrop bg-black/85 backdrop-blur-md" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="dialog-panel border-teal-accent/20 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="dialog-icon bg-teal-accent/10"
          >
            <Check className="w-8 h-8 text-teal-accent" />
          </motion.div>
          <div className="dialog-header">
            <h3 className="dialog-title">We received your request</h3>
            <p className="dialog-copy dialog-section text-safe">
              Shantanu will personally activate your Somyra Pro account within 24 hours. You will receive a WhatsApp confirmation before any charge.
            </p>
          </div>
          <div className="inline-flex items-center px-4 py-1.5 bg-teal-accent/10 border border-teal-accent/20 rounded-full text-sm font-bold text-teal-accent mb-8">
            Access Request Confirmed
          </div>
          <button 
            onClick={onClose}
            className="dialog-button dialog-section mt-8 block border border-[#333333] text-[#888888] hover:text-white hover:border-white"
          >
            Close this window
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overlay-shell z-[110] p-0 md:p-6">
      <div className="overlay-backdrop bg-black/85 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative min-w-0 bg-[#0D0D0D] border border-white/10 md:border-teal-accent/20 md:rounded-[20px] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-[480px] p-4 md:p-7 overflow-y-auto custom-scrollbar shadow-2xl"
        style={{ maxHeight: window.innerWidth < 768 ? '100vh' : '90vh' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#141414] border border-[#1f1f1f] flex items-center justify-center text-[#888888] hover:text-white hover:border-teal-accent transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="dialog-header mb-6 pt-2 pr-10">
          <div className="w-10 h-10 bg-teal-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Crown className="w-5 h-5 text-teal-accent" />
          </div>
          <h2 className="dialog-title text-[22px]">Request Somyra Upgrade</h2>
          <p className="dialog-copy text-safe text-[13px]">
            We personally activate your account within 24 hours. No automated billing. You confirm before any charge.
          </p>
        </div>

        <div className="h-[1px] bg-white/5 w-full mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              type="text"
              required
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full bg-[#141414] border rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent focus:ring-4 focus:ring-teal-accent/10 ${
                errors.name ? 'border-red-400/50 ring-4 ring-red-400/10' : 'border-[#1f1f1f]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email"
                required
                readOnly={!!user}
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full bg-[#141414] border rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent focus:ring-4 focus:ring-teal-accent/10 ${
                  user ? 'opacity-70 cursor-not-allowed' : ''
                } ${errors.email ? 'border-red-400/50 ring-4 ring-red-400/10' : 'border-[#1f1f1f]'}`}
              />
              {user && <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555555]" />}
            </div>
            {errors.email && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-2 ml-1">WhatsApp or Phone Number</label>
            <PhoneInput 
              value={form.whatsapp}
              onChange={(val: string) => setForm(prev => ({ ...prev, whatsapp: val }))}
              onCountryChange={(country: any) => setSelectedCountry(country)}
              error={errors.whatsapp}
            />
            <p className="text-[11px] text-[#555555] mt-1.5 ml-1">We will contact you on this number to confirm your activation</p>
            {errors.whatsapp && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.whatsapp}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-2 ml-1">Message (Optional)</label>
            <textarea 
              rows={3}
              placeholder="Any specific requests or feedback for Somyra Pro?"
              value={form.message}
              onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-teal-accent focus:ring-4 focus:ring-teal-accent/10 resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 bg-teal-accent text-black font-bold rounded-xl text-[15px] hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending your request...
              </>
            ) : (
              `Send Access Request`
            )}
          </button>
        </form>

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 z-[120] flex w-[min(92vw,26rem)] min-w-0 -translate-x-1/2 items-start gap-4 rounded-xl border border-red-400/30 bg-[#1a1a1a] p-5 shadow-2xl"
          >
            <div className="min-w-0 flex-grow">
              <p className="mb-2 break-words text-sm leading-7 text-white">Something went wrong. Please DM us directly on LinkedIn.</p>
              <a 
                href="https://www.linkedin.com/in/sharmashantanu911" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-teal-accent hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" />
                DM Shantanu on LinkedIn
              </a>
            </div>
            <button onClick={() => setStatus('idle')} className="p-1 text-[#555555] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPricing: () => void;
  onAuth: () => void;
  user: any;
  isPro?: boolean;
  triggerFeature?: string | null;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose, onPricing, onAuth, user, isPro, triggerFeature }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (isOpen && user) {
      const updateTimer = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setUTCHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ hours, minutes });
      };
      updateTimer();
      const interval = setInterval(updateTimer, 60000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="overlay-shell z-[120]">
      <div className="overlay-backdrop bg-black/85 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="dialog-panel border-teal-accent/20 text-center overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-accent/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Bolt className="w-8 h-8 text-teal-accent" />
          <div className="absolute inset-0 bg-teal-accent/20 rounded-full animate-ping opacity-20" />
        </div>

        {!user ? (
          <>
            <div className="dialog-header">
              <div className="inline-flex items-center px-3 py-1 bg-teal-accent/10 border border-teal-accent/20 rounded-full text-[10px] font-bold text-teal-accent uppercase tracking-wider mb-4">
                Free forever
              </div>
              <h3 className="dialog-title">You have used your 5 free generations</h3>
              <p className="dialog-copy dialog-section text-safe">
                Sign up free to get 20 generations per month, unlock your Voice Profile, and start building your content library.
              </p>
            </div>

            <div className="dialog-section mt-8 flex flex-col gap-3">
              <button 
                onClick={onAuth}
                className="w-full py-3.5 bg-teal-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02] active:scale-100"
              >
                Sign Up Free
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 text-[#555555] font-bold rounded-xl hover:text-white transition-all"
              >
                Maybe Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="dialog-header">
              <h3 className="dialog-title">
                {triggerFeature === 'profile_audit' ? `You have used all ${isPro ? 30 : 5} Profile Audits` :
                 triggerFeature === 'post_writer' ? `You have used all ${isPro ? 60 : 10} Post Writers` :
                 triggerFeature === 'smart_outreach' ? `You have used all ${isPro ? 500 : 10} Smart Outreach messages` :
                 triggerFeature === 'topic_generator' ? `You have used all 30 Topic Generators` :
                 'You have reached your limit'}
              </h3>
              <p className="dialog-copy dialog-section text-safe">
                {isPro && triggerFeature === 'profile_audit' ? 'Upgrade to Max for unlimited Profile Audits.' :
                 isPro && triggerFeature === 'post_writer' ? 'Upgrade to Max for unlimited Post Writers.' :
                 isPro && triggerFeature === 'smart_outreach' ? 'Upgrade to Max for 1000 Smart Outreach messages per month.' :
                 triggerFeature === 'profile_audit' ? 'Upgrade to Pro for 30 per month and Deep Mode access.' :
                 triggerFeature === 'post_writer' ? 'Upgrade to Pro for 60 per month and Deep Mode access.' :
                 triggerFeature === 'smart_outreach' ? 'Upgrade to Pro for 500 per month and Deep Mode access.' :
                 triggerFeature === 'topic_generator' ? 'Upgrade to Pro for unlimited Topic Generators.' :
                 isPro ? 'Upgrade to Max for unlimited usage and elite features.' : 'Upgrade to Pro for higher limits and Deep Mode access.'}
              </p>
            </div>

            <div className="dialog-section mt-6 bg-[#141414] border border-[#1f1f1f] rounded-xl p-4">
              <div className="text-[10px] text-[#555555] uppercase tracking-widest mb-1">Resets in</div>
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <span>{timeLeft.hours}h</span>
                <span className="text-[#333333]">:</span>
                <span>{timeLeft.minutes}m</span>
              </div>
            </div>
            
            <div className="dialog-section mt-8 flex flex-col gap-3">
              <button 
                onClick={onPricing}
                className="w-full py-3.5 bg-teal-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02] active:scale-100"
              >
                Upgrade to Pro
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 text-[#555555] font-bold rounded-xl hover:text-white transition-all"
              >
                Check back tomorrow
              </button>
            </div>
          </>
        )}

        <div className="dialog-section mt-8 border-t border-white/5 pt-6">
          <p className="text-[11px] text-[#555555] italic">
            Profile Analysis is always free and unlimited
          </p>
        </div>
      </motion.div>
    </div>
  );
};
