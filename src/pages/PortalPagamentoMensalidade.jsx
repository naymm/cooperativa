import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cooperado, Pagamento, AssinaturaPlano } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  CreditCard, 
  AlertTriangle, 
  Loader2, 
  CheckCircle, 
  DollarSign,
  Calendar,
  FileText,
  Shield,
  Clock,
  RefreshCw
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import MetodosPagamento from "@/components/pagamentos/MetodosPagamento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PortalPagamentoMensalidade() {
  const [cooperadoData, setCooperadoData] = useState(null);
  const [planoData, setPlanoData] = useState(null);
  const [pagamentoData, setPagamentoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("multicaixa_express");
  const [mesReferencia, setMesReferencia] = useState("");
  const [proximoVencimento, setProximoVencimento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("💰 PortalPagamentoMensalidade: Iniciando carregamento...");
    
    // Verificar se o cooperado está logado
    const cooperadoDataStr = localStorage.getItem('loggedInCooperadoData');
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    
    console.log("📋 Dados encontrados no localStorage:");
    console.log("- cooperadoDataStr:", cooperadoDataStr);
    console.log("- cooperadoId:", cooperadoId);
    
    if (!cooperadoDataStr || !cooperadoId) {
      console.log("❌ Dados não encontrados, redirecionando para login");
      navigate(createPageUrl("PortalLogin"));
      return;
    }

    try {
      const data = JSON.parse(cooperadoDataStr);
      console.log("✅ Dados do cooperado carregados:", data);
      setCooperadoData(data);
      
      // Verificar se tem plano ativo
      if (!data.assinatura_plano_id) {
        console.log("❌ Cooperado sem plano ativo");
        toast.error("Você precisa ter um plano ativo para pagar mensalidades");
        navigate(createPageUrl("PortalDashboard"));
        return;
      }

      carregarDadosMensalidade(data.id, data.assinatura_plano_id);
    } catch (err) {
      console.error("❌ Erro ao parsear dados do cooperado:", err);
      setError("Erro ao carregar dados do cooperado");
      navigate(createPageUrl("PortalLogin"));
    }
  }, [navigate]);

  const carregarDadosMensalidade = async (cooperadoId, planoId) => {
    try {
      console.log("🔍 Carregando dados de mensalidade para cooperado:", cooperadoId);
      
      // Buscar dados do plano
      const plano = await AssinaturaPlano.get(planoId);
      setPlanoData(plano);
      console.log("📋 Dados do plano:", plano);
      
      // Calcular próximo vencimento
      const hoje = new Date();
      const diaVencimento = plano.dia_vencimento_fixo || 15;
      let proximoVenc = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento);
      
      if (proximoVenc <= hoje) {
        proximoVenc = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimento);
      }
      
      setProximoVencimento(proximoVenc);
      
      // Definir mês de referência
      const mesRef = proximoVenc.getFullYear() + "-" + String(proximoVenc.getMonth() + 1).padStart(2, "0");
      setMesReferencia(mesRef);
      
      // Verificar se já existe pagamento para este mês
      const pagamentosExistentes = await Pagamento.filter({
        cooperado_id: cooperadoId,
        tipo: "mensalidade",
        mes_referencia: mesRef
      });
      
      console.log("💰 Pagamentos existentes para o mês:", pagamentosExistentes);
      
      if (pagamentosExistentes && pagamentosExistentes.length > 0) {
        const pagamentoExistente = pagamentosExistentes[0];
        
        if (pagamentoExistente.status === "pago") {
          toast.info("Mensalidade deste mês já foi paga!");
          navigate(createPageUrl("PortalDashboard"));
          return;
        }
        
        setPagamentoData(pagamentoExistente);
      } else {
        // Criar novo pagamento pendente
        const novoPagamento = {
          cooperado_id: cooperadoId,
          assinatura_plano_id: planoId,
          valor: plano.valor_mensal,
          data_vencimento: proximoVenc.toISOString(),
          mes_referencia: mesRef,
          tipo: "mensalidade",
          status: "pendente",
          referencia: `MEN-${cooperadoId}-${mesRef}`,
          observacoes: {
            tipo_pagamento: "mensalidade",
            mes_referencia: mesRef,
            plano: plano.nome_plano
          }
        };
        
        console.log("🆕 Criando novo pagamento:", novoPagamento);
        const pagamentoCriado = await Pagamento.create(novoPagamento);
        setPagamentoData(pagamentoCriado);
        console.log("✅ Pagamento criado:", pagamentoCriado);
      }
      
    } catch (err) {
      console.error("❌ Erro ao carregar dados de mensalidade:", err);
      setError("Erro ao carregar dados de mensalidade");
    }
  };

  const handlePagamento = async () => {
    if (!pagamentoData) {
      setError("Dados de pagamento não encontrados");
      return;
    }

    if (!metodoPagamento) {
      setError("Por favor, selecione um método de pagamento");
      return;
    }

    setLoading(true);
    setError("");

    console.log("💳 Iniciando processo de pagamento de mensalidade via:", metodoPagamento);

    try {
      // Simular processo de pagamento (aqui você integraria com gateway de pagamento)
      console.log("🔄 Simulando pagamento de mensalidade...");
      
      // Aguardar 2 segundos para simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status do pagamento
      if (pagamentoData) {
        const pagamentoAtualizado = await Pagamento.update(pagamentoData.id, {
          status: "pago",
          metodo_pagamento: metodoPagamento,
          data_pagamento: new Date().toISOString(),
          observacoes: {
            ...pagamentoData.observacoes,
            pagamento_realizado: true,
            data_processamento: new Date().toISOString(),
            metodo: metodoPagamento,
            gateway_utilizado: metodoPagamento,
            tipo: "mensalidade"
          }
        });
        
        console.log("✅ Pagamento de mensalidade atualizado:", pagamentoAtualizado);
        
        toast.success(`Mensalidade paga com sucesso via ${getMetodoNome(metodoPagamento)}!`);
        
        // Redirecionar para dashboard
        setTimeout(() => {
          console.log("🔄 Redirecionando para dashboard...");
          navigate(createPageUrl("PortalDashboard"));
        }, 1500);
      }
      
    } catch (err) {
      console.error("❌ Erro ao processar pagamento de mensalidade:", err);
      setError(`Erro ao processar pagamento: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMetodoNome = (metodoId) => {
    const metodos = {
      multicaixa_express: "Multicaixa Express",
      paypay: "PayPay",
      referencia: "Referência",
      visa_mastercard: "VISA/Mastercard",
      unitel_money: "Unitel Money"
    };
    return metodos[metodoId] || metodoId;
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

  const formatarMesReferencia = (mesRef) => {
    if (!mesRef) return "";
    const [ano, mes] = mesRef.split("-");
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    return format(data, 'MMMM yyyy', { locale: ptBR });
  };

  if (!cooperadoData || !planoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados da mensalidade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-[#1f3664] text-white p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Pagamento de Mensalidade</CardTitle>
          <CardDescription className="text-blue-100">
            Olá, {cooperadoData.nome_completo.split(" ")[0]}! 
            Complete o pagamento da sua mensalidade obrigatória.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-start gap-2" role="alert">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          {/* Informações do Plano */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Plano Ativo</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plano:</span>
                <span className="font-semibold text-blue-600">
                  {planoData.nome_plano}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Mensal:</span>
                <span className="font-semibold text-green-600">
                  {formatarValor(planoData.valor_mensal)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Mês de Referência:</span>
                <span className="font-medium">
                  {formatarMesReferencia(mesReferencia)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Vencimento:</span>
                <span className="font-medium">
                  {proximoVencimento ? formatarData(proximoVencimento) : "N/A"}
                </span>
              </div>
              
              {pagamentoData && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Referência:</span>
                  <span className="font-mono text-sm">
                    {pagamentoData.referencia}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Aviso Importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Mensalidade Obrigatória</p>
                <p>O pagamento da mensalidade é obrigatório para manter acesso ao portal do cooperado. 
                O não pagamento pode resultar na suspensão do acesso.</p>
              </div>
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div className="space-y-4">
            <MetodosPagamento
              metodoSelecionado={metodoPagamento}
              onMetodoChange={setMetodoPagamento}
            />
          </div>

          {/* Botão de Pagamento */}
          <Button 
            onClick={handlePagamento}
            disabled={loading || !pagamentoData || !metodoPagamento}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none" 
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-5 w-5" />
            )}
            {loading ? "Processando Pagamento..." : `Pagar Mensalidade via ${getMetodoNome(metodoPagamento)}`}
          </Button>

          {/* Botão Voltar */}
          <Button 
            variant="outline"
            onClick={() => navigate(createPageUrl("PortalDashboard"))}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          {/* Informações Adicionais */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>• Pagamento seguro via múltiplos métodos</p>
            <p>• Acesso mantido após confirmação</p>
            <p>• Mensalidade obrigatória para todos os cooperados</p>
            <p>• Transações protegidas e criptografadas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
