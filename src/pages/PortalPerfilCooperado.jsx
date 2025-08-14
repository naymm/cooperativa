import React, { useState, useEffect } from "react";
import { Cooperado, AssinaturaPlano } from "@/api/entities";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  FileText,
  Edit3,
  Loader2,
  ShieldCheck,
  KeyRound,
  Users,
  Upload
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import FormEdicaoPerfil from "@/components/portal/FormEdicaoPerfil";
import FormUploadDocumentos from "@/components/portal/FormUploadDocumentos";

// ... resto do código de PortalPerfilCooperado.js (sem alterações na lógica, apenas imports corrigidos) ...
const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>;

const InfoItem = ({ label, value, icon: Icon, loading, children }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    {loading ? <Skeleton className="h-5 w-3/4" /> : children || <p className="text-slate-800 font-medium">{value || "-"}</p>}
  </div>
);

const DocumentLink = ({ docUrl, docName, loading, required = false }) => {
  if (loading) return <Skeleton className="h-8 w-full" />;
  
  if (!docUrl) {
    return (
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-sm">{docName}</span>
          {required && <span className="text-red-500 text-xs">*</span>}
        </div>
        <span className="text-slate-400 text-xs italic">Não anexado</span>
      </div>
    );
  }
  
  return (
    <a 
      href={docUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center justify-between p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-700 text-sm border border-green-200"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{docName}</span>
        {required && <span className="text-red-500 text-xs">*</span>}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs">Ver documento</span>
        <FileText className="w-3 h-3"/>
      </div>
    </a>
  );
}

export default function PortalPerfilCooperado() {
  const [cooperado, setCooperado] = useState(null);
  const [planoAssinatura, setPlanoAssinatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // const [showPasswordModal, setShowPasswordModal] = useState(false);

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
          const plano = await AssinaturaPlano.get(cooperadoData.assinatura_plano_id);
          setPlanoAssinatura(plano);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        toast.error("Erro ao carregar seus dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestUpdate = () => {
    setShowEditModal(true);
  };

  const handleUploadDocuments = () => {
    setShowUploadModal(true);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // Atualizar o estado local com os novos dados
      setCooperado(prev => ({ ...prev, ...updatedData }));
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
              console.error("Erro ao atualizar perfil:", error);
        toast.error("Erro ao atualizar perfil.");
      }
    };

    const handleSaveDocuments = async (updatedDocuments) => {
      try {
        // Atualizar o estado local com os novos documentos
        setCooperado(prev => ({
          ...prev,
          documentos_anexados: {
            ...prev.documentos_anexados,
            ...updatedDocuments
          }
        }));
        toast.success("Documentos atualizados com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar documentos:", error);
        toast.error("Erro ao atualizar documentos.");
      }
    };

  return (
    <PortalLayout currentPageName="PortalPerfilCooperado">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Meu Perfil</h1>
            <p className="text-slate-600">Visualize e gerencie suas informações pessoais.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRequestUpdate} disabled={loading}>
              <Edit3 className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
            {/* <Button variant="outline" onClick={() => setShowPasswordModal(true)} disabled={loading}>
              <KeyRound className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button> */}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cartão Principal do Cooperado */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col sm:flex-row items-center gap-4">
                 {loading ? (
                    <Skeleton className="w-24 h-24 rounded-full" />
                  ) : (
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage src={cooperado?.documentos_anexados?.foto_passe} alt={cooperado?.nome_completo} />
                      <AvatarFallback className="bg-blue-600 text-white text-3xl font-semibold">
                        {cooperado?.nome_completo?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                <div className="text-center sm:text-left">
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-48 mb-2" />
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </>
                  ) : (
                    <>
                      <CardTitle className="text-2xl font-bold text-slate-800">{cooperado?.nome_completo}</CardTitle>
                      <p className="text-slate-600 font-mono">#{cooperado?.numero_associado}</p>
                      <Badge className={`mt-2 text-sm ${
                        cooperado?.status === "ativo" ? "bg-green-100 text-green-800" :
                        cooperado?.status === "inativo" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        Status: {cooperado?.status?.charAt(0).toUpperCase() + cooperado?.status?.slice(1) || "Desconhecido"}
                      </Badge>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InfoItem label="Email" value={cooperado?.email} icon={Mail} loading={loading} />
                <InfoItem label="Telefone" value={cooperado?.telefone} icon={Phone} loading={loading} />
                <InfoItem label="Data de Nascimento" value={cooperado?.data_nascimento ? format(parseISO(cooperado.data_nascimento), "dd/MM/yyyy") : null} icon={Calendar} loading={loading} />
                <InfoItem label="BI" value={cooperado?.bi} icon={User} loading={loading} />
                <InfoItem label="Validade do BI" value={cooperado?.validade_documento_bi ? format(parseISO(cooperado.validade_documento_bi), "dd/MM/yyyy") : null} icon={Calendar} loading={loading} />
                <InfoItem label="Nacionalidade" value={cooperado?.nacionalidade} icon={MapPin} loading={loading} />
                <InfoItem label="Estado Civil" value={cooperado?.estado_civil?.charAt(0).toUpperCase() + cooperado?.estado_civil?.slice(1)} icon={Users} loading={loading} />
                {cooperado?.estado_civil === "casado" && <InfoItem label="Nome do Cônjuge" value={cooperado?.nome_conjuge} loading={loading} />}
                 <InfoItem label="Tem Filhos?" value={cooperado?.tem_filhos ? `Sim (${cooperado?.numero_filhos || 0})` : "Não"} loading={loading} />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600"/> Morada</CardTitle></CardHeader>
              <CardContent className="p-6 grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InfoItem label="Província" value={cooperado?.provincia} loading={loading} />
                <InfoItem label="Município" value={cooperado?.municipio} loading={loading} />
                <InfoItem label="Comuna" value={cooperado?.comuna} loading={loading} />
                <InfoItem label="Endereço Completo" value={cooperado?.endereco_completo} loading={loading} className="md:col-span-2"/>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600"/> Dados Profissionais</CardTitle></CardHeader>
              <CardContent className="p-6 grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InfoItem label="Profissão" value={cooperado?.profissao} loading={loading} />
                <InfoItem label="Renda Mensal" value={cooperado?.renda_mensal ? `${Number(cooperado.renda_mensal).toLocaleString()} Kz` : null} loading={loading} />
                <InfoItem label="Sector Profissional" value={cooperado?.sector_profissional?.charAt(0).toUpperCase() + cooperado?.sector_profissional?.slice(1)} loading={loading} />
                {cooperado?.sector_profissional === "publico" && <InfoItem label="Entidade Pública" value={cooperado?.entidade_publica} loading={loading} />}
                {cooperado?.sector_profissional === "privado" && <InfoItem label="Entidade Privada" value={cooperado?.entidade_privada} loading={loading} />}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Documentos e Plano */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600"/> Plano de Assinatura</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-3">
                {loading || !planoAssinatura ? (
                  <>
                    <Skeleton className="h-6 w-3/4 mb-1"/>
                    <Skeleton className="h-5 w-1/2 mb-2"/>
                    <Skeleton className="h-5 w-2/3"/>
                  </>
                ) : planoAssinatura ? (
                  <>
                    <InfoItem label="Nome do Plano" value={planoAssinatura.nome_plano} />
                    <InfoItem label="Valor Mensal" value={`${planoAssinatura.valor_mensal.toLocaleString()} Kz`} />
                    <InfoItem label="Taxa de Inscrição" value={`${planoAssinatura.taxa_inscricao.toLocaleString()} Kz`} />
                    <InfoItem label="Status da Taxa" loading={loading}>
                       <Badge className={cooperado?.taxa_inscricao_paga ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                         {cooperado?.taxa_inscricao_paga ? "Paga" : "Pendente"}
                       </Badge>
                    </InfoItem>
                  </>
                ) : (
                  <p className="text-slate-500 italic">Nenhum plano de assinatura associado.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600"/> 
                  Documentos Anexados
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadDocuments}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Anexar Documentos
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <DocumentLink docUrl={cooperado?.documentos_anexados?.foto_passe} docName="Foto Passe" loading={loading} required={true} />
                <DocumentLink docUrl={cooperado?.documentos_anexados?.bi_frente_verso} docName="BI (Frente e Verso)" loading={loading} required={true} />
                {cooperado?.estado_civil === 'casado' && <DocumentLink docUrl={cooperado?.documentos_anexados?.bi_conjuge} docName="BI do Cônjuge" loading={loading} required={true} />}
                {cooperado?.tem_filhos && <DocumentLink docUrl={cooperado?.documentos_anexados?.agregado_familiar_doc} docName="Agregado Familiar" loading={loading} required={true} />}
                <DocumentLink docUrl={cooperado?.documentos_anexados?.declaracao_servico} docName="Declaração de Serviço" loading={loading} required={true} />
                <DocumentLink docUrl={cooperado?.documentos_anexados?.nif_documento} docName="Comprovativo NIF" loading={loading} required={true} />
              </CardContent>
            </Card>
            
            {cooperado?.observacoes && (
             <Card className="shadow-lg">
                <CardHeader><CardTitle className="text-lg font-semibold text-slate-700">Observações Internas</CardTitle></CardHeader>
                <CardContent className="p-6">
                  {loading ? <Skeleton className="h-20 w-full"/> : <p className="text-slate-600 whitespace-pre-wrap">{cooperado.observacoes}</p>}
                </CardContent>
             </Card>
            )}
          </div>
        </div>

        {/* Modal de Edição de Perfil */}
        <FormEdicaoPerfil 
          cooperado={cooperado} 
          open={showEditModal} 
          onOpenChange={setShowEditModal} 
          onSave={handleSaveProfile} 
        />

        {/* Modal de Upload de Documentos */}
        <FormUploadDocumentos 
          cooperado={cooperado} 
          open={showUploadModal} 
          onOpenChange={setShowUploadModal} 
          onSave={handleSaveDocuments} 
        />
        
        {/* Modais Futuros
        {showPasswordModal && <FormAlterarSenha onClose={() => setShowPasswordModal(false)} />}
        */}
      </div>
    </PortalLayout>
  );
}