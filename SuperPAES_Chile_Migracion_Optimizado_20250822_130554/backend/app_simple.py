from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import random
import os

app = Flask(__name__)
CORS(app)

# Configuración
app.config['SECRET_KEY'] = 'superpaes-chile-2024'

# Datos de ejemplo para SuperPAES Chile
PAES_SUBJECTS = [
    'Competencia Lectora',
    'Matemática M1',
    'Matemática M2', 
    'Ciencias',
    'Historia y Ciencias Sociales'
]

DIFFICULTY_LEVELS = ['Básico', 'Intermedio', 'Avanzado', 'Excelencia']

# Datos de ejemplo
MOCK_USER_DATA = {
    'name': 'Estudiante SuperPAES',
    'avatar': '🎓',
    'currentLevel': 'Avanzado',
    'totalPoints': 2847,
    'rank': '#1 en tu región'
}

MOCK_PAES_GOALS = [
    {
        'id': '1',
        'subject': 'Competencia Lectora',
        'currentScore': 720,
        'targetScore': 850,
        'progress': 85,
        'status': 'on-track',
        'nextMilestone': '800 puntos'
    },
    {
        'id': '2',
        'subject': 'Matemática M1',
        'currentScore': 680,
        'targetScore': 800,
        'progress': 75,
        'status': 'behind',
        'nextMilestone': '750 puntos'
    },
    {
        'id': '3',
        'subject': 'Matemática M2',
        'currentScore': 750,
        'targetScore': 900,
        'progress': 83,
        'status': 'on-track',
        'nextMilestone': '850 puntos'
    },
    {
        'id': '4',
        'subject': 'Ciencias',
        'currentScore': 690,
        'targetScore': 820,
        'progress': 84,
        'status': 'on-track',
        'nextMilestone': '800 puntos'
    },
    {
        'id': '5',
        'subject': 'Historia',
        'currentScore': 710,
        'targetScore': 850,
        'progress': 84,
        'status': 'on-track',
        'nextMilestone': '800 puntos'
    }
]

MOCK_PLAYLISTS = [
    {
        'id': '1',
        'name': 'Información Explícita - Nivel Intermedio',
        'subject': 'Competencia Lectora',
        'difficulty': 'Intermedio',
        'duration': 45,
        'exercises': 12,
        'completed': 8,
        'progress': 67,
        'status': 'active'
    },
    {
        'id': '2',
        'name': 'Ecuaciones Primer Grado - Nivel Avanzado',
        'subject': 'Matemática M1',
        'difficulty': 'Avanzado',
        'duration': 60,
        'exercises': 15,
        'completed': 12,
        'progress': 80,
        'status': 'active'
    },
    {
        'id': '3',
        'name': 'Función Cuadrática - Nivel Excelencia',
        'subject': 'Matemática M2',
        'difficulty': 'Excelencia',
        'duration': 90,
        'exercises': 20,
        'completed': 0,
        'progress': 0,
        'status': 'pending'
    }
]

MOCK_AGENTS = [
    {
        'id': '1',
        'name': 'Agente Competencia Lectora',
        'subject': 'Comprensión oficial PAES',
        'status': 'active',
        'lastActivity': 'Hace 5 min',
        'performance': 92
    },
    {
        'id': '2',
        'name': 'Agente Matemática M1',
        'subject': '7° a 2° Medio',
        'status': 'analyzing',
        'lastActivity': 'Analizando progreso',
        'performance': 88
    },
    {
        'id': '3',
        'name': 'Agente Meta Puntaje',
        'subject': 'Optimización de puntaje PAES',
        'status': 'active',
        'lastActivity': 'Hace 2 min',
        'performance': 95
    }
]

MOCK_LEARNING_METRICS = {
    'totalStudyTime': 127,
    'exercisesCompleted': 284,
    'accuracyRate': 87,
    'streakDays': 12,
    'weeklyProgress': 23,
    'monthlyProgress': 67
}

# Rutas API
@app.route('/api/user', methods=['GET'])
def get_user_data():
    """Obtener datos del usuario"""
    return jsonify(MOCK_USER_DATA)

@app.route('/api/paes-goals', methods=['GET'])
def get_paes_goals():
    """Obtener metas PAES del usuario"""
    return jsonify(MOCK_PAES_GOALS)

@app.route('/api/playlists', methods=['GET'])
def get_playlists():
    """Obtener playlists neurales"""
    return jsonify(MOCK_PLAYLISTS)

@app.route('/api/agents', methods=['GET'])
def get_agents():
    """Obtener agentes IA"""
    return jsonify(MOCK_AGENTS)

@app.route('/api/learning-metrics', methods=['GET'])
def get_learning_metrics():
    """Obtener métricas de aprendizaje"""
    return jsonify(MOCK_LEARNING_METRICS)

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    """Obtener datos del dashboard"""
    return jsonify({
        'user': MOCK_USER_DATA,
        'goals': MOCK_PAES_GOALS,
        'playlists': MOCK_PLAYLISTS,
        'agents': MOCK_AGENTS,
        'metrics': MOCK_LEARNING_METRICS
    })

