import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  User, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Send
} from "lucide-react";

const tiposNotificacao = [
  { value: "info", label: "Informação", icon: Info, color: "blue" },
  { value: "warning", label: "Aviso", icon: AlertTriangle, color: "yellow" },
  { value: "success", label: "Sucesso", icon: CheckCircle, color: "green" },
  { value: "error", label: "Erro", icon: XCircle, color: "red" }
];

export default function FormNotificacao({ notificacao, cooperados, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    cooperado_id: notificacao?.cooperado_id || "",
    titulo: notificacao?.titulo || "",
    mensagem: notificacao?.mensagem || "",
    tipo: notificacao?.tipo || "info",
    link_acao: notificacao?.link_acao || ""
  });

  const [modoEnvio, setModoEnvio] = useState("individual"); // "individual", "multiplos", "todos"
  const [cooperadosSelecionados, setCooperadosSelecionados] = useState([]);
  const [searchCooperados, setSearchCooperados] = useState("");
  const [errors, setErrors] = useState({});

  const cooperadosFiltrados = cooperados.filter(c =>
    c.nome_completo?.toLowerCase().includes(searchCooperados.toLowerCase()) ||
    c.numero_associado?.includes(searchCooperados) ||
    c.email?.toLowerCase().includes(searchCooperados.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.titulo) newErrors.titulo = "Título é obrigatório";
    if (!formData.mensagem) newErrors.mensagem = "Mensagem é obrigatória";
    
    if (modoEnvio === "individual" && !formData.cooperado_id) {
      newErrors.cooperado_id = "Selecione um cooperado";
    }
    
    if (modoEnvio === "multiplos" && cooperadosSelecionados.length === 0) {
      newErrors.cooperados = "Selecione pelo menos um cooperado";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let dataToSave = { ...formData };
      
      if (modoEnvio === "multiplos") {
        dataToSave.destinatarios = cooperadosSelecionados;
      } else if (modoEnvio === "todos") {
        dataToSave.destinatarios = cooperados
          .filter(c => c.status === 'ativo')
          .map(c => c.numero_associado);
      }
      
      onSave(dataToSave);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCooperadoToggle = (cooperadoId, checked) => {
    setCooperadosSelecionados(prev => 
      checked 
        ? [...prev, cooperadoId]
        : prev.filter(id => id !== cooperadoId)
    );
  };

  const selecionarTodos = () => {
    const todosAtivos = cooperados
      .filter(c => c.status === 'ativo')
      .map(c => c.numero_associado);
    setCooperadosSelecionados(todosAtivos);
  };

  const limparSelecao = () => {
    setCooperadosSelecionados([]);
  };

  const tipoSelecionado = tiposNotificacao.find(t => t.value === formData.tipo);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tiposNotificacao.map((tipo) => {
              const Icon = tipo.icon;
              const isSelected = formData.tipo === tipo.value;
              return (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => handleChange("tipo", tipo.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-${tipo.color}-500 bg-${tipo.color}-50`
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    isSelected ? `text-${tipo.color}-600` : "text-slate-400"
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? `text-${tipo.color}-700` : "text-slate-600"
                  }`}>
                    {tipo.label}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo da Notificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              placeholder="Título da notificação"
              className="mt-1"
            />
            {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
          </div>

          <div>
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => handleChange("mensagem", e.target.value)}
              placeholder="Conteúdo detalhado da notificação..."
              rows={4}
              className="mt-1"
            />
            {errors.mensagem && <p className="text-red-500 text-sm mt-1">{errors.mensagem}</p>}
          </div>

          <div>
            <Label htmlFor="link_acao">Link de Ação (Opcional)</Label>
            <Input
              id="link_acao"
              value={formData.link_acao}
              onChange={(e) => handleChange("link_acao", e.target.value)}
              placeholder="URL para redirecionar quando a notificação for clicada"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Destinatários */}
      {!notificacao && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Destinatários</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={modoEnvio} onValueChange={setModoEnvio}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="individual" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Individual
                </TabsTrigger>
                <TabsTrigger value="multiplos" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Múltiplos
                </TabsTrigger>
                <TabsTrigger value="todos" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Todos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual" className="mt-4">
                <div>
                  <Label>Selecionar Cooperado *</Label>
                  <Select value={formData.cooperado_id} onValueChange={(value) => handleChange("cooperado_id", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Escolher cooperado" />
                    </SelectTrigger>
                    <SelectContent>
                      {cooperados.map(cooperado => (
                        <SelectItem key={cooperado.numero_associado} value={cooperado.numero_associado}>
                          {cooperado.nome_completo} (#{cooperado.numero_associado})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cooperado_id && <p className="text-red-500 text-sm mt-1">{errors.cooperado_id}</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="multiplos" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="relative flex-1 mr-4">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Pesquisar cooperados..."
                        value={searchCooperados}
                        onChange={(e) => setSearchCooperados(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={selecionarTodos}>
                        Selecionar Todos
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={limparSelecao}>
                        Limpar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto border rounded-lg p-4">
                    <div className="space-y-2">
                      {cooperadosFiltrados.map(cooperado => (
                        <div key={cooperado.numero_associado} className="flex items-center space-x-3">
                          <Checkbox
                            checked={cooperadosSelecionados.includes(cooperado.numero_associado)}
                            onCheckedChange={(checked) => handleCooperadoToggle(cooperado.numero_associado, checked)}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{cooperado.nome_completo}</p>
                            <p className="text-sm text-slate-500">#{cooperado.numero_associado} • {cooperado.email}</p>
                          </div>
                          <Badge variant={cooperado.status === 'ativo' ? 'default' : 'secondary'}>
                            {cooperado.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {cooperadosSelecionados.length > 0 && (
                    <p className="text-sm text-blue-600">
                      {cooperadosSelecionados.length} cooperados selecionados
                    </p>
                  )}
                  
                  {errors.cooperados && <p className="text-red-500 text-sm">{errors.cooperados}</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="todos" className="mt-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">Enviar para todos os cooperados ativos</p>
                  <p className="text-blue-600 text-sm mt-1">
                    Esta notificação será enviada para {cooperados.filter(c => c.status === 'ativo').length} cooperados ativos.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pré-visualização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-slate-50">
            <div className="flex items-start gap-3">
              {tipoSelecionado && (
                <div className={`p-2 rounded-full bg-${tipoSelecionado.color}-100`}>
                  <tipoSelecionado.icon className={`w-5 h-5 text-${tipoSelecionado.color}-600`} />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800">
                  {formData.titulo || "Título da notificação"}
                </h4>
                <p className="text-slate-600 mt-1">
                  {formData.mensagem || "Mensagem da notificação aparecerá aqui..."}
                </p>
                {formData.link_acao && (
                  <p className="text-blue-600 text-sm mt-2">
                    🔗 Link: {formData.link_acao}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {notificacao ? "Atualizar" : "Enviar"} Notificação
        </Button>
      </div>
    </form>
  );
}