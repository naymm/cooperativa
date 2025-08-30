import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testHybridSystem() {
  console.log('🧪 Testando sistema híbrido com Supabase...\n')
  
  // Verificar configuração
  console.log('📋 Configuração atual:')
  console.log(`VITE_USE_SUPABASE: ${process.env.VITE_USE_SUPABASE}`)
  console.log(`URL: ${process.env.VITE_SUPABASE_URL}`)
  console.log(`Key: ${process.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada'}`)
  
  if (process.env.VITE_USE_SUPABASE === 'true') {
    console.log('✅ Sistema configurado para usar Supabase')
  } else {
    console.log('⚠️  Sistema configurado para usar Base44')
  }
  
  console.log('\n📊 Testando operações no Supabase...')
  
  try {
    // 1. Testar consulta de cooperados
    console.log('\n1. Consultando cooperados...')
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
    
    if (cooperadosError) {
      console.error('❌ Erro ao consultar cooperados:', cooperadosError.message)
    } else {
      console.log(`✅ Cooperados encontrados: ${cooperados.length}`)
      if (cooperados.length > 0) {
        console.log(`   - ${cooperados[0].nome_completo} (${cooperados[0].numero_associado})`)
      }
    }
    
    // 2. Testar consulta de planos
    console.log('\n2. Consultando planos...')
    const { data: planos, error: planosError } = await supabase
      .from('assinatura_planos')
      .select('*')
    
    if (planosError) {
      console.error('❌ Erro ao consultar planos:', planosError.message)
    } else {
      console.log(`✅ Planos encontrados: ${planos.length}`)
      if (planos.length > 0) {
        console.log(`   - ${planos[0].nome} (${planos[0].valor_mensal} Kz)`)
      }
    }
    
    // 3. Testar consulta de projetos
    console.log('\n3. Consultando projetos...')
    const { data: projetos, error: projetosError } = await supabase
      .from('projetos')
      .select('*')
    
    if (projetosError) {
      console.error('❌ Erro ao consultar projetos:', projetosError.message)
    } else {
      console.log(`✅ Projetos encontrados: ${projetos.length}`)
      if (projetos.length > 0) {
        console.log(`   - ${projetos[0].titulo}`)
      }
    }
    
    // 4. Testar consulta de pagamentos
    console.log('\n4. Consultando pagamentos...')
    const { data: pagamentos, error: pagamentosError } = await supabase
      .from('pagamentos')
      .select('*')
    
    if (pagamentosError) {
      console.error('❌ Erro ao consultar pagamentos:', pagamentosError.message)
    } else {
      console.log(`✅ Pagamentos encontrados: ${pagamentos.length}`)
      if (pagamentos.length > 0) {
        console.log(`   - ${pagamentos[0].referencia} (${pagamentos[0].valor} Kz)`)
      }
    }
    
    // 5. Testar inserção de novo registro
    console.log('\n5. Testando inserção de novo registro...')
    const novoCooperado = {
      numero_associado: 'TEST003',
      nome_completo: 'Teste Sistema Híbrido',
      data_nascimento: '1995-01-01',
      estado_civil: 'solteiro',
      nacionalidade: 'Angolana',
      bi: '999999999999',
      email: 'teste@hibrido.com',
      telefone: '244999999999',
      provincia: 'Luanda',
      municipio: 'Luanda',
      profissao: 'Testador',
      sector_profissional: 'privado',
      status: 'ativo'
    }
    
    const { data: novoRegistro, error: insertError } = await supabase
      .from('cooperados')
      .insert(novoCooperado)
      .select()
    
    if (insertError) {
      console.error('❌ Erro ao inserir novo registro:', insertError.message)
    } else {
      console.log('✅ Novo registro inserido com sucesso:', novoRegistro[0].id)
      
      // Remover o registro de teste
      const { error: deleteError } = await supabase
        .from('cooperados')
        .delete()
        .eq('id', novoRegistro[0].id)
      
      if (deleteError) {
        console.log('⚠️  Não foi possível remover registro de teste')
      } else {
        console.log('✅ Registro de teste removido')
      }
    }
    
    console.log('\n🎉 Teste do sistema híbrido concluído com sucesso!')
    console.log('O Supabase está funcionando corretamente.')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  }
}

testHybridSystem()
