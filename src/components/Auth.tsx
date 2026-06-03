import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock as LockIcon, Loader2, ArrowRight, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'signup' | 'forgot' | 'check_email';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onClose?: () => void;
  feature?: string;
  initialMode?: 'login' | 'signup' | 'forgot' | 'check_email';
}

export default function Auth({ onAuthSuccess, onClose, feature, initialMode }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode || 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) {
          if (authError.message.includes('Invalid login credentials')) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          if (authError.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email first — check your inbox for a confirmation link.');
          }
          throw authError;
        }
        if (data.user) {
          onAuthSuccess(data.user);
          if (onClose) onClose();
        }

      } else if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (authError) {
          if (authError.message.includes('already registered')) {
            throw new Error('An account with this email already exists. Try signing in instead.');
          }
          throw authError;
        }
        if (data.session && data.user) {
          onAuthSuccess(data.user);
          if (onClose) onClose();
        } else {
          setMode('check_email');
        }

      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/`
        });
        if (resetError) throw resetError;
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setPassword('');
    setShowPassword(false);
    setResetSent(false);
  };

  const title = mode === 'check_email' ? 'Check your inbox'
    : mode === 'forgot' ? 'Reset password'
    : feature ? `Your ${feature} is one step away` 
    : 'Welcome to Somyra';

  const subtitle = mode === 'forgot'
    ? 'Enter your email and we\'ll send you a reset link.'
    : mode === 'check_email'
    ? `We sent a confirmation link to ${email}. Click it to activate your account.`
    : 'Create your free account and get instant access. No credit card. No pressure. Just results.';

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Background overlay with blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      {/* Modal Card — Glassmorphism */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[440px] rounded-[24px] bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_80px_rgba(45,212,191,0.08)] border-t-2 border-t-teal-accent border-l border-r border-b border-white/[0.08] ring-1 ring-white/[0.04] overflow-hidden"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 text-slate-500 hover:text-white transition-colors z-10 bg-white/[0.06] hover:bg-white/[0.1] rounded-full"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            {/* Somyra Logo */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.1] shadow-[0_0_20px_rgba(45,212,191,0.15)]">
              <svg className="w-7 h-7 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
              </svg>
            </div>
            
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>
            
            <p className="text-sm leading-relaxed text-[#888888]">
              {subtitle}
            </p>

            {/* Feature Chips */}
            {(mode === 'signup' || mode === 'login') && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-teal-accent/10 px-3 py-1 text-xs font-semibold text-teal-accent border border-teal-accent/20">Profile Audits</span>
                <span className="rounded-full bg-teal-accent/10 px-3 py-1 text-xs font-semibold text-teal-accent border border-teal-accent/20">Post Writer</span>
                <span className="rounded-full bg-teal-accent/10 px-3 py-1 text-xs font-semibold text-teal-accent border border-teal-accent/20">Smart Outreach</span>
              </div>
            )}
          </div>

          <div className="w-full">
            {/* Check email confirmation state */}
            <AnimatePresence mode="wait">
              {mode === 'check_email' ? (
                <motion.div
                  key="check_email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center gap-4 py-2 text-center">
                    <div className="w-14 h-14 bg-teal-accent/10 rounded-full flex items-center justify-center border border-teal-accent/20">
                      <CheckCircle2 className="w-7 h-7 text-teal-accent" />
                    </div>
                    <p className="text-sm text-[#888888] max-w-[280px]">
                      Once confirmed, come back and sign in with your credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => switchMode('login')}
                    className="w-full btn-gradient"
                  >
                    Go to Sign In <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>

              ) : resetSent && mode === 'forgot' ? (
                <motion.div
                  key="reset_sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center gap-4 py-2 text-center">
                    <div className="w-14 h-14 bg-teal-accent/10 rounded-full flex items-center justify-center border border-teal-accent/20">
                      <CheckCircle2 className="w-7 h-7 text-teal-accent" />
                    </div>
                    <p className="text-sm text-[#888888] max-w-[280px]">
                      Password reset link sent to <span className="text-white font-semibold">{email}</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => switchMode('login')}
                    className="w-full btn-gradient"
                  >
                    Back to Sign In <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>

              ) : (
                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block type-overline font-bold text-[#888888] ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
                        <input
                          type="email"
                          required
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field pl-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-teal-accent/40 focus:bg-white/[0.06]"
                          placeholder="name@company.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    {mode !== 'forgot' && (
                      <div className="space-y-1.5">
                        <label className="block type-overline font-bold text-[#888888] ml-1">
                          Password
                        </label>
                        <div className="relative">
                          <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-11 pr-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-teal-accent/40 focus:bg-white/[0.06]"
                            placeholder="••••••••"
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            minLength={mode === 'signup' ? 6 : undefined}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Forgot password link */}
                    {mode === 'login' && (
                      <div className="text-right -mt-1">
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="type-overline text-[#888888] hover:text-teal-accent transition-colors font-semibold"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                         <motion.div
                         initial={{ opacity: 0, y: -4 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -4 }}
                         className="flex min-w-0 items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400"
                       >
                         <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                         <span className="min-w-0 break-words">{error}</span>
                       </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-teal-accent px-4 py-3.5 text-[13px] font-bold text-black transition-all hover:bg-teal-accent/90 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] mt-2 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up Free' : 'Send Reset Link'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch mode */}
                  <div className="text-center pt-2">
                    {mode === 'login' && (
                      <button
                        onClick={() => switchMode('signup')}
                        className="text-sm font-medium text-[#888888] transition-colors hover:text-white"
                      >
                        New to Somyra? Sign Up Free
                      </button>
                    )}
                    {mode === 'signup' && (
                      <button
                        onClick={() => switchMode('login')}
                        className="text-sm font-medium text-[#888888] transition-colors hover:text-white"
                      >
                        Already have an account? Sign In
                      </button>
                    )}
                    {mode === 'forgot' && (
                      <button
                        onClick={() => switchMode('login')}
                        className="type-overline font-bold text-[#888888] transition-colors hover:text-white"
                      >
                        ← Back to Sign In
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer note */}
          <div className="mt-8 text-center border-t border-white/[0.06] pt-6">
            <p className="type-overline text-[#666666] font-medium">
              Free forever plan available. Upgrade only if you want more.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
