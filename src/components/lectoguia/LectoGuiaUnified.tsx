
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, BookOpen, Target, TrendingUp, 
  Brain, Zap, CheckCircle 
} from 'lucide-react';
import { useLectoGuia } from '@/hooks/use-lectoguia';
import { LectoGuiaChat } from './LectoGuiaChat';

interface LectoGuiaUnifiedProps {
  initialSubject: string;
  onSubjectChange: (subject: string) => void;
  onNavigateToTool: (tool: string, context?: any) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessageForConversion {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const SUBJECTS = [
  { code: 'COMPETENCIA_LECTORA', name: 'Competencia Lectora', color: 'bg-blue-500' },
  { code: 'MATEMATICA_1', name: 'Matemática M1', color: 'bg-green-500' },
  { code: 'MATEMATICA_2', name: 'Matemática M2', color: 'bg-purple-500' },
  { code: 'CIENCIAS', name: 'Ciencias', color: 'bg-orange-500' },
  { code: 'HISTORIA', name: 'Historia', color: 'bg-red-500' }
];

export const LectoGuiaUnified: React.FC<LectoGuiaUnifiedProps> = ({
  initialSubject,
  onSubjectChange,
  onNavigateToTool
}) => {
  const [activeTab, setActiveTab] = useState('chat');
  
  const {
    messages,
    isTyping,
    handleSendMessage,
    currentExercise,
    selectedOption,
    showFeedback,
    handleExerciseOptionSelect,
    handleNewExercise,
    skillLevels,
    isLoading,
    getStats
  } = useLectoGuia();

  const currentSubject = SUBJECTS.find(s => s.code === initialSubject) || SUBJECTS[0];
  
  // Convertir ChatMessage[] a Message[] con verificación de tipos
  const convertedMessages: Message[] = (messages || []).map((msg: ChatMessageForConversion) => ({
    id: msg.id || `msg-${Date.now()}`,
    text: msg.content,
    sender: msg.type === 'user' ? 'user' : 'ai',
    timestamp: msg.timestamp
  }));

  // Obtener stats con fallback
  const stats = getStats ? getStats() : {
    totalMessages: convertedMessages.length,
    exercisesCompleted: 0,
    currentSubject: initialSubject,
    isConnected: true,
    lastSync: new Date(),
    averageScore: 0,
    streak: 0
  };

  const handleSubjectSelect = (subjectCode: string) => {
    onSubjectChange(subjectCode);
  };

  const handleActionFromInterface = (action: any) => {
    console.log('Acción desde interfaz:', action);
    
    switch (action.type) {
      case 'START_DIAGNOSTIC':
        onNavigateToTool('diagnostic');
        break;
      case 'CREATE_PLAN':
        onNavigateToTool('plan', action.payload);
        break;
      case 'GENERATE_EXERCISES':
        onNavigateToTool('exercises', { subject: initialSubject });
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header de LectoGuía */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">LectoGuía IA</h1>
          <p className="text-gray-600">Asistente inteligente de comprensión y aprendizaje</p>
        </div>
      </div>

      {/* Selector de Materia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Materia Activa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((subject) => (
              <Button
                key={subject.code}
                variant={subject.code === initialSubject ? "default" : "outline"}
                onClick={() => handleSubjectSelect(subject.code)}
                className="flex items-center gap-2"
              >
                <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                {subject.name}
              </Button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">{currentSubject.name}</h3>
            <p className="text-sm text-blue-700">
              Actualmente trabajando en esta materia. El asistente adaptará sus respuestas y ejercicios.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{convertedMessages.length}</div>
            <div className="text-sm text-gray-600">Conversaciones</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.exercisesCompleted}</div>
            <div className="text-sm text-gray-600">Ejercicios</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
            <div className="text-sm text-gray-600">Precisión</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
            <div className="text-sm text-gray-600">Racha</div>
          </CardContent>
        </Card>
      </div>

      {/* Interfaz Principal */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat IA
              </TabsTrigger>
              <TabsTrigger value="exercise" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Ejercicios
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progreso
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="p-6">
              <LectoGuiaChat
                messages={convertedMessages}
                isTyping={isTyping || false}
                onSendMessage={handleSendMessage || (() => {})}
                isLoading={isLoading || false}
              />
            </TabsContent>
            
            <TabsContent value="exercise" className="p-6">
              <div className="space-y-6">
                {currentExercise ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">{currentExercise.question}</h3>
                    <div className="space-y-2">
                      {currentExercise.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            showFeedback 
                              ? (index === selectedOption 
                                  ? (option === currentExercise.correctAnswer ? "default" : "destructive")
                                  : (option === currentExercise.correctAnswer ? "default" : "outline"))
                              : "outline"
                          }
                          onClick={() => handleExerciseOptionSelect && handleExerciseOptionSelect(index)}
                          disabled={showFeedback}
                          className="w-full text-left justify-start"
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                    
                    {showFeedback && (
                      <div className="mt-4 space-y-4">
                        <div className={`p-4 rounded-lg ${
                          selectedOption !== null && 
                          currentExercise.options[selectedOption] === currentExercise.correctAnswer
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className={`w-5 h-5 ${
                              selectedOption !== null && 
                              currentExercise.options[selectedOption] === currentExercise.correctAnswer
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`} />
                            <span className="font-medium">
                              {selectedOption !== null && 
                               currentExercise.options[selectedOption] === currentExercise.correctAnswer
                                ? '¡Correcto!'
                                : 'Incorrecto'}
                            </span>
                          </div>
                          {currentExercise.explanation && (
                            <p className="text-sm text-gray-700">{currentExercise.explanation}</p>
                          )}
                        </div>
                        
                        <Button onClick={handleNewExercise} className="w-full">
                          <Zap className="w-4 h-4 mr-2" />
                          Nuevo Ejercicio
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">No hay ejercicios disponibles en este momento</p>
                    <Button onClick={() => handleNewExercise && handleNewExercise()}>
                      <Zap className="w-4 h-4 mr-2" />
                      Generar Ejercicio
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Progreso por Habilidades</h3>
                
                <div className="grid gap-4">
                  {skillLevels && Object.entries(skillLevels).length > 0 ? (
                    Object.entries(skillLevels).map(([skill, level]) => (
                      <div key={skill} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{skill.replace(/_/g, ' ')}</div>
                          <div className="text-sm text-gray-600">Nivel actual</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{level}%</div>
                          <Badge variant={level >= 70 ? "default" : level >= 40 ? "secondary" : "destructive"}>
                            {level >= 70 ? "Avanzado" : level >= 40 ? "Intermedio" : "Básico"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No hay datos de progreso disponibles</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Acciones Recomendadas</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => onNavigateToTool('diagnostic')}
                      className="w-full justify-start"
                    >
                      Realizar diagnóstico completo
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onNavigateToTool('exercises', { subject: initialSubject })}
                      className="w-full justify-start"
                    >
                      Practicar ejercicios dirigidos
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onNavigateToTool('plan')}
                      className="w-full justify-start"
                    >
                      Crear plan de estudio
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
