
import React, { useState } from 'react';
import { Pagamento, CrmNotificacao } from "@/api/entities"; // Import CrmNotificacao
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { UploadFile } from "@/api/integrations";
import { format } from "date-fns";
import { toast } from "sonner";
import { createPageUrl } from "@/utils"; // Import createPageUrl

export default function FormPagamentoCooperado({ 
  cooperado, 
  plano, 
  pagamentosPendentes, 
  open, // New prop for dialog control
  onOpenChange, // New prop for dialog control
  onSubmit // New prop for handling submission logic
}) {
  const [formData, setFormData] = useState({
    tipo: '',
    valor: '',
    data_pagamento: '',
    metodo_pagamento: '',
    referencia: '',
    observacoes: '',
    mes_referencia: ''
  });
  const [comprovante, setComprovante] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTipoChange = (tipo) => {
    setFormData(prev => ({ ...prev, tipo }));
    
    // Auto-preencher dados baseado no tipo selecionado
    if (tipo === 'mensalidade' && pagamentosPendentes.length > 0) {
      const proximaMensalidade = pagamentosPendentes.find(p => p.tipo === 'mensalidade');
      if (proximaMensalidade) {
        setFormData(prev => ({
          ...prev,
          valor: proximaMensalidade.valor.toString(),
          mes_referencia: proximaMensalidade.mesReferencia || ''
        }));
      }
    } else if (tipo === 'taxa_inscricao') {
      const taxaPendente = pagamentosPendentes.find(p => p.tipo === 'taxa_inscricao');
      if (taxaPendente) {
        setFormData(prev => ({
          ...prev,
          valor: taxaPendente.valor.toString()
        }));
      }
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const response = await UploadFile({ file });
      setComprovante(response.file_url);
      toast.success("Comprovante enviado com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar comprovante. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.valor || !formData.data_pagamento || !formData.metodo_pagamento) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!comprovante) {
      toast.error("Anexe o comprovante de pagamento.");
      return;
    }

    setSubmitting(true);
    try {
      const dataToSubmit = {
        cooperado_id: cooperado.numero_associado,
        assinatura_plano_id: plano?.id || null, // Keep if parent needs this for Pagamento.create
        valor: parseFloat(formData.valor),
        data_pagamento: formData.data_pagamento,
        data_vencimento: formData.data_pagamento, // For payments made by cooperado, due date is payment date
        mes_referencia: formData.mes_referencia || null,
        metodo_pagamento: formData.metodo_pagamento,
        referencia: formData.referencia || null,
        tipo: formData.tipo, // Use form selected type
        status: 'pendente', // Always pending when submitted by cooperado
        comprovante_url: comprovante,
        observacoes: formData.observacoes || `Pagamento submetido pelo cooperado em ${format(new Date(), 'dd/MM/yyyy')}`
      };
      
      await onSubmit(dataToSubmit); // Call the onSubmit prop with the prepared data

      // --- GERAR NOTIFICAÇÃO PARA O CRM ---
      try {
        await CrmNotificacao.create({
          titulo: "Novo Comprovativo Submetido",
          mensagem: `${cooperado.nome_completo} enviou um comprovativo de ${dataToSubmit.valor.toLocaleString()} Kz para ${dataToSubmit.tipo === 'mensalidade' ? `referência ${dataToSubmit.mes_referencia || 'N/A'}` : dataToSubmit.tipo}.`,
          tipo: "pagamento",
          link_destino: createPageUrl("Pagamentos") // Link to the payments page in CRM
        });
      } catch (notificationError) {
        console.error("Falha ao criar notificação de pagamento:", notificationError);
        // Do not block submission or show a toast for notification failure
      }
      // --- FIM DA NOTIFICAÇÃO ---
      
      onOpenChange(false); // Close the dialog on successful submission
      toast.success("Pagamento submetido com sucesso para aprovação!"); // Success toast for user
    } catch (error) {
      console.error("Erro ao submeter pagamento:", error);
      toast.error("Erro ao submeter pagamento. Tente novamente."); // Fallback toast for submission error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> {/* Use open and onOpenChange props */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registar Novo Pagamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cooperado */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-sm">Dados do Cooperado</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Nome</Label>
                <p className="font-medium">{cooperado.nome_completo}</p>
              </div>
              <div>
                <Label>Nº Associado</Label>
                <p className="font-medium">{cooperado.numero_associado}</p>
              </div>
              <div>
                <Label>Plano</Label>
                <p className="font-medium">{plano?.nome_plano || "Sem plano"}</p>
              </div>
              <div>
                <Label>Valor Mensal</Label>
                <p className="font-medium">{plano?.valor_mensal?.toLocaleString() || "0"} Kz</p>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Pagamento */}
          <div>
            <Label htmlFor="tipo">Tipo de Pagamento *</Label>
            <Select value={formData.tipo} onValueChange={handleTipoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensalidade">Mensalidade</SelectItem>
                <SelectItem value="taxa_inscricao">Taxa de Inscrição</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="valor">Valor (Kz) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          {/* Mês de Referência para Mensalidades */}
          {formData.tipo === 'mensalidade' && (
            <div>
              <Label htmlFor="mes_referencia">Mês de Referência</Label>
              <Input
                id="mes_referencia"
                type="month"
                value={formData.mes_referencia}
                onChange={(e) => setFormData(prev => ({ ...prev, mes_referencia: e.target.value }))}
              />
            </div>
          )}

          {/* Data do Pagamento */}
          <div>
            <Label htmlFor="data_pagamento">Data do Pagamento *</Label>
            <Input
              id="data_pagamento"
              type="date"
              value={formData.data_pagamento}
              onChange={(e) => setFormData(prev => ({ ...prev, data_pagamento: e.target.value }))}
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <Label htmlFor="metodo_pagamento">Método de Pagamento *</Label>
            <Select 
              value={formData.metodo_pagamento} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pagamento: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Como foi feito o pagamento?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                <SelectItem value="deposito">Depósito Bancário</SelectItem>
                <SelectItem value="multicaixa">Multicaixa</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Referência */}
          <div>
            <Label htmlFor="referencia">Referência/Número da Transação</Label>
            <Input
              id="referencia"
              value={formData.referencia}
              onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
              placeholder="Ex: Nº da transferência, recibo, etc."
            />
          </div>

          {/* Upload de Comprovante */}
          <div>
            <Label>Comprovante de Pagamento *</Label>
            <div className="mt-2">
              {!comprovante ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div>
                    <label htmlFor="comprovante" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Clique para anexar
                      </span>
                      <span className="text-slate-500"> ou arraste o arquivo aqui</span>
                    </label>
                    <input
                      id="comprovante"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG ou PDF até 5MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">Comprovante anexado</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(comprovante, '_blank')}
                    >
                      Ver
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setComprovante(null)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
              
              {uploading && (
                <div className="mt-2 flex items-center gap-2 text-blue-600">
                  <Upload className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Enviando arquivo...</span>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              placeholder="Informações adicionais sobre o pagamento..."
            />
          </div>

          {/* Aviso */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Importante:</p>
                <p>
                  O seu pagamento será submetido para aprovação pela administração. 
                  Receberá uma notificação quando for aprovado ou rejeitado.
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}> {/* Use onOpenChange */}
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || uploading}
              className="bg-[#1f3664] hover:bg-[#162a52]"
            >
              {submitting ? "Submetendo..." : "Submeter Pagamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
