# Validação de Meses Antecipados - FormPagamentoAntecipado

## ✅ Funcionalidade Implementada

Implementada validação para garantir que o usuário não possa selecionar um mês futuro sem ter selecionado os meses anteriores no formulário de pagamento antecipado.

## 🎯 Regra de Negócio

### **Regra Principal:**
- **Sequência Obrigatória**: Para selecionar um mês, o usuário deve primeiro selecionar todos os meses anteriores
- **Desmarcação em Cascata**: Ao desmarcar um mês, todos os meses posteriores são automaticamente desmarcados

### **Exemplo Prático:**
```
Meses disponíveis: Janeiro, Fevereiro, Março, Abril, Maio

✅ Seleção válida:
- Janeiro ✓
- Janeiro + Fevereiro ✓
- Janeiro + Fevereiro + Março ✓

❌ Seleção inválida:
- Fevereiro (sem Janeiro) ✗
- Janeiro + Março (sem Fevereiro) ✗
- Março + Abril (sem Janeiro e Fevereiro) ✗
```

## 🔧 Implementação Técnica

### **1. Função de Validação**
```javascript
const isMesSelecionavel = (mes) => {
  const mesesSelecionados = formData.meses_antecipados.map(m => m.mesReferencia).sort();
  const mesIndex = mesesDisponiveis.findIndex(m => m.mesReferencia === mes.mesReferencia);
  
  // Se é o primeiro mês disponível, sempre pode ser selecionado
  if (mesIndex === 0) return true;
  
  // Verificar se o mês anterior está selecionado
  const mesAnterior = mesesDisponiveis[mesIndex - 1];
  return mesesSelecionados.includes(mesAnterior.mesReferencia);
};
```

### **2. Lógica de Seleção**
```javascript
const handleMesToggle = (mes, checked) => {
  setFormData(prev => {
    let novosMeses = [...prev.meses_antecipados];
    
    if (checked) {
      // Verificar se está tentando selecionar um mês futuro sem ter os meses anteriores
      const mesesSelecionados = novosMeses.map(m => m.mesReferencia).sort();
      const mesAtual = mes.mesReferencia;
      
      // Encontrar o mês anterior ao que está sendo selecionado
      const mesAnterior = mesesDisponiveis.find(m => {
        const mesAtualIndex = mesesDisponiveis.findIndex(disponivel => disponivel.mesReferencia === mesAtual);
        const disponivelIndex = mesesDisponiveis.findIndex(disponivel => disponivel.mesReferencia === m.mesReferencia);
        return disponivelIndex === mesAtualIndex - 1;
      });
      
      // Se existe um mês anterior e ele não está selecionado, não permitir seleção
      if (mesAnterior && !mesesSelecionados.includes(mesAnterior.mesReferencia)) {
        console.log(`[FormPagamentoAntecipado] Não é possível selecionar ${mes.descricao} sem selecionar ${mesAnterior.descricao} primeiro`);
        return prev; // Retorna o estado anterior sem alterações
      }
      
      // Adicionar o mês se a validação passar
      novosMeses.push(mes);
    } else {
      // Ao desmarcar um mês, remover também todos os meses posteriores
      const mesIndex = mesesDisponiveis.findIndex(m => m.mesReferencia === mes.mesReferencia);
      novosMeses = novosMeses.filter(m => {
        const mIndex = mesesDisponiveis.findIndex(disponivel => disponivel.mesReferencia === m.mesReferencia);
        return mIndex < mesIndex; // Manter apenas meses anteriores
      });
    }
    
    const valorTotal = novosMeses.reduce((sum, m) => sum + m.valor, 0);
    
    return {
      ...prev,
      meses_antecipados: novosMeses.sort((a, b) => a.mesReferencia.localeCompare(b.mesReferencia)),
      valor_total_mensalidades: valorTotal
    };
  });
};
```

## 🎨 Interface Visual

### **Estados Visuais:**

#### **1. Mês Disponível para Seleção:**
- Background: Branco
- Border: Cinza
- Checkbox: Habilitado
- Cursor: Pointer
- Hover: Background cinza claro

