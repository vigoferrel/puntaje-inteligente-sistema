/**
 * ================================================================================
 * 🗓️ CALENDAR INTEGRATION SERVICE - CENTRO DE NOTIFICACIONES Y RECORDATORIOS
 * ================================================================================
 * 
 * Servicio que integra el calendario como núcleo central de notificaciones
 * y recordatorios del ecosistema SuperPAES
 */

import { supabase } from '../lib/supabase';

// ==================== INTERFACES ====================

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'diagnostic' | 'playlist' | 'milestone' | 'reminder' | 'career' | 'neural';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  startTime: Date;
  endTime: Date;
  duration: number;
  location?: string;
  attendees?: string[];
  tags: string[];
  metadata: {
    paesExercise?: any;
    spotifyPlaylist?: any;
    neuralMetrics?: any;
    careerGoal?: string;
    difficulty?: string;
    bloomLevel?: string;
    expectedScore?: number;
    actualScore?: number;
  };
  notifications: Notification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'alert' | 'progress' | 'career' | 'neural';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'dismissed';
  actionUrl?: string;
  actionText?: string;
  icon: string;
  timestamp: Date;
  expiresAt?: Date;
}

export interface CalendarIntegrationConfig {
  enableSpotifyIntegration: boolean;
  enablePAESIntegration: boolean;
  enableSuperPAESIntegration: boolean;
  enableNeuralIntegration: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    reminderTime: number; // minutos antes
  };
}

// ==================== SERVICIO PRINCIPAL ====================

