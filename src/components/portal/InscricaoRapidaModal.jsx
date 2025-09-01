import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  X,
  Heart,
  DollarSign,
  Calendar,
  FileText,
  Loader2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import inscricaoProjetoService from "@/services/InscricaoProjetoService";

export default function InscricaoRapidaModal({ projeto, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    valor_interesse: projeto?.preco_final?.toString() || "",
    forma_pagamento: undefined,
    prazo_interesse: "",
    observacoes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Obter ID do cooperado do localStorage
  const getCooperadoId = () => {
    try {
      const cooperadoDataStr = localStorage.getItem('loggedInCooperadoData');
      if (cooperadoDataStr) {
        const data = JSON.parse(cooperadoDataStr);
        return data.id;
      }
    } catch (error) {
      console.error("Erro ao obter dados do cooperado:", error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cooperadoId = getCooperadoId();
    if (!cooperadoId) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    if (!formData.valor_interesse || !formData.forma_pagamento) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const dadosInscricao = {
        project_id: projeto.id,
        cooperado_id: cooperadoId,
        valor_interesse: parseFloat(formData.valor_interesse),
        forma_pagamento: formData.forma_pagamento,
        prazo_interesse: formData.prazo_interesse,
        observacoes: formData.observacoes
      };

      // Tentar método alternativo se o principal falhar
      try {
        await inscricaoProjetoService.criarInscricao(dadosInscricao);
      } catch (error) {
        console.log("🔄 Tentando método alternativo...");
        await inscricaoProjetoService.criarInscricaoAlternativo(dadosInscricao);
      }
      
      toast.success("Inscrição realizada com sucesso!");
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Erro ao criar inscrição:", error);
      setError(error.message || "Erro ao realizar inscrição");
      toast.error(error.message || "Erro ao realizar inscrição");
    } finally {
      setSubmitting(false);
    }
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Inscrever-se no Projeto</h2>
            <p className="text-slate-600 mt-1">{projeto?.nome}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Resumo do Projeto */}
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Resumo do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Tipo</p>
                    <p className="font-semibold text-slate-900">{projeto?.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <p className="font-semibold text-slate-900">{projeto?.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Área Útil</p>
                    <p className="font-semibold text-slate-900">{projeto?.area_util} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Preço Final</p>
                    <p className="font-semibold text-blue-600">
                      {projeto?.preco_final ? formatarValor(projeto.preco_final) : "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Erro */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Formulário de Inscrição */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor_interesse">Valor de Interesse (Kz)</Label>
                  <Input
                    id="valor_interesse"
                    type="number"
                    value={formData.valor_interesse}
                    onChange={(e) => setFormData({...formData, valor_interesse: e.target.value})}
                    placeholder="Ex: 5000000"
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Valor que você está disposto a investir
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                  <Select 
                    value={formData.forma_pagamento} 
                    onValueChange={(value) => setFormData({...formData, forma_pagamento: value})}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="financiamento">Financiamento</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="prazo_interesse">Prazo de Interesse</Label>
                <Input
                  id="prazo_interesse"
                  type="date"
                  value={formData.prazo_interesse}
                  onChange={(e) => setFormData({...formData, prazo_interesse: e.target.value})}
                  disabled={submitting}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Até quando você tem interesse neste projeto
                </p>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Informações adicionais sobre seu interesse no projeto..."
                  rows={3}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Informações Importantes */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Informações importantes:</strong></p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Sua inscrição será analisada pela administração</li>
                    <li>• Você receberá notificação sobre o status da inscrição</li>
                    <li>• Pode cancelar a inscrição a qualquer momento</li>
                    <li>• Apenas uma inscrição por projeto é permitida</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Ações */}
            <div className="flex gap-4 pt-4 border-t">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                disabled={submitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Confirmar Inscrição
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
