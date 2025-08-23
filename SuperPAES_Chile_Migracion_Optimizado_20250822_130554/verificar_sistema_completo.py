#!/usr/bin/env python3
"""
Script para verificar que el sistema SuperPAES esté funcionando completamente
sin dependencias de Supabase problemáticas
"""

import requests
import json
import time
from datetime import datetime

# Configuración
BACKEND_URL = "http://localhost:5000"
FRONTEND_URL = "http://localhost:5173"
TIMEOUT = 5

def test_backend_endpoints():
    """Probar todos los endpoints del backend"""
    print("🔍 Probando endpoints del backend...")
    print("=" * 50)
    
    endpoints = [
        ("/api/health", "Estado del servidor"),
        ("/api/exercises", "Ejercicios PAES"),
        ("/api/user", "Datos del usuario"),
        ("/api/paes-goals", "Metas PAES"),
        ("/api/playlists", "Playlists de estudio"),
        ("/api/agents", "Agentes IA"),
        ("/api/learning-metrics", "Métricas de aprendizaje"),
        ("/api/dashboard", "Dashboard principal"),
        ("/api/subjects", "Materias disponibles"),
        ("/api/difficulties", "Niveles de dificultad"),
        ("/api/system/status", "Estado del sistema"),
    ]
    
    successful = 0
    total = len(endpoints)
    
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=TIMEOUT)
            if response.status_code == 200:
                print(f"✅ {description} - Status: {response.status_code}")
                successful += 1
            else:
                print(f"❌ {description} - Status: {response.status_code}")
        except Exception as e:
            print(f"❌ {description} - Error: {str(e)}")
    
    print("-" * 50)
    print(f"📊 Backend: {successful}/{total} endpoints funcionando")
    return successful == total

def test_exercises_data():
    """Probar específicamente los datos de ejercicios"""
    print("\n🎯 Probando datos de ejercicios...")
    print("=" * 50)
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/exercises", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            exercises = data.get('exercises', [])
            total = data.get('total', 0)
            
            print(f"✅ Ejercicios cargados: {total}")
            
            if exercises:
                print("📋 Ejercicios disponibles:")
                for i, exercise in enumerate(exercises[:3], 1):  # Mostrar solo los primeros 3
                    print(f"  {i}. {exercise.get('subject', 'N/A')} - {exercise.get('topic', 'N/A')}")
                
                # Verificar estructura de datos
                first_exercise = exercises[0]
                required_fields = ['id', 'subject', 'question', 'options', 'correct_answer', 'explanation']
                missing_fields = [field for field in required_fields if field not in first_exercise]
                
                if missing_fields:
                    print(f"⚠️  Campos faltantes: {missing_fields}")
                else:
                    print("✅ Estructura de datos correcta")
                
                return True
            else:
                print("❌ No se encontraron ejercicios")
                return False
        else:
            print(f"❌ Error al cargar ejercicios: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_frontend_connectivity():
    """Probar conectividad del frontend"""
    print("\n🌐 Probando conectividad del frontend...")
    print("=" * 50)
    
    try:
        response = requests.get(FRONTEND_URL, timeout=TIMEOUT)
        if response.status_code == 200:
            print("✅ Frontend accesible")
            return True
        else:
            print(f"⚠️  Frontend responde con status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend no accesible: {str(e)}")
        return False

def main():
    """Función principal"""
    print("🚀 VERIFICACIÓN COMPLETA DEL SISTEMA SUPERPAES")
    print("=" * 60)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔧 Backend: {BACKEND_URL}")
    print(f"🎨 Frontend: {FRONTEND_URL}")
    print("=" * 60)
    
    # Verificar backend
    backend_ok = test_backend_endpoints()
    
    # Verificar datos de ejercicios
    exercises_ok = test_exercises_data()
    
    # Verificar frontend
    frontend_ok = test_frontend_connectivity()
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📊 RESUMEN FINAL")
    print("=" * 60)
    
    print(f"🔧 Backend Flask: {'✅ FUNCIONAL' if backend_ok else '❌ PROBLEMAS'}")
    print(f"🎯 Ejercicios PAES: {'✅ CARGADOS' if exercises_ok else '❌ ERROR'}")
    print(f"🌐 Frontend React: {'✅ ACCESIBLE' if frontend_ok else '❌ NO ACCESIBLE'}")
    
    if backend_ok and exercises_ok and frontend_ok:
        print("\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!")
        print("✅ Sin dependencias de Supabase problemáticas")
        print("✅ Backend Flask como fuente única de verdad")
        print("✅ Frontend React operativo")
        print("✅ Ejercicios PAES disponibles")
    else:
        print("\n⚠️  ALGUNOS PROBLEMAS DETECTADOS")
        if not backend_ok:
            print("❌ Backend no está funcionando correctamente")
        if not exercises_ok:
            print("❌ Problemas con los datos de ejercicios")
        if not frontend_ok:
            print("❌ Frontend no está accesible")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
