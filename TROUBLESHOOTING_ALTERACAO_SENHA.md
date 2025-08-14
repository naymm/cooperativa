# Troubleshooting - Alteração de Senha

## Problema Reportado
"Ao clicar em Alterar senha no formulário não acontece nada"

## Diagnóstico e Soluções

### 1. Verificação Inicial

#### ✅ Teste a Versão Simples
- Use o componente `FormAlterarSenhaSimples` que simula a alteração
- Esta versão não depende de APIs externas
- Se funcionar, o problema está na integração com a API

#### 🔍 Verificar Console do Navegador
1. Abra as Ferramentas do Desenvolvedor (F12)
2. Vá para a aba "Console"
3. Tente alterar a senha
4. Procure por mensagens de erro ou logs

### 2. Possíveis Causas

#### A. Problema com a API
```javascript
// Verificar se a API está disponível
console.log('User API:', !!User);
console.log('User.updatePassword:', !!User?.updatePassword);
console.log('CooperadoAuth:', !!CooperadoAuth);
```

#### B. Problema com Event Handler
```javascript
// Verificar se o formulário está sendo submetido
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('🚀 Formulário submetido!'); // Deve aparecer no console
  // ...
};
```

#### C. Problema com Validação
```javascript
// Verificar se a validação está bloqueando
if (!validateForm()) {
  console.log('❌ Validação falhou');
  return; // Formulário para aqui se validação falhar
}
```

### 3. Soluções Implementadas

#### ✅ Versão de Teste
- Criado `FormAlterarSenhaSimples` para teste
- Simula alteração de senha sem API
- Mostra feedback visual e logs detalhados

#### ✅ Logs de Debug
- Adicionados logs em cada etapa
- Verificação de disponibilidade das APIs
- Tratamento de erros detalhado

#### ✅ Botão de Teste
- Botão "🔍 Teste Debug" no formulário
- Mostra dados do formulário no console
- Confirma se o formulário está funcionando

### 4. Passos para Resolver

#### Passo 1: Testar Versão Simples
1. Use `FormAlterarSenhaSimples` temporariamente
2. Verifique se o botão responde
3. Confirme se os logs aparecem no console

#### Passo 2: Verificar APIs
```javascript
// No console do navegador, execute:
console.log('User:', User);
console.log('CooperadoAuth:', CooperadoAuth);
console.log('base44:', base44);
```

#### Passo 3: Testar APIs Individualmente
```javascript
// Testar se as APIs respondem
try {
  const result = await User.updatePassword({
    currentPassword: 'teste',
    newPassword: 'teste123'
  });
  console.log('API funcionando:', result);
} catch (error) {
  console.error('API com erro:', error);
}
```

### 5. Alternativas de Implementação

#### Opção A: Usar CooperadoAuth
```javascript
// Se User.updatePassword não funcionar
await CooperadoAuth.updatePassword({
  cooperado_id: cooperadoId,
  currentPassword: formData.senhaAtual,
  newPassword: formData.novaSenha
});
```

#### Opção B: Atualização Direta
```javascript
// Atualizar diretamente o cooperado
await CooperadoAuth.update(cooperadoId, {
  senha: formData.novaSenha,
  senha_atual: formData.senhaAtual
});
```

#### Opção C: Endpoint Customizado
```javascript
// Criar endpoint específico para alteração de senha
const response = await fetch('/api/alterar-senha', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cooperado_id: cooperadoId,
    senha_atual: formData.senhaAtual,
    nova_senha: formData.novaSenha
  })
});
```

### 6. Verificações de Segurança

#### ✅ Validações Implementadas
- Senha atual obrigatória
- Nova senha mínimo 6 caracteres
- Confirmação de senha
- Senha diferente da atual

#### ✅ Tratamento de Erros
- Senha atual incorreta
- Sessão expirada
- Erro de rede
- Validações do cliente

### 7. Testes Recomendados

#### Teste 1: Funcionalidade Básica
1. Abrir modal de alteração de senha
2. Preencher todos os campos
3. Clicar em "Alterar Senha"
4. Verificar logs no console

#### Teste 2: Validações
1. Tentar submeter sem preencher campos
2. Usar senha com menos de 6 caracteres
3. Usar senhas diferentes na confirmação
4. Usar nova senha igual à atual

#### Teste 3: API
1. Verificar se APIs estão disponíveis
2. Testar chamadas individuais
3. Verificar respostas de erro
4. Confirmar integração

### 8. Próximos Passos

1. **Imediato**: Usar versão simples para confirmar funcionamento
2. **Curto prazo**: Investigar APIs disponíveis
3. **Médio prazo**: Implementar solução definitiva
4. **Longo prazo**: Adicionar recursos avançados (2FA, histórico, etc.)

### 9. Comandos Úteis

#### Verificar Console
```javascript
// No console do navegador
console.log('Formulário funcionando:', true);
console.log('Dados do formulário:', formData);
console.log('Erros:', errors);
```

#### Testar APIs
```javascript
// Testar disponibilidade
console.log('APIs disponíveis:', {
  User: !!User,
  UserUpdatePassword: !!User?.updatePassword,
  CooperadoAuth: !!CooperadoAuth
});
```

### 10. Contato para Suporte

Se o problema persistir:
1. Verificar logs no console
2. Testar versão simples
3. Documentar erros específicos
4. Verificar configuração da API Base44

---

**Status**: Em investigação
**Versão de Teste**: Disponível
**Próxima Ação**: Testar versão simples e verificar APIs 