import React, { useState, useEffect } from "react";
import { Cooperado, AssinaturaPlano } from "@/api/entities";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  ShieldCheck, 
  CalendarDays, 
  DollarSign, 
  Loader2, 
  AlertTriangle,
  Info,
  Trash2,
  RotateCcw
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createPageUrl } from "@/utils"; // Corrigido

// ... resto do código de PortalGerenciamentoParticipacao.js (sem alterações na lógica, apenas imports corrigidos) ...
const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>;

const InfoRow = ({ label, value, loading, children }) => (
  <div className="flex justify-between py-3 border-b border-slate-200 last:border-b-0">
    <span className="text-sm text-slate-600">{label}</span>
    {loading ? <Skeleton className="h-5 w-2/5"/> : children || <span className="text-sm font-medium text-slate-800">{value || "-"}</span>}
  </div>
);

export default function PortalGerenciamentoParticipacao() {
  const [cooperado, setCooperado] = useState(null);
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cooperadoId = localStorage.getItem('loggedInCooperadoId');
        if (!cooperadoId) {
          window.location.href = createPageUrl("PortalLogin"); // Usando createPageUrl
          return;
        }
        
        const [cooperadoData] = await Cooperado.filter({ numero_associado: cooperadoId });
        if (!cooperadoData) throw new Error("Cooperado não encontrado.");
        setCooperado(cooperadoData);

        if (cooperadoData.assinatura_plano_id) {
          const planoData = await AssinaturaPlano.get(cooperadoData.assinatura_plano_id);
          setPlano(planoData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da participação:", error);
        toast.error("Erro ao carregar seus dados de participação.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelSubscription = async () => {
    if (!cooperado) return;
    setIsCanceling(true);
    try {
      await Cooperado.update(cooperado.id, { 
        status: "inativo", 
        assinatura_plano_id: null 
      });
      
      setCooperado(prev => ({ ...prev, status: "inativo", assinatura_plano_id: null }));
      setPlano(null); 
      
      toast.success("Sua participação foi cancelada com sucesso.");
    } catch (error) {
      console.error("Erro ao cancelar participação:", error);
      toast.error("Falha ao cancelar sua participação. Tente novamente.");
    } finally {
      setIsCanceling(false);
    }
  };
  
  const handleReactivateSubscription = async () => {
    toast.info("Funcionalidade de reativação em desenvolvimento. Contate o suporte.");
  };


  if (loading) {
    return (
      <PortalLayout currentPageName="PortalGerenciamentoParticipacao">
        <div className="p-8 flex justify-center items-center min-h-[calc(100vh-128px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">Carregando dados da sua participação...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout currentPageName="PortalGerenciamentoParticipacao">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Gerenciar Participação</h1>
          <p className="text-slate-600">Detalhes da sua assinatura e opções de gerenciamento.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600"/>
              Status da Sua Participação
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-200">
            <InfoRow label="Status Atual" loading={loading}>
              <Badge className={`${
                cooperado?.status === "ativo" ? "bg-green-100 text-green-800" :
                cooperado?.status === "inativo" ? "bg-orange-100 text-orange-800" :
                "bg-red-100 text-red-800"
              } text-sm`}>
                {cooperado?.status?.charAt(0).toUpperCase() + cooperado?.status?.slice(1) || "Desconhecido"}
              </Badge>
            </InfoRow>
            <InfoRow label="Data de Inscrição" value={cooperado?.data_inscricao ? format(parseISO(cooperado.data_inscricao), "dd/MM/yyyy") : null} loading={loading} />
            
            {cooperado?.status === "ativo" && plano && (
              <>
                <InfoRow label="Plano de Assinatura" value={plano.nome_plano} loading={loading} />
                <InfoRow label="Valor Mensal" value={`${plano.valor_mensal?.toLocaleString()} Kz`} loading={loading} />
                <InfoRow label="Dia de Vencimento Fixo" value={`Dia ${plano.dia_vencimento_fixo || 15}`} loading={loading} />
              </>
            )}
            
            {cooperado?.status !== "ativo" && (
              <InfoRow label="Motivo da Inatividade" loading={loading}>
                 <span className="text-sm text-orange-700">
                    {cooperado?.status === "inativo" && !cooperado?.assinatura_plano_id ? "Participação cancelada." : "Status inativo."}
                 </span>
              </InfoRow>
            )}
          </CardContent>
        </Card>

        {cooperado?.status === "ativo" && plano && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-600"/>
                Cancelar Participação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-sm">
                Ao cancelar sua participação, você perderá acesso aos benefícios e projetos da cooperativa. 
                Certifique-se de que compreende todas as implicações antes de prosseguir.
              </p>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5"/>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Atenção Importante</h4>
                    <ul className="list-disc list-inside text-xs text-yellow-700 mt-1 space-y-1">
                      <li>Verifique os termos e condições para políticas de reembolso ou taxas.</li>
                      <li>Seu acesso ao portal e aos serviços será revogado.</li>
                      <li>Pagamentos futuros serão interrompidos.</li>
                      <li>Para reativar, pode ser necessário um novo processo de inscrição.</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isCanceling} className="w-full md:w-auto">
                    {isCanceling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Solicitar Cancelamento de Participação
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza de que deseja cancelar sua participação na CoopHabitat? 
                      Esta ação não pode ser desfeita facilmente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCanceling}>Manter Participação</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancelSubscription} 
                      disabled={isCanceling}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isCanceling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Sim, Cancelar Minha Participação
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
        
        {cooperado?.status !== "ativo" && (
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                <RotateCcw className="w-6 h-6 text-green-600"/>
                Reativar Participação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-sm">
                Sua participação está atualmente {cooperado?.status}. Se desejar reativá-la, entre em contato com nosso suporte ou siga as instruções abaixo (se disponíveis).
              </p>
               <Button onClick={handleReactivateSubscription} className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                  Informações sobre Reativação
               </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-lg font-semibold text-slate-700">Dúvidas?</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm">
              Se tiver dúvidas sobre sua participação, planos ou processo de cancelamento, 
              consulte nossa <a href={createPageUrl("PortalFAQ")} className="text-blue-600 hover:underline">página de Perguntas Frequentes (FAQ)</a> ou 
              entre em <a href={createPageUrl("PortalChat")} className="text-blue-600 hover:underline">contato com o suporte</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}