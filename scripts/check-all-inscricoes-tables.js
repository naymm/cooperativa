import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkAllInscricoesTables() {
  console.log('🔍 Verificando todas as tabelas relacionadas a inscrições...\n')
  
  try {
    // Lista de possíveis tabelas
    const tabelas = [
      'inscricoes',
      'inscricoes_publicas', 
      'public_inscricoes',
      'cadastros',
      'cadastros_publicos',
      'candidatos',
      'candidaturas'
    ]
    
    for (const tabela of tabelas) {
      console.log(`\n📋 Verificando tabela: ${tabela}`)
      
      try {
        const { data, error } = await supabase
          .from(tabela)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`   ❌ Tabela ${tabela} não existe ou não é acessível`)
        } else {
          console.log(`   ✅ Tabela ${tabela} existe`)
          console.log(`   📊 ${data.length} registros encontrados`)
          
          if (data.length > 0) {
            console.log(`   📝 Campos: ${Object.keys(data[0]).join(', ')}`)
            
            // Tentar inserir um registro de teste
            console.log(`   🧪 Testando inserção...`)
            const testData = {
              nome_completo: 'Teste Inscrição',
              telefone: '+244 123 456 789',
              status: 'pendente'
            }
            
            const { data: created, error: createError } = await supabase
              .from(tabela)
              .insert(testData)
              .select()
            
            if (createError) {
              console.log(`   ❌ Erro ao inserir: ${createError.message}`)
            } else {
              console.log(`   ✅ Inserção bem-sucedida! ID: ${created[0].id}`)
              
              // Limpar registro de teste
              const { error: deleteError } = await supabase
                .from(tabela)
                .delete()
                .eq('id', created[0].id)
              
              if (deleteError) {
                console.log(`   ⚠️  Erro ao deletar teste: ${deleteError.message}`)
              } else {
                console.log(`   ✅ Registro de teste removido`)
              }
            }
          }
        }
      } catch (err) {
        console.log(`   ❌ Erro ao acessar ${tabela}: ${err.message}`)
      }
    }
    
    console.log('\n🎉 Verificação de todas as tabelas concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkAllInscricoesTables()
