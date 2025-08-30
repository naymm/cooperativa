import { base44 } from './base44Client';
import { supabase } from './entities';

// Função de upload para Supabase
export const UploadFile = async ({ file }) => {
  try {
    console.log("📤 Iniciando upload para Supabase:", file.name);
    console.log("📊 Tamanho do arquivo:", (file.size / 1024 / 1024).toFixed(2), "MB");
    
    // Validações
    if (!file) {
      throw new Error("Nenhum arquivo fornecido");
    }
    
    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Arquivo muito grande. Máximo 5MB permitido.");
    }
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Tipo de arquivo não suportado. Use PNG, JPG ou PDF.");
    }
    
    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `documentos/${fileName}`;
    
    console.log("📁 Caminho do arquivo:", filePath);
    
    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from('documentos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("❌ Erro no upload para Supabase:", error);
      throw new Error(`Erro no upload: ${error.message}`);
    }
    
    console.log("📤 Upload realizado com sucesso:", data);
    
    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);
    
    console.log("✅ Upload concluído:", urlData.publicUrl);
    
    return {
      file_url: urlData.publicUrl,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type
    };
    
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    throw error;
  }
};

export const Core = base44.integrations.Core;

export const InvokeLLM = base44.integrations.Core.InvokeLLM;

export const SendEmail = base44.integrations.Core.SendEmail;

export const GenerateImage = base44.integrations.Core.GenerateImage;

export const ExtractDataFromUploadedFile = base44.integrations.Core.ExtractDataFromUploadedFile;






