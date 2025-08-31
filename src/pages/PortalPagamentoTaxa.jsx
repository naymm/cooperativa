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
  Shield
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function PortalPagamentoTaxa() {
  const [cooperadoData, setCooperadoData] = useState(null);
  const [pagamentoData, setPagamentoData] = useState(null);
  const [planoData, setPlanoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("💰 PortalPagamentoTaxa: Iniciando carregamento...");
    
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
      setDebugInfo(`Cooperado: ${data.nome_completo} (ID: ${data.id})`);

      // Verificar se precisa pagar taxa
      if (!data.precisaPagarTaxa) {
        console.log("ℹ️ Não precisa pagar taxa, redirecionando para dashboard");
        navigate(createPageUrl("PortalDashboard"));
      } else {
        console.log("✅ Precisa pagar taxa, carregando dados de pagamento");
        carregarDadosPagamento(data.id);
      }
    } catch (err) {
      console.error("❌ Erro ao parsear dados do cooperado:", err);
      setError("Erro ao carregar dados do cooperado");
      navigate(createPageUrl("PortalLogin"));
    }
  }, [navigate]);

  const carregarDadosPagamento = async (cooperadoId) => {
    try {
      console.log("🔍 Carregando dados de pagamento para cooperado:", cooperadoId);
      
      // Buscar cooperado atualizado
      const cooperado = await Cooperado.get(cooperadoId);
      console.log("👤 Dados do cooperado:", cooperado);
      
      // Buscar pagamento pendente
      console.log("🔍 Buscando pagamentos com filtros:");
      console.log("- cooperado_id:", cooperadoId);
      console.log("- tipo: taxa_inscricao");
      console.log("- status: pendente");
      
      const pagamentos = await Pagamento.filter({
        cooperado_id: cooperadoId,
        tipo: "taxa_inscricao",
        status: "pendente"
      });
      
      console.log("💰 Pagamentos pendentes encontrados:", pagamentos);
      console.log("📊 Total de pagamentos encontrados:", pagamentos.length);
      
      // Buscar todos os pagamentos do cooperado para debug
      const todosPagamentos = await Pagamento.filter({
        cooperado_id: cooperadoId
      });
      console.log("🔍 Todos os pagamentos do cooperado:", todosPagamentos);
      
      if (pagamentos && pagamentos.length > 0) {
        setPagamentoData(pagamentos[0]);
        
        // Buscar dados do plano se houver
        if (pagamentos[0].assinatura_plano_id) {
          try {
            const plano = await AssinaturaPlano.get(pagamentos[0].assinatura_plano_id);
            setPlanoData(plano);
            console.log("📋 Dados do plano:", plano);
          } catch (error) {
            console.log("⚠️ Erro ao buscar dados do plano:", error);
          }
        }
      } else {
        console.log("⚠️ Nenhum pagamento pendente encontrado");
        setError("Nenhum pagamento pendente encontrado");
      }
      
    } catch (err) {
      console.error("❌ Erro ao carregar dados de pagamento:", err);
      setError("Erro ao carregar dados de pagamento");
    }
  };

  const handlePagamento = async () => {
    setLoading(true);
    setError("");

    console.log("💳 Iniciando processo de pagamento...");

    try {
      // Simular processo de pagamento (aqui você integraria com gateway de pagamento)
      console.log("🔄 Simulando pagamento...");
      
      // Aguardar 2 segundos para simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status do pagamento
      if (pagamentoData) {
        const pagamentoAtualizado = await Pagamento.update(pagamentoData.id, {
          status: "pago",
          metodo_pagamento: "cartao_credito",
          data_pagamento: new Date().toISOString(),
          observacoes: {
            ...pagamentoData.observacoes,
            pagamento_realizado: true,
            data_processamento: new Date().toISOString(),
            metodo: "cartao_credito"
          }
        });
        
        console.log("✅ Pagamento atualizado:", pagamentoAtualizado);
        
        // Atualizar status do cooperado
        const cooperadoAtualizado = await Cooperado.update(cooperadoData.id, {
          taxa_inscricao_paga: true,
          status_pagamento: "pago"
        });
        
        console.log("✅ Cooperado atualizado:", cooperadoAtualizado);
        
        // Atualizar localStorage
        const updatedCooperadoData = {
          ...cooperadoData,
          precisaPagarTaxa: false
        };
        localStorage.setItem('loggedInCooperadoData', JSON.stringify(updatedCooperadoData));
        
        toast.success("Pagamento realizado com sucesso!");
        
        // Redirecionar para dashboard
        setTimeout(() => {
          console.log("🔄 Redirecionando para dashboard...");
          navigate(createPageUrl("PortalDashboard"));
        }, 1500);
      }
      
    } catch (err) {
      console.error("❌ Erro ao processar pagamento:", err);
      setError(`Erro ao processar pagamento: ${err.message}`);
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
    return new Date(data).toLocaleDateString('pt-AO');
  };

  if (!cooperadoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do cooperado...</p>
          {debugInfo && (
            <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-[#1f3664] text-white p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Pagamento da Taxa de Inscrição</CardTitle>
          <CardDescription className="text-blue-100">
            Olá, {cooperadoData.nome_completo.split(" ")[0]}! 
            Complete o pagamento para acessar o portal.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-start gap-2" role="alert">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          {debugInfo && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-xs">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}

          {/* Informações do Pagamento */}
          {pagamentoData && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Detalhes do Pagamento</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold text-green-600">
                    {formatarValor(pagamentoData.valor)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Vencimento:</span>
                  <span className="font-medium">
                    {formatarData(pagamentoData.data_vencimento)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Referência:</span>
                  <span className="font-mono text-sm">
                    {pagamentoData.referencia}
                  </span>
                </div>
                
                {planoData && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plano:</span>
                    <span className="font-medium">
                      {planoData.nome}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aviso Importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Acesso Restrito</p>
                <p>O pagamento da taxa de inscrição é obrigatório para acessar o portal do cooperado.</p>
              </div>
            </div>
          </div>

          {/* Botão de Pagamento */}
          <Button 
            onClick={handlePagamento}
            disabled={loading || !pagamentoData}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none" 
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-5 w-5" />
            )}
            {loading ? "Processando Pagamento..." : "Pagar Taxa de Inscrição"}
          </Button>

          {/* Informações Adicionais */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>• Pagamento seguro via cartão de crédito</p>
            <p>• Acesso imediato após confirmação</p>
            <p>• Suporte disponível em caso de dúvidas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
