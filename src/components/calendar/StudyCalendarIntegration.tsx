
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Target, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface StudyEvent {
  id: string;
  title: string;
  subject: string;
  date: Date;
  duration: number;
  type: 'exercise' | 'diagnostic' | 'review' | 'plan';
  completed: boolean;
}

export const StudyCalendarIntegration: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Generar eventos de estudio basados en el progreso del usuario
    const generateStudyEvents = () => {
      const today = new Date();
      const events: StudyEvent[] = [];
      
      // Eventos para los próximos 7 días
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Sesión de ejercicios diaria
        events.push({
          id: `exercise-${i}`,
          title: 'Práctica de Ejercicios',
          subject: 'COMPETENCIA_LECTORA',
          date,
          duration: 45,
          type: 'exercise',
          completed: i < 2 // Marcar los primeros 2 como completados
        });

        // Diagnóstico semanal
        if (i === 6) {
          events.push({
            id: `diagnostic-${i}`,
            title: 'Evaluación Diagnóstica',
            subject: 'MATEMATICA_1',
            date,
            duration: 90,
            type: 'diagnostic',
            completed: false
          });
        }

        // Revisión de plan cada 3 días
        if (i % 3 === 0) {
          events.push({
            id: `review-${i}`,
            title: 'Revisión de Plan',
            subject: 'GENERAL',
            date,
            duration: 30,
            type: 'plan',
            completed: i === 0
          });
        }
      }
      
      setEvents(events);
    };

    generateStudyEvents();
  }, [user]);

  const getTodayEvents = () => {
    const today = new Date();
    return events.filter(event => 
      event.date.toDateString() === today.toDateString()
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.date > today)
      .slice(0, 5)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const handleCompleteEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, completed: true }
        : event
    ));
  };

  const getEventTypeIcon = (type: StudyEvent['type']) => {
    switch (type) {
      case 'exercise': return <BookOpen className="w-4 h-4" />;
      case 'diagnostic': return <Target className="w-4 h-4" />;
      case 'review': return <Clock className="w-4 h-4" />;
      case 'plan': return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: StudyEvent['type']) => {
    switch (type) {
      case 'exercise': return 'bg-blue-500';
      case 'diagnostic': return 'bg-green-500';
      case 'review': return 'bg-orange-500';
      case 'plan': return 'bg-purple-500';
    }
  };

  const todayEvents = getTodayEvents();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-6">
      {/* Eventos de Hoy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agenda de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(event.type)} ${
                    event.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getEventTypeIcon(event.type)}
                      <div>
                        <h4 className={`font-medium ${event.completed ? 'line-through text-gray-500' : ''}`}>
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {event.duration} min • {event.subject}
                        </p>
                      </div>
                    </div>
                    {!event.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteEvent(event.id)}
                      >
                        Completar
                      </Button>
                    )}
                    {event.completed && (
                      <Badge variant="secondary">Completado</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay eventos programados para hoy
            </p>
          )}
        </CardContent>
      </Card>

      {/* Próximos Eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getEventTypeIcon(event.type)}
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-gray-600">
                      {event.date.toLocaleDateString()} • {event.duration} min
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{event.subject}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Calendario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Evento
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ver Calendario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
