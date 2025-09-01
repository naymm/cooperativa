-- ========================================
-- ADICIONAR CAMPOS FALTANTES NA TABELA PROJETOS
-- ========================================

-- Adicionar coluna para tipologia (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS tipologia VARCHAR(10) DEFAULT 'T0';

-- Adicionar coluna para província (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS provincia VARCHAR(100);

-- Adicionar coluna para município (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS municipio VARCHAR(100);

-- Adicionar coluna para área útil (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS area_util DECIMAL(10,2) DEFAULT 0;

-- Adicionar coluna para número de quartos (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS num_quartos INTEGER DEFAULT 0;

-- Adicionar coluna para número de banheiros (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS num_banheiros INTEGER DEFAULT 0;

-- Adicionar coluna para endereço detalhado (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS endereco_detalhado TEXT;

-- Adicionar coluna para coordenadas GPS (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS coordenadas_gps VARCHAR(100);

-- Adicionar coluna para galeria de imagens (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS galeria_imagens TEXT[] DEFAULT '{}';

-- ========================================
-- VERIFICAR ESTRUTURA FINAL
-- ========================================

-- Verificar todas as colunas da tabela projetos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'projetos'
ORDER BY ordinal_position;

-- Verificar dados de exemplo
SELECT 
    id,
    titulo,
    tipologia,
    provincia,
    municipio,
    area_util,
    num_quartos,
    num_banheiros,
    valor_total,
    status
FROM projetos 
LIMIT 3;

-- ========================================
-- MENSAGEM DE CONFIRMAÇÃO
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Colunas adicionadas com sucesso na tabela projetos!';
    RAISE NOTICE '📋 Colunas adicionadas:';
    RAISE NOTICE '   - tipologia (VARCHAR)';
    RAISE NOTICE '   - provincia (VARCHAR)';
    RAISE NOTICE '   - municipio (VARCHAR)';
    RAISE NOTICE '   - area_util (DECIMAL)';
    RAISE NOTICE '   - num_quartos (INTEGER)';
    RAISE NOTICE '   - num_banheiros (INTEGER)';
    RAISE NOTICE '   - endereco_detalhado (TEXT)';
    RAISE NOTICE '   - coordenadas_gps (VARCHAR)';
    RAISE NOTICE '   - galeria_imagens (TEXT[])';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 O formulário agora deve funcionar corretamente!';
END $$;
