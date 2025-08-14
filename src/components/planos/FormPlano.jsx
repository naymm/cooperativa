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
    nome_plano: plano?.nome_plano || "",
    valor_mensal: plano?.valor_mensal || "",
    taxa_inscricao: plano?.taxa_inscricao || "",
    descricao: plano?.descricao || "",
    dia_vencimento_fixo: plano?.dia_vencimento_fixo || 15,
    ativo: plano?.ativo !== undefined ? plano.ativo : true
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.nome_plano) newErrors.nome_plano = "Nome é obrigatório";
    if (!formData.valor_mensal || formData.valor_mensal <= 0) newErrors.valor_mensal = "Valor mensal inválido";
    if (formData.taxa_inscricao === "" || formData.taxa_inscricao < 0) newErrors.taxa_inscricao = "Taxa de inscrição inválida";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        valor_mensal: Number(formData.valor_mensal),
        taxa_inscricao: Number(formData.taxa_inscricao),
        dia_vencimento_fixo: Number(formData.dia_vencimento_fixo)
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
          <Label htmlFor="nome_plano">Nome do Plano *</Label>
          <Input
            id="nome_plano"
            value={formData.nome_plano}
            onChange={(e) => handleChange("nome_plano", e.target.value)}
            placeholder="Ex: Plano Básico"
            className="mt-1"
          />
          {errors.nome_plano && <p className="text-red-500 text-sm mt-1">{errors.nome_plano}</p>}
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
          <Label htmlFor="dia_vencimento">Dia de Vencimento</Label>
          <Select
            value={formData.dia_vencimento_fixo.toString()}
            onValueChange={(value) => handleChange("dia_vencimento_fixo", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <SelectItem key={day} value={day.toString()}>
                  Dia {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          id="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => handleChange("ativo", checked)}
        />
        <Label htmlFor="ativo">Plano ativo</Label>
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