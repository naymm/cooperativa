import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkInscricoesPublicasSchema() {
  console.log('🔍 Verificando estrutura real da tabela inscricoes_publicas...\n')
  
  try {
    // 1. Tentar inserir com campos obrigatórios
    console.log('1. Testando inserção com campos obrigatórios...')
    const inscricaoObrigatoria = {
      nome_completo: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '+244 123 456 789',
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(inscricaoObrigatoria)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição:', createError.message)
      
      // 2. Tentar inserir apenas com nome e email
      console.log('\n2. Testando inserção apenas com nome e email...')
      const inscricaoMinima = {
        nome_completo: 'João Silva Teste',
        email: 'joao.teste@email.com'
      }
      
      const { data: createdMinima, error: createMinimaError } = await supabase
        .from('inscricoes_publicas')
        .insert(inscricaoMinima)
        .select()
      
      if (createMinimaError) {
        console.error('❌ Erro ao criar inscrição mínima:', createMinimaError.message)
        
        // 3. Verificar se há dados existentes para ver a estrutura
        console.log('\n3. Verificando dados existentes...')
        const { data: existingData, error: existingError } = await supabase
          .from('inscricoes_publicas')
          .select('*')
          .limit(5)
        
        if (existingError) {
          console.error('❌ Erro ao buscar dados existentes:', existingError.message)
        } else {
          console.log(`✅ ${existingData.length} registros encontrados`)
          if (existingData.length > 0) {
            console.log('   Estrutura do primeiro registro:')
            Object.keys(existingData[0]).forEach(campo => {
              console.log(`   - ${campo}: ${typeof existingData[0][campo]}`)
            })
          }
        }
      } else {
        console.log('✅ Inscrição mínima criada com sucesso')
        console.log('   Campos retornados:', Object.keys(createdMinima[0]))
        
        // Limpar inscrição de teste
        const { error: deleteError } = await supabase
          .from('inscricoes_publicas')
          .delete()
          .eq('id', createdMinima[0].id)
        
        if (deleteError) {
          console.error('❌ Erro ao deletar:', deleteError.message)
        } else {
          console.log('✅ Inscrição de teste removida')
        }
      }
    } else {
      console.log('✅ Inscrição criada com sucesso')
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
    
    // 4. Verificar se a tabela inscricoes tem estrutura diferente
    console.log('\n4. Verificando tabela inscricoes...')
    const { data: inscricoesData, error: inscricoesError } = await supabase
      .from('inscricoes')
      .select('*')
      .limit(1)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar tabela inscricoes:', inscricoesError.message)
    } else {
      console.log('✅ Tabela inscricoes acessível')
      if (inscricoesData.length > 0) {
        console.log('   Campos da tabela inscricoes:')
        Object.keys(inscricoesData[0]).forEach(campo => {
          console.log(`   - ${campo}: ${typeof inscricoesData[0][campo]}`)
        })
      }
    }
    
    console.log('\n🎉 Verificação do schema concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkInscricoesPublicasSchema()
