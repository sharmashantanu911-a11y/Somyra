import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export type FeatureKey = 'profile_audit' | 'topic_generator' | 'post_writer' | 'smart_outreach' | 'bio_headline' | 'voice_profile' | 'saved_items';

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
};

// ─────────────────────────────────────────────────────
//  SOURCE OF TRUTH — Tier Definitions
//  Voice Profile & Saved Library are CUMULATIVE caps
//  (never reset monthly). All others are monthly.
// ─────────────────────────────────────────────────────
const TIER_LIMITS: Record<string, TierLimits> = {
  guest: {
    profile_audit: 0,
    topic_generator: 0,
    post_writer: 0,
    smart_outreach: 0,
    bio_headline: 0,
    voice_cap: 0,
    save_cap: 0,
  },
  free: {
    profile_audit: 5,
    topic_generator: 3,      // 3 generations of 10 topics = 30 topics
    post_writer: 10,
    smart_outreach: 10,
    bio_headline: 10,
    voice_cap: 5,    // cumulative slot cap, never resets
    save_cap: 10,    // cumulative cap, never resets
  },
  pro: {
    profile_audit: 30,
    topic_generator: 'unlimited',
    post_writer: 60,
    smart_outreach: 500,
    bio_headline: 'unlimited',
    voice_cap: 10,   // cumulative slot cap, never resets
    save_cap: 200,   // cumulative cap, never resets
  },
  max: {
    profile_audit: 'unlimited', 
    topic_generator: 'unlimited',
    post_writer: 'unlimited',
    smart_outreach: 1000,
    bio_headline: 'unlimited',
    voice_cap: 20,   // cumulative slot cap, never resets
    save_cap: 'unlimited',
  }
};

