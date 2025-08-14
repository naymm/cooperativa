import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  UserCheck, 
  TrendingUp,
  Calendar,
  MapPin
} from "lucide-react";

export default function RelatorioInscricoes({ inscricoes }) {
  const statusCounts = inscricoes.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  const porProvincia = inscricoes.reduce((acc, i) => {
    if (i.provincia) {
      acc[i.provincia] = (acc[i.provincia] || 0) + 1;
    }
    return acc;
  }, {});

  const inscricoesRecentes = inscricoes
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 10);

  const taxaAprovacao = inscricoes.length > 0 
    ? ((statusCounts.aprovado || 0) / inscricoes.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Resumo de Status */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{inscricoes.length}</div>
            <div className="text-sm text-slate-600">Total de Inscrições</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{statusCounts.pendente || 0}</div>
            <div className="text-sm text-slate-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.aprovado || 0}</div>
            <div className="text-sm text-slate-600">Aprovadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejeitado || 0}</div>
            <div className="text-sm text-slate-600">Rejeitadas</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Taxa de Aprovação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {taxaAprovacao.toFixed(1)}%
              </div>
              <p className="text-slate-600">Taxa de Aprovação</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Aprovadas</span>
                <Badge className="bg-green-100 text-green-800">
                  {statusCounts.aprovado || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pendentes</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {statusCounts.pendente || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rejeitadas</span>
                <Badge className="bg-red-100 text-red-800">
                  {statusCounts.rejeitado || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição Geográfica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Origem Geográfica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(porProvincia)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([provincia, count]) => (
                <div key={provincia} className="flex justify-between items-center">
                  <span className="text-sm">{provincia}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inscrições Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Inscrições Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inscricoesRecentes.map((inscricao) => (
              <div key={inscricao.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">{inscricao.nome_completo}</p>
                  <p className="text-sm text-slate-500">{inscricao.email}</p>
                </div>
                <div className="text-right">
                  <Badge className={
                    inscricao.status === "aprovado" ? "bg-green-100 text-green-800" :
                    inscricao.status === "rejeitado" ? "bg-red-100 text-red-800" :
                    "bg-orange-100 text-orange-800"
                  }>
                    {inscricao.status}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(new Date(inscricao.created_date), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}