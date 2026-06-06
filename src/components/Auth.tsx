import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 dl:pb-[5vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[rgba(8,8,8,0.85)] backdrop-blur-[8px]"
        onClick={onClose}
      />

      <motion.div
        key={mode}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
        className="relative w-full max-w-[420px] rounded-[24px] bg-bg-card/80 backdrop-blur-xl border border-white/5 shadow-premium mx-auto"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute z-10 top-5 right-5 p-2 hover:bg-white/5 rounded-full text-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="max-h-[85vh] overflow-y-auto overscroll-contain p-6 md:p-8">
        <AnimatePresence mode="wait">
          {mode === 'check_email' ? (
            <motion.div
              key="check_email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-bg-sidebar flex items-center justify-center border border-border-card">
                  <CheckCircle2 className="w-7 h-7 text-teal-accent" />
                </div>
                <h2 className="text-white font-bold text-2xl tracking-tight">Check your inbox</h2>
                <p className="text-sm text-muted max-w-[280px]">
                  We sent a confirmation link to <span className="text-white">{email}</span>. Click it to activate your account.
                </p>
                <p className="text-xs text-[#555]">
                  Once confirmed, come back and sign in.
                </p>
              </div>
              <button
                onClick={() => switchMode('login')}
                className="btn-gradient w-full"
              >
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          ) : resetSent && mode === 'forgot' ? (
            <motion.div
              key="reset_sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-bg-sidebar flex items-center justify-center border border-border-card">
                  <CheckCircle2 className="w-7 h-7 text-teal-accent" />
                </div>
                <h2 className="text-white font-bold text-2xl tracking-tight">Check your inbox</h2>
                <p className="text-sm text-muted max-w-[280px]">
                  Password reset link sent to <span className="text-white">{email}</span>.
                </p>
              </div>
              <button
                onClick={() => switchMode('login')}
                className="btn-gradient w-full"
              >
                Back to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          ) : (
            <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <svg className="w-6 h-6 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-2xl tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-muted text-sm mt-1.5">
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
                className="btn-secondary w-full"
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
                <div className="flex-1 h-px bg-border-card" />
                <span className="text-[#555] text-xs tracking-wide">OR</span>
                <div className="flex-1 h-px bg-border-card" />
              </div>

              {/* Email Form */}
              {mode === 'forgot' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="type-overline text-muted block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full mt-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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
                      <label className="type-overline text-muted block mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-field"
                        placeholder="Shantanu Sharma"
                        autoComplete="name"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="type-overline text-muted block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus={mode === 'login'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="type-overline text-muted block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field pr-12"
                        placeholder="••••••••"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        minLength={mode === 'signup' ? 6 : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
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
                        className="text-xs text-muted hover:text-teal-accent transition-colors"
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
                        className="rounded-2xl bg-red-500/5 border border-red-500/10 p-3"
                      >
                        <p className="text-xs text-red-400 text-center">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full mt-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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
                  <p className="text-xs text-muted/60">
                    New to Somyra?{' '}
                    <span
                      onClick={() => switchMode('signup')}
                      className="text-teal-accent cursor-pointer hover:underline"
                    >
                      Create a free account
                    </span>
                  </p>
                )}
                {mode === 'signup' && (
                  <div>
                    <p className="text-xs text-muted/60">
                      Already have an account?{' '}
                      <span
                        onClick={() => switchMode('login')}
                        className="text-teal-accent cursor-pointer hover:underline"
                      >
                        Sign in
                      </span>
                    </p>
                    <p className="text-[11px] text-[#555] mt-4">
                      By continuing you agree to our{' '}
                      <a href="/terms" className="hover:text-muted transition-colors">Terms</a>
                      {' '}and{' '}
                      <a href="/privacy" className="hover:text-muted transition-colors">Privacy Policy</a>
                    </p>
                  </div>
                )}
                {mode === 'forgot' && (
                  <button
                    onClick={() => switchMode('login')}
                    className="text-xs text-muted hover:text-teal-accent transition-colors font-medium"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
