# Sistema de Assinaturas Mensais Obrigatórias

## Visão Geral

O sistema de assinaturas mensais obrigatórias foi implementado para garantir que todos os cooperados paguem mensalmente o plano selecionado, mantendo assim o acesso ao portal da cooperativa.

## Funcionalidades Principais

### 1. Verificação Automática
- **Execução**: Diariamente às 9h da manhã
- **Função**: Verifica todos os cooperados com planos ativos e cria pagamentos pendentes automaticamente
- **Status**: Inicia automaticamente quando a aplicação é carregada

### 2. Gestão de Pagamentos
- **Criação Automática**: Pagamentos mensais são criados automaticamente no dia de vencimento
- **Status Tracking**: Acompanha pagamentos pendentes, pagos e em atraso
- **Referência Única**: Cada pagamento tem uma referência única (ex: MEN-123-2024-01)

### 3. Suspensão Automática
- **Critério**: Cooperados com 30+ dias de atraso são suspensos automaticamente
- **Reativação**: Acesso é reativado automaticamente após pagamento de mensalidades em atraso

## Componentes Implementados

### 1. AssinaturaMensal.jsx
**Localização**: `src/components/portal/AssinaturaMensal.jsx`

**Função**: Componente exibido no dashboard do cooperado mostrando:
- Status da assinatura atual
- Próximo vencimento
- Histórico de pagamentos
- Alertas de pagamentos pendentes/em atraso
- Botão para pagar mensalidade

**Características**:
- Verifica automaticamente se o cooperado tem plano ativo
- Calcula dias até vencimento
- Mostra alertas visuais para diferentes status
- Integração com sistema de pagamentos

### 2. PortalPagamentoMensalidade.jsx
**Localização**: `src/pages/PortalPagamentoMensalidade.jsx`

**Função**: Página dedicada para pagamento de mensalidades

**Características**:
- Interface específica para pagamento de mensalidades
- Verificação de pagamentos existentes
- Criação automática de pagamentos pendentes
- Integração com múltiplos métodos de pagamento
- Redirecionamento automático após pagamento

### 3. AssinaturaService.js
**Localização**: `src/services/AssinaturaService.js`

**Função**: Serviço principal que gerencia todo o sistema de assinaturas

**Métodos Principais**:
- `iniciarVerificacaoAutomatica()`: Inicia verificação diária
- `verificarAssinaturas()`: Executa verificação manual
- `buscarCooperadosEmAtraso()`: Lista cooperados em atraso
- `suspenderCooperadosEmAtrasoCritico()`: Suspende cooperados com 30+ dias
- `reativarCooperadosPagaram()`: Reativa cooperados que pagaram
- `gerarRelatorioAssinaturas()`: Gera relatórios estatísticos

### 4. GerenciadorAssinaturas.jsx
**Localização**: `src/components/admin/GerenciadorAssinaturas.jsx`

**Função**: Interface administrativa para gerenciar assinaturas

**Características**:
- Dashboard com estatísticas em tempo real
- Controles para verificação manual
- Ações administrativas (suspender/reativar)
- Lista de cooperados em atraso e pendentes
- Status da verificação automática

## Fluxo de Funcionamento

### 1. Inicialização
```javascript
// Em src/main.jsx
assinaturaService.iniciarVerificacaoAutomatica();
```

### 2. Verificação Diária (9h)
1. Busca todos os cooperados com planos ativos
2. Para cada cooperado:
   - Calcula próximo vencimento baseado no plano
   - Verifica se já existe pagamento para o mês
   - Cria pagamento pendente se necessário
   - Atualiza status de pagamentos em atraso

### 3. Acesso do Cooperado
1. Cooperado acessa o portal
2. Sistema verifica status da assinatura
3. Se há pagamento pendente/em atraso:
   - Mostra alertas no dashboard
   - Bloqueia acesso a funcionalidades se necessário
4. Se tudo em dia:
   - Acesso normal ao portal

