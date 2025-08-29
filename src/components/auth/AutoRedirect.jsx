import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AutoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há usuário administrativo logado
    const adminUser = localStorage.getItem('loggedInAdminUser');
    if (adminUser) {
      navigate(createPageUrl("Dashboard"));
      return;
    }

    // Verificar se há cooperado logado
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    if (cooperadoId) {
      navigate(createPageUrl("PortalDashboard"));
      return;
    }

    // Se não há ninguém logado, redirecionar para a página de login administrativo
    navigate(createPageUrl("AdminLogin"));
  }, [navigate]);

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
        <p className="text-slate-700 font-medium">Redirecionando...</p>
      </div>
    </div>
  );
}
