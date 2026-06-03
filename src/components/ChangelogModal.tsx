import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Rocket, Check, ArrowUpRight, Linkedin, MessageSquare, Clock, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface ChangelogItem {
  badge: 'NEW' | 'IMPROVED' | 'FIXED' | 'COMING SOON';
  title: string;
  description: string;
}

interface ChangelogVersion {
  version: string;
  date: string;
  items: ChangelogItem[];
}

// To add new updates in future just add a new object at the top of this array.
const CHANGELOG_DATA: ChangelogVersion[] = [
  {
    version: 'v1.3',
    date: 'April 2026',
    items: [
      {
        badge: 'FIXED',
        title: 'AI Intelligence Restored',
        description: 'Successfully migrated to GPT OSS 120B with automatic fallback to Llama 3.3. Reliability and \"human-like\" quality are now 100% restored across all features.'
      },
      {
        badge: 'NEW',
        title: 'Competitive Comparison',
        description: 'New high-conversion section on the landing page. We compared ourselves against every major LinkedIn tool so you do not have to.'
      },
      {
        badge: 'NEW',
        title: 'Branding Update',
        description: 'Implemented the official Somyra logo as the browser favicon and OG social preview image.'
      },
      {
        badge: 'IMPROVED',
        title: 'Dodo Payments Live',
        description: 'Transitioned to live billing mode with secure payment processing and instant subscription synchronization.'
      },
      {
        badge: 'FIXED',
        title: 'Subscription Cancellation',
        description: 'Resolved a bug preventing users from canceling their subscriptions directly from the settings menu.'
      },
      {
        badge: 'FIXED',
        title: 'Review Button',
        description: 'Fixed the \"Leave a Review\" button on the landing page that was failing to trigger the feedback modal.'
      }
    ]
  },
  {
    version: 'v1.2',
    date: 'March 2026',
    items: [
      {
        badge: 'NEW',
        title: 'Voice Profile',
        description: 'Add sample posts and Somyra learns your exact writing style. Every post it generates sounds like you wrote it.'
      },
      {
        badge: 'NEW',
        title: 'Deep Mode',
        description: 'Three-call AI system for maximum human authenticity. The most natural sounding posts Somyra can produce. Pro only.'
      },
      {
        badge: 'NEW',
        title: 'LinkedIn Post Preview',
        description: 'See exactly how your post looks on LinkedIn before publishing with character count and hashtag analyzer.'
      },
      {
        badge: 'NEW',
        title: 'Pricing and Pro Plan',
        description: 'Somyra Pro is live at Rs 999 per month. Unlimited generations, Voice Profile, Saved Library, Deep Mode and more.'
      },
      {
        badge: 'NEW',
        title: "What's New Modal",
        description: 'You are reading it right now.'
      },
      {
        badge: 'IMPROVED',
        title: 'Post Writer',
        description: 'Switched to openai/gpt-oss-120b model for significantly better output quality. Less generic more human.'
      },
      {
        badge: 'IMPROVED',
        title: 'Generation System',
        description: 'Complete rebuild with method actor style mimicry and anti-AI detection baked in.'
      },
      {
        badge: 'IMPROVED',
        title: 'Homepage Dashboard',
        description: 'Full redesign with stats, testimonials, How it Works section and daily rotating tips.'
      },
      {
        badge: 'IMPROVED',
        title: 'Mobile Experience',
        description: 'Complete responsiveness overhaul across all screens and features.'
      }
    ]
  },
  {
    version: 'v1.1',
    date: 'February 2026',
    items: [
      {
        badge: 'NEW',
        title: 'Saved Library',
        description: 'Save your best generated posts, profile rewrites and DMs. Access them from anywhere anytime.'
      },
      {
        badge: 'NEW',
        title: 'Generation Limits',
        description: 'Fair usage system with 5 free generations, 10 per day after signup, unlimited for Pro.'
      },
      {
        badge: 'NEW',
        title: 'Review System',
        description: 'Leave a review directly on Somyra. Verified reviews appear on homepage.'
      },
      {
        badge: 'IMPROVED',
        title: 'Auth Flow',
        description: 'Email confirmation now redirects correctly to Somyra. Smoother signup experience.'
      },
      {
        badge: 'IMPROVED',
        title: 'Sidebar',
        description: 'Grouped navigation with MY PROFILE, ANALYZE and CREATE sections. PRO badges on premium features.'
      },
      {
        badge: 'FIXED',
        title: 'Supabase Auth',
        description: 'Fixed redirect URL issue that was sending users to localhost after email confirmation.'
      },
      {
        badge: 'FIXED',
        title: 'Mobile Sidebar',
        description: 'Sign out button now visible on mobile. User email shown in hamburger menu.'
      }
    ]
  },
  {
    version: 'v1.0',
    date: 'January 2026',
    items: [
      {
        badge: 'NEW',
        title: 'Somyra Launch',
        description: 'AI-powered LinkedIn content tool is live. Built for professionals worldwide.'
      },
      {
        badge: 'NEW',
        title: 'Profile Analysis',
        description: 'Analyze any LinkedIn profile and get actionable improvement suggestions instantly.'
      },
      {
        badge: 'NEW',
        title: 'Topic Generator',
        description: 'Get 8 personalized post ideas based on your niche and writing style.'
      },
      {
        badge: 'NEW',
        title: 'Post Writer',
        description: 'Generate full LinkedIn posts with hooks, body and CTAs in seconds.'
      },
      {
        badge: 'NEW',
        title: 'Profile Rewrites',
        description: 'Generate stronger headline and about-section rewrites directly from your profile audit.'
      },
      {
        badge: 'NEW',
        title: 'DM and Outreach',
        description: 'Write personalized connection requests and follow up messages.'
      }
    ]
  }
];

