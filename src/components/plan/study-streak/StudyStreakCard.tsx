
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Flame, Trophy, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

  const getStreakBackgroundColor = (streak: number) => {
    if (streak >= 7) return "bg-red-100";
    if (streak >= 3) return "bg-orange-100";
    return "bg-yellow-100";
  };
  
  const getMotivationalMessage = (streak: number) => {
    if (streak >= 10) return "¡Increíble disciplina! Sigue así.";
    if (streak >= 7) return "¡Tu constancia está dando frutos!";
    if (streak >= 3) return "¡Buen ritmo! Mantén la constancia.";
    if (streak >= 1) return "¡Buen comienzo! Un día a la vez.";
    return "¡Comienza hoy tu racha de estudio!";
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 10) return <Badge className="bg-purple-500">Experto</Badge>;
    if (streak >= 7) return <Badge className="bg-red-500">Avanzado</Badge>;
    if (streak >= 3) return <Badge className="bg-orange-500">Intermedio</Badge>;
    if (streak >= 1) return <Badge className="bg-yellow-500">Principiante</Badge>;
    return null;
  };

  const getDaysUntilNextBadge = (streak: number) => {
    if (streak >= 10) return null;
    if (streak >= 7) return 10 - streak;
    if (streak >= 3) return 7 - streak;
    if (streak >= 1) return 3 - streak;
    return 1;
  };

  const daysUntilNextBadge = getDaysUntilNextBadge(getCurrentStreak());
  const nextBadgeProgress = daysUntilNextBadge ? 
    (getCurrentStreak() / (getCurrentStreak() + daysUntilNextBadge)) * 100 : 100;
  
  const lastStudyDate = streakData?.lastStudyDate ? new Date(streakData.lastStudyDate) : null;
  const daysSinceLastStudy = lastStudyDate ? 
    differenceInDays(new Date(), lastStudyDate) : null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`col-span-1 ${getCurrentStreak() > 0 ? 'border-2 border-primary/20' : ''} hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full ${getStreakBackgroundColor(getCurrentStreak())} flex items-center justify-center mr-4`}>
                  <Flame className={`h-6 w-6 ${getStreakColor(getCurrentStreak())}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Racha de estudio</h3>
                    {getStreakBadge(getCurrentStreak())}
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      {getCurrentStreak() > 0 ? 
                        `${getCurrentStreak()} día${getCurrentStreak() !== 1 ? 's' : ''} consecutivo${getCurrentStreak() !== 1 ? 's' : ''}` : 
                        "Comienza hoy"}
                    </p>
                  </div>
                </div>
              </div>
              
              {getCurrentStreak() > 0 && daysUntilNextBadge && (
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-primary/80">
                      {daysUntilNextBadge} día{daysUntilNextBadge !== 1 ? 's' : ''} para el siguiente nivel
                    </span>
                    <span>{Math.round(nextBadgeProgress)}%</span>
                  </div>
                  <Progress value={nextBadgeProgress} className="h-1.5" />
                </div>
              )}

              {daysSinceLastStudy !== null && daysSinceLastStudy > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {daysSinceLastStudy === 1 ? 
                    "¡No pierdas tu racha! Estudia hoy." : 
                    `Han pasado ${daysSinceLastStudy} días desde tu última sesión.`}
                </p>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-4 max-w-xs">
          <div className="space-y-3">
            <div className="font-medium">{getMotivationalMessage(getCurrentStreak())}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-primary/5 p-2 rounded">
                <div className="flex items-center text-primary mb-1">
                  <Flame className="h-4 w-4 mr-1" />
                  <p className="font-medium">Racha actual</p>
                </div>
                <p className="text-lg font-semibold">{streakData?.currentStreak || 0} días</p>
              </div>
              <div className="bg-primary/5 p-2 rounded">
                <div className="flex items-center text-primary mb-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  <p className="font-medium">Mejor racha</p>
                </div>
                <p className="text-lg font-semibold">{streakData?.longestStreak || 0} días</p>
              </div>
              <div className="bg-primary/5 p-2 rounded">
                <div className="flex items-center text-primary mb-1">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <p className="font-medium">Último estudio</p>
                </div>
                <p className="font-medium">{streakData?.lastStudyDate ? formatDate(streakData.lastStudyDate) : "No hay actividad"}</p>
              </div>
              <div className="bg-primary/5 p-2 rounded">
                <div className="flex items-center text-primary mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <p className="font-medium">Total días</p>
                </div>
                <p className="font-medium">{streakData?.totalStudyDays || 0} días</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Estudiar todos los días mejora tus resultados hasta un 80%. ¡Mantén tu racha!
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
