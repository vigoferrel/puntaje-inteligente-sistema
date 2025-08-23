#!/usr/bin/env python3
"""
Script para poblar Supabase con datos reales de ejercicios PAES
"""

import os
import requests
import json
from datetime import datetime

# Configuración de Supabase
SUPABASE_URL = "https://settifboilityelprvjd.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ"

# Headers para las peticiones
headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

# Datos de ejercicios PAES reales
PAES_EXERCISES_DATA = [
    {
        'id': '1',
        'subject': 'Matemática M1',
        'topic': 'Ecuaciones de primer grado',
        'question': 'Resuelve la ecuación: 2x + 5 = 13',
        'options': ['x = 4', 'x = 8', 'x = 6', 'x = 3'],
        'correct_answer': 'x = 4',
        'explanation': '2x + 5 = 13 → 2x = 8 → x = 4',
        'difficulty': 'Medio',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': '2x + 5 = 13',
        'explanation_formula': 'x = 4',
        'points': 10,
        'tags': ['ecuaciones', 'primer_grado', 'álgebra'],
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    },
    {
        'id': '2',
        'subject': 'Matemática M1',
        'topic': 'Sistemas de ecuaciones lineales',
        'question': 'Resuelve el sistema: x + y = 5, 2x - y = 1',
        'options': ['x = 2, y = 3', 'x = 3, y = 2', 'x = 1, y = 4', 'x = 4, y = 1'],
        'correct_answer': 'x = 2, y = 3',
        'explanation': 'Sumando las ecuaciones: 3x = 6 → x = 2. Sustituyendo: 2 + y = 5 → y = 3',
        'difficulty': 'Medio',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'x + y = 5\n2x - y = 1',
        'explanation_formula': 'x = 2, y = 3',
        'points': 15,
        'tags': ['sistemas', 'ecuaciones', 'álgebra'],
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    },
    {
        'id': '3',
        'subject': 'Matemática M2',
        'topic': 'Teorema de Pitágoras',
        'question': 'En un triángulo rectángulo, si los catetos miden 3 y 4, ¿cuánto mide la hipotenusa?',
        'options': ['5', '6', '7', '8'],
        'correct_answer': '5',
        'explanation': 'Por el teorema de Pitágoras: c² = a² + b² = 3² + 4² = 9 + 16 = 25 → c = 5',
        'difficulty': 'Fácil',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'c^2 = a^2 + b^2',
        'explanation_formula': 'c = √(3² + 4²) = √25 = 5',
        'points': 10,
        'tags': ['geometría', 'pitágoras', 'triángulos'],
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    },
    {
        'id': '4',
        'subject': 'Competencia Lectora',
        'topic': 'Comprensión de lectura',
        'question': '¿Cuál es la idea principal del texto?',
        'options': ['La tecnología ha revolucionado la educación', 'Los estudiantes prefieren métodos tradicionales', 'La educación debe adaptarse a los cambios', 'Los profesores resisten la innovación'],
        'correct_answer': 'La tecnología ha revolucionado la educación',
        'explanation': 'El texto enfatiza cómo la tecnología ha transformado fundamentalmente los métodos educativos.',
        'difficulty': 'Medio',
        'bloom_level': 'COMPRENDER',
        'is_active': True,
        'context_text': 'La revolución tecnológica ha transformado radicalmente el panorama educativo. Las aulas tradicionales han dado paso a entornos digitales donde los estudiantes pueden acceder a información ilimitada y desarrollar habilidades críticas para el siglo XXI.',
        'context_image': None,
        'context_formula': None,
        'explanation_formula': None,
        'points': 15,
        'tags': ['comprensión', 'idea_principal', 'tecnología'],
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    },
    {
        'id': '5',
        'subject': 'Ciencias',
        'topic': 'Física - Movimiento',
        'question': '¿Cuál es la fórmula para calcular la velocidad?',
        'options': ['v = d/t', 'v = t/d', 'v = d*t', 'v = d+t'],
        'correct_answer': 'v = d/t',
        'explanation': 'La velocidad se calcula dividiendo la distancia entre el tiempo',
        'difficulty': 'Fácil',
        'bloom_level': 'RECORDAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'v = \\frac{d}{t}',
        'explanation_formula': 'v = d/t',
        'points': 10,
        'tags': ['física', 'movimiento', 'velocidad'],
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
]

def create_exercises_table():
    """Crear la tabla de ejercicios en Supabase"""
    print("🔧 Creando tabla de ejercicios...")
    
    # SQL para crear la tabla
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer TEXT NOT NULL,
        explanation TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        bloom_level TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        context_text TEXT,
        context_image TEXT,
        context_formula TEXT,
        explanation_formula TEXT,
        points INTEGER DEFAULT 10,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    try:
        # Usar RPC para ejecutar SQL
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={'sql': create_table_sql}
        )
        
        if response.status_code == 200:
            print("✅ Tabla de ejercicios creada exitosamente")
        else:
            print(f"⚠️  Tabla ya existe o error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error creando tabla: {e}")

def insert_exercises():
    """Insertar ejercicios en Supabase"""
    print("📝 Insertando ejercicios PAES...")
    
    success_count = 0
    error_count = 0
    
    for exercise in PAES_EXERCISES_DATA:
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/exercises",
                headers=headers,
                json=exercise
            )
            
            if response.status_code == 201:
                print(f"✅ Ejercicio {exercise['id']} insertado: {exercise['subject']} - {exercise['topic']}")
                success_count += 1
            else:
                print(f"❌ Error insertando ejercicio {exercise['id']}: {response.status_code}")
                error_count += 1
                
        except Exception as e:
            print(f"❌ Error en ejercicio {exercise['id']}: {e}")
            error_count += 1
    
    print(f"\n📊 Resumen: {success_count} ejercicios insertados, {error_count} errores")

def verify_data():
    """Verificar que los datos se insertaron correctamente"""
    print("🔍 Verificando datos insertados...")
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/exercises?select=*&is_active=eq.true",
            headers=headers
        )
        
        if response.status_code == 200:
            exercises = response.json()
            print(f"✅ {len(exercises)} ejercicios encontrados en Supabase")
            
            # Mostrar estadísticas
            subjects = {}
            difficulties = {}
            bloom_levels = {}
            
            for exercise in exercises:
                subjects[exercise['subject']] = subjects.get(exercise['subject'], 0) + 1
                difficulties[exercise['difficulty']] = difficulties.get(exercise['difficulty'], 0) + 1
                bloom_levels[exercise['bloom_level']] = bloom_levels.get(exercise['bloom_level'], 0) + 1
            
            print("\n📋 Estadísticas:")
            print(f"  Materias: {subjects}")
            print(f"  Dificultades: {difficulties}")
            print(f"  Niveles Bloom: {bloom_levels}")
            
        else:
            print(f"❌ Error verificando datos: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error en verificación: {e}")

def main():
    """Función principal"""
    print("🚀 MIGRACIÓN DE DATOS PAES A SUPABASE")
    print("=" * 50)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 URL: {SUPABASE_URL}")
    print("=" * 50)
    
    # Crear tabla
    create_exercises_table()
    
    # Insertar ejercicios
    insert_exercises()
    
    # Verificar datos
    verify_data()
    
    print("\n🎉 Migración completada!")
    print("=" * 50)

if __name__ == "__main__":
    main()
