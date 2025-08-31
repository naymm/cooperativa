
import React, { useState, useEffect } from 'react';
import { Cooperado, Pagamento, AssinaturaPlano } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  AlertTriangle,
  FileText,
  Loader2,
  RefreshCw,
  Download
} from "lucide-react";
import { format, isValid } from "date-fns";
import { toast } from "sonner";

import PortalLayout from "@/components/portal/PortalLayout";
import PagamentoPendenteCard from "../components/portal/PagamentoPendenteCard";
import FormPagamentoRapido from "../components/portal/FormPagamentoRapido";
import FormPagamentoAntecipado from "../components/portal/FormPagamentoAntecipado";
import PagamentosDataTable from "../components/portal/PagamentosDataTable";
import PagamentosStats from "../components/portal/PagamentosStats";

// Função para validar se uma data é válida
const isValidDate = (date) => {
  return date && !isNaN(new Date(date).getTime()) && isValid(new Date(date));
};

export default function PortalFinanceiro() {
  const [cooperado, setCooperado] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingPagamento, setSubmittingPagamento] = useState(false);
  const [pagamentosPendentes, setPagamentosPendentes] = useState([]);
  const [showFormPagamento, setShowFormPagamento] = useState(false);
  const [showFormAntecipado, setShowFormAntecipado] = useState(false); // New state
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);

  const fetchDados = async () => {
    setLoading(true);
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    if (!cooperadoId) {
      toast.error("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      // Buscar dados do cooperado
      const cooperadosData = await Cooperado.filter({ numero_associado: cooperadoId });
      if (cooperadosData && cooperadosData.length > 0) {
        const coop = cooperadosData[0];
        setCooperado(coop);

        let planoData = null;
        // Buscar plano de assinatura se existir
        if (coop.assinatura_plano_id) {
          try {
            const planosData = await AssinaturaPlano.filter({ id: coop.assinatura_plano_id });
            if (planosData && planosData.length > 0) {
              planoData = planosData[0];
              setPlano(planoData);
            }
          } catch (error) {
            console.warn("Erro ao buscar plano:", error);
          }
        }

        // Buscar pagamentos do cooperado
        console.log("🔍 Buscando pagamentos para cooperado:", cooperadoId);
        const pagamentosData = await Pagamento.filter({ cooperado_id: coop.id });
        console.log("💰 Pagamentos encontrados:", pagamentosData);
        setPagamentos(pagamentosData || []);

        // Calcular pagamentos pendentes
        if (coop.status === 'ativo' && planoData) {
          const pagamentosPendentesCalculados = calcularPagamentosPendentes(coop, pagamentosData || [], planoData);
          setPagamentosPendentes(pagamentosPendentesCalculados || []);
        } else {
          setPagamentosPendentes([]);
        }
      } else {
        toast.error("Cooperado não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
      toast.error("Erro ao carregar dados financeiros.");
    } finally {
      setLoading(false);
    }
  };

  const calcularPagamentosPendentes = (cooperado, pagamentosExistentes, plano) => {
    if (!plano || !cooperado) return [];

    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const pagamentosPendentes = [];
      const diaVencimento = plano.dia_vencimento_fixo || 15;

      // Verificar se taxa de inscrição está pendente
      if (!cooperado.taxa_inscricao_paga && plano.taxa_inscricao > 0) {
        const taxaJaRegistrada = pagamentosExistentes.some(p => p.tipo === 'taxa_inscricao');
        if (!taxaJaRegistrada) {
          pagamentosPendentes.push({
            id: 'taxa_inscricao',
            tipo: 'taxa_inscricao',
            descricao: 'Taxa de Inscrição',
            descricaoDetalhada: `Taxa de inscrição para o plano ${plano.nome_plano}`,
            valor: plano.taxa_inscricao,
            vencimento: cooperado.data_inscricao || hoje.toISOString().split('T')[0],
            urgente: true
          });
        }
      }

      // Calcular mensalidades em atraso
      const pagamentosMensalidade = pagamentosExistentes
        .filter(p => p.tipo === 'mensalidade' && p.status === 'confirmado')
        .sort((a, b) => {
          const dateA = new Date(a.data_pagamento || a.created_date);
          const dateB = new Date(b.data_pagamento || b.created_date);
          return dateB.getTime() - dateA.getTime();
        });

      let proximoVencimento;
      if (pagamentosMensalidade.length > 0) {
        const ultimoPagamento = new Date(pagamentosMensalidade[0].data_pagamento || pagamentosMensalidade[0].created_date);
        proximoVencimento = new Date(ultimoPagamento.getFullYear(), ultimoPagamento.getMonth() + 1, diaVencimento);
      } else {
        const dataInscricao = new Date(cooperado.data_inscricao || hoje);
        proximoVencimento = new Date(dataInscricao.getFullYear(), dataInscricao.getMonth(), diaVencimento);
        if (dataInscricao.getDate() > diaVencimento) {
          proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
        }
      }

      // Verificar mensalidades em atraso
      let currentVencimento = new Date(proximoVencimento);
      let mesAtual = 0;
      const maxMesesVerificar = 12; // Limitar para evitar loop infinito

      while (currentVencimento <= hoje && mesAtual < maxMesesVerificar) {
        // Verificar se já existe pagamento para este mês
        const mesReferencia = `${currentVencimento.getFullYear()}-${String(currentVencimento.getMonth() + 1).padStart(2, '0')}`;
        const pagamentoExiste = pagamentosExistentes.some(p => 
          p.tipo === 'mensalidade' && 
          p.mes_referencia === mesReferencia &&
          (p.status === 'confirmado' || p.status === 'pendente')
        );

        if (!pagamentoExiste) {
          const diasAtraso = Math.floor((hoje - currentVencimento) / (1000 * 60 * 60 * 24));
          pagamentosPendentes.push({
            id: `mensalidade_${mesReferencia}`,
            tipo: 'mensalidade',
            descricao: `Mensalidade ${currentVencimento.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`,
            descricaoDetalhada: `Mensalidade do plano ${plano.nome_plano} - ${mesReferencia}`,
            valor: plano.valor_mensal,
            vencimento: currentVencimento.toISOString().split('T')[0],
            mes_referencia: mesReferencia,
            urgente: diasAtraso > 0,
            diasAtraso: diasAtraso > 0 ? diasAtraso : 0
          });
        }

        currentVencimento.setMonth(currentVencimento.getMonth() + 1);
        mesAtual++;
      }

      return pagamentosPendentes.sort((a, b) => {
        if (a.urgente && !b.urgente) return -1;
        if (!a.urgente && b.urgente) return 1;
        return new Date(a.vencimento) - new Date(b.vencimento);
      });

    } catch (error) {
      console.error("Erro ao calcular pagamentos pendentes:", error);
      return [];
    }
  };

  const handlePagarPendente = (pagamentoPendente) => {
    setPagamentoSelecionado(pagamentoPendente);
    setShowFormPagamento(true);
  };

  const handleSubmitPagamento = async (pagamentoData) => {
    setSubmittingPagamento(true);
    try {
      await Pagamento.create(pagamentoData);
      toast.success("Pagamento submetido com sucesso! Aguarde a aprovação.");
      setShowFormPagamento(false);
      setPagamentoSelecionado(null);
      // Recarregar dados para atualizar a lista
      await fetchDados();
    } catch (error) {
      console.error("Erro ao submeter pagamento:", error);
      toast.error("Erro ao submeter pagamento. Tente novamente.");
    } finally {
      setSubmittingPagamento(false);
    }
  };

  // New function for anticipated payments
  const handleSubmitPagamentoAntecipado = async (pagamentosData, tipo) => {
    setSubmittingPagamento(true);
    try {
      // Ensure pagamentosData is an array for iteration
      const paymentsToSubmit = Array.isArray(pagamentosData) ? pagamentosData : [pagamentosData];
      
      for (const pagamentoData of paymentsToSubmit) {
        await Pagamento.create(pagamentoData);
      }
      
      const mensagem = tipo === "mensalidades" 
        ? `${paymentsToSubmit.length} mensalidade${paymentsToSubmit.length > 1 ? 's' : ''} submetida${paymentsToSubmit.length > 1 ? 's' : ''} com sucesso!`
        : "Pagamento de projeto submetido com sucesso!";
      
      toast.success(mensagem + " Aguarde a aprovação.");
      setShowFormAntecipado(false);
      await fetchDados();
    } catch (error) {
      console.error("Erro ao submeter pagamento antecipado:", error);
      toast.error("Erro ao submeter pagamento. Tente novamente.");
    } finally {
      setSubmittingPagamento(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);



  if (loading) {
    return (
      <PortalLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-600">Carregando dados financeiros...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Área Financeira</h1>
            <p className="text-slate-600 mt-1">Gerir os seus pagamentos e mensalidades</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchDados} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => setShowFormAntecipado(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Pagamento Antecipado
            </Button>
          </div>
        </div>

        {/* Resumo Financeiro */}
        {plano && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Seu Plano de Assinatura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-700">Plano Atual</p>
                  <p className="text-lg font-semibold text-blue-800">{plano.nome_plano}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Mensalidade</p>
                  <p className="text-lg font-semibold text-blue-800">
                    {plano.valor_mensal?.toLocaleString()} Kz
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Vencimento</p>
                  <p className="text-lg font-semibold text-blue-800">
                    Dia {plano.dia_vencimento_fixo || 15} de cada mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas dos Pagamentos */}
        <PagamentosStats pagamentos={pagamentos} />

        {/* Pagamentos Pendentes */}
        {pagamentosPendentes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Pagamentos Pendentes ({pagamentosPendentes.length})
              </h2>
            </div>
            
            <div className="grid gap-4">
              {pagamentosPendentes.map((pagamentoPendente) => (
                <PagamentoPendenteCard
                  key={pagamentoPendente.id}
                  pagamentoPendente={pagamentoPendente}
                  onPagar={handlePagarPendente}
                  loading={submittingPagamento}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lista Completa de Pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Histórico Completo de Pagamentos ({pagamentos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pagamentos.length > 0 ? (
              <div className="space-y-4">
                {pagamentos.map((pagamento) => (
                  <div key={pagamento.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-800">
                            {pagamento.tipo === 'taxa_inscricao' ? 'Taxa de Inscrição' : 
                             pagamento.tipo === 'mensalidade' ? 'Mensalidade' : 
                             pagamento.tipo || 'Pagamento'}
                          </h3>
                          <Badge 
                            className={`${
                              pagamento.status === 'pago' ? 'bg-green-100 text-green-800 border-green-200' :
                              pagamento.status === 'pendente' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              pagamento.status === 'atrasado' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            } border flex items-center gap-1 text-xs`}
                          >
                            {pagamento.status === 'pago' ? '✓ Pago' :
                             pagamento.status === 'pendente' ? '⏳ Pendente' :
                             pagamento.status === 'atrasado' ? '⚠ Atrasado' :
                             pagamento.status || 'Desconhecido'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Valor:</span>
                            <span className="font-semibold text-slate-800 ml-2">
                              {pagamento.valor?.toLocaleString()} Kz
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Vencimento:</span>
                            <span className="font-medium text-slate-800 ml-2">
                              {pagamento.data_vencimento ? 
                                new Date(pagamento.data_vencimento).toLocaleDateString('pt-AO') : 
                                'Não definido'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Referência:</span>
                            <span className="font-mono text-slate-800 ml-2 text-xs">
                              {pagamento.referencia || 'N/A'}
                            </span>
                          </div>
                        </div>
                        {pagamento.data_pagamento && (
                          <div className="mt-2 text-sm">
                            <span className="text-slate-600">Pago em:</span>
                            <span className="font-medium text-slate-800 ml-2">
                              {new Date(pagamento.data_pagamento).toLocaleDateString('pt-AO')}
                            </span>
                          </div>
                        )}
                        {pagamento.observacoes && (
                          <div className="mt-2 text-sm">
                            <span className="text-slate-600">Observações:</span>
                            {/* <span className="text-slate-800 ml-2">
                              {typeof pagamento.observacoes === 'object' ? 
                                pagamento.observacoes.descricao || JSON.stringify(pagamento.observacoes) :
                                pagamento.observacoes
                              }
                            </span> */}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {pagamento.status === 'pendente' && (
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setPagamentoSelecionado(pagamento);
                              setShowFormPagamento(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Pagar
                          </Button>
                        )}
                        {pagamento.comprovante_url && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(pagamento.comprovante_url, '_blank')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={FileText}
                title="Nenhum pagamento encontrado"
                description="Ainda não há pagamentos registrados para este cooperado."
              />
            )}
          </CardContent>
        </Card>

        {/* Data Table para Histórico de Pagamentos (versão alternativa) */}
        <PagamentosDataTable
          pagamentos={pagamentos}
          loading={loading}
          onViewComprovante={(pagamento) => {
            if (pagamento.comprovante_url) {
              window.open(pagamento.comprovante_url, '_blank');
            }
          }}
          itemsPerPage={15}
        />

        {/* Modal de Pagamento Rápido */}
        <FormPagamentoRapido
          pagamentoPendente={pagamentoSelecionado}
          cooperado={cooperado}
          open={showFormPagamento}
          onOpenChange={setShowFormPagamento}
          onSubmit={handleSubmitPagamento}
        />

        {/* Modal de Pagamento Antecipado */}
        <FormPagamentoAntecipado
          cooperado={cooperado}
          plano={plano}
          open={showFormAntecipado}
          onOpenChange={setShowFormAntecipado}
          onSubmit={handleSubmitPagamentoAntecipado}
        />
      </div>
    </PortalLayout>
  );
}

// Componente para exibir estados vazios
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  );
}


