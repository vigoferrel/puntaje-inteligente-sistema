import axios from 'axios'

const API_URL = process.env.VUE_APP_API_BASE_URL || 'https://api.paestutor.cl/v1'

class DiagnosticoService {
  // Obtener preguntas de diagnóstico
  async obtenerPreguntas(habilidad = null) {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.get(`${API_URL}/diagnostico/preguntas`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        params: { habilidad }
      })

      return respuesta.data
    } catch (error) {
      console.error('Error al obtener preguntas:', error)
      throw error
    }
  }

  // Enviar respuestas de diagnóstico
  async enviarRespuestas(respuestas) {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.post(`${API_URL}/diagnostico/resultados`, 
        { respuestas }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      )

      return respuesta.data
    } catch (error) {
      console.error('Error al enviar respuestas:', error)
      throw error
    }
  }

  // Obtener historial de diagnósticos
  async obtenerHistorial() {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.get(`${API_URL}/diagnostico/historial`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      })

      return respuesta.data
    } catch (error) {
      console.error('Error al obtener historial:', error)
      throw error
    }
  }

  // Generar ruta de mejora personalizada
  async generarRutaMejora(resultados) {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.post(`${API_URL}/diagnostico/ruta-mejora`, 
        { resultados }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      )

      return respuesta.data
    } catch (error) {
      console.error('Error al generar ruta de mejora:', error)
      throw error
    }
  }

  // Obtener ejercicios de práctica
  async obtenerEjercicios(habilidad, nivel) {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.get(`${API_URL}/diagnostico/ejercicios`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
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

  // Registrar progreso de ejercicio
  async registrarProgresoEjercicio(datosEjercicio) {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.post(`${API_URL}/diagnostico/progreso-ejercicio`, 
        datosEjercicio, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      )

      return respuesta.data
    } catch (error) {
      console.error('Error al registrar progreso:', error)
      throw error
    }
  }
}

export default new DiagnosticoService()
