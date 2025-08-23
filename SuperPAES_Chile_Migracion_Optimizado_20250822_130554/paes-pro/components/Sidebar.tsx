'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Activity,
  Target,
  BarChart3,
  Settings,
  GraduationCap,
  MessageSquare
} from 'lucide-react'

const menuItems = [
  {
    title: 'PREPARACIÓN',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Mi Plan', href: '/plan', icon: Target },
      { name: 'Lectoguía', href: '/lectoguia', icon: BookOpen, badge: 'Nuevo' },
      { name: 'Diagnóstico', href: '/diagnostico', icon: Activity },
    ]
  },
  {
    title: 'INTELIGENCIA ARTIFICIAL',
    items: [
      { name: 'Asistente IA', href: '/agente', icon: MessageSquare, badge: 'IA' },
    ]
  },
  {
    title: 'PRÁCTICA',
    items: [
      { name: 'Simulacros', href: '/simulacros', icon: FileText, badge: 'Pronto' },
      { name: 'Resultados', href: '/resultados', icon: BarChart3, badge: 'Pronto' },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-background border-r border-border/40 min-h-screen flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border/40">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PAES PRO
          </span>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6 space-y-8">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-secondary text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : ''}`} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <motion.span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.badge === 'Nuevo'
                              ? 'bg-primary/20 text-primary'
                              : item.badge === 'IA'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center justify-between mb-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/configuracion"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              <span>Configuración</span>
            </Link>
          </motion.div>
          <ThemeToggle />
        </div>
        
        <motion.div
          className="p-3 bg-secondary/50 rounded-lg border border-border/40 hover:bg-secondary/80 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-medium text-primary-foreground">OF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Oscar Ferrel</p>
              <p className="text-xs text-muted-foreground">Estudiante PAES</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
