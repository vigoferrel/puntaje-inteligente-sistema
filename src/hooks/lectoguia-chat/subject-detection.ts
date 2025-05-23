
/**
 * Mapeo de materias para mostrar nombres amigables
 */
export const subjectNames: Record<string, string> = {
  'general': 'Contenido General',
  'lectura': 'Comprensión Lectora',
  'matematicas': 'Matemáticas',
  'ciencias': 'Ciencias',
  'historia': 'Historia y Ciencias Sociales'
};

/**
 * Palabras clave para detectar materias en mensajes
 */
const subjectKeywords: Record<string, string[]> = {
  'lectura': [
    'comprensión', 'lectora', 'lectura', 'texto', 'párrafo', 'libro', 'literatura',
    'inferir', 'interpretar', 'ensayo', 'obra', 'novela', 'cuento', 'poema',
    'narración', 'redacción', 'gramática', 'sintaxis', 'semántica'
  ],
  'matematicas': [
    'matemática', 'matemáticas', 'álgebra', 'geometría', 'ecuación', 'fracción',
    'número', 'cálculo', 'función', 'derivada', 'integral', 'estadística',
    'probabilidad', 'triángulo', 'círculo', 'volumen', 'área', 'perímetro'
  ],
  'ciencias': [
    'biología', 'química', 'física', 'átomo', 'molécula', 'célula', 'fuerza',
    'energía', 'masa', 'velocidad', 'aceleración', 'reacción', 'ácido', 'base',
    'gen', 'adn', 'ecosistema', 'organismo', 'bacteria', 'virus'
  ],
  'historia': [
    'historia', 'geografía', 'civilización', 'guerra', 'revolución', 'periodo',
    'sociedad', 'cultura', 'política', 'economía', 'mapa', 'continente', 
    'país', 'gobierno', 'democracia', 'ciudadanía', 'formación ciudadana'
  ]
};

/**
 * Detecta la materia más relevante en un mensaje
 * @param message Mensaje del usuario
 * @returns Código de la materia o null si no se detecta
 */
export function detectSubjectFromMessage(message: string): string | null {
  if (!message || typeof message !== 'string') return null;
  
  // Normalizar el texto para búsqueda (minúsculas, sin acentos)
  const normalizedMessage = message.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // Puntuaciones para cada materia
  const scores: Record<string, number> = {
    'lectura': 0,
    'matematicas': 0,
    'ciencias': 0,
    'historia': 0
  };
  
  // Calcular puntuaciones basadas en palabras clave
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    for (const keyword of keywords) {
      if (normalizedMessage.includes(keyword.toLowerCase())) {
        scores[subject] += 1;
      }
    }
  }
  
  // Encontrar la materia con mayor puntuación
  let maxScore = 0;
  let detectedSubject: string | null = null;
  
  for (const [subject, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedSubject = subject;
    }
  }
  
  // Solo retornar la materia si la puntuación supera un umbral
  return maxScore >= 2 ? detectedSubject : null;
}
