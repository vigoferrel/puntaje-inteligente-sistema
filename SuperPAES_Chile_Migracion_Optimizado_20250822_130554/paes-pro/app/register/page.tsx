'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, BookOpen, User, Mail, MapPin, GraduationCap } from 'lucide-react'
import { GradeLevel, Region } from '@/types/auth'

export default function RegisterPage() {
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    grade_level: '',
    region: '',
    city: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        grade_level: formData.grade_level || undefined,
        region: formData.region || undefined,
        city: formData.city || undefined
      })
    } catch (error: any) {
      setError(error.message || 'Error al crear la cuenta')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const gradeOptions = [
    { value: GradeLevel.SEPTIMO, label: '7° Básico' },
    { value: GradeLevel.OCTAVO, label: '8° Básico' },
    { value: GradeLevel.PRIMERO, label: '1° Medio' },
    { value: GradeLevel.SEGUNDO, label: '2° Medio' },
    { value: GradeLevel.TERCERO, label: '3° Medio' },
    { value: GradeLevel.CUARTO, label: '4° Medio' },
    { value: GradeLevel.GRADUATE, label: 'Egresado' }
  ]

  const regionOptions = [
    { value: Region.ARICA, label: 'Arica y Parinacota' },
    { value: Region.TARAPACA, label: 'Tarapacá' },
    { value: Region.ANTOFAGASTA, label: 'Antofagasta' },
    { value: Region.ATACAMA, label: 'Atacama' },
    { value: Region.COQUIMBO, label: 'Coquimbo' },
    { value: Region.VALPARAISO, label: 'Valparaíso' },
    { value: Region.METROPOLITANA, label: 'Metropolitana' },
    { value: Region.OHIGGINS, label: 'O\'Higgins' },
    { value: Region.MAULE, label: 'Maule' },
    { value: Region.NUBLE, label: 'Ñuble' },
    { value: Region.BIOBIO, label: 'Biobío' },
    { value: Region.ARAUCANIA, label: 'Araucanía' },
    { value: Region.LOS_RIOS, label: 'Los Ríos' },
    { value: Region.LOS_LAGOS, label: 'Los Lagos' },
    { value: Region.AYSEN, label: 'Aysén' },
    { value: Region.MAGALLANES, label: 'Magallanes' }
  ]

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
          <p className='text-gray-300'>Únete a la plataforma de preparación inteligente</p>
        </div>

        <Card className='backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center text-white'>
              Crear Cuenta
            </CardTitle>
            <CardDescription className='text-center text-gray-300'>
              Completa tus datos para empezar tu preparación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='p-3 text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-md'>
                  {error}
                </div>
              )}

              {/* Nombre completo */}
              <div className='space-y-2'>
                <Label htmlFor='full_name' className='text-gray-200 flex items-center gap-2'>
                  <User size={16} />
                  Nombre completo *
                </Label>
                <Input
                  id='full_name'
                  name='full_name'
                  type='text'
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder='Tu nombre completo'
                  disabled={loading}
                  className='bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                  required
                />
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-gray-200 flex items-center gap-2'>
                  <Mail size={16} />
                  Correo electrónico *
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

              {/* Contraseña */}
              <div className='space-y-2'>
                <Label htmlFor='password' className='text-gray-200'>
                  Contraseña *
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Mínimo 6 caracteres'
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

              {/* Confirmar contraseña */}
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword' className='text-gray-200'>
                  Confirmar contraseña *
                </Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Repite tu contraseña'
                    disabled={loading}
                    className='bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200'
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Nivel académico */}
              <div className='space-y-2'>
                <Label htmlFor='grade_level' className='text-gray-200 flex items-center gap-2'>
                  <GraduationCap size={16} />
                  Nivel académico
                </Label>
                <select
                  id='grade_level'
                  name='grade_level'
                  value={formData.grade_level}
                  onChange={handleInputChange}
                  disabled={loading}
                  className='w-full h-10 px-3 py-2 text-sm bg-white/10 border border-white/20 text-white rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                >
                  <option value='' className='text-gray-900'>
                    Selecciona tu nivel
                  </option>
                  {gradeOptions.map(option => (
                    <option key={option.value} value={option.value} className='text-gray-900'>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Región */}
              <div className='space-y-2'>
                <Label htmlFor='region' className='text-gray-200 flex items-center gap-2'>
                  <MapPin size={16} />
                  Región
                </Label>
                <select
                  id='region'
                  name='region'
                  value={formData.region}
                  onChange={handleInputChange}
                  disabled={loading}
                  className='w-full h-10 px-3 py-2 text-sm bg-white/10 border border-white/20 text-white rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                >
                  <option value='' className='text-gray-900'>
                    Selecciona tu región
                  </option>
                  {regionOptions.map(option => (
                    <option key={option.value} value={option.value} className='text-gray-900'>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ciudad */}
              <div className='space-y-2'>
                <Label htmlFor='city' className='text-gray-200'>
                  Ciudad
                </Label>
                <Input
                  id='city'
                  name='city'
                  type='text'
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder='Tu ciudad'
                  disabled={loading}
                  className='bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                />
              </div>

              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200'
                disabled={loading}
              >
                {loading ? (
                  <React.Fragment>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creando cuenta...
                  </React.Fragment>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-gray-300'>
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  href='/login' 
                  className='text-blue-400 hover:text-blue-300 font-medium underline'
                >
                  Inicia sesión aquí
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
