import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testInscricoesPublicasMinimal() {
  console.log('🧪 Testando inserção mínima na tabela inscricoes_publicas...\n')
  
  try {
    // 1. Tentar inserir com campos mínimos
    console.log('1. Testando inserção com campos mínimos...')
    const inscricaoMinima = {
      nome_completo: 'João Silva Teste',
      telefone: '+244 123 456 789',
      provincia: 'Luanda',
      municipio: 'Luanda',
      profissao: 'Engenheiro',
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(inscricaoMinima)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição mínima:', createError.message)
      
      // 2. Tentar inserir apenas com nome
      console.log('\n2. Testando inserção apenas com nome...')
      const inscricaoNome = {
        nome_completo: 'João Silva Teste'
      }
      
      const { data: createdNome, error: createNomeError } = await supabase
        .from('inscricoes_publicas')
        .insert(inscricaoNome)
        .select()
      
      if (createNomeError) {
        console.error('❌ Erro ao criar inscrição apenas com nome:', createNomeError.message)
        
        // 3. Verificar se há constraints específicos
        console.log('\n3. Verificando constraints...')
        console.log('   Tentando inserir com diferentes combinações...')
        
        const tentativas = [
          { nome_completo: 'João Silva', telefone: '+244 123 456 789' },
          { nome_completo: 'João Silva', provincia: 'Luanda' },
          { nome_completo: 'João Silva', municipio: 'Luanda' },
          { nome_completo: 'João Silva', profissao: 'Engenheiro' },
          { nome_completo: 'João Silva', status: 'pendente' }
        ]
        
        for (let i = 0; i < tentativas.length; i++) {
          const tentativa = tentativas[i]
          console.log(`   Tentativa ${i + 1}: ${JSON.stringify(tentativa)}`)
          
          const { data, error } = await supabase
            .from('inscricoes_publicas')
            .insert(tentativa)
            .select()
          
          if (error) {
            console.log(`   ❌ Erro: ${error.message}`)
          } else {
            console.log(`   ✅ Sucesso! ID: ${data[0].id}`)
            
            // Limpar registro
            await supabase
              .from('inscricoes_publicas')
              .delete()
              .eq('id', data[0].id)
            
            break
          }
        }
      } else {
        console.log('✅ Inscrição criada apenas com nome')
        console.log('   Campos retornados:', Object.keys(createdNome[0]))
        
        // Limpar inscrição de teste
        const { error: deleteError } = await supabase
          .from('inscricoes_publicas')
          .delete()
          .eq('id', createdNome[0].id)
        
        if (deleteError) {
          console.error('❌ Erro ao deletar:', deleteError.message)
        } else {
          console.log('✅ Inscrição de teste removida')
        }
      }
    } else {
      console.log('✅ Inscrição mínima criada com sucesso')
      console.log('   Campos retornados:', Object.keys(createdInscricao[0]))
      
      // Limpar inscrição de teste
      const { error: deleteError } = await supabase
        .from('inscricoes_publicas')
        .delete()
        .eq('id', createdInscricao[0].id)
      
      if (deleteError) {
        console.error('❌ Erro ao deletar:', deleteError.message)
      } else {
        console.log('✅ Inscrição de teste removida')
      }
    }
    
    console.log('\n🎉 Teste concluído!')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testInscricoesPublicasMinimal()
