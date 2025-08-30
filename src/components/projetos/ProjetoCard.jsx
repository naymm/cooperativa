import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit,
  Square
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  ativo: "bg-green-100 text-green-800 border-green-200",
  inativo: "bg-gray-100 text-gray-800 border-gray-200",
  concluido: "bg-blue-100 text-blue-800 border-blue-200"
};

export default function ProjetoCard({ projeto, cooperados, onViewDetails, onEdit }) {
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
  const numCooperados = cooperadosInteressados.length;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-slate-800 mb-2">{projeto.titulo}</CardTitle>
            <div className="flex gap-2 mb-3">
              <Badge className={`${statusColors[projeto.status]} border`}>
                {projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <Eye className="w-4 h-4 mr-2" />
              Detalhes
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-sm">{projeto.data_inicio ? new Date(projeto.data_inicio).toLocaleDateString() : 'N/A'}</p>
              <p className="text-xs text-slate-500">Data início</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-sm">{projeto.data_fim ? new Date(projeto.data_fim).toLocaleDateString() : 'N/A'}</p>
              <p className="text-xs text-slate-500">Data fim</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">
                {projeto.valor_total?.toLocaleString()} Kz
              </p>
              <p className="text-xs text-slate-500">Valor total</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4" />
            <div>
              <p className="text-sm">{numCooperados} cooperados</p>
              <p className="text-xs text-slate-500">Interessados</p>
            </div>
          </div>
        </div>

        {projeto.valor_entrada && (
          <div className="flex items-center gap-2 text-slate-600 pt-2 border-t">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">
              Entrada: {projeto.valor_entrada?.toLocaleString()} Kz | Parcelas: {projeto.numero_parcelas} | Valor parcela: {projeto.valor_parcela?.toLocaleString()} Kz
            </span>
          </div>
        )}

        {projeto.descricao && (
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-600">{projeto.descricao}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}