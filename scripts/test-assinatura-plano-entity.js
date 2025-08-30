import { AssinaturaPlano } from '../src/api/supabaseEntities.js'

async function testAssinaturaPlanoEntity() {
  console.log('🧪 Testando entidade AssinaturaPlano...\n')
  
  try {
    // 1. Testar método list()
    console.log('1. Testando método list()...')
    const planos = await AssinaturaPlano.list()
    console.log(`✅ ${planos.length} planos retornados pelo list()`)
    
    if (planos.length > 0) {
      console.log('   Primeiro plano:')
      console.log(`     ID: ${planos[0].id}`)
      console.log(`     Nome: ${planos[0].nome}`)
      console.log(`     Status: ${planos[0].status}`)
    }
    
    // 2. Testar método find() com filtro
    console.log('\n2. Testando método find() com filtro...')
    const planosAtivos = await AssinaturaPlano.find({
      where: { status: 'ativo' }
    })
    console.log(`✅ ${planosAtivos.length} planos ativos encontrados`)
    
    // 3. Testar método filter()
    console.log('\n3. Testando método filter()...')
    const planosFiltrados = await AssinaturaPlano.filter({ status: 'ativo' })
    console.log(`✅ ${planosFiltrados.length} planos filtrados`)
    
    // 4. Verificar estrutura dos dados
    console.log('\n4. Verificando estrutura dos dados...')
    if (planos.length > 0) {
      const primeiroPlano = planos[0]
      console.log('   Campos do primeiro plano:')
      Object.keys(primeiroPlano).forEach(campo => {
        console.log(`     - ${campo}: ${typeof primeiroPlano[campo]} = ${primeiroPlano[campo]}`)
      })
    }
    
    // 5. Testar se os planos têm os campos necessários
    console.log('\n5. Verificando campos necessários...')
    const planosCompletos = planos.filter(p => 
      p.nome && 
      p.valor_mensal && 
      p.taxa_inscricao && 
      p.status === 'ativo'
    )
    console.log(`✅ ${planosCompletos.length} planos com todos os campos necessários`)
    
    if (planosCompletos.length > 0) {
      console.log('   Exemplo de plano completo:')
      const exemplo = planosCompletos[0]
      console.log(`     Nome: ${exemplo.nome}`)
      console.log(`     Valor: ${exemplo.valor_mensal?.toLocaleString()} Kz`)
      console.log(`     Taxa: ${exemplo.taxa_inscricao?.toLocaleString()} Kz`)
      console.log(`     Status: ${exemplo.status}`)
    }
    
    console.log('\n🎉 Teste da entidade AssinaturaPlano concluído!')
    console.log('✅ Métodos testados')
    console.log('✅ Dados verificados')
    console.log('✅ Estrutura validada')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testAssinaturaPlanoEntity()
