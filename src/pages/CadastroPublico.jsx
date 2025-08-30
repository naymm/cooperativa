
import React, { useState, useEffect } from "react";
import { InscricaoPublica } from "@/api/entities";
import { AssinaturaPlano } from "@/api/entities";
import { CrmNotificacao } from "@/api/entities";
import EmailService from "../components/comunicacao/EmailService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Users, CreditCard, Home, User, MapPin, Briefcase, FileUp, CreditCard as CreditCardIcon, ArrowLeft, Check, Mail } from "lucide-react";
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
          mensagem: `Inscrição de ${dadosCompletos.nome_completo} aguarda análise.`,
          tipo: "inscricao",
          link_destino: "/Inscricoes"
        });
        console.log("Notificação CRM criada");
      } catch (notifError) {
        console.warn("Aviso: Falha ao criar notificação CRM:", notifError);
      }

      setInscricaoEnviada(true);
      toast.success("Inscrição enviada com sucesso!");
      
    } catch (error) {
      console.error("====== ERRO DETALHADO AO ENVIAR INSCRIÇÃO ======");
      console.error("Erro completo:", error);
      console.error("Mensagem:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      
      let errorMessage = "Erro ao enviar inscrição";
      if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`${errorMessage}. Por favor, tente novamente.`);
    }
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    console.log("🔄 Step mudou para:", step);
  };

  const getStepTitle = (step) => {
    const titles = {
      1: "Dados Pessoais",
      2: "Contacto e Morada", 
      3: "Dados Profissionais",
      4: "Documentos",
      5: "Pagamento"
    };
    return titles[step] || "Dados Pessoais";
  };

  const getStepDescription = (step) => {
    const descriptions = {
      1: "Forneça o seu nome e informações básicas",
      2: "Informações de contacto e endereço",
      3: "Informações sobre trabalho e renda",
      4: "Anexe os documentos necessários",
      5: "Escolha o plano e forma de pagamento"
    };
    return descriptions[step] || "Forneça o seu nome e informações básicas";
  };

  if (inscricaoEnviada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Inscrição Enviada!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-2">Número da sua inscrição:</p>
              <p className="text-xl font-bold text-green-800">{numeroInscricao}</p>
            </div>
            <div className="text-sm text-slate-600 space-y-2">
              <p>✅ A sua inscrição foi recebida com sucesso</p>
              <p>📧 Receberá um e-mail de confirmação em breve</p>
              <p>👥 A nossa equipe analisará a sua candidatura</p>
              <p>📱 Será contactado(a) com o resultado</p>
            </div>
            <div className="pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                Fazer Nova Inscrição
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
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
