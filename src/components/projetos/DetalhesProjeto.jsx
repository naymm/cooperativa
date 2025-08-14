import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign,
  Square,
  Users,
  Image
} from "lucide-react";
import { format } from "date-fns";

export default function DetalhesProjeto({ projeto, cooperados }) {
  const cooperadosAssociados = cooperados.filter(c => 
    projeto.cooperados_associados?.includes(c.numero_associado)
  );

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Informações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Nome do Projeto</label>
                <p className="text-slate-800 font-medium">{projeto.nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Tipo</label>
                <Badge className="mt-1">{projeto.tipo}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Área Útil</label>
                <p className="text-slate-800">{projeto.area_util}m²</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Quartos / Banheiros</label>
                <p className="text-slate-800">{projeto.num_quartos} quartos | {projeto.num_banheiros} banheiros</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Preço Final</label>
                <p className="text-slate-800 font-semibold text-lg">
                  {projeto.preco_final?.toLocaleString()} Kz
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <Badge className={`mt-1 ${
                  projeto.status === "planejamento" ? "bg-orange-100 text-orange-800" :
                  projeto.status === "construcao" ? "bg-blue-100 text-blue-800" :
                  projeto.status === "pronto" ? "bg-green-100 text-green-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1)}
                </Badge>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Província</label>
                  <p className="text-slate-800">{projeto.provincia}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Município</label>
                  <p className="text-slate-800">{projeto.municipio}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Endereço Detalhado</label>
                <p className="text-slate-800">{projeto.endereco_detalhado || "-"}</p>
              </div>
              {projeto.coordenadas_gps && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Coordenadas GPS</label>
                  <p className="text-slate-800 font-mono">{projeto.coordenadas_gps}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cronograma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Data de Início</label>
                <p className="text-slate-800">
                  {projeto.data_inicio ? format(new Date(projeto.data_inicio), "dd/MM/yyyy") : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Previsão de Entrega</label>
                <p className="text-slate-800">
                  {projeto.data_previsao_entrega ? format(new Date(projeto.data_previsao_entrega), "dd/MM/yyyy") : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          {projeto.descricao && (
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{projeto.descricao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Galeria de Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Galeria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projeto.galeria_imagens && projeto.galeria_imagens.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {projeto.galeria_imagens.slice(0, 4).map((url, index) => (
                    <div key={index} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-slate-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma imagem</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cooperados Associados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Cooperados ({cooperadosAssociados.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cooperadosAssociados.length > 0 ? (
                <div className="space-y-3">
                  {cooperadosAssociados.map((cooperado) => (
                    <div key={cooperado.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {cooperado.nome_completo?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {cooperado.nome_completo}
                        </p>
                        <p className="text-xs text-slate-500">#{cooperado.numero_associado}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum cooperado associado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}