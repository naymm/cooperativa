#!/usr/bin/env node

console.log('🔍 VERIFICAÇÃO DOS CAMPOS SENHA_ALTERADA');
console.log('');

console.log('🎯 OBJETIVO:');
console.log('Verificar se os campos senha_alterada e data_alteracao_senha');
console.log('foram adicionados corretamente na tabela cooperado_auth.');
console.log('');

console.log('📋 CAMPOS NECESSÁRIOS:');
console.log('='.repeat(60));
console.log('1. senha_alterada: BOOLEAN DEFAULT FALSE');
console.log('2. data_alteracao_senha: TIMESTAMP WITH TIME ZONE');
console.log('3. senha_hash: VARCHAR (já existe)');
console.log('4. cooperado_id: UUID (já existe)');
console.log('='.repeat(60));

console.log('');
console.log('🔧 SQL PARA VERIFICAR ESTRUTURA:');
console.log('');

console.log(`
-- Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'cooperado_auth' 
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
    senha_hash,
    senha_alterada,
    data_alteracao_senha,
    created_at
FROM cooperado_auth 
LIMIT 5;
`);

console.log('');
console.log('🔧 SQL PARA ADICIONAR CAMPOS (se não existirem):');
console.log('');

console.log(`
-- Adicionar campo senha_alterada
ALTER TABLE cooperado_auth 
ADD COLUMN IF NOT EXISTS senha_alterada BOOLEAN DEFAULT FALSE;

-- Adicionar campo data_alteracao_senha
ALTER TABLE cooperado_auth 
ADD COLUMN IF NOT EXISTS data_alteracao_senha TIMESTAMP WITH TIME ZONE;

-- Atualizar registros existentes
UPDATE cooperado_auth 
SET senha_alterada = FALSE 
WHERE senha_alterada IS NULL;
`);

console.log('');
console.log('📋 PASSO A PASSO PARA VERIFICAÇÃO:');
console.log('');

console.log('1️⃣ VERIFICAR ESTRUTURA:');
console.log('   - Execute o primeiro SQL no Supabase');
console.log('   - Verifique se os campos aparecem na lista');
console.log('   - Confirme os tipos de dados');

console.log('');
console.log('2️⃣ VERIFICAR DADOS:');
console.log('   - Execute o segundo SQL no Supabase');
console.log('   - Verifique se os campos têm valores');
console.log('   - Confirme que senha_alterada = FALSE para registros existentes');

console.log('');
console.log('3️⃣ ADICIONAR CAMPOS (se necessário):');
console.log('   - Execute o terceiro SQL no Supabase');
console.log('   - Verifique se não há erros');
console.log('   - Confirme que os campos foram criados');

console.log('');
console.log('🔍 PROBLEMAS COMUNS:');
console.log('');

console.log('❌ Campo senha_alterada não existe:');
console.log('   - Execute o SQL de adição de campos');
console.log('   - Verifique se a tabela foi atualizada');
console.log('   - Confirme que não há erros de sintaxe');

console.log('');
console.log('❌ Campo existe mas tem valor NULL:');
console.log('   - Execute o UPDATE para definir FALSE');
console.log('   - Verifique se os registros foram atualizados');
console.log('   - Confirme que o valor padrão está funcionando');

console.log('');
console.log('❌ Erro de permissão:');
console.log('   - Verifique se tem permissão para ALTER TABLE');
console.log('   - Confirme que está no schema correto');
console.log('   - Verifique se a tabela existe');

console.log('');
console.log('📊 RESULTADO ESPERADO:');
console.log('');

console.log('✅ ESTRUTURA CORRETA:');
console.log('   - senha_alterada: boolean, nullable: true, default: false');
console.log('   - data_alteracao_senha: timestamp with time zone, nullable: true');
console.log('   - cooperado_id: uuid, not null');
console.log('   - senha_hash: character varying, not null');

console.log('');
console.log('✅ DADOS CORRETOS:');
console.log('   - Registros existentes com senha_alterada = FALSE');
console.log('   - data_alteracao_senha = NULL para registros antigos');
console.log('   - senha_hash preenchido com senhas temporárias');

console.log('');
console.log('🎯 TESTE ESPECÍFICO:');
console.log('');

console.log('1. Acesse o Supabase Dashboard');
console.log('2. Vá para SQL Editor');
console.log('3. Execute o primeiro SQL para verificar estrutura');
console.log('4. Execute o segundo SQL para verificar dados');
console.log('5. Se campos não existirem, execute o terceiro SQL');
console.log('6. Verifique se tudo está funcionando');

console.log('');
console.log('✅ SISTEMA PRONTO PARA VERIFICAÇÃO!');
console.log('🚀 Execute os SQLs no Supabase para verificar os campos');
