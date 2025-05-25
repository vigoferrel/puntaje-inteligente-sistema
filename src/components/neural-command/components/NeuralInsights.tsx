
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface NeuralInsightsProps {
  insights: any[];
}

export const NeuralInsights: React.FC<NeuralInsightsProps> = ({ insights }) => {
  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-poppins">
            <Brain className="w-5 h-5 text-purple-400" />
            Insights del Ecosistema Neural
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="text-sm font-medium text-white mb-1 font-poppins">{insight.title}</div>
                <div className="text-xs text-white/70 font-poppins">{insight.description}</div>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 font-poppins ${
                  insight.level === 'excellent' ? 'bg-green-500/20 text-green-400' :
                  insight.level === 'good' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {insight.level === 'excellent' ? 'Excelente' :
                   insight.level === 'good' ? 'Bien' : 'Mejorable'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
