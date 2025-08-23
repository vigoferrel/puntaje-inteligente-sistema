#!/usr/bin/env python3
"""
Script para verificar todos los endpoints del backend SuperPAES
"""

import requests
import json
import time
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:5000"
TIMEOUT = 5

# Lista de endpoints a verificar
ENDPOINTS = [
    # Endpoints básicos
    {"url": "/api/health", "method": "GET", "description": "Estado del servidor"},
    {"url": "/api/user", "method": "GET", "description": "Datos del usuario"},
    {"url": "/api/paes-goals", "method": "GET", "description": "Metas PAES"},
    {"url": "/api/playlists", "method": "GET", "description": "Playlists de estudio"},
    {"url": "/api/agents", "method": "GET", "description": "Agentes IA"},
    {"url": "/api/learning-metrics", "method": "GET", "description": "Métricas de aprendizaje"},
    {"url": "/api/dashboard", "method": "GET", "description": "Dashboard principal"},
    {"url": "/api/exercises", "method": "GET", "description": "Ejercicios PAES"},
    {"url": "/api/subjects", "method": "GET", "description": "Materias disponibles"},
    {"url": "/api/difficulties", "method": "GET", "description": "Niveles de dificultad"},
    
    # Endpoints del sistema
    {"url": "/api/system/status", "method": "GET", "description": "Estado del sistema"},
    {"url": "/api/system/quantum-scripts", "method": "GET", "description": "Scripts cuánticos"},
    {"url": "/api/system/alerts", "method": "GET", "description": "Alertas del sistema"},
]

def test_endpoint(url, method="GET", description=""):
    """Prueba un endpoint específico"""
    full_url = f"{BASE_URL}{url}"
    
    try:
        if method == "GET":
            response = requests.get(full_url, timeout=TIMEOUT)
        elif method == "POST":
            response = requests.post(full_url, timeout=TIMEOUT, json={})
        else:
            return False, f"Método {method} no soportado"
        
        if response.status_code == 200:
            return True, f"✅ {description} - Status: {response.status_code}"
        else:
            return False, f"❌ {description} - Status: {response.status_code}"
            
    except requests.exceptions.ConnectionError:
        return False, f"❌ {description} - Error de conexión (servidor no disponible)"
    except requests.exceptions.Timeout:
        return False, f"❌ {description} - Timeout"
    except Exception as e:
        return False, f"❌ {description} - Error: {str(e)}"

def main():
    """Función principal"""
    print("=" * 60)
    print("🔍 VERIFICACIÓN DE ENDPOINTS - SUPERPAES BACKEND")
    print("=" * 60)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 URL Base: {BASE_URL}")
    print(f"⏱️  Timeout: {TIMEOUT} segundos")
    print("=" * 60)
    
    # Verificar si el servidor está disponible
    print("🔌 Verificando conectividad del servidor...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=TIMEOUT)
        if response.status_code == 200:
            print("✅ Servidor disponible")
        else:
            print(f"⚠️  Servidor responde con status: {response.status_code}")
    except:
        print("❌ Servidor no disponible")
        print("💡 Asegúrate de que el backend esté ejecutándose en el puerto 5000")
        return
    
    print("\n📋 Probando endpoints...")
    print("-" * 60)
    
    successful = 0
    total = len(ENDPOINTS)
    
    for endpoint in ENDPOINTS:
        success, message = test_endpoint(
            endpoint["url"], 
            endpoint["method"], 
            endpoint["description"]
        )
        print(message)
        if success:
            successful += 1
        time.sleep(0.1)  # Pequeña pausa entre requests
    
    print("-" * 60)
    print(f"📊 RESUMEN: {successful}/{total} endpoints funcionando")
    
    if successful == total:
        print("🎉 ¡Todos los endpoints están funcionando correctamente!")
    elif successful > total * 0.8:
        print("✅ La mayoría de endpoints están funcionando")
    else:
        print("⚠️  Algunos endpoints tienen problemas")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