#### **2. Mês Selecionado:**
- Background: Verde claro
- Border: Verde
- Checkbox: Marcado
- Cursor: Pointer

#### **3. Mês Bloqueado (não pode ser selecionado):**
- Background: Cinza claro
- Border: Cinza
- Checkbox: Desabilitado
- Cursor: Not-allowed
- Opacity: 60%
- Mensagem: "⚠️ Selecione os meses anteriores primeiro"

### **Mensagem Informativa:**
```javascript
<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
  <div className="flex items-start space-x-2">
    <div className="text-blue-600 mt-0.5">ℹ️</div>
    <div className="text-sm text-blue-800">
      <p className="font-medium mb-1">Regra de Seleção de Meses:</p>
      <p>Para selecionar um mês, você deve primeiro selecionar todos os meses anteriores. 
      Ao desmarcar um mês, todos os meses posteriores serão automaticamente desmarcados.</p>
    </div>
  </div>
</div>
```

## 📋 Fluxo de Interação

### **1. Seleção de Meses:**
1. Usuário vê lista de meses disponíveis
2. Primeiro mês sempre está disponível
3. Meses subsequentes ficam bloqueados até que o anterior seja selecionado
4. Ao selecionar um mês, o próximo fica disponível automaticamente

### **2. Desmarcação de Meses:**
1. Usuário desmarca um mês
2. Sistema automaticamente desmarca todos os meses posteriores
3. Total é recalculado
4. Meses posteriores voltam ao estado bloqueado

### **3. Feedback Visual:**
1. Meses bloqueados ficam com visual diferente
2. Mensagem explicativa aparece nos meses bloqueados
3. Tooltip informativo no topo da seção
4. Logs no console para debug

## 🔍 Logs de Debug

### **Console Logs:**
```javascript
// Quando tentativa de seleção inválida
[FormPagamentoAntecipado] Não é possível selecionar Março 2024 sem selecionar Fevereiro 2024 primeiro

// Logs de estado
console.log('Meses selecionados:', formData.meses_antecipados);
console.log('Mês pode ser selecionado:', isMesSelecionavel(mes));
```

## ✅ Benefícios

### **Para o Usuário:**
- ✅ **Clareza**: Entende exatamente quais meses pode selecionar
- ✅ **Prevenção de Erros**: Não consegue fazer seleções inválidas
- ✅ **Feedback Visual**: Vê imediatamente o que está disponível
- ✅ **Facilidade**: Interface intuitiva e auto-explicativa

### **Para o Sistema:**
- ✅ **Integridade**: Garante que pagamentos sejam feitos em sequência
- ✅ **Consistência**: Evita pagamentos pulados
- ✅ **Auditoria**: Facilita rastreamento de pagamentos
- ✅ **Manutenção**: Código mais robusto e previsível

## 🚀 Como Testar

### **Cenário 1: Seleção Sequencial**
1. Abrir formulário de pagamento antecipado
2. Verificar que apenas o primeiro mês está disponível
3. Selecionar o primeiro mês
4. Verificar que o segundo mês ficou disponível
5. Continuar sequencialmente

### **Cenário 2: Tentativa de Seleção Inválida**
1. Tentar selecionar um mês futuro sem selecionar os anteriores
2. Verificar que a seleção não acontece
3. Verificar mensagem de aviso
4. Verificar log no console

### **Cenário 3: Desmarcação em Cascata**
1. Selecionar 3 meses em sequência
2. Desmarcar o segundo mês
3. Verificar que o terceiro mês foi automaticamente desmarcado
4. Verificar que o total foi recalculado

## ✅ Status

- ✅ **Validação de sequência**: Implementada
- ✅ **Interface visual**: Implementada
- ✅ **Desmarcação em cascata**: Implementada
- ✅ **Mensagens informativas**: Implementadas
- ✅ **Logs de debug**: Implementados
- ✅ **Documentação**: Criada

---

**Resultado**: Sistema agora garante que pagamentos antecipados sejam feitos em sequência correta! 📅✅ 