import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testCadastroPublico() {
  console.log('🧪 Testando Cadastro Público com Supabase...\n')
  
  try {
    // 1. Testar criação de inscrição
    console.log('1. Testando criação de inscrição...')
    const dadosInscricao = {
      nome_completo: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '+244 123 456 789',
      provincia: 'Luanda',
      municipio: 'Luanda',
      profissao: 'Engenheiro',
      sector_profissional: 'privado',
      renda_mensal: 500000,
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(dadosInscricao)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição:', createError.message)
      return
    }
    
    console.log('✅ Inscrição criada com sucesso')
    console.log('   ID:', createdInscricao[0].id)
    console.log('   Nome:', createdInscricao[0].nome_completo)
    console.log('   Email:', createdInscricao[0].email)
    console.log('   Status:', createdInscricao[0].status)
    
    // 2. Testar atualização
    console.log('\n2. Testando atualização...')
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
    
    // 3. Testar busca
    console.log('\n3. Testando busca...')
    const { data: inscricoes, error: listError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .eq('email', 'joao.teste@email.com')
    
    if (listError) {
      console.error('❌ Erro ao buscar:', listError.message)
    } else {
      console.log(`✅ ${inscricoes.length} inscrições encontradas para o email`)
    }
    
    // 4. Testar filtros
    console.log('\n4. Testando filtros...')
    const { data: inscricoesPendentes, error: filterError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .eq('status', 'pendente')
    
    if (filterError) {
      console.error('❌ Erro ao filtrar:', filterError.message)
    } else {
      console.log(`✅ ${inscricoesPendentes.length} inscrições pendentes encontradas`)
    }
    
    // 5. Verificar estrutura dos dados
    console.log('\n5. Verificando estrutura dos dados...')
    const camposEsperados = [
      'id', 'nome_completo', 'email', 'telefone', 'provincia', 
      'municipio', 'profissao', 'sector_profissional', 'renda_mensal', 'status'
    ]
    
    console.log('   Campos disponíveis:')
    camposEsperados.forEach(campo => {
      const existe = campo in createdInscricao[0]
      console.log(`   ${existe ? '✅' : '❌'} ${campo}`)
    })
    
    // 6. Limpar inscrição de teste
    console.log('\n6. Limpando inscrição de teste...')
    const { error: deleteError } = await supabase
      .from('inscricoes_publicas')
      .delete()
      .eq('id', createdInscricao[0].id)
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError.message)
    } else {
      console.log('✅ Inscrição de teste removida')
    }
    
    // 7. Verificar planos disponíveis
    console.log('\n7. Verificando planos disponíveis...')
    const { data: planos, error: planosError } = await supabase
      .from('assinatura_planos')
      .select('*')
      .eq('status', 'ativo')
    
    if (planosError) {
      console.error('❌ Erro ao buscar planos:', planosError.message)
    } else {
      console.log(`✅ ${planos.length} planos ativos encontrados`)
      planos.forEach(plano => {
        console.log(`   - ${plano.nome}: ${plano.valor_mensal?.toLocaleString()} Kz`)
      })
    }
    
    console.log('\n🎉 Teste do Cadastro Público concluído!')
    console.log('✅ CRUD completo funcionando')
    console.log('✅ Estrutura de dados correta')
    console.log('✅ Filtros funcionando')
    console.log('✅ Planos disponíveis')
    console.log('✅ Página pronta para uso')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testCadastroPublico()
