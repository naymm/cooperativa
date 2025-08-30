import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkInscricoesStatus() {
  console.log('🔍 Verificando valores válidos do status...\n')
  
  try {
    // 1. Verificar estrutura da tabela
    console.log('1. Verificando estrutura da tabela...')
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .limit(1)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesError.message)
      return
    }
    
    if (inscricoes.length > 0) {
      console.log('   Campos da tabela:')
      Object.keys(inscricoes[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof inscricoes[0][campo]}`)
      })
    }
    
    // 2. Verificar valores de status existentes
    console.log('\n2. Verificando valores de status existentes...')
    const { data: statusValues, error: statusError } = await supabase
      .from('inscricoes_publicas')
      .select('status')
    
    if (statusError) {
      console.error('❌ Erro ao verificar status:', statusError.message)
    } else {
      const uniqueStatus = [...new Set(statusValues.map(item => item.status))]
      console.log('   Valores de status encontrados:')
      uniqueStatus.forEach(status => {
        const count = statusValues.filter(item => item.status === status).length
        console.log(`     - ${status}: ${count} registros`)
      })
    }
    
    // 3. Tentar diferentes valores de status
    console.log('\n3. Testando diferentes valores de status...')
    const testValues = ['pendente', 'aprovado', 'rejeitado', 'aprovada', 'rejeitada', 'pendente']
    
    for (const testValue of testValues) {
      console.log(`   Testando status: "${testValue}"`)
      
      // Primeiro, pegar uma inscrição para testar
      const { data: inscricao, error: getError } = await supabase
        .from('inscricoes_publicas')
        .select('id, status')
        .limit(1)
      
      if (getError || inscricao.length === 0) {
        console.log(`     ❌ Não foi possível obter inscrição para testar`)
        continue
      }
      
      const inscricaoId = inscricao[0].id
      const statusOriginal = inscricao[0].status
      
      // Tentar atualizar
      const { data: updated, error: updateError } = await supabase
        .from('inscricoes_publicas')
        .update({ status: testValue })
        .eq('id', inscricaoId)
        .select()
      
      if (updateError) {
        console.log(`     ❌ Erro: ${updateError.message}`)
      } else {
        console.log(`     ✅ Sucesso: status atualizado para "${testValue}"`)
        
        // Reverter para o valor original
        const { error: revertError } = await supabase
          .from('inscricoes_publicas')
          .update({ status: statusOriginal })
          .eq('id', inscricaoId)
        
        if (revertError) {
          console.log(`     ⚠️  Erro ao reverter: ${revertError.message}`)
        } else {
          console.log(`     ✅ Status revertido para "${statusOriginal}"`)
        }
      }
    }
    
    // 4. Verificar se há constraints
    console.log('\n4. Verificando constraints...')
    console.log('   Baseado nos erros, parece haver uma constraint de check no campo status')
    console.log('   Valores válidos provavelmente são: pendente, aprovado, rejeitado')
    
    console.log('\n🎉 Verificação de status concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkInscricoesStatus()
