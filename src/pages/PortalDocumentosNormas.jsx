import React, { useState, useEffect } from "react";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Loader2, FolderOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
// Supondo uma entidade DocumentoCooperativa (ou similar)
// import { DocumentoCooperativa } from "@/api/entities";

// Dados mocados de documentos até termos a entidade
const mockDocuments = [
  { id: 'doc1', nome: "Estatuto Social da CoopHabitat (Revisão 2023)", categoria: "Estatutos e Regulamentos", url: "#", data_upload: "2023-10-15T10:00:00Z", tamanho_kb: 1200 },
  { id: 'doc2', nome: "Regimento Interno", categoria: "Estatutos e Regulamentos", url: "#", data_upload: "2023-11-01T14:30:00Z", tamanho_kb: 850 },
  { id: 'doc3', nome: "Ata da Assembleia Geral - JAN/2024", categoria: "Atas de Assembleia", url: "#", data_upload: "2024-02-01T09:00:00Z", tamanho_kb: 500 },
  { id: 'doc4', nome: "Relatório de Contas 2023", categoria: "Relatórios Financeiros", url: "#", data_upload: "2024-03-20T11:00:00Z", tamanho_kb: 2500 },
  { id: 'doc5', nome: "Manual do Cooperado", categoria: "Manuais e Guias", url: "#", data_upload: "2023-09-01T08:00:00Z", tamanho_kb: 1800 },
  { id: 'doc6', nome: "Política de Privacidade", categoria: "Políticas", url: "#", data_upload: "2023-05-10T16:00:00Z", tamanho_kb: 300 },
];

const categoriasDocumentos = [
  "Todas",
  "Estatutos e Regulamentos",
  "Atas de Assembleia",
  "Relatórios Financeiros",
  "Manuais e Guias",
  "Políticas",
  "Outros Documentos"
];

export default function PortalDocumentosNormas() {
  const [documentos, setDocumentos] = useState([]);
  const [filteredDocumentos, setFilteredDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  useEffect(() => {
    const fetchDocumentos = async () => {
      setLoading(true);
      try {
        // Substituir por chamada à API da entidade DocumentoCooperativa
        // const data = await DocumentoCooperativa.list("-data_upload");
        // setDocumentos(data.map(d => ({...d, data_upload: d.data_upload ? parseISO(d.data_upload) : new Date() })));
        setDocumentos(mockDocuments.map(d => ({...d, data_upload: new Date(d.data_upload) })));
      } catch (error) {
        console.error("Erro ao carregar documentos:", error);
        toast.error("Falha ao carregar documentos da cooperativa.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentos();
  }, []);

  useEffect(() => {
    let tempDocs = [...documentos];
    if (activeCategory !== "Todas") {
      tempDocs = tempDocs.filter(doc => doc.categoria === activeCategory);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      tempDocs = tempDocs.filter(doc => doc.nome.toLowerCase().includes(lowerSearch));
    }
    setFilteredDocumentos(tempDocs);
  }, [documentos, searchTerm, activeCategory]);

  const handleDownload = (docUrl, docName) => {
    if (docUrl === "#") {
        toast.info(`Download do documento "${docName}" está em desenvolvimento.`);
        return;
    }
    // Lógica de download
    const link = document.createElement('a');
    link.href = docUrl;
    link.setAttribute('download', docName); // Ou extrair nome do arquivo da URL
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success(`Baixando "${docName}"...`);
  };

  return (
    <PortalLayout currentPageName="PortalDocumentosNormas">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Documentos e Normas</h1>
          <p className="text-slate-600">Acesse os documentos importantes, regulamentos e atas da CoopHabitat.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de Categorias */}
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <Card className="shadow-lg sticky top-20">
              <CardHeader><CardTitle className="text-lg font-semibold text-slate-700">Categorias</CardTitle></CardHeader>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {categoriasDocumentos.map(cat => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "secondary" : "ghost"}
                      className={`w-full justify-start px-3 py-2 text-left ${activeCategory === cat ? 'font-semibold' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Lista de Documentos */}
          <main className="flex-1">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-xl font-semibold text-slate-700">
                    {activeCategory === "Todas" ? "Todos os Documentos" : activeCategory}
                  </CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Buscar documentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-200 w-8 h-8 rounded"></div>
                          <div>
                            <div className="bg-slate-200 h-5 w-48 mb-1 rounded"></div>
                            <div className="bg-slate-200 h-4 w-32 rounded"></div>
                          </div>
                        </div>
                        <div className="bg-slate-200 w-20 h-8 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredDocumentos.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDocumentos.map(doc => (
                      <div key={doc.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-7 h-7 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate" title={doc.nome}>{doc.nome}</h4>
                            <p className="text-xs text-slate-500">
                              Upload: {doc.data_upload ? new Date(doc.data_upload).toLocaleDateString('pt-BR') : '-'} • Tamanho: {doc.tamanho_kb ? (doc.tamanho_kb / 1024).toFixed(1) : '-'} MB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownload(doc.url, doc.nome)}
                          className="mt-2 sm:mt-0 flex-shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 mr-2" /> Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-slate-700">Nenhum documento encontrado.</h3>
                    <p className="mt-1">Não há documentos disponíveis para esta categoria ou busca.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </PortalLayout>
  );
}