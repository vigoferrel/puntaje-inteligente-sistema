
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, AlertTriangle, Trash2 } from 'lucide-react';

// Definir tipos localmente para evitar conflictos
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
    event_type: 'study_session' as 'study_session' | 'paes_date' | 'deadline' | 'reminder',
    start_date: '',
    end_date: '',
    all_day: false,
    color: '#4F46E5',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    location: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        event_type: event.event_type,
        start_date: event.start_date,
        end_date: event.end_date || '',
        all_day: event.all_day,
        color: event.color,
        priority: event.priority,
        location: event.location || ''
      });
    } else {
      // Reset form for new event
      const now = new Date();
      setFormData({
        title: '',
        description: '',
        event_type: 'study_session',
        start_date: now.toISOString().slice(0, 16),
        end_date: new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
        all_day: false,
        color: '#4F46E5',
        priority: 'medium',
        location: ''
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const eventTypeOptions = [
    { value: 'study_session', label: 'Sesión de Estudio', color: 'bg-blue-500' },
    { value: 'paes_date', label: 'Fecha PAES', color: 'bg-green-500' },
    { value: 'deadline', label: 'Fecha Límite', color: 'bg-orange-500' },
    { value: 'reminder', label: 'Recordatorio', color: 'bg-purple-500' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'bg-gray-500' },
    { value: 'medium', label: 'Media', color: 'bg-blue-500' },
    { value: 'high', label: 'Alta', color: 'bg-orange-500' },
    { value: 'critical', label: 'Crítica', color: 'bg-red-500' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl cinematic-card border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-luxury text-white">
            <Calendar className="h-5 w-5 text-cyan-400" />
            <span>{event ? 'Editar Evento' : 'Nuevo Evento'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300 font-medium">
              Título del Evento
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Sesión de Matemáticas"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300 font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción opcional del evento"
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>

          {/* Tipo y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">Tipo de Evento</Label>
              <Select value={formData.event_type} onValueChange={(value: 'study_session' | 'paes_date' | 'deadline' | 'reminder') => setFormData({ ...formData, event_type: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">Prioridad</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Todo el día */}
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.all_day}
              onCheckedChange={(checked) => setFormData({ ...formData, all_day: checked })}
            />
            <Label className="text-gray-300 font-medium">Todo el día</Label>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-medium">
                {formData.all_day ? 'Fecha' : 'Fecha y hora de inicio'}
              </Label>
              <Input
                type={formData.all_day ? 'date' : 'datetime-local'}
                value={formData.all_day ? formData.start_date.split('T')[0] : formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            {!formData.all_day && (
              <div className="space-y-2">
                <Label className="text-gray-300 font-medium">Fecha y hora de fin</Label>
                <Input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            )}
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300 font-medium">
              Ubicación
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Biblioteca, Casa, Online"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-between pt-4">
            <div>
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
            </div>
            
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="cinematic-button">
                {event ? 'Actualizar' : 'Crear'} Evento
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
