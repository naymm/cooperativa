import { Cooperado, Pagamento, AssinaturaPlano } from "@/api/entities";
import { toast } from "sonner";

class AssinaturaService {
  constructor() {
    this.verificacaoAtiva = false;
    this.intervalId = null;
  }

  /**
   * Inicia o sistema de verificação automática de assinaturas
   */
  iniciarVerificacaoAutomatica() {
    if (this.verificacaoAtiva) {
      console.log("⚠️ Verificação automática já está ativa");
      return;
    }

    console.log("🚀 Iniciando verificação automática de assinaturas...");
    this.verificacaoAtiva = true;

    // Verificar imediatamente
    this.verificarAssinaturas();

    // Configurar verificação diária às 9h
    this.intervalId = setInterval(() => {
      const agora = new Date();
      if (agora.getHours() === 9 && agora.getMinutes() === 0) {
        console.log("⏰ Executando verificação diária de assinaturas...");
        this.verificarAssinaturas();
      }
    }, 60000); // Verificar a cada minuto

    console.log("✅ Verificação automática iniciada");
  }

  /**
   * Para o sistema de verificação automática
   */
  pararVerificacaoAutomatica() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.verificacaoAtiva = false;
    console.log("🛑 Verificação automática parada");
  }

  /**
   * Verifica todas as assinaturas e cria pagamentos pendentes
   */
  async verificarAssinaturas() {
    try {
      console.log("🔍 Iniciando verificação de assinaturas...");
      
      // Buscar todos os cooperados com planos ativos
      const cooperados = await Cooperado.filter({
        assinatura_plano_id: { $ne: null },
        status: "ativo"
      });

      console.log(`📊 Encontrados ${cooperados.length} cooperados com planos ativos`);

      let pagamentosCriados = 0;
      let cooperadosEmAtraso = 0;

      for (const cooperado of cooperados) {
        try {
          const resultado = await this.verificarAssinaturaCooperado(cooperado);
          
          if (resultado.pagamentoCriado) {
            pagamentosCriados++;
          }
          
          if (resultado.emAtraso) {
            cooperadosEmAtraso++;
          }
        } catch (error) {
          console.error(`❌ Erro ao verificar cooperado ${cooperado.id}:`, error);
        }
      }

      console.log(`✅ Verificação concluída:`);
      console.log(`   - Pagamentos criados: ${pagamentosCriados}`);
      console.log(`   - Cooperados em atraso: ${cooperadosEmAtraso}`);

      // Notificar administradores se houver muitos cooperados em atraso
      if (cooperadosEmAtraso > 0) {
        this.notificarCooperadosEmAtraso(cooperadosEmAtraso);
      }

    } catch (error) {
      console.error("❌ Erro na verificação de assinaturas:", error);
    }
  }

  /**
   * Verifica a assinatura de um cooperado específico
   */
  async verificarAssinaturaCooperado(cooperado) {
    try {
      // Buscar dados do plano
      const plano = await AssinaturaPlano.get(cooperado.assinatura_plano_id);
      
      // Calcular próximo vencimento
      const hoje = new Date();
      const diaVencimento = plano.dia_vencimento_fixo || 15;
      let proximoVenc = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento);
      
      if (proximoVenc <= hoje) {
        proximoVenc = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimento);
      }
      
      // Definir mês de referência
      const mesRef = proximoVenc.getFullYear() + "-" + String(proximoVenc.getMonth() + 1).padStart(2, "0");
      
      // Verificar se já existe pagamento para este mês
      const pagamentosExistentes = await Pagamento.filter({
        cooperado_id: cooperado.id,
        tipo: "mensalidade",
        mes_referencia: mesRef
      });

      if (pagamentosExistentes && pagamentosExistentes.length > 0) {
        const pagamentoExistente = pagamentosExistentes[0];
        
        // Verificar se está em atraso
        const emAtraso = pagamentoExistente.status === "pendente" && 
                        new Date(pagamentoExistente.data_vencimento) < hoje;
        
        if (emAtraso) {
          // Atualizar status para atrasado
          await Pagamento.update(pagamentoExistente.id, {
            status: "atrasado"
          });
          
          console.log(`⚠️ Cooperado ${cooperado.nome_completo} em atraso`);
          return { pagamentoCriado: false, emAtraso: true };
        }
        
        return { pagamentoCriado: false, emAtraso: false };
      } else {
        // Criar novo pagamento pendente
        const novoPagamento = {
          cooperado_id: cooperado.id,
          assinatura_plano_id: cooperado.assinatura_plano_id,
          valor: plano.valor_mensal,
          data_vencimento: proximoVenc.toISOString(),
          mes_referencia: mesRef,
          tipo: "mensalidade",
          status: "pendente",
          referencia: `MEN-${cooperado.id}-${mesRef}`,
          observacoes: {
            tipo_pagamento: "mensalidade",
            mes_referencia: mesRef,
            plano: plano.nome_plano,
            criado_automaticamente: true,
            data_criacao: new Date().toISOString()
          }
        };
        
        await Pagamento.create(novoPagamento);
        console.log(`✅ Pagamento criado para cooperado ${cooperado.nome_completo}`);
        
        return { pagamentoCriado: true, emAtraso: false };
      }
      
    } catch (error) {
      console.error(`❌ Erro ao verificar cooperado ${cooperado.id}:`, error);
      throw error;
    }
  }

  /**
   * Busca cooperados com mensalidades em atraso
   */
  async buscarCooperadosEmAtraso() {
    try {
      const hoje = new Date();
      
      const pagamentosAtrasados = await Pagamento.filter({
        tipo: "mensalidade",
        status: "atrasado",
        data_vencimento: { $lt: hoje.toISOString() }
      });

      const cooperadosEmAtraso = [];
      
      for (const pagamento of pagamentosAtrasados) {
        try {
          const cooperado = await Cooperado.get(pagamento.cooperado_id);
          const plano = await AssinaturaPlano.get(pagamento.assinatura_plano_id);
          
          const diasAtraso = Math.floor(
            (hoje.getTime() - new Date(pagamento.data_vencimento).getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          
          cooperadosEmAtraso.push({
            cooperado,
            plano,
            pagamento,
            diasAtraso
          });
        } catch (error) {
          console.error(`❌ Erro ao buscar dados do cooperado ${pagamento.cooperado_id}:`, error);
        }
      }

      return cooperadosEmAtraso;
    } catch (error) {
      console.error("❌ Erro ao buscar cooperados em atraso:", error);
      throw error;
    }
  }

  /**
   * Busca cooperados com mensalidades pendentes
   */
  async buscarCooperadosPendentes() {
    try {
      const pagamentosPendentes = await Pagamento.filter({
        tipo: "mensalidade",
        status: "pendente"
      });

      const cooperadosPendentes = [];
      
      for (const pagamento of pagamentosPendentes) {
        try {
          const cooperado = await Cooperado.get(pagamento.cooperado_id);
          const plano = await AssinaturaPlano.get(pagamento.assinatura_plano_id);
          
          cooperadosPendentes.push({
            cooperado,
            plano,
            pagamento
          });
        } catch (error) {
          console.error(`❌ Erro ao buscar dados do cooperado ${pagamento.cooperado_id}:`, error);
        }
      }

      return cooperadosPendentes;
    } catch (error) {
      console.error("❌ Erro ao buscar cooperados pendentes:", error);
      throw error;
    }
  }

  /**
   * Gera relatório de assinaturas
   */
  async gerarRelatorioAssinaturas() {
    try {
      const cooperados = await Cooperado.filter({
        assinatura_plano_id: { $ne: null },
        status: "ativo"
      });

      const cooperadosEmAtraso = await this.buscarCooperadosEmAtraso();
      const cooperadosPendentes = await this.buscarCooperadosPendentes();

      const hoje = new Date();
      const mesAtual = hoje.getFullYear() + "-" + String(hoje.getMonth() + 1).padStart(2, "0");

      // Buscar pagamentos do mês atual
      const pagamentosMesAtual = await Pagamento.filter({
        tipo: "mensalidade",
        mes_referencia: mesAtual
      });

      const pagamentosPagos = pagamentosMesAtual.filter(p => p.status === "pago").length;
      const pagamentosPendentes = pagamentosMesAtual.filter(p => p.status === "pendente").length;
      const pagamentosAtrasados = pagamentosMesAtual.filter(p => p.status === "atrasado").length;

      return {
        totalCooperados: cooperados.length,
        cooperadosEmAtraso: cooperadosEmAtraso.length,
        cooperadosPendentes: cooperadosPendentes.length,
        mesAtual: {
          total: pagamentosMesAtual.length,
          pagos: pagamentosPagos,
          pendentes: pagamentosPendentes,
          atrasados: pagamentosAtrasados
        },
        taxaPagamento: cooperados.length > 0 ? 
          ((pagamentosPagos / cooperados.length) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error("❌ Erro ao gerar relatório de assinaturas:", error);
      throw error;
    }
  }

  /**
   * Notifica sobre cooperados em atraso
   */
  notificarCooperadosEmAtraso(quantidade) {
    console.log(`📢 Notificação: ${quantidade} cooperados em atraso com mensalidades`);
    
    // Aqui você pode integrar com o sistema de notificações
    // Por exemplo, enviar email para administradores
    if (quantidade > 10) {
      toast.warning(`${quantidade} cooperados em atraso com mensalidades!`);
    }
  }

  /**
   * Suspende acesso de cooperados em atraso crítico (30+ dias)
   */
  async suspenderCooperadosEmAtrasoCritico() {
    try {
      const cooperadosEmAtraso = await this.buscarCooperadosEmAtraso();
      const cooperadosCriticos = cooperadosEmAtraso.filter(c => c.diasAtraso >= 30);

      console.log(`🔒 Suspendo acesso de ${cooperadosCriticos.length} cooperados em atraso crítico`);

      for (const item of cooperadosCriticos) {
        try {
          await Cooperado.update(item.cooperado.id, {
            status: "suspenso",
            observacoes: `Acesso suspenso por atraso de ${item.diasAtraso} dias na mensalidade`
          });

          console.log(`🔒 Cooperado ${item.cooperado.nome_completo} suspenso`);
        } catch (error) {
          console.error(`❌ Erro ao suspender cooperado ${item.cooperado.id}:`, error);
        }
      }

      return cooperadosCriticos.length;
    } catch (error) {
      console.error("❌ Erro ao suspender cooperados em atraso crítico:", error);
      throw error;
    }
  }

  /**
   * Reativa acesso de cooperados que pagaram mensalidades em atraso
   */
  async reativarCooperadosPagaram() {
    try {
      const cooperadosSuspensos = await Cooperado.filter({
        status: "suspenso"
      });

      let reativados = 0;

      for (const cooperado of cooperadosSuspensos) {
        try {
          // Verificar se há pagamentos recentes
          const pagamentosRecentes = await Pagamento.filter({
            cooperado_id: cooperado.id,
            tipo: "mensalidade",
            status: "pago",
            data_pagamento: { 
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() 
            }
          });

          if (pagamentosRecentes.length > 0) {
            await Cooperado.update(cooperado.id, {
              status: "ativo",
              observacoes: "Acesso reativado após pagamento de mensalidade em atraso"
            });

            console.log(`✅ Cooperado ${cooperado.nome_completo} reativado`);
            reativados++;
          }
        } catch (error) {
          console.error(`❌ Erro ao verificar cooperado ${cooperado.id}:`, error);
        }
      }

      console.log(`✅ ${reativados} cooperados reativados`);
      return reativados;
    } catch (error) {
      console.error("❌ Erro ao reativar cooperados:", error);
      throw error;
    }
  }
}

// Instância singleton
const assinaturaService = new AssinaturaService();

export default assinaturaService;
