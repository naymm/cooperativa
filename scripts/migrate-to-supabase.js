import { createClient } from '@base44/sdk'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

// Cliente Base44
const base44 = createClient({
  appId: "683c8e5c7f28b76cbf2c7555",
  requiresAuth: false
})

// Cliente Supabase
const supabase = createSupabaseClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Função para migrar dados
async function migrateData() {
  console.log('🚀 Iniciando migração Base44 → Supabase...')
  
  try {
    // 1. Migrar Cooperados
    console.log('📋 Migrando Cooperados...')
    const cooperados = await base44.entities.Cooperado.find()
    for (const cooperado of cooperados) {
      const { error } = await supabase
        .from('cooperados')
        .insert({
          id: cooperado.id,
          numero_associado: cooperado.numero_associado,
          nome_completo: cooperado.nome_completo,
          data_nascimento: cooperado.data_nascimento,
          estado_civil: cooperado.estado_civil,
          nome_conjuge: cooperado.nome_conjuge,
          tem_filhos: cooperado.tem_filhos,
          numero_filhos: cooperado.numero_filhos,
          nacionalidade: cooperado.nacionalidade,
          bi: cooperado.bi,
          validade_documento_bi: cooperado.validade_documento_bi,
          email: cooperado.email,
          telefone: cooperado.telefone,
          provincia: cooperado.provincia,
          municipio: cooperado.municipio,
          comuna: cooperado.comuna,
          endereco_completo: cooperado.endereco_completo,
          profissao: cooperado.profissao,
          sector_profissional: cooperado.sector_profissional,
          entidade_publica: cooperado.entidade_publica,
          entidade_privada: cooperado.entidade_privada,
          renda_mensal: cooperado.renda_mensal,
          documentos_anexados: cooperado.documentos_anexados,
          status: cooperado.status,
          data_inscricao: cooperado.data_inscricao,
          assinatura_plano_id: cooperado.assinatura_plano_id,
          taxa_inscricao_paga: cooperado.taxa_inscricao_paga,
          observacoes: cooperado.observacoes,
          created_at: cooperado.createdAt,
          updated_at: cooperado.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar cooperado ${cooperado.id}:`, error)
      } else {
        console.log(`✅ Cooperado ${cooperado.id} migrado com sucesso`)
      }
    }

    // 2. Migrar Assinatura Planos
    console.log('📋 Migrando Assinatura Planos...')
    const planos = await base44.entities.AssinaturaPlano.find()
    for (const plano of planos) {
      const { error } = await supabase
        .from('assinatura_planos')
        .insert({
          id: plano.id,
          nome: plano.nome,
          descricao: plano.descricao,
          valor_mensal: plano.valor_mensal,
          beneficios: plano.beneficios,
          status: plano.status,
          created_at: plano.createdAt,
          updated_at: plano.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar plano ${plano.id}:`, error)
      } else {
        console.log(`✅ Plano ${plano.id} migrado com sucesso`)
      }
    }

    // 3. Migrar Projetos
    console.log('📋 Migrando Projetos...')
    const projetos = await base44.entities.Projeto.find()
    for (const projeto of projetos) {
      const { error } = await supabase
        .from('projetos')
        .insert({
          id: projeto.id,
          titulo: projeto.titulo,
          descricao: projeto.descricao,
          valor_total: projeto.valor_total,
          valor_entrada: projeto.valor_entrada,
          numero_parcelas: projeto.numero_parcelas,
          valor_parcela: projeto.valor_parcela,
          data_inicio: projeto.data_inicio,
          data_fim: projeto.data_fim,
          status: projeto.status,
          cooperados_interessados: projeto.cooperados_interessados,
          created_at: projeto.createdAt,
          updated_at: projeto.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar projeto ${projeto.id}:`, error)
      } else {
        console.log(`✅ Projeto ${projeto.id} migrado com sucesso`)
      }
    }

    // 4. Migrar Pagamentos
    console.log('📋 Migrando Pagamentos...')
    const pagamentos = await base44.entities.Pagamento.find()
    for (const pagamento of pagamentos) {
      const { error } = await supabase
        .from('pagamentos')
        .insert({
          id: pagamento.id,
          cooperado_id: pagamento.cooperado_id,
          assinatura_plano_id: pagamento.assinatura_plano_id,
          projeto_id: pagamento.projeto_id,
          valor: pagamento.valor,
          data_pagamento: pagamento.data_pagamento,
          data_vencimento: pagamento.data_vencimento,
          mes_referencia: pagamento.mes_referencia,
          metodo_pagamento: pagamento.metodo_pagamento,
          status: pagamento.status,
          referencia: pagamento.referencia,
          tipo: pagamento.tipo,
          comprovante_url: pagamento.comprovante_url,
          observacoes: pagamento.observacoes,
          confirmado_por: pagamento.confirmado_por,
          tipo_pagamento_projeto: pagamento.tipo_pagamento_projeto,
          created_at: pagamento.createdAt,
          updated_at: pagamento.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar pagamento ${pagamento.id}:`, error)
      } else {
        console.log(`✅ Pagamento ${pagamento.id} migrado com sucesso`)
      }
    }

    // 5. Migrar Cooperado Auth
    console.log('📋 Migrando Cooperado Auth...')
    const auths = await base44.entities.CooperadoAuth.find()
    for (const auth of auths) {
      const { error } = await supabase
        .from('cooperado_auth')
        .insert({
          id: auth.id,
          cooperado_id: auth.cooperado_id,
          email: auth.email,
          senha_hash: auth.senha_hash,
          ultimo_login: auth.ultimo_login,
          status: auth.status,
          created_at: auth.createdAt,
          updated_at: auth.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar auth ${auth.id}:`, error)
      } else {
        console.log(`✅ Auth ${auth.id} migrado com sucesso`)
      }
    }

    // 6. Migrar Notificações
    console.log('📋 Migrando Notificações...')
    const notificacoes = await base44.entities.CooperadoNotificacao.find()
    for (const notificacao of notificacoes) {
      const { error } = await supabase
        .from('cooperado_notificacoes')
        .insert({
          id: notificacao.id,
          cooperado_id: notificacao.cooperado_id,
          titulo: notificacao.titulo,
          mensagem: notificacao.mensagem,
          tipo: notificacao.tipo,
          lida: notificacao.lida,
          data_envio: notificacao.data_envio,
          created_at: notificacao.createdAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar notificação ${notificacao.id}:`, error)
      } else {
        console.log(`✅ Notificação ${notificacao.id} migrada com sucesso`)
      }
    }

    // 7. Migrar Suporte
    console.log('📋 Migrando Suporte...')
    const suportes = await base44.entities.CooperadoSupporte.find()
    for (const suporte of suportes) {
      const { error } = await supabase
        .from('cooperado_suporte')
        .insert({
          id: suporte.id,
          cooperado_id: suporte.cooperado_id,
          assunto: suporte.assunto,
          mensagem: suporte.mensagem,
          status: suporte.status,
          prioridade: suporte.prioridade,
          resposta: suporte.resposta,
          respondido_por: suporte.respondido_por,
          data_resposta: suporte.data_resposta,
          created_at: suporte.createdAt,
          updated_at: suporte.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar suporte ${suporte.id}:`, error)
      } else {
        console.log(`✅ Suporte ${suporte.id} migrado com sucesso`)
      }
    }

    // 8. Migrar Inscrições
    console.log('📋 Migrando Inscrições...')
    const inscricoes = await base44.entities.Inscricao.find()
    for (const inscricao of inscricoes) {
      const { error } = await supabase
        .from('inscricoes')
        .insert({
          id: inscricao.id,
          cooperado_id: inscricao.cooperado_id,
          plano_id: inscricao.plano_id,
          data_inscricao: inscricao.data_inscricao,
          status: inscricao.status,
          observacoes: inscricao.observacoes,
          aprovado_por: inscricao.aprovado_por,
          data_aprovacao: inscricao.data_aprovacao,
          created_at: inscricao.createdAt,
          updated_at: inscricao.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar inscrição ${inscricao.id}:`, error)
      } else {
        console.log(`✅ Inscrição ${inscricao.id} migrada com sucesso`)
      }
    }

    // 9. Migrar Inscrições Públicas
    console.log('📋 Migrando Inscrições Públicas...')
    const inscricoesPublicas = await base44.entities.InscricaoPublica.find()
    for (const inscricao of inscricoesPublicas) {
      const { error } = await supabase
        .from('inscricoes_publicas')
        .insert({
          id: inscricao.id,
          nome_completo: inscricao.nome_completo,
          email: inscricao.email,
          telefone: inscricao.telefone,
          provincia: inscricao.provincia,
          municipio: inscricao.municipio,
          profissao: inscricao.profissao,
          sector_profissional: inscricao.sector_profissional,
          entidade: inscricao.entidade,
          renda_mensal: inscricao.renda_mensal,
          plano_interesse: inscricao.plano_interesse,
          status: inscricao.status,
          observacoes: inscricao.observacoes,
          processado_por: inscricao.processado_por,
          data_processamento: inscricao.data_processamento,
          created_at: inscricao.createdAt,
          updated_at: inscricao.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar inscrição pública ${inscricao.id}:`, error)
      } else {
        console.log(`✅ Inscrição pública ${inscricao.id} migrada com sucesso`)
      }
    }

    // 10. Migrar Email Logs
    console.log('📋 Migrando Email Logs...')
    const emailLogs = await base44.entities.EmailLog.find()
    for (const log of emailLogs) {
      const { error } = await supabase
        .from('email_logs')
        .insert({
          id: log.id,
          destinatario: log.destinatario,
          assunto: log.assunto,
          corpo: log.corpo,
          status: log.status,
          erro_mensagem: log.erro_mensagem,
          tentativas: log.tentativas,
          data_envio: log.data_envio,
          data_entrega: log.data_entrega,
          created_at: log.createdAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar email log ${log.id}:`, error)
      } else {
        console.log(`✅ Email log ${log.id} migrado com sucesso`)
      }
    }

    // 11. Migrar Email Templates
    console.log('📋 Migrando Email Templates...')
    const templates = await base44.entities.EmailTemplate.find()
    for (const template of templates) {
      const { error } = await supabase
        .from('email_templates')
        .insert({
          id: template.id,
          nome: template.nome,
          assunto: template.assunto,
          corpo: template.corpo,
          variaveis: template.variaveis,
          ativo: template.ativo,
          created_at: template.createdAt,
          updated_at: template.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar template ${template.id}:`, error)
      } else {
        console.log(`✅ Template ${template.id} migrado com sucesso`)
      }
    }

    // 12. Migrar Email Queue
    console.log('📋 Migrando Email Queue...')
    const queue = await base44.entities.EmailQueue.find()
    for (const item of queue) {
      const { error } = await supabase
        .from('email_queue')
        .insert({
          id: item.id,
          template_id: item.template_id,
          destinatario: item.destinatario,
          variaveis: item.variaveis,
          prioridade: item.prioridade,
          status: item.status,
          tentativas: item.tentativas,
          proxima_tentativa: item.proxima_tentativa,
          data_envio: item.data_envio,
          created_at: item.createdAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar queue item ${item.id}:`, error)
      } else {
        console.log(`✅ Queue item ${item.id} migrado com sucesso`)
      }
    }

    // 13. Migrar CRM Users
    console.log('📋 Migrando CRM Users...')
    const crmUsers = await base44.entities.CrmUser.find()
    for (const user of crmUsers) {
      const { error } = await supabase
        .from('crm_users')
        .insert({
          id: user.id,
          nome: user.nome,
          email: user.email,
          senha_hash: user.senha_hash,
          cargo: user.cargo,
          permissoes: user.permissoes,
          status: user.status,
          ultimo_login: user.ultimo_login,
          created_at: user.createdAt,
          updated_at: user.updatedAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar CRM user ${user.id}:`, error)
      } else {
        console.log(`✅ CRM user ${user.id} migrado com sucesso`)
      }
    }

    // 14. Migrar CRM Notificações
    console.log('📋 Migrando CRM Notificações...')
    const crmNotificacoes = await base44.entities.CrmNotificacao.find()
    for (const notificacao of crmNotificacoes) {
      const { error } = await supabase
        .from('crm_notificacoes')
        .insert({
          id: notificacao.id,
          titulo: notificacao.titulo,
          mensagem: notificacao.mensagem,
          tipo: notificacao.tipo,
          destinatarios: notificacao.destinatarios,
          lida_por: notificacao.lida_por,
          data_envio: notificacao.data_envio,
          created_at: notificacao.createdAt
        })
      
      if (error) {
        console.error(`❌ Erro ao migrar CRM notificação ${notificacao.id}:`, error)
      } else {
        console.log(`✅ CRM notificação ${notificacao.id} migrada com sucesso`)
      }
    }

    console.log('🎉 Migração concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
  }
}

// Executar migração
migrateData()
