import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock as LockIcon, Loader2, Rocket, ArrowRight, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'signup' | 'forgot' | 'check_email';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onClose?: () => void;
}

export default function Auth({ onAuthSuccess, onClose }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
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
          // Provide friendlier messages for common errors
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
        // If session is immediately available, email confirmation is disabled — log in directly
        if (data.session && data.user) {
          onAuthSuccess(data.user);
          if (onClose) onClose();
        } else {
          // Email confirmation required
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

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Reset password' : 'Check your inbox';
  const subtitle = mode === 'login'
    ? 'Sign in to continue building your personal brand with AI.'
    : mode === 'signup'
    ? 'Join thousands of professionals growing their presence on LinkedIn.'
    : mode === 'forgot'
    ? 'Enter your email and we\'ll send you a reset link.'
    : `We sent a confirmation link to ${email}. Click it to activate your account.`;

  return (
    <div className="overlay-shell font-sans overflow-y-auto">
      <div className="overlay-backdrop" onClick={onClose} />
      <motion.div
        key={mode}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative h-full w-full min-w-0 border-none bg-[#121216] shadow-2xl md:my-auto md:h-auto md:max-w-[440px] md:rounded-[2rem] md:border md:border-white/5 lg:rounded-[2.5rem]"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-5 top-5 md:right-6 md:top-6 p-2 text-slate-500 hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="max-h-full md:max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <div className="p-5 md:p-[28px] lg:p-[32px]">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-teal-accent/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative flex items-center justify-center w-10 h-10 bg-[#080808] rounded-xl border border-white/10">
                  <svg className="w-6 h-6 text-teal-accent" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none">Somyra</span>
                <span className="text-[8px] text-muted font-bold tracking-widest mt-1 uppercase">ELEVATED</span>
              </div>
            </div>

            <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mb-10 max-w-[320px] text-sm leading-7 text-muted">{subtitle}</p>

            {/* Check email confirmation state */}
            <AnimatePresence mode="wait">
              {mode === 'check_email' ? (
                <motion.div
                  key="check_email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-teal-accent" />
                    </div>
                    <p className="text-sm text-muted max-w-[280px]">
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
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div className="w-16 h-16 bg-teal-accent/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-teal-accent" />
                    </div>
                    <p className="text-sm text-muted max-w-[280px]">
                      Password reset link sent to <span className="text-white font-semibold">{email}</span>. Check your inbox.
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
                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <input
                          type="email"
                          required
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field pl-12"
                          placeholder="name@company.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Password (hidden in forgot mode) */}
                    {mode !== 'forgot' && (
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted ml-1">
                          Password
                        </label>
                        <div className="relative">
                          <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-12 pr-12"
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
                        {mode === 'signup' && (
                          <p className="text-[10px] text-muted ml-1">Minimum 6 characters</p>
                        )}
                      </div>
                    )}

                    {/* Forgot password link (login only) */}
                    {mode === 'login' && (
                      <div className="text-right -mt-2">
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-[11px] text-muted hover:text-teal-accent transition-colors font-semibold"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex min-w-0 items-center gap-3 rounded-2xl border border-red-500/10 bg-red-500/5 p-4 text-xs text-red-400"
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
                      className="w-full btn-gradient mt-4"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch mode */}
                  <div className="text-center space-y-2">
                    {mode === 'login' && (
                      <button
                        onClick={() => switchMode('signup')}
                        className="text-muted hover:text-teal-accent text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        New to Somyra? Create account
                      </button>
                    )}
                    {mode === 'signup' && (
                      <button
                        onClick={() => switchMode('login')}
                        className="text-muted hover:text-teal-accent text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        Already have an account? Sign in
                      </button>
                    )}
                    {mode === 'forgot' && (
                      <button
                        onClick={() => switchMode('login')}
                        className="text-muted hover:text-teal-accent text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        ← Back to Sign In
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer strip */}
          <div className="flex items-center gap-5 border-t border-white/5 bg-white/5 p-6 md:p-8">
            <div className="w-12 h-12 bg-teal-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6 text-teal-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Premium Access</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">Unlock all AI features and save your content.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
