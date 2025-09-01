import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X,
  Building, 
  MapPin, 
  BedDouble,
  Bath,
  Maximize,
  DollarSign,
  Calendar,
  Users,
  Heart,
  Eye,
  FileText,
  ArrowRight,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  ativo: "bg-green-100 text-green-800",
  inativo: "bg-red-100 text-red-800",
  concluido: "bg-purple-100 text-purple-800",
  // Fallbacks para status antigos se existirem
  planejamento: "bg-yellow-100 text-yellow-800",
  construcao: "bg-blue-100 text-blue-800",
  pronto: "bg-green-100 text-green-800",
  entregue: "bg-purple-100 text-purple-800",
};

const statusText = {
  ativo: "Ativo",
  inativo: "Inativo",
  concluido: "Concluído",
  // Fallbacks para status antigos se existirem
  planejamento: "Planejamento",
  construcao: "Construção",
  pronto: "Pronto",
  entregue: "Entregue",
};

const tipoColors = {
  T0: "bg-slate-100 text-slate-800", 
  T1: "bg-sky-100 text-sky-800",
  T2: "bg-teal-100 text-teal-800", 
  T3: "bg-emerald-100 text-emerald-800",
  T4: "bg-amber-100 text-amber-800", 
  T5: "bg-rose-100 text-rose-800",
};

const tipoDescricao = {
  T0: "Estúdio",
  T1: "1 Quarto",
  T2: "2 Quartos", 
  T3: "3 Quartos",
  T4: "4 Quartos", 
  T5: "5+ Quartos",
};

// Função para extrair dados do projeto com fallbacks - usando nomes corretos do banco
const extrairDadosProjeto = (projeto) => {
  if (!projeto) return null;

  return {
    // Nome/Título - usar titulo como principal
    nome: projeto.titulo || projeto.nome || projeto.title || projeto.name || "Projeto sem nome",
    
    // Status - usar status existente
    status: projeto.status || "ativo",
    
    // Tipo - usar tipologia se existir, senão tentar outros
    tipo: projeto.tipologia || projeto.tipo || projeto.type || projeto.categoria || "T0",
    
    // Localização - usar campos corretos
    provincia: projeto.provincia || "Não informado",
    municipio: projeto.municipio || "Não informado",
    
    // Características - usar campos corretos
    areaUtil: projeto.area_util || 0,
    numQuartos: projeto.num_quartos || 0,
    numBanheiros: projeto.num_banheiros || 0,
    
    // Preço - usar valor_total como principal
    precoFinal: projeto.valor_total || projeto.preco_final || projeto.preco || projeto.price || projeto.valor || projeto.custo || 0,
    
    // Descrição - usar descricao
    descricao: projeto.descricao || "Sem descrição detalhada.",
    
    // Imagens - usar galeria_imagens se existir
    galeriaImagens: projeto.galeria_imagens || projeto.imagens || projeto.images || projeto.fotos || projeto.photos || projeto.gallery || [],
    
    // Endereço - usar endereco_detalhado se existir
    enderecoDetalhado: projeto.endereco_detalhado || projeto.endereco || projeto.address || "Endereço não informado",
    
    // Coordenadas - usar coordenadas_gps se existir
    coordenadasGps: projeto.coordenadas_gps || projeto.coordenadas || projeto.gps || projeto.coordinates || null,
    
    // Datas - usar data_fim em vez de data_previsao_entrega
    dataInicio: projeto.data_inicio || null,
    dataPrevisaoEntrega: projeto.data_fim || projeto.data_previsao_entrega || projeto.entrega || projeto.delivery_date || projeto.data_entrega || null,
    
    // Cooperados associados - tentar diferentes possibilidades
    cooperadosAssociados: projeto.cooperados_associados || projeto.cooperados || projeto.associados || projeto.members || [],
    
    // ID original
    id: projeto.id
  };
};

export default function DetalhesProjetoModal({ projeto, onClose, onInscricao }) {
  if (!projeto) return null;

  // Extrair dados usando a função
  const dados = extrairDadosProjeto(projeto);
  
  if (!dados) return null;

  // Formatar datas se existirem
  const dataInicio = dados.dataInicio ? parseISO(dados.dataInicio) : null;
  const dataPrevisaoEntrega = dados.dataPrevisaoEntrega ? parseISO(dados.dataPrevisaoEntrega) : null;

  const formatarData = (data) => {
    if (!data) return "Não informado";
    return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{dados.nome}</h2>
            <p className="text-slate-600 flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {dados.provincia} - {dados.municipio}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Galeria de Imagens */}
          {dados.galeriaImagens.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Galeria de Imagens
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dados.galeriaImagens.map((imagem, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imagem} 
                      alt={`${dados.nome} - Imagem ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Ampliar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Características Técnicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Características Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <Badge className={`w-full justify-center mb-2 ${tipoColors[dados.tipo]}`}>
                      {dados.tipo}
                    </Badge>
                    <p className="text-sm text-slate-600">{tipoDescricao[dados.tipo]}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <Badge className={`w-full justify-center mb-2 ${statusColors[dados.status]}`}>
                      {statusText[dados.status]}
                    </Badge>
                    <p className="text-sm text-slate-600">Status do Projeto</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <BedDouble className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">{dados.numQuartos}</p>
                      <p className="text-sm text-blue-700">Quartos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Bath className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">{dados.numBanheiros}</p>
                      <p className="text-sm text-green-700">Banheiros</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Maximize className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">{dados.areaUtil} m²</p>
                    <p className="text-sm text-amber-700">Área Útil</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Informações Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900 mb-2">
                    {formatarValor(dados.precoFinal)}
                  </p>
                  <p className="text-sm text-blue-700">Preço Final</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Valor por m²:</span>
                    <span className="font-semibold text-slate-900">
                      {dados.areaUtil > 0 ? formatarValor(dados.precoFinal / dados.areaUtil) : "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Cooperados Associados:</span>
                    <span className="font-semibold text-slate-900">
                      {dados.cooperadosAssociados.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cronograma */}
          {(dataInicio || dataPrevisaoEntrega) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Cronograma do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Data de Início</p>
                    <p className="font-semibold text-green-900">
                      {dataInicio ? formatarData(dataInicio) : "Não definido"}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Previsão de Entrega</p>
                    <p className="font-semibold text-blue-900">
                      {dataPrevisaoEntrega ? formatarData(dataPrevisaoEntrega) : "Não definido"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 mb-2">Endereço Completo</p>
                <p className="font-medium text-slate-900">{dados.enderecoDetalhado}</p>
              </div>
              
              {dados.coordenadasGps && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700 mb-2">Coordenadas GPS</p>
                  <p className="font-mono text-slate-900">{dados.coordenadasGps}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Descrição Detalhada */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Descrição Detalhada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">{dados.descricao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            
            <Button 
              onClick={() => onInscricao(projeto)}
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Inscrever-se no Projeto
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
