import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  CreditCard,
  Loader2,
  RefreshCw,
  Shield,
  TrendingUp
} from "lucide-react";
import { Cooperado, Pagamento, AssinaturaPlano } from "@/api/entities";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AssinaturaMensal({ cooperadoId }) {
  const [loading, setLoading] = useState(true);
  const [assinaturaData, setAssinaturaData] = useState(null);
  const [planoData, setPlanoData] = useState(null);
  const [pagamentosMensais, setPagamentosMensais] = useState([]);
  const [proximoVencimento, setProximoVencimento] = useState(null);
  const [statusAssinatura, setStatusAssinatura] = useState("ativo");
  const [diasAteVencimento, setDiasAteVencimento] = useState(0);

  useEffect(() => {
    if (cooperadoId) {
      carregarDadosAssinatura();
    }
  }, [cooperadoId]);

  const carregarDadosAssinatura = async () => {
    setLoading(true);
    try {
      console.log("🔍 Carregando dados da assinatura para cooperado:", cooperadoId);
      
      // Buscar dados do cooperado
      const cooperado = await Cooperado.get(cooperadoId);
      console.log("👤 Dados do cooperado:", cooperado);
      
      if (!cooperado.assinatura_plano_id) {
        setStatusAssinatura("sem_plano");
        setLoading(false);
        return;
      }

      // Buscar dados do plano
      const plano = await AssinaturaPlano.get(cooperado.assinatura_plano_id);
      setPlanoData(plano);
      console.log("📋 Dados do plano:", plano);

      // Buscar pagamentos mensais dos últimos 12 meses
      const dataInicio = new Date();
      dataInicio.setMonth(dataInicio.getMonth() - 12);
      
      const pagamentos = await Pagamento.filter({
        cooperado_id: cooperadoId,
        tipo: "mensalidade",
        data_vencimento: { $gte: dataInicio.toISOString() }
      });
      
      setPagamentosMensais(pagamentos);
      console.log("💰 Pagamentos mensais:", pagamentos);

      // Calcular próximo vencimento
      const hoje = new Date();
      const diaVencimento = plano.dia_vencimento_fixo || 15;
      let proximoVenc = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento);
      
      if (proximoVenc <= hoje) {
        proximoVenc = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimento);
      }
      
      setProximoVencimento(proximoVenc);
      
      // Calcular dias até vencimento
      const diffTime = proximoVenc.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDiasAteVencimento(diffDays);

      // Verificar se há pagamento pendente para o mês atual
      const mesAtual = hoje.getFullYear() + "-" + String(hoje.getMonth() + 1).padStart(2, "0");
      const pagamentoMesAtual = pagamentos.find(p => p.mes_referencia === mesAtual);
      
      if (!pagamentoMesAtual || pagamentoMesAtual.status === "pendente") {
        setStatusAssinatura("pendente");
      } else if (pagamentoMesAtual.status === "pago") {
        setStatusAssinatura("pago");
      } else {
        setStatusAssinatura("atrasado");
      }

      setAssinaturaData({
        cooperado,
        plano,
        pagamentos,
        proximoVencimento: proximoVenc,
        status: statusAssinatura
      });

    } catch (error) {
      console.error("❌ Erro ao carregar dados da assinatura:", error);
      toast.error("Erro ao carregar dados da assinatura");
    } finally {
      setLoading(false);
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
      case "pago": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "atrasado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pago": return "Pago";
      case "pendente": return "Pendente";
      case "atrasado": return "Em Atraso";
      default: return "Desconhecido";
    }
  };

  const handlePagarMensalidade = () => {
    // Redirecionar para página de pagamento
    window.location.href = "/portal/pagamento-mensalidade";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Carregando assinatura...</span>
      </div>
    );
  }

  if (statusAssinatura === "sem_plano") {
    return (
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            Nenhum Plano Ativo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Assinatura Obrigatória
            </h3>
            <p className="text-gray-600 mb-4">
              Para acessar o portal, você precisa ter um plano de assinatura ativo.
              Entre em contacto com a administração para ativar seu plano.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Assinatura */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="w-5 h-5" />
            Status da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plano Ativo */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{planoData?.nome_plano}</h4>
              <p className="text-sm text-gray-600">Plano Ativo</p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                {formatarValor(planoData?.valor_mensal)}
              </p>
              <p className="text-xs text-gray-500">por mês</p>
            </div>

            {/* Status Atual */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Status</h4>
              <Badge className={`${getStatusColor(statusAssinatura)} border`}>
                {getStatusText(statusAssinatura)}
              </Badge>
              {statusAssinatura === "pendente" && (
                <p className="text-sm text-yellow-600 mt-2">
                  {diasAteVencimento} dias até vencimento
                </p>
              )}
            </div>

            {/* Próximo Vencimento */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Próximo Vencimento</h4>
              <p className="text-lg font-bold text-purple-600">
                {proximoVencimento ? formatarData(proximoVencimento) : "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                Dia {planoData?.dia_vencimento_fixo || 15} de cada mês
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {statusAssinatura === "pendente" && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atenção:</strong> Sua mensalidade está pendente. 
            Realize o pagamento para manter acesso ao portal.
            {diasAteVencimento > 0 && (
              <span className="block mt-1">
                Vencimento em {diasAteVencimento} dia{diasAteVencimento > 1 ? 's' : ''}.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {statusAssinatura === "atrasado" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Urgente:</strong> Sua mensalidade está em atraso. 
            O acesso ao portal pode ser suspenso. Realize o pagamento imediatamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Ações */}
      {(statusAssinatura === "pendente" || statusAssinatura === "atrasado") && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Pagar Mensalidade
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handlePagarMensalidade}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar Agora
                </Button>
                <Button variant="outline" onClick={carregarDadosAssinatura}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pagamentosMensais.length > 0 ? (
              pagamentosMensais.slice(0, 6).map((pagamento) => (
                <div 
                  key={pagamento.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      pagamento.status === "pago" ? "bg-green-500" :
                      pagamento.status === "pendente" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">
                        {pagamento.mes_referencia}
                      </p>
                      <p className="text-sm text-gray-600">
                        Vencimento: {formatarData(pagamento.data_vencimento)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatarValor(pagamento.valor)}
                    </p>
                    <Badge className={`${getStatusColor(pagamento.status)} border text-xs`}>
                      {getStatusText(pagamento.status)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Nenhum pagamento encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
