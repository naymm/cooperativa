import nodemailer from 'nodemailer';

class EmailServiceDirect {
  constructor() {
    this.transporter = null;
    this.configuracao = null;
  }

  // Configurar o transporter SMTP
  configurarSMTP(config) {
    this.configuracao = config;
    
    this.transporter = nodemailer.createTransporter({
      host: config.servidor,
      port: parseInt(config.porta),
      secure: config.porta === '465', // true para 465, false para outras portas
      auth: {
        user: config.email,
        pass: config.senha
      },
      tls: {
        rejectUnauthorized: false // Para desenvolvimento
      }
    });

    console.log('[EmailServiceDirect] SMTP configurado:', {
      host: config.servidor,
      port: config.porta,
      user: config.email
    });
  }

  // Verificar se o SMTP está configurado
  isConfigurado() {
    return this.transporter !== null;
  }

  // Testar conexão SMTP
  async testarConexao() {
    if (!this.isConfigurado()) {
      throw new Error('SMTP não configurado');
    }

    try {
      await this.transporter.verify();
      console.log('[EmailServiceDirect] Conexão SMTP verificada com sucesso');
      return true;
    } catch (error) {
      console.error('[EmailServiceDirect] Erro ao verificar conexão SMTP:', error);
      throw error;
    }
  }

  // Enviar email
  async enviarEmail(destinatario, assunto, corpoHTML, opcoes = {}) {
    if (!this.isConfigurado()) {
      throw new Error('SMTP não configurado. Configure o SMTP primeiro.');
    }

    try {
      const mailOptions = {
        from: `"${this.configuracao.nome_remetente}" <${this.configuracao.email}>`,
        to: destinatario,
        subject: assunto,
        html: corpoHTML,
        ...opcoes
      };

      console.log(`[EmailServiceDirect] Enviando email para: ${destinatario}`);
      
      const resultado = await this.transporter.sendMail(mailOptions);
      
      console.log(`[EmailServiceDirect] Email enviado com sucesso para: ${destinatario}`);
      console.log('[EmailServiceDirect] Message ID:', resultado.messageId);
      
      return {
        sucesso: true,
        messageId: resultado.messageId,
        destinatario
      };
      
    } catch (error) {
      console.error(`[EmailServiceDirect] Erro ao enviar email para ${destinatario}:`, error);
      throw error;
    }
  }

