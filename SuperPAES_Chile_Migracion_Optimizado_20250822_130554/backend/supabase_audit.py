#!/usr/bin/env python3
"""
Auditoría completa de Supabase para SuperPAES Chile
Catastro de todas las tablas y datos existentes
"""

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
    'Content-Type': 'application/json'
}

def get_table_schema(table_name):
    """Obtener esquema de una tabla específica"""
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table_name}?limit=1",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if data:
                return list(data[0].keys())
            else:
                return []
        else:
            return None
    except Exception as e:
        print(f"❌ Error obteniendo esquema de {table_name}: {e}")
        return None

def get_table_count(table_name):
    """Obtener cantidad de registros en una tabla"""
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table_name}?select=count",
            headers=headers
        )
        
        if response.status_code == 200:
            return len(response.json())
        else:
            return 0
    except Exception as e:
        print(f"❌ Error contando registros en {table_name}: {e}")
        return 0

def get_table_sample(table_name, limit=3):
    """Obtener muestra de datos de una tabla"""
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table_name}?limit={limit}",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return []
    except Exception as e:
        print(f"❌ Error obteniendo muestra de {table_name}: {e}")
        return []

def audit_exercises_table():
    """Auditar tabla de ejercicios"""
    print("\n📚 AUDITORÍA TABLA EXERCISES")
    print("=" * 50)
    
    # Verificar si existe la tabla
    schema = get_table_schema('exercises')
    if schema:
        count = get_table_count('exercises')
        sample = get_table_sample('exercises', 5)
        
        print(f"✅ Tabla 'exercises' existe")
        print(f"📊 Registros: {count}")
        print(f"🏗️  Esquema: {schema}")
        
        if sample:
            print("\n📋 Muestra de ejercicios:")
            for i, exercise in enumerate(sample, 1):
                print(f"  {i}. ID: {exercise.get('id', 'N/A')}")
                print(f"     Materia: {exercise.get('subject', 'N/A')}")
                print(f"     Tema: {exercise.get('topic', 'N/A')}")
                print(f"     Dificultad: {exercise.get('difficulty', 'N/A')}")
                print(f"     Bloom: {exercise.get('bloom_level', 'N/A')}")
                print(f"     Activo: {exercise.get('is_active', 'N/A')}")
                print()
        
        # Análisis por materias
        try:
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/exercises?select=subject",
                headers=headers
            )
            if response.status_code == 200:
                subjects = [ex['subject'] for ex in response.json()]
                subject_counts = {}
                for subject in subjects:
                    subject_counts[subject] = subject_counts.get(subject, 0) + 1
                
                print("📈 Distribución por materias:")
                for subject, count in subject_counts.items():
                    print(f"  {subject}: {count} ejercicios")
        except Exception as e:
            print(f"❌ Error analizando materias: {e}")
    else:
        print("❌ Tabla 'exercises' no existe")

def audit_quantum_nodes():
    """Auditar tabla de nodos cuánticos"""
    print("\n🧠 AUDITORÍA TABLA QUANTUM_NODES")
    print("=" * 50)
    
    schema = get_table_schema('quantum_nodes')
    if schema:
        count = get_table_count('quantum_nodes')
        sample = get_table_sample('quantum_nodes', 3)
        
        print(f"✅ Tabla 'quantum_nodes' existe")
        print(f"📊 Registros: {count}")
        print(f"🏗️  Esquema: {schema}")
        
        if sample:
            print("\n📋 Muestra de nodos cuánticos:")
            for i, node in enumerate(sample, 1):
                print(f"  {i}. ID: {node.get('id', 'N/A')}")
                print(f"     Node ID: {node.get('node_id', 'N/A')}")
                print(f"     Materia: {node.get('subject', 'N/A')}")
                print(f"     Bloom Level: {node.get('bloom_level', 'N/A')}")
                print(f"     Coherencia: {node.get('coherence', 'N/A')}")
                print(f"     Entropía: {node.get('entropy', 'N/A')}")
                print(f"     Activo: {node.get('is_active', 'N/A')}")
                print()
    else:
        print("❌ Tabla 'quantum_nodes' no existe")

