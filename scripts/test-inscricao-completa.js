import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testInscricaoCompleta() {
  console.log('🧪 Testando inserção completa na tabela inscricoes_publicas...\n')
  
  try {
    // 1. Tentar inserir com todos os campos possíveis
    console.log('1. Testando inserção com todos os campos...')
    const inscricaoCompleta = {
      nome_completo: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '+244 123 456 789',
      provincia: 'Luanda',
      municipio: 'Luanda',
      endereco_completo: 'Rua Teste, nº 123',
      data_nascimento: '1990-01-01',
      profissao: 'Engenheiro',
      renda_mensal: 500000,
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(inscricaoCompleta)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição completa:', createError.message)
      
      // 2. Tentar inserir com campos mínimos obrigatórios
      console.log('\n2. Testando inserção com campos mínimos...')
      const inscricaoMinima = {
        nome_completo: 'João Silva Teste',
        email: 'joao.teste@email.com',
        telefone: '+244 123 456 789',
        provincia: 'Luanda',
        municipio: 'Luanda',
        status: 'pendente'
      }
      
      const { data: createdMinima, error: createMinimaError } = await supabase
        .from('inscricoes_publicas')
        .insert(inscricaoMinima)
        .select()
      
      if (createMinimaError) {
        console.error('❌ Erro ao criar inscrição mínima:', createMinimaError.message)
        
        // 3. Verificar estrutura da tabela inscricoes
        console.log('\n3. Verificando estrutura da tabela inscricoes...')
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
        }
      } else {
        console.log('✅ Inscrição mínima criada com sucesso')
        console.log('   Campos retornados:', Object.keys(createdMinima[0]))
        
        // Testar atualização
        console.log('\n4. Testando atualização...')
        const { data: updatedInscricao, error: updateError } = await supabase
          .from('inscricoes_publicas')
          .update({ status: 'aprovada' })
          .eq('id', createdMinima[0].id)
          .select()
        
        if (updateError) {
          console.error('❌ Erro ao atualizar:', updateError.message)
        } else {
          console.log('✅ Inscrição atualizada:', updatedInscricao[0].status)
        }
        
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
      console.log('✅ Inscrição completa criada com sucesso')
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

testInscricaoCompleta()
