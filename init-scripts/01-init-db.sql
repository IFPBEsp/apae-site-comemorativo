-- Script de inicialização do banco de dados
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Comentário de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados APAE inicializado com sucesso!';
END $$;
