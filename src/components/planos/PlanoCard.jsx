import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ListChecks, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Power,
  Trash2
} from "lucide-react";

export default function PlanoCard({ plano, onViewDetails, onEdit, onToggleStatus, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{plano.nome_plano}</h3>
                <Badge className={`${
                  plano.ativo 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-gray-100 text-gray-800 border-gray-200"
                } border`}>
                  {plano.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4" />
                <div>
                  <p className="font-medium">{plano.valor_mensal?.toLocaleString()} Kz</p>
                  <p className="text-xs text-slate-500">Valor mensal</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4" />
                <div>
                  <p className="font-medium">{plano.taxa_inscricao?.toLocaleString()} Kz</p>
                  <p className="text-xs text-slate-500">Taxa de inscrição</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="font-medium">Dia {plano.dia_vencimento_fixo || "15"}</p>
                  <p className="text-xs text-slate-500">Vencimento</p>
                </div>
              </div>
            </div>

            {plano.descricao && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">{plano.descricao}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Detalhes
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleStatus}
              className={`flex items-center gap-2 ${
                plano.ativo ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"
              }`}
            >
              <Power className="w-4 h-4" />
              {plano.ativo ? "Desativar" : "Ativar"}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}