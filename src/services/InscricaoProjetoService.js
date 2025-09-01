import { InscricaoProjeto, Projeto, Cooperado } from "@/api/entities";
import { supabase } from "@/api/supabaseClient";
import { toast } from "sonner";

class InscricaoProjetoService {
  /**
   * Busca todos os projetos disponíveis para inscrição
   */
  async buscarProjetosDisponiveis() {
    try {
      const projetos = await Projeto.filter({
        status: { $in: ["planeamento", "construcao"] }
      });

      return projetos.filter(projeto => {
        // Verificar se o projeto ainda aceita inscrições
        const hoje = new Date();
        const dataPrevisao = new Date(projeto.data_previsao_entrega);
        
        // Projeto disponível se ainda não foi entregue e não está muito próximo da entrega
        return dataPrevisao > hoje;
      });
    } catch (error) {
      console.error("❌ Erro ao buscar projetos disponíveis:", error);
      throw error;
    }
  }

  /**
   * Verifica se um cooperado já se inscreveu em um projeto específico
   */
  async verificarInscricaoExistente(cooperadoId, projectId) {
    try {
      const inscricoes = await InscricaoProjeto.filter({
        cooperado_id: cooperadoId,
        project_id: projectId
      });

      return inscricoes.length > 0 ? inscricoes[0] : null;
    } catch (error) {
      console.error("❌ Erro ao verificar inscrição existente:", error);
      throw error;
    }
  }

  /**
   * Cria uma nova inscrição em projeto
   */
  async criarInscricao(dadosInscricao) {
    try {
      const {
        project_id,
        cooperado_id,
        valor_interesse,
        forma_pagamento,
        prazo_interesse,
        observacoes,
        documentos_anexados = []
      } = dadosInscricao;

      // Verificar se já existe inscrição
      const inscricaoExistente = await this.verificarInscricaoExistente(cooperado_id, project_id);
      if (inscricaoExistente) {
        throw new Error("Você já se inscreveu neste projeto");
      }

      // Verificar se o projeto ainda está disponível
      const projeto = await Projeto.get(project_id);
      if (!projeto || projeto.status === "entregue") {
        throw new Error("Este projeto não está mais disponível para inscrições");
      }

      // Criar inscrição
      const novaInscricao = {
        project_id,
        cooperado_id,
        status: "pendente",
        data_inscricao: new Date().toISOString(),
        valor_interesse,
        forma_pagamento,
        prazo_interesse,
        observacoes,
        documentos_anexados,
        prioridade: 5
      };

      const inscricaoCriada = await InscricaoProjeto.create(novaInscricao);
      
      console.log("✅ Inscrição criada:", inscricaoCriada);
      return inscricaoCriada;
    } catch (error) {
      console.error("❌ Erro ao criar inscrição:", error);
      throw error;
    }
  }