def audit_ai_sessions():
    """Auditar tabla de sesiones de IA"""
    print("\n🤖 AUDITORÍA TABLA AI_SESSIONS")
    print("=" * 50)
    
    schema = get_table_schema('ai_sessions')
    if schema:
        count = get_table_count('ai_sessions')
        sample = get_table_sample('ai_sessions', 3)
        
        print(f"✅ Tabla 'ai_sessions' existe")
        print(f"📊 Registros: {count}")
        print(f"🏗️  Esquema: {schema}")
        
        if sample:
            print("\n📋 Muestra de sesiones IA:")
            for i, session in enumerate(sample, 1):
                print(f"  {i}. ID: {session.get('id', 'N/A')}")
                print(f"     Usuario: {session.get('user_id', 'N/A')}")
                print(f"     Tipo: {session.get('session_type', 'N/A')}")
                print(f"     Requests: {session.get('request_count', 'N/A')}")
                print(f"     Accuracy: {session.get('model_accuracy', 'N/A')}")
                print()
    else:
        print("❌ Tabla 'ai_sessions' no existe")

def audit_user_profiles():
    """Auditar tabla de perfiles de usuario"""
    print("\n👤 AUDITORÍA TABLA USER_PROFILES")
    print("=" * 50)
    
    schema = get_table_schema('user_profiles')
    if schema:
        count = get_table_count('user_profiles')
        sample = get_table_sample('user_profiles', 3)
        
        print(f"✅ Tabla 'user_profiles' existe")
        print(f"📊 Registros: {count}")
        print(f"🏗️  Esquema: {schema}")
        
        if sample:
            print("\n📋 Muestra de perfiles:")
            for i, profile in enumerate(sample, 1):
                print(f"  {i}. ID: {profile.get('id', 'N/A')}")
                print(f"     Usuario: {profile.get('user_id', 'N/A')}")
                print(f"     Nombre: {profile.get('name', 'N/A')}")
                print(f"     Nivel: {profile.get('level', 'N/A')}")
                print(f"     Puntos: {profile.get('points', 'N/A')}")
                print(f"     Rango: {profile.get('rank', 'N/A')}")
                print()
    else:
        print("❌ Tabla 'user_profiles' no existe")

def audit_learning_activities():
    """Auditar tabla de actividades de aprendizaje"""
    print("\n📖 AUDITORÍA TABLA LEARNING_ACTIVITIES")
    print("=" * 50)
    
    schema = get_table_schema('learning_activities')
    if schema:
        count = get_table_count('learning_activities')
        sample = get_table_sample('learning_activities', 3)
        
        print(f"✅ Tabla 'learning_activities' existe")
        print(f"📊 Registros: {count}")
        print(f"🏗️  Esquema: {schema}")
        
        if sample:
            print("\n📋 Muestra de actividades:")
            for i, activity in enumerate(sample, 1):
                print(f"  {i}. ID: {activity.get('id', 'N/A')}")
                print(f"     Título: {activity.get('title', 'N/A')}")
                print(f"     Materia: {activity.get('subject', 'N/A')}")
                print(f"     Tipo: {activity.get('activity_type', 'N/A')}")
                print(f"     Dificultad: {activity.get('difficulty', 'N/A')}")
                print(f"     Activo: {activity.get('is_active', 'N/A')}")
                print()
    else:
        print("❌ Tabla 'learning_activities' no existe")

def audit_cache_metrics():
    """Auditar tabla de métricas de cache"""
    print("\n⚡ AUDITORÍA TABLA CACHE_METRICS")
    print("=" * 50)
    
    schema = get_table_schema('cache_metrics')
    if schema:
        count = get_table_count('cache_metrics')
        sample = get_table_sample('cache_metrics', 3)
        
        print(f"✅ Tabla 'cache_metrics' existe")
        print(f"📊 Registros: {count}")
        print(f"🏗️  Esquema: {schema}")
        
        if sample:
            print("\n📋 Muestra de métricas:")
            for i, metric in enumerate(sample, 1):
                print(f"  {i}. ID: {metric.get('id', 'N/A')}")
                print(f"     Nivel: {metric.get('cache_level', 'N/A')}")
                print(f"     Hit Rate: {metric.get('hit_rate', 'N/A')}")
                print(f"     Miss Rate: {metric.get('miss_rate', 'N/A')}")
                print(f"     Tamaño: {metric.get('size_mb', 'N/A')} MB")
                print()
    else:
        print("❌ Tabla 'cache_metrics' no existe")

