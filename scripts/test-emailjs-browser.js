#!/usr/bin/env node

console.log('🧪 Testando EmailJS no navegador...');

console.log('📋 Para testar o EmailJS:');
console.log('1. Abra o navegador e acesse: http://localhost:5173/Inscricoes');
console.log('2. Abra o Console do navegador (F12)');
console.log('3. Cole e execute o seguinte código:');

const codigoTeste = `
// Teste do EmailJS no navegador
console.log('🧪 Testando EmailJS...');

const dadosTeste = {
  destinatario: 'contacto.aguia@gmail.com',
  nome_cooperado: 'João Silva Teste',
  numero_associado: 'CS123456',
  senha_temporaria: 'ABC12345',
  nome_plano: 'Plano Básico',
  data_aprovacao: new Date().toLocaleDateString('pt-BR')
};

// Importar EmailAPI
import('/src/api/emailApi.js').then(({ EmailAPI }) => {
  console.log('📧 Enviando e-mail de teste...');
  
  EmailAPI.enviarBoasVindas(dadosTeste.destinatario, dadosTeste)
    .then(resultado => {
      console.log('✅ Resultado:', resultado);
      if (resultado.success) {
        console.log('🎉 E-mail enviado com sucesso!');
        console.log('📧 Verifique:', dadosTeste.destinatario);
      } else {
        console.log('❌ Erro ao enviar e-mail');
      }
    })
    .catch(erro => {
      console.error('❌ Erro:', erro);
    });
}).catch(erro => {
  console.error('❌ Erro ao importar EmailAPI:', erro);
});
`;

console.log('\n📝 Código para executar no console:');
console.log('='.repeat(50));
console.log(codigoTeste);
console.log('='.repeat(50));

console.log('\n🎯 Alternativa - Teste direto:');
console.log('1. Acesse http://localhost:5173/Inscricoes');
console.log('2. Aprove uma inscrição');
console.log('3. O e-mail será enviado automaticamente');
console.log('4. Verifique o console para logs');

console.log('\n✅ Sistema pronto para teste!');
