import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CrmUser } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building2, LogIn, User as UserIcon, Lock, AlertTriangle, Loader2, Shield } from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem('loggedInAdminUser');
    const rememberMe = localStorage.getItem('rememberAdmin') === 'true';
    if (rememberedUser && rememberMe) {
      navigate(createPageUrl("Dashboard"));
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

    if (!formData.username || !formData.password) {
      setError("Nome de usuário e senha são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      console.log("Tentando fazer login com:", formData.username);
      
      // Buscar usuário na tabela CrmUser
      const [crmUser] = await CrmUser.filter({
        username: formData.username.toLowerCase(),
        active: true
      });

      console.log("Resultado da busca:", crmUser);

      if (!crmUser) {
        setError("Nome de usuário não encontrado ou conta inativa.");
        setLoading(false);
        return;
      }

      // Verificar senha
      if (formData.password !== crmUser.password_hash) {
        setError("Senha incorreta.");
        setLoading(false);
        return;
      }

      // Verificar se o usuário tem permissão de administrador
      if (!crmUser.role || !['admin', 'manager', 'super_admin'].includes(crmUser.role.toLowerCase())) {
        setError("Acesso negado. Apenas administradores podem acessar o sistema.");
        setLoading(false);
        return;
      }

      // Sucesso no login
      localStorage.setItem('loggedInAdminUser', JSON.stringify(crmUser));
      if (formData.remember) {
        localStorage.setItem('rememberAdmin', 'true');
      } else {
        localStorage.removeItem('rememberAdmin');
      }
      
      toast.success(`Bem-vindo(a) de volta, ${crmUser.full_name?.split(" ")[0] || 'Administrador'}!`);
      navigate(createPageUrl("Dashboard"));

    } catch (err) {
      console.error("Erro no login:", err);
      if (err.message && err.message.toLowerCase().includes("rate limit exceeded")) {
          setError("Muitas tentativas de login. Por favor, aguarde um momento e tente novamente.");
      } else if (err.message && err.message.toLowerCase().includes("invalid credentials")) {
          setError("Email ou senha incorretos.");
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
            className="h-12 w-auto mx-auto mb-6"
          />
          <CardTitle className="text-2xl font-bold">Sistema Administrativo</CardTitle>
          <CardDescription className="text-blue-100">Acesse o painel de controle da cooperativa.</CardDescription>
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
              <Label htmlFor="username" className="flex items-center text-slate-700">
                <UserIcon className="w-4 h-4 mr-2 text-slate-500" />
                Nome de Usuário
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="seu.usuario"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 text-base py-2.5 px-4"
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center text-slate-700">
                <Lock className="w-4 h-4 mr-2 text-slate-500" />
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha de acesso"
                value={formData.password}
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
                <Shield className="mr-2 h-5 w-5" />
              )}
              {loading ? "Acessando..." : "Acessar Sistema"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="p-6 bg-slate-50 border-t">
          <p className="text-sm text-slate-600 text-center w-full">
            É cooperado? {" "}
            <Link to={createPageUrl("PortalLogin")} className="font-medium text-[#1f3664] hover:underline">
              Acesse o portal do cooperado
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
