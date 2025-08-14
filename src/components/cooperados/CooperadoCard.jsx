
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CreditCard,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  ativo: "bg-green-100 text-green-800 border-green-200",
  inativo: "bg-orange-100 text-orange-800 border-orange-200",
  suspenso: "bg-red-100 text-red-800 border-red-200"
};

// Utility function to check if a date string is valid
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const CooperadoCard = React.memo(function CooperadoCard({ 
  cooperado, 
  pagamentos, 
  onViewDetails, 
  onEdit, 
  onStatusChange 
}) {
  const ultimoPagamento = pagamentos
    .filter(p => p.status === "confirmado")
    .sort((a, b) => new Date(b.data_pagamento) - new Date(a.data_pagamento))[0];

  const pagamentosAtrasados = pagamentos.filter(p => p.status === "atrasado").length;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{cooperado.nome_completo}</h3>
                <p className="text-slate-500 text-sm">#{cooperado.numero_associado}</p>
              </div>
              <Badge className={`${statusColors[cooperado.status]} border ml-2`}>
                {cooperado.status.charAt(0).toUpperCase() + cooperado.status.slice(1)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span>{cooperado.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{cooperado.telefone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{cooperado.provincia}, {cooperado.municipio}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isValidDate(cooperado.data_inscricao) 
                      ? format(new Date(cooperado.data_inscricao), "dd/MM/yyyy")
                      : "N/A"
                    }
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {ultimoPagamento && isValidDate(ultimoPagamento.data_pagamento) 
                      ? `Último: ${format(new Date(ultimoPagamento.data_pagamento), "dd/MM/yyyy")}`
                      : "Sem pagamentos"
                    }
                  </span>
                </div>
                {pagamentosAtrasados > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {pagamentosAtrasados} pagamento(s) atrasado(s)
                  </Badge>
                )}
              </div>
            </div>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange(cooperado, cooperado.status === "ativo" ? "inativo" : "ativo")}
                >
                  {cooperado.status === "ativo" ? "Inativar" : "Ativar"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange(cooperado, "suspenso")}
                  className="text-red-600"
                >
                  Suspender
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default CooperadoCard;