export class CalendarIntegrationService {
  private config: CalendarIntegrationConfig;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: CalendarIntegrationConfig) {
    this.config = config;
    this.initializeIntegrations();
  }

  // ==================== INICIALIZACIÓN ====================

  private async initializeIntegrations() {
    console.log('🗓️ Inicializando integraciones del calendario...');

    // Configurar listeners para eventos del sistema
    this.setupEventListeners();
    
    // Inicializar integraciones específicas
    if (this.config.enableSpotifyIntegration) {
      await this.initializeSpotifyIntegration();
    }
    
    if (this.config.enablePAESIntegration) {
      await this.initializePAESIntegration();
    }
    
    if (this.config.enableSuperPAESIntegration) {
      await this.initializeSuperPAESIntegration();
    }
    
    if (this.config.enableNeuralIntegration) {
      await this.initializeNeuralIntegration();
    }

    console.log('✅ Integraciones del calendario inicializadas');
  }

  private setupEventListeners() {
    // Listener para ejercicios PAES completados
    this.addEventListener('paes-exercise-completed', (data: any) => {
      this.handlePAESExerciseCompleted(data);
    });

    // Listener para playlists Spotify generadas
    this.addEventListener('spotify-playlist-generated', (data: any) => {
      this.handleSpotifyPlaylistGenerated(data);
    });

    // Listener para diagnósticos SuperPAES
    this.addEventListener('superpaes-diagnostic-completed', (data: any) => {
      this.handleSuperPAESDiagnosticCompleted(data);
    });

    // Listener para métricas neurales
    this.addEventListener('neural-metrics-updated', (data: any) => {
      this.handleNeuralMetricsUpdated(data);
    });
  }

  // ==================== INTEGRACIÓN SPOTIFY NEURAL ====================

  private async initializeSpotifyIntegration() {
    console.log('🎵 Inicializando integración Spotify Neural...');
    
    // Crear eventos automáticos para playlists diarias
    this.scheduleDailySpotifyPlaylists();
    
    // Configurar recordatorios para playlists pendientes
    this.setupSpotifyReminders();
  }

  private async scheduleDailySpotifyPlaylists() {
    try {
      // Obtener playlists programadas para hoy
      const today = new Date();
      const { data: playlists, error } = await supabase
        .from('spotify_neural_playlists')
        .select('*')
        .eq('scheduled_date', today.toISOString().split('T')[0]);

      if (error) {
        console.error('Error obteniendo playlists Spotify:', error);
        return;
      }

      // Crear eventos de calendario para cada playlist
      for (const playlist of playlists || []) {
        await this.createSpotifyPlaylistEvent(playlist);
      }
    } catch (error) {
      console.error('Error programando playlists Spotify:', error);
    }
  }

  private async createSpotifyPlaylistEvent(playlist: any) {
    const event: Partial<CalendarEvent> = {
      title: `Playlist Diaria: ${playlist.name}`,
      description: `Tu playlist personalizada de ${playlist.subject} está lista para hoy`,
      type: 'playlist',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      duration: 30,
      tags: ['spotify', 'playlist', playlist.subject.toLowerCase()],
      metadata: {
        spotifyPlaylist: playlist,
        difficulty: playlist.difficulty,
        bloomLevel: playlist.bloomLevel
      }
    };

    await this.createEvent(event);
  }

  private setupSpotifyReminders() {
    // Configurar recordatorios cada 6 horas para playlists pendientes
    setInterval(async () => {
      const pendingPlaylists = await this.getPendingSpotifyPlaylists();
      
      for (const playlist of pendingPlaylists) {
        await this.createSpotifyReminder(playlist);
      }
    }, 6 * 60 * 60 * 1000); // 6 horas
  }

  private async getPendingSpotifyPlaylists() {
    const { data, error } = await supabase
      .from('spotify_neural_playlists')
      .select('*')
      .eq('status', 'pending')
      .gte('scheduled_date', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('Error obteniendo playlists pendientes:', error);
      return [];
    }

    return data || [];
  }

  private async createSpotifyReminder(playlist: any) {
    const notification: Partial<Notification> = {
      type: 'reminder',
      title: `Playlist Pendiente: ${playlist.name}`,
      message: `No olvides completar tu playlist de ${playlist.subject} para hoy`,
      priority: 'medium',
      icon: '🎵',
      actionUrl: `/spotify/playlist/${playlist.id}`,
      actionText: 'Reproducir Ahora'
    };

    await this.createNotification(notification);
  }

  // ==================== INTEGRACIÓN ADN PAES ====================

  private async initializePAESIntegration() {
    console.log('📚 Inicializando integración ADN PAES...');
    
    // Programar ejercicios oficiales PAES
    this.schedulePAESExercises();
    
    // Configurar recordatorios de progreso
    this.setupPAESProgressReminders();
  }

  private async schedulePAESExercises() {
    try {
      // Obtener ejercicios oficiales recomendados
      const { data: exercises, error } = await supabase
        .from('paes_exercises')
        .select('*')
        .eq('official', true)
        .eq('status', 'active')
        .order('difficulty', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error obteniendo ejercicios PAES:', error);
        return;
      }

      // Crear eventos de calendario para ejercicios
      for (const exercise of exercises || []) {
        await this.createPAESExerciseEvent(exercise);
      }
    } catch (error) {
      console.error('Error programando ejercicios PAES:', error);
    }
  }

  private async createPAESExerciseEvent(exercise: any) {
    const event: Partial<CalendarEvent> = {
      title: `Ejercicio PAES: ${exercise.prueba} - ${exercise.skill}`,
      description: `Ejercicio oficial del MINEDUC para mejorar tu puntaje en ${exercise.prueba}`,
      type: 'exercise',
      priority: 'high',
      startTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000), // Próximas 24 horas
      endTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      duration: 45,
      tags: ['paes', 'ejercicio', exercise.prueba.toLowerCase(), exercise.skill.toLowerCase()],
      metadata: {
        paesExercise: exercise,
        difficulty: exercise.difficulty,
        bloomLevel: exercise.bloomLevel,
        expectedScore: exercise.expectedScore
      }
    };

    await this.createEvent(event);
  }

  private setupPAESProgressReminders() {
    // Verificar progreso cada 12 horas
    setInterval(async () => {
      const progressData = await this.getPAESProgressData();
      
      if (progressData.needsReminder) {
        await this.createPAESProgressReminder(progressData);
      }
    }, 12 * 60 * 60 * 1000); // 12 horas
  }

  private async getPAESProgressData() {
    // Obtener datos de progreso del usuario
    const { data: progress, error } = await supabase
      .from('user_paes_progress')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(1);

    if (error || !progress || progress.length === 0) {
      return { needsReminder: false };
    }

    const lastProgress = progress[0];
    const daysSinceLastExercise = (Date.now() - new Date(lastProgress.last_updated).getTime()) / (1000 * 60 * 60 * 24);

    return {
      needsReminder: daysSinceLastExercise > 2, // Más de 2 días sin ejercicios
      lastProgress,
      daysSinceLastExercise
    };
  }

  private async createPAESProgressReminder(progressData: any) {
    const notification: Partial<Notification> = {
      type: 'progress',
      title: 'Recordatorio de Progreso PAES',
      message: `Han pasado ${Math.round(progressData.daysSinceLastExercise)} días desde tu último ejercicio. ¡Mantén tu ritmo!`,
      priority: 'high',
      icon: '📚',
      actionUrl: '/paes/exercises',
      actionText: 'Practicar Ahora'
    };

    await this.createNotification(notification);
  }

  // ==================== INTEGRACIÓN SUPERPAES ====================

  private async initializeSuperPAESIntegration() {
    console.log('🤖 Inicializando integración SuperPAES...');
    
    // Programar diagnósticos vocacionales
    this.scheduleSuperPAESDiagnostics();
    
    // Configurar recordatorios de carrera
    this.setupCareerReminders();
  }

  private async scheduleSuperPAESDiagnostics() {
    try {
      // Verificar si el usuario necesita diagnóstico vocacional
      const { data: userProfile, error } = await supabase
        .from('user_vocational_profiles')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error obteniendo perfil vocacional:', error);
        return;
      }

      // Si no tiene perfil o está desactualizado, programar diagnóstico
      if (!userProfile || userProfile.length === 0 || this.isProfileOutdated(userProfile[0])) {
        await this.createSuperPAESDiagnosticEvent();
      }
    } catch (error) {
      console.error('Error programando diagnósticos SuperPAES:', error);
    }
  }

  private isProfileOutdated(profile: any): boolean {
    const lastUpdate = new Date(profile.last_updated);
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 30; // Más de 30 días
  }

  private async createSuperPAESDiagnosticEvent() {
    const event: Partial<CalendarEvent> = {
      title: 'Diagnóstico Vocacional SuperPAES',
      description: 'Actualiza tu perfil vocacional y descubre nuevas oportunidades de carrera',
      type: 'diagnostic',
      priority: 'medium',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      duration: 60,
      tags: ['superpaes', 'diagnostico', 'vocacional', 'carrera'],
      metadata: {
        careerGoal: 'vocational_assessment'
      }
    };

    await this.createEvent(event);
  }

  private setupCareerReminders() {
    // Verificar objetivos de carrera cada semana
    setInterval(async () => {
      const careerGoals = await this.getCareerGoals();
      
      for (const goal of careerGoals) {
        if (this.shouldRemindCareerGoal(goal)) {
          await this.createCareerGoalReminder(goal);
        }
      }
    }, 7 * 24 * 60 * 60 * 1000); // Semanal
  }

  private async getCareerGoals() {
    const { data, error } = await supabase
      .from('user_career_goals')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error obteniendo objetivos de carrera:', error);
      return [];
    }

    return data || [];
  }

  private shouldRemindCareerGoal(goal: any): boolean {
    const lastReminder = new Date(goal.last_reminder || 0);
    const daysSinceReminder = (Date.now() - lastReminder.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceReminder > 7; // Más de una semana
  }

  private async createCareerGoalReminder(goal: any) {
    const notification: Partial<Notification> = {
      type: 'career',
      title: `Objetivo de Carrera: ${goal.career_name}`,
      message: `Recuerda tu objetivo de ingresar a ${goal.career_name}. ¡Sigue trabajando en tu puntaje PAES!`,
      priority: 'medium',
      icon: '🎯',
      actionUrl: `/career/${goal.id}`,
      actionText: 'Ver Progreso'
    };

    await this.createNotification(notification);
  }

  // ==================== INTEGRACIÓN NEURAL ====================

  private async initializeNeuralIntegration() {
    console.log('🧠 Inicializando integración Neural...');
    
    // Programar análisis neurales
    this.scheduleNeuralAnalytics();
    
    // Configurar alertas de rendimiento
    this.setupNeuralPerformanceAlerts();
  }

  private async scheduleNeuralAnalytics() {
    try {
      // Crear eventos para análisis neurales periódicos
      const event: Partial<CalendarEvent> = {
        title: 'Análisis Neural de Rendimiento',
        description: 'Revisión automática de tus patrones de aprendizaje y recomendaciones personalizadas',
        type: 'neural',
        priority: 'low',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Próxima semana
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        duration: 30,
        tags: ['neural', 'analisis', 'rendimiento', 'aprendizaje'],
        metadata: {
          neuralMetrics: {
            type: 'performance_analysis',
            frequency: 'weekly'
          }
        }
      };

      await this.createEvent(event);
    } catch (error) {
      console.error('Error programando análisis neurales:', error);
    }
  }

  private setupNeuralPerformanceAlerts() {
    // Verificar métricas neurales cada 4 horas
    setInterval(async () => {
      const neuralMetrics = await this.getNeuralMetrics();
      
      if (neuralMetrics.needsAlert) {
        await this.createNeuralPerformanceAlert(neuralMetrics);
      }
    }, 4 * 60 * 60 * 1000); // 4 horas
  }

  private async getNeuralMetrics() {
    const { data, error } = await supabase
      .from('neural_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return { needsAlert: false };
    }

    const metrics = data[0];
    const performanceDrop = metrics.performance < 0.7; // Menos del 70%
    const engagementDrop = metrics.engagement < 0.6; // Menos del 60%

    return {
      needsAlert: performanceDrop || engagementDrop,
      metrics,
      performanceDrop,
      engagementDrop
    };
  }

  private async createNeuralPerformanceAlert(neuralData: any) {
    let message = '';
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (neuralData.performanceDrop && neuralData.engagementDrop) {
      message = 'Tu rendimiento y engagement han bajado. ¡Necesitas un descanso o cambio de estrategia!';
      priority = 'high';
    } else if (neuralData.performanceDrop) {
      message = 'Tu rendimiento ha bajado. Considera revisar los conceptos más difíciles.';
      priority = 'medium';
    } else if (neuralData.engagementDrop) {
      message = 'Tu engagement ha bajado. ¡Prueba ejercicios más interesantes!';
      priority = 'medium';
    }

    const notification: Partial<Notification> = {
      type: 'neural',
      title: 'Alerta de Rendimiento Neural',
      message,
      priority,
      icon: '🧠',
      actionUrl: '/neural/analytics',
      actionText: 'Ver Análisis'
    };

    await this.createNotification(notification);
  }

  // ==================== GESTIÓN DE EVENTOS ====================

  async createEvent(eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const event: CalendarEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: eventData.title || 'Nuevo Evento',
        description: eventData.description || '',
        type: eventData.type || 'reminder',
        priority: eventData.priority || 'medium',
        status: 'pending',
        startTime: eventData.startTime || new Date(),
        endTime: eventData.endTime || new Date(),
        duration: eventData.duration || 60,
        tags: eventData.tags || [],
        metadata: eventData.metadata || {},
        notifications: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Guardar en Supabase
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();

      if (error) {
        console.error('Error creando evento:', error);
        throw error;
      }

      // Generar notificaciones automáticas
      await this.generateEventNotifications(event);

      // Emitir evento
      this.emit('event-created', event);

      return data;
    } catch (error) {
      console.error('Error en createEvent:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update({ ...updates, updatedAt: new Date() })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando evento:', error);
        throw error;
      }

      this.emit('event-updated', data);
      return data;
    } catch (error) {
      console.error('Error en updateEvent:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error eliminando evento:', error);
        throw error;
      }

      this.emit('event-deleted', eventId);
    } catch (error) {
      console.error('Error en deleteEvent:', error);
      throw error;
    }
  }

  // ==================== GESTIÓN DE NOTIFICACIONES ====================

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    try {
      const notification: Notification = {
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: notificationData.type || 'reminder',
        title: notificationData.title || 'Nueva Notificación',
        message: notificationData.message || '',
        priority: notificationData.priority || 'medium',
        status: 'unread',
        actionUrl: notificationData.actionUrl,
        actionText: notificationData.actionText,
        icon: notificationData.icon || '📢',
        timestamp: new Date(),
        expiresAt: notificationData.expiresAt
      };

      // Guardar en Supabase
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) {
        console.error('Error creando notificación:', error);
        throw error;
      }

      // Enviar notificación según preferencias
      await this.sendNotification(notification);

      this.emit('notification-created', notification);
      return data;
    } catch (error) {
      console.error('Error en createNotification:', error);
      throw error;
    }
  }

  private async generateEventNotifications(event: CalendarEvent) {
    const notifications: Partial<Notification>[] = [];

    // Notificación de recordatorio
    const reminderTime = new Date(event.startTime.getTime() - this.config.notificationPreferences.reminderTime * 60 * 1000);
    if (reminderTime > new Date()) {
      notifications.push({
        type: 'reminder',
        title: `Recordatorio: ${event.title}`,
        message: `Tu ${event.type} comienza en ${this.config.notificationPreferences.reminderTime} minutos`,
        priority: event.priority,
        icon: this.getEventIcon(event.type),
        expiresAt: event.startTime
      });
    }

    // Notificaciones específicas por tipo
    if (event.type === 'exercise' && event.metadata.paesExercise) {
      notifications.push({
        type: 'progress',
        title: `Ejercicio PAES: ${event.title}`,
        message: 'Completa este ejercicio oficial para mejorar tu puntaje',
        priority: 'high',
        icon: '📚',
        actionUrl: `/exercise/${event.metadata.paesExercise.id}`,
        actionText: 'Comenzar'
      });
    }

    if (event.type === 'playlist' && event.metadata.spotifyPlaylist) {
      notifications.push({
        type: 'reminder',
        title: `Playlist Diaria: ${event.title}`,
        message: 'Tu playlist personalizada está lista para hoy',
        priority: 'medium',
        icon: '🎵',
        actionUrl: `/spotify/playlist/${event.metadata.spotifyPlaylist.id}`,
        actionText: 'Reproducir'
      });
    }

    // Crear notificaciones
    for (const notification of notifications) {
      await this.createNotification(notification);
    }
  }

  private async sendNotification(notification: Notification) {
    // Enviar notificación según preferencias del usuario
    if (this.config.notificationPreferences.inApp) {
      // Notificación en la aplicación
      this.emit('notification-received', notification);
    }

    if (this.config.notificationPreferences.push) {
      // Notificación push (si está disponible)
      await this.sendPushNotification(notification);
    }

    if (this.config.notificationPreferences.email) {
      // Notificación por email
      await this.sendEmailNotification(notification);
    }
  }

  private async sendPushNotification(notification: Notification) {
    // Implementar notificaciones push
    console.log('📱 Enviando notificación push:', notification.title);
  }

  private async sendEmailNotification(notification: Notification) {
    // Implementar notificaciones por email
    console.log('📧 Enviando notificación por email:', notification.title);
  }

  // ==================== MANEJADORES DE EVENTOS ====================

  private async handlePAESExerciseCompleted(data: any) {
    console.log('📚 Ejercicio PAES completado:', data);
    
    // Crear evento de logro
    const event: Partial<CalendarEvent> = {
      title: `Ejercicio Completado: ${data.exercise.title}`,
      description: `¡Felicitaciones! Completaste el ejercicio de ${data.exercise.prueba}`,
      type: 'milestone',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(),
      duration: 5,
      tags: ['paes', 'logro', 'ejercicio', data.exercise.prueba.toLowerCase()],
      metadata: {
        paesExercise: data.exercise,
        actualScore: data.score
      }
    };

    await this.createEvent(event);
  }

  private async handleSpotifyPlaylistGenerated(data: any) {
    console.log('🎵 Playlist Spotify generada:', data);
    
    // Crear evento de playlist
    const event: Partial<CalendarEvent> = {
      title: `Playlist Generada: ${data.playlist.name}`,
      description: `Tu playlist personalizada de ${data.playlist.subject} está lista`,
      type: 'playlist',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      duration: 30,
      tags: ['spotify', 'playlist', data.playlist.subject.toLowerCase()],
      metadata: {
        spotifyPlaylist: data.playlist
      }
    };

    await this.createEvent(event);
  }

  private async handleSuperPAESDiagnosticCompleted(data: any) {
    console.log('🤖 Diagnóstico SuperPAES completado:', data);
    
    // Crear evento de diagnóstico
    const event: Partial<CalendarEvent> = {
      title: 'Diagnóstico Vocacional Completado',
      description: `Tu perfil vocacional ha sido actualizado con ${data.recommendations.length} nuevas recomendaciones`,
      type: 'diagnostic',
      priority: 'high',
      startTime: new Date(),
      endTime: new Date(),
      duration: 10,
      tags: ['superpaes', 'diagnostico', 'vocacional'],
      metadata: {
        careerGoal: 'vocational_assessment',
        expectedScore: data.expectedScore
      }
    };

    await this.createEvent(event);
  }

  private async handleNeuralMetricsUpdated(data: any) {
    console.log('🧠 Métricas neurales actualizadas:', data);
    
    // Crear evento de análisis neural
    const event: Partial<CalendarEvent> = {
      title: 'Análisis Neural Completado',
      description: `Tu rendimiento neural ha sido analizado. ${data.insights.length} nuevos insights disponibles`,
      type: 'neural',
      priority: 'low',
      startTime: new Date(),
      endTime: new Date(),
      duration: 5,
      tags: ['neural', 'analisis', 'rendimiento'],
      metadata: {
        neuralMetrics: data
      }
    };

    await this.createEvent(event);
  }

  // ==================== UTILIDADES ====================

  private getEventIcon(type: string): string {
    const icons: Record<string, string> = {
      exercise: '📚',
      diagnostic: '🔬',
      playlist: '🎵',
      milestone: '🏆',
      reminder: '⏰',
      career: '🎯',
      neural: '🧠'
    };
    return icons[type] || '📅';
  }

  // ==================== SISTEMA DE EVENTOS ====================

  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

// ==================== INSTANCIA GLOBAL ====================

export const calendarIntegrationService = new CalendarIntegrationService({
  enableSpotifyIntegration: true,
  enablePAESIntegration: true,
  enableSuperPAESIntegration: true,
  enableNeuralIntegration: true,
  notificationPreferences: {
    email: true,
    push: true,
    inApp: true,
    reminderTime: 15 // 15 minutos antes
  }
});

export default calendarIntegrationService;
