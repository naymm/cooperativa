#!/usr/bin/env node

console.log('🔍 VERIFICAÇÃO DA ESTRUTURA DA TABELA PAGAMENTOS');
console.log('');

console.log('🎯 OBJETIVO:');
console.log('Verificar se a tabela pagamentos tem a estrutura correta');
console.log('para suportar pagamentos de taxa de inscrição.');
console.log('');

console.log('📋 CAMPOS NECESSÁRIOS:');
console.log('='.repeat(60));
console.log('1. id: UUID (PRIMARY KEY)');
console.log('2. cooperado_id: UUID (FOREIGN KEY)');
console.log('3. assinatura_plano_id: UUID (FOREIGN KEY, nullable)');
console.log('4. valor: DECIMAL/NUMERIC');
console.log('5. data_vencimento: DATE');
console.log('6. tipo: VARCHAR (para "taxa_inscricao")');
console.log('7. status: VARCHAR (para "pendente", "pago", etc.)');
console.log('8. metodo_pagamento: VARCHAR');
console.log('9. referencia: VARCHAR');
console.log('10. observacoes: JSONB');
console.log('11. data_pagamento: TIMESTAMP (nullable)');
console.log('12. created_at: TIMESTAMP');
console.log('13. updated_at: TIMESTAMP');
console.log('='.repeat(60));

console.log('');
console.log('🔧 SQL PARA VERIFICAR ESTRUTURA:');
console.log('');

console.log(`
-- Verificar estrutura da tabela pagamentos
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
`);

console.log('');
console.log('🔧 SQL PARA VERIFICAR DADOS:');
console.log('');

console.log(`
-- Verificar registros existentes
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
`);

console.log('');
console.log('🔧 SQL PARA VERIFICAR PAGAMENTOS DE TAXA:');
console.log('');

console.log(`
-- Verificar pagamentos de taxa de inscrição
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
`);

console.log('');
console.log('🔧 SQL PARA CRIAR TABELA (se não existir):');
console.log('');

console.log(`
-- Criar tabela pagamentos se não existir
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cooperado_id UUID NOT NULL REFERENCES cooperados(id),
    assinatura_plano_id UUID REFERENCES assinatura_planos(id),
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    metodo_pagamento VARCHAR(50),
    referencia VARCHAR(100) UNIQUE,
    observacoes JSONB,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_cooperado_id ON pagamentos(cooperado_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_tipo ON pagamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_vencimento ON pagamentos(data_vencimento);
`);

console.log('');
console.log('🔧 SQL PARA ADICIONAR CAMPOS FALTANTES:');
console.log('');

console.log(`
-- Adicionar campos se não existirem
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

-- Adicionar constraint única para referência
ALTER TABLE pagamentos 
ADD CONSTRAINT IF NOT EXISTS uk_pagamentos_referencia UNIQUE (referencia);
`);

console.log('');
console.log('📋 PASSO A PASSO PARA VERIFICAÇÃO:');
console.log('');

console.log('1️⃣ VERIFICAR ESTRUTURA:');
console.log('   - Execute o primeiro SQL no Supabase');
console.log('   - Verifique se todos os campos necessários existem');
console.log('   - Confirme os tipos de dados');

console.log('');
console.log('2️⃣ VERIFICAR DADOS:');
console.log('   - Execute o segundo SQL no Supabase');
console.log('   - Verifique se há registros na tabela');
console.log('   - Confirme se os dados estão corretos');

console.log('');
console.log('3️⃣ VERIFICAR PAGAMENTOS DE TAXA:');
console.log('   - Execute o terceiro SQL no Supabase');
console.log('   - Verifique se há pagamentos de taxa de inscrição');
console.log('   - Confirme se o tipo está correto');

console.log('');
console.log('4️⃣ CRIAR/ATUALIZAR TABELA (se necessário):');
console.log('   - Execute o quarto SQL se a tabela não existir');
console.log('   - Execute o quinto SQL para adicionar campos faltantes');
console.log('   - Verifique se não há erros');

console.log('');
console.log('🔍 PROBLEMAS COMUNS:');
console.log('');

console.log('❌ Tabela pagamentos não existe:');
console.log('   - Execute o SQL de criação da tabela');
console.log('   - Verifique se a tabela foi criada');
console.log('   - Confirme se os índices foram criados');

console.log('');
console.log('❌ Campo tipo não existe:');
console.log('   - Execute o SQL para adicionar o campo');
console.log('   - Verifique se o campo foi adicionado');
console.log('   - Confirme o tipo de dados');

console.log('');
console.log('❌ Campo cooperado_id não existe:');
console.log('   - Verifique se a foreign key está correta');
console.log('   - Confirme se a tabela cooperados existe');
console.log('   - Verifique se o relacionamento está funcionando');

console.log('');
console.log('❌ Erro de constraint:');
console.log('   - Verifique se a referência é única');
console.log('   - Confirme se não há duplicatas');
console.log('   - Verifique se o formato está correto');

console.log('');
console.log('📊 RESULTADO ESPERADO:');
console.log('');

console.log('✅ ESTRUTURA CORRETA:');
console.log('   - Todos os campos necessários existem');
console.log('   - Tipos de dados estão corretos');
console.log('   - Índices foram criados');
console.log('   - Constraints estão funcionando');

console.log('');
console.log('✅ DADOS CORRETOS:');
console.log('   - Pagamentos de taxa de inscrição existem');
console.log('   - Tipo = "taxa_inscricao"');
console.log('   - Status = "pendente" para novos');
console.log('   - Referência única para cada pagamento');

console.log('');
console.log('🎯 TESTE ESPECÍFICO:');
console.log('');

console.log('1. Acesse o Supabase Dashboard');
console.log('2. Vá para SQL Editor');
console.log('3. Execute os SQLs de verificação');
console.log('4. Verifique se a estrutura está correta');
console.log('5. Execute os SQLs de criação se necessário');
console.log('6. Teste a criação de um pagamento manual');

console.log('');
console.log('✅ SISTEMA PRONTO PARA VERIFICAÇÃO!');
console.log('🚀 Execute os SQLs no Supabase para verificar a estrutura');
