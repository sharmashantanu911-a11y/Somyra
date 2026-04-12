import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Anonymous',
          user_title: title || 'LinkedIn User',
          content: content,
          rating: rating,
          badge_text: 'VERIFIED USER'
        });

      if (error) throw error;
      
      setSubmitted(true);
      onSuccess();
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setContent('');
        setTitle('');
      }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Leave a Review</h2>
              <p className="text-muted text-sm mt-1">Share your Somyra experience with the world.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-teal-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Review Submitted!</h3>
                <p className="text-muted text-sm px-8">
                  Thank you for your feedback. Your review will be visible on our landing page shortly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Star Rating */}
                <div className="flex flex-col items-center justify-center py-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Overall Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            (hoveredRating || rating) >= star
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-white/10 fill-none'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2 ml-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Founder at TechScale or Marketing Director"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-teal-accent/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2 ml-1">
                      Your Feedback
                    </label>
                    <textarea
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What do you love about Somyra? How has it helped your LinkedIn growth?"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-teal-accent/50 focus:bg-white/[0.07] transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !content || !title}
                  className="w-full h-14 bg-teal-accent disabled:opacity-50 disabled:grayscale text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden group shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Review</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
