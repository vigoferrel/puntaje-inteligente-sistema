'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, BookOpen } from 'lucide-react'

export default function LoginPage() {
  const { signIn, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return
    }

    try {
      await signIn(formData)
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 rotate-12 blur-3xl'></div>
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-pink-600/20 -rotate-12 blur-3xl'></div>
      </div>

      <div className='w-full max-w-md relative z-10'>
        {/* Logo/Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg'>
            <BookOpen className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>PAES Pro</h1>
          <p className='text-gray-300'>Preparación inteligente para tu futuro</p>
        </div>

        <Card className='backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center text-white'>
              Iniciar Sesión
            </CardTitle>
            <CardDescription className='text-center text-gray-300'>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='p-3 text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-md'>
                  {error}
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='email' className='text-gray-200'>
                  Correo electrónico
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='nombre@ejemplo.com'
                  disabled={loading}
                  className='bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className='text-gray-200'>
                  Contraseña
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='••••••••'
                    disabled={loading}
                    className='bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200'
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <Link 
                  href='/auth/reset-password'
                  className='text-sm text-blue-400 hover:text-blue-300 underline'
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200'
                disabled={loading}
              >
                {loading ? (
                  <React.Fragment>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Iniciando sesión...
                  </React.Fragment>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-gray-300'>
                ¿No tienes una cuenta?{' '}
                <Link 
                  href='/register'
                  className='text-blue-400 hover:text-blue-300 font-medium underline'
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='mt-8 text-center text-gray-400 text-sm'>
          <p>© 2025 PAES Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
