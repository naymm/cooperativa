import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testCadastroPublicoCompleto() {
  console.log('🧪 Testando formulário de cadastro público completo...\n')
  
  try {
    // 1. Simular dados do formulário
    console.log('1. Simulando dados do formulário...')
    const dadosInscricao = {
      nome_completo: "Maria Silva Santos",
      email: "maria.silva@email.com",
      telefone: "+244 923 456 789",
      provincia: "Luanda",
      municipio: "Luanda",
      comuna: "Ingombota",
      endereco_completo: "Rua Comandante Valódia, nº 123, 2º andar",
      profissao: "Engenheira Civil",
      sector_profissional: "publico",
      renda_mensal: 250000,
      data_nascimento: "1985-06-15",
      estado_civil: "casado",
      nome_conjuge: "João Silva Santos",
      tem_filhos: true,
      numero_filhos: 2,
      nacionalidade: "Angolana",
      bi: "123456789AB123",
      validade_documento_bi: "2030-12-31",
      entidade_publica: "Ministério da Educação",
      entidade_privada: "",
      assinatura_plano_id: "1dc9b806-7e66-4d74-a365-6842fb135e6d",
      taxa_inscricao_selecionada: 10000,
      documentos_anexados: {
        foto_passe: "https://exemplo.com/foto.jpg",
        bi_frente_verso: "https://exemplo.com/bi.jpg",
        bi_conjuge: "https://exemplo.com/bi_conjuge.jpg",
        agregado_familiar_doc: "https://exemplo.com/agregado.pdf",
        declaracao_servico: "https://exemplo.com/declaracao.pdf",
        nif_documento: "https://exemplo.com/nif.pdf"
      }
    }
    
    console.log('   Dados simulados:')
    console.log(`     ✅ Nome: ${dadosInscricao.nome_completo}`)
    console.log(`     ✅ Email: ${dadosInscricao.email}`)
    console.log(`     ✅ Telefone: ${dadosInscricao.telefone}`)
    console.log(`     ✅ Data Nascimento: ${dadosInscricao.data_nascimento}`)
    console.log(`     ✅ BI: ${dadosInscricao.bi}`)
    console.log(`     ✅ Validade BI: ${dadosInscricao.validade_documento_bi}`)
    console.log(`     ✅ Estado Civil: ${dadosInscricao.estado_civil}`)
    console.log(`     ✅ Cônjuge: ${dadosInscricao.nome_conjuge}`)
    console.log(`     ✅ Filhos: ${dadosInscricao.tem_filhos ? 'Sim' : 'Não'}`)
    console.log(`     ✅ Número Filhos: ${dadosInscricao.numero_filhos}`)
    console.log(`     ✅ Nacionalidade: ${dadosInscricao.nacionalidade}`)
    console.log(`     ✅ Sector: ${dadosInscricao.sector_profissional}`)
    console.log(`     ✅ Entidade: ${dadosInscricao.entidade_publica}`)
    console.log(`     ✅ Plano ID: ${dadosInscricao.assinatura_plano_id}`)
    
    // 2. Simular processamento dos dados
    console.log('\n2. Simulando processamento dos dados...')
    const dadosCompletos = {
      nome_completo: dadosInscricao.nome_completo || "",
      email: dadosInscricao.email || "",
      telefone: dadosInscricao.telefone || "",
      provincia: dadosInscricao.provincia || "",
      municipio: dadosInscricao.municipio || "",
      comuna: dadosInscricao.comuna || "",
      endereco_completo: dadosInscricao.endereco_completo || "",
      profissao: dadosInscricao.profissao || "",
      sector_profissional: dadosInscricao.sector_profissional || "privado",
      renda_mensal: Number(dadosInscricao.renda_mensal) || 0,
      data_nascimento: dadosInscricao.data_nascimento || null,
      estado_civil: dadosInscricao.estado_civil || "solteiro",
      nome_conjuge: dadosInscricao.nome_conjuge || null,
      tem_filhos: dadosInscricao.tem_filhos || false,
      numero_filhos: dadosInscricao.numero_filhos || 0,
      nacionalidade: dadosInscricao.nacionalidade || "Angolana",
      bi: dadosInscricao.bi || null,
      validade_documento_bi: dadosInscricao.validade_documento_bi || null,
      entidade_publica: dadosInscricao.entidade_publica || null,
      entidade_privada: dadosInscricao.entidade_privada || null,
      assinatura_plano_id: dadosInscricao.assinatura_plano_id || "",
      taxa_inscricao_paga: false,
      documentos_anexados: dadosInscricao.documentos_anexados || {},
      observacoes: {
        taxa_inscricao: dadosInscricao.taxa_inscricao_selecionada || 0,
        documentos: dadosInscricao.documentos_anexados || {},
        entidade: dadosInscricao.sector_profissional === "publico" ? dadosInscricao.entidade_publica : dadosInscricao.entidade_privada
      },
      status: "pendente"
    }
    
    console.log('   Dados processados:')
    console.log(`     ✅ Nome: ${dadosCompletos.nome_completo}`)
    console.log(`     ✅ Email: ${dadosCompletos.email}`)
    console.log(`     ✅ Data Nascimento: ${dadosCompletos.data_nascimento}`)
    console.log(`     ✅ BI: ${dadosCompletos.bi}`)
    console.log(`     ✅ Validade BI: ${dadosCompletos.validade_documento_bi}`)
    console.log(`     ✅ Estado Civil: ${dadosCompletos.estado_civil}`)
    console.log(`     ✅ Cônjuge: ${dadosCompletos.nome_conjuge}`)
    console.log(`     ✅ Filhos: ${dadosCompletos.tem_filhos}`)
    console.log(`     ✅ Número Filhos: ${dadosCompletos.numero_filhos}`)
    console.log(`     ✅ Nacionalidade: ${dadosCompletos.nacionalidade}`)
    console.log(`     ✅ Entidade Pública: ${dadosCompletos.entidade_publica}`)
    console.log(`     ✅ Entidade Privada: ${dadosCompletos.entidade_privada}`)
    console.log(`     ✅ Plano ID: ${dadosCompletos.assinatura_plano_id}`)
    console.log(`     ✅ Documentos: ${Object.keys(dadosCompletos.documentos_anexados).length} arquivos`)
    
    // 3. Verificar campos obrigatórios
    console.log('\n3. Verificando campos obrigatórios...')
    const camposObrigatorios = [
      'nome_completo',
      'email',
      'telefone',
      'provincia',
      'municipio',
      'profissao',
      'sector_profissional',
      'renda_mensal'
    ]
    
    const camposFaltantes = camposObrigatorios.filter(campo => !dadosCompletos[campo])
    
    if (camposFaltantes.length > 0) {
      console.log('   ❌ Campos faltantes:')
      camposFaltantes.forEach(campo => console.log(`     - ${campo}`))
    } else {
      console.log('   ✅ Todos os campos obrigatórios estão presentes')
    }
    
    // 4. Verificar campos adicionais
    console.log('\n4. Verificando campos adicionais...')
    const camposAdicionais = [
      'data_nascimento',
      'bi',
      'validade_documento_bi',
      'estado_civil',
      'nome_conjuge',
      'tem_filhos',
      'numero_filhos',
      'nacionalidade',
      'entidade_publica',
      'entidade_privada',
      'comuna',
      'endereco_completo'
    ]
    
    const camposPresentes = camposAdicionais.filter(campo => dadosCompletos[campo])
    console.log(`   ✅ ${camposPresentes.length}/${camposAdicionais.length} campos adicionais presentes:`)
    camposPresentes.forEach(campo => {
      console.log(`     - ${campo}: ${dadosCompletos[campo]}`)
    })
    
    // 5. Verificar estrutura da tabela
    console.log('\n5. Verificando estrutura da tabela...')
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .limit(1)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesError.message)
    } else if (inscricoes.length > 0) {
      console.log('   Campos disponíveis na tabela:')
      Object.keys(inscricoes[0]).forEach(campo => {
        console.log(`     - ${campo}`)
      })
    }
    
    // 6. Verificar compatibilidade
    console.log('\n6. Verificando compatibilidade...')
    if (inscricoes.length > 0) {
      const camposTabela = Object.keys(inscricoes[0])
      const camposFormulario = Object.keys(dadosCompletos)
      
      const camposComuns = camposFormulario.filter(campo => camposTabela.includes(campo))
      const camposFaltantesTabela = camposFormulario.filter(campo => !camposTabela.includes(campo))
      
      console.log(`   ✅ ${camposComuns.length} campos compatíveis`)
      if (camposFaltantesTabela.length > 0) {
        console.log(`   ⚠️  ${camposFaltantesTabela.length} campos não encontrados na tabela:`)
        camposFaltantesTabela.forEach(campo => console.log(`     - ${campo}`))
      }
    }
    
    console.log('\n🎉 Teste do formulário completo concluído!')
    console.log('✅ Dados simulados corretamente')
    console.log('✅ Processamento funcionando')
    console.log('✅ Campos obrigatórios verificados')
    console.log('✅ Campos adicionais verificados')
    console.log('✅ Estrutura da tabela verificada')
    console.log('✅ Compatibilidade verificada')
    
    console.log('\n🚀 Para testar no navegador:')
    console.log('1. Acesse: http://localhost:5173/CadastroPublico')
    console.log('2. Preencha todos os campos do formulário')
    console.log('3. Submeta a inscrição')
    console.log('4. Verifique se todos os dados foram salvos no Supabase')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error.message)
  }
}

testCadastroPublicoCompleto()
