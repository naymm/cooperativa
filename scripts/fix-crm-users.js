import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function fixCrmUsers() {
  console.log('🔧 Verificando e corrigindo tabela crm_users...\n')
  
  try {
    // 1. Verificar estrutura atual
    console.log('1. Verificando estrutura atual...')
    const { data: crmData, error: crmError } = await supabase
      .from('crm_users')
      .select('*')
      .limit(1)
    
    if (crmError) {
      console.error('❌ Erro ao verificar crm_users:', crmError.message)
      return
    }
    
    if (crmData.length > 0) {
      console.log('   Colunas existentes:', Object.keys(crmData[0]))
    }
    
    // 2. Tentar buscar com diferentes nomes de coluna
    console.log('\n2. Testando diferentes nomes de coluna...')
    
    // Tentar com 'active'
    const { data: activeData, error: activeError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('active', true)
    
    if (!activeError) {
      console.log('✅ Coluna "active" existe')
    } else {
      console.log('❌ Coluna "active" não existe:', activeError.message)
    }
    
    // Tentar com 'status'
    const { data: statusData, error: statusError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('status', 'ativo')
    
    if (!statusError) {
      console.log('✅ Coluna "status" existe')
    } else {
      console.log('❌ Coluna "status" não existe:', statusError.message)
    }
    
    // 3. Criar dados de teste se necessário
    console.log('\n3. Criando dados de teste...')
    
    const testUser = {
      username: 'admin',
      password_hash: 'admin123',
      full_name: 'Administrador',
      email: 'admin@cooperativa.com',
      role: 'admin',
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('crm_users')
      .insert(testUser)
      .select()
    
    if (insertError) {
      console.log('⚠️  Erro ao inserir usuário de teste:', insertError.message)
    } else {
      console.log('✅ Usuário de teste criado:', insertData[0].username)
    }
    
    // 4. Verificar dados finais
    console.log('\n4. Dados finais:')
    const { data: finalData, error: finalError } = await supabase
      .from('crm_users')
      .select('*')
    
    if (!finalError) {
      console.log(`   Total de usuários: ${finalData.length}`)
      finalData.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) - ${user.status || 'N/A'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro durante correção:', error.message)
  }
}

fixCrmUsers()
