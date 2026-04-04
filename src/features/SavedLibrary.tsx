import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Crown, Trash2, AlertCircle, Check, Bolt, Copy, Loader2, X } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface SavedItem {
  id: number;
  type: string;
  content: string;
  created_at: string;
}

interface SavedLibraryProps {
  savedItems: SavedItem[];
  user: any;
  isPro: boolean;
  isMax: boolean;
  setShowAuth: (show: boolean) => void;
  setShowPricingModal: (show: boolean) => void;
  handleCopy: (text: string, id: string) => void;
  copied: string | null;
  handleDeleteSaved: (id: number) => Promise<void>;
  handleDeleteAllSaved: () => Promise<void>;
  authChecked: boolean;
  usageLimits: any;
}

export function SavedLibrary({
  savedItems,
  user,
  isPro,
  isMax,
  setShowAuth,
  setShowPricingModal,
  handleCopy,
  copied,
  handleDeleteSaved,
  handleDeleteAllSaved,
  authChecked,
  usageLimits
}: SavedLibraryProps) {
  const [showDeleteAllSavedConfirm, setShowDeleteAllSavedConfirm] = useState(false);

  return (
    <ErrorBoundary>
      {!authChecked ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-teal-accent animate-spin" />
          <p className="text-muted font-medium">Loading...</p>
        </div>
      ) : !user && savedItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] px-6 sm:px-10 py-10 sm:py-20 text-center"
        >
          <div className="relative mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-accent/8 border border-teal-accent/15 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.15)]">
              <Bookmark className="w-11 h-11 sm:w-14 sm:h-14 text-teal-accent" />
            </div>
          </div>

          <h2 className="text-white text-xl sm:text-2xl font-extrabold max-w-[360px] leading-tight mb-3 sm:mb-4">
            Your Content Needs a Home
          </h2>
          
          <p className="text-muted text-sm sm:text-[15px] leading-relaxed max-w-[400px] mb-8 sm:mb-10">
            Saved Library stores your best generated posts, profile rewrites and DMs so you never lose great content. We need a free account to save your data — it is completely free forever.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
            {[
              'Never lose great content',
              'Access from anywhere',
              'Completely free forever'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-accent/8 border border-teal-accent/20 rounded-full">
                <Check className="w-3.5 h-3.5 text-teal-accent" />
                <span className="text-[11px] sm:text-xs font-medium text-teal-accent">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-[320px] space-y-4 sm:space-y-6">
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full py-3.5 sm:py-4 bg-teal-accent text-black font-bold rounded-xl text-[15px] hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all transform hover:scale-[1.02] active:scale-100"
            >
              Sign Up Free
            </button>
            
            <div className="space-y-2">
              <p className="text-[13px] text-muted">
                Already have an account?{' '}
                <button 
                  onClick={() => setShowAuth(true)}
                  className="text-teal-accent font-semibold underline underline-offset-4 hover:text-teal-accent/80 transition-colors"
                >
                  Sign In
                </button>
              </p>
              <p className="text-[11px] text-[#555555]">
                Free forever — no credit card required
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative mb-8">
            <div className="flex items-center gap-3">
              {!user ? (
                <div className="w-6 h-6 bg-teal-accent/10 rounded-full flex items-center justify-center">
                  <Bookmark className="w-3.5 h-3.5 text-teal-accent" />
                </div>
              ) : isMax ? (
                <Crown className="w-6 h-6 text-teal-accent" />
              ) : isPro ? (
                <Crown className="w-6 h-6 text-teal-accent" />
              ) : (
                <Bookmark className="w-6 h-6 text-teal-accent" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Saved Library</h2>
                  {!user ? (
                    <span className="text-[10px] font-bold bg-white/5 text-muted px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest">GUEST MODE</span>
                  ) : isMax ? (
                    <span className="text-[10px] font-bold bg-teal-accent/10 text-teal-accent px-1.5 py-0.5 rounded border border-teal-accent/20 uppercase tracking-widest">MAX</span>
                  ) : isPro ? (
                    <span className="text-[10px] font-bold bg-teal-accent/10 text-teal-accent px-1.5 py-0.5 rounded border border-teal-accent/20 uppercase tracking-widest">PRO</span>
                  ) : null}
                </div>
                <p className="text-[13px] md:text-sm text-muted">
                  {!user ? 'Your temporary local collection. Sign in to save permanently.' : 'Your collection of generated personal branding assets.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm font-bold text-teal-accent">{savedItems.length}</span>
                <span className="text-xs font-bold text-[#555555]">
                  of {(() => {
                    const limit = usageLimits.getSavedLibraryLimit();
                    return limit === 'unlimited' ? '∞' : limit;
                  })()}
                </span>
              </div>
              {savedItems.length > 0 && (
                <button
                  onClick={() => setShowDeleteAllSavedConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-red-400 transition-all hover:border-red-400/40 hover:bg-red-400/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete all
                </button>
              )}
            </div>
          </div>

          {!user && savedItems.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-muted" />
                <p className="text-sm text-muted font-medium">
                  You are in Guest Mode. These items are stored only in your browser and will be lost if you clear your cache.
                </p>
              </div>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl text-xs whitespace-nowrap hover:bg-teal-accent transition-colors"
              >
                Create Free Account
              </button>
            </div>
          )}

          {user && !isMax && (() => {
            const saveLimit = usageLimits.getSavedLibraryLimit();
            const threshold = isPro ? 160 : 8; // 80% of 200 for Pro, 80% of 10 for Free
            return saveLimit !== 'unlimited' && savedItems.length >= threshold;
          })() && (
            <div className="bg-teal-accent/5 border border-teal-accent/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bolt className="w-5 h-5 text-teal-accent" />
                <p className="text-sm text-white font-medium">
                  {isPro
                    ? 'You are approaching your save limit (200). Upgrade to Max for unlimited saves.'
                    : 'You are approaching your save limit (10). Upgrade to Pro for 200 saves per month.'
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowPricingModal(true)}
                className="px-6 py-2 bg-teal-accent text-black font-bold rounded-xl text-xs whitespace-nowrap"
              >
                {isPro ? 'Upgrade to Max' : 'Upgrade to Pro'}
              </button>
            </div>
          )}

          {savedItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-teal-accent/5 rounded-full flex items-center justify-center animate-pulse">
                <Bookmark className="w-10 h-10 text-teal-accent" />
              </div>
              <div className="max-w-xs">
                <p className="text-white font-bold text-lg mb-2">Nothing saved yet</p>
                <p className="text-sm text-muted leading-relaxed">Start generating content and save your favorites here to build your personal brand library.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedItems.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id} 
                  className="bg-bg-secondary border border-border-card p-6 rounded-3xl space-y-4 hover:border-teal-accent hover:shadow-[0_0_30px_rgba(45,212,191,0.05)] transition-all duration-300 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        item.type === 'Post' ? 'bg-teal-accent/10 text-teal-accent' :
                        item.type === 'Topic' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.type === 'Headline' ? 'bg-teal-accent/10 text-teal-accent' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-muted font-medium">
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handleCopy(item.content, `saved-${item.id}`)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted hover:text-teal-accent"
                      >
                        {copied === `saved-${item.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteSaved(item.id)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-6 group-hover:line-clamp-none transition-all duration-500">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {showDeleteAllSavedConfirm && (
              <div className="overlay-shell">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDeleteAllSavedConfirm(false)}
                  className="overlay-backdrop"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="dialog-panel"
                >
                  <div className="dialog-icon bg-red-400/10">
                    <Trash2 className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="dialog-header">
                    <h3 className="dialog-title">Delete All Saved Items?</h3>
                    <p className="dialog-copy dialog-section text-safe">
                      This will permanently remove everything from your saved library. This action cannot be undone.
                    </p>
                  </div>

                  <div className="dialog-actions">
                    <button
                      onClick={() => setShowDeleteAllSavedConfirm(false)}
                      className="dialog-button border border-white/10 text-white hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteAllSaved();
                        setShowDeleteAllSavedConfirm(false);
                      }}
                      className="dialog-button bg-red-400 text-white shadow-lg shadow-red-400/20 hover:bg-red-500"
                    >
                      Delete All
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </ErrorBoundary>
  );
}
