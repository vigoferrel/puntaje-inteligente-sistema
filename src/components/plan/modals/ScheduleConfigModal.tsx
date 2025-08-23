
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Bell, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ScheduleConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StudySession {
  day: number;
  startTime: string;
  endTime: string;
  duration: number;
  isActive: boolean;
}

const DAYS_OF_WEEK = [
  { id: 1, name: 'Lunes', short: 'L' },
  { id: 2, name: 'Martes', short: 'M' },
  { id: 3, name: 'Miércoles', short: 'X' },
  { id: 4, name: 'Jueves', short: 'J' },
  { id: 5, name: 'Viernes', short: 'V' },
  { id: 6, name: 'Sábado', short: 'S' },
  { id: 0, name: 'Domingo', short: 'D' }
];

export const ScheduleConfigModal: React.FC<ScheduleConfigModalProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar horarios existentes
  useEffect(() => {
    if (open && user?.id) {
      loadExistingSchedules();
    }
  }, [open, user?.id]);

  const loadExistingSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_study_schedules')
        .select('*')
        .eq('user_id', user!.id)
        .order('day_of_week');

      if (error) throw error;

      const loadedSessions = DAYS_OF_WEEK.map(day => {
        const existingSession = data?.find(s => s.day_of_week === day.id);
        return {
          day: day.id,
          startTime: existingSession?.start_time || '19:00',
          endTime: existingSession?.end_time || '20:30',
          duration: existingSession?.session_duration_minutes || 90,
          isActive: existingSession?.is_active || false
        };
      });

      setSessions(loadedSessions);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los horarios existentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSession = (dayId: number, updates: Partial<StudySession>) => {
    setSessions(prev => prev.map(session => 
      session.day === dayId ? { ...session, ...updates } : session
    ));
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));
  };

  const handleTimeChange = (dayId: number, field: 'startTime' | 'endTime', value: string) => {
    const session = sessions.find(s => s.day === dayId);
    if (!session) return;

    const newSession = { ...session, [field]: value };
    
    // Recalcular duración
    if (field === 'startTime' || field === 'endTime') {
      newSession.duration = calculateDuration(
        field === 'startTime' ? value : session.startTime,
        field === 'endTime' ? value : session.endTime
      );
    }

    updateSession(dayId, newSession);
  };

  const saveSchedules = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      // Eliminar horarios existentes
      await supabase
        .from('user_study_schedules')
        .delete()
        .eq('user_id', user.id);

      // Insertar nuevos horarios activos
      const activeSchedules = sessions
        .filter(session => session.isActive)
        .map(session => ({
          user_id: user.id,
          day_of_week: session.day,
          start_time: session.startTime,
          end_time: session.endTime,
          session_duration_minutes: session.duration,
          is_active: true
        }));

      if (activeSchedules.length > 0) {
        const { error } = await supabase
          .from('user_study_schedules')
          .insert(activeSchedules);

        if (error) throw error;
      }

      toast({
        title: "¡Horarios guardados!",
        description: `Se configuraron ${activeSchedules.length} sesiones de estudio`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving schedules:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los horarios",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getTotalWeeklyHours = () => {
    return sessions
      .filter(s => s.isActive)
      .reduce((total, session) => total + session.duration, 0) / 60;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Configurar Horarios de Estudio
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Establece tu rutina semanal de estudio para optimizar tu preparación PAES
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resumen */}
            <Card className="bg-blue-600/10 border-blue-600/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">
                      Total Semanal: {getTotalWeeklyHours().toFixed(1)} horas
                    </span>
                  </div>
                  <Badge variant="outline" className="border-blue-600/50 text-blue-400">
                    {sessions.filter(s => s.isActive).length} sesiones activas
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Horarios por día */}
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day) => {
                const session = sessions.find(s => s.day === day.id);
                if (!session) return null;

                return (
                  <Card key={day.id} className={`border transition-all ${
                    session.isActive 
                      ? 'border-green-600/50 bg-green-600/5' 
                      : 'border-gray-600 bg-gray-700/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            session.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                          }`}>
                            {day.short}
                          </div>
                          <span className="text-white font-medium">{day.name}</span>
                        </div>
                        <Switch
                          checked={session.isActive}
                          onCheckedChange={(checked) => updateSession(day.id, { isActive: checked })}
                        />
                      </div>

                      {session.isActive && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-gray-300 text-sm">Hora de inicio</Label>
                            <Input
                              type="time"
                              value={session.startTime}
                              onChange={(e) => handleTimeChange(day.id, 'startTime', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300 text-sm">Hora de fin</Label>
                            <Input
                              type="time"
                              value={session.endTime}
                              onChange={(e) => handleTimeChange(day.id, 'endTime', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300 text-sm">Duración</Label>
                            <div className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm">
                              {Math.round(session.duration)} min
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Consejos */}
            <Card className="bg-yellow-600/10 border-yellow-600/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Consejos para tu horario
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 space-y-1">
                <p>• Mantén sesiones de 60-120 minutos para máxima concentración</p>
                <p>• Estudia a la misma hora cada día para crear hábito</p>
                <p>• Programa al menos 10-15 horas semanales para resultados óptimos</p>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={saveSchedules}
            disabled={saving || sessions.filter(s => s.isActive).length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Horarios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
