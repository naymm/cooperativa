import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RelatorioFinanceiro({ pagamentos, cooperados }) {
  const [periodo, setPeriodo] = useState({
    inicio: "",
    fim: ""
  });

  const filtrarPorPeriodo = () => {
    if (!periodo.inicio || !periodo.fim) return pagamentos;
    
    return pagamentos.filter(p => {
      const dataPagamento = new Date(p.data_pagamento || p.created_date);
      return dataPagamento >= new Date(periodo.inicio) && dataPagamento <= new Date(periodo.fim);
    });
  };

  const pagamentosFiltrados = filtrarPorPeriodo();
  
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
    ticketMedio: 0
  };

  stats.ticketMedio = stats.numeroTransacoes > 0 ? stats.totalArrecadado / stats.numeroTransacoes : 0;

  // Agrupamento por método de pagamento
  const porMetodo = pagamentosFiltrados
    .filter(p => p.status === "confirmado")
    .reduce((acc, p) => {
      acc[p.metodo_pagamento] = (acc[p.metodo_pagamento] || 0) + (p.valor || 0);
      return acc;
    }, {});

  // Agrupamento por mês
  const porMes = pagamentosFiltrados
    .filter(p => p.status === "confirmado")
    .reduce((acc, p) => {
      const mes = format(new Date(p.data_pagamento || p.created_date), "yyyy-MM");
      acc[mes] = (acc[mes] || 0) + (p.valor || 0);
      return acc;
    }, {});

  const exportarPDF = () => {
    const content = `
      RELATÓRIO FINANCEIRO - COOPERATIVA DE HABITAÇÃO
      Período: ${periodo.inicio ? format(new Date(periodo.inicio), "dd/MM/yyyy") : "Início"} até ${periodo.fim ? format(new Date(periodo.fim), "dd/MM/yyyy") : "Fim"}
      
      RESUMO GERAL:
      Total Arrecadado: ${stats.totalArrecadado.toLocaleString()} Kz
      Total Pendente: ${stats.totalPendente.toLocaleString()} Kz
      Total em Atraso: ${stats.totalAtrasado.toLocaleString()} Kz
      Número de Transações: ${stats.numeroTransacoes}
      Ticket Médio: ${stats.ticketMedio.toLocaleString()} Kz
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio_financeiro.txt';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Período do Relatório
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
            <Button onClick={exportarPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
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
                <p className="text-sm text-green-600">Total Arrecadado</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.totalArrecadado.toLocaleString()} Kz
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
                <p className="text-sm text-orange-600">Total Pendente</p>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.totalPendente.toLocaleString()} Kz
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
                <p className="text-sm text-red-600">Total em Atraso</p>
                <p className="text-2xl font-bold text-red-700">
                  {stats.totalAtrasado.toLocaleString()} Kz
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.ticketMedio.toLocaleString()} Kz
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análises Detalhadas */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos por Método</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(porMetodo).map(([metodo, valor]) => (
                <div key={metodo} className="flex justify-between items-center">
                  <span className="capitalize">{metodo.replace("_", " ")}</span>
                  <span className="font-semibold">{valor.toLocaleString()} Kz</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(porMes)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([mes, valor]) => (
                <div key={mes} className="flex justify-between items-center">
                  <span>{format(new Date(mes + "-01"), "MMM yyyy", { locale: ptBR })}</span>
                  <span className="font-semibold">{valor.toLocaleString()} Kz</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Cooperado */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Cooperados por Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(
              pagamentosFiltrados
                .filter(p => p.status === "confirmado")
                .reduce((acc, p) => {
                  const cooperado = cooperados.find(c => c.numero_associado === p.cooperado_id);
                  const nome = cooperado?.nome_completo || p.cooperado_id;
                  acc[nome] = (acc[nome] || 0) + (p.valor || 0);
                  return acc;
                }, {})
            )
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([nome, valor]) => (
              <div key={nome} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <span className="font-medium">{nome}</span>
                <span className="font-semibold text-blue-600">{valor.toLocaleString()} Kz</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}