#!/usr/bin/env node

console.log('🔐 CORREÇÃO DAS POLÍTICAS RLS SUPABASE');
console.log('');

console.log('❌ ERRO IDENTIFICADO:');
console.log('"new row violates row-level security policy"');
console.log('');

console.log('✅ SOLUÇÃO: CONFIGURAR POLÍTICAS RLS');
console.log('='.repeat(60));
console.log('1. 🗂️ Criar bucket "documentos" (se não existir)');
console.log('2. 🔐 Configurar políticas RLS corretas');
console.log('3. 📤 Permitir upload anônimo');
console.log('4. 📥 Permitir download público');
console.log('5. 🗑️ Permitir remoção (opcional)');
console.log('='.repeat(60));

console.log('');
console.log('📋 PASSO A PASSO NO SUPABASE DASHBOARD:');
console.log('');

console.log('1️⃣ CRIAR BUCKET (se não existir):');
console.log('   Dashboard → Storage → New bucket');
console.log('   Nome: documentos');
console.log('   Public bucket: ✅ MARQUE');
console.log('   File size limit: 5MB');
console.log('   Allowed MIME types: image/*,application/pdf');

console.log('');
console.log('2️⃣ CONFIGURAR POLÍTICAS RLS:');
console.log('   Dashboard → Storage → documentos → Policies');
console.log('   Clique em "New policy"');
console.log('');

console.log('📤 POLÍTICA 1: PERMITIR UPLOAD (INSERT)');
console.log('Nome: "Permitir upload anônimo"');
console.log('Target roles: public');
console.log('Using expression:');
console.log('bucket_id = \'documentos\'');

console.log('');
console.log('📥 POLÍTICA 2: PERMITIR DOWNLOAD (SELECT)');
console.log('Nome: "Acesso público aos documentos"');
console.log('Target roles: public');
console.log('Using expression:');
console.log('bucket_id = \'documentos\'');

console.log('');
console.log('🗑️ POLÍTICA 3: PERMITIR REMOÇÃO (DELETE)');
console.log('Nome: "Permitir remoção anônima"');
console.log('Target roles: public');
console.log('Using expression:');
console.log('bucket_id = \'documentos\'');

console.log('');
console.log('🔧 SQL PARA EXECUTAR NO SUPABASE SQL EDITOR:');
console.log('='.repeat(60));

console.log(`
-- 1. Criar bucket (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documentos', 'documentos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

-- 2. Política para upload (INSERT)
CREATE POLICY "Permitir upload anônimo" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documentos');

-- 3. Política para download (SELECT)
CREATE POLICY "Acesso público aos documentos" ON storage.objects
FOR SELECT USING (bucket_id = 'documentos');

-- 4. Política para remoção (DELETE)
CREATE POLICY "Permitir remoção anônima" ON storage.objects
FOR DELETE USING (bucket_id = 'documentos');
`);

console.log('');
console.log('🎯 ALTERNATIVA: DESABILITAR RLS TEMPORARIAMENTE');
console.log('Se quiser uma solução rápida:');
console.log('Dashboard → Storage → documentos → Settings');
console.log('Desmarque "Enable Row Level Security (RLS)"');
console.log('⚠️ ATENÇÃO: Isso remove toda a segurança!');

console.log('');
console.log('🔍 VERIFICAÇÃO APÓS CONFIGURAÇÃO:');
console.log('1. Bucket "documentos" existe e é público');
console.log('2. Políticas RLS estão configuradas');
console.log('3. Teste de upload funciona');
console.log('4. URLs públicas são acessíveis');

console.log('');
console.log('📊 LOGS ESPERADOS APÓS CORREÇÃO:');
console.log('📤 Iniciando upload para Supabase: [nome_arquivo]');
console.log(' Tamanho do arquivo: X.XX MB');
console.log(' Caminho do arquivo: documentos/[nome]');
console.log('📤 Upload realizado com sucesso: [dados]');
console.log('✅ Upload concluído: [url_publica]');

console.log('');
console.log('✅ SISTEMA PRONTO PARA CORREÇÃO!');
console.log('🚀 Execute as configurações no Supabase e teste novamente');
