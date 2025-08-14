import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Projeto, Cooperado } from "@/api/entities"; // Cooperado pode ser usado para verificar interesse
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
  Heart
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
// Futuramente: import DetalhesProjetoModal from "./DetalhesProjetoModal";

const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>;

const statusColors = {
  planejamento: "bg-yellow-100 text-yellow-800",
  construcao: "bg-blue-100 text-blue-800",
  pronto: "bg-green-100 text-green-800",
  entregue: "bg-purple-100 text-purple-800",
};

const tipoColors = {
  T0: "bg-slate-100 text-slate-800", T1: "bg-sky-100 text-sky-800",
  T2: "bg-teal-100 text-teal-800", T3: "bg-emerald-100 text-emerald-800",
  T4: "bg-amber-100 text-amber-800", T5: "bg-rose-100 text-rose-800",
};

const provinciasAngola = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", 
  "Cuanza Sul", "Cunene", "Huambo", "Huíla", "Luanda", "Lunda Norte", 
  "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
];

const ProjetoItemCard = ({ projeto, onShowDetails, onExpressInterest, isInterested }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
    {projeto.galeria_imagens && projeto.galeria_imagens[0] ? (
      <img src={projeto.galeria_imagens[0]} alt={projeto.nome} className="w-full h-48 object-cover" />
    ) : (
      <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
        <Building className="w-16 h-16 text-slate-400" />
      </div>
    )}
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors">
          {projeto.nome}
        </CardTitle>
        <Badge className={`${statusColors[projeto.status]}`}>{projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1)}</Badge>
      </div>
      <div className="flex items-center text-xs text-slate-500 gap-1 mt-1">
        <MapPin className="w-3 h-3"/> {projeto.provincia} - {projeto.municipio}
      </div>
    </CardHeader>
    <CardContent className="space-y-3 text-sm flex-grow">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div title="Tipologia"><Badge variant="outline" className={`w-full justify-center ${tipoColors[projeto.tipo]}`}>{projeto.tipo}</Badge></div>
        <div title="Quartos" className="flex items-center justify-center gap-1"><BedDouble className="w-4 h-4 text-slate-500"/> {projeto.num_quartos}</div>
        <div title="Banheiros" className="flex items-center justify-center gap-1"><Bath className="w-4 h-4 text-slate-500"/> {projeto.num_banheiros}</div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t">
         <div className="flex items-center gap-1"><Maximize className="w-3 h-3"/> {projeto.area_util} m²</div>
         <div className="font-semibold text-blue-600">{projeto.preco_final?.toLocaleString()} Kz</div>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5rem]">{projeto.descricao || "Sem descrição detalhada."}</p>
    </CardContent>
    <div className="p-4 pt-0 border-t mt-auto">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onShowDetails(projeto)}>
          <Eye className="w-4 h-4 mr-2" /> Ver Detalhes
        </Button>
        {/* <Button 
          variant={isInterested ? "secondary" : "default"} 
          size="sm" 
          className="flex-1" 
          onClick={() => onExpressInterest(projeto.id)}
        >
          <Heart className={`w-4 h-4 mr-2 ${isInterested ? 'fill-pink-500 text-pink-500' : ''}`} /> 
          {isInterested ? "Interessado!" : "Tenho Interesse"}
        </Button> */}
      </div>
    </div>
  </Card>
);


