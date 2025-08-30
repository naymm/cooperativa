import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkTableStructure() {
  console.log('🔍 Verificando estrutura das tabelas...\n')
  
  try {
    // 1. Verificar estrutura da tabela cooperado_auth
    console.log('1. Estrutura da tabela cooperado_auth:')
    const { data: authData, error: authError } = await supabase
      .from('cooperado_auth')
      .select('*')
      .limit(1)
    
    if (authError) {
      console.error('❌ Erro ao verificar cooperado_auth:', authError.message)
    } else {
      console.log('✅ Tabela cooperado_auth acessível')
      if (authData.length > 0) {
        console.log('   Colunas:', Object.keys(authData[0]))
      }
    }
    
    // 2. Verificar estrutura da tabela crm_users
    console.log('\n2. Estrutura da tabela crm_users:')
    const { data: crmData, error: crmError } = await supabase
      .from('crm_users')
      .select('*')
      .limit(1)
    
    if (crmError) {
      console.error('❌ Erro ao verificar crm_users:', crmError.message)
    } else {
      console.log('✅ Tabela crm_users acessível')
      if (crmData.length > 0) {
        console.log('   Colunas:', Object.keys(crmData[0]))
      }
    }
    
    // 3. Verificar dados existentes
    console.log('\n3. Dados existentes:')
    
    const { data: cooperados, error: coopError } = await supabase
      .from('cooperados')
      .select('id, numero_associado, nome_completo')
      .limit(3)
    
    if (!coopError && cooperados.length > 0) {
      console.log('   Cooperados:', cooperados.map(c => `${c.numero_associado} (${c.id})`))
    }
    
    const { data: authRecords, error: authRecError } = await supabase
      .from('cooperado_auth')
      .select('id, cooperado_id, email')
      .limit(3)
    
    if (!authRecError && authRecords.length > 0) {
      console.log('   Auth Records:', authRecords.map(a => `${a.cooperado_id} (${a.id})`))
    }
    
    const { data: crmUsers, error: crmUserError } = await supabase
      .from('crm_users')
      .select('id, username, role')
      .limit(3)
    
    if (!crmUserError && crmUsers.length > 0) {
      console.log('   CRM Users:', crmUsers.map(u => `${u.username} (${u.role})`))
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkTableStructure()
