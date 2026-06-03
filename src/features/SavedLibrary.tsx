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
                  {isMax ? (
                    <span className="type-overline font-bold bg-teal-accent/10 text-teal-accent px-1.5 py-0.5 rounded border border-teal-accent/20">MAX</span>
                  ) : isPro ? (
                    <span className="type-overline font-bold bg-teal-accent/10 text-teal-accent px-1.5 py-0.5 rounded border border-teal-accent/20">PRO</span>
                  ) : null}
                </div>
                <p className="type-sm text-muted">
                  Your collection of generated personal branding assets.
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
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 type-overline font-bold text-red-400 transition-all hover:border-red-400/40 hover:bg-red-400/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete all
                </button>
              )}
            </div>
          </div>

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
                      <span className={`px-2.5 py-1 rounded-lg type-overline font-bold ${
                        item.type === 'Post' ? 'bg-teal-accent/10 text-teal-accent' :
                        item.type === 'Topic' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.type === 'Headline' ? 'bg-teal-accent/10 text-teal-accent' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className="type-overline text-muted font-medium">
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
                  <p className="type-sm text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-6 group-hover:line-clamp-none transition-all duration-500">
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
