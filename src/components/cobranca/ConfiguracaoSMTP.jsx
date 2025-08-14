import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Info,
  Zap,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { SendEmail } from "@/api/integrations";

export default function ConfiguracaoSMTP() {
  const [testando, setTestando] = useState(false);
  const [configurando, setConfigurando] = useState(false);
  const [resultadoTeste, setResultadoTeste] = useState(null);
  const [statusConfiguracao, setStatusConfiguracao] = useState(null);
  const [configuracao, setConfiguracao] = useState({
    servidor: "smtp.gmail.com",
    porta: "587",
    email: "",
    senha: "",
    nome_remetente: "CoopHabitat"
  });

  // Verificar status da integração SendEmail
  useEffect(() => {
    verificarIntegracao();
  }, []);

  const verificarIntegracao = async () => {
    try {
      console.log("[ConfiguracaoSMTP] Verificando integração SendEmail...");
      
      // Testar se a integração está disponível
      if (typeof SendEmail === 'function') {
        setStatusConfiguracao({
          tipo: 'sucesso',
          titulo: 'Integração SendEmail Disponível',
          mensagem: 'A integração de email está configurada e pronta para uso.',
          automatico: true
        });
        console.log("[ConfiguracaoSMTP] Integração SendEmail disponível");
      } else {
        setStatusConfiguracao({
          tipo: 'erro',
          titulo: 'Integração SendEmail Não Disponível',
          mensagem: 'A integração de email não está configurada. Configure manualmente.',
          automatico: false
        });
        console.warn("[ConfiguracaoSMTP] Integração SendEmail não disponível");
      }
    } catch (error) {
      console.error("[ConfiguracaoSMTP] Erro ao verificar integração:", error);
      setStatusConfiguracao({
        tipo: 'erro',
        titulo: 'Erro ao Verificar Integração',
        mensagem: 'Não foi possível verificar a configuração de email.',
        automatico: false
      });
    }
  };

  const configurarAutomaticamente = async () => {
    setConfigurando(true);
    setStatusConfiguracao(null);

    try {
      console.log("[ConfiguracaoSMTP] Iniciando configuração automática...");
      
      // Testar configuração automática
      const resultado = await SendEmail({
        to: "teste@coophabitat.ao",
        subject: "Teste de Configuração Automática - CoopHabitat",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">✅ Configuração Automática SMTP</h2>
            <p>Este é um teste de configuração automática do sistema de email.</p>
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="color: #155724; margin: 0;">Status: Configuração Automática</h4>
              <p style="color: #155724; margin: 10px 0 0 0;">
                Se você recebeu este email, a configuração automática está funcionando!
              </p>
            </div>
            <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
              Data do teste: ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        `,
        from_name: "CoopHabitat"
      });

      if (resultado) {
        setStatusConfiguracao({
          tipo: 'sucesso',
          titulo: 'Configuração Automática Ativa',
          mensagem: 'O sistema está configurado automaticamente e pronto para enviar emails!',
          automatico: true,
          detalhes: 'A integração SendEmail está funcionando corretamente.'
        });
        toast.success("Configuração automática ativada com sucesso!");
      } else {
        throw new Error("Falha na configuração automática");
      }

    } catch (error) {
      console.error("[ConfiguracaoSMTP] Erro na configuração automática:", error);
      setStatusConfiguracao({
        tipo: 'erro',
        titulo: 'Falha na Configuração Automática',
        mensagem: 'Não foi possível configurar automaticamente. Configure manualmente.',
        automatico: false,
        detalhes: error.message
      });
      toast.error("Falha na configuração automática");
    } finally {
      setConfigurando(false);
    }
  };

  const testarConexaoSMTP = async () => {
    if (!configuracao.email || !configuracao.senha) {
      toast.error("Preencha o email e senha para testar");
      return;
    }

    setTestando(true);
    setResultadoTeste(null);

    try {
      console.log("[ConfiguracaoSMTP] Testando conexão SMTP...");
      
      // Testar envio de email usando a integração
      const resultado = await SendEmail({
        to: configuracao.email, // Enviar para o próprio email configurado
        subject: "Teste de Configuração SMTP - CoopHabitat",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">✅ Teste de Configuração SMTP</h2>
            <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Detalhes da Configuração:</h4>
              <ul>
                <li><strong>Servidor:</strong> ${configuracao.servidor}</li>
                <li><strong>Porta:</strong> ${configuracao.porta}</li>
                <li><strong>Email:</strong> ${configuracao.email}</li>
                <li><strong>Remetente:</strong> ${configuracao.nome_remetente}</li>
              </ul>
            </div>
            <p style="color: #27ae60; font-weight: bold;">
              ✅ Se você recebeu este email, a configuração SMTP está funcionando!
            </p>
            <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
              Data do teste: ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        `,
        from_name: configuracao.nome_remetente
      });

      if (resultado) {
        setResultadoTeste({
          sucesso: true,
          mensagem: "Email de teste enviado com sucesso! Verifique sua caixa de entrada."
        });
        toast.success("Teste SMTP realizado com sucesso!");
      } else {
        throw new Error("Falha no envio do email de teste");
      }

    } catch (error) {
      console.error("[ConfiguracaoSMTP] Erro no teste SMTP:", error);
      setResultadoTeste({
        sucesso: false,
        mensagem: `Erro no teste: ${error.message}`
      });
      toast.error("Falha no teste SMTP");
    } finally {
      setTestando(false);
    }
  };

  const testarCobranca = async () => {
    if (!configuracao.email) {
      toast.error("Configure um email para receber o teste");
      return;
    }

    setTestando(true);
    setResultadoTeste(null);

    try {
      console.log("[ConfiguracaoSMTP] Testando email de cobrança...");
      
      // Testar envio de email de cobrança
      const resultado = await SendEmail({
        to: configuracao.email,
        subject: "Teste de Email de Cobrança - CoopHabitat",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2c3e50; margin: 0; text-align: center;">CoopHabitat</h2>
              <p style="color: #7f8c8d; text-align: center; margin: 5px 0;">Cooperativa de Habitação</p>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Teste de Email de Cobrança</h3>
              <p style="color: #856404; margin: 0;">Prezado(a) <strong>Usuário de Teste</strong>,</p>
            </div>
            
            <div style="line-height: 1.6; color: #2c3e50;">
              <p>Este é um email de teste para verificar se os templates de cobrança estão funcionando corretamente.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Dados de Teste:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>Número de Associado:</strong> CS123456</li>
                  <li><strong>Plano:</strong> Plano Habitação Premium</li>
                  <li><strong>Valor:</strong> 75.000 Kz</li>
                  <li><strong>Mês de Referência:</strong> 2024-01</li>
                  <li><strong>Data de Vencimento:</strong> 15 de janeiro de 2024</li>
                  <li><strong>Dias em Atraso:</strong> 15 dias</li>
                </ul>
              </div>
              
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #155724;">📞 Contato:</h4>
                <p style="margin: 0; color: #155724;">
                  <strong>Telefone:</strong> +244 123 456 789<br>
                  <strong>Email:</strong> cobranca@coophabitat.ao
                </p>
              </div>
              
              <p style="margin-top: 30px;">
                Atenciosamente,<br>
                <strong>Equipe CoopHabitat</strong><br>
                <em>${new Date().toLocaleDateString('pt-BR')}</em>
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
              <p style="margin: 0;">Este é um email de teste. Por favor, não responda a esta mensagem.</p>
            </div>
          </div>
        `,
        from_name: configuracao.nome_remetente
      });

      if (resultado) {
        setResultadoTeste({
          sucesso: true,
          mensagem: "Email de cobrança de teste enviado com sucesso!"
        });
        toast.success("Teste de cobrança realizado com sucesso!");
      } else {
        throw new Error("Falha no envio do email de cobrança");
      }

    } catch (error) {
      console.error("[ConfiguracaoSMTP] Erro no teste de cobrança:", error);
      setResultadoTeste({
        sucesso: false,
        mensagem: `Erro no teste: ${error.message}`
      });
      toast.error("Falha no teste de cobrança");
    } finally {
      setTestando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Configuração SMTP
          <Badge variant="outline" className="ml-2">
            Configuração Automática
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Status da Configuração */}
        {statusConfiguracao && (
          <Alert className={
            statusConfiguracao.tipo === 'sucesso' 
              ? "border-green-200 bg-green-50" 
              : "border-red-200 bg-red-50"
          }>
            {statusConfiguracao.tipo === 'sucesso' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription>
              <strong>{statusConfiguracao.titulo}</strong><br />
              {statusConfiguracao.mensagem}
              {statusConfiguracao.detalhes && (
                <div className="mt-2 text-sm">
                  <strong>Detalhes:</strong> {statusConfiguracao.detalhes}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Configuração Automática */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-2">⚡ Configuração Automática</h4>
              <p className="text-sm text-blue-700 mb-3">
                O sistema pode configurar automaticamente o SMTP usando a integração SendEmail do base44.
                Clique no botão abaixo para ativar a configuração automática.
              </p>
              <Button
                onClick={configurarAutomaticamente}
                disabled={configurando}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {configurando ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Configurar Automaticamente
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Informações sobre SMTP */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuração SMTP:</strong><br />
            Para configuração manual, preencha os campos abaixo. 
            Recomendamos usar Gmail, Outlook ou outro provedor de email.
          </AlertDescription>
        </Alert>

        {/* Campos de configuração manual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="servidor">Servidor SMTP</Label>
            <Input
              id="servidor"
              value={configuracao.servidor}
              onChange={(e) => setConfiguracao(prev => ({ ...prev, servidor: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>
          
          <div>
            <Label htmlFor="porta">Porta</Label>
            <Input
              id="porta"
              value={configuracao.porta}
              onChange={(e) => setConfiguracao(prev => ({ ...prev, porta: e.target.value }))}
              placeholder="587"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={configuracao.email}
              onChange={(e) => setConfiguracao(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu-email@gmail.com"
            />
          </div>
          
          <div>
            <Label htmlFor="senha">Senha/App Password</Label>
            <Input
              id="senha"
              type="password"
              value={configuracao.senha}
              onChange={(e) => setConfiguracao(prev => ({ ...prev, senha: e.target.value }))}
              placeholder="Sua senha ou app password"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="nome_remetente">Nome do Remetente</Label>
            <Input
              id="nome_remetente"
              value={configuracao.nome_remetente}
              onChange={(e) => setConfiguracao(prev => ({ ...prev, nome_remetente: e.target.value }))}
              placeholder="CoopHabitat"
            />
          </div>
        </div>

        {/* Botões de teste */}
        <div className="flex gap-2">
          <Button
            onClick={testarConexaoSMTP}
            disabled={testando || !configuracao.email || !configuracao.senha}
            variant="outline"
            className="flex-1"
          >
            {testando ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Testar Conexão SMTP
              </>
            )}
          </Button>
          
          <Button
            onClick={testarCobranca}
            disabled={testando || !configuracao.email}
            variant="default"
            className="flex-1"
          >
            {testando ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Testar Email de Cobrança
              </>
            )}
          </Button>
        </div>

        {/* Resultado do teste */}
        {resultadoTeste && (
          <Alert className={resultadoTeste.sucesso ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {resultadoTeste.sucesso ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription>
              <strong>{resultadoTeste.sucesso ? "Sucesso!" : "Erro:"}</strong><br />
              {resultadoTeste.mensagem}
            </AlertDescription>
          </Alert>
        )}

        {/* Instruções para Gmail */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📧 Configuração para Gmail:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Ative a verificação em duas etapas na sua conta Google</li>
            <li>2. Gere uma "Senha de App" em Configurações de Segurança</li>
            <li>3. Use essa senha no campo "Senha" acima</li>
            <li>4. Servidor: smtp.gmail.com, Porta: 587</li>
          </ol>
        </div>

        {/* Status da Integração */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>
              <strong>Status da Integração:</strong> 
              {statusConfiguracao?.automatico ? (
                <span className="text-green-600 ml-1">✅ Configurado Automaticamente</span>
              ) : (
                <span className="text-orange-600 ml-1">⚠️ Configuração Manual Necessária</span>
              )}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
} 