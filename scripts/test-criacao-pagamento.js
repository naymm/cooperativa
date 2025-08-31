#!/usr/bin/env node

console.log('💰 TESTE DE CRIAÇÃO DE PAGAMENTOS');
console.log('');

console.log('🎯 OBJETIVO:');
console.log('Verificar se os pagamentos estão sendo criados corretamente');
console.log('durante a aprovação de inscrições.');
console.log('');

console.log('📋 PROBLEMA IDENTIFICADO:');
console.log('='.repeat(60));
console.log('❌ Pagamentos pendentes encontrados: Array(0)');
console.log('❌ Nenhum pagamento pendente encontrado');
console.log('='.repeat(60));

console.log('');
console.log('🔍 POSSÍVEIS CAUSAS:');
console.log('');

console.log('1️⃣ TABELA PAGAMENTOS NÃO EXISTE:');
console.log('   - A tabela pagamentos pode não ter sido criada');
console.log('   - Execute o SQL: supabase-setup-pagamentos.sql');
console.log('   - Verifique se a tabela foi criada corretamente');

console.log('');
console.log('2️⃣ CAMPOS FALTANTES:');
console.log('   - Campo "tipo" pode não existir');
console.log('   - Campo "status" pode não existir');
console.log('   - Campo "cooperado_id" pode não existir');
console.log('   - Execute o SQL para adicionar campos faltantes');

console.log('');
console.log('3️⃣ ERRO NA CRIAÇÃO:');
console.log('   - Pode haver erro silencioso na criação');
console.log('   - Verificar logs no console do navegador');
console.log('   - Verificar se há constraints violadas');

console.log('');
console.log('4️⃣ PROBLEMA DE FILTRO:');
console.log('   - O filtro pode estar incorreto');
console.log('   - Verificar se o tipo é exatamente "taxa_inscricao"');
console.log('   - Verificar se o status é exatamente "pendente"');

console.log('');
console.log('🔧 SOLUÇÃO PASSO A PASSO:');
console.log('');

console.log('1️⃣ EXECUTAR SQL DE CONFIGURAÇÃO:');
console.log('   - Execute: supabase-setup-pagamentos.sql');
console.log('   - Verifique se não há erros');
console.log('   - Confirme que a tabela foi criada');

console.log('');
console.log('2️⃣ VERIFICAR ESTRUTURA:');
console.log('   - Execute o SQL de verificação de estrutura');
console.log('   - Confirme que todos os campos existem');
console.log('   - Verifique os tipos de dados');

console.log('');
console.log('3️⃣ TESTAR CRIAÇÃO MANUAL:');
console.log('   - Crie um pagamento manual no Supabase');
console.log('   - Use os mesmos dados que o sistema usa');
console.log('   - Verifique se não há erros');

console.log('');
console.log('4️⃣ VERIFICAR LOGS:');
console.log('   - Abra o console do navegador');
console.log('   - Aprove uma inscrição');
console.log('   - Procure por logs de criação de pagamento');
console.log('   - Verifique se há erros');

console.log('');
console.log('🔍 SQL PARA TESTE MANUAL:');
console.log('');

console.log(`
-- Teste de criação manual de pagamento
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
    'ID_DO_COOPERADO_AQUI',  -- Substitua pelo ID real
    'ID_DO_PLANO_AQUI',      -- Substitua pelo ID real ou NULL
    50000,                   -- Valor da taxa
    CURRENT_DATE + INTERVAL '30 days',
    'taxa_inscricao',
    'pendente',
    'pendente',
    'TAXA-TESTE-' || EXTRACT(EPOCH FROM NOW()),
    '{"descricao": "Teste manual", "gerado_automaticamente": false}'
);
`);

console.log('');
console.log('🔍 SQL PARA VERIFICAR PAGAMENTOS:');
console.log('');

console.log(`
-- Verificar todos os pagamentos
SELECT 
    id,
    cooperado_id,
    valor,
    tipo,
    status,
    referencia,
    created_at
FROM pagamentos 
ORDER BY created_at DESC;

-- Verificar pagamentos de taxa de inscrição
SELECT 
    id,
    cooperado_id,
    valor,
    tipo,
    status,
    referencia
FROM pagamentos 
WHERE tipo = 'taxa_inscricao'
ORDER BY created_at DESC;

-- Verificar pagamentos pendentes
SELECT 
    id,
    cooperado_id,
    valor,
    tipo,
    status,
    referencia
FROM pagamentos 
WHERE status = 'pendente'
ORDER BY created_at DESC;
`);

console.log('');
console.log('🔍 VERIFICAÇÕES NO CÓDIGO:');
console.log('');

console.log('📄 src/pages/Inscricoes.jsx:');
console.log('   - Linha ~270: Criação do pagamento');
console.log('   - Verificar se Pagamento.create está sendo chamado');
console.log('   - Verificar se os dados estão corretos');
console.log('   - Verificar se há try/catch');

console.log('');
console.log('📄 src/pages/PortalPagamentoTaxa.jsx:');
console.log('   - Linha ~90: Busca de pagamentos');
console.log('   - Verificar se o filtro está correto');
console.log('   - Verificar se o cooperado_id está correto');
console.log('   - Verificar se há logs de debug');

console.log('');
console.log('🔍 LOGS ESPERADOS:');
console.log('');

console.log('✅ APROVAÇÃO DE INSCRIÇÃO:');
console.log('   - "💰 Criando pagamento pendente para taxa de inscrição..."');
console.log('   - "📋 Dados do pagamento: ..."');
console.log('   - "✅ Pagamento criado com sucesso: ..."');
console.log('   - "🆔 ID do pagamento criado: ..."');

console.log('');
console.log('✅ PÁGINA DE PAGAMENTO:');
console.log('   - "🔍 Buscando pagamentos com filtros: ..."');
console.log('   - "💰 Pagamentos pendentes encontrados: [...]"');
console.log('   - "📊 Total de pagamentos encontrados: X"');

console.log('');
console.log('❌ LOGS DE ERRO:');
console.log('   - "❌ Erro ao criar pagamento: ..."');
console.log('   - "❌ Erro ao carregar dados de pagamento: ..."');
console.log('   - "⚠️ Nenhum pagamento pendente encontrado"');

console.log('');
console.log('🎯 TESTE ESPECÍFICO:');
console.log('');

console.log('1. Execute o SQL de configuração');
console.log('2. Verifique a estrutura da tabela');
console.log('3. Teste criação manual de pagamento');
console.log('4. Aprove uma inscrição e verifique logs');
console.log('5. Teste o login do cooperado');
console.log('6. Verifique se o pagamento aparece na página');

console.log('');
console.log('✅ SISTEMA PRONTO PARA DEBUG!');
console.log('🚀 Execute os passos para identificar e corrigir o problema');
