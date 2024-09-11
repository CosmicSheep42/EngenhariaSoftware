CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cor VARCHAR(7) DEFAULT '#000000' NOT NULL,  -- Cor do marcador no mapa
    descricao TEXT,
    subtitulo VARCHAR(255),
    lat DECIMAL(9, 6) NOT NULL,
    lon DECIMAL(9, 6) NOT NULL,
    estrelas NUMERIC(2, 1) DEFAULT 0,  -- Média das estrelas
    quantidade_reviews INTEGER DEFAULT 0,  -- Quantidade de reviews
    horario_abertura TIME,  -- Horário de abertura
    horario_fechamento TIME  -- Horário de fechamento
);

CREATE TABLE uploads (
    id SERIAL PRIMARY KEY,
    place_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_data BYTEA NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

-- Tabela de Horários de Funcionamento
CREATE TABLE horarios_funcionamento (
    id SERIAL PRIMARY KEY,
    place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
    dia_semana VARCHAR(10) NOT NULL,  -- Ex: 'Segunda', 'Terça', etc.
    horario_abertura TIME,
    horario_fechamento TIME
);

-- Tabela de Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
    usuario VARCHAR(255) NOT NULL,
    estrelas NUMERIC(2, 1) CHECK (estrelas >= 0 AND estrelas <= 5), -- Estrelas de 0 a 5
    texto_review TEXT,
    data_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    adm BOOLEAN DEFAULT FALSE NOT NULL
);

-- Inserindo locais de exemplo
INSERT INTO places (nome, descricao, subtitulo, lat, lon) VALUES 
('Mercadinho', 'Apesar de pequeno, tem de tudo', 'Mercado Familiar', -23.550520, -46.633308),
('Bar do Zé', 'Melhor bar da cidade', 'Bebidas e petiscos', -22.906847, -43.172896),
('Restaurante da Maria', 'Comida caseira de qualidade', 'Comida Brasileira', -23.532503, -46.639302),
('Parque Central', 'Um ótimo lugar para relaxar', 'Natureza e ar livre', -23.561682, -46.625378),
('Biblioteca Municipal', 'Livros e conhecimento', 'Cultura', -23.567815, -46.648620),
('Padaria Pão Quente', 'Pães frescos todos os dias', 'Panificadora e Confeitaria', -23.551225, -46.635563),
('Academia Iron Gym', 'Treinamento de força e resistência', 'Fitness e Musculação', -23.559134, -46.645839),
('Sorveteria Gelato', 'Sorvetes artesanais', 'Doces e Sobremesas', -22.912347, -43.176092),
('Cinema Central', 'Os melhores filmes em cartaz', 'Entretenimento', -23.548526, -46.629278),
('Farmácia Saúde', 'Medicamentos e produtos de saúde', 'Saúde e Bem-estar', -23.557384, -46.662021);

-- Horários de funcionamento para Mercadinho
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (1, 'Segunda', '07:00', '20:00'),
       (1, 'Terça', '07:00', '20:00'),
       (1, 'Quarta', '07:00', '20:00'),
       (1, 'Quinta', '07:00', '20:00'),
       (1, 'Sexta', '07:00', '20:00'),
       (1, 'Sábado', '08:00', '18:00'),
       (1, 'Domingo', '08:00', '12:00');

-- Horários de funcionamento para Bar do Zé
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (2, 'Segunda', '12:00', '00:00'),
       (2, 'Terça', '12:00', '00:00'),
       (2, 'Quarta', '12:00', '00:00'),
       (2, 'Quinta', '12:00', '00:00'),
       (2, 'Sexta', '12:00', '02:00'),
       (2, 'Sábado', '12:00', '02:00'),
       (2, 'Domingo', '12:00', '23:00');

-- Horários de funcionamento para Restaurante da Maria
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (3, 'Segunda', '11:00', '15:00'),
       (3, 'Terça', '11:00', '15:00'),
       (3, 'Quarta', '11:00', '15:00'),
       (3, 'Quinta', '11:00', '15:00'),
       (3, 'Sexta', '11:00', '15:00'),
       (3, 'Sábado', '11:00', '16:00'),
       (3, 'Domingo', NULL, NULL);

