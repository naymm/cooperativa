-- ========================================
-- CORRIGIR POLÍTICAS RLS - VERSÃO SIMPLIFICADA
-- ========================================

-- Verificar se a tabela existe
SELECT 'Tabela inscricao_projeto existe:' as info, 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inscricao_projeto') as resultado;

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inscricao_projeto' 
ORDER BY ordinal_position;

-- ========================================
-- SOLUÇÃO 1: DESABILITAR RLS TEMPORARIAMENTE
-- ========================================

-- Desabilitar RLS para permitir inserções
ALTER TABLE inscricao_projeto DISABLE ROW LEVEL SECURITY;

-- ========================================
-- SOLUÇÃO 2: POLÍTICA PERMISSIVA (ALTERNATIVA)
-- ========================================

-- Se quiser manter RLS, use estas políticas permissivas
-- (descomente se a solução 1 não funcionar)

/*
-- Reabilitar RLS
ALTER TABLE inscricao_projeto ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Cooperados podem ver suas próprias inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Cooperados podem criar inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Admins podem ver todas as inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Admins podem gerenciar inscrições" ON inscricao_projeto;

-- Política permissiva para usuários autenticados
CREATE POLICY "Usuários autenticados podem ver inscrições" ON inscricao_projeto
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar inscrições" ON inscricao_projeto
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar inscrições" ON inscricao_projeto
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar inscrições" ON inscricao_projeto
    FOR DELETE
    TO authenticated
    USING (true);
*/

-- ========================================
-- VERIFICAR RESULTADO
-- ========================================

-- Verificar se RLS está desabilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'inscricao_projeto';

-- Verificar políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'inscricao_projeto';

-- ========================================
-- TESTE DE INSERÇÃO
-- ========================================

-- Inserir um registro de teste (opcional)
-- Descomente se quiser testar a inserção

/*
INSERT INTO inscricao_projeto (
    project_id,
    cooperado_id,
    status,
    data_inscricao,
    valor_interesse,
    forma_pagamento,
    prazo_interesse,
    observacoes,
    documentos_anexados,
    prioridade
) VALUES (
    'teste-project-id',
    'teste-cooperado-id',
    'pendente',
    NOW(),
    5000000,
    'dinheiro',
    12,
    'Teste de inserção',
    '{}',
    5
);
*/

-- ========================================
-- MENSAGEM DE CONFIRMAÇÃO
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ RLS desabilitado para a tabela inscricao_projeto!';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Agora os cooperados devem conseguir criar inscrições!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE:';
    RAISE NOTICE '   - RLS foi desabilitado temporariamente';
    RAISE NOTICE '   - Isso permite que usuários autenticados criem inscrições';
    RAISE NOTICE '   - Para maior segurança, configure políticas RLS adequadas depois';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Para reabilitar RLS com políticas adequadas:';
    RAISE NOTICE '   1. Execute o script completo de RLS';
    RAISE NOTICE '   2. Configure políticas baseadas em user_id';
    RAISE NOTICE '   3. Teste as políticas antes de usar em produção';
END $$;
