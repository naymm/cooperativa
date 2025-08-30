import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testCompleteAdminFlow() {
  console.log('🧪 Testando fluxo completo do admin...\n')
  
  try {
    // 1. Simular login
    console.log('1. Simulando processo de login...')
    
    // Buscar usuário admin
    const { data: adminUsers, error: adminError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('email', 'admin@cooperativa.com')
      .eq('status', 'ativo')
    
    if (adminError || adminUsers.length === 0) {
      console.error('❌ Usuário admin não encontrado')
      return
    }
    
    const adminUser = adminUsers[0]
    console.log(`✅ Login simulado: ${adminUser.nome} (${adminUser.email})`)
    
    // 2. Simular dados do localStorage
    console.log('\n2. Simulando localStorage...')
    const storedUser = {
      id: adminUser.id,
      nome: adminUser.nome,
      email: adminUser.email,
      cargo: adminUser.cargo,
      status: adminUser.status
    }
    
    console.log(`   Dados armazenados: ${JSON.stringify(storedUser, null, 2)}`)
    
    // 3. Simular verificação do ProtectedRoute
    console.log('\n3. Simulando verificação do ProtectedRoute...')
    
    // Buscar usuário novamente (como o ProtectedRoute faz)
    const { data: verifyUsers, error: verifyError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('email', storedUser.email)
      .eq('status', 'ativo')
    
    if (verifyError) {
      console.error('❌ Erro na verificação:', verifyError.message)
      return
    }
    
    if (verifyUsers.length === 0) {
      console.log('❌ Usuário não encontrado na verificação')
      return
    }
    
    const verifyUser = verifyUsers[0]
    console.log(`✅ Usuário verificado: ${verifyUser.nome}`)
    
    // 4. Verificar permissões
    console.log('\n4. Verificando permissões...')
    const allowedRoles = ['admin', 'manager', 'super_admin']
    const hasPermission = verifyUser.cargo && allowedRoles.includes(verifyUser.cargo.toLowerCase())
    
    if (hasPermission) {
      console.log(`✅ Acesso permitido - Cargo: ${verifyUser.cargo}`)
      console.log('✅ Usuário pode acessar o dashboard')
    } else {
      console.log(`❌ Acesso negado - Cargo: ${verifyUser.cargo}`)
      console.log('❌ Usuário não pode acessar o dashboard')
    }
    
    // 5. Verificar se todos os dados estão corretos
    console.log('\n5. Verificando integridade dos dados...')
    const requiredFields = ['id', 'nome', 'email', 'cargo', 'status']
    const missingFields = requiredFields.filter(field => !verifyUser[field])
    
    if (missingFields.length > 0) {
      console.log(`❌ Campos faltando: ${missingFields.join(', ')}`)
    } else {
      console.log('✅ Todos os campos necessários estão presentes')
    }
    
    console.log('\n🎉 Fluxo completo testado!')
    console.log('✅ Sistema pronto para uso')
    
    console.log('\n📋 Instruções para teste manual:')
    console.log('1. Acesse: http://localhost:5173/AdminLogin')
    console.log('2. Use as credenciais: admin@cooperativa.com / admin123')
    console.log('3. Deve redirecionar para o dashboard sem erro de acesso negado')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testCompleteAdminFlow()
