#!/usr/bin/env node

console.log('🧪 TESTE SIMPLES EMAILJS');
console.log('');

console.log('📋 INSTRUÇÕES:');
console.log('1. Abra o navegador e acesse: http://localhost:5173/Inscricoes');
console.log('2. Abra o Console do navegador (F12)');
console.log('3. Cole e execute este código:');
console.log('');

const codigoTeste = `
// 🧪 TESTE SIMPLES EMAILJS
console.log('🎯 Iniciando teste simples do EmailJS...');

// Configuração
const config = {
  serviceId: 'service_8tn37e3',
  templateId: 'template_t1jxoz4',
  userId: 'kBlY0Gh4viVUScO_M'
};

// Dados de teste
const dados = {
  destinatario: 'contacto.aguia@gmail.com',
  nome: 'João Silva Teste',
  numero: 'CS123456',
  senha: 'ABC12345',
  plano: 'Plano Básico',
  data: new Date().toLocaleDateString('pt-BR')
};

// Função de teste
async function testarEmailJSSimples() {
  try {
    console.log('📧 Enviando e-mail...');
    console.log('Para:', dados.destinatario);
    console.log('Config:', config);

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.userId,
        template_params: {
          to_email: dados.destinatario,
          to_name: dados.nome,
          subject: '🎉 Teste EmailJS - Cooperativa Sanep',
          message: '<h2>Teste EmailJS</h2><p>Se você recebeu este email, o EmailJS está funcionando!</p>',
          nome_cooperado: dados.nome,
          numero_associado: dados.numero,
          senha_temporaria: dados.senha,
          nome_plano: dados.plano,
          data_aprovacao: dados.data,
          email: dados.destinatario,
          user_email: dados.destinatario,
          recipient_email: dados.destinatario
        }
      })
    });

    console.log('📊 Status:', response.status);
    console.log('📊 OK:', response.ok);

    if (response.ok) {
      const resultado = await response.text();
      console.log('✅ SUCESSO!');
      console.log('📧 Resposta:', resultado);
      console.log('📧 Verifique:', dados.destinatario);
    } else {
      const erro = await response.text();
      console.error('❌ ERRO:', erro);
      console.log('🔍 Verifique se o template está configurado corretamente');
    }

  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

// Executar teste
testarEmailJSSimples();
`;

console.log('📝 CÓDIGO PARA EXECUTAR:');
console.log('='.repeat(70));
console.log(codigoTeste);
console.log('='.repeat(70));

console.log('');
console.log('🎯 ALTERNATIVA - TESTE VIA SISTEMA:');
console.log('1. Acesse http://localhost:5173/Inscricoes');
console.log('2. Aprove uma inscrição');
console.log('3. Verifique o console para logs');
console.log('4. Confirme se o e-mail foi enviado');

console.log('');
console.log('✅ SISTEMA PRONTO PARA TESTE!');
console.log('🚀 Execute o código acima no console do navegador');
