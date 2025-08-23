-- Crear tabla para los exámenes
CREATE TABLE IF NOT EXISTS examenes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    año INTEGER,
    duracion_minutos INTEGER,
    total_preguntas INTEGER,
    preguntas_validas INTEGER,
    instrucciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para las preguntas
CREATE TABLE IF NOT EXISTS preguntas (
    id SERIAL PRIMARY KEY,
    examen_id INTEGER REFERENCES examenes(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    enunciado TEXT NOT NULL,
    imagen_url VARCHAR(500),
    contexto TEXT,
    tipo_pregunta VARCHAR(50) DEFAULT 'multiple_choice',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(examen_id, numero)
);

-- Crear tabla para las opciones de respuesta
CREATE TABLE IF NOT EXISTS opciones_respuesta (
    id SERIAL PRIMARY KEY,
    pregunta_id INTEGER REFERENCES preguntas(id) ON DELETE CASCADE,
    letra CHAR(1) NOT NULL,
    contenido TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pregunta_id, letra)
);

-- Insertar el examen PAES 2024
INSERT INTO examenes (codigo, nombre, tipo, año, duracion_minutos, total_preguntas, preguntas_validas, instrucciones)
VALUES (
    'FORMA_113_2024',
    'COMPETENCIA MATEMÁTICA 1',
    'Prueba de Acceso a la Educación Superior (PAES)',
    2024,
    140,
    65,
    60,
    'Esta prueba contiene 65 preguntas, 60 de las cuales serán consideradas para el cálculo del puntaje final. Las preguntas tienen 4 opciones de respuesta (A, B, C y D) donde solo una de ellas es correcta. No se descuenta puntaje por respuestas erradas.'
);

-- TODAS LAS 65 PREGUNTAS DEL EXAMEN PAES 2024

