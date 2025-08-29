import React, { useState, useEffect, useCallback, useRef } from "react";
import { CrmUser } from "@/api/entities";
import { Shield, Lock, AlertTriangle, UserX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";

export default function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const redirectInitiated = useRef(false);

  const redirectToLogin = useCallback(() => {
    if (redirectInitiated.current) return; 
    redirectInitiated.current = true; 

    localStorage.removeItem('loggedInAdminUser');
    localStorage.removeItem('rememberAdmin');
    window.location.href = createPageUrl("AdminLogin");
  }, []);

  const checkAdminAuthentication = useCallback(async () => {
    setLoading(true);
    setError(false);
    setErrorMessage("");
    
    try {
      // Verificar se há usuário logado no localStorage
      const storedUser = localStorage.getItem('loggedInAdminUser');
      
      if (!storedUser) {
        redirectToLogin();
        return; 
      }

      // Verificar se o usuário ainda existe e está ativo na tabela CrmUser
      const [crmUser] = await CrmUser.filter({
        username: JSON.parse(storedUser).username,
        active: true
      });
      
      if (!crmUser) {
        setError(true);
        setErrorMessage("Sua conta foi desativada ou não foi encontrada. Por favor, faça login novamente.");
        return; 
      }

      // Verificar se o usuário tem permissão de administrador
      if (!crmUser.role || !['admin', 'manager', 'super_admin'].includes(crmUser.role.toLowerCase())) {
        setError(true);
        setErrorMessage("Acesso negado. Apenas administradores podem acessar o sistema.");
        return; 
      }

      setCurrentUser(crmUser);
      
    } catch (err) {
      console.error("Erro na verificação de autenticação administrativa:", err);
      setError(true);
      if (err.message && err.message.toLowerCase().includes("rate limit exceeded")) {
          setErrorMessage("O sistema está sobrecarregado. Por favor, tente novamente em alguns minutos.");
      } else {
          setErrorMessage("Erro ao verificar suas credenciais.");
      }
      return;
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  useEffect(() => {
    checkAdminAuthentication();
  }, [checkAdminAuthentication]);

  if (redirectInitiated.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1f3664] to-[#2c4a8a] rounded-2xl shadow-lg mb-4">
            <img 
                src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logowhite-scaled.png" 
                alt="CoopHabitat Logo" 
                className="h-8 w-auto animate-pulse"
              />
          </div>
          <p className="text-slate-700 font-medium">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1f3664] to-[#2c4a8a] rounded-2xl shadow-lg mb-4">
             <img 
                src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logowhite-scaled.png" 
                alt="CoopHabitat Logo" 
                className="h-8 w-auto animate-pulse"
              />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f3664] mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Verificando acesso...</p>
          <p className="text-sm text-slate-500">Sistema Administrativo</p>
        </div>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-slate-800 mb-2">
              Acesso Negado
            </CardTitle>
            <p className="text-sm text-slate-600">
              {errorMessage || "Erro ao verificar suas credenciais. Tente fazer login novamente."}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Sistema Administrativo</p>
                  <p className="text-red-700">
                    Este sistema é exclusivo para administradores autorizados. Se você deveria ter acesso, entre em contato com o suporte.
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={redirectToLogin}
              className="w-full bg-[#1f3664] hover:bg-[#16284a] text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return React.cloneElement(children, { currentUser }); // Passar o usuário para os filhos
}