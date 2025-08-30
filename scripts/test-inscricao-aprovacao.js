#!/usr/bin/env node

console.log('🧪 Testando última inscrição...');

// Simular dados de uma inscrição para teste
const inscricaoTeste = {
  id: 'test-' + Date.now(),
  nome_completo: 'João Silva Teste',
  email: 'naymupoia@gmail.com', // Seu e-mail para teste
  telefone: '+244 900 000 000',
  provincia: 'Luanda',
  municipio: 'Belas',
  comuna: 'Ramiros',
  endereco_completo: 'Rua Teste, 123',
  profissao: 'Engenheiro',
  sector_profissional: 'privado',
  renda_mensal: 200000,
  data_nascimento: '1990-01-01',
  estado_civil: 'solteiro',
  nacionalidade: 'Angolana',
  bi: '123456789LA000',
  validade_documento_bi: '2030-12-31',
  entidade_privada: 'Empresa Teste Lda',
  assinatura_plano_id: null,
  taxa_inscricao_paga: false,
  documentos_anexados: {},
  observacoes: null,
  status: 'pendente',
  fonte: 'publica',
  created_at: new Date().toISOString()
};

console.log('📋 Dados da inscrição de teste:');
console.log('Nome:', inscricaoTeste.nome_completo);
console.log('Email:', inscricaoTeste.email);
console.log('Status:', inscricaoTeste.status);
console.log('Fonte:', inscricaoTeste.fonte);

console.log('\n🎯 Para testar a aprovação:');
console.log('1. Acesse http://localhost:5173/Inscricoes');
console.log('2. Clique em "Detalhes" da inscrição');
console.log('3. Clique em "Aprovar Inscrição"');
console.log('4. Verifique se o e-mail foi enviado para:', inscricaoTeste.email);

console.log('\n✅ Script concluído. Use os dados acima para teste manual.');
