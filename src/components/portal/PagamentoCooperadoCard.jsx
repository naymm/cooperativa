import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  confirmado: "bg-green-100 text-green-800 border-green-200",
  pendente: "bg-orange-100 text-orange-800 border-orange-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
  atrasado: "bg-red-100 text-red-800 border-red-200"
};

const statusIcons = {
  confirmado: CheckCircle,
  pendente: Clock,
  cancelado: XCircle,
  atrasado: AlertTriangle
};

const statusLabels = {
  confirmado: "Aprovado",
  pendente: "Aguardando Aprovação",
  cancelado: "Rejeitado",
  atrasado: "Em Atraso"
};

const metodoLabels = {
  transferencia: "Transferência",
  deposito: "Depósito",
  multicaixa: "Multicaixa",
  dinheiro: "Dinheiro"
};

const tipoLabels = {
  mensalidade: "Mensalidade",
  taxa_inscricao: "Taxa de Inscrição",
  pagamento_projeto: "Pagamento de Projeto",
  outro: "Outro"
};

export default function PagamentoCooperadoCard({ pagamento }) {
  const StatusIcon = statusIcons[pagamento.status] || Clock;
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">
                {tipoLabels[pagamento.tipo] || pagamento.tipo}
              </h3>
              <p className="text-slate-500 text-sm">
                Submetido em {format(new Date(pagamento.created_date), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
          <Badge className={`${statusColors[pagamento.status]} border flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {statusLabels[pagamento.status] || pagamento.status}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-slate-600">
            <CreditCard className="w-4 h-4" />
            <div>
              <p className="font-medium">{pagamento.valor?.toLocaleString()} Kz</p>
              <p className="text-xs text-slate-500">Valor</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-sm">
                {pagamento.data_pagamento 
                  ? format(new Date(pagamento.data_pagamento), "dd/MM/yyyy")
                  : "Data não informada"
                }
              </p>
              <p className="text-xs text-slate-500">Data do Pagamento</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <div>
              <p className="text-sm">{metodoLabels[pagamento.metodo_pagamento] || pagamento.metodo_pagamento}</p>
              <p className="text-xs text-slate-500">Método</p>
            </div>
          </div>
        </div>

        {pagamento.mes_referencia && (
          <div className="mb-3 text-sm text-slate-600">
            <span className="font-medium">Mês de Referência:</span> {format(new Date(pagamento.mes_referencia + "-01"), "MMMM yyyy", { locale: ptBR })}
          </div>
        )}

        {pagamento.referencia && (
          <div className="mb-3 text-sm text-slate-600">
            <span className="font-medium">Referência:</span> <span className="font-mono">{pagamento.referencia}</span>
          </div>
        )}

        {pagamento.observacoes && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">{pagamento.observacoes}</p>
          </div>
        )}

        {pagamento.comprovante_url && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pagamento.comprovante_url, '_blank')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Ver Comprovante
            </Button>
          </div>
        )}

        {pagamento.status === 'cancelado' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Motivo da Rejeição:</strong> {pagamento.observacoes || "Não especificado"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}