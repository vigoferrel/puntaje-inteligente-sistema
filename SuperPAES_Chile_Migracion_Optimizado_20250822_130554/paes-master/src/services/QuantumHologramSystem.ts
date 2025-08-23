/**
 * ================================================================================
 * 🌌 QUANTUM HOLOGRAM SYSTEM - VISUALIZACIÓN EDUCATIVA HOLOGRÁFICA
 * ================================================================================
 * 
 * Sistema de visualización holográfica cuántica integrado:
 * - 👁️ Proyecciones holográficas de conceptos abstractos
 * - 🔮 Manipulación espacial 3D de datos educativos
 * - ⚛️ Visualización de estados cuánticos de aprendizaje
 * - 🎭 Avatares holográficos de agentes neurales
 * - 🌊 Campos de energía educativa visualizables
 * - 🧠 Integración con sistema cuántico existente
 */

import { getQuantumService } from './QuantumEducationalService'

export interface HologramParticle {
  id: string
  position: { x: number; y: number; z: number }
  velocity: { x: number; y: number; z: number }
  size: number
  color: string
  opacity: number
  quantum_state: number
  educational_value: number
  bloom_resonance: number
}

export interface HologramLayer {
  id: string
  name: string
  type: 'concept' | 'data' | 'agent' | 'environment' | 'interface'
  particles: HologramParticle[]
  visibility: number
  quantum_coherence: number
  educational_context: string
  bloom_level: number
}

export interface HolographicScene {
  id: string
  title: string
  subject: string
  complexity_level: number
  layers: HologramLayer[]
  total_particles: number
  quantum_stability: number
  educational_objective: string
  interaction_modes: string[]
  created_at: string
}

export interface AgentHologram {
  agent_id: string
  name: string
  hologram_type: 'leonardo' | 'curie' | 'aristoteles' | 'lovelace' | 'tesla'
  position: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  avatar_complexity: number
  neural_aura_intensity: number
  consciousness_field: number
  current_animation: string
  speaking_state: boolean
  quantum_signature: string
}

export interface QuantumField {
  field_type: 'learning' | 'comprehension' | 'creativity' | 'analysis' | 'synthesis'
  intensity: number
  radius: number
  center: { x: number; y: number; z: number }
  color_spectrum: string[]
  wave_frequency: number
  harmonic_resonance: number
  educational_impact: number
}

export class QuantumHologramSystem {
  private activeScenes: Map<string, HolographicScene> = new Map()
  private agentHolograms: Map<string, AgentHologram> = new Map()
  private quantumFields: QuantumField[] = []
  private quantumService = getQuantumService()
  
  constructor() {
    this.initializeHologramSystem()
  }

  /**
   * 🌌 INICIALIZAR SISTEMA HOLOGRÁFICO
   */
  private initializeHologramSystem(): void {
    console.log('🌌 Inicializando Quantum Hologram System...')
    this.setupQuantumFields()
    this.createAgentHolograms()
    this.generateDefaultScenes()
    console.log('✨ Sistema holográfico cuántico listo!')
  }

  /**
   * ⚛️ CONFIGURAR CAMPOS CUÁNTICOS
   */
  private setupQuantumFields(): void {
    const fieldTypes = ['learning', 'comprehension', 'creativity', 'analysis', 'synthesis']
    const quantumState = this.quantumService.getQuantumState()
    
    fieldTypes.forEach((type, index) => {
      // Usar valores del estado cuántico real para configurar campos
      const field: QuantumField = {
        field_type: type as any,
        intensity: this.getQuantumMetricForField(type, quantumState),
        radius: 30 + (index * 10), // Distribución sistemática en vez de aleatoria
        center: {
          x: (index - 2) * 30, // Distribución equidistante en X
          y: 0,
          z: 0
        },
        color_spectrum: this.generateColorSpectrum(type),
        wave_frequency: 2 + index, // Frecuencias regulares en vez de aleatorias
        harmonic_resonance: this.getHarmonicResonance(type, quantumState),
        educational_impact: this.getEducationalImpact(type, quantumState)
      }
      
      this.quantumFields.push(field)
    })
    
    console.log(`⚛️ ${this.quantumFields.length} campos cuánticos inicializados`)
  }

