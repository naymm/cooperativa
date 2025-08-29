# Sistema de Login Administrativo

## Visão Geral

O sistema agora possui dois tipos de acesso distintos:

1. **Portal do Cooperado** - Para cooperados acessarem suas informações
2. **Sistema Administrativo** - Para administradores gerenciarem a cooperativa

## Funcionalidades Implementadas

### 1. Página de Login Administrativo (`/AdminLogin`)

- Interface similar ao portal do cooperado
- Autenticação via nome de usuário e senha
- Verificação de permissões de administrador
- Opção "Lembrar-me"
- Redirecionamento automático se já logado

### 2. Proteção de Rotas

- Todas as páginas administrativas agora requerem login
- Verificação automática de permissões
- Redirecionamento para login se não autenticado
- Proteção contra acesso não autorizado

### 3. Sistema de Autenticação

- Autenticação via tabela CrmUser
- Verificação de roles (admin, manager, super_admin)
- Sessão persistente com localStorage
- Logout seguro com limpeza de dados

### 4. Redirecionamento Inteligente

- Rota raiz (`/`) redireciona automaticamente baseado no tipo de usuário
- Cooperados logados → Portal do Cooperado
- Administradores logados → Dashboard
- Usuários não logados → Login Administrativo

## Páginas Protegidas

As seguintes páginas agora requerem autenticação administrativa:

- `/Dashboard` - Dashboard principal
- `/Inscricoes` - Gestão de inscrições
- `/Cooperados` - Gestão de cooperados
- `/Projetos` - Gestão de projetos
- `/Pagamentos` - Gestão de pagamentos
- `/Relatorios` - Relatórios
- `/PlanosAssinatura` - Gestão de planos
- `/PerfilUsuario` - Perfil do usuário
- `/NotificacoesCooperados` - Notificações
- `/Comunicacao` - Comunicação
- `/Cobrancas` - Cobranças

## Páginas Públicas

- `/CadastroPublico` - Cadastro público
- `/AdminLogin` - Login administrativo
- `/PortalLogin` - Login do cooperado
- Todas as páginas do portal do cooperado

## Como Usar

### Para Administradores

1. Acesse `/AdminLogin`
2. Digite seu nome de usuário e senha
3. Selecione "Lembrar-me" se desejar
4. Clique em "Acessar Sistema"
5. Será redirecionado para o Dashboard

### Para Cooperados

1. Acesse `/PortalLogin`
2. Digite seu número de associado e senha
3. Será redirecionado para o Portal do Cooperado

### Navegação entre Sistemas

- Na página de login do cooperado, há um link para o sistema administrativo
- No sistema administrativo, o logout redireciona para o login administrativo

## Segurança

- Verificação de permissões em tempo real
- Sessões expiram automaticamente
- Logout limpa todos os dados locais
- Proteção contra acesso não autorizado
- Rate limiting para tentativas de login

## Estrutura de Arquivos

```
src/
├── pages/
│   ├── AdminLogin.jsx          # Página de login administrativo
│   └── ...
├── components/
│   └── auth/
│       ├── ProtectedRoute.jsx  # Proteção de rotas administrativas
│       └── AutoRedirect.jsx    # Redirecionamento automático
└── ...
```

## Configuração

O sistema usa as seguintes chaves no localStorage:

- `loggedInAdminUser` - Dados do usuário administrativo logado
- `rememberAdmin` - Flag para "lembrar-me"
- `loggedInCooperadoId` - ID do cooperado logado (portal)
- `rememberCooperado` - Flag para "lembrar-me" (portal)

## Estrutura da Tabela CrmUser

O sistema espera que a tabela `CrmUser` tenha os seguintes campos:

- `username` - Nome de usuário (usado para login)
- `password_hash` - Hash da senha do usuário
- `full_name` - Nome completo do usuário
- `role` - Papel/função do usuário (admin, manager, super_admin)
- `active` - Status do usuário (boolean: true/false)
- `email` - Email do usuário (opcional)
- `department` - Departamento (opcional)
- `phone` - Telefone (opcional)
- Outros campos opcionais como `id`, `created_at`, etc.

## Permissões

O sistema verifica se o usuário tem uma das seguintes roles:
- `admin`
- `manager` 
- `super_admin`

Usuários sem essas permissões são bloqueados do acesso administrativo.
