
import React, { useState, useEffect } from "react";
import { InscricaoPublica } from "@/api/entities";
import { AssinaturaPlano } from "@/api/entities";
import { CrmNotificacao } from "@/api/entities";
import EmailService from "../components/comunicacao/EmailService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Users, CreditCard, Home, User, MapPin, Briefcase, FileUp, CreditCard as CreditCardIcon, ArrowLeft, Check, Mail, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import FormInscricaoPublica from "../components/inscricoes/FormInscricaoPublica";

export default function CadastroPublico() {
  const [inscricaoEnviada, setInscricaoEnviada] = useState(false);
  const [numeroInscricao, setNumeroInscricao] = useState("");
  const [planosDisponiveis, setPlanosDisponiveis] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      const planos = await AssinaturaPlano.list();
      setPlanosDisponiveis(Array.isArray(planos) ? planos.filter(p => p.status === 'ativo') : []);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setPlanosDisponiveis([]);
    }
  };

  const handleSubmitInscricao = async (dadosInscricao) => {
    try {
      console.log("Submetendo inscrição com dados:", dadosInscricao);

      const dadosCompletos = {
        nome_completo: dadosInscricao.nome_completo || "",
        email: dadosInscricao.email || "",
        telefone: dadosInscricao.telefone || "",
        provincia: dadosInscricao.provincia || "",
        municipio: dadosInscricao.municipio || "",
        comuna: dadosInscricao.comuna || "",
        endereco_completo: dadosInscricao.endereco_completo || "",
        profissao: dadosInscricao.profissao || "",
        sector_profissional: dadosInscricao.sector_profissional || "privado",
        renda_mensal: Number(dadosInscricao.renda_mensal) || 0,
        data_nascimento: dadosInscricao.data_nascimento || null,
        estado_civil: dadosInscricao.estado_civil || "solteiro",
        nome_conjuge: dadosInscricao.nome_conjuge || null,
        tem_filhos: dadosInscricao.tem_filhos || false,
        numero_filhos: dadosInscricao.numero_filhos || 0,
        nacionalidade: dadosInscricao.nacionalidade || "Angolana",
        bi: dadosInscricao.bi || null,
        validade_documento_bi: dadosInscricao.validade_documento_bi || null,
        entidade_publica: dadosInscricao.entidade_publica || null,
        entidade_privada: dadosInscricao.entidade_privada || null,
        assinatura_plano_id: dadosInscricao.assinatura_plano_id || "",
        taxa_inscricao_paga: false,
        documentos_anexados: dadosInscricao.documentos_anexados || {},
        observacoes: {
          taxa_inscricao: dadosInscricao.taxa_inscricao_selecionada || 0,
          documentos: dadosInscricao.documentos_anexados || {},
          entidade: dadosInscricao.sector_profissional === "publico" ? dadosInscricao.entidade_publica : dadosInscricao.entidade_privada
        },
        status: "pendente"
      };

      console.log("Dados formatados para envio:", dadosCompletos);

      const inscricao = await InscricaoPublica.create(dadosCompletos);
      console.log("Inscrição criada com sucesso:", inscricao);

      if (!inscricao || !inscricao.id) {
        throw new Error("Falha na criação da inscrição - ID não retornado");
      }

      const numeroGerado = `INS${inscricao.id.slice(-6).toUpperCase()}`;
      setNumeroInscricao(numeroGerado);
      
      // Enviar e-mail de confirmação usando o sistema de eventos
      try {
        await EmailService.enviarPorEvento("confirmacao_inscricao", {
          email: dadosCompletos.email,
          nome_completo: dadosCompletos.nome_completo
        }, {
          nome_completo: dadosCompletos.nome_completo,
          email: dadosCompletos.email,
          provincia: dadosCompletos.provincia,
          data_inscricao: new Date().toLocaleDateString('pt-PT')
        });
        console.log("E-mail de confirmação adicionado à fila");
      } catch (emailError) {
        console.warn("Erro ao programar e-mail de confirmação:", emailError);
      }
      
      try {
        await CrmNotificacao.create({
          titulo: "Nova Inscrição Recebida",
          mensagem: `Nova inscrição recebida de ${dadosCompletos.nome_completo} (${dadosCompletos.email})`,
          tipo: "inscricao",
          dados_adicional: {
            inscricao_id: inscricao.id,
            provincia: dadosCompletos.provincia,
            plano: dadosCompletos.assinatura_plano_id
          },
          status: "nao_lida"
        });
        console.log("Notificação CRM criada");
      } catch (notifError) {
        console.warn("Erro ao criar notificação CRM:", notifError);
      }

      setInscricaoEnviada(true);
      toast.success("Inscrição enviada com sucesso!");
      
    } catch (error) {
      console.error("Erro ao enviar inscrição:", error);
      toast.error("Erro ao enviar inscrição. Tente novamente.");
    }
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const getStepTitle = (step) => {
    const titles = {
      1: "Dados Pessoais",
      2: "Contacto e Morada", 
      3: "Dados Profissionais",
      4: "Documentos",
      5: "Pagamento"
    };
    return titles[step] || "Passo";
  };

  const getStepDescription = (step) => {
    const descriptions = {
      1: "Forneça o seu nome e informações básicas",
      2: "Informações de contacto e endereço",
      3: "Informações sobre trabalho e renda",
      4: "Anexe os documentos necessários",
      5: "Escolha o plano e forma de pagamento"
    };
    return descriptions[step] || "Complete as informações";
  };

  // Success Modal
  if (inscricaoEnviada) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Inscrição Enviada!</h2>
            <p className="text-gray-600 mb-4">
              A sua inscrição foi enviada com sucesso. O número da sua inscrição é:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 font-mono text-lg">{numeroInscricao}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Enviaremos um e-mail de confirmação para o endereço fornecido.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Voltar</span>
            </div>
            <span className="text-sm text-gray-500">Passo {currentStep}/5</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
            {/* Profile Picture in Progress Bar */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {getStepTitle(currentStep)}
                </h1>
                <p className="text-gray-600 text-sm">
                  {getStepDescription(currentStep)}
                </p>
              </div>

              {/* Form */}
              <FormInscricaoPublica 
                onSubmit={handleSubmitInscricao}
                planosDisponiveis={planosDisponiveis}
                onStepChange={handleStepChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        {/* Left Panel - Progress Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Cooperativa Sanep</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex-1 space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                currentStep >= 1 ? 'bg-blue-600' : 'border-2 border-gray-300'
              }`}>
                {currentStep > 1 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : currentStep === 1 ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Dados Pessoais
                </p>
                <p className={`text-xs ${
                  currentStep >= 1 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Forneça o seu nome e informações básicas
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                currentStep >= 2 ? 'bg-blue-600' : 'border-2 border-gray-300'
              }`}>
                {currentStep > 2 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : currentStep === 2 ? (
                  <MapPin className="w-4 h-4 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Contacto e Morada
                </p>
                <p className={`text-xs ${
                  currentStep >= 2 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Informações de contacto e endereço
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                currentStep >= 3 ? 'bg-blue-600' : 'border-2 border-gray-300'
              }`}>
                {currentStep > 3 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : currentStep === 3 ? (
                  <Briefcase className="w-4 h-4 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Dados Profissionais
                </p>
                <p className={`text-xs ${
                  currentStep >= 3 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Informações sobre trabalho e renda
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                currentStep >= 4 ? 'bg-blue-600' : 'border-2 border-gray-300'
              }`}>
                {currentStep > 4 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : currentStep === 4 ? (
                  <FileUp className="w-4 h-4 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  currentStep >= 4 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Documentos
                </p>
                <p className={`text-xs ${
                  currentStep >= 4 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Anexe os documentos necessários
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                currentStep >= 5 ? 'bg-blue-600' : 'border-2 border-gray-300'
              }`}>
                {currentStep === 5 ? (
                  <CreditCardIcon className="w-4 h-4 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  currentStep >= 5 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Pagamento
                </p>
                <p className={`text-xs ${
                  currentStep >= 5 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Escolha o plano e forma de pagamento
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">© Cooperativa Sanep 2024</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail className="w-3 h-3" />
              <span>suporte@cooperativasanep.co.ao</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Form */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {currentStep === 1 && <User className="w-4 h-4 text-blue-600" />}
                {currentStep === 2 && <MapPin className="w-4 h-4 text-blue-600" />}
                {currentStep === 3 && <Briefcase className="w-4 h-4 text-blue-600" />}
                {currentStep === 4 && <FileUp className="w-4 h-4 text-blue-600" />}
                {currentStep === 5 && <CreditCardIcon className="w-4 h-4 text-blue-600" />}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {getStepTitle(currentStep)}
              </h1>
              <p className="text-gray-600">
                {getStepDescription(currentStep)}
              </p>
            </div>

            {/* Form Content */}
            <FormInscricaoPublica 
              onSubmit={handleSubmitInscricao}
              planosDisponiveis={planosDisponiveis}
              onStepChange={handleStepChange}
            />

            {/* Progress Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div 
                  key={step}
                  className={`w-2 h-2 rounded-full ${
                    currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
