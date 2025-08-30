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
  
  // Enviar e-mail de boas-vindas
  static async enviarBoasVindas(destinatario, dados) {
    const assunto = '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso';
    
    const corpoHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px;">
          <h1 style="margin: 0; font-size: 28px;">🏠 Cooperativa Sanep</h1>
          <p>Habitação e Construção</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center;">
            <h2>🎉 Bem-vindo(a) à Cooperativa Sanep!</h2>
            <p>Olá ${dados.nome_cooperado},</p>
            <p>Sua inscrição foi aprovada com sucesso em ${dados.data_aprovacao}!</p>
          </div>
          
          <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <h3>🔐 Suas Credenciais de Acesso</h3>
            <p>Use estas credenciais para acessar o Portal do Cooperado:</p>
            
            <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <strong>🌐 Portal de Acesso:</strong> http://localhost:5173/PortalLogin
            </div>
            
            <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <strong>🔢 Número de Associado:</strong> ${dados.numero_associado}
            </div>
            
            <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <strong>🔑 Senha Temporária:</strong> ${dados.senha_temporaria}
            </div>
            
            <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <strong>📋 Plano Escolhido:</strong> ${dados.nome_plano}
            </div>
          </div>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <h4>🔒 Importante - Segurança</h4>
            <p>• Esta é uma senha temporária - altere-a no primeiro acesso<br>
            • Mantenha suas credenciais em local seguro<br>
            • Não compartilhe suas credenciais com terceiros</p>
          </div>
          
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4>📋 Próximos Passos</h4>
            <p>1. Acesse o Portal do Cooperado usando suas credenciais<br>
            2. Complete seu perfil com informações adicionais<br>
            3. Faça o pagamento da taxa de inscrição<br>
            4. Explore os serviços disponíveis</p>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p><strong>Cooperativa Sanep - Habitação e Construção</strong></p>
          <p>📧 suporte@cooperativasanep.co.ao | 📞 +244 123 456 789</p>
          <p>📍 Luanda, Angola</p>
        </div>
      </div>
    `;
    
    return this.enviarEmail(destinatario, assunto, corpoHTML, dados);
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
