# Guia de Migração: Base44 → Supabase

Este guia detalha o processo completo de migração do sistema da Cooperativa Sanep do Base44 para o Supabase.

## 📋 Visão Geral

A migração foi projetada para ser **gradual e segura**, permitindo que você:
- Mantenha o sistema funcionando durante a migração
- Teste o Supabase antes de desativar o Base44
- Migre dados de forma controlada
- Volte ao Base44 se necessário

## 🚀 Passos da Migração

### 1. Preparação do Supabase

#### 1.1 Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha uma organização
5. Configure:
   - **Name**: `cooperativa-sanep`
   - **Database Password**: (guarde esta senha)
   - **Region**: Escolha a mais próxima (ex: São Paulo)
6. Aguarde a criação do projeto (2-3 minutos)

#### 1.2 Configurar Banco de Dados
1. No painel do Supabase, vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo `supabase-migration.sql`
3. Execute o script completo
4. Verifique se todas as tabelas foram criadas em **Table Editor**

#### 1.3 Obter Credenciais
1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key (começa com `eyJ...`)

### 2. Configuração Local

#### 2.1 Instalar Dependências
```bash
npm install @supabase/supabase-js
```

#### 2.2 Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_USE_SUPABASE=false
```

**Nota**: Mantenha `VITE_USE_SUPABASE=false` inicialmente para continuar usando o Base44.

### 3. Migração Gradual

#### 3.1 Usar o Sistema Híbrido
O projeto agora inclui um sistema híbrido que permite alternar entre Base44 e Supabase:

```javascript
// Em src/api/entities-hybrid.js
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true'

// As entidades automaticamente usam o backend correto
export const Cooperado = USE_SUPABASE ? supabaseEntities.Cooperado : base44.entities.Cooperado
```

#### 3.2 Componente de Configuração
Acesse o componente de migração em `/admin/migration` para:
- Configurar credenciais do Supabase
- Alternar entre backends
- Migrar dados
- Monitorar progresso

### 4. Migração de Dados

#### 4.1 Migração Automática
Use o script de migração:

```bash
# Instalar dotenv se necessário
npm install dotenv

# Executar migração
node scripts/migrate-to-supabase.js
```

#### 4.2 Migração Manual por Entidade
```javascript
import { migrateEntityData } from '@/api/entities-hybrid'

// Migrar uma entidade específica
await migrateEntityData('Cooperado', 'base44', 'supabase')
```

### 5. Testes e Validação

#### 5.1 Testar Funcionalidades
1. Ative o Supabase: `VITE_USE_SUPABASE=true`
2. Teste todas as funcionalidades principais:
   - Login de cooperados
   - Cadastro de cooperados
   - Pagamentos
   - Projetos
   - Notificações
   - Relatórios

#### 5.2 Verificar Dados
Compare os dados entre Base44 e Supabase:
```javascript
// Verificar contagem de registros
const base44Count = await base44.entities.Cooperado.count()
const supabaseCount = await supabaseEntities.Cooperado.count()
console.log(`Base44: ${base44Count}, Supabase: ${supabaseCount}`)
```

### 6. Ativação Completa

#### 6.1 Configuração Final
Quando tudo estiver funcionando:

1. Defina `VITE_USE_SUPABASE=true` no `.env`
2. Reinicie o servidor de desenvolvimento
3. Teste todas as funcionalidades novamente

#### 6.2 Limpeza
Após confirmar que tudo funciona:

1. Remova a dependência do Base44:
```bash
npm uninstall @base44/sdk
```

2. Remova arquivos desnecessários:
```bash
rm src/api/base44Client.js
rm src/api/entities.js
rm -rf Entities-Base44/
```

3. Atualize imports para usar apenas Supabase:
```javascript
// Antes
import { Cooperado } from '@/api/entities-hybrid'

