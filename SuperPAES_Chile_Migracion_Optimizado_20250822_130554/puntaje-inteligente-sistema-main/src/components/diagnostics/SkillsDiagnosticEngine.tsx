import React, { memo, useEffect, useState } from 'react'; 
import { motion } from 'framer-motion'; 
// DISABLED: // DISABLED: import { supabase } from '../../integrations/supabase/unified-client'; 
 
import { supabase } from '../../integrations/supabase/leonardo-auth-client';
// Context7: Diagnostico de skills PAES 
interface SkillDiagnostic { 
  skill_id: string; 
  skill_name: string; 
  current_level: number; 
  target_level: number; 
  improvement_potential: number; 
  exercises_needed: number; 
  estimated_score_increase: number; 
} 
 
const SkillsDiagnosticEngine = memo<{userId: string}>(({ userId }) => { 
  const [diagnostics, setDiagnostics] = useState<SkillDiagnostic[]>([]); 
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => { 
    const loadDiagnostics = async () => { 
      try { 
        const { data: attempts } = await supabase 
          .from('user_exercise_attempts') 
          .select('skill_id, score, difficulty') 
          .eq('user_id', userId); 
 
        const { data: skills } = await supabase 
          .from('paes_skills') 
          .select('id, name, subject'); 
 
        // Calcular diagnosticos por skill 
        const skillDiagnostics = skills?.map(skill => { 
          const skillAttempts = attempts?.filter(a => a.skill_id === skill.id) || []; 
          const currentLevel = skillAttempts.length > 0 ? 
            skillAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / skillAttempts.length : 0; 
 
          const targetLevel = 85; // Meta PAES 
          const improvementPotential = Math.max(0, targetLevel - currentLevel); 
          const exercisesNeeded = Math.ceil(improvementPotential / 2); // 2 puntos por ejercicio 
          const estimatedScoreIncrease = improvementPotential * 0.8; // 80 de efectividad 
 
          return { 
            skill_id: skill.id, 
            skill_name: skill.name, 
            current_level: Math.round(currentLevel), 
            target_level: targetLevel, 
            improvement_potential: Math.round(improvementPotential), 
            exercises_needed: exercisesNeeded, 
            estimated_score_increase: Math.round(estimatedScoreIncrease) 
          }; 
        }) || []; 
 
        setDiagnostics(skillDiagnostics); 
      } catch (error) { 
        console.error('Error en diagnostico:', error); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    loadDiagnostics(); 
  }, [userId]); 
 
  return ( 
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 rounded-xl"> 
      <h2 className="text-2xl font-bold text-white mb-6">Diagnostico de Skills PAES</h2> 
      {diagnostics.map(diagnostic => ( 
        <div key={diagnostic.skill_id} className="bg-white/10 p-4 rounded-lg mb-4"> 
          <h3 className="text-white font-bold">{diagnostic.skill_name}</h3> 
          <p className="text-green-300">Nivel Actual: {diagnostic.current_level}</p> 
          <p className="text-blue-300">Meta: {diagnostic.target_level}</p> 
          <p className="text-yellow-300">Ejercicios Necesarios: {diagnostic.exercises_needed}</p> 
          <p className="text-purple-300">Aumento Estimado: +{diagnostic.estimated_score_increase} puntos</p> 
        </div> 
      ))} 
    </div> 
  ); 
}); 
 
export default SkillsDiagnosticEngine; 


