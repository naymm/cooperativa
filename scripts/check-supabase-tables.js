import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('🔍 Verificando tabelas no Supabase...\n')
  
  const tables = [
    'cooperados',
    'assinatura_planos',
    'projetos',
    'pagamentos',
    'cooperado_auth',
    'cooperado_notificacoes',
    'cooperado_suporte',
    'crm_notificacoes',
    'inscricoes',
    'inscricoes_publicas',
    'email_logs',
    'email_templates',
    'email_queue',
    'crm_users'
  ]
  
  let existingTables = 0
  let missingTables = 0
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`❌ ${table} - Não existe`)
          missingTables++
        } else {
          console.log(`⚠️  ${table} - Erro: ${error.message}`)
        }
      } else {
        console.log(`✅ ${table} - Existe`)
        existingTables++
      }
    } catch (error) {
      console.log(`❌ ${table} - Erro: ${error.message}`)
      missingTables++
    }
  }
  
  console.log(`\n📊 Resumo:`)
  console.log(`✅ Tabelas existentes: ${existingTables}`)
  console.log(`❌ Tabelas faltando: ${missingTables}`)
  
  if (missingTables > 0) {
    console.log(`\n💡 Para criar as tabelas faltando:`)
    console.log(`1. Acesse o painel do Supabase`)
    console.log(`2. Vá para SQL Editor`)
    console.log(`3. Execute o conteúdo de supabase-migration.sql`)
    console.log(`4. Execute este script novamente para verificar`)
  } else {
    console.log(`\n🎉 Todas as tabelas estão criadas!`)
    console.log(`Próximo passo: Executar a migração de dados`)
  }
}

checkTables()
