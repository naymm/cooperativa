# Sistema de Inscrição em Projetos

## 📋 Visão Geral

O sistema de inscrição em projetos permite que os cooperados visualizem projetos disponíveis da cooperativa e se inscrevam nos que desejam participar. O sistema inclui validações para impedir inscrições duplicadas e oferece um painel administrativo para gerenciar as inscrições.

## 🎯 Funcionalidades Principais

### Para Cooperados:
1. **Visualização de Projetos Disponíveis** - Lista de projetos em planeamento ou construção
2. **Inscrição em Projetos** - Formulário com dados de interesse e forma de pagamento
3. **Consulta de Status** - Acompanhamento das inscrições realizadas
4. **Cancelamento de Inscrições** - Possibilidade de cancelar inscrições pendentes
5. **Validações** - Impede inscrições duplicadas no mesmo projeto

### Para Administradores:
1. **Gestão de Inscrições** - Visualização de todas as inscrições
2. **Aprovação/Rejeição** - Controle de status das inscrições
3. **Filtros e Busca** - Ferramentas para encontrar inscrições específicas
4. **Relatórios** - Estatísticas e métricas do sistema
5. **Observações** - Adição de comentários e motivos de rejeição

## 🗄️ Estrutura de Dados

### Entidade: InscricaoProjeto

```json
{
  "project_id": "string",           // ID do projeto
  "cooperado_id": "string",         // ID do cooperado
  "status": "pendente|aprovado|rejeitado",
  "data_inscricao": "date",
  "data_aprovacao": "date",         // Data de aprovação/rejeição
  "aprovado_por": "string",         // ID do administrador
  "observacoes": "string",          // Observações gerais
  "motivo_rejeicao": "string",      // Motivo da rejeição
  "prioridade": "integer",          // Prioridade (1-10)
  "documentos_anexados": ["url"],   // URLs dos documentos
  "valor_interesse": "number",      // Valor que o cooperado quer investir
  "forma_pagamento": "dinheiro|financiamento|parcial|outro",
  "prazo_interesse": "date"         // Prazo de interesse
}
```

## 🔧 Componentes Implementados

### 1. InscricaoProjetoService
**Arquivo:** `src/services/InscricaoProjetoService.js`

Serviço principal que gerencia todas as operações relacionadas às inscrições:

- `buscarProjetosDisponiveis()` - Projetos que aceitam inscrições
- `verificarInscricaoExistente()` - Validação de duplicatas
- `criarInscricao()` - Criação de nova inscrição
- `buscarInscricoesCooperado()` - Inscrições de um cooperado
- `buscarInscricoesPendentes()` - Inscrições pendentes (admin)
- `aprovarInscricao()` - Aprovação de inscrição
- `rejeitarInscricao()` - Rejeição com motivo
- `cancelarInscricao()` - Cancelamento pelo cooperado
- `gerarRelatorioInscricoes()` - Relatórios e estatísticas

### 2. InscricaoProjetos (Componente Cooperado)
**Arquivo:** `src/components/portal/InscricaoProjetos.jsx`

Componente integrado ao dashboard do cooperado que permite:

- Visualizar projetos disponíveis
- Ver status das inscrições existentes
- Realizar novas inscrições
- Cancelar inscrições pendentes

### 3. GerenciadorInscricoesProjetos (Componente Admin)
**Arquivo:** `src/components/admin/GerenciadorInscricoesProjetos.jsx`

Painel administrativo com:

- Estatísticas em tempo real
- Filtros por status e projeto
- Lista completa de inscrições
- Modais para aprovação/rejeição
- Relatórios detalhados

### 4. PortalInscricaoProjetos (Página Dedicada)
**Arquivo:** `src/pages/PortalInscricaoProjetos.jsx`

Página completa dedicada às inscrições em projetos, incluindo:

- Interface completa e responsiva
- Formulários de inscrição
- Visualização de projetos
- Gestão de inscrições existentes

## 🔄 Fluxo de Funcionamento

### 1. Cooperado Acessa o Sistema
```
Cooperado → Portal Dashboard → Seção "Minhas Inscrições"
```

### 2. Visualização de Projetos
```
Sistema → Busca projetos disponíveis → Filtra por status e data
```

### 3. Inscrição em Projeto
```
Cooperado → Seleciona projeto → Preenche formulário → Sistema valida → Cria inscrição
```

### 4. Validações Automáticas
- ✅ Verifica se já existe inscrição no projeto
- ✅ Valida se o projeto ainda aceita inscrições
- ✅ Confirma dados obrigatórios
- ✅ Impede inscrições duplicadas

### 5. Gestão Administrativa
```
Admin → Painel de Projetos → Aba "Inscrições" → Visualiza inscrições pendentes
```

### 6. Aprovação/Rejeição
```
Admin → Seleciona inscrição → Aprova/Rejeita → Sistema atualiza status
```

## 🎨 Interface do Usuário

