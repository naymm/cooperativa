# Exemplos de Login com Usuários Existentes

Baseado na sua tabela `CrmUser`, aqui estão os dados de login para os usuários existentes:

## Usuários Administrativos Disponíveis

### 1. Ana Silva (Super Admin)
- **Nome de Usuário**: `ana.silva`
- **Senha**: `ana.silva`
- **Role**: `super_admin`
- **Status**: Ativo

### 2. Bruno Costa (Admin)
- **Nome de Usuário**: `bruno.costa`
- **Senha**: `bruno.costa`
- **Role**: `admin`
- **Status**: Ativo

### 3. Carla Dias (Manager)
- **Nome de Usuário**: `carla.dias`
- **Senha**: `carla.dias`
- **Role**: `manager`
- **Status**: Ativo

## Como Fazer Login

1. Acesse `/AdminLogin`
2. Use qualquer um dos emails e senhas acima
3. Clique em "Acessar Sistema"

## Teste de Login

### Exemplo com Ana Silva:
```
Nome de Usuário: ana.silva
Senha: ana.silva
```

### Exemplo com Bruno Costa:
```
Nome de Usuário: bruno.costa
Senha: bruno.costa
```

### Exemplo com Carla Dias:
```
Nome de Usuário: carla.dias
Senha: carla.dias
```

## Debug

Se o login não funcionar, abra o console do navegador (F12) e verifique:

1. Se aparece a mensagem "Tentando fazer login com: [username]"
2. Se aparece "Resultado da busca: [objeto do usuário]"
3. Se há algum erro específico

## Possíveis Problemas

1. **Nome de usuário não encontrado**: Verifique se o username está escrito exatamente como na tabela
2. **Senha incorreta**: Verifique se a senha está correta
3. **Usuário inativo**: Verifique se o campo `active` está como `true`
4. **Permissão insuficiente**: Apenas `admin`, `manager` e `super_admin` podem acessar

## Nota sobre Segurança

⚠️ **Importante**: Os usuários na sua tabela têm senhas em texto plano (igual ao username). Para produção, recomenda-se:

1. Criptografar as senhas usando bcrypt
2. Implementar validação de força da senha
3. Adicionar autenticação de dois fatores
4. Implementar logs de auditoria
