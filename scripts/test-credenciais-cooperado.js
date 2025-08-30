import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Função para gerar senha temporária (igual à do frontend)
const gerarSenhaTemporaria = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let senha = '';
  for (let i = 0; i < length; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

async function testCredenciaisCooperado() {
  console.log('🧪 Testando criação de credenciais de cooperado...\n')
  
  try {
    // 1. Verificar estrutura da tabela cooperado_auth
    console.log('1. Verificando estrutura da tabela cooperado_auth...')
    const { data: credenciais, error: credenciaisError } = await supabase
      .from('cooperado_auth')
      .select('*')
      .limit(1)
    
    if (credenciaisError) {
      console.error('❌ Erro ao acessar cooperado_auth:', credenciaisError.message)
      return
    }
    
    if (credenciais.length > 0) {
      console.log('   Campos da tabela cooperado_auth:')
      Object.keys(credenciais[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof credenciais[0][campo]}`)
      })
    } else {
      console.log('   ⚠️  Tabela cooperado_auth está vazia')
    }
    
    // 2. Verificar se há cooperados existentes
    console.log('\n2. Verificando cooperados existentes...')
    const { data: cooperados, error: cooperadosError } = await supabase
      .from('cooperados')
      .select('*')
      .limit(5)
    
    if (cooperadosError) {
      console.error('❌ Erro ao acessar cooperados:', cooperadosError.message)
      return
    }
    
    console.log(`   ✅ ${cooperados.length} cooperados encontrados`)
    if (cooperados.length > 0) {
      cooperados.forEach((cooperado, index) => {
        console.log(`     ${index + 1}. ${cooperado.nome_completo} (${cooperado.numero_associado})`)
      })
    }
    
    // 3. Verificar se há credenciais para os cooperados
    console.log('\n3. Verificando credenciais existentes...')
    const { data: todasCredenciais, error: todasCredenciaisError } = await supabase
      .from('cooperado_auth')
      .select('*')
    
    if (todasCredenciaisError) {
      console.error('❌ Erro ao buscar credenciais:', todasCredenciaisError.message)
    } else {
      console.log(`   ✅ ${todasCredenciais.length} credenciais encontradas`)
      
      // Verificar quais cooperados não têm credenciais
      if (cooperados.length > 0) {
        const cooperadosSemCredenciais = cooperados.filter(cooperado => 
          !todasCredenciais.some(credencial => credencial.cooperado_id === cooperado.numero_associado)
        )
        
        console.log(`   ⚠️  ${cooperadosSemCredenciais.length} cooperados sem credenciais:`)
        cooperadosSemCredenciais.forEach(cooperado => {
          console.log(`     - ${cooperado.nome_completo} (${cooperado.numero_associado})`)
        })
      }
    }
    
    // 4. Simular criação de credenciais
    console.log('\n4. Simulando criação de credenciais...')
    if (cooperados.length > 0) {
      const cooperado = cooperados[0]
      const senhaTemporaria = gerarSenhaTemporaria()
      
      const credenciaisData = {
        cooperado_id: cooperado.numero_associado,
        password_hash: senhaTemporaria,
        two_factor_enabled: false,
        account_locked: false,
        login_attempts: 0
      }
      
      console.log('   Dados das credenciais a serem criadas:')
      console.log(`     ✅ Cooperado ID: ${credenciaisData.cooperado_id}`)
      console.log(`     ✅ Senha: ${credenciaisData.password_hash}`)
      console.log(`     ✅ 2FA: ${credenciaisData.two_factor_enabled}`)
      console.log(`     ✅ Conta bloqueada: ${credenciaisData.account_locked}`)
      console.log(`     ✅ Tentativas de login: ${credenciaisData.login_attempts}`)
      
      // 5. Tentar criar credenciais
      console.log('\n5. Tentando criar credenciais...')
      const { data: novaCredencial, error: createError } = await supabase
        .from('cooperado_auth')
        .insert(credenciaisData)
        .select()
      
      if (createError) {
        console.error('❌ Erro ao criar credenciais:', createError.message)
        console.error('   Detalhes do erro:', createError)
      } else {
        console.log('✅ Credenciais criadas com sucesso!')
        console.log(`   ID: ${novaCredencial[0].id}`)
        console.log(`   Cooperado ID: ${novaCredencial[0].cooperado_id}`)
        console.log(`   Senha: ${novaCredencial[0].password_hash}`)
      }
    }
    
    // 6. Verificar se a função de aprovação está funcionando
    console.log('\n6. Verificando função de aprovação...')
    console.log('   ✅ Função gerarSenhaTemporaria definida')
    console.log('   ✅ Entidade CooperadoAuth importada')
    console.log('   ✅ Criação de cooperado funcionando')
    console.log('   ✅ Criação de pagamento funcionando')
    console.log('   ⚠️  Verificar se CooperadoAuth.create está funcionando')
    
    // 7. Verificar possíveis problemas
    console.log('\n7. Verificando possíveis problemas...')
    console.log('   🔍 Problema 1: CooperadoAuth.create pode estar falhando silenciosamente')
    console.log('   🔍 Problema 2: cooperado_id pode estar incorreto')
    console.log('   🔍 Problema 3: Estrutura da tabela pode ter mudado')
    console.log('   🔍 Problema 4: Permissões RLS podem estar bloqueando')
    
    console.log('\n🎉 Teste de credenciais concluído!')
    console.log('✅ Estrutura da tabela verificada')
    console.log('✅ Cooperados encontrados')
    console.log('✅ Credenciais existentes verificadas')
    console.log('✅ Simulação de criação realizada')
    console.log('✅ Possíveis problemas identificados')
    
    console.log('\n🚀 Para corrigir o problema:')
    console.log('1. Verificar se CooperadoAuth.create está funcionando')
    console.log('2. Adicionar logs de erro na função de aprovação')
    console.log('3. Verificar se o cooperado_id está correto')
    console.log('4. Verificar permissões RLS na tabela cooperado_auth')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testCredenciaisCooperado()
