import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Dados simulados do Base44 baseados nas entidades
const simulatedBase44Data = {
  cooperados: [
    {
      id: 'coop-001',
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
      taxa_inscricao_paga: true,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'coop-002',
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
      taxa_inscricao_paga: true,
      createdAt: '2023-02-20T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'coop-003',
      numero_associado: 'COOP003',
      nome_completo: 'Carlos Manuel Ferreira',
      data_nascimento: '1978-11-08',
      estado_civil: 'casado',
      nome_conjuge: 'Isabel Ferreira',
      tem_filhos: true,
      numero_filhos: 3,
      nacionalidade: 'Angolana',
      bi: '456789123456',
      validade_documento_bi: '2029-03-15',
      email: 'carlos.ferreira@email.com',
      telefone: '244555666777',
      provincia: 'Huíla',
      municipio: 'Lubango',
      comuna: 'Sagrada Família',
      endereco_completo: 'Rua Comandante Valódia, nº 789',
      profissao: 'Professor',
      sector_profissional: 'publico',
      entidade_publica: 'Escola Secundária do Lubango',
      renda_mensal: 80000,
      status: 'ativo',
      data_inscricao: '2023-03-10',
      taxa_inscricao_paga: true,
      createdAt: '2023-03-10T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  assinatura_planos: [
    {
      id: 'plano-001',
      nome: 'Plano Básico',
      descricao: 'Plano básico com benefícios essenciais',
      valor_mensal: 50000,
      beneficios: ['Seguro de vida', 'Assistência médica básica'],
      status: 'ativo',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'plano-002',
      nome: 'Plano Premium',
      descricao: 'Plano premium com benefícios completos',
      valor_mensal: 100000,
      beneficios: ['Seguro de vida', 'Assistência médica completa', 'Seguro automóvel'],
      status: 'ativo',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'plano-003',
      nome: 'Plano Familiar',
      descricao: 'Plano para famílias com benefícios especiais',
      valor_mensal: 75000,
      beneficios: ['Seguro de vida familiar', 'Assistência médica familiar', 'Educação'],
      status: 'ativo',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  projetos: [
    {
      id: 'proj-001',
      titulo: 'Construção de Habitação Social',
      descricao: 'Projeto para construção de 100 casas populares',
      valor_total: 50000000,
      valor_entrada: 5000000,
      numero_parcelas: 24,
      valor_parcela: 1875000,
      data_inicio: '2024-01-01',
      data_fim: '2025-12-31',
      status: 'ativo',
      cooperados_interessados: ['coop-001', 'coop-002'],
      createdAt: '2023-12-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'proj-002',
      titulo: 'Centro Comercial Cooperativo',
      descricao: 'Construção de centro comercial para cooperados',
      valor_total: 30000000,
      valor_entrada: 3000000,
      numero_parcelas: 18,
      valor_parcela: 1500000,
      data_inicio: '2024-03-01',
      data_fim: '2025-08-31',
      status: 'ativo',
      cooperados_interessados: ['coop-001', 'coop-003'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  pagamentos: [
    {
      id: 'pag-001',
      cooperado_id: 'coop-001',
      assinatura_plano_id: 'plano-001',
      valor: 50000,
      data_pagamento: '2024-01-15',
      data_vencimento: '2024-01-15',
      mes_referencia: '2024-01',
      metodo_pagamento: 'transferencia',
      status: 'confirmado',
      referencia: 'REF001',
      tipo: 'mensalidade',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'pag-002',
      cooperado_id: 'coop-002',
      assinatura_plano_id: 'plano-002',
      valor: 100000,
      data_pagamento: '2024-01-20',
      data_vencimento: '2024-01-15',
      mes_referencia: '2024-01',
      metodo_pagamento: 'multicaixa',
      status: 'confirmado',
      referencia: 'REF002',
      tipo: 'mensalidade',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: 'pag-003',
      cooperado_id: 'coop-003',
      assinatura_plano_id: 'plano-003',
      valor: 75000,
      data_pagamento: '2024-01-25',
      data_vencimento: '2024-01-15',
      mes_referencia: '2024-01',
      metodo_pagamento: 'deposito',
      status: 'confirmado',
      referencia: 'REF003',
      tipo: 'mensalidade',
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z'
    }
  ],
  
  cooperado_auth: [
    {
      id: 'auth-001',
      cooperado_id: 'coop-001',
      email: 'joao.silva@email.com',
      senha_hash: 'hash_senha_joao',
      ultimo_login: '2024-01-15T10:00:00Z',
      status: 'ativo',
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'auth-002',
      cooperado_id: 'coop-002',
      email: 'ana.costa@email.com',
      senha_hash: 'hash_senha_ana',
      ultimo_login: '2024-01-14T10:00:00Z',
      status: 'ativo',
      createdAt: '2023-02-20T10:00:00Z',
      updatedAt: '2024-01-14T10:00:00Z'
    }
  ],
  
  cooperado_notificacoes: [
    {
      id: 'notif-001',
      cooperado_id: 'coop-001',
      titulo: 'Pagamento Confirmado',
      mensagem: 'Seu pagamento de janeiro foi confirmado com sucesso.',
      tipo: 'sucesso',
      lida: false,
      data_envio: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'notif-002',
      cooperado_id: 'coop-002',
      titulo: 'Novo Projeto Disponível',
      mensagem: 'Um novo projeto está disponível para participação.',
      tipo: 'info',
      lida: true,
      data_envio: '2024-01-10T10:00:00Z',
      createdAt: '2024-01-10T10:00:00Z'
    }
  ]
}

async function migrateSimulatedData() {
  console.log('🚀 Iniciando migração de dados simulados do Base44...\n')
  
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
  }
  
  return preparedData
}

migrateSimulatedData()
