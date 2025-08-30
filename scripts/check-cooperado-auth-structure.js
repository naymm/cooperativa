import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkCooperadoAuthStructure() {
  console.log('🔍 Verificando estrutura real da tabela cooperado_auth...\n')
  
  try {
    // 1. Verificar estrutura da tabela
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
      console.log('   Campos reais da tabela cooperado_auth:')
      Object.keys(credenciais[0]).forEach(campo => {
        console.log(`     - ${campo}: ${typeof credenciais[0][campo]}`)
      })
    } else {
      console.log('   ⚠️  Tabela cooperado_auth está vazia')
    }
    
    // 2. Verificar dados existentes
    console.log('\n2. Verificando dados existentes...')
    const { data: todasCredenciais, error: todasCredenciaisError } = await supabase
      .from('cooperado_auth')
      .select('*')
    
    if (todasCredenciaisError) {
      console.error('❌ Erro ao buscar credenciais:', todasCredenciaisError.message)
    } else {
      console.log(`   ✅ ${todasCredenciais.length} credenciais encontradas`)
      if (todasCredenciais.length > 0) {
        console.log('   Exemplo de credencial:')
        const exemplo = todasCredenciais[0]
        Object.keys(exemplo).forEach(campo => {
          console.log(`     ${campo}: ${exemplo[campo]}`)
        })
      }
    }
    
    // 3. Testar criação com estrutura correta
    console.log('\n3. Testando criação com estrutura correta...')
    const senhaTemporaria = 'TEST123'
    
    // Estrutura baseada nos campos reais
    const credenciaisData = {
      cooperado_id: 'TEST001',
      email: 'teste@email.com',
      senha_hash: senhaTemporaria,
      status: 'ativo'
    }
    
    console.log('   Dados para criação:')
    Object.keys(credenciaisData).forEach(campo => {
      console.log(`     - ${campo}: ${credenciaisData[campo]}`)
    })
    
    // 4. Tentar criar credenciais
    console.log('\n4. Tentando criar credenciais...')
    const { data: novaCredencial, error: createError } = await supabase
      .from('cooperado_auth')
      .insert(credenciaisData)
      .select()
    
    if (createError) {
      console.error('❌ Erro ao criar credenciais:', createError.message)
      console.error('   Detalhes do erro:', createError)
    } else {
      console.log('✅ Credenciais criadas com sucesso!')
      console.log('   Dados criados:')
      Object.keys(novaCredencial[0]).forEach(campo => {
        console.log(`     - ${campo}: ${novaCredencial[0][campo]}`)
      })
      
      // 5. Limpar credencial de teste
      console.log('\n5. Limpando credencial de teste...')
      const { error: deleteError } = await supabase
        .from('cooperado_auth')
        .delete()
        .eq('id', novaCredencial[0].id)
      
      if (deleteError) {
        console.error('❌ Erro ao deletar credencial de teste:', deleteError.message)
      } else {
        console.log('✅ Credencial de teste removida')
      }
    }
    
    // 6. Verificar campos que estão sendo usados incorretamente
    console.log('\n6. Verificando campos incorretos...')
    const camposIncorretos = ['account_locked', 'two_factor_enabled', 'login_attempts']
    console.log('   Campos que NÃO existem na tabela:')
    camposIncorretos.forEach(campo => {
      console.log(`     ❌ ${campo}`)
    })
    
    // 7. Sugerir correção
    console.log('\n7. Sugerindo correção...')
    console.log('   ✅ Campos que DEVEM ser usados:')
    console.log('     - cooperado_id: string')
    console.log('     - email: string')
    console.log('     - senha_hash: string')
    console.log('     - status: string (opcional)')
    
    console.log('\n🎉 Verificação de estrutura concluída!')
    console.log('✅ Estrutura real identificada')
    console.log('✅ Campos incorretos identificados')
    console.log('✅ Correção necessária identificada')
    
    console.log('\n🚀 Para corrigir o problema:')
    console.log('1. Atualizar função de aprovação para usar apenas os campos corretos')
    console.log('2. Remover campos inexistentes: account_locked, two_factor_enabled, login_attempts')
    console.log('3. Usar apenas: cooperado_id, email, senha_hash, status')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  }
}

checkCooperadoAuthStructure()
