import React, { useState, useEffect } from "react";
import { AssinaturaPlano } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ListChecks, 
  Plus,
  Edit,
  Eye,
  Loader2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import PlanoCard from "../components/planos/PlanoCard";
import FormPlano from "../components/planos/FormPlano";
import DetalhesPlano from "../components/planos/DetalhesPlano";

export default function PlanosAssinatura() {
  const [planos, setPlanos] = useState([]);
  const [filteredPlanos, setFilteredPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlano, setSelectedPlano] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlano, setEditingPlano] = useState(null);

  useEffect(() => {
    loadPlanos();
  }, []);

  useEffect(() => {
    filterPlanos();
  }, [planos, searchTerm]);

  const loadPlanos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Carregando planos...");
      const data = await AssinaturaPlano.list();
      console.log("Dados recebidos:", data);
      setPlanos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setError(error.message);
      toast.error("Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  const filterPlanos = () => {
    let filtered = [...planos];
    if (searchTerm) {
      filtered = filtered.filter(plano =>
        plano.nome_plano?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plano.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlanos(filtered);
  };

  const handleSavePlano = async (planoData) => {
    try {
      console.log("Salvando plano:", planoData);
      
      if (editingPlano) {
        await AssinaturaPlano.update(editingPlano.id, planoData);
        toast.success("Plano atualizado!");
      } else {
        const result = await AssinaturaPlano.create(planoData);
        console.log("Plano criado:", result);
        toast.success("Plano criado!");
      }
      
      setShowForm(false);
      setEditingPlano(null);
      await loadPlanos();
      
    } catch (error) {
      console.error("ERRO AO SALVAR:", error);
      toast.error("Erro: " + error.message);
    }
  };

  const handleToggleStatus = async (plano) => {
    try {
      await AssinaturaPlano.update(plano.id, { ativo: !plano.ativo });
      toast.success(`Plano ${plano.ativo ? 'desativado' : 'ativado'}!`);
      await loadPlanos();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-3">Carregando planos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Erro ao carregar planos</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={loadPlanos}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Planos de Assinatura</h1>
          <p className="text-slate-600 mt-1">Gerir pacotes e valores dos planos</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadPlanos} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold">{planos.length}</p>
              </div>
              <ListChecks className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {planos.filter(p => p.ativo).length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Inativos</p>
                <p className="text-2xl font-bold text-red-600">
                  {planos.filter(p => !p.ativo).length}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800">Inativo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Pesquisar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <div className="grid gap-4">
        {filteredPlanos.length > 0 ? (
          filteredPlanos.map((plano) => (
            <PlanoCard
              key={plano.id}
              plano={plano}
              onViewDetails={() => {
                setSelectedPlano(plano);
                setShowDetails(true);
              }}
              onEdit={() => {
                setEditingPlano(plano);
                setShowForm(true);
              }}
              onToggleStatus={() => handleToggleStatus(plano)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <ListChecks className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              {searchTerm ? "Nenhum plano encontrado" : "Nenhum plano cadastrado"}
            </h3>
            <p className="text-slate-500 mb-4">
              {searchTerm 
                ? "Tente ajustar os termos de pesquisa." 
                : "Crie o primeiro plano de assinatura."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Plano
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlano ? "Editar Plano" : "Novo Plano"}
            </DialogTitle>
          </DialogHeader>
          <FormPlano
            plano={editingPlano}
            onSave={handleSavePlano}
            onCancel={() => {
              setShowForm(false);
              setEditingPlano(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Plano</DialogTitle>
          </DialogHeader>
          {selectedPlano && (
            <DetalhesPlano
              plano={selectedPlano}
              onEdit={() => {
                setEditingPlano(selectedPlano);
                setShowDetails(false);
                setShowForm(true);
              }}
              onToggleStatus={() => {
                handleToggleStatus(selectedPlano);
                setShowDetails(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}