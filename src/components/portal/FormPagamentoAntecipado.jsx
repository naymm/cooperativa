import React, { useState, useEffect } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUp, CheckCircle, DollarSign, Calendar, Plus, Minus } from "lucide-react";
import { UploadFile } from "@/api/integrations";
import { Projeto } from "@/api/entities";
import { addMonths, format } from "date-fns";

export default function FormPagamentoAntecipado({ 
  cooperado, 
  plano,
  open, 
  onOpenChange, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    tipo_pagamento: "", // "mensalidade_antecipada" ou "pagamento_projeto"
    metodo_pagamento: "",
    referencia: "",
    comprovante_url: "",
    observacoes: "",
    // Para mensalidades antecipadas
    meses_antecipados: [],
    valor_total_mensalidades: 0,
    // Para projetos
    projeto_id: "",
    valor_projeto: "",
    tipo_pagamento_projeto: "" // "entrada", "parcial", "total"
  });
  
  const [projetos, setProjetos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mesesDisponiveis, setMesesDisponiveis] = useState([]);

  useEffect(() => {
    if (open) {
      loadProjetos();
      calcularMesesDisponiveis();
    }
  }, [open, plano]);

  const loadProjetos = async () => {
    try {
      const projetosData = await Projeto.list();
      // Filtrar apenas projetos ativos
      setProjetos(projetosData.filter(p => p.status !== 'entregue'));
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };

  const calcularMesesDisponiveis = () => {
    if (!plano) return;
    
    const hoje = new Date();
    const proximoMes = addMonths(hoje, 1);
    const meses = [];
    
    // Gerar próximos 12 meses disponíveis para pagamento antecipado
    for (let i = 0; i < 12; i++) {
      const mesData = addMonths(proximoMes, i);
      const mesReferencia = `${mesData.getFullYear()}-${String(mesData.getMonth() + 1).padStart(2, '0')}`;
      const vencimento = new Date(mesData.getFullYear(), mesData.getMonth(), plano.dia_vencimento_fixo || 15);
      
      meses.push({
        mesReferencia,
        descricao: format(mesData, "MMMM yyyy"),
        vencimento: vencimento.toISOString().split('T')[0],
        valor: plano.valor_mensal
      });
    }
    
    setMesesDisponiveis(meses);
  };

  const handleMesToggle = (mes, checked) => {
    setFormData(prev => {
      const novosMeses = checked 
        ? [...prev.meses_antecipados, mes]
        : prev.meses_antecipados.filter(m => m.mesReferencia !== mes.mesReferencia);
      
      const valorTotal = novosMeses.reduce((sum, m) => sum + m.valor, 0);
      
      return {
        ...prev,
        meses_antecipados: novosMeses.sort((a, b) => a.mesReferencia.localeCompare(b.mesReferencia)),
        valor_total_mensalidades: valorTotal
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.tipo_pagamento) {
      newErrors.tipo_pagamento = "Tipo de pagamento é obrigatório";
    }
    
    if (!formData.metodo_pagamento) {
      newErrors.metodo_pagamento = "Método de pagamento é obrigatório";
    }
    
    if (!formData.referencia) {
      newErrors.referencia = "Referência do pagamento é obrigatória";
    }

    if (formData.tipo_pagamento === "mensalidade_antecipada") {
      if (formData.meses_antecipados.length === 0) {
        newErrors.meses_antecipados = "Selecione pelo menos um mês";
      }
    } else if (formData.tipo_pagamento === "pagamento_projeto") {
      if (!formData.projeto_id) {
        newErrors.projeto_id = "Projeto é obrigatório";
      }
      if (!formData.valor_projeto || formData.valor_projeto <= 0) {
        newErrors.valor_projeto = "Valor do projeto é obrigatório";
      }
      if (!formData.tipo_pagamento_projeto) {
        newErrors.tipo_pagamento_projeto = "Tipo de pagamento do projeto é obrigatório";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (formData.tipo_pagamento === "mensalidade_antecipada") {
        // Criar um pagamento para cada mês selecionado
        const pagamentos = formData.meses_antecipados.map(mes => ({
          cooperado_id: cooperado.numero_associado,
          assinatura_plano_id: plano.id,
          valor: mes.valor,
          tipo: "mensalidade",
          data_vencimento: mes.vencimento,
          mes_referencia: mes.mesReferencia,
          data_pagamento: new Date().toISOString().split('T')[0],
          status: "pendente",
          metodo_pagamento: formData.metodo_pagamento,
          referencia: formData.referencia,
          comprovante_url: formData.comprovante_url,
          observacoes: `Pagamento antecipado - ${mes.descricao}. ${formData.observacoes}`
        }));
        
        onSubmit(pagamentos, "mensalidades");
      } else {
        // Pagamento de projeto
        const pagamentoProjeto = {
          cooperado_id: cooperado.numero_associado,
          projeto_id: formData.projeto_id,
          valor: Number(formData.valor_projeto),
          tipo: "pagamento_projeto",
          data_pagamento: new Date().toISOString().split('T')[0],
          status: "pendente",
          metodo_pagamento: formData.metodo_pagamento,
          referencia: formData.referencia,
          comprovante_url: formData.comprovante_url,
          observacoes: `Pagamento de projeto - ${formData.tipo_pagamento_projeto}. ${formData.observacoes}`
        };
        
        onSubmit([pagamentoProjeto], "projeto");
      }
      
      // Reset form
      setFormData({
        tipo_pagamento: "",
        metodo_pagamento: "",
        referencia: "",
        comprovante_url: "",
        observacoes: "",
        meses_antecipados: [],
        valor_total_mensalidades: 0,
        projeto_id: "",
        valor_projeto: "",
        tipo_pagamento_projeto: ""
      });
      setErrors({});
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const response = await UploadFile({ file });
      handleChange("comprovante_url", response.file_url);
    } catch (error) {
      console.error("Erro no upload:", error);
      setErrors(prev => ({ ...prev, comprovante: "Falha no upload do comprovante"}));
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const projetoSelecionado = projetos.find(p => p.id === formData.projeto_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Pagamento Antecipado
          </DialogTitle>
          <DialogDescription>
            Realize pagamentos antecipados de mensalidades ou projetos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Pagamento */}
          <div>
            <Label htmlFor="tipo_pagamento">Tipo de Pagamento *</Label>
            <Select value={formData.tipo_pagamento} onValueChange={(value) => handleChange("tipo_pagamento", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="O que deseja pagar?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensalidade_antecipada">Mensalidades Antecipadas</SelectItem>
                <SelectItem value="pagamento_projeto">Pagamento de Projeto</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo_pagamento && <p className="text-red-500 text-sm mt-1">{errors.tipo_pagamento}</p>}
          </div>

          {/* Seção para Mensalidades Antecipadas */}
          {formData.tipo_pagamento === "mensalidade_antecipada" && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Selecionar Meses para Pagamento Antecipado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {mesesDisponiveis.map((mes) => (
                    <div key={mes.mesReferencia} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                      <Checkbox
                        id={mes.mesReferencia}
                        checked={formData.meses_antecipados.some(m => m.mesReferencia === mes.mesReferencia)}
                        onCheckedChange={(checked) => handleMesToggle(mes, checked)}
                      />
                      <label htmlFor={mes.mesReferencia} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{mes.descricao}</span>
                          <span className="text-sm font-semibold">{mes.valor.toLocaleString()} Kz</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Vence em {format(new Date(mes.vencimento), "dd/MM/yyyy")}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {formData.meses_antecipados.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-800">
                        Total ({formData.meses_antecipados.length} meses):
                      </span>
                      <span className="text-xl font-bold text-green-800">
                        {formData.valor_total_mensalidades.toLocaleString()} Kz
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.meses_antecipados && <p className="text-red-500 text-sm">{errors.meses_antecipados}</p>}
              </CardContent>
            </Card>
          )}

          {/* Seção para Pagamento de Projeto */}
          {formData.tipo_pagamento === "pagamento_projeto" && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Pagamento de Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projeto_id">Projeto *</Label>
                  <Select value={formData.projeto_id} onValueChange={(value) => handleChange("projeto_id", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projetos.map(projeto => (
                        <SelectItem key={projeto.id} value={projeto.id}>
                          {projeto.nome} - {projeto.tipo} ({projeto.provincia})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projeto_id && <p className="text-red-500 text-sm mt-1">{errors.projeto_id}</p>}
                </div>

                {projetoSelecionado && (
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Preço Total do Projeto</p>
                        <p className="text-lg font-semibold">{projetoSelecionado.preco_final?.toLocaleString()} Kz</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Localização</p>
                        <p className="text-sm">{projetoSelecionado.provincia}, {projetoSelecionado.municipio}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="tipo_pagamento_projeto">Tipo de Pagamento *</Label>
                  <Select value={formData.tipo_pagamento_projeto} onValueChange={(value) => handleChange("tipo_pagamento_projeto", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tipo de pagamento do projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada/Sinal</SelectItem>
                      <SelectItem value="parcial">Pagamento Parcial</SelectItem>
                      <SelectItem value="total">Pagamento Total</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo_pagamento_projeto && <p className="text-red-500 text-sm mt-1">{errors.tipo_pagamento_projeto}</p>}
                </div>

                <div>
                  <Label htmlFor="valor_projeto">Valor a Pagar (Kz) *</Label>
                  <Input
                    id="valor_projeto"
                    type="number"
                    value={formData.valor_projeto}
                    onChange={(e) => handleChange("valor_projeto", e.target.value)}
                    className="mt-1"
                    placeholder="0"
                  />
                  {errors.valor_projeto && <p className="text-red-500 text-sm mt-1">{errors.valor_projeto}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dados do Pagamento */}
          {formData.tipo_pagamento && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados do Pagamento</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metodo_pagamento">Método de Pagamento *</Label>
                  <Select value={formData.metodo_pagamento} onValueChange={(value) => handleChange("metodo_pagamento", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Como efectuou o pagamento?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      <SelectItem value="deposito">Depósito Bancário</SelectItem>
                      <SelectItem value="multicaixa">Multicaixa</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro (Presencial)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.metodo_pagamento && <p className="text-red-500 text-sm mt-1">{errors.metodo_pagamento}</p>}
                </div>

                <div>
                  <Label htmlFor="referencia">Referência/Comprovativo *</Label>
                  <Input
                    id="referencia"
                    value={formData.referencia}
                    onChange={(e) => handleChange("referencia", e.target.value)}
                    className="mt-1"
                    placeholder="Número de referência, comprovativo ou recibo"
                  />
                  {errors.referencia && <p className="text-red-500 text-sm mt-1">{errors.referencia}</p>}
                </div>
              </div>

              {/* Upload de Comprovante */}
              <div>
                <Label>Comprovante de Pagamento (Opcional)</Label>
                <div className="mt-2">
                  {!formData.comprovante_url ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <div className="space-y-2">
                        <FileUp className="w-8 h-8 text-slate-400 mx-auto" />
                        <div>
                          <label htmlFor="comprovante" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-700 font-medium">
                              Clique para anexar comprovante
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
                        <p className="text-xs text-slate-500">PNG, JPG ou PDF até 5MB</p>
                      </div>
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
                          onClick={() => window.open(formData.comprovante_url, '_blank')}
                        >
                          Ver
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleChange("comprovante_url", "")}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="mt-2 flex items-center gap-2 text-blue-600">
                      <FileUp className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Enviando comprovante...</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleChange("observacoes", e.target.value)}
                  placeholder="Informações adicionais sobre o pagamento..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submeter Pagamento{formData.tipo_pagamento === "mensalidade_antecipada" && formData.meses_antecipados.length > 1 ? "s" : ""}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}