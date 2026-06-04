/**
 * Below-fold sections of the landing page.
 * Loaded as a separate chunk for code splitting.
 * Wraps Pricing, Testimonials, FAQ, Get In Touch, Final CTA, and Footer.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Mail, ArrowRight, Zap, Lock, Infinity } from 'lucide-react';
import { useAnimationInView } from '../../hooks/useAnimationInView';
import SomyraFooter from '../SomyraFooter';
import { SectionLabel, SectionHeading, ReviewCard, FaqItem, PricingCard, faqData, hardcodedReviewsRow1, hardcodedReviewsRow2 } from './shared';

export interface LandingBelowProps {
  isAnnual: boolean;
  setIsAnnual: (b: boolean) => void;
  openFaqIndex: number | null;
  setOpenFaqIndex: (n: number | null) => void;
  testimonials: any[];
  loadingTestimonials: boolean;
  showReviewModal: boolean;
  setShowReviewModal: (b: boolean) => void;
  user: any;
  isGenerating: boolean;
  setIsGenerating: (b: boolean) => void;
  showResult: boolean;
  setShowResult: (b: boolean) => void;
  onSignupClick: () => void;
  onShowPricingModal: () => void;
}

export const LandingBelow: React.FC<LandingBelowProps> = ({
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
  onSignupClick,
  onShowPricingModal,
}) => {
  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <>
      {/* ── PRICING ── */}
      <section
        id="pricing-section"
        ref={useAnimationInView()}
        data-animate="fade-in-up"
        className="w-full px-4 sm:px-6 py-8 md:py-20 ds:py-24 relative z-10 border-t border-white/5"
      >
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <SectionLabel>PRICING</SectionLabel>
            <SectionHeading className="mb-6 sm:mb-8">
              Start free forever.<br />
              Upgrade when you need<br />
              more firepower.
            </SectionHeading>
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 sm:gap-3 bg-[#141414] border border-[#1f1f1f] rounded-full p-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full type-caption font-semibold transition-all whitespace-nowrap ${
                    !isAnnual ? 'bg-white/10 text-white shadow-xl' : 'text-[#888] hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full type-caption font-semibold transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    isAnnual ? 'bg-teal-accent/10 text-teal-accent border border-teal-accent/20' : 'text-[#888] hover:text-white'
                  }`}
                >
                  Annual
                </button>
                {isAnnual && (
                  <span className="type-overline text-teal-accent font-semibold mr-1 sm:mr-2 animate-pulse whitespace-nowrap">Save up to 35%</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 ds:grid-cols-3 gap-4 ds:gap-6 items-start max-w-[420px] mx-auto ds:max-w-none ds:mx-0">
            <PricingCard
              name="Free"
              monthlyPrice="$0"
              annualPrice="$0"
              annualBilling=""
              savings=""
              subtext="Forever free. No card needed."
              features={[
                'Profile Audit: 5 per month',
                'Topic Generator: 30 topics per month',
                'Post Writer: 10 per month',
                'Smart Outreach: 10 messages per month',
                'Voice Profile: up to 5 sample posts',
                'Saved Library: up to 10 saves'
              ]}
              excluded={[
                'Deep Strategy',
                'Deep Mode',
                'Unlimited Topic Generator',
                'Priority AI responses',
                'Early access to new features',
                'Direct founder access'
              ]}
              buttonLabel="Start for Free"
              buttonStyle="bg-white/5 text-white hover:bg-white/10"
              cardStyle=""
              isAnnual={isAnnual}
              onClick={onSignupClick}
            />
            <PricingCard
              name="Pro"
              monthlyPrice="$19"
              annualPrice="$13"
              annualBilling="Billed $156/year"
              savings="Save $72 per year"
              subtext="Everything in Free plus:"
              badge="Most Popular"
              features={[
                'Profile Audit: 30 per month',
                'Topic Generator: Unlimited',
                'Post Writer: 60 per month',
                'Smart Outreach: 500 messages per month (that is 25 per working day)',
                'Voice Profile: up to 10 sample posts',
                'Saved Library: up to 200 saves',
                'Deep Strategy',
                'Deep Mode',
                'Full Smart Outreach suite',
                'Priority AI responses',
                'Early access to new features'
              ]}
              buttonLabel="Get Pro"
              buttonStyle=""
              cardStyle=""
              isAnnual={isAnnual}
              onClick={onShowPricingModal}
            />
            <PricingCard
              name="Max"
              monthlyPrice="$39"
              annualPrice="$29"
              annualBilling="Billed $348/year"
              savings="Save $120 per year"
              subtext="Everything in Pro plus:"
              badge="For Power Users"
              features={[
                'Profile Audit: Unlimited',
                'Topic Generator: Unlimited',
                'Post Writer: Unlimited',
                'Smart Outreach: 1000 messages per month (that is 50 per working day)',
                'Voice Profile: up to 20 sample posts',
                'Saved Library: Unlimited',
                'Deep Strategy',
                'Deep Mode',
                'Full Smart Outreach suite',
                'Priority AI fastest response times',
                'Early access before Pro users',
                'Direct founder access for feedback'
              ]}
              buttonLabel="Get Max Access"
              buttonStyle=""
              cardStyle=""
              isAnnual={isAnnual}
              onClick={onShowPricingModal}
            />
          </div>
          <p className="text-center text-[#999] text-sm md:text-base mt-10 max-w-[672px] mx-auto leading-relaxed">
            Every plan comes with Post Writer, Profile Analysis, Topic Generator, Smart Outreach, and LinkedIn Preview. Move up or down anytime.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        ref={useAnimationInView()}
        data-animate="fade-in-up"
        className="w-full py-8 md:py-16 ds:py-24 relative overflow-hidden border-y border-white/5 bg-[#080808]"
      >
        <style>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-container {
            display: flex;
            width: fit-content;
            will-change: transform;
          }
          .marquee-row-left {
            animation: scrollLeft 35s linear infinite;
          }
          .marquee-row-right {
            animation: scrollRight 35s linear infinite;
          }
          @media (max-width: 768px) {
            .marquee-row-left, .marquee-row-right {
              animation-duration: 28s;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-row-left, .marquee-row-right {
              animation-play-state: paused;
            }
          }
          .marquee-row-left:hover, .marquee-row-right:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="max-w-[896px] mx-auto px-5 sm:px-6 text-center mb-10 sm:mb-12 md:mb-16">
          <SectionLabel>REAL RESULTS</SectionLabel>
          <SectionHeading>
            What happens when your<br />
            LinkedIn finally works
          </SectionHeading>
        </div>
        <div className="relative w-full space-y-6 md:space-y-8">
          <div className="absolute inset-y-0 left-0 w-[100px] md:w-[200px] bg-gradient-to-r from-[#080808] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[100px] md:w-[200px] bg-gradient-to-l from-[#080808] to-transparent z-20 pointer-events-none" />
          <div className="flex overflow-hidden">
            <div className="marquee-container marquee-row-left gap-4 md:gap-5 px-4">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {(testimonials?.length > 0 ?
                    testimonials
                      .filter((t: any) => {
                        const name = (t.user_name || '').trim();
                        const text = (t.content || '').trim();
                        const rating = Number(t.rating) || 0;
                        return name !== 'Anonymous' && name.length > 2 && text.length > 20 && rating > 0;
                      })
                      .map((t: any) => ({
                        name: t.user_name,
                        title: t.user_title || 'LinkedIn User',
                        text: t.content,
                        badge: t.badge_text || 'VERIFIED USER'
                      })).concat(hardcodedReviewsRow1) :
                    hardcodedReviewsRow1
                  ).slice(0, 5).map((review: any, idx: number) => (
                    <ReviewCard key={idx} review={review} idx={idx} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex overflow-hidden">
            <div className="marquee-container marquee-row-right gap-4 md:gap-5 px-4">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {(testimonials?.length > 5 ?
                    testimonials
                      .filter((t: any) => {
                        const name = (t.user_name || '').trim();
                        const text = (t.content || '').trim();
                        const rating = Number(t.rating) || 0;
                        return name !== 'Anonymous' && name.length > 2 && text.length > 20 && rating > 0;
                      })
                      .slice(5).map((t: any) => ({
                        name: t.user_name,
                        title: t.user_title || 'LinkedIn User',
                        text: t.content,
                        badge: t.badge_text || 'VERIFIED USER'
                      })).concat(hardcodedReviewsRow2) :
                    hardcodedReviewsRow2
                  ).slice(0, 5).map((review: any, idx: number) => (
                    <ReviewCard key={idx} review={review} idx={idx} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-12 md:mt-16 px-5 sm:px-0">
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 text-sm font-bold text-white hover:border-[#2DD4BF]/30 hover:text-[#2DD4BF] transition-all bg-white/5 active:scale-95"
          >
            Leave a Review
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq-section"
        className="w-full px-4 sm:px-6 py-8 md:py-[60px] ds:py-[80px] relative z-10 border-t border-white/5"
      >
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-5 sm:mb-6 ds:mb-8">
            <span className="text-[#2DD4BF] uppercase type-overline">QUESTIONS</span>
          </div>
          <h2 className="font-semibold text-[30px] ds:text-[42px] text-white leading-[1.15] tracking-tight text-center mb-8 sm:mb-10 ds:mb-12">
            Stuff people ask<br />
            before signing up.
          </h2>
          <div className="grid grid-cols-1 ds:grid-cols-2 gap-4">
            {faqData.map((item, i) => {
              const colIndex = i % 2;
              const rowIndex = Math.floor(i / 2);
              const delay = rowIndex * 80 + colIndex * 40;
              return (
                <div
                  key={i}
                  ref={useAnimationInView()}
                  data-animate="fade-in-up"
                  style={{ animationDelay: `${delay / 1000}s` }}
                >
                  <FaqItem
                    q={item.q}
                    a={item.a}
                    isOpen={openFaqIndex === i}
                    onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  />
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <p className="text-[13px] sm:text-[14px] text-[#999] mb-1">Still have questions?</p>
            <Link
              to="/contact"
              className="text-[#2DD4BF] text-[13px] sm:text-[14px] font-medium hover:underline transition-all"
            >
              Talk to us &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH ── */}
      <section className="w-full px-4 sm:px-8 py-12 md:py-24 relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2DD4BF]/3 blur-[120px]" />
        </div>
        <div className="max-w-[480px] mx-auto relative">
          <div className="text-center mb-6">
            <span className="type-overline text-[#2DD4BF] tracking-[0.15em]">CONTACT</span>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold text-white leading-[1.15] tracking-tight mb-4">
              Have a question?<br />
              <span className="text-[#2DD4BF]">Just reach out.</span>
            </h2>
            <p className="text-[#888888] text-[15px] leading-relaxed max-w-[360px] mx-auto">
              No support tickets. No bots. You&rsquo;re talking directly to the founder.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-[#999] backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>500+ founders helped</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-[#999] backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>4.9&star; avg rating</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-[#999] backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>&lt;4hr response time</span>
            </div>
          </div>
          <div className="relative group mx-4 sm:mx-0">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#2DD4BF]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#141414] border border-white/[0.06] rounded-2xl p-8 sm:p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:border-white/[0.10] transition-all duration-300">
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/40 to-transparent" />
              <div className="relative inline-block mb-5">
                <img src="/images/founder.png" alt="Shantanu Sharma" className="w-20 h-20 rounded-full object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#2DD4BF] flex items-center justify-center shadow-[0_0_12px_rgba(45,212,191,0.3)]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-0.5">Shantanu</h3>
              <p className="text-[#888888] text-sm mb-7">Founder, Somyra</p>
              <div className="w-12 h-[1px] bg-white/[0.06] mx-auto mb-7" />
              <a
                href="mailto:somyra@proton.me"
                className="group/btn inline-flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#2DD4BF] text-[#080808] font-semibold text-[15px] rounded-xl hover:brightness-110 hover:shadow-[0_0_24px_rgba(45,212,191,0.25)] hover:scale-[1.02] active:scale-100 transition-all duration-200"
              >
                <Mail className="w-[18px] h-[18px]" />
                Send a Message
                <ArrowRight className="w-[18px] h-[18px] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </a>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#555555]" />
                <span className="text-[12px] text-[#555555] font-mono">somyra@proton.me</span>
                <span className="w-1 h-1 rounded-full bg-[#555555]" />
              </div>
              <div className="mt-6 pt-5 border-t border-white/[0.04]">
                <p className="text-[12px] text-[#555555] flex items-center justify-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Usually replies within a few hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="w-full px-4 sm:px-8 ds:px-0 py-12 md:py-20 ds:py-[120px] text-center relative z-10 border-t border-white/5"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45,212,191,0.04) 0%, transparent 70%)' }}
      >
        <div className="max-w-[700px] mx-auto relative z-10">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-[10px] px-4 py-2 rounded-[999px] bg-[#141414] border border-white/[0.08] max-w-[calc(100vw-48px)] overflow-hidden">
              <Star className="w-[14px] h-[14px] text-[#F59E0B] fill-[#F59E0B] shrink-0" />
              <span className="text-[13px] text-[#999] whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="hidden max-[400px]:inline">&ldquo;Sounds like me.&rdquo; <span className="text-white font-semibold">&mdash; James O.</span></span>
                <span className="max-[400px]:hidden">&ldquo;The first tool that actually sounds like me.&rdquo; <span className="text-white font-semibold">&mdash; James O.</span></span>
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-[26px] sm:text-[32px] ds:text-[44px] font-semibold text-white leading-[1.2] mx-auto" style={{ maxWidth: '640px' }}>
              Every week you stay quiet is a week<br />
              someone else takes your spot.
            </h2>
          </div>
          <div>
            <p className="text-[#999] text-base mt-4">
              Start free forever. No credit card. Takes 30 seconds.
            </p>
          </div>
          <div>
            <button
              onClick={onSignupClick}
              className="mt-8 px-12 py-4 bg-[#2DD4BF] text-[#080808] font-bold text-[17px] rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-100 transition-all duration-200 btn-glow w-full sm:w-auto"
            >
              Start for Free
            </button>
          </div>
          <div className="mt-4">
            <div className="flex flex-row items-center justify-center gap-4 flex-nowrap max-[360px]:gap-[10px]">
              <div className="inline-flex items-center gap-[5px] whitespace-nowrap text-[12px] max-[360px]:text-[11px] text-[#999]">
                <Lock className="w-[13px] h-[13px] max-[360px]:w-[11px] max-[360px]:h-[11px] text-[#2DD4BF] shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="inline-flex items-center gap-[5px] whitespace-nowrap text-[12px] max-[360px]:text-[11px] text-[#999]">
                <Infinity className="w-[13px] h-[13px] max-[360px]:w-[11px] max-[360px]:h-[11px] text-[#2DD4BF] shrink-0" />
                <span>Free forever</span>
              </div>
              <div className="inline-flex items-center gap-[5px] whitespace-nowrap text-[12px] max-[360px]:text-[11px] text-[#999]">
                <Zap className="w-[13px] h-[13px] max-[360px]:w-[11px] max-[360px]:h-[11px] text-[#2DD4BF] shrink-0" />
                <span>30 second signup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SomyraFooter />
    </>
  );
};
