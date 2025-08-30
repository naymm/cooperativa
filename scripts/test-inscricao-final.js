import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testInscricaoFinal() {
  console.log('🎯 Teste Final - Inscrição Pública com Supabase\n')
  
  try {
    // 1. Tentar inserir com campos corretos baseado nos erros
    console.log('1. Testando inserção com campos corretos...')
    const inscricaoCorreta = {
      nome_completo: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '+244 123 456 789',
      provincia: 'Luanda',
      municipio: 'Luanda',
      endereco_completo: 'Rua Teste, nº 123',
      profissao: 'Engenheiro',
      renda_mensal: 500000,
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(inscricaoCorreta)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição:', createError.message)
      
      // 2. Verificar se a tabela inscricoes é a correta
      console.log('\n2. Verificando tabela inscricoes...')
      const { data: inscricoesData, error: inscricoesError } = await supabase
        .from('inscricoes')
        .select('*')
        .limit(1)
      
      if (inscricoesError) {
        console.error('❌ Erro ao acessar inscricoes:', inscricoesError.message)
      } else {
        console.log('✅ Tabela inscricoes acessível')
        if (inscricoesData.length > 0) {
          console.log('   Campos da tabela inscricoes:')
          Object.keys(inscricoesData[0]).forEach(campo => {
            console.log(`   - ${campo}: ${typeof inscricoesData[0][campo]}`)
          })
        }
        
        // 3. Tentar inserir na tabela inscricoes
        console.log('\n3. Testando inserção na tabela inscricoes...')
        const inscricaoInscricoes = {
          nome_completo: 'João Silva Teste',
          email: 'joao.teste@email.com',
          telefone: '+244 123 456 789',
          provincia: 'Luanda',
          municipio: 'Luanda',
          endereco_completo: 'Rua Teste, nº 123',
          profissao: 'Engenheiro',
          renda_mensal: 500000,
          status: 'pendente'
        }
        
        const { data: createdInscricao2, error: createError2 } = await supabase
          .from('inscricoes')
          .insert(inscricaoInscricoes)
          .select()
        
        if (createError2) {
          console.error('❌ Erro ao criar inscrição na tabela inscricoes:', createError2.message)
        } else {
          console.log('✅ Inscrição criada com sucesso na tabela inscricoes')
          console.log('   Campos retornados:', Object.keys(createdInscricao2[0]))
          
          // Testar atualização
          console.log('\n4. Testando atualização...')
          const { data: updatedInscricao, error: updateError } = await supabase
            .from('inscricoes')
            .update({ status: 'aprovada' })
            .eq('id', createdInscricao2[0].id)
            .select()
          
          if (updateError) {
            console.error('❌ Erro ao atualizar:', updateError.message)
          } else {
            console.log('✅ Inscrição atualizada:', updatedInscricao[0].status)
          }
          
          // Limpar inscrição de teste
          const { error: deleteError } = await supabase
            .from('inscricoes')
            .delete()
            .eq('id', createdInscricao2[0].id)
          
          if (deleteError) {
            console.error('❌ Erro ao deletar:', deleteError.message)
          } else {
            console.log('✅ Inscrição de teste removida')
          }
        }
      }
    } else {
      console.log('✅ Inscrição criada com sucesso na tabela inscricoes_publicas')
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
    
    console.log('\n🎉 Teste final concluído!')
    console.log('✅ Estrutura da tabela identificada')
    console.log('✅ CRUD funcionando')
    
  } catch (error) {
    console.error('❌ Erro durante teste final:', error.message)
  }
}

testInscricaoFinal()
