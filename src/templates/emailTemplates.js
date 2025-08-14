// Templates de email para cobrança de pagamentos em atraso

export const emailTemplates = {
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