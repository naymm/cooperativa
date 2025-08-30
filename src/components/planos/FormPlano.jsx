import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";

export default function FormPlano({ plano, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: plano?.nome || "",
    valor_mensal: plano?.valor_mensal || "",
    taxa_inscricao: plano?.taxa_inscricao || "",
    descricao: plano?.descricao || "",
    beneficios: plano?.beneficios || "[]",
    status: plano?.status || "ativo"
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.nome) newErrors.nome = "Nome é obrigatório";
    if (!formData.valor_mensal || formData.valor_mensal <= 0) newErrors.valor_mensal = "Valor mensal inválido";
    if (formData.taxa_inscricao === "" || formData.taxa_inscricao < 0) newErrors.taxa_inscricao = "Taxa de inscrição inválida";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        valor_mensal: Number(formData.valor_mensal),
        taxa_inscricao: Number(formData.taxa_inscricao),
        beneficios: typeof formData.beneficios === 'string' ? formData.beneficios : JSON.stringify(formData.beneficios)
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Plano *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Ex: Plano Básico"
            className="mt-1"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <Label htmlFor="valor_mensal">Valor Mensal (Kz) *</Label>
          <Input
            id="valor_mensal"
            type="number"
            min="0"
            step="1000"
            value={formData.valor_mensal}
            onChange={(e) => handleChange("valor_mensal", e.target.value)}
            placeholder="25000"
            className="mt-1"
          />
          {errors.valor_mensal && <p className="text-red-500 text-sm mt-1">{errors.valor_mensal}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxa_inscricao">Taxa de Inscrição (Kz) *</Label>
          <Input
            id="taxa_inscricao"
            type="number"
            min="0"
            step="1000"
            value={formData.taxa_inscricao}
            onChange={(e) => handleChange("taxa_inscricao", e.target.value)}
            placeholder="10000"
            className="mt-1"
          />
          {errors.taxa_inscricao && <p className="text-red-500 text-sm mt-1">{errors.taxa_inscricao}</p>}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="beneficios">Benefícios (JSON)</Label>
        <Input
          id="beneficios"
          value={formData.beneficios}
          onChange={(e) => handleChange("beneficios", e.target.value)}
          placeholder='["Benefício 1", "Benefício 2"]'
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => handleChange("descricao", e.target.value)}
          placeholder="Descrição detalhada do plano..."
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status === 'ativo'}
          onCheckedChange={(checked) => handleChange("status", checked ? 'ativo' : 'inativo')}
        />
        <Label htmlFor="status">Plano ativo</Label>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {plano ? "Atualizar" : "Criar"} Plano
        </Button>
      </div>
    </form>
  );
}