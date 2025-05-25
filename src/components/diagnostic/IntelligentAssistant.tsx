
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, X, Send } from 'lucide-react';

interface IntelligentAssistantProps {
  onAskQuestion: (question: string) => void;
  systemMetrics: any;
  weakestArea: any;
  onClose: () => void;
}

export const IntelligentAssistant: React.FC<IntelligentAssistantProps> = ({
  onAskQuestion,
  systemMetrics,
  weakestArea,
  onClose
}) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAskQuestion(question);
      setQuestion('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-20 right-6 z-50 w-80"
    >
      <Card className="bg-black/80 backdrop-blur-lg border-purple-500/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-400 flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Asistente IA
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-gray-300">
            ¿Necesitas ayuda con tu diagnóstico? Pregúntame cualquier cosa.
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="text-xs bg-gray-900/50 border-gray-600"
            />
            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-3 h-3" />
            </Button>
          </form>

          <div className="text-xs text-gray-400">
            Sistema activo: {systemMetrics?.totalNodes || 0} nodos cargados
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
