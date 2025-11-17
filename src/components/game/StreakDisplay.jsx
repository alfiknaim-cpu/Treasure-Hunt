import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Award } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function StreakDisplay({ streak, bestStreak }) {
  if (streak === 0) return null;

  const getStreakTier = () => {
    if (streak >= 20) return { color: 'from-red-500 to-orange-500', label: 'LEGENDARY', icon: '👑' };
    if (streak >= 10) return { color: 'from-purple-500 to-pink-500', label: 'AMAZING', icon: '⭐' };
    if (streak >= 5) return { color: 'from-blue-500 to-cyan-500', label: 'GREAT', icon: '🎯' };
    return { color: 'from-green-500 to-emerald-500', label: 'GOOD', icon: '✓' };
  };

  const tier = getStreakTier();

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed top-44 right-6 z-40"
    >
      <div className={`bg-gradient-to-r ${tier.color} px-3 py-2 rounded-lg shadow-lg border-2 border-white`}>
        <div className="flex items-center gap-2">
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity
            }}
            className="text-xl"
          >
            {tier.icon}
          </motion.div>

          {/* Streak Info */}
          <div className="text-white">
            <div className="flex items-center gap-1.5">
              <Target className="w-3 h-3" />
              <span className="text-xs font-bold uppercase">{tier.label}</span>
            </div>
            <div className="text-xl font-black">{streak} Streak</div>
          </div>
        </div>

        {/* Best Streak */}
        {bestStreak > streak && (
          <div className="mt-1 text-center text-white text-xs opacity-80">
            <Award className="w-2.5 h-2.5 inline mr-1" />
            Best: {bestStreak}
          </div>
        )}

        {/* Bonus notification - smaller */}
        {streak > 0 && streak % 5 === 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-1.5 bg-yellow-400 text-yellow-900 rounded px-2 py-1 text-center font-bold text-xs"
          >
            🎁 +{streak * 10} XP!
          </motion.div>
        )}
      </div>

      {/* Smaller celebration particles */}
      {streak > 0 && streak % 5 === 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 1,
                opacity: 1,
                rotate: 0
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 80,
                y: (Math.random() - 0.5) * 80,
                scale: 0,
                opacity: 0,
                rotate: 360
              }}
              transition={{ 
                duration: 1,
                delay: i * 0.05
              }}
              style={{
                left: '50%',
                top: '50%'
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}