### 4. Pagamento
1. Cooperado clica em "Pagar Mensalidade"
2. Sistema direciona para página de pagamento
3. Após confirmação:
   - Status do pagamento é atualizado para "pago"
   - Cooperado é redirecionado para dashboard
   - Acesso é mantido/reativado

## Configuração de Planos

### Estrutura do Plano
```json
{
  "nome_plano": "Plano Básico",
  "valor_mensal": 50000,
  "taxa_inscricao": 100000,
  "dia_vencimento_fixo": 15,
  "ativo": true
}
```

### Campos Importantes
- `valor_mensal`: Valor da mensalidade em Kwanzas
- `dia_vencimento_fixo`: Dia do mês para vencimento (1-28)
- `ativo`: Se o plano está disponível para novos cooperados

## Integração com Sistema Existente

### 1. Entidades Utilizadas
- **Cooperado**: Adicionado campo `assinatura_plano_id`
- **Pagamento**: Suporte para tipo "mensalidade"
- **AssinaturaPlano**: Nova entidade para planos

### 2. Sistema de Cobranças
- Integrado na página de Cobranças
- Seletor entre "Cobranças" e "Assinaturas"
- Reutiliza infraestrutura de email existente

### 3. Dashboard do Cooperado
- Nova seção "Assinatura Mensal"
- Integração com sistema de notificações
- Alertas visuais para status de pagamento

## Rotas Implementadas

### Portal do Cooperado
- `/PortalPagamentoMensalidade`: Página de pagamento de mensalidades

### Administrativo
- Integrado na página `/Cobrancas` com seletor de modo

## Monitoramento e Relatórios

### Estatísticas Disponíveis
- Total de cooperados com planos ativos
- Cooperados em atraso
- Cooperados pendentes
- Taxa de pagamento do mês atual
- Histórico de pagamentos

### Alertas Automáticos
- Notificações para cooperados em atraso
- Alertas administrativos para muitos cooperados em atraso
- Logs detalhados de todas as operações

## Segurança e Validações

### Validações Implementadas
- Verificação de plano ativo antes de criar pagamentos
- Validação de datas de vencimento
- Verificação de duplicação de pagamentos
- Controle de acesso baseado em status de pagamento

### Logs e Auditoria
- Todos os pagamentos criados têm log de criação
- Histórico de mudanças de status
- Rastreamento de ações administrativas

## Manutenção e Troubleshooting

### Comandos Úteis
```javascript
// Verificação manual
await assinaturaService.verificarAssinaturas();

// Buscar cooperados em atraso
const emAtraso = await assinaturaService.buscarCooperadosEmAtraso();

// Suspender cooperados críticos
await assinaturaService.suspenderCooperadosEmAtrasoCritico();

// Reativar cooperados
await assinaturaService.reativarCooperadosPagaram();
```

### Problemas Comuns
1. **Verificação não executa**: Verificar se o serviço foi inicializado
2. **Pagamentos duplicados**: Verificar lógica de criação de pagamentos
3. **Cooperados não suspensos**: Verificar critérios de suspensão
4. **Acesso bloqueado**: Verificar status do cooperado e pagamentos

## Próximos Passos

### Melhorias Sugeridas
1. **Notificações Push**: Implementar notificações em tempo real
2. **Relatórios Avançados**: Gráficos e análises detalhadas
3. **Integração com Gateway**: Pagamentos automáticos via API
4. **Backup Automático**: Sistema de backup dos dados de assinaturas
5. **Multi-idioma**: Suporte para outros idiomas

### Configurações Avançadas
1. **Horário de Verificação**: Configurável via interface
2. **Critérios de Suspensão**: Personalizáveis por plano
3. **Notificações Personalizadas**: Templates de email customizáveis
4. **Integração com CRM**: Sincronização com sistemas externos

## Conclusão

O sistema de assinaturas mensais obrigatórias está totalmente integrado ao sistema existente da cooperativa, garantindo que todos os cooperados mantenham suas mensalidades em dia para acessar o portal. O sistema é robusto, automatizado e oferece controle total aos administradores.
