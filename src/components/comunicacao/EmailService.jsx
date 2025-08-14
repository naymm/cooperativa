import { EmailQueue, EmailTemplate, EmailLog } from "@/api/entities";
import { emailTemplates } from "@/templates/emailTemplates";
import { SendEmail } from "@/api/integrations";

class EmailService {
  
  // Verificar se a configuração automática está disponível
  static isConfiguracaoAutomaticaDisponivel() {
    return typeof SendEmail === 'function';
  }

  // Método principal para enviar e-mails baseados em eventos
  static async enviarPorEvento(evento, destinatario, dados = {}) {
    try {
      console.log(`[EmailService] Processando evento: ${evento}`);
      
      // Verificar se a configuração automática está disponível
      if (!this.isConfiguracaoAutomaticaDisponivel()) {
        console.warn("[EmailService] Configuração automática não disponível. Email não será enviado.");
        return false;
      }
      
      // Primeiro, tentar buscar template do banco de dados
      let template = null;
      try {
        const templates = await EmailTemplate.list();
        template = templates.find(t => t.evento === evento && t.ativo);
      } catch (error) {
        console.warn(`[EmailService] Erro ao buscar templates do banco:`, error);
      }
      
      // Se não encontrar no banco, usar template local
      if (!template) {
        console.log(`[EmailService] Template não encontrado no banco, usando template local para: ${evento}`);
        template = emailTemplates[evento];
      }
      
      if (!template) {
        console.warn(`[EmailService] Template não encontrado para evento: ${evento}`);
        return false;
      }

      // Processar template com dados
      const emailProcessado = this.processarTemplate(template, dados);
      
      // Adicionar à fila de envio
      const emailQueue = await EmailQueue.create({
        destinatario_email: destinatario.email,
        destinatario_nome: destinatario.nome || destinatario.nome_completo,
        cooperado_id: destinatario.numero_associado || null,
        template_id: template.id || null,
        evento: evento,
        assunto: emailProcessado.assunto,
        corpo_html: emailProcessado.corpo_html,
        corpo_texto: this.htmlParaTexto(emailProcessado.corpo_html),
        dados_contexto: dados,
        status: "pendente"
      });

      console.log(`[EmailService] E-mail adicionado à fila para: ${destinatario.email}`);
      
      // Tentar enviar imediatamente usando configuração automática
      const resultadoEnvio = await this.enviarEmailReal(emailQueue);
      
      return resultadoEnvio;
      
    } catch (error) {
      console.error(`[EmailService] Erro ao processar evento ${evento}:`, error);
      return false;
    }
  }

  // Enviar email real usando a integração
  static async enviarEmailReal(emailQueue) {
    try {
      console.log(`[EmailService] Enviando email real para: ${emailQueue.destinatario_email}`);
      
      // Verificar se a configuração automática está disponível
      if (!this.isConfiguracaoAutomaticaDisponivel()) {
        throw new Error("Configuração automática não disponível");
      }
      
      // Usar a integração SendEmail
      const resultado = await SendEmail({
        to: emailQueue.destinatario_email,
        subject: emailQueue.assunto,
        body: emailQueue.corpo_html,
        from_name: "CoopHabitat"
      });
      
      if (resultado) {
        // Atualizar status para enviado
        await EmailQueue.update(emailQueue.id, {
          status: "enviado",
          data_envio: new Date().toISOString(),
          tentativas: (emailQueue.tentativas || 0) + 1
        });

        // Log do envio
        await EmailLog.create({
          to_email: emailQueue.destinatario_email,
          subject: emailQueue.assunto,
          status: "enviado",
          data_envio: new Date().toISOString()
        });

        console.log(`[EmailService] Email enviado com sucesso para: ${emailQueue.destinatario_email}`);
        return true;
      } else {
        throw new Error("Falha no envio via integração");
      }
      
    } catch (error) {
      console.error(`[EmailService] Erro ao enviar email real:`, error);
      
      // Atualizar status para falha
      await EmailQueue.update(emailQueue.id, {
        status: "falha",
        tentativas: (emailQueue.tentativas || 0) + 1,
        erro: error.message
      });
      
      return false;
    }
  }

  // Processar template substituindo variáveis
  static processarTemplate(template, dados) {
    let assunto = template.assunto;
    let corpo = template.corpo_html;

    // Substituir variáveis no formato {{variavel}}
    Object.keys(dados).forEach(chave => {
      const regex = new RegExp(`{{${chave}}}`, 'g');
      assunto = assunto.replace(regex, dados[chave] || '');
      corpo = corpo.replace(regex, dados[chave] || '');
    });

    return {
      assunto,
      corpo_html: corpo
    };
  }

  // Converter HTML para texto simples
  static htmlParaTexto(html) {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  // Processar fila de e-mails (para futuro uso automático)
  static async processarFila() {
    try {
      const emailsPendentes = await EmailQueue.filter({ status: "pendente" });
      
      for (const email of emailsPendentes) {
        try {
          const resultado = await this.enviarEmailReal(email);
          
          if (!resultado) {
            console.warn(`[EmailService] Falha ao enviar email para: ${email.destinatario_email}`);
          }
          
          // Aguardar 1 segundo entre envios para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`[EmailService] Erro ao processar email da fila:`, error);
        }
      }
    } catch (error) {
      console.error(`[EmailService] Erro ao processar fila:`, error);
    }
  }

  // Testar configuração automática
  static async testarConfiguracaoAutomatica(emailDestino) {
    try {
      console.log("[EmailService] Testando configuração automática...");
      
      if (!this.isConfiguracaoAutomaticaDisponivel()) {
        throw new Error("Configuração automática não disponível");
      }

      const resultado = await SendEmail({
        to: emailDestino,
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

      return resultado;
      
    } catch (error) {
      console.error("[EmailService] Erro no teste de configuração automática:", error);
      throw error;
    }
  }
}

export default EmailService;