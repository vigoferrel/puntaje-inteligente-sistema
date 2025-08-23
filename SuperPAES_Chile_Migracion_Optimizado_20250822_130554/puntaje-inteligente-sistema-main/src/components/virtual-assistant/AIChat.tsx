/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { X, MessageCircle, Send } from 'lucide-react';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
}

export const AIChat: FC<AIChatProps> = ({
  isOpen,
  onClose,
  currentRoute
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl h-[600px]"
        >
          <Card className="h-full bg-black/90 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat de Ayuda IA
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 bg-white/5 rounded-lg p-4 mb-4">
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">Chat IA Disponible</h3>
                  <p className="text-white/60 text-sm">
                    Haz cualquier pregunta sobre SuperPAES, comprensiÃ³n lectora o preparaciÃ³n PAES
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50"
                />
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

