CREATE DATABASE IF NOT EXISTS auto_prime_motors_db;

USE auto_prime_motors_db;

USE autoprime_db;

ALTER TABLE funcionarios ADD COLUMN telefone VARCHAR(15); (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    setor VARCHAR(50) NOT NULL,
    data_admissao DATE NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    endereco TEXT,
    telefone VARCHAR(15),
    email VARCHAR(100)
);