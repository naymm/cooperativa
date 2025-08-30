#!/usr/bin/env node

console.log('🧪 Testando EmailJS real...');

// Configuração do EmailJS
const EMAILJS_CONFIG = {
  serviceId: 'service_8tn37e3',
  templateId: 'template_t1jxoz4',
  userId: 'kBlY0Gh4viVUScO_M'
};

// Dados de teste
const dadosTeste = {
  destinatario: 'contacto.aguia@gmail.com',
  nome_cooperado: 'João Silva Teste',
  numero_associado: 'CS123456',
  senha_temporaria: 'ABC12345',
  nome_plano: 'Plano Básico',
  data_aprovacao: new Date().toLocaleDateString('pt-BR')
};

async function testarEmailJS() {
  try {
    console.log('1. Configurando EmailJS...');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('User ID:', EMAILJS_CONFIG.userId);
    
    console.log('\n2. Enviando e-mail de teste...');
    console.log('Para:', dadosTeste.destinatario);
    
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.userId,
        template_params: {
          to_email: dadosTeste.destinatario,
          to_name: dadosTeste.nome_cooperado,
          subject: '🎉 Teste EmailJS - Bem-vindo(a) à Cooperativa Sanep',
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>🎉 Teste EmailJS Real</h2>
              <p>Este é um teste do EmailJS configurado!</p>
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4>✅ EmailJS Funcionando!</h4>
                <p>Se você recebeu este email, o EmailJS está configurado corretamente!</p>
              </div>
              <p><strong>Dados do teste:</strong></p>
              <ul>
                <li>Nome: ${dadosTeste.nome_cooperado}</li>
                <li>Número: ${dadosTeste.numero_associado}</li>
                <li>Senha: ${dadosTeste.senha_temporaria}</li>
                <li>Plano: ${dadosTeste.nome_plano}</li>
              </ul>
              <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
                Data do teste: ${new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          `,
          nome_cooperado: dadosTeste.nome_cooperado,
          numero_associado: dadosTeste.numero_associado,
          senha_temporaria: dadosTeste.senha_temporaria,
          nome_plano: dadosTeste.nome_plano,
          data_aprovacao: dadosTeste.data_aprovacao
        }
      })
    });
    
    console.log('3. Resposta do EmailJS:');
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    if (response.ok) {
      const resultado = await response.text();
      console.log('Resposta:', resultado);
      console.log('\n✅ EmailJS funcionando! E-mail enviado com sucesso!');
      console.log('📧 Verifique se o e-mail foi recebido em:', dadosTeste.destinatario);
    } else {
      const erro = await response.text();
      console.error('❌ Erro do EmailJS:', erro);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar EmailJS:', error);
  }
}

// Executar o teste
testarEmailJS();