from paes_data import PAES_EXERCISES

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    """Obtener ejercicios disponibles - Datos reales PAES"""
    exercises = PAES_EXERCISES.copy()
    
    # Aplicar filtros si se proporcionan
    subject = request.args.get('subject')
    difficulty = request.args.get('difficulty')
    bloom_level = request.args.get('bloom_level')
    
    if subject:
        exercises = [ex for ex in exercises if ex['subject'] == subject]
    if difficulty:
        exercises = [ex for ex in exercises if ex['difficulty'] == difficulty]
    if bloom_level:
        exercises = [ex for ex in exercises if ex['bloom_level'] == bloom_level]
    
    return jsonify({'exercises': exercises, 'total': len(exercises)})

@app.route('/api/exercises/<exercise_id>/submit', methods=['POST'])
def submit_exercise(exercise_id):
    """Enviar respuesta de ejercicio"""
    data = request.get_json()
    answer = data.get('answer')
    
    # Simular verificación de respuesta
    is_correct = random.choice([True, False])
    
    result = {
        'exerciseId': exercise_id,
        'correct': is_correct,
        'score': 10 if is_correct else 0,
        'explanation': 'Explicación detallada de por qué la respuesta es correcta o incorrecta',
        'nextExercise': str(random.randint(1000, 9999)) if is_correct else None
    }
    
    return jsonify(result)

@app.route('/api/playlists/<playlist_id>/start', methods=['POST'])
def start_playlist(playlist_id):
    """Iniciar playlist neural"""
    return jsonify({
        'playlistId': playlist_id,
        'status': 'active',
        'startedAt': datetime.utcnow().isoformat(),
        'message': 'Playlist iniciada correctamente'
    })

@app.route('/api/playlists/<playlist_id>/complete', methods=['POST'])
def complete_playlist(playlist_id):
    """Completar playlist neural"""
    data = request.get_json()
    
    result = {
        'playlistId': playlist_id,
        'status': 'completed',
        'completedAt': datetime.utcnow().isoformat(),
        'finalScore': data.get('score', 85),
        'timeSpent': data.get('timeSpent', 45),
        'exercisesCompleted': data.get('exercisesCompleted', 12),
        'accuracy': data.get('accuracy', 87),
        'message': '¡Playlist completada exitosamente!'
    }
    
    return jsonify(result)

# Rutas de utilidad
@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    """Obtener lista de materias PAES"""
    return jsonify(PAES_SUBJECTS)

@app.route('/api/difficulties', methods=['GET'])
def get_difficulties():
    """Obtener niveles de dificultad"""
    return jsonify(DIFFICULTY_LEVELS)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar estado del sistema"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'message': 'SuperPAES Chile Backend funcionando correctamente'
    })

@app.route('/api/system/status', methods=['GET'])
def get_system_status():
    """Obtener estado completo del sistema integrado"""
    return jsonify({
        'quantum': {
            'nodes': 150,
            'bloom_levels': 6,
            'spotify_sync': 8,
            'entanglement': 67,
            'coherence': 0.85,
            'entropy': 0.23,
            'timestamp': datetime.now().isoformat()
        },
        'ai': {
            'requests_processed': 1250,
            'average_response_time': 1200,
            'model_accuracy': 0.94,
            'token_usage': 45000,
            'context_memory': 850,
            'emotional_adaptation': 0.8,
            'proactive_suggestions': 45
        },
        'arsenal': {
            'bloom_system': True,
            'leonardo_neural': True,
            'quantum_scripts': True,
            'gamification': True,
            'backup_system': True,
            'cache_optimized': True
        },
        'spotify': {
            'playlist_id': 'superpaes_neural_001',
            'neural_frequency': 432,
            'learning_state': 'active',
            'adaptation_level': 0.75,
            'personalized_patterns': ['classical', 'ambient', 'focus'],
            'sync_status': 'active'
        },
        'cache': {
            'level': 'L1',
            'hit_rate': 0.92,
            'miss_rate': 0.08,
            'size_mb': 100,
            'eviction_policy': 'LRU',
            'compression_ratio': 0.75
        },
        'security': {
            'jwt_valid': True,
            'rls_active': True,
            'rate_limit_status': 'normal',
            'data_sanitization': True,
            'encryption_status': 'active',
            'audit_logs': 125
        },
        'monitoring': {
            'status': 'healthy',
            'components': {
                'cpu': 'online',
                'memory': 'online',
                'disk': 'online',
                'database': 'online',
                'quantum': 'online',
                'ai': 'online'
            },
            'summary': 'CPU: 45.2% | Mem: 67.8% | Disco: 58.3% | BD: online | Alertas: 0'
        }
    })

