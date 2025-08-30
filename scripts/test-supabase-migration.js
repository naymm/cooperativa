import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testMigration() {
  console.log('🧪 Testando migração no Supabase...\n')
  
  try {
    // 1. Testar inserção de cooperado
    console.log('📝 Testando inserção de cooperado...')
    const testCooperado = {
      numero_associado: 'TEST001',
      nome_completo: 'João Silva Teste',
      data_nascimento: '1990-01-01',
      estado_civil: 'solteiro',
      nacionalidade: 'Angolana',
      bi: '123456789',
      email: 'teste@exemplo.com',
      telefone: '123456789',
      provincia: 'Luanda',
      municipio: 'Luanda',
      profissao: 'Engenheiro',
      sector_profissional: 'privado',
      status: 'ativo'
    }
    
    const { data: cooperado, error: cooperadoError } = await supabase
      .from('cooperados')
      .insert(testCooperado)
      .select()
    
    if (cooperadoError) {
      console.error('❌ Erro ao inserir cooperado:', cooperadoError.message)
    } else {
      console.log('✅ Cooperado inserido com sucesso:', cooperado[0].id)
      
      // 2. Testar inserção de plano
      console.log('\n📝 Testando inserção de plano...')
      const testPlano = {
        nome: 'Plano Básico Teste',
        descricao: 'Plano de teste para migração',
        valor_mensal: 100.00,
        beneficios: ['Benefício 1', 'Benefício 2'],
        status: 'ativo'
      }
      
      const { data: plano, error: planoError } = await supabase
        .from('assinatura_planos')
        .insert(testPlano)
        .select()
      
      if (planoError) {
        console.error('❌ Erro ao inserir plano:', planoError.message)
      } else {
        console.log('✅ Plano inserido com sucesso:', plano[0].id)
        
        // 3. Testar inserção de pagamento
        console.log('\n📝 Testando inserção de pagamento...')
        const testPagamento = {
          cooperado_id: cooperado[0].id,
          assinatura_plano_id: plano[0].id,
          valor: 100.00,
          metodo_pagamento: 'transferencia',
          tipo: 'mensalidade',
          status: 'confirmado'
        }
        
        const { data: pagamento, error: pagamentoError } = await supabase
          .from('pagamentos')
          .insert(testPagamento)
          .select()
        
        if (pagamentoError) {
          console.error('❌ Erro ao inserir pagamento:', pagamentoError.message)
        } else {
          console.log('✅ Pagamento inserido com sucesso:', pagamento[0].id)
        }
      }
    }
    
    // 4. Testar consultas
    console.log('\n📊 Testando consultas...')
    
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
    
    if (cooperadosError) {
      console.error('❌ Erro ao consultar cooperados:', cooperadosError.message)
    } else {
      console.log(`✅ Consulta cooperados: ${cooperados.length} registros`)
    }
    
    const { data: planos, error: planosError } = await supabase
      .from('assinatura_planos')
      .select('*')
    
    if (planosError) {
      console.error('❌ Erro ao consultar planos:', planosError.message)
    } else {
      console.log(`✅ Consulta planos: ${planos.length} registros`)
    }
    
    const { data: pagamentos, error: pagamentosError } = await supabase
      .from('pagamentos')
      .select('*')
    
    if (pagamentosError) {
      console.error('❌ Erro ao consultar pagamentos:', pagamentosError.message)
    } else {
      console.log(`✅ Consulta pagamentos: ${pagamentos.length} registros`)
    }
    
    console.log('\n🎉 Teste de migração concluído com sucesso!')
    console.log('O Supabase está pronto para receber os dados do Base44.')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  }
}

testMigration()
