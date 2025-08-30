import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testInscricoesPage() {
  console.log('🧪 Testando página de Inscrições...\n')
  
  try {
    // 1. Verificar tabela inscricoes
    console.log('1. Verificando tabela inscricoes...')
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from('inscricoes')
      .select('*')
      .limit(5)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes:', inscricoesError.message)
    } else {
      console.log(`✅ Tabela inscricoes acessível - ${inscricoes.length} registros`)
      if (inscricoes.length > 0) {
        console.log('   Primeiro registro:')
        console.log(`     ID: ${inscricoes[0].id}`)
        console.log(`     Nome: ${inscricoes[0].nome_completo}`)
        console.log(`     Status: ${inscricoes[0].status}`)
      }
    }
    
    // 2. Verificar tabela inscricoes_publicas
    console.log('\n2. Verificando tabela inscricoes_publicas...')
    const { data: inscricoesPublicas, error: inscricoesPublicasError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .limit(5)
    
    if (inscricoesPublicasError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesPublicasError.message)
    } else {
      console.log(`✅ Tabela inscricoes_publicas acessível - ${inscricoesPublicas.length} registros`)
      if (inscricoesPublicas.length > 0) {
        console.log('   Primeiro registro:')
        console.log(`     ID: ${inscricoesPublicas[0].id}`)
        console.log(`     Nome: ${inscricoesPublicas[0].nome_completo}`)
        console.log(`     Status: ${inscricoesPublicas[0].status}`)
      }
    }
    
    // 3. Verificar estrutura das tabelas
    console.log('\n3. Verificando estrutura das tabelas...')
    
    if (inscricoes.length > 0) {
      console.log('   Campos da tabela inscricoes:')
      Object.keys(inscricoes[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof inscricoes[0][campo]}`)
      })
    }
    
    if (inscricoesPublicas.length > 0) {
      console.log('   Campos da tabela inscricoes_publicas:')
      Object.keys(inscricoesPublicas[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof inscricoesPublicas[0][campo]}`)
      })
    }
    
    // 4. Testar carregamento combinado
    console.log('\n4. Testando carregamento combinado...')
    const todasInscricoes = [
      ...(inscricoes || []),
      ...(inscricoesPublicas || []).map(inscricao => ({
        ...inscricao,
        fonte: 'publica'
      }))
    ]
    
    console.log(`✅ Total de inscrições: ${todasInscricoes.length}`)
    
    // 5. Verificar estatísticas
    console.log('\n5. Verificando estatísticas...')
    const pendentes = todasInscricoes.filter(i => i.status === 'pendente')
    const aprovadas = todasInscricoes.filter(i => i.status === 'aprovado')
    const rejeitadas = todasInscricoes.filter(i => i.status === 'rejeitado')
    
    console.log(`   Pendentes: ${pendentes.length}`)
    console.log(`   Aprovadas: ${aprovadas.length}`)
    console.log(`   Rejeitadas: ${rejeitadas.length}`)
    
    // 6. Testar busca
    console.log('\n6. Testando busca...')
    const searchTerm = 'teste'
    const inscricoesFiltradas = todasInscricoes.filter(inscricao =>
      inscricao.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.bi?.includes(searchTerm)
    )
    
    console.log(`   Busca por "${searchTerm}": ${inscricoesFiltradas.length} resultados`)
    
    // 7. Verificar se há dados para exibir
    console.log('\n7. Verificando dados para exibição...')
    if (todasInscricoes.length === 0) {
      console.log('⚠️  Nenhuma inscrição encontrada!')
      console.log('   A página pode estar em branco porque:')
      console.log('   - Não há inscrições nas tabelas')
      console.log('   - As tabelas não existem')
      console.log('   - Problema de permissões')
    } else {
      console.log('✅ Dados disponíveis para exibição')
      console.log('   A página deve mostrar:')
      console.log(`   - ${todasInscricoes.length} inscrições no total`)
      console.log(`   - ${pendentes.length} inscrições pendentes`)
      console.log(`   - ${aprovadas.length} inscrições aprovadas`)
      console.log(`   - ${rejeitadas.length} inscrições rejeitadas`)
    }
    
    console.log('\n🎉 Teste da página de Inscrições concluído!')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testInscricoesPage()
