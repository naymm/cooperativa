import React, { useState, useEffect } from "react";
import { Inscricao, Cooperado, Projeto, Pagamento, AssinaturaPlano } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Home,
  CreditCard,
  TrendingUp,
  MapPin,
  AlertCircle,
  ListChecks
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import StatsCard from "../components/dashboard/StatsCard";
import RecentActivities from "../components/dashboard/RecentActivities";
import ProvinceChart from "../components/dashboard/ProvinceChart";
import AlertasCobranca from "../components/dashboard/AlertasCobranca";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInscricoes: 0,
    inscricoesPendentes: 0,
    totalCooperados: 0,
    cooperadosAtivos: 0,
    totalProjetos: 0,
    projetosAtivos: 0,
    pagamentosRecebidos: 0,
    inadimplentes: 0,
    totalAssinaturasAtivas: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [alertasCobranca, setAlertasCobranca] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [inscricoes, cooperados, projetos, pagamentos, planos] = await Promise.all([
        Inscricao.list(),
        Cooperado.list(),
        Projeto.list(),
        Pagamento.list(),
        AssinaturaPlano.list()
      ]);

      // Contar cooperados com assinaturas ativas
      const assinaturasAtivasCount = cooperados.filter(
        c => c.status === 'ativo' && c.assinatura_plano_id && planos.some(p => p.id === c.assinatura_plano_id && p.ativo)
      ).length;

      setStats({
        totalInscricoes: inscricoes.length,
        inscricoesPendentes: inscricoes.filter(i => i.status === 'pendente').length,
        totalCooperados: cooperados.length,
        cooperadosAtivos: cooperados.filter(c => c.status === 'ativo').length,
        totalProjetos: projetos.length,
        projetosAtivos: projetos.filter(p => p.status !== 'entregue').length,
        pagamentosRecebidos: pagamentos.filter(p => p.status === 'confirmado').length,
        inadimplentes: calcularInadimplentes(cooperados, pagamentos, planos),
        totalAssinaturasAtivas: assinaturasAtivasCount
      });

      // Gerar alertas de cobrança
      const alertas = gerarAlertasCobranca(cooperados, pagamentos, planos);
      setAlertasCobranca(alertas);

      // Simular atividades recentes
      setRecentActivities([
        { type: 'inscricao', message: 'Nova inscrição recebida', time: '2 min' },
        { type: 'pagamento', message: 'Pagamento confirmado', time: '15 min' },
        { type: 'projeto', message: 'Projeto T3 Luanda atualizado', time: '1 hora' }
      ]);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularInadimplentes = (cooperados, todosPagamentos, planos) => {
    let inadimplentesCount = 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    cooperados.forEach(cooperado => {
      if (cooperado.status === 'ativo' && cooperado.assinatura_plano_id) {
        const plano = planos.find(p => p.id === cooperado.assinatura_plano_id && p.ativo);
        if (!plano) return;

        const pagamentosDoCooperado = todosPagamentos.filter(
          p => p.cooperado_id === cooperado.numero_associado &&
               p.tipo === 'mensalidade' &&
               p.status === 'confirmado'
        ).sort((a, b) => new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime());

        let proximoVencimento;
        const diaVencimentoFixo = plano.dia_vencimento_fixo || 15;

        if (pagamentosDoCooperado.length > 0) {
          const ultimoPagamento = new Date(pagamentosDoCooperado[0].data_pagamento);
          proximoVencimento = new Date(ultimoPagamento.getFullYear(), ultimoPagamento.getMonth() + 1, diaVencimentoFixo);
          proximoVencimento.setHours(0, 0, 0, 0);

          if (proximoVencimento < hoje && new Date(ultimoPagamento.getFullYear(), ultimoPagamento.getMonth(), diaVencimentoFixo).setHours(0,0,0,0) <= ultimoPagamento.setHours(0,0,0,0)) {
             proximoVencimento = new Date(ultimoPagamento.getFullYear(), ultimoPagamento.getMonth() + 2, diaVencimentoFixo);
             proximoVencimento.setHours(0, 0, 0, 0);
          }
        } else {
          const dataInscricao = new Date(cooperado.data_inscricao);
          dataInscricao.setHours(0, 0, 0, 0);

          let mesVencimento = dataInscricao.getMonth();
          let anoVencimento = dataInscricao.getFullYear();

          if (dataInscricao.getDate() > diaVencimentoFixo) {
              mesVencimento += 1;
              if (mesVencimento > 11) {
                  mesVencimento = 0;
                  anoVencimento += 1;
              }
          }
          proximoVencimento = new Date(anoVencimento, mesVencimento, diaVencimentoFixo);
          proximoVencimento.setHours(0, 0, 0, 0);

          if (proximoVencimento < hoje) {
            proximoVencimento = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimentoFixo);
            proximoVencimento.setHours(0, 0, 0, 0);
            if (proximoVencimento < hoje) {
                proximoVencimento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimentoFixo);
                proximoVencimento.setHours(0, 0, 0, 0);
            }
          }
        }

        if (hoje > proximoVencimento) {
          inadimplentesCount++;
        }
      }
    });
    return inadimplentesCount;
  };

  const gerarAlertasCobranca = (cooperados, todosPagamentos, planos) => {
    const alertas = [];
    const hoje = new Date();
    const proximosSete = new Date();
    proximosSete.setDate(hoje.getDate() + 7);

    cooperados.forEach(cooperado => {
      if (cooperado.status === 'ativo' && cooperado.assinatura_plano_id) {
        const plano = planos.find(p => p.id === cooperado.assinatura_plano_id && p.ativo);
        if (!plano) return;

        const pagamentosDoCooperado = todosPagamentos.filter(
          p => p.cooperado_id === cooperado.numero_associado &&
               p.tipo === 'mensalidade' &&
               p.status === 'confirmado'
        ).sort((a, b) => new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime());

        let proximoVencimento;
        const diaVencimentoFixo = plano.dia_vencimento_fixo || 15;

        if (pagamentosDoCooperado.length > 0) {
          const ultimoPagamento = new Date(pagamentosDoCooperado[0].data_pagamento);
          proximoVencimento = new Date(ultimoPagamento.getFullYear(), ultimoPagamento.getMonth() + 1, diaVencimentoFixo);
        } else {
          const dataInscricao = new Date(cooperado.data_inscricao);
          proximoVencimento = new Date(dataInscricao.getFullYear(), dataInscricao.getMonth(), diaVencimentoFixo);
          if (dataInscricao.getDate() > diaVencimentoFixo) {
            proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
          }
        }

        // Verificar se está em atraso ou próximo do vencimento
        if (hoje > proximoVencimento) {
          const diasAtraso = Math.floor((hoje - proximoVencimento) / (1000 * 60 * 60 * 24));
          alertas.push({
            cooperado,
            tipo: 'atraso',
            dias: diasAtraso,
            valor: plano.valor_mensal,
            vencimento: proximoVencimento
          });
        } else if (proximoVencimento <= proximosSete) {
          const diasRestantes = Math.floor((proximoVencimento - hoje) / (1000 * 60 * 60 * 24));
          alertas.push({
            cooperado,
            tipo: 'proximo_vencimento',
            dias: diasRestantes,
            valor: plano.valor_mensal,
            vencimento: proximoVencimento
          });
        }
      }
    });

    return alertas.sort((a, b) => {
      if (a.tipo === 'atraso' && b.tipo !== 'atraso') return -1;
      if (a.tipo !== 'atraso' && b.tipo === 'atraso') return 1;
      return b.dias - a.dias;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Visão geral da cooperativa</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatsCard
          title="Total de Inscrições"
          value={stats.totalInscricoes}
          subtitle={`${stats.inscricoesPendentes} pendentes`}
          icon={UserCheck}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Cooperados Ativos"
          value={stats.cooperadosAtivos}
          subtitle={`de ${stats.totalCooperados} total`}
          icon={Users}
          color="green"
          loading={loading}
        />
         <StatsCard
          title="Assinaturas Ativas"
          value={stats.totalAssinaturasAtivas}
          subtitle="Planos ativos"
          icon={ListChecks}
          color="teal"
          loading={loading}
        />
        <StatsCard
          title="Projetos Ativos"
          value={stats.projetosAtivos}
          subtitle={`de ${stats.totalProjetos} total`}
          icon={Home}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Inadimplentes"
          value={stats.inadimplentes}
          subtitle={`${stats.pagamentosRecebidos} em dia (pagamentos)`}
          icon={AlertCircle}
          color="red"
          loading={loading}
        />
      </div>

      {/* Seção Principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alertas de Cobrança - Sistema Netflix-style */}
        <div className="lg:col-span-2">
          <AlertasCobranca alertas={alertasCobranca} loading={loading} />
        </div>

        {/* Estatísticas por Província */}
        <div>
          <ProvinceChart loading={loading} />
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} loading={loading} />
        
        {/* Métricas Financeiras */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 mb-2">2.450.000 Kz</div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Cobertura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 mb-2">8 Províncias</div>
              <Progress value={75} className="mb-2" />
              <div className="text-sm text-blue-600">75% do território nacional</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-purple-800">
                Taxa de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 mb-2">89%</div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Excelente
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}