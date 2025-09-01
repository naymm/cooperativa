# 🗄️ Guia de Instalação do Banco de Dados - Sistema de Inscrições em Projetos

## 📋 Pré-requisitos

- ✅ Acesso ao Supabase Dashboard
- ✅ Projeto Supabase configurado
- ✅ Tabela `projetos` existente (não `projeto`)
- ✅ Tabela `cooperados` existente (não `cooperado`)

## 🚀 Passo a Passo da Instalação

### **1. Executar o Script Principal**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para seu projeto
3. Clique em **"SQL Editor"** no menu lateral
4. Cole todo o conteúdo do arquivo `supabase-create-inscricao-projeto.sql`
5. Clique em **"Run"** para executar

### **2. Verificar a Instalação**

1. No mesmo SQL Editor, cole o conteúdo do arquivo `verificar-instalacao-inscricao-projeto.sql`
2. Clique em **"Run"** para verificar
3. Confirme que todas as mensagens são positivas

### **3. Estrutura Criada**

#### **📊 Tabela Principal**
```sql
inscricao_projeto
├── id (UUID, Primary Key)
├── project_id (UUID, FK para projetos)
├── cooperado_id (UUID, FK para cooperado)
├── status (VARCHAR, pendente/aprovado/rejeitado)
├── data_inscricao (TIMESTAMP)
├── data_aprovacao (TIMESTAMP)
├── aprovado_por (UUID, FK para crm_user)
├── observacoes (TEXT)
├── motivo_rejeicao (TEXT)
├── prioridade (INTEGER, 1-10)
├── documentos_anexados (TEXT[])
├── valor_interesse (DECIMAL)
├── forma_pagamento (VARCHAR)
├── prazo_interesse (DATE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

#### **🔍 Índices Criados**
- `idx_inscricao_projeto_cooperado_id` - Busca por cooperado
- `idx_inscricao_projeto_project_id` - Busca por projeto
- `idx_inscricao_projeto_status` - Busca por status
- `idx_inscricao_projeto_unique_cooperado_project` - Índice único
- `idx_inscricao_projeto_data_inscricao` - Busca por data

#### **🔒 Políticas de Segurança (RLS)**
- Cooperados veem apenas suas inscrições
- Cooperados criam apenas suas inscrições
- Administradores veem todas as inscrições
- Controle automático de permissões

#### **⚙️ Funções Úteis**
- `get_inscricoes_cooperado(uuid)` - Inscrições de um cooperado
- `get_inscricoes_pendentes()` - Inscrições pendentes
- `update_inscricao_projeto_updated_at()` - Atualiza timestamp

#### **📈 Views para Relatórios**
- `inscricao_projeto_stats` - Estatísticas gerais
- `inscricao_projeto_completa` - Dados completos

## ✅ Verificação da Instalação

### **Mensagens Esperadas**
```
=== RESUMO DA VERIFICAÇÃO ===
Tabela inscricao_projeto existe: true
Número de índices criados: 5
Número de políticas RLS: 4
Número de funções criadas: 3
Número de views criadas: 2
✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!
O sistema de inscrições em projetos está pronto para uso.
```

### **Se Houver Problemas**
- Verifique se a tabela `projetos` existe (não `projeto`)
- Confirme que tem permissões de administrador no Supabase
- Verifique os logs de erro no SQL Editor

## 🔧 Configuração do Frontend

### **1. Entidades Atualizadas**
As seguintes entidades foram adicionadas/atualizadas:

```javascript
// src/api/supabaseEntities.js
export const InscricaoProjeto = new SupabaseEntity('inscricao_projeto')

// src/api/entities-hybrid.js
export const InscricaoProjeto = USE_SUPABASE ? supabaseEntities.InscricaoProjeto : base44.entities.InscricaoProjeto
```

### **2. Serviço Configurado**
O serviço `InscricaoProjetoService` já está configurado para usar a entidade correta.

## 🧪 Teste do Sistema

### **1. Teste como Cooperado**
1. Faça login como cooperado
2. Vá para "Projetos da Cooperativa"
3. Clique em "Minhas Inscrições"
4. Tente criar uma inscrição em um projeto

### **2. Teste como Administrador**
1. Faça login como administrador
2. Vá para "Projetos" > "Inscrições"
3. Verifique se as inscrições aparecem
4. Teste aprovar/rejeitar inscrições

### **3. Verificar Permissões**
- Cooperado deve ver apenas suas inscrições
- Administrador deve ver todas as inscrições
- Validação de inscrição única por projeto

## 📊 Dados de Exemplo (Opcional)

Para testar o sistema, você pode descomentar e executar o bloco de dados de exemplo no script principal:

```sql
-- Descomente este bloco no arquivo supabase-create-inscricao-projeto.sql
INSERT INTO inscricao_projeto (
    project_id, 
    cooperado_id, 
    status, 
    valor_interesse, 
    forma_pagamento, 
    observacoes
) VALUES 
(
    (SELECT id FROM projetos LIMIT 1),
    (SELECT id FROM cooperado LIMIT 1),
    'pendente',
    5000000.00,
    'financiamento',
    'Interessado em financiamento bancário'
);
```

## 🚨 Troubleshooting

### **Erro: "relation 'projeto' does not exist"**
- **Solução**: A tabela se chama `projetos` (plural), não `projeto` (singular)
- **Verificação**: Execute `SELECT * FROM projetos LIMIT 1;` no SQL Editor

### **Erro: "relation 'cooperado' does not exist"**
- **Solução**: A tabela se chama `cooperados` (plural), não `cooperado` (singular)
- **Verificação**: Execute `SELECT * FROM cooperados LIMIT 1;` no SQL Editor

### **Erro: "permission denied"**
- **Solução**: Verifique se está logado como administrador no Supabase
- **Verificação**: Confirme as políticas RLS foram criadas

### **Erro: "duplicate key value violates unique constraint"**
- **Solução**: O sistema está funcionando! Não permite inscrições duplicadas
- **Verificação**: Tente se inscrever em um projeto diferente

### **Erro: "foreign key constraint fails"**
- **Solução**: Verifique se os IDs de projeto e cooperado existem
- **Verificação**: Execute `SELECT id FROM projetos;` e `SELECT id FROM cooperados;`

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** no Supabase Dashboard > Logs
2. **Execute o script de verificação** novamente
3. **Confirme a estrutura** das tabelas existentes
4. **Teste as permissões** de usuário

## ✅ Checklist Final

- [ ] Script principal executado com sucesso
- [ ] Script de verificação mostra "INSTALAÇÃO CONCLUÍDA"
- [ ] Tabela `inscricao_projeto` criada
- [ ] Índices criados (5 total)
- [ ] Políticas RLS criadas (4 total)
- [ ] Funções criadas (3 total)
- [ ] Views criadas (2 total)
- [ ] Frontend atualizado com nova entidade
- [ ] Teste como cooperado funcionando
- [ ] Teste como administrador funcionando
- [ ] Validações de inscrição única funcionando

---

**🎉 Parabéns! O sistema de inscrições em projetos está pronto para uso!**
