import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cooperado, CooperadoAuth } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building2, LogIn, User, Lock, AlertTriangle, Loader2, Shield } from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function PortalLogin() {
  const [formData, setFormData] = useState({
    numero_associado: "",
    senha: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedCooperadoId = localStorage.getItem('loggedInCooperadoId');
    const rememberMe = localStorage.getItem('rememberCooperado') === 'true';
    if (rememberedCooperadoId && rememberMe) {
      navigate(createPageUrl("PortalDashboard"));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.numero_associado || !formData.senha) {
      setError("Número de associado e senha são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const [cooperado] = await Cooperado.filter({
        numero_associado: formData.numero_associado.toUpperCase(),
        status: "ativo",
      });

      if (!cooperado) {
        setError("Cooperado não encontrado, inativo ou número de associado inválido.");
        setLoading(false);
        return;
      }

      const [authRecord] = await CooperadoAuth.filter({
        cooperado_id: cooperado.id,
      });

      if (!authRecord) {
        setError("Credenciais de acesso não encontradas para este cooperado.");
        setLoading(false);
        return;
      }
      
      if (formData.senha !== authRecord.senha_hash) {
        setError("Senha incorreta.");
        setLoading(false);
        return;
      }

      // Sucesso no login
      localStorage.setItem('loggedInCooperadoId', cooperado.numero_associado);
      if (formData.remember) {
        localStorage.setItem('rememberCooperado', 'true');
      } else {
        localStorage.removeItem('rememberCooperado');
      }
      
      toast.success(`Bem-vindo(a) de volta, ${cooperado.nome_completo.split(" ")[0]}!`);
      navigate(createPageUrl("PortalDashboard"));

    } catch (err) {
      console.error("Erro no login:", err);
      if (err.message && err.message.toLowerCase().includes("rate limit exceeded")) {
          setError("Muitas tentativas de login. Por favor, aguarde um momento e tente novamente.");
      } else {
          setError("Erro ao tentar fazer login. Verifique suas credenciais ou tente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-[#1f3664] text-white p-8 text-center">
           <img 
            src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logowhite-scaled.png" 
            alt="CoopHabitat Logo" 
            className="h-12 w-auto mx-auto mb-6" // Logo no cabeçalho
          />
          <CardTitle className="text-2xl font-bold">Portal do Cooperado</CardTitle>
          <CardDescription className="text-blue-100">Acesse sua conta para gerenciar sua participação.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-start gap-2" role="alert">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numero_associado" className="flex items-center text-slate-700">
                <User className="w-4 h-4 mr-2 text-slate-500" />
                Número de Associado
              </Label>
              <Input
                id="numero_associado"
                name="numero_associado"
                type="text"
                placeholder="Ex: CS1234"
                value={formData.numero_associado}
                onChange={handleChange}
                className="mt-1 text-base py-2.5 px-4"
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha" className="flex items-center text-slate-700">
                <Lock className="w-4 h-4 mr-2 text-slate-500" />
                Senha
              </Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Sua senha de acesso"
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 text-base py-2.5 px-4"
                autoComplete="current-password"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  name="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => handleChange({ target: { name: 'remember', type: 'checkbox', checked }})}
                />
                <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Lembrar-me</Label>
              </div>
              <Link to="#" className="text-sm text-[#1f3664] hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#1f3664] hover:bg-[#16284a] text-white text-base py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {loading ? "Acessando..." : "Acessar Portal"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="p-6 bg-slate-50 border-t">
          <div className="text-sm text-slate-600 text-center w-full space-y-2">
            <p>
              Ainda não é cooperado? {" "}
              <Link to={createPageUrl("CadastroPublico")} className="font-medium text-[#1f3664] hover:underline">
                Inscreva-se aqui
              </Link>
            </p>
            <div className="border-t border-slate-200 pt-2">
              <p className="text-xs text-slate-500 mb-1">Acesso Administrativo</p>
              <Link 
                to={createPageUrl("AdminLogin")} 
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#1f3664] transition-colors"
              >
                <Shield className="w-3 h-3" />
                Sistema Administrativo
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}