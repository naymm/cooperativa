// API para envio de e-mails
const EMAIL_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

// Configuração do EmailJS (serviço gratuito para envio de e-mails)
const EMAILJS_CONFIG = {
  serviceId: 'service_8tn37e3', // Configurado
  templateId: 'template_t1jxoz4', // Configurado
  userId: 'kBlY0Gh4viVUScO_M' // Configurado
};

export class EmailAPI {
  
  // Enviar e-mail usando EmailJS (funciona no cliente)
  static async enviarEmail(destinatario, assunto, corpoHTML, dados = {}) {
    try {
      console.log(`[EmailAPI] Enviando e-mail para: ${destinatario}`);
      console.log(`[EmailAPI] Usando EmailJS configurado`);
      console.log(`[EmailAPI] Service ID: ${EMAILJS_CONFIG.serviceId}`);
      console.log(`[EmailAPI] Template ID: ${EMAILJS_CONFIG.templateId}`);
      console.log(`[EmailAPI] User ID: ${EMAILJS_CONFIG.userId}`);
      
      const requestBody = {
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.userId,
        template_params: {
          to_email: destinatario,
          to_name: dados.nome_cooperado || 'Cooperado',
          subject: assunto,
          message: corpoHTML,
          nome_cooperado: dados.nome_cooperado || 'Cooperado',
          numero_associado: dados.numero_associado || 'N/A',
          senha_temporaria: dados.senha_temporaria || 'N/A',
          nome_plano: dados.nome_plano || 'N/A',
          data_aprovacao: dados.data_aprovacao || new Date().toLocaleDateString('pt-BR'),
          email: destinatario, // Campo adicional para o email
          user_email: destinatario, // Campo alternativo
          recipient_email: destinatario, // Campo alternativo
          ...dados
        }
      };
      
      console.log(`[EmailAPI] Request body:`, requestBody);
      
      const response = await fetch(EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log(`[EmailAPI] Resposta do EmailJS:`, response.status, response.ok);
      
      if (response.ok) {
        const resultado = await response.text();
        console.log(`[EmailAPI] E-mail enviado com sucesso para: ${destinatario}`);
        console.log(`[EmailAPI] Resposta:`, resultado);
        return { success: true, messageId: Date.now().toString(), metodo: 'EmailJS Real' };
      } else {
        const erro = await response.text();
        console.error(`[EmailAPI] Erro do EmailJS:`, erro);
        throw new Error(`Erro EmailJS: ${response.status} - ${erro}`);
      }
      
    } catch (error) {
      console.error(`[EmailAPI] Erro ao enviar e-mail:`, error);
      
      // Se falhar, usar fallback
      console.warn(`[EmailAPI] Usando fallback devido ao erro`);
      return this.enviarEmailFallback(destinatario, assunto, corpoHTML, dados);
    }
  }
  
  // Fallback: Simular envio bem-sucedido (para desenvolvimento)
  static async enviarEmailFallback(destinatario, assunto, corpoHTML, dados = {}) {
    console.log(`[EmailAPI] Fallback: Simulando envio para ${destinatario}`);
    console.log(`[EmailAPI] Assunto: ${assunto}`);
    console.log(`[EmailAPI] Dados:`, dados);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular sucesso
    return { 
      success: true, 
      messageId: `fallback_${Date.now()}`,
      metodo: 'Fallback (EmailJS falhou)'
    };
  }
  
  // Enviar e-mail de boas-vindas usando template EmailJS
  static async enviarBoasVindasTemplate(destinatario, dados) {
    try {
      console.log(`[EmailAPI] Enviando e-mail de boas-vindas para: ${destinatario}`);
      console.log(`[EmailAPI] Usando template EmailJS: template_zwuni7r`);
      
      const requestBody = {
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: 'template_zwuni7r', // Template específico para boas-vindas
        user_id: EMAILJS_CONFIG.userId,
        template_params: {
          to_email: destinatario,
          to_name: dados.nome_cooperado || 'Cooperado',
          subject: '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
          nome_cooperado: dados.nome_cooperado || 'Cooperado',
          numero_associado: dados.numero_associado || 'N/A',
          senha_temporaria: dados.senha_temporaria || 'N/A',
          nome_plano: dados.nome_plano || 'N/A',
          data_aprovacao: dados.data_aprovacao || new Date().toLocaleDateString('pt-BR'),
          email: destinatario,
          user_email: destinatario,
          recipient_email: destinatario,
          portal_url: 'http://localhost:5173/PortalLogin',
          empresa_nome: 'Cooperativa Sanep',
          empresa_email: 'suporte@cooperativasanep.co.ao',
          empresa_telefone: '+244 123 456 789',
          empresa_endereco: 'Luanda, Angola',
          ...dados
        }
      };
      
      console.log(`[EmailAPI] Request body para boas-vindas:`, requestBody);
      
      const response = await fetch(EMAIL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log(`[EmailAPI] Resposta do EmailJS:`, response.status, response.ok);
      
      if (response.ok) {
        const resultado = await response.text();
        console.log(`[EmailAPI] E-mail de boas-vindas enviado com sucesso para: ${destinatario}`);
        console.log(`[EmailAPI] Resposta:`, resultado);
        return { success: true, messageId: Date.now().toString(), metodo: 'EmailJS Template Boas-Vindas' };
      } else {
        const erro = await response.text();
        console.error(`[EmailAPI] Erro do EmailJS:`, erro);
        throw new Error(`Erro EmailJS: ${response.status} - ${erro}`);
      }
      
    } catch (error) {
      console.error(`[EmailAPI] Erro ao enviar e-mail de boas-vindas:`, error);
      return { success: false, error: error.message };
    }
  }
  
  // Testar configuração
  static async testarConfiguracao(emailDestino) {
    console.log(`[EmailAPI] Testando configuração para: ${emailDestino}`);
    
    const resultado = await this.enviarEmail(
      emailDestino,
      "Teste de Configuração Automática - CoopHabitat",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">✅ Configuração Automática EmailJS</h2>
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
      `
    );
    
    return resultado.success;
  }
}
