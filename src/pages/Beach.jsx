import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Wrench, Hammer, Trophy, Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPanel from '../components/game/ToolPanel';
import GameArea from '../components/game/GameArea';
import Inventory from '../components/game/Inventory';
import LevelProgress from '../components/game/LevelProgress.jsx';
import ShopDialog from '../components/game/ShopDialog';
import ComboDisplay from '../components/game/ComboDisplay';
import StreakDisplay from '../components/game/StreakDisplay.jsx';
import { generateItems, calculateXP, calculateComboMultiplier, DETECTOR_TIERS, SHOVEL_TIERS, COMBO_TIME_LIMIT, getMapForLevel } from '../components/game/gameLogic.jsx';

export default function Beach() {
  const [selectedTool, setSelectedTool] = useState('metal-detector');
  const [detectionStrength, setDetectionStrength] = useState(0);
  const [foundItems, setFoundItems] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  
  // Player progression
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [coins, setCoins] = useState(0);
  const [currentDetector, setCurrentDetector] = useState(DETECTOR_TIERS[0]);
  const [currentShovel, setCurrentShovel] = useState(SHOVEL_TIERS[0]);
  
  // Combo & Streak system
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [comboTimeLeft, setComboTimeLeft] = useState(COMBO_TIME_LIMIT);
  const [lastDigTime, setLastDigTime] = useState(null);
  
  const [hiddenItems, setHiddenItems] = useState([]);

  const audioRef = useRef(null);
  const comboTimerRef = useRef(null);

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setPlayerLevel(state.level || 1);
      setPlayerXP(state.xp || 0);
      setCoins(state.coins || 0);
      setCurrentDetector(state.detector || DETECTOR_TIERS[0]);
      setCurrentShovel(state.shovel || SHOVEL_TIERS[0]);
      setBestStreak(state.bestStreak || 0);
      
      const savedCollection = localStorage.getItem('treasureCollection');
      if (savedCollection) {
        setFoundItems(JSON.parse(savedCollection));
      }
      
      // Generate items for saved level
      regenerateItems(state.level || 1, state.detector || DETECTOR_TIERS[0]);
    } else {
      // Generate initial items
      regenerateItems(1, DETECTOR_TIERS[0]);
    }
  }, []);

  // Save game state
  useEffect(() => {
    const gameState = {
      level: playerLevel,
      xp: playerXP,
      coins: coins,
      detector: currentDetector,
      shovel: currentShovel,
      bestStreak: bestStreak
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [playerLevel, playerXP, coins, currentDetector, currentShovel, bestStreak]);

  // Combo timer
  useEffect(() => {
    if (combo > 0 && lastDigTime) {
      comboTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - lastDigTime) / 1000;
        const timeLeft = Math.max(0, COMBO_TIME_LIMIT - elapsed);
        setComboTimeLeft(timeLeft);
        
        if (timeLeft <= 0) {
          setCombo(0);
          setComboTimeLeft(COMBO_TIME_LIMIT);
          clearInterval(comboTimerRef.current);
        }
      }, 100);
    }

    return () => {
      if (comboTimerRef.current) {
        clearInterval(comboTimerRef.current);
      }
    };
  }, [combo, lastDigTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '1' || e.key.toLowerCase() === 'd') {
        setSelectedTool('metal-detector');
      } else if (e.key === '2' || e.key.toLowerCase() === 's') {
        setSelectedTool('shovel');
      } else if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        setSelectedTool(prev => prev === 'metal-detector' ? 'shovel' : 'metal-detector');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const regenerateItems = (level, detector) => {
    const newItems = generateItems(level, detector);
    setHiddenItems(newItems);
  };

  useEffect(() => {
    if (soundEnabled && gameStarted && detectionStrength > 0) {
      playDetectionSound();
    }
  }, [detectionStrength, soundEnabled, gameStarted]);

  const playDetectionSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(detectionStrength / 100, 0.5);
      audioRef.current.play();
    }
  };

  const handleMiss = () => {
    setStreak(0);
  };

  const handleDig = (item) => {
    // Start game on first dig
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Mark item as found
    setHiddenItems(prevItems => 
      prevItems.map(i => i.id === item.id ? { ...i, found: true } : i)
    );
    
    // Update combo
    const newCombo = combo + 1;
    setCombo(newCombo);
    setLastDigTime(Date.now());
    setComboTimeLeft(COMBO_TIME_LIMIT);
    
    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
    }
    
    // Calculate multiplier for XP bonus (not coins)
    const comboMultiplier = calculateComboMultiplier(newCombo);
    
    // Add to found items (unsold)
    const itemWithBonus = { ...item, comboMultiplier, sold: false };
    const newFoundItems = [...foundItems, itemWithBonus];
    setFoundItems(newFoundItems);
    
    // Save to localStorage for museum
    localStorage.setItem('treasureCollection', JSON.stringify(newFoundItems));
    
    // Award XP only (no coins until selling)
    let xpGained = calculateXP(item.rarity);
    
    // Apply combo multiplier to XP
    xpGained = Math.round(xpGained * comboMultiplier);
    
    // Add streak bonus XP (every 5 streak)
    if (newStreak > 0 && newStreak % 5 === 0) {
      xpGained += newStreak * 10;
    }
    
    setPlayerXP(prev => prev + xpGained);
    
    // Check if all items found - complete map and level up!
    const allFound = hiddenItems.every(i => i.id === item.id || i.found);
    if (allFound) {
      // Show level complete screen
      setShowLevelComplete(true);
      
      // Auto advance to next level after 2 seconds
      setTimeout(() => {
        const newLevel = playerLevel + 1;
        setPlayerLevel(newLevel);
        setPlayerXP(0); // Reset XP for new level
        regenerateItems(newLevel, currentDetector);
        setShowLevelComplete(false);
      }, 2000);
    }
  };

  const handleSellItem = (item, itemIndex) => {
    const sellValue = Math.round(item.value * currentShovel.valueMultiplier);
    
    // Mark this specific item as sold
    const updatedItems = [...foundItems];
    const unsoldItems = updatedItems.filter(i => !i.sold);
    const actualIndex = updatedItems.indexOf(unsoldItems[itemIndex]);
    updatedItems[actualIndex] = { ...updatedItems[actualIndex], sold: true };
    
    setFoundItems(updatedItems);
    localStorage.setItem('treasureCollection', JSON.stringify(updatedItems));
    
    // Add coins
    setCoins(prev => prev + sellValue);
  };

  const handleSellAll = () => {
    const unsoldItems = foundItems.filter(item => !item.sold);
    const totalValue = unsoldItems.reduce((sum, item) => {
      return sum + Math.round(item.value * currentShovel.valueMultiplier);
    }, 0);
    
    // Mark all items as sold
    const updatedItems = foundItems.map(item => ({ ...item, sold: true }));
    setFoundItems(updatedItems);
    localStorage.setItem('treasureCollection', JSON.stringify(updatedItems));
    
    // Add coins
    setCoins(prev => prev + totalValue);
  };

  const handleBuyDetector = (detector) => {
    if (coins >= detector.price && playerLevel >= detector.requiredLevel) {
      setCoins(prev => prev - detector.price);
      setCurrentDetector(detector);
      regenerateItems(playerLevel, detector);
      setShowShop(false);
    }
  };

  const handleBuyShovel = (shovel) => {
    if (coins >= shovel.price && playerLevel >= shovel.requiredLevel) {
      setCoins(prev => prev - shovel.price);
      setCurrentShovel(shovel);
      setShowShop(false);
    }
  };

  const tools = [
    { id: 'metal-detector', name: currentDetector.name, icon: Wrench, cursor: currentDetector.icon },
    { id: 'shovel', name: currentShovel.name, icon: Hammer, cursor: currentShovel.icon },
  ];

  const currentMap = getMapForLevel(playerLevel);
  const xpForNextLevel = currentMap.itemCount * 50; // XP needed = items in map * 50
  const xpProgress = (playerXP / xpForNextLevel) * 100;
  const comboMultiplier = calculateComboMultiplier(combo);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-10 left-20 w-32 h-16 bg-white/40 rounded-full blur-xl"></div>
      <div className="absolute top-20 right-40 w-40 h-20 bg-white/30 rounded-full blur-xl"></div>
      
      <ComboDisplay 
        combo={combo}
        multiplier={comboMultiplier}
        timeLeft={comboTimeLeft}
        maxTime={COMBO_TIME_LIMIT}
      />
      <StreakDisplay 
        streak={streak}
        bestStreak={bestStreak}
      />

      {/* Level Complete Overlay */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-12 shadow-2xl border-4 border-amber-400 text-center max-w-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="text-4xl font-black text-amber-900 mb-3">MAP CLEARED!</h2>
              <p className="text-xl text-amber-800 mb-6">
                {currentMap.name} Complete!
              </p>
              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <p className="text-2xl font-bold text-green-600 mb-2">
                  Advancing to Level {playerLevel + 1}
                </p>
                <p className="text-sm text-amber-700">
                  {getMapForLevel(playerLevel + 1).name}
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-amber-600 font-bold"
              >
                Loading next map...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
              🏖️ Beach Treasure Hunt
            </h1>
            <p className="text-amber-700 text-sm mt-0.5">Clear maps to progress through levels!</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/80 hover:bg-white h-9 w-9"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => setShowShop(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 h-9 px-3 text-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Upgrade Shop
            </Button>
            <Card className="px-3 py-1.5 bg-white/90 backdrop-blur">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-base text-amber-900">{foundItems.filter(i => !i.sold).length}</span>
              </div>
            </Card>
            <Card className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <span className="font-bold text-base text-white">${coins.toLocaleString()}</span>
              </div>
            </Card>
          </div>
        </div>

        <LevelProgress 
          level={playerLevel}
          xp={playerXP}
          xpForNextLevel={xpForNextLevel}
          xpProgress={xpProgress}
        />

        <div className="grid grid-cols-4 gap-4">
          {/* Tool Panel - Left */}
          <div className="col-span-1">
            <ToolPanel
              tools={tools}
              selectedTool={selectedTool}
              onSelectTool={setSelectedTool}
              detectionStrength={detectionStrength}
            />
          </div>

          {/* Game Area - Center */}
          <div className="col-span-2">
            <GameArea
              selectedTool={selectedTool}
              hiddenItems={hiddenItems}
              onDetectionChange={setDetectionStrength}
              onDig={handleDig}
              onMiss={handleMiss}
              toolCursor={tools.find(t => t.id === selectedTool)?.cursor}
              shovel={currentShovel}
              comboMultiplier={comboMultiplier}
              playerLevel={playerLevel}
            />
          </div>

          {/* Inventory - Right */}
          <div className="col-span-1">
            <Inventory 
              foundItems={foundItems} 
              onSellAll={handleSellAll}
              onSellItem={handleSellItem}
            />
          </div>
        </div>
      </div>

      <ShopDialog 
        open={showShop}
        onClose={() => setShowShop(false)}
        coins={coins}
        playerLevel={playerLevel}
        currentDetector={currentDetector}
        currentShovel={currentShovel}
        onBuyDetector={handleBuyDetector}
        onBuyShovel={handleBuyShovel}
      />

      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA4PWqvn7aVUFApCmN7vv2EVBSuAzvLaizsIGGO1" />
    </div>
  );
}