import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Simular a entidade AssinaturaPlano
class AssinaturaPlanoEntity {
  constructor() {
    this.tableName = 'assinatura_planos'
  }

  async list() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
    
    if (error) throw error
    return data
  }

  async filter(criteria = {}) {
    let query = supabase.from(this.tableName).select('*')
    
    if (criteria) {
      Object.keys(criteria).forEach(key => {
        query = query.eq(key, criteria[key])
      })
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }
}

async function testCadastroPlanosBrowser() {
  console.log('🧪 Testando carregamento de planos como no navegador...\n')
  
  try {
    // 1. Simular o que acontece no CadastroPublico.jsx
    console.log('1. Simulando carregamento de planos...')
    const AssinaturaPlano = new AssinaturaPlanoEntity()
    
    const planos = await AssinaturaPlano.list()
    console.log(`✅ ${planos.length} planos retornados pelo list()`)
    
    // 2. Simular o filtro que está sendo usado
    console.log('\n2. Simulando filtro por status ativo...')
    const planosAtivos = planos.filter(p => p.status === 'ativo')
    console.log(`✅ ${planosAtivos.length} planos com status 'ativo'`)
    
    // 3. Verificar se os planos têm os campos necessários
    console.log('\n3. Verificando campos necessários...')
    const planosValidos = planosAtivos.filter(p => 
      p.nome && 
      p.valor_mensal && 
      p.taxa_inscricao
    )
    console.log(`✅ ${planosValidos.length} planos válidos para exibição`)
    
    if (planosValidos.length > 0) {
      console.log('   Planos válidos:')
      planosValidos.forEach((plano, index) => {
        console.log(`   ${index + 1}. ${plano.nome}`)
        console.log(`      Valor: ${plano.valor_mensal?.toLocaleString()} Kz/mês`)
        console.log(`      Taxa: ${plano.taxa_inscricao?.toLocaleString()} Kz`)
        console.log(`      Status: ${plano.status}`)
      })
    }
    
    // 4. Simular o que o componente deve receber
    console.log('\n4. Simulando dados para o componente...')
    const planosParaComponente = planosValidos
    console.log(`   Planos para componente: ${planosParaComponente.length}`)
    
    if (planosParaComponente.length === 0) {
      console.log('⚠️  Nenhum plano válido encontrado!')
      console.log('   Possíveis problemas:')
      console.log('   - Planos não têm status "ativo"')
      console.log('   - Planos não têm nome preenchido')
      console.log('   - Planos não têm valor_mensal')
      console.log('   - Planos não têm taxa_inscricao')
    }
    
    // 5. Verificar todos os planos para debug
    console.log('\n5. Verificando todos os planos para debug...')
    planos.forEach((plano, index) => {
      console.log(`   Plano ${index + 1}:`)
      console.log(`     Nome: ${plano.nome || 'N/A'}`)
      console.log(`     Status: ${plano.status || 'N/A'}`)
      console.log(`     Valor: ${plano.valor_mensal || 'N/A'}`)
      console.log(`     Taxa: ${plano.taxa_inscricao || 'N/A'}`)
    })
    
    console.log('\n🎉 Teste concluído!')
    console.log('✅ Carregamento simulado')
    console.log('✅ Filtros aplicados')
    console.log('✅ Dados verificados')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testCadastroPlanosBrowser()
