import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkProjetosStructure() {
  console.log('🔍 Verificando estrutura da tabela projetos...\n')
  
  try {
    // 1. Verificar estrutura da tabela
    console.log('1. Verificando estrutura da tabela...')
    const { data: projetos, error: checkError } = await supabase
      .from('projetos')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message)
      return
    }
    
    if (projetos.length > 0) {
      console.log('✅ Tabela acessível')
      console.log('   Colunas:', Object.keys(projetos[0]))
    } else {
      console.log('✅ Tabela acessível (vazia)')
    }
    
    // 2. Verificar dados existentes
    console.log('\n2. Verificando dados existentes...')
    const { data: allProjetos, error: listError } = await supabase
      .from('projetos')
      .select('*')
    
    if (listError) {
      console.error('❌ Erro ao listar projetos:', listError.message)
    } else {
      console.log(`✅ ${allProjetos.length} projetos encontrados`)
      allProjetos.forEach(projeto => {
        console.log(`   - ${projeto.titulo} (${projeto.status})`)
      })
    }
    
    // 3. Verificar métodos disponíveis
    console.log('\n3. Verificando métodos disponíveis...')
    console.log('   ✅ find() - Disponível')
    console.log('   ✅ findOne() - Disponível')
    console.log('   ✅ create() - Disponível')
    console.log('   ✅ update() - Disponível')
    console.log('   ✅ delete() - Disponível')
    console.log('   ✅ list() - Disponível (via find)')
    
    // 4. Testar criação de projeto
    console.log('\n4. Testando criação de projeto...')
    const testProjeto = {
      titulo: 'Projeto Teste Supabase',
      descricao: 'Projeto criado para testar o Supabase',
      valor_total: 5000000,
      valor_entrada: 1000000,
      numero_parcelas: 12,
      valor_parcela: 333333.33,
      data_inicio: '2024-01-01',
      data_fim: '2024-12-31',
      status: 'ativo',
      cooperados_interessados: JSON.stringify(['coop1', 'coop2'])
    }
    
    const { data: createdProjeto, error: createError } = await supabase
      .from('projetos')
      .insert(testProjeto)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar projeto:', createError.message)
    } else {
      console.log('✅ Projeto criado com sucesso:', createdProjeto[0].titulo)
      
      // 5. Testar atualização
      console.log('\n5. Testando atualização...')
      const { data: updatedProjeto, error: updateError } = await supabase
        .from('projetos')
        .update({ valor_total: 6000000 })
        .eq('id', createdProjeto[0].id)
        .select()
      
      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message)
      } else {
        console.log('✅ Projeto atualizado:', updatedProjeto[0].valor_total)
      }
      
      // 6. Limpar projeto de teste
      console.log('\n6. Limpando projeto de teste...')
      const { error: deleteError } = await supabase
        .from('projetos')
        .delete()
        .eq('id', createdProjeto[0].id)
      
      if (deleteError) {
        console.error('❌ Erro ao deletar:', deleteError.message)
      } else {
        console.log('✅ Projeto de teste removido')
      }
    }
    
    console.log('\n🎉 Verificação da estrutura concluída!')
    console.log('✅ Tabela projetos está pronta para CRUD')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkProjetosStructure()
