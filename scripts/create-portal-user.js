import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function createPortalUser() {
  console.log('👤 Criando usuário de teste para o portal...\n')
  
  try {
    // Primeiro, buscar um cooperado existente
    console.log('1. Buscando cooperado existente...')
    const { data: cooperados, error: coopError } = await supabase
      .from('cooperados')
      .select('id, numero_associado, nome_completo, email')
      .limit(1)
    
    if (coopError || cooperados.length === 0) {
      console.error('❌ Nenhum cooperado encontrado')
      return
    }
    
    const cooperado = cooperados[0]
    console.log(`   Cooperado encontrado: ${cooperado.nome_completo} (${cooperado.numero_associado})`)
    
    // Criar registro de auth para o cooperado
    console.log('\n2. Criando registro de auth...')
    const authRecord = {
      cooperado_id: cooperado.id,
      email: cooperado.email,
      senha_hash: '123456',
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('cooperado_auth')
      .insert(authRecord)
      .select()
    
    if (insertError) {
      console.error('❌ Erro ao criar auth:', insertError.message)
    } else {
      console.log('✅ Auth criado com sucesso')
    }
    
    // Verificar auth existentes
    console.log('\n3. Registros de auth existentes:')
    const { data: allAuth, error: allAuthError } = await supabase
      .from('cooperado_auth')
      .select('*')
    
    if (!allAuthError) {
      console.log(`   Total: ${allAuth.length} registros`)
      allAuth.forEach(auth => {
        console.log(`   - ${auth.email} (${auth.cooperado_id}) - ${auth.status}`)
      })
    }
    
    console.log('\n🎉 Usuário do portal criado!')
    console.log('📋 Credenciais de teste:')
    console.log(`   Número de Associado: ${cooperado.numero_associado}`)
    console.log('   Senha: 123456')
    
  } catch (error) {
    console.error('❌ Erro durante criação:', error.message)
  }
}

createPortalUser()
