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

import NotificacoesCooperados from "./NotificacoesCooperados";

import Comunicacao from "./Comunicacao";

import Cobrancas from "./Cobrancas";

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
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Inscricoes" element={<Inscricoes />} />
                
                <Route path="/Cooperados" element={<Cooperados />} />
                
                <Route path="/Projetos" element={<Projetos />} />
                
                <Route path="/Pagamentos" element={<Pagamentos />} />
                
                <Route path="/Relatorios" element={<Relatorios />} />
                
                <Route path="/PlanosAssinatura" element={<PlanosAssinatura />} />
                
                <Route path="/PerfilUsuario" element={<PerfilUsuario />} />
                
                <Route path="/CadastroPublico" element={<CadastroPublico />} />
                
                <Route path="/PortalLogin" element={<PortalLogin />} />
                
                <Route path="/PortalDashboard" element={<PortalDashboard />} />
                
                <Route path="/PortalPerfilCooperado" element={<PortalPerfilCooperado />} />
                
                <Route path="/PortalFinanceiro" element={<PortalFinanceiro />} />
                
                <Route path="/PortalCartaoCooperado" element={<PortalCartaoCooperado />} />
                
                <Route path="/PortalGerenciamentoParticipacao" element={<PortalGerenciamentoParticipacao />} />
                
                <Route path="/PortalProjetosCooperativa" element={<PortalProjetosCooperativa />} />
                
                <Route path="/PortalNotificacoes" element={<PortalNotificacoes />} />
                
                <Route path="/PortalChat" element={<PortalChat />} />
                
                <Route path="/PortalFAQ" element={<PortalFAQ />} />
                
                <Route path="/PortalCalendario" element={<PortalCalendario />} />
                
                <Route path="/PortalDocumentosNormas" element={<PortalDocumentosNormas />} />
                
                <Route path="/NotificacoesCooperados" element={<NotificacoesCooperados />} />
                
                <Route path="/Comunicacao" element={<Comunicacao />} />
                
                <Route path="/Cobrancas" element={<Cobrancas />} />
                
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