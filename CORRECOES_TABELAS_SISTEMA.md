# 🔧 Correções de Nomes de Tabelas - Sistema de Inscrições

## 📋 Resumo das Correções

Corrigimos os nomes das tabelas nos scripts SQL para corresponder aos nomes reais no seu banco de dados Supabase:

### **Antes (Incorreto)**
- ❌ `projeto` (singular)
- ❌ `cooperado` (singular)

### **Depois (Correto)**
- ✅ `projetos` (plural)
- ✅ `cooperados` (plural)

## 🔄 Arquivos Corrigidos

### **1. Script Principal** (`supabase-create-inscricao-projeto.sql`)

#### **Referências de Chave Estrangeira**
```sql
-- ANTES
project_id UUID NOT NULL REFERENCES projeto(id) ON DELETE CASCADE,
cooperado_id UUID NOT NULL REFERENCES cooperado(id) ON DELETE CASCADE,

-- DEPOIS
project_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
cooperado_id UUID NOT NULL REFERENCES cooperados(id) ON DELETE CASCADE,
```

#### **JOINs nas Funções**
```sql
-- ANTES
FROM inscricao_projeto ip
JOIN cooperado c ON c.id = ip.cooperado_id
JOIN projeto p ON p.id = ip.project_id

-- DEPOIS
FROM inscricao_projeto ip
JOIN cooperados c ON c.id = ip.cooperado_id
JOIN projetos p ON p.id = ip.project_id
```

#### **Dados de Exemplo**
```sql
-- ANTES
(SELECT id FROM projeto LIMIT 1),
(SELECT id FROM cooperado LIMIT 1),

-- DEPOIS
(SELECT id FROM projetos LIMIT 1),
(SELECT id FROM cooperados LIMIT 1),
```

### **2. Script de Verificação** (`verificar-instalacao-inscricao-projeto.sql`)

#### **JOINs e Dados de Teste**
```sql
-- ANTES
JOIN cooperado c ON c.id = ip.cooperado_id
JOIN projeto p ON p.id = ip.project_id
(SELECT id FROM cooperado LIMIT 1)

-- DEPOIS
JOIN cooperados c ON c.id = ip.cooperado_id
JOIN projetos p ON p.id = ip.project_id
(SELECT id FROM cooperados LIMIT 1)
```

### **3. Frontend** (Já estava correto)

#### **Entidades Supabase** (`src/api/supabaseEntities.js`)
```javascript
// ✅ Já estava correto
export const Cooperado = new SupabaseEntity('cooperados')
export const Projeto = new SupabaseEntity('projetos')
```

#### **Entidades Híbridas** (`src/api/entities-hybrid.js`)
```javascript
// ✅ Já estava correto
export const Cooperado = USE_SUPABASE ? supabaseEntities.Cooperado : base44.entities.Cooperado
export const Projeto = USE_SUPABASE ? supabaseEntities.Projeto : base44.entities.Projeto
```

## ✅ Verificação das Correções

### **Comandos para Verificar no Supabase**

```sql
-- Verificar se as tabelas existem com os nomes corretos
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('projetos', 'cooperados', 'inscricao_projeto');

-- Verificar dados nas tabelas
SELECT COUNT(*) FROM projetos;
SELECT COUNT(*) FROM cooperados;

-- Verificar estrutura das tabelas
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'projetos' ORDER BY ordinal_position;

SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'cooperados' ORDER BY ordinal_position;
```

## 🚀 Próximos Passos

1. **Execute o script principal** (`supabase-create-inscricao-projeto.sql`)
2. **Execute o script de verificação** (`verificar-instalacao-inscricao-projeto.sql`)
3. **Confirme que não há erros** de referência de tabela
4. **Teste o sistema** completo

## 🎯 Resultado Esperado

Após as correções, você deve ver:

```
=== RESUMO DA VERIFICAÇÃO ===
Tabela inscricao_projeto existe: true
Número de índices criados: 5
Número de políticas RLS: 4
Número de funções criadas: 3
Número de views criadas: 2
✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!
```

## 📞 Se Houver Problemas

Se ainda houver erros de referência de tabela:

1. **Verifique os nomes exatos** das suas tabelas no Supabase Dashboard
2. **Execute** `\dt` no SQL Editor para listar todas as tabelas
3. **Confirme** que as tabelas `projetos` e `cooperados` existem
4. **Verifique** se há diferenças de maiúsculas/minúsculas

---

**✅ Todas as correções foram aplicadas! O sistema está pronto para usar os nomes corretos das tabelas.**
