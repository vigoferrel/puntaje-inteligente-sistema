from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import json
import random
import os
from typing import Dict, List, Any

app = Flask(__name__)
CORS(app)

# Configuración
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///superpaes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'superpaes-chile-2024'

db = SQLAlchemy(app)

# Modelos de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    current_level = db.Column(db.String(50), default='Intermedio')
    total_points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    goals = db.relationship('PAESGoal', backref='user', lazy=True)
    playlists = db.relationship('SpotifyPlaylist', backref='user', lazy=True)
    activities = db.relationship('LearningActivity', backref='user', lazy=True)

class PAESGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    current_score = db.Column(db.Integer, nullable=False)
    target_score = db.Column(db.Integer, nullable=False)
    progress = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='on-track')
    next_milestone = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SpotifyPlaylist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, default=0)
    exercises = db.Column(db.Integer, default=0)
    completed = db.Column(db.Integer, default=0)
    progress = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LearningActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100))
    duration = db.Column(db.Integer, default=0)
    score = db.Column(db.Float, default=0.0)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='idle')
    performance = db.Column(db.Float, default=0.0)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)

# Datos de ejemplo para SuperPAES Chile
PAES_SUBJECTS = [
    'Competencia Lectora',
    'Matemática M1',
    'Matemática M2', 
    'Ciencias',
    'Historia y Ciencias Sociales'
]

DIFFICULTY_LEVELS = ['Básico', 'Intermedio', 'Avanzado', 'Excelencia']

PLAYLIST_TEMPLATES = {
    'Competencia Lectora': [
        'Información Explícita - Nivel Básico',
        'Información Explícita - Nivel Intermedio',
        'Inferencias Locales - Nivel Básico',
        'Inferencias Locales - Nivel Intermedio',
        'Evaluación de Argumentos - Nivel Avanzado'
    ],
    'Matemática M1': [
        'Números Enteros - Nivel Básico',
        'Números Enteros - Nivel Intermedio',
        'Ecuaciones Primer Grado - Nivel Básico',
        'Ecuaciones Primer Grado - Nivel Intermedio',
        'Teorema de Pitágoras - Nivel Básico'
    ],
    'Matemática M2': [
        'Función Cuadrática - Nivel Intermedio',
        'Función Cuadrática - Nivel Avanzado',
        'Vectores en el Plano - Nivel Avanzado',
        'Límites de Funciones - Nivel Excelencia'
    ],
    'Ciencias': [
        'Célula y Organización Biológica - Nivel Básico',
        'Célula y Organización Biológica - Nivel Intermedio',
        'Movimiento Rectilíneo Uniforme - Nivel Básico',
        'Estructura Atómica - Nivel Básico'
    ],
    'Historia y Ciencias Sociales': [
        'Chile Prehispánico - Nivel Básico',
        'Conquista y Colonia - Nivel Intermedio',
        'Revolución Industrial - Nivel Intermedio'
    ]
}

AGENT_TEMPLATES = [
    {
        'name': 'Agente Competencia Lectora',
        'subject': 'Comprensión oficial PAES',
        'status': 'active',
        'performance': 92
    },
    {
        'name': 'Agente Matemática M1',
        'subject': '7° a 2° Medio',
        'status': 'analyzing',
        'performance': 88
    },
    {
        'name': 'Agente Matemática M2',
        'subject': '3° y 4° Medio',
        'status': 'idle',
        'performance': 85
    },
    {
        'name': 'Agente Ciencias',
        'subject': 'Biología, Física, Química',
        'status': 'active',
        'performance': 90
    },
    {
        'name': 'Agente Historia',
        'subject': 'Historia de Chile y Universal',
        'status': 'idle',
        'performance': 87
    },
    {
        'name': 'Agente Meta Puntaje',
        'subject': 'Optimización de puntaje PAES',
        'status': 'active',
        'performance': 95
    }
]

# Rutas de la API
@app.route('/')
def index():
    return jsonify({
        'message': 'SuperPAES Chile API',
        'version': '1.0.0',
        'status': 'active',
        'description': 'API para el sistema educativo SuperPAES Chile'
    })

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """Obtener perfil del usuario"""
    # Simular datos de usuario
    profile = {
        'id': 1,
        'name': 'Estudiante SuperPAES',
        'avatar': '🎓',
        'currentLevel': 'Avanzado',
        'totalPoints': 2847,
        'rank': '#1 en tu región',
        'email': 'estudiante@superpaes.cl',
        'createdAt': datetime.utcnow().isoformat()
    }
    return jsonify(profile)

@app.route('/api/user/profile', methods=['PUT'])
def update_user_profile():
    """Actualizar perfil del usuario"""
    data = request.get_json()
    # Aquí se actualizaría en la base de datos
    return jsonify({'message': 'Perfil actualizado correctamente'})

