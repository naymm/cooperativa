
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, FileUp, CheckCircle, ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
import { Cooperado, AssinaturaPlano } from "@/api/entities";
import { UploadFile } from "@/api/integrations";

const provinciasAngola = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", 
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", 
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

const entidadesPublicasAngola = [
  "Ministério da Educação", "Ministério da Saúde", "Polícia Nacional", 
  "Forças Armadas Angolanas", "Sonangol", "Endiama", "Outra"
];

const steps = [
  { id: 1, title: "Dados Pessoais" },
  { id: 2, title: "Contacto e Morada" },
  { id: 3, title: "Dados Profissionais" },
  { id: 4, title: "Documentos (Anexos)" },
  { id: 5, title: "Pagamento e Assinatura" },
];

// Função para gerar número de associado
const gerarNumeroAssociado = () => {
  const numeroAleatorio = Math.floor(1000 + Math.random() * 9000); // Gera número de 1000 a 9999
  return `CS${numeroAleatorio}`;
};

// Função para gerar senha temporária
const gerarSenhaTemporaria = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let senha = '';
  for (let i = 0; i < 8; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
};

export default function FormCooperado({ cooperado, onSave, onCancel, assinaturaPlanos }) {
  const [currentStep, setCurrentStep] = useState(1);
  const isNew = !cooperado;
  const [formData, setFormData] = useState({
    nome_completo: cooperado?.nome_completo || "",
    data_nascimento: cooperado?.data_nascimento || "",
    estado_civil: cooperado?.estado_civil || "",
    nome_conjuge: cooperado?.nome_conjuge || "",
    tem_filhos: cooperado?.tem_filhos || false,
    numero_filhos: cooperado?.numero_filhos || 0,
    nacionalidade: cooperado?.nacionalidade || "Angolana",
    bi: cooperado?.bi || "",
    validade_documento_bi: cooperado?.validade_documento_bi || "",
    email: cooperado?.email || "",
    telefone: cooperado?.telefone || "",
    provincia: cooperado?.provincia || "",
    municipio: cooperado?.municipio || "",
    comuna: cooperado?.comuna || "",
    endereco_completo: cooperado?.endereco_completo || "",
    profissao: cooperado?.profissao || "",
    sector_profissional: cooperado?.sector_profissional || "",
    entidade_publica: cooperado?.entidade_publica || "",
    entidade_privada: cooperado?.entidade_privada || "",
    renda_mensal: cooperado?.renda_mensal || "", // Added renda_mensal
    documentos_anexados: cooperado?.documentos_anexados || {
      foto_passe: null,
      bi_frente_verso: null,
      bi_conjuge: null,
      agregado_familiar_doc: null,
      declaracao_servico: null,
      nif_documento: null
    },
    assinatura_plano_id: cooperado?.assinatura_plano_id || "",
    taxa_inscricao_selecionada: "",
    observacoes: cooperado?.observacoes || "",
    // Novos campos para credenciais
    numero_associado: cooperado?.numero_associado || "", // Initialize with existing or empty
    senha_temporaria: "",
    mostrar_credenciais: false
  });

  const [errors, setErrors] = useState({});
  const [biExistsError, setBiExistsError] = useState("");
  const [fileUploading, setFileUploading] = useState({});

  useEffect(() => {
    if (formData.assinatura_plano_id && assinaturaPlanos) {
      const planoSelecionado = assinaturaPlanos.find(p => p.id === formData.assinatura_plano_id);
      if (planoSelecionado) {
        handleChange("taxa_inscricao_selecionada", planoSelecionado.taxa_inscricao);
      }
    }
  }, [formData.assinatura_plano_id, assinaturaPlanos]);

  // Gerar credenciais quando chegar ao último passo (apenas para novos cooperados)
  useEffect(() => {
    if (currentStep === 5 && !cooperado) { // Only for new cooperados
      if (!formData.senha_temporaria) {
        const senhaTemp = gerarSenhaTemporaria();
        handleChange("senha_temporaria", senhaTemp);
      }
      if (!formData.numero_associado) {
        const numAssociado = gerarNumeroAssociado();
        handleChange("numero_associado", numAssociado);
      }
      handleChange("mostrar_credenciais", true);
    } else if (currentStep !== 5) {
      // Reset creds display if not on final step or if it's an existing cooperado
      handleChange("mostrar_credenciais", false);
    }
  }, [currentStep, cooperado, formData.senha_temporaria, formData.numero_associado]);

  const validateStep = () => {
    // Temporariamente desativar validações obrigatórias ao adicionar novo cooperado
    if (isNew) {
      setErrors({});
      return true;
    }
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.nome_completo) newErrors.nome_completo = "Nome é obrigatório.";
      if (!formData.data_nascimento) newErrors.data_nascimento = "Data de nascimento é obrigatória.";
      if (!formData.estado_civil) newErrors.estado_civil = "Estado civil é obrigatório.";
      if (formData.estado_civil === "casado" && !formData.nome_conjuge) {
        newErrors.nome_conjuge = "Nome do cônjuge é obrigatório.";
      }
      if (formData.tem_filhos && (!formData.numero_filhos || formData.numero_filhos <= 0)) {
        newErrors.numero_filhos = "Número de filhos inválido.";
      }
      if (!formData.nacionalidade) newErrors.nacionalidade = "Nacionalidade é obrigatória.";
      if (!formData.bi) {
        newErrors.bi = "Nº do BI é obrigatório.";
      } else {
        const biPattern = /^\d{9}[A-Z]{2}\d{3}$/;
        if (!biPattern.test(formData.bi.toUpperCase())) {
          newErrors.bi = "Formato do BI inválido (ex: 000000000AA000).";
        }
      }
      if (!formData.validade_documento_bi) newErrors.validade_documento_bi = "Validade do BI é obrigatória.";
    }
    
    if (currentStep === 2) {
      if (!formData.telefone) newErrors.telefone = "Telefone é obrigatório.";
      if (!formData.email) {
        newErrors.email = "E-mail é obrigatório.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "E-mail inválido.";
      }
      if (!formData.provincia) newErrors.provincia = "Província é obrigatória.";
      if (!formData.municipio) newErrors.municipio = "Município é obrigatório.";
      if (!formData.comuna) newErrors.comuna = "Comuna é obrigatória.";
    }
    
    if (currentStep === 3) {
      if (!formData.profissao) newErrors.profissao = "Profissão é obrigatória.";
      if (!formData.sector_profissional) newErrors.sector_profissional = "Sector profissional é obrigatório.";
      if (formData.sector_profissional === "publico" && !formData.entidade_publica) {
        newErrors.entidade_publica = "Entidade pública é obrigatória.";
      }
      if (formData.sector_profissional === "privado" && !formData.entidade_privada) {
        newErrors.entidade_privada = "Entidade privada é obrigatória.";
      }
      if (!formData.renda_mensal || parseFloat(formData.renda_mensal) <= 0) { // Validation for renda_mensal
        newErrors.renda_mensal = "Rendimento mensal é obrigatório e deve ser maior que zero.";
      }
    }
    
    if (currentStep === 5) {
      if (!formData.assinatura_plano_id) newErrors.assinatura_plano_id = "Selecione um pacote de assinatura.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const checkBiExists = async () => {
    if (!formData.bi || errors.bi) {
      setBiExistsError("");
      return true;
    }
    try {
      const existingCooperado = await Cooperado.filter({ bi: formData.bi.toUpperCase() });
      if (existingCooperado.length > 0 && (!cooperado || existingCooperado[0].id !== cooperado.id)) {
        setBiExistsError("Já existe um cooperado com este número de BI.");
        return false;
      }
      setBiExistsError("");
      return true;
    } catch (error) {
      console.error("Erro ao verificar BI:", error);
      setBiExistsError("Erro ao verificar BI. Tente novamente.");
      return false;
    }
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (currentStep === 1 && !isNew) {
        const biIsValid = await checkBiExists();
        if (!biIsValid) return;
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNew && !validateStep()) {
      alert("Por favor, corrija os erros antes de submeter.");
      return;
    }
    
    if (!isNew) {
      const allDocsUploadedOrSkipped = Object.values(formData.documentos_anexados).every(doc => doc !== null) || 
                                       confirm("Existem documentos pendentes. Deseja continuar e adicioná-los mais tarde?");
      
      if (!allDocsUploadedOrSkipped) {
        setCurrentStep(4);
        return;
      }
    }

    // Preparar dados para salvar (remover campos temporários do formulário)
    const { taxa_inscricao_selecionada, mostrar_credenciais, ...dataToSave } = formData;
    
    // Chamar função de salvar com a senha temporária
    onSave(dataToSave, formData.senha_temporaria);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    if (field === "bi") {
      setBiExistsError("");
    }
  };
  
  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;
    setFileUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const response = await UploadFile({ file });
      handleChange("documentos_anexados", {
        ...formData.documentos_anexados,
        [fieldName]: response.file_url
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      setErrors(prev => ({ ...prev, [fieldName]: "Falha no upload."}));
    } finally {
      setFileUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input 
                id="nome_completo" 
                value={formData.nome_completo} 
                onChange={(e) => handleChange("nome_completo", e.target.value)} 
                className="mt-1"
              />
              {errors.nome_completo && <p className="text-red-500 text-xs mt-1">{errors.nome_completo}</p>}
            </div>
            
            <div>
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <Input 
                id="data_nascimento" 
                type="date" 
                value={formData.data_nascimento} 
                onChange={(e) => handleChange("data_nascimento", e.target.value)} 
                className="mt-1"
              />
              {errors.data_nascimento && <p className="text-red-500 text-xs mt-1">{errors.data_nascimento}</p>}
            </div>
            
            <div>
              <Label htmlFor="estado_civil">Estado Civil *</Label>
              <Select value={formData.estado_civil} onValueChange={(value) => handleChange("estado_civil", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado_civil && <p className="text-red-500 text-xs mt-1">{errors.estado_civil}</p>}
            </div>
            
            {formData.estado_civil === "casado" && (
              <div>
                <Label htmlFor="nome_conjuge">Nome do Cônjuge *</Label>
                <Input 
                  id="nome_conjuge" 
                  value={formData.nome_conjuge} 
                  onChange={(e) => handleChange("nome_conjuge", e.target.value)} 
                  className="mt-1"
                />
                {errors.nome_conjuge && <p className="text-red-500 text-xs mt-1">{errors.nome_conjuge}</p>}
              </div>
            )}
            
            <div className="md:col-span-2 grid grid-cols-2 gap-x-6 items-center">
              <div>
                <Label htmlFor="tem_filhos">Tem Filhos?</Label>
                <Select 
                  value={formData.tem_filhos ? "sim" : "nao"} 
                  onValueChange={(value) => handleChange("tem_filhos", value === "sim")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.tem_filhos && (
                <div>
                  <Label htmlFor="numero_filhos">Número de Filhos *</Label>
                  <Input 
                    id="numero_filhos" 
                    type="number" 
                    min="1" 
                    value={formData.numero_filhos} 
                    onChange={(e) => handleChange("numero_filhos", parseInt(e.target.value))} 
                    className="mt-1"
                  />
                  {errors.numero_filhos && <p className="text-red-500 text-xs mt-1">{errors.numero_filhos}</p>}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="nacionalidade">Nacionalidade *</Label>
              <Input 
                id="nacionalidade" 
                value={formData.nacionalidade} 
                onChange={(e) => handleChange("nacionalidade", e.target.value)} 
                className="mt-1"
              />
              {errors.nacionalidade && <p className="text-red-500 text-xs mt-1">{errors.nacionalidade}</p>}
            </div>
            
            <div>
              <Label htmlFor="bi">Nº do Bilhete de Identidade *</Label>
              <Input 
                id="bi" 
                value={formData.bi} 
                onChange={(e) => handleChange("bi", e.target.value.toUpperCase())} 
                onBlur={checkBiExists}
                placeholder="000000000AA000"
                className="mt-1"
              />
              {errors.bi && <p className="text-red-500 text-xs mt-1">{errors.bi}</p>}
              {biExistsError && <p className="text-red-500 text-xs mt-1">{biExistsError}</p>}
            </div>
            
            <div>
              <Label htmlFor="validade_documento_bi">Validade do BI *</Label>
              <Input 
                id="validade_documento_bi" 
                type="date" 
                value={formData.validade_documento_bi} 
                onChange={(e) => handleChange("validade_documento_bi", e.target.value)} 
                className="mt-1"
              />
              {errors.validade_documento_bi && <p className="text-red-500 text-xs mt-1">{errors.validade_documento_bi}</p>}
            </div>
          </CardContent>
        );
        
      case 2:
        return (
          <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input 
                id="telefone" 
                value={formData.telefone} 
                onChange={(e) => handleChange("telefone", e.target.value)} 
                placeholder="+244 000 000 000"
                className="mt-1"
              />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                placeholder="exemplo@email.com"
                className="mt-1"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="provincia">Província *</Label>
              <Select value={formData.provincia} onValueChange={(value) => handleChange("provincia", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {provinciasAngola.map(prov => (
                    <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provincia && <p className="text-red-500 text-xs mt-1">{errors.provincia}</p>}
            </div>
            
            <div>
              <Label htmlFor="municipio">Município *</Label>
              <Input 
                id="municipio" 
                value={formData.municipio} 
                onChange={(e) => handleChange("municipio", e.target.value)} 
                className="mt-1"
              />
              {errors.municipio && <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>}
            </div>
            
            <div>
              <Label htmlFor="comuna">Comuna *</Label>
              <Input 
                id="comuna" 
                value={formData.comuna} 
                onChange={(e) => handleChange("comuna", e.target.value)} 
                className="mt-1"
              />
              {errors.comuna && <p className="text-red-500 text-xs mt-1">{errors.comuna}</p>}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="endereco_completo">Endereço Completo</Label>
              <Textarea 
                id="endereco_completo" 
                value={formData.endereco_completo} 
                onChange={(e) => handleChange("endereco_completo", e.target.value)} 
                rows={3}
                className="mt-1"
                placeholder="Endereço completo com rua, número, bairro..."
              />
            </div>
          </CardContent>
        );
        
      case 3:
        return (
          <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Label htmlFor="profissao">Profissão *</Label>
              <Input 
                id="profissao" 
                value={formData.profissao} 
                onChange={(e) => handleChange("profissao", e.target.value)} 
                className="mt-1"
              />
              {errors.profissao && <p className="text-red-500 text-xs mt-1">{errors.profissao}</p>}
            </div>
            
            <div>
              <Label htmlFor="sector_profissional">Sector Profissional *</Label>
              <Select value={formData.sector_profissional} onValueChange={(value) => handleChange("sector_profissional", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="privado">Privado</SelectItem>
                </SelectContent>
              </Select>
              {errors.sector_profissional && <p className="text-red-500 text-xs mt-1">{errors.sector_profissional}</p>}
            </div>

            <div>
              <Label htmlFor="renda_mensal">Rendimento Mensal *</Label>
              <div className="relative mt-1">
                <Input 
                  id="renda_mensal" 
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.renda_mensal} 
                  onChange={(e) => handleChange("renda_mensal", parseFloat(e.target.value) || "")} 
                  placeholder="Ex: 150000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">Kz</span>
                </div>
              </div>
              {errors.renda_mensal && <p className="text-red-500 text-xs mt-1">{errors.renda_mensal}</p>}
              <p className="text-xs text-slate-500 mt-1">
                {formData.renda_mensal && !isNaN(formData.renda_mensal) ? 
                  `${Number(formData.renda_mensal).toLocaleString()} Kz` : 
                  "Introduza o rendimento mensal em Kwanzas"
                }
              </p>
            </div>
            
            {formData.sector_profissional === "publico" && (
              <div>
                <Label htmlFor="entidade_publica">Entidade Pública *</Label>
                <Select value={formData.entidade_publica} onValueChange={(value) => handleChange("entidade_publica", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a entidade..." />
                  </SelectTrigger>
                  <SelectContent>
                    {entidadesPublicasAngola.map(ent => (
                      <SelectItem key={ent} value={ent}>{ent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.entidade_publica && <p className="text-red-500 text-xs mt-1">{errors.entidade_publica}</p>}
              </div>
            )}
            
            {formData.sector_profissional === "privado" && (
              <div>
                <Label htmlFor="entidade_privada">Nome da Entidade Privada *</Label>
                <Input 
                  id="entidade_privada" 
                  value={formData.entidade_privada} 
                  onChange={(e) => handleChange("entidade_privada", e.target.value)} 
                  className="mt-1"
                />
                {errors.entidade_privada && <p className="text-red-500 text-xs mt-1">{errors.entidade_privada}</p>}
              </div>
            )}
          </CardContent>
        );
        
      case 4:
        const docFields = [
          {label: "Fotografia 4x3", field: "foto_passe", required: !isNew},
          {label: "Bilhete de Identidade (Frente e Verso)", field: "bi_frente_verso", required: !isNew},
          {label: "Declaração de Serviço", field: "declaracao_servico", required: !isNew},
          {label: "Comprovativo NIF", field: "nif_documento", required: false},
        ];
        
        if (formData.estado_civil === 'casado') {
          docFields.splice(2, 0, {label: "BI do Cônjuge (Frente e Verso)", field: "bi_conjuge", required: !isNew});
        }
        if (formData.tem_filhos) {
          docFields.splice(formData.estado_civil === 'casado' ? 3 : 2, 0, {label: "Documento Agregado Familiar", field: "agregado_familiar_doc", required: !isNew});
        }
        
        return (
          <CardContent className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-slate-700 mb-2">Anexar Documentos</p>
              <p className="text-sm text-slate-600">Anexe os documentos necessários. Campos marcados com * são obrigatórios.</p>
            </div>
            
            <div className="grid gap-6">
              {docFields.map(({label, field, required}) => (
                <div key={field} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <Label className="text-base font-medium text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                  </Label>
                  
                  <div className="mt-3">
                    {!formData.documentos_anexados[field] ? (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <div className="space-y-2">
                          <FileUp className="w-8 h-8 text-slate-400 mx-auto" />
                          <div>
                            <label htmlFor={field} className="cursor-pointer">
                              <span className="text-blue-600 hover:text-blue-700 font-medium">
                                Clique para anexar
                              </span>
                              <span className="text-slate-500"> ou arraste o arquivo aqui</span>
                            </label>
                            <input
                              id={field}
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileUpload(e.target.files[0], field)}
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
                          <span className="text-green-700 font-medium">Documento anexado</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(formData.documentos_anexados[field], '_blank')}
                          >
                            Ver
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("documentos_anexados", {
                              ...formData.documentos_anexados,
                              [field]: null
                            })}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {fileUploading[field] && (
                      <div className="mt-2 flex items-center gap-2 text-blue-600">
                        <FileUp className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Enviando arquivo...</span>
                      </div>
                    )}
                    
                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        );
        
      case 5:
        return (
          <CardContent className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-slate-700 mb-2">Finalização do Cadastro</p>
              <p className="text-sm text-slate-600">Confirme os dados e credenciais de acesso</p>
            </div>
            
            <div>
              <Label htmlFor="assinatura_plano_id">Pacote de Assinatura *</Label>
              <Select value={formData.assinatura_plano_id} onValueChange={(value) => handleChange("assinatura_plano_id", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o plano..." />
                </SelectTrigger>
                <SelectContent>
                  {assinaturaPlanos?.map(plano => (
                    <SelectItem key={plano.id} value={plano.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{plano.nome_plano}</span>
                        <span className="text-sm text-slate-500">
                          {plano.valor_mensal?.toLocaleString()} Kz/mês • Taxa: {plano.taxa_inscricao?.toLocaleString()} Kz
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assinatura_plano_id && <p className="text-red-500 text-xs mt-1">{errors.assinatura_plano_id}</p>}
            </div>
            
            {formData.assinatura_plano_id && formData.taxa_inscricao_selecionada !== "" && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="text-center">
                  <p className="font-medium text-blue-700 mb-2">Taxa de Inscrição</p>
                  <p className="text-3xl font-bold text-blue-800 mb-2">
                    {Number(formData.taxa_inscricao_selecionada).toLocaleString()} Kz
                  </p>
                  <p className="text-sm text-blue-600">
                    Este valor será gerado como um pagamento pendente após o registo
                  </p>
                </div>
              </div>
            )}

            {/* Mostrar credenciais geradas para novos cooperados */}
            {!cooperado && formData.mostrar_credenciais && formData.senha_temporaria && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-green-800 text-lg mb-2">🔑 Credenciais de Acesso Geradas</h3>
                  <p className="text-sm text-green-700">
                    Estas credenciais permitirão ao cooperado acessar o Portal Online
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <Label className="text-sm font-medium text-green-700">ID do Cooperado</Label>
                    <p className="font-mono text-lg font-bold text-green-800 bg-green-50 p-2 rounded mt-1">
                      {formData.numero_associado || "CS****"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <Label className="text-sm font-medium text-green-700">Senha Temporária</Label>
                    <p className="font-mono text-lg font-bold text-green-800 bg-green-50 p-2 rounded mt-1">
                      {formData.senha_temporaria}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>⚠️ Importante:</strong> Anote essas credenciais e entregue-as ao cooperado. 
                    Ele deverá alterar a senha no primeiro acesso ao Portal.
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea 
                id="observacoes" 
                value={formData.observacoes} 
                onChange={(e) => handleChange("observacoes", e.target.value)} 
                rows={4} 
                className="mt-1"
                placeholder="Informações adicionais sobre o cooperado ou processo de inscrição..."
              />
            </div>
          </CardContent>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {cooperado ? "Editar Cooperado" : "Novo Cooperado"}
            </h2>
            <span className="text-sm text-slate-500">
              Etapa {currentStep} de {steps.length}
            </span>
          </div>
          
          <Progress value={(currentStep / steps.length) * 100} className="w-full h-2 mb-4" />
          
          <div className="grid grid-cols-5 gap-2">
            {steps.map(step => (
              <div key={step.id} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step.id}
                </div>
                <p className={`text-xs ${
                  currentStep >= step.id ? 'font-semibold text-blue-600' : 'text-slate-500'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl text-center">
              {steps.find(s => s.id === currentStep)?.title}
            </CardTitle>
          </CardHeader>
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t bg-slate-50 p-6 rounded-lg">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrev} 
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> 
                Anterior
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button 
                type="button" 
                onClick={handleNext} 
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                Próximo 
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> 
                {cooperado ? "Atualizar" : "Registar"} Cooperado
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