  /**
   * 🔢 MAPEAR MÉTRICAS CUÁNTICAS EXISTENTES
   */
  private getQuantumMetricForField(fieldType: string, quantumState: any): number {
    const mappings = {
      'learning': quantumState.coherence,
      'comprehension': quantumState.entanglement,
      'creativity': quantumState.superposition,
      'analysis': quantumState.consciousness,
      'synthesis': (quantumState.coherence + quantumState.consciousness) / 2
    }
    return mappings[fieldType as keyof typeof mappings] || 0.5
  }

  /**
   * 🎯 OBTENER RESONANCIA ARMÓNICA
   */
  private getHarmonicResonance(fieldType: string, quantumState: any): number {
    const resonances = {
      'learning': quantumState.coherence * 0.9,
      'comprehension': quantumState.entanglement * 0.95,
      'creativity': quantumState.superposition * 0.85,
      'analysis': quantumState.consciousness * 0.8,
      'synthesis': (quantumState.coherence + quantumState.superposition) / 2
    }
    return resonances[fieldType as keyof typeof resonances] || 0.5
  }

  /**
   * 📚 OBTENER IMPACTO EDUCATIVO
   */
  private getEducationalImpact(fieldType: string, quantumState: any): number {
    const impacts = {
      'learning': (quantumState.coherence * 0.6) + (quantumState.consciousness * 0.4),
      'comprehension': (quantumState.entanglement * 0.7) + (quantumState.coherence * 0.3),
      'creativity': (quantumState.superposition * 0.8) + (quantumState.consciousness * 0.2),
      'analysis': (quantumState.consciousness * 0.5) + (quantumState.entanglement * 0.5),
      'synthesis': (quantumState.coherence + quantumState.entanglement + 
                    quantumState.superposition + quantumState.consciousness) / 4
    }
    return impacts[fieldType as keyof typeof impacts] || 0.5
  }

  /**
   * 🎨 GENERAR ESPECTRO DE COLOR
   */
  private generateColorSpectrum(fieldType: string): string[] {
    const spectrums: Record<string, string[]> = {
      learning: ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
      comprehension: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
      creativity: ['#ff9a9e', '#fecfef', '#fad0c4', '#ffd1ff'],
      analysis: ['#a8edea', '#fed6e3', '#d299c2', '#fef9d7'],
      synthesis: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
    }
    
    return spectrums[fieldType] || ['#ffffff', '#f0f0f0']
  }

  /**
   * 🎭 CREAR HOLOGRAMAS DE AGENTES
   */
  private createAgentHolograms(): void {
    // Obtener agentes reales del sistema
    const agents = this.quantumService.getActiveAgents()
    
    agents.forEach((agent, index) => {
      // Mapear tipo de holograma basado en el id del agente
      const hologramType = this.mapAgentToHologramType(agent.id)
      
      const hologram: AgentHologram = {
        agent_id: agent.id,
        name: agent.name,
        hologram_type: hologramType as any,
        position: {
          x: Math.cos(index * Math.PI * 2 / agents.length) * 40,
          y: 0,
          z: Math.sin(index * Math.PI * 2 / agents.length) * 40
        },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: index * (360 / agents.length), z: 0 },
        avatar_complexity: agent.intelligence / 100, // Usar inteligencia real del agente
        neural_aura_intensity: agent.status === 'active' ? 0.9 : 0.5,
        consciousness_field: agent.interactions / 20000, // Normalizado por máximo esperado
        current_animation: 'idle_thinking',
        speaking_state: false,
        quantum_signature: this.generateQuantumSignature(hologramType)
      }
      
      this.agentHolograms.set(agent.id, hologram)
    })
    
