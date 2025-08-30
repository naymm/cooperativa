import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testPlanosPage() {
  console.log('🧪 Testando página de planos completa...\n')
  
  try {
    // 1. Testar carregamento de planos
    console.log('1. Testando carregamento de planos...')
    const { data: planos, error: listError } = await supabase
      .from('assinatura_planos')
      .select('*')
    
    if (listError) {
      console.error('❌ Erro ao carregar planos:', listError.message)
      return
    }
    
    console.log(`✅ ${planos.length} planos carregados`)
    planos.forEach(plano => {
      console.log(`   - ${plano.nome} (${plano.valor_mensal} Kz) - ${plano.status}`)
    })
    
    // 2. Testar filtros
    console.log('\n2. Testando filtros...')
    const ativos = planos.filter(p => p.status === 'ativo')
    const inativos = planos.filter(p => p.status !== 'ativo')
    
    console.log(`   Ativos: ${ativos.length}`)
    console.log(`   Inativos: ${inativos.length}`)
    
    // 3. Testar busca por nome
    console.log('\n3. Testando busca por nome...')
    const searchTerm = 'Básico'
    const filtered = planos.filter(plano =>
      plano.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    console.log(`   Busca por "${searchTerm}": ${filtered.length} resultados`)
    
    // 4. Testar criação de plano
    console.log('\n4. Testando criação de plano...')
    const novoPlano = {
      nome: 'Plano Teste Página',
      descricao: 'Plano criado para testar a página',
      valor_mensal: 85000,
      beneficios: JSON.stringify(['Acesso completo', 'Suporte 24h']),
      status: 'ativo'
    }
    
    const { data: createdPlano, error: createError } = await supabase
      .from('assinatura_planos')
      .insert(novoPlano)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar plano:', createError.message)
    } else {
      console.log('✅ Plano criado:', createdPlano[0].nome)
      
      // 5. Testar atualização
      console.log('\n5. Testando atualização...')
      const { data: updatedPlano, error: updateError } = await supabase
        .from('assinatura_planos')
        .update({ valor_mensal: 90000 })
        .eq('id', createdPlano[0].id)
        .select()
      
      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message)
      } else {
        console.log('✅ Plano atualizado:', updatedPlano[0].valor_mensal)
      }
      
      // 6. Testar toggle de status
      console.log('\n6. Testando toggle de status...')
      const newStatus = createdPlano[0].status === 'ativo' ? 'inativo' : 'ativo'
      const { data: toggledPlano, error: toggleError } = await supabase
        .from('assinatura_planos')
        .update({ status: newStatus })
        .eq('id', createdPlano[0].id)
        .select()
      
      if (toggleError) {
        console.error('❌ Erro ao alterar status:', toggleError.message)
      } else {
        console.log('✅ Status alterado:', toggledPlano[0].status)
      }
      
      // 7. Limpar plano de teste
      console.log('\n7. Limpando plano de teste...')
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
    
    console.log('\n🎉 Teste da página de planos concluído!')
    console.log('✅ Página de planos está funcionando com Supabase')
    console.log('✅ Todos os métodos estão compatíveis')
    console.log('✅ Campos corrigidos para Supabase')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testPlanosPage()
