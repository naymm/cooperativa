#!/usr/bin/env node

console.log('🧪 Teste Simples do EmailJS no Navegador');
console.log('');

console.log('📋 Para testar:');
console.log('1. Abra o navegador e acesse: http://localhost:5173/Inscricoes');
console.log('2. Abra o Console do navegador (F12)');
console.log('3. Cole e execute este código:');
console.log('');

const codigoTeste = `
// Teste simples do EmailJS
console.log('🧪 Testando EmailJS...');

// Configuração
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

// Teste direto do EmailJS
async function testarEmailJS() {
  try {
    console.log('📧 Enviando e-mail de teste...');
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
          subject: '🎉 Teste EmailJS - Cooperativa Sanep',
          message: '<h2>Teste EmailJS</h2><p>Se você recebeu este email, o EmailJS está funcionando!</p>',
          nome_cooperado: dadosTeste.nome_cooperado,
          numero_associado: dadosTeste.numero_associado,
          senha_temporaria: dadosTeste.senha_temporaria,
          nome_plano: dadosTeste.nome_plano,
          data_aprovacao: dadosTeste.data_aprovacao
        }
      })
    });
    
    console.log('📊 Resposta:', response.status, response.ok);
    
    if (response.ok) {
      const resultado = await response.text();
      console.log('✅ Sucesso! Resposta:', resultado);
      console.log('📧 Verifique se o e-mail foi recebido em:', dadosTeste.destinatario);
    } else {
      const erro = await response.text();
      console.error('❌ Erro:', erro);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar:', error);
  }
}

// Executar o teste
testarEmailJS();
`;

console.log('📝 Código para executar:');
console.log('='.repeat(60));
console.log(codigoTeste);
console.log('='.repeat(60));

console.log('');
console.log('🎯 Alternativa - Teste via sistema:');
console.log('1. Acesse http://localhost:5173/Inscricoes');
console.log('2. Aprove uma inscrição');
console.log('3. Verifique o console para logs');
console.log('4. Confirme se o e-mail foi enviado');

console.log('');
console.log('✅ Sistema pronto para teste!');
