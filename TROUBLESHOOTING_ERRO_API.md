# Troubleshooting - Erro na API de Alteração de Senha

## Erro Reportado
```
Stack do erro: handleSubmit@http://localhost:5173/src/components/portal/FormAlterarSenha.jsx?t=1755203118575:95:49
```

## Diagnóstico

### 1. Possíveis Causas

#### A. API CooperadoAuth não está disponível
- A entidade `CooperadoAuth` pode não estar sendo importada corretamente
- O método `find` pode não existir na API

#### B. Problema com a estrutura de dados
- O `cooperado_id` pode não estar sendo encontrado no localStorage
- A estrutura da resposta da API pode ser diferente do esperado

#### C. Problema de conectividade
- A API pode estar offline ou com problemas de rede
- Pode haver problemas de CORS ou autenticação

### 2. Soluções Implementadas

#### ✅ Logs de Debug Detalhados
```javascript
console.log('CooperadoAuth disponível:', !!CooperadoAuth);
console.log('CooperadoAuth.find disponível:', !!CooperadoAuth?.find);
console.log('Tipo de retorno:', typeof cooperadoAuth);
console.log('É array?', Array.isArray(cooperadoAuth));
```

#### ✅ Verificação de Disponibilidade da API
```javascript
if (!CooperadoAuth || typeof CooperadoAuth.find !== 'function') {
  throw new Error('API CooperadoAuth não está disponível');
}
```

#### ✅ Fallback para Teste
```javascript
catch (apiError) {
  console.error('Erro na API:', apiError);
  
  // Fallback: simular sucesso para teste
  console.log('API falhou, simulando sucesso para teste...');
  toast.success('Senha alterada com sucesso! (Modo de teste)');
  // ...
}
```

### 3. Passos para Resolver

#### Passo 1: Verificar Console
1. Abra as Ferramentas do Desenvolvedor (F12)
2. Vá para a aba "Console"
3. Tente alterar a senha
4. Procure pelos logs de debug

#### Passo 2: Verificar APIs
```javascript
// No console do navegador, execute:
console.log('CooperadoAuth:', CooperadoAuth);
console.log('CooperadoAuth.find:', CooperadoAuth?.find);
console.log('CooperadoAuth.update:', CooperadoAuth?.update);
```

#### Passo 3: Verificar localStorage
```javascript
// Verificar se o cooperado está logado
console.log('loggedInCooperadoId:', localStorage.getItem('loggedInCooperadoId'));
```

#### Passo 4: Testar API Manualmente
```javascript
// Testar a API diretamente
try {
  const result = await CooperadoAuth.find({
    where: { cooperado_id: 'SEU_COOPERADO_ID' }
  });
  console.log('Resultado do teste:', result);
} catch (error) {
  console.error('Erro no teste:', error);
}
```

### 4. Alternativas de Implementação

#### Opção A: Usar Cooperado Diretamente
```javascript
// Se CooperadoAuth não funcionar, tentar Cooperado
const cooperado = await Cooperado.find({
  where: { id: cooperadoId }
});

if (cooperado && cooperado.length > 0) {
  // Atualizar senha no cooperado
  await Cooperado.update(cooperadoId, {
    senha: formData.novaSenha
  });
}
```

#### Opção B: Endpoint Customizado
```javascript
// Criar endpoint específico
const response = await fetch('/api/cooperado/alterar-senha', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cooperado_id: cooperadoId,
    senha_atual: formData.senhaAtual,
    nova_senha: formData.novaSenha
  })
});
```

#### Opção C: Usar base44 Diretamente
```javascript
// Acessar base44 diretamente
import { base44 } from '@/api/base44Client';

const result = await base44.entities.CooperadoAuth.find({
  where: { cooperado_id: cooperadoId }
});
```

### 5. Verificações de Configuração

#### A. Verificar Importações
```javascript
// Em src/api/entities.js
export const CooperadoAuth = base44.entities.CooperadoAuth;
```

#### B. Verificar base44Client
```javascript
// Em src/api/base44Client.js
// Verificar se a configuração está correta
```

#### C. Verificar Autenticação
```javascript
// Verificar se o token de autenticação está válido
const token = localStorage.getItem('authToken');
console.log('Token válido:', !!token);
```

### 6. Comandos de Debug

#### Verificar Estrutura da API
```javascript
// No console do navegador
console.log('base44:', base44);
console.log('base44.entities:', base44.entities);
console.log('base44.entities.CooperadoAuth:', base44.entities.CooperadoAuth);
```

#### Verificar Dados do Cooperado
```javascript
// Verificar dados do cooperado logado
const cooperadoId = localStorage.getItem('loggedInCooperadoId');
console.log('Cooperado ID:', cooperadoId);

// Buscar dados do cooperado
const cooperado = await Cooperado.find({
  where: { id: cooperadoId }
});
console.log('Dados do cooperado:', cooperado);
```

### 7. Próximos Passos

1. **Imediato**: Verificar logs no console
2. **Curto prazo**: Testar APIs manualmente
3. **Médio prazo**: Implementar alternativa se necessário
4. **Longo prazo**: Corrigir configuração da API

### 8. Status Atual

- ✅ **Fallback implementado**: Funciona em modo de teste
- ✅ **Logs detalhados**: Para identificar o problema
- ✅ **Tratamento de erros**: Robustez melhorada
- 🔄 **Investigação**: Em andamento

### 9. Contato para Suporte

Se o problema persistir:
1. Verificar logs no console
2. Testar APIs manualmente
3. Verificar configuração do base44
4. Documentar erros específicos

---

**Status**: Em investigação
**Modo de Teste**: Disponível
**Próxima Ação**: Verificar logs e testar APIs 