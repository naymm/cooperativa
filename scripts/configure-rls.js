import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function configureRLS() {
  console.log('🔧 Configurando políticas RLS...\n')
  
  try {
    // Para migração, vamos desabilitar RLS temporariamente
    console.log('📝 Desabilitando RLS para migração...')
    
    const tables = [
      'cooperados',
      'assinatura_planos',
      'projetos',
      'pagamentos',
      'cooperado_auth',
      'cooperado_notificacoes',
      'cooperado_suporte',
      'crm_notificacoes',
      'inscricoes',
      'inscricoes_publicas',
      'email_logs',
      'email_templates',
      'email_queue',
      'crm_users'
    ]
    
    for (const table of tables) {
      try {
        // Desabilitar RLS temporariamente
        const { error } = await supabase.rpc('disable_rls', { table_name: table })
        
        if (error) {
          console.log(`⚠️  Não foi possível desabilitar RLS para ${table}: ${error.message}`)
        } else {
          console.log(`✅ RLS desabilitado para ${table}`)
        }
      } catch (error) {
        console.log(`⚠️  Erro ao configurar ${table}: ${error.message}`)
      }
    }
    
    console.log('\n🎉 Configuração RLS concluída!')
    console.log('Agora você pode executar a migração de dados.')
    
  } catch (error) {
    console.error('❌ Erro durante configuração RLS:', error.message)
  }
}

configureRLS()
