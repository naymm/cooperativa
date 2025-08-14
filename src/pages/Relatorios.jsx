import React, { useState, useEffect } from "react";
import { Inscricao, Cooperado, Projeto, Pagamento } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Users,
  Home,
  CreditCard,
  MapPin,
  Calendar
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

import GraficosEstatisticas from "../components/relatorios/GraficosEstatisticas";
import RelatorioInscricoes from "../components/relatorios/RelatorioInscricoes";
import RelatorioCooperados from "../components/relatorios/RelatorioCooperados";
import RelatorioFinanceiroCompleto from "../components/relatorios/RelatorioFinanceiroCompleto";

export default function Relatorios() {
  const [dados, setDados] = useState({
    inscricoes: [],
    cooperados: [],
    projetos: [],
    pagamentos: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("geral");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [inscricoes, cooperados, projetos, pagamentos] = await Promise.all([
        Inscricao.list(),
        Cooperado.list(),
        Projeto.list(),
        Pagamento.list()
      ]);

      setDados({ inscricoes, cooperados, projetos, pagamentos });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas gerais
  const estatisticasGerais = {
    totalInscricoes: dados.inscricoes.length,
    inscricoesMes: dados.inscricoes.filter(i => 
      new Date(i.created_date) >= startOfMonth(new Date()) &&
      new Date(i.created_date) <= endOfMonth(new Date())
    ).length,
    
    totalCooperados: dados.cooperados.length,
    cooperadosAtivos: dados.cooperados.filter(c => c.status === "ativo").length,
    
    totalProjetos: dados.projetos.length,
    projetosAtivos: dados.projetos.filter(p => p.status !== "entregue").length,
    
    valorArrecadado: dados.pagamentos
      .filter(p => p.status === "confirmado")
      .reduce((sum, p) => sum + (p.valor || 0), 0),
    inadimplentes: dados.pagamentos.filter(p => p.status === "atrasado").length
  };

  // Evolução mensal
  const evolucaoMensal = () => {
    const meses = [];
    for (let i = 11; i >= 0; i--) {
      const mes = subMonths(new Date(), i);
      const mesStr = format(mes, "yyyy-MM");
      
      meses.push({
        mes: format(mes, "MMM yyyy", { locale: ptBR }),
        inscricoes: dados.inscricoes.filter(i => 
          format(new Date(i.created_date), "yyyy-MM") === mesStr
        ).length,
        cooperados: dados.cooperados.filter(c => 
          c.data_inscricao && format(new Date(c.data_inscricao), "yyyy-MM") === mesStr
        ).length,
        receita: dados.pagamentos
          .filter(p => p.status === "confirmado" && 
            p.data_pagamento && format(new Date(p.data_pagamento), "yyyy-MM") === mesStr
          )
          .reduce((sum, p) => sum + (p.valor || 0), 0)
      });
    }
    return meses;
  };

  // Distribuição por província
  const porProvincia = () => {
    const provincias = {};
    
    dados.cooperados.forEach(c => {
      if (c.provincia) {
        provincias[c.provincia] = (provincias[c.provincia] || 0) + 1;
      }
    });
    
    return Object.entries(provincias)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const exportarRelatorioCompleto = () => {
    const evolucao = evolucaoMensal();
    const provinciaData = porProvincia();
    
    const content = `
RELATÓRIO COMPLETO - COOPERATIVA DE HABITAÇÃO
Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}

═══════════════════════════════════════════════════════════════

RESUMO GERAL
───────────────────────────────────────────────────────────────
Total de Inscrições: ${estatisticasGerais.totalInscricoes}
Inscrições este mês: ${estatisticasGerais.inscricoesMes}

Total de Cooperados: ${estatisticasGerais.totalCooperados}
Cooperados Ativos: ${estatisticasGerais.cooperadosAtivos}

Total de Projetos: ${estatisticasGerais.totalProjetos}
Projetos Ativos: ${estatisticasGerais.projetosAtivos}

Valor Arrecadado: ${estatisticasGerais.valorArrecadado.toLocaleString()} Kz
Inadimplentes: ${estatisticasGerais.inadimplentes}

═══════════════════════════════════════════════════════════════

EVOLUÇÃO MENSAL (Últimos 12 meses)
───────────────────────────────────────────────────────────────
${evolucao.map(m => 
  `${m.mes.padEnd(10)} | Inscrições: ${m.inscricoes.toString().padStart(3)} | Cooperados: ${m.cooperados.toString().padStart(3)} | Receita: ${m.receita.toLocaleString().padStart(10)} Kz`
).join('\n')}

═══════════════════════════════════════════════════════════════

DISTRIBUIÇÃO POR PROVÍNCIA
───────────────────────────────────────────────────────────────
${provinciaData.map(([provincia, count]) => 
  `${provincia.padEnd(20)} | ${count.toString().padStart(3)} cooperados`
).join('\n')}

═══════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_completo_${format(new Date(), "yyyy-MM-dd")}.txt`;
    link.click();
  };

  const tabs = [
    { id: "geral", label: "Visão Geral", icon: BarChart3 },
    { id: "inscricoes", label: "Inscrições", icon: Users },
    { id: "cooperados", label: "Cooperados", icon: Users },
    { id: "financeiro", label: "Financeiro", icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Relatórios e Análises</h1>
          <p className="text-slate-600 mt-1">Análise completa dos dados da cooperativa</p>
        </div>
        <Button onClick={exportarRelatorioCompleto} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório Completo
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Inscrições</p>
                <p className="text-2xl font-bold text-blue-700">{estatisticasGerais.totalInscricoes}</p>
                <p className="text-xs text-blue-500">+{estatisticasGerais.inscricoesMes} este mês</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Cooperados Ativos</p>
                <p className="text-2xl font-bold text-green-700">{estatisticasGerais.cooperadosAtivos}</p>
                <p className="text-xs text-green-500">de {estatisticasGerais.totalCooperados} total</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Projetos Ativos</p>
                <p className="text-2xl font-bold text-purple-700">{estatisticasGerais.projetosAtivos}</p>
                <p className="text-xs text-purple-500">de {estatisticasGerais.totalProjetos} total</p>
              </div>
              <Home className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Arrecadado</p>
                <p className="text-lg font-bold text-orange-700">
                  {(estatisticasGerais.valorArrecadado / 1000000).toFixed(1)}M Kz
                </p>
                <p className="text-xs text-orange-500">{estatisticasGerais.inadimplentes} inadimplentes</p>
              </div>
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Abas */}
      <Card>
        <CardHeader>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Carregando dados...</p>
            </div>
          ) : (
            <>
              {activeTab === "geral" && (
                <GraficosEstatisticas 
                  dados={dados}
                  evolucaoMensal={evolucaoMensal()}
                  porProvincia={porProvincia()}
                />
              )}
              {activeTab === "inscricoes" && (
                <RelatorioInscricoes inscricoes={dados.inscricoes} />
              )}
              {activeTab === "cooperados" && (
                <RelatorioCooperados cooperados={dados.cooperados} />
              )}
              {activeTab === "financeiro" && (
                <RelatorioFinanceiroCompleto 
                  pagamentos={dados.pagamentos}
                  cooperados={dados.cooperados}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}