  /**
   * Criar inscrição em projeto (método alternativo usando Supabase diretamente)
   */
  async criarInscricaoAlternativo(dadosInscricao) {
    try {
      console.log("🔄 Criando inscrição (método alternativo)...");
      console.log("📊 Dados recebidos:", dadosInscricao);

      const {
        project_id,
        cooperado_id,
        valor_interesse,
        forma_pagamento,
        prazo_interesse,
        observacoes,
        documentos_anexados = []
      } = dadosInscricao;

      // Verificar se já existe inscrição
      const inscricaoExistente = await this.verificarInscricaoExistente(cooperado_id, project_id);
      if (inscricaoExistente) {
        throw new Error("Você já se inscreveu neste projeto");
      }

      // Verificar se o projeto ainda está disponível
      const projeto = await Projeto.get(project_id);
      if (!projeto || projeto.status === "entregue") {
        throw new Error("Este projeto não está mais disponível para inscrições");
      }

      // Criar inscrição usando cliente Supabase diretamente
      const { data: inscricaoCriada, error } = await supabase
        .from('inscricao_projeto')
        .insert({
          project_id,
          cooperado_id,
          status: "pendente",
          data_inscricao: new Date().toISOString(),
          valor_interesse,
          forma_pagamento,
          prazo_interesse,
          observacoes,
          documentos_anexados,
          prioridade: 5
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Erro Supabase:", error);
        throw new Error(`Erro ao criar inscrição: ${error.message}`);
      }

      console.log("✅ Inscrição criada (método alternativo):", inscricaoCriada);
      return inscricaoCriada;
    } catch (error) {
      console.error("❌ Erro ao criar inscrição (método alternativo):", error);
      throw error;
    }
  }

  /**
   * Busca todas as inscrições de um cooperado
   */
  async buscarInscricoesCooperado(cooperadoId) {
    try {
      const inscricoes = await InscricaoProjeto.filter({
        cooperado_id: cooperadoId
      });

      // Buscar dados dos projetos para cada inscrição
      const inscricoesComProjetos = await Promise.all(
        inscricoes.map(async (inscricao) => {
          try {
            const projeto = await Projeto.get(inscricao.project_id);
            return {
              ...inscricao,
              projeto
            };
          } catch (error) {
            console.error(`❌ Erro ao buscar projeto ${inscricao.project_id}:`, error);
            return {
              ...inscricao,
              projeto: null
            };
          }
        })
      );

      return inscricoesComProjetos;
    } catch (error) {
      console.error("❌ Erro ao buscar inscrições do cooperado:", error);
      throw error;
    }
  }

  /**
   * Busca todas as inscrições pendentes (para administradores)
   */
  async buscarInscricoesPendentes() {
    try {
      const inscricoes = await InscricaoProjeto.filter({
        status: "pendente"
      });

      // Buscar dados completos
      const inscricoesCompletas = await Promise.all(
        inscricoes.map(async (inscricao) => {
          try {
            const [projeto, cooperado] = await Promise.all([
              Projeto.get(inscricao.project_id),
              Cooperado.get(inscricao.cooperado_id)
            ]);

            return {
              ...inscricao,
              projeto,
              cooperado
            };
          } catch (error) {
            console.error(`❌ Erro ao buscar dados da inscrição ${inscricao.id}:`, error);
            return {
              ...inscricao,
              projeto: null,
              cooperado: null
            };
          }
        })
      );

      return inscricoesCompletas;
    } catch (error) {
      console.error("❌ Erro ao buscar inscrições pendentes:", error);
      throw error;
    }
  }

  /**
   * Busca todas as inscrições (para administradores)
   */
  async buscarTodasInscricoes(filtros = {}) {
    try {
      let query = {};
      
      if (filtros.status && filtros.status !== "todos") {
        query.status = filtros.status;
      }
      
      if (filtros.project_id) {
        query.project_id = filtros.project_id;
      }

      const inscricoes = await InscricaoProjeto.filter(query);

      // Buscar dados completos
      const inscricoesCompletas = await Promise.all(
        inscricoes.map(async (inscricao) => {
          try {
            const [projeto, cooperado] = await Promise.all([
              Projeto.get(inscricao.project_id),
              Cooperado.get(inscricao.cooperado_id)
            ]);

            return {
              ...inscricao,
              projeto,
              cooperado
            };
          } catch (error) {
            console.error(`❌ Erro ao buscar dados da inscrição ${inscricao.id}:`, error);
            return {
              ...inscricao,
              projeto: null,
              cooperado: null
            };
          }
        })
      );

      return inscricoesCompletas;
    } catch (error) {
      console.error("❌ Erro ao buscar todas as inscrições:", error);
      throw error;
    }
  }

  /**
   * Aprova uma inscrição
   */
  async aprovarInscricao(inscricaoId, administradorId, observacoes = "") {
    try {
      const inscricao = await InscricaoProjeto.get(inscricaoId);
      
      if (!inscricao) {
        throw new Error("Inscrição não encontrada");
      }

      if (inscricao.status !== "pendente") {
        throw new Error("Apenas inscrições pendentes podem ser aprovadas");
      }

      const inscricaoAtualizada = await InscricaoProjeto.update(inscricaoId, {
        status: "aprovado",
        data_aprovacao: new Date().toISOString(),
        aprovado_por: administradorId,
        observacoes: observacoes || inscricao.observacoes
      });

      console.log("✅ Inscrição aprovada:", inscricaoAtualizada);
      return inscricaoAtualizada;
    } catch (error) {
      console.error("❌ Erro ao aprovar inscrição:", error);
      throw error;
    }
  }

  /**
   * Rejeita uma inscrição
   */
  async rejeitarInscricao(inscricaoId, administradorId, motivoRejeicao, observacoes = "") {
    try {
      const inscricao = await InscricaoProjeto.get(inscricaoId);
      
      if (!inscricao) {
        throw new Error("Inscrição não encontrada");
      }

      if (inscricao.status !== "pendente") {
        throw new Error("Apenas inscrições pendentes podem ser rejeitadas");
      }

      if (!motivoRejeicao) {
        throw new Error("Motivo da rejeição é obrigatório");
      }

      const inscricaoAtualizada = await InscricaoProjeto.update(inscricaoId, {
        status: "rejeitado",
        data_aprovacao: new Date().toISOString(),
        aprovado_por: administradorId,
        motivo_rejeicao: motivoRejeicao,
        observacoes: observacoes || inscricao.observacoes
      });

      console.log("❌ Inscrição rejeitada:", inscricaoAtualizada);
      return inscricaoAtualizada;
    } catch (error) {
      console.error("❌ Erro ao rejeitar inscrição:", error);
      throw error;
    }
  }

  /**
   * Cancela uma inscrição (apenas pelo cooperado)
   */
  async cancelarInscricao(inscricaoId, cooperadoId) {
    try {
      const inscricao = await InscricaoProjeto.get(inscricaoId);
      
      if (!inscricao) {
        throw new Error("Inscrição não encontrada");
      }

      if (inscricao.cooperado_id !== cooperadoId) {
        throw new Error("Você só pode cancelar suas próprias inscrições");
      }

      if (inscricao.status !== "pendente") {
        throw new Error("Apenas inscrições pendentes podem ser canceladas");
      }

      // Deletar a inscrição
      await InscricaoProjeto.delete(inscricaoId);

      console.log("🗑️ Inscrição cancelada:", inscricaoId);
      return true;
    } catch (error) {
      console.error("❌ Erro ao cancelar inscrição:", error);
      throw error;
    }
  }

  /**
   * Gera relatório de inscrições
   */
  async gerarRelatorioInscricoes() {
    try {
      const todasInscricoes = await this.buscarTodasInscricoes();
      
      const estatisticas = {
        total: todasInscricoes.length,
        pendentes: todasInscricoes.filter(i => i.status === "pendente").length,
        aprovadas: todasInscricoes.filter(i => i.status === "aprovado").length,
        rejeitadas: todasInscricoes.filter(i => i.status === "rejeitado").length,
        porProjeto: {},
        porMes: {}
      };

      // Estatísticas por projeto
      todasInscricoes.forEach(inscricao => {
        const projetoNome = inscricao.projeto?.nome || "Projeto Desconhecido";
        if (!estatisticas.porProjeto[projetoNome]) {
          estatisticas.porProjeto[projetoNome] = {
            total: 0,
            pendentes: 0,
            aprovadas: 0,
            rejeitadas: 0
          };
        }
        
        estatisticas.porProjeto[projetoNome].total++;
        estatisticas.porProjeto[projetoNome][inscricao.status]++;
      });

      // Estatísticas por mês
      todasInscricoes.forEach(inscricao => {
        const mes = new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long' 
        });
        
        if (!estatisticas.porMes[mes]) {
          estatisticas.porMes[mes] = 0;
        }
        estatisticas.porMes[mes]++;
      });

      return estatisticas;
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
      throw error;
    }
  }

  /**
   * Busca inscrições por projeto
   */
  async buscarInscricoesPorProjeto(projectId) {
    try {
      const inscricoes = await InscricaoProjeto.filter({
        project_id: projectId
      });

      // Buscar dados dos cooperados
      const inscricoesComCooperados = await Promise.all(
        inscricoes.map(async (inscricao) => {
          try {
            const cooperado = await Cooperado.get(inscricao.cooperado_id);
            return {
              ...inscricao,
              cooperado
            };
          } catch (error) {
            console.error(`❌ Erro ao buscar cooperado ${inscricao.cooperado_id}:`, error);
            return {
              ...inscricao,
              cooperado: null
            };
          }
        })
      );

      return inscricoesComCooperados;
    } catch (error) {
      console.error("❌ Erro ao buscar inscrições por projeto:", error);
      throw error;
    }
  }
}

// Instância singleton
const inscricaoProjetoService = new InscricaoProjetoService();

export default inscricaoProjetoService;
