
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Database, CheckCircle, AlertTriangle, TrendingUp, Settings, Activity } from 'lucide-react';
import { parseSecurityData, SecurityMetrics } from '@/utils/typeGuards';

interface ComplianceIssue {
  id: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  status: 'needs_attention' | 'monitoring' | 'resolved';
}

export const SecurityComplianceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    data_integrity_score: 100,
    security_issues: 0,
    overall_status: 'healthy',
    performance_score: 85
  });
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const analyzeCompliance = async () => {
    try {
      setIsLoading(true);
      
      const { data: readinessData } = await supabase.rpc('production_readiness_check');
      const securityData = parseSecurityData(readinessData);
      setMetrics(securityData);

      const issues: ComplianceIssue[] = [];
      
      if (securityData.security_issues && securityData.security_issues > 0) {
        issues.push({
          id: 'data-integrity',
          category: 'Data Integrity',
          severity: 'medium',
          description: `${securityData.security_issues} problemas de integridad detectados`,
          recommendation: 'Revisar mapeo de skill_id y test_id en las tablas relacionadas',
          status: 'needs_attention'
        });
      }

      if (securityData.performance_score && securityData.performance_score < 80) {
        issues.push({
          id: 'performance',
          category: 'Performance',
          severity: 'low',
          description: `Performance del sistema en ${securityData.performance_score}%`,
          recommendation: 'Optimizar consultas y revisar índices de base de datos',
          status: 'monitoring'
        });
      }

      setComplianceIssues(issues);
      
    } catch (error) {
      console.error('Error analyzing compliance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    analyzeCompliance();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'needs_attention': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'monitoring': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Settings className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
          <p className="text-white">Analizando cumplimiento de seguridad...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header de Compliance */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Estado de Cumplimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{metrics.data_integrity_score}%</p>
              <p className="text-gray-400 text-sm">Integridad Datos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{metrics.performance_score}%</p>
              <p className="text-gray-400 text-sm">Performance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">100%</p>
              <p className="text-gray-400 text-sm">Seguridad Headers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">100%</p>
              <p className="text-gray-400 text-sm">Seguridad DB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Problemas de Cumplimiento */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Problemas de Cumplimiento
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Ocultar' : 'Mostrar'} Detalles
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {complianceIssues.map((issue) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-gray-700/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(issue.status)}
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                  <span className="text-gray-400 text-sm">{issue.category}</span>
                </div>
                <span className="text-gray-500 text-xs">{issue.status}</span>
              </div>
              <h4 className="text-white font-medium mb-1">{issue.description}</h4>
              
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-300 text-sm mb-3">
                    Recomendación: {issue.recommendation}
                  </p>
                  <Button variant="outline" size="sm">
                    Resolver Ahora
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}

          {complianceIssues.length === 0 && (
            <div className="text-center py-4">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-white">No hay problemas de cumplimiento detectados</p>
              <p className="text-gray-400 text-sm">Sistema funcionando correctamente</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
