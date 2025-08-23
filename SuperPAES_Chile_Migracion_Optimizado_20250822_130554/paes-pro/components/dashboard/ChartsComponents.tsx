import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { 
  DailyActivity, 
  SkillProgress, 
  WeeklyProgress 
} from '@/types/dashboard'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  isLoading?: boolean
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border/40 backdrop-blur-sm hover:bg-card/90 transition-colors">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Cargando gráfico...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border/40 backdrop-blur-sm hover:bg-card/90 transition-colors">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  color: 'hsl(var(--foreground))'
}

interface SubjectProgressChartProps {
  subjects: Array<{
    displayName: string
    progress: number
    score: number
    completedNodes: number
    totalNodes: number
  }>
  isLoading?: boolean
}

export const SubjectProgressChart: React.FC<SubjectProgressChartProps> = ({ 
  subjects, 
  isLoading 
}) => {
  const chartData = subjects.map(subject => ({
    name: subject.displayName.replace(' y Ciencias Sociales', ''),
    progress: subject.progress,
    score: subject.score || 0,
    completedNodes: subject.completedNodes,
    totalNodes: subject.totalNodes
  }))

  return (
    <ChartCard title="Progreso por Materia" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--foreground))" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
          />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value, name) => {
              if (name === 'progress') return [`${value}%`, 'Progreso']
              if (name === 'score') return [`${value}`, 'Puntaje']
              return [value, name]
            }}
          />
          <Bar 
            dataKey="progress" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
            name="progress"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface SkillsRadarChartProps {
  skills: SkillProgress[]
  isLoading?: boolean
}

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ 
  skills, 
  isLoading 
}) => {
  const chartData = skills.map(skill => ({
    subject: skill.skill.replace(' y ', ' '),
    A: skill.masteryPercentage,
    fullMark: 100
  }))

  return (
    <ChartCard title="Habilidades PAES" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
          />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
            tickCount={5}
          />
          <Radar
            name="Dominio"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, 'Dominio']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface StudyTimeChartProps {
  dailyActivity: DailyActivity[]
  isLoading?: boolean
}

export const StudyTimeChart: React.FC<StudyTimeChartProps> = ({ 
  dailyActivity, 
  isLoading 
}) => {
  const chartData = dailyActivity.map(day => ({
    date: new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
    minutes: day.studyMinutes,
    sessions: day.sessionsCompleted,
    score: day.averageScore
  }))

  return (
    <ChartCard title="Actividad de los Últimos 7 Días" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--foreground))" 
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="hsl(var(--foreground))" 
            fontSize={12}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke="hsl(var(--foreground))" 
            fontSize={12}
          />
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value, name) => {
              if (name === 'minutes') return [`${value} min`, 'Tiempo de Estudio']
              if (name === 'score') return [`${value}%`, 'Promedio']
              return [value, name]
            }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="minutes" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            name="minutes"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="score" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            name="score"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface SubjectDistributionChartProps {
  subjects: Array<{
    displayName: string
    averageTime?: number
  }>
  isLoading?: boolean
}

export const SubjectDistributionChart: React.FC<SubjectDistributionChartProps> = ({ 
  subjects, 
  isLoading 
}) => {
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--primary)/0.8)',
    'hsl(var(--primary)/0.6)',
    'hsl(var(--primary)/0.4)',
    'hsl(var(--primary)/0.2)'
  ]
  
  const chartData = subjects
    .map((subject, index) => ({
      name: subject.displayName.replace(' y Ciencias Sociales', ''),
      value: subject.averageTime || 0,
      color: COLORS[index % COLORS.length]
    }))
    .filter(item => item.value > 0)

  if (chartData.length === 0) {
    return (
      <ChartCard title="Distribución de Tiempo" isLoading={isLoading}>
        <div className="h-64 flex items-center justify-center">
          <div className="text-muted-foreground">No hay datos de tiempo disponibles</div>
        </div>
      </ChartCard>
    )
  }

  return (
    <ChartCard title="Distribución de Tiempo por Materia" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="hsl(var(--primary))"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value} min`, 'Tiempo Promedio']}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface WeeklyProgressChartProps {
  weeklyData: WeeklyProgress[]
  isLoading?: boolean
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ 
  weeklyData, 
  isLoading 
}) => {
  return (
    <ChartCard title="Evolución Semanal" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" stroke="hsl(var(--foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value, name) => {
              if (name === 'totalTime') return [`${value} min`, 'Tiempo Total']
              if (name === 'avgScore') return [`${value}%`, 'Promedio']
              if (name === 'improvement') {
                const numValue = Number(value)
                return [`${numValue >= 0 ? '+' : ''}${numValue}%`, 'Mejora']
              }
              return [value, name]
            }}
          />
          <Bar 
            dataKey="totalTime" 
            fill="hsl(var(--primary))" 
            name="totalTime"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
