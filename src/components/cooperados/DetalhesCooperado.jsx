
import React, { useState, useEffect } from "react";
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
  CreditCard,
  QrCode,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssinaturaPlano } from "@/api/entities";

export default function DetalhesCooperado({ cooperado, pagamentos, onStatusChange, assinaturaPlanos }) {
  const [planoAssinatura, setPlanoAssinatura] = useState(null);
  const [loadingPlano, setLoadingPlano] = useState(false); // Novo estado para carregamento do plano

  useEffect(() => {
    const fetchPlano = async () => {
      if (cooperado?.assinatura_plano_id) {
        setLoadingPlano(true);
        if (assinaturaPlanos) { // Usar assinaturaPlanos do prop se disponível
          const planoEncontrado = assinaturaPlanos.find(p => p.id === cooperado.assinatura_plano_id);
          if (planoEncontrado) {
            setPlanoAssinatura(planoEncontrado);
            setLoadingPlano(false);
            return; // Found in props, no need to fetch
          }
          // If not found in props, fall through to fetch
        }

        // If assinaturaPlanos not provided or plan not found in it, attempt to fetch
        try {
          const plano = await AssinaturaPlano.get(cooperado.assinatura_plano_id);
          setPlanoAssinatura(plano);
        } catch (error) {
          console.error("Erro ao buscar plano de assinatura:", error);
          setPlanoAssinatura(null);
        } finally {
          setLoadingPlano(false);
        }
      } else {
        setPlanoAssinatura(null);
        setLoadingPlano(false);
      }
    };
    fetchPlano();
  }, [cooperado?.assinatura_plano_id, assinaturaPlanos]);

  const pagamentosConfirmados = pagamentos.filter(p => p.status === "confirmado");
  const totalPago = pagamentosConfirmados.reduce((sum, p) => sum + p.valor, 0); // Still used for potential future display or calculations
  const ultimosPagamentos = pagamentos
    .sort((a, b) => new Date(b.data_pagamento || 0) - new Date(a.data_pagamento || 0))
    .slice(0, 5);

  const renderDocumentoLink = (docUrl, docName) => {
    if (!docUrl) return <p className="text-slate-500 text-sm italic">Não anexado</p>;
    return (
      <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
        <FileText className="w-3 h-3"/> Ver {docName}
      </a>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                <p className="text-slate-800 font-medium">{cooperado.nome_completo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Número de Associado</label>
                <p className="text-slate-800 font-mono">{cooperado.numero_associado}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">BI</label>
                <p className="text-slate-800">{cooperado.bi}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Validade do BI</label>
                <p className="text-slate-800">
                  {cooperado.validade_documento_bi ? format(new Date(cooperado.validade_documento_bi), "dd/MM/yyyy") : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Data de Nascimento</label>
                <p className="text-slate-800">
                  {cooperado.data_nascimento ? format(new Date(cooperado.data_nascimento), "dd/MM/yyyy") : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Nacionalidade</label>
                <p className="text-slate-800">{cooperado.nacionalidade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Estado Civil</label>
                <p className="text-slate-800 capitalize">{cooperado.estado_civil}</p>
              </div>
              {cooperado.estado_civil === "casado" && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Nome do Cônjuge</label>
                  <p className="text-slate-800">{cooperado.nome_conjuge || "-"}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-slate-600">Filhos</label>
                <p className="text-slate-800">
                  {cooperado.tem_filhos ? `Sim, ${cooperado.numero_filhos || 0} filho(s)` : "Não"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização e Contactos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-slate-800">{cooperado.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Telefone</label>
                <p className="text-slate-800">{cooperado.telefone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Província</label>
                <p className="text-slate-800">{cooperado.provincia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Município</label>
                <p className="text-slate-800">{cooperado.municipio}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Comuna</label>
                <p className="text-slate-800">{cooperado.comuna || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Endereço Completo</label>
                <p className="text-slate-800">{cooperado.endereco_completo || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Dados Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Profissão</label>
                <p className="text-slate-800">{cooperado.profissao || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Renda Mensal</label>
                 <p className="text-slate-800">
                  {cooperado.renda_mensal ? `${Number(cooperado.renda_mensal).toLocaleString()} Kz` : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Sector Profissional</label>
                <p className="text-slate-800 capitalize">{cooperado.sector_profissional}</p>
              </div>
              {cooperado.sector_profissional === "publico" && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Entidade Pública</label>
                  <p className="text-slate-800">{cooperado.entidade_publica || "-"}</p>
                </div>
              )}
              {cooperado.sector_profissional === "privado" && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Entidade Privada</label>
                  <p className="text-slate-800">{cooperado.entidade_privada || "-"}</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Status do Cooperado</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Badge className={`text-lg px-4 py-2 ${
                cooperado.status === "ativo" ? "bg-green-100 text-green-800" :
                cooperado.status === "inativo" ? "bg-orange-100 text-orange-800" :
                "bg-red-100 text-red-800"
              }`}>
                {cooperado.status.charAt(0).toUpperCase() + cooperado.status.slice(1)}
              </Badge>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(cooperado, "ativo")}
                  disabled={cooperado.status === "ativo"}
                >
                  Ativar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(cooperado, "inativo")}
                  disabled={cooperado.status === "inativo"}
                >
                  Inativar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onStatusChange(cooperado, "suspenso")}
                  disabled={cooperado.status === "suspenso"}
                >
                  Suspender
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Plano de Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loadingPlano ? (
                <p className="text-slate-500 italic">Carregando plano...</p>
              ) : planoAssinatura ? (
                <>
                  <p className="font-medium">{planoAssinatura.nome_plano}</p>
                  <p className="text-slate-600">{planoAssinatura.valor_mensal.toLocaleString()} Kz / mês</p>
                  <p className="text-xs text-slate-500">Taxa de Inscrição: {planoAssinatura.taxa_inscricao.toLocaleString()} Kz</p>
                  <Badge className={cooperado.taxa_inscricao_paga ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                    Taxa de Inscrição {cooperado.taxa_inscricao_paga ? "Paga" : "Pendente"}
                  </Badge>
                </>
              ) : (
                <p className="text-slate-500 italic">Nenhum plano de assinatura associado.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Anexados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderDocumentoLink(cooperado.documentos_anexados?.foto_passe, "Foto Passe")}
              {renderDocumentoLink(cooperado.documentos_anexados?.bi_frente_verso, "BI")}
              {cooperado.estado_civil === 'casado' && renderDocumentoLink(cooperado.documentos_anexados?.bi_conjuge, "BI Cônjuge")}
              {cooperado.tem_filhos && renderDocumentoLink(cooperado.documentos_anexados?.agregado_familiar_doc, "Agregado Familiar")}
              {renderDocumentoLink(cooperado.documentos_anexados?.declaracao_servico, "Declaração Serviço")}
              {renderDocumentoLink(cooperado.documentos_anexados?.nif_documento, "Comprovativo NIF")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Cartão Digital
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-32 h-32 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                {/* Lógica para gerar ou buscar QR Code */}
                <QrCode className="w-16 h-16 text-slate-400" />
              </div>
              <Button variant="outline" size="sm">
                Gerar QR Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ultimosPagamentos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Referência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosPagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell>
                      {pagamento.data_pagamento ? format(new Date(pagamento.data_pagamento), "dd/MM/yyyy") : "-"}
                    </TableCell>
                     <TableCell className="capitalize">
                      {pagamento.tipo?.replace("_", " ")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {pagamento.valor?.toLocaleString()} Kz
                    </TableCell>
                    <TableCell className="capitalize">
                      {pagamento.metodo_pagamento?.replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        pagamento.status === "confirmado" ? "bg-green-100 text-green-800" :
                        pagamento.status === "atrasado" ? "bg-red-100 text-red-800" :
                        pagamento.status === "cancelado" ? "bg-gray-100 text-gray-800" :
                        "bg-orange-100 text-orange-800"
                      }>
                        {pagamento.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {pagamento.referencia || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum pagamento registrado</p>
            </div>
          )}
        </CardContent>
      </Card>
       {cooperado.observacoes && (
        <Card>
            <CardHeader>
                <CardTitle>Observações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-600 whitespace-pre-wrap">{cooperado.observacoes}</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
