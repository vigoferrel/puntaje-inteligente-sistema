import axios from 'axios'
import { useAppStore } from '@/stores/appStore'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'https://api.paestutor.cl/v1',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de solicitudes
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor de respuestas
apiClient.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config
    const appStore = useAppStore()

    // Manejar errores de autorización
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      appStore.cerrarSesion()
      
      // Redirigir al login
      window.location.href = '/login'
    }

    // Manejar errores de red
    if (error.message === 'Network Error') {
      // Mostrar notificación de error de conexión
      appStore.mostrarNotificacion({
        tipo: 'error',
        mensaje: 'Error de conexión. Por favor, verifica tu internet.'
      })
    }

    // Manejar otros errores de respuesta
    if (error.response) {
      // El servidor respondió con un código de error
      const mensaje = error.response.data.mensaje || 'Ha ocurrido un error inesperado'
      
      appStore.mostrarNotificacion({
        tipo: 'error',
        mensaje: mensaje
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient
