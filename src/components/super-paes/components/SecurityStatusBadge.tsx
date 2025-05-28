
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { SecurityAuditService } from '@/services/security/SecurityAuditService';

export const SecurityStatusBadge: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<'loading' | 'secure' | 'warning' | 'error'>('loading');
  const [score, setScore] = useState(0);

  useEffect(() => {
    checkSecurityStatus();
  }, []);

  const checkSecurityStatus = async () => {
    try {
      const auditReport = await SecurityAuditService.runCompleteAudit();
      
      if (auditReport.overallScore >= 95) {
        setSecurityStatus('secure');
      } else if (auditReport.overallScore >= 80) {
        setSecurityStatus('warning');
      } else {
        setSecurityStatus('error');
      }
      
      setScore(auditReport.overallScore);
    } catch (error) {
      console.error('Error verificando seguridad:', error);
      setSecurityStatus('error');
      setScore(0);
    }
  };

  const getStatusConfig = () => {
    switch (securityStatus) {
      case 'secure':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          text: `Seguro ${score}%`,
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          text: `Advertencia ${score}%`,
          className: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          text: `Error ${score}%`,
          className: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          icon: <Shield className="w-3 h-3 animate-spin" />,
          text: 'Verificando...',
          className: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge 
        className={`${config.className} text-white flex items-center gap-1 cursor-pointer`}
        onClick={checkSecurityStatus}
        title="Click para revalidar seguridad"
      >
        {config.icon}
        {config.text}
      </Badge>
    </motion.div>
  );
};