// Timezone-safe period start: always returns YYYY-MM-01 in local time
function getPeriodStart(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

export function useUsageLimits(user: any, isPro: boolean, isMax: boolean) {
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const userRef = useRef(user);
  userRef.current = user;

  const getTier = useCallback((): string => {
    if (!user) return 'guest';
    if (isMax) return 'max';
    if (isPro) return 'pro';
    return 'free';
  }, [user, isPro, isMax]);

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setUsage({});
      setLoading(false);
      return;
    }

    try {
      const periodStart = getPeriodStart();
      
      // Batch all usage queries in parallel
      const [genResponse, voiceResponse, savedResponse] = await Promise.all([
        supabase
          .from('generation_counts')
          .select('feature, count')
          .eq('user_id', user.id)
          .eq('period_start', periodStart),
        supabase
          .from('voice_profile')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('saved_items')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      if (genResponse.error) console.error('[UsageLimits] gen error:', genResponse.error);
      if (voiceResponse.error) console.error('[UsageLimits] voice error:', voiceResponse.error);
      if (savedResponse.error) console.error('[UsageLimits] saved error:', savedResponse.error);

      const usageMap: Record<string, number> = {};
      
      // Map monthly generation counts
      if (genResponse.data) {
        genResponse.data.forEach(row => {
          usageMap[row.feature] = row.count;
        });
      }

      // Add cumulative counts
      usageMap['voice_profile'] = voiceResponse.count || 0;
      usageMap['saved_items'] = savedResponse.count || 0;

      setUsage(usageMap);
    } catch (err) {
      console.error('[UsageLimits] fetchUsage exception:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const getLimitForFeature = useCallback((feature: FeatureKey): number | 'unlimited' => {
    const tier = getTier();
    const tierLimits = TIER_LIMITS[tier];
    if (!tierLimits) return 0;
    if (feature === 'voice_profile') return tierLimits.voice_cap;
    if (feature === 'saved_items') return tierLimits.save_cap;
    return (tierLimits as any)[feature] ?? 0;
  }, [getTier]);

  const checkLimit = useCallback((feature: FeatureKey): boolean => {
    const tier = getTier();
    const limit = getLimitForFeature(feature);
    if (limit === 'unlimited') return true;
    if (tier === 'guest') return false;
    const used = usage[feature] || 0;
    return used < (limit as number);
  }, [getTier, getLimitForFeature, usage]);

  // =====================================================
  // Optimistic increment — updates UI FIRST, then DB.
  // =====================================================
  const incrementUsage = useCallback(async (feature: FeatureKey, count: number = 1) => {
    const tier = getTier();
    if (tier === 'guest') return;
    if (feature === 'voice_profile') return;

    // STEP 1: Optimistic state update
    setUsage(prev => {
      const currentUsed = prev[feature] || 0;
      const newUsed = currentUsed + count;
      console.log(`[UsageLimits] OPTIMISTIC UPDATE: ${feature} ${currentUsed} -> ${newUsed}`);
      return { ...prev, [feature]: newUsed };
    });

    // STEP 2: Persist to DB in background
    const currentUser = userRef.current;
    if (!currentUser) return;

    try {
      const periodStart = getPeriodStart();

      const { data: existing, error: fetchErr } = await supabase
        .from('generation_counts')
        .select('id, count')
        .eq('user_id', currentUser.id)
        .eq('feature', feature)
        .eq('period_start', periodStart)
        .maybeSingle();

      if (fetchErr) {
        console.error(`[UsageLimits] DB SELECT failed for ${feature}:`, JSON.stringify(fetchErr));
        return;
      }

      if (existing) {
        const updatedCount = (existing.count || 0) + count;
        const { error: updateErr } = await supabase
          .from('generation_counts')
          .update({ count: updatedCount })
          .eq('id', existing.id);
        if (updateErr) {
          console.error(`[UsageLimits] DB UPDATE failed for ${feature}:`, JSON.stringify(updateErr));
        }
      } else {
        const { error: insertErr } = await supabase
          .from('generation_counts')
          .insert({
            user_id: currentUser.id,
            feature,
            count: count,
            period_start: periodStart
          });
        if (insertErr) {
          console.error(`[UsageLimits] DB INSERT failed for ${feature}:`, JSON.stringify(insertErr));
        }
      }
    } catch (err) {
      console.error(`[UsageLimits] DB sync exception for ${feature}:`, err);
    }
  }, [getTier]);

  const getStatus = useCallback((feature: FeatureKey): UsageStatus => {
    const limit = getLimitForFeature(feature);
    const used = usage[feature] || 0;
    if (limit === 'unlimited') {
      return { used, limit, remaining: Infinity, isLimitReached: false };
    }
    const remaining = Math.max(0, (limit as number) - used);
    return {
      used,
      limit,
      remaining,
      isLimitReached: used >= (limit as number)
    };
  }, [getLimitForFeature, usage]);

  const getRemainingCount = useCallback((feature: FeatureKey): number => {
    const limit = getLimitForFeature(feature);
    if (limit === 'unlimited') return Infinity;
    const used = usage[feature] || 0;
    return Math.max(0, (limit as number) - used);
  }, [getLimitForFeature, usage]);

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

  const getLifetimeStats = useCallback(async (): Promise<Record<string, number>> => {
    if (!user) return {};
    try {
      const { data, error } = await supabase
        .from('generation_counts')
        .select('feature, count')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const lifetimeMap: Record<string, number> = {};
      if (data) {
        data.forEach(row => {
          lifetimeMap[row.feature] = (lifetimeMap[row.feature] || 0) + row.count;
        });
      }
      return lifetimeMap;
    } catch (err) {
      console.error('[UsageLimits] getLifetimeStats error:', err);
      return {};
    }
  }, [user]);

  return {
    checkLimit,
    incrementUsage,
    getRemainingCount,
    getLimitForFeature,
    getResetDate,
    getStatus,
    getVoiceProfileLimit,
    getSavedLibraryLimit,
    getLifetimeStats,
    isLoading: loading,
    tier: getTier(),
    refetch: fetchUsage
  };
}
