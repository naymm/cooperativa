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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormProjeto({ projeto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: projeto?.titulo || "",
    descricao: projeto?.descricao || "",
    valor_total: projeto?.valor_total || "",
    valor_entrada: projeto?.valor_entrada || "",
    numero_parcelas: projeto?.numero_parcelas || "",
    valor_parcela: projeto?.valor_parcela || "",
    data_inicio: projeto?.data_inicio || "",
    data_fim: projeto?.data_fim || "",
    status: projeto?.status || "ativo",
    cooperados_interessados: projeto?.cooperados_interessados || "[]"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      valor_total: formData.valor_total ? Number(formData.valor_total) : null,
      valor_entrada: formData.valor_entrada ? Number(formData.valor_entrada) : null,
      numero_parcelas: formData.numero_parcelas ? Number(formData.numero_parcelas) : null,
      valor_parcela: formData.valor_parcela ? Number(formData.valor_parcela) : null
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="titulo">Título do Projeto *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              placeholder="Ex: Construção de Habitação Social"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Descrição detalhada do projeto..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="valor_total">Valor Total (Kz) *</Label>
            <Input
              id="valor_total"
              type="number"
              value={formData.valor_total}
              onChange={(e) => handleChange("valor_total", e.target.value)}
              placeholder="5000000"
              required
            />
          </div>
          <div>
            <Label htmlFor="valor_entrada">Valor de Entrada (Kz)</Label>
            <Input
              id="valor_entrada"
              type="number"
              value={formData.valor_entrada}
              onChange={(e) => handleChange("valor_entrada", e.target.value)}
              placeholder="1000000"
            />
          </div>
          <div>
            <Label htmlFor="numero_parcelas">Número de Parcelas</Label>
            <Input
              id="numero_parcelas"
              type="number"
              value={formData.numero_parcelas}
              onChange={(e) => handleChange("numero_parcelas", e.target.value)}
              placeholder="12"
            />
          </div>
          <div>
            <Label htmlFor="valor_parcela">Valor da Parcela (Kz)</Label>
            <Input
              id="valor_parcela"
              type="number"
              value={formData.valor_parcela}
              onChange={(e) => handleChange("valor_parcela", e.target.value)}
              placeholder="333333"
            />
          </div>
          <div>
            <Label htmlFor="data_inicio">Data de Início</Label>
            <Input
              id="data_inicio"
              type="date"
              value={formData.data_inicio}
              onChange={(e) => handleChange("data_inicio", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="data_fim">Data de Fim</Label>
            <Input
              id="data_fim"
              type="date"
              value={formData.data_fim}
              onChange={(e) => handleChange("data_fim", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {projeto ? "Atualizar" : "Criar"} Projeto
        </Button>
      </div>
    </form>
  );
}