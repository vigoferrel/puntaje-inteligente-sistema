graph TD
    %% Raíz PAES
    PAES((PAES)):::root --> CL[Competencia Lectora]
    PAES --> MAT[Matemáticas]
    PAES --> HIS[Historia]
    PAES --> CIE[Ciencias]

    %% Subtipos de Matemáticas
    MAT --> MAT_M1[Matemática 1]
    MAT --> MAT_M2[Matemática 2]

    %% Competencia Lectora - Habilidades y Pruebas
    subgraph Competencia_Lectora [Competencia Lectora - Habilidades]
        CL --> CL_TL[🔍 Track & Locate]
        CL --> CL_IR[🔄 Interpret & Relate]
        CL --> CL_ER[⚖️ Evaluate & Reflect]

        %% Relaciones entre habilidades de CL
        CL_TL -.->|requiere| CL_IR
        CL_IR -.->|requiere| CL_ER
        
        %% Pruebas por habilidad
        CL_TL --> CL_TL_TEST[Pruebas]
        CL_TL_TEST --> |Diagnóstico| CL_N1[📝 Ideas Principales]
        CL_TL_TEST --> |Práctica| CL_N2[📝 Info. Específica]

        CL_IR --> CL_IR_TEST[Pruebas]
        CL_IR_TEST --> |Simulación| CL_N3[📝 Conexiones]
        CL_IR_TEST --> |Adaptativo| CL_N4[📝 Análisis]

        CL_ER --> CL_ER_TEST[Pruebas]
        CL_ER_TEST --> |Adaptativo| CL_N5[📝 Evaluación]
        CL_ER_TEST --> |Quick Review| CL_N6[📝 Reflexión]
    end

    %% Matemáticas - Habilidades y Pruebas
    subgraph Matematicas [Matemáticas - Habilidades]
        MAT_M1 & MAT_M2 --> MAT_SP[🧮 Solve Problems]
        MAT_M1 & MAT_M2 --> MAT_REP[📊 Represent]
        MAT_M1 & MAT_M2 --> MAT_MOD[🎯 Model]
        MAT_M1 & MAT_M2 --> MAT_AC[💭 Argue & Communicate]

        %% Relaciones entre habilidades de MAT
        MAT_SP -.->|apoya| MAT_REP
        MAT_REP -.->|facilita| MAT_MOD
        MAT_MOD -.->|requiere| MAT_AC
        MAT_AC -.->|mejora| MAT_SP

        %% Pruebas por habilidad
        MAT_SP --> MAT_SP_TEST[Pruebas]
        MAT_SP_TEST --> |Diagnóstico| MAT_N1[📝 Ecuaciones]
        MAT_SP_TEST --> |Práctica| MAT_N2[📝 Problemas]

        MAT_REP --> MAT_REP_TEST[Pruebas]
        MAT_REP_TEST --> |Simulación| MAT_N3[📝 Gráficos]
        MAT_REP_TEST --> |Adaptativo| MAT_N4[📝 Representaciones]

        MAT_MOD --> MAT_MOD_TEST[Pruebas]
        MAT_MOD_TEST --> |Adaptativo| MAT_N5[📝 Modelamiento]
        MAT_MOD_TEST --> |Quick Review| MAT_N6[📝 Aplicaciones]

        MAT_AC --> MAT_AC_TEST[Pruebas]
        MAT_AC_TEST --> |Simulación| MAT_N7[📝 Argumentación]
        MAT_AC_TEST --> |Quick Review| MAT_N8[📝 Comunicación]
    end

    %% Relaciones entre materias
    CL_IR -.->|complementa| MAT_AC
    MAT_REP -.->|refuerza| CL_TL
    CL_ER -.->|potencia| MAT_MOD
    MAT_SP -.->|utiliza| CL_IR

    %% Estilos
    classDef root fill:#ff9999,stroke:#333,stroke-width:4px
    classDef materia fill:#f9f,stroke:#333,stroke-width:2px
    classDef submateria fill:#fcf,stroke:#333,stroke-width:2px
    classDef habilidad fill:#bbf,stroke:#333,stroke-width:2px
    classDef prueba fill:#dfd,stroke:#333,stroke-width:2px
    classDef nodo fill:#fdd,stroke:#333,stroke-width:2px
    
    class CL,MAT,HIS,CIE materia
    class MAT_M1,MAT_M2 submateria
    class CL_TL,CL_IR,CL_ER,MAT_SP,MAT_REP,MAT_MOD,MAT_AC habilidad
    class CL_TL_TEST,CL_IR_TEST,CL_ER_TEST,MAT_SP_TEST,MAT_REP_TEST,MAT_MOD_TEST,MAT_AC_TEST prueba
    class CL_N1,CL_N2,CL_N3,CL_N4,CL_N5,CL_N6,MAT_N1,MAT_N2,MAT_N3,MAT_N4,MAT_N5,MAT_N6,MAT_N7,MAT_N8 nodo

    %% Leyenda
    subgraph Leyenda
        L1[Materia]:::materia
        L2[Submateria]:::submateria
        L3[Habilidad]:::habilidad
        L4[Prueba]:::prueba
        L5[Nodo]:::nodo
        L6[Relación]
        L6 -.->|tipo| L5
    end