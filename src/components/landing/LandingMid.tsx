/**
 * Mid-fold sections of the landing page.
 * Loaded as a separate chunk for code splitting.
 * Wraps the Social Proof, Six Tools (Features), How It Works, and Comparison sections.
 */
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, UserCircle, MessageSquare, Check, X, AlertTriangle, Play } from 'lucide-react';
import { useAnimationInView } from '../../hooks/useAnimationInView';
import { featureTabs, type FeatureTabData } from './shared';

export interface LandingMidProps {
  activeFeatureTab: string;
  setActiveFeatureTab: (id: string) => void;
  onSignupClick: () => void;
}

export const LandingMid: React.FC<LandingMidProps> = ({
  activeFeatureTab,
  setActiveFeatureTab,
  onSignupClick,
}) => {
  const activeFeature: FeatureTabData = featureTabs.find(f => f.id === activeFeatureTab) || featureTabs[0];

  return (
    <>
      {/* ── WHAT YOU GET (Value props) ── */}
      <section className="w-full px-4 pt-5 md:pt-10 ds:pt-[60px] pb-[60px] md:pb-[70px] ds:pb-[100px] relative z-10">
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-6 sm:mb-8 ds:mb-10">
            <span className="type-overline text-[#2DD4BF]">
              WHAT YOU GET
            </span>
          </div>
          <h2 className="text-[28px] ds:text-[40px] font-semibold text-white leading-[1.2] ds:leading-[1.15] tracking-tight text-center mb-5 sm:mb-6">
            Go from invisible to someone people<br />
            actually notice on LinkedIn.
          </h2>
          <p className="text-[#888] text-base leading-[1.6] text-center mx-auto mb-8 sm:mb-10 ds:mb-12" style={{ maxWidth: '440px' }}>
            Three ways Somyra turns your LinkedIn into your biggest advantage.
          </p>
          <div className="grid grid-cols-1 ds:grid-cols-3 gap-3 md:gap-5 ds:gap-6 max-w-[480px] ds:max-w-none mx-auto ds:mx-0">
            {[
              { icon: FileText, title: 'Write posts that sound like you', body: 'Pick a topic, choose your style, and get a post that sounds like you wrote it on your best day.' },
              { icon: UserCircle, title: 'Fix your profile to attract opportunity', body: 'Somyra audits every line of your profile and rewrites it so the right people reach out to you.' },
              { icon: MessageSquare, title: 'Send DMs that get real replies', body: 'Somyra writes personalized outreach that references each prospect and speaks to what actually matters to them.' }
            ].map((card, i) => (
              <div
                key={i}
                ref={useAnimationInView()}
                data-animate="fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                className="bg-[#0D0D0D] border border-white/[0.06] hover:border-[#2DD4BF]/20 rounded-[16px] p-5 md:p-7 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.05)]"
              >
                <div className="w-9 h-9 ds:w-10 ds:h-10 rounded-[10px] flex items-center justify-center mb-4 shrink-0" style={{ backgroundColor: 'rgba(45,212,191,0.08)' }}>
                  <card.icon className="w-[18px] h-[18px] ds:w-5 ds:h-5 text-[#2DD4BF]" />
                </div>
                <h3 className="font-semibold text-[17px] text-white mb-2 leading-snug">{card.title}</h3>
                <p className="text-[#888] text-[14px] leading-[1.7] flex-grow">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES (Six Tools) ── */}
      <section
        id="features"
        ref={useAnimationInView()}
        data-animate="fade-in-up"
        className="w-full px-4 py-8 md:py-[60px] ds:py-[80px] relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-5 sm:mb-6">
            <span className="text-[#2DD4BF] uppercase type-overline">EVERYTHING YOU NEED</span>
          </div>
          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-8 sm:mb-10 ds:mb-12">
            Six tools that all write<br />
            in your voice.
          </h2>
          <div className="flex flex-col gap-6 ds:grid ds:grid-cols-[1fr_2fr] ds:gap-8 ds:items-center">
            <div className="hidden ds:flex ds:flex-col gap-1">
              {featureTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`flex items-start gap-3 w-full text-left rounded-[10px] transition-all duration-200 border-l-2 ${
                    activeFeatureTab === tab.id
                      ? 'bg-[#141414] border-l-[#2DD4BF] text-white shadow-[0_0_20px_rgba(45,212,191,0.06)]'
                      : 'bg-transparent border-l-transparent text-[#999] hover:bg-[#0D0D0D] hover:text-[#999]'
                  } ${activeFeatureTab === tab.id ? 'border border-[rgba(45,212,191,0.2)]' : 'border border-transparent'} px-5 py-[14px]`}
                >
                  <tab.icon className={`w-4 h-4 shrink-0 mt-0.5 ${activeFeatureTab === tab.id ? 'text-[#2DD4BF]' : 'text-[#444]'}`} />
                  <div className="min-w-0">
                    <span className="block text-[14px] font-medium leading-tight">{tab.label}</span>
                    <span className={`block text-[12px] leading-tight mt-0.5 ${activeFeatureTab === tab.id ? 'text-[#999]' : 'text-[#888]'}`}>
                      {tab.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex ds:hidden overflow-x-auto gap-2 snap-x no-scrollbar pb-2 -mx-4 px-4">
              {featureTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`shrink-0 snap-start rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeFeatureTab === tab.id
                      ? 'bg-[#141414] border border-[#2DD4BF] text-white'
                      : 'bg-[#141414] border border-white/[0.08] text-[#999]'
                  } px-3.5 py-2 md:px-4 md:py-2 text-[12px] md:text-[13px] font-medium`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div
              className="bg-[#0D0D0D] rounded-[16px] p-5 sm:p-8 md:p-9"
              style={{ border: '1px solid rgba(255,255,255,0.06)', borderTop: '2px solid #2DD4BF' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'ease' }}
                >
                  <span className="text-[#2DD4BF] uppercase type-overline mb-3 block">{activeFeature.tag}</span>
                  <h3 className="font-semibold text-[18px] md:text-2xl text-white mb-4 leading-tight">{activeFeature.title}</h3>
                  <p className="text-[#A0A0A0] text-[14px] md:text-[15px] leading-[1.7] mb-6 max-w-full">{activeFeature.body}</p>
                  <div className="space-y-3">
                    {activeFeature.dots.map((dot, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#2DD4BF] mt-0.5 shrink-0" />
                        <span className="text-[13px] md:text-[15px] text-[#ccc] leading-[1.7]">{dot}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative px-4 sm:px-6 py-8 md:py-[60px] ds:py-[80px] overflow-hidden">
        <div id="process" className="absolute -top-24" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-accent/[0.07] blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="max-w-[1060px] mx-auto relative z-10">
          <div className="text-center mb-5">
            <span className="text-[#2DD4BF] uppercase type-overline">THE PROCESS</span>
          </div>
          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-4 sm:mb-5">
            From signup to your first post.<br />
            Takes less than five minutes.
          </h2>
          <p className="text-[#888] text-base leading-[1.6] text-center mx-auto mb-8 sm:mb-10 ds:mb-12" style={{ maxWidth: '420px' }}>
            No learning curve, no setup headache. Three steps and you are posting.
          </p>
          <div className="relative z-0">
            <div className="absolute top-[18px] left-0 right-0 h-0 border-t border-dashed border-[rgba(45,212,191,0.2)] pointer-events-none -z-10 hidden ds:block" />
            <div className="grid grid-cols-1 ds:grid-cols-3 gap-3 ds:gap-6 max-w-[480px] ds:max-w-none mx-auto ds:mx-0">
              {[
                { num: '01', title: 'Paste your LinkedIn profile', body: 'Drop your profile URL. Somyra reads your About, Experience, and recent posts to understand exactly who you are.' },
                { num: '02', title: 'Teach Somyra your voice', body: 'Add three of your best posts. Somyra learns your structure, your words, and what makes your writing yours.' },
                { num: '03', title: 'Generate content that wins', body: 'Posts, DMs, profile rewrites, topic ideas. Everything sounding like you wrote it on your best day.' }
              ].map((step, i) => (
                <div
                  key={i}
                  ref={useAnimationInView()}
                  data-animate="fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  className="bg-[#0D0D0D] border border-white/[0.06] hover:border-[#2DD4BF]/15 rounded-[16px] p-5 md:p-7 flex flex-col transition-all duration-300 hover:shadow-[0_0_24px_rgba(45,212,191,0.05)]"
                >
                  <div className="w-8 h-8 ds:w-9 ds:h-9 rounded-full flex items-center justify-center text-[12px] ds:text-[13px] font-semibold text-[#2DD4BF] mb-4 ds:mb-5 shrink-0" style={{ backgroundColor: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)' }}>
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-[17px] text-white leading-snug mb-2">{step.title}</h3>
                  <p className="text-[#888] text-[14px] leading-[1.7] flex-grow">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div
            ref={useAnimationInView()}
            data-animate="fade-in-up"
            className="max-w-[860px] mx-auto mt-10 sm:mt-16"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', background: '#0D0D0D' }}
          >
            <div className="h-9 bg-[#141414] flex items-center gap-2 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[12px] text-[#888] flex-1 text-center">app.somyra.ai</span>
            </div>
            <div className="relative h-[200px] md:h-[380px] bg-[#080808] flex flex-col items-center justify-center gap-3 md:gap-4 overflow-hidden" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              <div className="w-[52px] md:w-16 h-[52px] md:h-16 rounded-full flex items-center justify-center animate-[pulse-play_2s_ease-in-out_infinite] cursor-pointer" style={{ backgroundColor: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)' }}>
                <Play className="w-5 h-5 md:w-6 md:h-6 text-[#2DD4BF] ml-0.5" />
              </div>
              <div className="text-center">
                <p className="text-white text-[14px] md:text-base font-medium">Full product walkthrough</p>
                <p className="type-overline text-[#2DD4BF] mt-1">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="w-full px-4 py-8 md:py-[60px] ds:py-[80px] bg-[#0D0D0D] relative z-10 border-t border-white/5">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-6 sm:mb-8 ds:mb-10">
            <span className="text-[#2DD4BF] uppercase type-overline">WHY SOMYRA</span>
          </div>
          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-4 sm:mb-5">
            Other tools cost more and<br />
            none of them write like you.
          </h2>
          <p className="text-[#888] text-base leading-[1.6] text-center mx-auto mb-8 sm:mb-10 ds:mb-12" style={{ maxWidth: '380px' }}>
            We did the research so you do not have to.
          </p>
          <div
            ref={useAnimationInView()}
            data-animate="fade-in-up"
            className="w-full max-w-4xl mx-auto text-center mb-4"
          >
            <div className="min-w-[580px]">
              <div className="bg-[#0D0D0D] rounded-[16px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] bg-[#141414] text-[13px] font-semibold" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="p-[16px_20px] text-white">Features</div>
                  <div className="p-[16px_20px] text-center relative" style={{ background: 'rgba(45,212,191,0.06)', borderLeft: '1px solid rgba(45,212,191,0.15)', borderRight: '1px solid rgba(45,212,191,0.15)' }}>
                    <span className="px-[10px] py-[3px] rounded-full bg-[#2DD4BF] text-[#080808] type-overline mb-1.5 inline-block">BEST VALUE</span>
                    <div className="text-white">Somyra</div>
                    <span className="block text-[12px] text-[#2DD4BF] font-semibold">From $19/mo</span>
                  </div>
                  {[
                    { name: 'Taplio', price: '$69/mo' },
                    { name: 'Supergrow', price: '$19/mo' },
                    { name: 'MagicPost', price: '$27/mo' }
                  ].map((comp, idx) => (
                    <div key={idx} className="p-[16px_20px] text-center">
                      <div className="text-white">{comp.name}</div>
                      <span className="block text-[12px] text-[#999] font-normal">{comp.price}</span>
                    </div>
                  ))}
                </div>
                {[
                  { feature: 'Writes in your exact voice', somyra: true, others: [false, 'Limited', 'Basic AI'] },
                  { feature: 'Profile audit with rewrite', somyra: true, others: [false, false, false] },
                  { feature: 'Smart outreach with CRM', somyra: true, others: ['$199/mo', false, false] },
                  { feature: 'Voice learning from your posts', somyra: true, others: ['Basic', 'Basic', 'Basic'] },
                  { feature: 'Unlimited topic ideas', somyra: true, others: ['Limited', true, true] },
                  { feature: 'Account safe, no automation', somyra: true, others: ['At risk', true, true] },
                  { feature: 'Follow up sequences', somyra: true, others: ['Basic', false, false] },
                  { feature: 'ICP targeting tool', somyra: true, others: [false, false, false] },
                  { feature: 'Full AI included at base price', somyra: true, others: ['$69/mo', 'Limited', 'Basic'] },
                  { feature: 'Built specifically for LinkedIn', somyra: true, others: [false, false, false] }
                ].map((row, i) => {
                  const renderCell = (val: any, isSomyra: boolean) => {
                    if (val === true) {
                      return <div className="w-[22px] h-[22px] rounded-full bg-[#2DD4BF]/[0.15] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-[#2DD4BF]" /></div>;
                    }
                    if (val === false) {
                      return <div className="w-[22px] h-[22px] rounded-full bg-red-500/[0.1] flex items-center justify-center"><X className="w-3 h-3 text-[#EF4444]" /></div>;
                    }
                    if (val === 'At risk') {
                      return <div className="w-[22px] h-[22px] rounded-full bg-red-500/[0.1] flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-[#EF4444]" /></div>;
                    }
                    if (typeof val === 'string' && val.startsWith('$')) {
                      return <span className="text-[13px] font-medium leading-snug text-[#999]">{val}</span>;
                    }
                    return <span className="text-[13px] text-[#999] leading-snug">{val}</span>;
                  };
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center min-h-[52px]"
                      style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : '#0D0D0D', borderBottom: i < 10 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="p-[16px_20px] text-[14px] text-[#ccc] font-normal">{row.feature}</div>
                      <div className="p-[16px_20px] flex flex-col items-center justify-center" style={{ background: 'rgba(45,212,191,0.03)', borderLeft: '1px solid rgba(45,212,191,0.15)', borderRight: '1px solid rgba(45,212,191,0.15)' }}>
                        {renderCell(row.somyra, true)}
                      </div>
                      {row.others.map((val, ci) => (
                        <div key={ci} className="p-[16px_20px] flex flex-col items-center justify-center">
                          {renderCell(val, false)}
                        </div>
                      ))}
                    </div>
                  );
                })}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center min-h-[52px] bg-[#141414]">
                  <div className="p-[16px_20px] text-[14px] font-semibold text-white">Starting price</div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center" style={{ background: 'rgba(45,212,191,0.03)', borderLeft: '1px solid rgba(45,212,191,0.15)', borderRight: '1px solid rgba(45,212,191,0.15)' }}>
                    <span className="text-[15px] font-bold text-[#2DD4BF]">$19/mo</span>
                  </div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center"><span className="text-[13px] text-[#999]">$69/mo</span></div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center"><span className="text-[13px] text-[#999]">$19/mo</span></div>
                  <div className="p-[16px_20px] flex flex-col items-center justify-center"><span className="text-[13px] text-[#999]">$27/mo</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right mt-2 ds:hidden">
            <span className="text-[12px] text-[#888]">Scroll to compare &rarr;</span>
          </div>
          <p className="mt-4 text-[11px] text-[#888] font-medium italic px-4">
            *AI features require $69/mo plan on Taplio.
          </p>
          <div className="mt-10 sm:mt-16 text-center">
            <div className="text-center mb-5">
              <span className="text-[#2DD4BF] uppercase type-overline">THE BOTTOM LINE</span>
            </div>
            <h3 className="font-semibold text-[24px] ds:text-[32px] text-white mb-5 leading-tight">
              More features. Lower price.<br />No risk to your account.
            </h3>
            <button
              onClick={onSignupClick}
              className="px-9 py-[14px] bg-[#2DD4BF] text-black font-bold rounded-xl text-base hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02] w-full sm:w-auto"
            >
              Start for Free
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
