import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Dados de demonstração
const demoData = {
  cooperados: [
    {
      numero_associado: 'COOP001',
      nome_completo: 'João Silva Santos',
      data_nascimento: '1985-03-15',
      estado_civil: 'casado',
      nome_conjuge: 'Maria Silva Santos',
      tem_filhos: true,
      numero_filhos: 2,
      nacionalidade: 'Angolana',
      bi: '123456789012',
      validade_documento_bi: '2030-12-31',
      email: 'joao.silva@email.com',
      telefone: '244123456789',
      provincia: 'Luanda',
      municipio: 'Luanda',
      comuna: 'Ingombota',
      endereco_completo: 'Rua da Independência, nº 123',
      profissao: 'Engenheiro Civil',
      sector_profissional: 'privado',
      entidade_privada: 'Construtora ABC',
      renda_mensal: 150000,
      status: 'ativo',
      data_inscricao: '2023-01-15',
      taxa_inscricao_paga: true
    },
    {
      numero_associado: 'COOP002',
      nome_completo: 'Ana Maria Costa',
      data_nascimento: '1990-07-22',
      estado_civil: 'solteiro',
      tem_filhos: false,
      nacionalidade: 'Angolana',
      bi: '987654321098',
      validade_documento_bi: '2028-06-30',
      email: 'ana.costa@email.com',
      telefone: '244987654321',
      provincia: 'Benguela',
      municipio: 'Benguela',
      comuna: 'São João',
      endereco_completo: 'Avenida 4 de Fevereiro, nº 456',
      profissao: 'Médica',
      sector_profissional: 'publico',
      entidade_publica: 'Hospital Provincial de Benguela',
      renda_mensal: 120000,
      status: 'ativo',
      data_inscricao: '2023-02-20',
      taxa_inscricao_paga: true
    }
  ],
  
  planos: [
    {
      nome: 'Plano Básico',
      descricao: 'Plano básico com benefícios essenciais',
      valor_mensal: 50000,
      beneficios: ['Seguro de vida', 'Assistência médica básica'],
      status: 'ativo'
    },
    {
      nome: 'Plano Premium',
      descricao: 'Plano premium com benefícios completos',
      valor_mensal: 100000,
      beneficios: ['Seguro de vida', 'Assistência médica completa', 'Seguro automóvel'],
      status: 'ativo'
    }
  ],
  
  projetos: [
    {
      titulo: 'Construção de Habitação Social',
      descricao: 'Projeto para construção de 100 casas populares',
      valor_total: 50000000,
      valor_entrada: 5000000,
      numero_parcelas: 24,
      valor_parcela: 1875000,
      data_inicio: '2024-01-01',
      data_fim: '2025-12-31',
      status: 'ativo',
      cooperados_interessados: ['COOP001', 'COOP002']
    }
  ],
  
  pagamentos: [
    {
      valor: 50000,
      data_pagamento: '2024-01-15',
      data_vencimento: '2024-01-15',
      mes_referencia: '2024-01',
      metodo_pagamento: 'transferencia',
      status: 'confirmado',
      referencia: 'REF001',
      tipo: 'mensalidade'
    },
    {
      valor: 100000,
      data_pagamento: '2024-01-20',
      data_vencimento: '2024-01-15',
      mes_referencia: '2024-01',
      metodo_pagamento: 'multicaixa',
      status: 'confirmado',
      referencia: 'REF002',
      tipo: 'mensalidade'
    }
  ]
}

async function migrateDemoData() {
  console.log('🚀 Iniciando migração de dados de demonstração...\n')
  
  try {
    // 1. Migrar Cooperados
    console.log('📋 Migrando Cooperados...')
    const cooperadoIds = []
    
    for (const cooperado of demoData.cooperados) {
      const { data, error } = await supabase
        .from('cooperados')
        .insert(cooperado)
        .select()
      
      if (error) {
        console.error(`❌ Erro ao migrar cooperado ${cooperado.numero_associado}:`, error.message)
      } else {
        console.log(`✅ Cooperado ${cooperado.numero_associado} migrado com sucesso`)
        cooperadoIds.push(data[0].id)
      }
    }

    // 2. Migrar Planos
    console.log('\n📋 Migrando Planos...')
    const planoIds = []
    
    for (const plano of demoData.planos) {
      const { data, error } = await supabase
        .from('assinatura_planos')
        .insert(plano)
        .select()
      
      if (error) {
        console.error(`❌ Erro ao migrar plano ${plano.nome}:`, error.message)
      } else {
        console.log(`✅ Plano ${plano.nome} migrado com sucesso`)
        planoIds.push(data[0].id)
      }
    }

    // 3. Migrar Projetos
    console.log('\n📋 Migrando Projetos...')
    const projetoIds = []
    
    for (const projeto of demoData.projetos) {
      const { data, error } = await supabase
        .from('projetos')
        .insert(projeto)
        .select()
      
      if (error) {
        console.error(`❌ Erro ao migrar projeto ${projeto.titulo}:`, error.message)
      } else {
        console.log(`✅ Projeto ${projeto.titulo} migrado com sucesso`)
        projetoIds.push(data[0].id)
      }
    }

    // 4. Migrar Pagamentos (associando aos cooperados)
    console.log('\n📋 Migrando Pagamentos...')
    
    for (let i = 0; i < demoData.pagamentos.length; i++) {
      const pagamento = {
        ...demoData.pagamentos[i],
        cooperado_id: cooperadoIds[i % cooperadoIds.length],
        assinatura_plano_id: planoIds[i % planoIds.length]
      }
      
      const { data, error } = await supabase
        .from('pagamentos')
        .insert(pagamento)
        .select()
      
      if (error) {
        console.error(`❌ Erro ao migrar pagamento ${pagamento.referencia}:`, error.message)
      } else {
        console.log(`✅ Pagamento ${pagamento.referencia} migrado com sucesso`)
      }
    }

    // 5. Verificar dados migrados
    console.log('\n📊 Verificando dados migrados...')
    
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
    
    if (!cooperadosError) {
      console.log(`✅ Cooperados: ${cooperados.length} registros`)
    }
    
    const { data: planos, error: planosError } = await supabase
      .from('assinatura_planos')
      .select('*')
    
    if (!planosError) {
      console.log(`✅ Planos: ${planos.length} registros`)
    }
    
    const { data: projetos, error: projetosError } = await supabase
      .from('projetos')
      .select('*')
    
    if (!projetosError) {
      console.log(`✅ Projetos: ${projetos.length} registros`)
    }
    
    const { data: pagamentos, error: pagamentosError } = await supabase
      .from('pagamentos')
      .select('*')
    
    if (!pagamentosError) {
      console.log(`✅ Pagamentos: ${pagamentos.length} registros`)
    }

    console.log('\n🎉 Migração de dados de demonstração concluída!')
    console.log('O Supabase está pronto para uso com dados de exemplo.')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message)
  }
}

migrateDemoData()
