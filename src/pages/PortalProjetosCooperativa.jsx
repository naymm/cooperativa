import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Projeto, Cooperado } from "@/api/entities";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building, 
  MapPin, 
  Search, 
  Loader2, 
  Filter, 
  Info, 
  Eye,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import DetalhesProjetoModal from "../components/portal/DetalhesProjetoModal";
import InscricaoRapidaModal from "../components/portal/InscricaoRapidaModal";

const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>;

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

const provinciasAngola = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", 
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", 
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

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

const ProjetoItemCard = ({ projeto, onShowDetails, onExpressInterest, isInterested }) => {
  const dados = extrairDadosProjeto(projeto);
  
  if (!dados) return null;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {dados.galeriaImagens.length > 0 ? (
        <img 
          src={dados.galeriaImagens[0]} 
          alt={dados.nome} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className="w-full h-48 bg-slate-200 flex items-center justify-center" style={{ display: dados.galeriaImagens.length > 0 ? 'none' : 'flex' }}>
        <Building className="w-16 h-16 text-slate-400" />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2">
            {dados.nome}
          </CardTitle>
          <Badge className={`${statusColors[dados.status]} flex-shrink-0`}>
            {statusText[dados.status] || dados.status.charAt(0).toUpperCase() + dados.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-slate-500 gap-1 mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0"/> 
          <span className="truncate">{dados.provincia} - {dados.municipio}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 text-sm flex-grow">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div title="Tipologia">
            <Badge variant="outline" className={`w-full justify-center ${tipoColors[dados.tipo]}`}>
              {dados.tipo}
            </Badge>
          </div>
          <div title="Quartos" className="flex items-center justify-center gap-1">
            <BedDouble className="w-4 h-4 text-slate-500"/> 
            {dados.numQuartos}
          </div>
          <div title="Banheiros" className="flex items-center justify-center gap-1">
            <Bath className="w-4 h-4 text-slate-500"/> 
            {dados.numBanheiros}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Maximize className="w-3 h-3"/> 
            {dados.areaUtil} m²
          </div>
          <div className="font-semibold text-blue-600">
            {dados.precoFinal.toLocaleString('pt-AO')} Kz
          </div>
        </div>
        
        <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5rem]">
          {dados.descricao}
        </p>
      </CardContent>
      
      <div className="p-4 pt-0 border-t mt-auto">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={() => onShowDetails(projeto)}
          >
            <Eye className="w-4 h-4 mr-2" /> 
            Ver Detalhes
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onExpressInterest(projeto)}
          >
            <Heart className="w-4 h-4 mr-2" /> 
            Inscrever-se
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default function PortalProjetosCooperativa() {
  const [projetos, setProjetos] = useState([]);
  const [filteredProjetos, setFilteredProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [projetoParaInscricao, setProjetoParaInscricao] = useState(null);

  const [filters, setFilters] = useState({
    provincia: "todas",
    status: "todos",
    tipo: "todos",
    searchTerm: ""
  });

  useEffect(() => {
    fetchProjetos();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [projetos, filters]);

  const fetchProjetos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Carregando projetos...");
      const data = await Projeto.list();
      console.log("✅ Projetos carregados:", data?.length || 0);
      console.log("📊 Estrutura do primeiro projeto:", data?.[0]);
      
      if (!data || !Array.isArray(data)) {
        throw new Error("Dados inválidos recebidos do servidor");
      }
      
      setProjetos(data);
    } catch (error) {
      console.error("❌ Erro ao carregar projetos:", error);
      setError(error.message || "Falha ao carregar lista de projetos.");
      toast.error("Erro ao carregar projetos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const refreshProjetos = async () => {
    setRefreshing(true);
    await fetchProjetos();
    setRefreshing(false);
  };

  const applyFiltersAndSearch = () => {
    if (!projetos || !Array.isArray(projetos)) {
      setFilteredProjetos([]);
      return;
    }

    let tempProjetos = [...projetos];
    
    if (filters.provincia !== "todas") {
      tempProjetos = tempProjetos.filter(p => {
        const dados = extrairDadosProjeto(p);
        return dados?.provincia === filters.provincia;
      });
    }
    
    if (filters.status !== "todos") {
      tempProjetos = tempProjetos.filter(p => {
        const dados = extrairDadosProjeto(p);
        return dados?.status === filters.status;
      });
    }
    
    if (filters.tipo !== "todos") {
      tempProjetos = tempProjetos.filter(p => {
        const dados = extrairDadosProjeto(p);
        return dados?.tipo === filters.tipo;
      });
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      tempProjetos = tempProjetos.filter(p => {
        const dados = extrairDadosProjeto(p);
        return (
          (dados?.nome && dados.nome.toLowerCase().includes(term)) ||
          (dados?.descricao && dados.descricao.toLowerCase().includes(term)) ||
          (dados?.municipio && dados.municipio.toLowerCase().includes(term)) ||
          (dados?.provincia && dados.provincia.toLowerCase().includes(term))
        );
      });
    }
    
    setFilteredProjetos(tempProjetos);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleShowDetails = (projeto) => {
    setSelectedProjeto(projeto);
    setShowModal(true);
  };
  
  const handleExpressInterest = (projeto) => {
    setProjetoParaInscricao(projeto);
    setShowInscricaoModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProjeto(null);
  };

  const handleCloseInscricaoModal = () => {
    setShowInscricaoModal(false);
    setProjetoParaInscricao(null);
  };

  const handleInscricaoFromModal = (projeto) => {
    handleCloseModal();
    handleExpressInterest(projeto);
  };

  const handleInscricaoSuccess = () => {
    // Recarregar dados se necessário
    toast.success("Inscrição realizada com sucesso!");
  };

  const clearFilters = () => {
    setFilters({
      provincia: "todas",
      status: "todos",
      tipo: "todos",
      searchTerm: ""
    });
  };

  if (error) {
    return (
      <PortalLayout currentPageName="PortalProjetosCooperativa">
        <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Nossos Projetos Habitacionais</h1>
            <p className="text-slate-600">Explore os projetos disponíveis e em desenvolvimento pela CoopHabitat.</p>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Erro ao carregar projetos:</strong> {error}</p>
                <Button onClick={refreshProjetos} disabled={refreshing}>
                  {refreshing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Tentar Novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout currentPageName="PortalProjetosCooperativa">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Nossos Projetos Habitacionais</h1>
              <p className="text-slate-600">Explore os projetos disponíveis e em desenvolvimento pela CoopHabitat.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={refreshProjetos} 
              disabled={refreshing || loading}
              className="flex-shrink-0"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600"/> Filtrar Projetos
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Pesquisar por nome, local..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.provincia} onValueChange={(v) => handleFilterChange('provincia', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Província" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Províncias</SelectItem>
                  {provinciasAngola.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.tipo} onValueChange={(v) => handleFilterChange('tipo', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipologia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas Tipologias</SelectItem>
                  {Object.keys(tipoColors).map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {!loading && projetos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{projetos.length}</div>
                <div className="text-sm text-slate-600">Total de Projetos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projetos.filter(p => extrairDadosProjeto(p)?.status === 'ativo').length}
                </div>
                <div className="text-sm text-slate-600">Ativos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {projetos.filter(p => extrairDadosProjeto(p)?.status === 'concluido').length}
                </div>
                <div className="text-sm text-slate-600">Concluídos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {projetos.filter(p => extrairDadosProjeto(p)?.status === 'inativo').length}
                </div>
                <div className="text-sm text-slate-600">Inativos</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Projetos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="p-4">
                  <Skeleton className="h-64 w-full"/>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjetos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredProjetos.map((projeto) => (
              <ProjetoItemCard 
                key={projeto.id} 
                projeto={projeto} 
                onShowDetails={handleShowDetails}
                onExpressInterest={handleExpressInterest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Building className="w-16 h-16 mx-auto mb-4 opacity-50"/>
            <h3 className="text-xl font-semibold text-slate-700">Nenhum projeto encontrado.</h3>
            <p className="mt-2">Tente ajustar os filtros ou verifique novamente mais tarde.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Modal de Detalhes do Projeto */}
        {showModal && selectedProjeto && (
          <DetalhesProjetoModal 
            projeto={selectedProjeto}
            onClose={handleCloseModal}
            onInscricao={handleInscricaoFromModal}
          />
        )}

        {/* Modal de Inscrição Rápida */}
        {showInscricaoModal && projetoParaInscricao && (
          <InscricaoRapidaModal 
            projeto={projetoParaInscricao}
            onClose={handleCloseInscricaoModal}
            onSuccess={handleInscricaoSuccess}
          />
        )}
      </div>
    </PortalLayout>
  );
}