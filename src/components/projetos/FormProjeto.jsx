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
import { Separator } from "@/components/ui/separator";

// Lista de províncias de Angola
const provinciasAngola = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", 
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", 
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

// Lista de tipologias
const tipologias = [
  { value: "T0", label: "T0 - Estúdio" },
  { value: "T1", label: "T1 - 1 Quarto" },
  { value: "T2", label: "T2 - 2 Quartos" },
  { value: "T3", label: "T3 - 3 Quartos" },
  { value: "T4", label: "T4 - 4 Quartos" },
  { value: "T5", label: "T5 - 5+ Quartos" }
];

// Lista de status
const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "concluido", label: "Concluído" }
];

export default function FormProjeto({ projeto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    // Informações básicas - usar titulo em vez de nome
    titulo: projeto?.titulo || projeto?.nome || "",
    descricao: projeto?.descricao || "",
    
    // Tipologia e características
    tipologia: projeto?.tipologia || projeto?.tipo || "T0",
    area_util: projeto?.area_util || projeto?.area || "",
    num_quartos: projeto?.num_quartos || projeto?.quartos || "",
    num_banheiros: projeto?.num_banheiros || projeto?.banheiros || "",
    
    // Localização
    provincia: projeto?.provincia || "",
    municipio: projeto?.municipio || "",
    endereco_detalhado: projeto?.endereco_detalhado || projeto?.endereco || "",
    coordenadas_gps: projeto?.coordenadas_gps || projeto?.coordenadas || "",
    
    // Informações financeiras - usar valor_total em vez de preco_final
    valor_total: projeto?.valor_total || projeto?.preco_final || "",
    valor_entrada: projeto?.valor_entrada || "",
    numero_parcelas: projeto?.numero_parcelas || "",
    valor_parcela: projeto?.valor_parcela || "",
    
    // Cronograma - usar data_fim em vez de data_previsao_entrega
    data_inicio: projeto?.data_inicio || "",
    data_fim: projeto?.data_fim || projeto?.data_previsao_entrega || "",
    
    // Status
    status: projeto?.status || "ativo",
    
    // Galeria de imagens (array de URLs)
    galeria_imagens: projeto?.galeria_imagens || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.titulo.trim()) {
      alert("O título do projeto é obrigatório!");
      return;
    }
    
    if (!formData.provincia) {
      alert("A província é obrigatória!");
      return;
    }
    
    if (!formData.municipio) {
      alert("O município é obrigatório!");
      return;
    }

    onSave({
      ...formData,
      // Converter valores numéricos
      area_util: formData.area_util ? Number(formData.area_util) : 0,
      num_quartos: formData.num_quartos ? Number(formData.num_quartos) : 0,
      num_banheiros: formData.num_banheiros ? Number(formData.num_banheiros) : 0,
      valor_total: formData.valor_total ? Number(formData.valor_total) : 0,
      valor_entrada: formData.valor_entrada ? Number(formData.valor_entrada) : 0,
      numero_parcelas: formData.numero_parcelas ? Number(formData.numero_parcelas) : 0,
      valor_parcela: formData.valor_parcela ? Number(formData.valor_parcela) : 0
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    const imageUrl = prompt("Digite a URL da imagem:");
    if (imageUrl && imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        galeria_imagens: [...prev.galeria_imagens, imageUrl.trim()]
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galeria_imagens: prev.galeria_imagens.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título do Projeto *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Ex: Residencial CoopHabitat Luanda"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição Detalhada</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descrição completa do projeto, características, benefícios..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipologia e Características */}
      <Card>
        <CardHeader>
          <CardTitle>Tipologia e Características</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tipologia">Tipologia *</Label>
              <Select value={formData.tipologia} onValueChange={(value) => handleChange("tipologia", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a tipologia" />
                </SelectTrigger>
                <SelectContent>
                  {tipologias.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="area_util">Área Útil (m²)</Label>
              <Input
                id="area_util"
                type="number"
                min="0"
                step="0.01"
                value={formData.area_util}
                onChange={(e) => handleChange("area_util", e.target.value)}
                placeholder="120.50"
              />
            </div>
            
            <div>
              <Label htmlFor="num_quartos">Número de Quartos</Label>
              <Input
                id="num_quartos"
                type="number"
                min="0"
                value={formData.num_quartos}
                onChange={(e) => handleChange("num_quartos", e.target.value)}
                placeholder="3"
              />
            </div>
            
            <div>
              <Label htmlFor="num_banheiros">Número de Banheiros</Label>
              <Input
                id="num_banheiros"
                type="number"
                min="0"
                value={formData.num_banheiros}
                onChange={(e) => handleChange("num_banheiros", e.target.value)}
                placeholder="2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localização */}
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
                  <SelectValue placeholder="Selecione a província" />
                </SelectTrigger>
                <SelectContent>
                  {provinciasAngola.map(provincia => (
                    <SelectItem key={provincia} value={provincia}>
                      {provincia}
                    </SelectItem>
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
                placeholder="Ex: Luanda, Viana, Talatona..."
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
              placeholder="Endereço completo do projeto..."
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="coordenadas_gps">Coordenadas GPS</Label>
            <Input
              id="coordenadas_gps"
              value={formData.coordenadas_gps}
              onChange={(e) => handleChange("coordenadas_gps", e.target.value)}
              placeholder="Ex: -8.8383, 13.2344"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações Financeiras */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="valor_total">Valor Total (Kz) *</Label>
              <Input
                id="valor_total"
                type="number"
                min="0"
                step="0.01"
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
                min="0"
                step="0.01"
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
                min="0"
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
                min="0"
                step="0.01"
                value={formData.valor_parcela}
                onChange={(e) => handleChange("valor_parcela", e.target.value)}
                placeholder="333333"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cronograma */}
      <Card>
        <CardHeader>
          <CardTitle>Cronograma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Galeria de Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Galeria de Imagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddImage}
              className="flex-shrink-0"
            >
              + Adicionar Imagem
            </Button>
            <span className="text-sm text-slate-500">
              {formData.galeria_imagens.length} imagem(s) adicionada(s)
            </span>
          </div>
          
          {formData.galeria_imagens.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.galeria_imagens.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={imageUrl} 
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-32 bg-slate-200 rounded-lg border flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-slate-500 text-sm">Imagem não carregada</span>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </Button>
                  <p className="text-xs text-slate-600 mt-1 truncate">{imageUrl}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Botões de Ação */}
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