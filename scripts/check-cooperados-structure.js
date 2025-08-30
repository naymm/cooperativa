import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkCooperadosStructure() {
  console.log('🔍 Verificando estrutura da tabela cooperados...\n')
  
  try {
    // 1. Verificar estrutura da tabela cooperados
    console.log('1. Verificando estrutura da tabela cooperados...')
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
      .limit(1)
    
    if (cooperadosError) {
      console.error('❌ Erro ao acessar cooperados:', cooperadosError.message)
      return
    }
    
    if (cooperados.length > 0) {
      console.log('   Campos da tabela cooperados:')
      Object.keys(cooperados[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof cooperados[0][campo]}`)
      })
    } else {
      console.log('   ⚠️  Tabela cooperados está vazia')
    }
    
    // 2. Verificar estrutura da tabela inscricoes_publicas
    console.log('\n2. Verificando estrutura da tabela inscricoes_publicas...')
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .limit(1)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesError.message)
      return
    }
    
    if (inscricoes.length > 0) {
      console.log('   Campos da tabela inscricoes_publicas:')
      Object.keys(inscricoes[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof inscricoes[0][campo]}`)
      })
    } else {
      console.log('   ⚠️  Tabela inscricoes_publicas está vazia')
    }
    
    // 3. Comparar estruturas
    console.log('\n3. Comparando estruturas...')
    if (cooperados.length > 0 && inscricoes.length > 0) {
      const camposCooperados = Object.keys(cooperados[0])
      const camposInscricoes = Object.keys(inscricoes[0])
      
      console.log(`   Campos em cooperados: ${camposCooperados.length}`)
      console.log(`   Campos em inscricoes_publicas: ${camposInscricoes.length}`)
      
      // Campos que estão em cooperados mas não em inscricoes_publicas
      const camposFaltantes = camposCooperados.filter(campo => !camposInscricoes.includes(campo))
      console.log('\n   Campos que faltam em inscricoes_publicas:')
      if (camposFaltantes.length > 0) {
        camposFaltantes.forEach(campo => {
          console.log(`     ❌ ${campo}`)
        })
      } else {
        console.log('     ✅ Nenhum campo faltando')
      }
      
      // Campos que estão em inscricoes_publicas mas não em cooperados
      const camposExtras = camposInscricoes.filter(campo => !camposCooperados.includes(campo))
      console.log('\n   Campos extras em inscricoes_publicas:')
      if (camposExtras.length > 0) {
        camposExtras.forEach(campo => {
          console.log(`     ⚠️  ${campo}`)
        })
      } else {
        console.log('     ✅ Nenhum campo extra')
      }
      
      // Campos comuns
      const camposComuns = camposCooperados.filter(campo => camposInscricoes.includes(campo))
      console.log('\n   Campos comuns:')
      camposComuns.forEach(campo => {
        console.log(`     ✅ ${campo}`)
      })
    }
    
    // 4. Sugerir alterações
    console.log('\n4. Sugestões de alterações...')
    console.log('   Para garantir compatibilidade total:')
    console.log('   1. Adicionar campos faltantes em inscricoes_publicas')
    console.log('   2. Mapear campos com nomes diferentes')
    console.log('   3. Garantir tipos de dados compatíveis')
    
    console.log('\n🎉 Verificação de estrutura concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkCooperadosStructure()