@app.route('/api/goals', methods=['GET'])
def get_paes_goals():
    """Obtener metas PAES del usuario"""
    goals = [
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
            'subject': 'Historia y Ciencias Sociales',
            'currentScore': 710,
            'targetScore': 850,
            'progress': 84,
            'status': 'on-track',
            'nextMilestone': '800 puntos'
        }
    ]
    return jsonify(goals)

@app.route('/api/goals', methods=['POST'])
def create_paes_goal():
    """Crear nueva meta PAES"""
    data = request.get_json()
    # Validar datos
    required_fields = ['subject', 'targetScore']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Campo requerido: {field}'}), 400
    
    # Crear meta en la base de datos
    new_goal = {
        'id': str(random.randint(1000, 9999)),
        'subject': data['subject'],
        'currentScore': data.get('currentScore', 0),
        'targetScore': data['targetScore'],
        'progress': 0,
        'status': 'on-track',
        'nextMilestone': f"{data.get('currentScore', 0) + 50} puntos"
    }
    
    return jsonify(new_goal), 201

@app.route('/api/goals/<goal_id>', methods=['PUT'])
def update_paes_goal(goal_id):
    """Actualizar meta PAES"""
    data = request.get_json()
    # Aquí se actualizaría en la base de datos
    return jsonify({'message': 'Meta actualizada correctamente'})

@app.route('/api/playlists', methods=['GET'])
def get_spotify_playlists():
    """Obtener playlists neurales"""
    playlists = [
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
        },
        {
            'id': '4',
            'name': 'Célula y Organización Biológica - Nivel Básico',
            'subject': 'Ciencias',
            'difficulty': 'Básico',
            'duration': 30,
            'exercises': 10,
            'completed': 10,
            'progress': 100,
            'status': 'completed'
        }
    ]
    return jsonify(playlists)

@app.route('/api/playlists', methods=['POST'])
def create_spotify_playlist():
    """Crear nueva playlist neural"""
    data = request.get_json()
    
    new_playlist = {
        'id': str(random.randint(1000, 9999)),
        'name': data.get('name', 'Nueva Playlist'),
        'subject': data.get('subject', 'Competencia Lectora'),
        'difficulty': data.get('difficulty', 'Básico'),
        'duration': data.get('duration', 30),
        'exercises': data.get('exercises', 10),
        'completed': 0,
        'progress': 0,
        'status': 'pending'
    }
    
    return jsonify(new_playlist), 201

@app.route('/api/agents', methods=['GET'])
def get_agents():
    """Obtener agentes IA especializados"""
    agents = [
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
        },
        {
            'id': '4',
            'name': 'Agente Ciencias',
            'subject': 'Biología, Física, Química',
            'status': 'idle',
            'lastActivity': 'Hace 1 hora',
            'performance': 90
        },
        {
            'id': '5',
            'name': 'Agente Historia',
            'subject': 'Historia de Chile y Universal',
            'status': 'idle',
            'lastActivity': 'Hace 2 horas',
            'performance': 87
        }
    ]
    return jsonify(agents)

@app.route('/api/agents/<agent_id>/activate', methods=['POST'])
def activate_agent(agent_id):
    """Activar agente IA"""
    # Aquí se activaría el agente en la base de datos
    return jsonify({'message': f'Agente {agent_id} activado correctamente'})

@app.route('/api/analytics/learning-metrics', methods=['GET'])
def get_learning_metrics():
    """Obtener métricas de aprendizaje"""
    metrics = {
        'totalStudyTime': 127,
        'exercisesCompleted': 284,
        'accuracyRate': 87,
        'streakDays': 12,
        'weeklyProgress': 23,
        'monthlyProgress': 67,
        'currentWeek': {
            'monday': 2.5,
            'tuesday': 3.2,
            'wednesday': 1.8,
            'thursday': 4.1,
            'friday': 2.9,
            'saturday': 3.5,
            'sunday': 1.2
        },
        'subjectBreakdown': {
            'Competencia Lectora': 35,
            'Matemática M1': 25,
            'Matemática M2': 20,
            'Ciencias': 15,
            'Historia': 5
        }
    }
    return jsonify(metrics)

@app.route('/api/analytics/predictions', methods=['GET'])
def get_score_predictions():
    """Obtener predicciones de puntaje"""
    predictions = {
        'currentPrediction': 847,
        'confidence': 89,
        'factors': {
            'studyTime': 'positive',
            'accuracy': 'positive',
            'consistency': 'positive',
            'difficulty': 'neutral'
        },
        'recommendations': [
            'Aumentar tiempo de estudio en Matemática M1',
            'Practicar más ejercicios de nivel avanzado',
            'Mantener consistencia en el estudio diario'
        ]
    }
    return jsonify(predictions)

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """Obtener notificaciones"""
    notifications = [
        {
            'id': 1,
            'type': 'achievement',
            'title': '¡Nuevo logro desbloqueado!',
            'message': 'Has completado 10 ejercicios de Competencia Lectora',
            'timestamp': datetime.utcnow().isoformat(),
            'read': False
        },
        {
            'id': 2,
            'type': 'progress',
            'title': 'Progreso destacado',
            'message': 'Tu puntaje en Matemática M1 aumentó 15 puntos',
            'timestamp': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
            'read': False
        },
        {
            'id': 3,
            'type': 'reminder',
            'title': 'Recordatorio de estudio',
            'message': 'Tienes una playlist pendiente de Ciencias',
            'timestamp': (datetime.utcnow() - timedelta(hours=4)).isoformat(),
            'read': True
        }
    ]
    return jsonify(notifications)

