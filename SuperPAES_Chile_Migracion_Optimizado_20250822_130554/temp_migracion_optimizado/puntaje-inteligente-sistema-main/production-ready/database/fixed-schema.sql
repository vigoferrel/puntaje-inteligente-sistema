-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create schema
CREATE SCHEMA IF NOT EXISTS beneficios_estudiantiles;

-- Base tables
CREATE TABLE IF NOT EXISTS beneficios_estudiantiles.fechas_importantes (
    id SERIAL PRIMARY KEY,
    proceso VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    prioridad INTEGER CHECK (prioridad BETWEEN 1 AND 5),
    link_proceso VARCHAR(200),
    categoria VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficios_estudiantiles.tipos_beneficios (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    tipo VARCHAR(50),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficios_estudiantiles.beneficios (
    id SERIAL PRIMARY KEY,
    tipo_beneficio_id INTEGER REFERENCES beneficios_estudiantiles.tipos_beneficios(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    requisitos JSONB NOT NULL DEFAULT '{}',
    monto_maximo INTEGER,
    cobertura_matricula BOOLEAN DEFAULT false,
    cobertura_arancel BOOLEAN DEFAULT false,
    cobertura_mantencion BOOLEAN DEFAULT false,
    porcentaje_cobertura INTEGER CHECK (porcentaje_cobertura BETWEEN 0 AND 100),
    fecha_apertura_postulacion DATE,
    fecha_cierre_postulacion DATE,
    activo BOOLEAN DEFAULT true,
    documentos_requeridos TEXT[],
    condiciones_especiales TEXT,
    url_mas_info VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficios_estudiantiles.instituciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(50),
    region VARCHAR(100),
    sitio_web VARCHAR(200),
    contacto_admision VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficios_estudiantiles.beneficios_privados (
    id SERIAL PRIMARY KEY,
    universidad_id INTEGER REFERENCES beneficios_estudiantiles.instituciones(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    carreras_aplicables TEXT[],
    requisitos JSONB NOT NULL DEFAULT '{}',
    monto_beneficio INTEGER,
    cupos_disponibles INTEGER,
    fecha_apertura DATE,
    fecha_cierre DATE,
    activo BOOLEAN DEFAULT true,
    documentos_requeridos TEXT[],
    url_postulacion VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fechas_importantes_proceso ON beneficios_estudiantiles.fechas_importantes(proceso);
CREATE INDEX IF NOT EXISTS idx_fechas_importantes_fecha ON beneficios_estudiantiles.fechas_importantes(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_beneficios_tipo ON beneficios_estudiantiles.beneficios(tipo_beneficio_id);
CREATE INDEX IF NOT EXISTS idx_beneficios_activos ON beneficios_estudiantiles.beneficios(activo);
CREATE INDEX IF NOT EXISTS idx_beneficios_fechas ON beneficios_estudiantiles.beneficios(fecha_apertura_postulacion, fecha_cierre_postulacion);
CREATE INDEX IF NOT EXISTS idx_beneficios_privados_universidad ON beneficios_estudiantiles.beneficios_privados(universidad_id);
CREATE INDEX IF NOT EXISTS idx_beneficios_privados_activos ON beneficios_estudiantiles.beneficios_privados(activo);

-- Initial data
INSERT INTO beneficios_estudiantiles.instituciones (nombre, tipo, region, sitio_web) VALUES 
('Universidad de Chile', 'Estatal', 'Región Metropolitana', 'https://www.uchile.cl'),
('Pontificia Universidad Católica de Chile', 'Privada', 'Región Metropolitana', 'https://www.uc.cl'),
('Universidad de Santiago de Chile', 'Estatal', 'Región Metropolitana', 'https://www.usach.cl'),
('Universidad de Concepción', 'Privada', 'Región del Biobío', 'https://www.udec.cl'),
('Universidad Técnica Federico Santa María', 'Privada', 'Región de Valparaíso', 'https://www.usm.cl');

INSERT INTO beneficios_estudiantiles.tipos_beneficios (codigo, nombre, categoria, tipo, descripcion) VALUES
('GRAT', 'Gratuidad', 'estatal', 'arancel', 'Beneficio que cubre el 100% del arancel y matrícula'),
('BEA', 'Beca Excelencia Académica', 'estatal', 'arancel', 'Para estudiantes del 10% superior de su generación'),
('BJGM', 'Beca Juan Gómez Millas', 'estatal', 'arancel', 'Para estudiantes de excelencia académica'),
('BBM', 'Beca Bicentenario', 'estatal', 'arancel', 'Para estudiantes de universidades del CRUCH'),
('BMES', 'Beca Mantención Educación Superior', 'estatal', 'mantencion', 'Apoyo económico para gastos de mantención');

-- Create views
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

-- Functions
CREATE OR REPLACE FUNCTION beneficios_estudiantiles.proximas_fechas_importantes(
    p_dias INTEGER DEFAULT 30
) RETURNS TABLE (
    proceso VARCHAR,
    descripcion TEXT,
    fecha_inicio DATE,
    dias_restantes INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fi.proceso,
        fi.descripcion,
        fi.fecha_inicio,
        (fi.fecha_inicio - CURRENT_DATE)::INTEGER as dias_restantes
    FROM beneficios_estudiantiles.fechas_importantes fi
    WHERE fi.fecha_inicio >= CURRENT_DATE
    AND fi.fecha_inicio <= CURRENT_DATE + (p_dias || ' days')::INTERVAL
    ORDER BY fi.fecha_inicio;
END;
$$ LANGUAGE plpgsql;

-- Initial indexes for performance
CREATE INDEX IF NOT EXISTS idx_fechas_importantes_proximas ON beneficios_estudiantiles.fechas_importantes(fecha_inicio, prioridad);
