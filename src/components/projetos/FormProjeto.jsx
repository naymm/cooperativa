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

const provincias = [
  "Luanda", "Benguela", "Huíla", "Huambo", "Bié", "Cunene", "Cuando Cubango",
  "Cabinda", "Zaire", "Uíge", "Malanje", "Lunda Norte", "Lunda Sul", 
  "Moxico", "Namibe", "Kuanza Norte", "Kuanza Sul", "Bengo"
];

export default function FormProjeto({ projeto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: projeto?.nome || "",
    tipo: projeto?.tipo || "",
    area_util: projeto?.area_util || "",
    num_quartos: projeto?.num_quartos || "",
    num_banheiros: projeto?.num_banheiros || "",
    preco_final: projeto?.preco_final || "",
    provincia: projeto?.provincia || "",
    municipio: projeto?.municipio || "",
    coordenadas_gps: projeto?.coordenadas_gps || "",
    endereco_detalhado: projeto?.endereco_detalhado || "",
    status: projeto?.status || "planejamento",
    descricao: projeto?.descricao || "",
    data_inicio: projeto?.data_inicio || "",
    data_previsao_entrega: projeto?.data_previsao_entrega || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      area_util: formData.area_util ? Number(formData.area_util) : null,
      num_quartos: formData.num_quartos ? Number(formData.num_quartos) : null,
      num_banheiros: formData.num_banheiros ? Number(formData.num_banheiros) : null,
      preco_final: formData.preco_final ? Number(formData.preco_final) : null
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
            <Label htmlFor="nome">Nome do Projeto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={formData.tipo} onValueChange={(value) => handleChange("tipo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T0">T0</SelectItem>
                <SelectItem value="T1">T1</SelectItem>
                <SelectItem value="T2">T2</SelectItem>
                <SelectItem value="T3">T3</SelectItem>
                <SelectItem value="T4">T4</SelectItem>
                <SelectItem value="T5">T5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="area_util">Área Útil (m²) *</Label>
            <Input
              id="area_util"
              type="number"
              value={formData.area_util}
              onChange={(e) => handleChange("area_util", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="num_quartos">Número de Quartos</Label>
            <Input
              id="num_quartos"
              type="number"
              value={formData.num_quartos}
              onChange={(e) => handleChange("num_quartos", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="num_banheiros">Número de Banheiros</Label>
            <Input
              id="num_banheiros"
              type="number"
              value={formData.num_banheiros}
              onChange={(e) => handleChange("num_banheiros", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="preco_final">Preço Final (Kz) *</Label>
            <Input
              id="preco_final"
              type="number"
              value={formData.preco_final}
              onChange={(e) => handleChange("preco_final", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planejamento">Planejamento</SelectItem>
                <SelectItem value="construcao">Construção</SelectItem>
                <SelectItem value="pronto">Pronto</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provincia">Província *</Label>
              <Select value={formData.provincia} onValueChange={(value) => handleChange("provincia", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar província" />
                </SelectTrigger>
                <SelectContent>
                  {provincias.map(provincia => (
                    <SelectItem key={provincia} value={provincia}>{provincia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="municipio">Município *</Label>
              <Input
                id="municipio"
                value={formData.municipio}
                onChange={(e) => handleChange("municipio", e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="endereco_detalhado">Endereço Detalhado</Label>
            <Textarea
              id="endereco_detalhado"
              value={formData.endereco_detalhado}
              onChange={(e) => handleChange("endereco_detalhado", e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="coordenadas_gps">Coordenadas GPS</Label>
            <Input
              id="coordenadas_gps"
              value={formData.coordenadas_gps}
              onChange={(e) => handleChange("coordenadas_gps", e.target.value)}
              placeholder="Ex: -8.9876, 13.2054"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cronograma</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
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
            <Label htmlFor="data_previsao_entrega">Previsão de Entrega</Label>
            <Input
              id="data_previsao_entrega"
              type="date"
              value={formData.data_previsao_entrega}
              onChange={(e) => handleChange("data_previsao_entrega", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            placeholder="Descrição detalhada do projeto..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-6 border-t">
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