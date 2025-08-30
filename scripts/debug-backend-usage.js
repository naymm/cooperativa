import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

console.log('🔍 Debugando uso do backend...\n')

// Verificar variáveis de ambiente
console.log('📋 Variáveis de ambiente:')
console.log(`VITE_USE_SUPABASE: ${process.env.VITE_USE_SUPABASE}`)
console.log(`VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? 'Configurado' : 'Não configurado'}`)
console.log(`VITE_SUPABASE_ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY ? 'Configurado' : 'Não configurado'}`)

// Verificar se o valor é realmente 'true'
const useSupabase = process.env.VITE_USE_SUPABASE === 'true'
console.log(`\n🔧 USE_SUPABASE (boolean): ${useSupabase}`)
console.log(`Tipo: ${typeof useSupabase}`)

if (useSupabase) {
  console.log('✅ Sistema configurado para usar Supabase')
  
  // Testar conexão com Supabase
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )
  
  console.log('\n🧪 Testando conexão com Supabase...')
  
  // Testar busca de usuário admin
  const { data: adminUsers, error: adminError } = await supabase
    .from('crm_users')
    .select('*')
    .eq('email', 'admin@cooperativa.com')
    .eq('status', 'ativo')
  
  if (adminError) {
    console.error('❌ Erro ao buscar admin no Supabase:', adminError.message)
  } else {
    console.log(`✅ Admin encontrado no Supabase: ${adminUsers.length} usuários`)
    if (adminUsers.length > 0) {
      console.log(`   - ${adminUsers[0].nome} (${adminUsers[0].email})`)
    }
  }
  
} else {
  console.log('❌ Sistema configurado para usar Base44')
}

console.log('\n🔍 Verificando se há requisições ao Base44...')
console.log('Se você está vendo requisições para base44.app, pode ser:')
console.log('1. Cache do navegador')
console.log('2. Aplicação não reiniciada')
console.log('3. Algum componente usando Base44 diretamente')
console.log('4. Variável de ambiente não carregada corretamente')

console.log('\n💡 Soluções:')
console.log('1. Limpar cache do navegador (Ctrl+F5)')
console.log('2. Reiniciar a aplicação (Ctrl+C e npm run dev)')
console.log('3. Verificar se VITE_USE_SUPABASE=true no .env')
console.log('4. Verificar se não há imports diretos do Base44')
