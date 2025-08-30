-- Script para configurar políticas RLS para migração
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente para migração
ALTER TABLE cooperados DISABLE ROW LEVEL SECURITY;
ALTER TABLE assinatura_planos DISABLE ROW LEVEL SECURITY;
ALTER TABLE projetos DISABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_auth DISABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_notificacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_suporte DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notificacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes_publicas DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_users DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Cooperados são visíveis para todos" ON cooperados;
DROP POLICY IF EXISTS "Pagamentos são visíveis para todos" ON pagamentos;
DROP POLICY IF EXISTS "Notificações são visíveis para todos" ON cooperado_notificacoes;
DROP POLICY IF EXISTS "Suporte é visível para todos" ON cooperado_suporte;
DROP POLICY IF EXISTS "Inscrições são visíveis para todos" ON inscricoes;

-- 3. Criar políticas mais permissivas para migração
CREATE POLICY "Permitir tudo para migração" ON cooperados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON assinatura_planos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON projetos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON pagamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON cooperado_auth FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON cooperado_notificacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON cooperado_suporte FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON crm_notificacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON inscricoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON inscricoes_publicas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON email_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON email_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON email_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo para migração" ON crm_users FOR ALL USING (true) WITH CHECK (true);

-- 4. Reabilitar RLS com políticas permissivas
ALTER TABLE cooperados ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinatura_planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperado_suporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes_publicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_users ENABLE ROW LEVEL SECURITY;

-- Verificar configuração
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'cooperados',
    'assinatura_planos',
    'projetos',
    'pagamentos',
    'cooperado_auth',
    'cooperado_notificacoes',
    'cooperado_suporte',
    'crm_notificacoes',
    'inscricoes',
    'inscricoes_publicas',
    'email_logs',
    'email_templates',
    'email_queue',
    'crm_users'
  );