def get_all_tables():
    """Obtener lista de todas las tablas disponibles"""
    print("\n🗂️  LISTADO DE TODAS LAS TABLAS")
    print("=" * 50)
    
    # Lista de tablas conocidas del sistema
    known_tables = [
        'exercises',
        'quantum_nodes', 
        'ai_sessions',
        'user_profiles',
        'learning_activities',
        'cache_metrics',
        'paes_goals',
        'spotify_playlists',
        'ai_agents',
        'learning_metrics',
        'system_metrics',
        'user_sessions',
        'exercise_results',
        'bloom_levels',
        'subjects',
        'topics'
    ]
    
    existing_tables = []
    
    for table in known_tables:
        try:
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/{table}?limit=1",
                headers=headers
            )
            
            if response.status_code == 200:
                count = get_table_count(table)
                existing_tables.append((table, count))
                print(f"✅ {table}: {count} registros")
            else:
                print(f"❌ {table}: No existe")
                
        except Exception as e:
            print(f"❌ {table}: Error - {e}")
    
    return existing_tables

def generate_value_analysis():
    """Generar análisis de valor educativo"""
    print("\n🎯 ANÁLISIS DE VALOR EDUCATIVO")
    print("=" * 50)
    
    print("📊 DATOS DISPONIBLES PARA VALOR EDUCATIVO:")
    print()
    
    # Verificar ejercicios
    exercises_count = get_table_count('exercises')
    if exercises_count > 0:
        print(f"✅ {exercises_count} ejercicios PAES disponibles")
        print("   - Base de conocimiento para práctica")
        print("   - Generación de rutas de aprendizaje")
        print("   - Análisis de dificultad por materia")
        print()
    
    # Verificar nodos cuánticos
    quantum_count = get_table_count('quantum_nodes')
    if quantum_count > 0:
        print(f"✅ {quantum_count} nodos cuánticos disponibles")
        print("   - Mapeo de conceptos educativos")
        print("   - Relaciones entre temas")
        print("   - Optimización de rutas de aprendizaje")
        print()
    
    # Verificar perfiles de usuario
    profiles_count = get_table_count('user_profiles')
    if profiles_count > 0:
        print(f"✅ {profiles_count} perfiles de usuario")
        print("   - Personalización de contenido")
        print("   - Seguimiento de progreso")
        print("   - Gamificación y motivación")
        print()
    
    # Verificar sesiones de IA
    ai_sessions_count = get_table_count('ai_sessions')
    if ai_sessions_count > 0:
        print(f"✅ {ai_sessions_count} sesiones de IA")
        print("   - Análisis de patrones de aprendizaje")
        print("   - Optimización de respuestas")
        print("   - Predicción de dificultades")
        print()
    
    # Verificar actividades de aprendizaje
    activities_count = get_table_count('learning_activities')
    if activities_count > 0:
        print(f"✅ {activities_count} actividades de aprendizaje")
        print("   - Rutas personalizadas")
        print("   - Contenido multimedia")
        print("   - Evaluación continua")
        print()

def main():
    """Función principal de auditoría"""
    print("🔍 AUDITORÍA COMPLETA DE SUPABASE SUPERPAES")
    print("=" * 60)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 URL: {SUPABASE_URL}")
    print("=" * 60)
    
    # Obtener todas las tablas
    existing_tables = get_all_tables()
    
    # Auditar tablas específicas
    audit_exercises_table()
    audit_quantum_nodes()
    audit_ai_sessions()
    audit_user_profiles()
    audit_learning_activities()
    audit_cache_metrics()
    
    # Análisis de valor educativo
    generate_value_analysis()
    
    print("\n🎉 AUDITORÍA COMPLETADA")
    print("=" * 60)
    
    # Resumen final
    total_tables = len(existing_tables)
    total_records = sum(count for _, count in existing_tables)
    
    print(f"📊 RESUMEN FINAL:")
    print(f"   Tablas encontradas: {total_tables}")
    print(f"   Total de registros: {total_records}")
    print(f"   Sistema listo para: {'✅' if total_records > 0 else '❌'} Generar valor educativo")

if __name__ == "__main__":
    main()
