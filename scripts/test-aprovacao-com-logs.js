import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Simular as entidades
class CooperadoEntity {
  async create(data) {
    console.log('🔧 Cooperado.create chamado com:', data)
    
    const { data: result, error } = await supabase
      .from('cooperados')
      .insert(data)
      .select()
    
    if (error) {
      console.error('❌ Erro no Cooperado.create:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ Cooperado.create sucesso:', result[0])
    return result[0]
  }
}

class CooperadoAuthEntity {
  async create(data) {
    console.log('🔧 CooperadoAuth.create chamado com:', data)
    
    const { data: result, error } = await supabase
      .from('cooperado_auth')
      .insert(data)
      .select()
    
    if (error) {
      console.error('❌ Erro no CooperadoAuth.create:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ CooperadoAuth.create sucesso:', result[0])
    return result[0]
  }

  async update(email, data) {
    console.log('🔧 CooperadoAuth.update chamado com email:', email, 'data:', data)
    
    const { data: result, error } = await supabase
      .from('cooperado_auth')
      .update(data)
      .eq('email', email)
      .select()
    
    if (error) {
      console.error('❌ Erro no CooperadoAuth.update:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ CooperadoAuth.update sucesso:', result[0])
    return result[0]
  }
}

class PagamentoEntity {
  async create(data) {
    console.log('🔧 Pagamento.create chamado com:', data)
    
    const { data: result, error } = await supabase
      .from('pagamentos')
      .insert(data)
      .select()
    
    if (error) {
      console.error('❌ Erro no Pagamento.create:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ Pagamento.create sucesso:', result[0])
    return result[0]
  }
}

class AssinaturaPlanoEntity {
  async get(id) {
    console.log('🔧 AssinaturaPlano.get chamado com id:', id)
    
    const { data: result, error } = await supabase
      .from('assinatura_planos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Erro no AssinaturaPlano.get:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ AssinaturaPlano.get sucesso:', result)
    return result
  }
}

class InscricaoPublicaEntity {
  async update(id, data) {
    console.log('🔧 InscricaoPublica.update chamado com id:', id, 'data:', data)
    
    const { data: result, error } = await supabase
      .from('inscricoes_publicas')
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('❌ Erro no InscricaoPublica.update:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ InscricaoPublica.update sucesso:', result[0])
    return result[0]
  }
}

// Função para gerar senha temporária
const gerarSenhaTemporaria = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let senha = '';
  for (let i = 0; i < length; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

async function testAprovacaoComLogs() {
  console.log('🧪 Testando aprovação completa com logs...\n')
  
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
    console.log(`   Email: ${inscricao.email}`)
    console.log(`   Status: ${inscricao.status}`)
    
    // 2. Criar instâncias das entidades
    console.log('\n2. Criando instâncias das entidades...')
    const Cooperado = new CooperadoEntity()
    const CooperadoAuth = new CooperadoAuthEntity()
    const Pagamento = new PagamentoEntity()
    const AssinaturaPlano = new AssinaturaPlanoEntity()
    const InscricaoPublica = new InscricaoPublicaEntity()
    console.log('✅ Todas as entidades criadas')
    
    // 3. Simular função de aprovação
    console.log('\n3. Simulando função de aprovação...')
    
    // Gerar número de associado
    const numeroAssociado = `CS${Date.now().toString().slice(-6)}`
    console.log(`📋 Número de associado gerado: ${numeroAssociado}`)
    
    // Criar cooperado
    console.log('\n4. Criando cooperado...')
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
    
    const cooperadoCriado = await Cooperado.create(cooperadoData)
    console.log(`✅ Cooperado criado com ID: ${cooperadoCriado.id}`)
    
    // 5. Criar credenciais
    console.log('\n5. Criando credenciais...')
    const senhaTemporaria = gerarSenhaTemporaria()
    console.log("🔐 Tentando criar credenciais para cooperado:", cooperadoCriado.id)
    console.log("📧 Email:", inscricao.email)
    console.log("🔑 Senha temporária:", senhaTemporaria)
    
    try {
      console.log("📝 Tentando criar nova credencial...")
      const credencialCriada = await CooperadoAuth.create({
        cooperado_id: cooperadoCriado.id,
        email: inscricao.email,
        senha_hash: senhaTemporaria,
        status: 'ativo'
      })
      console.log("✅ Credencial criada com sucesso:", credencialCriada)
    } catch (error) {
      console.log("⚠️ Erro ao criar credencial:", error.message)
      if (error.message && (error.message.includes('duplicate key value') || error.message.includes('cooperado_id_key'))) {
        console.log("🔄 Credencial existente encontrada, atualizando...")
        const credencialAtualizada = await CooperadoAuth.update(inscricao.email, {
          cooperado_id: cooperadoCriado.id,
          senha_hash: senhaTemporaria,
          status: 'ativo'
        })
        console.log("✅ Credencial atualizada com sucesso:", credencialAtualizada)
      } else {
        console.error("❌ Erro não tratado:", error)
        throw error
      }
    }
    
    // 6. Buscar informações do plano
    console.log('\n6. Buscando informações do plano...')
    const planoId = inscricao.assinatura_plano_id || inscricao.plano_interesse
    let taxaInscricao = 50000 // Valor padrão
    
    if (planoId) {
      try {
        const plano = await AssinaturaPlano.get(planoId)
        if (plano && plano.taxa_inscricao) {
          taxaInscricao = plano.taxa_inscricao
        }
        console.log(`✅ Plano encontrado: ${plano.nome}`)
        console.log(`✅ Taxa de inscrição: ${taxaInscricao.toLocaleString()} Kz`)
      } catch (error) {
        console.log("⚠️ Erro ao buscar plano, usando valor padrão:", error.message)
      }
    }
    
    // 7. Criar pagamento
    console.log('\n7. Criando pagamento...')
    const pagamentoCriado = await Pagamento.create({
      cooperado_id: cooperadoCriado.id,
      assinatura_plano_id: planoId,
      valor: taxaInscricao,
      data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tipo: "taxa_inscricao",
      status: "pendente",
      referencia: `TAXA-${numeroAssociado}-${Date.now()}`,
      observacoes: {
        descricao: `Taxa de inscrição - ${inscricao.nome_completo}`,
        gerado_automaticamente: true,
        data_aprovacao: new Date().toISOString()
      }
    })
    console.log(`✅ Pagamento criado com ID: ${pagamentoCriado.id}`)
    
    // 8. Atualizar inscrição
    console.log('\n8. Atualizando inscrição...')
    const inscricaoAtualizada = await InscricaoPublica.update(inscricao.id, {
      status: "aprovada",
      processado_por: { nome: "Admin", email: "admin@sistema.com" },
      data_processamento: new Date().toISOString()
    })
    console.log(`✅ Inscrição atualizada para status: ${inscricaoAtualizada.status}`)
    
    // 9. Verificar resultado final
    console.log('\n9. Verificando resultado final...')
    console.log('   ✅ Cooperado criado com ID UUID')
    console.log('   ✅ Credenciais criadas/atualizadas')
    console.log('   ✅ Pagamento pendente criado')
    console.log('   ✅ Status da inscrição atualizado')
    
    console.log('\n🎉 Teste de aprovação com logs concluído!')
    console.log('✅ Fluxo completo funcionando')
    console.log('✅ Logs detalhados implementados')
    console.log('✅ Tratamento de erros funcionando')
    
    console.log('\n📋 Resumo do que foi criado:')
    console.log(`   👤 Cooperado: ${numeroAssociado} (ID: ${cooperadoCriado.id})`)
    console.log(`   🔐 Credenciais: ${senhaTemporaria}`)
    console.log(`   💰 Pagamento: ${taxaInscricao.toLocaleString()} Kz`)
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testAprovacaoComLogs()
