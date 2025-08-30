import React, { useState, useEffect } from "react";
import { Inscricao, InscricaoPublica, Cooperado, CooperadoAuth, EmailLog } from "@/api/entities";
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
      // Criar cooperado automaticamente
      const numeroAssociado = `CS${Date.now().toString().slice(-6)}`;
      await Cooperado.create({
        numero_associado: numeroAssociado,
        nome_completo: inscricao.nome_completo,
        email: inscricao.email,
        telefone: inscricao.telefone,
        bi: inscricao.bi,
        data_nascimento: inscricao.data_nascimento || new Date().toISOString().split('T')[0],
        profissao: inscricao.profissao,
        renda_mensal: inscricao.renda_mensal,
        provincia: inscricao.provincia,
        municipio: inscricao.municipio,
        endereco_completo: inscricao.endereco_completo,
        data_inscricao: inscricao.created_at,
        // documentos_urls: inscricao.documentos_anexados ? Object.values(inscricao.documentos_anexados).filter(url => url) : [],
        assinatura_plano_id: inscricao.plano_interesse,
        status: "ativo",
        estado_civil: "solteiro",
        nacionalidade: "Angolana",
        sector_profissional: "privado"
      });

      // Gerar e salvar credenciais de acesso
      const senhaTemporaria = gerarSenhaTemporaria();
      await CooperadoAuth.create({
        cooperado_id: numeroAssociado,
        password_hash: senhaTemporaria,
        two_factor_enabled: false,
        account_locked: false,
        login_attempts: 0,
      });

      // Enviar e-mails automaticamente usando o sistema de eventos
      await EmailService.enviarPorEvento("aprovacao_inscricao", {
        email: inscricao.email,
        nome_completo: inscricao.nome_completo
      }, {
        nome_completo: inscricao.nome_completo
      });

      await EmailService.enviarPorEvento("credenciais_acesso", {
        email: inscricao.email,
        nome_completo: inscricao.nome_completo,
        numero_associado: numeroAssociado
      }, {
        nome_completo: inscricao.nome_completo,
        numero_associado: numeroAssociado,
        senha_temporaria: senhaTemporaria
      });

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
        nome: inscricao.nome_completo
      });
      setShowCredentials(true);
      
      toast.success("Inscrição aprovada! E-mails adicionados à fila de envio.");
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

Acesse o portal em: [URL do Portal]

Atenciosamente,
Equipe CoopHabitat`;
    
    navigator.clipboard.writeText(text);
    toast.success("Mensagem copiada para a área de transferência!");
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
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                ✅ <strong>E-mails programados:</strong> Os e-mails de aprovação e credenciais foram adicionados à fila de envio automático.
                Você também pode copiar as credenciais abaixo para envio manual.
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