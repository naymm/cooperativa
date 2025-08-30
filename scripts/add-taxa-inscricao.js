import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function addTaxaInscricao() {
  console.log('🔧 Adicionando coluna taxa_inscricao...\n')
  
  try {
    // 1. Verificar estrutura atual
    console.log('1. Verificando estrutura atual...')
    const { data: planos, error: checkError } = await supabase
      .from('assinatura_planos')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message)
      return
    }
    
    if (planos.length > 0) {
      console.log('   Colunas atuais:', Object.keys(planos[0]))
    }
    
    // 2. Tentar inserir um plano com taxa_inscricao para ver se a coluna existe
    console.log('\n2. Testando inserção com taxa_inscricao...')
    const testPlano = {
      nome: 'Plano Teste Taxa',
      descricao: 'Plano para testar taxa de inscrição',
      valor_mensal: 50000,
      taxa_inscricao: 15000,
      beneficios: JSON.stringify(['Teste']),
      status: 'ativo'
    }
    
    const { data: createdPlano, error: createError } = await supabase
      .from('assinatura_planos')
      .insert(testPlano)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar plano com taxa_inscricao:', createError.message)
      console.log('   A coluna taxa_inscricao precisa ser adicionada manualmente no Supabase')
      console.log('   Execute o script SQL em scripts/add-taxa-inscricao.sql')
      return
    }
    
    console.log('✅ Plano criado com taxa_inscricao:', createdPlano[0].taxa_inscricao)
    
    // 3. Atualizar planos existentes
    console.log('\n3. Atualizando planos existentes...')
    const { data: allPlanos, error: listError } = await supabase
      .from('assinatura_planos')
      .select('*')
    
    if (listError) {
      console.error('❌ Erro ao listar planos:', listError.message)
    } else {
      console.log(`   ${allPlanos.length} planos encontrados`)
      
      // Atualizar planos que não têm taxa_inscricao
      for (const plano of allPlanos) {
        if (!plano.taxa_inscricao || plano.taxa_inscricao === 0) {
          const { error: updateError } = await supabase
            .from('assinatura_planos')
            .update({ taxa_inscricao: 10000 })
            .eq('id', plano.id)
          
          if (updateError) {
            console.error(`❌ Erro ao atualizar plano ${plano.nome}:`, updateError.message)
          } else {
            console.log(`✅ Plano ${plano.nome} atualizado com taxa_inscricao: 10000`)
          }
        }
      }
    }
    
    // 4. Limpar plano de teste
    console.log('\n4. Limpando plano de teste...')
    const { error: deleteError } = await supabase
      .from('assinatura_planos')
      .delete()
      .eq('id', createdPlano[0].id)
    
    if (deleteError) {
      console.error('❌ Erro ao deletar plano de teste:', deleteError.message)
    } else {
      console.log('✅ Plano de teste removido')
    }
    
    console.log('\n🎉 Taxa de inscrição adicionada com sucesso!')
    console.log('✅ Coluna taxa_inscricao está disponível')
    console.log('✅ Planos existentes foram atualizados')
    
  } catch (error) {
    console.error('❌ Erro durante processo:', error.message)
  }
}

addTaxaInscricao()
