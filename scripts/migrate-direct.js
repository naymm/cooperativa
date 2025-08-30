import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Tentar importar Base44 de diferentes formas
let base44 = null

try {
  // Tentativa 1: Import direto
  const base44Module = await import('@base44/sdk')
  base44 = base44Module.createClient({
    appId: "683c8e5c7f28b76cbf2c7555",
    requiresAuth: false
  })
  console.log('✅ Base44 conectado via import direto')
} catch (error) {
  console.log('❌ Erro no import direto:', error.message)
  
  try {
    // Tentativa 2: Import dinâmico
    const base44Module = await import('@base44/sdk/dist/index.js')
    base44 = base44Module.createClient({
      appId: "683c8e5c7f28b76cbf2c7555",
      requiresAuth: false
    })
    console.log('✅ Base44 conectado via import dinâmico')
  } catch (error2) {
    console.log('❌ Erro no import dinâmico:', error2.message)
    
    try {
      // Tentativa 3: Require (CommonJS)
      const base44Module = require('@base44/sdk')
      base44 = base44Module.createClient({
        appId: "683c8e5c7f28b76cbf2c7555",
        requiresAuth: false
      })
      console.log('✅ Base44 conectado via require')
    } catch (error3) {
      console.log('❌ Erro no require:', error3.message)
      console.log('❌ Não foi possível conectar ao Base44')
      process.exit(1)
    }
  }
}

async function migrateAllData() {
  console.log('🚀 Iniciando migração completa Base44 → Supabase...\n')
  
  const entities = [
    { name: 'Cooperado', source: base44.entities.Cooperado, target: 'cooperados' },
    { name: 'AssinaturaPlano', source: base44.entities.AssinaturaPlano, target: 'assinatura_planos' },
    { name: 'Projeto', source: base44.entities.Projeto, target: 'projetos' },
    { name: 'Pagamento', source: base44.entities.Pagamento, target: 'pagamentos' },
    { name: 'CooperadoAuth', source: base44.entities.CooperadoAuth, target: 'cooperado_auth' },
    { name: 'CooperadoNotificacao', source: base44.entities.CooperadoNotificacao, target: 'cooperado_notificacoes' },
    { name: 'CooperadoSupporte', source: base44.entities.CooperadoSupporte, target: 'cooperado_suporte' },
    { name: 'CrmNotificacao', source: base44.entities.CrmNotificacao, target: 'crm_notificacoes' },
    { name: 'Inscricao', source: base44.entities.Inscricao, target: 'inscricoes' },
    { name: 'InscricaoPublica', source: base44.entities.InscricaoPublica, target: 'inscricoes_publicas' },
    { name: 'EmailLog', source: base44.entities.EmailLog, target: 'email_logs' },
    { name: 'EmailTemplate', source: base44.entities.EmailTemplate, target: 'email_templates' },
    { name: 'EmailQueue', source: base44.entities.EmailQueue, target: 'email_queue' },
    { name: 'CrmUser', source: base44.entities.CrmUser, target: 'crm_users' }
  ]
  
  const migrationResults = {}
  
  for (const { name, source, target } of entities) {
    try {
      console.log(`📋 Migrando ${name}...`)
      
      // Buscar dados do Base44
      const sourceData = await source.find()
      console.log(`   Encontrados ${sourceData.length} registros no Base44`)
      
      if (sourceData.length === 0) {
        console.log(`   ⏭️  Nenhum dado para migrar em ${name}`)
        migrationResults[name] = { migrated: 0, errors: 0 }
        continue
      }
      
      let migratedCount = 0
      let errorCount = 0
      
      // Migrar cada registro
      for (const item of sourceData) {
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
            if (migratedCount % 10 === 0) {
              console.log(`   ✅ ${migratedCount}/${sourceData.length} migrados`)
            }
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
  console.log('=' * 50)
  
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

migrateAllData()
