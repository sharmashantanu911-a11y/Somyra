import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Crown, Trash2, AlertCircle, Check, Loader2, Plus, Bolt, X } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { supabase } from '../lib/supabase';

interface VoicePost {
  id: string;
  content: string;
  created_at: string;
}

interface VoiceProfileProps {
  user: any;
  isPro: boolean;
  isMax: boolean;
  voicePosts: VoicePost[];
  setVoicePosts: React.Dispatch<React.SetStateAction<VoicePost[]>>;
  authChecked: boolean;
  setShowAuth: (show: boolean) => void;
  setShowPricingModal: (show: boolean) => void;
  setError: React.Dispatch<React.SetStateAction<any>>;
  showToast: (toastData: any) => void;
  trackEvent: (eventName: string, params?: any) => void;
  usageLimits: any;
  onRequireAuth: (feature: string, callback: () => void) => void;
}

export function VoiceProfile({
  user,
  isPro,
  isMax,
  voicePosts,
  setVoicePosts,
  authChecked,
  setShowAuth,
  setShowPricingModal,
  setError,
  showToast,
  trackEvent,
  usageLimits,
  onRequireAuth
}: VoiceProfileProps) {
  const [newVoicePost, setNewVoicePost] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceSuccess, setVoiceSuccess] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const handleAddVoicePost = async () => {
    if (!user) {
      onRequireAuth('Voice Profile', () => handleAddVoicePost());
      return;
    }
    
    if (!newVoicePost.trim()) {
      setVoiceError('Please paste a LinkedIn post first.');
      setTimeout(() => setVoiceError(null), 3000);
      return;
    }

    const status = usageLimits.getStatus('voice_profile');
    const currentVoice = voicePosts.length;

    if (status.limit !== 'unlimited' && currentVoice >= (status.limit as number)) {
      let message = '';
      if (usageLimits.tier === 'guest') message = 'Create a free account to start using Somyra.';
      else if (usageLimits.tier === 'free') message = "You've reached your limit. Upgrade to Pro to add more.";
      else if (usageLimits.tier === 'pro') message = "You've reached your Pro limit. Upgrade to Max for more.";
      else message = "You've reached your sample post limit. Contact us for a custom plan.";

      showToast({
        message,
        type: 'error',
        headline: 'Voice Profile Limit'
      });
      trackEvent('voice_profile_limit_hit', { tier: usageLimits.tier });
      return;
    }

    setLoadingVoice(true);
    try {
      
      const { data, error: saveError } = await supabase
        .from('voice_profile')
        .insert([{ user_id: user.id, post_text: newVoicePost }])
        .select()
        .single();

      if (saveError) throw saveError;
      if (!data) throw new Error('Failed to save post: no data returned');

      const post: VoicePost = {
        id: data.id,
        content: data.post_text,
        created_at: data.created_at
      };
      setVoicePosts([post, ...voicePosts]);
      
      setNewVoicePost('');
      setVoiceError(null);
      setVoiceSuccess(true);
      setTimeout(() => setVoiceSuccess(false), 3000);
    } catch (err: any) {
      setVoiceError('Failed to save post. Please try again.');
      setTimeout(() => setVoiceError(null), 3000);
    } finally {
      setLoadingVoice(false);
    }
  };

  const handleDeleteVoicePost = async (id: string) => {
    if (!user) return;
    try {
      const { error: deleteError } = await supabase
        .from('voice_profile')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setVoicePosts(voicePosts.filter(p => p.id !== id));
    } catch (err: any) {
      setError({
        message: 'Failed to delete voice post.',
        suggestion: err.message
      });
    }
  };

  const handleDeleteAllVoicePosts = async () => {
    if (!user) {
      setVoicePosts([]);
      setShowDeleteAllConfirm(false);
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('voice_profile')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setVoicePosts([]);
      setShowDeleteAllConfirm(false);
    } catch (err: any) {
      setError({
        message: 'Failed to delete all voice posts.',
        suggestion: err.message
      });
    }
  };

  return (
    <ErrorBoundary>
      {!authChecked ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-teal-accent animate-spin" />
          <p className="text-muted font-medium">Loading...</p>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-accent/10 rounded-2xl">
                {isMax ? (
                  <Crown className="w-6 h-6 md:w-8 md:h-8 text-teal-accent" />
                ) : isPro ? (
                  <Crown className="w-6 h-6 md:w-8 md:h-8 text-teal-accent" />
                ) : (
                  <Mic className="w-6 h-6 md:w-8 md:h-8 text-teal-accent" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Voice Profile</h2>
                  {isMax ? (
                     <span className="text-[10px] font-bold bg-teal-accent/10 text-teal-accent px-2 py-0.5 rounded border border-teal-accent/20 uppercase tracking-widest">MAX</span>
                  ) : isPro ? (
                    <span className="text-[10px] font-bold bg-teal-accent/10 text-teal-accent px-2 py-0.5 rounded border border-teal-accent/20 uppercase tracking-widest">PRO</span>
                  ) : null}
                </div>
                <p className="text-[13px] md:text-sm text-muted">Train Somyra to write exactly like you.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 self-start md:self-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-teal-accent">{voicePosts.length}</span>
                <span className="text-xs font-bold text-[#555555]">of {usageLimits.getStatus('voice_profile').limit === 'unlimited' ? '∞' : usageLimits.getStatus('voice_profile').limit} posts</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: usageLimits.getStatus('voice_profile').limit === 'unlimited' 
                      ? '100%' 
                      : `${(voicePosts.length / (usageLimits.getStatus('voice_profile').limit as number)) * 100}%` 
                  }}
                  className="h-full bg-teal-accent"
                />
              </div>
            </div>
            {voicePosts.length > 0 && (
              <button
                onClick={() => setShowDeleteAllConfirm(true)}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-red-400 transition-all hover:border-red-400/40 hover:bg-red-400/10 md:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete all posts
              </button>
            )}
          </div>

          <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl md:rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-accent/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-teal-accent/10 transition-all duration-700" />
            
            <div className="space-y-2 relative z-10">
              <label className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">Paste a LinkedIn Post</label>
              <textarea 
                value={newVoicePost}
                onChange={(e) => setNewVoicePost(e.target.value)}
                placeholder="Paste one of your best LinkedIn posts here..."
                className="w-full bg-[#0D0D0D] border border-[#2a2a2a] rounded-xl md:rounded-2xl px-5 py-4 text-[14px] md:text-base text-white outline-none focus:border-teal-accent/50 focus:ring-4 focus:ring-teal-accent/5 transition-all min-h-[180px] md:min-h-[220px] resize-none custom-scrollbar"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-muted font-medium bg-white/5 px-3 py-1 rounded-full">{newVoicePost.length} characters</span>
                {newVoicePost.length > 0 && (
                  <button 
                    onClick={() => setNewVoicePost('')}
                    className="text-[11px] text-muted hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {voicePosts.length < (usageLimits.getStatus('voice_profile').limit === 'unlimited' ? Infinity : usageLimits.getStatus('voice_profile').limit) ? (
                <button 
                  onClick={handleAddVoicePost}
                  disabled={loadingVoice || !newVoicePost.trim()}
                  className="w-full sm:w-auto btn-gradient px-10 py-3.5 md:py-4 text-sm md:text-base"
                >
                  {loadingVoice ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Style...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Add to Profile</span>
                    </div>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-teal-accent text-xs font-bold bg-teal-accent/5 px-5 py-3 rounded-xl border border-teal-accent/20">
                  <AlertCircle className="w-4 h-4" />
                  Maximum {usageLimits.getStatus('voice_profile').limit} posts reached
                </div>
              )}
            </div>

            <AnimatePresence>
              {voiceError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 text-red-400 text-xs md:text-sm bg-red-400/5 p-4 rounded-xl border border-red-400/10"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {voiceError}
                </motion.div>
              )}
              {voiceSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 text-teal-accent text-xs md:text-sm bg-teal-accent/5 p-4 rounded-xl border border-teal-accent/10"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  Post added to your voice profile successfully
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-base md:text-lg font-bold text-white">Your Sample Posts</h3>
                <span className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-bold text-muted">{voicePosts.length}</span>
              </div>
            </div>

            {voicePosts.length === 0 ? (
              <div className="bg-[#141414] border border-dashed border-[#1f1f1f] rounded-2xl md:rounded-[2rem] p-12 md:p-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-8 h-8 text-muted/30" />
                </div>
                <p className="text-muted text-sm md:text-base italic max-w-xs mx-auto">No posts added yet. Add your first post above to start training Somyra.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {voicePosts.map((post) => (
                  <motion.div 
                    layout
                    key={post.id} 
                    className="bg-[#141414] border border-[#1f1f1f] p-6 rounded-2xl md:rounded-3xl group relative hover:border-teal-accent/30 transition-all duration-300 flex flex-col"
                  >
                    <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500 mb-6">
                      {post.content}
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-accent rounded-full" />
                        <span className="text-[10px] text-muted font-medium uppercase tracking-wider">
                          Added {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteVoicePost(post.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all active:scale-90"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {!isMax && !isPro && voicePosts.length >= 4 && (
            <div className="bg-teal-accent/5 border border-teal-accent/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bolt className="w-5 h-5 text-teal-accent" />
                <p className="text-sm text-white font-medium">
                  {usageLimits.tier === 'guest' 
                    ? 'Sign up for free to add more posts and save your writing style.'
                    : usageLimits.tier === 'free' 
                      ? 'You are nearing your Voice Profile limit. Upgrade to Pro to add up to 10 posts for better style accuracy.'
                      : 'You are nearing your Voice Profile limit. Upgrade to Max to add up to 20 posts.'
                  }
                </p>
              </div>
              <button 
                onClick={() => usageLimits.tier === 'guest' ? setShowAuth(true) : setShowPricingModal(true)}
                className="px-6 py-2 bg-teal-accent text-black font-bold rounded-xl text-xs whitespace-nowrap"
              >
                {usageLimits.tier === 'guest' ? 'Sign Up Free' : 'Upgrade to Pro'}
              </button>
            </div>
          )}
        </div>
      )}
      
      <AnimatePresence>
        {showDeleteAllConfirm && (
          <div className="overlay-shell">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteAllConfirm(false)}
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
                <h3 className="dialog-title">Delete All Posts?</h3>
                <p className="dialog-copy dialog-section text-safe">
                  This will permanently remove all posts from your voice profile. This action cannot be undone.
                </p>
              </div>
              
              <div className="dialog-actions">
                <button 
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="dialog-button border border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleDeleteAllVoicePosts();
                    setShowDeleteAllConfirm(false);
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
    </ErrorBoundary>
  );
}
