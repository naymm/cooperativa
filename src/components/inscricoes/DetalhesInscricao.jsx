import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign,
  FileText,
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";

export default function DetalhesInscricao({ inscricao, onAprovar, onRejeitar, processing }) {
  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Nome Completo</label>
            <p className="text-slate-800 font-medium">{inscricao.nome_completo || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">BI</label>
            <p className="text-slate-800">{inscricao.bi || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Data de Nascimento</label>
            <p className="text-slate-800">
              {inscricao.data_nascimento ? format(new Date(inscricao.data_nascimento), "dd/MM/yyyy") : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Nacionalidade</label>
            <p className="text-slate-800">{inscricao.nacionalidade || "Angolana"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Estado Civil</label>
            <p className="text-slate-800">{inscricao.estado_civil || "Solteiro"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Profissão</label>
            <p className="text-slate-800">{inscricao.profissao || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Familiares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Familiares
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Nome do Cônjuge</label>
            <p className="text-slate-800">{inscricao.nome_conjuge || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Tem Filhos</label>
            <p className="text-slate-800">{inscricao.tem_filhos ? "Sim" : "Não"}</p>
          </div>
          {inscricao.tem_filhos && (
            <div>
              <label className="text-sm font-medium text-slate-600">Número de Filhos</label>
              <p className="text-slate-800">{inscricao.numero_filhos || 0}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contactos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contactos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <p className="text-slate-800">{inscricao.email || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Telefone</label>
            <p className="text-slate-800">{inscricao.telefone || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Província</label>
              <p className="text-slate-800">{inscricao.provincia || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Município</label>
              <p className="text-slate-800">{inscricao.municipio || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Comuna</label>
              <p className="text-slate-800">{inscricao.comuna || "N/A"}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Endereço Completo</label>
            <p className="text-slate-800">{inscricao.endereco_completo || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Financeiras e Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Informações Financeiras e Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Renda Mensal</label>
            <p className="text-slate-800 font-medium">
              {inscricao.renda_mensal ? `${inscricao.renda_mensal.toLocaleString()} Kz` : "-"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Sector Profissional</label>
            <p className="text-slate-800">
              {inscricao.sector_profissional ? inscricao.sector_profissional.charAt(0).toUpperCase() + inscricao.sector_profissional.slice(1) : "-"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Plano de Interesse</label>
            <p className="text-slate-800">
              {inscricao.assinatura_plano_id || inscricao.plano_interesse ? `Plano ID: ${inscricao.assinatura_plano_id || inscricao.plano_interesse}` : "Nenhum plano selecionado"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Taxa de Inscrição Paga</label>
            <p className="text-slate-800">
              {inscricao.taxa_inscricao_paga ? "Sim" : "Não"}
            </p>
          </div>
        </CardContent>
      </Card>

            {/* Documentos e Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos e Informações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Documentos Anexados</label>
            <p className="text-slate-800">
              {inscricao.documentos_anexados ? 
                Object.keys(inscricao.documentos_anexados).filter(key => inscricao.documentos_anexados[key]).length > 0 ?
                `${Object.keys(inscricao.documentos_anexados).filter(key => inscricao.documentos_anexados[key]).length} documento(s) anexado(s)` :
                "Nenhum documento anexado" :
                "Nenhum documento anexado"
              }
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Validade do BI</label>
            <p className="text-slate-800">
              {inscricao.validade_documento_bi ? format(new Date(inscricao.validade_documento_bi), "dd/MM/yyyy") : "N/A"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Entidade Pública</label>
            <p className="text-slate-800">
              {inscricao.entidade_publica ? inscricao.entidade_publica.nome || "N/A" : "N/A"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Entidade Privada</label>
            <p className="text-slate-800">
              {inscricao.entidade_privada || "N/A"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Entidade (Legado)</label>
            <p className="text-slate-800">
              {inscricao.entidade ? inscricao.entidade.nome || "N/A" : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status e Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Status e Observações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Status Atual</label>
            <div className="mt-1">
              <Badge className={
                inscricao.status === "aprovada" ? "bg-green-100 text-green-800" :
                inscricao.status === "rejeitada" ? "bg-red-100 text-red-800" :
                "bg-orange-100 text-orange-800"
              }>
                {(inscricao.status || 'pendente').charAt(0).toUpperCase() + (inscricao.status || 'pendente').slice(1)}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-600">Data de Inscrição</label>
            <p className="text-slate-800">{inscricao.created_at ? format(new Date(inscricao.created_at), "dd/MM/yyyy 'às' HH:mm") : "N/A"}</p>
          </div>

          {inscricao.observacoes && (
            <div>
              <label className="text-sm font-medium text-slate-600">Observações</label>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-lg mt-1">{inscricao.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      {inscricao.status === "pendente" && (
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="destructive"
            onClick={() => onRejeitar("Rejeitado via modal de detalhes")}
            disabled={processing}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Rejeitar
          </Button>
          <Button
            onClick={onAprovar}
            disabled={processing}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Aprovar Inscrição
          </Button>
        </div>
      )}
    </div>
  );
}