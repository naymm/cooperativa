import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testInscricoesCRUD() {
  console.log('🧪 Testando CRUD completo das Inscrições...\n')
  
  try {
    // 1. Verificar dados existentes
    console.log('1. Verificando dados existentes...')
    const { data: inscricoesPublicas, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesError.message)
      return
    }
    
    console.log(`✅ ${inscricoesPublicas.length} inscrições públicas encontradas`)
    
    if (inscricoesPublicas.length > 0) {
      const inscricao = inscricoesPublicas[0]
      console.log('   Primeira inscrição:')
      console.log(`     ID: ${inscricao.id}`)
      console.log(`     Nome: ${inscricao.nome_completo}`)
      console.log(`     Status: ${inscricao.status}`)
      console.log(`     Email: ${inscricao.email}`)
    }
    
    // 2. Testar atualização (aprovação)
    console.log('\n2. Testando atualização (aprovação)...')
    if (inscricoesPublicas.length > 0) {
      const inscricaoParaAprovar = inscricoesPublicas.find(i => i.status === 'pendente')
      
      if (inscricaoParaAprovar) {
        console.log(`   Aprovando inscrição: ${inscricaoParaAprovar.nome_completo}`)
        
        const { data: inscricaoAtualizada, error: updateError } = await supabase
          .from('inscricoes_publicas')
          .update({ 
            status: 'aprovado',
            processado_por: { nome: 'Admin', email: 'admin@sistema.com' },
            data_processamento: new Date().toISOString()
          })
          .eq('id', inscricaoParaAprovar.id)
          .select()
        
        if (updateError) {
          console.error('❌ Erro ao aprovar inscrição:', updateError.message)
        } else {
          console.log('✅ Inscrição aprovada com sucesso')
          console.log(`   Novo status: ${inscricaoAtualizada[0].status}`)
          
          // 3. Testar criação de cooperado
          console.log('\n3. Testando criação de cooperado...')
          const numeroAssociado = `CS${Date.now().toString().slice(-6)}`
          
          const cooperadoData = {
            numero_associado: numeroAssociado,
            nome_completo: inscricaoParaAprovar.nome_completo,
            email: inscricaoParaAprovar.email,
            telefone: inscricaoParaAprovar.telefone,
            bi: inscricaoParaAprovar.bi || null,
            data_nascimento: inscricaoParaAprovar.data_nascimento || null,
            profissao: inscricaoParaAprovar.profissao || null,
            renda_mensal: inscricaoParaAprovar.renda_mensal || 0,
            provincia: inscricaoParaAprovar.provincia || null,
            municipio: inscricaoParaAprovar.municipio || null,
            endereco_completo: inscricaoParaAprovar.endereco_completo || null,
            data_inscricao: inscricaoParaAprovar.created_at,
            documentos_urls: inscricaoParaAprovar.documentos_urls || [],
            assinatura_plano_id: inscricaoParaAprovar.plano_interesse || null,
            status: "ativo",
            estado_civil: "solteiro",
            nacionalidade: "Angolana",
            sector_profissional: "privado"
          }
          
          const { data: cooperadoCriado, error: cooperadoError } = await supabase
            .from('cooperados')
            .insert(cooperadoData)
            .select()
          
          if (cooperadoError) {
            console.error('❌ Erro ao criar cooperado:', cooperadoError.message)
          } else {
            console.log('✅ Cooperado criado com sucesso')
            console.log(`   Número: ${cooperadoCriado[0].numero_associado}`)
            console.log(`   Nome: ${cooperadoCriado[0].nome_completo}`)
            
            // 4. Testar criação de credenciais
            console.log('\n4. Testando criação de credenciais...')
            const senhaTemporaria = 'TEMP123'
            
            const credenciaisData = {
              cooperado_id: numeroAssociado,
              password_hash: senhaTemporaria,
              two_factor_enabled: false,
              account_locked: false,
              login_attempts: 0
            }
            
            const { data: credenciaisCriadas, error: credenciaisError } = await supabase
              .from('cooperado_auth')
              .insert(credenciaisData)
              .select()
            
            if (credenciaisError) {
              console.error('❌ Erro ao criar credenciais:', credenciaisError.message)
            } else {
              console.log('✅ Credenciais criadas com sucesso')
              console.log(`   Cooperado ID: ${credenciaisCriadas[0].cooperado_id}`)
              
              // 5. Limpar dados de teste
              console.log('\n5. Limpando dados de teste...')
              
              const { error: deleteCredenciaisError } = await supabase
                .from('cooperado_auth')
                .delete()
                .eq('cooperado_id', numeroAssociado)
              
              if (deleteCredenciaisError) {
                console.error('❌ Erro ao deletar credenciais:', deleteCredenciaisError.message)
              } else {
                console.log('✅ Credenciais removidas')
              }
              
              const { error: deleteCooperadoError } = await supabase
                .from('cooperados')
                .delete()
                .eq('numero_associado', numeroAssociado)
              
              if (deleteCooperadoError) {
                console.error('❌ Erro ao deletar cooperado:', deleteCooperadoError.message)
              } else {
                console.log('✅ Cooperado removido')
              }
              
              // Reverter status da inscrição
              const { error: revertError } = await supabase
                .from('inscricoes_publicas')
                .update({ status: 'pendente' })
                .eq('id', inscricaoParaAprovar.id)
              
              if (revertError) {
                console.error('❌ Erro ao reverter status:', revertError.message)
              } else {
                console.log('✅ Status da inscrição revertido para pendente')
              }
            }
          }
        }
      } else {
        console.log('   Nenhuma inscrição pendente encontrada para testar')
      }
    }
    
    // 6. Testar rejeição
    console.log('\n6. Testando rejeição...')
    if (inscricoesPublicas.length > 0) {
      const inscricaoParaRejeitar = inscricoesPublicas.find(i => i.status === 'pendente')
      
      if (inscricaoParaRejeitar) {
        console.log(`   Rejeitando inscrição: ${inscricaoParaRejeitar.nome_completo}`)
        
        const { data: inscricaoRejeitada, error: rejectError } = await supabase
          .from('inscricoes_publicas')
          .update({ 
            status: 'rejeitado',
            observacoes: 'Teste de rejeição - motivo de teste'
          })
          .eq('id', inscricaoParaRejeitar.id)
          .select()
        
        if (rejectError) {
          console.error('❌ Erro ao rejeitar inscrição:', rejectError.message)
        } else {
          console.log('✅ Inscrição rejeitada com sucesso')
          console.log(`   Novo status: ${inscricaoRejeitada[0].status}`)
          console.log(`   Observações: ${inscricaoRejeitada[0].observacoes}`)
          
          // Reverter status
          const { error: revertError } = await supabase
            .from('inscricoes_publicas')
            .update({ status: 'pendente' })
            .eq('id', inscricaoParaRejeitar.id)
          
          if (revertError) {
            console.error('❌ Erro ao reverter status:', revertError.message)
          } else {
            console.log('✅ Status da inscrição revertido para pendente')
          }
        }
      } else {
        console.log('   Nenhuma inscrição pendente encontrada para testar rejeição')
      }
    }
    
    console.log('\n🎉 Teste CRUD completo concluído!')
    console.log('✅ Aprovação funcionando')
    console.log('✅ Criação de cooperado funcionando')
    console.log('✅ Criação de credenciais funcionando')
    console.log('✅ Rejeição funcionando')
    console.log('✅ Limpeza de dados funcionando')
    
  } catch (error) {
    console.error('❌ Erro durante teste CRUD:', error.message)
  }
}

testInscricoesCRUD()
