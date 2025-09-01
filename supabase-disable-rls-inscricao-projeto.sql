-- ========================================
-- DESABILITAR RLS - INSCRICAO_PROJETO
-- ========================================

-- Desabilitar RLS completamente
ALTER TABLE inscricao_projeto DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT 
    'RLS Status:' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'inscricao_projeto';

-- Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE '✅ RLS DESABILITADO PARA INSCRICAO_PROJETO!';
    RAISE NOTICE '🎯 Agora os cooperados podem criar inscrições!';
END $$;
