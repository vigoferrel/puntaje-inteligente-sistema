
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'study_session' as const,
    start_date: '',
    end_date: '',
    all_day: false,
    color: '#4F46E5',
    priority: 'medium' as const,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="event_type" className="text-white">Tipo de Evento</Label>
            <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="study_session">Sesión de Estudio</SelectItem>
                <SelectItem value="paes_date">Fecha PAES</SelectItem>
                <SelectItem value="deadline">Fecha Límite</SelectItem>
                <SelectItem value="reminder">Recordatorio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority" className="text-white">Prioridad</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="all_day"
              checked={formData.all_day}
              onCheckedChange={(checked) => handleInputChange('all_day', checked)}
            />
            <Label htmlFor="all_day" className="text-white">Todo el día</Label>
          </div>

          <div>
            <Label htmlFor="start_date" className="text-white">Fecha de Inicio</Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          {!formData.all_day && (
            <div>
              <Label htmlFor="end_date" className="text-white">Fecha de Fin</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          )}

          <div>
            <Label htmlFor="location" className="text-white">Ubicación</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Opcional"
            />
          </div>

          <div className="flex justify-between pt-4">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </Button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {event ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
