-- ========================================
-- VERIFICAÇÃO DA ESTRUTURA REAL DA TABELA PROJETOS
-- ========================================

-- Verificar se a tabela projetos existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'projetos';

-- Verificar TODAS as colunas da tabela projetos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'projetos'
ORDER BY ordinal_position;

-- Verificar dados de exemplo da tabela projetos
SELECT * FROM projetos LIMIT 3;

-- Verificar se existe alguma coluna relacionada ao nome/título
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%nome%' OR 
    column_name ILIKE '%name%' OR 
    column_name ILIKE '%title%' OR 
    column_name ILIKE '%titulo%' OR
    column_name ILIKE '%desc%' OR
    column_name ILIKE '%name%'
);

-- Verificar se existe alguma coluna relacionada ao tipo
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%tipo%' OR 
    column_name ILIKE '%type%' OR 
    column_name ILIKE '%categoria%'
);

-- Verificar se existe alguma coluna relacionada ao preço
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%preco%' OR 
    column_name ILIKE '%price%' OR 
    column_name ILIKE '%valor%' OR
    column_name ILIKE '%custo%'
);

-- Verificar se existe alguma coluna relacionada à província
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%provincia%' OR 
    column_name ILIKE '%province%' OR 
    column_name ILIKE '%regiao%'
);

-- Verificar se existe alguma coluna relacionada ao município
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%municipio%' OR 
    column_name ILIKE '%municipality%' OR 
    column_name ILIKE '%cidade%' OR
    column_name ILIKE '%city%'
);

-- Verificar se existe alguma coluna relacionada à área
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%area%' OR 
    column_name ILIKE '%size%' OR 
    column_name ILIKE '%dimension%'
);

-- Verificar se existe alguma coluna relacionada a quartos
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%quarto%' OR 
    column_name ILIKE '%bedroom%' OR 
    column_name ILIKE '%room%'
);

-- Verificar se existe alguma coluna relacionada a banheiros
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%banheiro%' OR 
    column_name ILIKE '%bathroom%' OR 
    column_name ILIKE '%bath%'
);

-- Verificar se existe alguma coluna relacionada a imagens
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%imagem%' OR 
    column_name ILIKE '%image%' OR 
    column_name ILIKE '%foto%' OR
    column_name ILIKE '%photo%' OR
    column_name ILIKE '%galeria%' OR
    column_name ILIKE '%gallery%'
);

-- Verificar se existe alguma coluna relacionada a datas
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'projetos' 
AND (
    column_name ILIKE '%data%' OR 
    column_name ILIKE '%date%' OR 
    column_name ILIKE '%inicio%' OR
    column_name ILIKE '%start%' OR
    column_name ILIKE '%entrega%' OR
    column_name ILIKE '%delivery%' OR
    column_name ILIKE '%fim%' OR
    column_name ILIKE '%end%'
);

-- ========================================
-- RESUMO DA VERIFICAÇÃO
-- ========================================

DO $$
DECLARE
    table_exists BOOLEAN;
    column_count INTEGER;
    nome_columns TEXT[];
    tipo_columns TEXT[];
    preco_columns TEXT[];
    provincia_columns TEXT[];
    municipio_columns TEXT[];
    area_columns TEXT[];
    quarto_columns TEXT[];
    banheiro_columns TEXT[];
    imagem_columns TEXT[];
    data_columns TEXT[];
BEGIN
    -- Verificar se a tabela existe
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projetos'
    ) INTO table_exists;
    
    -- Contar colunas
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'projetos';
    
    -- Buscar colunas relacionadas ao nome
    SELECT ARRAY_AGG(column_name) INTO nome_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%nome%';
    
    -- Buscar colunas relacionadas ao tipo
    SELECT ARRAY_AGG(column_name) INTO tipo_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%tipo%';
    
    -- Buscar colunas relacionadas ao preço
    SELECT ARRAY_AGG(column_name) INTO preco_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%preco%';
    
    -- Buscar colunas relacionadas à província
    SELECT ARRAY_AGG(column_name) INTO provincia_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%provincia%';
    
    -- Buscar colunas relacionadas ao município
    SELECT ARRAY_AGG(column_name) INTO municipio_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%municipio%';
    
    -- Buscar colunas relacionadas à área
    SELECT ARRAY_AGG(column_name) INTO area_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%area%';
    
    -- Buscar colunas relacionadas a quartos
    SELECT ARRAY_AGG(column_name) INTO quarto_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%quarto%';
    
    -- Buscar colunas relacionadas a banheiros
    SELECT ARRAY_AGG(column_name) INTO banheiro_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%banheiro%';
    
    -- Buscar colunas relacionadas a imagens
    SELECT ARRAY_AGG(column_name) INTO imagem_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%imagem%';
    
    -- Buscar colunas relacionadas a datas
    SELECT ARRAY_AGG(column_name) INTO data_columns
    FROM information_schema.columns 
    WHERE table_name = 'projetos' 
    AND column_name ILIKE '%data%';
    
    -- Exibir resumo
    RAISE NOTICE '=== VERIFICAÇÃO DA TABELA PROJETOS ===';
    RAISE NOTICE 'Tabela projetos existe: %', table_exists;
    RAISE NOTICE 'Número total de colunas: %', column_count;
    RAISE NOTICE 'Colunas relacionadas ao nome: %', nome_columns;
    RAISE NOTICE 'Colunas relacionadas ao tipo: %', tipo_columns;
    RAISE NOTICE 'Colunas relacionadas ao preço: %', preco_columns;
    RAISE NOTICE 'Colunas relacionadas à província: %', provincia_columns;
    RAISE NOTICE 'Colunas relacionadas ao município: %', municipio_columns;
    RAISE NOTICE 'Colunas relacionadas à área: %', area_columns;
    RAISE NOTICE 'Colunas relacionadas a quartos: %', quarto_columns;
    RAISE NOTICE 'Colunas relacionadas a banheiros: %', banheiro_columns;
    RAISE NOTICE 'Colunas relacionadas a imagens: %', imagem_columns;
    RAISE NOTICE 'Colunas relacionadas a datas: %', data_columns;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Tabela projetos encontrada!';
        RAISE NOTICE 'Verifique as colunas acima para identificar os nomes corretos.';
    ELSE
        RAISE NOTICE '❌ Tabela projetos não encontrada!';
        RAISE NOTICE 'Verifique se o nome da tabela está correto.';
    END IF;
END $$;
