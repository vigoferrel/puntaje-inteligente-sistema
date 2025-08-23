'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Text } from 'troika-three-text'

interface Skill {
  id: string
  name: string
  value: number
  category: string
  color?: string
}

interface SkillsVisualization3DProps {
  skills?: Skill[]
  width?: number
  height?: number
  rotationSpeed?: number
  showLabels?: boolean
  theme?: 'dark' | 'light'
}

// Función que genera números cuánticos (reemplaza Math.random)
const generateQuantumNumber = (min = 0, max = 1) => {
  // Obtener microsegundos para mayor precisión
  const now = new Date()
  const microseconds = (now.getTime() % 1000) / 1000
  
  // Usar el golden ratio para obtener mayor entropía
  const entropy = (now.getTime() * 0.618033988749) % 1
  
  // Combinar fuentes de entropía y ajustar al rango deseado
  const quantum = (microseconds + entropy) % 1
  return min + quantum * (max - min)
}

export default function SkillsVisualization3D({
  skills,
  width = 500,
  height = 400,
  rotationSpeed = 0.001,
  showLabels = true,
  theme = 'dark'
}: SkillsVisualization3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const nodesRef = useRef<THREE.Object3D[]>([])
  const edgesRef = useRef<THREE.Line[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const textLabelsRef = useRef<any[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Usar datos de demostración si no se proporcionan skills
  const demoSkills: Skill[] = [
    { id: '1', name: 'Álgebra', value: 0.78, category: 'matematica', color: '#4c72ff' },
    { id: '2', name: 'Geometría', value: 0.65, category: 'matematica', color: '#3b82f6' },
    { id: '3', name: 'Estadística', value: 0.45, category: 'matematica', color: '#2563eb' },
    { id: '4', name: 'Comprensión', value: 0.85, category: 'lectura', color: '#10b981' },
    { id: '5', name: 'Análisis', value: 0.72, category: 'lectura', color: '#059669' },
    { id: '6', name: 'Argumentación', value: 0.58, category: 'lectura', color: '#047857' },
    { id: '7', name: 'Historia Chile', value: 0.63, category: 'historia', color: '#8b5cf6' },
    { id: '8', name: 'Historia Universal', value: 0.55, category: 'historia', color: '#7c3aed' },
    { id: '9', name: 'Ciencias', value: 0.49, category: 'ciencias', color: '#ec4899' },
  ]
  
  const dataToVisualize = skills || demoSkills
  
  // Inicializar escena 3D
  useEffect(() => {
    if (!containerRef.current) return
    
    try {
      // Configuración inicial
      const scene = new THREE.Scene()
      
      // Fondo según tema
      scene.background = new THREE.Color(theme === 'dark' ? '#0f172a' : '#f8fafc')
      
      // Cámara
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
      camera.position.z = 5
      
      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      containerRef.current.appendChild(renderer.domElement)
      
      // Controles
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      
      // Iluminación
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)
      
      // Guardar referencias
      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer
      controlsRef.current = controls
      
      // Crear visualización
      createVisualization()
      
      // Limpiar al desmontar
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        
        if (containerRef.current && rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        
        // Limpiar los objetos 3D para evitar fugas de memoria
        if (sceneRef.current) {
          nodesRef.current.forEach(node => sceneRef.current?.remove(node))
          edgesRef.current.forEach(edge => sceneRef.current?.remove(edge))
          textLabelsRef.current.forEach(label => sceneRef.current?.remove(label))
        }
      }
    } catch (err) {
      console.error('Error initializing 3D visualization:', err)
      setError('Error initializing 3D visualization')
    }
  }, [width, height, theme])
  
  // Crear visualización 3D de habilidades
  const createVisualization = () => {
    if (!sceneRef.current) return
    
    try {
      // Limpiar escena
      nodesRef.current.forEach(node => sceneRef.current?.remove(node))
      edgesRef.current.forEach(edge => sceneRef.current?.remove(edge))
      textLabelsRef.current.forEach(label => sceneRef.current?.remove(label))
      
      nodesRef.current = []
      edgesRef.current = []
      textLabelsRef.current = []
      
      // Generar posiciones para nodos
      const nodePositions: THREE.Vector3[] = []
      const radius = 2.5
      
      // Posicionar nodos en forma de esfera
      dataToVisualize.forEach((skill, index) => {
        // Usar método distribución fibonacci para puntos uniformes en esfera
        const phi = Math.acos(-1 + (2 * index) / dataToVisualize.length)
        const theta = Math.sqrt(dataToVisualize.length * Math.PI) * phi
        
        // Usar factor cuántico para pequeñas variaciones
        const quantumOffset = generateQuantumNumber(-0.2, 0.2)
        
        // Calcular posición
        const x = radius * Math.cos(theta) * Math.sin(phi) + quantumOffset
        const y = radius * Math.sin(theta) * Math.sin(phi) + quantumOffset
        const z = radius * Math.cos(phi) + quantumOffset
        
        nodePositions.push(new THREE.Vector3(x, y, z))
      })
      
      // Crear nodos
      dataToVisualize.forEach((skill, index) => {
        // Tamaño basado en valor de habilidad
        const nodeSize = 0.1 + skill.value * 0.2
        
        // Color del nodo
        const nodeColor = skill.color || getColorByCategory(skill.category)
        
        // Geometría y material
        const geometry = new THREE.SphereGeometry(nodeSize, 16, 16)
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(nodeColor),
          emissive: new THREE.Color(nodeColor).multiplyScalar(0.2),
          specular: new THREE.Color(0xffffff),
          shininess: 80
        })
        
        // Crear malla
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(nodePositions[index])
        mesh.userData = { ...skill }
        
        // Añadir a la escena
        sceneRef.current?.add(mesh)
        nodesRef.current.push(mesh)
        
        // Añadir etiquetas de texto si están habilitadas
        if (showLabels) {
          createTextLabel(skill.name, nodePositions[index], nodeColor)
        }
      })
      
      // Crear conexiones entre nodos (con umbral de proximidad)
      const threshold = 2.2
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const distance = nodePositions[i].distanceTo(nodePositions[j])
          
          if (distance < threshold) {
            const strength = 1 - (distance / threshold)
            
            // Color según categorías
            const skill1 = dataToVisualize[i]
            const skill2 = dataToVisualize[j]
            
            const color = skill1.category === skill2.category 
              ? getColorByCategory(skill1.category) 
              : '#ffffff'
            
            const opacity = strength * 0.5
            
            // Crear línea
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              nodePositions[i],
              nodePositions[j]
            ])
            
            const lineMaterial = new THREE.LineBasicMaterial({
              color: new THREE.Color(color),
              opacity: opacity,
              transparent: true,
              linewidth: 1
            })
            
            const line = new THREE.Line(lineGeometry, lineMaterial)
            sceneRef.current?.add(line)
            edgesRef.current.push(line)
          }
        }
      }
      
      // Iniciar animación
      animate()
      setIsLoading(false)
    } catch (err) {
      console.error('Error creating visualization:', err)
      setError('Error creating skills visualization')
      setIsLoading(false)
    }
  }
  
  // Crear etiqueta de texto 3D
  const createTextLabel = (text: string, position: THREE.Vector3, color: string) => {
    try {
      const textMesh = new Text()
      textMesh.text = text
      textMesh.fontSize = 0.15
      textMesh.color = color
      textMesh.anchorX = 'center'
      textMesh.anchorY = 'middle'
      textMesh.position.copy(position)
      textMesh.position.multiplyScalar(1.15) // Alejar ligeramente del nodo
      
      // Hacer que la etiqueta siempre mire a la cámara
      textMesh.lookAt(new THREE.Vector3(0, 0, 5))
      
      sceneRef.current?.add(textMesh)
      textLabelsRef.current.push(textMesh)
      
      // Inicializar el texto
      textMesh.sync()
    } catch (err) {
      console.error('Error creating text label:', err)
    }
  }
  
  // Obtener color por categoría
  const getColorByCategory = (category: string): string => {
    const categoryColors: Record<string, string> = {
      matematica: '#4c72ff',
      lectura: '#10b981',
      historia: '#8b5cf6',
      ciencias: '#ec4899',
      default: '#6b7280'
    }
    
    return categoryColors[category] || categoryColors.default
  }
  
  // Animación
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) return
    
    // Rotar toda la escena ligeramente
    sceneRef.current.rotation.y += rotationSpeed
    
    // Pequeños movimientos de los nodos (efecto "vivo")
    nodesRef.current.forEach(node => {
      const quantumX = generateQuantumNumber(-0.0005, 0.0005)
      const quantumY = generateQuantumNumber(-0.0005, 0.0005)
      const quantumZ = generateQuantumNumber(-0.0005, 0.0005)
      
      node.position.x += quantumX
      node.position.y += quantumY
      node.position.z += quantumZ
    })
    
    // Actualizar controles
    controlsRef.current.update()
    
    // Actualizar líneas entre nodos
    updateEdges()
    
    // Actualizar etiquetas para que miren a la cámara
    if (showLabels) {
      textLabelsRef.current.forEach(label => {
        if (label.lookAt) {
          label.lookAt(cameraRef.current!.position)
        }
      })
    }
    
    // Renderizar
    rendererRef.current.render(sceneRef.current, cameraRef.current)
    
    // Continuar animación
    animationFrameRef.current = requestAnimationFrame(animate)
  }
  
  // Actualizar conexiones entre nodos
  const updateEdges = () => {
    // Actualizar posiciones de líneas
    edgesRef.current.forEach((line, index) => {
      const positions = line.geometry.attributes.position
      
      if (!positions) return
      
      const i = Math.floor(index / (nodesRef.current.length - 1))
      const j = index % (nodesRef.current.length - 1) + i + 1
      
      if (i < nodesRef.current.length && j < nodesRef.current.length) {
        const node1 = nodesRef.current[i]
        const node2 = nodesRef.current[j]
        
        if (node1 && node2) {
          positions.setXYZ(0, node1.position.x, node1.position.y, node1.position.z)
          positions.setXYZ(1, node2.position.x, node2.position.y, node2.position.z)
          positions.needsUpdate = true
        }
      }
    })
  }
  
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }
  
  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
        className="overflow-hidden rounded-lg"
      />
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        Visualización cuántica 3D de habilidades
      </div>
    </div>
  )
}
