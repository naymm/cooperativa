import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  Calendar,
  DollarSign,
  CreditCard,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

const PagamentoPendenteCard = ({ pagamentoPendente, onPagar, loading }) => {
  const isUrgente = pagamentoPendente.urgente || 
    (pagamentoPendente.vencimento && new Date(pagamentoPendente.vencimento) < new Date());
  
  const diasAtraso = pagamentoPendente.vencimento 
    ? Math.floor((new Date() - new Date(pagamentoPendente.vencimento)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className={`border-l-4 ${
      isUrgente ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
    } hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isUrgente ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <Clock className="w-5 h-5 text-orange-600" />
            )}
            <CardTitle className="text-lg font-semibold">
              {pagamentoPendente.descricao}
            </CardTitle>
          </div>
          <Badge className={
            isUrgente 
              ? "bg-red-100 text-red-800 border-red-200" 
              : "bg-orange-100 text-orange-800 border-orange-200"
          }>
            {diasAtraso > 0 ? `${diasAtraso} dias em atraso` : 'Próximo do vencimento'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {pagamentoPendente.valor?.toLocaleString() || 0} Kz
              </p>
              <p className="text-sm text-slate-500">Valor a pagar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <div>
              <p className="font-medium text-slate-800">
                {pagamentoPendente.vencimento 
                  ? format(new Date(pagamentoPendente.vencimento), "dd/MM/yyyy")
                  : "Data não definida"
                }
              </p>
              <p className="text-sm text-slate-500">Vencimento</p>
            </div>
          </div>
        </div>

        {pagamentoPendente.descricaoDetalhada && (
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm text-slate-600">{pagamentoPendente.descricaoDetalhada}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={() => onPagar(pagamentoPendente)}
            disabled={loading}
            className={`${
              isUrgente 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-orange-600 hover:bg-orange-700'
            } text-white flex items-center gap-2`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Pagar Agora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagamentoPendenteCard;