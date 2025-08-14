import React, { useState, useEffect } from "react";
import PortalLayout from "../components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Check, Info, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
// Supondo uma entidade Evento (ou similar) para buscar os eventos
// import { Evento } from "@/api/entities"; 

// Dados mocados de eventos até termos a entidade
const mockEvents = [
  { id: '1', title: "Assembleia Geral Ordinária", date: new Date(2024, 6, 15).toISOString(), type: "assembleia", description: "Discussão de pautas importantes e votações." },
  { id: '2', title: "Visita ao Projeto Zango IV", date: new Date(2024, 6, 20).toISOString(), type: "visita_projeto", description: "Oportunidade para conhecer o andamento da obra." },
  { id: '3', title: "Prazo Final Pagamento Mensalidade Julho", date: new Date(2024, 6, 25).toISOString(), type: "prazo_pagamento", description: "Data limite para pagamento da mensalidade de Julho/2024." },
  { id: '4', title: "Workshop sobre Financiamento Habitacional", date: new Date(2024, 7, 5).toISOString(), type: "workshop", description: "Palestra com especialistas sobre opções de financiamento." },
  { id: '5', title: "Reunião Informativa Novos Cooperados", date: new Date(2024, 7, 10).toISOString(), type: "reuniao", description: "Boas-vindas e orientações para novos membros." },
];

const eventTypeColors = {
  assembleia: "bg-red-100 text-red-800 border-red-300",
  visita_projeto: "bg-blue-100 text-blue-800 border-blue-300",
  prazo_pagamento: "bg-orange-100 text-orange-800 border-orange-300",
  workshop: "bg-green-100 text-green-800 border-green-300",
  reuniao: "bg-purple-100 text-purple-800 border-purple-300",
  default: "bg-slate-100 text-slate-800 border-slate-300",
};

export default function PortalCalendario() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Substituir por chamada à API da entidade Evento quando disponível
        // const data = await Evento.list("-date"); // Exemplo
        // setEvents(data);
        setEvents(mockEvents.map(e => ({...e, date: parseISO(e.date)}))); // Convertendo string para Date
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        toast.error("Falha ao carregar eventos do calendário.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filtrar eventos para o dia selecionado
    const eventsOnSelectedDate = events.filter(event => 
      isSameDay(event.date, date)
    );
    setSelectedEvents(eventsOnSelectedDate);
  }, [date, events]);

  const EventDayMarker = ({ date, view }) => {
    if (view === 'day') {
        const hasEvent = events.some(event => isSameDay(event.date, date));
        if (hasEvent) {
            return <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>;
        }
    }
    return null;
  };

  return (
    <PortalLayout currentPageName="PortalCalendario">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Calendário de Eventos</h1>
          <p className="text-slate-600">Acompanhe os próximos eventos, prazos e assembleias da cooperativa.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-0 md:p-2">
                {loading ? (
                  <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full p-0"
                    locale={ptBR}
                    components={{
                        DayContent: EventDayMarker
                    }}
                    classNames={{
                      day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
                      day_today: "bg-blue-100 text-blue-700 font-bold",
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detalhes dos Eventos do Dia */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-700">
                  Eventos para {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
                {loading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="animate-pulse bg-slate-200 h-5 w-3/4 mb-2 rounded"></div>
                      <div className="animate-pulse bg-slate-200 h-4 w-full mb-1 rounded"></div>
                      <div className="animate-pulse bg-slate-200 h-4 w-1/2 rounded"></div>
                    </div>
                  ))
                ) : selectedEvents.length > 0 ? (
                  selectedEvents.map((event) => (
                    <div key={event.id} className={`p-3 border-l-4 rounded-r-lg ${eventTypeColors[event.type] || eventTypeColors.default}`}>
                      <h4 className="font-semibold text-md">{event.title}</h4>
                      <p className="text-sm mt-1">{event.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs capitalize">{event.type.replace("_", " ")}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-60" />
                    <p>Nenhum evento agendado para este dia.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}