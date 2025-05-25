
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Bell, 
  Clock, 
  Target,
  BookOpen,
  AlertTriangle,
  Settings,
  Phone,
  Mail
} from 'lucide-react';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { EventModal } from './EventModal';
import { NotificationSettings } from './NotificationSettings';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

// Definir el tipo CalendarEvent localmente para evitar conflictos con Supabase
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: 'study_session' | 'paes_date' | 'deadline' | 'reminder';
  start_date: string;
  end_date?: string;
  all_day: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}

export const CinematicCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'study_session':
        return <BookOpen className="w-4 h-4" />;
      case 'paes_date':
        return <Target className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      case 'medium':
        return 'from-blue-500 to-blue-600';
      case 'low':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), date)
    );
  };

  const handleCreateEvent = async (eventData: Partial<CalendarEvent>) => {
    await createEvent(eventData);
    setShowEventModal(false);
  };

  const handleUpdateEvent = async (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, eventData);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen cinematic-particle-bg font-luxury">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10" />
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white cinematic-glow-text font-luxury tracking-wide">
                Calendario PAES Command
              </h1>
              <p className="text-cyan-200 font-light text-lg">
                Sistema inteligente de gestión temporal y notificaciones
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => setShowNotificationSettings(true)}
                className="cinematic-button font-medium"
              >
                <Settings className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
              <Button
                onClick={() => setShowEventModal(true)}
                className="cinematic-button font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendario Principal */}
          <div className="lg:col-span-3">
            <Card className="cinematic-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 font-luxury">
                    <CalendarIcon className="h-5 w-5 text-cyan-400" />
                    <span className="text-white font-semibold">
                      {format(selectedDate, 'MMMM yyyy', { locale: es })}
                    </span>
                  </CardTitle>
                  
                  <div className="flex space-x-2">
                    {['month', 'week', 'day'].map((mode) => (
                      <Button
                        key={mode}
                        variant={viewMode === mode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode(mode as typeof viewMode)}
                        className="font-medium"
                      >
                        {mode === 'month' ? 'Mes' : mode === 'week' ? 'Semana' : 'Día'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {viewMode === 'month' && (
                  <div className="grid grid-cols-7 gap-2">
                    {/* Días de la semana */}
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                        {day}
                      </div>
                    ))}
                    
                    {/* Días del mes */}
                    {eachDayOfInterval({
                      start: startOfMonth(selectedDate),
                      end: endOfMonth(selectedDate)
                    }).map((day) => {
                      const dayEvents = getEventsForDate(day);
                      const isSelected = isSameDay(day, selectedDate);
                      const isTodayDate = isToday(day);
                      
                      return (
                        <motion.div
                          key={day.toISOString()}
                          whileHover={{ scale: 1.05 }}
                          className={`
                            relative p-3 min-h-[80px] cursor-pointer rounded-lg border
                            ${isSelected ? 'bg-cyan-500/20 border-cyan-500' : 'border-gray-700 hover:border-gray-600'}
                            ${isTodayDate ? 'ring-2 ring-cyan-400' : ''}
                          `}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className={`text-sm font-medium ${isTodayDate ? 'text-cyan-400' : 'text-white'}`}>
                            {format(day, 'd')}
                          </div>
                          
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <motion.div
                                key={event.id}
                                className={`
                                  px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${getPriorityColor(event.priority)}
                                  cursor-pointer truncate
                                `}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                  setShowEventModal(true);
                                }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center space-x-1">
                                  {getEventTypeIcon(event.event_type)}
                                  <span className="truncate">{event.title}</span>
                                </div>
                              </motion.div>
                            ))}
                            
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{dayEvents.length - 2} más
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Eventos del Día Seleccionado */}
            <Card className="cinematic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-luxury">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-semibold">
                    {format(selectedDate, 'dd MMM', { locale: es })}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-gray-400 font-light text-center py-4">
                      No hay eventos programados
                    </p>
                  ) : (
                    getEventsForDate(selectedDate).map((event) => (
                      <motion.div
                        key={event.id}
                        className={`
                          p-3 rounded-lg bg-gradient-to-r ${getPriorityColor(event.priority)}
                          cursor-pointer hover:shadow-lg transition-all
                        `}
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getEventTypeIcon(event.event_type)}
                            <div>
                              <h4 className="font-medium text-white">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-white/80 mt-1">{event.description}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {event.all_day ? 'Todo el día' : format(new Date(event.start_date), 'HH:mm')}
                                </Badge>
                                {event.priority === 'critical' && (
                                  <AlertTriangle className="w-4 h-4 text-red-300" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estado de Notificaciones */}
            <Card className="cinematic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-luxury">
                  <Bell className="h-5 w-5 text-green-400" />
                  <span className="text-white font-semibold">Notificaciones</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 font-light">Email</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Activo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 font-light">Push</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Activo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-300 font-light">SMS</span>
                    </div>
                    <Badge variant="outline" className="text-gray-400 border-gray-400">
                      Inactivo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showEventModal && (
          <EventModal
            event={selectedEvent}
            isOpen={showEventModal}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
            onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
            onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
          />
        )}
        
        {showNotificationSettings && (
          <NotificationSettings
            isOpen={showNotificationSettings}
            onClose={() => setShowNotificationSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
