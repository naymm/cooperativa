#!/usr/bin/env node

console.log('🧪 Testando envio de e-mail de boas-vindas...');

// Dados de teste
const dadosTeste = {
  nome_cooperado: 'João Silva Teste',
  numero_associado: 'CS123456',
  email_cooperado: 'naymupoia@gmail.com',
  nome_plano: 'Plano Básico',
  data_aprovacao: new Date().toLocaleDateString('pt-BR'),
  senha_temporaria: 'ABC12345'
};

console.log('📧 Dados do e-mail:');
console.log('Destinatário:', dadosTeste.email_cooperado);
console.log('Nome:', dadosTeste.nome_cooperado);
console.log('Número:', dadosTeste.numero_associado);
console.log('Senha:', dadosTeste.senha_temporaria);

// Simular o envio de e-mail
console.log('\n📤 Simulando envio de e-mail...');

// Verificar se o template existe
const template = {
  evento: 'boas_vindas_cooperado',
  assunto: '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
  corpo_html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>🎉 Bem-vindo(a) à Cooperativa Sanep!</h1>
      <p>Olá ${dadosTeste.nome_cooperado},</p>
      <p>Sua inscrição foi aprovada com sucesso!</p>
      
      <h2>🔐 Suas Credenciais de Acesso:</h2>
      <ul>
        <li><strong>Número de Associado:</strong> ${dadosTeste.numero_associado}</li>
        <li><strong>Senha Temporária:</strong> ${dadosTeste.senha_temporaria}</li>
        <li><strong>Portal:</strong> http://localhost:5173/PortalLogin</li>
      </ul>
      
      <p>Use estas credenciais para acessar o Portal do Cooperado.</p>
      <p><strong>Importante:</strong> Altere sua senha no primeiro acesso.</p>
    </div>
  `
};

console.log('✅ Template gerado com sucesso');
console.log('📧 Assunto:', template.assunto);
console.log('📝 Conteúdo HTML gerado');

console.log('\n🎯 Para testar o envio real:');
console.log('1. Acesse http://localhost:5173/Inscricoes');
console.log('2. Aprove uma inscrição');
console.log('3. Verifique o console do navegador para logs');
console.log('4. Verifique se o e-mail foi enviado para:', dadosTeste.email_cooperado);

console.log('\n🔍 Possíveis problemas:');
console.log('- Configuração SMTP não está ativa');
console.log('- EmailService não está funcionando');
console.log('- Template não está sendo encontrado');
console.log('- Erro na integração de e-mail');

console.log('\n✅ Script de teste concluído.');
