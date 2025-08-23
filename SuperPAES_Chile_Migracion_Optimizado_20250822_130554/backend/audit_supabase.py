#!/usr/bin/env python3
"""
Auditoría de Supabase para SuperPAES
"""

import requests
import json

SUPABASE_URL = "https://settifboilityelprvjd.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ"

headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json'
}

def check_table(table_name):
    """Verificar si una tabla existe y contar registros"""
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/{table_name}?select=*", headers=headers)
        if response.status_code == 200:
            data = response.json()
            return len(data), data[:3] if data else []
        else:
            return 0, []
    except:
        return 0, []

def main():
    print("🔍 AUDITORÍA SUPABASE SUPERPAES")
    print("=" * 50)
    
    tables = [
        'exercises', 'quantum_nodes', 'ai_sessions', 'user_profiles',
        'learning_activities', 'cache_metrics', 'paes_goals', 'spotify_playlists'
    ]
    
    for table in tables:
        count, sample = check_table(table)
        print(f"\n📋 {table.upper()}: {count} registros")
        if sample:
            print(f"   Muestra: {sample[0].keys() if sample else 'Sin datos'}")

if __name__ == "__main__":
    main()
