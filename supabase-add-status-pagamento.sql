-- =====================================================
-- ADICIONAR CAMPO STATUS_PAGAMENTO À TABELA COOPERADOS
-- =====================================================

-- 1. Adicionar campo status_pagamento
ALTER TABLE cooperados 
ADD COLUMN IF NOT EXISTS status_pagamento VARCHAR(20) DEFAULT 'pendente';

-- 2. Atualizar registros existentes
UPDATE cooperados 
SET status_pagamento = 'pendente' 
WHERE status_pagamento IS NULL;

-- 3. Atualizar cooperados que já têm taxa_inscricao_paga = true
UPDATE cooperados 
SET status_pagamento = 'pago' 
WHERE taxa_inscricao_paga = true;

-- 4. Verificar a estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'cooperados' 
AND table_schema = 'public'
AND column_name IN ('taxa_inscricao_paga', 'status_pagamento')
ORDER BY ordinal_position;

-- 5. Verificar dados dos cooperados
SELECT 
    id,
    numero_associado,
    nome_completo,
    email,
    taxa_inscricao_paga,
    status_pagamento,
    status,
    created_at
FROM cooperados 
ORDER BY created_at DESC
LIMIT 10;

-- 6. Verificar pagamentos de taxa de inscrição
SELECT 
    p.id,
    p.cooperado_id,
    p.valor,
    p.tipo,
    p.status,
    p.data_vencimento,
    p.data_pagamento,
    p.referencia,
    c.nome_completo,
    c.numero_associado
FROM pagamentos p
JOIN cooperados c ON p.cooperado_id = c.id
WHERE p.tipo = 'taxa_inscricao'
ORDER BY p.created_at DESC
LIMIT 10;
