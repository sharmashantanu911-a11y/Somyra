import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock as LockIcon, Loader2, ArrowRight, X, Eye, EyeOff, CheckCircle2, User } from 'lucide-react';
import { supabase, signInWithGoogle } from '../lib/supabase';

type AuthMode = 'login' | 'signup' | 'forgot' | 'check_email';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onClose?: () => void;
  feature?: string;
  initialMode?: 'login' | 'signup' | 'forgot' | 'check_email';
}

export default function Auth({ onAuthSuccess, onClose, feature, initialMode }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode || 'signup');
  const [fullName, setFullName] = useState('');
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
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
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

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(8,8,8,0.85)] backdrop-blur-[8px]"
        onClick={onClose}
      />

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-[420px] rounded-[20px] bg-[#111111] border border-[rgba(255,255,255,0.07)] shadow-[0_32px_64px_rgba(0,0,0,0.7)]"
        style={{ padding: '40px 36px' }}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[#555] hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Check email / Reset sent confirmation states */}
        <AnimatePresence mode="wait">
          {mode === 'check_email' ? (
            <motion.div
              key="check_email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/[0.06]">
                  <CheckCircle2 className="w-7 h-7 text-[#2DD4BF]" />
                </div>
                <h2 className="text-white font-bold text-2xl">Check your inbox</h2>
                <p className="text-sm text-[#555] max-w-[280px]">
                  We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account.
                </p>
                <p className="text-xs text-[#3a3a3a]">
                  Once confirmed, come back and sign in.
                </p>
              </div>
              <button
                onClick={() => switchMode('login')}
                className="w-full rounded-xl bg-[#2DD4BF] px-4 py-3.5 text-[15px] font-bold text-[#080808] hover:bg-[#29bfac] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
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
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/[0.06]">
                  <CheckCircle2 className="w-7 h-7 text-[#2DD4BF]" />
                </div>
                <h2 className="text-white font-bold text-2xl">Check your inbox</h2>
                <p className="text-sm text-[#555] max-w-[280px]">
                  Password reset link sent to <span className="text-white">{email}</span>.
                </p>
              </div>
              <button
                onClick={() => switchMode('login')}
                className="w-full rounded-xl bg-[#2DD4BF] px-4 py-3.5 text-[15px] font-bold text-[#080808] hover:bg-[#29bfac] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                Back to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          ) : (
            <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/[0.05]">
                  <svg className="w-6 h-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-2xl tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-[#555] text-sm mt-1.5">
                  {feature
                    ? `Your ${feature} is one step away`
                    : mode === 'login'
                      ? 'Sign in to your Somyra account'
                      : 'Free forever. No credit card needed.'
                  }
                </p>
              </div>

              {/* Google Button */}
              <button
                onClick={signInWithGoogle}
                className="w-full rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-[#111111] hover:bg-[#f0f0f0] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
              >
                <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
                  <path fill="#4285F4" d="M44.5 20H24v8.5h11.8c-1.1 5.4-5.7 9.5-11.8 9.5-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l6.4-6.4C34.9 3.7 29.8 1.5 24 1.5 11.5 1.5 1.5 11.5 1.5 24S11.5 46.5 24 46.5c11.4 0 20.8-8.3 20.8-22.5 0-1.4-.2-2.7-.5-4z"/>
                  <path fill="#34A853" d="M5.3 14.3l7.4 5.4C14.3 16 18.8 13 24 13c3.3 0 6.3 1.2 8.6 3.2l6.4-6.4C34.9 3.7 29.8 1.5 24 1.5 16.5 1.5 10 5.6 6.4 11.6c-.4.9-.7 1.8-1.1 2.7z"/>
                  <path fill="#FBBC05" d="M24 46.5c5.8 0 11.2-2.1 15.3-5.8l-7.1-6c-2 1.4-4.6 2.3-8.2 2.3-5.9 0-11-4-12.8-9.4l-7.4 5.7c3.6 6.8 10.8 11.2 20.2 11.2z"/>
                  <path fill="#EA4335" d="M46.5 24c0-1.4-.2-2.7-.5-4H24v8.5h11.8c-.5 2.6-2.1 4.9-4.4 6.4l7.1 6c4.1-3.8 6.5-9.5 6.5-16.9z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" />
                <span className="text-[#3a3a3a] text-xs tracking-wide">OR</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" />
              </div>

              {/* Email Form */}
              {mode === 'forgot' ? (
                /* Forgot password — email only */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold tracking-[0.08em] text-[#555] uppercase mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl bg-[#0D0D0D] border border-[rgba(255,255,255,0.06)] px-4 py-[13px] pl-11 text-[14px] text-white placeholder:text-[#333] focus:border-[rgba(45,212,191,0.35)] focus:shadow-[0_0_0_3px_rgba(45,212,191,0.06)] focus:outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="name@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#2DD4BF] px-4 py-3.5 text-[15px] font-bold text-[#080808] hover:bg-[#29bfac] active:scale-[0.99] transition-all mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name (signup only) */}
                  {mode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold tracking-[0.08em] text-[#555] uppercase mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl bg-[#0D0D0D] border border-[rgba(255,255,255,0.06)] px-4 py-[13px] pl-11 text-[14px] text-white placeholder:text-[#333] focus:border-[rgba(45,212,191,0.35)] focus:shadow-[0_0_0_3px_rgba(45,212,191,0.06)] focus:outline-none transition-all"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          placeholder="Shantanu Sharma"
                          autoComplete="name"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold tracking-[0.08em] text-[#555] uppercase mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoFocus={mode === 'login'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl bg-[#0D0D0D] border border-[rgba(255,255,255,0.06)] px-4 py-[13px] pl-11 text-[14px] text-white placeholder:text-[#333] focus:border-[rgba(45,212,191,0.35)] focus:shadow-[0_0_0_3px_rgba(45,212,191,0.06)] focus:outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="name@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold tracking-[0.08em] text-[#555] uppercase mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl bg-[#0D0D0D] border border-[rgba(255,255,255,0.06)] px-4 py-[13px] pl-11 pr-11 text-[14px] text-white placeholder:text-[#333] focus:border-[rgba(45,212,191,0.35)] focus:shadow-[0_0_0_3px_rgba(45,212,191,0.06)] focus:outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="••••••••"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        minLength={mode === 'signup' ? 6 : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-white transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot password link */}
                  {mode === 'login' && (
                    <div className="text-right -mt-1">
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs text-[#444] hover:text-[#2DD4BF] transition-colors"
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
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.06)] p-3 text-xs text-[#ef4444]"
                      >
                        <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full shrink-0" />
                        <span className="min-w-0 break-words">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#2DD4BF] px-4 py-3.5 text-[15px] font-bold text-[#080808] hover:bg-[#29bfac] active:scale-[0.99] transition-all mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Start for Free'} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Switch mode */}
              <div className="text-center mt-5">
                {mode === 'login' && (
                  <p className="text-xs text-[#3a3a3a]">
                    New to Somyra?{' '}
                    <span
                      onClick={() => switchMode('signup')}
                      className="text-[#2DD4BF] cursor-pointer hover:underline"
                    >
                      Create a free account
                    </span>
                  </p>
                )}
                {mode === 'signup' && (
                  <div>
                    <p className="text-xs text-[#3a3a3a]">
                      Already have an account?{' '}
                      <span
                        onClick={() => switchMode('login')}
                        className="text-[#2DD4BF] cursor-pointer hover:underline"
                      >
                        Sign in
                      </span>
                    </p>
                    <p className="text-[11px] text-[#2a2a2a] mt-4">
                      By continuing you agree to our{' '}
                      <a href="/terms" className="hover:text-[#555] transition-colors">Terms</a>
                      {' '}and{' '}
                      <a href="/privacy" className="hover:text-[#555] transition-colors">Privacy Policy</a>
                    </p>
                  </div>
                )}
                {mode === 'forgot' && (
                  <button
                    onClick={() => switchMode('login')}
                    className="text-xs text-[#444] hover:text-[#2DD4BF] transition-colors font-medium"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
