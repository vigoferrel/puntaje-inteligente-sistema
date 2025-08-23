import { defineStore } from 'pinia'
import authService from '@/services/authService'

export const useAppStore = defineStore('app', {
  state: () => ({
    usuario: null,
    token: null,
    notificaciones: [],
    configuracion: {
      modoOscuro: false,
      lenguaje: 'es',
      notificacionesActivas: true
    }
  }),

  getters: {
    estaAutenticado: (state) => !!state.token,
    
    ultimaNotificacion: (state) => {
      return state.notificaciones.length > 0 
        ? state.notificaciones[state.notificaciones.length - 1] 
        : null
    }
  },

  actions: {
    // Iniciar sesión
    async iniciarSesion(credenciales) {
      try {
        const usuario = await authService.login(credenciales)
        this.usuario = usuario
        this.token = localStorage.getItem('token')
        
        this.mostrarNotificacion({
          tipo: 'success',
          mensaje: `Bienvenido, ${usuario.nombre}`
        })
      } catch (error) {
        this.mostrarNotificacion({
          tipo: 'error',
          mensaje: error.response?.data?.mensaje || 'Error de inicio de sesión'
        })
        throw error
      }
    },

    // Cerrar sesión
    cerrarSesion() {
      authService.logout()
      this.usuario = null
      this.token = null
      
      this.mostrarNotificacion({
        tipo: 'info',
        mensaje: 'Sesión cerrada exitosamente'
      })
    },

    // Registro de usuario
    async registrar(datosRegistro) {
      try {
        const respuesta = await authService.register(datosRegistro)
        
        this.mostrarNotificacion({
          tipo: 'success',
          mensaje: 'Registro exitoso. Por favor, inicia sesión.'
        })
        
        return respuesta
      } catch (error) {
        this.mostrarNotificacion({
          tipo: 'error',
          mensaje: error.response?.data?.mensaje || 'Error en el registro'
        })
        throw error
      }
    },

    // Mostrar notificación
    mostrarNotificacion(notificacion) {
      const id = Date.now()
      const notificacionConId = { ...notificacion, id }
      
      this.notificaciones.push(notificacionConId)
      
      // Eliminar notificación después de 5 segundos
      setTimeout(() => {
        this.eliminarNotificacion(id)
      }, 5000)
    },

    // Eliminar notificación
    eliminarNotificacion(id) {
      const index = this.notificaciones.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notificaciones.splice(index, 1)
      }
    },

    // Cambiar configuración
    cambiarConfiguracion(nuevaConfiguracion) {
      this.configuracion = {
        ...this.configuracion,
        ...nuevaConfiguracion
      }

      // Guardar en localStorage para persistencia
      localStorage.setItem(
        'app-configuracion', 
        JSON.stringify(this.configuracion)
      )

      // Notificar cambio de configuración
      this.mostrarNotificacion({
        tipo: 'info',
        mensaje: 'Configuración actualizada'
      })
    },

    // Recuperar configuración guardada
    inicializarConfiguracion() {
      const configuracionGuardada = localStorage.getItem('app-configuracion')
      
      if (configuracionGuardada) {
        try {
          const configuracion = JSON.parse(configuracionGuardada)
          this.configuracion = {
            ...this.configuracion,
            ...configuracion
          }
        } catch (error) {
          console.error('Error al parsear configuración:', error)
        }
      }
    },

    // Inicializar estado de usuario
    inicializarEstado() {
      // Verificar token existente
      const token = localStorage.getItem('token')
      const usuarioGuardado = localStorage.getItem('user')

      if (token && usuarioGuardado) {
        try {
          this.token = token
          this.usuario = JSON.parse(usuarioGuardado)
        } catch (error) {
          console.error('Error al inicializar estado:', error)
          this.cerrarSesion()
        }
      }

      // Inicializar configuración
      this.inicializarConfiguracion()
    }
  }
})
