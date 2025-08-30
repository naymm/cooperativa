#!/usr/bin/env node

import nodemailer from 'nodemailer';

console.log('📧 Enviando e-mail de boas-vindas para inscrição...');

// Configuração SMTP
const configSMTP = {
  servidor: "mail.hoteldompedro.co.ao",
  porta: "465",
  email: "cooperativa@hoteldompedro.co.ao",
  senha: "Cooperativa2024",
  nome_remetente: "Cooperativa Sanep"
};

// Dados do e-mail (você pode modificar estes dados)
const dadosInscricao = {
  destinatario: 'contacto.aguia@gmail.com', // Email do cooperado
  nome_cooperado: 'João Silva', // Nome do cooperado
  numero_associado: 'CS123456', // Número de associado gerado
  senha_temporaria: 'ABC12345', // Senha temporária gerada
  nome_plano: 'Plano Básico', // Nome do plano escolhido
  data_aprovacao: new Date().toLocaleDateString('pt-BR')
};

// Template HTML do e-mail
const templateHTML = `
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
    .credentials-box { 
      background-color: #f0f9ff; 
      border: 2px solid #0ea5e9; 
      border-radius: 12px; 
      padding: 25px; 
      margin: 25px 0; 
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
    .footer { 
      background-color: #f8fafc; 
      padding: 20px; 
      text-align: center; 
      border-top: 1px solid #e2e8f0; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 Cooperativa Sanep</h1>
      <p>Habitação e Construção</p>
    </div>
    
    <div class="content">
      <div class="welcome-box">
        <h2>🎉 Bem-vindo(a) à Cooperativa Sanep!</h2>
        <p>Olá ${dadosInscricao.nome_cooperado},</p>
        <p>Sua inscrição foi aprovada com sucesso em ${dadosInscricao.data_aprovacao}!</p>
      </div>
      
      <div class="credentials-box">
        <h3>🔐 Suas Credenciais de Acesso</h3>
        <p>Use estas credenciais para acessar o Portal do Cooperado:</p>
        
        <div class="credential-item">
          <span>🌐 Portal de Acesso:</span>
          <span>http://localhost:5173/PortalLogin</span>
        </div>
        
        <div class="credential-item">
          <span>🔢 Número de Associado:</span>
          <span>${dadosInscricao.numero_associado}</span>
        </div>
        
        <div class="credential-item">
          <span>🔑 Senha Temporária:</span>
          <span>${dadosInscricao.senha_temporaria}</span>
        </div>
        
        <div class="credential-item">
          <span>📋 Plano Escolhido:</span>
          <span>${dadosInscricao.nome_plano}</span>
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
    
    <div class="footer">
      <p><strong>Cooperativa Sanep - Habitação e Construção</strong></p>
      <p>📧 suporte@cooperativasanep.co.ao | 📞 +244 123 456 789</p>
      <p>📍 Luanda, Angola</p>
    </div>
  </div>
</body>
</html>
`;

async function enviarEmailInscricao() {
  try {
    console.log('1. Configurando transporter SMTP...');
    
    const transporter = nodemailer.createTransport({
      host: configSMTP.servidor,
      port: parseInt(configSMTP.porta),
      secure: configSMTP.porta === '465',
      auth: {
        user: configSMTP.email,
        pass: configSMTP.senha
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('2. Testando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP OK');

    console.log('3. Enviando e-mail de boas-vindas...');
    console.log(`📧 Para: ${dadosInscricao.destinatario}`);
    console.log(`👤 Nome: ${dadosInscricao.nome_cooperado}`);
    console.log(`🔢 Número: ${dadosInscricao.numero_associado}`);
    console.log(`🔑 Senha: ${dadosInscricao.senha_temporaria}`);

    const mailOptions = {
      from: `"${configSMTP.nome_remetente}" <${configSMTP.email}>`,
      to: dadosInscricao.destinatario,
      subject: '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
      html: templateHTML
    };

    const resultado = await transporter.sendMail(mailOptions);
    
    console.log('✅ E-mail de boas-vindas enviado com sucesso!');
    console.log('📧 Message ID:', resultado.messageId);
    console.log('📧 Para:', resultado.accepted);
    
    console.log('\n🎯 E-mail enviado!');
    console.log('📧 Verifique se o e-mail foi recebido em:', dadosInscricao.destinatario);
    console.log('\n📋 Dados enviados:');
    console.log('- Nome:', dadosInscricao.nome_cooperado);
    console.log('- Número de Associado:', dadosInscricao.numero_associado);
    console.log('- Senha Temporária:', dadosInscricao.senha_temporaria);
    console.log('- Plano:', dadosInscricao.nome_plano);

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
  }
}

// Executar o envio
enviarEmailInscricao();
