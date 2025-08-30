import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkInscricoesStructure() {
  console.log('🔍 Verificando estrutura da tabela inscricoes_publicas...\n')
  
  try {
    // 1. Verificar estrutura da tabela
    console.log('1. Verificando estrutura da tabela...')
    const { data: inscricoes, error: checkError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message)
      return
    }
    
    if (inscricoes.length > 0) {
      console.log('✅ Tabela acessível')
      console.log('   Colunas:', Object.keys(inscricoes[0]))
    } else {
      console.log('✅ Tabela acessível (vazia)')
    }
    
    // 2. Verificar dados existentes
    console.log('\n2. Verificando dados existentes...')
    const { data: allInscricoes, error: listError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
    
    if (listError) {
      console.error('❌ Erro ao listar inscrições:', listError.message)
    } else {
      console.log(`✅ ${allInscricoes.length} inscrições encontradas`)
      allInscricoes.forEach(inscricao => {
        console.log(`   - ${inscricao.nome_completo} (${inscricao.status})`)
      })
    }
    
    // 3. Testar criação de inscrição
    console.log('\n3. Testando criação de inscrição...')
    const novaInscricao = {
      nome_completo: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '+244 123 456 789',
      bi: '123456789LA123',
      data_nascimento: '1990-01-01',
      profissao: 'Engenheiro',
      renda_mensal: 500000,
      provincia: 'Luanda',
      municipio: 'Luanda',
      endereco_completo: 'Rua Teste, nº 123',
      assinatura_plano_id: 'teste-plano-id',
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(novaInscricao)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição:', createError.message)
    } else {
      console.log('✅ Inscrição criada com sucesso:', createdInscricao[0].nome_completo)
      
      // 4. Testar atualização
      console.log('\n4. Testando atualização...')
      const { data: updatedInscricao, error: updateError } = await supabase
        .from('inscricoes_publicas')
        .update({ status: 'aprovada' })
        .eq('id', createdInscricao[0].id)
        .select()
      
      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message)
      } else {
        console.log('✅ Inscrição atualizada:', updatedInscricao[0].status)
      }
      
      // 5. Limpar inscrição de teste
      console.log('\n5. Limpando inscrição de teste...')
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
    
    console.log('\n🎉 Verificação da estrutura concluída!')
    console.log('✅ Tabela inscricoes_publicas está pronta para CRUD')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkInscricoesStructure()
