-- Script para alinhar a estrutura da tabela inscricoes_publicas com cooperados
-- Adicionar campos faltantes para garantir compatibilidade total

-- 1. Adicionar campos básicos de identificação
ALTER TABLE inscricoes_publicas 
ADD COLUMN IF NOT EXISTS numero_associado VARCHAR(50),
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(50) DEFAULT 'solteiro',
ADD COLUMN IF NOT EXISTS nome_conjuge VARCHAR(255),
ADD COLUMN IF NOT EXISTS tem_filhos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS numero_filhos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nacionalidade VARCHAR(100) DEFAULT 'Angolana';

-- 2. Adicionar campos de documento
ALTER TABLE inscricoes_publicas 
ADD COLUMN IF NOT EXISTS bi VARCHAR(50),
ADD COLUMN IF NOT EXISTS validade_documento_bi DATE;

-- 3. Adicionar campos de localização
ALTER TABLE inscricoes_publicas 
ADD COLUMN IF NOT EXISTS comuna VARCHAR(100),
ADD COLUMN IF NOT EXISTS endereco_completo TEXT;

-- 4. Adicionar campos de entidade
ALTER TABLE inscricoes_publicas 
ADD COLUMN IF NOT EXISTS entidade_publica JSONB,
ADD COLUMN IF NOT EXISTS entidade_privada VARCHAR(255);

-- 5. Adicionar campos de documentos e assinatura
ALTER TABLE inscricoes_publicas 
ADD COLUMN IF NOT EXISTS documentos_anexados JSONB,
ADD COLUMN IF NOT EXISTS data_inscricao DATE,
ADD COLUMN IF NOT EXISTS assinatura_plano_id UUID,
ADD COLUMN IF NOT EXISTS taxa_inscricao_paga BOOLEAN DEFAULT false;

-- 6. Renomear campos para manter compatibilidade
-- plano_interesse -> assinatura_plano_id (já adicionado acima)
-- entidade -> será mapeado para entidade_publica ou entidade_privada

-- 7. Adicionar comentários para documentação
COMMENT ON COLUMN inscricoes_publicas.numero_associado IS 'Número de associado gerado automaticamente na aprovação';
COMMENT ON COLUMN inscricoes_publicas.data_inscricao IS 'Data da inscrição (será preenchida com created_at)';
COMMENT ON COLUMN inscricoes_publicas.assinatura_plano_id IS 'ID do plano de assinatura selecionado';
COMMENT ON COLUMN inscricoes_publicas.taxa_inscricao_paga IS 'Indica se a taxa de inscrição foi paga';

-- 8. Verificar se as alterações foram aplicadas
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'inscricoes_publicas' 
ORDER BY ordinal_position;
