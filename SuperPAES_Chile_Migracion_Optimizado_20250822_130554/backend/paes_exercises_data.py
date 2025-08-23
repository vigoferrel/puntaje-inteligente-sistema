#!/usr/bin/env python3
"""
Datos reales de ejercicios PAES para poblar el sistema
Basado en contenido oficial MINEDUC
"""

PAES_EXERCISES_DATA = [
    # ========================================
    # MATEMÁTICA M1 - ECUACIONES Y FUNCIONES
    # ========================================
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
        'tags': ['ecuaciones', 'primer_grado', 'álgebra']
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
        'tags': ['sistemas', 'ecuaciones', 'álgebra']
    },
    {
        'id': '3',
        'subject': 'Matemática M1',
        'topic': 'Funciones cuadráticas',
        'question': '¿Cuál es el vértice de la función f(x) = x² - 4x + 3?',
        'options': ['(2, -1)', '(2, 1)', '(-2, -1)', '(-2, 1)'],
        'correct_answer': '(2, -1)',
        'explanation': 'El vértice se encuentra en x = -b/(2a) = 4/(2*1) = 2, y f(2) = 4 - 8 + 3 = -1',
        'difficulty': 'Difícil',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'f(x) = x^2 - 4x + 3',
        'explanation_formula': 'V = (2, -1)',
        'points': 20,
        'tags': ['funciones', 'cuadráticas', 'vértice']
    },
    
    # ========================================
    # MATEMÁTICA M2 - GEOMETRÍA Y TRIGONOMETRÍA
    # ========================================
    {
        'id': '4',
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
        'tags': ['geometría', 'pitágoras', 'triángulos']
    },
    {
        'id': '5',
        'subject': 'Matemática M2',
        'topic': 'Razones trigonométricas',
        'question': 'En un triángulo rectángulo, si sen(θ) = 3/5, ¿cuál es el valor de cos(θ)?',
        'options': ['4/5', '3/4', '5/4', '4/3'],
        'correct_answer': '4/5',
        'explanation': 'Si sen(θ) = 3/5, entonces cos(θ) = √(1 - sen²(θ)) = √(1 - 9/25) = √(16/25) = 4/5',
        'difficulty': 'Medio',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'sen²(θ) + cos²(θ) = 1',
        'explanation_formula': 'cos(θ) = √(1 - (3/5)²) = 4/5',
        'points': 15,
        'tags': ['trigonometría', 'razones', 'identidades']
    },
    
    # ========================================
    # COMPETENCIA LECTORA
    # ========================================
    {
        'id': '6',
        'subject': 'Competencia Lectora',
        'topic': 'Comprensión de lectura',
        'question': '¿Cuál es la idea principal del texto?',
        'options': ['La tecnología ha revolucionado la educación', 'Los estudiantes prefieren métodos tradicionales', 'La educación debe adaptarse a los cambios', 'Los profesores resisten la innovación'],
        'correct_answer': 'La tecnología ha revolucionado la educación',
        'explanation': 'El texto enfatiza cómo la tecnología ha transformado fundamentalmente los métodos educativos y la forma en que los estudiantes aprenden.',
        'difficulty': 'Medio',
        'bloom_level': 'COMPRENDER',
        'is_active': True,
        'context_text': 'La revolución tecnológica ha transformado radicalmente el panorama educativo. Las aulas tradicionales han dado paso a entornos digitales donde los estudiantes pueden acceder a información ilimitada, colaborar en tiempo real y desarrollar habilidades críticas para el siglo XXI. Esta transformación no solo ha cambiado cómo enseñamos, sino también cómo aprendemos.',
        'context_image': None,
        'context_formula': None,
        'explanation_formula': None,
        'points': 15,
        'tags': ['comprensión', 'idea_principal', 'tecnología']
    },
    {
        'id': '7',
        'subject': 'Competencia Lectora',
        'topic': 'Inferencia',
        'question': 'Basándose en el texto, ¿qué se puede inferir sobre el futuro de la educación?',
        'options': ['Volverá a métodos tradicionales', 'Se volverá completamente virtual', 'Integrará tecnología y métodos tradicionales', 'Eliminará la figura del profesor'],
        'correct_answer': 'Integrará tecnología y métodos tradicionales',
        'explanation': 'El texto sugiere una evolución que combina lo mejor de ambos enfoques, no una sustitución completa.',
        'difficulty': 'Difícil',
        'bloom_level': 'ANALIZAR',
        'is_active': True,
        'context_text': 'La educación del futuro no será completamente digital ni completamente tradicional. Los expertos predicen un modelo híbrido que combine la calidez humana del aprendizaje presencial con la eficiencia y personalización que ofrecen las herramientas tecnológicas. Esta integración permitirá atender las necesidades individuales de cada estudiante.',
        'context_image': None,
        'context_formula': None,
        'explanation_formula': None,
        'points': 20,
        'tags': ['inferencia', 'futuro', 'modelo_híbrido']
    },
    
    # ========================================
    # CIENCIAS - FÍSICA
    # ========================================
    {
        'id': '8',
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
        'tags': ['física', 'movimiento', 'velocidad']
    },
    {
        'id': '9',
        'subject': 'Ciencias',
        'topic': 'Física - Energía',
        'question': '¿Cuál es la fórmula para la energía cinética?',
        'options': ['Ec = mgh', 'Ec = ½mv²', 'Ec = mv', 'Ec = mgh + ½mv²'],
        'correct_answer': 'Ec = ½mv²',
        'explanation': 'La energía cinética se calcula como la mitad del producto de la masa por el cuadrado de la velocidad',
        'difficulty': 'Medio',
        'bloom_level': 'RECORDAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'E_c = \\frac{1}{2}mv^2',
        'explanation_formula': 'Ec = ½mv²',
        'points': 15,
        'tags': ['física', 'energía', 'cinética']
    },
    
    # ========================================
    # HISTORIA Y CIENCIAS SOCIALES
    # ========================================
    {
        'id': '10',
        'subject': 'Historia y Ciencias Sociales',
        'topic': 'Historia de Chile',
        'question': '¿En qué año se declaró la independencia de Chile?',
        'options': ['1810', '1818', '1820', '1825'],
        'correct_answer': '1818',
        'explanation': 'Chile declaró su independencia el 12 de febrero de 1818',
        'difficulty': 'Fácil',
        'bloom_level': 'RECORDAR',
        'is_active': True,
        'context_text': 'La independencia de Chile fue un proceso histórico que comenzó con la Primera Junta Nacional de Gobierno en 1810 y culminó con la declaración formal de independencia en 1818.',
        'context_image': None,
        'context_formula': None,
        'explanation_formula': None,
        'points': 10,
        'tags': ['historia', 'chile', 'independencia']
    },
    {
        'id': '11',
        'subject': 'Historia y Ciencias Sociales',
        'topic': 'Geografía de Chile',
        'question': '¿Cuál es el clima predominante en la zona central de Chile?',
        'options': ['Desértico', 'Mediterráneo', 'Tropical', 'Polar'],
        'correct_answer': 'Mediterráneo',
        'explanation': 'La zona central de Chile presenta un clima mediterráneo con veranos secos y calurosos e inviernos lluviosos',
        'difficulty': 'Medio',
        'bloom_level': 'RECORDAR',
        'is_active': True,
        'context_text': 'Chile presenta una gran diversidad climática debido a su extensión latitudinal. La zona central, donde se concentra la mayor parte de la población, presenta características climáticas mediterráneas.',
        'context_image': None,
        'context_formula': None,
        'explanation_formula': None,
        'points': 10,
        'tags': ['geografía', 'clima', 'zona_central']
    },
    
    # ========================================
    # EJERCICIOS AVANZADOS
    # ========================================
    {
        'id': '12',
        'subject': 'Matemática M1',
        'topic': 'Logaritmos',
        'question': 'Resuelve: log₂(8) + log₂(4)',
        'options': ['5', '6', '7', '8'],
        'correct_answer': '5',
        'explanation': 'log₂(8) = 3 y log₂(4) = 2, entonces 3 + 2 = 5',
        'difficulty': 'Difícil',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': 'log₂(8) + log₂(4)',
        'explanation_formula': 'log₂(8) = 3\nlog₂(4) = 2\n3 + 2 = 5',
        'points': 20,
        'tags': ['logaritmos', 'álgebra', 'propiedades']
    },
    {
        'id': '13',
        'subject': 'Matemática M2',
        'topic': 'Geometría analítica',
        'question': '¿Cuál es la ecuación de la circunferencia con centro en (2,3) y radio 4?',
        'options': ['(x-2)² + (y-3)² = 16', '(x+2)² + (y+3)² = 16', '(x-2)² + (y-3)² = 4', '(x+2)² + (y+3)² = 4'],
        'correct_answer': '(x-2)² + (y-3)² = 16',
        'explanation': 'La ecuación de una circunferencia es (x-h)² + (y-k)² = r², donde (h,k) es el centro y r es el radio',
        'difficulty': 'Difícil',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': '(x-h)² + (y-k)² = r²',
        'explanation_formula': '(x-2)² + (y-3)² = 4² = 16',
        'points': 20,
        'tags': ['geometría', 'circunferencia', 'analítica']
    },
    {
        'id': '14',
        'subject': 'Ciencias',
        'topic': 'Química - Estequiometría',
        'question': '¿Cuántos gramos de H₂O se producen al reaccionar 2 moles de H₂ con 1 mol de O₂?',
        'options': ['18 g', '36 g', '54 g', '72 g'],
        'correct_answer': '36 g',
        'explanation': '2H₂ + O₂ → 2H₂O. Con 2 moles de H₂ se producen 2 moles de H₂O = 2 × 18 g = 36 g',
        'difficulty': 'Difícil',
        'bloom_level': 'APLICAR',
        'is_active': True,
        'context_text': None,
        'context_image': None,
        'context_formula': '2H₂ + O₂ → 2H₂O',
        'explanation_formula': '2 moles H₂O × 18 g/mol = 36 g',
        'points': 25,
        'tags': ['química', 'estequiometría', 'reacciones']
    },
    {
        'id': '15',
        'subject': 'Competencia Lectora',
        'topic': 'Análisis crítico',
        'question': '¿Qué tipo de argumento utiliza el autor en el texto?',
        'options': ['Argumento de autoridad', 'Argumento por analogía', 'Argumento inductivo', 'Argumento deductivo'],
        'correct_answer': 'Argumento inductivo',
        'explanation': 'El autor presenta ejemplos específicos para llegar a una conclusión general sobre el impacto de la tecnología.',
        'difficulty': 'Difícil',
        'bloom_level': 'EVALUAR',
        'is_active': True,
        'context_text': 'Estudios recientes muestran que el uso de tablets en las aulas ha aumentado la participación de los estudiantes en un 40%. Investigaciones en escuelas rurales indican mejoras significativas en los resultados de matemáticas. Los datos de colegios urbanos confirman esta tendencia positiva. Por tanto, la tecnología educativa está transformando positivamente el aprendizaje.',
        'context_image': None,
        'context_formula': None,
        'explanation_formula': None,
        'points': 25,
        'tags': ['análisis', 'argumentos', 'crítico']
    }
]

