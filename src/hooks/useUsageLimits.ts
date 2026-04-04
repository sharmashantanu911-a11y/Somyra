import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type FeatureKey = 'profile_audit' | 'topic_generator' | 'post_writer' | 'smart_outreach' | 'bio_headline' | 'voice_profile';

export interface UsageStatus {
  used: number;
  limit: number | 'unlimited';
  remaining: number;
  isLimitReached: boolean;
}

type TierLimits = {
  profile_audit: number | 'unlimited';
  topic_generator: number | 'unlimited';
  post_writer: number | 'unlimited';
  smart_outreach: number | 'unlimited';
  bio_headline: number | 'unlimited';
  voice_cap: number | 'unlimited';
  save_cap: number | 'unlimited';
  total?: number;
};

const TIER_LIMITS: Record<string, TierLimits> = {
  guest: {
    total: 5,
    profile_audit: 5,
    topic_generator: 5,
    post_writer: 5,
    smart_outreach: 5,
    bio_headline: 5,
    voice_cap: 3,
    save_cap: 5,
  },
  free: {
    profile_audit: 5,
    topic_generator: 30, // 30 topics
    post_writer: 10,
    smart_outreach: 10,
    bio_headline: 10, // Not explicitly requested but matching the previous pattern
    voice_cap: 5,
    save_cap: 10,
  },
  pro: {
    profile_audit: 30,
    topic_generator: 'unlimited',
    post_writer: 60,
    smart_outreach: 500,
    bio_headline: 'unlimited',
    voice_cap: 10,
    save_cap: 200,
  },
  max: {
    profile_audit: 'unlimited',
    topic_generator: 'unlimited',
    post_writer: 'unlimited',
    smart_outreach: 1000,
    bio_headline: 'unlimited',
    voice_cap: 20,
    save_cap: 'unlimited',
  }
};

export function useUsageLimits(user: any, isPro: boolean, isMax: boolean) {
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(0);

  const getTier = useCallback(() => {
    if (!user) return 'guest';
    if (isMax) return 'max';
    if (isPro) return 'pro';
    return 'free';
  }, [user, isPro, isMax]);

  const getPeriodStart = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  };

  const fetchUsage = useCallback(async () => {
    if (!user) {
      const stored = localStorage.getItem('somyra_guest_generations_used');
      setGuestCount(stored ? parseInt(stored) : 0);
      setLoading(false);
      return;
    }

    try {
      const periodStart = getPeriodStart();
      const { data, error } = await supabase
        .from('generation_counts')
        .select('feature, count')
        .eq('user_id', user.id)
        .eq('period_start', periodStart);

      if (error) throw error;

      const usageMap: Record<string, number> = {};
      data?.forEach(row => {
        usageMap[row.feature] = row.count;
      });
      setUsage(usageMap);
    } catch (err) {
      console.error('Error fetching usage limits:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const getLimitForFeature = (feature: FeatureKey): number | 'unlimited' => {
    const tier = getTier();
    const tierLimits = TIER_LIMITS[tier];
    if (!tierLimits) return 5;
    if (feature === 'voice_profile') return tierLimits.voice_cap;
    if (tier === 'guest') return tierLimits.total ?? 5;
    return tierLimits[feature] ?? 5;
  };

  const checkLimit = (feature: FeatureKey): boolean => {
    const tier = getTier();
    const limit = getLimitForFeature(feature);
    if (limit === 'unlimited') return true;
    const used = tier === 'guest' ? guestCount : (usage[feature] || 0);
    return used < (limit as number);
  };

  const incrementUsage = async (feature: FeatureKey, count: number = 1) => {
    const tier = getTier();

    if (tier === 'guest') {
      const newCount = guestCount + count;
      setGuestCount(newCount);
      localStorage.setItem('somyra_guest_generations_used', newCount.toString());
      return;
    }

    // voice_profile is tracked via voicePosts array length, not generation_counts
    if (feature === 'voice_profile') return;

    try {
      const periodStart = getPeriodStart();
      const currentUsed = usage[feature] || 0;
      const newUsed = currentUsed + count;

      const { error } = await supabase
        .from('generation_counts')
        .upsert({
          user_id: user.id,
          feature,
          count: newUsed,
          period_start: periodStart,
          reset_date: periodStart,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,feature,period_start' });

      if (error) throw error;
      setUsage(prev => ({ ...prev, [feature]: newUsed }));
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  const getRemainingCount = (feature: FeatureKey): number => {
    const limit = getLimitForFeature(feature);
    if (limit === 'unlimited') return Infinity;
    const used = getTier() === 'guest' ? guestCount : (usage[feature] || 0);
    return Math.max(0, (limit as number) - used);
  };

  const getStatus = (feature: FeatureKey): UsageStatus => {
    const limit = getLimitForFeature(feature);
    const tier = getTier();
    const used = tier === 'guest' ? guestCount : (usage[feature] || 0);
    const remaining = limit === 'unlimited' ? Infinity : Math.max(0, (limit as number) - used);
    return {
      used,
      limit,
      remaining,
      isLimitReached: limit === 'unlimited' ? false : used >= (limit as number)
    };
  };

  const getResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `Resets on ${monthNames[nextMonth.getMonth()]} 1st`;
  };

  const getVoiceProfileLimit = (): number | 'unlimited' => {
    const tier = getTier();
    return TIER_LIMITS[tier]?.voice_cap ?? 5;
  };

  const getSavedLibraryLimit = (): number | 'unlimited' => {
    const tier = getTier();
    return TIER_LIMITS[tier]?.save_cap ?? 10;
  };

  return {
    checkLimit,
    incrementUsage,
    getRemainingCount,
    getLimitForFeature,
    getResetDate,
    getStatus,
    getVoiceProfileLimit,
    getSavedLibraryLimit,
    isLoading: loading,
    tier: getTier()
  };
}