  // Enviar email de teste
  async enviarEmailTeste(destinatario) {
    const assunto = "Teste de Configuração SMTP - Cooperativa Sanep";
    const corpoHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">✅ Teste de Configuração SMTP</h2>
        <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4>Detalhes da Configuração:</h4>
          <ul>
            <li><strong>Servidor:</strong> ${this.configuracao.servidor}</li>
            <li><strong>Porta:</strong> ${this.configuracao.porta}</li>
            <li><strong>Email:</strong> ${this.configuracao.email}</li>
            <li><strong>Remetente:</strong> ${this.configuracao.nome_remetente}</li>
          </ul>
        </div>
        
        <p style="color: #27ae60; font-weight: bold;">
          ✅ Se você recebeu este email, a configuração SMTP está funcionando!
        </p>
        
        <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
          Data do teste: ${new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    `;

    return await this.enviarEmail(destinatario, assunto, corpoHTML);
  }

  // Enviar email de cobrança
  async enviarEmailCobranca(destinatario, dadosCobranca) {
    const { cooperado, tipo, valor, vencimento, dias } = dadosCobranca;
    
    const assunto = tipo === 'atraso' 
      ? `🚨 PAGAMENTO EM ATRASO - ${dias} dias - Cooperativa Sanep`
      : `⏰ Lembrete: Pagamento vence em ${dias} dias - Cooperativa Sanep`;

    const corpoHTML = this.gerarTemplateEmailCobranca(cooperado, tipo, valor, vencimento, dias);

    return await this.enviarEmail(destinatario, assunto, corpoHTML);
  }

  // Gerar template HTML para email de cobrança
  gerarTemplateEmailCobranca(cooperado, tipo, valor, vencimento, dias) {
    const hoje = new Date();
    const dataAtual = hoje.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    const dataVencimento = vencimento.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    
    const isAtraso = tipo === 'atraso';
    const diasTexto = isAtraso ? `${dias} dias` : `${dias} dias`;
    
    const corPrimaria = isAtraso ? '#dc2626' : '#ea580c';
    const corSecundaria = isAtraso ? '#fef2f2' : '#fff7ed';
    const corBorda = isAtraso ? '#fecaca' : '#fed7aa';
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isAtraso ? 'Pagamento em Atraso' : 'Lembrete de Pagamento'} - Cooperativa Sanep</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
          }
          .header p { 
            margin: 5px 0 0 0; 
            font-size: 16px; 
            opacity: 0.9; 
          }
          .content { 
            padding: 30px 20px; 
          }
          .alert-box { 
            background-color: ${corSecundaria}; 
            border: 2px solid ${corBorda}; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .alert-icon { 
            font-size: 48px; 
            margin-bottom: 10px; 
          }
          .alert-title { 
            color: ${corPrimaria}; 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0 0 10px 0; 
          }
          .alert-subtitle { 
            color: ${corPrimaria}; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0; 
          }
          .cooperado-info { 
            background-color: #f8fafc; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            padding-bottom: 8px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .info-row:last-child { 
            border-bottom: none; 
            margin-bottom: 0; 
          }
          .info-label { 
            font-weight: 600; 
            color: #475569; 
          }
          .info-value { 
            font-weight: 500; 
            color: #1e293b; 
          }
          .payment-details { 
            background-color: #f0f9ff; 
            border: 1px solid #bae6fd; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .payment-title { 
            color: #0369a1; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0 0 15px 0; 
            text-align: center; 
          }
          .contact-section { 
            background-color: #f0fdf4; 
            border: 1px solid #bbf7d0; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .contact-title { 
            color: #166534; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0 0 15px 0; 
          }
          .contact-info { 
            display: flex; 
            justify-content: space-around; 
            flex-wrap: wrap; 
            gap: 15px; 
          }
          .contact-item { 
            text-align: center; 
          }
          .contact-label { 
            font-weight: 600; 
            color: #166534; 
            font-size: 14px; 
            margin-bottom: 5px; 
          }
          .contact-value { 
            color: #15803d; 
            font-size: 16px; 
            font-weight: 500; 
          }
          .footer { 
            background-color: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            border-top: 1px solid #e2e8f0; 
          }
          .footer p { 
            margin: 5px 0; 
            color: #64748b; 
            font-size: 14px; 
          }
          .urgent-notice { 
            background-color: #fef2f2; 
            border: 2px solid #fecaca; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .urgent-notice h3 { 
            color: #dc2626; 
            margin: 0 0 10px 0; 
            font-size: 16px; 
            font-weight: 600; 
          }
          .urgent-notice p { 
            color: #991b1b; 
            margin: 0; 
            font-size: 14px; 
          }
          @media (max-width: 600px) {
            .container { margin: 0; }
            .content { padding: 20px 15px; }
            .header { padding: 20px 15px; }
            .header h1 { font-size: 24px; }
            .contact-info { flex-direction: column; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Cabeçalho -->
          <div class="header">
            <h1>🏠 Cooperativa Sanep</h1>
            <p>Habitação e Construção</p>
          </div>
          
          <!-- Conteúdo Principal -->
          <div class="content">
            <!-- Alerta Principal -->
            <div class="alert-box">
              <div class="alert-icon">${isAtraso ? '⚠️' : '⏰'}</div>
              <h2 class="alert-title">
                ${isAtraso ? 'PAGAMENTO EM ATRASO' : 'LEMBRETE DE PAGAMENTO'}
              </h2>
              <p class="alert-subtitle">
                ${isAtraso ? `Seu pagamento está ${diasTexto} em atraso` : `Seu pagamento vence em ${diasTexto}`}
              </p>
            </div>
            
            <!-- Informações do Cooperado -->
            <div class="cooperado-info">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; text-align: center;">
                📋 Informações do Cooperado
              </h3>
              <div class="info-row">
                <span class="info-label">Nome Completo:</span>
                <span class="info-value">${cooperado.nome_completo}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Número de Associado:</span>
                <span class="info-value">${cooperado.numero_associado}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${cooperado.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Telefone:</span>
                <span class="info-value">${cooperado.telefone || 'Não informado'}</span>
              </div>
            </div>
            
            <!-- Detalhes do Pagamento -->
            <div class="payment-details">
              <h3 class="payment-title">💰 Detalhes do Pagamento</h3>
              <div class="info-row">
                <span class="info-label">Valor da Mensalidade:</span>
                <span class="info-value">${valor?.toLocaleString()} Kz</span>
              </div>
              <div class="info-row">
                <span class="info-label">Data de Vencimento:</span>
                <span class="info-value">${dataVencimento}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value" style="color: ${corPrimaria}; font-weight: 600;">
                  ${isAtraso ? 'EM ATRASO' : 'PRÓXIMO DO VENCIMENTO'}
                </span>
              </div>
              ${isAtraso ? `
              <div class="info-row">
                <span class="info-label">Dias em Atraso:</span>
                <span class="info-value" style="color: ${corPrimaria}; font-weight: 600;">
                  ${dias} dias
                </span>
              </div>
              ` : ''}
            </div>
            
            ${isAtraso ? `
            <!-- Aviso Urgente para Pagamentos em Atraso -->
            <div class="urgent-notice">
              <h3>🚨 ATENÇÃO IMPORTANTE</h3>
              <p>
                O não pagamento pode resultar em:<br>
                • Suspensão de benefícios da cooperativa<br>
                • Acúmulo de juros e multas<br>
                • Possível cancelamento da associação
              </p>
            </div>
            ` : ''}
            
            <!-- Seção de Contato -->
            <div class="contact-section">
              <h3 class="contact-title">📞 Entre em Contato</h3>
              <div class="contact-info">
                <div class="contact-item">
                  <div class="contact-label">Telefone</div>
                  <div class="contact-value">+244 123 456 789</div>
                </div>
                <div class="contact-item">
                  <div class="contact-label">WhatsApp</div>
                  <div class="contact-value">+244 123 456 789</div>
                </div>
                <div class="contact-item">
                  <div class="contact-label">Email</div>
                  <div class="contact-value">cobranca@cooperativasanep.co.ao</div>
                </div>
              </div>
            </div>
            
            <!-- Mensagem Final -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                ${isAtraso 
                  ? `Prezado(a) <strong>${cooperado.nome_completo}</strong>,<br><br>
                     Informamos que seu pagamento mensal encontra-se <strong>${diasTexto} em atraso</strong>.<br>
                     Para regularizar sua situação e evitar consequências, entre em contato conosco o quanto antes.`
                  : `Prezado(a) <strong>${cooperado.nome_completo}</strong>,<br><br>
                     Lembramos que seu pagamento mensal vence em <strong>${diasTexto}</strong>.<br>
                     Para evitar atrasos, efetue o pagamento dentro do prazo estabelecido.`
                }
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Atenciosamente,<br>
                Equipe Cooperativa Sanep</strong>
              </p>
            </div>
          </div>
          
          <!-- Rodapé -->
          <div class="footer">
            <p><strong>Cooperativa Sanep - Habitação e Construção</strong></p>
            <p>📧 cobranca@cooperativasanep.co.ao | 📞 +244 123 456 789</p>
            <p>📍 Luanda, Angola</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
              Este é um email automático. Por favor, não responda a esta mensagem.<br>
              Data de envio: ${dataAtual}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Instância singleton
const emailServiceDirect = new EmailServiceDirect();

export default emailServiceDirect; 