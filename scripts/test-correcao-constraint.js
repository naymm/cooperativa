#!/usr/bin/env node

console.log('🔧 CORREÇÃO DA CONSTRAINT METODO_PAGAMENTO');
console.log('');

console.log('🎯 PROBLEMA IDENTIFICADO:');
console.log('='.repeat(60));
console.log('❌ Erro: "new row for relation "pagamentos" violates check constraint "pagamentos_metodo_pagamento_check"');
console.log('❌ Causa: A constraint não permite o valor "pendente" para metodo_pagamento');
console.log('='.repeat(60));

console.log('');
console.log('📋 DADOS QUE FALHARAM:');
console.log('');

console.log('✅ cooperado_id: "16d4996a-70f9-49a2-8d29-dc3650160460"');
console.log('✅ assinatura_plano_id: "1dc9b806-7e66-4d74-a365-6842fb135e6d"');
console.log('✅ valor: 10000');
console.log('✅ data_vencimento: "2025-09-30"');
console.log('✅ tipo: "taxa_inscricao"');
console.log('✅ status: "pendente"');
console.log('❌ metodo_pagamento: "pendente" ← PROBLEMA AQUI');
console.log('✅ referencia: "TAXA-CS116659-1756602120403"');

console.log('');
console.log('🔧 SOLUÇÃO:');
console.log('');

console.log('1️⃣ EXECUTAR SQL DE CORREÇÃO:');
console.log('   - Execute: supabase-fix-metodo-pagamento-constraint.sql');
console.log('   - Remove a constraint problemática');
console.log('   - Cria nova constraint que permite "pendente"');

console.log('');
console.log('2️⃣ VALORES PERMITIDOS APÓS CORREÇÃO:');
console.log('   - pendente');
console.log('   - cartao_credito');
console.log('   - cartao_debito');
console.log('   - transferencia_bancaria');
console.log('   - dinheiro');
console.log('   - cheque');
console.log('   - mbway');
console.log('   - multibanco');
console.log('   - paypal');
console.log('   - stripe');
console.log('   - outro');

console.log('');
console.log('🔍 SQL PARA EXECUTAR:');
console.log('');

console.log(`
-- 1. Verificar constraint atual
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%metodo_pagamento%';

-- 2. Remover constraint problemática
ALTER TABLE pagamentos 
DROP CONSTRAINT IF EXISTS pagamentos_metodo_pagamento_check;

-- 3. Criar nova constraint
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
`);

console.log('');
console.log('📋 PASSO A PASSO PARA CORREÇÃO:');
console.log('');

console.log('1️⃣ EXECUTAR CORREÇÃO:');
console.log('   - Acesse o Supabase Dashboard');
console.log('   - Vá para SQL Editor');
console.log('   - Execute o arquivo: supabase-fix-metodo-pagamento-constraint.sql');
console.log('   - Verifique se não há erros');

console.log('');
console.log('2️⃣ VERIFICAR CORREÇÃO:');
console.log('   - Execute o SQL de verificação');
console.log('   - Confirme que a nova constraint foi criada');
console.log('   - Verifique se "pendente" está na lista');

console.log('');
console.log('3️⃣ TESTAR CRIAÇÃO:');
console.log('   - Aprove uma inscrição novamente');
console.log('   - Verifique os logs no console');
console.log('   - Confirme que não há mais erro de constraint');

console.log('');
console.log('4️⃣ VERIFICAR PAGAMENTO:');
console.log('   - Faça login com o cooperado');
console.log('   - Verifique se o pagamento aparece');
console.log('   - Teste o fluxo completo');

console.log('');
console.log('🔍 LOGS ESPERADOS APÓS CORREÇÃO:');
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
console.log('   - Verificar se a constraint foi realmente removida');
console.log('   - Verificar se a nova constraint foi criada');

console.log('');
console.log('🔍 VERIFICAÇÕES ADICIONAIS:');
console.log('');

console.log('📄 Verificar se a constraint foi removida:');
console.log(`
SELECT 
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'pagamentos'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%metodo_pagamento%';
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
console.log('🎯 TESTE ESPECÍFICO:');
console.log('');

console.log('1. Execute o SQL de correção');
console.log('2. Verifique se a constraint foi atualizada');
console.log('3. Aprove uma inscrição novamente');
console.log('4. Verifique os logs no console');
console.log('5. Teste o login do cooperado');
console.log('6. Confirme que o pagamento aparece');

console.log('');
console.log('✅ SISTEMA PRONTO PARA CORREÇÃO!');
console.log('🚀 Execute o SQL e teste novamente a aprovação de inscrição');
