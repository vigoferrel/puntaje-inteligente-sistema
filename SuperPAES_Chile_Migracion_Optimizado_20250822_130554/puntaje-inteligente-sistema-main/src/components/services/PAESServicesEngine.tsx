/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

interface PAESService {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'upcoming' | 'closed';
  deadline?: string;
  icon: string;
  category: 'admision' | 'financiero' | 'calendario' | 'resultados';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'deadline' | 'result' | 'info';
  description: string;
}

export const PAESServicesEngine: React.FC = () => {
  const [services, setServices] = useState<PAESService[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPAESServices();
  }, []);

  const loadPAESServices = async () => {
    try {
      // Servicios oficiales PAES
      const servicesData: PAESService[] = [
        {
          id: 'fuas',
          name: 'FUAS - Formulario Ãšnico de AcreditaciÃ³n SocioeconÃ³mica',
          description: 'Postula a beneficios estudiantiles del Estado',
          url: 'https://portal.beneficiosestudiantiles.cl/',
          status: 'active',
          deadline: '2025-12-31',
          icon: 'ðŸ“‹',
          category: 'financiero'
        },
        {
          id: 'becas',
          name: 'Becas y CrÃ©ditos Estudiantiles',
          description: 'InformaciÃ³n sobre becas disponibles',
          url: 'https://www.beneficiosestudiantiles.cl/',
          status: 'active',
          icon: 'ðŸ’°',
          category: 'financiero'
        },
        {
          id: 'demre',
          name: 'DEMRE - Resultados PAES',
          description: 'Consulta tus resultados oficiales PAES',
          url: 'https://www.demre.cl/',
          status: 'upcoming',
          deadline: '2025-01-15',
          icon: 'ðŸ“Š',
          category: 'resultados'
        },
        {
          id: 'postulacion',
          name: 'PostulaciÃ³n a Universidades',
          description: 'Sistema de postulaciÃ³n centralizada',
          url: 'https://www.sistemadeadmision.cl/',
          status: 'upcoming',
          deadline: '2025-01-20',
          icon: 'ðŸŽ“',
          category: 'admision'
        },
        {
          id: 'calendario',
          name: 'Calendario AcadÃ©mico PAES',
          description: 'Fechas importantes del proceso',
          url: 'https://www.demre.cl/calendario',
          status: 'active',
          icon: 'ðŸ“…',
          category: 'calendario'
        },
        {
          id: 'simulador',
          name: 'Simulador de Puntajes',
          description: 'Simula tu puntaje de postulaciÃ³n',
          url: 'https://www.sistemadeadmision.cl/simulador/',
          status: 'active',
          icon: 'ðŸŽ¯',
          category: 'admision'
        }
      ];

      // Eventos del calendario
      const eventsData: CalendarEvent[] = [
        {
          id: 'paes_2024',
          title: 'PAES 2024 - RendiciÃ³n',
          date: '2024-11-18',
          type: 'exam',
          description: 'Fecha de rendiciÃ³n PAES 2024'
        },
        {
          id: 'resultados_2024',
          title: 'PublicaciÃ³n Resultados PAES',
          date: '2025-01-15',
          type: 'result',
          description: 'Resultados oficiales PAES 2024'
        },
        {
          id: 'postulacion_2025',
          title: 'Inicio Postulaciones',
          date: '2025-01-16',
          type: 'deadline',
          description: 'Apertura sistema de postulaciones'
        },
        {
          id: 'cierre_postulacion',
          title: 'Cierre Postulaciones',
          date: '2025-01-20',
          type: 'deadline',
          description: 'Ãšltimo dÃ­a para postular'
        },
        {
          id: 'resultados_admision',
          title: 'Resultados de AdmisiÃ³n',
          date: '2025-01-27',
          type: 'result',
          description: 'PublicaciÃ³n resultados de admisiÃ³n'
        }
      ];

      setServices(servicesData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error cargando servicios PAES:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PAESService['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'upcoming': return 'text-yellow-400';
      case 'closed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: PAESService['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'closed': return <ExternalLink className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'from-red-500 to-pink-500';
      case 'deadline': return 'from-yellow-500 to-orange-500';
      case 'result': return 'from-green-500 to-emerald-500';
      case 'info': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Renderiza el contenido principal si no estÃ¡ cargando
  return (
    <div className="space-y-4">
      {/* Servicios Oficiales */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-white">
          <ExternalLink className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">Servicios Oficiales PAES</span>
        </div>

        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all cursor-pointer"
            onClick={() => window.open(service.url, '_blank')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{service.icon}</span>
                <div>
                  <div className="text-white font-medium text-sm">{service.name}</div>
                  <div className="text-white/60 text-xs">{service.description}</div>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${getStatusColor(service.status)}`}>
                {getStatusIcon(service.status)}
                <span className="text-xs capitalize">{service.status}</span>
              </div>
            </div>

            {service.deadline && (
              <div className="flex items-center space-x-1 text-xs text-white/70">
                <Calendar className="w-3 h-3" />
                <span>Hasta: {service.deadline}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Calendario de Eventos */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-white">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-medium">Calendario PAES 2024-2025</span>
        </div>

        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 bg-gradient-to-r ${getEventTypeColor(event.type)}/10 rounded-xl border border-white/10`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-white font-medium text-sm">{event.title}</div>
              <div className="text-xs text-white/70">{event.date}</div>
            </div>
            <div className="text-white/60 text-xs">{event.description}</div>
            
            <div className="mt-2 flex items-center space-x-2">
              <div className={`px-2 py-1 bg-gradient-to-r ${getEventTypeColor(event.type)} rounded-full text-xs text-white font-medium`}>
                {event.type.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enlaces RÃ¡pidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30"
      >
        <div className="text-white font-medium mb-3 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Enlaces Ãštiles</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button 
            onClick={() => window.open('https://www.mineduc.cl/', '_blank')}
            className="p-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-all"
          >
            MINEDUC
          </button>
          <button 
            onClick={() => window.open('https://www.consejoderectores.cl/', '_blank')}
            className="p-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-all"
          >
            CRUCH
          </button>
          <button 
            onClick={() => window.open('https://www.junaeb.cl/', '_blank')}
            className="p-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-all"
          >
            JUNAEB
          </button>
          <button 
            onClick={() => window.open('https://www.ingresa.cl/', '_blank')}
            className="p-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-all"
          >
            Ingresa.cl
          </button>
        </div>
      </motion.div>
    </div>
  );
};

