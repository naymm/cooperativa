import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Upload, X, FileText, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Cooperado } from "@/api/entities";
import { UploadFile } from "@/api/integrations";

export default function FormUploadDocumentos({ cooperado, open, onOpenChange, onSave }) {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState({
    foto_passe: null,
    bi_frente_verso: null,
    bi_conjuge: null,
    agregado_familiar_doc: null,
    declaracao_servico: null,
    nif_documento: null
  });
  const [uploadProgress, setUploadProgress] = useState({});

  // Preencher documentos existentes
  useEffect(() => {
    if (cooperado && cooperado.documentos_anexados) {
      setDocuments(prev => ({
        ...prev,
        ...cooperado.documentos_anexados
      }));
    }
  }, [cooperado]);

  const handleFileChange = (field, file) => {
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Tipo de arquivo não suportado. Use JPG, PNG ou PDF.");
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleRemoveFile = (field) => {
    setDocuments(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const handleUpload = async () => {
    // Verificar se há arquivos novos para enviar
    const newFiles = Object.values(documents).filter(file => file instanceof File);
    if (newFiles.length === 0) {
      toast.info("Nenhum arquivo novo selecionado para enviar.");
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const uploadedDocuments = {};
      let uploadedCount = 0;
      const totalFiles = Object.values(documents).filter(file => file instanceof File).length;

      // Upload de cada arquivo individualmente
      for (const [field, file] of Object.entries(documents)) {
        if (file instanceof File) {
          try {
            console.log(`Fazendo upload do arquivo: ${field}`);
            
            // Fazer upload do arquivo usando a API base44
            const response = await UploadFile({ file });
            
            // Salvar a URL do arquivo
            uploadedDocuments[field] = response.file_url;
            
            uploadedCount++;
            setUploadProgress(prev => ({
              ...prev,
              [field]: (uploadedCount / totalFiles) * 100
            }));
            
            console.log(`Upload concluído para ${field}:`, response.file_url);
          } catch (error) {
            console.error(`Erro no upload do arquivo ${field}:`, error);
            toast.error(`Erro ao enviar ${getDocumentLabel(field)}. Tente novamente.`);
            return;
          }
        } else if (file && typeof file === 'string') {
          // Se já é uma URL (documento já existente), manter
          uploadedDocuments[field] = file;
        }
      }

      // Atualizar o cooperado no banco de dados com os novos documentos
      if (Object.keys(uploadedDocuments).length > 0) {
        console.log("Atualizando cooperado com documentos:", uploadedDocuments);
        
        const updateData = {
          documentos_anexados: {
            ...cooperado.documentos_anexados,
            ...uploadedDocuments
          }
        };

        await Cooperado.update(cooperado.id, updateData);
        console.log("Cooperado atualizado com sucesso");
      }
      
      toast.success("Documentos enviados com sucesso!");
      onSave && onSave(uploadedDocuments);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar documentos:", error);
      toast.error("Erro ao enviar documentos. Tente novamente.");
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onOpenChange(false);
    }
  };

  const getDocumentLabel = (field) => {
    const labels = {
      foto_passe: "Foto Passe",
      bi_frente_verso: "BI (Frente e Verso)",
      bi_conjuge: "BI do Cônjuge",
      agregado_familiar_doc: "Agregado Familiar",
      declaracao_servico: "Declaração de Serviço",
      nif_documento: "Comprovativo NIF"
    };
    return labels[field] || field;
  };

  const isDocumentRequired = (field) => {
    const required = ['foto_passe', 'bi_frente_verso', 'declaracao_servico', 'nif_documento'];
    return required.includes(field);
  };

  const isDocumentConditional = (field) => {
    if (field === 'bi_conjuge' && cooperado?.estado_civil !== 'casado') return false;
    if (field === 'agregado_familiar_doc' && !cooperado?.tem_filhos) return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Anexar Documentos</DialogTitle>
          <DialogDescription>
            Faça upload dos seus documentos. Formatos aceitos: JPG, PNG, PDF (máximo 5MB cada).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(documents).map(([field, file]) => {
            if (!isDocumentConditional(field)) return null;

            return (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="flex items-center gap-2">
                  {getDocumentLabel(field)}
                  {isDocumentRequired(field) && <span className="text-red-500">*</span>}
                </Label>
                
                <div className="flex items-center gap-3">
                  <Input
                    id={field}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(field, e.target.files[0])}
                    className="flex-1"
                    disabled={uploading}
                  />
                  
                  {file && (
                    <div className="flex items-center gap-2 text-sm">
                      {file instanceof File ? (
                        <>
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-600 font-medium">
                            {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(field)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">Já anexado</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {uploadProgress[field] && (
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[field]}%` }}
                    ></div>
                    <p className="text-xs text-blue-600 mt-1">
                      {uploadProgress[field] === 100 ? "Concluído" : "Enviando..."}
                    </p>
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  {field === 'foto_passe' && "Foto 3x4 ou similar"}
                  {field === 'bi_frente_verso' && "Frente e verso do Bilhete de Identidade"}
                  {field === 'bi_conjuge' && "Frente e verso do BI do cônjuge"}
                  {field === 'agregado_familiar_doc' && "Documento comprovativo do agregado familiar"}
                  {field === 'declaracao_servico' && "Declaração de serviço ou comprovativo de emprego"}
                  {field === 'nif_documento' && "Comprovativo do Número de Identificação Fiscal"}
                </p>
              </div>
            );
          })}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informações importantes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Todos os documentos devem estar legíveis e completos</li>
                  <li>• Para BI, anexe tanto a frente quanto o verso</li>
                  <li>• A declaração de serviço deve ser recente (últimos 3 meses)</li>
                  <li>• Os documentos serão verificados pela administração</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Enviar Documentos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 