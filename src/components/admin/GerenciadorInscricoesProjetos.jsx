import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Loader2,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Home,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import inscricaoProjetoService from "@/services/InscricaoProjetoService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function GerenciadorInscricoesProjetos() {
  const [loading, setLoading] = useState(true);
  const [inscricoes, setInscricoes] = useState([]);
  const [filtros, setFiltros] = useState({
    status: "todos",
    project_id: ""
  });
  const [relatorio, setRelatorio] = useState(null);
  const [showAprovarModal, setShowAprovarModal] = useState(false);
  const [showRejeitarModal, setShowRejeitarModal] = useState(false);
  const [inscricaoSelecionada, setInscricaoSelecionada] = useState(null);
  const [formData, setFormData] = useState({
    observacoes: "",
    motivo_rejeicao: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [inscricoesData, relatorioData] = await Promise.all([
        inscricaoProjetoService.buscarTodasInscricoes(filtros),
        inscricaoProjetoService.gerarRelatorioInscricoes()
      ]);

      setInscricoes(inscricoesData);
      setRelatorio(relatorioData);
      
      console.log("✅ Dados carregados:", {
        inscricoes: inscricoesData.length,
        relatorio: relatorioData
      });
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      toast.error("Erro ao carregar inscrições");
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    await carregarDados();
  };

  const handleAprovar = (inscricao) => {
    setInscricaoSelecionada(inscricao);
    setFormData({ observacoes: "" });
    setShowAprovarModal(true);
  };

  const handleRejeitar = (inscricao) => {
    setInscricaoSelecionada(inscricao);
    setFormData({ observacoes: "", motivo_rejeicao: "" });
    setShowRejeitarModal(true);
  };

  const confirmarAprovar = async () => {
    if (!inscricaoSelecionada) return;

    setSubmitting(true);
    try {
      // Simular ID do administrador (em produção viria do contexto de autenticação)
      const adminId = "admin-1";
      
      await inscricaoProjetoService.aprovarInscricao(
        inscricaoSelecionada.id,
        adminId,
        formData.observacoes
      );
      
      toast.success("Inscrição aprovada com sucesso!");
      setShowAprovarModal(false);
      setInscricaoSelecionada(null);
      carregarDados();
    } catch (error) {
      console.error("❌ Erro ao aprovar inscrição:", error);
      toast.error(error.message || "Erro ao aprovar inscrição");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmarRejeitar = async () => {
    if (!inscricaoSelecionada || !formData.motivo_rejeicao) {
      toast.error("Por favor, informe o motivo da rejeição");
      return;
    }

    setSubmitting(true);
    try {
      // Simular ID do administrador (em produção viria do contexto de autenticação)
      const adminId = "admin-1";
      
      await inscricaoProjetoService.rejeitarInscricao(
        inscricaoSelecionada.id,
        adminId,
        formData.motivo_rejeicao,
        formData.observacoes
      );
      
      toast.success("Inscrição rejeitada com sucesso!");
      setShowRejeitarModal(false);
      setInscricaoSelecionada(null);
      carregarDados();
    } catch (error) {
      console.error("❌ Erro ao rejeitar inscrição:", error);
      toast.error(error.message || "Erro ao rejeitar inscrição");
    } finally {
      setSubmitting(false);
    }
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor);
  };

  const formatarData = (data) => {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "aprovado": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejeitado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "aprovado": return "Aprovado";
      case "pendente": return "Pendente";
      case "rejeitado": return "Rejeitado";
      default: return "Desconhecido";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "aprovado": return <CheckCircle className="w-4 h-4" />;
      case "pendente": return <Clock className="w-4 h-4" />;
      case "rejeitado": return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Carregando inscrições...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciador de Inscrições em Projetos</h2>
          <p className="text-gray-600">Gerencie as inscrições dos cooperados nos projetos</p>
        </div>
        <Button onClick={carregarDados} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      {relatorio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{relatorio.pendentes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{relatorio.aprovadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{relatorio.rejeitadas}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={filtros.status} 
                onValueChange={(value) => setFiltros({...filtros, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project-filter">Projeto</Label>
              <Input
                id="project-filter"
                placeholder="ID do projeto"
                value={filtros.project_id}
                onChange={(e) => setFiltros({...filtros, project_id: e.target.value})}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={aplicarFiltros} className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inscrições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Inscrições ({inscricoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inscricoes.length > 0 ? (
            <div className="space-y-4">
              {inscricoes.map((inscricao) => (
                <div 
                  key={inscricao.id} 
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {inscricao.cooperado?.nome_completo || "Cooperado não encontrado"}
                      </h4>
                      <Badge className={`${getStatusColor(inscricao.status)} border`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(inscricao.status)}
                          {getStatusText(inscricao.status)}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">
                          {inscricao.projeto?.nome || "Projeto não encontrado"}
                        </h5>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {inscricao.projeto?.provincia}, {inscricao.projeto?.municipio}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatarValor(inscricao.projeto?.preco_final || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div><strong>Data de Inscrição:</strong> {formatarData(inscricao.data_inscricao)}</div>
                        {inscricao.valor_interesse && (
                          <div><strong>Valor de Interesse:</strong> {formatarValor(inscricao.valor_interesse)}</div>
                        )}
                        {inscricao.forma_pagamento && (
                          <div><strong>Forma de Pagamento:</strong> {inscricao.forma_pagamento}</div>
                        )}
                      </div>
                    </div>

                    {inscricao.observacoes && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {inscricao.observacoes}
                        </p>
                      </div>
                    )}

                    {inscricao.motivo_rejeicao && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">
                          <strong>Motivo da rejeição:</strong> {inscricao.motivo_rejeicao}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {inscricao.status === "pendente" && (
                      <>
                        <Button 
                          onClick={() => handleAprovar(inscricao)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button 
                          onClick={() => handleRejeitar(inscricao)}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma inscrição encontrada
              </h3>
              <p className="text-gray-500">
                Não há inscrições que correspondam aos filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Aprovar */}
      {showAprovarModal && inscricaoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Aprovar Inscrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Cooperado:</strong> {inscricaoSelecionada.cooperado?.nome_completo}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Projeto:</strong> {inscricaoSelecionada.projeto?.nome}
                </p>
              </div>

              <div className="mb-4">
                <Label htmlFor="observacoes-aprovar">Observações (opcional)</Label>
                <Textarea
                  id="observacoes-aprovar"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações sobre a aprovação..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={confirmarAprovar}
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {submitting ? "Aprovando..." : "Confirmar Aprovação"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowAprovarModal(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Rejeitar */}
      {showRejeitarModal && inscricaoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Rejeitar Inscrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Cooperado:</strong> {inscricaoSelecionada.cooperado?.nome_completo}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Projeto:</strong> {inscricaoSelecionada.projeto?.nome}
                </p>
              </div>

              <div className="mb-4">
                <Label htmlFor="motivo-rejeicao">Motivo da Rejeição *</Label>
                <Textarea
                  id="motivo-rejeicao"
                  value={formData.motivo_rejeicao}
                  onChange={(e) => setFormData({...formData, motivo_rejeicao: e.target.value})}
                  placeholder="Informe o motivo da rejeição..."
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="observacoes-rejeitar">Observações (opcional)</Label>
                <Textarea
                  id="observacoes-rejeitar"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações adicionais..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={confirmarRejeitar}
                  disabled={submitting}
                  variant="destructive"
                  className="flex-1"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  {submitting ? "Rejeitando..." : "Confirmar Rejeição"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowRejeitarModal(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
