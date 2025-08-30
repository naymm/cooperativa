-- Script para adicionar coluna taxa_inscricao na tabela assinatura_planos
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna taxa_inscricao
ALTER TABLE assinatura_planos 
ADD COLUMN IF NOT EXISTS taxa_inscricao DECIMAL(10,2) DEFAULT 0;

-- Atualizar planos existentes com taxa de inscrição padrão
UPDATE assinatura_planos 
SET taxa_inscricao = 10000 
WHERE taxa_inscricao IS NULL OR taxa_inscricao = 0;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'assinatura_planos' 
AND column_name = 'taxa_inscricao';

-- Mostrar estrutura atualizada da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'assinatura_planos'
ORDER BY ordinal_position;
