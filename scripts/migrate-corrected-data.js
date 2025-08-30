import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Dados simulados do Base44 com IDs UUID válidos
const simulatedBase44Data = {
  cooperados: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      numero_associado: 'COOP004',
      nome_completo: 'Maria José Oliveira',
      data_nascimento: '1982-05-12',
      estado_civil: 'casado',
      nome_conjuge: 'Pedro Oliveira',
      tem_filhos: true,
      numero_filhos: 1,
      nacionalidade: 'Angolana',
      bi: '111222333444',
      validade_documento_bi: '2031-05-12',
      email: 'maria.oliveira@email.com',
      telefone: '244111222333',
      provincia: 'Namibe',
      municipio: 'Namibe',
      comuna: 'Sagrada Família',
      endereco_completo: 'Rua da República, nº 321',
      profissao: 'Advogada',
      sector_profissional: 'privado',
      entidade_privada: 'Escritório de Advocacia Oliveira',
      renda_mensal: 180000,
      status: 'ativo',
      data_inscricao: '2023-04-15',
      taxa_inscricao_paga: true,
      createdAt: '2023-04-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      numero_associado: 'COOP005',
      nome_completo: 'António Santos Lima',
      data_nascimento: '1975-09-30',
      estado_civil: 'divorciado',
      tem_filhos: true,
      numero_filhos: 2,
      nacionalidade: 'Angolana',
      bi: '555666777888',
      validade_documento_bi: '2027-09-30',
      email: 'antonio.lima@email.com',
      telefone: '244555666777',
      provincia: 'Huambo',
      municipio: 'Huambo',
      comuna: 'Alto Hama',
      endereco_completo: 'Avenida Agostinho Neto, nº 654',
      profissao: 'Contabilista',
      sector_profissional: 'privado',
      entidade_privada: 'Empresa de Contabilidade Lima',
      renda_mensal: 95000,
      status: 'ativo',
      data_inscricao: '2023-05-20',
      taxa_inscricao_paga: true,
      createdAt: '2023-05-20T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  assinatura_planos: [
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      nome: 'Plano Empresarial',
      descricao: 'Plano especial para empresários',
      valor_mensal: 120000,
      beneficios: ['Seguro empresarial', 'Consultoria financeira', 'Networking'],
      status: 'ativo',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      nome: 'Plano Estudantil',
      descricao: 'Plano com desconto para estudantes',
      valor_mensal: 25000,
      beneficios: ['Seguro de vida', 'Assistência médica básica', 'Bolsa de estudos'],
      status: 'ativo',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  projetos: [
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      titulo: 'Fazenda Cooperativa',
      descricao: 'Projeto de agricultura sustentável',
      valor_total: 25000000,
      valor_entrada: 2500000,
      numero_parcelas: 12,
      valor_parcela: 1875000,
      data_inicio: '2024-06-01',
      data_fim: '2025-05-31',
      status: 'ativo',
      cooperados_interessados: ['550e8400-e29b-41d4-a716-446655440001'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  pagamentos: [
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      cooperado_id: '550e8400-e29b-41d4-a716-446655440001',
      assinatura_plano_id: '550e8400-e29b-41d4-a716-446655440003',
      valor: 120000,
      data_pagamento: '2024-02-01',
      data_vencimento: '2024-02-01',
      mes_referencia: '2024-02',
      metodo_pagamento: 'transferencia',
      status: 'confirmado',
      referencia: 'REF004',
      tipo: 'mensalidade',
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      cooperado_id: '550e8400-e29b-41d4-a716-446655440002',
      assinatura_plano_id: '550e8400-e29b-41d4-a716-446655440004',
      valor: 25000,
      data_pagamento: '2024-02-05',
      data_vencimento: '2024-02-01',
      mes_referencia: '2024-02',
      metodo_pagamento: 'multicaixa',
      status: 'confirmado',
      referencia: 'REF005',
      tipo: 'mensalidade',
      createdAt: '2024-02-05T10:00:00Z',
      updatedAt: '2024-02-05T10:00:00Z'
    }
  ],
  
  cooperado_auth: [
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      cooperado_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'maria.oliveira@email.com',
      senha_hash: 'hash_senha_maria',
      ultimo_login: '2024-02-01T10:00:00Z',
      status: 'ativo',
      createdAt: '2023-04-15T10:00:00Z',
      updatedAt: '2024-02-01T10:00:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      cooperado_id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'antonio.lima@email.com',
      senha_hash: 'hash_senha_antonio',
      ultimo_login: '2024-02-05T10:00:00Z',
      status: 'ativo',
      createdAt: '2023-05-20T10:00:00Z',
      updatedAt: '2024-02-05T10:00:00Z'
    }
  ],
  
  cooperado_notificacoes: [
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      cooperado_id: '550e8400-e29b-41d4-a716-446655440001',
      titulo: 'Bem-vindo à Cooperativa',
      mensagem: 'Seja bem-vindo! Sua conta foi ativada com sucesso.',
      tipo: 'sucesso',
      lida: false,
      data_envio: '2023-04-15T10:00:00Z',
      createdAt: '2023-04-15T10:00:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      cooperado_id: '550e8400-e29b-41d4-a716-446655440002',
      titulo: 'Pagamento em Atraso',
      mensagem: 'Seu pagamento de fevereiro está em atraso. Regularize sua situação.',
      tipo: 'aviso',
      lida: true,
      data_envio: '2024-02-10T10:00:00Z',
      createdAt: '2024-02-10T10:00:00Z'
    }
  ]
}

