-- =====================================================
-- CONFIGURAÇÃO COMPLETA DA TABELA PAGAMENTOS
-- =====================================================

-- 1. Criar tabela pagamentos se não existir
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cooperado_id UUID NOT NULL REFERENCES cooperados(id) ON DELETE CASCADE,
    assinatura_plano_id UUID REFERENCES assinatura_planos(id) ON DELETE SET NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    metodo_pagamento VARCHAR(50),
    referencia VARCHAR(100),
    observacoes JSONB,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar campos se não existirem
ALTER TABLE pagamentos 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);

ALTER TABLE pagamentos 
ADD COLUMN IF NOT EXISTS metodo_pagamento VARCHAR(50);

ALTER TABLE pagamentos 
ADD COLUMN IF NOT EXISTS referencia VARCHAR(100);

ALTER TABLE pagamentos 
ADD COLUMN IF NOT EXISTS observacoes JSONB;

ALTER TABLE pagamentos 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_cooperado_id ON pagamentos(cooperado_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_tipo ON pagamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_vencimento ON pagamentos(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_pagamentos_referencia ON pagamentos(referencia);

-- 4. Adicionar constraint única para referência (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uk_pagamentos_referencia'
    ) THEN
        ALTER TABLE pagamentos 
        ADD CONSTRAINT uk_pagamentos_referencia UNIQUE (referencia);
    END IF;
END $$;

-- 5. Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pagamentos_updated_at ON pagamentos;
CREATE TRIGGER update_pagamentos_updated_at
    BEFORE UPDATE ON pagamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'pagamentos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Verificar registros existentes
SELECT 
    id,
    cooperado_id,
    assinatura_plano_id,
    valor,
    tipo,
    status,
    metodo_pagamento,
    referencia,
    data_vencimento,
    data_pagamento,
    created_at
FROM pagamentos 
ORDER BY created_at DESC
LIMIT 10;

-- 8. Verificar pagamentos de taxa de inscrição
SELECT 
    p.id,
    p.cooperado_id,
    p.valor,
    p.tipo,
    p.status,
    p.data_vencimento,
    p.referencia,
    c.nome_completo,
    c.numero_associado
FROM pagamentos p
LEFT JOIN cooperados c ON p.cooperado_id = c.id
WHERE p.tipo = 'taxa_inscricao'
ORDER BY p.created_at DESC;

-- 9. Verificar total de pagamentos por tipo
SELECT 
    tipo,
    status,
    COUNT(*) as total
FROM pagamentos 
GROUP BY tipo, status
ORDER BY tipo, status;

-- 10. Verificar total de pagamentos por cooperado
SELECT 
    c.nome_completo,
    c.numero_associado,
    COUNT(p.id) as total_pagamentos,
    COUNT(CASE WHEN p.status = 'pendente' THEN 1 END) as pagamentos_pendentes,
    COUNT(CASE WHEN p.status = 'pago' THEN 1 END) as pagamentos_pagos
FROM cooperados c
LEFT JOIN pagamentos p ON c.id = p.cooperado_id
GROUP BY c.id, c.nome_completo, c.numero_associado
ORDER BY total_pagamentos DESC
LIMIT 10;
