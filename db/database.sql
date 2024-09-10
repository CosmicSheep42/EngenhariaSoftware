-- Tabela de Locais
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    subtitulo VARCHAR(255),
    status VARCHAR(50),
    lat DECIMAL(9, 6) NOT NULL,
    lon DECIMAL(9, 6) NOT NULL,
    estrelas NUMERIC(2, 1) DEFAULT 0,  -- Média das estrelas
    quantidade_reviews INTEGER DEFAULT 0  -- Quantidade de reviews
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
INSERT INTO places (nome, descricao, subtitulo, status, lat, lon, estrelas, quantidade_reviews) VALUES 
('Casa do Caralho', 'Foda de mais', 'teste', 'ativo', -23.550520, -46.633308, 0, 0),
('Bar do Zé', 'Melhor bar da cidade', 'Bebidas e petiscos', 'ativo', -22.906847, -43.172896, 4.5, 10),
('Restaurante da Maria', 'Comida caseira de qualidade', 'Comida Brasileira', 'inativo', -23.532503, -46.639302, 3.8, 5),
('Parque Central', 'Um ótimo lugar para relaxar', 'Natureza e ar livre', 'ativo', -23.561682, -46.625378, 4.2, 8),
('Biblioteca Municipal', 'Livros e conhecimento', 'Cultura', 'ativo', -23.567815, -46.648620, 4.0, 3);