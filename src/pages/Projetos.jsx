import React, { useState, useEffect } from "react";
import { Projeto, Cooperado } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Home, 
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ProjetoCard from "../components/projetos/ProjetoCard";
import DetalhesProjeto from "../components/projetos/DetalhesProjeto";
import FormProjeto from "../components/projetos/FormProjeto";
import FiltrosProjetos from "../components/projetos/FiltrosProjetos";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [filteredProjetos, setFilteredProjetos] = useState([]);
  const [cooperados, setCooperados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState(null);
  const [filters, setFilters] = useState({
    status: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProjetos();
  }, [projetos, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [projetosData, cooperadosData] = await Promise.all([
        Projeto.list(),
        Cooperado.list()
      ]);
      setProjetos(projetosData);
      setCooperados(cooperadosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjetos = () => {
    let filtered = [...projetos];

    if (searchTerm) {
      filtered = filtered.filter(projeto =>
        projeto.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projeto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projeto.valor_total?.toString().includes(searchTerm)
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(projeto => projeto.status === filters.status);
    }

    setFilteredProjetos(filtered);
  };

  const handleSaveProjeto = async (projetoData) => {
    try {
      if (editingProjeto) {
        await Projeto.update(editingProjeto.id, projetoData);
      } else {
        await Projeto.create(projetoData);
      }
      
      loadData();
      setShowForm(false);
      setEditingProjeto(null);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  const stats = {
    total: projetos.length,
    ativo: projetos.filter(p => p.status === "ativo").length,
    inativo: projetos.filter(p => p.status === "inativo").length,
    concluido: projetos.filter(p => p.status === "concluido").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestão de Projetos</h1>
          <p className="text-slate-600 mt-1">Acompanhar projetos habitacionais</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-sm text-slate-600">Total de Projetos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.ativo}</div>
            <div className="text-sm text-slate-600">Ativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.inativo}</div>
            <div className="text-sm text-slate-600">Inativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.concluido}</div>
            <div className="text-sm text-slate-600">Concluídos</div>
          </CardContent>
        </Card>
      </div>

      {/* Pesquisa e Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar projetos por nome ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <FiltrosProjetos filters={filters} setFilters={setFilters} />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Projetos */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-8">Carregando projetos...</div>
        ) : filteredProjetos.length > 0 ? (
          filteredProjetos.map((projeto) => (
            <ProjetoCard
              key={projeto.id}
              projeto={projeto}
              cooperados={cooperados}
              onViewDetails={() => {
                setSelectedProjeto(projeto);
                setShowDetails(true);
              }}
              onEdit={() => {
                setEditingProjeto(projeto);
                setShowForm(true);
              }}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Home className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum projeto encontrado</h3>
            <p className="text-slate-500">Não há projetos que correspondam aos critérios de busca.</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Projeto</DialogTitle>
          </DialogHeader>
          {selectedProjeto && (
            <DetalhesProjeto
              projeto={selectedProjeto}
              cooperados={cooperados}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProjeto ? "Editar Projeto" : "Novo Projeto"}
            </DialogTitle>
          </DialogHeader>
          <FormProjeto
            projeto={editingProjeto}
            onSave={handleSaveProjeto}
            onCancel={() => {
              setShowForm(false);
              setEditingProjeto(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}