-- Horários de funcionamento para Parque Central
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (4, 'Segunda', '06:00', '21:00'),
       (4, 'Terça', '06:00', '21:00'),
       (4, 'Quarta', '06:00', '21:00'),
       (4, 'Quinta', '06:00', '21:00'),
       (4, 'Sexta', '06:00', '21:00'),
       (4, 'Sábado', '06:00', '22:00'),
       (4, 'Domingo', '06:00', '22:00');

-- Horários de funcionamento para Biblioteca Municipal
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (5, 'Segunda', '09:00', '18:00'),
       (5, 'Terça', '09:00', '18:00'),
       (5, 'Quarta', '09:00', '18:00'),
       (5, 'Quinta', '09:00', '18:00'),
       (5, 'Sexta', '09:00', '18:00'),
       (5, 'Sábado', '10:00', '14:00'),
       (5, 'Domingo', NULL, NULL);

-- Horários de funcionamento para Padaria Pão Quente
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (6, 'Segunda', '06:00', '20:00'),
       (6, 'Terça', '06:00', '20:00'),
       (6, 'Quarta', '06:00', '20:00'),
       (6, 'Quinta', '06:00', '20:00'),
       (6, 'Sexta', '06:00', '20:00'),
       (6, 'Sábado', '07:00', '14:00'),
       (6, 'Domingo', NULL, NULL);

-- Horários de funcionamento para Academia Iron Gym
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (7, 'Segunda', '06:00', '22:00'),
       (7, 'Terça', '06:00', '22:00'),
       (7, 'Quarta', '06:00', '22:00'),
       (7, 'Quinta', '06:00', '22:00'),
       (7, 'Sexta', '06:00', '22:00'),
       (7, 'Sábado', '08:00', '18:00'),
       (7, 'Domingo', '08:00', '14:00');

-- Horários de funcionamento para Sorveteria Gelato
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (8, 'Segunda', '12:00', '22:00'),
       (8, 'Terça', '12:00', '22:00'),
       (8, 'Quarta', '12:00', '22:00'),
       (8, 'Quinta', '12:00', '22:00'),
       (8, 'Sexta', '12:00', '23:00'),
       (8, 'Sábado', '10:00', '23:00'),
       (8, 'Domingo', '10:00', '21:00');

-- Horários de funcionamento para Cinema Central
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (9, 'Segunda', '10:00', '23:00'),
       (9, 'Terça', '10:00', '23:00'),
       (9, 'Quarta', '10:00', '23:00'),
       (9, 'Quinta', '10:00', '23:00'),
       (9, 'Sexta', '10:00', '01:00'),
       (9, 'Sábado', '10:00', '01:00'),
       (9, 'Domingo', '10:00', '23:00');

-- Horários de funcionamento para Farmácia Saúde
INSERT INTO horarios_funcionamento (place_id, dia_semana, horario_abertura, horario_fechamento)
VALUES (10, 'Segunda', '08:00', '22:00'),
       (10, 'Terça', '08:00', '22:00'),
       (10, 'Quarta', '08:00', '22:00'),
       (10, 'Quinta', '08:00', '22:00'),
       (10, 'Sexta', '08:00', '22:00'),
       (10, 'Sábado', '08:00', '20:00'),
       (10, 'Domingo', '09:00', '18:00');


-- Inserindo usuarios de teste
INSERT INTO usuarios (username, email, password, adm) VALUES 
('1', '1@1', '$2a$10$pKm9UDFNmpye2CatRQguku3RtGEcLg9YRDWALFTb1NZ4znTHNPnFi', true),
('2', '2@2', '$2a$10$dQNLSoemhdZ3xcjDkuACJOQEqB0k5lT81pxHpKGmEYSuMFwRNlhl2', false);