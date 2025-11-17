import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Info } from 'lucide-react';

const RARITY_INFO = [
  {
    name: 'Common',
    color: 'bg-slate-400',
    description: 'Easy to find with a wide detection radius',
    dropRate: '40%'
  },
  {
    name: 'Uncommon',
    color: 'bg-green-500',
    description: 'Moderate difficulty with smaller detection area',
    dropRate: '30%'
  },
  {
    name: 'Rare',
    color: 'bg-blue-500',
    description: 'Hard to locate, requires precision',
    dropRate: '20%'
  },
  {
    name: 'Legendary',
    color: 'bg-purple-500',
    description: 'Extremely rare, tiny detection zone',
    dropRate: '10%'
  }
];

export default function RarityInfo() {
  return (
    <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <Info className="w-5 h-5" />
          Rarity Tiers Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RARITY_INFO.map((rarity) => (
            <div key={rarity.name} className="bg-white/80 rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full ${rarity.color}`}></div>
                <h4 className="font-bold text-gray-900">{rarity.name}</h4>
              </div>
              <p className="text-xs text-gray-600 mb-2">{rarity.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Drop Rate:</span>
                <span className="font-bold text-amber-700">{rarity.dropRate}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}