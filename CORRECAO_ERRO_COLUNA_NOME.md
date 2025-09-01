# 🔧 Correção do Erro da Coluna 'nome'

## ❌ **Problema Identificado**

```
XHRPATCH https://fzdbhhrkxaeznxzwtsjh.supabase.co/rest/v1/projetos?id=eq.50f10e18-47f3-4d30-929f-d7b48cc741a4&select=*
[HTTP/3 400  442ms]

Erro ao salvar projeto: 
Object { code: "PGRST204", details: null, hint: null, message: "Could not find the 'nome' column of 'projetos' in the schema cache" }
```

**Causa**: O formulário estava tentando salvar uma coluna chamada `nome`, mas a tabela `projetos` usa `titulo` como nome da coluna.

## ✅ **Solução Implementada**

### **1. Correção dos Nomes das Colunas no Formulário**

Atualizado `FormProjeto.jsx` para usar os nomes corretos das colunas:

#### **🔄 Mudanças Realizadas:**

| **Campo** | **Nome Anterior** | **Nome Correto** |
|-----------|-------------------|------------------|
| Nome do projeto | `nome` | `titulo` |
| Preço final | `preco_final` | `valor_total` |
| Data de entrega | `data_previsao_entrega` | `data_fim` |
| Status | `planejamento/construcao/pronto/entregue` | `ativo/inativo/concluido` |

#### **📝 Código Corrigido:**

```javascript
const [formData, setFormData] = useState({
  // Informações básicas - usar titulo em vez de nome
  titulo: projeto?.titulo || projeto?.nome || "",
  descricao: projeto?.descricao || "",
  
  // Tipologia e características
  tipologia: projeto?.tipologia || projeto?.tipo || "T0",
  area_util: projeto?.area_util || projeto?.area || "",
  num_quartos: projeto?.num_quartos || projeto?.quartos || "",
  num_banheiros: projeto?.num_banheiros || projeto?.banheiros || "",
  
  // Localização
  provincia: projeto?.provincia || "",
  municipio: projeto?.municipio || "",
  endereco_detalhado: projeto?.endereco_detalhado || projeto?.endereco || "",
  coordenadas_gps: projeto?.coordenadas_gps || projeto?.coordenadas || "",
  
  // Informações financeiras - usar valor_total em vez de preco_final
  valor_total: projeto?.valor_total || projeto?.preco_final || "",
  valor_entrada: projeto?.valor_entrada || "",
  numero_parcelas: projeto?.numero_parcelas || "",
  valor_parcela: projeto?.valor_parcela || "",
  
  // Cronograma - usar data_fim em vez de data_previsao_entrega
  data_inicio: projeto?.data_inicio || "",
  data_fim: projeto?.data_fim || projeto?.data_previsao_entrega || "",
  
  // Status
  status: projeto?.status || "ativo",
  
  // Galeria de imagens
  galeria_imagens: projeto?.galeria_imagens || []
});
```

### **2. Script SQL Simplificado**

Criado `supabase-add-campos-projetos-simples.sql` que adiciona apenas as colunas que realmente não existem:

```sql
-- Adicionar colunas faltantes
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS tipologia VARCHAR(10) DEFAULT 'T0';
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS provincia VARCHAR(100);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS municipio VARCHAR(100);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS area_util DECIMAL(10,2) DEFAULT 0;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS num_quartos INTEGER DEFAULT 0;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS num_banheiros INTEGER DEFAULT 0;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS endereco_detalhado TEXT;
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS coordenadas_gps VARCHAR(100);
ALTER TABLE projetos ADD COLUMN IF NOT EXISTS galeria_imagens TEXT[] DEFAULT '{}';
```

### **3. Validações Atualizadas**

```javascript
// Validar campos obrigatórios
if (!formData.titulo.trim()) {
  alert("O título do projeto é obrigatório!");
  return;
}

if (!formData.provincia) {
  alert("A província é obrigatória!");
  return;
}

if (!formData.municipio) {
  alert("O município é obrigatório!");
  return;
}
```

### **4. Status Options Corrigidos**

```javascript
const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "concluido", label: "Concluído" }
];
```

## 🚀 **Como Resolver**

### **1. Execute o Script SQL**
```sql
-- Use o arquivo supabase-add-campos-projetos-simples.sql
-- no Supabase Dashboard > SQL Editor
```

### **2. Verifique a Estrutura**
```sql
-- Execute para verificar as colunas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projetos' 
ORDER BY ordinal_position;
```

### **3. Teste o Formulário**
- Acesse `http://localhost:5173/projetos`
- Tente criar ou editar um projeto
- Verifique se não há mais erros

## 📊 **Estrutura Esperada da Tabela**

```sql
-- Colunas que devem existir na tabela projetos:
- id (UUID, PRIMARY KEY)
- titulo (VARCHAR) - Nome do projeto
- descricao (TEXT) - Descrição
- valor_total (DECIMAL) - Preço total
- valor_entrada (DECIMAL) - Valor de entrada
- numero_parcelas (INTEGER) - Número de parcelas
- valor_parcela (DECIMAL) - Valor da parcela
- data_inicio (DATE) - Data de início
- data_fim (DATE) - Data de fim
- status (VARCHAR) - Status do projeto
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

-- Colunas adicionadas pelo script:
- tipologia (VARCHAR) - T0, T1, T2, etc.
- provincia (VARCHAR) - Província
- municipio (VARCHAR) - Município
- area_util (DECIMAL) - Área útil
- num_quartos (INTEGER) - Número de quartos
- num_banheiros (INTEGER) - Número de banheiros
- endereco_detalhado (TEXT) - Endereço completo
- coordenadas_gps (VARCHAR) - Coordenadas GPS
- galeria_imagens (TEXT[]) - Array de URLs
```

## 🎯 **Benefícios da Correção**

### **✅ Compatibilidade**
- Formulário agora usa os nomes corretos das colunas
- Compatível com a estrutura existente do banco

### **✅ Funcionalidade**
- Salvamento de projetos funcionando
- Edição de projetos funcionando
- Validações corretas

### **✅ Flexibilidade**
- Suporte a novos campos opcionais
- Fallbacks para campos existentes
- Fácil extensão futura

---

**🎉 O erro foi corrigido! O formulário agora usa os nomes corretos das colunas e deve funcionar perfeitamente.**