### Dashboard do Cooperado
- **Seção "Minhas Inscrições"** - Status das inscrições existentes
- **Botão "Minhas Inscrições"** - Link para página dedicada
- **Cards de Projetos** - Visualização rápida com botão de inscrição

### Página Dedicada (PortalInscricaoProjetos)
- **Header com navegação** - Voltar ao dashboard
- **Seção de inscrições existentes** - Status e detalhes
- **Grid de projetos disponíveis** - Cards com informações
- **Modal de inscrição** - Formulário completo
- **Validações visuais** - Indicadores de status

### Painel Administrativo
- **Toggle entre "Projetos" e "Inscrições"** - Navegação fácil
- **Estatísticas em cards** - Total, pendentes, aprovadas, rejeitadas
- **Filtros avançados** - Por status, projeto, data
- **Lista detalhada** - Todas as informações das inscrições
- **Modais de ação** - Aprovação e rejeição com formulários

## 🔒 Validações e Segurança

### Validações de Negócio
1. **Inscrição Única** - Um cooperado por projeto
2. **Projeto Disponível** - Apenas projetos em planeamento/construção
3. **Dados Obrigatórios** - Valor de interesse e forma de pagamento
4. **Status de Aprovação** - Apenas inscrições pendentes podem ser alteradas
5. **Permissões** - Cooperados só podem cancelar suas próprias inscrições

### Validações de Interface
1. **Formulários** - Campos obrigatórios marcados
2. **Feedback Visual** - Status coloridos e ícones
3. **Confirmações** - Diálogos para ações importantes
4. **Loading States** - Indicadores de carregamento
5. **Error Handling** - Mensagens de erro claras

## 📊 Relatórios e Estatísticas

### Métricas Disponíveis
- **Total de Inscrições** - Número geral
- **Inscrições Pendentes** - Aguardando aprovação
- **Inscrições Aprovadas** - Aprovadas pelos administradores
- **Inscrições Rejeitadas** - Rejeitadas com motivo
- **Por Projeto** - Distribuição por projeto
- **Por Mês** - Evolução temporal

### Relatórios Administrativos
- **Dashboard Geral** - Visão geral do sistema
- **Filtros Avançados** - Busca específica
- **Exportação** - Dados para análise externa
- **Histórico** - Acompanhamento de mudanças

## 🚀 Integração com Sistema Existente

### Entidades Relacionadas
- **Projeto** - Referência aos projetos da cooperativa
- **Cooperado** - Dados do cooperado inscrito
- **InscricaoProjeto** - Nova entidade para inscrições

### Páginas Integradas
- **PortalDashboard** - Seção de inscrições
- **Projetos (Admin)** - Toggle para gestão de inscrições
- **PortalInscricaoProjetos** - Página dedicada

### Rotas Adicionadas
- `/PortalInscricaoProjetos` - Página de inscrições
- Integração no sistema de navegação existente

## 🔧 Configuração e Uso

### Para Cooperados
1. Acesse o portal do cooperado
2. No dashboard, clique em "Minhas Inscrições"
3. Visualize projetos disponíveis
4. Clique em "Inscrever-se" no projeto desejado
5. Preencha o formulário e confirme

### Para Administradores
1. Acesse o painel administrativo
2. Vá para "Projetos"
3. Clique na aba "Inscrições"
4. Visualize inscrições pendentes
5. Aprove ou rejeite conforme necessário

## 📈 Próximas Melhorias

### Funcionalidades Futuras
1. **Notificações por Email** - Alertas de status
2. **Upload de Documentos** - Anexos às inscrições
3. **Sistema de Prioridades** - Ranking automático
4. **Integração com Pagamentos** - Vinculação financeira
5. **Relatórios Avançados** - Análises detalhadas
6. **API Externa** - Integração com outros sistemas

### Melhorias Técnicas
1. **Cache Inteligente** - Performance otimizada
2. **Validações Avançadas** - Regras de negócio complexas
3. **Auditoria Completa** - Log de todas as ações
4. **Backup Automático** - Proteção de dados
5. **Testes Automatizados** - Qualidade garantida

## 🎯 Benefícios do Sistema

### Para Cooperados
- ✅ Transparência no processo de inscrição
- ✅ Acompanhamento em tempo real
- ✅ Facilidade de inscrição
- ✅ Possibilidade de cancelamento
- ✅ Informações detalhadas dos projetos

### Para Administradores
- ✅ Controle centralizado das inscrições
- ✅ Processo de aprovação estruturado
- ✅ Relatórios e estatísticas
- ✅ Gestão eficiente de demandas
- ✅ Histórico completo de ações

### Para a Cooperativa
- ✅ Processo digitalizado
- ✅ Redução de erros manuais
- ✅ Melhor organização
- ✅ Dados estruturados
- ✅ Escalabilidade do sistema

O sistema de inscrição em projetos está totalmente integrado ao ecossistema da cooperativa, oferecendo uma solução completa e profissional para a gestão de interesses dos cooperados nos projetos habitacionais.
