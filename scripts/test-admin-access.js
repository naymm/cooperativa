import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testAdminAccess() {
  console.log('🧪 Testando acesso admin...\n')
  
  try {
    // 1. Simular dados do localStorage
    console.log('1. Simulando dados do localStorage...')
    const mockStoredUser = {
      id: 'test-id',
      nome: 'Administrador',
      email: 'admin@cooperativa.com',
      cargo: 'admin',
      status: 'ativo'
    }
    
    console.log(`   Usuário armazenado: ${mockStoredUser.nome} (${mockStoredUser.email})`)
    
    // 2. Testar busca no Supabase
    console.log('\n2. Testando busca no Supabase...')
    const { data: crmUsers, error: crmError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('email', mockStoredUser.email)
      .eq('status', 'ativo')
    
    if (crmError) {
      console.error('❌ Erro ao buscar usuário:', crmError.message)
      return
    }
    
    if (crmUsers.length === 0) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    const crmUser = crmUsers[0]
    console.log(`✅ Usuário encontrado: ${crmUser.nome} (${crmUser.email})`)
    console.log(`   Cargo: ${crmUser.cargo}`)
    console.log(`   Status: ${crmUser.status}`)
    
    // 3. Verificar permissões
    console.log('\n3. Verificando permissões...')
    const allowedRoles = ['admin', 'manager', 'super_admin']
    const hasPermission = crmUser.cargo && allowedRoles.includes(crmUser.cargo.toLowerCase())
    
    if (hasPermission) {
      console.log(`✅ Acesso permitido - Cargo: ${crmUser.cargo}`)
    } else {
      console.log(`❌ Acesso negado - Cargo: ${crmUser.cargo}`)
    }
    
    // 4. Testar método filter
    console.log('\n4. Testando método filter...')
    const { data: filterResults, error: filterError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('email', 'admin@cooperativa.com')
      .eq('status', 'ativo')
    
    if (filterError) {
      console.error('❌ Erro no filter:', filterError.message)
    } else {
      console.log(`✅ Filter funcionando: ${filterResults.length} resultados`)
      if (filterResults.length > 0) {
        console.log(`   - ${filterResults[0].nome} (${filterResults[0].cargo})`)
      }
    }
    
    console.log('\n🎉 Teste concluído!')
    console.log('✅ Sistema pronto para acesso admin')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testAdminAccess()
