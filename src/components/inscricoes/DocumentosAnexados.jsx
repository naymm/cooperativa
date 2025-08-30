import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  FileImage, 
  File, 
  Download, 
  Eye, 
  X,
  CheckCircle,
  AlertCircle,
  Upload
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const getFileIcon = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return <FileImage className="w-5 h-5 text-blue-600" />;
  } else if (extension === 'pdf') {
    return <File className="w-5 h-5 text-red-600" />;
  }
  return <FileText className="w-5 h-5 text-gray-600" />;
};

const getFileType = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return 'Imagem';
  } else if (extension === 'pdf') {
    return 'PDF';
  }
  return 'Documento';
};

// Mapeamento de tipos de documento para nomes em português
const getDocumentName = (key) => {
  const names = {
    'foto_passe': 'Foto Passe',
    'bi_frente_verso': 'BI (Frente e Verso)',
    'declaracao_servico': 'Declaração de Serviço',
    'nif_documento': 'Comprovativo NIF',
    'agregado_familiar_doc': 'Agregado Familiar',
    'bi_conjuge': 'Bilhete do Cônjuge',
  };
  return names[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Lista completa de tipos de documentos esperados
const tiposDocumentosEsperados = [
  'foto_passe',
  'bi_frente_verso',
  'declaracao_servico',
  'nif_documento',
  'agregado_familiar_doc',
  'bi_conjuge'
];

export default function DocumentosAnexados({ documentos, inscricaoNome }) {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  if (!documentos || Object.keys(documentos).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos Anexados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Nenhum documento anexado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewDocument = (documento) => {
    setSelectedDocument(documento);
    setShowViewer(true);
  };

  const handleDownload = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Criar lista completa de documentos (anexados e não anexados)
  const listaCompletaDocumentos = tiposDocumentosEsperados.map(tipo => {
    const url = documentos[tipo];
    const isAnexado = url && url.trim() !== '';
    
    return {
      tipo,
      url,
      nome: getDocumentName(tipo),
      fileName: isAnexado ? url.split('/').pop() || 'documento' : null,
      isAnexado
    };
  });

  const documentosAnexados = listaCompletaDocumentos.filter(doc => doc.isAnexado);
  const documentosNaoAnexados = listaCompletaDocumentos.filter(doc => !doc.isAnexado);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentos Anexados
            </div>
            {/* <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Anexar Documentos
            </Button> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Documentos Anexados */}
            {documentosAnexados.map((documento, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(documento.fileName)}
                  <div>
                    <p className="font-medium text-gray-900">{documento.nome} *</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{getFileType(documento.fileName)}</span>
                      <span>•</span>
                      <span>{documento.fileName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(documento)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(documento.url, documento.fileName)}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}

            {/* Documentos Não Anexados */}
            {documentosNaoAnexados.map((documento, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{documento.nome} *</p>
                    <div className="text-sm text-gray-500">
                      Documento obrigatório
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Não anexado</span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-800">
                <strong>Resumo:</strong> {documentosAnexados.length} de {listaCompletaDocumentos.length} documentos anexados
              </span>
              <Badge variant={documentosAnexados.length === listaCompletaDocumentos.length ? "default" : "secondary"}>
                {documentosAnexados.length === listaCompletaDocumentos.length ? "Completo" : "Incompleto"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para visualizar documento */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDocument && getFileIcon(selectedDocument.fileName)}
              {selectedDocument?.nome}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="mt-4">
              {selectedDocument.fileName.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-[60vh] border border-gray-200 rounded"
                  title={selectedDocument.nome}
                />
              ) : (
                <div className="text-center">
                  <img
                    src={selectedDocument.url}
                    alt={selectedDocument.nome}
                    className="max-w-full max-h-[60vh] mx-auto border border-gray-200 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden text-center py-8"
                    style={{ display: 'none' }}
                  >
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Não foi possível carregar a imagem</p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => window.open(selectedDocument.url, '_blank')}
                    >
                      Abrir em nova aba
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {selectedDocument.fileName}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(selectedDocument.url, selectedDocument.fileName)}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedDocument.url, '_blank')}
                  >
                    Abrir em nova aba
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
