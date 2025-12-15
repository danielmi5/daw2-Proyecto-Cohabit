-- Script de inicialización de la base de datos Cohabit
-- Se insertan datos de prueba para todas las tablas del sistema

-- Limpia las tablas en orden correcto respetando las foreign keys
TRUNCATE TABLE reglas_recurso RESTART IDENTITY CASCADE;
TRUNCATE TABLE reservas RESTART IDENTITY CASCADE;
TRUNCATE TABLE recursos RESTART IDENTITY CASCADE;
TRUNCATE TABLE miembros_grupo RESTART IDENTITY CASCADE;
TRUNCATE TABLE grupos RESTART IDENTITY CASCADE;
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;

-- Inserta usuarios de prueba
INSERT INTO usuarios (nombre, apellidos, email, password, foto_perfil, pais, ciudad, telefono, fecha_registro) VALUES
('Carlos', 'García López', 'carlos.garcia@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/men/1.jpg', 'España', 'Madrid', '+34600123456', NOW() - INTERVAL '120 days'),
('María', 'Fernández Ruiz', 'maria.fernandez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/women/2.jpg', 'España', 'Barcelona', '+34600234567', NOW() - INTERVAL '90 days'),
('José', 'Martínez Sánchez', 'jose.martinez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/men/3.jpg', 'España', 'Valencia', '+34600345678', NOW() - INTERVAL '75 days'),
('Ana', 'López Torres', 'ana.lopez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/women/4.jpg', 'España', 'Madrid', '+34600456789', NOW() - INTERVAL '60 days'),
('David', 'González Díaz', 'david.gonzalez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/men/5.jpg', 'España', 'Sevilla', '+34600567890', NOW() - INTERVAL '45 days'),
('Laura', 'Pérez Moreno', 'laura.perez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/women/6.jpg', 'España', 'Bilbao', '+34600678901', NOW() - INTERVAL '30 days'),
('Miguel', 'Rodríguez Vargas', 'miguel.rodriguez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/men/7.jpg', 'España', 'Granada', '+34600789012', NOW() - INTERVAL '20 days'),
('Elena', 'Sánchez Herrera', 'elena.sanchez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/women/8.jpg', 'España', 'Málaga', '+34600890123', NOW() - INTERVAL '15 days'),
('Pablo', 'Jiménez Castro', 'pablo.jimenez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/men/9.jpg', 'España', 'Zaragoza', '+34600901234', NOW() - INTERVAL '10 days'),
('Carmen', 'Romero Gil', 'carmen.romero@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://randomuser.me/api/portraits/women/10.jpg', 'España', 'Murcia', '+34600012345', NOW() - INTERVAL '5 days');

-- Inserta grupos de prueba

