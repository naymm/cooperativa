import { EmailAPI } from "@/api/emailApi";

class EmailService {
  
  // Método principal para enviar e-mails baseados em eventos
  static async enviarPorEvento(evento, destinatario, dados = {}) {
    try {
      console.log(`[EmailService] Processando evento: ${evento}`);
      console.log(`[EmailService] Destinatário: ${destinatario.email}`);
      console.log(`[EmailService] Dados:`, dados);
      
      // Enviar e-mail diretamente usando EmailAPI
      const resultado = await EmailAPI.enviarEmail(
        destinatario.email,
        this.getAssuntoPorEvento(evento, dados),
        this.getCorpoHTMLPorEvento(evento, dados),
        dados
      );
      
      if (resultado && resultado.success) {
        console.log(`[EmailService] E-mail enviado com sucesso para: ${destinatario.email}`);
        console.log(`[EmailService] Message ID: ${resultado.messageId}`);
        console.log(`[EmailService] Método: ${resultado.metodo}`);
        return true;
      } else {
        console.error(`[EmailService] Falha no envio para: ${destinatario.email}`);
        return false;
      }
      
    } catch (error) {
      console.error(`[EmailService] Erro ao processar evento ${evento}:`, error);
      return false;
    }
  }

  // Obter assunto baseado no evento
  static getAssuntoPorEvento(evento, dados = {}) {
    const assuntos = {
      'boas_vindas_cooperado': '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
      'rejeicao_inscricao': '❌ Inscrição Rejeitada - Cooperativa Sanep',
      'aprovacao_inscricao': '✅ Inscrição Aprovada - Cooperativa Sanep',
      'credenciais_acesso': '🔐 Suas Credenciais de Acesso - Cooperativa Sanep'
    };
    
    return assuntos[evento] || 'Notificação - Cooperativa Sanep';
  }

  // Obter corpo HTML baseado no evento
  static getCorpoHTMLPorEvento(evento, dados = {}) {
    if (evento === 'boas_vindas_cooperado') {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Cooperativa Sanep</h1>
            <p>Habitação e Construção</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center;">
              <h2>🎉 Bem-vindo(a) à Cooperativa Sanep!</h2>
              <p>Olá ${dados.nome_cooperado || 'Cooperado'},</p>
              <p>Sua inscrição foi aprovada com sucesso em ${dados.data_aprovacao || new Date().toLocaleDateString('pt-BR')}!</p>
            </div>
            
            <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3>🔐 Suas Credenciais de Acesso</h3>
              <p>Use estas credenciais para acessar o Portal do Cooperado:</p>
              
              <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <strong>🌐 Portal de Acesso:</strong> http://localhost:5173/PortalLogin
              </div>
              
              <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <strong>🔢 Número de Associado:</strong> ${dados.numero_associado || 'N/A'}
              </div>
              
              <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <strong>🔑 Senha Temporária:</strong> ${dados.senha_temporaria || 'N/A'}
              </div>
              
              <div style="background-color: white; border: 1px solid #e0f2fe; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <strong>📋 Plano Escolhido:</strong> ${dados.nome_plano || 'N/A'}
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
    }
    
    // Template padrão para outros eventos
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Notificação - Cooperativa Sanep</h2>
        <p>Este é um e-mail automático do sistema.</p>
        <p>Evento: ${evento}</p>
        <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `;
  }
}

export default EmailService;