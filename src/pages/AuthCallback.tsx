import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, handleGoogleAuthUser } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await handleGoogleAuthUser();
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-5 h-5 border-2 border-[#2DD4BF] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#555] text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
