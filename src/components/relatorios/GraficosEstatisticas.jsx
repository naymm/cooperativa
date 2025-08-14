import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MapPin,
  Calendar,
  BarChart3
} from "lucide-react";

export default function GraficosEstatisticas({ dados, evolucaoMensal, porProvincia }) {
  const maxReceita = Math.max(...evolucaoMensal.map(m => m.receita));
  const maxInscricoes = Math.max(...evolucaoMensal.map(m => m.inscricoes));

  return (
    <div className="space-y-6">
      {/* Evolução Mensal */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Evolução de Inscrições (12 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evolucaoMensal.slice(-6).map((mes, index) => (
                <div key={mes.mes} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{mes.mes}</span>
                    <span className="font-medium">{mes.inscricoes} inscrições</span>
                  </div>
                  <Progress 
                    value={maxInscricoes > 0 ? (mes.inscricoes / maxInscricoes) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Receita Mensal (6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evolucaoMensal.slice(-6).map((mes, index) => (
                <div key={mes.mes} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{mes.mes}</span>
                    <span className="font-medium">{(mes.receita / 1000).toFixed(0)}K Kz</span>
                  </div>
                  <Progress 
                    value={maxReceita > 0 ? (mes.receita / maxReceita) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição Geográfica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Distribuição por Província
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {porProvincia.slice(0, 5).map(([provincia, count]) => (
                <div key={provincia} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{provincia}</span>
                    <span className="font-medium">{count} cooperados</span>
                  </div>
                  <Progress 
                    value={porProvincia.length > 0 ? (count / porProvincia[0][1]) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {porProvincia.slice(5, 10).map(([provincia, count]) => (
                <div key={provincia} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{provincia}</span>
                    <span className="font-medium">{count} cooperados</span>
                  </div>
                  <Progress 
                    value={porProvincia.length > 0 ? (count / porProvincia[0][1]) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status dos Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Status dos Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {["planejamento", "construcao", "pronto", "entregue"].map(status => {
              const count = dados.projetos.filter(p => p.status === status).length;
              const percentage = dados.projetos.length > 0 ? (count / dados.projetos.length) * 100 : 0;
              
              return (
                <div key={status} className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-800 mb-1">{count}</div>
                  <div className="text-sm text-slate-600 capitalize mb-2">
                    {status.replace("_", " ")}
                  </div>
                  <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}