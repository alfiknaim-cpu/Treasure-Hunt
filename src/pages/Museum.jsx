
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUpDown, Sparkles, Award, Filter, Building2 } from 'lucide-react';
import MuseumItem from '../components/museum/MuseumItem';
import RarityInfo from '../components/museum/RarityInfo';
import MuseumStats from '../components/museum/MuseumStats';

const ITEM_DATA = {
  1: { description: 'An ancient coin from a lost civilization, weathered by time and tide.' },
  2: { description: 'A rusty nail from an old shipwreck, a remnant of maritime history.' },
  3: { description: 'A vintage bottle cap that once sealed a message in a bottle.' },
  4: { description: 'An ornate silver spoon from a noble\'s dining set, lost at sea.' },
  5: { description: 'A stunning ruby ring that sparkles with crimson fire.' },
  6: { description: 'A prestigious gold watch that once belonged to a ship captain.' },
  7: { description: 'An elegant pearl necklace from the depths of the ocean.' },
  8: { description: 'A mystical amulet said to grant protection to sailors.' },
  9: { description: 'A brilliant diamond ring fit for royalty, lost in a storm.' },
  10: { description: 'The legendary crown of the Pirate King, the ultimate treasure!' }
};

export default function Museum() {
  const [collection, setCollection] = useState([]);
  const [sortBy, setSortBy] = useState('rarity');
  const [filterRarity, setFilterRarity] = useState('all');

  useEffect(() => {
    // Load collection from localStorage
    const savedCollection = localStorage.getItem('treasureCollection');
    if (savedCollection) {
      setCollection(JSON.parse(savedCollection));
    }
  }, []);

  const getSortedAndFilteredItems = () => {
    let items = [...collection];

    // Filter by rarity
    if (filterRarity !== 'all') {
      items = items.filter(item => item.rarity === filterRarity);
    }

    // Sort
    switch (sortBy) {
      case 'rarity':
        const rarityOrder = { legendary: 0, rare: 1, uncommon: 2, common: 3 };
        items.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
      case 'value':
        items.sort((a, b) => b.value - a.value);
        break;
      case 'name':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return items;
  };

  const sortedItems = getSortedAndFilteredItems();
  const totalValue = collection.reduce((sum, item) => sum + item.value, 0);

  const getRarityCount = (rarity) => collection.filter(item => item.rarity === rarity).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-10 h-10 text-amber-600" />
          <h1 className="text-4xl font-bold text-amber-900">Treasure Museum</h1>
        </div>
        <p className="text-amber-700 text-lg">Your personal collection of discovered treasures</p>
      </div>

      {collection.length === 0 ? (
        <Card className="border-4 border-dashed border-amber-300 bg-white/60">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🏺</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Empty Museum</h2>
            <p className="text-amber-700 mb-6">
              Your museum is empty! Head to the beach to start hunting for treasures.
            </p>
            <Button
              onClick={() => window.location.href = '/Beach'}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              Start Treasure Hunt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <MuseumStats 
            collection={collection}
            totalValue={totalValue}
            getRarityCount={getRarityCount}
          />

          {/* Rarity Information */}
          <RarityInfo />

          {/* Controls */}
          <Card className="mb-6 bg-white/80 backdrop-blur border-2 border-amber-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-900">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rarity">Rarity</SelectItem>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-900">Filter:</span>
                  <Select value={filterRarity} onValueChange={setFilterRarity}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto flex items-center gap-2 text-sm text-amber-800">
                  <span className="font-semibold">Showing:</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-900">
                    {sortedItems.length} items
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {sortedItems.map((item, index) => (
                <MuseumItem
                  key={item.id}
                  item={item}
                  description={ITEM_DATA[item.id]?.description}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
