
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TPAESHabilidad, TPAESPrueba, getPruebaDisplayName, getHabilidadDisplayName } from '@/types/system-types';
import { Download, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export interface SkillResult {
  skill: TPAESHabilidad;
  correctCount: number;
  totalCount: number;
  percentageCorrect: number;
}

export interface SimulationResult {
  id: string;
  timestamp: Date;
  prueba: TPAESPrueba;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredCount: number;
  percentageCorrect: number;
  timeSpentMinutes: number;
  skillResults: SkillResult[];
  estimatedScore: number; // Puntaje estimado PAES
}

interface SimulationResultsProps {
  results: SimulationResult | null;
  onReturnToSelector: () => void;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  results,
  onReturnToSelector
}) => {
  if (!results) {
    return (
      <div className="text-center p-8">
        <p>No hay resultados disponibles.</p>
        <Button onClick={onReturnToSelector} className="mt-4">
          Volver al selector
        </Button>
      </div>
    );
  }
  
  const COLORS = ['#4ade80', '#f87171', '#94a3b8'];
  
  const pieData = [
    { name: 'Correctas', value: results.correctAnswers },
    { name: 'Incorrectas', value: results.wrongAnswers },
    { name: 'Sin responder', value: results.unansweredCount }
  ];
  
  const skillData = results.skillResults.map(skill => ({
    name: getHabilidadDisplayName(skill.skill),
    porcentaje: Math.round(skill.percentageCorrect),
    correctas: skill.correctCount,
    total: skill.totalCount
  }));
  
  const downloadResults = () => {
    // Lógica para exportar resultados a PDF
    console.log('Descargando resultados...');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Resultados de la simulación</h2>
          <p className="text-muted-foreground">
            {getPruebaDisplayName(results.prueba)} · {new Date(results.timestamp).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReturnToSelector}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
          </Button>
          <Button variant="outline" onClick={downloadResults}>
            <Download className="h-4 w-4 mr-1" /> Exportar resultados
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Puntaje estimado</CardTitle>
            <CardDescription>Estimación basada en tu desempeño</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {results.estimatedScore}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Puntos PAES estimados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rendimiento general</CardTitle>
            <CardDescription>Porcentaje de respuestas correctas</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-4xl font-bold">
              {Math.round(results.percentageCorrect)}%
            </div>
            <div className="text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span>{results.correctAnswers} correctas</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                <span>{results.wrongAnswers} incorrectas</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tiempo utilizado</CardTitle>
            <CardDescription>Del tiempo total disponible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {results.timeSpentMinutes} min
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              de {results.prueba === 'MATEMATICA_2' ? 130 : 150} min totales
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Resultado general</TabsTrigger>
          <TabsTrigger value="habilidades">Por habilidad</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de respuestas</CardTitle>
              <CardDescription>
                Análisis de tu rendimiento en la simulación
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habilidades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por habilidad</CardTitle>
              <CardDescription>
                Desglose de tu desempeño en cada habilidad evaluada
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'porcentaje') return [`${value}%`, 'Porcentaje'];
                      if (name === 'correctas') return [value, 'Correctas'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="porcentaje" fill="#4ade80" name="Porcentaje correcto" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recomendaciones" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de estudio</CardTitle>
              <CardDescription>
                Basado en los resultados de tu simulación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.skillResults
                .sort((a, b) => a.percentageCorrect - b.percentageCorrect)
                .slice(0, 3)
                .map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{getHabilidadDisplayName(skill.skill)}</h3>
                      <span className="text-sm">{Math.round(skill.percentageCorrect)}% correcto</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Te recomendamos enfocarte en mejorar esta habilidad. Intenta practicar con ejercicios específicos.
                    </p>
                    <Separator />
                  </div>
                ))
              }
              
              <Button className="w-full mt-4">
                Ver plan de estudio recomendado
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
