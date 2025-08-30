#!/usr/bin/env node

console.log('🎯 TESTE DADOS REAIS DE ACESSO');
console.log('');

console.log('📋 INSTRUÇÕES:');
console.log('1. Abra o navegador e acesse: http://localhost:5173/Inscricoes');
console.log('2. Abra o Console do navegador (F12)');
console.log('3. Cole e execute este código:');
console.log('');

const codigoTeste = `
// 🎯 TESTE DADOS REAIS DE ACESSO
console.log('🎯 Simulando dados reais de aprovação de inscrição...');

// Simular dados reais de uma inscrição aprovada
const inscricao = {
  nome_completo: 'Maria Silva Santos',
  email: 'contacto.aguia@gmail.com',
  telefone: '+244 123 456 789',
  bi: '123456789LA123',
  data_nascimento: '1990-05-15',
  profissao: 'Engenheira Civil',
  renda_mensal: 150000,
  provincia: 'Luanda',
  municipio: 'Luanda',
  comuna: 'Ingombota',
  endereco_completo: 'Rua Comandante Valódia, nº 123, Ingombota, Luanda'
};

// Simular dados gerados automaticamente
const numeroAssociado = 'CS' + Date.now().toString().slice(-6);
const senhaTemporaria = 'ABC' + Math.random().toString(36).substring(2, 7).toUpperCase();
const nomePlano = 'Plano Premium';
const dataAprovacao = new Date().toLocaleDateString('pt-BR');

console.log('📊 DADOS REAIS QUE SERÃO ENVIADOS:');
console.log('='.repeat(50));
console.log('👤 Nome:', inscricao.nome_completo);
console.log('📧 Email:', inscricao.email);
console.log('🔢 Número Associado:', numeroAssociado);
console.log('🔑 Senha Temporária:', senhaTemporaria);
console.log('📋 Plano:', nomePlano);
console.log('📅 Data Aprovação:', dataAprovacao);
console.log('='.repeat(50));

// Configuração EmailJS
const config = {
  serviceId: 'service_8tn37e3',
  templateId: 'template_zwuni7r',
  userId: 'kBlY0Gh4viVUScO_M'
};

// Função para enviar dados reais
async function enviarDadosReais() {
  try {
    console.log('📧 Enviando e-mail com dados reais...');

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
          // Dados básicos
          to_email: inscricao.email,
          to_name: inscricao.nome_completo,
          subject: '🎉 Bem-vindo(a) à Cooperativa Sanep - Suas Credenciais de Acesso',
          
          // Dados do cooperado
          nome_cooperado: inscricao.nome_completo,
          numero_associado: numeroAssociado,
          email_cooperado: inscricao.email,
          senha_temporaria: senhaTemporaria,
          nome_plano: nomePlano,
          data_aprovacao: dataAprovacao,
          
          // Dados de contato
          email: inscricao.email,
          user_email: inscricao.email,
          recipient_email: inscricao.email,
          
          // Dados da empresa
          portal_url: 'http://localhost:5173/PortalLogin',
          empresa_nome: 'Cooperativa Sanep',
          empresa_email: 'suporte@cooperativasanep.co.ao',
          empresa_telefone: '+244 123 456 789',
          empresa_endereco: 'Luanda, Angola',
          
          // Dados adicionais do cooperado
          telefone_cooperado: inscricao.telefone,
          bi_cooperado: inscricao.bi,
          data_nascimento: inscricao.data_nascimento,
          profissao: inscricao.profissao,
          renda_mensal: inscricao.renda_mensal,
          provincia: inscricao.provincia,
          municipio: inscricao.municipio,
          comuna: inscricao.comuna,
          endereco_completo: inscricao.endereco_completo
        }
      })
    });

    console.log('📊 Status:', response.status);
    console.log('📊 OK:', response.ok);

    if (response.ok) {
      const resultado = await response.text();
      console.log('✅ SUCESSO!');
      console.log('📧 Resposta:', resultado);
      console.log('📧 Verifique:', inscricao.email);
      console.log('');
      console.log('🎉 CREDENCIAIS REAIS ENVIADAS:');
      console.log('🔢 Número Associado:', numeroAssociado);
      console.log('🔑 Senha Temporária:', senhaTemporaria);
      console.log('🌐 Portal:', 'http://localhost:5173/PortalLogin');
    } else {
      const erro = await response.text();
      console.error('❌ ERRO:', erro);
    }

  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

// Executar teste
enviarDadosReais();
`;

console.log('📝 CÓDIGO PARA EXECUTAR:');
console.log('='.repeat(70));
console.log(codigoTeste);
console.log('='.repeat(70));

console.log('');
console.log('🎯 COMO FUNCIONA NO SISTEMA REAL:');
console.log('1. Quando você aprova uma inscrição no sistema');
console.log('2. O sistema gera automaticamente:');
console.log('   - Número de associado único (CS + timestamp)');
console.log('   - Senha temporária aleatória');
console.log('   - Data de aprovação atual');
console.log('3. Busca dados reais do plano escolhido');
console.log('4. Envia todos os dados para o template EmailJS');
console.log('5. O cooperado recebe e-mail com credenciais reais');

console.log('');
console.log('✅ SISTEMA PRONTO PARA TESTE!');
console.log('🚀 Execute o código acima no console do navegador');
console.log('📧 O e-mail conterá dados reais de acesso');
