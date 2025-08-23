# Listado Completo de Nodos de Verificación

## Competencia Lectora

### Track & Locate (Nivel Básico)
1. 📍 Identificación de Ideas Principales
   - Tipo: Diagnóstico/Práctica
   - Habilidad: Localización de información explícita
   - Tiempo estimado: 30 min

2. 🔍 Localización de Información Específica
   - Tipo: Práctica
   - Habilidad: Búsqueda y extracción de datos
   - Tiempo estimado: 45 min

### Interpret & Relate (Nivel Intermedio)
3. 🔄 Conexiones Textuales
   - Tipo: Simulación
   - Habilidad: Relación entre párrafos
   - Tiempo estimado: 45 min

4. 🧩 Análisis Contextual
   - Tipo: Adaptativo
   - Habilidad: Interpretación en contexto
   - Tiempo estimado: 60 min

### Evaluate & Reflect (Nivel Avanzado)
5. ⚖️ Evaluación Crítica
   - Tipo: Adaptativo
   - Habilidad: Análisis de argumentos
   - Tiempo estimado: 60 min

6. 💭 Reflexión sobre Contenido
   - Tipo: Quick Review
   - Habilidad: Pensamiento crítico
   - Tiempo estimado: 45 min

## Matemáticas

### Solve Problems (Nivel Básico)
7. ➗ Resolución de Ecuaciones
   - Tipo: Diagnóstico/Práctica
   - Habilidad: Operaciones básicas
   - Tiempo estimado: 45 min

8. 🎯 Problemas Aplicados
   - Tipo: Práctica
   - Habilidad: Aplicación de fórmulas
   - Tiempo estimado: 60 min

### Represent (Nivel Intermedio)
9. 📊 Gráficos y Diagramas
   - Tipo: Simulación
   - Habilidad: Visualización de datos
   - Tiempo estimado: 45 min

10. 📈 Representaciones Algebraicas
    - Tipo: Adaptativo
    - Habilidad: Conversión entre formatos
    - Tiempo estimado: 60 min

### Model (Nivel Avanzado)
11. 🎭 Modelamiento Algebraico
    - Tipo: Adaptativo
    - Habilidad: Creación de modelos
    - Tiempo estimado: 75 min

12. 📐 Modelamiento Geométrico
    - Tipo: Quick Review
    - Habilidad: Aplicación espacial
    - Tiempo estimado: 60 min

### Argue & Communicate (Nivel Avanzado)
13. 💬 Argumentación Matemática
    - Tipo: Simulación
    - Habilidad: Justificación de soluciones
    - Tiempo estimado: 45 min

14. 📢 Comunicación de Resultados
    - Tipo: Quick Review
    - Habilidad: Explicación clara
    - Tiempo estimado: 30 min

## Criterios de Verificación

### Por Nivel
- **Básico**: 70% mínimo para avanzar
- **Intermedio**: 65% mínimo para avanzar
- **Avanzado**: 60% mínimo para completar

### Por Tipo de Prueba
- **Diagnóstico**: Establece línea base
- **Práctica**: Mínimo 3 intentos exitosos
- **Simulación**: 1 intento completo
- **Adaptativo**: Ajuste según rendimiento
- **Quick Review**: Verificación rápida

### Indicadores de Progreso
- ✅ Completado (>70%)
- 🔄 En Progreso (40-70%)
- ⚪ No Iniciado (<40%)

## Dependencias entre Nodos
```mermaid
graph TD
    %% Competencia Lectora
    N1[1. Ideas Principales] --> N3[3. Conexiones]
    N2[2. Info Específica] --> N4[4. Análisis]
    N3 & N4 --> N5[5. Evaluación]
    N5 --> N6[6. Reflexión]

    %% Matemáticas
    N7[7. Ecuaciones] --> N9[9. Gráficos]
    N8[8. Problemas] --> N10[10. Representaciones]
    N9 & N10 --> N11[11. Modelamiento Alg.]
    N11 --> N12[12. Modelamiento Geo.]
    N11 & N12 --> N13[13. Argumentación]
    N13 --> N14[14. Comunicación]

    %% Conexiones entre áreas
    N3 -.-> N13
    N5 -.-> N11
    N9 -.-> N4
    N8 -.-> N3

    classDef basico fill:#bbf,stroke:#333
    classDef intermedio fill:#dfd,stroke:#333
    classDef avanzado fill:#fdd,stroke:#333

    class N1,N2,N7,N8 basico
    class N3,N4,N9,N10 intermedio
    class N5,N6,N11,N12,N13,N14 avanzado