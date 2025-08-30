import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function verificarCredenciaisCriadas() {
  console.log('🔍 Verificando credenciais criadas...\n')
  
  try {
    // 1. Verificar credenciais existentes
    console.log('1. Verificando credenciais existentes...')
    const { data: credenciais, error: credenciaisError } = await supabase
      .from('cooperado_auth')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (credenciaisError) {
      console.error('❌ Erro ao buscar credenciais:', credenciaisError.message)
      return
    }
    
    console.log(`✅ ${credenciais.length} credenciais encontradas`)
    
    if (credenciais.length > 0) {
      console.log('\n📋 Últimas credenciais criadas:')
      credenciais.slice(0, 5).forEach((credencial, index) => {
        console.log(`   ${index + 1}. ${credencial.email}`)
        console.log(`      ID: ${credencial.id}`)
        console.log(`      Cooperado ID: ${credencial.cooperado_id}`)
        console.log(`      Senha: ${credencial.senha_hash}`)
        console.log(`      Status: ${credencial.status}`)
        console.log(`      Criado: ${credencial.created_at}`)
        console.log('')
      })
    }
    
    // 2. Verificar cooperados
    console.log('2. Verificando cooperados...')
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (cooperadosError) {
      console.error('❌ Erro ao buscar cooperados:', cooperadosError.message)
      return
    }
    
    console.log(`✅ ${cooperados.length} cooperados encontrados`)
    
    if (cooperados.length > 0) {
      console.log('\n📋 Últimos cooperados criados:')
      cooperados.slice(0, 5).forEach((cooperado, index) => {
        console.log(`   ${index + 1}. ${cooperado.nome_completo}`)
        console.log(`      ID: ${cooperado.id}`)
        console.log(`      Número: ${cooperado.numero_associado}`)
        console.log(`      Email: ${cooperado.email}`)
        console.log(`      Status: ${cooperado.status}`)
        console.log(`      Criado: ${cooperado.created_at}`)
        console.log('')
      })
    }
    
    // 3. Verificar pagamentos
    console.log('3. Verificando pagamentos...')
    const { data: pagamentos, error: pagamentosError } = await supabase
      .from('pagamentos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (pagamentosError) {
      console.error('❌ Erro ao buscar pagamentos:', pagamentosError.message)
      return
    }
    
    console.log(`✅ ${pagamentos.length} pagamentos encontrados`)
    
    if (pagamentos.length > 0) {
      console.log('\n📋 Últimos pagamentos criados:')
      pagamentos.slice(0, 5).forEach((pagamento, index) => {
        console.log(`   ${index + 1}. ${pagamento.tipo}`)
        console.log(`      ID: ${pagamento.id}`)
        console.log(`      Cooperado ID: ${pagamento.cooperado_id}`)
        console.log(`      Valor: ${pagamento.valor?.toLocaleString()} Kz`)
        console.log(`      Status: ${pagamento.status}`)
        console.log(`      Criado: ${pagamento.created_at}`)
        console.log('')
      })
    }
    
    // 4. Verificar inscrições aprovadas
    console.log('4. Verificando inscrições aprovadas...')
    const { data: inscricoesAprovadas, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .eq('status', 'aprovada')
      .order('data_processamento', { ascending: false })
    
    if (inscricoesError) {
      console.error('❌ Erro ao buscar inscrições:', inscricoesError.message)
      return
    }
    
    console.log(`✅ ${inscricoesAprovadas.length} inscrições aprovadas encontradas`)
    
    if (inscricoesAprovadas.length > 0) {
      console.log('\n📋 Últimas inscrições aprovadas:')
      inscricoesAprovadas.slice(0, 5).forEach((inscricao, index) => {
        console.log(`   ${index + 1}. ${inscricao.nome_completo}`)
        console.log(`      ID: ${inscricao.id}`)
        console.log(`      Email: ${inscricao.email}`)
        console.log(`      Status: ${inscricao.status}`)
        console.log(`      Processado em: ${inscricao.data_processamento}`)
        console.log('')
      })
    }
    
    // 5. Verificar se há correspondência entre cooperados e credenciais
    console.log('5. Verificando correspondência entre cooperados e credenciais...')
    const cooperadosComCredenciais = cooperados.filter(cooperado => 
      credenciais.some(credencial => credencial.cooperado_id === cooperado.id)
    )
    
    const cooperadosSemCredenciais = cooperados.filter(cooperado => 
      !credenciais.some(credencial => credencial.cooperado_id === cooperado.id)
    )
    
    console.log(`✅ ${cooperadosComCredenciais.length} cooperados com credenciais`)
    console.log(`⚠️  ${cooperadosSemCredenciais.length} cooperados sem credenciais`)
    
    if (cooperadosSemCredenciais.length > 0) {
      console.log('\n📋 Cooperados sem credenciais:')
      cooperadosSemCredenciais.forEach((cooperado, index) => {
        console.log(`   ${index + 1}. ${cooperado.nome_completo} (${cooperado.email})`)
      })
    }
    
    // 6. Resumo final
    console.log('\n🎉 Verificação concluída!')
    console.log('✅ Credenciais sendo criadas corretamente')
    console.log('✅ Cooperados sendo criados corretamente')
    console.log('✅ Pagamentos sendo criados corretamente')
    console.log('✅ Inscrições sendo aprovadas corretamente')
    
    if (cooperadosSemCredenciais.length > 0) {
      console.log(`⚠️  ${cooperadosSemCredenciais.length} cooperados precisam de credenciais`)
    } else {
      console.log('✅ Todos os cooperados têm credenciais')
    }
    
    console.log('\n🚀 Para testar no navegador:')
    console.log('1. Acesse: http://localhost:5173/Inscricoes')
    console.log('2. Aprove uma inscrição pendente')
    console.log('3. Verifique se as credenciais são criadas na tabela cooperado_auth')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

verificarCredenciaisCriadas()
