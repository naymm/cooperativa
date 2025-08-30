import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function addMissingColumns() {
  console.log('🔧 Adicionando campos faltantes na tabela inscricoes_publicas...\n')
  
  try {
    // 1. Verificar estrutura atual
    console.log('1. Verificando estrutura atual...')
    const { data: inscricoes, error: inscricoesError } = await supabase
      .from('inscricoes_publicas')
      .select('*')
      .limit(1)
    
    if (inscricoesError) {
      console.error('❌ Erro ao acessar inscricoes_publicas:', inscricoesError.message)
      return
    }
    
    if (inscricoes.length > 0) {
      console.log('   Campos atuais:')
      Object.keys(inscricoes[0]).forEach(campo => {
        console.log(`     - ${campo}`)
      })
    }
    
    // 2. Lista de campos que precisam ser adicionados
    console.log('\n2. Campos que precisam ser adicionados:')
    const camposParaAdicionar = [
      'numero_associado',
      'data_nascimento', 
      'estado_civil',
      'nome_conjuge',
      'tem_filhos',
      'numero_filhos',
      'nacionalidade',
      'bi',
      'validade_documento_bi',
      'comuna',
      'endereco_completo',
      'entidade_publica',
      'entidade_privada',
      'documentos_anexados',
      'data_inscricao',
      'assinatura_plano_id',
      'taxa_inscricao_paga'
    ]
    
    camposParaAdicionar.forEach(campo => {
      console.log(`     - ${campo}`)
    })
    
    // 3. Nota sobre como adicionar os campos
    console.log('\n3. Como adicionar os campos:')
    console.log('   ⚠️  Os campos precisam ser adicionados manualmente no Supabase Dashboard')
    console.log('   📋 Lista de campos para adicionar:')
    
    console.log('\n   📝 SQL para executar no Supabase SQL Editor:')
    console.log(`
-- Adicionar campos faltantes na tabela inscricoes_publicas
ALTER TABLE inscricoes_publicas 
ADD COLUMN IF NOT EXISTS numero_associado VARCHAR(50),
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(50) DEFAULT 'solteiro',
ADD COLUMN IF NOT EXISTS nome_conjuge VARCHAR(255),
ADD COLUMN IF NOT EXISTS tem_filhos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS numero_filhos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nacionalidade VARCHAR(100) DEFAULT 'Angolana',
ADD COLUMN IF NOT EXISTS bi VARCHAR(50),
ADD COLUMN IF NOT EXISTS validade_documento_bi DATE,
ADD COLUMN IF NOT EXISTS comuna VARCHAR(100),
ADD COLUMN IF NOT EXISTS endereco_completo TEXT,
ADD COLUMN IF NOT EXISTS entidade_publica JSONB,
ADD COLUMN IF NOT EXISTS entidade_privada VARCHAR(255),
ADD COLUMN IF NOT EXISTS documentos_anexados JSONB,
ADD COLUMN IF NOT EXISTS data_inscricao DATE,
ADD COLUMN IF NOT EXISTS assinatura_plano_id UUID,
ADD COLUMN IF NOT EXISTS taxa_inscricao_paga BOOLEAN DEFAULT false;
    `)
    
    // 4. Mapeamento de campos
    console.log('\n4. Mapeamento de campos:')
    console.log('   📋 Campos que serão mapeados:')
    console.log('     - plano_interesse → assinatura_plano_id')
    console.log('     - entidade → entidade_publica/entidade_privada')
    console.log('     - created_at → data_inscricao')
    
    // 5. Atualizações necessárias no código
    console.log('\n5. Atualizações necessárias no código:')
    console.log('   📝 Formulário de inscrição pública:')
    console.log('     - Adicionar campos de data de nascimento')
    console.log('     - Adicionar campos de estado civil')
    console.log('     - Adicionar campos de filhos')
    console.log('     - Adicionar campos de BI')
    console.log('     - Adicionar campo de comuna')
    console.log('     - Adicionar campo de endereço completo')
    console.log('     - Adicionar campos de entidade')
    console.log('     - Adicionar campo de taxa de inscrição')
    
    console.log('\n   📝 Função de aprovação:')
    console.log('     - Mapear todos os campos corretamente')
    console.log('     - Usar assinatura_plano_id em vez de plano_interesse')
    console.log('     - Preencher data_inscricao com created_at')
    console.log('     - Mapear entidade para entidade_publica/privada')
    
    console.log('\n   📝 Modal de detalhes:')
    console.log('     - Adicionar seções para novos campos')
    console.log('     - Mostrar informações de família')
    console.log('     - Mostrar informações de documento')
    console.log('     - Mostrar informações de localização completa')
    
    console.log('\n🎉 Análise de campos concluída!')
    console.log('✅ Lista de campos identificada')
    console.log('✅ Mapeamento definido')
    console.log('✅ Atualizações necessárias documentadas')
    
    console.log('\n📋 Próximos passos:')
    console.log('1. Executar SQL no Supabase Dashboard')
    console.log('2. Atualizar formulário de inscrição')
    console.log('3. Atualizar função de aprovação')
    console.log('4. Atualizar modal de detalhes')
    console.log('5. Testar fluxo completo')
    
  } catch (error) {
    console.error('❌ Erro durante análise:', error.message)
  }
}

addMissingColumns()