-- Pregunta 1
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 1, '¿Cuál es el resultado de 3 - (-1)(-1 - 5)?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 1 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '-1', FALSE),
((SELECT id FROM preguntas WHERE numero = 1 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '-3', TRUE),
((SELECT id FROM preguntas WHERE numero = 1 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '-12', FALSE),
((SELECT id FROM preguntas WHERE numero = 1 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '-24', FALSE);

-- Pregunta 2
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 2, '¿Cuál es el resultado que permite entrar al concurso?', 'Un diario tiene una colilla recortable para un concurso con un cuadrado mágico. Cada fila, cada columna y cada diagonal deben contener los números 1, 2, 3 y 4 sin que se repitan. Se debe enviar el resultado de ♥ + ☻ + ♪');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 2 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '6', FALSE),
((SELECT id FROM preguntas WHERE numero = 2 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '7', FALSE),
((SELECT id FROM preguntas WHERE numero = 2 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '8', TRUE),
((SELECT id FROM preguntas WHERE numero = 2 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '9', FALSE);

-- Pregunta 3
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 3, 'Si al quíntuplo de -10 se le resta el triple de -12, ¿qué número se obtiene?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 3 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '-86', FALSE),
((SELECT id FROM preguntas WHERE numero = 3 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '-14', TRUE),
((SELECT id FROM preguntas WHERE numero = 3 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2', FALSE),
((SELECT id FROM preguntas WHERE numero = 3 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '34', FALSE);

-- Pregunta 4
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 4, '¿En cuál de las siguientes opciones se representa la frase "el doble de la tercera parte de la diferencia entre 8 y 6"?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 4 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2 · (1/3) · 8 - 6', FALSE),
((SELECT id FROM preguntas WHERE numero = 4 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2 · (1/3) · (8 - 6)', TRUE),
((SELECT id FROM preguntas WHERE numero = 4 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2 · 3 · 8 - 6', FALSE),
((SELECT id FROM preguntas WHERE numero = 4 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2 · 3 · (8 - 6)', FALSE);

-- Pregunta 5
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 5, '¿Cuántos años pasaron desde el año de la construcción de la Gran Pirámide de Guiza hasta el año del nacimiento de Cleopatra?', 'Construcción de la Gran Pirámide de Guiza: 2570 a.C. Nacimiento de Cleopatra: 69 a.C.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 5 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2640', FALSE),
((SELECT id FROM preguntas WHERE numero = 5 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2639', FALSE),
((SELECT id FROM preguntas WHERE numero = 5 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2501', TRUE),
((SELECT id FROM preguntas WHERE numero = 5 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2499', FALSE);

-- Pregunta 6
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 6, '¿Cuál tirador obtuvo el mayor puntaje y cuál obtuvo el menor puntaje, respectivamente?', 'Juego de dardos: 10 puntos sector A, 5 puntos sector B, 0 puntos sector C. Pedro: A=4, B=2, C=4. Sandra: A=3, B=5, C=2. Roberta: A=2, B=8, C=0.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 6 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Roberta y Sandra', FALSE),
((SELECT id FROM preguntas WHERE numero = 6 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Roberta y Pedro', FALSE),
((SELECT id FROM preguntas WHERE numero = 6 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Sandra y Roberta', TRUE),
((SELECT id FROM preguntas WHERE numero = 6 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'Pedro y Sandra', FALSE);

-- Pregunta 7
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 7, '¿Cuál es su saldo final luego de realizados los pagos de ese día?', 'Persona con tarjeta de débito en el exterior. Saldo inicial: $300,000. Pagos: $15,000 (teatro) y $35,000 (parque). Comisión por pago: $2,000.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 7 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '$254,000', FALSE),
((SELECT id FROM preguntas WHERE numero = 7 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '$244,000', FALSE),
((SELECT id FROM preguntas WHERE numero = 7 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '$248,000', TRUE),
((SELECT id FROM preguntas WHERE numero = 7 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '$246,000', FALSE);

-- Pregunta 8
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 8, '¿Cuántos estudiantes votaron por Fernando?', 'Colegio con 180 estudiantes total. 1/6 pertenece al segundo medio B. El día de elección faltó 1/10 del curso. 1/3 de los presentes votaron por Josefina, el resto por Fernando.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 8 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '20', FALSE),
((SELECT id FROM preguntas WHERE numero = 8 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '18', TRUE),
((SELECT id FROM preguntas WHERE numero = 8 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2', FALSE),
((SELECT id FROM preguntas WHERE numero = 8 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '1', FALSE);

-- Pregunta 9
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 9, '¿Cuánto dinero gastó la persona en imprimir el libro?', 'Centro de impresión B&N: 1-99 hojas $30 c/u, 100-149 hojas $25 c/u, 150+ hojas $20 c/u. Libro: capítulo 1 (150 hojas), capítulo 2 (130 hojas), capítulo 3 (85 hojas). Se imprimió por separado.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 9 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '$7300', FALSE),
((SELECT id FROM preguntas WHERE numero = 9 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '$8150', TRUE),
((SELECT id FROM preguntas WHERE numero = 9 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '$8800', FALSE),
((SELECT id FROM preguntas WHERE numero = 9 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '$9450', FALSE);

-- Pregunta 10
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 10, '¿Cuál es la cantidad de palitos que se utilizan en la figura 25?', 'Secuencia de figuras formadas por cuadrados y triángulos con palitos de fósforo. Figura 1: 1 cuadrado + 1 triángulo, Figura 2: 2 cuadrados + 2 triángulos, etc.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 10 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '7 × 25', FALSE),
((SELECT id FROM preguntas WHERE numero = 10 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '5 × 25 + 2', TRUE),
((SELECT id FROM preguntas WHERE numero = 10 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '3 × 25 + 4', FALSE),
((SELECT id FROM preguntas WHERE numero = 10 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2 × 25', FALSE);

-- Pregunta 11
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 11, '¿Cuál de las siguientes expresiones representa el 20% del 20% del 20% de un número P?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 11 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '0,8% de P', TRUE),
((SELECT id FROM preguntas WHERE numero = 11 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '8000% de P', FALSE),
((SELECT id FROM preguntas WHERE numero = 11 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '0,6% de P', FALSE),
((SELECT id FROM preguntas WHERE numero = 11 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '60% de P', FALSE);

-- Pregunta 12
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 12, '¿A qué porcentaje corresponde 25 de 125?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 12 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'A un 5%', FALSE),
((SELECT id FROM preguntas WHERE numero = 12 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'A un 20%', TRUE),
((SELECT id FROM preguntas WHERE numero = 12 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'A un 25%', FALSE),
((SELECT id FROM preguntas WHERE numero = 12 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'A un 500%', FALSE);

-- Pregunta 13
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 13, '¿Cuál de los siguientes argumentos es válido?', 'Helena va en segundo básico de un colegio de 1000 estudiantes, de los cuales el 10% participa en el taller de patinaje. De este taller, el 10% compite en un torneo y Helena es una de las competidoras.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 13 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '90 estudiantes del taller no compiten, porque solo 10 estudiantes son del curso de Helena.', FALSE),
((SELECT id FROM preguntas WHERE numero = 13 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Helena es parte del 1% del colegio que compite, porque el 99% restante no practica patinaje.', FALSE),
((SELECT id FROM preguntas WHERE numero = 13 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '10 estudiantes compiten en el torneo, porque son el 10% del total de 100 estudiantes que participan en el taller de patinaje.', TRUE),
((SELECT id FROM preguntas WHERE numero = 13 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'El 90% del estudiantado del colegio no practica patinaje, porque no son parte del 10% que compite en el torneo.', FALSE);

-- Pregunta 14
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 14, '¿Cuánto dinero tendría que recibir por jornada de trabajo para que este equivalga al nuevo sueldo con bono?', 'Una persona recibirá un bono del 20% de su sueldo mensual por los próximos 6 meses. La persona calcula que su sueldo mensual normal equivale a recibir $28000 por cada jornada de trabajo.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 14 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '$33600', TRUE),
((SELECT id FROM preguntas WHERE numero = 14 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '$29400', FALSE),
((SELECT id FROM preguntas WHERE numero = 14 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '$28560', FALSE),
((SELECT id FROM preguntas WHERE numero = 14 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '$28020', FALSE);

-- Pregunta 15
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 15, '¿Cuál es el nuevo precio de venta de cada plancha de volcanita?', 'Un comerciante compra planchas de volcanita a $6000 cada una y las vende para obtener un 75% de ganancia. Luego decide rebajar el precio de venta en un 25%.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 15 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '$7125', FALSE),
((SELECT id FROM preguntas WHERE numero = 15 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '$7875', TRUE),
((SELECT id FROM preguntas WHERE numero = 15 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '$9000', FALSE),
((SELECT id FROM preguntas WHERE numero = 15 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '$9375', FALSE);

-- Pregunta 16
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 16, '¿Cuál es el porcentaje de habitaciones que aún están disponibles ese fin de semana?', 'Un hotel tiene 200 habitaciones y para un fin de semana largo tiene reservadas 140 habitaciones.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 16 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '30%', TRUE),
((SELECT id FROM preguntas WHERE numero = 16 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '43%', FALSE),
((SELECT id FROM preguntas WHERE numero = 16 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '60%', FALSE),
((SELECT id FROM preguntas WHERE numero = 16 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '70%', FALSE);

-- Pregunta 17
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 17, '¿Cuál es el valor de 14² + 1/(5-2)?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 17 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '195/25', FALSE),
((SELECT id FROM preguntas WHERE numero = 17 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '4899/25', FALSE),
((SELECT id FROM preguntas WHERE numero = 17 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '221', FALSE),
((SELECT id FROM preguntas WHERE numero = 17 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '171', TRUE);

-- Pregunta 18
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 18, '¿Cuál de las siguientes opciones representa al número (888)²?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 18 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2⁶ · 111²', FALSE),
((SELECT id FROM preguntas WHERE numero = 18 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2⁶ · 111', FALSE),
((SELECT id FROM preguntas WHERE numero = 18 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2⁵ · 111²', FALSE),
((SELECT id FROM preguntas WHERE numero = 18 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2⁵ · 111', TRUE);

-- Pregunta 19
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 19, '¿Cuál de las siguientes expresiones representa a este número?', 'Considera el número mtp de tres dígitos, tal que m es el de la centena, t es el de la decena y p es el de la unidad.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 19 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'm · 10² · t · 10¹ · p · 10⁰', FALSE),
((SELECT id FROM preguntas WHERE numero = 19 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'm · 10³ · t · 10² · p · 10¹', FALSE),
((SELECT id FROM preguntas WHERE numero = 19 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'm · 10³ + t · 10² + p · 10¹', FALSE),
((SELECT id FROM preguntas WHERE numero = 19 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'm · 10² + t · 10¹ + p · 10⁰', TRUE);

-- Pregunta 20
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 20, '¿Cuál es el valor de (√2 · √2⁶)/2?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 20 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2^(-1/6)', FALSE),
((SELECT id FROM preguntas WHERE numero = 20 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2^(9/2)', FALSE),
((SELECT id FROM preguntas WHERE numero = 20 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2^(5/2)', FALSE),
((SELECT id FROM preguntas WHERE numero = 20 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2¹', TRUE);

-- Pregunta 21
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 21, '¿Cuál es el valor de (√5 + 1)(√5 - 1)?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 21 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2', FALSE),
((SELECT id FROM preguntas WHERE numero = 21 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '4', TRUE),
((SELECT id FROM preguntas WHERE numero = 21 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '√6', FALSE),
((SELECT id FROM preguntas WHERE numero = 21 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2√5', FALSE);

-- Pregunta 22
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 22, '¿En cuánto aumentó la cantidad de bacterias transcurridas dos horas?', 'La cantidad de bacterias de cierto cultivo aumenta en un 20% cada 40 minutos. Si la cantidad inicial era 250 bacterias.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 22 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '6', FALSE),
((SELECT id FROM preguntas WHERE numero = 22 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '60', FALSE),
((SELECT id FROM preguntas WHERE numero = 22 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '182', TRUE),
((SELECT id FROM preguntas WHERE numero = 22 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '250', FALSE);

-- Pregunta 23
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 23, '¿Cuántas veces cabe el almacenamiento de un dispositivo antiguo en un dispositivo actual?', 'Los antiguos dispositivos de almacenamiento tenían una capacidad máxima de 1 megabyte y actualmente existen dispositivos que almacenan 1 terabyte. Si un terabyte equivale a 10¹² bytes y un megabyte equivale a 1,000,000 bytes.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 23 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '10²', FALSE),
((SELECT id FROM preguntas WHERE numero = 23 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '10⁵', FALSE),
((SELECT id FROM preguntas WHERE numero = 23 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '10⁶', TRUE),
((SELECT id FROM preguntas WHERE numero = 23 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '10¹²', FALSE);

-- Pregunta 24
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 24, '¿Cuál de las siguientes expresiones es igual a (2x - 3)²?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 24 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2x² - 12x + 9', FALSE),
((SELECT id FROM preguntas WHERE numero = 24 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '4x² - 6x - 9', FALSE),
((SELECT id FROM preguntas WHERE numero = 24 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '4x² - 12x + 9', TRUE),
((SELECT id FROM preguntas WHERE numero = 24 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '4x² - 9', FALSE);

-- Pregunta 25
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 25, '¿En cuál de los pasos se cometió el error?', 'Se realiza la multiplicación (3x + 4) · (x² - 6x + 5) paso a paso y se comete un error en alguno de los pasos mostrados.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 25 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'En el Paso 1', FALSE),
((SELECT id FROM preguntas WHERE numero = 25 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'En el Paso 2', TRUE),
((SELECT id FROM preguntas WHERE numero = 25 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'En el Paso 3', FALSE),
((SELECT id FROM preguntas WHERE numero = 25 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'En el Paso 4', FALSE);

-- Pregunta 26
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 26, '¿Cuál de las siguientes expresiones representa a "el doble del cubo de un número x, disminuido en un tercio del mismo número"?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 26 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '(2x)³ - x/3', FALSE),
((SELECT id FROM preguntas WHERE numero = 26 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2x³ - 1/3', FALSE),
((SELECT id FROM preguntas WHERE numero = 26 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2(x³ - 1/3)', FALSE),
((SELECT id FROM preguntas WHERE numero = 26 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2x³ - x/3', TRUE);

-- Pregunta 27
INSERT INTO preguntas (examen_id, numero, enunciado) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 27, '¿Cuál de las siguientes expresiones es igual a -y - 2(y - 2)²?');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 27 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '-3y - 4', FALSE),
((SELECT id FROM preguntas WHERE numero = 27 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '-2y² - y - 4', FALSE),
((SELECT id FROM preguntas WHERE numero = 27 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '-2y² - y + 8', FALSE),
((SELECT id FROM preguntas WHERE numero = 27 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '-2y² + 7y - 8', TRUE);

-- Pregunta 28
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 28, '¿Cuál de las siguientes fórmulas permite determinar la cantidad de gramos de harina que se necesitan para hacer n galletas?', 'Una receta indica usar 325 gramos de harina, entre otros ingredientes, para hacer 20 galletas.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 28 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '(325/20) · n', TRUE),
((SELECT id FROM preguntas WHERE numero = 28 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '325 · n', FALSE),
((SELECT id FROM preguntas WHERE numero = 28 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '325 + n', FALSE),
((SELECT id FROM preguntas WHERE numero = 28 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '(20/325) · n', FALSE);

-- Pregunta 29
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 29, '¿Qué representa el número 20?', 'En una tienda de perfumería empacan jabones en cajas. La relación entre la cantidad de jabones y la cantidad de cajas se puede modelar mediante la función f definida por f(x) = 20 · x.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 29 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'La constante de proporcionalidad directa.', TRUE),
((SELECT id FROM preguntas WHERE numero = 29 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'La constante de proporcionalidad inversa.', FALSE),
((SELECT id FROM preguntas WHERE numero = 29 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'La cantidad total de jabones.', FALSE),
((SELECT id FROM preguntas WHERE numero = 29 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'La cantidad total de cajas.', FALSE);

-- Pregunta 30
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 30, '¿Cuál es la máxima cantidad de lápices que puede tener Ariel?', 'Carmen tiene 13 lápices más que Ariel y entre las dos tienen a lo más 49 lápices.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 30 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '17', FALSE),
((SELECT id FROM preguntas WHERE numero = 30 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '18', TRUE),
((SELECT id FROM preguntas WHERE numero = 30 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '30', FALSE),
((SELECT id FROM preguntas WHERE numero = 30 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '31', FALSE);

-- Pregunta 31
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 31, '¿Cuál de las siguientes inecuaciones permite determinar la cantidad máxima de cajas x de cada tipo que se pueden colocar en el camión?', 'En una frutería se llenan cajas de dos tipos. Un tipo pesa M kg y el otro P kg cuando están llenas. La capacidad del camión no puede superar los 2100 kg. La cantidad de cajas de ambos tipos es la misma.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 31 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '(M + P) · x ≤ 2100', TRUE),
((SELECT id FROM preguntas WHERE numero = 31 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'M + P + x ≤ 2100', FALSE),
((SELECT id FROM preguntas WHERE numero = 31 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '(M + P) · x < 2100', FALSE),
((SELECT id FROM preguntas WHERE numero = 31 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '(M + P) · 2x < 2100', FALSE);

-- Pregunta 32
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 32, '¿Cuál de las siguientes afirmaciones es verdadera?', 'En una oficina de encomiendas se desea enviar cinco regalos idénticos y un frasco de medio kilogramo de miel. Para determinar la masa de los regalos se colocan en una balanza dos regalos y el frasco de miel y en la otra balanza tres regalos. La balanza de la izquierda marca menos que la de la derecha.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 32 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Cada regalo tiene una masa de 100 gramos.', FALSE),
((SELECT id FROM preguntas WHERE numero = 32 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Cada regalo tiene una masa de 500 gramos.', FALSE),
((SELECT id FROM preguntas WHERE numero = 32 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Cada regalo tiene una masa mayor que 500 gramos.', TRUE),
((SELECT id FROM preguntas WHERE numero = 32 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'Cada regalo tiene una masa menor que 500 gramos.', FALSE);

-- Pregunta 33
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 33, '¿Cuál es la constante de proporcionalidad?', 'En la tabla se indica la temperatura que alcanza cierto líquido en determinado tiempo, a partir de los 0°C. Si la temperatura alcanzada es directamente proporcional al tiempo de calentado. Temperatura 100°C a los 8 min, 50°C a los 4 min.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 33 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2/25', FALSE),
((SELECT id FROM preguntas WHERE numero = 33 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '25/2', TRUE),
((SELECT id FROM preguntas WHERE numero = 33 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '50', FALSE),
((SELECT id FROM preguntas WHERE numero = 33 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '400', FALSE);

-- Pregunta 34
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 34, '¿Cuántas bolsas armó Raúl?', 'Raúl y Teresa arman bolsas de dulces distribuyendo en total 1000 dulces en 300 bolsas. Raúl pone tres dulces en cada bolsa y Teresa pone cinco dulces en cada bolsa. No sobra ningún dulce.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 34 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '250', TRUE),
((SELECT id FROM preguntas WHERE numero = 34 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '180', FALSE),
((SELECT id FROM preguntas WHERE numero = 34 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '125', FALSE),
((SELECT id FROM preguntas WHERE numero = 34 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '50', FALSE);

-- Pregunta 35
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 35, '¿Cuántas bicicletas del modelo Cross Country fabricó?', 'La fábrica de bicicletas "MTB" utiliza aluminio y titanio en dos modelos: Sport (1kg aluminio, 3kg titanio) y Cross Country (2kg aluminio, 1kg titanio). Si disponía de 100kg de aluminio y 80kg de titanio, y utilizó todo el material.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 35 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '12', FALSE),
((SELECT id FROM preguntas WHERE numero = 35 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '24', FALSE),
((SELECT id FROM preguntas WHERE numero = 35 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '28', TRUE),
((SELECT id FROM preguntas WHERE numero = 35 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '44', FALSE);

-- Pregunta 36
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 36, '¿Cuál de las siguientes ecuaciones permite calcular el valor de x?', 'En la figura se presentan las medidas de tres segmentos: (2x + 15) cm, x cm, y (2x + 10) cm, con los que se puede construir un triángulo rectángulo.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 36 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'x² + 20x + 125 = 0', FALSE),
((SELECT id FROM preguntas WHERE numero = 36 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '7x² + 100x + 325 = 0', FALSE),
((SELECT id FROM preguntas WHERE numero = 36 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '9x² + 100x + 325 = 0', FALSE),
((SELECT id FROM preguntas WHERE numero = 36 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'x² - 20x - 125 = 0', TRUE);

-- Pregunta 37
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 37, '¿Cuánto dinero ahorró si compró 18 entradas en esos 6 meses?', 'Una compañía de teatro ofrece un plan mensual: $9000 fijos + $1000 por entrada (20% del precio sin plan). Una persona contrató el plan por 6 meses.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 37 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '$60000', FALSE),
((SELECT id FROM preguntas WHERE numero = 37 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '$45000', FALSE),
((SELECT id FROM preguntas WHERE numero = 37 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '$18000', TRUE),
((SELECT id FROM preguntas WHERE numero = 37 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '$15000', FALSE);

-- Pregunta 38
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 38, '¿Cuál de las siguientes funciones es el nuevo modelo de cobro de la psicóloga?', 'Una psicóloga usa f(x) = 30000x como modelo de cobro. Quiere ajustarlo con tarifa fija y tarifa por sesión: la primera sesión igual que antes, el resto 20% más económico.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 38 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'g(x) = 24000x', FALSE),
((SELECT id FROM preguntas WHERE numero = 38 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'h(x) = 24000x + 6000', TRUE),
((SELECT id FROM preguntas WHERE numero = 38 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'p(x) = 18000x + 12000', FALSE),
((SELECT id FROM preguntas WHERE numero = 38 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'r(x) = 12000x + 18000', FALSE);

-- Pregunta 39
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 39, '¿Cuál de las siguientes funciones modela el nuevo costo, en pesos?', 'En una empresa lechera, el costo de procesar x litros de leche se modela mediante f(x) = 300x + 500. La empresa encontró una forma de reducir ese costo un 25%.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 39 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'm(x) = 300x + 475', FALSE),
((SELECT id FROM preguntas WHERE numero = 39 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'g(x) = 225x + 500', FALSE),
((SELECT id FROM preguntas WHERE numero = 39 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'h(x) = 225x + 375', TRUE),
((SELECT id FROM preguntas WHERE numero = 39 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'p(x) = 75x + 475', FALSE);

-- Pregunta 40
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 40, '¿Cuál es el valor de f(1) + f(2) + f(3) + f(4)?', 'Considera la función f definida por f(n) = 10 + 25n - 5n², tal que n es un número real.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 40 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '120', FALSE),
((SELECT id FROM preguntas WHERE numero = 40 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '140', TRUE),
((SELECT id FROM preguntas WHERE numero = 40 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '195', FALSE),
((SELECT id FROM preguntas WHERE numero = 40 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '440', FALSE);

-- Pregunta 41
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 41, '¿Cuál de las siguientes afirmaciones es verdadera al comparar ambas formas de producción?', 'Una empresa estudia los efectos de cambiar su forma de producción. Con ambas formas, el costo por unidad se modela a través de una función cuadrática. Se presenta un gráfico comparativo.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 41 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Siempre es más conveniente cambiar a la forma de producción nueva.', FALSE),
((SELECT id FROM preguntas WHERE numero = 41 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'El costo de producir cero productos es igual en ambas formas de producción.', FALSE),
((SELECT id FROM preguntas WHERE numero = 41 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Cuando se producen más de cien unidades, la forma de producción antigua genera un menor costo por unidad.', TRUE),
((SELECT id FROM preguntas WHERE numero = 41 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'El menor costo por unidad posible de la forma de producción antigua es menor que el de la nueva.', FALSE);

-- Pregunta 42
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 42, '¿Cuál de las siguientes afirmaciones se puede deducir del gráfico?', 'La altura que alcanza el salto de un tipo de grillo se representa por una parábola que muestra altura vs tiempo.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 42 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'En 0,75 s, el grillo está a 30 cm de altura.', TRUE),
((SELECT id FROM preguntas WHERE numero = 42 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'En 1 s, el grillo alcanza su mayor altura.', FALSE),
((SELECT id FROM preguntas WHERE numero = 42 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Solo a los 1,5 s, el grillo alcanza una altura de 30 cm.', FALSE),
((SELECT id FROM preguntas WHERE numero = 42 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'A los 3 s, el grillo está bajo tierra.', FALSE);

-- Pregunta 43
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 43, '¿Cuántos logos se pueden construir con las medidas anteriores?', 'Una empresa necesita realizar un logo compuesto por una letra N y una letra X, con 50 metros lineales de acero. Las dimensiones mostradas indican que cada letra requiere cierta cantidad de metros.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 43 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '8', FALSE),
((SELECT id FROM preguntas WHERE numero = 43 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '4', FALSE),
((SELECT id FROM preguntas WHERE numero = 43 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2', TRUE),
((SELECT id FROM preguntas WHERE numero = 43 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '1', FALSE);

-- Pregunta 44
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 44, '¿Cuál de las siguientes fórmulas permite determinar la distancia entre A y B (D_AB) de manera que el respaldo quede perpendicular al asiento?', 'Una fábrica hace sillas de escritorio que se pueden reclinar hasta en un ángulo de 135°.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 44 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'D_AB = AO + BO', FALSE),
((SELECT id FROM preguntas WHERE numero = 44 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'D_AB = √(AO² + BO²)', TRUE),
((SELECT id FROM preguntas WHERE numero = 44 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'D_AB = √(2AO²)', FALSE),
((SELECT id FROM preguntas WHERE numero = 44 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'D_AB = √(2AO² - BO)', FALSE);

-- Pregunta 45
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 45, '¿Cuál de las siguientes expresiones permite determinar el largo, en cm, de la cinta a usar en cada caja?', 'En una tienda tienen cajas de regalo de forma cúbica con una cinta pegada en su diagonal (de vértice a vértice) en la cara superior. Si la altura de cada caja se representa por h cm.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 45 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'h√2', TRUE),
((SELECT id FROM preguntas WHERE numero = 45 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2√h', FALSE),
((SELECT id FROM preguntas WHERE numero = 45 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2h', FALSE),
((SELECT id FROM preguntas WHERE numero = 45 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '2h²', FALSE);

-- Pregunta 46
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 46, '¿Cuál es el radio de Q?', 'Se tiene una circunferencia P de radio 3 cm. Si el área de una circunferencia Q es un cuarto del área de P.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 46 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '3/4 cm', FALSE),
((SELECT id FROM preguntas WHERE numero = 46 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '6 cm', FALSE),
((SELECT id FROM preguntas WHERE numero = 46 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '3/2 cm', TRUE),
((SELECT id FROM preguntas WHERE numero = 46 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '12 cm', FALSE);

-- Pregunta 47
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 47, '¿Cuánto debe medir de altura el vaso milimetrado de Axel?', 'Una profesora dejó como tarea hacer un vaso milimetrado de capacidad máxima 600 cm³, sellando cualquier tubo cilíndrico en su parte inferior. Consideren π aproximado a 3 y Axel usará un tubo de 4 cm de radio.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 47 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '5 cm', FALSE),
((SELECT id FROM preguntas WHERE numero = 47 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '12,5 cm', TRUE),
((SELECT id FROM preguntas WHERE numero = 47 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '25 cm', FALSE),
((SELECT id FROM preguntas WHERE numero = 47 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '37,5 cm', FALSE);

-- Pregunta 48
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 48, '¿Cuál es el área del edificio, considerando solo las superficies laterales y el techo, en metros cuadrados?', 'En la figura se presentan las medidas de las aristas de un edificio con forma de paralelepípedo recto, en términos de x: 2x, 2x, y 2³x de altura.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 48 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '32x²', FALSE),
((SELECT id FROM preguntas WHERE numero = 48 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '36x²', TRUE),
((SELECT id FROM preguntas WHERE numero = 48 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '68x²', FALSE),
((SELECT id FROM preguntas WHERE numero = 48 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '512x²', FALSE);

-- Pregunta 49
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 49, '¿Cuál es el valor de a y b respectivamente?', 'Considera los vectores en el plano cartesiano F₁ = (2, -1), F₂ = (-3, 2), F₃ = (a,b) y F₄ = (4, 3). Si F₁ + F₂ + F₃ + F₄ = (6, 5).');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 49 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '3 y 4', FALSE),
((SELECT id FROM preguntas WHERE numero = 49 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '3 y 9', FALSE),
((SELECT id FROM preguntas WHERE numero = 49 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '3 y 1', TRUE),
((SELECT id FROM preguntas WHERE numero = 49 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '4 y 4', FALSE);

-- Pregunta 50
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 50, '¿Cuál de las siguientes condiciones permite asegurar que el triángulo ABC es rectángulo?', 'En la figura se presentan los puntos A(1, 1), B(4, 2) y C(5, -1), y los vectores u, v y w.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 50 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Que el vector w es la suma de los vectores u y v.', FALSE),
((SELECT id FROM preguntas WHERE numero = 50 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Que el perímetro del triángulo ABC es igual a √20 + 2√10.', FALSE),
((SELECT id FROM preguntas WHERE numero = 50 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Que los módulos de los vectores u y v son iguales.', FALSE),
((SELECT id FROM preguntas WHERE numero = 50 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'Que el área del triángulo ABC es igual a (AB · BC)/2.', TRUE);

-- Pregunta 51
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 51, '¿Cuál de las siguientes expresiones permite determinar la distancia entre los puntos A y B?', 'Considera un punto A, tal que este es cualquier punto que se ubica en el primer o tercer cuadrante, de tal manera que al reflejarlo respecto al eje Y se obtiene el punto B. Si x es la distancia del punto A al eje Y.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 51 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '2x√2', FALSE),
((SELECT id FROM preguntas WHERE numero = 51 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'x', FALSE),
((SELECT id FROM preguntas WHERE numero = 51 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2x', TRUE),
((SELECT id FROM preguntas WHERE numero = 51 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '3x', FALSE);

-- Pregunta 52
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 52, '¿En cuál de los pasos se cometió el error?', 'Una persona lleva a cabo transformaciones isométricas consecutivas al punto (-5, 5): Paso 1: traslada según vector (5, -2) obteniendo (0, 7). Paso 2: rota 90° horario con centro en origen obteniendo (7, 0). Paso 3: refleja respecto al eje Y obteniendo (-7, 0). Paso 4: refleja respecto al eje X obteniendo (-7, 0).');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 52 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'En el Paso 1', FALSE),
((SELECT id FROM preguntas WHERE numero = 52 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'En el Paso 2', FALSE),
((SELECT id FROM preguntas WHERE numero = 52 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'En el Paso 3', FALSE),
((SELECT id FROM preguntas WHERE numero = 52 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'En el Paso 4', TRUE);

-- Pregunta 53
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 53, '¿Cuál de los siguientes es el vector de traslación que permite trasladarse de la casa de Juan a la casa de Pedro?', 'Para llegar a casa de Diego, Juan debe caminar 2 cuadras al este y 5 al sur. Para llegar a casa de Pedro desde Diego, debe caminar 1 cuadra al este y 1 al sur. Se grafica considerando la casa de Juan en el origen.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 53 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '(-3, -6)', FALSE),
((SELECT id FROM preguntas WHERE numero = 53 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '(-3, 6)', FALSE),
((SELECT id FROM preguntas WHERE numero = 53 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '(3, -6)', TRUE),
((SELECT id FROM preguntas WHERE numero = 53 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '(3, 6)', FALSE);

-- Pregunta 54
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 54, '¿Cuál de los siguientes gráficos representa correctamente la información entregada en la tabla?', 'En una oficina se preguntó a las personas cuántas horas extraordinarias trabajaron el mes anterior. Horas: 1 (freq 5), 2 (freq 3), 3 (freq 2).');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 54 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Gráfico A', TRUE),
((SELECT id FROM preguntas WHERE numero = 54 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Gráfico B', FALSE),
((SELECT id FROM preguntas WHERE numero = 54 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Gráfico C', FALSE),
((SELECT id FROM preguntas WHERE numero = 54 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'Gráfico D', FALSE);

-- Pregunta 55
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 55, '¿Cuál de las siguientes tablas representa los sueldos de las personas de la empresa, en millones de pesos?', 'Una empresa realizó una investigación sobre los sueldos y agrupó la información en un histograma con intervalos [1,2[, [2,3[, [3,4[, [4,5[ con frecuencias 7, 5, 2, 1 respectivamente.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 55 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Tabla A: Sueldos 1,5; 2,5; 3,5; 4,5 con frecuencias 7; 12; 14; 15', FALSE),
((SELECT id FROM preguntas WHERE numero = 55 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Tabla B: Sueldos [1,2[; [2,3[; [3,4[; [4,5[ con frecuencias 7; 12; 14; 15', FALSE),
((SELECT id FROM preguntas WHERE numero = 55 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Tabla C: Sueldos [1,2[; [2,3[; [3,4[; [4,5[ con frecuencias 7; 5; 2; 1', TRUE),
((SELECT id FROM preguntas WHERE numero = 55 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'Tabla D: Sueldos 1,5; 2,5; 3,5; 4,5 con frecuencias 7; 5; 2; 1', FALSE);

-- Pregunta 56
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 56, '¿Cuál de las siguientes afirmaciones es verdadera?', 'Considera el siguiente grupo de datos: 12, 6, 14, 12 y 16.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 56 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'El rango del grupo de datos es 4.', FALSE),
((SELECT id FROM preguntas WHERE numero = 56 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'El promedio de los datos es 12.', TRUE),
((SELECT id FROM preguntas WHERE numero = 56 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'La mediana de los datos es 14.', FALSE),
((SELECT id FROM preguntas WHERE numero = 56 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'La moda de los datos es 16.', FALSE);

-- Pregunta 57
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 57, '¿Cuál producto registró un mayor promedio de ventas semanal?', 'Tabla presenta total de unidades vendidas durante 5 semanas: Producto 1 (120), 2 (200), 3 (200), 4 (250). Una semana después: productos 1 y 2 registraron 80 unidades cada uno, producto 3 registró 100 unidades y producto 4 registró 40 unidades.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 57 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'El producto 1', FALSE),
((SELECT id FROM preguntas WHERE numero = 57 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'El producto 2', FALSE),
((SELECT id FROM preguntas WHERE numero = 57 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'El producto 3', TRUE),
((SELECT id FROM preguntas WHERE numero = 57 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'El producto 4', FALSE);

-- Pregunta 58
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 58, '¿Cuál de las siguientes afirmaciones es verdadera?', 'Se presentan distribuciones de edad de dos grupos: Grupo A: 10 años (5), 14 años (2), 17 años (1), 25 años (4). Grupo B: 8 años (3), 13 años (1), 17 años (2), 25 años (4).');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 58 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'El rango de la edad en el grupo A es mayor que el rango de la edad en el grupo B.', FALSE),
((SELECT id FROM preguntas WHERE numero = 58 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'La moda de la edad del grupo A es 15 años menor que la del grupo B.', FALSE),
((SELECT id FROM preguntas WHERE numero = 58 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'La mediana de la edad del grupo A es mayor que la mediana de la edad del grupo B.', FALSE),
((SELECT id FROM preguntas WHERE numero = 58 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'El rango de la edad de ambos grupos es 25 años.', FALSE);

-- Pregunta 59
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 59, '¿Cuál es el promedio de la cantidad de familiares en el extranjero que tienen estas familias?', 'Se encuestó a doce familias respecto a la cantidad de familiares en el extranjero: 4, 1, 1, 0, 3, 2, 2, 3, 0, 1, 1, 6.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 59 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '1', FALSE),
((SELECT id FROM preguntas WHERE numero = 59 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '2', TRUE),
((SELECT id FROM preguntas WHERE numero = 59 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '2,4', FALSE),
((SELECT id FROM preguntas WHERE numero = 59 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '3', FALSE);

-- Pregunta 60
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 60, '¿Cuál de las siguientes afirmaciones respecto del ingreso de una vecina de la comuna asegura que puede optar a este subsidio?', 'Una municipalidad ofrece un subsidio para mejoramiento de infraestructura del hogar a todos los habitantes que pertenecen al 60% de menores ingresos de la población del país.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 60 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Que sea mayor que el percentil 20 de los ingresos de la población del país.', FALSE),
((SELECT id FROM preguntas WHERE numero = 60 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Que sea menor que el percentil 40 de los ingresos de la población del país.', FALSE),
((SELECT id FROM preguntas WHERE numero = 60 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Que sea igual que el percentil 50 de los ingresos de la población de la comuna.', FALSE),
((SELECT id FROM preguntas WHERE numero = 60 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'Que sea igual que el percentil 60 de los ingresos de la población de la comuna.', TRUE);

-- Pregunta 61
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 61, '¿Cuál es la ciudad que tuvo la menor diferencia entre la temperatura máxima y mínima registrada, según la figura?', 'En la figura se resumen las temperaturas del aire cerca de la superficie de cinco ciudades en cierto año mediante diagramas de caja.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 61 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'Tombuctú', FALSE),
((SELECT id FROM preguntas WHERE numero = 61 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', 'Reikiavik', FALSE),
((SELECT id FROM preguntas WHERE numero = 61 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', 'Calama', FALSE),
((SELECT id FROM preguntas WHERE numero = 61 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', 'La Habana', TRUE);

-- Pregunta 62
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 62, '¿Cuál de los siguientes percentiles supera los 100 g?', 'Los siguientes datos corresponden a la masa de los tomates cosechados en un huerto: 75g, 77g, 84g, 98g, 101g, 116g, 129g, 132g, 145g, 152g, 163g y 176g.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 62 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '10', FALSE),
((SELECT id FROM preguntas WHERE numero = 62 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '20', FALSE),
((SELECT id FROM preguntas WHERE numero = 62 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '30', FALSE),
((SELECT id FROM preguntas WHERE numero = 62 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '40', TRUE);

-- Pregunta 63
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 63, '¿Cuál es la probabilidad de que la suma de los números de las fichas sea un número par?', 'Una caja contiene 5 fichas numeradas del 1 al 5 y otra caja contiene 5 fichas numeradas del 6 al 10. Se selecciona una ficha al azar de cada caja.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 63 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '1/12', FALSE),
((SELECT id FROM preguntas WHERE numero = 63 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '1/4', FALSE),
((SELECT id FROM preguntas WHERE numero = 63 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '12/25', TRUE),
((SELECT id FROM preguntas WHERE numero = 63 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '4/25', FALSE);

-- Pregunta 64
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 64, '¿Cuál de las siguientes expresiones permite calcular la probabilidad de que al elegir a una persona al azar esta hable español?', 'A una reunión internacional asistirán personas que hablan francés, inglés y español. Seis solo hablan francés, diez solo hablan inglés, tres personas hablan los tres idiomas. Si x es la cantidad de personas que solo hablan español y no hay personas que hablen dos idiomas.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 64 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', 'x/(19 + x)', FALSE),
((SELECT id FROM preguntas WHERE numero = 64 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '1/(x + 3)', FALSE),
((SELECT id FROM preguntas WHERE numero = 64 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '(x + 3)/19', FALSE),
((SELECT id FROM preguntas WHERE numero = 64 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '(x + 3)/(x + 19)', TRUE);

-- Pregunta 65
INSERT INTO preguntas (examen_id, numero, enunciado, contexto) VALUES 
((SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024'), 65, '¿Cuántos números de la rifa compró ese estudiante?', 'Un curso vende una rifa para juntar dinero para un paseo. La rifa tiene 250 números distintos, todos con la misma probabilidad de ser sorteados. El profesor le dice a un estudiante que compró números de la rifa, que tiene una probabilidad de 1/50 de ganarla.');

INSERT INTO opciones_respuesta (pregunta_id, letra, contenido, es_correcta) VALUES
((SELECT id FROM preguntas WHERE numero = 65 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'A', '1', FALSE),
((SELECT id FROM preguntas WHERE numero = 65 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'B', '5', TRUE),
((SELECT id FROM preguntas WHERE numero = 65 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'C', '50', FALSE),
((SELECT id FROM preguntas WHERE numero = 65 AND examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024')), 'D', '51', FALSE);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_preguntas_examen_numero ON preguntas(examen_id, numero);
CREATE INDEX IF NOT EXISTS idx_opciones_pregunta ON opciones_respuesta(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_examenes_codigo ON examenes(codigo);
CREATE INDEX IF NOT EXISTS idx_opciones_correcta ON opciones_respuesta(es_correcta);

-- Crear función para obtener examen completo
CREATE OR REPLACE FUNCTION obtener_examen_completo(codigo_examen VARCHAR)
RETURNS JSON AS $
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'examen', json_build_object(
            'id', e.id,
            'codigo', e.codigo,
            'nombre', e.nombre,
            'tipo', e.tipo,
            'año', e.año,
            'duracion_minutos', e.duracion_minutos,
            'total_preguntas', e.total_preguntas,
            'preguntas_validas', e.preguntas_validas,
            'instrucciones', e.instrucciones
        ),
        'preguntas', COALESCE(json_agg(
            json_build_object(
                'numero', p.numero,
                'enunciado', p.enunciado,
                'contexto', p.contexto,
                'opciones', p.opciones
            ) ORDER BY p.numero
        ), '[]'::json)
    ) INTO resultado
    FROM examenes e
    LEFT JOIN (
        SELECT 
            p.*,
            json_agg(
                json_build_object(
                    'letra', o.letra,
                    'contenido', o.contenido,
                    'es_correcta', o.es_correcta
                ) ORDER BY o.letra
            ) as opciones
        FROM preguntas p
        LEFT JOIN opciones_respuesta o ON p.id = o.pregunta_id
        WHERE p.examen_id = (SELECT id FROM examenes WHERE codigo = codigo_examen)
        GROUP BY p.id, p.numero, p.enunciado, p.contexto, p.examen_id
    ) p ON e.id = p.examen_id
    WHERE e.codigo = codigo_examen
    GROUP BY e.id, e.codigo, e.nombre, e.tipo, e.año, e.duracion_minutos, e.total_preguntas, e.preguntas_validas, e.instrucciones;
    
    RETURN resultado;
END;
$ LANGUAGE plpgsql;

-- Función para obtener respuestas correctas
CREATE OR REPLACE FUNCTION obtener_respuestas_correctas(codigo_examen VARCHAR)
RETURNS TABLE(numero_pregunta INTEGER, respuesta_correcta CHAR(1)) AS $
BEGIN
    RETURN QUERY
    SELECT p.numero, o.letra
    FROM preguntas p
    JOIN opciones_respuesta o ON p.id = o.pregunta_id
    JOIN examenes e ON p.examen_id = e.id
    WHERE e.codigo = codigo_examen AND o.es_correcta = TRUE
    ORDER BY p.numero;
END;
$ LANGUAGE plpgsql;

-- Función para obtener estadísticas del examen
CREATE OR REPLACE FUNCTION obtener_estadisticas_examen(codigo_examen VARCHAR)
RETURNS JSON AS $
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'total_preguntas', COUNT(*),
        'preguntas_por_respuesta', json_object_agg(o.letra, COUNT(o.letra))
    ) INTO resultado
    FROM preguntas p
    JOIN opciones_respuesta o ON p.id = o.pregunta_id AND o.es_correcta = TRUE
    JOIN examenes e ON p.examen_id = e.id
    WHERE e.codigo = codigo_examen;
    
    RETURN resultado;
END;
$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER update_examenes_updated_at 
    BEFORE UPDATE ON examenes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Crear vista para consulta rápida de exámenes
CREATE OR REPLACE VIEW vista_examenes_completos AS
SELECT 
    e.codigo,
    e.nombre,
    e.año,
    COUNT(p.id) as total_preguntas_cargadas,
    COUNT(CASE WHEN o.es_correcta = TRUE THEN 1 END) as total_respuestas_correctas
FROM examenes e
LEFT JOIN preguntas p ON e.id = p.examen_id
LEFT JOIN opciones_respuesta o ON p.id = o.pregunta_id
GROUP BY e.id, e.codigo, e.nombre, e.año
ORDER BY e.año DESC, e.codigo;

-- Insertar metadatos adicionales
UPDATE examenes 
SET instrucciones = 'PAES 2024 - COMPETENCIA MATEMÁTICA 1: Esta prueba contiene 65 preguntas, 60 de las cuales serán consideradas para el cálculo del puntaje final. Las preguntas tienen 4 opciones de respuesta (A, B, C y D) donde solo una de ellas es correcta. No se descuenta puntaje por respuestas erradas. Tiempo: 2 horas y 20 minutos. Registro de Propiedad Intelectual Nº 2023-A-8887 Universidad de Chile.'
WHERE codigo = 'FORMA_113_2024';

-- CONSULTAS ÚTILES PARA VERIFICAR LA CARGA:

-- Verificar que todas las preguntas están cargadas
-- SELECT COUNT(*) FROM preguntas WHERE examen_id = (SELECT id FROM examenes WHERE codigo = 'FORMA_113_2024');

-- Verificar que todas las opciones están cargadas (debería ser 260: 65 preguntas × 4 opciones)
-- SELECT COUNT(*) FROM opciones_respuesta o 
-- JOIN preguntas p ON o.pregunta_id = p.id 
-- JOIN examenes e ON p.examen_id = e.id 
-- WHERE e.codigo = 'FORMA_113_2024';

-- Ver distribución de respuestas correctas
-- SELECT o.letra, COUNT(*) as cantidad
-- FROM opciones_respuesta o 
-- JOIN preguntas p ON o.pregunta_id = p.id 
-- JOIN examenes e ON p.examen_id = e.id 
-- WHERE e.codigo = 'FORMA_113_2024' AND o.es_correcta = TRUE
-- GROUP BY o.letra ORDER BY o.letra;

-- Obtener examen completo
-- SELECT obtener_examen_completo('FORMA_113_2024');

-- Obtener solo las respuestas correctas
-- SELECT * FROM obtener_respuestas_correctas('FORMA_113_2024');

-- Ver estadísticas del examen
-- SELECT obtener_estadisticas_examen('FORMA_113_2024');

-- Ver vista resumen
-- SELECT * FROM vista_examenes_completos;

COMMIT;