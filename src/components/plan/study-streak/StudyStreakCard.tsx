
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isToday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";

interface StudyStreakCardProps {
  streakData?: {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
    totalStudyDays: number;
  };
}

export const StudyStreakCard = ({ streakData }: StudyStreakCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin actividad";
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return "Hoy";
    } else if (isTomorrow(date)) {
      return "Ayer";
    } else {
      return format(date, "d 'de' MMMM", { locale: es });
    }
  };
  
  const getCurrentStreak = () => {
    if (!streakData) return 0;
    return streakData.currentStreak;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-red-500";
    if (streak >= 3) return "text-orange-500";
    return "text-yellow-500";
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="col-span-1 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <Flame className={`h-6 w-6 ${getStreakColor(getCurrentStreak())}`} />
              </div>
              <div>
                <h3 className="font-medium">Racha de estudio</h3>
                <p className="text-sm text-muted-foreground">
                  {getCurrentStreak() > 0 ? 
                    `${getCurrentStreak()} día${getCurrentStreak() !== 1 ? 's' : ''} consecutivo${getCurrentStreak() !== 1 ? 's' : ''}` : 
                    "Comienza hoy"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-4 max-w-xs">
          <div className="space-y-2">
            <div className="font-medium">Detalles de racha</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Racha actual</p>
                <p className="font-medium">{streakData?.currentStreak || 0} días</p>
              </div>
              <div>
                <p className="text-muted-foreground">Racha más larga</p>
                <p className="font-medium">{streakData?.longestStreak || 0} días</p>
              </div>
              <div>
                <p className="text-muted-foreground">Último estudio</p>
                <p className="font-medium">{streakData?.lastStudyDate ? formatDate(streakData.lastStudyDate) : "No hay actividad"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Días estudiados</p>
                <p className="font-medium">{streakData?.totalStudyDays || 0} días</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Mantén tu racha estudiando todos los días para mejorar tus resultados.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
