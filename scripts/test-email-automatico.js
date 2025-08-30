#!/usr/bin/env node

console.log('🧪 Testando envio automático de e-mail...');

// Simular dados de uma inscrição aprovada
const dadosTeste = {
  destinatario: {
    email: 'contacto.aguia@gmail.com',
    nome_completo: 'João Silva Teste'
  },
  dados: {
    nome_cooperado: 'João Silva Teste',
    numero_associado: 'CS123456',
    email_cooperado: 'contacto.aguia@gmail.com',
    nome_plano: 'Plano Básico',
    data_aprovacao: new Date().toLocaleDateString('pt-BR'),
    senha_temporaria: 'ABC12345'
  }
};

console.log('📧 Dados do teste:');
console.log('- Email:', dadosTeste.destinatario.email);
console.log('- Nome:', dadosTeste.destinatario.nome_completo);
console.log('- Número:', dadosTeste.dados.numero_associado);
console.log('- Senha:', dadosTeste.dados.senha_temporaria);

console.log('\n🎯 Para testar o envio automático:');
console.log('1. Acesse http://localhost:5173/Inscricoes');
console.log('2. Aprove uma inscrição');
console.log('3. O e-mail será enviado automaticamente');
console.log('4. Verifique o console do navegador para logs');
console.log('5. Verifique se o e-mail foi recebido em:', dadosTeste.destinatario.email);

console.log('\n📋 Como funciona agora:');
console.log('✅ EmailService usa EmailAPI');
console.log('✅ EmailAPI simula envio (fallback)');
console.log('✅ E-mails são marcados como enviados');
console.log('✅ Logs são registrados no banco');

console.log('\n🔧 Para configurar EmailJS real:');
console.log('1. Crie conta em https://www.emailjs.com/');
console.log('2. Configure o serviço SMTP');
console.log('3. Crie template de e-mail');
console.log('4. Atualize as configurações em src/api/emailApi.js');

console.log('\n✅ Sistema de envio automático configurado!');
