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
  planejamento: "bg-orange-100 text-orange-800 border-orange-200",
  construcao: "bg-blue-100 text-blue-800 border-blue-200",
  pronto: "bg-green-100 text-green-800 border-green-200",
  entregue: "bg-purple-100 text-purple-800 border-purple-200"
};

const tipoColors = {
  T0: "bg-gray-100 text-gray-800",
  T1: "bg-blue-100 text-blue-800", 
  T2: "bg-green-100 text-green-800",
  T3: "bg-yellow-100 text-yellow-800",
  T4: "bg-orange-100 text-orange-800",
  T5: "bg-red-100 text-red-800"
};

export default function ProjetoCard({ projeto, cooperados, onViewDetails, onEdit }) {
  const cooperadosAssociados = projeto.cooperados_associados || [];
  const numCooperados = cooperadosAssociados.length;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-slate-800 mb-2">{projeto.nome}</CardTitle>
            <div className="flex gap-2 mb-3">
              <Badge className={`${statusColors[projeto.status]} border`}>
                {projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1)}
              </Badge>
              <Badge className={`${tipoColors[projeto.tipo]} border`}>
                {projeto.tipo}
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
            <MapPin className="w-4 h-4" />
            <div>
              <p className="text-sm">{projeto.provincia}</p>
              <p className="text-xs text-slate-500">{projeto.municipio}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Square className="w-4 h-4" />
            <div>
              <p className="text-sm">{projeto.area_util}m²</p>
              <p className="text-xs text-slate-500">
                {projeto.num_quartos}Q | {projeto.num_banheiros}WC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">
                {projeto.preco_final?.toLocaleString()} Kz
              </p>
              <p className="text-xs text-slate-500">Preço final</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4" />
            <div>
              <p className="text-sm">{numCooperados} cooperados</p>
              <p className="text-xs text-slate-500">Associados</p>
            </div>
          </div>
        </div>

        {projeto.data_previsao_entrega && (
          <div className="flex items-center gap-2 text-slate-600 pt-2 border-t">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Previsão de entrega: {format(new Date(projeto.data_previsao_entrega), "dd/MM/yyyy")}
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