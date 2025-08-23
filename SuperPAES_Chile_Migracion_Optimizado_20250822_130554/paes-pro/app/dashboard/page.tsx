'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import {
  LogOut,
  User,
  Settings,
  RefreshCw,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react'

// Importar componentes del dashboard
import { 
  StatsCards, 
  ProgressRing, 
  QuickActions, 
  ActivityTimeline 
} from '@/components/dashboard/StatsComponents'
import { 
  SubjectProgressChart,
  SkillsRadarChart,
  StudyTimeChart,
  SubjectDistributionChart,
  WeeklyProgressChart
} from '@/components/dashboard/ChartsComponents'
import { 
  RecommendationsList,
  StudyPlanCard,
  QuickTips
} from '@/components/dashboard/RecommendationsComponents'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const {
    stats,
    subjectProgress,
    metrics,
    recommendations,
    studyPlan,
    isLoading,
    hasError,
    refreshAll,
    updateActivity
  } = useDashboardData()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleQuickAction = async (action: string) => {
    console.log('Quick action:', action)
    
    // Simular actualización de actividad
    if (action === 'study-session') {
      try {
        await updateActivity({
          studyMinutes: 30,
          score: 85
        })
      } catch (error) {
        console.error('Error updating activity:', error)
      }
    }
    
    // Aquí se pueden implementar las navegaciones específicas
    switch (action) {
      case 'study-session':
        // Navegar a sesión de estudio
        break
      case 'practice-test':
        // Navegar a examen de práctica
        break
      case 'review-weak-areas':
        // Navegar a áreas débiles
        break
      case 'daily-challenge':
        // Navegar a desafío diario
        break
    }
  }

  const handleRecommendationAction = (recommendation: any) => {
    console.log('Recommendation action:', recommendation)
    // Implementar navegación según la recomendación
  }

  const mockRecentActivity = [
    {
      id: '1',
      type: 'study' as const,
      title: 'Sesión de Matemática M1',
      subtitle: 'Completaste 3 ejercicios',
      time: 'Hace 2 horas',
      icon: 'book'
    },
    {
      id: '2',
      type: 'achievement' as const,
      title: '7 días de racha',
      subtitle: 'Mantuviste tu racha de estudio',
      time: 'Ayer',
      icon: 'award'
    },
    {
      id: '3',
      type: 'practice' as const,
      title: 'Examen de Competencia Lectora',
      subtitle: 'Puntaje: 78/100',
      time: 'Hace 3 días',
      icon: 'target'
    }
  ]

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Error al cargar los datos</div>
          <Button onClick={refreshAll} variant="outline" className="text-white border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                PAES Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={refreshAll}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Bell className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-white font-medium text-sm">{user?.full_name}</p>
                  <p className="text-gray-300 text-xs">{user?.email}</p>
                </div>
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold">Navegación</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Resumen General', icon: '📊' },
                { id: 'progress', label: 'Mi Progreso', icon: '📈' },
                { id: 'study-plan', label: 'Plan de Estudio', icon: '📚' },
                { id: 'recommendations', label: 'Recomendaciones', icon: '💡' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Tabs de navegación para desktop */}
      <div className="container mx-auto px-4 py-4">
        <div className="hidden lg:flex space-x-1 bg-white/5 rounded-lg p-1 mb-6 w-fit">
          {[
            { id: 'overview', label: 'Resumen General' },
            { id: 'progress', label: 'Mi Progreso' },
            { id: 'study-plan', label: 'Plan de Estudio' },
            { id: 'recommendations', label: 'Recomendaciones' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        <main className="space-y-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              ¡Bienvenido de vuelta, {user?.full_name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-muted-foreground">
              {stats?.currentStreakDays && stats.currentStreakDays > 0 
                ? `Llevas ${stats.currentStreakDays} días seguidos estudiando. ¡Excelente trabajo!`
                : 'Es un buen momento para retomar tu preparación para la PAES.'
              }
            </p>
          </div>

          {/* Resumen General */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards con animación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatsCards
                  stats={stats ? {
                    ...stats,
                    lastActivityDate: stats.lastActivityDate || new Date().toISOString()
                  } : null}
                  isLoading={isLoading}
                />
              </motion.div>

              {/* Progreso General y Acciones Rápidas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="bg-card border-border/40 backdrop-blur-sm hover:bg-card/90 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">Progreso General</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <ProgressRing 
                        progress={stats?.progressPercentage || 0}
                        color="#3B82F6"
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {stats?.progressPercentage || 0}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {stats?.completedNodes || 0}/{stats?.totalNodes || 0}
                          </div>
                        </div>
                      </ProgressRing>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="bg-card border-border/40 backdrop-blur-sm hover:bg-card/90 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <QuickActions onAction={handleQuickAction} />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Gráficos principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubjectProgressChart 
                  subjects={subjectProgress} 
                  isLoading={isLoading} 
                />
                <StudyTimeChart 
                  dailyActivity={metrics?.dailyActivity || []} 
                  isLoading={isLoading} 
                />
              </div>

              {/* Actividad reciente y Tips */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border/40 backdrop-blur-sm hover:bg-card/90 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white">Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityTimeline activities={mockRecentActivity} />
                  </CardContent>
                </Card>

                <QuickTips tips={[]} />
              </div>
            </>
          )}

          {/* Mi Progreso */}
          {activeTab === 'progress' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkillsRadarChart 
                  skills={metrics?.skillsProgress || []} 
                  isLoading={isLoading} 
                />
                <SubjectDistributionChart 
                  subjects={subjectProgress} 
                  isLoading={isLoading} 
                />
              </div>

              <WeeklyProgressChart 
                weeklyData={metrics?.weeklyProgress || []} 
                isLoading={isLoading} 
              />

              <SubjectProgressChart 
                subjects={subjectProgress} 
                isLoading={isLoading} 
              />
            </>
          )}

          {/* Plan de Estudio */}
          {activeTab === 'study-plan' && (
            <>
              {studyPlan && (
                <StudyPlanCard 
                  studyPlan={studyPlan} 
                  isLoading={isLoading} 
                />
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StudyTimeChart 
                  dailyActivity={metrics?.dailyActivity || []} 
                  isLoading={isLoading} 
                />
                <SubjectDistributionChart 
                  subjects={subjectProgress} 
                  isLoading={isLoading} 
                />
              </div>
            </>
          )}

          {/* Recomendaciones */}
          {activeTab === 'recommendations' && (
            <>
              <RecommendationsList 
                recommendations={recommendations} 
                isLoading={isLoading}
                onActionClick={handleRecommendationAction}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickTips tips={[]} />
                <Card className="bg-card border-border/40 backdrop-blur-sm hover:bg-card/90 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white">Progreso de Habilidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics?.skillsProgress.slice(0, 4).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-white">{skill.skill}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-secondary/50 rounded-full">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                style={{ width: `${skill.masteryPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8">
                              {skill.masteryPercentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
