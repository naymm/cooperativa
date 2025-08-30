#!/usr/bin/env node

console.log('🎉 TESTE TEMPLATE BOAS-VINDAS - template_zwuni7r');
console.log('');

console.log('📋 INSTRUÇÕES:');
console.log('1. Abra o navegador e acesse: http://localhost:5173/Inscricoes');
console.log('2. Abra o Console do navegador (F12)');
console.log('3. Cole e execute este código:');
console.log('');

const codigoTeste = `
// 🎉 TESTE TEMPLATE BOAS-VINDAS - template_zwuni7r
console.log('🎯 Iniciando teste do template de boas-vindas...');

// Configuração
const config = {
  serviceId: 'service_8tn37e3',
  templateId: 'template_zwuni7r', // Template específico para boas-vindas
  userId: 'kBlY0Gh4viVUScO_M'
};

// Dados de teste (simulando aprovação de inscrição)
const dados = {
  destinatario: 'contacto.aguia@gmail.com',
  nome_cooperado: 'João Silva Teste',
  numero_associado: 'CS123456',
  senha_temporaria: 'ABC12345',
  nome_plano: 'Plano Básico',
  data_aprovacao: new Date().toLocaleDateString('pt-BR')
};

// Função de teste
async function testarTemplateBoasVindas() {
  try {
    console.log('📧 Enviando e-mail de boas-vindas...');
    console.log('Para:', dados.destinatario);
    console.log('Template:', config.templateId);
    console.log('Dados:', dados);

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
          to_name: dados.nome_cooperado,
          subject: '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
          nome_cooperado: dados.nome_cooperado,
          numero_associado: dados.numero_associado,
          senha_temporaria: dados.senha_temporaria,
          nome_plano: dados.nome_plano,
          data_aprovacao: dados.data_aprovacao,
          email: dados.destinatario,
          user_email: dados.destinatario,
          recipient_email: dados.destinatario,
          portal_url: 'http://localhost:5173/PortalLogin',
          empresa_nome: 'Cooperativa Sanep',
          empresa_email: 'suporte@cooperativasanep.co.ao',
          empresa_telefone: '+244 123 456 789',
          empresa_endereco: 'Luanda, Angola'
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
      console.log('🎉 O e-mail deve conter as credenciais de acesso!');
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
testarTemplateBoasVindas();
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
console.log('4. Confirme se o e-mail foi enviado com credenciais');

console.log('');
console.log('✅ SISTEMA PRONTO PARA TESTE!');
console.log('🚀 Execute o código acima no console do navegador');
console.log('📧 O e-mail deve usar o template template_zwuni7r com credenciais');