    console.log(`🎭 ${this.agentHolograms.size} hologramas de agentes creados`)
  }

  /**
   * 🧩 MAPEAR AGENTE A TIPO DE HOLOGRAMA
   */
  private mapAgentToHologramType(agentId: string): string {
    const mappings: Record<string, string> = {
      'leonardo-da-vinci': 'leonardo',
      'marie-curie': 'curie',
      'aristoteles': 'aristoteles',
      'ada-lovelace': 'lovelace',
      'nikola-tesla': 'tesla'
    }
    return mappings[agentId] || 'leonardo'
  }

  /**
   * 🔮 GENERAR FIRMA CUÁNTICA
   */
  private generateQuantumSignature(agentType: string): string {
    const signatures: Record<string, string> = {
      leonardo: '🎨🔬⚡🌊💫',
      curie: '⚗️💎🔬⚛️✨',
      aristoteles: '🏛️📚🤔💭🌟',
      lovelace: '💻🔢🎯⚙️💡',
      tesla: '⚡🔋🎭🌩️🚀'
    }
    
    return signatures[agentType] || '✨🔮🌟💫⚡'
  }

  /**
   * 🎬 GENERAR ESCENAS POR DEFECTO
   */
  private generateDefaultScenes(): void {
    // Obtener estado cuántico real
    const quantumState = this.quantumService.getQuantumState()
    
    // Escena de Matemáticas Cuánticas
    const mathScene = this.createEducationalScene({
      title: 'Álgebra Cuántica Visualizada',
      subject: 'Matemáticas',
      complexity_level: 7,
      educational_objective: 'Visualizar ecuaciones algebraicas en espacio 3D',
      quantum_state: quantumState,
      layers: [
        this.createConceptLayer('Ecuaciones', 'algebra', 4, quantumState),
        this.createDataLayer('Gráficos', 'plots', 3, quantumState),
        this.createEnvironmentLayer('Campo Matemático', 'math_field', 2, quantumState)
      ]
    })
    
    // Escena de Física Cuántica
    const physicsScene = this.createEducationalScene({
      title: 'Estados Cuánticos de Materia',
      subject: 'Ciencias',
      complexity_level: 9,
      educational_objective: 'Comprender superposición y entrelazamiento',
      quantum_state: quantumState,
      layers: [
        this.createConceptLayer('Partículas', 'quantum_particles', 6, quantumState),
        this.createDataLayer('Ondas', 'wave_functions', 5, quantumState),
        this.createEnvironmentLayer('Vacío Cuántico', 'quantum_vacuum', 4, quantumState)
      ]
    })
    
    console.log(`🎬 ${this.activeScenes.size} escenas holográficas creadas`)
  }

  /**
   * 🎯 CREAR ESCENA EDUCATIVA
   */
  createEducationalScene(config: {
    title: string
    subject: string
    complexity_level: number
    educational_objective: string
    quantum_state: any
    layers: HologramLayer[]
  }): HolographicScene {
    const scene: HolographicScene = {
      id: `scene_${Date.now()}_${this.generateUniqueId()}`,
      title: config.title,
      subject: config.subject,
      complexity_level: config.complexity_level,
      layers: config.layers,
      total_particles: config.layers.reduce((sum, layer) => sum + layer.particles.length, 0),
      quantum_stability: config.quantum_state.coherence, // Usar coherencia real
      educational_objective: config.educational_objective,
      interaction_modes: ['gaze', 'gesture', 'voice', 'neural'],
      created_at: new Date().toISOString()
    }
    
    this.activeScenes.set(scene.id, scene)
    return scene
  }

  /**
   * 🔢 GENERAR ID ÚNICO
   */
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36)
  }

  /**
   * 📚 CREAR CAPA DE CONCEPTOS
   */
  private createConceptLayer(name: string, concept: string, bloomLevel: number, quantumState: any): HologramLayer {
    const particles: HologramParticle[] = []
    // Usar número de partículas consistente en vez de aleatorio
    const particleCount = 100 + (bloomLevel * 25)
    
    // Obtener resonancia Bloom desde la definición existente en el sistema
    const bloomResonance = this.getBloomResonance(bloomLevel)
    
    for (let i = 0; i < particleCount; i++) {
      // Distribución espiral Fibonacci para mejor visualización de conceptos
      const phi = Math.PI * (3 - Math.sqrt(5)) // Ángulo áureo
      const y = 1 - (i / (particleCount - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = phi * i
      
      particles.push({
        id: `particle_${concept}_${i}`,
        position: {
          x: Math.cos(theta) * radius * 50,
          y: y * 50,
          z: Math.sin(theta) * radius * 50
        },
        velocity: {
          x: 0, // Velocidades fijas para patrones estables
          y: bloomLevel * 0.01,
          z: 0
        },
        size: 1 + (bloomLevel * 0.5),
        color: this.getBloomColor(bloomLevel),
        opacity: 0.5 + (bloomResonance * 0.5),
        quantum_state: quantumState.coherence * bloomResonance,
        educational_value: bloomResonance,
        bloom_resonance: bloomResonance
      })
    }
    
    return {
      id: `layer_${concept}_${Date.now()}`,
      name: name,
      type: 'concept',
      particles: particles,
      visibility: 1.0,
      quantum_coherence: quantumState.coherence * bloomResonance,
      educational_context: concept,
      bloom_level: bloomLevel
    }
  }

  /**
   * 🌸 OBTENER RESONANCIA BLOOM
   */
  private getBloomResonance(level: number): number {
    // Valores predefinidos para cada nivel Bloom
    const resonances = [0.2, 0.4, 0.6, 0.8, 0.9, 1.0]
    return resonances[level - 1] || 0.5
  }

  /**
   * 📊 CREAR CAPA DE DATOS
   */
  private createDataLayer(name: string, dataType: string, bloomLevel: number, quantumState: any): HologramLayer {
    const particles: HologramParticle[] = []
    const gridSize = 20
    
    // Resonancia específica para este tipo de capa
    const dataResonance = quantumState.entanglement * this.getBloomResonance(bloomLevel)
    
    // Crear partículas en patrón de datos estructurados
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Patrón determinista en vez de aleatorio
        if ((x + y) % 3 !== 0) {
          particles.push({
            id: `data_${dataType}_${x}_${y}`,
            position: {
              x: (x - gridSize/2) * 3,
              y: Math.sin(x * 0.5) * Math.cos(y * 0.5) * 10,
              z: (y - gridSize/2) * 3
            },
            velocity: { x: 0, y: 0, z: 0 },
            size: 0.5 + (bloomLevel * 0.3),
            color: this.getDataTypeColor(dataType),
            opacity: 0.4 + (dataResonance * 0.2),
            quantum_state: quantumState.entanglement * (x + y) / (gridSize * 2),
            educational_value: dataResonance,
            bloom_resonance: this.getBloomResonance(bloomLevel)
          })
        }
      }
    }
    
    return {
      id: `layer_data_${dataType}_${Date.now()}`,
      name: name,
      type: 'data',
      particles: particles,
      visibility: 1.0,
      quantum_coherence: quantumState.entanglement * this.getBloomResonance(bloomLevel),
      educational_context: dataType,
      bloom_level: bloomLevel
    }
  }

  /**
   * 🌍 CREAR CAPA DE AMBIENTE
   */
  private createEnvironmentLayer(name: string, envType: string, bloomLevel: number, quantumState: any): HologramLayer {
    const particles: HologramParticle[] = []
    // Calcular partículas basado en superposición
    const particleCount = Math.floor(50 + (quantumState.superposition * 100))
    
    // Resonancia específica para ambiente
    const envResonance = quantumState.superposition * this.getBloomResonance(bloomLevel)
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 40 + (i % 5) * 10 // Patrones concéntricos
      
      particles.push({
        id: `env_${envType}_${i}`,
        position: {
          x: Math.cos(angle) * radius,
          y: ((i % 3) - 1) * 10,
          z: Math.sin(angle) * radius
        },
        velocity: {
          x: Math.cos(angle) * 0.05,
          y: 0,
          z: Math.sin(angle) * 0.05
        },
        size: 0.3 + (bloomLevel * 0.2),
        color: this.getEnvironmentColor(envType),
        opacity: 0.1 + (envResonance * 0.1),
        quantum_state: quantumState.superposition,
        educational_value: envResonance * 0.5,
        bloom_resonance: this.getBloomResonance(bloomLevel) * 0.7
      })
    }
    
    return {
      id: `layer_env_${envType}_${Date.now()}`,
      name: name,
      type: 'environment',
      particles: particles,
      visibility: 0.8,
      quantum_coherence: quantumState.superposition * this.getBloomResonance(bloomLevel),
      educational_context: envType,
      bloom_level: bloomLevel
    }
  }

  /**
   * 🎨 OBTENER COLOR POR NIVEL BLOOM
   */
  private getBloomColor(level: number): string {
    const colors = [
      '#ff6b6b', // Recordar
      '#4ecdc4', // Comprender  
      '#45b7d1', // Aplicar
      '#96ceb4', // Analizar
      '#feca57', // Evaluar
      '#ff9ff3'  // Crear
    ]
    return colors[Math.min(level - 1, colors.length - 1)]
  }

  /**
   * 📊 OBTENER COLOR POR TIPO DE DATOS
   */
  private getDataTypeColor(dataType: string): string {
    const colors: Record<string, string> = {
      'algebra': '#4facfe',
      'plots': '#43e97b',
      'quantum_particles': '#f093fb',
      'wave_functions': '#667eea',
      'statistics': '#ff6b6b'
    }
    return colors[dataType] || '#ffffff'
  }

  /**
   * 🌍 OBTENER COLOR AMBIENTAL
   */
  private getEnvironmentColor(envType: string): string {
    const colors: Record<string, string> = {
      'math_field': '#e8f4ff',
      'quantum_vacuum': '#1a1a2e',
      'learning_space': '#f0f8ff',
      'neural_network': '#ffe8e8'
    }
    return colors[envType] || '#f5f5f5'
  }

  /**
   * 🎭 ANIMAR HOLOGRAMA DE AGENTE
   */
  animateAgentHologram(agentId: string, animation: string): void {
    const hologram = this.agentHolograms.get(agentId)
    if (!hologram) return
    
    hologram.current_animation = animation
    hologram.speaking_state = animation.includes('speak')
    
    // Actualizar aura neural basada en la animación
    const animationIntensities: Record<string, number> = {
      'idle_thinking': 0.3,
      'speaking_explanation': 0.8,
      'demonstrating_concept': 0.9,
      'analyzing_problem': 0.7,
      'celebrating_success': 1.0
    }
    
    hologram.neural_aura_intensity = animationIntensities[animation] || 0.5
    
    // Actualizar agente en sistema real
    const quantumService = this.quantumService
    quantumService.getAgentStats(agentId).then(agent => {
      if (agent) {
        // Actualizar estado de coherencia del agente basado en la animación
        console.log(`🎭 ${agent.name}: ${animation} (aura: ${hologram.neural_aura_intensity})`)
      }
    })
  }

  /**
   * ⚡ ACTUALIZAR CAMPOS CUÁNTICOS
   */
  updateQuantumFields(): void {
    // Obtener estado cuántico actualizado
    const quantumState = this.quantumService.getQuantumState()
    
    this.quantumFields.forEach((field, index) => {
      // Sincronizar con el estado cuántico actual
      field.intensity = this.getQuantumMetricForField(field.field_type, quantumState)
      field.wave_frequency = 2 + index + (quantumState.coherence * 2)
      field.harmonic_resonance = this.getHarmonicResonance(field.field_type, quantumState)
      field.educational_impact = this.getEducationalImpact(field.field_type, quantumState)
    })
  }

  /**
   * 🔮 RENDERIZAR ESCENA HOLOGRÁFICA
   */
  renderHolographicScene(sceneId: string): {
    scene: HolographicScene
    render_data: any
    quantum_metrics: any
  } {
    const scene = this.activeScenes.get(sceneId)
    if (!scene) {
      throw new Error(`Escena holográfica ${sceneId} no encontrada`)
    }
    
    // Obtener estado cuántico actualizado
    const quantumState = this.quantumService.getQuantumState()
    
    // Actualizar métricas de la escena con datos reales
    scene.quantum_stability = quantumState.coherence
    
    // Simular datos de renderización usando métricas reales
    const renderData = {
      total_polygons: scene.total_particles * 12,
      render_time: 16.67 * (1 - (quantumState.superposition * 0.5)), // Mejor rendimiento con alta superposición
      quantum_calculations: scene.layers.length * 1000,
      hologram_quality: quantumState.coherence,
      immersion_level: quantumState.consciousness,
      educational_coherence: scene.layers.reduce((sum, layer) => sum + layer.quantum_coherence, 0) / scene.layers.length
    }
    
    const quantumMetrics = {
      scene_coherence: quantumState.coherence,
      field_interactions: this.quantumFields.length,
      agent_synchronization: Array.from(this.agentHolograms.values())
        .reduce((sum, agent) => sum + agent.consciousness_field, 0) / this.agentHolograms.size,
      learning_resonance: renderData.educational_coherence,
      immersion_depth: quantumState.consciousness,
      entanglement_stability: quantumState.entanglement,
      superposition_clarity: quantumState.superposition
    }
    
    console.log(`🌌 Renderizando escena: "${scene.title}"`)
    console.log(`⚡ ${renderData.total_polygons} polígonos, calidad: ${(renderData.hologram_quality * 100).toFixed(1)}%`)
    
    return {
      scene,
      render_data: renderData,
      quantum_metrics: quantumMetrics
    }
  }

  /**
   * 🎯 INTERACTUAR CON HOLOGRAMA
   */
  interactWithHologram(sceneId: string, interactionType: 'gaze' | 'gesture' | 'voice' | 'neural', target: { x: number; y: number; z: number }): {
    interaction_result: string
    educational_feedback: string
    quantum_response: number
  } {
    const scene = this.activeScenes.get(sceneId)
    if (!scene) {
      throw new Error(`Escena ${sceneId} no encontrada`)
    }
    
    // Obtener estado cuántico actualizado
    const quantumState = this.quantumService.getQuantumState()
    
    // Encontrar partículas cercanas al objetivo
    const nearbyParticles: HologramParticle[] = []
    scene.layers.forEach(layer => {
      layer.particles.forEach(particle => {
        const distance = Math.sqrt(
          Math.pow(particle.position.x - target.x, 2) +
          Math.pow(particle.position.y - target.y, 2) +
          Math.pow(particle.position.z - target.z, 2)
        )
        
        if (distance < 10) { // Radio de interacción
          nearbyParticles.push(particle)
        }
      })
    })
    
    let interactionResult = 'No se detectaron elementos interactuables'
    let educationalFeedback = 'Intenta apuntar a conceptos más específicos'
    let quantumResponse = 0
    
    if (nearbyParticles.length > 0) {
      const avgEducationalValue = nearbyParticles.reduce((sum, p) => sum + p.educational_value, 0) / nearbyParticles.length
      const avgQuantumState = nearbyParticles.reduce((sum, p) => sum + p.quantum_state, 0) / nearbyParticles.length
      
      interactionResult = `Interacción ${interactionType} exitosa con ${nearbyParticles.length} elementos`
      educationalFeedback = this.generateEducationalFeedback(avgEducationalValue, interactionType, quantumState)
      quantumResponse = avgQuantumState
      
      // Animar partículas interactuadas
      nearbyParticles.forEach(particle => {
        particle.size *= 1.2
        particle.opacity = Math.min(1, particle.opacity + 0.2)
      })
    }
    
    console.log(`🎯 Interacción ${interactionType}: ${nearbyParticles.length} elementos afectados`)
    
    return {
      interaction_result: interactionResult,
      educational_feedback: educationalFeedback,
      quantum_response: quantumResponse
    }
  }

  /**
   * 💬 GENERAR FEEDBACK EDUCATIVO
   */
  private generateEducationalFeedback(educationalValue: number, interactionType: string, quantumState: any): string {
    // Usar estado de consciousness para mejorar calidad del feedback
    const consciousnessBoost = quantumState.consciousness > 0.8 ? ' con alta precisión neuronal' : ''
    
    const feedbacks = {
      high: [
        `¡Excelente! Has identificado un concepto clave${consciousnessBoost}`,
        `Perfecto, este elemento tiene alto valor educativo (coherencia: ${(quantumState.coherence * 100).toFixed(0)}%)`,
        `Muy bien, estás enfocándote en lo importante (entrelazamiento: ${(quantumState.entanglement * 100).toFixed(0)}%)`
      ],
      medium: [
        `Buen trabajo, este concepto es relevante${consciousnessBoost}`,
        `Correcto, sigue explorando en esta dirección (superposición: ${(quantumState.superposition * 100).toFixed(0)}%)`,
        `Interesante elección, profundiza más (coherencia: ${(quantumState.coherence * 100).toFixed(0)}%)`
      ],
      low: [
        `Este elemento es complementario, busca conceptos centrales${consciousnessBoost}`,
        `Elemento de apoyo detectado, explora conceptos principales (entrelazamiento: ${(quantumState.entanglement * 100).toFixed(0)}%)`,
        `Información adicional, enfócate en ideas fundamentales (conciencia: ${(quantumState.consciousness * 100).toFixed(0)}%)`
      ]
    }
    
    let level = 'low'
    if (educationalValue > 0.7) level = 'high'
    else if (educationalValue > 0.4) level = 'medium'
    
    const levelFeedbacks = feedbacks[level as keyof typeof feedbacks]
    const feedbackIndex = Math.floor(quantumState.coherence * levelFeedbacks.length) % levelFeedbacks.length
    return levelFeedbacks[feedbackIndex]
  }

  /**
   * 📊 OBTENER ESTADÍSTICAS HOLOGRÁFICAS
   */
  getHolographicStats(): {
    total_scenes: number
    active_particles: number
    agent_holograms: number
    quantum_fields: number
    average_coherence: number
    render_performance: any
    quantum_state_metrics: any
  } {
    const quantumState = this.quantumService.getQuantumState()
    const totalParticles = Array.from(this.activeScenes.values())
      .reduce((sum, scene) => sum + scene.total_particles, 0)
    
    const avgCoherence = Array.from(this.activeScenes.values())
      .reduce((sum, scene) => sum + scene.quantum_stability, 0) / this.activeScenes.size || 0
    
    return {
      total_scenes: this.activeScenes.size,
      active_particles: totalParticles,
      agent_holograms: this.agentHolograms.size,
      quantum_fields: this.quantumFields.length,
      average_coherence: avgCoherence,
      render_performance: {
        estimated_fps: 60 - (totalParticles / 1000 * 5), // Estimación simplificada
        gpu_usage: Math.min(100, totalParticles / 50),
        memory_usage: totalParticles * 0.01 // MB estimados
      },
      quantum_state_metrics: {
        coherence: quantumState.coherence,
        entanglement: quantumState.entanglement,
        superposition: quantumState.superposition,
        consciousness: quantumState.consciousness,
        timestamp: quantumState.timestamp
      }
    }
  }
}

// Instancia singleton
let hologramSystemInstance: QuantumHologramSystem | null = null

export const getHologramSystem = (): QuantumHologramSystem => {
  if (!hologramSystemInstance) {
    hologramSystemInstance = new QuantumHologramSystem()
  }
  return hologramSystemInstance
}

export default QuantumHologramSystem
