import { base44 } from '../src/api/base44Client.js'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

// Cliente Supabase
const supabase = createClient(
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
    console.log(`Encontrados ${cooperados.length} cooperados`)
    
    for (const cooperado of cooperados) {
      try {
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
          console.error(`❌ Erro ao migrar cooperado ${cooperado.id}:`, error.message)
        } else {
          console.log(`✅ Cooperado ${cooperado.id} migrado com sucesso`)
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar cooperado ${cooperado.id}:`, error.message)
      }
    }

    // 2. Migrar Assinatura Planos
    console.log('\n📋 Migrando Assinatura Planos...')
    const planos = await base44.entities.AssinaturaPlano.find()
    console.log(`Encontrados ${planos.length} planos`)
    
    for (const plano of planos) {
      try {
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
          console.error(`❌ Erro ao migrar plano ${plano.id}:`, error.message)
        } else {
          console.log(`✅ Plano ${plano.id} migrado com sucesso`)
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar plano ${plano.id}:`, error.message)
      }
    }

    // 3. Migrar Projetos
    console.log('\n📋 Migrando Projetos...')
    const projetos = await base44.entities.Projeto.find()
    console.log(`Encontrados ${projetos.length} projetos`)
    
    for (const projeto of projetos) {
      try {
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
          console.error(`❌ Erro ao migrar projeto ${projeto.id}:`, error.message)
        } else {
          console.log(`✅ Projeto ${projeto.id} migrado com sucesso`)
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar projeto ${projeto.id}:`, error.message)
      }
    }

    // 4. Migrar Pagamentos
    console.log('\n📋 Migrando Pagamentos...')
    const pagamentos = await base44.entities.Pagamento.find()
    console.log(`Encontrados ${pagamentos.length} pagamentos`)
    
    for (const pagamento of pagamentos) {
      try {
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
          console.error(`❌ Erro ao migrar pagamento ${pagamento.id}:`, error.message)
        } else {
          console.log(`✅ Pagamento ${pagamento.id} migrado com sucesso`)
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar pagamento ${pagamento.id}:`, error.message)
      }
    }

    console.log('\n🎉 Migração concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
  }
}

// Executar migração
migrateData()
