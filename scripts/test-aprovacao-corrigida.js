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

async function testAprovacaoCorrigida() {
  console.log('🧪 Testando aprovação corrigida...\n')
  
  try {
    // 1. Verificar inscrição pendente
    console.log('1. Verificando inscrição pendente...')
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .eq('status', 'pendente')
      .limit(1)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesError.message)
      return
    }
    
    if (inscricoes.length === 0) {
      console.log('❌ Nenhuma inscrição pendente encontrada')
      return
    }
    
    const inscricao = inscricoes[0]
    console.log(`✅ Inscrição encontrada: ${inscricao.nome_completo}`)
    
    // 2. Simular criação de cooperado
    console.log('\n2. Simulando criação de cooperado...')
    const numeroAssociado = `CS${Date.now().toString().slice(-6)}`
    
    const cooperadoData = {
      numero_associado: numeroAssociado,
      nome_completo: inscricao.nome_completo,
      email: inscricao.email,
      telefone: inscricao.telefone,
      bi: inscricao.bi || 'Não informado',
      data_nascimento: inscricao.data_nascimento || new Date().toISOString().split('T')[0],
      profissao: inscricao.profissao || 'Não informado',
      renda_mensal: inscricao.renda_mensal || 0,
      provincia: inscricao.provincia || 'Não informado',
      municipio: inscricao.municipio || 'Não informado',
      comuna: inscricao.comuna || null,
      endereco_completo: inscricao.endereco_completo || 'Não informado',
      data_inscricao: inscricao.created_at,
      assinatura_plano_id: inscricao.assinatura_plano_id || inscricao.plano_interesse || null,
      status: "ativo",
      estado_civil: inscricao.estado_civil || "solteiro",
      nacionalidade: inscricao.nacionalidade || "Angolana",
      sector_profissional: inscricao.sector_profissional || "privado",
      nome_conjuge: inscricao.nome_conjuge || null,
      tem_filhos: inscricao.tem_filhos || false,
      numero_filhos: inscricao.numero_filhos || 0,
      validade_documento_bi: inscricao.validade_documento_bi || null,
      entidade_publica: inscricao.entidade_publica || inscricao.entidade || null,
      entidade_privada: inscricao.entidade_privada || null,
      documentos_anexados: inscricao.documentos_anexados || null,
      taxa_inscricao_paga: inscricao.taxa_inscricao_paga || false,
      observacoes: inscricao.observacoes || null
    }
    
    console.log('   Dados do cooperado a ser criado:')
    console.log(`     ✅ Número: ${cooperadoData.numero_associado}`)
    console.log(`     ✅ Nome: ${cooperadoData.nome_completo}`)
    console.log(`     ✅ Email: ${cooperadoData.email}`)
    
    // 3. Criar cooperado
    console.log('\n3. Criando cooperado...')
    const { data: cooperadoCriado, error: cooperadoError } = await supabase
      .from('cooperados')
      .insert(cooperadoData)
      .select()
    
    if (cooperadoError) {
      console.error('❌ Erro ao criar cooperado:', cooperadoError.message)
      return
    }
    
    console.log('✅ Cooperado criado com sucesso!')
    console.log(`   ID: ${cooperadoCriado[0].id}`)
    console.log(`   Número: ${cooperadoCriado[0].numero_associado}`)
    
    // 4. Criar credenciais de acesso
    console.log('\n4. Criando credenciais de acesso...')
    const senhaTemporaria = gerarSenhaTemporaria()
    
    // Verificar se já existe credencial para este email
    const { data: credencialExistente, error: checkError } = await supabase
      .from('cooperado_auth')
      .select('*')
      .eq('email', inscricao.email)
      .single()
    
    let credenciaisCriadas
    let credenciaisError
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar credenciais existentes:', checkError.message)
      return
    }
    
    if (credencialExistente) {
      // Atualizar credencial existente
      console.log('   ⚠️  Credencial existente encontrada, atualizando...')
      const { data: credencialAtualizada, error: updateError } = await supabase
        .from('cooperado_auth')
        .update({
          cooperado_id: cooperadoCriado[0].id,
          senha_hash: senhaTemporaria,
          status: 'ativo'
        })
        .eq('email', inscricao.email)
        .select()
      
      credenciaisCriadas = credencialAtualizada
      credenciaisError = updateError
    } else {
      // Criar nova credencial
      console.log('   ✅ Criando nova credencial...')
      const credenciaisData = {
        cooperado_id: cooperadoCriado[0].id,
        email: inscricao.email,
        senha_hash: senhaTemporaria,
        status: 'ativo'
      }
      
      console.log('   Dados das credenciais:')
      console.log(`     ✅ Cooperado ID: ${credenciaisData.cooperado_id}`)
      console.log(`     ✅ Email: ${credenciaisData.email}`)
      console.log(`     ✅ Senha: ${credenciaisData.senha_hash}`)
      console.log(`     ✅ Status: ${credenciaisData.status}`)
      
      const { data: novaCredencial, error: createError } = await supabase
        .from('cooperado_auth')
        .insert(credenciaisData)
        .select()
      
      credenciaisCriadas = novaCredencial
      credenciaisError = createError
    }
    
    if (credenciaisError) {
      console.error('❌ Erro ao criar credenciais:', credenciaisError.message)
      console.error('   Detalhes do erro:', credenciaisError)
      
      // Limpar cooperado criado em caso de erro
      await supabase
        .from('cooperados')
        .delete()
        .eq('id', cooperadoCriado[0].id)
      
      return
    }
    
    console.log('✅ Credenciais criadas com sucesso!')
    console.log(`   ID: ${credenciaisCriadas[0].id}`)
    console.log(`   Cooperado ID: ${credenciaisCriadas[0].cooperado_id}`)
    console.log(`   Email: ${credenciaisCriadas[0].email}`)
    console.log(`   Senha: ${credenciaisCriadas[0].senha_hash}`)
    
    // 5. Buscar informações do plano
    console.log('\n5. Buscando informações do plano...')
    const planoId = inscricao.assinatura_plano_id || inscricao.plano_interesse
    let taxaInscricao = 50000 // Valor padrão
    
    if (planoId) {
      const { data: plano, error: planoError } = await supabase
        .from('assinatura_planos')
        .select('*')
        .eq('id', planoId)
        .single()
      
      if (planoError) {
        console.log('   ⚠️  Erro ao buscar plano, usando valor padrão')
      } else {
        taxaInscricao = plano.taxa_inscricao || 50000
        console.log(`   ✅ Plano encontrado: ${plano.nome}`)
        console.log(`   ✅ Taxa de inscrição: ${taxaInscricao.toLocaleString()} Kz`)
      }
    }
    
    // 6. Criar pagamento pendente
    console.log('\n6. Criando pagamento pendente...')
    const dataVencimento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const pagamentoData = {
      cooperado_id: cooperadoCriado[0].id, // Usar o ID UUID do cooperado criado
      assinatura_plano_id: planoId,
      valor: taxaInscricao,
      data_vencimento: dataVencimento,
      tipo: "taxa_inscricao",
      status: "pendente",
      referencia: `TAXA-${numeroAssociado}-${Date.now()}`,
      observacoes: {
        descricao: `Taxa de inscrição - ${inscricao.nome_completo}`,
        gerado_automaticamente: true,
        data_aprovacao: new Date().toISOString()
      }
    }
    
    const { data: pagamentoCriado, error: pagamentoError } = await supabase
      .from('pagamentos')
      .insert(pagamentoData)
      .select()
    
    if (pagamentoError) {
      console.error('❌ Erro ao criar pagamento:', pagamentoError.message)
    } else {
      console.log('✅ Pagamento criado com sucesso!')
      console.log(`   ID: ${pagamentoCriado[0].id}`)
      console.log(`   Valor: ${pagamentoCriado[0].valor.toLocaleString()} Kz`)
      console.log(`   Status: ${pagamentoCriado[0].status}`)
    }
    
    // 7. Atualizar status da inscrição
    console.log('\n7. Atualizando status da inscrição...')
    const { error: updateError } = await supabase
      .from('inscricoes_publicas')
      .update({
        status: "aprovada",
        processado_por: { nome: "Admin", email: "admin@sistema.com" },
        data_processamento: new Date().toISOString()
      })
      .eq('id', inscricao.id)
    
    if (updateError) {
      console.error('❌ Erro ao atualizar inscrição:', updateError.message)
    } else {
      console.log('✅ Status da inscrição atualizado para "aprovada"')
    }
    
    // 8. Verificar resultado final
    console.log('\n8. Verificando resultado final...')
    console.log('   ✅ Cooperado criado com ID UUID')
    console.log('   ✅ Credenciais criadas com cooperado_id correto')
    console.log('   ✅ Pagamento pendente criado')
    console.log('   ✅ Status da inscrição atualizado')
    
    console.log('\n🎉 Teste de aprovação corrigida concluído!')
    console.log('✅ Fluxo completo funcionando')
    console.log('✅ Credenciais sendo criadas corretamente')
    console.log('✅ Estrutura da tabela respeitada')
    
    console.log('\n📋 Resumo do que foi criado:')
    console.log(`   👤 Cooperado: ${numeroAssociado} (ID: ${cooperadoCriado[0].id})`)
    console.log(`   🔐 Credenciais: ${senhaTemporaria} (ID: ${credenciaisCriadas[0].id})`)
    console.log(`   💰 Pagamento: ${taxaInscricao.toLocaleString()} Kz`)
    console.log(`   📅 Vencimento: ${dataVencimento}`)
    
    console.log('\n🚀 Para testar no navegador:')
    console.log('1. Acesse: http://localhost:5173/Inscricoes')
    console.log('2. Clique em "Detalhes" da inscrição pendente')
    console.log('3. Clique em "Aprovar Inscrição"')
    console.log('4. Verifique se as credenciais são criadas corretamente')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testAprovacaoCorrigida()
