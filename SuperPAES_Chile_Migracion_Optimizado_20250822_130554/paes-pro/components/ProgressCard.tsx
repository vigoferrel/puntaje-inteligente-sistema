'use client'

import { UserProgress } from '@/types'
import { getProgressColor, getSkillDisplayName } from '@/lib/utils'

interface ProgressCardProps {
  skill: string
  progress: number
  level?: string
  onClick?: () => void
}

export default function ProgressCard({ skill, progress, level, onClick }: ProgressCardProps) {
  const progressColor = getProgressColor(progress)
  
  return (
    <div 
      className="card hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer hover:border-purple-500/30"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white">{getSkillDisplayName(skill)}</h3>
        <span className="text-2xl font-bold text-white">{progress}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className={`progress-fill ${progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {level && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
          <span>Nivel actual</span>
          <span className="font-medium capitalize text-gray-300">{level}</span>
        </div>
      )}
    </div>
  )
}

interface ProgressSectionProps {
  title: string
  skills: Array<{
    name: string
    progress: number
    level?: string
  }>
  onSkillClick?: (skill: string) => void
}

export function ProgressSection({ title, skills, onSkillClick }: ProgressSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <ProgressCard
            key={skill.name}
            skill={skill.name}
            progress={skill.progress}
            level={skill.level}
            onClick={() => onSkillClick?.(skill.name)}
          />
        ))}
      </div>
    </div>
  )
}
