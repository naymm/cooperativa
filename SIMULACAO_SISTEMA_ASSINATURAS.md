# Simulação do Sistema de Assinaturas Mensais

## 🎯 Cenário de Simulação

Vamos simular um cenário real com 10 cooperados e diferentes situações de pagamento para demonstrar como o sistema funciona.

## 📊 Dados Simulados

### Planos de Assinatura
```json
[
  {
    "id": "plano-1",
    "nome_plano": "Plano Básico",
    "valor_mensal": 25000,
    "taxa_inscricao": 50000,
    "dia_vencimento_fixo": 15,
    "ativo": true
  },
  {
    "id": "plano-2", 
    "nome_plano": "Plano Premium",
    "valor_mensal": 50000,
    "taxa_inscricao": 100000,
    "dia_vencimento_fixo": 20,
    "ativo": true
  }
]
```

### Cooperados Simulados
```json
[
  {
    "id": "coop-1",
    "nome_completo": "João Silva",
    "numero_associado": "COOP001",
    "assinatura_plano_id": "plano-1",
    "status": "ativo",
    "data_inscricao": "2024-01-15"
  },
  {
    "id": "coop-2",
    "nome_completo": "Maria Santos",
    "numero_associado": "COOP002", 
    "assinatura_plano_id": "plano-2",
    "status": "ativo",
    "data_inscricao": "2024-02-01"
  },
  {
    "id": "coop-3",
    "nome_completo": "Pedro Costa",
    "numero_associado": "COOP003",
    "assinatura_plano_id": "plano-1", 
    "status": "suspenso",
    "data_inscricao": "2024-01-20"
  },
  {
    "id": "coop-4",
    "nome_completo": "Ana Oliveira",
    "numero_associado": "COOP004",
    "assinatura_plano_id": "plano-2",
    "status": "ativo",
    "data_inscricao": "2024-02-10"
  },
  {
    "id": "coop-5", 
    "nome_completo": "Carlos Ferreira",
    "numero_associado": "COOP005",
    "assinatura_plano_id": "plano-1",
    "status": "ativo",
    "data_inscricao": "2024-01-25"
  }
]
```

## 🔄 Simulação de Funcionamento

### Dia 1: Inicialização do Sistema

**9:00h - Verificação Automática Inicia**

```
🚀 Sistema de Assinaturas Iniciado
📊 Verificando 5 cooperados com planos ativos...

✅ João Silva (COOP001) - Plano Básico
   📅 Próximo vencimento: 15/01/2024
   💰 Valor: 25.000 Kz
   ✅ Status: Em dia

⚠️ Maria Santos (COOP002) - Plano Premium  
   📅 Próximo vencimento: 20/01/2024
   💰 Valor: 50.000 Kz
   ⏰ Status: Pendente (5 dias até vencimento)

❌ Pedro Costa (COOP003) - Plano Básico
   📅 Vencimento: 15/12/2023
   💰 Valor: 25.000 Kz
   🔒 Status: Suspenso (45 dias em atraso)

✅ Ana Oliveira (COOP004) - Plano Premium
   📅 Próximo vencimento: 20/01/2024  
   💰 Valor: 50.000 Kz
   ⏰ Status: Pendente (10 dias até vencimento)

✅ Carlos Ferreira (COOP005) - Plano Básico
   📅 Próximo vencimento: 15/01/2024
   💰 Valor: 25.000 Kz
   ✅ Status: Em dia
```

### Dia 15: Vencimento do Plano Básico

**9:00h - Verificação Automática**

```
📊 Verificação Diária - 15/01/2024

🆕 Criando pagamentos pendentes:

✅ João Silva (COOP001)
   📝 Pagamento criado: MEN-COOP001-2024-01
   💰 Valor: 25.000 Kz
   📅 Vencimento: 15/01/2024
   ⏰ Status: Pendente

❌ Pedro Costa (COOP003) - Já suspenso
   📝 Pagamento criado: MEN-COOP003-2024-01
   💰 Valor: 25.000 Kz
   📅 Vencimento: 15/01/2024
   ⏰ Status: Pendente (acumulado com atrasos anteriores)

✅ Carlos Ferreira (COOP005)
   📝 Pagamento criado: MEN-COOP005-2024-01
   💰 Valor: 25.000 Kz
   📅 Vencimento: 15/01/2024
   ⏰ Status: Pendente
```

