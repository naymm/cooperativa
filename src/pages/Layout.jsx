

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, CrmUser } from "@/api/entities"; 
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Home, 
  CreditCard, 
  BarChart3,
  LogOut,
  Building2,
  ListChecks,
  UserCircle,
  Bell,
  Mail,
  AlertTriangle
} from "lucide-react";
import NotificationBell from "@/components/crm/NotificationBell";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const crmNavigationItems = [
  { title: "Visão Geral", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Inscrições", url: createPageUrl("Inscricoes"), icon: UserCheck },
  { title: "Cooperados", url: createPageUrl("Cooperados"), icon: Users },
  { title: "Projetos", url: createPageUrl("Projetos"), icon: Home },
  { title: "Planos de Assinatura", url: createPageUrl("PlanosAssinatura"), icon: ListChecks },
  { title: "Pagamentos", url: createPageUrl("Pagamentos"), icon: CreditCard },
  { title: "Cobranças", url: createPageUrl("Cobrancas"), icon: AlertTriangle },
  { title: "Comunicação", url: createPageUrl("Comunicacao"), icon: Mail },
  { title: "Notificações", url: createPageUrl("NotificacoesCooperados"), icon: Bell },
  { title: "Relatórios", url: createPageUrl("Relatorios"), icon: BarChart3 },
];

// Lista de nomes de páginas que pertencem ao Portal do Cooperado
const portalPageNames = [
  "PortalLogin",
  "PortalDashboard",
  "PortalPerfilCooperado",
  "PortalFinanceiro",
  "PortalCartaoCooperado",
  "PortalGerenciamentoParticipacao",
  "PortalProjetosCooperativa",
  "PortalNotificacoes",
  "PortalChat",
  "PortalFAQ",
  "PortalCalendario",
  "PortalDocumentosNormas",
  "PortalRecuperarSenha",
  "PortalConfirmacaoSenhaReset"
];

// Lista de páginas públicas que não precisam de autenticação
const publicPageNames = [
  "CadastroPublico",
  "AdminLogin"
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [userLoading, setUserLoading] = React.useState(true);

  // Verifica se a página atual é uma página do Portal do Cooperado
  const isPortalPage = portalPageNames.includes(currentPageName);
  
  // Verifica se a página atual é uma página pública
  const isPublicPage = publicPageNames.includes(currentPageName);

  React.useEffect(() => {
    // Apenas buscar dados do usuário do CRM se não for uma página do portal nem pública
    if (!isPortalPage && !isPublicPage) {
      const fetchUser = async () => {
        try {
          // Primeiro verificar se há usuário no localStorage (sistema administrativo)
          const storedUser = localStorage.getItem('loggedInAdminUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            setUserLoading(false);
            return;
          }

          // Se não há usuário no localStorage, não há como buscar do sistema CrmUser
          // pois precisamos do email para fazer a busca
          console.log("Nenhum usuário administrativo logado");
        } catch (error) {
          console.error("Erro ao buscar usuário do CRM no layout:", error);
        } finally {
          setUserLoading(false);
        }
      };
      fetchUser();
    } else {
      setUserLoading(false); // Para páginas do portal e públicas, não há usuário do CRM para carregar
    }
  }, [isPortalPage, isPublicPage, currentPageName]);

  const handleLogout = () => {
    // Limpar dados do sistema administrativo
    localStorage.removeItem('loggedInAdminUser');
    localStorage.removeItem('rememberAdmin');
    // Redirecionar para a página de login
    window.location.href = createPageUrl("AdminLogin");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };

  // Se for uma página do Portal do Cooperado ou página pública, renderiza apenas os children
  if (isPortalPage || isPublicPage) {
    return <>{children}</>;
  }

  // Se for uma página do CRM, renderiza o layout completo do CRM com ProtectedRoute
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SidebarProvider>
          <div className="flex w-full">
            <Sidebar className="border-r border-slate-200 bg-white/95 backdrop-blur hidden lg:flex">
              <SidebarHeader className="border-b border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <div>
                    <img 
                      src="https://gruposanep.co.ao/wp-content/uploads/2025/06/logodark-scaled.png" 
                      alt="CoopHabitat Logo" 
                      className="h-12 w-auto"
                    />
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="p-3">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                    Menu Principal
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {crmNavigationItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`transition-all duration-200 rounded-xl mx-1 ${
                              location.pathname === item.url 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                                : 'hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                              <item.icon className={`w-5 h-5 ${
                                location.pathname === item.url ? 'text-blue-600' : 'text-slate-400'
                              }`} />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="border-t border-slate-200 p-4">
                {!userLoading && currentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-slate-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarImage src={currentUser.picture} alt={currentUser.full_name} />
                            <AvatarFallback className="bg-slate-200 text-slate-600 font-semibold">
                              {getInitials(currentUser.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <p className="font-medium text-slate-800 text-sm truncate max-w-[120px]">{currentUser.full_name}</p>
                            <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-56 mb-2 ml-2">
                      <DropdownMenuLabel>Minha Conta (CRM)</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to={createPageUrl("PerfilUsuario")}>
                        <DropdownMenuItem className="cursor-pointer">
                          <UserCircle className="w-4 h-4 mr-2" />
                          Ver Perfil
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair do CRM
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {userLoading && !isPortalPage && !isPublicPage && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                )}
              </SidebarFooter>
            </Sidebar>

            <main className="flex-1 flex flex-col min-h-screen">
              {/* --- NOVO CABEÇALHO PRINCIPAL --- */}
              <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200 lg:hidden" />
                </div>
                
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  
                  {!userLoading && currentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto">
                          <Avatar className="w-8 h-8 cursor-pointer">
                            <AvatarImage src={currentUser.picture} alt={currentUser.full_name} />
                            <AvatarFallback className="bg-slate-200 text-slate-600 font-semibold text-xs">
                              {getInitials(currentUser.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="hidden md:flex flex-col items-start">
                            <p className="font-medium text-sm text-slate-800">{currentUser.full_name}</p>
                            <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="mr-2">
                        <DropdownMenuLabel className="truncate max-w-[150px]">{currentUser.full_name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link to={createPageUrl("PerfilUsuario")}>
                          <DropdownMenuItem className="cursor-pointer">
                            <UserCircle className="w-4 h-4 mr-2" />
                            Ver Perfil
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair do CRM
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {userLoading && !isPortalPage && !isPublicPage && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                  )}
                </div>
              </header>

              <div className="flex-1 p-6">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
  );
}

