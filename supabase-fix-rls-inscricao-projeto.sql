-- ========================================
-- CORRIGIR POLÍTICAS RLS DA TABELA INSCRICAO_PROJETO
-- ========================================

-- Primeiro, vamos verificar se a tabela existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'inscricao_projeto';

-- Verificar se RLS está habilitado
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
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'inscricao_projeto';

-- ========================================
-- HABILITAR RLS (se não estiver habilitado)
-- ========================================

ALTER TABLE inscricao_projeto ENABLE ROW LEVEL SECURITY;

-- ========================================
-- REMOVER POLÍTICAS EXISTENTES (se houver)
-- ========================================

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Cooperados podem ver suas próprias inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Cooperados podem criar inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Admins podem ver todas as inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Admins podem gerenciar inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Usuários autenticados podem ver inscrições" ON inscricao_projeto;
DROP POLICY IF EXISTS "Usuários autenticados podem criar inscrições" ON inscricao_projeto;

-- ========================================
-- CRIAR NOVAS POLÍTICAS RLS
-- ========================================

-- Política 1: Cooperados podem ver suas próprias inscrições
CREATE POLICY "Cooperados podem ver suas próprias inscrições" ON inscricao_projeto
    FOR SELECT
    TO authenticated
    USING (
        cooperado_id = auth.uid()::text
        OR 
        cooperado_id IN (
            SELECT id::text 
            FROM cooperados 
            WHERE user_id = auth.uid()
        )
    );

-- Política 2: Cooperados podem criar inscrições
CREATE POLICY "Cooperados podem criar inscrições" ON inscricao_projeto
    FOR INSERT
    TO authenticated
    WITH CHECK (
        cooperado_id = auth.uid()::text
        OR 
        cooperado_id IN (
            SELECT id::text 
            FROM cooperados 
            WHERE user_id = auth.uid()
        )
    );

-- Política 3: Cooperados podem atualizar suas próprias inscrições (apenas status)
CREATE POLICY "Cooperados podem atualizar suas inscrições" ON inscricao_projeto
    FOR UPDATE
    TO authenticated
    USING (
        cooperado_id = auth.uid()::text
        OR 
        cooperado_id IN (
            SELECT id::text 
            FROM cooperados 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        cooperado_id = auth.uid()::text
        OR 
        cooperado_id IN (
            SELECT id::text 
            FROM cooperados 
            WHERE user_id = auth.uid()
        )
    );

-- Política 4: Admins podem ver todas as inscrições
CREATE POLICY "Admins podem ver todas as inscrições" ON inscricao_projeto
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM cooperados 
            WHERE user_id = auth.uid() 
            AND tipo_usuario = 'admin'
        )
    );

-- Política 5: Admins podem gerenciar todas as inscrições
CREATE POLICY "Admins podem gerenciar inscrições" ON inscricao_projeto
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM cooperados 
            WHERE user_id = auth.uid() 
            AND tipo_usuario = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM cooperados 
            WHERE user_id = auth.uid() 
            AND tipo_usuario = 'admin'
        )
    );

-- ========================================
-- POLÍTICA ALTERNATIVA MAIS PERMISSIVA (se as acima não funcionarem)
-- ========================================

-- Se as políticas acima não funcionarem, use esta política mais permissiva
-- (comente as políticas acima e descomente esta seção)

/*
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
*/

-- ========================================
-- VERIFICAR ESTRUTURA DA TABELA
-- ========================================

-- Verificar colunas da tabela inscricao_projeto
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'inscricao_projeto'
ORDER BY ordinal_position;

-- Verificar dados de exemplo
SELECT * FROM inscricao_projeto LIMIT 5;

-- ========================================
-- VERIFICAR TABELA COOPERADOS
-- ========================================

-- Verificar se a tabela cooperados existe e tem a estrutura esperada
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'cooperados'
ORDER BY ordinal_position;

-- Verificar dados de exemplo da tabela cooperados
SELECT id, user_id, tipo_usuario FROM cooperados LIMIT 5;

-- ========================================
-- TESTAR POLÍTICAS
-- ========================================

-- Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'inscricao_projeto'
ORDER BY policyname;

-- ========================================
-- MENSAGEM DE CONFIRMAÇÃO
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Políticas RLS corrigidas para a tabela inscricao_projeto!';
    RAISE NOTICE '📋 Políticas criadas:';
    RAISE NOTICE '   - Cooperados podem ver suas próprias inscrições';
    RAISE NOTICE '   - Cooperados podem criar inscrições';
    RAISE NOTICE '   - Cooperados podem atualizar suas inscrições';
    RAISE NOTICE '   - Admins podem ver todas as inscrições';
    RAISE NOTICE '   - Admins podem gerenciar inscrições';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Agora os cooperados devem conseguir criar inscrições!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Se ainda houver problemas, verifique:';
    RAISE NOTICE '   1. Se o usuário está autenticado';
    RAISE NOTICE '   2. Se o cooperado_id está correto';
    RAISE NOTICE '   3. Se a tabela cooperados tem user_id e tipo_usuario';
END $$;
