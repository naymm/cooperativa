import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Cooperado } from "@/api/entities";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  UserCircle,
  CreditCard,
  Building2,
  Home,
  Bell,
  MessageSquare,
  HelpCircle,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  KeyRound
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { title: "Painel Principal", url: createPageUrl("PortalDashboard"), icon: LayoutDashboard },
  { title: "Meu Perfil", url: createPageUrl("PortalPerfilCooperado"), icon: UserCircle },
  { title: "Financeiro", url: createPageUrl("PortalFinanceiro"), icon: CreditCard },
  { title: "Cartão Digital", url: createPageUrl("PortalCartaoCooperado"), icon: Building2 },
  { title: "Gerir Participação", url: createPageUrl("PortalGerenciamentoParticipacao"), icon: Home },
  { title: "Projetos", url: createPageUrl("PortalProjetosCooperativa"), icon: Home },
  { title: "Notificações", url: createPageUrl("PortalNotificacoes"), icon: Bell },
  // { title: "Chat Direto", url: createPageUrl("PortalChat"), icon: MessageSquare },
  // { title: "Perguntas Frequentes", url: createPageUrl("PortalFAQ"), icon: HelpCircle },
  { title: "Documentos e Normas", url: createPageUrl("PortalDocumentosNormas"), icon: FileText },
];

export default function PortalLayout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cooperado, setCooperado] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCooperado = async () => {
      const cooperadoId = localStorage.getItem('loggedInCooperadoId');
      if (cooperadoId) {
        try {
          const cooperadoData = await Cooperado.filter({ numero_associado: cooperadoId });
          if (cooperadoData.length > 0) {
            setCooperado(cooperadoData[0]);
          } else {
            handleLogout(); // Se não encontrar, força logout
          }
        } catch (error) {
          console.error("Erro ao buscar dados do cooperado no layout:", error);
          handleLogout(); // Erro ao buscar, força logout
        }
      } else {
        handleLogout(); // Sem ID, força logout
      }
      setLoadingUser(false);
    };
    fetchCooperado();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInCooperadoId');
    localStorage.removeItem('rememberCooperado');
    navigate(createPageUrl("PortalLogin"));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3664]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar Fixo para Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1f3664] text-white shadow-xl fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-[#3a507e]">
          <Link to={createPageUrl("PortalDashboard")} className="flex items-center gap-3">
            <div>
              <img 
                src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logowhite-scaled.png" 
                alt="CoopHabitat Logo" 
                className="h-10 w-auto"
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${location.pathname === item.url
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-white' : 'text-blue-200'}`} />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#3a507e]">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-white/5 rounded-lg text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={cooperado?.foto_url} alt={cooperado?.nome_completo} />
                    <AvatarFallback className="bg-blue-200 text-[#1f3664] font-semibold">
                      {getInitials(cooperado?.nome_completo)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium text-sm truncate max-w-[120px]">{cooperado?.nome_completo}</p>
                    <p className="text-xs text-blue-200">{cooperado?.numero_associado}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 mb-2 ml-2">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <Link to={createPageUrl("PortalPerfilCooperado")}>
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Ver Perfil
                </DropdownMenuItem>
              </Link>
              <Link to={createPageUrl("PortalAlterarSenha")}>
                <DropdownMenuItem className="cursor-pointer">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Alterar Senha
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Sidebar para Mobile/Tablet (Toggle) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-64 bg-[#1f3664] text-white shadow-xl z-50">
             <div className="p-6 border-b border-[#3a507e] flex items-center justify-between">
              <Link to={createPageUrl("PortalDashboard")} className="flex items-center gap-3" onClick={() => setIsMobileSidebarOpen(false)}>
                 <img 
                    src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logowhite-scaled.png" 
                    alt="CoopHabitat Logo" 
                    className="h-10 w-auto"
                  />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)} className="text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setIsMobileSidebarOpen(false)}
                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${location.pathname === item.url
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-white' : 'text-blue-200'}`} />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-[#3a507e]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-white/5 rounded-lg text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={cooperado?.foto_url} alt={cooperado?.nome_completo} />
                           <AvatarFallback className="bg-blue-200 text-[#1f3664] font-semibold">
                            {getInitials(cooperado?.nome_completo)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-sm truncate max-w-[120px]">{cooperado?.nome_completo}</p>
                           <p className="text-xs text-blue-200">{cooperado?.numero_associado}</p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-56 mb-2 ml-2">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <Link to={createPageUrl("PortalPerfilCooperado")}>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setIsMobileSidebarOpen(false)}>
                        <UserCircle className="w-4 h-4 mr-2" />
                        Ver Perfil
                      </DropdownMenuItem>
                    </Link>
                     <Link to={createPageUrl("PortalAlterarSenha")}>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setIsMobileSidebarOpen(false)}>
                        <KeyRound className="w-4 h-4 mr-2" />
                        Alterar Senha
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { handleLogout(); setIsMobileSidebarOpen(false);}} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </aside>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col lg:ml-64">
        {/* Header para Mobile/Tablet */}
        <header className="lg:hidden bg-white shadow-md p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("PortalDashboard")} className="flex items-center gap-2">
               <img 
                  src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logoblue-scaled.png"
                  alt="CoopHabitat Logo" 
                  className="h-8 w-auto"
                />
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)} className="text-slate-700">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}