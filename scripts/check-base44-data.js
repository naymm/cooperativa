import { base44 } from '../src/api/base44Client.js'

async function checkBase44Data() {
  console.log('🔍 Verificando dados disponíveis no Base44...\n')
  
  try {
    const entities = [
      { name: 'Cooperado', entity: base44.entities.Cooperado },
      { name: 'AssinaturaPlano', entity: base44.entities.AssinaturaPlano },
      { name: 'Projeto', entity: base44.entities.Projeto },
      { name: 'Pagamento', entity: base44.entities.Pagamento },
      { name: 'CooperadoAuth', entity: base44.entities.CooperadoAuth },
      { name: 'CooperadoNotificacao', entity: base44.entities.CooperadoNotificacao },
      { name: 'CooperadoSupporte', entity: base44.entities.CooperadoSupporte },
      { name: 'CrmNotificacao', entity: base44.entities.CrmNotificacao },
      { name: 'Inscricao', entity: base44.entities.Inscricao },
      { name: 'InscricaoPublica', entity: base44.entities.InscricaoPublica },
      { name: 'EmailLog', entity: base44.entities.EmailLog },
      { name: 'EmailTemplate', entity: base44.entities.EmailTemplate },
      { name: 'EmailQueue', entity: base44.entities.EmailQueue },
      { name: 'CrmUser', entity: base44.entities.CrmUser }
    ]
    
    const results = {}
    
    for (const { name, entity } of entities) {
      try {
        console.log(`📋 Verificando ${name}...`)
        const data = await entity.find()
        results[name] = data
        console.log(`✅ ${name}: ${data.length} registros encontrados`)
        
        if (data.length > 0) {
          console.log(`   Exemplo: ${JSON.stringify(data[0], null, 2).substring(0, 200)}...`)
        }
        console.log('')
      } catch (error) {
        console.error(`❌ Erro ao verificar ${name}:`, error.message)
        results[name] = []
      }
    }
    
    // Resumo
    console.log('📊 Resumo dos dados no Base44:')
    console.log('=' * 50)
    Object.entries(results).forEach(([name, data]) => {
      console.log(`${name}: ${data.length} registros`)
    })
    
    const totalRecords = Object.values(results).reduce((sum, data) => sum + data.length, 0)
    console.log(`\n🎯 Total de registros: ${totalRecords}`)
    
    return results
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
    return {}
  }
}

checkBase44Data()