async function migrateCorrectedData() {
  console.log('🚀 Iniciando migração de dados corrigidos do Base44...\n')
  
  const entities = [
    { name: 'Cooperado', data: simulatedBase44Data.cooperados, target: 'cooperados' },
    { name: 'AssinaturaPlano', data: simulatedBase44Data.assinatura_planos, target: 'assinatura_planos' },
    { name: 'Projeto', data: simulatedBase44Data.projetos, target: 'projetos' },
    { name: 'Pagamento', data: simulatedBase44Data.pagamentos, target: 'pagamentos' },
    { name: 'CooperadoAuth', data: simulatedBase44Data.cooperado_auth, target: 'cooperado_auth' },
    { name: 'CooperadoNotificacao', data: simulatedBase44Data.cooperado_notificacoes, target: 'cooperado_notificacoes' }
  ]
  
  const migrationResults = {}
  
  for (const { name, data, target } of entities) {
    try {
      console.log(`📋 Migrando ${name}...`)
      console.log(`   Encontrados ${data.length} registros simulados`)
      
      if (data.length === 0) {
        console.log(`   ⏭️  Nenhum dado para migrar em ${name}`)
        migrationResults[name] = { migrated: 0, errors: 0 }
        continue
      }
      
      let migratedCount = 0
      let errorCount = 0
      
      // Migrar cada registro
      for (const item of data) {
        try {
          // Preparar dados para Supabase
          const supabaseData = prepareDataForSupabase(item, name)
          
          const { error } = await supabase
            .from(target)
            .insert(supabaseData)
          
          if (error) {
            console.error(`   ❌ Erro ao migrar item ${item.id}:`, error.message)
            errorCount++
          } else {
            migratedCount++
            console.log(`   ✅ ${item.id} migrado com sucesso`)
          }
        } catch (error) {
          console.error(`   ❌ Erro ao processar item ${item.id}:`, error.message)
          errorCount++
        }
      }
      
      console.log(`   ✅ ${name}: ${migratedCount} migrados, ${errorCount} erros`)
      migrationResults[name] = { migrated: migratedCount, errors: errorCount }
      
    } catch (error) {
      console.error(`❌ Erro ao migrar ${name}:`, error.message)
      migrationResults[name] = { migrated: 0, errors: 1 }
    }
    
    console.log('')
  }
  
  // Resumo final
  console.log('📊 Resumo da Migração:')
  console.log('='.repeat(50))
  
  let totalMigrated = 0
  let totalErrors = 0
  
  Object.entries(migrationResults).forEach(([name, result]) => {
    console.log(`${name}: ${result.migrated} migrados, ${result.errors} erros`)
    totalMigrated += result.migrated
    totalErrors += result.errors
  })
  
  console.log(`\n🎯 Total: ${totalMigrated} registros migrados, ${totalErrors} erros`)
  
  if (totalErrors === 0) {
    console.log('\n🎉 Migração concluída com sucesso!')
  } else {
    console.log('\n⚠️  Migração concluída com alguns erros. Verifique os logs acima.')
  }
}

function prepareDataForSupabase(data, entityName) {
  // Remover campos que podem causar problemas
  const { id, createdAt, updatedAt, ...cleanData } = data
  
  // Adicionar campos de timestamp se não existirem
  const preparedData = {
    ...cleanData,
    created_at: createdAt || new Date().toISOString(),
    updated_at: updatedAt || new Date().toISOString()
  }
  
  // Tratar campos específicos por entidade
  switch (entityName) {
    case 'Cooperado':
      // Garantir que campos obrigatórios existam
      if (!preparedData.status) preparedData.status = 'ativo'
      if (!preparedData.nacionalidade) preparedData.nacionalidade = 'Angolana'
      break
      
    case 'Pagamento':
      // Garantir que campos obrigatórios existam
      if (!preparedData.status) preparedData.status = 'pendente'
      if (!preparedData.tipo) preparedData.tipo = 'mensalidade'
      break
      
    case 'AssinaturaPlano':
      if (!preparedData.status) preparedData.status = 'ativo'
      break
      
    case 'Projeto':
      if (!preparedData.status) preparedData.status = 'ativo'
      break
      
    case 'CooperadoNotificacao':
      // Remover updated_at se não existir na tabela
      delete preparedData.updated_at
      break
  }
  
  return preparedData
}

migrateCorrectedData()
