import { supabase } from '../lib/supabase';

/**
 * Updates the display name for a user in the profiles table.
 */
export async function updateDisplayName(
  userId: string,
  displayName: string
): Promise<{ success: boolean, error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating display name:', error);
    return { 
      success: false, 
      error: 'Failed to update name' 
    };
  }
}

/**
 * Updates the user's daily streak count.
 * Logic:
 * - If last_active_today: no change.
 * - If last_active_yesterday: increment streak.
 * - Otherwise: reset streak to 1.
 */
export async function updateStreak(
  userId: string
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('streak_count, last_active_date')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) return;

    const lastActive = profile.last_active_date;
    let newStreak = profile.streak_count || 0;

    if (lastActive === today) {
      // Already active today, no change
      return;
    } else if (lastActive === yesterday) {
      // Consecutive day, increment streak
      newStreak = newStreak + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    await supabase
      .from('profiles')
      .update({
        streak_count: newStreak,
        last_active_date: today,
        streak_updated_at: new Date().toISOString()
      })
      .eq('id', userId);

  } catch (error) {
    // Never block generation due to streak error
    console.error('Streak update error:', error);
  }
}
