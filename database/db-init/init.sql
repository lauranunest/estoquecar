-- Criação da tabela "Usuarios"
CREATE TABLE IF NOT EXISTS "Usuarios" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de um usuário de exemplo
INSERT INTO "Usuarios" (nome, email, senha, username) 
VALUES ('Admin', 'admin@example.com', 'admin1234', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Criação da tabela "Produtos"
CREATE TABLE IF NOT EXISTS "Produtos" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de um produto de exemplo
INSERT INTO "Produtos" (nome, descricao, quantidade, preco) 
VALUES ('Produto Exemplo', 'Descrição do produto de exemplo', 10, 99.99);

CREATE TABLE MovimentosEstoque (
    id SERIAL PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    tipo_movimento VARCHAR(20) NOT NULL CHECK (tipo_movimento IN ('Entrada', 'Saída')),
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produto FOREIGN KEY (produto_id) REFERENCES Produtos(id) ON DELETE CASCADE
);

-- Inserindo alguns dados mockados
INSERT INTO MovimentosEstoque (produto_id, quantidade, tipo_movimento, data_movimento) VALUES
(1, 10, 'Entrada', '2024-03-30 10:00:00'),
(2, 5, 'Saída', '2024-03-31 14:30:00'),
(3, 20, 'Entrada', '2024-04-01 09:15:00'),
(1, 3, 'Saída', '2024-04-02 16:45:00');

