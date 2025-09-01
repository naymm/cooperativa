-- ========================================
-- VERIFICAÇÃO DA INSTALAÇÃO
-- ========================================

-- Verificar se a tabela foi criada
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'inscricao_projeto';

-- Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'inscricao_projeto'
ORDER BY ordinal_position;

-- Verificar índices criados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'inscricao_projeto';

-- Verificar políticas de segurança (RLS)
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'inscricao_projeto';

-- Verificar funções criadas
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%inscricao_projeto%';

-- Verificar views criadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%inscricao_projeto%' 
AND table_type = 'VIEW';

-- Testar inserção de dados (opcional)
-- Descomente as linhas abaixo se quiser testar

/*
-- Inserir dados de teste
INSERT INTO inscricao_projeto (
    project_id, 
    cooperado_id, 
    status, 
    valor_interesse, 
    forma_pagamento, 
    observacoes
) VALUES 
(
    (SELECT id FROM projetos LIMIT 1),
    (SELECT id FROM cooperados LIMIT 1),
    'pendente',
    5000000.00,
    'financiamento',
    'Teste de inscrição'
);

-- Verificar dados inseridos
SELECT 
    ip.id,
    ip.status,
    ip.data_inscricao,
    ip.valor_interesse,
    c.nome_completo as cooperado,
    p.nome as projeto
FROM inscricao_projeto ip
JOIN cooperados c ON c.id = ip.cooperado_id
JOIN projetos p ON p.id = ip.project_id;

-- Limpar dados de teste
DELETE FROM inscricao_projeto WHERE observacoes = 'Teste de inscrição';
*/

-- ========================================
-- RESUMO DA VERIFICAÇÃO
-- ========================================

DO $$
DECLARE
    table_exists BOOLEAN;
    index_count INTEGER;
    policy_count INTEGER;
    function_count INTEGER;
    view_count INTEGER;
BEGIN
    -- Verificar se a tabela existe
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'inscricao_projeto'
    ) INTO table_exists;
    
    -- Contar índices
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE tablename = 'inscricao_projeto';
    
    -- Contar políticas
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'inscricao_projeto';
    
    -- Contar funções
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_name LIKE '%inscricao_projeto%';
    
    -- Contar views
    SELECT COUNT(*) INTO view_count
    FROM information_schema.tables 
    WHERE table_name LIKE '%inscricao_projeto%' 
    AND table_type = 'VIEW';
    
    -- Exibir resumo
    RAISE NOTICE '=== RESUMO DA VERIFICAÇÃO ===';
    RAISE NOTICE 'Tabela inscricao_projeto existe: %', table_exists;
    RAISE NOTICE 'Número de índices criados: %', index_count;
    RAISE NOTICE 'Número de políticas RLS: %', policy_count;
    RAISE NOTICE 'Número de funções criadas: %', function_count;
    RAISE NOTICE 'Número de views criadas: %', view_count;
    
    IF table_exists AND index_count >= 5 AND policy_count >= 4 THEN
        RAISE NOTICE '✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!';
        RAISE NOTICE 'O sistema de inscrições em projetos está pronto para uso.';
    ELSE
        RAISE NOTICE '❌ PROBLEMAS DETECTADOS NA INSTALAÇÃO';
        RAISE NOTICE 'Verifique se o script foi executado completamente.';
    END IF;
END $$;
