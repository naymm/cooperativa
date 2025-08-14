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
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Cooperado } from "@/api/entities";

export default function FormEdicaoPerfil({ cooperado, open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    data_nascimento: "",
    bi: "",
    validade_documento_bi: "",
    nacionalidade: "",
    estado_civil: "",
    nome_conjuge: "",
    tem_filhos: false,
    numero_filhos: 0,
    provincia: "",
    municipio: "",
    comuna: "",
    endereco_completo: "",
    profissao: "",
    renda_mensal: "",
    sector_profissional: "",
    entidade_publica: "",
    entidade_privada: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Preencher formulário com dados do cooperado
  useEffect(() => {
    if (cooperado) {
      console.log("Preenchendo formulário com dados do cooperado:", cooperado);
      console.log("Estado civil do cooperado:", cooperado.estado_civil);
      
      setFormData({
        nome_completo: cooperado.nome_completo || "",
        email: cooperado.email || "",
        telefone: cooperado.telefone || "",
        data_nascimento: cooperado.data_nascimento ? cooperado.data_nascimento.split('T')[0] : "",
        bi: cooperado.bi || "",
        validade_documento_bi: cooperado.validade_documento_bi ? cooperado.validade_documento_bi.split('T')[0] : "",
        nacionalidade: cooperado.nacionalidade || "",
        estado_civil: cooperado.estado_civil || "",
        nome_conjuge: cooperado.nome_conjuge || "",
        tem_filhos: cooperado.tem_filhos || false,
        numero_filhos: cooperado.numero_filhos || 0,
        provincia: cooperado.provincia || "",
        municipio: cooperado.municipio || "",
        comuna: cooperado.comuna || "",
        endereco_completo: cooperado.endereco_completo || "",
        profissao: cooperado.profissao || "",
        renda_mensal: cooperado.renda_mensal ? cooperado.renda_mensal.toString() : "",
        sector_profissional: cooperado.sector_profissional || "",
        entidade_publica: cooperado.entidade_publica || "",
        entidade_privada: cooperado.entidade_privada || ""
      });
    }
  }, [cooperado]);

  const handleChange = (field, value) => {
    console.log(`handleChange - Campo: ${field}, Valor: ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    console.log("Iniciando validação do formulário");
    const newErrors = {};

    if (!formData.nome_completo.trim()) {
      newErrors.nome_completo = "Nome completo é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (!formData.data_nascimento) {
      newErrors.data_nascimento = "Data de nascimento é obrigatória";
    }

    if (!formData.bi.trim()) {
      newErrors.bi = "BI é obrigatório";
    }

    if (!formData.validade_documento_bi) {
      newErrors.validade_documento_bi = "Validade do BI é obrigatória";
    }

    if (!formData.nacionalidade.trim()) {
      newErrors.nacionalidade = "Nacionalidade é obrigatória";
    }

    console.log("Validando estado civil:", formData.estado_civil);
    if (!formData.estado_civil) {
      newErrors.estado_civil = "Estado civil é obrigatório";
      console.log("Erro: Estado civil é obrigatório");
    }

    if (formData.estado_civil === "casado" && !formData.nome_conjuge.trim()) {
      newErrors.nome_conjuge = "Nome do cônjuge é obrigatório para casados";
    }

    if (formData.tem_filhos && (!formData.numero_filhos || formData.numero_filhos < 1)) {
      newErrors.numero_filhos = "Número de filhos é obrigatório";
    }

    if (!formData.provincia.trim()) {
      newErrors.provincia = "Província é obrigatória";
    }

    if (!formData.municipio.trim()) {
      newErrors.municipio = "Município é obrigatório";
    }

    if (!formData.endereco_completo.trim()) {
      newErrors.endereco_completo = "Endereço completo é obrigatório";
    }

    if (!formData.profissao.trim()) {
      newErrors.profissao = "Profissão é obrigatória";
    }

    if (!formData.renda_mensal.trim()) {
      newErrors.renda_mensal = "Renda mensal é obrigatória";
    } else if (isNaN(formData.renda_mensal) || parseFloat(formData.renda_mensal) < 0) {
      newErrors.renda_mensal = "Renda mensal deve ser um valor válido";
    }

    if (!formData.sector_profissional) {
      newErrors.sector_profissional = "Sector profissional é obrigatório";
    }

    if (formData.sector_profissional === "publico" && !formData.entidade_publica.trim()) {
      newErrors.entidade_publica = "Entidade pública é obrigatória";
    }

    if (formData.sector_profissional === "privado" && !formData.entidade_privada.trim()) {
      newErrors.entidade_privada = "Entidade privada é obrigatória";
    }

    console.log("Erros encontrados:", newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("Formulário é válido:", isValid);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Formulário submetido");
    console.log("Dados do formulário:", formData);
    console.log("Estado civil no formData:", formData.estado_civil);
    console.log("Cooperado recebido:", cooperado);
    
    // Teste simples primeiro
    if (!cooperado || !cooperado.id) {
      console.error("Cooperado ou ID não encontrado");
      toast.error("Erro: Dados do cooperado não encontrados");
      return;
    }
    
    if (!validateForm()) {
      console.log("Validação falhou");
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    console.log("Validação passou, preparando dados...");
    setLoading(true);
    
    try {
      const dataToUpdate = {
        ...formData,
        renda_mensal: parseFloat(formData.renda_mensal),
        numero_filhos: formData.tem_filhos ? parseInt(formData.numero_filhos) : 0
      };

      console.log("Dados para atualizar:", dataToUpdate);
      console.log("ID do cooperado:", cooperado.id);

      // Enviar todos os dados do formulário
      const result = await Cooperado.update(cooperado.id, dataToUpdate);
      console.log("Resultado da atualização:", result);
      
      toast.success("Perfil atualizado com sucesso!");
      onSave && onSave(dataToUpdate);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      console.error("Detalhes do erro:", error.message);
      console.error("Stack trace:", error.stack);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações pessoais. Os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form 
          onSubmit={(e) => {
            console.log("Form onSubmit chamado");
            handleSubmit(e);
          }} 
          className="space-y-6"
        >
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  value={formData.nome_completo}
                  onChange={(e) => handleChange("nome_completo", e.target.value)}
                  className={errors.nome_completo ? "border-red-500" : ""}
                />
                {errors.nome_completo && <p className="text-red-500 text-sm">{errors.nome_completo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  className={errors.telefone ? "border-red-500" : ""}
                />
                {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => handleChange("data_nascimento", e.target.value)}
                  className={errors.data_nascimento ? "border-red-500" : ""}
                />
                {errors.data_nascimento && <p className="text-red-500 text-sm">{errors.data_nascimento}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bi">BI *</Label>
                <Input
                  id="bi"
                  value={formData.bi}
                  onChange={(e) => handleChange("bi", e.target.value)}
                  className={errors.bi ? "border-red-500" : ""}
                />
                {errors.bi && <p className="text-red-500 text-sm">{errors.bi}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="validade_documento_bi">Validade do BI *</Label>
                <Input
                  id="validade_documento_bi"
                  type="date"
                  value={formData.validade_documento_bi}
                  onChange={(e) => handleChange("validade_documento_bi", e.target.value)}
                  className={errors.validade_documento_bi ? "border-red-500" : ""}
                />
                {errors.validade_documento_bi && <p className="text-red-500 text-sm">{errors.validade_documento_bi}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                <Input
                  id="nacionalidade"
                  value={formData.nacionalidade}
                  onChange={(e) => handleChange("nacionalidade", e.target.value)}
                  className={errors.nacionalidade ? "border-red-500" : ""}
                />
                {errors.nacionalidade && <p className="text-red-500 text-sm">{errors.nacionalidade}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado_civil">Estado Civil *</Label>
                <Select value={formData.estado_civil} onValueChange={(value) => handleChange("estado_civil", value)}>
                  <SelectTrigger className={errors.estado_civil ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro</SelectItem>
                    <SelectItem value="casado">Casado</SelectItem>
                    <SelectItem value="divorciado">Divorciado</SelectItem>
                    <SelectItem value="viuvo">Viúvo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.estado_civil && <p className="text-red-500 text-sm">{errors.estado_civil}</p>}
              </div>

              {formData.estado_civil === "casado" && (
                <div className="space-y-2">
                  <Label htmlFor="nome_conjuge">Nome do Cônjuge *</Label>
                  <Input
                    id="nome_conjuge"
                    value={formData.nome_conjuge}
                    onChange={(e) => handleChange("nome_conjuge", e.target.value)}
                    className={errors.nome_conjuge ? "border-red-500" : ""}
                  />
                  {errors.nome_conjuge && <p className="text-red-500 text-sm">{errors.nome_conjuge}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tem_filhos">Tem Filhos?</Label>
                <Select value={formData.tem_filhos.toString()} onValueChange={(value) => handleChange("tem_filhos", value === "true")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tem_filhos && (
                <div className="space-y-2">
                  <Label htmlFor="numero_filhos">Número de Filhos *</Label>
                  <Input
                    id="numero_filhos"
                    type="number"
                    min="1"
                    value={formData.numero_filhos}
                    onChange={(e) => handleChange("numero_filhos", parseInt(e.target.value) || 0)}
                    className={errors.numero_filhos ? "border-red-500" : ""}
                  />
                  {errors.numero_filhos && <p className="text-red-500 text-sm">{errors.numero_filhos}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Morada */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">Morada</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provincia">Província *</Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => handleChange("provincia", e.target.value)}
                  className={errors.provincia ? "border-red-500" : ""}
                />
                {errors.provincia && <p className="text-red-500 text-sm">{errors.provincia}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipio">Município *</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => handleChange("municipio", e.target.value)}
                  className={errors.municipio ? "border-red-500" : ""}
                />
                {errors.municipio && <p className="text-red-500 text-sm">{errors.municipio}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comuna">Comuna</Label>
                <Input
                  id="comuna"
                  value={formData.comuna}
                  onChange={(e) => handleChange("comuna", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco_completo">Endereço Completo *</Label>
                <Textarea
                  id="endereco_completo"
                  value={formData.endereco_completo}
                  onChange={(e) => handleChange("endereco_completo", e.target.value)}
                  className={errors.endereco_completo ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.endereco_completo && <p className="text-red-500 text-sm">{errors.endereco_completo}</p>}
              </div>
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">Dados Profissionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão *</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => handleChange("profissao", e.target.value)}
                  className={errors.profissao ? "border-red-500" : ""}
                />
                {errors.profissao && <p className="text-red-500 text-sm">{errors.profissao}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="renda_mensal">Renda Mensal (Kz) *</Label>
                <Input
                  id="renda_mensal"
                  type="number"
                  min="0"
                  value={formData.renda_mensal}
                  onChange={(e) => handleChange("renda_mensal", e.target.value)}
                  className={errors.renda_mensal ? "border-red-500" : ""}
                />
                {errors.renda_mensal && <p className="text-red-500 text-sm">{errors.renda_mensal}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector_profissional">Sector Profissional *</Label>
                <Select value={formData.sector_profissional} onValueChange={(value) => handleChange("sector_profissional", value)}>
                  <SelectTrigger className={errors.sector_profissional ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publico">Público</SelectItem>
                    <SelectItem value="privado">Privado</SelectItem>
                    <SelectItem value="autonomo">Autónomo</SelectItem>
                    <SelectItem value="desempregado">Desempregado</SelectItem>
                    <SelectItem value="estudante">Estudante</SelectItem>
                    <SelectItem value="reformado">Reformado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sector_profissional && <p className="text-red-500 text-sm">{errors.sector_profissional}</p>}
              </div>

              {formData.sector_profissional === "publico" && (
                <div className="space-y-2">
                  <Label htmlFor="entidade_publica">Entidade Pública *</Label>
                  <Input
                    id="entidade_publica"
                    value={formData.entidade_publica}
                    onChange={(e) => handleChange("entidade_publica", e.target.value)}
                    className={errors.entidade_publica ? "border-red-500" : ""}
                  />
                  {errors.entidade_publica && <p className="text-red-500 text-sm">{errors.entidade_publica}</p>}
                </div>
              )}

              {formData.sector_profissional === "privado" && (
                <div className="space-y-2">
                  <Label htmlFor="entidade_privada">Entidade Privada *</Label>
                  <Input
                    id="entidade_privada"
                    value={formData.entidade_privada}
                    onChange={(e) => handleChange("entidade_privada", e.target.value)}
                    className={errors.entidade_privada ? "border-red-500" : ""}
                  />
                  {errors.entidade_privada && <p className="text-red-500 text-sm">{errors.entidade_privada}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              onClick={(e) => {
                console.log("Botão clicado");
                // Não chamar e.preventDefault() aqui, deixar o form onSubmit lidar
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 