### Dia 16: Cooperado Faz Pagamento

**14:30h - João Silva acessa o portal**

```
👤 João Silva (COOP001) - Login no Portal

📊 Dashboard do Cooperado:
   🛡️ Plano Ativo: Plano Básico
   💰 Mensalidade: 25.000 Kz/mês
   ⚠️ Status: Pagamento Pendente
   📅 Vencimento: 15/01/2024 (1 dia atrasado)

🔔 Alertas Exibidos:
   ⚠️ "Sua mensalidade está pendente. Realize o pagamento para manter acesso ao portal."
   ⏰ "Vencimento em 1 dia."

💳 Cooperado clica em "Pagar Mensalidade"
   🔄 Redirecionamento para /PortalPagamentoMensalidade
```

**14:35h - Página de Pagamento**

```
💰 PortalPagamentoMensalidade

📋 Detalhes do Pagamento:
   👤 Cooperado: João Silva
   🛡️ Plano: Plano Básico
   💰 Valor: 25.000 Kz
   📅 Mês: Janeiro 2024
   📅 Vencimento: 15/01/2024
   🔢 Referência: MEN-COOP001-2024-01

💳 Métodos de Pagamento Disponíveis:
   ✅ Multicaixa Express
   ✅ PayPay
   ✅ Referência
   ✅ VISA/Mastercard
   ✅ Unitel Money

💳 Cooperado seleciona: Multicaixa Express
   🔄 Processando pagamento...
   ⏳ Simulação de 2 segundos...
   ✅ Pagamento confirmado!
```

**14:37h - Pagamento Confirmado**

```
✅ Pagamento Realizado com Sucesso!

📊 Atualizações no Sistema:
   💰 Pagamento MEN-COOP001-2024-01: Pendente → Pago
   📅 Data pagamento: 16/01/2024 14:37:00
   💳 Método: Multicaixa Express
   🔄 Redirecionamento para Dashboard

📊 Dashboard Atualizado:
   🛡️ Plano Ativo: Plano Básico
   💰 Mensalidade: 25.000 Kz/mês
   ✅ Status: Em dia
   📅 Próximo vencimento: 15/02/2024
   🎉 "Mensalidade paga com sucesso!"
```

### Dia 20: Vencimento do Plano Premium

**9:00h - Verificação Automática**

```
📊 Verificação Diária - 20/01/2024

🆕 Criando pagamentos pendentes:

✅ Maria Santos (COOP002)
   📝 Pagamento criado: MEN-COOP002-2024-01
   💰 Valor: 50.000 Kz
   📅 Vencimento: 20/01/2024
   ⏰ Status: Pendente

✅ Ana Oliveira (COOP004)
   📝 Pagamento criado: MEN-COOP004-2024-01
   💰 Valor: 50.000 Kz
   📅 Vencimento: 20/01/2024
   ⏰ Status: Pendente

⚠️ Atualizando status de pagamentos em atraso:
   ❌ Pedro Costa (COOP003): Pendente → Atrasado (5 dias)
```

### Dia 25: Cooperado em Atraso Crítico

**9:00h - Verificação Automática**

```
📊 Verificação Diária - 25/01/2024

⚠️ Atualizando status de pagamentos em atraso:

❌ Pedro Costa (COOP003)
   📅 Vencimento: 15/12/2023
   ⏰ Dias em atraso: 40 dias
   🔄 Status: Pendente → Atrasado

📧 Enviando notificação de cobrança:
   📧 Email: "Pedro Costa - Cobrança Crítica"
   📧 Assunto: "Mensalidade em atraso há 40 dias"
   📧 Conteúdo: "Sua mensalidade está em atraso há 40 dias. O acesso pode ser suspenso."
```

### Dia 30: Suspensão Automática

