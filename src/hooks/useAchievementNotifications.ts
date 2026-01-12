import { useCallback } from 'react';
import { 
  triggerLevelUpConfetti, 
  triggerBadgeConfetti, 
  triggerStreakConfetti,
  triggerPerfectDayConfetti 
} from '@/components/Gamification/AchievementNotification';

export function useAchievementNotifications() {
  const celebrateLevelUp = useCallback((level: number) => {
    triggerLevelUpConfetti(level);
  }, []);

  const celebrateBadge = useCallback(() => {
    triggerBadgeConfetti();
  }, []);

  const celebrateStreak = useCallback((streak: number) => {
    triggerStreakConfetti(streak);
  }, []);

  const celebratePerfectDay = useCallback(() => {
    triggerPerfectDayConfetti();
  }, []);

  return {
    celebrateLevelUp,
    celebrateBadge,
    celebrateStreak,
    celebratePerfectDay,
  };
}
