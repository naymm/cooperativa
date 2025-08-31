
import React, { useState, useEffect, useCallback } from "react";
import { Pagamento, Cooperado } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  CreditCard, 
  Plus,
  Check,
  Clock,
  AlertTriangle,
  Download,
  Mail,
  Loader2 // Adicionado Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner"; // Adicionado toast

import PagamentoCard from "../components/pagamentos/PagamentoCard";
import FormPagamento from "../components/pagamentos/FormPagamento";
import FiltrosPagamentos from "../components/pagamentos/FiltrosPagamentos";
import RelatorioFinanceiro from "../components/pagamentos/RelatorioFinanceiro";

const ITENS_POR_PAGINA_PAG = 25; // Definir um limite para carregamento inicial

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [cooperados, setCooperados] = useState([]);
  const [filteredPagamentos, setFilteredPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPagamento, setEditingPagamento] = useState(null);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    metodo: "all",
    periodo: "all"
  });
  const [currentPage, setCurrentPage] = useState(1); // Para futura paginação (não totalmente implementada neste escopo, mas preparada)

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🔄 Carregando dados de pagamentos e cooperados...");
      
      const [pagamentosData, cooperadosData] = await Promise.all([
        Pagamento.list("-created_date", ITENS_POR_PAGINA_PAG * currentPage), // Limitar busca
        Cooperado.list() // TODO: Otimizar se houver muitos cooperados, buscar apenas os necessários
      ]);
      
      console.log("📊 Pagamentos carregados:", pagamentosData?.length || 0);
      console.log("👥 Cooperados carregados:", cooperadosData?.length || 0);
      
      // Debug: mostrar alguns exemplos
      if (pagamentosData?.length > 0) {
        console.log("📋 Exemplo de pagamento:", {
          id: pagamentosData[0].id,
          cooperado_id: pagamentosData[0].cooperado_id,
          valor: pagamentosData[0].valor,
          status: pagamentosData[0].status
        });
      }
      
      if (cooperadosData?.length > 0) {
        console.log("👤 Exemplo de cooperado:", {
          id: cooperadosData[0].id,
          numero_associado: cooperadosData[0].numero_associado,
          nome_completo: cooperadosData[0].nome_completo
        });
      }
      
      setPagamentos(pagamentosData || []);
      setCooperados(cooperadosData || []);
      toast.success("Dados de pagamentos carregados!"); // Feedback
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      toast.error("Falha ao carregar dados de pagamentos.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Adicionar currentPage

  useEffect(() => {
    loadData();
  }, [loadData]); // Usar loadData diretamente

  // Envolver filterPagamentos em useCallback para estabilidade se usada em dependências
  const memoizedFilterPagamentos = useCallback(() => {
    let filtered = [...pagamentos];

    if (searchTerm) {
      filtered = filtered.filter(pagamento => {
        const cooperado = cooperados.find(c => c.id === pagamento.cooperado_id);
        return cooperado?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               cooperado?.numero_associado?.includes(searchTerm) ||
               pagamento.referencia?.toLowerCase().includes(searchTerm.toLowerCase()); // Adicionado toLowerCase
      });
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(pagamento => pagamento.status === filters.status);
    }

    if (filters.metodo !== "all") {
      filtered = filtered.filter(pagamento => pagamento.metodo_pagamento === filters.metodo);
    }

    if (filters.periodo !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.periodo) {
        case "7dias":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30dias":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90dias":
          filterDate.setDate(now.getDate() - 90);
          break;
      }
      
      if (filters.periodo !== "all") {
        filtered = filtered.filter(pagamento => 
          new Date(pagamento.created_date) >= filterDate
        );
      }
    }

    setFilteredPagamentos(filtered);
  }, [pagamentos, searchTerm, filters, cooperados]);


  useEffect(() => {
    memoizedFilterPagamentos();
  }, [memoizedFilterPagamentos]); // Usar a versão memoizada


  const handleSavePagamento = useCallback(async (pagamentoData) => { // Envolver em useCallback
    setLoading(true); // Adicionar loading state
    try {
      if (editingPagamento) {
        await Pagamento.update(editingPagamento.id, pagamentoData);
        toast.success("Pagamento atualizado com sucesso!");
      } else {
        await Pagamento.create({
          ...pagamentoData,
          // status: "pendente" // Status padrão já definido na entidade ou API
        });
        toast.success("Pagamento registrado com sucesso!");
      }
      
      await loadData(); // Recarregar dados
      setShowForm(false);
      setEditingPagamento(null);
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error);
      toast.error("Erro ao salvar pagamento.");
    } finally {
      setLoading(false); // Finalizar loading
    }
  }, [loadData, editingPagamento]); // Adicionar dependências

  const confirmarPagamento = useCallback(async (pagamento) => { // Envolver em useCallback
    setLoading(true);
    try {
      await Pagamento.update(pagamento.id, {
        status: "confirmado",
        confirmado_por: "admin@sistema.com", // Idealmente pegar do user logado
        data_pagamento: pagamento.data_pagamento || new Date().toISOString().split('T')[0] // Garante data_pagamento
      });
      toast.success("Pagamento confirmado!");
      await loadData(); // Recarregar dados
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      toast.error("Erro ao confirmar pagamento.");
    } finally {
      setLoading(false);
    }
  }, [loadData]); // Adicionar loadData

  const stats = {
    total: pagamentos.length,
    confirmados: pagamentos.filter(p => p.status === "confirmado").length,
    pendentes: pagamentos.filter(p => p.status === "pendente").length,
    atrasados: pagamentos.filter(p => p.status === "atrasado").length,
    valorTotal: pagamentos
      .filter(p => p.status === "confirmado")
      .reduce((sum, p) => sum + (p.valor || 0), 0)
  };

  const exportarRelatorio = () => {
    const csvContent = [
      "Cooperado,Data,Valor,Método,Status,Referência",
      ...filteredPagamentos.map(p => {
        const cooperado = cooperados.find(c => c.numero_associado === p.cooperado_id);
        return `${cooperado?.nome_completo || p.cooperado_id},${p.data_pagamento},${p.valor},${p.metodo_pagamento},${p.status},${p.referencia || ""}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio_pagamentos.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Controle de Pagamentos</h1>
          <p className="text-slate-600 mt-1">Gerir pagamentos e assinaturas dos cooperados</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowRelatorio(true)}>
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline" onClick={exportarRelatorio}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pagamento
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-sm text-slate-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmados}</div>
            <div className="text-sm text-slate-600">Confirmados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pendentes}</div>
            <div className="text-sm text-slate-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.atrasados}</div>
            <div className="text-sm text-slate-600">Atrasados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-600">
              {stats.valorTotal.toLocaleString()} Kz
            </div>
            <div className="text-sm text-slate-600">Arrecadado</div>
          </CardContent>
        </Card>
      </div>

      {/* Pesquisa e Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={`Pesquisar em ${pagamentos.length} pagamentos...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <FiltrosPagamentos filters={filters} setFilters={setFilters} />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pagamentos */}
      <div className="grid gap-4">
        {loading && pagamentos.length === 0 ? ( // Mostrar loader apenas se estiver carregando e não houver pagamentos antigos
          <div className="text-center py-8 col-span-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            Carregando pagamentos...
          </div>
        ) : filteredPagamentos.length > 0 ? (
          filteredPagamentos.map((pagamento) => {
            const cooperado = cooperados.find(c => c.id === pagamento.cooperado_id);
            
            // Debug: verificar se o cooperado foi encontrado
            if (!cooperado) {
              console.log("⚠️ Cooperado não encontrado para pagamento:", {
                pagamento_id: pagamento.id,
                cooperado_id: pagamento.cooperado_id,
                cooperados_disponiveis: cooperados.map(c => ({ id: c.id, nome: c.nome_completo }))
              });
            } else {
              console.log("✅ Cooperado encontrado:", {
                pagamento_id: pagamento.id,
                cooperado_id: cooperado.id,
                cooperado_nome: cooperado.nome_completo,
                cooperado_numero: cooperado.numero_associado
              });
            }
            
            return (
              <PagamentoCard
                key={pagamento.id}
                pagamento={pagamento}
                cooperado={cooperado}
                onConfirmar={() => confirmarPagamento(pagamento)}
                onEdit={() => {
                  setEditingPagamento(pagamento);
                  setShowForm(true);
                }}
              />
            );
          })
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum pagamento encontrado</h3>
            <p className="text-slate-500">Não há pagamentos que correspondam aos critérios de busca.</p>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPagamento ? "Editar Pagamento" : "Registrar Pagamento"}
            </DialogTitle>
          </DialogHeader>
          <FormPagamento
            pagamento={editingPagamento}
            cooperados={cooperados}
            onSave={handleSavePagamento}
            onCancel={() => {
              setShowForm(false);
              setEditingPagamento(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Relatório */}
      <Dialog open={showRelatorio} onOpenChange={setShowRelatorio}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Relatório Financeiro</DialogTitle>
          </DialogHeader>
          <RelatorioFinanceiro
            pagamentos={pagamentos}
            cooperados={cooperados}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
