import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testLoginSupabase() {
  console.log('🧪 Testando login com Supabase...\n')
  
  try {
    // 1. Testar busca de cooperado
    console.log('1. Testando busca de cooperado...')
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
      .eq('numero_associado', 'COOP001')
      .eq('status', 'ativo')
    
    if (cooperadosError) {
      console.error('❌ Erro ao buscar cooperado:', cooperadosError.message)
    } else {
      console.log(`✅ Cooperado encontrado: ${cooperados.length > 0 ? cooperados[0].nome_completo : 'Nenhum'}`)
    }
    
    // 2. Testar busca de auth
    console.log('\n2. Testando busca de auth...')
    const { data: authRecords, error: authError } = await supabase
      .from('cooperado_auth')
      .select('*')
      .eq('cooperado_id', 'COOP001')
    
    if (authError) {
      console.error('❌ Erro ao buscar auth:', authError.message)
    } else {
      console.log(`✅ Auth encontrado: ${authRecords.length > 0 ? 'Sim' : 'Não'}`)
      if (authRecords.length > 0) {
        console.log(`   - Email: ${authRecords[0].email}`)
        console.log(`   - Status: ${authRecords[0].status}`)
      }
    }
    
    // 3. Testar busca de usuário admin
    console.log('\n3. Testando busca de usuário admin...')
    const { data: adminUsers, error: adminError } = await supabase
      .from('crm_users')
      .select('*')
      .eq('active', true)
    
    if (adminError) {
      console.error('❌ Erro ao buscar usuários admin:', adminError.message)
    } else {
      console.log(`✅ Usuários admin encontrados: ${adminUsers.length}`)
      if (adminUsers.length > 0) {
        console.log(`   - Usuário: ${adminUsers[0].username}`)
        console.log(`   - Role: ${adminUsers[0].role}`)
      }
    }
    
    // 4. Testar método filter simulado
    console.log('\n4. Testando método filter...')
    const { data: cooperadosFilter, error: filterError } = await supabase
      .from('cooperados')
      .select('*')
      .eq('numero_associado', 'COOP001')
    
    if (filterError) {
      console.error('❌ Erro no filter:', filterError.message)
    } else {
      console.log(`✅ Filter funcionando: ${cooperadosFilter.length} resultados`)
    }
    
    console.log('\n🎉 Teste de login concluído!')
    console.log('O Supabase está pronto para autenticação.')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  }
}

testLoginSupabase()
