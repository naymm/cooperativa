import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Play,
  Pause,
  RefreshCw,
  Download,
  Settings,
  Shield,
  TrendingUp,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import assinaturaService from "@/services/AssinaturaService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function GerenciadorAssinaturas() {
  const [loading, setLoading] = useState(false);
  const [verificacaoAtiva, setVerificacaoAtiva] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [cooperadosEmAtraso, setCooperadosEmAtraso] = useState([]);
  const [cooperadosPendentes, setCooperadosPendentes] = useState([]);
  const [acoesEmAndamento, setAcoesEmAndamento] = useState(false);

  useEffect(() => {
    carregarDados();
    verificarStatusVerificacao();
  }, []);

  const verificarStatusVerificacao = () => {
    setVerificacaoAtiva(assinaturaService.verificacaoAtiva);
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      console.log("📊 Carregando dados de assinaturas...");
      
      const [relatorioData, emAtraso, pendentes] = await Promise.all([
        assinaturaService.gerarRelatorioAssinaturas(),
        assinaturaService.buscarCooperadosEmAtraso(),
        assinaturaService.buscarCooperadosPendentes()
      ]);

      setRelatorio(relatorioData);
      setCooperadosEmAtraso(emAtraso);
      setCooperadosPendentes(pendentes);
      
      console.log("✅ Dados carregados:", {
        relatorio: relatorioData,
        emAtraso: emAtraso.length,
        pendentes: pendentes.length
      });
      
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados de assinaturas");
    } finally {
      setLoading(false);
    }
  };

  const iniciarVerificacaoAutomatica = () => {
    try {
      assinaturaService.iniciarVerificacaoAutomatica();
      setVerificacaoAtiva(true);
      toast.success("Verificação automática iniciada");
    } catch (error) {
      console.error("❌ Erro ao iniciar verificação:", error);
      toast.error("Erro ao iniciar verificação automática");
    }
  };

  const pararVerificacaoAutomatica = () => {
    try {
      assinaturaService.pararVerificacaoAutomatica();
      setVerificacaoAtiva(false);
      toast.success("Verificação automática parada");
    } catch (error) {
      console.error("❌ Erro ao parar verificação:", error);
      toast.error("Erro ao parar verificação automática");
    }
  };

  const executarVerificacaoManual = async () => {
    setAcoesEmAndamento(true);
    try {
      console.log("🔍 Executando verificação manual...");
      await assinaturaService.verificarAssinaturas();
      await carregarDados();
      toast.success("Verificação manual executada com sucesso");
    } catch (error) {
      console.error("❌ Erro na verificação manual:", error);
      toast.error("Erro ao executar verificação manual");
    } finally {
      setAcoesEmAndamento(false);
    }
  };

  const suspenderCooperadosCriticos = async () => {
    if (!confirm("Tem certeza que deseja suspender cooperados em atraso crítico (30+ dias)?")) {
      return;
    }

    setAcoesEmAndamento(true);
    try {
      const suspensos = await assinaturaService.suspenderCooperadosEmAtrasoCritico();
      await carregarDados();
      toast.success(`${suspensos} cooperados suspensos por atraso crítico`);
    } catch (error) {
      console.error("❌ Erro ao suspender cooperados:", error);
      toast.error("Erro ao suspender cooperados");
    } finally {
      setAcoesEmAndamento(false);
    }
  };

  const reativarCooperados = async () => {
    setAcoesEmAndamento(true);
    try {
      const reativados = await assinaturaService.reativarCooperadosPagaram();
      await carregarDados();
      if (reativados > 0) {
        toast.success(`${reativados} cooperados reativados`);
      } else {
        toast.info("Nenhum cooperado foi reativado");
      }
    } catch (error) {
      console.error("❌ Erro ao reativar cooperados:", error);
      toast.error("Erro ao reativar cooperados");
    } finally {
      setAcoesEmAndamento(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Carregando dados de assinaturas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciador de Assinaturas</h2>
          <p className="text-gray-600">Controle de mensalidades obrigatórias dos cooperados</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={carregarDados} 
            variant="outline"
            disabled={acoesEmAndamento}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            onClick={verificacaoAtiva ? pararVerificacaoAutomatica : iniciarVerificacaoAutomatica}
            variant={verificacaoAtiva ? "destructive" : "default"}
            disabled={acoesEmAndamento}
          >
            {verificacaoAtiva ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Parar Verificação
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Iniciar Verificação
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status da Verificação Automática */}
      <Alert className={verificacaoAtiva ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
        <CheckCircle className={`h-4 w-4 ${verificacaoAtiva ? "text-green-600" : "text-orange-600"}`} />
        <AlertDescription className={verificacaoAtiva ? "text-green-800" : "text-orange-800"}>
          <strong>Verificação Automática:</strong> {verificacaoAtiva ? "Ativa" : "Inativa"}
          {verificacaoAtiva && " - Executa diariamente às 9h"}
        </AlertDescription>
      </Alert>

      {/* Estatísticas Gerais */}
      {relatorio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cooperados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relatorio.totalCooperados}</div>
              <p className="text-xs text-muted-foreground">
                Com planos ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{relatorio.cooperadosEmAtraso}</div>
              <p className="text-xs text-muted-foreground">
                Mensalidades vencidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{relatorio.cooperadosPendentes}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando pagamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{relatorio.taxaPagamento}%</div>
              <p className="text-xs text-muted-foreground">
                Mês atual
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estatísticas do Mês Atual */}
      {relatorio?.mesAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Estatísticas do Mês Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{relatorio.mesAtual.total}</div>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{relatorio.mesAtual.pagos}</div>
                <p className="text-sm text-gray-600">Pagos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{relatorio.mesAtual.pendentes}</div>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{relatorio.mesAtual.atrasados}</div>
                <p className="text-sm text-gray-600">Em Atraso</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={(relatorio.mesAtual.pagos / relatorio.mesAtual.total) * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {relatorio.mesAtual.pagos} de {relatorio.mesAtual.total} mensalidades pagas
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Administrativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Ações Administrativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={executarVerificacaoManual}
              disabled={acoesEmAndamento}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificação Manual
            </Button>
            
            <Button 
              onClick={suspenderCooperadosCriticos}
              disabled={acoesEmAndamento}
              variant="destructive"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Suspender Críticos
            </Button>
            
            <Button 
              onClick={reativarCooperados}
              disabled={acoesEmAndamento}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Reativar Cooperados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cooperados em Atraso */}
      {cooperadosEmAtraso.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Cooperados em Atraso ({cooperadosEmAtraso.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cooperadosEmAtraso.slice(0, 10).map((item) => (
                <div 
                  key={item.pagamento.id} 
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-800">{item.cooperado.nome_completo}</h4>
                      <Badge variant="destructive">{item.diasAtraso} dias</Badge>
                      <Badge variant="outline">{item.plano.nome_plano}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Vencimento: {formatarData(item.pagamento.data_vencimento)}</span>
                      <span className="font-medium">{formatarValor(item.pagamento.valor)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {formatarValor(item.pagamento.valor)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.diasAtraso} dias em atraso
                    </p>
                  </div>
                </div>
              ))}
              {cooperadosEmAtraso.length > 10 && (
                <p className="text-sm text-gray-500 text-center">
                  ... e mais {cooperadosEmAtraso.length - 10} cooperados em atraso
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cooperados Pendentes */}
      {cooperadosPendentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="w-5 h-5" />
              Cooperados Pendentes ({cooperadosPendentes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cooperadosPendentes.slice(0, 10).map((item) => (
                <div 
                  key={item.pagamento.id} 
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-800">{item.cooperado.nome_completo}</h4>
                      <Badge variant="outline">{item.plano.nome_plano}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Vencimento: {formatarData(item.pagamento.data_vencimento)}</span>
                      <span className="font-medium">{formatarValor(item.pagamento.valor)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">
                      {formatarValor(item.pagamento.valor)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Aguardando pagamento
                    </p>
                  </div>
                </div>
              ))}
              {cooperadosPendentes.length > 10 && (
                <p className="text-sm text-gray-500 text-center">
                  ... e mais {cooperadosPendentes.length - 10} cooperados pendentes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
