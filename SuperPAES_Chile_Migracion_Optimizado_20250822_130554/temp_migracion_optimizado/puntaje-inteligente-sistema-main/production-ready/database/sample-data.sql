-- Insert sample data for beneficios
INSERT INTO beneficios_estudiantiles.beneficios (
    tipo_beneficio_id,
    nombre,
    descripcion,
    requisitos,
    monto_maximo,
    cobertura_matricula,
    cobertura_arancel,
    cobertura_mantencion,
    porcentaje_cobertura,
    fecha_apertura_postulacion,
    fecha_cierre_postulacion
) VALUES 
(1, 'Gratuidad Universitaria 2025', 
 'Beneficio que cubre el 100% del arancel y matrícula', 
 '{"quintil_maximo": 6, "nem_minimo": 5.0, "paes_minimo": 450}',
 NULL, true, true, false, 100,
 '2024-10-01', '2024-10-22'),

(2, 'Beca Excelencia Académica 2025', 
 'Para estudiantes del 10% superior', 
 '{"ranking": "top_10", "nem_minimo": 6.0, "paes_minimo": 600}',
 1850000, true, true, false, 100,
 '2024-10-01', '2024-10-22'),

(3, 'Beca Juan Gómez Millas 2025', 
 'Beca para estudiantes destacados', 
 '{"quintil_maximo": 7, "nem_minimo": 5.5, "paes_minimo": 500}',
 1150000, false, true, false, 70,
 '2024-10-01', '2024-10-22'),

(4, 'Beca Bicentenario 2025', 
 'Para estudiantes de universidades CRUCH', 
 '{"quintil_maximo": 7, "nem_minimo": 5.0, "paes_minimo": 500, "universidad": "cruch"}',
 1150000, false, true, false, 70,
 '2024-10-01', '2024-10-22'),

(5, 'Beca Mantención JUNAEB 2025', 
 'Apoyo económico mensual', 
 '{"quintil_maximo": 6, "beneficiario_otro": true}',
 320000, false, false, true, 100,
 '2024-10-01', '2024-10-22');

-- Insert sample fechas importantes
INSERT INTO beneficios_estudiantiles.fechas_importantes (
    proceso,
    descripcion,
    fecha_inicio,
    fecha_fin,
    prioridad,
    link_proceso,
    categoria
) VALUES 
('FUAS Primer Período', 
 'Postulación a beneficios estudiantiles primer período', 
 '2024-10-01', '2024-10-22', 1,
 'https://fuas.cl', 'beneficios'),

('PAES Regular', 
 'Rendición PAES proceso regular', 
 '2024-12-02', '2024-12-03', 1,
 'https://demre.cl', 'admision'),

('Resultados PAES', 
 'Publicación resultados PAES', 
 '2025-01-05', '2025-01-05', 1,
 'https://demre.cl', 'admision'),

('Postulación Universidades', 
 'Período de postulación centralizada', 
 '2025-01-06', '2025-01-09', 1,
 'https://acceso.mineduc.cl', 'admision'),

('Resultados Selección', 
 'Resultados selección universitaria', 
 '2025-01-23', '2025-01-23', 1,
 'https://acceso.mineduc.cl', 'admision'),

('FUAS Segundo Período', 
 'Postulación a beneficios estudiantiles segundo período', 
 '2025-02-13', '2025-03-13', 2,
 'https://fuas.cl', 'beneficios'),

('Matrícula Primer Período', 
 'Primer período de matrícula', 
 '2025-01-24', '2025-01-26', 1,
 'https://acceso.mineduc.cl', 'matricula'),

('Matrícula Segundo Período', 
 'Segundo período de matrícula', 
 '2025-01-27', '2025-01-29', 2,
 'https://acceso.mineduc.cl', 'matricula'),

('Resultados Beneficios Primer Período', 
 'Resultados postulación beneficios primer período', 
 '2025-01-15', '2025-01-15', 1,
 'https://beneficiosestudiantiles.cl', 'beneficios'),

('Resultados Beneficios Segundo Período', 
 'Resultados postulación beneficios segundo período', 
 '2025-03-25', '2025-03-25', 2,
 'https://beneficiosestudiantiles.cl', 'beneficios');

-- Insert sample beneficios privados
INSERT INTO beneficios_estudiantiles.beneficios_privados (
    universidad_id,
    nombre,
    descripcion,
    carreras_aplicables,
    requisitos,
    monto_beneficio,
    cupos_disponibles,
    fecha_apertura,
    fecha_cierre
) VALUES 
(1, 'Beca Excelencia UCH', 
 'Beca para estudiantes destacados de la Universidad de Chile', 
 ARRAY['Todas'],
 '{"nem_minimo": 6.5, "ranking": "top_5"}',
 4500000, 50,
 '2025-01-24', '2025-01-26'),

(2, 'Beca Talento UC', 
 'Beca para talentos destacados', 
 ARRAY['Ingeniería', 'Medicina', 'Derecho'],
 '{"nem_minimo": 6.5, "paes_minimo": 750}',
 5000000, 30,
 '2025-01-24', '2025-01-26'),

(3, 'Beca Inclusión USACH', 
 'Beca para promover la inclusión', 
 ARRAY['Todas'],
 '{"quintil_maximo": 6, "region": "RM"}',
 2500000, 100,
 '2025-01-24', '2025-01-29');

-- Recreate the view with corrected column references
CREATE OR REPLACE VIEW beneficios_estudiantiles.v_beneficios_disponibles AS
SELECT 
    b.id,
    b.nombre,
    tb.codigo as tipo_codigo,
    tb.nombre as tipo_nombre,
    b.monto_maximo,
    b.cobertura_matricula,
    b.cobertura_arancel,
    b.cobertura_mantencion,
    b.porcentaje_cobertura,
    b.fecha_apertura_postulacion,
    b.fecha_cierre_postulacion,
    b.activo,
    b.requisitos
FROM beneficios_estudiantiles.beneficios b
JOIN beneficios_estudiantiles.tipos_beneficios tb ON b.tipo_beneficio_id = tb.id
WHERE b.activo = true 
AND CURRENT_DATE BETWEEN b.fecha_apertura_postulacion AND b.fecha_cierre_postulacion;
