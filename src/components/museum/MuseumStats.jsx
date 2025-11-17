import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Trophy, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MuseumStats({ collection, totalValue, getRarityCount }) {
  const stats = [
    {
      icon: Trophy,
      label: 'Total Items',
      value: collection.length,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
    {
      icon: DollarSign,
      label: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Legendary Items',
      value: getRarityCount('legendary'),
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur border-2 border-amber-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}