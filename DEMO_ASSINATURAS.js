// ========================================
// DEMONSTRAÇÃO INTERATIVA DO SISTEMA DE ASSINATURAS
// ========================================

console.log(`
🎯 SISTEMA DE ASSINATURAS MENSAIS - DEMONSTRAÇÃO
================================================

Este script simula o funcionamento completo do sistema de assinaturas
mensais obrigatórias da cooperativa.

Para testar diferentes cenários, execute os comandos abaixo:
`);

// Dados simulados
const planos = [
  {
    id: "plano-1",
    nome_plano: "Plano Básico",
    valor_mensal: 25000,
    taxa_inscricao: 50000,
    dia_vencimento_fixo: 15,
    ativo: true
  },
  {
    id: "plano-2",
    nome_plano: "Plano Premium", 
    valor_mensal: 50000,
    taxa_inscricao: 100000,
    dia_vencimento_fixo: 20,
    ativo: true
  }
];

const cooperados = [
  {
    id: "coop-1",
    nome_completo: "João Silva",
    numero_associado: "COOP001",
    assinatura_plano_id: "plano-1",
    status: "ativo",
    data_inscricao: "2024-01-15"
  },
  {
    id: "coop-2",
    nome_completo: "Maria Santos",
    numero_associado: "COOP002",
    assinatura_plano_id: "plano-2", 
    status: "ativo",
    data_inscricao: "2024-02-01"
  },
  {
    id: "coop-3",
    nome_completo: "Pedro Costa",
    numero_associado: "COOP003",
    assinatura_plano_id: "plano-1",
    status: "suspenso",
    data_inscricao: "2024-01-20"
  },
  {
    id: "coop-4",
    nome_completo: "Ana Oliveira", 
    numero_associado: "COOP004",
    assinatura_plano_id: "plano-2",
    status: "ativo",
    data_inscricao: "2024-02-10"
  },
  {
    id: "coop-5",
    nome_completo: "Carlos Ferreira",
    numero_associado: "COOP005", 
    assinatura_plano_id: "plano-1",
    status: "ativo",
    data_inscricao: "2024-01-25"
  }
];

const pagamentos = [];

// Funções de simulação
class SimuladorAssinaturas {
  constructor() {
    this.dataAtual = new Date('2024-01-15');
    this.logs = [];
  }

  log(mensagem) {
    const timestamp = this.dataAtual.toLocaleString('pt-BR');
    console.log(`[${timestamp}] ${mensagem}`);
    this.logs.push(`[${timestamp}] ${mensagem}`);
  }

