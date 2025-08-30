import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function createAdminUser() {
  console.log('👤 Criando usuário admin de teste...\n')
  
  try {
    // Verificar estrutura da tabela primeiro
    console.log('1. Verificando estrutura da tabela...')
    const { data: existingData, error: checkError } = await supabase
      .from('crm_users')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message)
      return
    }
    
    if (existingData.length > 0) {
      console.log('   Colunas existentes:', Object.keys(existingData[0]))
    }
    
    // Criar usuário admin
    console.log('\n2. Criando usuário admin...')
    const adminUser = {
      username: 'admin',
      password_hash: 'admin123',
      email: 'admin@cooperativa.com',
      role: 'admin',
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('crm_users')
      .insert(adminUser)
      .select()
    
    if (insertError) {
      console.error('❌ Erro ao criar usuário admin:', insertError.message)
      
      // Tentar com estrutura mais simples
      console.log('\n3. Tentando com estrutura mais simples...')
      const simpleUser = {
        username: 'admin',
        password_hash: 'admin123',
        role: 'admin',
        status: 'ativo'
      }
      
      const { data: simpleData, error: simpleError } = await supabase
        .from('crm_users')
        .insert(simpleUser)
        .select()
      
      if (simpleError) {
        console.error('❌ Erro ao criar usuário simples:', simpleError.message)
      } else {
        console.log('✅ Usuário admin criado com sucesso:', simpleData[0].username)
      }
    } else {
      console.log('✅ Usuário admin criado com sucesso:', insertData[0].username)
    }
    
    // Verificar usuários existentes
    console.log('\n4. Usuários existentes:')
    const { data: allUsers, error: allError } = await supabase
      .from('crm_users')
      .select('*')
    
    if (!allError) {
      console.log(`   Total: ${allUsers.length} usuários`)
      allUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) - ${user.status}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro durante criação:', error.message)
  }
}

createAdminUser()