// Depois
import { Cooperado } from '@/api/supabaseEntities'
```

## 🔧 Estrutura de Arquivos

```
src/
├── api/
│   ├── supabaseClient.js          # Cliente Supabase
│   ├── supabaseEntities.js        # Entidades Supabase
│   ├── entities-hybrid.js         # Sistema híbrido (temporário)
│   └── base44Client.js            # Cliente Base44 (remover após migração)
├── components/
│   └── admin/
│       └── MigrationConfig.jsx    # Interface de migração
└── scripts/
    └── migrate-to-supabase.js     # Script de migração

supabase-migration.sql              # Script SQL para criar tabelas
env.example                         # Exemplo de variáveis de ambiente
MIGRATION_GUIDE.md                  # Este guia
```

## 📊 Tabelas Migradas

| Entidade Base44 | Tabela Supabase | Descrição |
|----------------|----------------|-----------|
| Cooperado | cooperados | Dados dos cooperados |
| AssinaturaPlano | assinatura_planos | Planos de assinatura |
| Projeto | projetos | Projetos da cooperativa |
| Pagamento | pagamentos | Pagamentos dos cooperados |
| CooperadoAuth | cooperado_auth | Autenticação dos cooperados |
| CooperadoNotificacao | cooperado_notificacoes | Notificações |
| CooperadoSupporte | cooperado_suporte | Sistema de suporte |
| Inscricao | inscricoes | Inscrições em planos |
| InscricaoPublica | inscricoes_publicas | Inscrições públicas |
| EmailLog | email_logs | Logs de emails |
| EmailTemplate | email_templates | Templates de email |
| EmailQueue | email_queue | Fila de emails |
| CrmUser | crm_users | Usuários do CRM |
| CrmNotificacao | crm_notificacoes | Notificações do CRM |

## 🔒 Segurança

### Row Level Security (RLS)
O Supabase inclui RLS configurado com políticas básicas:
- Todas as tabelas têm RLS habilitado
- Políticas básicas permitem SELECT para todos
- Você pode ajustar as políticas conforme necessário

### Autenticação
- Supabase Auth substitui o sistema de autenticação do Base44
- Tokens JWT são gerenciados automaticamente
- Sessões são persistentes

## 🚨 Troubleshooting

### Erro de Conexão
```bash
# Verificar se as credenciais estão corretas
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### Dados Não Migrados
```javascript
// Verificar se a migração foi completa
const base44Data = await base44.entities.Cooperado.find()
const supabaseData = await supabaseEntities.Cooperado.find()
console.log('Base44:', base44Data.length, 'Supabase:', supabaseData.length)
```

### Erro de Permissão
```sql
-- Verificar políticas RLS no Supabase
SELECT * FROM pg_policies WHERE tablename = 'cooperados';
```

## 📞 Suporte

Se encontrar problemas durante a migração:

1. **Verifique os logs** no console do navegador
2. **Teste individualmente** cada entidade
3. **Compare os dados** entre Base44 e Supabase
4. **Consulte a documentação** do Supabase

## ✅ Checklist de Migração

- [ ] Projeto Supabase criado
- [ ] Script SQL executado
- [ ] Credenciais configuradas
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Dados migrados
- [ ] Funcionalidades testadas
- [ ] Sistema híbrido testado
- [ ] Supabase ativado
- [ ] Base44 desativado
- [ ] Código limpo

## 🎯 Benefícios da Migração

### Supabase vs Base44

| Aspecto | Base44 | Supabase |
|---------|--------|----------|
| **Custo** | Pago | Gratuito até 500MB |
| **Performance** | Limitada | PostgreSQL otimizado |
| **Escalabilidade** | Limitada | Altamente escalável |
| **Funcionalidades** | Básicas | Avançadas (RLS, Auth, etc.) |
| **Controle** | Limitado | Total |
| **Integração** | Proprietária | Padrões abertos |

### Novas Funcionalidades Disponíveis

- **Row Level Security** para controle granular de acesso
- **Autenticação avançada** com múltiplos provedores
- **Real-time subscriptions** para atualizações em tempo real
- **Edge Functions** para lógica serverless
- **Storage** para arquivos
- **Analytics** integrado
- **Backup automático** e point-in-time recovery