@app.route('/api/calendar/events', methods=['GET'])
def get_calendar_events():
    """Obtener eventos del calendario"""
    events = [
        {
            'id': 1,
            'title': 'Ejercicio Competencia Lectora',
            'type': 'exercise',
            'startTime': (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            'endTime': (datetime.utcnow() + timedelta(hours=1, minutes=30)).isoformat(),
            'subject': 'Competencia Lectora',
            'difficulty': 'Intermedio'
        },
        {
            'id': 2,
            'title': 'Playlist Matemática M1',
            'type': 'playlist',
            'startTime': (datetime.utcnow() + timedelta(hours=3)).isoformat(),
            'endTime': (datetime.utcnow() + timedelta(hours=4)).isoformat(),
            'subject': 'Matemática M1',
            'difficulty': 'Avanzado'
        }
    ]
    return jsonify(events)

@app.route('/api/diagnostic/start', methods=['POST'])
def start_diagnostic():
    """Iniciar diagnóstico PAES"""
    data = request.get_json()
    subject = data.get('subject', 'Competencia Lectora')
    
    diagnostic = {
        'id': str(random.randint(1000, 9999)),
        'subject': subject,
        'status': 'in_progress',
        'questions': [
            {
                'id': 1,
                'text': 'Pregunta de diagnóstico 1',
                'type': 'multiple_choice',
                'options': ['A', 'B', 'C', 'D'],
                'difficulty': 'intermediate'
            },
            {
                'id': 2,
                'text': 'Pregunta de diagnóstico 2',
                'type': 'multiple_choice',
                'options': ['A', 'B', 'C', 'D'],
                'difficulty': 'advanced'
            }
        ],
        'estimatedDuration': 30,
        'createdAt': datetime.utcnow().isoformat()
    }
    
    return jsonify(diagnostic)

@app.route('/api/diagnostic/<diagnostic_id>/submit', methods=['POST'])
def submit_diagnostic(diagnostic_id):
    """Enviar respuestas del diagnóstico"""
    data = request.get_json()
    
    # Simular análisis de respuestas
    results = {
        'diagnosticId': diagnostic_id,
        'score': random.randint(60, 95),
        'level': random.choice(['Básico', 'Intermedio', 'Avanzado']),
        'strengths': ['Comprensión de textos', 'Análisis crítico'],
        'weaknesses': ['Velocidad de lectura', 'Inferencias complejas'],
        'recommendations': [
            'Practicar ejercicios de velocidad de lectura',
            'Enfocarse en inferencias de nivel avanzado'
        ],
        'nextSteps': [
            'Completar playlist de nivel intermedio',
            'Realizar ejercicios de práctica diaria'
        ]
    }
    
    return jsonify(results)

@app.route('/api/exercises/generate', methods=['POST'])
def generate_exercises():
    """Generar ejercicios personalizados"""
    data = request.get_json()
    subject = data.get('subject', 'Competencia Lectora')
    difficulty = data.get('difficulty', 'Intermedio')
    count = data.get('count', 5)
    
    exercises = []
    for i in range(count):
        exercise = {
            'id': str(random.randint(1000, 9999)),
            'subject': subject,
            'difficulty': difficulty,
            'type': 'multiple_choice',
            'question': f'Pregunta {i+1} de {subject} - Nivel {difficulty}',
            'options': ['A', 'B', 'C', 'D'],
            'correctAnswer': random.choice(['A', 'B', 'C', 'D']),
            'explanation': f'Explicación detallada de la respuesta correcta para la pregunta {i+1}',
            'estimatedTime': random.randint(2, 5)
        }
        exercises.append(exercise)
    
    return jsonify({
        'exercises': exercises,
        'totalTime': sum(ex['estimatedTime'] for ex in exercises),
        'difficulty': difficulty
    })

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
    # Aquí se iniciaría la playlist en la base de datos
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

@app.route('/api/playlist-templates', methods=['GET'])
def get_playlist_templates():
    """Obtener plantillas de playlists"""
    return jsonify(PLAYLIST_TEMPLATES)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar estado del sistema"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'database': 'connected'
    })

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Recurso no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

# Inicialización de la base de datos
def init_db():
    with app.app_context():
        db.create_all()
        
        # Crear datos de ejemplo si no existen
        if not Agent.query.first():
            for agent_data in AGENT_TEMPLATES:
                agent = Agent(**agent_data)
                db.session.add(agent)
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
