import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function PagamentosStats({ pagamentos }) {
  // Calcular estatísticas
  const stats = React.useMemo(() => {
    const total = pagamentos.length;
    const confirmados = pagamentos.filter(p => p.status === 'confirmado').length;
    const pendentes = pagamentos.filter(p => p.status === 'pendente').length;
    const rejeitados = pagamentos.filter(p => p.status === 'cancelado').length;
    
    const valorTotal = pagamentos
      .filter(p => p.status === 'confirmado')
      .reduce((sum, p) => sum + (p.valor || 0), 0);
    
    const valorPendente = pagamentos
      .filter(p => p.status === 'pendente')
      .reduce((sum, p) => sum + (p.valor || 0), 0);

    // Calcular média mensal dos últimos 6 meses
    const ultimos6Meses = pagamentos
      .filter(p => p.status === 'confirmado' && p.data_pagamento)
      .sort((a, b) => new Date(b.data_pagamento) - new Date(a.data_pagamento))
      .slice(0, 6);
    
    const mediaMensal = ultimos6Meses.length > 0 
      ? ultimos6Meses.reduce((sum, p) => sum + (p.valor || 0), 0) / ultimos6Meses.length
      : 0;

    return {
      total,
      confirmados,
      pendentes,
      rejeitados,
      valorTotal,
      valorPendente,
      mediaMensal,
      percentualConfirmados: total > 0 ? (confirmados / total) * 100 : 0
    };
  }, [pagamentos]);

  const statCards = [
    {
      title: "Total de Pagamentos",
      value: stats.total,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Confirmados",
      value: stats.confirmados,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      subtitle: `${stats.percentualConfirmados.toFixed(1)}% do total`
    },
    {
      title: "Pendentes",
      value: stats.pendentes,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      subtitle: `${stats.valorPendente.toLocaleString()} Kz`
    },
    {
      title: "Valor Total Pago",
      value: `${stats.valorTotal.toLocaleString()} Kz`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      subtitle: `Média: ${stats.mediaMensal.toLocaleString()} Kz/mês`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 