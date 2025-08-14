import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Calendar,
  Download
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function RelatorioFinanceiroCompleto({ pagamentos, cooperados }) {
  const [periodo, setPeriodo] = useState({
    inicio: format(subMonths(new Date(), 6), "yyyy-MM-dd"),
    fim: format(new Date(), "yyyy-MM-dd")
  });

  const filtrarPorPeriodo = () => {
    if (!periodo.inicio || !periodo.fim) return pagamentos;
    
    return pagamentos.filter(p => {
      const dataPagamento = new Date(p.data_pagamento || p.created_date);
      return dataPagamento >= new Date(periodo.inicio) && dataPagamento <= new Date(periodo.fim);
    });
  };

  const pagamentosFiltrados = filtrarPorPeriodo();

  // Estatísticas principais
  const stats = {
    totalArrecadado: pagamentosFiltrados
      .filter(p => p.status === "confirmado")
      .reduce((sum, p) => sum + (p.valor || 0), 0),
    totalPendente: pagamentosFiltrados
      .filter(p => p.status === "pendente")
      .reduce((sum, p) => sum + (p.valor || 0), 0),
    totalAtrasado: pagamentosFiltrados
      .filter(p => p.status === "atrasado")
      .reduce((sum, p) => sum + (p.valor || 0), 0),
    numeroTransacoes: pagamentosFiltrados.filter(p => p.status === "confirmado").length,
    inadimplentes: new Set(pagamentosFiltrados.filter(p => p.status === "atrasado").map(p => p.cooperado_id)).size
  };

  // Evolução mensal
  const evolucaoMensal = () => {
    const meses = [];
    for (let i = 11; i >= 0; i--) {
      const mes = subMonths(new Date(), i);
      const mesStr = format(mes, "yyyy-MM");
      
      const pagamentosMes = pagamentosFiltrados.filter(p => 
        p.status === "confirmado" && 
        p.data_pagamento && 
        format(new Date(p.data_pagamento), "yyyy-MM") === mesStr
      );
      
      meses.push({
        mes: format(mes, "MMM yyyy"),
        valor: pagamentosMes.reduce((sum, p) => sum + (p.valor || 0), 0),
        transacoes: pagamentosMes.length
      });
    }
    return meses;
  };

  const evolucao = evolucaoMensal();
  const maxValor = Math.max(...evolucao.map(m => m.valor));

  // Métodos de pagamento
  const porMetodo = pagamentosFiltrados
    .filter(p => p.status === "confirmado")
    .reduce((acc, p) => {
      const metodo = p.metodo_pagamento || "não_informado";
      acc[metodo] = {
        valor: (acc[metodo]?.valor || 0) + (p.valor || 0),
        count: (acc[metodo]?.count || 0) + 1
      };
      return acc;
    }, {});

  // Top cooperados
  const topCooperados = Object.entries(
    pagamentosFiltrados
      .filter(p => p.status === "confirmado")
      .reduce((acc, p) => {
        acc[p.cooperado_id] = (acc[p.cooperado_id] || 0) + (p.valor || 0);
        return acc;
      }, {})
  )
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([cooperadoId, valor]) => {
    const cooperado = cooperados.find(c => c.numero_associado === cooperadoId);
    return {
      nome: cooperado?.nome_completo || cooperadoId,
      valor
    };
  });

  const exportarDetalhado = () => {
    const content = `
RELATÓRIO FINANCEIRO DETALHADO
Período: ${format(new Date(periodo.inicio), "dd/MM/yyyy")} até ${format(new Date(periodo.fim), "dd/MM/yyyy")}
Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}

═══════════════════════════════════════════════════════════════

RESUMO EXECUTIVO
───────────────────────────────────────────────────────────────
Total Arrecadado: ${stats.totalArrecadado.toLocaleString()} Kz
Total Pendente: ${stats.totalPendente.toLocaleString()} Kz
Total em Atraso: ${stats.totalAtrasado.toLocaleString()} Kz
Número de Transações: ${stats.numeroTransacoes}
Cooperados Inadimplentes: ${stats.inadimplentes}

═══════════════════════════════════════════════════════════════

EVOLUÇÃO MENSAL
───────────────────────────────────────────────────────────────
${evolucao.map(m => 
  `${m.mes.padEnd(10)} | Valor: ${m.valor.toLocaleString().padStart(12)} Kz | Transações: ${m.transacoes.toString().padStart(3)}`
).join('\n')}

═══════════════════════════════════════════════════════════════

MÉTODOS DE PAGAMENTO
───────────────────────────────────────────────────────────────
${Object.entries(porMetodo).map(([metodo, data]) => 
  `${metodo.padEnd(15)} | ${data.valor.toLocaleString().padStart(12)} Kz | ${data.count.toString().padStart(3)} transações`
).join('\n')}

═══════════════════════════════════════════════════════════════

TOP 10 COOPERADOS POR VOLUME
───────────────────────────────────────────────────────────────
${topCooperados.map(c => 
  `${c.nome.padEnd(30)} | ${c.valor.toLocaleString().padStart(12)} Kz`
).join('\n')}

═══════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_financeiro_${format(new Date(), "yyyy-MM-dd")}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="data_inicio">Data Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={periodo.inicio}
                onChange={(e) => setPeriodo(prev => ({ ...prev, inicio: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="data_fim">Data Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={periodo.fim}
                onChange={(e) => setPeriodo(prev => ({ ...prev, fim: e.target.value }))}
              />
            </div>
            <Button onClick={exportarDetalhado} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Detalhado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Arrecadado</p>
                <p className="text-xl font-bold text-green-700">
                  {(stats.totalArrecadado / 1000000).toFixed(1)}M Kz
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Pendente</p>
                <p className="text-xl font-bold text-orange-700">
                  {(stats.totalPendente / 1000).toFixed(0)}K Kz
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Em Atraso</p>
                <p className="text-xl font-bold text-red-700">
                  {(stats.totalAtrasado / 1000).toFixed(0)}K Kz
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Inadimplentes</p>
                <p className="text-xl font-bold text-blue-700">{stats.inadimplentes}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita (12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evolucao.slice(-6).map((mes) => (
                <div key={mes.mes} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{mes.mes}</span>
                    <span className="font-medium">{(mes.valor / 1000).toFixed(0)}K Kz</span>
                  </div>
                  <Progress 
                    value={maxValor > 0 ? (mes.valor / maxValor) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Método</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(porMetodo)
                .sort(([,a], [,b]) => b.valor - a.valor)
                .map(([metodo, data]) => (
                <div key={metodo} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{metodo.replace("_", " ")}</span>
                    <span className="font-medium">
                      {(data.valor / 1000).toFixed(0)}K Kz ({data.count})
                    </span>
                  </div>
                  <Progress 
                    value={(data.valor / stats.totalArrecadado) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Cooperados */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Cooperados por Volume de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCooperados.map((cooperado, index) => (
              <div key={cooperado.nome} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="font-medium">{cooperado.nome}</span>
                </div>
                <span className="font-bold text-green-600">
                  {cooperado.valor.toLocaleString()} Kz
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}