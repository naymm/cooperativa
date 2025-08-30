import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkInscricoesData() {
  console.log('🔍 Verificando dados existentes na tabela inscricoes...\n')
  
  try {
    // 1. Verificar dados existentes
    console.log('1. Verificando dados existentes...')
    const { data: inscricoes, error: listError } = await supabase
      .from('inscricoes')
      .select('*')
      .limit(5)
    
    if (listError) {
      console.error('❌ Erro ao listar inscrições:', listError.message)
      return
    }
    
    console.log(`✅ ${inscricoes.length} inscrições encontradas`)
    
    if (inscricoes.length > 0) {
      console.log('\n2. Estrutura da primeira inscrição:')
      const primeira = inscricoes[0]
      Object.keys(primeira).forEach(campo => {
        console.log(`   - ${campo}: ${typeof primeira[campo]} = ${primeira[campo]}`)
      })
      
      // 3. Tentar inserir com a mesma estrutura
      console.log('\n3. Testando inserção com estrutura similar...')
      const novaInscricao = {
        nome_completo: 'João Silva Teste',
        telefone: '+244 123 456 789',
        provincia: 'Luanda',
        municipio: 'Luanda',
        profissao: 'Engenheiro',
        renda_mensal: 500000,
        status: 'pendente'
      }
      
      // Adicionar campos que existem na primeira inscrição
      Object.keys(primeira).forEach(campo => {
        if (!novaInscricao[campo] && campo !== 'id' && campo !== 'created_at' && campo !== 'updated_at') {
          if (typeof primeira[campo] === 'string') {
            novaInscricao[campo] = 'teste'
          } else if (typeof primeira[campo] === 'number') {
            novaInscricao[campo] = 0
          } else if (typeof primeira[campo] === 'boolean') {
            novaInscricao[campo] = false
          }
        }
      })
      
      console.log('   Dados para inserção:', novaInscricao)
      
      const { data: createdInscricao, error: createError } = await supabase
        .from('inscricoes')
        .insert(novaInscricao)
        .select()
      
      if (createError) {
        console.error('❌ Erro ao criar inscrição:', createError.message)
      } else {
        console.log('✅ Inscrição criada com sucesso')
        console.log('   ID:', createdInscricao[0].id)
        
        // Limpar inscrição de teste
        const { error: deleteError } = await supabase
          .from('inscricoes')
          .delete()
          .eq('id', createdInscricao[0].id)
        
        if (deleteError) {
          console.error('❌ Erro ao deletar:', deleteError.message)
        } else {
          console.log('✅ Inscrição de teste removida')
        }
      }
    }
    
    console.log('\n🎉 Verificação concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkInscricoesData()
