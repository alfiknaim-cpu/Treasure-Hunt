import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon } from 'lucide-react';
import { getMapForLevel } from './gameLogic';

const RARITY_CONFIG = {
  common: { 
    detectionRadius: 90, 
    clickRadius: 45,
    glowColor: 'rgba(100,200,100,0.4)',
    borderColor: '#94a3b8'
  },
  uncommon: { 
    detectionRadius: 70, 
    clickRadius: 35,
    glowColor: 'rgba(34,197,94,0.5)',
    borderColor: '#22c55e'
  },
  rare: { 
    detectionRadius: 55, 
    clickRadius: 28,
    glowColor: 'rgba(59,130,246,0.6)',
    borderColor: '#3b82f6'
  },
  legendary: { 
    detectionRadius: 40, 
    clickRadius: 20,
    glowColor: 'rgba(168,85,247,0.7)',
    borderColor: '#a855f7'
  },
  mythic: { 
    detectionRadius: 30, 
    clickRadius: 15,
    glowColor: 'rgba(251,146,60,0.8)',
    borderColor: '#f97316'
  }
};

export default function GameArea({ selectedTool, hiddenItems, onDetectionChange, onDig, onMiss, toolCursor, shovel, comboMultiplier, playerLevel }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [detectionGlow, setDetectionGlow] = useState({ show: false, x: 0, y: 0, strength: 0, rarity: 'common' });
  const [digAnimation, setDigAnimation] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const dugSpots = hiddenItems.filter(item => item.found);
  const notFoundItems = hiddenItems.filter(item => !item.found);
  
  // Get current map theme
  const currentMap = getMapForLevel(playerLevel);

  useEffect(() => {
    if (selectedTool === 'metal-detector') {
      checkDetection();
    }
  }, [mousePos, selectedTool, hiddenItems]);

  const checkDetection = () => {
    let maxStrength = 0;
    let closestItem = null;

    notFoundItems.forEach(item => {
      const distance = Math.sqrt(
        Math.pow(mousePos.x - item.x, 2) + Math.pow(mousePos.y - item.y, 2)
      );
      
      const config = RARITY_CONFIG[item.rarity];
      const detectionRadius = config.detectionRadius;
      
      if (distance < detectionRadius) {
        const strength = Math.max(0, 100 - (distance / detectionRadius) * 100);
        if (strength > maxStrength) {
          maxStrength = strength;
          closestItem = item;
        }
      }
    });

    onDetectionChange(Math.round(maxStrength));
    
    if (maxStrength > 50 && closestItem) {
      setDetectionGlow({
        show: true,
        x: closestItem.x,
        y: closestItem.y,
        strength: maxStrength,
        rarity: closestItem.rarity
      });
    } else {
      setDetectionGlow({ show: false, x: 0, y: 0, strength: 0, rarity: 'common' });
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleClick = (e) => {
    if (selectedTool === 'shovel') {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let foundItem = false;

      notFoundItems.forEach(item => {
        const distance = Math.sqrt(
          Math.pow(clickX - item.x, 2) + Math.pow(clickY - item.y, 2)
        );
        
        const config = RARITY_CONFIG[item.rarity];
        const effectiveClickRadius = config.clickRadius + (shovel?.clickRadiusBonus || 0);
        
        if (distance < effectiveClickRadius) {
          foundItem = true;
          setDigAnimation({ 
            x: clickX, 
            y: clickY, 
            rarity: item.rarity, 
            itemEmoji: item.emoji, 
            itemValue: item.value,
            shovelBonus: shovel?.valueMultiplier || 1,
            comboMultiplier: comboMultiplier
          });
          setTimeout(() => {
            onDig(item);
            setDigAnimation(null);
          }, 800);
        }
      });

      // If no item was found, it's a miss
      if (!foundItem && notFoundItems.length > 0) {
        onMiss();
        // Show miss animation
        setDigAnimation({
          x: clickX,
          y: clickY,
          miss: true
        });
        setTimeout(() => {
          setDigAnimation(null);
        }, 600);
      }
    }
  };

  const getRarityGlowStyle = (rarity) => {
    const config = RARITY_CONFIG[rarity];
    return {
      background: `radial-gradient(circle, ${config.glowColor} 0%, ${config.glowColor.replace('0.', '0.1')} 50%, transparent 100%)`
    };
  };

  return (
    <Card 
      className="relative overflow-hidden shadow-2xl border-4 border-amber-400"
      style={{ 
        height: '480px',
        background: currentMap.theme.background,
        cursor: selectedTool === 'metal-detector' ? `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="24" font-size="24">🔍</text></svg>')}") 16 16, auto` 
              : `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="24" font-size="24">⛏️</text></svg>')}") 16 16, auto`
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Map Info Badge */}
      <div className="absolute top-3 left-3 z-20">
        <Badge className="bg-white/90 backdrop-blur border-2 border-amber-400 px-3 py-1.5 text-sm font-bold text-amber-900">
          <MapIcon className="w-4 h-4 mr-2" />
          {currentMap.name}
        </Badge>
      </div>

      {/* Items Counter */}
      <div className="absolute top-3 right-3 z-20">
        <Badge className="bg-white/90 backdrop-blur border-2 border-amber-400 px-3 py-1.5 text-sm font-bold text-amber-900">
          {dugSpots.length} / {hiddenItems.length} Found
        </Badge>
      </div>

      {/* Sand/terrain textures */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(210, 180, 140, 0.3) 1px, transparent 1px),
          radial-gradient(circle at 60% 70%, rgba(194, 165, 130, 0.3) 1px, transparent 1px),
          radial-gradient(circle at 80% 20%, rgba(222, 184, 135, 0.3) 1px, transparent 1px),
          radial-gradient(circle at 40% 80%, rgba(205, 175, 140, 0.3) 1px, transparent 1px),
          radial-gradient(circle at 90% 60%, rgba(218, 188, 150, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px, 70px 70px, 40px 40px, 60px 60px, 45px 45px',
        backgroundPosition: '0 0, 20px 20px, 10px 30px, 35px 15px, 25px 40px'
      }}></div>
      
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(210, 180, 140, 0.1) 2px,
          rgba(210, 180, 140, 0.1) 4px
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 2px,
          rgba(194, 165, 130, 0.1) 2px,
          rgba(194, 165, 130, 0.1) 4px
        )`
      }}></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[10%] left-[15%] w-32 h-32 rounded-full blur-3xl" style={{ background: currentMap.theme.accentColor }}></div>
        <div className="absolute top-[40%] right-[20%] w-40 h-40 rounded-full blur-3xl" style={{ background: currentMap.theme.accentColor }}></div>
        <div className="absolute bottom-[30%] left-[40%] w-36 h-36 rounded-full blur-3xl" style={{ background: currentMap.theme.waterColor }}></div>
        <div className="absolute top-[70%] right-[45%] w-28 h-28 rounded-full blur-3xl" style={{ background: currentMap.theme.accentColor }}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t opacity-30" style={{ background: `linear-gradient(to top, ${currentMap.theme.waterColor}, transparent)` }}></div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z" fill={currentMap.theme.waterColor} fillOpacity="0.2"/>
        </svg>
      </div>

      {/* Metal detector glow */}
      <AnimatePresence>
        {selectedTool === 'metal-detector' && detectionGlow.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: (detectionGlow.strength / 150) * 0.6,
              scale: 0.8 + (detectionGlow.strength / 300)
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: detectionGlow.x,
              top: detectionGlow.y,
              width: '70px',
              height: '70px',
              transform: 'translate(-50%, -50%)',
              ...getRarityGlowStyle(detectionGlow.rarity),
              filter: 'blur(15px)',
              animation: `pulse-${detectionGlow.rarity} 1.5s infinite`
            }}
          />
        )}
      </AnimatePresence>

      {/* Dig animation with collected item */}
      <AnimatePresence>
        {digAnimation && (
          <>
            {digAnimation.miss ? (
              <>
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute text-6xl pointer-events-none z-20"
                  style={{
                    left: digAnimation.x,
                    top: digAnimation.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  ❌
                </motion.div>
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -40 }}
                  exit={{ opacity: 0 }}
                  className="absolute text-xl font-bold text-red-600 pointer-events-none drop-shadow-lg z-20"
                  style={{
                    left: digAnimation.x,
                    top: digAnimation.y - 60,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  MISS! Streak Lost
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  exit={{ opacity: 0 }}
                  className="absolute text-6xl pointer-events-none z-20"
                  style={{
                    left: digAnimation.x,
                    top: digAnimation.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  💥
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 1, scale: 1.5, y: 0 }}
                  animate={{ opacity: 0, scale: 0.8, y: -100 }}
                  exit={{ opacity: 0 }}
                  className="absolute text-5xl pointer-events-none drop-shadow-2xl z-20"
                  style={{
                    left: digAnimation.x,
                    top: digAnimation.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {digAnimation.itemEmoji}
                </motion.div>
                
                {digAnimation.rarity === 'mythic' && (
                  <>
                    <motion.div
                      initial={{ opacity: 1, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 4 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-6xl pointer-events-none z-20"
                      style={{
                        left: digAnimation.x,
                        top: digAnimation.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      🌟
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -60 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-4xl font-bold text-orange-600 pointer-events-none drop-shadow-2xl z-20"
                      style={{
                        left: digAnimation.x,
                        top: digAnimation.y - 110,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      MYTHIC!!!
                    </motion.div>
                  </>
                )}
                {digAnimation.rarity === 'legendary' && (
                  <>
                    <motion.div
                      initial={{ opacity: 1, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 3 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-4xl pointer-events-none z-20"
                      style={{
                        left: digAnimation.x,
                        top: digAnimation.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      ✨
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -50 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-3xl font-bold text-purple-600 pointer-events-none drop-shadow-lg z-20"
                      style={{
                        left: digAnimation.x,
                        top: digAnimation.y - 100,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      LEGENDARY!
                    </motion.div>
                  </>
                )}
                {digAnimation.rarity === 'rare' && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -40 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-2xl font-bold text-blue-600 pointer-events-none drop-shadow-lg z-20"
                    style={{
                      left: digAnimation.x,
                      top: digAnimation.y - 100,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    RARE!
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Dug spots with found items */}
      {dugSpots.map((item) => {
        return (
          <motion.div
            key={item.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute pointer-events-none"
            style={{
              left: item.x,
              top: item.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="absolute w-20 h-20 rounded-full bg-gradient-radial from-amber-900/60 to-amber-800/40 blur-sm" style={{ transform: 'translate(-50%, -50%)' }}></div>
              <div className="absolute w-16 h-16 rounded-full bg-amber-950/50" style={{ transform: 'translate(-50%, -50%)' }}></div>
            </div>
          </motion.div>
        );
      })}

      {/* Instructions overlay with close button */}
      {showInstructions && notFoundItems.length === hiddenItems.length && hiddenItems.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-2xl max-w-md text-center border-2 border-amber-300 pointer-events-auto relative"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInstructions(false)}
              className="absolute top-2 right-2 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">{currentMap.name}</h3>
            <p className="text-sm text-amber-700 mb-3 italic">
              {currentMap.theme.description}
            </p>
            <p className="text-sm text-amber-800 mb-3">
              Find all <span className="font-bold text-lg text-amber-900">{currentMap.itemCount} treasures</span> to complete this map and advance to the next level!
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3 border-2 border-purple-300">
              <p className="text-xs font-bold text-purple-900">
                🔥 Build COMBOS for bonus XP! Keep your STREAK alive!
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-common {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes pulse-uncommon {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes pulse-rare {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.25); }
        }
        @keyframes pulse-legendary {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.3); }
        }
        @keyframes pulse-mythic {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
        }
      `}</style>
    </Card>
  );
}