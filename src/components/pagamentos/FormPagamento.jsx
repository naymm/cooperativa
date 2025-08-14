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
import { FileUp, CheckCircle } from "lucide-react";
import { UploadFile } from "@/api/integrations";
import { Projeto } from "@/api/entities";

export default function FormPagamento({ pagamento, cooperados, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    cooperado_id: pagamento?.cooperado_id || "",
    valor: pagamento?.valor || "",
    data_pagamento: pagamento?.data_pagamento || "",
    data_vencimento: pagamento?.data_vencimento || "",
    metodo_pagamento: pagamento?.metodo_pagamento || "",
    tipo: pagamento?.tipo || "mensalidade",
    projeto_id: pagamento?.projeto_id || "",
    referencia: pagamento?.referencia || "",
    comprovante_url: pagamento?.comprovante_url || "",
    observacoes: pagamento?.observacoes || ""
  });

  const [projetos, setProjetos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.tipo === "pagamento_projeto") {
      loadProjetos();
    }
  }, [formData.tipo]);

  const loadProjetos = async () => {
    try {
      const projetosData = await Projeto.list();
      setProjetos(projetosData);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.cooperado_id) newErrors.cooperado_id = "Cooperado é obrigatório";
    if (!formData.valor) newErrors.valor = "Valor é obrigatório";
    if (!formData.data_vencimento) newErrors.data_vencimento = "Data de vencimento é obrigatória";
    if (!formData.metodo_pagamento) newErrors.metodo_pagamento = "Método de pagamento é obrigatório";
    if (formData.tipo === "pagamento_projeto" && !formData.projeto_id) {
      newErrors.projeto_id = "Projeto é obrigatório para pagamento de projeto";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        valor: formData.valor ? Number(formData.valor) : 0
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cooperado_id">Cooperado *</Label>
          <Select value={formData.cooperado_id} onValueChange={(value) => handleChange("cooperado_id", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecionar cooperado" />
            </SelectTrigger>
            <SelectContent>
              {cooperados.map(cooperado => (
                <SelectItem key={cooperado.numero_associado} value={cooperado.numero_associado}>
                  {cooperado.nome_completo} (#{cooperado.numero_associado})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cooperado_id && <p className="text-red-500 text-sm mt-1">{errors.cooperado_id}</p>}
        </div>
        
        <div>
          <Label htmlFor="valor">Valor (Kz) *</Label>
          <Input
            id="valor"
            type="number"
            value={formData.valor}
            onChange={(e) => handleChange("valor", e.target.value)}
            className="mt-1"
            placeholder="25000"
          />
          {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data_pagamento">Data do Pagamento</Label>
          <Input
            id="data_pagamento"
            type="date"
            value={formData.data_pagamento}
            onChange={(e) => handleChange("data_pagamento", e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
          <Input
            id="data_vencimento"
            type="date"
            value={formData.data_vencimento}
            onChange={(e) => handleChange("data_vencimento", e.target.value)}
            className="mt-1"
          />
          {errors.data_vencimento && <p className="text-red-500 text-sm mt-1">{errors.data_vencimento}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="metodo_pagamento">Método de Pagamento *</Label>
          <Select value={formData.metodo_pagamento} onValueChange={(value) => handleChange("metodo_pagamento", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transferencia">Transferência Bancária</SelectItem>
              <SelectItem value="deposito">Depósito Bancário</SelectItem>
              <SelectItem value="multicaixa">Multicaixa</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
            </SelectContent>
          </Select>
          {errors.metodo_pagamento && <p className="text-red-500 text-sm mt-1">{errors.metodo_pagamento}</p>}
        </div>
        
        <div>
          <Label htmlFor="tipo">Tipo de Pagamento *</Label>
          <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensalidade">Mensalidade</SelectItem>
              <SelectItem value="taxa_inscricao">Taxa de Inscrição</SelectItem>
              <SelectItem value="pagamento_projeto">Pagamento de Projeto</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campo condicional para projeto */}
      {formData.tipo === "pagamento_projeto" && (
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
      )}

      <div>
        <Label htmlFor="referencia">Referência/Número do Comprovante</Label>
        <Input
          id="referencia"
          value={formData.referencia}
          onChange={(e) => handleChange("referencia", e.target.value)}
          className="mt-1"
          placeholder="Número de referência ou comprovante"
        />
      </div>

      {/* Upload de Comprovante */}
      <div>
        <Label>Comprovante de Pagamento</Label>
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
          placeholder="Observações adicionais sobre o pagamento..."
          rows={3}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {pagamento ? "Atualizar" : "Registrar"} Pagamento
        </Button>
      </div>
    </form>
  );
}