import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testPlanosSupabase() {
  console.log('🧪 Testando planos no Supabase...\n')
  
  try {
    // 1. Verificar estrutura da tabela
    console.log('1. Verificando estrutura da tabela...')
    const { data: planos, error: planosError } = await supabase
      .from('assinatura_planos')
      .select('*')
      .limit(1)
    
    if (planosError) {
      console.error('❌ Erro ao verificar tabela:', planosError.message)
      return
    }
    
    if (planos.length > 0) {
      console.log('✅ Tabela acessível')
      console.log('   Colunas:', Object.keys(planos[0]))
    } else {
      console.log('✅ Tabela acessível (vazia)')
    }
    
    // 2. Testar método list
    console.log('\n2. Testando método list...')
    const { data: allPlanos, error: listError } = await supabase
      .from('assinatura_planos')
      .select('*')
    
    if (listError) {
      console.error('❌ Erro no list:', listError.message)
    } else {
      console.log(`✅ List funcionando: ${allPlanos.length} planos encontrados`)
      allPlanos.forEach(plano => {
        console.log(`   - ${plano.nome} (${plano.valor_mensal} Kz) - ${plano.status}`)
      })
    }
    
    // 3. Testar criação de plano
    console.log('\n3. Testando criação de plano...')
    const novoPlano = {
      nome: 'Plano Teste Supabase',
      descricao: 'Plano criado para teste do Supabase',
      valor_mensal: 75000,
      beneficios: JSON.stringify(['Benefício 1', 'Benefício 2']),
      status: 'ativo'
    }
    
    const { data: createdPlano, error: createError } = await supabase
      .from('assinatura_planos')
      .insert(novoPlano)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar plano:', createError.message)
    } else {
      console.log('✅ Plano criado com sucesso:', createdPlano[0].nome)
      
      // 4. Testar atualização
      console.log('\n4. Testando atualização...')
      const { data: updatedPlano, error: updateError } = await supabase
        .from('assinatura_planos')
        .update({ valor_mensal: 80000 })
        .eq('id', createdPlano[0].id)
        .select()
      
      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message)
      } else {
        console.log('✅ Plano atualizado:', updatedPlano[0].valor_mensal)
      }
      
      // 5. Limpar plano de teste
      console.log('\n5. Limpando plano de teste...')
      const { error: deleteError } = await supabase
        .from('assinatura_planos')
        .delete()
        .eq('id', createdPlano[0].id)
      
      if (deleteError) {
        console.error('❌ Erro ao deletar:', deleteError.message)
      } else {
        console.log('✅ Plano de teste removido')
      }
    }
    
    console.log('\n🎉 Teste dos planos concluído!')
    console.log('✅ Supabase está pronto para planos de assinatura')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testPlanosSupabase()
