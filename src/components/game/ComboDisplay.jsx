import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Star } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

export default function ComboDisplay({ combo, multiplier, timeLeft, maxTime }) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (combo > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  }, [combo]);

  if (combo === 0) return null;

  const getComboColor = () => {
    if (combo >= 10) return 'from-orange-500 to-red-500';
    if (combo >= 5) return 'from-purple-500 to-pink-500';
    if (combo >= 3) return 'from-blue-500 to-indigo-500';
    return 'from-green-500 to-emerald-500';
  };

  const getComboIcon = () => {
    if (combo >= 10) return <Flame className="w-5 h-5" />;
    if (combo >= 5) return <Star className="w-5 h-5" />;
    return <Zap className="w-4 h-4" />;
  };

  const timeProgress = (timeLeft / maxTime) * 100;

  return (
    <motion.div
      initial={{ scale: 0, y: -50 }}
      animate={{ 
        scale: shake ? [1, 1.15, 1] : 1,
        y: 0,
        rotate: shake ? [0, -3, 3, 0] : 0
      }}
      exit={{ scale: 0, y: -50 }}
      className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className={`bg-gradient-to-r ${getComboColor()} px-4 py-3 rounded-xl shadow-xl border-2 border-white`}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: combo >= 10 ? [0, 360] : 0,
              scale: combo >= 5 ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5, repeat: Infinity }
            }}
            className="text-white"
          >
            {getComboIcon()}
          </motion.div>

          {/* Combo Text */}
          <div>
            <div className="flex items-center gap-2">
              <motion.div
                key={combo}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-black text-white drop-shadow-lg"
              >
                {combo}
              </motion.div>
              <div className="text-white">
                <div className="text-base font-bold">COMBO</div>
                <Badge className="bg-white/30 text-white border-0 text-xs">
                  ×{multiplier.toFixed(1)} Coins
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="mt-2 bg-white/30 rounded-full overflow-hidden h-1.5">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '100%' }}
            animate={{ width: `${timeProgress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        {/* Special Messages - smaller */}
        <AnimatePresence>
          {combo === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mt-1 text-white font-bold text-xs"
            >
              🔥 FIRE!
            </motion.div>
          )}
          {combo === 10 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mt-1 text-white font-bold text-xs"
            >
              💥 MEGA!
            </motion.div>
          )}
          {combo >= 15 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.05, 1],
              }}
              transition={{ scale: { duration: 0.5, repeat: Infinity } }}
              className="text-center mt-1 text-white font-black text-sm"
            >
              🌟 LEGENDARY! 🌟
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smaller particle effects for high combos */}
      {combo >= 10 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 1,
                opacity: 1
              }}
              animate={{ 
                x: Math.cos(i * 60 * Math.PI / 180) * 60,
                y: Math.sin(i * 60 * Math.PI / 180) * 60,
                scale: 0,
                opacity: 0
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
              style={{
                left: '50%',
                top: '50%'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}