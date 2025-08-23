
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  MessageCircle, 
  X, 
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const FUASBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: '¡Hola! Soy tu asistente FUAS. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    { text: 'Fechas críticas FUAS', icon: Clock },
    { text: 'Calcular elegibilidad', icon: CheckCircle },
    { text: 'Documentos necesarios', icon: AlertCircle },
    { text: 'Optimizar estrategia', icon: Sparkles }
  ];

  const handleQuickAction = (action: string) => {
    const responses: Record<string, string> = {
      'Fechas críticas FUAS': '📅 FECHAS CRÍTICAS:\n• Cierre FUAS: 13 marzo 2025 (14:00 hrs)\n• Verificación RSH: 21 abril 2025\n• Asignación final: 28 mayo 2025',
      'Calcular elegibilidad': '🎯 Para calcular tu elegibilidad necesito:\n• Puntajes PAES\n• Decil socioeconómico\n• Tipo de establecimiento\n¿Comenzamos?',
      'Documentos necesarios': '📋 DOCUMENTOS FUAS:\n• Cédula de identidad\n• Certificado notas enseñanza media\n• Información familiar actualizada\n• Situaciones especiales (si aplica)',
      'Optimizar estrategia': '🚀 ESTRATEGIA ÓPTIMA:\n1. Completa FUAS cuanto antes\n2. Verifica adscripción instituciones\n3. Maximiza puntajes antes de marzo\n4. Prepara documentación'
    };

    setMessages(prev => [...prev, 
      { type: 'user', content: action, timestamp: new Date() },
      { type: 'bot', content: responses[action] || 'Información no disponible', timestamp: new Date() }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, 
      { type: 'user', content: inputMessage, timestamp: new Date() },
      { type: 'bot', content: 'Procesando tu consulta... Un momento por favor.', timestamp: new Date() }
    ]);
    
    setInputMessage('');
  };

  return (
    <>
      {/* Botón flotante del bot */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-20"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <Bot className="w-5 h-5 mr-2" />
          FUAS Assistant
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      {/* Modal del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <Card className="relative w-full max-w-md h-96 bg-black/80 backdrop-blur-lg border-cyan-500/30 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Bot className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold">FUAS Assistant</h3>
                    <p className="text-cyan-300 text-xs">IA especializada en becas</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-cyan-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-white/10 text-white border border-cyan-500/30'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Acciones rápidas */}
              <div className="p-3 border-t border-cyan-500/30">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.text)}
                      className="text-xs text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-200"
                    >
                      <action.icon className="w-3 h-3 mr-1" />
                      {action.text}
                    </Button>
                  ))}
                </div>

                {/* Input de mensaje */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregúntame sobre FUAS..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-cyan-500/30 rounded-md text-white placeholder-white/50 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
