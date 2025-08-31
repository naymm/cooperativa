-- =====================================================
-- ADICIONAR CAMPO SENHA_ALTERADA NA TABELA COOPERADO_AUTH
-- =====================================================

-- 1. Adicionar coluna senha_alterada
ALTER TABLE cooperado_auth 
ADD COLUMN IF NOT EXISTS senha_alterada BOOLEAN DEFAULT FALSE;

-- 2. Adicionar coluna data_alteracao_senha
ALTER TABLE cooperado_auth 
ADD COLUMN IF NOT EXISTS data_alteracao_senha TIMESTAMP WITH TIME ZONE;

-- 3. Atualizar registros existentes para marcar senhas como não alteradas
UPDATE cooperado_auth 
SET senha_alterada = FALSE 
WHERE senha_alterada IS NULL;

-- 4. Verificar a estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'cooperado_auth' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar registros existentes
SELECT 
    id,
    cooperado_id,
    senha_alterada,
    data_alteracao_senha,
    created_at
FROM cooperado_auth 
LIMIT 10;
