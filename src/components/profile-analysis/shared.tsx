import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus, Search, X, type LucideIcon } from 'lucide-react';

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  rows?: number;
}

export const FloatingLabelInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  rows = 1
}: FloatingLabelInputProps) => {
  return (
    <div className="w-full space-y-3">
      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#888888] block ml-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-[#0D0D0D] border border-white/5 rounded-2xl px-8 py-6 text-base text-white outline-none transition-all duration-300 placeholder:text-[#444444] focus:border-teal-accent/40 focus:ring-4 focus:ring-teal-accent/5 resize-none leading-relaxed min-h-[180px] md:min-h-[220px] hover:border-[#333333] shadow-inner custom-scrollbar"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-[#0D0D0D] border border-white/5 rounded-2xl px-8 py-6 text-base text-white outline-none transition-all duration-300 placeholder:text-[#444444] focus:border-teal-accent/40 focus:ring-4 focus:ring-teal-accent/5 h-16 md:h-20 hover:border-[#333333] shadow-inner"
        />
      )}
    </div>
  );
};

interface SegmentedControlOption {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  active: string;
  onChange: (id: string) => void;
}

export const SegmentedControl = ({ options, active, onChange }: SegmentedControlProps) => {
  return (
    <div className="bg-[#0D0D0D] border border-[#1f1f1f] rounded-full p-1 flex flex-wrap sm:inline-flex w-full sm:w-auto gap-1 sm:gap-0">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 min-h-[40px] ${
            active === opt.id ? 'bg-teal-accent text-black font-bold' : 'text-[#888888] hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

interface GoalCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export const GoalCard = ({ icon: Icon, title, description, selected, onClick }: GoalCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 min-h-[72px] ${
        selected ? 'bg-teal-accent/5 border-teal-accent' : 'bg-[#141414] border-[#1f1f1f] hover:border-teal-accent/30'
      }`}
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 ${
          selected
            ? 'bg-teal-accent/15 border-teal-accent/20 text-teal-accent'
            : 'bg-[#1a1a1a] border-[#222222] text-[#888888] group-hover:text-[#CCCCCC]'
        }`}
      >
        <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
        <p className="text-[11px] sm:text-xs text-[#888888] mt-1 leading-relaxed">{description}</p>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-accent rounded-full flex items-center justify-center shadow-lg z-10"
          >
            <Check className="w-3 h-3 text-black font-bold" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const LoadingScanner = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = [
    'Mapping Semantic Gaps...',
    'Analyzing Narrative Authority...',
    'Simulating Recruiter Perspective...',
    'Identifying Authority Signals...',
    'Optimizing Conversion Points...',
    'Refining Brand Voice...',
    'Calibrating Value Propositions...',
    'Detecting Strategic Weaknesses...',
    'Synthesizing Growth Roadmap...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [statuses.length]);

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
      <div className="relative h-80 w-64 overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#141414] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 p-6 space-y-4 opacity-20 blur-sm">
          <div className="w-16 h-16 bg-white/20 rounded-full" />
          <div className="w-full h-4 bg-white/20 rounded-full" />
          <div className="w-3/4 h-4 bg-white/20 rounded-full" />
          <div className="space-y-2 pt-4">
            <div className="w-full h-2 bg-white/10 rounded-full" />
            <div className="w-full h-2 bg-white/10 rounded-full" />
            <div className="w-full h-2 bg-white/10 rounded-full" />
          </div>
        </div>

        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-teal-accent shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-teal-accent/5 via-transparent to-teal-accent/5 pointer-events-none" />
      </div>

      <div className="mt-8 w-full max-w-[560px] text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-balance text-teal-accent font-mono text-sm font-bold uppercase tracking-[0.28em] sm:text-[15px]"
          >
            {statuses[statusIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="mx-auto mt-4 max-w-[460px] text-sm leading-7 text-[#6b6b6b] sm:text-[15px]">
          We&apos;re reviewing your positioning, authority signals, and clarity so the final report feels sharp and usable.
        </p>
      </div>
    </div>
  );
};

interface SmartSelectorProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onAddCustom?: (value: string) => void;
  allowMultiple?: boolean;
  optional?: boolean;
}

export const SmartSelector = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  onAddCustom,
  allowMultiple = false,
  optional = false
}: SmartSelectorProps) => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused]);

  const handleSelect = (opt: string) => {
    if (allowMultiple) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(opt)) {
        onChange(current.filter((item) => item !== opt));
      } else {
        onChange([...current, opt]);
      }
    } else {
      onChange(opt);
      setSearch('');
      setIsFocused(false);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    onAddCustom?.(trimmed);
    if (!onAddCustom) {
      handleSelect(trimmed);
    }
    setCustomValue('');
    setIsAddingCustom(false);
    setIsFocused(false);
  };

  return (
    <div className="space-y-3 relative" ref={selectorRef}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888] ml-1">
          {label} {optional && <span className="text-[9px] opacity-60 ml-1">(OPTIONAL)</span>}
        </label>
      </div>

      <div className="relative group">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors z-10 ${
            isFocused ? 'text-teal-accent' : 'text-[#555555]'
          }`}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-[12px] pl-11 pr-4 py-3 text-[14px] text-white outline-none transition-all focus:border-teal-accent/40 focus:ring-4 focus:ring-teal-accent/5 group-hover:border-[#333333]"
        />
        {Array.isArray(value) && value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {value.map((item) => (
              <span key={item} className="tag-standard tag-teal flex items-center gap-1.5">
                {item}
                <button type="button" onClick={() => onChange(value.filter((entry) => entry !== item))} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {!allowMultiple && value && !Array.isArray(value) && !search && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[14px] text-teal-accent font-bold">{value}</span>
            <button type="button" onClick={() => onChange('')} className="text-[#888888] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-[#141414] border border-[#1f1f1f] rounded-[12px] shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          >
            {search && !filteredOptions.includes(search) && (
              <button
                type="button"
                onClick={() => handleSelect(search)}
                className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-teal-accent bg-teal-accent/5 border-b border-[#1f1f1f] hover:bg-teal-accent/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Use &quot;{search}&quot;
              </button>
            )}
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-3 text-[13px] transition-colors hover:bg-[#1a1a1a] ${
                  (allowMultiple ? Array.isArray(value) && value.includes(opt) : value === opt)
                    ? 'text-teal-accent bg-teal-accent/5'
                    : 'text-[#CCCCCC]'
                }`}
              >
                {opt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsAddingCustom(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-[#888888] hover:bg-[#1a1a1a] transition-colors border-t border-[#1f1f1f]"
            >
              <Plus className="w-4 h-4" />
              Add your own...
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isAddingCustom && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Type and press Enter..."
              className="flex-1 bg-[#0D0D0D] border border-teal-accent/30 rounded-[12px] px-4 py-2 text-[13px] text-white outline-none focus:ring-4 focus:ring-teal-accent/5"
            />
            <button type="button" onClick={handleAddCustom} className="p-2 bg-teal-accent text-black rounded-[12px] hover:bg-teal-accent/80 transition-colors">
              <Check className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setIsAddingCustom(false)} className="p-2 bg-[#1a1a1a] text-[#888888] rounded-[12px] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
