# Sistema de Cobranças - CoopHabitat

## ✅ Funcionalidade Implementada

Sistema completo de envio de emails de cobrança para pagamentos em atraso, com controle automático de frequência, templates personalizados e funcionalidades de simulação para testes.

## 🎯 Características Principais

### **1. Identificação Automática**
- Detecta pagamentos em atraso automaticamente
- Calcula dias de atraso precisos
- Filtra apenas mensalidades pendentes/atrasadas

### **2. Templates Personalizados**
- **Cobrança Inicial** (1-14 dias): Lembrete amigável
- **Cobrança Urgente** (15-29 dias): Aviso sobre consequências
- **Cobrança Crítica** (30+ dias): Última notificação

### **3. Controle de Frequência**
- Evita spam com regras de intervalo
- Primeira cobrança: imediatamente
- Segunda cobrança: após 3 dias
- Terceira cobrança: após 7 dias
- Cobranças subsequentes: após 15 dias

### **4. Simulação para Testes**
- Envio de cobranças simuladas para email específico
- Teste individual de cada tipo de cobrança
- Simulação em lote de todos os tipos
- Dados simulados realistas para demonstração

## 🔧 Componentes Implementados

### **1. CobrancaService.js**
```javascript
// Serviço principal para gerenciar cobranças
class CobrancaService {
  // Buscar pagamentos em atraso
  static async buscarPagamentosEmAtraso()
  
  // Buscar cooperados com pagamentos em atraso
  static async buscarCooperadosEmAtraso()
  
  // Simular envio de cobrança para email específico
  static async simularCobranca(emailDestino, tipoCobranca)
  
  // Simular todos os tipos de cobrança
  static async simularTodosTiposCobranca(emailDestino)
  
  // Enviar email de cobrança individual
  static async enviarEmailCobranca(cooperadoData)
  
  // Enviar cobranças em lote
  static async enviarCobrancasEmLote()
  
  // Verificar se deve enviar cobrança
  static deveEnviarCobranca(pagamento)
  
  // Gerar relatório de cobranças
  static async gerarRelatorioCobrancas()
}
```

### **2. GerenciadorCobrancas.jsx**
```javascript
// Interface para gerenciar cobranças
export default function GerenciadorCobrancas() {
  // Carregar dados de cooperados em atraso
  // Simular cobranças individuais
  // Simular todos os tipos de cobrança
  // Enviar cobranças em lote
  // Enviar cobrança individual
  // Exportar relatórios
  // Interface visual com estatísticas
}
```

### **3. Templates de Email**
```javascript
// Templates HTML responsivos
export const emailTemplates = {
  cobranca_atraso: { /* Template inicial */ },
  cobranca_atraso_medio: { /* Template urgente */ },
  cobranca_atraso_grave: { /* Template crítico */ }
}
```

## 📧 Templates de Email

### **Cobrança Inicial (1-14 dias)**
- **Assunto**: "Lembrete: Pagamento em Atraso - CoopHabitat"
- **Tom**: Amigável e informativo
- **Conteúdo**: Detalhes do pagamento, contatos, solicitação de regularização

### **Cobrança Urgente (15-29 dias)**
- **Assunto**: "URGENTE: Pagamento em Atraso - Ação Necessária - CoopHabitat"
- **Tom**: Mais firme, com avisos sobre consequências
- **Conteúdo**: Avisos sobre suspensão de benefícios, juros, cancelamento

### **Cobrança Crítica (30+ dias)**
- **Assunto**: "CRÍTICO: Pagamento em Atraso Grave - Ação Imediata Necessária"
- **Tom**: Muito firme, com consequências iminentes
- **Conteúdo**: Última notificação, possíveis ações legais, opções de regularização

## 🧪 Funcionalidades de Simulação

### **1. Simulação Individual**
```javascript
// Simular cobrança específica
const resultado = await CobrancaService.simularCobranca(
  'gruposanep21@gmail.com', 
  'cobranca_atraso_medio'
);
```

