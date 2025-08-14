import { Pagamento, Cooperado, AssinaturaPlano } from "@/api/entities";
import EmailService from "@/components/comunicacao/EmailService";
import { format, differenceInDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

console.log("[CobrancaService] Serviço carregado");

class CobrancaService {
  
  // Verificar se o sistema está configurado para envio de emails
  static isSistemaConfigurado() {
    return EmailService.isConfiguracaoAutomaticaDisponivel();
  }
  
  // Buscar pagamentos em atraso
  static async buscarPagamentosEmAtraso() {
    try {
      console.log("[CobrancaService] Buscando pagamentos em atraso...");
      
      const hoje = new Date();
      const pagamentos = await Pagamento.list();
      
      if (!pagamentos || pagamentos.length === 0) {
        console.log("[CobrancaService] Nenhum pagamento encontrado");
        return [];
      }
      
      const pagamentosEmAtraso = pagamentos.filter(pagamento => {
        // Verificar se é uma mensalidade
        if (pagamento.tipo !== 'mensalidade') return false;
        
        // Verificar se está pendente ou atrasado
        if (!['pendente', 'atrasado'].includes(pagamento.status)) return false;
        
        // Verificar se a data de vencimento já passou
        const dataVencimento = new Date(pagamento.data_vencimento);
        return dataVencimento < hoje;
      });
      
      console.log(`[CobrancaService] Encontrados ${pagamentosEmAtraso.length} pagamentos em atraso`);
      return pagamentosEmAtraso;
      
    } catch (error) {
      console.error("[CobrancaService] Erro ao buscar pagamentos em atraso:", error);
      return [];
    }
  }
  
  // Buscar cooperados com pagamentos em atraso
  static async buscarCooperadosEmAtraso() {
    try {
      console.log("[CobrancaService] Buscando cooperados em atraso...");
      
      const pagamentosEmAtraso = await this.buscarPagamentosEmAtraso();
      const cooperadosEmAtraso = [];
      
      for (const pagamento of pagamentosEmAtraso) {
        try {
          // Buscar dados do cooperado
          const cooperados = await Cooperado.filter({ 
            numero_associado: pagamento.cooperado_id 
          });
          
          if (cooperados && cooperados.length > 0) {
            const cooperado = cooperados[0];
            
            // Buscar dados do plano
            let plano = null;
            if (pagamento.assinatura_plano_id) {
              const planos = await AssinaturaPlano.filter({ 
                id: pagamento.assinatura_plano_id 
              });
              plano = planos && planos.length > 0 ? planos[0] : null;
            }
            
            // Calcular dias em atraso
            const dataVencimento = new Date(pagamento.data_vencimento);
            const diasEmAtraso = differenceInDays(new Date(), dataVencimento);
            
            cooperadosEmAtraso.push({
              cooperado,
              pagamento,
              plano,
              diasEmAtraso,
              dataVencimento
            });
          }
        } catch (cooperadoError) {
          console.warn(`[CobrancaService] Erro ao buscar cooperado ${pagamento.cooperado_id}:`, cooperadoError);
        }
      }
      
      console.log(`[CobrancaService] Encontrados ${cooperadosEmAtraso.length} cooperados em atraso`);
      return cooperadosEmAtraso;
      
    } catch (error) {
      console.error("[CobrancaService] Erro ao buscar cooperados em atraso:", error);
      return [];
    }
  }
  
  // Simular envio de cobrança para email específico
  static async simularCobranca(emailDestino, tipoCobranca = 'cobranca_atraso') {
    try {
      console.log(`[CobrancaService] Simulando cobrança ${tipoCobranca} para ${emailDestino}`);
      
      // Verificar se o sistema está configurado
      if (!this.isSistemaConfigurado()) {
        throw new Error("Sistema de email não configurado. Configure o SMTP primeiro.");
      }
      
      // Dados simulados para teste
      const dadosSimulados = {
        nome_cooperado: "João Silva Santos",
        numero_associado: "CS123456",
        valor_pagamento: "75.000",
        data_vencimento: format(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
        dias_atraso: 15,
        mes_referencia: "2024-01",
        nome_plano: "Plano Habitação Premium",
        valor_mensal: "75.000",
        telefone_cooperativa: '+244 123 456 789',
        email_cooperativa: 'cobranca@coophabitat.ao',
        data_atual: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      };
      
      // Enviar email usando o EmailService
      const resultado = await EmailService.enviarPorEvento(
        tipoCobranca,
        {
          email: emailDestino,
          nome: dadosSimulados.nome_cooperado,
          numero_associado: dadosSimulados.numero_associado
        },
        dadosSimulados
      );
      
      if (resultado) {
        console.log(`[CobrancaService] Email de cobrança simulado enviado com sucesso para ${emailDestino}`);
        return {
          sucesso: true,
          email: emailDestino,
          tipoCobranca,
          dadosSimulados
        };
      } else {
        console.error(`[CobrancaService] Falha ao enviar email de cobrança simulado para ${emailDestino}`);
        return {
          sucesso: false,
          email: emailDestino,
          erro: 'Falha no envio do email'
        };
      }
      
    } catch (error) {
      console.error(`[CobrancaService] Erro ao simular cobrança:`, error);
      return {
        sucesso: false,
        email: emailDestino,
        erro: error.message
      };
    }
  }
  
  // Simular todos os tipos de cobrança para email específico
  static async simularTodosTiposCobranca(emailDestino) {
    try {
      console.log(`[CobrancaService] Simulando todos os tipos de cobrança para ${emailDestino}`);
      
      // Verificar se o sistema está configurado
      if (!this.isSistemaConfigurado()) {
        throw new Error("Sistema de email não configurado. Configure o SMTP primeiro.");
      }
      
      const tiposCobranca = [
        'cobranca_atraso',        // 1-14 dias
        'cobranca_atraso_medio',  // 15-29 dias
        'cobranca_atraso_grave'   // 30+ dias
      ];
      
      const resultados = [];
      
      for (const tipo of tiposCobranca) {
        try {
          const resultado = await this.simularCobranca(emailDestino, tipo);
          resultados.push(resultado);
          
          // Aguardar 2 segundos entre envios
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`[CobrancaService] Erro ao simular ${tipo}:`, error);
          resultados.push({
            sucesso: false,
            email: emailDestino,
            tipoCobranca: tipo,
            erro: error.message
          });
        }
      }
      
      const resumo = {
        total: tiposCobranca.length,
        enviados: resultados.filter(r => r.sucesso).length,
        falhas: resultados.filter(r => !r.sucesso).length,
        resultados
      };
      
      console.log(`[CobrancaService] Simulação concluída: ${resumo.enviados} enviados, ${resumo.falhas} falhas`);
      return resumo;
      
    } catch (error) {
      console.error("[CobrancaService] Erro ao simular todos os tipos:", error);
      return {
        total: 0,
        enviados: 0,
        falhas: 1,
        erro: error.message,
        resultados: []
      };
    }
  }
  
  // Enviar email de cobrança para um cooperado
  static async enviarEmailCobranca(cooperadoData) {
    try {
      const { cooperado, pagamento, plano, diasEmAtraso, dataVencimento } = cooperadoData;
      
      console.log(`[CobrancaService] Enviando email de cobrança para ${cooperado.nome_completo}`);
      
      // Verificar se o sistema está configurado
      if (!this.isSistemaConfigurado()) {
        throw new Error("Sistema de email não configurado. Configure o SMTP primeiro.");
      }
      
      // Preparar dados para o template
      const dadosEmail = {
        nome_cooperado: cooperado.nome_completo,
        numero_associado: cooperado.numero_associado,
        valor_pagamento: pagamento.valor?.toLocaleString() || '0',
        data_vencimento: format(dataVencimento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
        dias_atraso: diasEmAtraso,
        mes_referencia: pagamento.mes_referencia,
        nome_plano: plano?.nome || 'Plano de Assinatura',
        valor_mensal: plano?.valor_mensal?.toLocaleString() || '0',
        telefone_cooperativa: '+244 123 456 789', // Configurável
        email_cooperativa: 'cobranca@coophabitat.ao', // Configurável
        data_atual: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      };
      
      // Determinar o tipo de cobrança baseado nos dias em atraso
      let tipoCobranca = 'cobranca_atraso';
      if (diasEmAtraso >= 30) {
        tipoCobranca = 'cobranca_atraso_grave';
      } else if (diasEmAtraso >= 15) {
        tipoCobranca = 'cobranca_atraso_medio';
      }
      
      // Enviar email usando o EmailService
      const resultado = await EmailService.enviarPorEvento(
        tipoCobranca,
        {
          email: cooperado.email,
          nome: cooperado.nome_completo,
          numero_associado: cooperado.numero_associado
        },
        dadosEmail
      );
      
      if (resultado) {
        console.log(`[CobrancaService] Email de cobrança enviado com sucesso para ${cooperado.nome_completo}`);
        
        // Atualizar status do pagamento para indicar que foi enviado email
        await Pagamento.update(pagamento.id, {
          status: 'atrasado',
          ultima_cobranca: new Date().toISOString(),
          tentativas_cobranca: (pagamento.tentativas_cobranca || 0) + 1
        });
        
        return {
          sucesso: true,
          cooperado: cooperado.nome_completo,
          email: cooperado.email,
          diasEmAtraso,
          tipoCobranca
        };
      } else {
        console.error(`[CobrancaService] Falha ao enviar email de cobrança para ${cooperado.nome_completo}`);
        return {
          sucesso: false,
          cooperado: cooperado.nome_completo,
          email: cooperado.email,
          erro: 'Falha no envio do email'
        };
      }
      
    } catch (error) {
      console.error(`[CobrancaService] Erro ao enviar email de cobrança:`, error);
      return {
        sucesso: false,
        cooperado: cooperadoData.cooperado?.nome_completo || 'Desconhecido',
        email: cooperadoData.cooperado?.email || 'N/A',
        erro: error.message
      };
    }
  }
  
  // Enviar emails de cobrança para todos os cooperados em atraso
  static async enviarCobrancasEmLote() {
    try {
      console.log("[CobrancaService] Iniciando envio de cobranças em lote...");
      
      // Verificar se o sistema está configurado
      if (!this.isSistemaConfigurado()) {
        throw new Error("Sistema de email não configurado. Configure o SMTP primeiro.");
      }
      
      const cooperadosEmAtraso = await this.buscarCooperadosEmAtraso();
      
      if (cooperadosEmAtraso.length === 0) {
        console.log("[CobrancaService] Nenhum cooperado em atraso encontrado");
        return {
          total: 0,
          enviados: 0,
          falhas: 0,
          resultados: []
        };
      }
      
      const resultados = [];
      let enviados = 0;
      let falhas = 0;
      
      for (const cooperadoData of cooperadosEmAtraso) {
        try {
          const resultado = await this.enviarEmailCobranca(cooperadoData);
          resultados.push(resultado);
          
          if (resultado.sucesso) {
            enviados++;
          } else {
            falhas++;
          }
          
          // Aguardar 1 segundo entre envios para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`[CobrancaService] Erro ao processar cobrança:`, error);
          falhas++;
          resultados.push({
            sucesso: false,
            cooperado: cooperadoData.cooperado?.nome_completo || 'Desconhecido',
            erro: error.message
          });
        }
      }
      
      const resumo = {
        total: cooperadosEmAtraso.length,
        enviados,
        falhas,
        resultados
      };
      
      console.log(`[CobrancaService] Lote concluído: ${enviados} enviados, ${falhas} falhas`);
      return resumo;
      
    } catch (error) {
      console.error("[CobrancaService] Erro ao processar lote de cobranças:", error);
      return {
        total: 0,
        enviados: 0,
        falhas: 1,
        erro: error.message,
        resultados: []
      };
    }
  }
  
  // Verificar se deve enviar cobrança (evitar spam)
  static deveEnviarCobranca(pagamento) {
    const hoje = new Date();
    const ultimaCobranca = pagamento.ultima_cobranca ? new Date(pagamento.ultima_cobranca) : null;
    
    // Se nunca foi enviada cobrança, pode enviar
    if (!ultimaCobranca) return true;
    
    // Calcular dias desde a última cobrança
    const diasDesdeUltimaCobranca = differenceInDays(hoje, ultimaCobranca);
    
    // Regras de frequência de cobrança:
    // - Primeira cobrança: imediatamente
    // - Segunda cobrança: após 3 dias
    // - Terceira cobrança: após 7 dias
    // - Cobranças subsequentes: após 15 dias
    
    const tentativas = pagamento.tentativas_cobranca || 0;
    
    if (tentativas === 0) return true; // Primeira cobrança
    if (tentativas === 1 && diasDesdeUltimaCobranca >= 3) return true;
    if (tentativas === 2 && diasDesdeUltimaCobranca >= 7) return true;
    if (tentativas >= 3 && diasDesdeUltimaCobranca >= 15) return true;
    
    return false;
  }
  
  // Gerar relatório de cobranças
  static async gerarRelatorioCobrancas() {
    try {
      const cooperadosEmAtraso = await this.buscarCooperadosEmAtraso();
      
      const relatorio = {
        dataGeracao: new Date().toISOString(),
        totalCooperados: cooperadosEmAtraso.length,
        totalEmAtraso: cooperadosEmAtraso.reduce((sum, item) => sum + (item.pagamento.valor || 0), 0),
        sistemaConfigurado: this.isSistemaConfigurado(),
        cooperados: cooperadosEmAtraso.map(item => ({
          nome: item.cooperado.nome_completo,
          numeroAssociado: item.cooperado.numero_associado,
          email: item.cooperado.email,
          valor: item.pagamento.valor,
          diasEmAtraso: item.diasEmAtraso,
          dataVencimento: item.dataVencimento,
          mesReferencia: item.pagamento.mes_referencia,
          ultimaCobranca: item.pagamento.ultima_cobranca,
          tentativasCobranca: item.pagamento.tentativas_cobranca || 0
        }))
      };
      
      return relatorio;
      
    } catch (error) {
      console.error("[CobrancaService] Erro ao gerar relatório:", error);
      return null;
    }
  }
}

export default CobrancaService; 