import { EmailQueue, EmailTemplate, EmailLog } from "@/api/entities";
// import { SendEmail } from "@/api/integrations"; // Comentado temporariamente

class EmailService {
  
  // Método principal para enviar e-mails baseados em eventos
  static async enviarPorEvento(evento, destinatario, dados = {}) {
    try {
      console.log(`[EmailService] Processando evento: ${evento}`);
      
      // Buscar template do evento
      const templates = await EmailTemplate.list();
      const template = templates.find(t => t.evento === evento && t.ativo);
      
      if (!template) {
        console.warn(`Template não encontrado para evento: ${evento}`);
        return false;
      }

      // Processar template com dados
      const emailProcessado = this.processarTemplate(template, dados);
      
      // Adicionar à fila de envio
      await EmailQueue.create({
        destinatario_email: destinatario.email,
        destinatario_nome: destinatario.nome || destinatario.nome_completo,
        cooperado_id: destinatario.numero_associado || null,
        template_id: template.id,
        evento: evento,
        assunto: emailProcessado.assunto,
        corpo_html: emailProcessado.corpo_html,
        corpo_texto: this.htmlParaTexto(emailProcessado.corpo_html),
        dados_contexto: dados,
        status: "pendente"
      });

      console.log(`[EmailService] E-mail adicionado à fila para: ${destinatario.email}`);
      return true;
      
    } catch (error) {
      console.error(`[EmailService] Erro ao processar evento ${evento}:`, error);
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
          // Tentativa de envio (comentada por enquanto)
          /*
          await SendEmail({
            to: email.destinatario_email,
            subject: email.assunto,
            body: email.corpo_html,
            from_name: "CoopHabitat"
          });
          */
          
          // Atualizar status (simulado por enquanto)
          await EmailQueue.update(email.id, {
            status: "enviado",
            data_envio: new Date().toISOString(),
            tentativas: email.tentativas + 1
          });

          // Log do envio
          await EmailLog.create({
            to_email: email.destinatario_email,
            subject: email.assunto,
            body: email.corpo_texto,
            status: "sent",
            from_name: "CoopHabitat",
            cooperado_id: email.cooperado_id
          });
          
        } catch (envioError) {
          console.error(`Erro ao enviar e-mail para ${email.destinatario_email}:`, envioError);
          
          await EmailQueue.update(email.id, {
            status: "falhou",
            erro_mensagem: envioError.message,
            tentativas: email.tentativas + 1
          });

          await EmailLog.create({
            to_email: email.destinatario_email,
            subject: email.assunto,
            body: email.corpo_texto,
            status: "failed",
            error_message: envioError.message,
            from_name: "CoopHabitat",
            cooperado_id: email.cooperado_id
          });
        }
      }
      
    } catch (error) {
      console.error("[EmailService] Erro ao processar fila:", error);
    }
  }
}

export default EmailService;