INSERT INTO grupos (nombre, direccion, descripcion, foto_grupo, codigo_invitacion, creador_id, fecha_creacion, fecha_actualizacion) VALUES
('Piso Chamberí', 'Calle Alonso Cano 42, Madrid', 'Grupo de convivencia de estudiantes en el barrio de Chamberí. Se comparten habitaciones, cocina y zonas comunes. Ambiente tranquilo y respetuoso.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'CHAMB123', 1, NOW() - INTERVAL '120 days', NOW()),
('Casa Barcelona Centro', 'Carrer de Balmes 156, Barcelona', 'Vivienda compartida en pleno Eixample. Perfecto para profesionales jóvenes. Cocina completamente equipada y terrazas amplias.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', 'BCN456', 4, NOW() - INTERVAL '90 days', NOW()),
('Residencia Valencia', 'Avenida Blasco Ibáñez 28, Valencia', 'Residencia universitaria cerca del campus. Normas de convivencia establecidas. Zonas de estudio compartidas.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f', 'VAL789', 7, NOW() - INTERVAL '75 days', NOW());

-- Inserta miembros del grupo con sus roles
INSERT INTO miembros_grupo (usuario_id, grupo_id, rol, fecha_union, activo) VALUES
(1, 1, 'CREADOR', NOW() - INTERVAL '120 days', true),
(2, 1, 'MIEMBRO', NOW() - INTERVAL '115 days', true),
(3, 1, 'MIEMBRO', NOW() - INTERVAL '110 days', true),
(4, 2, 'CREADOR', NOW() - INTERVAL '90 days', true),
(5, 2, 'MIEMBRO', NOW() - INTERVAL '85 days', true),
(6, 2, 'MIEMBRO', NOW() - INTERVAL '80 days', true),
(7, 3, 'CREADOR', NOW() - INTERVAL '75 days', true),
(8, 3, 'MIEMBRO', NOW() - INTERVAL '70 days', true),
(9, 3, 'MIEMBRO', NOW() - INTERVAL '65 days', true),
(10, 3, 'MIEMBRO', NOW() - INTERVAL '60 days', true);

-- Inserta recursos compartidos
INSERT INTO recursos (nombre, descripcion, foto_recurso, capacidad, ubicacion, tipo, estado_actual, grupo_id, miembro_grupo_id, numero, fecha_creacion, fecha_actualizacion) VALUES
('Habitación Principal', 'Habitación amplia con ventana exterior. Incluye cama doble, armario empotrado y escritorio. Excelente iluminación natural.', 'https://images.unsplash.com/photo-1540518614846-7eded433c457', 2, 'Primera planta', 'HABITACION', 'DISPONIBLE', 1, 1, 1, NOW() - INTERVAL '120 days', NOW()),
('Habitación Pequeña', 'Habitación individual acogedora. Perfecta para estudiante. Incluye cama individual y escritorio.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 1, 'Segunda planta', 'HABITACION', 'OCUPADO', 1, 1, 2, NOW() - INTERVAL '120 days', NOW()),
('Cocina Compartida', 'Cocina totalmente equipada con nevera, horno, microondas y lavavajillas. Amplia encimera para cocinar.', 'https://images.unsplash.com/photo-1556911220-bff31c812dba', 4, 'Planta baja', 'COCINA', 'DISPONIBLE', 1, 1, 3, NOW() - INTERVAL '120 days', NOW()),
('Baño Principal', 'Baño completo con ducha de hidromasaje. Incluye secador y espejo con iluminación LED.', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14', 1, 'Primera planta', 'BAÑO', 'DISPONIBLE', 1, 2, 4, NOW() - INTERVAL '115 days', NOW()),
('Aspiradora Robot', 'Robot aspirador Roomba con función de fregado. Ideal para mantener el piso limpio sin esfuerzo.', 'https://images.unsplash.com/photo-1558317374-067fb5f30001', 1, 'Almacén', 'OBJETO', 'DISPONIBLE', 1, 3, 5, NOW() - INTERVAL '100 days', NOW()),
('Habitación Suite', 'Suite con baño privado y balcón. Armario vestidor y zona de trabajo independiente.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af', 2, 'Tercera planta', 'HABITACION', 'DISPONIBLE', 2, 4, 1, NOW() - INTERVAL '90 days', NOW()),
('Cocina Moderna', 'Cocina de diseño con isla central. Electrodomésticos de última generación y amplio espacio de almacenamiento.', 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a', 6, 'Planta principal', 'COCINA', 'DISPONIBLE', 2, 4, 2, NOW() - INTERVAL '90 days', NOW()),
('Proyector HD', 'Proyector Full HD con pantalla de 120 pulgadas. Sistema de sonido integrado. Perfecto para cine en casa.', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1', 8, 'Sala común', 'OBJETO', 'DISPONIBLE', 2, 5, 3, NOW() - INTERVAL '80 days', NOW()),
('Habitación Doble', 'Habitación con dos camas individuales. Escritorio compartido y estanterías para libros.', 'https://images.unsplash.com/photo-1505693314120-0d443867891c', 2, 'Segunda planta', 'HABITACION', 'OCUPADO', 3, 7, 1, NOW() - INTERVAL '75 days', NOW()),
('Baño Compartido', 'Baño equipado con ducha y bañera. Zona de almacenamiento para productos de higiene personal.', 'https://images.unsplash.com/photo-1604709177225-055f99402ea3', 2, 'Segunda planta', 'BAÑO', 'MANTENIMIENTO', 3, 7, 2, NOW() - INTERVAL '75 days', NOW()),
('Bicicleta Montaña', 'Bicicleta de montaña con 21 velocidades. Incluye casco y candado. En excelente estado.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e', 1, 'Garaje', 'OBJETO', 'DISPONIBLE', 3, 8, 3, NOW() - INTERVAL '60 days', NOW()),
('Cocina Industrial', 'Cocina equipada con fogones industriales y horno profesional. Ideal para cocinar en grupo.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f', 10, 'Planta baja', 'COCINA', 'DISPONIBLE', 3, 7, 4, NOW() - INTERVAL '75 days', NOW());

-- Inserta reglas para los recursos
INSERT INTO reglas_recurso (tipo_regla, valor, descripcion, recurso_id, miembro_grupo_id, numero, fecha_creacion, fecha_actualizacion) VALUES
('DURACION_MAX', '120', 'La duración máxima de reserva de la habitación es de 2 horas para visitas. Se debe coordinar con los compañeros.', 1, 1, 1, NOW() - INTERVAL '120 days', NOW()),
('HORARIO_APERTURA', '08:00-23:00', 'El horario de uso de la cocina compartida es de 8:00 a 23:00. Respetar el descanso de los demás.', 3, 1, 1, NOW() - INTERVAL '120 days', NOW()),
('DURACION_MAX', '30', 'El tiempo máximo de uso del baño es de 30 minutos. Considerar a los demás residentes.', 4, 2, 1, NOW() - INTERVAL '115 days', NOW()),
('DURACION_MAX', '180', 'La aspiradora puede reservarse por un máximo de 3 horas. Dejar cargando después de usar.', 5, 3, 1, NOW() - INTERVAL '100 days', NOW()),
('HORARIO_APERTURA', '07:00-00:00', 'La cocina moderna está disponible de 7:00 a medianoche. Limpiar inmediatamente después de usar.', 7, 4, 1, NOW() - INTERVAL '90 days', NOW()),
('DURACION_MAX', '240', 'El proyector puede reservarse por un máximo de 4 horas. Reservar con antelación para eventos.', 8, 5, 1, NOW() - INTERVAL '80 days', NOW()),
('DURACION_MAX', '480', 'La bicicleta puede reservarse por un máximo de 8 horas. Devolverla limpia y con el tanque lleno si es eléctrica.', 11, 8, 1, NOW() - INTERVAL '60 days', NOW()),
('HORARIO_APERTURA', '06:00-23:00', 'La cocina industrial está disponible de 6:00 a 23:00. Respetar los turnos de limpieza establecidos.', 12, 7, 1, NOW() - INTERVAL '75 days', NOW());

-- Inserta reservas de recursos
INSERT INTO reservas (fecha, hora_inicio, hora_fin, notas, num_personas, estado, miembro_grupo_id, recurso_id, numero, fecha_creacion, fecha_actualizacion) VALUES
(CURRENT_DATE - 10, '10:00:00', '12:00:00', 'Visita de mis padres. Necesito preparar la habitación.', 3, 'CONFIRMADA', 1, 1, 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(CURRENT_DATE - 5, '19:00:00', '21:00:00', 'Preparar cena para amigos. Necesito la cocina completa.', 4, 'CONFIRMADA', 2, 3, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(CURRENT_DATE - 3, '08:00:00', '08:30:00', 'Ducha matinal antes de reunión importante.', 1, 'CONFIRMADA', 3, 4, 1, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(CURRENT_DATE - 2, '14:00:00', '15:30:00', 'Limpieza semanal del piso. Usar la aspiradora robot.', 1, 'CONFIRMADA', 2, 5, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(CURRENT_DATE, '18:00:00', '20:00:00', 'Sesión de cocina. Preparando comida para la semana.', 2, 'CONFIRMADA', 4, 7, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(CURRENT_DATE, '20:30:00', '23:30:00', 'Noche de cine con compañeros. Proyección de película clásica.', 6, 'CONFIRMADA', 5, 8, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(CURRENT_DATE + 1, '09:00:00', '17:00:00', 'Excursión en bicicleta por la montaña. Ruta de 50km.', 1, 'PENDIENTE', 8, 11, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(CURRENT_DATE + 2, '12:00:00', '14:00:00', 'Preparar comida para evento del grupo. Necesito la cocina industrial.', 8, 'CONFIRMADA', 7, 12, 1, NOW(), NOW()),
(CURRENT_DATE + 3, '16:00:00', '18:00:00', 'Reunión familiar. Uso de la habitación principal.', 4, 'PENDIENTE', 1, 1, 2, NOW(), NOW()),
(CURRENT_DATE + 5, '07:00:00', '08:00:00', 'Ducha antes del trabajo.', 1, 'PENDIENTE', 9, 10, 1, NOW(), NOW()),
(CURRENT_DATE - 7, '20:00:00', '22:00:00', 'Cena que finalmente no se realizó por enfermedad.', 3, 'CANCELADA', 3, 3, 2, NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),
(CURRENT_DATE - 1, '15:00:00', '16:00:00', 'Limpieza cancelada por falta de tiempo.', 1, 'CANCELADA', 6, 5, 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

-- Muestra resumen de los datos insertados
SELECT 'Datos insertados correctamente:' AS status;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_grupos FROM grupos;
SELECT COUNT(*) AS total_miembros FROM miembros_grupo;
SELECT COUNT(*) AS total_recursos FROM recursos;
SELECT COUNT(*) AS total_reglas FROM reglas_recurso;
SELECT COUNT(*) AS total_reservas FROM reservas;
