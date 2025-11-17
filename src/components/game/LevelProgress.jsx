import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LevelProgress({ level, xp, xpForNextLevel, xpProgress }) {
  return (
    <Card className="mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300">
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          {/* Level Display */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-md opacity-50"
              />
              <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="text-base font-bold text-indigo-900">Level {level}</span>
              </div>
              <div className="text-xs text-indigo-700">
                {xp} / {xpForNextLevel} XP
              </div>
            </div>
          </div>

          {/* Progress Bar - thicker with text inside */}
          <div className="flex-1 relative">
            <div className="relative h-8 bg-white/60 rounded-full overflow-hidden border-2 border-indigo-200">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${xpProgress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-900 drop-shadow">
                  {Math.round(xpProgress)}% to Level {level + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}