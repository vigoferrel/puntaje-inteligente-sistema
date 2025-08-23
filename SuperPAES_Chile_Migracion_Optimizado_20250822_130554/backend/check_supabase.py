#!/usr/bin/env python3
"""
Verificación simple de Supabase
"""

import requests

SUPABASE_URL = "https://settifboilityelprvjd.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ"

headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json'
}

def main():
    print("🔍 VERIFICANDO SUPABASE...")
    
    # Verificar ejercicios
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/exercises?select=*", headers=headers)
        if response.status_code == 200:
            exercises = response.json()
            print(f"✅ EXERCISES: {len(exercises)} registros")
            if exercises:
                print(f"   Primer ejercicio: {exercises[0].get('subject', 'N/A')} - {exercises[0].get('topic', 'N/A')}")
        else:
            print(f"❌ EXERCISES: Error {response.status_code}")
    except Exception as e:
        print(f"❌ EXERCISES: {e}")
    
    # Verificar quantum_nodes
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/quantum_nodes?select=*", headers=headers)
        if response.status_code == 200:
            nodes = response.json()
            print(f"✅ QUANTUM_NODES: {len(nodes)} registros")
        else:
            print(f"❌ QUANTUM_NODES: Error {response.status_code}")
    except Exception as e:
        print(f"❌ QUANTUM_NODES: {e}")

if __name__ == "__main__":
    main()
