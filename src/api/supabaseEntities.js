import { supabase, supabaseAuth } from './supabaseClient'

// Classe base para entidades Supabase
class SupabaseEntity {
  constructor(tableName) {
    this.tableName = tableName
  }

  async find(options = {}) {
    let query = supabase.from(this.tableName).select('*')
    
    if (options.where) {
      Object.keys(options.where).forEach(key => {
        query = query.eq(key, options.where[key])
      })
    }
    
    if (options.orderBy) {
      query = query.order(options.orderBy.field, { ascending: options.orderBy.ascending !== false })
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }

  async findOne(options = {}) {
    const results = await this.find(options)
    return results.length > 0 ? results[0] : null
  }

  async create(data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
    
    if (error) throw error
    return result[0]
  }

  async update(id, data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return result[0]
  }

  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  async count(options = {}) {
    let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true })
    
    if (options.where) {
      Object.keys(options.where).forEach(key => {
        query = query.eq(key, options.where[key])
      })
    }
    
    const { count, error } = await query
    
    if (error) throw error
    return count
  }

  // Método filter para compatibilidade com Base44
  async filter(criteria = {}) {
    let query = supabase.from(this.tableName).select('*')
    
    if (criteria) {
      Object.keys(criteria).forEach(key => {
        query = query.eq(key, criteria[key])
      })
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }

  // Método list para compatibilidade com Base44
  async list(options = {}) {
    return this.find(options)
  }

  // Método get para compatibilidade com Base44
  async get(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Entidades específicas
export const Cooperado = new SupabaseEntity('cooperados')
export const Projeto = new SupabaseEntity('projetos')
export const Pagamento = new SupabaseEntity('pagamentos')
export const AssinaturaPlano = new SupabaseEntity('assinatura_planos')
export const CooperadoAuth = new SupabaseEntity('cooperado_auth')
export const CooperadoNotificacao = new SupabaseEntity('cooperado_notificacoes')
export const CooperadoSupporte = new SupabaseEntity('cooperado_suporte')
export const CrmNotificacao = new SupabaseEntity('crm_notificacoes')
export const Inscricao = new SupabaseEntity('inscricoes')
export const InscricaoPublica = new SupabaseEntity('inscricoes_publicas')
export const EmailLog = new SupabaseEntity('email_logs')
export const EmailTemplate = new SupabaseEntity('email_templates')
export const EmailQueue = new SupabaseEntity('email_queue')
export const CrmUser = new SupabaseEntity('crm_users')

// Auth - usando Supabase Auth
export const User = {
  // Métodos de autenticação
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  signIn: async (email, password) => {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    const { error } = await supabaseAuth.auth.signOut()
    if (error) throw error
    return true
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabaseAuth.auth.getUser()
    if (error) throw error
    return user
  },

  onAuthStateChange: (callback) => {
    return supabaseAuth.auth.onAuthStateChange(callback)
  }
}
