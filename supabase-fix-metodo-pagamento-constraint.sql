-- =====================================================
-- CORRIGIR CONSTRAINT DO CAMPO METODO_PAGAMENTO
-- =====================================================

-- 1. Verificar a constraint atual
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass 
AND contype = 'c';

-- 2. Verificar os valores permitidos na constraint atual
SELECT 
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%metodo_pagamento%';

-- 3. Remover a constraint problemática
ALTER TABLE pagamentos 
DROP CONSTRAINT IF EXISTS pagamentos_metodo_pagamento_check;

-- 4. Criar nova constraint que permite "pendente"
ALTER TABLE pagamentos 
ADD CONSTRAINT pagamentos_metodo_pagamento_check 
CHECK (metodo_pagamento IN (
    'pendente',
    'cartao_credito',
    'cartao_debito',
    'transferencia_bancaria',
    'dinheiro',
    'cheque',
    'mbway',
    'multibanco',
    'paypal',
    'stripe',
    'outro'
));

-- 5. Verificar se a nova constraint foi criada
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%metodo_pagamento%';

-- 6. Testar inserção com valor "pendente"
-- (Execute manualmente se necessário)
/*
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
    '16d4996a-70f9-49a2-8d29-dc3650160460',
    '1dc9b806-7e66-4d74-a365-6842fb135e6d',
    10000,
    '2025-09-30',
    'taxa_inscricao',
    'pendente',
    'pendente',
    'TAXA-TESTE-' || EXTRACT(EPOCH FROM NOW()),
    '{"descricao": "Teste após correção", "gerado_automaticamente": true}'
);
*/

-- 7. Verificar pagamentos existentes
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
ORDER BY created_at DESC
LIMIT 5;

-- 8. Verificar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pagamentos' 
AND table_schema = 'public'
AND column_name = 'metodo_pagamento';
