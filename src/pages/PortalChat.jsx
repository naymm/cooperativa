import React, { useState, useEffect, useRef } from "react";
import { Cooperado, CooperadoSupporte } from "@/api/entities";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // Corrigido
import { Label } from "@/components/ui/label"; // Corrigido
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Loader2, 
  Info, 
  UserCircle,
  LifeBuoy,
  PlusCircle
} from "lucide-react";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { createPageUrl } from "@/utils"; // Corrigido

// ... resto do código de PortalChat.js (sem alterações na lógica, apenas imports corrigidos) ...
const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>;

const ChatMessage = ({ message, isOwn, cooperado }) => {
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "?";
  const authorName = isOwn ? (cooperado?.nome_completo || "Você") : "Suporte CoopHabitat";
  const authorInitials = getInitials(authorName);

  return (
    <div className={`flex gap-2.5 my-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">{authorInitials}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`px-3.5 py-2.5 rounded-xl ${isOwn ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
          <p className="text-sm leading-relaxed">{message.mensagem}</p>
        </div>
        <span className="text-xs text-slate-400">
          {format(parseISO(message.data), "HH:mm")}
        </span>
      </div>
       {isOwn && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-500 text-white text-xs">{authorInitials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default function PortalChat() {
  const [cooperado, setCooperado] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketAssunto, setNewTicketAssunto] = useState("");
  const [newTicketMensagem, setNewTicketMensagem] = useState("");
  const [newTicketCategoria, setNewTicketCategoria] = useState("outros");
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingTickets(true);
      try {
        const cooperadoId = localStorage.getItem('loggedInCooperadoId');
        if (!cooperadoId) {
          window.location.href = createPageUrl("PortalLogin"); // Usando createPageUrl
          return;
        }
        const [coopData] = await Cooperado.filter({ numero_associado: cooperadoId });
        if (!coopData) throw new Error("Cooperado não encontrado.");
        setCooperado(coopData);

        const ticketsData = await CooperadoSupporte.filter({ cooperado_id: cooperadoId }, "-created_date");
        setTickets(ticketsData);
        if (ticketsData.length > 0) {
          handleSelectTicket(ticketsData[0]); 
        }
      } catch (error) {
        console.error("Erro ao carregar dados do chat:", error);
        toast.error("Falha ao carregar seus tickets de suporte.");
      } finally {
        setLoadingTickets(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setMessages([]); 
    if (!ticket) return;
    
    setLoadingMessages(true);
    setMessages(ticket.historico_mensagens || []); 
    setLoadingMessages(false);
    setShowNewTicketForm(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket || !cooperado) return;

    setSendingMessage(true);
    try {
      const messageData = {
        autor: cooperado.numero_associado,
        mensagem: newMessage,
        data: new Date().toISOString()
      };
      
      const updatedHistorico = [...(selectedTicket.historico_mensagens || []), messageData];
      
      await CooperadoSupporte.update(selectedTicket.id, { 
        historico_mensagens: updatedHistorico,
        status: "aguardando_resposta" 
      });
      
      setMessages(updatedHistorico);
      setSelectedTicket(prev => ({...prev, historico_mensagens: updatedHistorico, status: "aguardando_resposta"}));
      setTickets(prevTickets => prevTickets.map(t => t.id === selectedTicket.id ? {...t, status: "aguardando_resposta", updated_date: new Date().toISOString()} : t).sort((a,b) => parseISO(b.updated_date || b.created_date) - parseISO(a.updated_date || a.created_date)));

      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Falha ao enviar mensagem.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCreateNewTicket = async (e) => {
    e.preventDefault();
    if (!newTicketAssunto.trim() || !newTicketMensagem.trim() || !cooperado) {
      toast.warn("Preencha o assunto e a mensagem do novo ticket.");
      return;
    }
    setSendingMessage(true); 
    try {
      const initialMessage = {
        autor: cooperado.numero_associado,
        mensagem: newTicketMensagem,
        data: new Date().toISOString()
      };
      const newTicketData = {
        cooperado_id: cooperado.numero_associado,
        assunto: newTicketAssunto,
        mensagem: newTicketMensagem, 
        status: "aberto",
        prioridade: "media", 
        categoria: newTicketCategoria,
        historico_mensagens: [initialMessage]
      };
      const createdTicket = await CooperadoSupporte.create(newTicketData);
      
      setTickets(prev => [createdTicket, ...prev].sort((a,b) => parseISO(b.updated_date || b.created_date) - parseISO(a.updated_date || a.created_date)));
      handleSelectTicket(createdTicket); 
      setShowNewTicketForm(false);
      setNewTicketAssunto("");
      setNewTicketMensagem("");
      setNewTicketCategoria("outros");
      toast.success("Novo ticket de suporte criado!");

    } catch (error) {
      console.error("Erro ao criar novo ticket:", error);
      toast.error("Falha ao criar novo ticket de suporte.");
    } finally {
      setSendingMessage(false);
    }
  };
  
  const formatTicketDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Ontem";
    return format(date, "dd/MM/yy");
  };

  return (
    <PortalLayout currentPageName="PortalChat">
      <div className="h-[calc(100vh-var(--header-height,64px))] flex bg-slate-50">
        <aside className="w-full md:w-80 lg:w-96 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Suporte</h2>
              <Button size="sm" onClick={() => {setSelectedTicket(null); setShowNewTicketForm(true);}} className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="w-4 h-4 mr-2"/> Novo Ticket
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingTickets ? (
              <div className="p-4 space-y-3">
                {Array(5).fill(0).map((_,i) => <Skeleton key={i} className="h-16 w-full"/>)}
              </div>
            ) : tickets.length > 0 ? (
              tickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => handleSelectTicket(ticket)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors
                              ${selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-slate-700 text-sm truncate pr-2" title={ticket.assunto}>
                      {ticket.assunto}
                    </h5>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatTicketDate(ticket.updated_date || ticket.created_date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                     <Badge variant="outline" className={`text-xs ${
                       ticket.status === 'resolvido' || ticket.status === 'fechado' ? 'bg-green-50 text-green-700 border-green-200' : 
                       ticket.status === 'aguardando_resposta' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                       'bg-blue-50 text-blue-700 border-blue-200'
                     }`}>{ticket.status?.replace("_"," ").charAt(0).toUpperCase() + ticket.status?.replace("_"," ").slice(1)}</Badge>
                    <span className="text-xs text-slate-500 capitalize">{ticket.categoria}</span>
                  </div>
                </div>
              ))
            ) : (
              !showNewTicketForm && (
                <div className="p-8 text-center text-slate-500">
                  <LifeBuoy className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                  <p>Nenhum ticket de suporte encontrado.</p>
                  <p className="text-sm mt-1">Crie um novo ticket para iniciar uma conversa.</p>
                </div>
              )
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-slate-100">
          {selectedTicket && !showNewTicketForm ? (
            <>
              <header className="p-4 border-b border-slate-200 bg-white">
                <h3 className="font-semibold text-slate-800">{selectedTicket.assunto}</h3>
                <p className="text-xs text-slate-500">
                  Ticket #{selectedTicket.id.slice(-6)} • Status: {selectedTicket.status} • Categoria: {selectedTicket.categoria}
                </p>
              </header>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <ChatMessage 
                      key={index} 
                      message={msg} 
                      isOwn={msg.autor === cooperado?.numero_associado}
                      cooperado={cooperado}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                    <p>Envie uma mensagem para iniciar a conversa neste ticket.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <footer className="p-4 border-t border-slate-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    disabled={sendingMessage || selectedTicket.status === 'fechado' || selectedTicket.status === 'resolvido'}
                  />
                  <Button type="submit" disabled={sendingMessage || !newMessage.trim() || selectedTicket.status === 'fechado' || selectedTicket.status === 'resolvido'} className="bg-blue-600 hover:bg-blue-700">
                    {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                    <span className="ml-2 hidden sm:inline">Enviar</span>
                  </Button>
                </form>
                 {(selectedTicket.status === 'fechado' || selectedTicket.status === 'resolvido') && (
                    <p className="text-xs text-orange-600 mt-2 text-center">Este ticket está {selectedTicket.status}. Para continuar, por favor, abra um novo ticket.</p>
                )}
              </footer>
            </>
          ) : showNewTicketForm ? (
             <div className="flex-1 flex flex-col p-4 md:p-6">
                <Card className="w-full max-w-2xl mx-auto shadow-xl flex-grow flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-slate-800">Criar Novo Ticket de Suporte</CardTitle>
                    <p className="text-sm text-slate-500">Descreva seu problema ou dúvida para que possamos ajudar.</p>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <form onSubmit={handleCreateNewTicket} id="newTicketForm" className="space-y-4">
                       <div>
                         <Label htmlFor="newTicketAssunto">Assunto *</Label>
                         <Input 
                            id="newTicketAssunto" 
                            value={newTicketAssunto} 
                            onChange={(e) => setNewTicketAssunto(e.target.value)}
                            placeholder="Ex: Dúvida sobre pagamento da mensalidade"
                            required
                         />
                       </div>
                       <div>
                         <Label htmlFor="newTicketCategoria">Categoria *</Label>
                         <Select value={newTicketCategoria} onValueChange={setNewTicketCategoria} required>
                            <SelectTrigger> <SelectValue placeholder="Selecione uma categoria..." /> </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="financeiro">Financeiro</SelectItem>
                              <SelectItem value="documentos">Documentos</SelectItem>
                              <SelectItem value="projetos">Projetos</SelectItem>
                              <SelectItem value="dados_pessoais">Dados Pessoais</SelectItem>
                              <SelectItem value="tecnico">Problema Técnico</SelectItem>
                              <SelectItem value="outros">Outros Assuntos</SelectItem>
                            </SelectContent>
                         </Select>
                       </div>
                       <div>
                         <Label htmlFor="newTicketMensagem">Sua Mensagem *</Label>
                         <Textarea 
                            id="newTicketMensagem" 
                            value={newTicketMensagem}
                            onChange={(e) => setNewTicketMensagem(e.target.value)}
                            placeholder="Detalhe sua questão aqui..."
                            rows={6}
                            required
                         />
                       </div>
                    </form>
                  </CardContent>
                  <div className="p-4 border-t">
                    <Button type="submit" form="newTicketForm" disabled={sendingMessage} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                      {sendingMessage ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Send className="w-4 h-4 mr-2"/>}
                      Abrir Ticket
                    </Button>
                  </div>
                </Card>
             </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 text-slate-500">
              <LifeBuoy className="w-20 h-20 mx-auto mb-6 opacity-40"/>
              <h3 className="text-2xl font-semibold text-slate-700">Bem-vindo ao Suporte</h3>
              <p className="mt-2 max-w-md">
                Selecione um ticket existente na barra lateral para ver as mensagens ou crie um novo ticket para obter ajuda.
              </p>
            </div>
          )}
        </main>
      </div>
    </PortalLayout>
  );
}