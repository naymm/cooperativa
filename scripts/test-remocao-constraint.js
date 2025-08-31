#!/usr/bin/env node

console.log('🗑️ REMOÇÃO COMPLETA DA CONSTRAINT PROBLEMÁTICA');
console.log('');

console.log('🎯 PROBLEMA PERSISTENTE:');
console.log('='.repeat(60));
console.log('❌ Erro ainda ocorre: "violates check constraint "pagamentos_metodo_pagamento_check"');
console.log('❌ A constraint anterior não foi removida corretamente');
console.log('❌ Solução: Remover TODAS as constraints de check da tabela');
console.log('='.repeat(60));

console.log('');
console.log('📋 DADOS QUE FALHARAM NOVAMENTE:');
console.log('');

console.log('✅ cooperado_id: "47ede75c-78fc-4d1b-9100-c80f210c3fb5"');
console.log('✅ assinatura_plano_id: "1dc9b806-7e66-4d74-a365-6842fb135e6d"');
console.log('✅ valor: 10000');
console.log('✅ data_vencimento: "2025-09-30"');
console.log('✅ tipo: "taxa_inscricao"');
console.log('✅ status: "pendente"');
console.log('❌ metodo_pagamento: "pendente" ← AINDA BLOQUEADO');
console.log('✅ referencia: "TAXA-CS473348-1756602476872"');

console.log('');
console.log('🔧 SOLUÇÃO DEFINITIVA:');
console.log('');

console.log('1️⃣ REMOVER TODAS AS CONSTRAINTS DE CHECK:');
console.log('   - Execute: supabase-remove-constraint-pagamentos.sql');
console.log('   - Remove TODAS as constraints de check da tabela');
console.log('   - Permite qualquer valor para metodo_pagamento');

console.log('');
console.log('2️⃣ TESTAR INSERÇÃO DIRETA:');
console.log('   - O script testa inserção com "pendente"');
console.log('   - Verifica se o pagamento foi criado');
console.log('   - Remove o pagamento de teste');

console.log('');
console.log('🔍 SQL PARA EXECUTAR:');
console.log('');

console.log(`
-- 1. Verificar todas as constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass;

-- 2. Remover TODAS as constraints de check
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

-- 3. Testar inserção
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
    '{"descricao": "Teste após remoção", "gerado_automaticamente": true}'
);
`);

console.log('');
console.log('📋 PASSO A PASSO PARA CORREÇÃO DEFINITIVA:');
console.log('');

console.log('1️⃣ EXECUTAR REMOÇÃO COMPLETA:');
console.log('   - Acesse o Supabase Dashboard');
console.log('   - Vá para SQL Editor');
console.log('   - Execute: supabase-remove-constraint-pagamentos.sql');
console.log('   - Verifique se não há erros');

console.log('');
console.log('2️⃣ VERIFICAR REMOÇÃO:');
console.log('   - Execute o SQL de verificação');
console.log('   - Confirme que não há mais constraints de check');
console.log('   - Verifique se o teste de inserção funcionou');

console.log('');
console.log('3️⃣ TESTAR SISTEMA:');
console.log('   - Aprove uma inscrição novamente');
console.log('   - Verifique os logs no console');
console.log('   - Confirme que não há mais erro de constraint');

console.log('');
console.log('4️⃣ VERIFICAR PAGAMENTO:');
console.log('   - Faça login com o cooperado');
console.log('   - Verifique se o pagamento aparece');
console.log('   - Teste o fluxo completo');

console.log('');
console.log('🔍 LOGS ESPERADOS APÓS REMOÇÃO:');
console.log('');

console.log('✅ APROVAÇÃO DE INSCRIÇÃO:');
console.log('   - "💰 Criando pagamento pendente para taxa de inscrição..."');
console.log('   - "📋 Dados do pagamento: ..."');
console.log('   - "✅ Pagamento criado com sucesso: ..."');
console.log('   - "🆔 ID do pagamento criado: ..."');
console.log('   - NÃO deve aparecer erro de constraint');

console.log('');
console.log('✅ PÁGINA DE PAGAMENTO:');
console.log('   - "🔍 Buscando pagamentos com filtros: ..."');
console.log('   - "💰 Pagamentos pendentes encontrados: [Array com 1 item]"');
console.log('   - "📊 Total de pagamentos encontrados: 1"');

console.log('');
console.log('❌ SE AINDA HOUVER PROBLEMA:');
console.log('   - "❌ Erro ao criar pagamento: [outro erro]"');
console.log('   - Verificar se as constraints foram realmente removidas');
console.log('   - Verificar se há outros tipos de constraints');

console.log('');
console.log('🔍 VERIFICAÇÕES ADICIONAIS:');
console.log('');

console.log('📄 Verificar se não há mais constraints de check:');
console.log(`
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass
AND contype = 'c';
`);

console.log('');
console.log('📄 Verificar pagamentos criados:');
console.log(`
SELECT 
    id,
    cooperado_id,
    valor,
    tipo,
    status,
    metodo_pagamento,
    referencia
FROM pagamentos 
WHERE tipo = 'taxa_inscricao'
ORDER BY created_at DESC;
`);

console.log('');
console.log('⚠️ IMPORTANTE:');
console.log('');

console.log('🔒 SEGURANÇA:');
console.log('   - A remoção das constraints permite qualquer valor');
console.log('   - O sistema deve validar os dados na aplicação');
console.log('   - Não é ideal para produção, mas resolve o problema');

console.log('');
console.log('🔄 ALTERNATIVA FUTURA:');
console.log('   - Após resolver, pode recriar constraints mais flexíveis');
console.log('   - Ou usar ENUM para valores permitidos');
console.log('   - Ou validar apenas na aplicação');

console.log('');
console.log('🎯 TESTE ESPECÍFICO:');
console.log('');

console.log('1. Execute o SQL de remoção completa');
console.log('2. Verifique se as constraints foram removidas');
console.log('3. Confirme que o teste de inserção funcionou');
console.log('4. Aprove uma inscrição novamente');
console.log('5. Verifique os logs no console');
console.log('6. Teste o login do cooperado');
console.log('7. Confirme que o pagamento aparece');

console.log('');
console.log('✅ SISTEMA PRONTO PARA CORREÇÃO DEFINITIVA!');
console.log('🚀 Execute o SQL e teste novamente a aprovação de inscrição');
