import axios from 'axios'

const API_URL = process.env.VUE_APP_API_BASE_URL || 'https://api.paestutor.cl/v1'

class AuthService {
  // Iniciar sesión
  async login(credenciales) {
    try {
      const respuesta = await axios.post(`${API_URL}/auth/login`, {
        email: credenciales.email,
        password: credenciales.password
      })

      if (respuesta.data.token) {
        // Guardar información de usuario
        localStorage.setItem('user', JSON.stringify(respuesta.data.usuario))
        localStorage.setItem('token', respuesta.data.token)
      }

      return respuesta.data.usuario
    } catch (error) {
      console.error('Error de inicio de sesión:', error)
      throw error
    }
  }

  // Registro de usuario
  async register(datosRegistro) {
    try {
      const respuesta = await axios.post(`${API_URL}/auth/registro`, {
        nombre: datosRegistro.nombre,
        email: datosRegistro.email,
        password: datosRegistro.password,
        tipoEducacion: datosRegistro.tipoEducacion
      })

      return respuesta.data
    } catch (error) {
      console.error('Error de registro:', error)
      throw error
    }
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Obtener usuario actual
  getCurrentUser() {
    const usuario = localStorage.getItem('user')
    return usuario ? JSON.parse(usuario) : null
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  // Recuperar contraseña
  async recuperarContrasena(email) {
    try {
      const respuesta = await axios.post(`${API_URL}/auth/recuperar-contrasena`, { email })
      return respuesta.data
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error)
      throw error
    }
  }

  // Actualizar perfil
  async actualizarPerfil(datosActualizacion) {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.put(`${API_URL}/usuarios/perfil`, datosActualizacion, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      })

      // Actualizar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(respuesta.data))
      return respuesta.data
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      throw error
    }
  }
}

export default new AuthService()
