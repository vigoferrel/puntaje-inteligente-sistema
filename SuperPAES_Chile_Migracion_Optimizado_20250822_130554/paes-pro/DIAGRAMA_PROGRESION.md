# Diagrama de Progresión de Aprendizaje PAES

```mermaid
graph TD
    %% Estilos
    classDef prueba fill:#f9f,stroke:#333,stroke-width:4px
    classDef competencia fill:#bbf,stroke:#333,stroke-width:2px
    classDef nodo fill:#dfd,stroke:#333,stroke-width:2px
    classDef progreso fill:#ffd,stroke:#333,stroke-width:2px

    %% Tipos de Prueba
    DIAG[📋 DIAGNÓSTICO]:::prueba
    PRAC[📝 PRÁCTICA]:::prueba
    SIM[🎯 SIMULACIÓN]:::prueba
    ADAP[📈 ADAPTATIVO]:::prueba
    QR[⚡ QUICK REVIEW]:::prueba

    %% Competencias por Nivel
    subgraph Nivel_Basico [Nivel Básico]
        CB1[🔍 Track & Locate]:::competencia
        MB1[🧮 Solve Problems]:::competencia
    end

    subgraph Nivel_Intermedio [Nivel Intermedio]
        CB2[🔄 Interpret & Relate]:::competencia
        MB2[📊 Represent]:::competencia
    end

    subgraph Nivel_Avanzado [Nivel Avanzado]
        CB3[⚖️ Evaluate & Reflect]:::competencia
        MB3[💭 Argue & Communicate]:::competencia
    end

    %% Nodos de Verificación
    subgraph Nodos_CL [Nodos Competencia Lectora]
        NCL1[Ideas Principales<br/>✓ 80%]:::nodo
        NCL2[Conexiones<br/>✓ 65%]:::nodo
        NCL3[Análisis Crítico<br/>⚪ 0%]:::nodo
    end

    subgraph Nodos_MAT [Nodos Matemáticas]
        NM1[Ecuaciones<br/>✓ 75%]:::nodo
        NM2[Representaciones<br/>✓ 60%]:::nodo
        NM3[Argumentación<br/>⚪ 0%]:::nodo
    end

    %% Flujo de Progresión
    DIAG --> |Evalúa| Nivel_Basico
    Nivel_Basico --> |Practica| PRAC
    PRAC --> |Domina| Nivel_Intermedio
    Nivel_Intermedio --> |Simula| SIM
    SIM --> |Avanza| Nivel_Avanzado
    Nivel_Avanzado --> |Adapta| ADAP
    ADAP --> |Refuerza| QR

    %% Verificación de Competencias
    CB1 --> NCL1
    CB2 --> NCL2
    CB3 --> NCL3
    MB1 --> NM1
    MB2 --> NM2
    MB3 --> NM3

    %% Indicadores de Progreso
    subgraph Progreso [Indicadores de Progreso]
        P1[✓ Completado >70%]:::progreso
        P2[↻ En Progreso 40-70%]:::progreso
        P3[⚪ No Iniciado <40%]:::progreso
    end

    %% Leyenda
    subgraph Leyenda
        L1[Tipo de Prueba]:::prueba
        L2[Competencia]:::competencia
        L3[Nodo Verificación]:::nodo
        L4[Indicador Progreso]:::progreso
    end
```

## Descripción del Flujo de Aprendizaje

### Tipos de Prueba
1. 📋 **DIAGNÓSTICO**: Evaluación inicial de competencias
2. 📝 **PRÁCTICA**: Ejercitación de habilidades básicas
3. 🎯 **SIMULACIÓN**: Integración de competencias
4. 📈 **ADAPTATIVO**: Ajuste según rendimiento
5. ⚡ **QUICK REVIEW**: Repaso y refuerzo

### Niveles de Competencia
- **Básico**: Track & Locate (CL) y Solve Problems (MAT)
- **Intermedio**: Interpret & Relate (CL) y Represent (MAT)
- **Avanzado**: Evaluate & Reflect (CL) y Argue & Communicate (MAT)

### Nodos de Verificación
- **Competencia Lectora**:
  * Ideas Principales (80% completado)
  * Conexiones (65% completado)
  * Análisis Crítico (no iniciado)

- **Matemáticas**:
  * Ecuaciones (75% completado)
  * Representaciones (60% completado)
  * Argumentación (no iniciado)

### Indicadores de Progreso
- ✓ Verde: Competencia lograda (>70%)
- ↻ Amarillo: En desarrollo (40-70%)
- ⚪ Gris: No iniciado (<40%)

Este diagrama muestra la progresión completa desde el diagnóstico inicial hasta el dominio de competencias avanzadas, con verificación continua del progreso a través de nodos específicos.