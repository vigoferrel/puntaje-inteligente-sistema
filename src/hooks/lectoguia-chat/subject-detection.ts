
/**
 * Hook para detectar materias en mensajes
 */
export function useSubjectDetection() {
  /**
   * Detecta la materia en un mensaje
   */
  const detectSubject = (message: string): string | null => {
    // Normalizar el texto para búsqueda (minúsculas, sin acentos)
    const normalizedMessage = message.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    // Palabras clave para detectar materias en mensajes
    const subjectKeywords: Record<string, string[]> = {
      'lectura': [
        'comprensión', 'lectora', 'lectura', 'texto', 'párrafo', 'libro', 'literatura',
        'inferir', 'interpretar', 'ensayo', 'obra', 'novela', 'cuento', 'poema'
      ],
      'matematicas-basica': [
        'matemática', 'matemáticas', 'álgebra', 'geometría', 'ecuación', 'fracción',
        'número', 'cálculo', 'básica', 'primaria', 'secundaria'
      ],
      'matematicas-avanzada': [
        'cálculo diferencial', 'cálculo integral', 'función', 'derivada', 'integral', 'estadística',
        'probabilidad', 'avanzada', 'universitaria'
      ],
      'ciencias': [
        'biología', 'química', 'física', 'átomo', 'molécula', 'célula', 'fuerza',
        'energía', 'masa', 'velocidad', 'aceleración'
      ],
      'historia': [
        'historia', 'geografía', 'civilización', 'guerra', 'revolución', 'periodo',
        'sociedad', 'cultura', 'política', 'economía'
      ]
    };
    
    // Puntuaciones para cada materia
    const scores: Record<string, number> = {
      'lectura': 0,
      'matematicas-basica': 0,
      'matematicas-avanzada': 0,
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
  };
  
  return { detectSubject };
}
