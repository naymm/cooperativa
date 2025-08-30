import { base44 } from './base44Client'
import * as supabaseEntities from './supabaseEntities'
import { supabase } from './supabaseClient'

// Flag para controlar qual backend usar
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true'

// Função para obter a entidade correta baseada na flag
function getEntity(entityName) {
  if (USE_SUPABASE) {
    return supabaseEntities[entityName]
  } else {
    return base44.entities[entityName]
  }
}

// Função para obter o auth correto
function getAuth() {
  if (USE_SUPABASE) {
    return supabaseEntities.User
  } else {
    return base44.auth
  }
}

// Exportar entidades com fallback
export const Cooperado = USE_SUPABASE ? supabaseEntities.Cooperado : base44.entities.Cooperado
export const Projeto = USE_SUPABASE ? supabaseEntities.Projeto : base44.entities.Projeto
export const Pagamento = USE_SUPABASE ? supabaseEntities.Pagamento : base44.entities.Pagamento
export const AssinaturaPlano = USE_SUPABASE ? supabaseEntities.AssinaturaPlano : base44.entities.AssinaturaPlano
export const CooperadoAuth = USE_SUPABASE ? supabaseEntities.CooperadoAuth : base44.entities.CooperadoAuth
export const CooperadoNotificacao = USE_SUPABASE ? supabaseEntities.CooperadoNotificacao : base44.entities.CooperadoNotificacao
export const CooperadoSupporte = USE_SUPABASE ? supabaseEntities.CooperadoSupporte : base44.entities.CooperadoSupporte
export const CrmNotificacao = USE_SUPABASE ? supabaseEntities.CrmNotificacao : base44.entities.CrmNotificacao
export const Inscricao = USE_SUPABASE ? supabaseEntities.Inscricao : base44.entities.Inscricao
export const InscricaoPublica = USE_SUPABASE ? supabaseEntities.InscricaoPublica : base44.entities.InscricaoPublica
export const EmailLog = USE_SUPABASE ? supabaseEntities.EmailLog : base44.entities.EmailLog
export const EmailTemplate = USE_SUPABASE ? supabaseEntities.EmailTemplate : base44.entities.EmailTemplate
export const EmailQueue = USE_SUPABASE ? supabaseEntities.EmailQueue : base44.entities.EmailQueue
export const CrmUser = USE_SUPABASE ? supabaseEntities.CrmUser : base44.entities.CrmUser

// Auth
export const User = USE_SUPABASE ? supabaseEntities.User : base44.auth

// Função utilitária para verificar qual backend está sendo usado
export const getBackendInfo = () => ({
  backend: USE_SUPABASE ? 'Supabase' : 'Base44',
  useSupabase: USE_SUPABASE
})

// Função para migrar dados entre backends
export const migrateEntityData = async (entityName, fromBackend = 'base44', toBackend = 'supabase') => {
  console.log(`🔄 Migrando dados de ${entityName} de ${fromBackend} para ${toBackend}...`)
  
  try {
    let sourceData, targetEntity
    
    if (fromBackend === 'base44') {
      sourceData = await base44.entities[entityName].find()
      targetEntity = supabaseEntities[entityName]
    } else {
      sourceData = await supabaseEntities[entityName].find()
      targetEntity = base44.entities[entityName]
    }
    
    let migratedCount = 0
    for (const item of sourceData) {
      try {
        await targetEntity.create(item)
        migratedCount++
      } catch (error) {
        console.error(`❌ Erro ao migrar item ${item.id}:`, error)
      }
    }
    
    console.log(`✅ ${migratedCount} itens migrados com sucesso para ${entityName}`)
    return migratedCount
    
  } catch (error) {
    console.error(`❌ Erro durante migração de ${entityName}:`, error)
    throw error
  }
}

// Exportar o cliente Supabase
export { supabase }
