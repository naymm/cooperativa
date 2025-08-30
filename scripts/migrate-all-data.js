import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Primeiro, vamos desabilitar o Supabase temporariamente para acessar Base44
const originalUseSupabase = process.env.VITE_USE_SUPABASE
process.env.VITE_USE_SUPABASE = 'false'

// Importar o sistema híbrido após alterar a flag
const { 
  Cooperado, 
  AssinaturaPlano, 
  Projeto, 
  Pagamento, 
  CooperadoAuth, 
  CooperadoNotificacao, 
  CooperadoSupporte, 
  CrmNotificacao, 
  Inscricao, 
  InscricaoPublica, 
  EmailLog, 
  EmailTemplate, 
  EmailQueue, 
  CrmUser 
} = await import('../src/api/entities-hybrid.js')

async function migrateAllData() {
  console.log('🚀 Iniciando migração completa Base44 → Supabase...\n')
  
  const entities = [
    { name: 'Cooperado', source: Cooperado, target: 'cooperados' },
    { name: 'AssinaturaPlano', source: AssinaturaPlano, target: 'assinatura_planos' },
    { name: 'Projeto', source: Projeto, target: 'projetos' },
    { name: 'Pagamento', source: Pagamento, target: 'pagamentos' },
    { name: 'CooperadoAuth', source: CooperadoAuth, target: 'cooperado_auth' },
    { name: 'CooperadoNotificacao', source: CooperadoNotificacao, target: 'cooperado_notificacoes' },
    { name: 'CooperadoSupporte', source: CooperadoSupporte, target: 'cooperado_suporte' },
    { name: 'CrmNotificacao', source: CrmNotificacao, target: 'crm_notificacoes' },
    { name: 'Inscricao', source: Inscricao, target: 'inscricoes' },
    { name: 'InscricaoPublica', source: InscricaoPublica, target: 'inscricoes_publicas' },
    { name: 'EmailLog', source: EmailLog, target: 'email_logs' },
    { name: 'EmailTemplate', source: EmailTemplate, target: 'email_templates' },
    { name: 'EmailQueue', source: EmailQueue, target: 'email_queue' },
    { name: 'CrmUser', source: CrmUser, target: 'crm_users' }
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
  
  // Restaurar configuração original
  process.env.VITE_USE_SUPABASE = originalUseSupabase
  
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
