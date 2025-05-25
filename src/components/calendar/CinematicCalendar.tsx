
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
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { EventModal } from './EventModal';
import { NotificationSettings } from './NotificationSettings';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'study_session':
        return <BookOpen className="w-3 h-3" />;
      case 'paes_date':
        return <Target className="w-3 h-3" />;
      case 'deadline':
        return <Clock className="w-3 h-3" />;
      case 'reminder':
        return <Bell className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'low':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white">
                Calendario PAES
              </h1>
              <p className="text-gray-300">
                Gestiona tu tiempo de estudio inteligentemente
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowNotificationSettings(true)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
              <Button
                onClick={() => setShowEventModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendario Principal */}
          <div className="xl:col-span-3">
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <CardTitle className="text-white text-xl font-semibold">
                      {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </CardTitle>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    {['Mes', 'Semana', 'Día'].map((mode, index) => {
                      const modeValue = ['month', 'week', 'day'][index] as typeof viewMode;
                      return (
                        <Button
                          key={mode}
                          variant={viewMode === modeValue ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode(modeValue)}
                          className={
                            viewMode === modeValue
                              ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-0'
                              : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                          }
                        >
                          {mode}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {viewMode === 'month' && (
                  <div className="p-4">
                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-400 bg-gray-700/30 rounded-lg">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Días del mes */}
                    <div className="grid grid-cols-7 gap-2">
                      {getDaysInMonth().map((day) => {
                        const dayEvents = getEventsForDate(day);
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                        
                        return (
                          <motion.div
                            key={day.toISOString()}
                            whileHover={{ scale: 1.02 }}
                            className={`
                              relative p-3 min-h-[100px] cursor-pointer rounded-lg border transition-all duration-200
                              ${isSelected 
                                ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20' 
                                : isCurrentMonth 
                                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30' 
                                  : 'border-gray-700 bg-gray-800/30 text-gray-600'
                              }
                              ${isTodayDate ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''}
                            `}
                            onClick={() => setSelectedDate(day)}
                          >
                            <div className={`
                              text-sm font-medium mb-2
                              ${isTodayDate ? 'text-cyan-400 font-bold' : isCurrentMonth ? 'text-white' : 'text-gray-600'}
                            `}>
                              {format(day, 'd')}
                            </div>
                            
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event) => (
                                <motion.div
                                  key={event.id}
                                  className={`
                                    px-2 py-1 rounded text-xs text-white cursor-pointer truncate
                                    ${getPriorityColor(event.priority)}
                                  `}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                    setShowEventModal(true);
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  title={event.title}
                                >
                                  <div className="flex items-center space-x-1">
                                    {getEventTypeIcon(event.event_type)}
                                    <span className="truncate font-medium">{event.title}</span>
                                  </div>
                                </motion.div>
                              ))}
                              
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-400 font-medium px-2">
                                  +{dayEvents.length - 2} más
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Eventos del Día Seleccionado */}
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>{format(selectedDate, 'dd MMM', { locale: es })}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-light">
                        No hay eventos programados
                      </p>
                      <Button
                        onClick={() => setShowEventModal(true)}
                        variant="outline"
                        size="sm"
                        className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar evento
                      </Button>
                    </div>
                  ) : (
                    getEventsForDate(selectedDate).map((event) => (
                      <motion.div
                        key={event.id}
                        className={`
                          p-4 rounded-lg cursor-pointer transition-all duration-200
                          ${getPriorityColor(event.priority)} shadow-lg
                        `}
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 flex-1">
                            {getEventTypeIcon(event.event_type)}
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-white/80 mt-1 line-clamp-2">{event.description}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">
                                  {event.all_day ? 'Todo el día' : format(new Date(event.start_date), 'HH:mm')}
                                </Badge>
                                {event.priority === 'critical' && (
                                  <AlertTriangle className="w-3 h-3 text-white" />
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
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="h-5 w-5 text-green-400" />
                  <span>Sistema de Notificaciones</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 font-medium">Email</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Activo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 font-medium">Push</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Activo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-300 font-medium">SMS</span>
                    </div>
                    <Badge variant="outline" className="border-gray-500 text-gray-400">
                      Próximamente
                    </Badge>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowNotificationSettings(true)}
                  variant="outline"
                  className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
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
