import React, { useState, useEffect } from "react";
import { Inscricao, InscricaoPublica, Cooperado, CooperadoAuth, Pagamento, AssinaturaPlano } from "@/api/entities";
import EmailService from "../components/comunicacao/EmailService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserCheck, 
  FileText, 
  Calendar,
  Check,
  X,
  Eye,
  AlertCircle,
  Clock,
  Copy
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import InscricaoCard from "../components/inscricoes/InscricaoCard";
import DetalhesInscricao from "../components/inscricoes/DetalhesInscricao";

// Função para gerar uma senha temporária segura
const gerarSenhaTemporaria = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let senha = '';
  for (let i = 0; i < length; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
};

export default function Inscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [filteredInscricoes, setFilteredInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInscricao, setSelectedInscricao] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [newCredentials, setNewCredentials] = useState({ numero: "", senha: "", email: "", nome: "" });

  useEffect(() => {
    loadInscricoes();
  }, []);

  useEffect(() => {
    filterInscricoes();
  }, [inscricoes, searchTerm]);

  const loadInscricoes = async () => {
    try {
      console.log("Carregando inscrições...");

      // Carregar tanto inscrições antigas quanto públicas
      const [inscricoesAntigas, inscricoesPublicas] = await Promise.all([
        Inscricao.list().catch((error) => {
          console.log("Erro ao carregar inscrições antigas:", error);
          return [];
        }),
        InscricaoPublica.list().catch((error) => {
          console.log("Erro ao carregar inscrições públicas:", error);
          return [];
        })
      ]);

      // Combinar e padronizar as inscrições
      const todasInscricoes = [
        ...(Array.isArray(inscricoesAntigas) ? inscricoesAntigas : []),
        ...(Array.isArray(inscricoesPublicas) ? inscricoesPublicas.map(inscricao => ({
          ...inscricao,
          fonte: 'publica' // Marcar origem
        })) : [])
      ];

      console.log(`Carregadas ${todasInscricoes.length} inscrições`);
      setInscricoes(todasInscricoes);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
      toast.error("Erro ao carregar inscrições");
    } finally {
      setLoading(false);
    }
  };

  const filterInscricoes = () => {
    const filtered = inscricoes.filter(inscricao =>
      inscricao.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscricao.bi?.includes(searchTerm)
    );
    setFilteredInscricoes(filtered);
  };

  const aprovarInscricao = async (inscricao) => {
    setProcessing(true);
    try {
      // Verificar se já existe um cooperado com este email
      let cooperadoExistente = null;
      try {
        cooperadoExistente = await Cooperado.findOne({ where: { email: inscricao.email } });
        console.log("⚠️ Cooperado já existe:", cooperadoExistente);
      } catch (error) {
        console.log("✅ Email não encontrado, pode criar novo cooperado");
      }

      if (cooperadoExistente) {
        toast.error(`Já existe um cooperado com o email ${inscricao.email}. Não é possível aprovar esta inscrição.`);
        setProcessing(false);
        return;
      }

      // Gerar número de associado
      const numeroAssociado = `CS${Date.now().toString().slice(-6)}`;

      // Criar cooperado primeiro para obter o ID
      const cooperadoCriado = await Cooperado.create({
        numero_associado: numeroAssociado,
        nome_completo: inscricao.nome_completo,
        email: inscricao.email,
        telefone: inscricao.telefone,
        bi: inscricao.bi || 'Não informado',
        data_nascimento: inscricao.data_nascimento || new Date().toISOString().split('T')[0],
        profissao: inscricao.profissao || 'Não informado',
        renda_mensal: inscricao.renda_mensal || 0,
        provincia: inscricao.provincia || 'Não informado',
        municipio: inscricao.municipio || 'Não informado',
        comuna: inscricao.comuna || null,
        endereco_completo: inscricao.endereco_completo || 'Não informado',
        data_inscricao: inscricao.created_at,
        assinatura_plano_id: inscricao.assinatura_plano_id || inscricao.plano_interesse || null,
        status: "ativo",
        estado_civil: inscricao.estado_civil || "solteiro",
        nacionalidade: inscricao.nacionalidade || "Angolana",
        sector_profissional: inscricao.sector_profissional || "privado",
        nome_conjuge: inscricao.nome_conjuge || null,
        tem_filhos: inscricao.tem_filhos || false,
        numero_filhos: inscricao.numero_filhos || 0,
        validade_documento_bi: inscricao.validade_documento_bi || null,
        entidade_publica: inscricao.entidade_publica || inscricao.entidade || null,
        entidade_privada: inscricao.entidade_privada || null,
        documentos_anexados: inscricao.documentos_anexados || null,
        taxa_inscricao_paga: inscricao.taxa_inscricao_paga || false,
        observacoes: inscricao.observacoes || null
      });

      // Gerar e salvar credenciais de acesso usando o ID do cooperado criado
      const senhaTemporaria = gerarSenhaTemporaria();
      console.log("🔐 Tentando criar credenciais para cooperado:", cooperadoCriado.id);
      console.log("📧 Email:", inscricao.email);
      console.log("🔑 Senha temporária:", senhaTemporaria);
      
      try {
        // Tentar criar nova credencial
        console.log("📝 Tentando criar nova credencial...");
        const credencialCriada = await CooperadoAuth.create({
          cooperado_id: cooperadoCriado.id, // Usar o ID UUID do cooperado criado
          email: inscricao.email,
          senha_hash: senhaTemporaria,
          status: 'ativo'
        });
        console.log("✅ Credencial criada com sucesso:", credencialCriada);
      } catch (error) {
        console.log("⚠️ Erro ao criar credencial:", error.message);
        // Se falhar por email duplicado ou cooperado_id duplicado, atualizar a credencial existente
        if (error.message && (error.message.includes('duplicate key value') || error.message.includes('cooperado_id_key'))) {
          console.log("🔄 Credencial existente encontrada, atualizando...");
          const credencialAtualizada = await CooperadoAuth.update(inscricao.email, {
            cooperado_id: cooperadoCriado.id,
            senha_hash: senhaTemporaria,
            status: 'ativo'
          });
          console.log("✅ Credencial atualizada com sucesso:", credencialAtualizada);
        } else {
          console.error("❌ Erro não tratado:", error);
          throw error; // Re-throw se for outro tipo de erro
        }
      }

      // Buscar informações do plano para criar pagamento
      const planoId = inscricao.assinatura_plano_id || inscricao.plano_interesse;
      let taxaInscricao = 50000; // Valor padrão
      
      if (planoId) {
        try {
          const plano = await AssinaturaPlano.get(planoId);
          if (plano && plano.taxa_inscricao) {
            taxaInscricao = plano.taxa_inscricao;
          }
        } catch (error) {
          console.log("Erro ao buscar plano, usando valor padrão:", error.message);
        }
      }

      // Buscar informações do plano para o e-mail
      let nomePlano = "Plano Básico";
      if (planoId) {
        try {
          const plano = await AssinaturaPlano.get(planoId);
          if (plano && plano.nome) {
            nomePlano = plano.nome;
          }
        } catch (error) {
          console.log("Erro ao buscar nome do plano:", error.message);
        }
      }

      // Enviar e-mail de boas-vindas com credenciais
      try {
        console.log("📧 Enviando e-mail de boas-vindas para:", inscricao.email);
        
        await EmailService.enviarPorEvento("boas_vindas_cooperado", {
          email: inscricao.email,
          nome_completo: inscricao.nome_completo
        }, {
          nome_cooperado: inscricao.nome_completo,
          numero_associado: numeroAssociado,
          email_cooperado: inscricao.email,
          nome_plano: nomePlano,
          data_aprovacao: new Date().toLocaleDateString('pt-BR'),
          senha_temporaria: senhaTemporaria
        });
        
        console.log("✅ E-mail de boas-vindas enviado com sucesso");

        // Log do e-mail enviado
        console.log(`[Inscricoes] E-mail de boas-vindas enviado para: ${inscricao.email}`);

      } catch (emailError) {
        console.error("❌ Erro ao enviar e-mail de boas-vindas:", emailError);
        toast.error("Cooperado criado, mas erro ao enviar e-mail de boas-vindas");
        
        // Log do erro
        console.error(`[Inscricoes] Erro ao enviar e-mail para: ${inscricao.email}`, emailError);
      }

      // Criar pagamento pendente para taxa de inscrição
      await Pagamento.create({
        cooperado_id: cooperadoCriado.id, // Usar o ID UUID do cooperado criado
        assinatura_plano_id: planoId,
        valor: taxaInscricao,
        data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
        tipo: "taxa_inscricao",
        status: "pendente",
        metodo_pagamento: "pendente", // Campo obrigatório
        referencia: `TAXA-${numeroAssociado}-${Date.now()}`,
        observacoes: {
          descricao: `Taxa de inscrição - ${inscricao.nome_completo}`,
          gerado_automaticamente: true,
          data_aprovacao: new Date().toISOString()
        }
      });

      // Notificação de aprovação
      console.log(`✅ Inscrição de ${inscricao.nome_completo} foi aprovada e cooperado criado.`);

      // Atualizar status da inscrição
      if (inscricao.fonte === 'publica') {
        await InscricaoPublica.update(inscricao.id, { 
          status: "aprovada",
          processado_por: { nome: "Admin", email: "admin@sistema.com" },
          data_processamento: new Date().toISOString()
        });
      } else {
        await Inscricao.update(inscricao.id, {
          status: "aprovada",
          data_aprovacao: new Date().toISOString().split('T')[0],
          aprovado_por: "admin@sistema.com"
        });
      }

      // Mostrar credenciais para cópia manual
      setNewCredentials({
        numero: numeroAssociado,
        senha: senhaTemporaria,
        email: inscricao.email,
        nome: inscricao.nome_completo,
        taxaInscricao: taxaInscricao
      });
      setShowCredentials(true);
      
      toast.success(`Inscrição aprovada! Cooperado criado, e-mail de boas-vindas enviado e pagamento de ${taxaInscricao.toLocaleString()} Kz criado.`);
      loadInscricoes();
      setShowDetails(false);

    } catch (error) {
      console.error("Erro ao aprovar inscrição:", error);
      toast.error("Erro ao aprovar inscrição: " + (error.message || "Erro desconhecido"));
    } finally {
      setProcessing(false);
    }
  };

  const rejeitarInscricao = async (inscricao, motivo) => {
    setProcessing(true);
    try {
      // Atualizar status da inscrição dependendo da origem
      if (inscricao.fonte === 'publica') {
        await InscricaoPublica.update(inscricao.id, {
          status: "rejeitada",
          observacoes: motivo,
          processado_por: { nome: "Admin", email: "admin@sistema.com" },
          data_processamento: new Date().toISOString()
        });
      } else {
        await Inscricao.update(inscricao.id, {
          status: "rejeitada",
          observacoes: motivo
        });
      }

      // Enviar e-mail de rejeição usando o sistema de eventos
      await EmailService.enviarPorEvento("rejeicao_inscricao", {
        email: inscricao.email,
        nome_completo: inscricao.nome_completo
      }, {
        nome_completo: inscricao.nome_completo,
        motivo_rejeicao: motivo
      });

      toast.success("Inscrição rejeitada. E-mail de notificação adicionado à fila.");
      loadInscricoes();
      setShowDetails(false);
    } catch (error) {
      console.error("Erro ao rejeitar inscrição:", error);
      toast.error("Erro ao rejeitar inscrição: " + (error.message || "Erro desconhecido"));
    } finally {
      setProcessing(false);
    }
  };

  const copyCredentials = () => {
    const text = `Prezado(a) ${newCredentials.nome},

Seja bem-vindo(a) à CoopHabitat! A sua inscrição foi aprovada com sucesso.

As suas credenciais de acesso são:
- ID de Cooperado: ${newCredentials.numero}
- Senha Temporária: ${newCredentials.senha}

Pagamento Pendente:
- Tipo: Taxa de Inscrição
- Valor: ${newCredentials.taxaInscricao ? `${newCredentials.taxaInscricao.toLocaleString()} Kz` : 'N/A'}
- Status: Pendente
- Vencimento: 30 dias

Acesse o portal em: http://localhost:5173/portal/login

Atenciosamente,
Equipe CoopHabitat`;
    
    navigator.clipboard.writeText(text);
    toast.success("Mensagem com credenciais e pagamento copiada!");
  };

  const pendentes = filteredInscricoes.filter(i => i.status === "pendente");
  const processadas = filteredInscricoes.filter(i => i.status !== "pendente");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Carregando inscrições...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestão de Inscrições</h1>
          <p className="text-slate-600 mt-1">Analise e aprove novas inscrições recebidas</p>
        </div>
        <div className="flex items-center gap-3">
          {pendentes.length > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg border border-orange-200">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">{pendentes.length} Pendente{pendentes.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {inscricoes.length} Total
          </Badge>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-800">{inscricoes.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{pendentes.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Aprovadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {inscricoes.filter(i => i.status === "aprovada").length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-600 opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Rejeitadas</p>
                <p className="text-2xl font-bold text-red-600">
                  {inscricoes.filter(i => i.status === "rejeitada").length}
                </p>
              </div>
              <X className="w-8 h-8 text-red-600 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Pesquisar por nome, email ou BI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerta para Inscrições Pendentes */}
      {pendentes.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  {pendentes.length} inscrição{pendentes.length !== 1 ? 'ões' : ''} aguardando análise
                </h3>
                <p className="text-sm text-orange-600">
                  Revise e processe as inscrições pendentes para manter o fluxo de novos cooperados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inscrições Pendentes */}
      {pendentes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Inscrições Pendentes ({pendentes.length})
          </h2>
          <div className="grid gap-4">
            {pendentes.map((inscricao) => (
              <InscricaoCard
                key={`${inscricao.fonte || 'antiga'}-${inscricao.id}`}
                inscricao={inscricao}
                onViewDetails={() => {
                  setSelectedInscricao(inscricao);
                  setShowDetails(true);
                }}
                onAprovar={() => aprovarInscricao(inscricao)}
                onRejeitar={(motivo) => rejeitarInscricao(inscricao, motivo)}
                processing={processing}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inscrições Processadas */}
      {processadas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Histórico de Inscrições ({processadas.length})
          </h2>
          <div className="grid gap-4">
            {processadas.map((inscricao) => (
              <InscricaoCard
                key={`${inscricao.fonte || 'antiga'}-${inscricao.id}`}
                inscricao={inscricao}
                onViewDetails={() => {
                  setSelectedInscricao(inscricao);
                  setShowDetails(true);
                }}
                readonly={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {filteredInscricoes.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            {searchTerm ? "Nenhuma inscrição encontrada" : "Nenhuma inscrição recebida ainda"}
          </h3>
          <p className="text-slate-500">
            {searchTerm
              ? "Tente ajustar os termos de pesquisa."
              : "As inscrições feitas através da página pública aparecerão aqui."}
          </p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {console.log("Renderizando modal, showDetails:", showDetails, "selectedInscricao:", selectedInscricao?.nome_completo)}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Inscrição
              {selectedInscricao?.fonte === 'publica' && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  Pública
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedInscricao && (
            <DetalhesInscricao
              inscricao={selectedInscricao}
              onAprovar={() => aprovarInscricao(selectedInscricao)}
              onRejeitar={(motivo) => rejeitarInscricao(selectedInscricao, motivo)}
              processing={processing}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para mostrar credenciais geradas */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">✅ Cooperado Criado com Sucesso!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Credenciais Geradas:</h3>
              <div className="space-y-2 font-mono text-sm">
                <p><strong>Nome:</strong> {newCredentials.nome}</p>
                <p><strong>E-mail:</strong> {newCredentials.email}</p>
                <p><strong>ID Cooperado:</strong> {newCredentials.numero}</p>
                <p><strong>Senha:</strong> {newCredentials.senha}</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Pagamento Criado:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Tipo:</strong> Taxa de Inscrição</p>
                <p><strong>Valor:</strong> {newCredentials.taxaInscricao ? `${newCredentials.taxaInscricao.toLocaleString()} Kz` : 'N/A'}</p>
                <p><strong>Status:</strong> Pendente</p>
                <p><strong>Vencimento:</strong> 30 dias</p>
                <p className="text-xs text-yellow-600">
                  O cooperado poderá acessar o portal e realizar o pagamento da taxa de inscrição.
                </p>
              </div>
            </div>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  ✅ <strong>E-mail enviado:</strong> O e-mail de boas-vindas com credenciais foi enviado automaticamente para {newCredentials.email}.
                  Você também pode copiar as credenciais abaixo para envio manual se necessário.
                </p>
              </div>
            <div className="flex gap-2">
              <Button onClick={copyCredentials} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Credenciais
              </Button>
              <Button variant="outline" onClick={() => setShowCredentials(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}