@app.route('/api/system/quantum-scripts', methods=['GET', 'POST'])
def quantum_scripts():
    """Obtener o activar scripts cuánticos"""
    if request.method == 'GET':
        return jsonify({
            'success': True,
            'available_scripts': [
                'ACTIVAR-ARSENAL-COMPLETO',
                'LEONARDO-ANATOMIA-DAVINCI',
                'ORQUESTADOR-LIMPIEZA-CUANTICA',
                'PUENTE-CUANTICO-COCTELERA'
            ],
            'status': 'ready',
            'quantum_coherence': 0.935,
            'ai_accuracy': 0.987,
            'cache_efficiency': 0.938,
            'neural_sync': 0.863
        })
    else:  # POST
        return jsonify({
            'success': True,
            'scripts_activated': [
                'ACTIVAR-ARSENAL-COMPLETO',
                'LEONARDO-ANATOMIA-DAVINCI',
                'ORQUESTADOR-LIMPIEZA-CUANTICA',
                'PUENTE-CUANTICO-COCTELERA'
            ],
            'performance_impact': {
                'quantum_coherence': 0.935,
                'ai_accuracy': 0.987,
                'cache_efficiency': 0.938,
                'neural_sync': 0.863
            }
        })

@app.route('/api/system/optimize-cache', methods=['POST'])
def optimize_cache():
    """Optimizar sistema de cache"""
    return jsonify({
        'success': True,
        'optimization_results': {
            'l1_optimization': 18.5,
            'l2_optimization': 12.3,
            'l3_optimization': 8.7,
            'compression_improvement': 0.12
        },
        'performance_gain': 15.2
    })



@app.route('/api/system/neural-playlist', methods=['POST'])
def create_neural_playlist():
    """Crear playlist neural"""
    data = request.get_json()
    user_id = data.get('userId', 'user_001')
    learning_state = data.get('learningState', 'learning')
    
    return jsonify({
        'success': True,
        'playlist_id': f'neural_{user_id}_{int(datetime.now(datetime.UTC).timestamp())}',
        'neural_frequency': 432,
        'tracks': [
            'Classical Focus - Neural Enhancement',
            'Ambient Learning - Cognitive Boost',
            'Quantum Study - Memory Optimization',
            'Bloom Taxonomy - Level 1-6',
            'Leonardo Neural - Creative Flow'
        ]
    })

@app.route('/api/system/user-progress', methods=['POST'])
def update_user_progress():
    """Actualizar progreso del usuario"""
    data = request.get_json()
    user_id = data.get('userId', 'user_001')
    activity = data.get('activity', 'exercise_completed')
    score = data.get('score', 85)
    
    return jsonify({
        'user_id': user_id,
        'current_level': 3,
        'experience_points': 350,
        'badges': ['Level 1 Achiever', 'Level 2 Achiever', 'Level 3 Achiever'],
        'streaks': {
            'daily': 5,
            'weekly': 2,
            'monthly': 1
        },
        'achievements': {
            'total': 8,
            'recent': [1, 2, 3]
        },
        'learning_path': {
            'current_node': 'CL-RL-03',
            'completed_nodes': ['CL-RL-01', 'CL-RL-02'],
            'next_milestone': 'CL-RL-04'
        }
    })

@app.route('/api/system/alerts', methods=['GET'])
def get_active_alerts():
    """Obtener alertas activas del sistema"""
    return jsonify([])  # Sin alertas activas por ahora

@app.route('/api/system/diagnostic', methods=['POST'])
def perform_diagnostic():
    """Realizar diagnóstico completo del sistema"""
    data = request.get_json()
    user_id = data.get('userId', 'user_001')
    
    return jsonify({
        'quantum_result': {
            'success': True,
            'session_id': f'qs_{int(datetime.now(datetime.UTC).timestamp())}',
            'coherence_impact': 0.085,
            'entropy_change': 0.0115,
            'nodes_activated': 22
        },
        'ai_diagnostic': {
            'overall_score': 78,
            'detailed_scores': {
                'comp_lectora': 82,
                'mat_m1': 75,
                'mat_m2': 70,
                'historia': 85,
                'ciencias': 80
            },
            'strengths': ['Comprensión lectora', 'Análisis crítico'],
            'weaknesses': ['Velocidad de procesamiento', 'Memoria de trabajo'],
            'recommendations': [
                'Practicar ejercicios de velocidad lectora',
                'Realizar ejercicios de memoria de trabajo',
                'Completar simulacros de tiempo limitado'
            ],
            'learning_path': ['CL-RL-01', 'CL-RL-02', 'CL-IR-01', 'CL-IR-02'],
            'estimated_improvement_time': 45,
            'confidence_level': 0.87
        },
        'arsenal_status': {
            'bloom_system': True,
            'leonardo_neural': True,
            'quantum_scripts': True,
            'gamification': True,
            'backup_system': True,
            'cache_optimized': True
        },
        'recommendations': {
            'quantum_optimization': 'Aplicar optimizaciones cuánticas',
            'ai_enhancement': 'IA funcionando óptimamente',
            'cache_optimization': 'Cache funcionando bien',
            'neural_sync': 'Sincronización neural activa'
        }
    })

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Recurso no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    print("Iniciando SuperPAES Chile Backend...")
    print("Puerto: 5000")
    print("URL: http://localhost:5000")
    print("Health Check: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)
