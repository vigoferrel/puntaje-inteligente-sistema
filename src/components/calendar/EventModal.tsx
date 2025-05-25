
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin, AlertTriangle, Trash2, BookOpen, Target, Bell, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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

interface EventModalProps {
  event?: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<CalendarEvent>) => void;
  onDelete?: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    event_type: 'study_session' | 'paes_date' | 'deadline' | 'reminder';
    start_date: string;
    end_date: string;
    all_day: boolean;
    color: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    location: string;
  }>({
    title: '',
    description: '',
    event_type: 'study_session',
    start_date: '',
    end_date: '',
    all_day: false,
    color: '#4F46E5',
    priority: 'medium',
    location: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        event_type: event.event_type,
        start_date: event.start_date.slice(0, 16),
        end_date: event.end_date ? event.end_date.slice(0, 16) : '',
        all_day: event.all_day,
        color: event.color,
        priority: event.priority,
        location: event.location || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        event_type: 'study_session',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: '',
        all_day: false,
        color: '#4F46E5',
        priority: 'medium',
        location: ''
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'study_session':
        return 'from-blue-500 to-cyan-500';
      case 'paes_date':
        return 'from-red-500 to-pink-500';
      case 'deadline':
        return 'from-orange-500 to-yellow-500';
      case 'reminder':
        return 'from-purple-500 to-violet-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getEventTypeColor(formData.event_type)}`}>
              {getEventTypeIcon(formData.event_type)}
            </div>
            <h2 className="text-xl font-semibold text-white">
              {event ? 'Editar Evento' : 'Nuevo Evento'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="event_type" className="text-white font-medium">Tipo de Evento</Label>
            <Select value={formData.event_type} onValueChange={(value: 'study_session' | 'paes_date' | 'deadline' | 'reminder') => handleInputChange('event_type', value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="study_session">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Sesión de Estudio</span>
                  </div>
                </SelectItem>
                <SelectItem value="paes_date">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-red-400" />
                    <span>Fecha PAES</span>
                  </div>
                </SelectItem>
                <SelectItem value="deadline">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>Fecha Límite</span>
                  </div>
                </SelectItem>
                <SelectItem value="reminder">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <span>Recordatorio</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white font-medium">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              placeholder="Ingresa el título del evento"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-medium">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              placeholder="Describe los detalles del evento"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white font-medium">Prioridad</Label>
            <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => handleInputChange('priority', value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="low">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span>Baja</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Media</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Alta</span>
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Crítica</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
            <Switch
              id="all_day"
              checked={formData.all_day}
              onCheckedChange={(checked) => handleInputChange('all_day', checked)}
            />
            <Label htmlFor="all_day" className="text-white font-medium">Todo el día</Label>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-white font-medium">
                {formData.all_day ? 'Fecha' : 'Fecha y Hora de Inicio'}
              </Label>
              <Input
                id="start_date"
                type={formData.all_day ? "date" : "datetime-local"}
                value={formData.all_day ? formData.start_date.slice(0, 10) : formData.start_date}
                onChange={(e) => handleInputChange('start_date', formData.all_day ? e.target.value + 'T00:00' : e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
            </div>

            {!formData.all_day && (
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-white font-medium">Fecha y Hora de Fin</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white font-medium">Ubicación</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              placeholder="¿Dónde será el evento?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-700/50">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </Button>
            )}
            
            <div className="flex space-x-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
              >
                {event ? 'Actualizar' : 'Crear Evento'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
