# 🔧 Solução Definitiva - Erro RLS Inscrição de Projetos

## ❌ **Problema Persistente**

```
❌ Erro ao criar inscrição: 
Object { 
  code: "42501", 
  details: null, 
  hint: null, 
  message: 'new row violates row-level security policy for table "inscricao_projeto"' 
}
```

## ✅ **Soluções Implementadas**

### **1. Scripts SQL Criados**

#### **🔧 Script Ultra Simples**
- **Arquivo**: `supabase-disable-rls-inscricao-projeto.sql`
- **Ação**: Desabilita RLS completamente
- **Uso**: Execute primeiro para resolver rapidamente

#### **🔧 Script Definitivo**
- **Arquivo**: `supabase-fix-rls-inscricao-projeto-definitivo.sql`
- **Ação**: Remove todas as políticas e cria uma permissiva
- **Uso**: Para solução completa

#### **🔧 Script Completo**
- **Arquivo**: `supabase-fix-rls-inscricao-projeto.sql`
- **Ação**: Cria políticas RLS específicas
- **Uso**: Para produção com segurança

### **2. Serviço Atualizado**

#### **📄 InscricaoProjetoService.js**
- ✅ **Método principal**: `criarInscricao()`
- ✅ **Método alternativo**: `criarInscricaoAlternativo()`
- ✅ **Fallback automático**: Se o principal falhar, usa o alternativo

#### **📄 InscricaoRapidaModal.jsx**
- ✅ **Tratamento de erro**: Tenta método alternativo automaticamente
- ✅ **Logs detalhados**: Para debugging

## 🚀 **Como Resolver AGORA**

### **Passo 1: Execute o Script Ultra Simples**

```sql
-- Cole no Supabase Dashboard > SQL Editor
-- Arquivo: supabase-disable-rls-inscricao-projeto.sql

ALTER TABLE inscricao_projeto DISABLE ROW LEVEL SECURITY;
```

### **Passo 2: Teste a Inscrição**

1. Acesse `http://localhost:5173/portalprojetoscooperativa`
2. Clique em "Inscrever-se" em um projeto
3. Preencha o formulário
4. Clique em "Confirmar Inscrição"

### **Passo 3: Verifique os Logs**

Abra o console do navegador (F12) e verifique:
```
🔄 Criando inscrição...
✅ Inscrição criada: { ... }
```

## 🔍 **Diagnóstico Completo**

### **Possíveis Causas do Erro:**

1. **RLS Habilitado sem Políticas**: A tabela tem RLS ativo mas não há políticas que permitam inserção
2. **Políticas Muito Restritivas**: As políticas existentes não permitem que o usuário atual crie inscrições
3. **Problema de Autenticação**: O usuário não está sendo reconhecido corretamente
4. **Estrutura de Dados**: O `cooperado_id` não está sendo passado corretamente
5. **Problema de Permissões**: O usuário não tem permissão para inserir na tabela

### **Verificações Realizadas:**

```sql
-- Verificar se a tabela existe
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inscricao_projeto');

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inscricao_projeto';

-- Verificar se RLS está habilitado
SELECT rowsecurity FROM pg_tables WHERE tablename = 'inscricao_projeto';

-- Verificar políticas existentes
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'inscricao_projeto';
```

## 📊 **Estrutura da Tabela**

```sql
-- Estrutura esperada da tabela inscricao_projeto
CREATE TABLE inscricao_projeto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projetos(id),
    cooperado_id TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    data_inscricao TIMESTAMP DEFAULT NOW(),
    valor_interesse DECIMAL(15,2),
    forma_pagamento VARCHAR(100),
    prazo_interesse INTEGER,
    observacoes TEXT,
    documentos_anexados TEXT[] DEFAULT '{}',
    prioridade INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 **Fluxo de Inscrição Atualizado**

### **1. Frontend (InscricaoRapidaModal.jsx)**
```javascript
// Obter cooperado_id do localStorage
const cooperadoId = getCooperadoId();

// Criar dados da inscrição
const dadosInscricao = {
  project_id: projeto.id,
  cooperado_id: cooperadoId,
  valor_interesse: parseFloat(formData.valor_interesse),
  forma_pagamento: formData.forma_pagamento,
  prazo_interesse: formData.prazo_interesse,
  observacoes: formData.observacoes
};

// Tentar método principal, se falhar usa alternativo
try {
  await inscricaoProjetoService.criarInscricao(dadosInscricao);
} catch (error) {
  console.log("🔄 Tentando método alternativo...");
  await inscricaoProjetoService.criarInscricaoAlternativo(dadosInscricao);
}
```

### **2. Backend (InscricaoProjetoService.js)**
```javascript
// Método principal
async criarInscricao(dadosInscricao) {
  // Usa InscricaoProjeto.create()
}

// Método alternativo
async criarInscricaoAlternativo(dadosInscricao) {
  // Usa supabase.from('inscricao_projeto').insert()
}
```

### **3. Banco de Dados (Supabase)**
```sql
-- Inserir na tabela inscricao_projeto (RLS desabilitado)
INSERT INTO inscricao_projeto (
  project_id, cooperado_id, status, data_inscricao,
  valor_interesse, forma_pagamento, prazo_interesse,
  observacoes, documentos_anexados, prioridade
) VALUES (...);
```

## ⚠️ **Considerações de Segurança**

### **Solução Temporária (RLS Desabilitado)**
- ✅ **Prós**: Funciona imediatamente
- ❌ **Contras**: Menos seguro, permite acesso amplo
- 🎯 **Uso**: Para desenvolvimento e teste

### **Solução Permanente (Políticas RLS)**
- ✅ **Prós**: Mais seguro, controle granular
- ❌ **Contras**: Requer configuração adequada
- 🎯 **Uso**: Para produção

### **Recomendação**
1. **Use a solução temporária** para testar
2. **Configure políticas adequadas** depois
3. **Teste em ambiente de desenvolvimento** primeiro

## 🎉 **Resultado Esperado**

Após executar o script:

- ✅ Cooperados conseguem se inscrever em projetos
- ✅ Inscrições são salvas no banco de dados
- ✅ Sistema de inscrição funciona completamente
- ✅ Modal de inscrição fecha após sucesso
- ✅ Mensagens de sucesso são exibidas
- ✅ Logs detalhados para debugging

## 🔧 **Troubleshooting**

### **Se ainda houver erro:**

1. **Verifique se o script foi executado**:
   ```sql
   SELECT rowsecurity FROM pg_tables WHERE tablename = 'inscricao_projeto';
   -- Deve retornar 'f' (false)
   ```

2. **Verifique se há políticas**:
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'inscricao_projeto';
   -- Deve retornar vazio
   ```

3. **Teste inserção direta**:
   ```sql
   INSERT INTO inscricao_projeto (project_id, cooperado_id, status) 
   VALUES ('teste-id', 'teste-cooperado', 'pendente');
   ```

4. **Verifique autenticação**:
   ```sql
   SELECT auth.uid(), auth.role();
   ```

---

**🎯 Execute o script SQL ultra simples e teste a funcionalidade de inscrição!**
