import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

const RARITY_STYLES = {
  common: {
    bg: 'from-slate-100 to-slate-200',
    border: 'border-slate-400',
    badge: 'bg-slate-200 text-slate-800',
    glow: 'shadow-slate-300'
  },
  uncommon: {
    bg: 'from-green-100 to-emerald-200',
    border: 'border-green-500',
    badge: 'bg-green-300 text-green-900',
    glow: 'shadow-green-400'
  },
  rare: {
    bg: 'from-blue-100 to-blue-200',
    border: 'border-blue-500',
    badge: 'bg-blue-300 text-blue-900',
    glow: 'shadow-blue-400'
  },
  legendary: {
    bg: 'from-purple-100 to-purple-200',
    border: 'border-purple-500',
    badge: 'bg-purple-300 text-purple-900',
    glow: 'shadow-purple-400'
  }
};

export default function MuseumItem({ item, description, index }) {
  const [showDetails, setShowDetails] = useState(false);
  const styles = RARITY_STYLES[item.rarity];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
      >
        <Card 
          className={`relative overflow-hidden bg-gradient-to-br ${styles.bg} border-3 ${styles.border} hover:shadow-xl cursor-pointer transition-all ${styles.glow}`}
          onClick={() => setShowDetails(true)}
        >
          {/* Shimmer effect for legendary */}
          {item.rarity === 'legendary' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          )}

          {/* Pedestal base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg opacity-60" />
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gradient-to-b from-amber-800 to-amber-950 rounded-t-md opacity-60" />

          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-start justify-between">
              <Badge className={`${styles.badge} capitalize font-bold`}>
                {item.rarity}
              </Badge>
              <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </div>
          </CardHeader>

          <CardContent className="relative z-10 text-center pb-8">
            {/* Item Display */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-7xl mb-4 drop-shadow-2xl"
              style={{
                filter: item.rarity === 'legendary' ? 'drop-shadow(0 0 20px rgba(168,85,247,0.8))' :
                       item.rarity === 'rare' ? 'drop-shadow(0 0 15px rgba(59,130,246,0.6))' :
                       item.rarity === 'uncommon' ? 'drop-shadow(0 0 10px rgba(34,197,94,0.4))' : 'none'
              }}
            >
              {item.emoji}
            </motion.div>

            {/* Item Info */}
            <h3 className="font-bold text-xl mb-2 text-gray-900">{item.name}</h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-amber-700">
                ${item.value.toLocaleString()}
              </span>
            </div>

            {/* Sparkles for rare items */}
            {(item.rarity === 'legendary' || item.rarity === 'rare') && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-16 right-6"
              >
                <Sparkles className={`w-5 h-5 ${item.rarity === 'legendary' ? 'text-purple-500' : 'text-blue-500'}`} />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center mb-4">
              <div className="text-8xl mb-4">{item.emoji}</div>
              <DialogTitle className="text-2xl font-bold">{item.name}</DialogTitle>
              <Badge className={`mt-2 ${styles.badge} capitalize font-bold`}>
                {item.rarity}
              </Badge>
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <p className="text-gray-700 text-center italic">
              "{description}"
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500">Value</p>
                <p className="text-xl font-bold text-amber-600">
                  ${item.value.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Rarity</p>
                <p className="text-xl font-bold capitalize">
                  {item.rarity}
                </p>
              </div>
            </div>

            {item.rarity === 'legendary' && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 text-center">
                <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-purple-900">
                  Legendary Item - The rarest of all treasures!
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}