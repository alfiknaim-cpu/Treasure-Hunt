import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, DollarSign } from 'lucide-react';

export default function Inventory({ foundItems, onSellAll, onSellItem }) {
  const unsoldItems = foundItems.filter(item => !item.sold);
  const totalUnsoldValue = unsoldItems.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="bg-white/90 backdrop-blur shadow-xl border-2 border-amber-200">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 py-2 px-3">
        <CardTitle className="flex items-center justify-between text-amber-900 text-base">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Treasures Found
          </div>
          {unsoldItems.length > 0 && (
            <Button
              onClick={onSellAll}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-7 px-2 text-xs"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Sell All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {unsoldItems.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <div className="text-3xl mb-1">🏺</div>
            <p className="text-xs">No treasures to sell...</p>
          </div>
        ) : (
          <>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {unsoldItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border-2 border-amber-200 hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl">{item.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-gray-900">{item.name}</div>
                      <div className="text-xs font-semibold text-green-600">
                        ${item.value.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => onSellItem(item, index)}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-7 w-7 p-0"
                    >
                      <DollarSign className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
        
        {unsoldItems.length > 0 && (
          <div className="mt-2 pt-2 border-t border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Total Value:
              </span>
              <motion.span 
                key={totalUnsoldValue}
                initial={{ scale: 1.5, color: '#f59e0b' }}
                animate={{ scale: 1, color: '#059669' }}
                className="text-lg font-bold text-green-600"
              >
                ${totalUnsoldValue.toLocaleString()}
              </motion.span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}