import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import(/* webpackChunkName: "home" */ './components/Home.vue')
const Diagnostico = () => import(/* webpackChunkName: "diagnostico" */ './components/Diagnostico.vue')
const Resultados = () => import(/* webpackChunkName: "resultados" */ './components/Resultados.vue')
const RutaPersonalizada = () => import(/* webpackChunkName: "ruta-personalizada" */ './components/RutaPersonalizada.vue')
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ './components/Dashboard.vue')
const Entrenamiento = () => import(/* webpackChunkName: "entrenamiento" */ './components/Entrenamiento.vue')

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    path: '/diagnostico', 
    name: 'Diagnostico', 
    component: Diagnostico 
  },
  { 
    path: '/resultados', 
    name: 'Resultados', 
    component: Resultados,
    props: true
  },
  { 
    path: '/ruta-personalizada', 
    name: 'RutaPersonalizada', 
    component: RutaPersonalizada,
    props: true
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    props: true
  },
  { 
    path: '/entrenamiento', 
    name: 'Entrenamiento', 
    component: Entrenamiento 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
