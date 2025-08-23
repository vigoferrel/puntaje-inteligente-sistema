#!/usr/bin/env python3
"""
Verificación del sistema SuperPAES sin Supabase
"""

import requests
import json
from datetime import datetime

def main():
    print("🚀 VERIFICACIÓN SISTEMA SUPERPAES")
    print("=" * 40)
    
    # Probar backend
    try:
        response = requests.get("http://localhost:5000/api/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend Flask: FUNCIONAL")
        else:
            print("❌ Backend Flask: PROBLEMAS")
    except:
        print("❌ Backend Flask: NO ACCESIBLE")
    
    # Probar ejercicios
    try:
        response = requests.get("http://localhost:5000/api/exercises", timeout=5)
        if response.status_code == 200:
            data = response.json()
            exercises = data.get('exercises', [])
            print(f"✅ Ejercicios PAES: {len(exercises)} cargados")
        else:
            print("❌ Ejercicios PAES: ERROR")
    except:
        print("❌ Ejercicios PAES: NO ACCESIBLE")
    
    # Probar frontend
    try:
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend React: ACCESIBLE")
        else:
            print("❌ Frontend React: PROBLEMAS")
    except:
        print("❌ Frontend React: NO ACCESIBLE")
    
    print("=" * 40)
    print("🎯 Sistema centralizado en Backend Flask")

if __name__ == "__main__":
    main()