### **2. Simulação em Lote**
```javascript
// Simular todos os tipos de cobrança
const resultado = await CobrancaService.simularTodosTiposCobranca(
  'gruposanep21@gmail.com'
);
```

### **3. Dados Simulados**
```javascript
const dadosSimulados = {
  nome_cooperado: "João Silva Santos",
  numero_associado: "CS123456",
  valor_pagamento: "75.000",
  data_vencimento: "15 de janeiro de 2024",
  dias_atraso: 15,
  mes_referencia: "2024-01",
  nome_plano: "Plano Habitação Premium",
  valor_mensal: "75.000",
  telefone_cooperativa: '+244 123 456 789',
  email_cooperativa: 'cobranca@coophabitat.ao',
  data_atual: "20 de janeiro de 2024"
};
```

## 🎨 Interface do Sistema

### **Dashboard de Estatísticas**
- Total de cooperados em atraso
- Valor total em atraso
- Quantidade de casos críticos
- Emails enviados na sessão

### **Seção de Simulação**
- Botões para simular cada tipo de cobrança
- Botão para simular todos os tipos
- Email de destino configurado (gruposanep21@gmail.com)
- Resultados de simulação em tempo real

### **Controles de Envio**
- Botão para envio em lote
- Barra de progresso durante envio
- Resumo de resultados (sucessos/falhas)
- Detalhes de erros expandíveis

### **Lista de Cooperados**
- Filtros por tipo de atraso (Atraso/Urgente/Crítico)
- Informações detalhadas de cada cooperado
- Botão para envio individual
- Histórico de última cobrança

## 📊 Relatórios e Exportação

### **Relatório CSV**
```csv
Nome,Número de Associado,Email,Valor em Atraso,Dias em Atraso,Data de Vencimento,Mês de Referência,Última Cobrança,Tentativas de Cobrança
João Silva,CS123456,joao@email.com,50000 Kz,15,15/01/2024,2024-01,20/01/2024 10:30,2
```

### **Dados Incluídos**
- Informações do cooperado
- Detalhes do pagamento
- Histórico de cobranças
- Estatísticas de atraso

## 🔄 Fluxo de Funcionamento

### **1. Identificação de Atrasos**
```javascript
// Buscar pagamentos em atraso
const pagamentosEmAtraso = await CobrancaService.buscarPagamentosEmAtraso();

// Filtrar por:
// - tipo === 'mensalidade'
// - status === 'pendente' || 'atrasado'
// - data_vencimento < hoje
```

### **2. Preparação de Dados**
```javascript
// Para cada pagamento em atraso:
const dadosEmail = {
  nome_cooperado: cooperado.nome_completo,
  numero_associado: cooperado.numero_associado,
  valor_pagamento: pagamento.valor,
  dias_atraso: diasEmAtraso,
  data_vencimento: format(dataVencimento, "dd 'de' MMMM 'de' yyyy"),
  // ... outros dados
};
```

### **3. Seleção de Template**
```javascript
// Determinar tipo baseado nos dias em atraso
let tipoCobranca = 'cobranca_atraso';
if (diasEmAtraso >= 30) {
  tipoCobranca = 'cobranca_atraso_grave';
} else if (diasEmAtraso >= 15) {
  tipoCobranca = 'cobranca_atraso_medio';
}
```

### **4. Envio e Controle**
```javascript
// Enviar via EmailService
const resultado = await EmailService.enviarPorEvento(
  tipoCobranca,
  destinatario,
  dadosEmail
);

// Atualizar status do pagamento
await Pagamento.update(pagamento.id, {
  status: 'atrasado',
  ultima_cobranca: new Date().toISOString(),
  tentativas_cobranca: (pagamento.tentativas_cobranca || 0) + 1
});
```

## 🛡️ Controles de Segurança

### **1. Prevenção de Spam**
```javascript
// Verificar se deve enviar cobrança
static deveEnviarCobranca(pagamento) {
  const tentativas = pagamento.tentativas_cobranca || 0;
  const diasDesdeUltimaCobranca = differenceInDays(hoje, ultimaCobranca);
  
  if (tentativas === 0) return true; // Primeira cobrança
  if (tentativas === 1 && diasDesdeUltimaCobranca >= 3) return true;
  if (tentativas === 2 && diasDesdeUltimaCobranca >= 7) return true;
  if (tentativas >= 3 && diasDesdeUltimaCobranca >= 15) return true;
  
  return false;
}
```

