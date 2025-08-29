# Como Criar um Usuário Administrador

## Estrutura da Tabela CrmUser

Para que o sistema de login administrativo funcione corretamente, a tabela `CrmUser` deve ter a seguinte estrutura:

```sql
CREATE TABLE CrmUser (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  active BOOLEAN NOT NULL DEFAULT true,
  email TEXT,
  department TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Campos Obrigatórios

- **username**: Nome de usuário (usado para login)
- **password_hash**: Hash da senha (pode ser a senha em texto plano para testes)
- **full_name**: Nome completo do usuário
- **role**: Papel do usuário (admin, manager, super_admin)
- **active**: Status do usuário (true/false)

## Exemplo de Criação de Usuário

### Via Interface do Base44

1. Acesse o painel do Base44
2. Vá para a tabela `CrmUser`
3. Clique em "Adicionar Registro"
4. Preencha os campos:

```json
{
  "username": "admin",
  "password_hash": "senha123",
  "full_name": "Administrador Principal",
  "role": "super_admin",
  "active": true
}
```

### Via API (JavaScript)

```javascript
import { CrmUser } from "@/api/entities";

// Criar um novo usuário administrador
const novoUsuario = await CrmUser.create({
  username: "admin",
  password_hash: "senha123",
  full_name: "Administrador Principal",
  role: "super_admin",
  active: true
});

console.log("Usuário criado:", novoUsuario);
```

## Tipos de Roles

- **admin**: Administrador básico
- **manager**: Gerente
- **super_admin**: Super administrador (acesso total)

## Teste do Login

Após criar o usuário, você pode testar o login:

1. Acesse `/AdminLogin`
2. Digite o nome de usuário: `admin`
3. Digite a senha: `senha123`
4. Clique em "Acessar Sistema"

## Segurança

⚠️ **Importante**: Para produção, recomenda-se:

1. **Criptografar senhas**: Use bcrypt ou similar para hash das senhas
2. **Senhas fortes**: Exija senhas com pelo menos 8 caracteres
3. **Validação**: Implemente validação de email e outros campos
4. **Auditoria**: Mantenha logs de login/logout

## Exemplo com Senha Criptografada

```javascript
// Exemplo usando bcrypt (requer instalação: npm install bcryptjs)
import bcrypt from 'bcryptjs';

const senha = "minhaSenhaSegura123";
const senhaHash = await bcrypt.hash(senha, 10);

const usuario = await CrmUser.create({
  email: "admin@coophabitat.co.ao",
  password_hash: senhaHash,
  nome_completo: "Administrador Principal",
  role: "super_admin",
  status: "ativo"
});
```

E no login, você precisaria verificar a senha:

```javascript
// No AdminLogin.jsx
const senhaCorreta = await bcrypt.compare(formData.password, crmUser.password_hash);
if (!senhaCorreta) {
  setError("Senha incorreta.");
  return;
}
```
