-- Script de migração Base44 para Supabase
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela Cooperados
CREATE TABLE IF NOT EXISTS cooperados (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_associado VARCHAR UNIQUE NOT NULL,
    nome_completo VARCHAR NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR CHECK (estado_civil IN ('solteiro', 'casado', 'divorciado', 'viuvo')) NOT NULL,
    nome_conjuge VARCHAR,
    tem_filhos BOOLEAN DEFAULT false,
    numero_filhos INTEGER,
    nacionalidade VARCHAR DEFAULT 'Angolana',
    bi VARCHAR UNIQUE NOT NULL,
    validade_documento_bi DATE,
    email VARCHAR UNIQUE NOT NULL,
    telefone VARCHAR NOT NULL,
    provincia VARCHAR NOT NULL,
    municipio VARCHAR NOT NULL,
    comuna VARCHAR,
    endereco_completo TEXT,
    profissao VARCHAR NOT NULL,
    sector_profissional VARCHAR CHECK (sector_profissional IN ('publico', 'privado')) NOT NULL,
    entidade_publica VARCHAR,
    entidade_privada VARCHAR,
    renda_mensal DECIMAL(10,2),
    documentos_anexados JSONB,
    status VARCHAR CHECK (status IN ('ativo', 'inativo', 'suspenso')) DEFAULT 'ativo',
    data_inscricao DATE DEFAULT CURRENT_DATE,
    assinatura_plano_id UUID,
    taxa_inscricao_paga BOOLEAN DEFAULT false,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela Assinatura Planos
CREATE TABLE IF NOT EXISTS assinatura_planos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR NOT NULL,
    descricao TEXT,
    valor_mensal DECIMAL(10,2) NOT NULL,
    beneficios JSONB,
    status VARCHAR CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela Projetos
CREATE TABLE IF NOT EXISTS projetos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descricao TEXT,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_entrada DECIMAL(10,2),
    numero_parcelas INTEGER,
    valor_parcela DECIMAL(10,2),
    data_inicio DATE,
    data_fim DATE,
    status VARCHAR CHECK (status IN ('ativo', 'inativo', 'concluido')) DEFAULT 'ativo',
    cooperados_interessados JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela Pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cooperado_id UUID REFERENCES cooperados(id) ON DELETE CASCADE,
    assinatura_plano_id UUID REFERENCES assinatura_planos(id),
    projeto_id UUID REFERENCES projetos(id),
    valor DECIMAL(10,2) NOT NULL,
    data_pagamento DATE,
    data_vencimento DATE,
    mes_referencia VARCHAR(7), -- YYYY-MM
    metodo_pagamento VARCHAR CHECK (metodo_pagamento IN ('transferencia', 'deposito', 'multicaixa', 'dinheiro', 'sistema')) NOT NULL,
    status VARCHAR CHECK (status IN ('pendente', 'confirmado', 'atrasado', 'cancelado')) DEFAULT 'pendente',
    referencia VARCHAR,
    tipo VARCHAR CHECK (tipo IN ('mensalidade', 'taxa_inscricao', 'pagamento_projeto', 'outro')) DEFAULT 'mensalidade',
    comprovante_url VARCHAR,
    observacoes TEXT,
    confirmado_por VARCHAR,
    tipo_pagamento_projeto VARCHAR CHECK (tipo_pagamento_projeto IN ('entrada', 'parcial', 'total')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela Cooperado Auth
CREATE TABLE IF NOT EXISTS cooperado_auth (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cooperado_id UUID REFERENCES cooperados(id) ON DELETE CASCADE UNIQUE,
    email VARCHAR UNIQUE NOT NULL,
    senha_hash VARCHAR NOT NULL,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    status VARCHAR CHECK (status IN ('ativo', 'inativo', 'bloqueado')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela Cooperado Notificações
CREATE TABLE IF NOT EXISTS cooperado_notificacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cooperado_id UUID REFERENCES cooperados(id) ON DELETE CASCADE,
    titulo VARCHAR NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR CHECK (tipo IN ('info', 'aviso', 'erro', 'sucesso')) DEFAULT 'info',
    lida BOOLEAN DEFAULT false,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela Cooperado Suporte
CREATE TABLE IF NOT EXISTS cooperado_suporte (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cooperado_id UUID REFERENCES cooperados(id) ON DELETE CASCADE,
    assunto VARCHAR NOT NULL,
    mensagem TEXT NOT NULL,
    status VARCHAR CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'fechado')) DEFAULT 'aberto',
    prioridade VARCHAR CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
    resposta TEXT,
    respondido_por VARCHAR,
    data_resposta TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela CRM Notificações
CREATE TABLE IF NOT EXISTS crm_notificacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR CHECK (tipo IN ('info', 'aviso', 'erro', 'sucesso')) DEFAULT 'info',
    destinatarios JSONB, -- Array de IDs de usuários
    lida_por JSONB, -- Array de IDs de usuários que leram
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela Inscrições
CREATE TABLE IF NOT EXISTS inscricoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cooperado_id UUID REFERENCES cooperados(id) ON DELETE CASCADE,
    plano_id UUID REFERENCES assinatura_planos(id),
    data_inscricao DATE DEFAULT CURRENT_DATE,
    status VARCHAR CHECK (status IN ('pendente', 'aprovada', 'rejeitada')) DEFAULT 'pendente',
    observacoes TEXT,
    aprovado_por VARCHAR,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabela Inscrições Públicas
CREATE TABLE IF NOT EXISTS inscricoes_publicas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome_completo VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    telefone VARCHAR NOT NULL,
    provincia VARCHAR NOT NULL,
    municipio VARCHAR NOT NULL,
    profissao VARCHAR NOT NULL,
    sector_profissional VARCHAR CHECK (sector_profissional IN ('publico', 'privado')) NOT NULL,
    entidade VARCHAR,
    renda_mensal DECIMAL(10,2),
    plano_interesse UUID REFERENCES assinatura_planos(id),
    status VARCHAR CHECK (status IN ('pendente', 'aprovada', 'rejeitada')) DEFAULT 'pendente',
    observacoes TEXT,
    processado_por VARCHAR,
    data_processamento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tabela Email Logs
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    destinatario VARCHAR NOT NULL,
    assunto VARCHAR NOT NULL,
    corpo TEXT NOT NULL,
    status VARCHAR CHECK (status IN ('enviado', 'erro', 'pendente')) DEFAULT 'pendente',
    erro_mensagem TEXT,
    tentativas INTEGER DEFAULT 0,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_entrega TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tabela Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR NOT NULL,
    assunto VARCHAR NOT NULL,
    corpo TEXT NOT NULL,
    variaveis JSONB, -- Array de variáveis disponíveis
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Tabela Email Queue
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES email_templates(id),
    destinatario VARCHAR NOT NULL,
    variaveis JSONB, -- Variáveis para substituir no template
    prioridade INTEGER DEFAULT 0,
    status VARCHAR CHECK (status IN ('pendente', 'processando', 'enviado', 'erro')) DEFAULT 'pendente',
    tentativas INTEGER DEFAULT 0,
    proxima_tentativa TIMESTAMP WITH TIME ZONE,
    data_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Tabela CRM Users
CREATE TABLE IF NOT EXISTS crm_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    senha_hash VARCHAR NOT NULL,
    cargo VARCHAR,
    permissoes JSONB, -- Array de permissões
    status VARCHAR CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    ultimo_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cooperados_email ON cooperados(email);
CREATE INDEX IF NOT EXISTS idx_cooperados_bi ON cooperados(bi);
CREATE INDEX IF NOT EXISTS idx_cooperados_numero_associado ON cooperados(numero_associado);
CREATE INDEX IF NOT EXISTS idx_pagamentos_cooperado_id ON pagamentos(cooperado_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data_vencimento ON pagamentos(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_cooperado_auth_email ON cooperado_auth(email);
CREATE INDEX IF NOT EXISTS idx_cooperado_notificacoes_cooperado_id ON cooperado_notificacoes(cooperado_id);
CREATE INDEX IF NOT EXISTS idx_cooperado_notificacoes_lida ON cooperado_notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_inscricoes_publicas_email ON inscricoes_publicas(email);
CREATE INDEX IF NOT EXISTS idx_inscricoes_publicas_status ON inscricoes_publicas(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_proxima_tentativa ON email_queue(proxima_tentativa);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_cooperados_updated_at BEFORE UPDATE ON cooperados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assinatura_planos_updated_at BEFORE UPDATE ON assinatura_planos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projetos_updated_at BEFORE UPDATE ON projetos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cooperado_auth_updated_at BEFORE UPDATE ON cooperado_auth FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cooperado_suporte_updated_at BEFORE UPDATE ON cooperado_suporte FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inscricoes_updated_at BEFORE UPDATE ON inscricoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inscricoes_publicas_updated_at BEFORE UPDATE ON inscricoes_publicas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_users_updated_at BEFORE UPDATE ON crm_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) - básicas
ALTER TABLE cooperados ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_suporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_users ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (você pode ajustar conforme necessário)
CREATE POLICY "Cooperados são visíveis para todos" ON cooperados FOR SELECT USING (true);
CREATE POLICY "Pagamentos são visíveis para todos" ON pagamentos FOR SELECT USING (true);
CREATE POLICY "Notificações são visíveis para todos" ON cooperado_notificacoes FOR SELECT USING (true);
CREATE POLICY "Suporte é visível para todos" ON cooperado_suporte FOR SELECT USING (true);
CREATE POLICY "Inscrições são visíveis para todos" ON inscricoes FOR SELECT USING (true);

-- Comentários para documentação
COMMENT ON TABLE cooperados IS 'Tabela principal de cooperados da cooperativa';
COMMENT ON TABLE assinatura_planos IS 'Planos de assinatura disponíveis';
COMMENT ON TABLE projetos IS 'Projetos da cooperativa';
COMMENT ON TABLE pagamentos IS 'Pagamentos dos cooperados';
COMMENT ON TABLE cooperado_auth IS 'Autenticação dos cooperados';
COMMENT ON TABLE cooperado_notificacoes IS 'Notificações para cooperados';
COMMENT ON TABLE cooperado_suporte IS 'Sistema de suporte para cooperados';
COMMENT ON TABLE crm_notificacoes IS 'Notificações internas do CRM';
COMMENT ON TABLE inscricoes IS 'Inscrições em planos';
COMMENT ON TABLE inscricoes_publicas IS 'Inscrições públicas';
COMMENT ON TABLE email_logs IS 'Logs de emails enviados';
COMMENT ON TABLE email_templates IS 'Templates de email';
COMMENT ON TABLE email_queue IS 'Fila de emails para envio';
COMMENT ON TABLE crm_users IS 'Usuários do sistema CRM';
