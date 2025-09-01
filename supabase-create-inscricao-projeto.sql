-- ========================================
-- CRIAÇÃO DA TABELA INSCRICAO_PROJETO
-- ========================================

-- Criar a tabela de inscrições em projetos
CREATE TABLE IF NOT EXISTS inscricao_projeto (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Referências
    project_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
    cooperado_id UUID NOT NULL REFERENCES cooperados(id) ON DELETE CASCADE,
    
    -- Status da inscrição
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
    
    -- Datas
    data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    
    -- Controle administrativo
    aprovado_por UUID REFERENCES crm_user(id),
    observacoes TEXT,
    motivo_rejeicao TEXT,
    
    -- Prioridade e documentos
    prioridade INTEGER DEFAULT 5 CHECK (prioridade >= 1 AND prioridade <= 10),
    documentos_anexados TEXT[] DEFAULT '{}',
    
    -- Dados de interesse do cooperado
    valor_interesse DECIMAL(15,2),
    forma_pagamento VARCHAR(50) CHECK (forma_pagamento IN ('dinheiro', 'financiamento', 'parcial', 'outro')),
    prazo_interesse DATE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índice para buscar inscrições por cooperado
CREATE INDEX IF NOT EXISTS idx_inscricao_projeto_cooperado_id ON inscricao_projeto(cooperado_id);

-- Índice para buscar inscrições por projeto
CREATE INDEX IF NOT EXISTS idx_inscricao_projeto_project_id ON inscricao_projeto(project_id);

-- Índice para buscar inscrições por status
CREATE INDEX IF NOT EXISTS idx_inscricao_projeto_status ON inscricao_projeto(status);

-- Índice composto para buscar inscrições únicas por cooperado e projeto
CREATE UNIQUE INDEX IF NOT EXISTS idx_inscricao_projeto_unique_cooperado_project 
ON inscricao_projeto(cooperado_id, project_id);

-- Índice para buscar inscrições por data
CREATE INDEX IF NOT EXISTS idx_inscricao_projeto_data_inscricao ON inscricao_projeto(data_inscricao);

-- ========================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- ========================================

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_inscricao_projeto_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_update_inscricao_projeto_updated_at
    BEFORE UPDATE ON inscricao_projeto
    FOR EACH ROW
    EXECUTE FUNCTION update_inscricao_projeto_updated_at();

-- ========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Habilitar RLS na tabela
ALTER TABLE inscricao_projeto ENABLE ROW LEVEL SECURITY;

-- Política para cooperados verem apenas suas próprias inscrições
CREATE POLICY "Cooperados podem ver suas próprias inscrições" ON inscricao_projeto
    FOR SELECT USING (
        auth.uid()::text = cooperado_id::text
    );

-- Política para cooperados criarem suas próprias inscrições
CREATE POLICY "Cooperados podem criar suas próprias inscrições" ON inscricao_projeto
    FOR INSERT WITH CHECK (
        auth.uid()::text = cooperado_id::text
    );

-- Política para cooperados atualizarem suas próprias inscrições (apenas cancelamento)
CREATE POLICY "Cooperados podem atualizar suas próprias inscrições" ON inscricao_projeto
    FOR UPDATE USING (
        auth.uid()::text = cooperado_id::text
    );

-- Política para administradores verem todas as inscrições
CREATE POLICY "Administradores podem ver todas as inscrições" ON inscricao_projeto
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM crm_user 
            WHERE crm_user.id = auth.uid()::uuid 
            AND crm_user.role IN ('admin', 'manager')
        )
    );

-- ========================================
-- FUNÇÕES ÚTEIS
-- ========================================

