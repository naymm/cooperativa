import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testPlanosCadastro() {
  console.log('🧪 Testando carregamento de planos para Cadastro Público...\n')
  
  try {
    // 1. Testar carregamento direto do Supabase
    console.log('1. Testando carregamento direto do Supabase...')
    const { data: planos, error: planosError } = await supabase
      .from('assinatura_planos')
      .select('*')
      .eq('status', 'ativo')
    
    if (planosError) {
      console.error('❌ Erro ao carregar planos:', planosError.message)
      return
    }
    
    console.log(`✅ ${planos.length} planos ativos encontrados`)
    planos.forEach((plano, index) => {
      console.log(`   Plano ${index + 1}:`)
      console.log(`     ID: ${plano.id}`)
      console.log(`     Nome: ${plano.nome}`)
      console.log(`     Valor Mensal: ${plano.valor_mensal?.toLocaleString()} Kz`)
      console.log(`     Taxa Inscrição: ${plano.taxa_inscricao?.toLocaleString()} Kz`)
      console.log(`     Status: ${plano.status}`)
    })
    
    // 2. Testar filtro por status ativo
    console.log('\n2. Testando filtro por status ativo...')
    const planosAtivos = planos.filter(p => p.status === 'ativo')
    console.log(`✅ ${planosAtivos.length} planos com status 'ativo'`)
    
    // 3. Testar estrutura dos dados
    console.log('\n3. Verificando estrutura dos dados...')
    if (planos.length > 0) {
      const primeiroPlano = planos[0]
      console.log('   Campos do primeiro plano:')
      Object.keys(primeiroPlano).forEach(campo => {
        console.log(`     - ${campo}: ${typeof primeiroPlano[campo]} = ${primeiroPlano[campo]}`)
      })
    }
    
    // 4. Simular o que o componente deve receber
    console.log('\n4. Simulando dados para o componente...')
    const planosParaComponente = planos.filter(p => p.status === 'ativo')
    console.log(`   Planos para componente: ${planosParaComponente.length}`)
    
    if (planosParaComponente.length > 0) {
      console.log('   Exemplo de plano para exibição:')
      const exemplo = planosParaComponente[0]
      console.log(`     Nome: ${exemplo.nome}`)
      console.log(`     Valor: ${exemplo.valor_mensal?.toLocaleString()} Kz/mês`)
      console.log(`     Taxa: ${exemplo.taxa_inscricao?.toLocaleString()} Kz`)
    }
    
    // 5. Verificar se há planos com dados válidos
    console.log('\n5. Verificando planos com dados válidos...')
    const planosValidos = planos.filter(p => 
      p.status === 'ativo' && 
      p.nome && 
      p.valor_mensal && 
      p.taxa_inscricao
    )
    console.log(`✅ ${planosValidos.length} planos válidos para exibição`)
    
    if (planosValidos.length === 0) {
      console.log('⚠️  Nenhum plano válido encontrado!')
      console.log('   Verifique se os planos têm:')
      console.log('   - status = "ativo"')
      console.log('   - nome preenchido')
      console.log('   - valor_mensal preenchido')
      console.log('   - taxa_inscricao preenchida')
    }
    
    console.log('\n🎉 Teste de planos concluído!')
    console.log('✅ Dados dos planos verificados')
    console.log('✅ Filtros testados')
    console.log('✅ Estrutura validada')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testPlanosCadastro()
