import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface AchievementNotificationProps {
  type: 'level_up' | 'badge' | 'streak' | 'perfect_day';
  data?: {
    level?: number;
    badgeName?: string;
    badgeIcon?: string;
    streak?: number;
  };
  onComplete?: () => void;
}

export const triggerConfetti = (type: 'level_up' | 'badge' | 'streak' | 'perfect_day') => {
  const colors = {
    level_up: ['#FFD700', '#FFA500', '#FF6B6B', '#00D9FF'],
    badge: ['#9945FF', '#00D9FF', '#FFD700', '#00D084'],
    streak: ['#FF6B6B', '#FFA500', '#FFD60A'],
    perfect_day: ['#00D084', '#00D9FF', '#FFD700', '#9945FF'],
  };

  const particleCount = type === 'level_up' ? 200 : type === 'perfect_day' ? 150 : 100;
  const spread = type === 'level_up' ? 100 : 70;
  
  // Initial burst
  confetti({
    particleCount,
    spread,
    origin: { y: 0.6 },
    colors: colors[type],
    shapes: ['circle', 'square'],
    scalar: 1.2,
    gravity: 1.2,
    drift: 0,
    ticks: 200,
  });

  // Side bursts for level up
  if (type === 'level_up') {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors[type],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors[type],
      });
    }, 400);
  }

  // Stars for perfect day
  if (type === 'perfect_day') {
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 360,
        startVelocity: 30,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FFD700'],
        shapes: ['star'],
        scalar: 1.5,
      });
    }, 300);
  }
};

export const triggerLevelUpConfetti = (level: number) => {
  triggerConfetti('level_up');
  
  // Extra confetti for milestone levels
  if (level % 10 === 0) {
    setTimeout(() => triggerConfetti('level_up'), 500);
  }
};

export const triggerBadgeConfetti = () => {
  triggerConfetti('badge');
};

export const triggerStreakConfetti = (streak: number) => {
  triggerConfetti('streak');
  
  // Extra for big streaks
  if (streak >= 30) {
    setTimeout(() => triggerConfetti('streak'), 300);
  }
};

export const triggerPerfectDayConfetti = () => {
  triggerConfetti('perfect_day');
};

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  type, 
  data, 
  onComplete 
}) => {
  const fireConfetti = useCallback(() => {
    switch (type) {
      case 'level_up':
        triggerLevelUpConfetti(data?.level || 1);
        break;
      case 'badge':
        triggerBadgeConfetti();
        break;
      case 'streak':
        triggerStreakConfetti(data?.streak || 1);
        break;
      case 'perfect_day':
        triggerPerfectDayConfetti();
        break;
    }
  }, [type, data]);

  useEffect(() => {
    fireConfetti();
    
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [fireConfetti, onComplete]);

  return null; // This component just triggers confetti, no visual output
};

export default AchievementNotification;