# Estadísticas de los ejercicios
EXERCISE_STATS = {
    'total_exercises': len(PAES_EXERCISES_DATA),
    'by_subject': {
        'Matemática M1': len([e for e in PAES_EXERCISES_DATA if e['subject'] == 'Matemática M1']),
        'Matemática M2': len([e for e in PAES_EXERCISES_DATA if e['subject'] == 'Matemática M2']),
        'Competencia Lectora': len([e for e in PAES_EXERCISES_DATA if e['subject'] == 'Competencia Lectora']),
        'Ciencias': len([e for e in PAES_EXERCISES_DATA if e['subject'] == 'Ciencias']),
        'Historia y Ciencias Sociales': len([e for e in PAES_EXERCISES_DATA if e['subject'] == 'Historia y Ciencias Sociales'])
    },
    'by_difficulty': {
        'Fácil': len([e for e in PAES_EXERCISES_DATA if e['difficulty'] == 'Fácil']),
        'Medio': len([e for e in PAES_EXERCISES_DATA if e['difficulty'] == 'Medio']),
        'Difícil': len([e for e in PAES_EXERCISES_DATA if e['difficulty'] == 'Difícil'])
    },
    'by_bloom_level': {
        'RECORDAR': len([e for e in PAES_EXERCISES_DATA if e['bloom_level'] == 'RECORDAR']),
        'COMPRENDER': len([e for e in PAES_EXERCISES_DATA if e['bloom_level'] == 'COMPRENDER']),
        'APLICAR': len([e for e in PAES_EXERCISES_DATA if e['bloom_level'] == 'APLICAR']),
        'ANALIZAR': len([e for e in PAES_EXERCISES_DATA if e['bloom_level'] == 'ANALIZAR']),
        'EVALUAR': len([e for e in PAES_EXERCISES_DATA if e['bloom_level'] == 'EVALUAR']),
        'CREAR': len([e for e in PAES_EXERCISES_DATA if e['bloom_level'] == 'CREAR'])
    }
}
