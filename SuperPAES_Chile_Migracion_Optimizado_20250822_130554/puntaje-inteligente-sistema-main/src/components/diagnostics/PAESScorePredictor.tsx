import React, { memo, useEffect, useState } from 'react'; 
// DISABLED: // DISABLED: import { supabase } from '../../integrations/supabase/unified-client'; 
import { supabase } from '../../integrations/supabase/leonardo-auth-client';
 
interface ScorePrediction { 
  subject: string; 
  current_estimated: number; 
  target_score: number; 
  improvement_needed: number; 
  weeks_to_target: number; 
  confidence_level: number; 
  recommended_actions: string[]; 
} 
 
const PAESScorePredictor = memo<{userId: string}>(({ userId }) => { 
  const [predictions, setPredictions] = useState<ScorePrediction[]>([]); 
 
  useEffect(() => { 
    const generatePredictions = async () => { 
      const subjects = ['Matematica', 'Lenguaje', 'Ciencias', 'Historia']; 
      const results = []; 
 
      for (const subject of subjects) { 
        const { data: attempts } = await supabase 
          .from('user_exercise_attempts') 
          .select('score, created_at') 
          .eq('user_id', userId) 
          .eq('subject', subject) 
          .order('created_at', { ascending: false }) 
          .limit(20); 
 
          const recentScores = attempts.map(a => a.score || 0); 
          const currentEstimated = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length; 
 
          // Convertir a escala PAES (150-850) 
          const paesScore = 150 + (currentEstimated / 100) * 700; 
          const targetScore = 600; // Meta promedio PAES 
          const improvementNeeded = Math.max(0, targetScore - paesScore); 
 
          // Calcular semanas necesarias basado en progreso actual 
          const weeklyImprovement = recentScores.length > 1 ? 
            (recentScores[0] - recentScores[recentScores.length - 1]) / recentScores.length : 2; 
          const weeksToTarget = weeklyImprovement > 0 ? 
            Math.ceil(improvementNeeded / (weeklyImprovement * 7)) : 12; 
 
          const confidenceLevel = Math.min(95, 60 + (recentScores.length * 2)); 
 
          const recommendedActions = []; 
          if (currentEstimated < 70) recommendedActions.push('Reforzar conceptos basicos'); 
          if (currentEstimated < 80) recommendedActions.push('Practicar ejercicios intermedios'); 
          if (currentEstimated >= 80) recommendedActions.push('Ejercicios avanzados y simulacros'); 
          recommendedActions.push('Simulacros cronometrados'); 
 
          results.push({ 
            subject, 
            current_estimated: Math.round(paesScore), 
            target_score: targetScore, 
            improvement_needed: Math.round(improvementNeeded), 
            weeks_to_target: weeksToTarget, 
            confidence_level: confidenceLevel, 
            recommended_actions: recommendedActions 
          }); 
        } 
      } 
      setPredictions(results); 
    }; 
    generatePredictions(); 
  }, [userId]); 
 
  return ( 
    <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 p-6 rounded-xl"> 
      <h2 className="text-2xl font-bold text-white mb-6">Predictor de Puntaje PAES</h2> 
      {predictions.map(prediction => ( 
        <div key={prediction.subject} className="bg-white/10 p-4 rounded-lg mb-4"> 
          <h3 className="text-white font-bold text-lg">{prediction.subject}</h3> 
          <div className="grid grid-cols-2 gap-4 mt-3"> 
            <p className="text-cyan-300">Puntaje Actual: {prediction.current_estimated}</p> 
            <p className="text-green-300">Meta: {prediction.target_score}</p> 
            <p className="text-yellow-300">Mejora Necesaria: +{prediction.improvement_needed}</p> 
            <p className="text-orange-300">Semanas Estimadas: {prediction.weeks_to_target}</p> 
          </div> 
          <p className="text-purple-300 mt-2">Confianza: {prediction.confidence_level}</p> 
          <div className="mt-3"> 
            <p className="text-white/80 text-sm mb-2">Acciones Recomendadas:</p> 
            {prediction.recommended_actions.map((action, index) => ( 
              <span key={index} className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs mr-2 mb-1"> 
                {action} 
              </span> 
            ))} 
          </div> 
        </div> 
      ))} 
    </div> 
  ); 
}); 
 
export default PAESScorePredictor; 


