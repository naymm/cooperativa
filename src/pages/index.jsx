import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Inscricoes from "./Inscricoes";

import Cooperados from "./Cooperados";

import Projetos from "./Projetos";

import Pagamentos from "./Pagamentos";

import Relatorios from "./Relatorios";

import PlanosAssinatura from "./PlanosAssinatura";

import PerfilUsuario from "./PerfilUsuario";

import CadastroPublico from "./CadastroPublico";

import PortalLogin from "./PortalLogin";

import AdminLogin from "./AdminLogin";

import PortalDashboard from "./PortalDashboard";

import PortalPerfilCooperado from "./PortalPerfilCooperado";

import PortalFinanceiro from "./PortalFinanceiro";

import PortalCartaoCooperado from "./PortalCartaoCooperado";

import PortalGerenciamentoParticipacao from "./PortalGerenciamentoParticipacao";

import PortalProjetosCooperativa from "./PortalProjetosCooperativa";

import PortalNotificacoes from "./PortalNotificacoes";

import PortalChat from "./PortalChat";

import PortalFAQ from "./PortalFAQ";

import PortalCalendario from "./PortalCalendario";

import PortalDocumentosNormas from "./PortalDocumentosNormas";

import PortalAlterarSenha from "./PortalAlterarSenha";
import PortalPagamentoTaxa from "./PortalPagamentoTaxa";
import PortalInscricaoProjetos from "./PortalInscricaoProjetos";

import NotificacoesCooperados from "./NotificacoesCooperados";

import Comunicacao from "./Comunicacao";

import Cobrancas from "./Cobrancas";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PortalProtectedRoute from "@/components/portal/PortalProtectedRoute";
import AutoRedirect from "@/components/auth/AutoRedirect";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Inscricoes: Inscricoes,
    
    Cooperados: Cooperados,
    
    Projetos: Projetos,
    
    Pagamentos: Pagamentos,
    
    Relatorios: Relatorios,
    
    PlanosAssinatura: PlanosAssinatura,
    
    PerfilUsuario: PerfilUsuario,
    
    CadastroPublico: CadastroPublico,
    
    PortalLogin: PortalLogin,
    
    AdminLogin: AdminLogin,
    
    PortalDashboard: PortalDashboard,
    
    PortalPerfilCooperado: PortalPerfilCooperado,
    
    PortalFinanceiro: PortalFinanceiro,
    
    PortalCartaoCooperado: PortalCartaoCooperado,
    
    PortalGerenciamentoParticipacao: PortalGerenciamentoParticipacao,
    
    PortalProjetosCooperativa: PortalProjetosCooperativa,
    
    PortalNotificacoes: PortalNotificacoes,
    
    PortalChat: PortalChat,
    
    PortalFAQ: PortalFAQ,
    
    PortalCalendario: PortalCalendario,
    
    PortalDocumentosNormas: PortalDocumentosNormas,
    
    PortalAlterarSenha: PortalAlterarSenha,
    PortalPagamentoTaxa: PortalPagamentoTaxa,
    PortalInscricaoProjetos: PortalInscricaoProjetos,
    
    NotificacoesCooperados: NotificacoesCooperados,
    
    Comunicacao: Comunicacao,
    
    Cobrancas: Cobrancas,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AutoRedirect />} />
                
                
                <Route path="/Dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/Inscricoes" element={
                    <ProtectedRoute>
                        <Inscricoes />
                    </ProtectedRoute>
                } />
                
                <Route path="/Cooperados" element={
                    <ProtectedRoute>
                        <Cooperados />
                    </ProtectedRoute>
                } />
                
                <Route path="/Projetos" element={
                    <ProtectedRoute>
                        <Projetos />
                    </ProtectedRoute>
                } />
                
                <Route path="/Pagamentos" element={
                    <ProtectedRoute>
                        <Pagamentos />
                    </ProtectedRoute>
                } />
                
                <Route path="/Relatorios" element={
                    <ProtectedRoute>
                        <Relatorios />
                    </ProtectedRoute>
                } />
                
                <Route path="/PlanosAssinatura" element={
                    <ProtectedRoute>
                        <PlanosAssinatura />
                    </ProtectedRoute>
                } />
                
                <Route path="/PerfilUsuario" element={
                    <ProtectedRoute>
                        <PerfilUsuario />
                    </ProtectedRoute>
                } />
                
                <Route path="/CadastroPublico" element={<CadastroPublico />} />
                
                <Route path="/PortalLogin" element={<PortalLogin />} />
                
                <Route path="/AdminLogin" element={<AdminLogin />} />
                
                <Route path="/PortalDashboard" element={
                    <PortalProtectedRoute>
                        <PortalDashboard />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalPerfilCooperado" element={
                    <PortalProtectedRoute>
                        <PortalPerfilCooperado />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalFinanceiro" element={
                    <PortalProtectedRoute>
                        <PortalFinanceiro />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalCartaoCooperado" element={
                    <PortalProtectedRoute>
                        <PortalCartaoCooperado />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalGerenciamentoParticipacao" element={
                    <PortalProtectedRoute>
                        <PortalGerenciamentoParticipacao />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalProjetosCooperativa" element={
                    <PortalProtectedRoute>
                        <PortalProjetosCooperativa />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalNotificacoes" element={
                    <PortalProtectedRoute>
                        <PortalNotificacoes />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalChat" element={
                    <PortalProtectedRoute>
                        <PortalChat />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalFAQ" element={
                    <PortalProtectedRoute>
                        <PortalFAQ />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalCalendario" element={
                    <PortalProtectedRoute>
                        <PortalCalendario />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalDocumentosNormas" element={
                    <PortalProtectedRoute>
                        <PortalDocumentosNormas />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/PortalAlterarSenha" element={<PortalAlterarSenha />} />
                <Route path="/PortalPagamentoTaxa" element={<PortalPagamentoTaxa />} />
                <Route path="/PortalInscricaoProjetos" element={
                    <PortalProtectedRoute>
                        <PortalInscricaoProjetos />
                    </PortalProtectedRoute>
                } />
                
                <Route path="/NotificacoesCooperados" element={
                    <ProtectedRoute>
                        <NotificacoesCooperados />
                    </ProtectedRoute>
                } />
                
                <Route path="/Comunicacao" element={
                    <ProtectedRoute>
                        <Comunicacao />
                    </ProtectedRoute>
                } />
                
                <Route path="/Cobrancas" element={
                    <ProtectedRoute>
                        <Cobrancas />
                    </ProtectedRoute>
                } />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}