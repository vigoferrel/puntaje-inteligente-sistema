
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BookOpen, Brain, ArrowRight } from 'lucide-react';

export const LectoGuiaIntegration: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-white/20 h-full cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-white" />
            <div>
              <CardTitle className="text-white">LectoGuía IA</CardTitle>
              <p className="text-white/80 text-sm">Comprensión lectora</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-white/20 text-white border-white/30">
            <Brain className="w-3 h-3 mr-1" />
            IA Avanzada
          </Badge>
          <div className="text-white/90 text-sm">
            Sistema inteligente de comprensión lectora con análisis contextual
          </div>
          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
            Iniciar Sesión
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
