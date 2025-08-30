import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calendar, 
  DollarSign,
  Users
} from "lucide-react";

export default function DetalhesProjeto({ projeto, cooperados }) {
  let cooperadosInteressados = [];
  if (projeto.cooperados_interessados) {
    if (typeof projeto.cooperados_interessados === 'string') {
      try {
        cooperadosInteressados = JSON.parse(projeto.cooperados_interessados);
      } catch (e) {
        // Se não for JSON válido, pode ser uma string simples
        cooperadosInteressados = projeto.cooperados_interessados.split(',').filter(id => id.trim());
      }
    } else if (Array.isArray(projeto.cooperados_interessados)) {
      cooperadosInteressados = projeto.cooperados_interessados;
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Informações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Título do Projeto</label>
                <p className="text-slate-800 font-medium">{projeto.titulo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <Badge className={`mt-1 ${
                  projeto.status === "ativo" ? "bg-green-100 text-green-800" :
                  projeto.status === "inativo" ? "bg-gray-100 text-gray-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Valor Total</label>
                <p className="text-slate-800 font-semibold text-lg">
                  {projeto.valor_total?.toLocaleString()} Kz
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Valor de Entrada</label>
                <p className="text-slate-800">
                  {projeto.valor_entrada?.toLocaleString()} Kz
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Número de Parcelas</label>
                <p className="text-slate-800">{projeto.numero_parcelas} parcelas</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Valor da Parcela</label>
                <p className="text-slate-800">
                  {projeto.valor_parcela?.toLocaleString()} Kz
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Data de Início</label>
                  <p className="text-slate-800">
                    {projeto.data_inicio ? new Date(projeto.data_inicio).toLocaleDateString() : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Data de Fim</label>
                  <p className="text-slate-800">
                    {projeto.data_fim ? new Date(projeto.data_fim).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          {projeto.descricao && (
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{projeto.descricao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Cooperados Interessados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Cooperados Interessados ({cooperadosInteressados.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cooperadosInteressados.length > 0 ? (
                <div className="space-y-3">
                  {cooperadosInteressados.map((cooperadoId, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {cooperadoId.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          Cooperado {cooperadoId}
                        </p>
                        <p className="text-xs text-slate-500">ID: {cooperadoId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum cooperado interessado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
