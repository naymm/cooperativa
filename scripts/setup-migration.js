#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 Configurando migração Base44 → Supabase...\n')

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '..', '.env')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('📝 Criando arquivo .env...')
  
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_SUPABASE=false

# Exemplo:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# VITE_USE_SUPABASE=false
`
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Arquivo .env criado com sucesso!')
} else {
  console.log('✅ Arquivo .env já existe')
}

// Verificar se as dependências estão instaladas
console.log('\n📦 Verificando dependências...')

const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

const requiredDeps = ['@supabase/supabase-js']
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep])

if (missingDeps.length > 0) {
  console.log(`❌ Dependências faltando: ${missingDeps.join(', ')}`)
  console.log('Execute: npm install @supabase/supabase-js')
} else {
  console.log('✅ Todas as dependências estão instaladas')
}

// Verificar se os arquivos de migração existem
console.log('\n📁 Verificando arquivos de migração...')

const requiredFiles = [
  'src/api/supabaseClient.js',
  'src/api/supabaseEntities.js',
  'src/api/entities-hybrid.js',
  'src/components/admin/MigrationConfig.jsx',
  'supabase-migration.sql',
  'scripts/migrate-to-supabase.js'
]

const missingFiles = requiredFiles.filter(file => {
  const filePath = path.join(__dirname, '..', file)
  return !fs.existsSync(filePath)
})

if (missingFiles.length > 0) {
  console.log(`❌ Arquivos faltando:`)
  missingFiles.forEach(file => console.log(`   - ${file}`))
} else {
  console.log('✅ Todos os arquivos de migração estão presentes')
}

// Instruções finais
console.log('\n🎯 Próximos passos:')
console.log('1. Crie um projeto no Supabase (https://supabase.com)')
console.log('2. Execute o script SQL em supabase-migration.sql')
console.log('3. Configure as credenciais no arquivo .env')
console.log('4. Execute: node scripts/migrate-to-supabase.js')
console.log('5. Teste o sistema com VITE_USE_SUPABASE=true')
console.log('6. Ative o Supabase permanentemente')

console.log('\n📚 Para mais detalhes, consulte MIGRATION_GUIDE.md')
console.log('🔧 Para configurar via interface, acesse /admin/migration')

console.log('\n✨ Configuração concluída!')
