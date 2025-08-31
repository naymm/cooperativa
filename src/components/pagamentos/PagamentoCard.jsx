
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar,
  CreditCard,
  Check,
  Clock,
  AlertTriangle,
  Edit,
  FileText
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  confirmado: "bg-green-100 text-green-800 border-green-200",
  pendente: "bg-orange-100 text-orange-800 border-orange-200",
  atrasado: "bg-red-100 text-red-800 border-red-200"
};

const statusIcons = {
  confirmado: Check,
  pendente: Clock,
  atrasado: AlertTriangle
};

const metodoLabels = {
  transferencia: "Transferência",
  deposito: "Depósito",
  multicaixa: "Multicaixa",
  dinheiro: "Dinheiro"
};

const PagamentoCard = React.memo(function PagamentoCard({ pagamento, cooperado, onConfirmar, onEdit }) {
  const StatusIcon = statusIcons[pagamento.status] || AlertTriangle;
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">
                  {cooperado?.nome_completo || "Cooperado não encontrado"}
                </h3>
                <p className="text-slate-500 text-sm">#{cooperado?.numero_associado || pagamento.cooperado_id}</p>
              </div>
              <Badge className={`${statusColors[pagamento.status] || 'bg-gray-100 text-gray-800 border-gray-200'} border flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {pagamento.status ? pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1) : 'Desconhecido'}
              </Badge>
            </div>

            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCard className="w-4 h-4" />
                <div>
                  <p className="font-medium">{pagamento.valor?.toLocaleString()} Kz</p>
                  <p className="text-xs text-slate-500 capitalize">{pagamento.tipo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-sm">
                    {pagamento.data_pagamento && pagamento.data_pagamento !== 'Invalid Date'
                      ? format(new Date(pagamento.data_pagamento), "dd/MM/yyyy")
                      : "Data não informada"
                    }
                  </p>
                  <p className="text-xs text-slate-500">Data do pagamento</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <div>
                  <p className="text-sm">{metodoLabels[pagamento.metodo_pagamento] || pagamento.metodo_pagamento}</p>
                  <p className="text-xs text-slate-500">Método</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4" />
                <div>
                  <p className="text-sm font-mono">{pagamento.referencia || "-"}</p>
                  <p className="text-xs text-slate-500">Referência</p>
                </div>
              </div>
            </div>

            {pagamento.data_vencimento && (
              <div className="mt-3 text-sm text-slate-600">
                <span>Vencimento: {
                  pagamento.data_vencimento && pagamento.data_vencimento !== 'Invalid Date'
                    ? format(new Date(pagamento.data_vencimento), "dd/MM/yyyy")
                    : "Data inválida"
                }</span>
              </div>
            )}

            {/* {pagamento.observacoes && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  {typeof pagamento.observacoes === 'object' ? 
                    pagamento.observacoes.descricao || JSON.stringify(pagamento.observacoes) :
                    pagamento.observacoes
                  }
                </p>
              </div>
            )} */}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {pagamento.status === "pendente" && (
              <Button
                size="sm"
                onClick={onConfirmar}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirmar
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>

            {pagamento.comprovante_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(pagamento.comprovante_url, '_blank')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Comprovante
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default PagamentoCard;
