import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { motion } from 'framer-motion';

export default function ToolPanel({ tools, selectedTool, onSelectTool, detectionStrength }) {
  return (
    <Card className="bg-white/90 backdrop-blur shadow-xl border-2 border-amber-200">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 py-2 px-3">
        <CardTitle className="flex items-center gap-2 text-amber-900 text-base">
          🛠️ Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          
          return (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onSelectTool(tool.id)}
                variant={isSelected ? 'default' : 'outline'}
                className={`w-full h-auto py-2.5 px-3 flex items-center gap-2 justify-start transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-2 border-amber-400'
                    : 'bg-white hover:bg-amber-50 border-2 border-amber-200'
                }`}
              >
                <div className="text-2xl">{tool.cursor}</div>
                <div className="flex-1 text-left">
                  <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-amber-900'}`}>
                    {tool.name}
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="mt-0.5 bg-white/20 text-white text-xs px-1.5 py-0">
                      Active
                    </Badge>
                  )}
                </div>
              </Button>
            </motion.div>
          );
        })}

        {/* Signal Strength Display */}
        {selectedTool === 'metal-detector' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2.5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-900">Signal Strength</span>
              <span className={`text-base font-bold ${
                detectionStrength > 80 ? 'text-emerald-600' :
                detectionStrength > 50 ? 'text-amber-600' :
                'text-gray-500'
              }`}>
                {detectionStrength}%
              </span>
            </div>
            <Progress 
              value={detectionStrength} 
              className="h-2 bg-white"
            />
            <div className="mt-1.5 text-xs text-emerald-800">
              {detectionStrength > 80 && '🎯 Perfect! Switch to shovel!'}
              {detectionStrength > 50 && detectionStrength <= 80 && '📍 Very close!'}
              {detectionStrength > 20 && detectionStrength <= 50 && '🔍 Getting warmer...'}
              {detectionStrength <= 20 && detectionStrength > 0 && '❄️ Cold...'}
              {detectionStrength === 0 && '❌ No signal'}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}