  // Simular verificação automática
  verificarAssinaturas() {
    this.log("🚀 Iniciando verificação automática de assinaturas...");
    
    const cooperadosAtivos = cooperados.filter(c => c.status === "ativo");
    this.log(`📊 Verificando ${cooperadosAtivos.length} cooperados com planos ativos...`);
    
    cooperadosAtivos.forEach(cooperado => {
      const plano = planos.find(p => p.id === cooperado.assinatura_plano_id);
      const proximoVencimento = this.calcularProximoVencimento(plano);
      const mesRef = `${proximoVencimento.getFullYear()}-${String(proximoVencimento.getMonth() + 1).padStart(2, '0')}`;
      
      // Verificar se já existe pagamento para este mês
      const pagamentoExistente = pagamentos.find(p => 
        p.cooperado_id === cooperado.id && 
        p.mes_referencia === mesRef
      );
      
      if (!pagamentoExistente) {
        const novoPagamento = {
          id: `pag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          cooperado_id: cooperado.id,
          assinatura_plano_id: cooperado.assinatura_plano_id,
          valor: plano.valor_mensal,
          data_vencimento: proximoVencimento.toISOString(),
          mes_referencia: mesRef,
          tipo: "mensalidade",
          status: "pendente",
          referencia: `MEN-${cooperado.numero_associado}-${mesRef}`,
          created_date: this.dataAtual.toISOString()
        };
        
        pagamentos.push(novoPagamento);
        this.log(`✅ Pagamento criado para ${cooperado.nome_completo}: ${novoPagamento.referencia}`);
      }
    });
    
    this.log("✅ Verificação automática concluída");
  }

  // Calcular próximo vencimento
  calcularProximoVencimento(plano) {
    const diaVencimento = plano.dia_vencimento_fixo;
    let proximoVenc = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), diaVencimento);
    
    if (proximoVenc <= this.dataAtual) {
      proximoVenc = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, diaVencimento);
    }
    
    return proximoVenc;
  }

  // Simular pagamento de cooperado
  simularPagamento(cooperadoId, metodoPagamento = "multicaixa_express") {
    const cooperado = cooperados.find(c => c.id === cooperadoId);
    const pagamentoPendente = pagamentos.find(p => 
      p.cooperado_id === cooperadoId && 
      p.status === "pendente"
    );
    
    if (!pagamentoPendente) {
      this.log(`❌ Nenhum pagamento pendente encontrado para ${cooperado.nome_completo}`);
      return false;
    }
    
    this.log(`💳 ${cooperado.nome_completo} iniciando pagamento via ${metodoPagamento}...`);
    
    // Simular processamento
    setTimeout(() => {
      pagamentoPendente.status = "pago";
      pagamentoPendente.metodo_pagamento = metodoPagamento;
      pagamentoPendente.data_pagamento = this.dataAtual.toISOString();
      
      this.log(`✅ Pagamento confirmado: ${pagamentoPendente.referencia} - ${pagamentoPendente.valor.toLocaleString()} Kz`);
      this.log(`🎉 ${cooperado.nome_completo} - Acesso mantido/reativado`);
    }, 2000);
    
    return true;
  }

  // Simular avanço de tempo
  avancarTempo(dias = 1) {
    this.dataAtual.setDate(this.dataAtual.getDate() + dias);
    this.log(`⏰ Avançando ${dias} dia(s) - Data atual: ${this.dataAtual.toLocaleDateString('pt-BR')}`);
    
    // Verificar pagamentos em atraso
    pagamentos.forEach(pagamento => {
      if (pagamento.status === "pendente" && new Date(pagamento.data_vencimento) < this.dataAtual) {
        const diasAtraso = Math.floor((this.dataAtual - new Date(pagamento.data_vencimento)) / (1000 * 60 * 60 * 24));
        
        if (diasAtraso >= 30) {
          const cooperado = cooperados.find(c => c.id === pagamento.cooperado_id);
          cooperado.status = "suspenso";
          this.log(`🔒 ${cooperado.nome_completo} suspenso por ${diasAtraso} dias em atraso`);
        } else if (diasAtraso > 0) {
          this.log(`⚠️ ${pagamento.referencia} em atraso há ${diasAtraso} dias`);
        }
      }
    });
  }

  // Mostrar status atual
  mostrarStatus() {
    console.log("\n📊 STATUS ATUAL DO SISTEMA");
    console.log("==========================");
    
    cooperados.forEach(cooperado => {
      const plano = planos.find(p => p.id === cooperado.assinatura_plano_id);
      const pagamentosCooperado = pagamentos.filter(p => p.cooperado_id === cooperado.id);
      const pagamentoPendente = pagamentosCooperado.find(p => p.status === "pendente");
      
      console.log(`\n👤 ${cooperado.nome_completo} (${cooperado.numero_associado})`);
      console.log(`   🛡️ Plano: ${plano?.nome_plano || 'Sem plano'}`);
      console.log(`   📊 Status: ${cooperado.status}`);
      
      if (pagamentoPendente) {
        const diasAtraso = Math.floor((this.dataAtual - new Date(pagamentoPendente.data_vencimento)) / (1000 * 60 * 60 * 24));
        console.log(`   ⚠️ Pagamento pendente: ${pagamentoPendente.referencia}`);
        console.log(`   💰 Valor: ${pagamentoPendente.valor.toLocaleString()} Kz`);
        console.log(`   📅 Vencimento: ${new Date(pagamentoPendente.data_vencimento).toLocaleDateString('pt-BR')}`);
        if (diasAtraso > 0) {
          console.log(`   ⏰ Dias em atraso: ${diasAtraso}`);
        }
      } else {
        console.log(`   ✅ Em dia`);
      }
    });
    
    console.log("\n📈 ESTATÍSTICAS:");
    console.log(`   👥 Total cooperados: ${cooperados.length}`);
    console.log(`   ✅ Ativos: ${cooperados.filter(c => c.status === "ativo").length}`);
    console.log(`   🔒 Suspensos: ${cooperados.filter(c => c.status === "suspenso").length}`);
    console.log(`   💰 Pagamentos pendentes: ${pagamentos.filter(p => p.status === "pendente").length}`);
    console.log(`   ✅ Pagamentos pagos: ${pagamentos.filter(p => p.status === "pago").length}`);
  }

  // Simular cenário completo
  simularCenarioCompleto() {
    console.log("\n🎬 INICIANDO SIMULAÇÃO COMPLETA");
    console.log("=================================");
    
    // Dia 1: Verificação inicial
    this.verificarAssinaturas();
    this.mostrarStatus();
    
    // Avançar 1 dia
    this.avancarTempo(1);
    
    // Simular pagamento do João
    this.simularPagamento("coop-1");
    
    // Avançar 5 dias
    this.avancarTempo(5);
    this.verificarAssinaturas();
    
    // Avançar mais 10 dias
    this.avancarTempo(10);
    this.verificarAssinaturas();
    
    // Simular pagamento da Maria
    this.simularPagamento("coop-2");
    
    // Avançar mais 15 dias (Pedro fica em atraso crítico)
    this.avancarTempo(15);
    this.verificarAssinaturas();
    
    // Mostrar status final
    this.mostrarStatus();
    
    console.log("\n✅ SIMULAÇÃO COMPLETA FINALIZADA");
  }
}

// Criar instância do simulador
const simulador = new SimuladorAssinaturas();

// Comandos disponíveis
console.log(`
📋 COMANDOS DISPONÍVEIS:
=======================

1. simulador.verificarAssinaturas()     - Executa verificação automática
2. simulador.simularPagamento("coop-1") - Simula pagamento de cooperado
3. simulador.avancarTempo(5)            - Avança 5 dias no tempo
4. simulador.mostrarStatus()            - Mostra status atual do sistema
5. simulador.simularCenarioCompleto()   - Executa simulação completa

💡 EXEMPLOS DE USO:
==================

// Verificar assinaturas
simulador.verificarAssinaturas();

// João Silva paga mensalidade
simulador.simularPagamento("coop-1");

// Avançar 10 dias
simulador.avancarTempo(10);

// Ver status atual
simulador.mostrarStatus();

// Executar simulação completa
simulador.simularCenarioCompleto();
`);

// Exportar para uso global
window.simulador = simulador;
window.planos = planos;
window.cooperados = cooperados;
window.pagamentos = pagamentos;

console.log("🚀 Simulador carregado! Use 'simulador.simularCenarioCompleto()' para ver uma demonstração completa.");
