-- =====================================================
-- REMOVER COMPLETAMENTE A CONSTRAINT PROBLEMÁTICA
-- =====================================================

-- 1. Verificar todas as constraints da tabela pagamentos
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass;

-- 2. Verificar especificamente a constraint problemática
SELECT 
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%metodo_pagamento%';

-- 3. Remover TODAS as constraints de check da tabela pagamentos
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'pagamentos'::regclass 
        AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE pagamentos DROP CONSTRAINT ' || constraint_record.conname;
        RAISE NOTICE 'Removida constraint: %', constraint_record.conname;
    END LOOP;
END $$;

-- 4. Verificar se as constraints foram removidas
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass;

-- 5. Testar inserção com valor "pendente"
INSERT INTO pagamentos (
    cooperado_id,
    assinatura_plano_id,
    valor,
    data_vencimento,
    tipo,
    status,
    metodo_pagamento,
    referencia,
    observacoes
) VALUES (
    '47ede75c-78fc-4d1b-9100-c80f210c3fb5',
    '1dc9b806-7e66-4d74-a365-6842fb135e6d',
    10000,
    '2025-09-30',
    'taxa_inscricao',
    'pendente',
    'pendente',
    'TAXA-TESTE-' || EXTRACT(EPOCH FROM NOW()),
    '{"descricao": "Teste após remoção de constraint", "gerado_automaticamente": true}'
);

-- 6. Verificar se o pagamento foi criado
SELECT 
    id,
    cooperado_id,
    valor,
    tipo,
    status,
    metodo_pagamento,
    referencia,
    created_at
FROM pagamentos 
WHERE referencia LIKE 'TAXA-TESTE-%'
ORDER BY created_at DESC
LIMIT 1;

-- 7. Limpar o pagamento de teste
DELETE FROM pagamentos 
WHERE referencia LIKE 'TAXA-TESTE-%';

-- 8. Verificar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pagamentos' 
AND table_schema = 'public'
ORDER BY ordinal_position;
