import apiClient from './apiClient'

class EntrenamientoService {
  // Obtener ejercicios de práctica
  async obtenerEjercicios(habilidad, nivel) {
    try {
      const respuesta = await apiClient.get('/entrenamiento/ejercicios', {
        params: { 
          habilidad, 
          nivel 
        }
      })
      return respuesta.data
    } catch (error) {
      console.error('Error al obtener ejercicios:', error)
      throw error
    }
  }

  // Enviar resultado de ejercicio
  async enviarResultadoEjercicio(datosEjercicio) {
    try {
      const respuesta = await apiClient.post('/entrenamiento/resultado', datosEjercicio)
      return respuesta.data
    } catch (error) {
      console.error('Error al enviar resultado de ejercicio:', error)
      throw error
    }
  }

  // Obtener progreso de entrenamiento
  async obtenerProgreso() {
    try {
      const respuesta = await apiClient.get('/entrenamiento/progreso')
      return respuesta.data
    } catch (error) {
      console.error('Error al obtener progreso:', error)
      throw error
    }
  }

  // Generar recomendaciones personalizadas
  async generarRecomendaciones(resultadosDiagnostico) {
    try {
      const respuesta = await apiClient.post('/entrenamiento/recomendaciones', resultadosDiagnostico)
      return respuesta.data
    } catch (error) {
      console.error('Error al generar recomendaciones:', error)
      throw error
    }
  }

  // Obtener recursos de aprendizaje
  async obtenerRecursos(habilidad, nivel) {
    try {
      const respuesta = await apiClient.get('/entrenamiento/recursos', {
        params: { 
          habilidad, 
          nivel 
        }
      })
      return respuesta.data
    } catch (error) {
      console.error('Error al obtener recursos:', error)
      throw error
    }
  }

  // Registrar tiempo de estudio
  async registrarTiempoEstudio(datosEstudio) {
    try {
      const respuesta = await apiClient.post('/entrenamiento/tiempo-estudio', datosEstudio)
      return respuesta.data
    } catch (error) {
      console.error('Error al registrar tiempo de estudio:', error)
      throw error
    }
  }
}

export default new EntrenamientoService()
