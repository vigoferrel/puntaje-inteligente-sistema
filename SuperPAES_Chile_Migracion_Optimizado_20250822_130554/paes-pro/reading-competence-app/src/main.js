// Configuración optimizada - 16/04/2025
import { createApp } from 'vue'

// Configuración de producción (comentada ya que enableProdMode no está disponible en Vue 3)
// import { enableProdMode } from 'vue'
// enableProdMode()
import App from './App.vue'
import router from './routes'
import { createPinia } from 'pinia'

// Importar estilos globales de Tailwind
import './index.css'

// Configuración de Pinia para estado global
const pinia = createPinia()

// Crear instancia de la aplicación
const app = createApp(App)

// Configurar plugins
app.use(router)
app.use(pinia)

// Montar la aplicación
app.mount('#app')

// Configuración de interceptores globales (opcional)
// Objeto de rutas protegidas para acceso rápido O(1)
const protectedRoutes = {
  '/dashboard': false,
  '/ruta-personalizada': false
}

router.beforeEach((to, from, next) => {
  // Verificar autenticación solo si es ruta protegida
  if (protectedRoutes[to.path]) {
    const isAuthenticated = localStorage.getItem('user-token')
    if (!isAuthenticated) {
      return next('/login')
    }
  }
  next()
})

// Manejador de errores global
/**
 * Manejador global de errores con throttling para evitar saturación
 */
let lastErrorTime = 0
const ERROR_THROTTLE_MS = 5000

app.config.errorHandler = (err, vm, info) => {
  const now = Date.now()
  
  // Throttle para evitar múltiples logs del mismo error
  if (now - lastErrorTime > ERROR_THROTTLE_MS) {
    console.error('[Global Error Handler]', {
      error: err,
      component: vm?.$options?.name || 'Anonymous',
      info,
      timestamp: new Date().toISOString()
    })
    
    lastErrorTime = now
    
    // Enviar a servicio de monitoreo si está configurado
    if (window.trackError) {
      window.trackError(err)
    }
  }
}
