
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Upload, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ChatInterfaceProps {
  context: any;
  diagnosticIntegration: any;
  planIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  context,
  diagnosticIntegration,
  planIntegration,
  onAction,
  onNavigate
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente inteligente de LectoGuía. Te ayudo con ejercicios, diagnósticos y tu plan de estudio. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simular respuesta del asistente (aquí se integraría con el backend)
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateContextualResponse(message, context, diagnosticIntegration, planIntegration),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setMessage('');
  };

  const generateContextualResponse = (userMessage: string, context: any, diagnostics: any, plan: any) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('ejercicio') || msg.includes('practica')) {
      return `Perfecto! Puedo generar ejercicios personalizados para ti. Tienes ${diagnostics.availableTests} diagnósticos disponibles. ¿Te gustaría empezar con ejercicios de ${context.selectedPrueba}?`;
    }
    
    if (msg.includes('plan') || msg.includes('estudio')) {
      return plan.currentPlan 
        ? `Excelente! Tienes el plan "${plan.currentPlan.title}" activo. ¿Quieres que revisemos tu progreso o creemos actividades específicas?`
        : 'Te ayudo a crear un plan de estudio personalizado. ¿Cuáles son tus objetivos para la PAES?';
    }
    
    if (msg.includes('diagnostico') || msg.includes('evaluacion')) {
      return `Tengo ${diagnostics.availableTests} diagnósticos disponibles para ti, basados en exámenes oficiales PAES. ¿Te gustaría hacer uno específico?`;
    }
    
    return 'Estoy aquí para ayudarte con todo lo relacionado a tu preparación PAES. Puedo generar ejercicios, revisar tu plan de estudio, hacer diagnósticos y mucho más.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Chat principal */}
      <div className="lg:col-span-3">
        <Card className="h-[calc(100vh-250px)] flex flex-col bg-white/5 backdrop-blur border-white/10">
          {/* Mensajes */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </CardContent>

          {/* Input de mensaje */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Panel de contexto */}
      <div className="space-y-4">
        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-white/20 text-white"
                onClick={() => onNavigate('exercise')}
              >
                Generar Ejercicio
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-white/20 text-white"
                onClick={() => onNavigate('diagnostic')}
              >
                Hacer Diagnóstico
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-white/20 text-white"
                onClick={() => onNavigate('plan')}
              >
                Ver Mi Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-3">Estado del Sistema</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Diagnósticos</span>
                <Badge variant="outline" className="text-white border-white/20">
                  {diagnosticIntegration.availableTests}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Plan Activo</span>
                <Badge variant="outline" className="text-white border-white/20">
                  {planIntegration.currentPlan ? 'Sí' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Materia</span>
                <Badge variant="outline" className="text-white border-white/20">
                  {context.activeSubject}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