-- Função para buscar inscrições de um cooperado
CREATE OR REPLACE FUNCTION get_inscricoes_cooperado(cooperado_uuid UUID)
RETURNS TABLE (
    id UUID,
    project_id UUID,
    cooperado_id UUID,
    status VARCHAR(20),
    data_inscricao TIMESTAMP WITH TIME ZONE,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    valor_interesse DECIMAL(15,2),
    forma_pagamento VARCHAR(50),
    observacoes TEXT,
    motivo_rejeicao TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ip.id,
        ip.project_id,
        ip.cooperado_id,
        ip.status,
        ip.data_inscricao,
        ip.data_aprovacao,
        ip.valor_interesse,
        ip.forma_pagamento,
        ip.observacoes,
        ip.motivo_rejeicao
    FROM inscricao_projeto ip
    WHERE ip.cooperado_id = cooperado_uuid
    ORDER BY ip.data_inscricao DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar inscrições pendentes
CREATE OR REPLACE FUNCTION get_inscricoes_pendentes()
RETURNS TABLE (
    id UUID,
    project_id UUID,
    cooperado_id UUID,
    status VARCHAR(20),
    data_inscricao TIMESTAMP WITH TIME ZONE,
    valor_interesse DECIMAL(15,2),
    forma_pagamento VARCHAR(50),
    observacoes TEXT,
    cooperado_nome TEXT,
    projeto_nome TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ip.id,
        ip.project_id,
        ip.cooperado_id,
        ip.status,
        ip.data_inscricao,
        ip.valor_interesse,
        ip.forma_pagamento,
        ip.observacoes,
        c.nome_completo as cooperado_nome,
        p.nome as projeto_nome
    FROM inscricao_projeto ip
    JOIN cooperados c ON c.id = ip.cooperado_id
    JOIN projetos p ON p.id = ip.project_id
    WHERE ip.status = 'pendente'
    ORDER BY ip.data_inscricao ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View para estatísticas de inscrições
CREATE OR REPLACE VIEW inscricao_projeto_stats AS
SELECT 
    COUNT(*) as total_inscricoes,
    COUNT(*) FILTER (WHERE status = 'pendente') as inscricoes_pendentes,
    COUNT(*) FILTER (WHERE status = 'aprovado') as inscricoes_aprovadas,
    COUNT(*) FILTER (WHERE status = 'rejeitado') as inscricoes_rejeitadas,
    COUNT(DISTINCT cooperado_id) as cooperados_inscritos,
    COUNT(DISTINCT project_id) as projetos_com_inscricoes
FROM inscricao_projeto;

-- View para inscrições com dados completos
CREATE OR REPLACE VIEW inscricao_projeto_completa AS
SELECT 
    ip.*,
    c.nome_completo as cooperado_nome,
    c.numero_associado as cooperado_numero,
    p.nome as projeto_nome,
    p.tipo as projeto_tipo,
    p.provincia as projeto_provincia,
    p.municipio as projeto_municipio,
    p.preco_final as projeto_preco
FROM inscricao_projeto ip
JOIN cooperados c ON c.id = ip.cooperado_id
JOIN projetos p ON p.id = ip.project_id;

-- ========================================
-- COMENTÁRIOS NA TABELA
-- ========================================

COMMENT ON TABLE inscricao_projeto IS 'Tabela para gerenciar inscrições de cooperados em projetos';
COMMENT ON COLUMN inscricao_projeto.id IS 'ID único da inscrição';
COMMENT ON COLUMN inscricao_projeto.project_id IS 'ID do projeto ao qual o cooperado se inscreveu';
COMMENT ON COLUMN inscricao_projeto.cooperado_id IS 'ID do cooperado que se inscreveu';
COMMENT ON COLUMN inscricao_projeto.status IS 'Status da inscrição: pendente, aprovado, rejeitado';
COMMENT ON COLUMN inscricao_projeto.data_inscricao IS 'Data em que o cooperado se inscreveu';
COMMENT ON COLUMN inscricao_projeto.data_aprovacao IS 'Data em que a inscrição foi aprovada/rejeitada';
COMMENT ON COLUMN inscricao_projeto.aprovado_por IS 'ID do administrador que aprovou/rejeitou';
COMMENT ON COLUMN inscricao_projeto.observacoes IS 'Observações adicionais sobre a inscrição';
COMMENT ON COLUMN inscricao_projeto.motivo_rejeicao IS 'Motivo da rejeição, se aplicável';
COMMENT ON COLUMN inscricao_projeto.prioridade IS 'Prioridade da inscrição (1-10, sendo 10 a mais alta)';
COMMENT ON COLUMN inscricao_projeto.documentos_anexados IS 'Array de URLs dos documentos anexados';
COMMENT ON COLUMN inscricao_projeto.valor_interesse IS 'Valor que o cooperado está disposto a investir';
COMMENT ON COLUMN inscricao_projeto.forma_pagamento IS 'Forma de pagamento pretendida';
COMMENT ON COLUMN inscricao_projeto.prazo_interesse IS 'Prazo até quando o cooperado tem interesse';

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserir alguns dados de exemplo (descomente se quiser testar)
/*
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
    'Interessado em financiamento bancário'
),
(
    (SELECT id FROM projetos LIMIT 1 OFFSET 1),
    (SELECT id FROM cooperados LIMIT 1 OFFSET 1),
    'aprovado',
    7500000.00,
    'dinheiro',
    'Pagamento à vista'
);
*/

-- ========================================
-- MENSAGEM DE CONFIRMAÇÃO
-- ========================================

DO $$
BEGIN
    RAISE NOTICE 'Tabela inscricao_projeto criada com sucesso!';
    RAISE NOTICE 'Índices e políticas de segurança configurados.';
    RAISE NOTICE 'Funções e views úteis criadas.';
    RAISE NOTICE 'Sistema pronto para uso!';
END $$;
