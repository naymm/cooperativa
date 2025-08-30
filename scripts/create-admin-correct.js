import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function createAdminCorrect() {
  console.log('👤 Criando usuário admin com estrutura correta...\n')
  
  try {
    // Criar usuário admin com estrutura correta
    console.log('1. Criando usuário admin...')
    const adminUser = {
      nome: 'Administrador',
      email: 'admin@cooperativa.com',
      senha_hash: 'admin123',
      cargo: 'admin',
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
    } else {
      console.log('✅ Usuário admin criado com sucesso:', insertData[0].nome)
    }
    
    // Verificar usuários existentes
    console.log('\n2. Usuários existentes:')
    const { data: allUsers, error: allError } = await supabase
      .from('crm_users')
      .select('*')
    
    if (!allError) {
      console.log(`   Total: ${allUsers.length} usuários`)
      allUsers.forEach(user => {
        console.log(`   - ${user.nome} (${user.email}) - ${user.cargo} - ${user.status}`)
      })
    }
    
    console.log('\n🎉 Usuário admin criado!')
    console.log('📋 Credenciais de teste:')
    console.log('   Email: admin@cooperativa.com')
    console.log('   Senha: admin123')
    
  } catch (error) {
    console.error('❌ Erro durante criação:', error.message)
  }
}

createAdminCorrect()