const COMING_SOON_DATA: ChangelogItem[] = [
  {
    badge: 'COMING SOON',
    title: 'Content Calendar',
    description: 'Plan and organize your entire month of LinkedIn content in one view.'
  },
  {
    badge: 'COMING SOON',
    title: 'Lead Magnet Creator',
    description: 'Turn your expertise into downloadable lead magnets that grow your audience.'
  },
  {
    badge: 'COMING SOON',
    title: 'Post Analysis',
    description: 'Get deep insights into why your posts are performing and how to improve them.'
  },
  {
    badge: 'COMING SOON',
    title: 'Google Login',
    description: 'Sign in with Google in one click. No more email confirmation.'
  },
  {
    badge: 'COMING SOON',
    title: 'Post Scheduler',
    description: 'Schedule posts directly to LinkedIn from inside Somyra.'
  },
  {
    badge: 'COMING SOON',
    title: 'Repurpose Post',
    description: 'Turn one post into Twitter threads, carousels and newsletters automatically.'
  },
  {
    badge: 'COMING SOON',
    title: 'Analytics Dashboard',
    description: 'Track your LinkedIn growth, post performance and profile views.'
  }
];

type FilterType = 'All' | 'Released' | 'Coming Soon' | 'Fixed';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Track GA
      if (window.gtag) {
        window.gtag('event', 'changelog_opened', {
          send_to: 'G-GW7S5DDBB3'
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (window.gtag) {
      window.gtag('event', 'changelog_filter_used', {
        send_to: 'G-GW7S5DDBB3',
        filter_name: filter
      });
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'NEW':
        return 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30';
      case 'IMPROVED':
        return 'bg-[#818CF8]/10 text-[#818CF8] border-[#818CF8]/30';
      case 'FIXED':
        return 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30';
      case 'COMING SOON':
        return 'bg-[#FCD34D]/10 text-[#FCD34D] border-[#FCD34D]/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const filterItems = (items: ChangelogItem[]) => {
    if (activeFilter === 'All') return items;
    if (activeFilter === 'Released') return items.filter(i => i.badge === 'NEW' || i.badge === 'IMPROVED');
    if (activeFilter === 'Coming Soon') return items.filter(i => i.badge === 'COMING SOON');
    if (activeFilter === 'Fixed') return items.filter(i => i.badge === 'FIXED');
    return items;
  };

  const totalUpdates = CHANGELOG_DATA.reduce((acc, v) => acc + v.items.length, 0);
  const featuresShipped = CHANGELOG_DATA.reduce((acc, v) => acc + v.items.filter(i => i.badge === 'NEW').length, 0);
  const comingSoonCount = COMING_SOON_DATA.length;

  const getFilterCount = (filter: FilterType) => {
    let count = 0;
    const allItems = [...CHANGELOG_DATA.flatMap(v => v.items), ...COMING_SOON_DATA];
    
    if (filter === 'All') count = allItems.length;
    else if (filter === 'Released') count = allItems.filter(i => i.badge === 'NEW' || i.badge === 'IMPROVED').length;
    else if (filter === 'Coming Soon') count = allItems.filter(i => i.badge === 'COMING SOON').length;
    else if (filter === 'Fixed') count = allItems.filter(i => i.badge === 'FIXED').length;
    
    return count;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="overlay-shell z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="overlay-backdrop bg-black/85 backdrop-blur-[8px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="panel-fluid relative flex h-full w-full min-w-0 max-w-[560px] flex-col overflow-hidden rounded-[20px] border border-[#2DD4BF]/20 bg-[#0D0D0D] shadow-2xl md:h-auto md:max-h-[85vh] mobile-full-screen"
          >
            {/* Header */}
            <header className="flex-shrink-0 bg-[#0D0D0D] border-bottom border-[#1a1a1a] p-7 md:px-7 md:py-6 flex justify-between items-start z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#2DD4BF]/8 border border-[#2DD4BF]/20 rounded-full w-fit">
                  <span className="type-overline font-bold text-[#2DD4BF] flex items-center gap-1.5">
                    <Rocket className="w-3 h-3" />
                    Changelog
                  </span>
                </div>
                <h2 className="text-white text-[22px] font-semibold mt-2 leading-tight">What's New in Somyra</h2>
                <p className="type-sm text-[#888888] mt-1">Updates, improvements and what's coming next.</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="type-caption text-[#2DD4BF] font-bold">{totalUpdates}</span>
                    <span className="type-caption text-[#888888]">total updates</span>
                  </div>
                  <span className="text-[#333333]">•</span>
                  <div className="flex items-center gap-1">
                    <span className="type-caption text-[#2DD4BF] font-bold">{featuresShipped}</span>
                    <span className="type-caption text-[#888888]">features shipped</span>
                  </div>
                  <span className="text-[#333333]">•</span>
                  <div className="flex items-center gap-1">
                    <span className="type-caption text-[#2DD4BF] font-bold">{comingSoonCount}</span>
                    <span className="type-caption text-[#888888]">coming soon</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#141414] border border-[#1f1f1f] flex items-center justify-center text-[#888888] hover:text-white hover:border-[#2DD4BF] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Filters */}
            <div className="flex-shrink-0 bg-[#0D0D0D] border-bottom border-[#1a1a1a] px-7 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
              {(['All', 'Released', 'Coming Soon', 'Fixed'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full type-caption font-medium transition-all whitespace-nowrap ${
                    activeFilter === filter 
                      ? 'bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF]' 
                      : 'bg-[#141414] border border-[#1f1f1f] text-[#888888] hover:text-white'
                  }`}
                >
                  {filter}
                  <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] ${
                    activeFilter === filter ? 'bg-[#2DD4BF]/20 text-[#2DD4BF]' : 'bg-white/5 text-[#888888]'
                  }`}>
                    {getFilterCount(filter)}
                  </span>
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto custom-scrollbar-teal p-0">
              <div className="flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFilter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {CHANGELOG_DATA.map((version, vIdx) => {
                      const filteredItems = filterItems(version.items);
                      if (filteredItems.length === 0) return null;
                      
                      return (
                        <div key={version.version} className="border-bottom border-[#141414] p-7 md:px-7">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#141414] border border-[#1f1f1f] rounded-full px-3 py-0.5 type-overline text-white font-bold">
                                {version.version}
                              </span>
                              {vIdx === 0 && (
                                <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-full px-2 py-0.5 type-overline font-bold">
                                  LATEST
                                </span>
                              )}
                            </div>
                            <span className="type-caption text-[#888888]">{version.date}</span>
                          </div>
                          
                          <div className="flex flex-col">
                            {filteredItems.map((item, iIdx) => (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: iIdx * 0.08 }}
                                key={`${version.version}-${iIdx}`}
                                className={`flex items-start gap-3 py-2.5 border-bottom border-[#0f0f0f] last:border-0`}
                              >
                                <span className={`w-[90px] text-center flex-shrink-0 mt-0.5 rounded-[6px] px-2 py-0.5 type-overline font-bold uppercase border ${getBadgeColor(item.badge)}`}>
                                  {item.badge}
                                </span>
                              <div className="min-w-0 flex flex-col">
<h4 className="type-sm text-white font-semibold">{item.title}</h4>
                <p className="type-sm text-safe text-[#888888] leading-relaxed mt-0.5">{item.description}</p>
                              </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Coming Soon Section */}
                    {(activeFilter === 'All' || activeFilter === 'Coming Soon') && (
                      <div className="p-7 md:px-7 pb-10">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-[#FCD34D]/10 text-[#FCD34D] border border-[#FCD34D]/30 rounded-full px-3 py-0.5 type-overline font-bold flex items-center gap-1.5">
                            🚀 COMING SOON
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          {COMING_SOON_DATA.map((item, idx) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08 }}
                              key={`soon-${idx}`}
                              className="flex items-start gap-3 py-2.5 border-bottom border-[#0f0f0f] last:border-0 opacity-80"
                            >
                              <span className={`w-[90px] text-center flex-shrink-0 mt-0.5 rounded-[6px] px-2 py-0.5 type-overline font-bold uppercase border ${getBadgeColor(item.badge)}`}>
                                {item.badge}
                              </span>
                              <div className="min-w-0 flex flex-col">
<h4 className="type-sm text-white font-semibold">{item.title}</h4>
                              <p className="type-sm text-safe text-[#666666] leading-relaxed mt-0.5">{item.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {CHANGELOG_DATA.every(v => filterItems(v.items).length === 0) && 
                     (activeFilter !== 'All' && activeFilter !== 'Coming Soon' || (activeFilter === 'Coming Soon' && COMING_SOON_DATA.length === 0)) && (
                      <div className="flex flex-col items-center justify-center py-20 px-7 text-center">
                        <AlertCircle className="w-10 h-10 text-[#333333] mb-4" />
                        <h3 className="text-white text-[16px] font-bold">No updates in this category yet</h3>
                        <p className="type-sm text-[#888888] mt-1">Check back soon for new improvements.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <footer className="flex-shrink-0 bg-[#0D0D0D] border-top border-[#1a1a1a] p-7 md:px-7 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="type-caption text-[#888888]">
                Have a feature request?{' '}
                <a 
                  href="mailto:shantanu@somyra.in" 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'changelog_feedback_clicked', {
                        send_to: 'G-GW7S5DDBB3'
                      });
                    }
                  }}
                  className="text-[#2DD4BF] hover:underline"
                >
                  Send feedback
                </a>
              </p>
              
              <a 
                href="https://www.linkedin.com/in/sharmashantanu911" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  if (window.gtag) {
                    window.gtag('event', 'changelog_follow_clicked', {
                      send_to: 'G-GW7S5DDBB3'
                    });
                  }
                }}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#2DD4BF]/8 border border-[#2DD4BF]/20 rounded-full type-caption font-bold text-[#2DD4BF] hover:bg-[#2DD4BF]/15 transition-all"
              >
                <Linkedin className="w-3 h-3" />
                Follow updates
              </a>
            </footer>
          </motion.div>

          <style dangerouslySetInnerHTML={{ __html: `
            .custom-scrollbar-teal::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar-teal::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar-teal::-webkit-scrollbar-thumb {
              background: #2DD4BF;
              border-radius: 10px;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .border-bottom {
              border-bottom-width: 1px;
            }
            .border-top {
              border-top-width: 1px;
            }
            @media (max-width: 640px) {
              .mobile-full-screen {
                max-width: 100vw !important;
                width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                border-radius: 0 !important;
                margin: 0 !important;
              }
            }
          `}} />
        </div>
      )}
    </AnimatePresence>
  );
};