**9:00h - Verificação Automática**

```
📊 Verificação Diária - 30/01/2024

🔒 Verificando cooperados para suspensão:

❌ Pedro Costa (COOP003)
   📅 Vencimento: 15/12/2023
   ⏰ Dias em atraso: 45 dias
   🔒 Critério: 30+ dias em atraso
   🔒 Ação: Suspender acesso
   🔄 Status: Ativo → Suspenso
   📝 Observação: "Acesso suspenso por atraso de 45 dias na mensalidade"

📧 Enviando notificação final:
   📧 Email: "Pedro Costa - Acesso Suspenso"
   📧 Assunto: "Seu acesso foi suspenso por atraso na mensalidade"
   📧 Conteúdo: "Seu acesso foi suspenso. Para reativar, pague as mensalidades em atraso."
```

### Dia 15/02: Próximo Ciclo

**9:00h - Verificação Automática**

```
📊 Verificação Diária - 15/02/2024

🆕 Criando pagamentos pendentes:

✅ João Silva (COOP001)
   📝 Pagamento criado: MEN-COOP001-2024-02
   💰 Valor: 25.000 Kz
   📅 Vencimento: 15/02/2024
   ⏰ Status: Pendente

✅ Carlos Ferreira (COOP005)
   📝 Pagamento criado: MEN-COOP005-2024-02
   💰 Valor: 25.000 Kz
   📅 Vencimento: 15/02/2024
   ⏰ Status: Pendente

⚠️ Pagamentos ainda pendentes:
   ❌ Maria Santos (COOP002): 25 dias em atraso
   ❌ Ana Oliveira (COOP004): 25 dias em atraso
   ❌ Pedro Costa (COOP003): 60 dias em atraso (suspenso)
```

## 📊 Relatório Administrativo

### Dashboard do Administrador

```
📊 Gerenciador de Assinaturas - 15/02/2024

📈 Estatísticas Gerais:
   👥 Total de Cooperados: 5
   ⚠️ Em Atraso: 3
   ⏰ Pendentes: 2
   ✅ Em Dia: 2
   📊 Taxa de Pagamento: 40%

📅 Estatísticas do Mês Atual (Fevereiro):
   📊 Total: 5 mensalidades
   ✅ Pagos: 2
   ⏰ Pendentes: 2
   ❌ Atrasados: 1

🔒 Cooperados em Atraso:
   ❌ Pedro Costa (COOP003) - 60 dias
   ❌ Maria Santos (COOP002) - 25 dias  
   ❌ Ana Oliveira (COOP004) - 25 dias

⏰ Cooperados Pendentes:
   ⏰ João Silva (COOP001) - 0 dias (vencimento hoje)
   ⏰ Carlos Ferreira (COOP005) - 0 dias (vencimento hoje)

🔧 Ações Administrativas Disponíveis:
   ✅ Verificação Manual
   🔒 Suspender Críticos (1 cooperado)
   ✅ Reativar Cooperados
```

### Ação Administrativa: Suspender Críticos

```
🔒 Executando Suspensão de Cooperados Críticos...

❌ Pedro Costa (COOP003)
   ⏰ Dias em atraso: 60 dias
   🔒 Status: Já suspenso

❌ Maria Santos (COOP002)
   ⏰ Dias em atraso: 25 dias
   ✅ Status: Mantido ativo (menos de 30 dias)

❌ Ana Oliveira (COOP004)
   ⏰ Dias em atraso: 25 dias
   ✅ Status: Mantido ativo (menos de 30 dias)

📊 Resultado: 0 cooperados suspensos (1 já estava suspenso)
```

## 🎯 Cenários de Teste

### Cenário 1: Cooperado Paga Mensalidade em Atraso

