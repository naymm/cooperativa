// Templates de email para cobrança de pagamentos em atraso

export const emailTemplates = {
  // Email de boas-vindas e credenciais de acesso
  boas_vindas_cooperado: {
    evento: 'boas_vindas_cooperado',
    assunto: '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
    corpo_html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo(a) à Cooperativa Sanep</title>
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
          .welcome-box { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            border-radius: 12px; 
            padding: 25px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .welcome-icon { 
            font-size: 48px; 
            margin-bottom: 15px; 
          }
          .welcome-title { 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0 0 10px 0; 
          }
          .welcome-subtitle { 
            font-size: 16px; 
            opacity: 0.9; 
            margin: 0; 
          }
          .credentials-box { 
            background-color: #f0f9ff; 
            border: 2px solid #0ea5e9; 
            border-radius: 12px; 
            padding: 25px; 
            margin: 25px 0; 
          }
          .credentials-title { 
            color: #0369a1; 
            font-size: 20px; 
            font-weight: 600; 
            margin: 0 0 20px 0; 
            text-align: center; 
          }
          .credential-item { 
            background-color: white; 
            border: 1px solid #e0f2fe; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 15px 0; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
          }
          .credential-label { 
            font-weight: 600; 
            color: #0c4a6e; 
            font-size: 14px; 
          }
          .credential-value { 
            font-weight: 700; 
            color: #0369a1; 
            font-size: 16px; 
            background-color: #f0f9ff; 
            padding: 8px 12px; 
            border-radius: 6px; 
            border: 1px solid #0ea5e9; 
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
          .portal-section { 
            background-color: #f0fdf4; 
            border: 1px solid #bbf7d0; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .portal-title { 
            color: #166534; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0 0 15px 0; 
          }
          .portal-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            text-decoration: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 10px; 
            transition: all 0.3s ease; 
          }
          .portal-button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); 
          }
          .contact-section { 
            background-color: #fef3c7; 
            border: 1px solid #fbbf24; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .contact-title { 
            color: #92400e; 
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
            color: #92400e; 
            font-size: 14px; 
            margin-bottom: 5px; 
          }
          .contact-value { 
            color: #a16207; 
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
          .security-notice { 
            background-color: #fef2f2; 
            border: 1px solid #fecaca; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .security-notice h4 { 
            color: #dc2626; 
            margin: 0 0 10px 0; 
            font-size: 16px; 
            font-weight: 600; 
          }
          .security-notice p { 
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
            .credential-item { flex-direction: column; text-align: center; gap: 10px; }
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
            <!-- Boas-vindas -->
            <div class="welcome-box">
              <div class="welcome-icon">🎉</div>
              <h2 class="welcome-title">Bem-vindo(a) à Cooperativa Sanep!</h2>
              <p class="welcome-subtitle">
                Sua inscrição foi aprovada com sucesso!
              </p>
            </div>
            
            <!-- Informações do Cooperado -->
            <div class="cooperado-info">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; text-align: center;">
                📋 Informações do Cooperado
              </h3>
              <div class="info-row">
                <span class="info-label">Nome Completo:</span>
                <span class="info-value">{{nome_cooperado}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Número de Associado:</span>
                <span class="info-value">{{numero_associado}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{email_cooperado}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Plano de Assinatura:</span>
                <span class="info-value">{{nome_plano}}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Data de Aprovação:</span>
                <span class="info-value">{{data_aprovacao}}</span>
              </div>
            </div>
            
            <!-- Credenciais de Acesso -->
            <div class="credentials-box">
              <h3 class="credentials-title">🔐 Suas Credenciais de Acesso</h3>
              <p style="text-align: center; color: #0c4a6e; margin-bottom: 20px;">
                Use estas credenciais para acessar o Portal do Cooperado:
              </p>
              
              <div class="credential-item">
                <span class="credential-label">🌐 Portal de Acesso:</span>
                <span class="credential-value">http://localhost:5173/PortalLogin</span>
              </div>
              
              <div class="credential-item">
                <span class="credential-label">🔢 Número de Associado:</span>
                <span class="credential-value">{{numero_associado}}</span>
              </div>
              
              <div class="credential-item">
                <span class="credential-label">🔑 Senha Temporária:</span>
                <span class="credential-value">{{senha_temporaria}}</span>
              </div>
            </div>
            
            <!-- Acesso ao Portal -->
            <div class="portal-section">
              <h3 class="portal-title">🚀 Acesse Seu Portal</h3>
              <p style="color: #166534; margin-bottom: 20px;">
                Clique no botão abaixo para acessar o Portal do Cooperado:
              </p>
              <a href="http://localhost:5173/PortalLogin" class="portal-button">
                🌐 Acessar Portal do Cooperado
              </a>
            </div>
            
            <!-- Aviso de Segurança -->
            <div class="security-notice">
              <h4>🔒 Importante - Segurança</h4>
              <p>
                • Esta é uma senha temporária - altere-a no primeiro acesso<br>
                • Mantenha suas credenciais em local seguro<br>
                • Não compartilhe suas credenciais com terceiros<br>
                • Em caso de dúvidas, entre em contato conosco
              </p>
            </div>
            
            <!-- Seção de Contato -->
            <div class="contact-section">
              <h3 class="contact-title">📞 Suporte e Contato</h3>
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
                  <div class="contact-value">suporte@cooperativasanep.co.ao</div>
                </div>
              </div>
            </div>
            
            <!-- Mensagem Final -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Prezado(a) <strong>{{nome_cooperado}}</strong>,<br><br>
                É com grande satisfação que damos as boas-vindas à <strong>Cooperativa Sanep</strong>!<br><br>
                Sua inscrição foi aprovada e você agora é um membro oficial da nossa cooperativa.<br>
                Acesse o portal para gerenciar sua participação, acompanhar projetos e pagamentos.
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
            <p>📧 suporte@cooperativasanep.co.ao | 📞 +244 123 456 789</p>
            <p>📍 Luanda, Angola</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
              Este é um email automático. Por favor, não responda a esta mensagem.<br>
              Data de envio: {{data_atual}}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // Cobrança inicial (1-14 dias em atraso)
  cobranca_atraso: {
    evento: 'cobranca_atraso',
    assunto: 'Lembrete: Pagamento em Atraso - Cooperativa Sanep',
    corpo_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0; text-align: center;">Cooperativa Sanep</h2>
          <p style="color: #7f8c8d; text-align: center; margin: 5px 0;">Cooperativa de Habitação</p>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Pagamento em Atraso</h3>
          <p style="color: #856404; margin: 0;">Prezado(a) <strong>{{nome_cooperado}}</strong>,</p>
        </div>
        
        <div style="line-height: 1.6; color: #2c3e50;">
          <p>Informamos que seu pagamento mensal encontra-se em atraso.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Detalhes do Pagamento:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Número de Associado:</strong> {{numero_associado}}</li>
              <li><strong>Plano:</strong> {{nome_plano}}</li>
              <li><strong>Valor:</strong> {{valor_pagamento}} Kz</li>
              <li><strong>Mês de Referência:</strong> {{mes_referencia}}</li>
              <li><strong>Data de Vencimento:</strong> {{data_vencimento}}</li>
              <li><strong>Dias em Atraso:</strong> {{dias_atraso}} dias</li>
            </ul>
          </div>
          
          <p>Para regularizar sua situação e evitar consequências, solicitamos que efetue o pagamento o quanto antes.</p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #155724;">📞 Entre em Contato:</h4>
            <p style="margin: 0; color: #155724;">
              <strong>Telefone:</strong> {{telefone_cooperativa}}<br>
              <strong>Email:</strong> {{email_cooperativa}}
            </p>
          </div>
          
          <p>Agradecemos sua atenção e aguardamos o pagamento.</p>
          
          <p style="margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe CoopHabitat</strong><br>
            <em>{{data_atual}}</em>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
          <p style="margin: 0;">Este é um email automático. Por favor, não responda a esta mensagem.</p>
        </div>
      </div>
    `
  },
  
  // Cobrança média (15-29 dias em atraso)
  cobranca_atraso_medio: {
    evento: 'cobranca_atraso_medio',
    assunto: 'URGENTE: Pagamento em Atraso - Ação Necessária - Cooperativa Sanep',
    corpo_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0; text-align: center;">Cooperativa Sanep</h2>
          <p style="color: #7f8c8d; text-align: center; margin: 5px 0;">Cooperativa de Habitação</p>
        </div>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #721c24; margin: 0 0 10px 0;">🚨 ATENÇÃO: Pagamento em Atraso Crítico</h3>
          <p style="color: #721c24; margin: 0;">Prezado(a) <strong>{{nome_cooperado}}</strong>,</p>
        </div>
        
        <div style="line-height: 1.6; color: #2c3e50;">
          <p>Seu pagamento mensal encontra-se em <strong>atraso crítico</strong> há {{dias_atraso}} dias.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Detalhes do Pagamento:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Número de Associado:</strong> {{numero_associado}}</li>
              <li><strong>Plano:</strong> {{nome_plano}}</li>
              <li><strong>Valor:</strong> {{valor_pagamento}} Kz</li>
              <li><strong>Mês de Referência:</strong> {{mes_referencia}}</li>
              <li><strong>Data de Vencimento:</strong> {{data_vencimento}}</li>
              <li><strong>Dias em Atraso:</strong> {{dias_atraso}} dias</li>
            </ul>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ Importante:</h4>
            <p style="margin: 0; color: #856404;">
              O não pagamento pode resultar em:<br>
              • Suspensão de benefícios<br>
              • Acúmulo de juros e multas<br>
              • Possível cancelamento da associação
            </p>
          </div>
          
          <p><strong>SOLICITAMOS URGENTEMENTE</strong> que entre em contato conosco para regularizar sua situação.</p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #155724;">📞 Contato Imediato:</h4>
            <p style="margin: 0; color: #155724;">
              <strong>Telefone:</strong> {{telefone_cooperativa}}<br>
              <strong>Email:</strong> {{email_cooperativa}}
            </p>
          </div>
          
          <p>Agradecemos sua atenção imediata a esta situação.</p>
          
          <p style="margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe de Cobrança - Cooperativa Sanep</strong><br>
            <em>{{data_atual}}</em>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
          <p style="margin: 0;">Este é um email automático. Por favor, não responda a esta mensagem.</p>
        </div>
      </div>
    `
  },
  
  // Cobrança grave (30+ dias em atraso)
  cobranca_atraso_grave: {
    evento: 'cobranca_atraso_grave',
    assunto: 'CRÍTICO: Pagamento em Atraso Grave - Ação Imediata Necessária - Cooperativa Sanep',
    corpo_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin: 0; text-align: center;">Cooperativa Sanep</h2>
          <p style="color: #7f8c8d; text-align: center; margin: 5px 0;">Cooperativa de Habitação</p>
        </div>
        
        <div style="background-color: #f8d7da; border: 2px solid #dc3545; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #721c24; margin: 0 0 10px 0;">🚨 CRÍTICO: Pagamento em Atraso Grave</h3>
          <p style="color: #721c24; margin: 0;">Prezado(a) <strong>{{nome_cooperado}}</strong>,</p>
        </div>
        
        <div style="line-height: 1.6; color: #2c3e50;">
          <p>Seu pagamento mensal encontra-se em <strong>atraso grave</strong> há {{dias_atraso}} dias.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Detalhes do Pagamento:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Número de Associado:</strong> {{numero_associado}}</li>
              <li><strong>Plano:</strong> {{nome_plano}}</li>
              <li><strong>Valor:</strong> {{valor_pagamento}} Kz</li>
              <li><strong>Mês de Referência:</strong> {{mes_referencia}}</li>
              <li><strong>Data de Vencimento:</strong> {{data_vencimento}}</li>
              <li><strong>Dias em Atraso:</strong> {{dias_atraso}} dias</li>
            </ul>
          </div>
          
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #721c24;">🚨 CONSEQUÊNCIAS IMINENTES:</h4>
            <p style="margin: 0; color: #721c24;">
              • Suspensão imediata de todos os benefícios<br>
              • Acúmulo de juros e multas significativas<br>
              • Processo de cancelamento da associação<br>
              • Possível ação legal para cobrança
            </p>
          </div>
          
          <p><strong>EXIGIMOS CONTATO IMEDIATO</strong> para evitar consequências irreversíveis.</p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #155724;">📞 CONTATO URGENTE:</h4>
            <p style="margin: 0; color: #155724;">
              <strong>Telefone:</strong> {{telefone_cooperativa}}<br>
              <strong>Email:</strong> {{email_cooperativa}}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Opções de Regularização:</h4>
            <p style="margin: 0; color: #856404;">
              • Pagamento integral imediato<br>
              • Acordo de parcelamento<br>
              • Reestruturação do plano
            </p>
          </div>
          
          <p>Esta é a <strong>última notificação</strong> antes de medidas mais drásticas.</p>
          
          <p style="margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Direção - CoopHabitat</strong><br>
            <em>{{data_atual}}</em>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
          <p style="margin: 0;">Este é um email automático. Por favor, não responda a esta mensagem.</p>
        </div>
      </div>
    `
  }
};

export default emailTemplates; 