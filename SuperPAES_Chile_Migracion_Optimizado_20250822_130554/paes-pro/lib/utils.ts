import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return Math.round(score).toString()
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export function getProgressColor(percentage: number): string {
  if (percentage === 0) return 'bg-gray-200'
  if (percentage < 30) return 'bg-red-500'
  if (percentage < 60) return 'bg-yellow-500'
  if (percentage < 90) return 'bg-blue-500'
  return 'bg-green-500'
}

export function getSkillDisplayName(skill: string): string {
  const skillNames: Record<string, string> = {
    'Localizar': 'Localizar información',
    'Interpretar y relacionar': 'Interpretar y relacionar',
    'Evaluar y reflexionar': 'Evaluar y reflexionar',
    'Resolver problemas': 'Resolver problemas',
    'Modelar': 'Modelar situaciones',
    'Representar': 'Representar información'
  }
  return skillNames[skill] || skill
}

export function getTestTypeDisplayName(testType: string): string {
  const testNames: Record<string, string> = {
    'COMPETENCIA_LECTORA': 'Competencia Lectora',
    'MATEMATICA_M1': 'Matemática M1',
    'MATEMATICA_M2': 'Matemática M2',
    'CIENCIAS': 'Ciencias',
    'HISTORIA': 'Historia y Ciencias Sociales'
  }
  return testNames[testType] || testType
}

export function calculateProgressStats(progressData: any[]) {
  const totalNodes = progressData.length
  const completedNodes = progressData.filter(p => p.status === 'completed').length
  const inProgressNodes = progressData.filter(p => p.status === 'in-progress').length
  const averageScore = totalNodes > 0 
    ? progressData.reduce((sum, p) => sum + (p.score || 0), 0) / totalNodes 
    : 0
  const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0)

  return {
    totalNodes,
    completedNodes,
    inProgressNodes,
    averageScore,
    totalTimeSpent
  }
}