```
📅 Dia 20/02/2024 - Pedro Costa decide pagar

👤 Pedro Costa (COOP003) - Login no Portal
   ❌ Acesso bloqueado: "Sua conta foi suspensa por atraso na mensalidade"
   📧 Email recebido com instruções de pagamento

💳 Pedro acessa link de pagamento direto
   💰 Valor total: 75.000 Kz (3 meses em atraso)
   📅 Meses: Dez/2023, Jan/2024, Fev/2024
   💳 Pagamento via Multicaixa Express
   ✅ Pagamento confirmado

🔄 Sistema detecta pagamento:
   ✅ Reativação automática
   🔄 Status: Suspenso → Ativo
   📧 Email: "Seu acesso foi reativado com sucesso!"
   📝 Observação: "Acesso reativado após pagamento de mensalidades em atraso"
```

### Cenário 2: Cooperado Sem Plano

```
👤 Novo Cooperado (COOP006) - Login no Portal

📊 Dashboard:
   ⚠️ "Nenhum Plano Ativo"
   📝 "Para acessar o portal, você precisa ter um plano de assinatura ativo."
   📞 "Entre em contacto com a administração para ativar seu plano."

🔒 Acesso limitado:
   ❌ Não pode acessar funcionalidades do portal
   ✅ Pode ver informações básicas
   📞 Contato com administração
```

### Cenário 3: Múltiplos Pagamentos

```
📅 Dia 15/03/2024 - Vencimento Mensal

📊 Verificação Automática:
   ✅ João Silva: Pagamento criado
   ✅ Maria Santos: Pagamento criado  
   ✅ Ana Oliveira: Pagamento criado
   ✅ Carlos Ferreira: Pagamento criado
   ✅ Pedro Costa: Pagamento criado (reativado)

📧 Emails de cobrança enviados:
   📧 5 emails de lembrete de vencimento
   📧 2 emails de cobrança para cooperados em atraso

📊 Resultado após 1 semana:
   ✅ 3 cooperados pagaram (60%)
   ⏰ 2 cooperados pendentes (40%)
   📧 2 emails de cobrança adicional enviados
```

## 🔍 Logs do Sistema

```
[2024-01-15 09:00:00] 🚀 Verificação automática iniciada
[2024-01-15 09:00:05] ✅ 5 cooperados verificados
[2024-01-15 09:00:10] 📝 3 pagamentos criados
[2024-01-15 09:00:15] 📧 2 emails de cobrança enviados

[2024-01-16 14:30:00] 👤 Login: João Silva (COOP001)
[2024-01-16 14:35:00] 💳 Pagamento iniciado: MEN-COOP001-2024-01
[2024-01-16 14:37:00] ✅ Pagamento confirmado: 25.000 Kz
[2024-01-16 14:37:05] 🔄 Status atualizado: Pendente → Pago

[2024-01-30 09:00:00] 🔒 Suspensão: Pedro Costa (COOP003)
[2024-01-30 09:00:05] 📧 Email suspensão enviado
[2024-01-30 09:00:10] 📝 Log: "Acesso suspenso por atraso de 45 dias"

[2024-02-20 15:30:00] 💳 Pagamento atraso: Pedro Costa (COOP003)
[2024-02-20 15:35:00] ✅ Pagamento confirmado: 75.000 Kz
[2024-02-20 15:35:05] 🔄 Reativação automática
[2024-02-20 15:35:10] 📧 Email reativação enviado
```

## 📈 Métricas de Performance

```
📊 Métricas do Sistema (Janeiro 2024):

👥 Cooperados Ativos: 5
💰 Total Mensalidades: 25.000 Kz × 3 + 50.000 Kz × 2 = 175.000 Kz
✅ Mensalidades Pagas: 25.000 Kz × 1 = 25.000 Kz
⏰ Mensalidades Pendentes: 150.000 Kz
📊 Taxa de Pagamento: 14.3%

📧 Emails Enviados: 15
   📧 Lembretes: 8
   📧 Cobranças: 5
   📧 Suspensões: 1
   📧 Reativações: 1

🔒 Suspensões: 1
✅ Reativações: 1
⏱️ Tempo médio de pagamento: 2.3 dias
```

Esta simulação demonstra como o sistema funciona de forma completa e automatizada, garantindo que todos os cooperados mantenham suas mensalidades em dia para acessar o portal da cooperativa.