### **2. Validação de Dados**
- Verificação de email válido
- Validação de dados do cooperado
- Controle de tentativas de envio
- Logs detalhados de erros

### **3. Tratamento de Erros**
```javascript
try {
  const resultado = await CobrancaService.enviarEmailCobranca(cooperadoData);
  // Sucesso
} catch (error) {
  console.error("Erro ao enviar cobrança:", error);
  // Log do erro e notificação ao usuário
}
```

## 📱 Como Usar

### **1. Acessar o Sistema**
- Navegar para `/cobrancas`
- Ver estatísticas no dashboard
- Revisar lista de cooperados em atraso

### **2. Testar com Simulação**
- **Simulação Individual**: Clicar em "Cobrança Inicial", "Cobrança Urgente" ou "Cobrança Crítica"
- **Simulação Completa**: Clicar em "Simular Todos" para enviar os 3 tipos
- **Verificar Resultados**: Acompanhar resultados na seção de simulação

### **3. Enviar Cobranças Reais**
- **Envio em Lote**: Clicar em "Enviar Todas as Cobranças"
- **Envio Individual**: Clicar em "Enviar Cobrança" em cada cooperado
- **Acompanhar Progresso**: Ver barra de progresso e resultados

### **4. Exportar Relatórios**
- Clicar em "Exportar" para baixar CSV
- Relatório inclui todos os cooperados em atraso
- Dados formatados para análise

## 🔍 Logs e Monitoramento

### **Console Logs**
```javascript
[CobrancaService] Buscando pagamentos em atraso...
[CobrancaService] Encontrados 5 pagamentos em atraso
[CobrancaService] Simulando cobrança cobranca_atraso_medio para gruposanep21@gmail.com
[CobrancaService] Email de cobrança simulado enviado com sucesso para gruposanep21@gmail.com
[CobrancaService] Simulação concluída: 3 enviados, 0 falhas
```

### **Logs de Email**
- Registro de todos os envios
- Status de sucesso/falha
- Tentativas de reenvio
- Histórico completo

## ✅ Benefícios

### **Para a Cooperativa:**
- ✅ **Automatização**: Reduz trabalho manual
- ✅ **Consistência**: Padrão uniforme de cobrança
- ✅ **Eficiência**: Envio em lote de múltiplas cobranças
- ✅ **Controle**: Histórico completo de tentativas
- ✅ **Relatórios**: Dados para análise e tomada de decisão
- ✅ **Testes**: Simulação para validar templates antes do uso real

### **Para os Cooperados:**
- ✅ **Comunicação Clara**: Mensagens específicas por nível de atraso
- ✅ **Informações Detalhadas**: Dados completos do pagamento
- ✅ **Opções de Contato**: Múltiplas formas de regularização
- ✅ **Previsibilidade**: Controle de frequência de envio

## 🚀 Próximos Passos

### **Melhorias Futuras:**
1. **Automação Completa**: Agendamento automático de cobranças
2. **Integração SMS**: Envio de cobranças por SMS
3. **Dashboard Avançado**: Gráficos e métricas de eficácia
4. **Personalização**: Templates customizáveis por cooperativa
5. **Integração Pagamento**: Links diretos para pagamento online
6. **Simulação Avançada**: Configuração de dados simulados personalizados

## ✅ Status

- ✅ **Serviço de Cobrança**: Implementado
- ✅ **Templates de Email**: Criados
- ✅ **Interface de Gerenciamento**: Implementada
- ✅ **Controle de Frequência**: Implementado
- ✅ **Relatórios**: Implementados
- ✅ **Simulação de Testes**: Implementada
- ✅ **Documentação**: Criada

---

**Resultado**: Sistema completo de cobranças automáticas com simulação implementado! 📧🧪✅ 