export default function PortalProjetosCooperativa() {
  const [projetos, setProjetos] = useState([]);
  const [filteredProjetos, setFilteredProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [selectedProjetoModal, setSelectedProjetoModal] = useState(null);
  // const [interesses, setInteresses] = useState([]); // Para guardar IDs dos projetos de interesse
  // const [cooperadoId, setCooperadoId] = useState(null);

  const [filters, setFilters] = useState({
    provincia: "todas",
    status: "todos",
    tipo: "todos",
    searchTerm: ""
  });

  useEffect(() => {
    // const id = localStorage.getItem('loggedInCooperadoId');
    // setCooperadoId(id);
    fetchProjetos();
    // fetchInteresses(id); // Futuro
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [projetos, filters]);

  const fetchProjetos = async () => {
    setLoading(true);
    try {
      const data = await Projeto.list("-created_date"); // Ordena por mais recentes
      setProjetos(data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      toast.error("Falha ao carregar lista de projetos.");
    } finally {
      setLoading(false);
    }
  };
  
  // const fetchInteresses = async (coopId) => {
  //   // Futuramente: buscar interesses do cooperado (ex: de uma entidade CooperadoProjetoInteresse)
  //   // Ex: const data = await CooperadoProjetoInteresse.filter({cooperado_id: coopId});
  //   // setInteresses(data.map(i => i.projeto_id));
  // };

  const applyFiltersAndSearch = () => {
    let tempProjetos = [...projetos];
    if (filters.provincia !== "todas") {
      tempProjetos = tempProjetos.filter(p => p.provincia === filters.provincia);
    }
    if (filters.status !== "todos") {
      tempProjetos = tempProjetos.filter(p => p.status === filters.status);
    }
    if (filters.tipo !== "todos") {
      tempProjetos = tempProjetos.filter(p => p.tipo === filters.tipo);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      tempProjetos = tempProjetos.filter(p => 
        p.nome.toLowerCase().includes(term) ||
        p.descricao?.toLowerCase().includes(term) ||
        p.municipio?.toLowerCase().includes(term)
      );
    }
    setFilteredProjetos(tempProjetos);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleShowDetails = (projeto) => {
    // setSelectedProjetoModal(projeto);
    toast.info(`Visualizando detalhes do projeto: ${projeto.nome}. (Modal em desenvolvimento)`);
  };
  
  // const handleExpressInterest = async (projetoId) => {
  //   // Lógica para registrar interesse
  //   // Ex: await CooperadoProjetoInteresse.create({ cooperado_id: cooperadoId, projeto_id: projetoId });
  //   // setInteresses(prev => [...prev, projetoId]);
  //   toast.success("Seu interesse foi registrado!");
  // };


  return (
    <PortalLayout currentPageName="PortalProjetosCooperativa">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Nossos Projetos Habitacionais</h1>
          <p className="text-slate-600">Explore os projetos disponíveis e em desenvolvimento pela CoopHabitat.</p>
        </div>

        {/* Filtros */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600"/> Filtrar Projetos
            </CardTitle>
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
                <SelectTrigger><SelectValue placeholder="Província" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Províncias</SelectItem>
                  {provinciasAngola.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.tipo} onValueChange={(v) => handleFilterChange('tipo', v)}>
                <SelectTrigger><SelectValue placeholder="Tipologia" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas Tipologias</SelectItem>
                  {Object.keys(tipoColors).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Projetos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="shadow-lg"><CardContent className="p-4"><Skeleton className="h-64 w-full"/></CardContent></Card>
            ))}
          </div>
        ) : filteredProjetos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredProjetos.map((projeto) => (
              <ProjetoItemCard 
                key={projeto.id} 
                projeto={projeto} 
                onShowDetails={handleShowDetails}
                // onExpressInterest={handleExpressInterest} - Futuro
                // isInterested={interesses.includes(projeto.id)} - Futuro
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Building className="w-16 h-16 mx-auto mb-4 opacity-50"/>
            <h3 className="text-xl font-semibold text-slate-700">Nenhum projeto encontrado.</h3>
            <p className="mt-2">Tente ajustar os filtros ou verifique novamente mais tarde.</p>
          </div>
        )}
        
        {/* Modal de Detalhes do Projeto - Futuro
        {selectedProjetoModal && (
          <DetalhesProjetoModal 
            projeto={selectedProjetoModal} 
            onClose={() => setSelectedProjetoModal(null)}
            onExpressInterest={handleExpressInterest}
            isInterested={interesses.includes(selectedProjetoModal.id)}
          />
        )}
        */}
      </div>
    </PortalLayout>
  );
}