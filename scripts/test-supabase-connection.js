import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Não configurada')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Credenciais do Supabase não configuradas!')
  console.log('Configure o arquivo .env com:')
  console.log('VITE_SUPABASE_URL=sua_url_do_supabase')
  console.log('VITE_SUPABASE_ANON_KEY=sua_chave_anonima')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n📡 Testando conexão...')
    
    // Testar conexão básica
    const { data, error } = await supabase
      .from('cooperados')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message)
      
      if (error.message.includes('relation "cooperados" does not exist')) {
        console.log('\n💡 A tabela cooperados não existe. Execute o script SQL primeiro:')
        console.log('1. Acesse o painel do Supabase')
        console.log('2. Vá para SQL Editor')
        console.log('3. Execute o conteúdo de supabase-migration.sql')
      }
      
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    console.log(`📊 Tabela cooperados: ${data[0]?.count || 0} registros`)
    
    return true
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
    return false
  }
}

testConnection()
