
import React, { useState, useEffect, useCallback } from "react";
import { Cooperado, Pagamento, AssinaturaPlano, CooperadoAuth } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Plus,
  Filter,
  Eye,
  Edit,
  QrCode,
  Download,
  Loader2, // Adicionado Loader2
  AlertTriangle // Adicionado AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import CooperadoCard from "../components/cooperados/CooperadoCard";
import DetalhesCooperado from "../components/cooperados/DetalhesCooperado";
import FormCooperado from "../components/cooperados/FormCooperado";
import FiltrosCooperados from "../components/cooperados/FiltrosCooperados";
import { debounce } from "lodash";

const ITENS_POR_PAGINA = 25; // Definir um limite para carregamento inicial

export default function Cooperados() {
  const [cooperados, setCooperados] = useState([]);
  const [filteredCooperados, setFilteredCooperados] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Novo estado para erros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCooperado, setSelectedCooperado] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCooperado, setEditingCooperado] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    provincia: "all",
    orderBy: "nome"
  });
  const [assinaturaPlanos, setAssinaturaPlanos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Para futura paginação
  const [totalCooperados, setTotalCooperados] = useState(0); // Para futura paginação


  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null); // Resetar erro antes de carregar
    try {
      console.log("Cooperados.js: Iniciando carregamento de dados...");
      // Apenas buscar o número necessário de cooperados inicialmente
      const cooperadosData = await Cooperado.list("-created_date", ITENS_POR_PAGINA * currentPage); 
      
      // Considerar se todos os pagamentos e planos são realmente necessários aqui
      // Se forem muitos, pode ser melhor carregar sob demanda ou de forma mais granular
      const [pagamentosData, planosData] = await Promise.all([
        Pagamento.list(), // TODO: Otimizar se houver muitos pagamentos
        AssinaturaPlano.list()
      ]);
      
      console.log("Cooperados.js: Dados carregados com sucesso.", { cooperadosData, pagamentosData, planosData });
      
      setCooperados(cooperadosData || []); // Garantir que seja um array
      setPagamentos(pagamentosData || []);
      setAssinaturaPlanos(planosData || []);
      
      // Para futura paginação - idealmente, a API deveria fornecer o total
      // const total = await Cooperado.count(); // Supondo que uma função count() exista
      // setTotalCooperados(total);

    } catch (err) {
      console.error("Erro ao carregar dados dos cooperados:", err);
      toast.error("Falha ao carregar dados. Verifique sua conexão ou tente novamente mais tarde.");
      setError(err.message || "Ocorreu um erro desconhecido.");
      // Definir arrays vazios em caso de erro para evitar quebras na renderização
      setCooperados([]);
      setPagamentos([]);
      setAssinaturaPlanos([]);
    } finally {
      setLoading(false);
      console.log("Cooperados.js: Carregamento de dados finalizado.");
    }
  }, [currentPage]); // Adicionado currentPage como dependência

  useEffect(() => {
    loadData();
  }, [loadData]);

  const debouncedFilterCooperados = useCallback(
    debounce((currentCooperados, currentSearchTerm, currentFilters) => {
      console.log("Cooperados.js: Filtrando cooperados...", { currentCooperados, currentSearchTerm, currentFilters });
      let filtered = [...currentCooperados];

      if (currentSearchTerm) {
        filtered = filtered.filter(cooperado =>
          cooperado.nome_completo?.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
          cooperado.email?.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
          cooperado.numero_associado?.includes(currentSearchTerm) ||
          cooperado.bi?.includes(currentSearchTerm)
        );
      }

      if (currentFilters.status !== "all") {
        filtered = filtered.filter(cooperado => cooperado.status === currentFilters.status);
      }

      if (currentFilters.provincia !== "all") {
        filtered = filtered.filter(cooperado => cooperado.provincia === currentFilters.provincia);
      }

      filtered.sort((a, b) => {
        switch (currentFilters.orderBy) {
          case "nome":
            return a.nome_completo?.localeCompare(b.nome_completo || "") || 0;
          case "data_inscricao":
            return new Date(b.data_inscricao || 0).getTime() - new Date(a.data_inscricao || 0).getTime();
          case "numero_associado":
            return a.numero_associado?.localeCompare(b.numero_associado || "") || 0;
          default:
            return 0;
        }
      });
      console.log("Cooperados.js: Cooperados filtrados.", { filtered });
      setFilteredCooperados(filtered);
    }, 300),
    []
  );

  useEffect(() => {
    if (!loading && !error && cooperados.length > 0) { // Apenas filtrar se não estiver carregando, não houver erro e houver cooperados
        debouncedFilterCooperados(cooperados, searchTerm, filters);
    } else if (error || cooperados.length === 0 && !loading) { // Limpar se houver erro ou não houver cooperados e não estiver carregando
        setFilteredCooperados([]);
    }
  }, [cooperados, searchTerm, filters, debouncedFilterCooperados, loading, error]);


  const handleSaveCooperado = useCallback(async (cooperadoData, senhaTemporaria = null) => { // Envolver em useCallback
    setLoading(true);
    try {
      let savedCooperado;
      let numeroAssociado = cooperadoData.numero_associado; 

      if (editingCooperado) {
        savedCooperado = await Cooperado.update(editingCooperado.id, cooperadoData);
        numeroAssociado = editingCooperado.numero_associado; 
      } else {
        const today = new Date().toISOString().split('T')[0];
        const dadosCompletos = {
          ...cooperadoData,
          data_inscricao: cooperadoData.data_inscricao || today,
          status: cooperadoData.status || "ativo"
        };
        savedCooperado = await Cooperado.create(dadosCompletos);
        numeroAssociado = dadosCompletos.numero_associado; // Usar o número gerado

        if (senhaTemporaria && numeroAssociado) {
          try {
            await CooperadoAuth.create({
              cooperado_id: numeroAssociado,
              password_hash: senhaTemporaria, 
              two_factor_enabled: false,
              account_locked: false,
              login_attempts: 0
            });
            toast.success(`Credenciais criadas para ${numeroAssociado}`);
          } catch (authError) {
            console.error("Erro ao criar credenciais:", authError);
            toast.error("Cooperado criado, mas erro ao criar credenciais.");
          }
        }

        if (cooperadoData.assinatura_plano_id) {
          const planoSelecionado = assinaturaPlanos.find(p => p.id === cooperadoData.assinatura_plano_id);
          if (planoSelecionado && planoSelecionado.taxa_inscricao > 0) {
            await Pagamento.create({
              cooperado_id: numeroAssociado,
              assinatura_plano_id: planoSelecionado.id,
              valor: planoSelecionado.taxa_inscricao,
              data_vencimento: today,
              metodo_pagamento: "sistema",
              status: "pendente",
              tipo: "taxa_inscricao",
              observacoes: `Taxa de inscrição - Plano ${planoSelecionado.nome_plano}`
            });
            await Cooperado.update(savedCooperado.id, { taxa_inscricao_paga: false });
            toast.info("Taxa de inscrição gerada.");
          } else if (planoSelecionado && planoSelecionado.taxa_inscricao === 0) {
            await Cooperado.update(savedCooperado.id, { taxa_inscricao_paga: true });
          }
        }
      }

      await loadData(); 
      setShowForm(false);
      setEditingCooperado(null);
      toast.success(`Cooperado ${editingCooperado ? 'atualizado' : 'criado'} com sucesso!`);

    } catch (err) {
      console.error("Erro ao salvar cooperado:", err);
      toast.error(`Erro ao salvar cooperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [loadData, editingCooperado, assinaturaPlanos]); // Adicionar dependências corretas

  const handleStatusChange = useCallback(async (cooperado, newStatus) => { // Envolver em useCallback
    try {
      await Cooperado.update(cooperado.id, { status: newStatus });
      toast.success(`Status do cooperado ${cooperado.nome_completo} alterado para ${newStatus}.`);
      await loadData(); 
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast.error(`Erro ao atualizar status: ${err.message}`);
    }
  }, [loadData]); // Adicionar loadData como dependência

  const exportToExcel = () => {
    if (filteredCooperados.length === 0) {
        toast.info("Nenhum cooperado para exportar com os filtros atuais.");
        return;
    }
    const csvContent = [
      "Número,Nome,Email,Telefone,Província,Status,Data Inscrição",
      ...filteredCooperados.map(c =>
        [
            c.numero_associado || "",
            c.nome_completo || "",
            c.email || "",
            c.telefone || "",
            c.provincia || "",
            c.status || "",
            c.data_inscricao || ""
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Adicionado BOM para Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cooperados.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Dados dos cooperados exportados para CSV.");
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Loader e Mensagem de Erro Principal
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] p-10 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600 font-medium text-lg">Carregando cooperados...</p>
        <p className="text-slate-500">Por favor, aguarde um momento.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] p-10 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Erro ao Carregar Dados</h2>
        <p className="text-slate-600 mb-4">Não foi possível carregar a lista de cooperados.</p>
        <p className="text-sm text-slate-500 mb-6">Detalhe: {error}</p>
        <Button onClick={loadData}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Tentar Novamente
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestão de Cooperados</h1>
          <p className="text-slate-600 mt-1">Gerir e acompanhar todos os cooperados</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={exportToExcel} disabled={filteredCooperados.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => { setEditingCooperado(null); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cooperado
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-800">{cooperados.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {cooperados.filter(c => c.status === "ativo").length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 border border-green-200">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Inativos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {cooperados.filter(c => c.status === "inativo").length}
                </p>
              </div>
              <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Inativo</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Suspensos</p>
                <p className="text-2xl font-bold text-red-600">
                  {cooperados.filter(c => c.status === "suspenso").length}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800 border border-red-200">Suspenso</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pesquisa e Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={`Pesquisar em ${cooperados.length} cooperados...`}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <FiltrosCooperados filters={filters} setFilters={setFilters} />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cooperados */}
      <div className="grid gap-4">
        {filteredCooperados.length > 0 ? (
          filteredCooperados.map((cooperado) => (
            <CooperadoCard
              key={cooperado.id}
              cooperado={cooperado}
              pagamentos={pagamentos.filter(p => p.cooperado_id === cooperado.numero_associado)}
              onViewDetails={() => {
                setSelectedCooperado(cooperado);
                setShowDetails(true);
              }}
              onEdit={() => {
                setEditingCooperado(cooperado);
                setShowForm(true);
              }}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="text-center py-12 col-span-full bg-white rounded-lg shadow p-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-800 mb-2">Nenhum cooperado encontrado</h3>
            <p className="text-slate-500">
              {searchTerm || filters.status !== 'all' || filters.provincia !== 'all'
                ? "Não há cooperados que correspondam aos filtros aplicados."
                : "Ainda não há cooperados cadastrados."}
            </p>
            {!searchTerm && filters.status === 'all' && filters.provincia === 'all' && (
                <Button onClick={() => { setEditingCooperado(null); setShowForm(true); }} className="mt-6 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Cooperado
                </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Placeholder para botão de carregar mais - futura implementação de paginação */}
      {
      /*
      {cooperados.length < totalCooperados && !loading && (
        <div className="text-center mt-6">
          <Button onClick={() => setCurrentPage(prev => prev + 1)} variant="outline">
            Carregar Mais Cooperados
          </Button>
        </div>
      )}
      */
      }

      {/* Modal de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-0">
           <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-2xl">Detalhes do Cooperado</DialogTitle>
          </DialogHeader>
          {selectedCooperado && (
            <div className="p-6">
              <DetalhesCooperado
                cooperado={selectedCooperado}
                pagamentos={pagamentos.filter(p => p.cooperado_id === selectedCooperado.numero_associado)}
                onStatusChange={handleStatusChange}
                assinaturaPlanos={assinaturaPlanos}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Formulário */}
      <Dialog open={showForm} onOpenChange={(isOpen) => {
          setShowForm(isOpen);
          if (!isOpen) setEditingCooperado(null);
      }}>
        <DialogContent className="max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[95vh] overflow-y-auto p-0">
          {/* O <DialogHeader> já está dentro do FormCooperado */}
          <FormCooperado
              cooperado={editingCooperado}
              onSave={handleSaveCooperado}
              onCancel={() => {
                setShowForm(false);
                setEditingCooperado(null);
              }}
              assinaturaPlanos={assinaturaPlanos}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
