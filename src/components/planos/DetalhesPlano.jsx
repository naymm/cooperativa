import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ListChecks, 
  DollarSign, 
  Calendar,
  FileText,
  Users
} from "lucide-react";
import { format } from "date-fns";

export default function DetalhesPlano({ plano }) {
  return (
    <div className="space-y-6">
      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Informações do Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Nome do Plano</label>
              <p className="text-slate-800 font-medium text-lg">{plano.nome_plano}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Status</label>
              <div className="mt-1">
                <Badge className={`${
                  plano.ativo 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-gray-100 text-gray-800 border-gray-200"
                } border`}>
                  {plano.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Valor Mensal</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {plano.valor_mensal?.toLocaleString()} Kz
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Taxa de Inscrição</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {plano.taxa_inscricao?.toLocaleString()} Kz
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Vencimento</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                Dia {plano.dia_vencimento_fixo || "15"}
              </p>
            </div>
          </div>

          {plano.descricao && (
            <div>
              <label className="text-sm font-medium text-slate-600">Descrição</label>
              <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 whitespace-pre-wrap">{plano.descricao}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-slate-600">Data de Criação</label>
              <p className="font-medium">
                {plano.created_date ? format(new Date(plano.created_date), "dd/MM/yyyy 'às' HH:mm") : "-"}
              </p>
            </div>
            <div>
              <label className="text-slate-600">Última Atualização</label>
              <p className="font-medium">
                {plano.updated_date ? format(new Date(plano.updated_date), "dd/MM/yyyy 'às' HH:mm") : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de Uso (placeholder para implementação futura) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Estatísticas de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Estatísticas de cooperados inscritos neste plano serão exibidas aqui.</p>
            <p className="text-sm mt-1">Em desenvolvimento...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}