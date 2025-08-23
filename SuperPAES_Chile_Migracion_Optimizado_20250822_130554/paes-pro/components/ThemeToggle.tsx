'use client'

import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/lib/store/theme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore()
  
  useEffect(() => {
    // Aplicar tema inicial
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleToggle = () => {
    toggleTheme()
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
