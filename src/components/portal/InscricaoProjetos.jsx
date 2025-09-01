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
  Home, 
  MapPin, 
  DollarSign, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Eye,
  Plus,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import inscricaoProjetoService from "@/services/InscricaoProjetoService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function InscricaoProjetos({ cooperadoId }) {
  const [loading, setLoading] = useState(true);
  const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    valor_interesse: "",
    forma_pagamento: undefined,
    prazo_interesse: "",
    observacoes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cooperadoId) {
      carregarDados();
    }
  }, [cooperadoId]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [projetos, inscricoes] = await Promise.all([
        inscricaoProjetoService.buscarProjetosDisponiveis(),
        inscricaoProjetoService.buscarInscricoesCooperado(cooperadoId)
      ]);

      setProjetosDisponiveis(projetos);
      setMinhasInscricoes(inscricoes);
      
      console.log("✅ Dados carregados:", {
        projetos: projetos.length,
        inscricoes: inscricoes.length
      });
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      toast.error("Erro ao carregar projetos disponíveis");
    } finally {
      setLoading(false);
    }
  };

  const handleInscricao = (projeto) => {
    setProjetoSelecionado(projeto);
    setFormData({
      valor_interesse: projeto.preco_final?.toString() || "",
      forma_pagamento: undefined,
      prazo_interesse: "",
      observacoes: ""
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.valor_interesse || !formData.forma_pagamento) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const dadosInscricao = {
        project_id: projetoSelecionado.id,
        cooperado_id: cooperadoId,
        valor_interesse: parseFloat(formData.valor_interesse),
        forma_pagamento: formData.forma_pagamento,
        prazo_interesse: formData.prazo_interesse,
        observacoes: formData.observacoes
      };

      await inscricaoProjetoService.criarInscricao(dadosInscricao);
      
      toast.success("Inscrição realizada com sucesso!");
      setShowForm(false);
      setProjetoSelecionado(null);
      carregarDados(); // Recarregar dados
    } catch (error) {
      console.error("❌ Erro ao criar inscrição:", error);
      toast.error(error.message || "Erro ao realizar inscrição");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelarInscricao = async (inscricaoId) => {
    if (!confirm("Tem certeza que deseja cancelar esta inscrição?")) {
      return;
    }

    try {
      await inscricaoProjetoService.cancelarInscricao(inscricaoId, cooperadoId);
      toast.success("Inscrição cancelada com sucesso!");
      carregarDados();
    } catch (error) {
      console.error("❌ Erro ao cancelar inscrição:", error);
      toast.error(error.message || "Erro ao cancelar inscrição");
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
        <span className="ml-3 text-gray-600">Carregando projetos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inscrição em Projetos</h2>
          <p className="text-gray-600">Visualize e inscreva-se nos projetos disponíveis da cooperativa</p>
        </div>
        <Button onClick={carregarDados} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Minhas Inscrições */}
      {minhasInscricoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Minhas Inscrições ({minhasInscricoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {minhasInscricoes.map((inscricao) => (
                <div 
                  key={inscricao.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {inscricao.projeto?.nome || "Projeto não encontrado"}
                      </h4>
                      <Badge className={`${getStatusColor(inscricao.status)} border`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(inscricao.status)}
                          {getStatusText(inscricao.status)}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Data de Inscrição:</span>
                        <p>{formatarData(inscricao.data_inscricao)}</p>
                      </div>
                      
                      {inscricao.valor_interesse && (
                        <div>
                          <span className="font-medium">Valor de Interesse:</span>
                          <p>{formatarValor(inscricao.valor_interesse)}</p>
                        </div>
                      )}
                      
                      {inscricao.forma_pagamento && (
                        <div>
                          <span className="font-medium">Forma de Pagamento:</span>
                          <p className="capitalize">{inscricao.forma_pagamento}</p>
                        </div>
                      )}
                    </div>

                    {inscricao.motivo_rejeicao && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">
                          <strong>Motivo da rejeição:</strong> {inscricao.motivo_rejeicao}
                        </p>
                      </div>
                    )}

                    {inscricao.observacoes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {inscricao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>

                  {inscricao.status === "pendente" && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelarInscricao(inscricao.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projetos Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Projetos Disponíveis ({projetosDisponiveis.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projetosDisponiveis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetosDisponiveis.map((projeto) => {
                const jaInscrito = minhasInscricoes.some(
                  inscricao => inscricao.project_id === projeto.id
                );

                return (
                  <Card key={projeto.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {projeto.nome}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {projeto.tipo}
                          </Badge>
                        </div>
                        <Badge className={
                          projeto.status === "construcao" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {projeto.status === "construcao" ? "Em Construção" : "Planejamento"}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{projeto.provincia}, {projeto.municipio}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatarValor(projeto.preco_final)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Entrega: {formatarData(projeto.data_previsao_entrega)}</span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Área:</span> {projeto.area_util}m² | 
                          <span className="font-medium ml-2">Quartos:</span> {projeto.num_quartos} | 
                          <span className="font-medium ml-2">Banheiros:</span> {projeto.num_banheiros}
                        </div>
                      </div>

                      {projeto.descricao && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {projeto.descricao}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setProjetoSelecionado(projeto)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detalhes
                        </Button>
                        
                        {jaInscrito ? (
                          <Button disabled size="sm" className="flex-1">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Já Inscrito
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleInscricao(projeto)}
                            size="sm" 
                            className="flex-1"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Inscrever-se
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum projeto disponível
              </h3>
              <p className="text-gray-500">
                No momento não há projetos disponíveis para inscrição.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Inscrição */}
      {showForm && projetoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Inscrever-se no Projeto: {projetoSelecionado.nome}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valor_interesse">Valor de Interesse (Kz)</Label>
                    <Input
                      id="valor_interesse"
                      type="number"
                      value={formData.valor_interesse}
                      onChange={(e) => setFormData({...formData, valor_interesse: e.target.value})}
                      placeholder="Ex: 5000000"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                    <Select 
                      value={formData.forma_pagamento} 
                      onValueChange={(value) => setFormData({...formData, forma_pagamento: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="financiamento">Financiamento</SelectItem>
                        <SelectItem value="parcial">Parcial</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="prazo_interesse">Prazo de Interesse</Label>
                  <Input
                    id="prazo_interesse"
                    type="date"
                    value={formData.prazo_interesse}
                    onChange={(e) => setFormData({...formData, prazo_interesse: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    placeholder="Informações adicionais sobre seu interesse no projeto..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {submitting ? "Enviando..." : "Confirmar Inscrição"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setProjetoSelecionado(null);
                    }}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
