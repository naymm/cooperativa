-- ========================================
-- ADICIONAR CAMPOS NA TABELA PROJETOS
-- ========================================

-- Adicionar coluna para tipologia
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS tipologia VARCHAR(10) DEFAULT 'T0';

-- Adicionar coluna para província
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS provincia VARCHAR(100);

-- Adicionar coluna para município
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

-- Adicionar coluna para preço final (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS preco_final DECIMAL(15,2) DEFAULT 0;

-- Adicionar coluna para status (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'planejamento';

-- Adicionar coluna para descrição (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Adicionar coluna para endereço detalhado (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS endereco_detalhado TEXT;

-- Adicionar coluna para coordenadas GPS (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS coordenadas_gps VARCHAR(100);

-- Adicionar coluna para data de início (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS data_inicio DATE;

-- Adicionar coluna para data de previsão de entrega (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS data_previsao_entrega DATE;

-- Adicionar coluna para galeria de imagens (se não existir)
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS galeria_imagens TEXT[] DEFAULT '{}';

-- ========================================
-- CRIAR ENUM PARA TIPOLOGIAS
-- ========================================

-- Criar tipo enum para tipologias (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipologia_tipo') THEN
        CREATE TYPE tipologia_tipo AS ENUM ('T0', 'T1', 'T2', 'T3', 'T4', 'T5');
    END IF;
END $$;

-- Alterar coluna tipologia para usar o enum (opcional)
-- ALTER TABLE projetos ALTER COLUMN tipologia TYPE tipologia_tipo USING tipologia::tipologia_tipo;

-- ========================================
-- CRIAR ENUM PARA STATUS
-- ========================================

-- Criar tipo enum para status (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_projeto_tipo') THEN
        CREATE TYPE status_projeto_tipo AS ENUM ('planejamento', 'construcao', 'pronto', 'entregue');
    END IF;
END $$;

-- Alterar coluna status para usar o enum (opcional)
-- ALTER TABLE projetos ALTER COLUMN status TYPE status_projeto_tipo USING status::status_projeto_tipo;

-- ========================================
-- ADICIONAR CONSTRAINTS E VALIDAÇÕES
-- ========================================

-- Adicionar constraint para área útil positiva
ALTER TABLE projetos 
ADD CONSTRAINT IF NOT EXISTS check_area_util_positiva 
CHECK (area_util >= 0);

-- Adicionar constraint para número de quartos não negativo
ALTER TABLE projetos 
ADD CONSTRAINT IF NOT EXISTS check_num_quartos_positivo 
CHECK (num_quartos >= 0);

-- Adicionar constraint para número de banheiros não negativo
ALTER TABLE projetos 
ADD CONSTRAINT IF NOT EXISTS check_num_banheiros_positivo 
CHECK (num_banheiros >= 0);

-- Adicionar constraint para preço final não negativo
ALTER TABLE projetos 
ADD CONSTRAINT IF NOT EXISTS check_preco_final_positivo 
CHECK (preco_final >= 0);

-- ========================================
-- ATUALIZAR DADOS EXISTENTES (OPCIONAL)
-- ========================================

-- Atualizar registros existentes com valores padrão se necessário
UPDATE projetos 
SET 
    tipologia = COALESCE(tipologia, 'T0'),
    provincia = COALESCE(provincia, 'Não informado'),
    municipio = COALESCE(municipio, 'Não informado'),
    area_util = COALESCE(area_util, 0),
    num_quartos = COALESCE(num_quartos, 0),
    num_banheiros = COALESCE(num_banheiros, 0),
    preco_final = COALESCE(preco_final, 0),
    status = COALESCE(status, 'planejamento'),
    descricao = COALESCE(descricao, 'Sem descrição'),
    endereco_detalhado = COALESCE(endereco_detalhado, 'Endereço não informado'),
    galeria_imagens = COALESCE(galeria_imagens, '{}')
WHERE 
    tipologia IS NULL 
    OR provincia IS NULL 
    OR municipio IS NULL 
    OR area_util IS NULL 
    OR num_quartos IS NULL 
    OR num_banheiros IS NULL 
    OR preco_final IS NULL 
    OR status IS NULL 
    OR descricao IS NULL 
    OR endereco_detalhado IS NULL 
    OR galeria_imagens IS NULL;

-- ========================================
-- VERIFICAR ESTRUTURA FINAL
-- ========================================

-- Verificar se todas as colunas foram criadas
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
    nome,
    tipologia,
    provincia,
    municipio,
    area_util,
    num_quartos,
    num_banheiros,
    preco_final,
    status
FROM projetos 
LIMIT 5;

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
    RAISE NOTICE '   - preco_final (DECIMAL)';
    RAISE NOTICE '   - status (VARCHAR)';
    RAISE NOTICE '   - descricao (TEXT)';
    RAISE NOTICE '   - endereco_detalhado (TEXT)';
    RAISE NOTICE '   - coordenadas_gps (VARCHAR)';
    RAISE NOTICE '   - data_inicio (DATE)';
    RAISE NOTICE '   - data_previsao_entrega (DATE)';
    RAISE NOTICE '   - galeria_imagens (TEXT[])';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Agora você pode atualizar o formulário de cadastro/edição de projetos!';
END $$;
