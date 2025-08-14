import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Download, Printer } from "lucide-react";
import { format } from "date-fns";

export default function NotaPagamento({ pagamento, cooperado, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('nota-pagamento');
    const printContents = element.innerHTML;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <Card id="nota-pagamento" className="print:shadow-none print:border-0">
        <CardContent className="p-8">
          {/* Cabeçalho */}
          <div className="text-center mb-8 border-b border-slate-200 pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">CoopHabitat</h1>
                <p className="text-sm text-slate-600">Cooperativa de Habitação</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-700">COMPROVANTE DE PAGAMENTO</h2>
          </div>

          {/* Informações do Pagamento */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-4">Dados do Cooperado</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Nome:</span>
                  <span className="font-medium">{cooperado?.nome_completo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Nº Associado:</span>
                  <span className="font-medium">#{cooperado?.numero_associado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium">{cooperado?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Telefone:</span>
                  <span className="font-medium">{cooperado?.telefone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700 mb-4">Detalhes do Pagamento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Data do Pagamento:</span>
                  <span className="font-medium">
                    {pagamento.data_pagamento ? format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Método:</span>
                  <span className="font-medium capitalize">
                    {pagamento.metodo_pagamento?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tipo:</span>
                  <span className="font-medium capitalize">
                    {pagamento.tipo?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Referência:</span>
                  <span className="font-medium">{pagamento.referencia || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Valor do Pagamento */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-green-600 mb-2">VALOR PAGO</p>
              <p className="text-4xl font-bold text-green-700">
                {pagamento.valor?.toLocaleString()} Kz
              </p>
            </div>
          </div>

          {/* Observações */}
          {pagamento.observacoes && (
            <div className="mb-8">
              <h3 className="font-semibold text-slate-700 mb-2">Observações</h3>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                {pagamento.observacoes}
              </p>
            </div>
          )}

          {/* Rodapé */}
          <div className="border-t border-slate-200 pt-6">
            <div className="text-center text-xs text-slate-500 space-y-1">
              <p>Este documento foi gerado automaticamente pelo sistema CoopHabitat</p>
              <p>Data de emissão: {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
              <p>Para verificação da autenticidade, entre em contato conosco</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}