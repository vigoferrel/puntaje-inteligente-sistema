import { defineStore } from 'pinia'

export const useDiagnosticoStore = defineStore('diagnostico', {
  state: () => ({
    // Estado de las preguntas del diagnóstico
    preguntas: [
      {
        habilidad: 'Localizar',
        texto: `La competencia lectora es un proceso complejo que va más allá de la simple decodificación de signos. Implica comprender, interpretar y evaluar la información de manera crítica, estableciendo conexiones significativas entre el texto, el contexto y el conocimiento previo del lector.`,
        opciones: [
          {
            texto: "Simple decodificación de signos",
            correcta: false,
            explicacion: "La competencia lectora va más allá de la simple decodificación."
          },
          {
            texto: "Establecer conexiones significativas",
            correcta: true,
            explicacion: "Correcto. La competencia lectora implica establecer conexiones profundas."
          },
          {
            texto: "Conocimiento previo del lector",
            correcta: false,
            explicacion: "El conocimiento previo es importante, pero no es la definición completa."
          },
          {
            texto: "Evaluación de información",
            correcta: false,
            explicacion: "La evaluación es parte del proceso, pero no lo define completamente."
          }
        ]
      },
      // Más preguntas para otras habilidades
    ],
    
    // Resultados del diagnóstico
    resultados: {
      localizar: 0,
      interpretar: 0,
      evaluar: 0
    },
    
    // Estado de progreso del diagnóstico
    progreso: {
      preguntaActual: 0,
      totalPreguntas: 0,
      respondidas: 0
    }
  }),
  
  getters: {
    // Obtener la pregunta actual
    getPreguntaActual() {
      return this.preguntas[this.progreso.preguntaActual]
    },
    
    // Verificar si el diagnóstico está completo
    diagnosticoCompleto() {
      return this.progreso.respondidas === this.preguntas.length
    }
  },
  
  actions: {
    // Inicializar diagnóstico
    iniciarDiagnostico() {
      this.progreso = {
        preguntaActual: 0,
        totalPreguntas: this.preguntas.length,
        respondidas: 0
      }
      
      // Reiniciar resultados
      this.resultados = {
        localizar: 0,
        interpretar: 0,
        evaluar: 0
      }
    },
    
    // Responder pregunta
    responderPregunta(respuestaSeleccionada) {
      const preguntaActual = this.preguntas[this.progreso.preguntaActual]
      const respuestaCorrecta = preguntaActual.opciones.find(opcion => opcion.correcta)
      
      // Actualizar resultados según la habilidad
      if (respuestaSeleccionada.correcta) {
        switch(preguntaActual.habilidad) {
          case 'Localizar':
            this.resultados.localizar += 25
            break
          case 'Interpretar':
            this.resultados.interpretar += 25
            break
          case 'Evaluar':
            this.resultados.evaluar += 25
            break
        }
      }
      
      // Avanzar al siguiente estado
      this.progreso.preguntaActual++
      this.progreso.respondidas++
      
      return {
        correcta: respuestaSeleccionada.correcta,
        explicacion: respuestaSeleccionada.explicacion
      }
    },
    
    // Finalizar diagnóstico
    finalizarDiagnostico() {
      // Calcular porcentajes finales
      this.resultados.localizar = Math.min(this.resultados.localizar, 100)
      this.resultados.interpretar = Math.min(this.resultados.interpretar, 100)
      this.resultados.evaluar = Math.min(this.resultados.evaluar, 100)
      
      return {
        ...this.resultados,
        nivelCompetencia: this.calcularNivelCompetencia()
      }
    },
    
    // Calcular nivel de competencia
    calcularNivelCompetencia() {
      const promedio = (
        this.resultados.localizar + 
        this.resultados.interpretar + 
        this.resultados.evaluar
      ) / 3
      
      if (promedio < 40) return 'Inicial'
      if (promedio < 60) return 'Básico'
      if (promedio < 80) return 'Intermedio'
      return 'Avanzado'
    }
  }
})
