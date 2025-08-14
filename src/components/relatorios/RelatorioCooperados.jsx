import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, subMonths } from "date-fns";
import { 
  Users, 
  MapPin,
  TrendingUp,
  Briefcase
} from "lucide-react";

export default function RelatorioCooperados({ cooperados }) {
  const statusCounts = cooperados.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const porProvincia = cooperados.reduce((acc, c) => {
    if (c.provincia) {
      acc[c.provincia] = (acc[c.provincia] || 0) + 1;
    }
    return acc;
  }, {});

  const porProfissao = cooperados.reduce((acc, c) => {
    if (c.profissao) {
      acc[c.profissao] = (acc[c.profissao] || 0) + 1;
    }
    return acc;
  }, {});

  // Crescimento nos últimos 6 meses
  const crescimentoMensal = () => {
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const mes = subMonths(new Date(), i);
      const mesStr = format(mes, "yyyy-MM");
      
      const count = cooperados.filter(c => 
        c.data_inscricao && format(new Date(c.data_inscricao), "yyyy-MM") === mesStr
      ).length;
      
      meses.push({
        mes: format(mes, "MMM yyyy"),
        count
      });
    }
    return meses;
  };

  const crescimento = crescimentoMensal();
  const maxCrescimento = Math.max(...crescimento.map(m => m.count));

  // Estatísticas de renda
  const rendas = cooperados
    .filter(c => c.renda_mensal && c.renda_mensal > 0)
    .map(c => c.renda_mensal);
  
  const rendaMedia = rendas.length > 0 ? rendas.reduce((a, b) => a + b, 0) / rendas.length : 0;
  const rendaMediana = rendas.length > 0 ? rendas.sort((a, b) => a - b)[Math.floor(rendas.length / 2)] : 0;

  return (
    <div className="space-y-6">
      {/* Status dos Cooperados */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.ativo || 0}</div>
            <div className="text-sm text-slate-600">Ativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{statusCounts.inativo || 0}</div>
            <div className="text-sm text-slate-600">Inativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.suspenso || 0}</div>
            <div className="text-sm text-slate-600">Suspensos</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Crescimento Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Crescimento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crescimento.map((mes) => (
                <div key={mes.mes} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{mes.mes}</span>
                    <span className="font-medium">+{mes.count} cooperados</span>
                  </div>
                  <Progress 
                    value={maxCrescimento > 0 ? (mes.count / maxCrescimento) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição Geográfica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Distribuição por Província
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(porProvincia)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([provincia, count]) => {
                  const percentage = (count / cooperados.length) * 100;
                  return (
                    <div key={provincia} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{provincia}</span>
                        <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Perfil Profissional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Perfil Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(porProfissao)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([profissao, count]) => (
                <div key={profissao} className="flex justify-between items-center">
                  <span className="text-sm">{profissao}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas de Renda */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Renda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {rendaMedia.toLocaleString()} Kz
                </div>
                <div className="text-sm text-blue-600">Renda Média</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {rendaMediana.toLocaleString()} Kz
                </div>
                <div className="text-sm text-green-600">Renda Mediana</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                <strong>{rendas.length}</strong> cooperados informaram renda
              </p>
              <p className="text-sm text-slate-600">
                <strong>{cooperados.length - rendas.length}</strong> sem informação de renda
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}