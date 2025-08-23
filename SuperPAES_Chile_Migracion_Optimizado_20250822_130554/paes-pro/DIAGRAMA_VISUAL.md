# Diagrama Visual de Habilidades PAES

```mermaid
flowchart TD
    %% Estilo general
    classDef materia fill:#f9f,stroke:#333,stroke-width:4px
    classDef habilidad fill:#bbf,stroke:#333,stroke-width:2px
    classDef conexion fill:none,stroke:#666,stroke-width:2px,stroke-dasharray: 5 5

    %% Materias principales como círculos
    CL((🎯\nCompetencia\nLectora)):::materia
    MAT((📊\nMatemáticas)):::materia

    %% Habilidades como hexágonos
    subgraph Competencia_Lectora
        CL_TL{{🔍\nTrack &\nLocate}}:::habilidad
        CL_IR{{🔄\nInterpret &\nRelate}}:::habilidad
        CL_ER{{⚖️\nEvaluate &\nReflect}}:::habilidad
    end

    subgraph Matematicas
        MAT_SP{{🧮\nSolve\nProblems}}:::habilidad
        MAT_REP{{📈\nRepresent}}:::habilidad
        MAT_MOD{{🎯\nModel}}:::habilidad
        MAT_AC{{💭\nArgue &\nCommunicate}}:::habilidad
    end

    %% Conexiones dentro de Competencia Lectora
    CL_TL -->|Base para| CL_IR
    CL_IR -->|Permite| CL_ER

    %% Conexiones dentro de Matemáticas
    MAT_SP -->|Visualiza| MAT_REP
    MAT_REP -->|Construye| MAT_MOD
    MAT_MOD -->|Explica| MAT_AC
    MAT_AC -->|Mejora| MAT_SP

    %% Conexiones entre materias
    CL_IR -.->|Complementa| MAT_AC
    MAT_REP -.->|Refuerza| CL_TL
    CL_ER -.->|Potencia| MAT_MOD
    MAT_SP -.->|Utiliza| CL_IR

    %% Leyenda
    subgraph Leyenda
        L1((Materia)):::materia
        L2{{Habilidad}}:::habilidad
        L3[Conexión Interna]
        L4[Conexión Entre Materias]:::conexion
    end
```

## Descripción de Relaciones

### Competencia Lectora
- 🔍 Track & Locate: Habilidad base para identificar información
- 🔄 Interpret & Relate: Construye sobre la información localizada
- ⚖️ Evaluate & Reflect: Análisis profundo y evaluación

### Matemáticas
- 🧮 Solve Problems: Punto de partida para resolución
- 📈 Represent: Visualización y representación de problemas
- 🎯 Model: Construcción de modelos matemáticos
- 💭 Argue & Communicate: Explicación y justificación

### Conexiones Entre Materias
1. Interpretación → Argumentación
2. Representación → Localización
3. Evaluación → Modelamiento
4. Resolución → Interpretación

Este diagrama muestra cómo las habilidades se interconectan y se refuerzan mutuamente, creando un ciclo de aprendizaje integrado.