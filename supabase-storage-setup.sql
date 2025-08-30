-- =====================================================
-- CONFIGURAÇÃO DO SUPABASE STORAGE PARA UPLOAD
-- =====================================================

-- 1. Criar bucket "documentos" (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documentos', 'documentos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir upload anônimo" ON storage.objects;
DROP POLICY IF EXISTS "Acesso público aos documentos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir remoção anônima" ON storage.objects;

-- 3. Política para upload (INSERT) - Permitir upload anônimo
CREATE POLICY "Permitir upload anônimo" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documentos');

-- 4. Política para download (SELECT) - Acesso público
CREATE POLICY "Acesso público aos documentos" ON storage.objects
FOR SELECT USING (bucket_id = 'documentos');

-- 5. Política para remoção (DELETE) - Permitir remoção anônima
CREATE POLICY "Permitir remoção anônima" ON storage.objects
FOR DELETE USING (bucket_id = 'documentos');

-- 6. Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- =====================================================
-- CONFIGURAÇÕES ADICIONAIS (OPCIONAL)
-- =====================================================

-- Habilitar RLS na tabela storage.objects (se não estiver habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Verificar configuração do bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'documentos';
