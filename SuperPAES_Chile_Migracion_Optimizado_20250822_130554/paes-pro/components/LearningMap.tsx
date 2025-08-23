'use client'

import { LearningNode, UserProgress } from '@/types'
import { getProgressColor } from '@/lib/utils'
import { Lock, CheckCircle, Circle } from 'lucide-react'

interface LearningTrackProps {
  track: {
    name: string
    skill: string
    progress: number
    nodes: LearningNode[]
    userProgress: UserProgress[]
  }
  onNodeClick?: (nodeId: string) => void
}

export default function LearningTrack({ track, onNodeClick }: LearningTrackProps) {
  const progressColor = getProgressColor(track.progress)
  
  return (
    <div className="card">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-sm">
            TRACK {track.name.replace(' ', '_').toUpperCase()}
          </h3>
          <span className="text-sm text-purple-600 font-medium">
            Nivel actual: {track.progress}%
          </span>
        </div>
        
        <div className="progress-bar">
          <div 
            className={`progress-fill ${progressColor}`}
            style={{ width: `${track.progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {track.nodes.length > 0 ? (
          track.nodes.map((node, index) => {
            const nodeProgress = track.userProgress.find(p => p.node_id === node.id)
            const isCompleted = nodeProgress?.status === 'completed'
            const isInProgress = nodeProgress?.status === 'in-progress'
            const isLocked = !nodeProgress && index > 0 && !track.userProgress.find(p => 
              track.nodes.findIndex(n => n.id === p.node_id) === index - 1 && 
              p.status === 'completed'
            )

            return (
              <div
                key={node.id}
                className={`flex items-center p-3 rounded-lg border transition-colors ${
                  isLocked 
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                    : 'bg-white border-gray-200 hover:border-purple-300 cursor-pointer'
                }`}
                onClick={() => !isLocked && onNodeClick?.(node.id)}
              >
                <div className="mr-3">
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isInProgress ? 'text-blue-500' : 'text-gray-400'}`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                    {node.name}
                  </h4>
                  {node.description && (
                    <p className={`text-sm ${isLocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {node.description}
                    </p>
                  )}
                </div>
                
                {nodeProgress && (
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      isCompleted ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {Math.round(nodeProgress.progress_percentage)}%
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {nodeProgress.status.replace('-', ' ')}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Circle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No hay nodos disponibles para esta habilidad</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface LearningMapProps {
  tracks: Array<{
    name: string
    skill: string
    progress: number
    nodes: LearningNode[]
    userProgress: UserProgress[]
  }>
  onNodeClick?: (nodeId: string) => void
}

export function LearningMap({ tracks, onNodeClick }: LearningMapProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Mapa de Aprendizaje</h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {tracks.map((track) => (
          <LearningTrack
            key={track.skill}
            track={track}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  )
}
