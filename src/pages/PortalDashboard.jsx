import React, { useState, useEffect } from 'react';
import { Cooperado, Pagamento, AssinaturaPlano, Projeto, CooperadoNotificacao } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  CreditCard,
  Home,
  Bell,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  MapPin,
  Eye,
  Loader2,
  Users
} from "lucide-react";
import { format, addMonths, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PortalLayout from "@/components/portal/PortalLayout";
import InscricaoProjetos from "@/components/portal/InscricaoProjetos";

export default function PortalDashboard() {
  const [cooperado, setCooperado] = useState(null);
  const [planoAssinatura, setPlanoAssinatura] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    proximoPagamento: null,
    totalPago: 0,
    pagamentosEmDia: 0,
    statusConta: 'ativo',
    estatisticasPagamentos: {
      mensalidades: 0,
      taxas: 0,
      projetos: 0,
      outros: 0
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    
    if (!cooperadoId) {
      toast.error("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      console.log("[PortalDashboard] Carregando dados para cooperado:", cooperadoId);

      // 1. Buscar dados do cooperado
      const cooperadosData = await Cooperado.filter({ numero_associado: cooperadoId });
      if (cooperadosData && cooperadosData.length > 0) {
        const coop = cooperadosData[0];
        setCooperado(coop);
        console.log("[PortalDashboard] Cooperado carregado:", coop);

        // 2. Buscar plano de assinatura
        if (coop.assinatura_plano_id) {
          try {
            const planosData = await AssinaturaPlano.filter({ id: coop.assinatura_plano_id });
            if (planosData && planosData.length > 0) {
              setPlanoAssinatura(planosData[0]);
              console.log("[PortalDashboard] Plano carregado:", planosData[0]);
            } else {
              console.warn("[PortalDashboard] Plano não encontrado com ID:", coop.assinatura_plano_id);
            }
          } catch (planoError) {
            console.warn("[PortalDashboard] Erro ao buscar plano:", planoError);
          }
        } else {
          console.log("[PortalDashboard] Cooperado não tem plano associado");
        }

        // 3. Buscar pagamentos do cooperado
        console.log("[PortalDashboard] Buscando pagamentos para cooperado:", cooperadoId);
        let pagamentosData = [];
        try {
          // Usar o UUID do cooperado para buscar pagamentos
          pagamentosData = await Pagamento.filter({ cooperado_id: coop.id });
          console.log("[PortalDashboard] Pagamentos carregados:", pagamentosData?.length || 0);
          
          if (pagamentosData && pagamentosData.length > 0) {
            console.log("[PortalDashboard] Primeiro pagamento:", pagamentosData[0]);
            console.log("[PortalDashboard] Status dos pagamentos:", pagamentosData.map(p => ({ id: p.id, status: p.status, valor: p.valor, tipo: p.tipo, cooperado_id: p.cooperado_id })));
          }
          
          console.log("[PortalDashboard] Pagamentos carregados:", pagamentosData?.length || 0);
          
          if (pagamentosData && pagamentosData.length > 0) {
            console.log("[PortalDashboard] Primeiro pagamento:", pagamentosData[0]);
            console.log("[PortalDashboard] Status dos pagamentos:", pagamentosData.map(p => ({ id: p.id, status: p.status, valor: p.valor, tipo: p.tipo, cooperado_id: p.cooperado_id })));
          }
          
          setPagamentos(pagamentosData || []);
        } catch (pagamentoError) {
          console.error("[PortalDashboard] Erro ao buscar pagamentos:", pagamentoError);
          setPagamentos([]);
        }

        // 4. Buscar projetos (todos os projetos ativos da cooperativa)
        const projetosData = await Projeto.list();
        const projetosAtivos = projetosData?.filter(p => p.status !== 'entregue') || [];
        setProjetos(projetosAtivos);
        console.log("[PortalDashboard] Projetos ativos carregados:", projetosAtivos.length);

        // 5. Buscar notificações do cooperado
        try {
          const notificacoesData = await CooperadoNotificacao.filter({ 
            cooperado_id: coop.id 
          });
          const notificacoesOrdenadas = notificacoesData
            ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            ?.slice(0, 5) || [];
          setNotificacoes(notificacoesOrdenadas);
          console.log("[PortalDashboard] Notificações carregadas:", notificacoesOrdenadas.length);
        } catch (notifError) {
          console.warn("[PortalDashboard] Erro ao buscar notificações:", notifError);
          setNotificacoes([]);
        }

        // 6. Calcular estatísticas
        await calcularEstatisticas(coop, pagamentosData || [], planosData?.[0] || null);

      } else {
        console.error("[PortalDashboard] Cooperado não encontrado com ID:", cooperadoId);
        toast.error("Dados do cooperado não encontrados.");
      }

    } catch (error) {
      console.error("[PortalDashboard] Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = async (coop, pagamentosData, planoData) => {
    console.log("[PortalDashboard] Calculando estatísticas...");
    console.log("[PortalDashboard] Total de pagamentos recebidos:", pagamentosData?.length || 0);
    
    // Log de todos os pagamentos carregados
    if (pagamentosData && pagamentosData.length > 0) {
      console.log("[PortalDashboard] Todos os pagamentos carregados:", pagamentosData.map(p => ({
        id: p.id,
        tipo: p.tipo,
        status: p.status,
        valor: p.valor,
        cooperado_id: p.cooperado_id
      })));
    }
    
    const pagamentosConfirmados = pagamentosData.filter(p => p.status === 'confirmado');
    console.log("[PortalDashboard] Pagamentos confirmados:", pagamentosConfirmados.length);
    
    // Calcular total pago somando todos os valores dos pagamentos carregados (não apenas confirmados)
    const totalPagoTodos = pagamentosData.reduce((sum, p) => {
      const valor = p.valor || 0;
      console.log(`[PortalDashboard] Pagamento carregado: ${p.tipo} - ${valor} Kz (status: ${p.status})`);
      return sum + valor;
    }, 0);
    
    // Calcular total pago apenas dos confirmados
    const totalPagoConfirmados = pagamentosConfirmados.reduce((sum, p) => {
      const valor = p.valor || 0;
      console.log(`[PortalDashboard] Pagamento confirmado: ${p.tipo} - ${valor} Kz`);
      return sum + valor;
    }, 0);
    
    console.log("[PortalDashboard] Total pago (todos os pagamentos):", totalPagoTodos, "Kz");
    console.log("[PortalDashboard] Total pago (apenas confirmados):", totalPagoConfirmados, "Kz");
    
    // Usar totalPagoConfirmados para manter a lógica original
    const totalPago = totalPagoConfirmados;
    
    console.log("[PortalDashboard] Total pago calculado:", totalPago, "Kz");
    
    // Calcular estatísticas detalhadas dos pagamentos
    const estatisticasPagamentos = {
      mensalidades: pagamentosConfirmados.filter(p => p.tipo === 'mensalidade').reduce((sum, p) => sum + (p.valor || 0), 0),
      taxas: pagamentosConfirmados.filter(p => p.tipo === 'taxa_inscricao').reduce((sum, p) => sum + (p.valor || 0), 0),
      projetos: pagamentosConfirmados.filter(p => p.tipo === 'pagamento_projeto').reduce((sum, p) => sum + (p.valor || 0), 0),
      outros: pagamentosConfirmados.filter(p => !['mensalidade', 'taxa_inscricao', 'pagamento_projeto'].includes(p.tipo)).reduce((sum, p) => sum + (p.valor || 0), 0)
    };
    
    console.log("[PortalDashboard] Estatísticas detalhadas:", estatisticasPagamentos);
    
    let proximoPagamento = null;
    
    if (planoData && coop.status === 'ativo') {
      const hoje = new Date();
      const diaVencimento = planoData.dia_vencimento_fixo || 15;
      
      // 1. Primeiro, verificar se há pagamentos pendentes ou atrasados (prioridade máxima)
      const pagamentosPendentes = pagamentosData.filter(p => 
        p.tipo === 'mensalidade' && 
        (p.status === 'pendente' || p.status === 'atrasado')
      );
      
      console.log("[PortalDashboard] Pagamentos pendentes/atrasados encontrados:", pagamentosPendentes.length);
      
      if (pagamentosPendentes.length > 0) {
        // Pegar o pagamento pendente mais antigo
        const pagamentoPendente = pagamentosPendentes.sort((a, b) => 
          new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
        )[0];
        
        console.log("[PortalDashboard] Pagamento pendente selecionado:", pagamentoPendente);
        
        proximoPagamento = {
          valor: pagamentoPendente.valor || planoData.valor_mensal,
          vencimento: new Date(pagamentoPendente.data_vencimento || pagamentoPendente.created_date),
          tipo: 'mensalidade',
          atrasado: pagamentoPendente.status === 'atrasado' || 
                   new Date(pagamentoPendente.data_vencimento || pagamentoPendente.created_date) < hoje,
          urgente: pagamentoPendente.status === 'atrasado',
          status: pagamentoPendente.status
        };
      } else {
        // 2. Se não há pendências, calcular próximo pagamento baseado no último pagamento confirmado
        const pagamentosMensalidadeConfirmados = pagamentosData
          .filter(p => p.tipo === 'mensalidade' && p.status === 'confirmado')
          .sort((a, b) => new Date(b.data_pagamento || b.created_date).getTime() - new Date(a.data_pagamento || a.created_date).getTime());

        let proximoVencimento;

        if (pagamentosMensalidadeConfirmados.length > 0) {
          // Tem pagamentos confirmados - próximo mês após o último pagamento
          const ultimoPagamento = new Date(pagamentosMensalidadeConfirmados[0].data_pagamento || pagamentosMensalidadeConfirmados[0].created_date);
          proximoVencimento = new Date(ultimoPagamento.getFullYear(), ultimoPagamento.getMonth() + 1, diaVencimento);
        } else {
          // Primeiro pagamento - baseado na data de inscrição
          const dataInscricao = new Date(coop.data_inscricao || hoje);
          if (dataInscricao.getDate() > diaVencimento) {
            proximoVencimento = new Date(dataInscricao.getFullYear(), dataInscricao.getMonth() + 1, diaVencimento);
          } else {
            proximoVencimento = new Date(dataInscricao.getFullYear(), dataInscricao.getMonth(), diaVencimento);
          }
        }

        // 3. Verificar se já existe um pagamento para este mês (confirmado, pendente ou atrasado)
        const mesReferencia = `${proximoVencimento.getFullYear()}-${String(proximoVencimento.getMonth() + 1).padStart(2, '0')}`;
        const pagamentoExistente = pagamentosData.find(p => 
          p.mes_referencia === mesReferencia && p.tipo === 'mensalidade'
        );

        // 4. Verificar se o vencimento já passou (atraso)
        const vencimentoPassou = proximoVencimento < hoje;

        if (!pagamentoExistente || vencimentoPassou) {
          proximoPagamento = {
            valor: planoData.valor_mensal,
            vencimento: proximoVencimento,
            tipo: 'mensalidade',
            atrasado: vencimentoPassou,
            urgente: vencimentoPassou
          };
        }
      }
    }

    // 5. Verificar taxa de inscrição pendente (prioridade sobre mensalidades)
    if (!coop.taxa_inscricao_paga && planoData?.taxa_inscricao > 0) {
      console.log("[PortalDashboard] Verificando taxa de inscrição...");
      const taxaJaRegistrada = pagamentosData.some(p => p.tipo === 'taxa_inscricao' && p.status === 'confirmado');
      console.log("[PortalDashboard] Taxa já registrada (confirmada):", taxaJaRegistrada);
      
      if (!taxaJaRegistrada) {
        // Verificar se há taxa pendente
        const taxaPendente = pagamentosData.find(p => p.tipo === 'taxa_inscricao' && p.status === 'pendente');
        console.log("[PortalDashboard] Taxa pendente encontrada:", taxaPendente);
        
        if (taxaPendente) {
          proximoPagamento = {
            valor: taxaPendente.valor || planoData.taxa_inscricao,
            vencimento: new Date(taxaPendente.data_vencimento || taxaPendente.created_date),
            tipo: 'taxa_inscricao',
            atrasado: new Date(taxaPendente.data_vencimento || taxaPendente.created_date) < new Date(),
            urgente: true,
            status: 'pendente'
          };
        } else {
          proximoPagamento = {
            valor: planoData.taxa_inscricao,
            vencimento: new Date(coop.data_inscricao || new Date()),
            tipo: 'taxa_inscricao',
            atrasado: true,
            urgente: true
          };
        }
      }
    }

    setStats({
      proximoPagamento,
      totalPago,
      pagamentosEmDia: pagamentosConfirmados.length,
      statusConta: coop.status || 'ativo',
      estatisticasPagamentos
    });

    console.log("[PortalDashboard] Estatísticas calculadas:", {
      proximoPagamento,
      totalPago,
      pagamentosEmDia: pagamentosConfirmados.length,
      statusConta: coop.status
    });
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Carregando o seu dashboard...</p>
        </div>
      </PortalLayout>
    );
  }

  if (!cooperado) {
    return (
      <PortalLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="text-slate-800 font-medium">Erro ao carregar dados do cooperado</p>
          <Button onClick={fetchDashboardData}>Tentar Novamente</Button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Bem-vindo, {cooperado.nome_completo?.split(' ')[0]}!
              </h1>
              <p className="opacity-90 mt-1">
                ID: {cooperado.numero_associado} | Membro desde {' '}
                {cooperado.data_inscricao ? 
                  format(new Date(cooperado.data_inscricao), "MMMM yyyy", { locale: ptBR }) : 
                  'Data não disponível'
                }
              </p>
            </div>
            <div className="text-right">
              <Badge className={`px-3 py-1 text-sm font-medium ${
                stats.statusConta === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : stats.statusConta === 'inativo'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Conta {stats.statusConta.charAt(0).toUpperCase() + stats.statusConta.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status da Conta */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado da Conta</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.statusConta}</div>
              <p className="text-xs text-muted-foreground">
                {stats.statusConta === 'ativo' ? 'Tudo em ordem' : 'Verificar pendências'}
              </p>
            </CardContent>
          </Card>

          {/* Plano Atual */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Actual</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {planoAssinatura?.nome_plano || 'Sem plano'}
              </div>
              <p className="text-xs text-muted-foreground">
                {planoAssinatura?.valor_mensal ? 
                  `${planoAssinatura.valor_mensal.toLocaleString()} Kz/mês` : 
                  'Valor não definido'
                }
              </p>
            </CardContent>
          </Card>

          {/* Próximo Pagamento */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stats.proximoPagamento ? (
                <>
                  <div className={`text-xl font-bold ${
                    stats.proximoPagamento.atrasado ? 'text-red-600' : 
                    stats.proximoPagamento.status === 'pendente' ? 'text-orange-600' : 
                    'text-green-600'
                  }`}>
                    {stats.proximoPagamento.valor.toLocaleString()} Kz
                  </div>
                  <p className={`text-xs ${
                    stats.proximoPagamento.atrasado ? 'text-red-600' : 
                    stats.proximoPagamento.status === 'pendente' ? 'text-orange-600' : 
                    'text-muted-foreground'
                  }`}>
                    {stats.proximoPagamento.atrasado ? 'Em atraso' : 
                     stats.proximoPagamento.status === 'pendente' ? 'Aguardando aprovação' :
                     'Vence'} em {' '}
                    {format(stats.proximoPagamento.vencimento, "dd/MM/yyyy")}
                  </p>
                  {stats.proximoPagamento.tipo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.proximoPagamento.tipo === 'taxa_inscricao' ? 'Taxa de Inscrição' : 'Mensalidade'}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="text-xl font-bold text-green-600">Em dia</div>
                  <p className="text-xs text-muted-foreground">Sem pagamentos pendentes</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Atividade Financeira */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stats.totalPago.toLocaleString()} Kz</div>
              <p className="text-xs text-muted-foreground">
                {stats.pagamentosEmDia} pagamento{stats.pagamentosEmDia !== 1 ? 's' : ''} confirmado{stats.pagamentosEmDia !== 1 ? 's' : ''}
              </p>
              {stats.totalPago > 0 && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Inclui mensalidades, taxas e outros pagamentos</p>
                  {stats.estatisticasPagamentos.mensalidades > 0 && (
                    <p>• Mensalidades: {stats.estatisticasPagamentos.mensalidades.toLocaleString()} Kz</p>
                  )}
                  {stats.estatisticasPagamentos.taxas > 0 && (
                    <p>• Taxas: {stats.estatisticasPagamentos.taxas.toLocaleString()} Kz</p>
                  )}
                  {stats.estatisticasPagamentos.projetos > 0 && (
                    <p>• Projetos: {stats.estatisticasPagamentos.projetos.toLocaleString()} Kz</p>
                  )}
                  {stats.estatisticasPagamentos.outros > 0 && (
                    <p>• Outros: {stats.estatisticasPagamentos.outros.toLocaleString()} Kz</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Próximo Pagamento em Destaque (se em atraso ou pendente) */}
        {stats.proximoPagamento && (stats.proximoPagamento.atrasado || stats.proximoPagamento.status === 'pendente') && (
          <Card className={`${
            stats.proximoPagamento.atrasado ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${
                stats.proximoPagamento.atrasado ? 'text-red-800' : 'text-orange-800'
              }`}>
                <AlertTriangle className="h-5 w-5" />
                {stats.proximoPagamento.atrasado ? 'Pagamento em Atraso' : 'Pagamento Pendente'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${
                    stats.proximoPagamento.atrasado ? 'text-red-800' : 'text-orange-800'
                  }`}>
                    {stats.proximoPagamento.tipo === 'taxa_inscricao' ? 'Taxa de Inscrição' : 'Mensalidade'}
                  </p>
                  <p className={`${
                    stats.proximoPagamento.atrasado ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    Valor: {stats.proximoPagamento.valor.toLocaleString()} Kz | 
                    {stats.proximoPagamento.atrasado ? 'Venceu' : 'Vence'} em: {format(stats.proximoPagamento.vencimento, "dd/MM/yyyy")}
                    {stats.proximoPagamento.status === 'pendente' && ' (Aguardando aprovação)'}
                  </p>
                </div>
                <Link to={createPageUrl("PortalFinanceiro")}>
                  <Button className={`${
                    stats.proximoPagamento.atrasado ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                  }`}>
                    {stats.proximoPagamento.status === 'pendente' ? 'Ver Detalhes' : 'Pagar Agora'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notificações */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notificacoes.length > 0 ? (
                <div className="space-y-3">
                  {notificacoes.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${
                      notif.tipo === 'warning' ? 'border-orange-500 bg-orange-50' :
                      notif.tipo === 'error' ? 'border-red-500 bg-red-50' :
                      notif.tipo === 'success' ? 'border-green-500 bg-green-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notif.titulo}</p>
                          <p className="text-xs text-slate-600 mt-1">{notif.mensagem}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {format(new Date(notif.created_date), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                        {!notif.lida && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Link to={createPageUrl("PortalNotificacoes")}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Todas as Notificações
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Sem notificações</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projetos da Cooperativa */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Projectos da Cooperativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projetos.length > 0 ? (
                <div className="space-y-4">
                  {projetos.slice(0, 3).map((projeto) => (
                    <div key={projeto.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{projeto.nome}</h4>
                          <Badge variant="outline">{projeto.tipo}</Badge>
                          <Badge className={
                            projeto.status === 'construcao' ? 'bg-blue-100 text-blue-800' :
                            projeto.status === 'pronto' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }>
                            {projeto.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {projeto.provincia}, {projeto.municipio}
                          </span>
                          <span className="font-medium">
                            {projeto.preco_final?.toLocaleString()} Kz
                          </span>
                        </div>
                      </div>
                      <Link to={createPageUrl("PortalProjetosCooperativa")}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Link to={createPageUrl("PortalProjetosCooperativa")} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Todos os Projetos ({projetos.length})
                      </Button>
                    </Link>
                    <Link to={createPageUrl("PortalInscricaoProjetos")} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Minhas Inscrições
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Nenhum projecto activo no momento</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acções Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl("PortalFinanceiro")}>
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Pagamentos</span>
                </Button>
              </Link>
              <Link to={createPageUrl("PortalPerfilCooperado")}>
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <User className="h-6 w-6" />
                  <span className="text-sm">Meu Perfil</span>
                </Button>
              </Link>
              <Link to={createPageUrl("PortalProjetosCooperativa")}>
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Home className="h-6 w-6" />
                  <span className="text-sm">Projectos</span>
                </Button>
              </Link>
              <Link to={createPageUrl("PortalCartaoCooperado")}>
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-sm">Meu Cartão</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Inscrições em Projetos */}
        {cooperado && (
          <div id="inscricoes-projetos">
            <InscricaoProjetos cooperadoId={cooperado.id} />
          </div>
        )}
      </div>
    </PortalLayout>
  );
}