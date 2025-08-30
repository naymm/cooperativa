import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkInscricoesSchema() {
  console.log('🔍 Verificando schema da tabela inscricoes_publicas...\n')
  
  try {
    // 1. Tentar inserir com campos básicos primeiro
    console.log('1. Testando inserção com campos básicos...')
    const inscricaoBasica = {
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
      status: 'pendente'
    }
    
    const { data: createdInscricao, error: createError } = await supabase
      .from('inscricoes_publicas')
      .insert(inscricaoBasica)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar inscrição básica:', createError.message)
      
      // 2. Tentar inserir apenas com campos essenciais
      console.log('\n2. Testando inserção com campos essenciais...')
      const inscricaoMinima = {
        nome_completo: 'João Silva Teste',
        email: 'joao.teste@email.com',
        status: 'pendente'
      }
      
      const { data: createdMinima, error: createMinimaError } = await supabase
        .from('inscricoes_publicas')
        .insert(inscricaoMinima)
        .select()
      
      if (createMinimaError) {
        console.error('❌ Erro ao criar inscrição mínima:', createMinimaError.message)
        
        // 3. Verificar se a tabela existe
        console.log('\n3. Verificando se a tabela existe...')
        const { data: testQuery, error: testError } = await supabase
          .from('inscricoes_publicas')
          .select('*')
          .limit(1)
        
        if (testError) {
          console.error('❌ Tabela não existe ou não é acessível:', testError.message)
          return
        } else {
          console.log('✅ Tabela existe e é acessível')
        }
      } else {
        console.log('✅ Inscrição mínima criada com sucesso')
        
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
      console.log('✅ Inscrição básica criada com sucesso')
      
      // Verificar campos retornados
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
    
    // 4. Verificar se há outras tabelas relacionadas
    console.log('\n4. Verificando tabelas relacionadas...')
    const tabelas = ['inscricoes', 'inscricoes_publicas', 'public_inscricoes']
    
    for (const tabela of tabelas) {
      const { data, error } = await supabase
        .from(tabela)
        .select('*')
        .limit(1)
      
      if (!error) {
        console.log(`✅ Tabela ${tabela} existe`)
        if (data.length > 0) {
          console.log(`   Campos: ${Object.keys(data[0])}`)
        }
      } else {
        console.log(`❌ Tabela ${tabela} não existe`)
      }
    }
    
    console.log('\n🎉 Verificação do schema concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkInscricoesSchema()
