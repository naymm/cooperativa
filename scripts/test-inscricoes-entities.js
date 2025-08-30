import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Simular as entidades
class InscricaoEntity {
  constructor() {
    this.tableName = 'inscricoes'
  }

  async list(orderBy = '') {
    console.log(`Tentando listar ${this.tableName} com orderBy: ${orderBy}`)
    
    let query = supabase.from(this.tableName).select('*')
    
    if (orderBy) {
      // Tentar diferentes formatos de orderBy
      if (orderBy === '-created_date') {
        query = query.order('created_at', { ascending: false })
      } else if (orderBy === 'created_date') {
        query = query.order('created_at', { ascending: true })
      } else {
        query = query.order(orderBy, { ascending: false })
      }
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error(`Erro ao listar ${this.tableName}:`, error)
      throw error
    }
    
    console.log(`✅ ${this.tableName} listado com sucesso:`, data.length, 'registros')
    return data
  }
}

class InscricaoPublicaEntity {
  constructor() {
    this.tableName = 'inscricoes_publicas'
  }

  async list(orderBy = '') {
    console.log(`Tentando listar ${this.tableName} com orderBy: ${orderBy}`)
    
    let query = supabase.from(this.tableName).select('*')
    
    if (orderBy) {
      // Tentar diferentes formatos de orderBy
      if (orderBy === '-created_date') {
        query = query.order('created_at', { ascending: false })
      } else if (orderBy === 'created_date') {
        query = query.order('created_at', { ascending: true })
      } else {
        query = query.order(orderBy, { ascending: false })
      }
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error(`Erro ao listar ${this.tableName}:`, error)
      throw error
    }
    
    console.log(`✅ ${this.tableName} listado com sucesso:`, data.length, 'registros')
    return data
  }
}

async function testInscricoesEntities() {
  console.log('🧪 Testando entidades de inscrições...\n')
  
  try {
    const Inscricao = new InscricaoEntity()
    const InscricaoPublica = new InscricaoPublicaEntity()
    
    // 1. Testar listagem de inscrições antigas
    console.log('1. Testando listagem de inscrições antigas...')
    try {
      const inscricoesAntigas = await Inscricao.list("-created_date")
      console.log(`   ✅ ${inscricoesAntigas.length} inscrições antigas encontradas`)
    } catch (error) {
      console.log('   ❌ Erro ao listar inscrições antigas:', error.message)
    }
    
    // 2. Testar listagem de inscrições públicas
    console.log('\n2. Testando listagem de inscrições públicas...')
    try {
      const inscricoesPublicas = await InscricaoPublica.list("-created_date")
      console.log(`   ✅ ${inscricoesPublicas.length} inscrições públicas encontradas`)
      
      if (inscricoesPublicas.length > 0) {
        console.log('   Primeira inscrição pública:')
        console.log(`     ID: ${inscricoesPublicas[0].id}`)
        console.log(`     Nome: ${inscricoesPublicas[0].nome_completo}`)
        console.log(`     Status: ${inscricoesPublicas[0].status}`)
      }
    } catch (error) {
      console.log('   ❌ Erro ao listar inscrições públicas:', error.message)
    }
    
    // 3. Testar carregamento combinado
    console.log('\n3. Testando carregamento combinado...')
    try {
      const [inscricoesAntigas, inscricoesPublicas] = await Promise.all([
        Inscricao.list("-created_date").catch(() => []),
        InscricaoPublica.list("-created_date").catch(() => [])
      ])
      
      const todasInscricoes = [
        ...(Array.isArray(inscricoesAntigas) ? inscricoesAntigas : []),
        ...(Array.isArray(inscricoesPublicas) ? inscricoesPublicas.map(inscricao => ({
          ...inscricao,
          fonte: 'publica'
        })) : [])
      ]
      
      console.log(`   ✅ Total de inscrições: ${todasInscricoes.length}`)
      console.log(`   ✅ Inscrições antigas: ${inscricoesAntigas.length}`)
      console.log(`   ✅ Inscrições públicas: ${inscricoesPublicas.length}`)
      
      if (todasInscricoes.length > 0) {
        console.log('   Primeira inscrição combinada:')
        console.log(`     ID: ${todasInscricoes[0].id}`)
        console.log(`     Nome: ${todasInscricoes[0].nome_completo}`)
        console.log(`     Status: ${todasInscricoes[0].status}`)
        console.log(`     Fonte: ${todasInscricoes[0].fonte || 'antiga'}`)
      }
    } catch (error) {
      console.log('   ❌ Erro no carregamento combinado:', error.message)
    }
    
    // 4. Testar diferentes formatos de orderBy
    console.log('\n4. Testando diferentes formatos de orderBy...')
    try {
      console.log('   Testando sem orderBy...')
      await InscricaoPublica.list()
      
      console.log('   Testando com created_date...')
      await InscricaoPublica.list('created_date')
      
      console.log('   Testando com -created_date...')
      await InscricaoPublica.list('-created_date')
    } catch (error) {
      console.log('   ❌ Erro ao testar orderBy:', error.message)
    }
    
    console.log('\n🎉 Teste das entidades concluído!')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testInscricoesEntities()
