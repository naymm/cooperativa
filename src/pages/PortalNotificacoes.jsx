import React, { useState, useEffect } from 'react';
import { CooperadoNotificacao } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Eye,
  ExternalLink,
  Calendar,
  Check,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";

import PortalLayout from "@/components/portal/PortalLayout";

const tipoConfig = {
  info: { icon: Info, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  warning: { icon: AlertTriangle, color: "yellow", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  success: { icon: CheckCircle, color: "green", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  error: { icon: XCircle, color: "red", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" }
};

function NotificacaoCard({ notificacao, onViewDetails, onMarkAsRead }) {
  const config = tipoConfig[notificacao.tipo] || tipoConfig.info;
  const Icon = config.icon;

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  return (
    <Card className={`hover:shadow-md transition-shadow border-l-4 ${config.borderColor} ${config.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-${config.color}-100`}>
              <Icon className={`w-5 h-5 text-${config.color}-600`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-800">
                {notificacao.titulo}
              </CardTitle>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {isValidDate(notificacao.created_date)
                      ? format(new Date(notificacao.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: pt })
                      : "Data inválida"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
              {notificacao.tipo === 'info' && 'Informação'}
              {notificacao.tipo === 'warning' && 'Aviso'}
              {notificacao.tipo === 'success' && 'Sucesso'}
              {notificacao.tipo === 'error' && 'Erro'}
            </Badge>
            {!notificacao.lida && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                Nova
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-slate-700 leading-relaxed break-words whitespace-pre-wrap">
            {notificacao.mensagem}
          </p>
        </div>

        {notificacao.link_acao && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Link Relacionado</span>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700 break-all"
              onClick={() => window.open(notificacao.link_acao, '_blank')}
            >
              {notificacao.link_acao}
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm text-slate-500">
            {notificacao.lida ? (
              <span className="text-green-600">✓ Lida</span>
            ) : (
              <span className="text-orange-600">• Não lida</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver Detalhes
            </Button>
            {!notificacao.lida && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAsRead}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Check className="w-3 h-3 mr-1" />
                Marcar como Lida
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetalhesNotificacao({ notificacao }) {
  const config = tipoConfig[notificacao.tipo] || tipoConfig.info;
  const Icon = config.icon;

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full bg-${config.color}-100`}>
              <Icon className={`w-6 h-6 text-${config.color}-600`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{notificacao.titulo}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={`bg-${config.color}-100 text-${config.color}-800`}>
                  {notificacao.tipo === 'info' && 'Informação'}
                  {notificacao.tipo === 'warning' && 'Aviso'}
                  {notificacao.tipo === 'success' && 'Sucesso'}
                  {notificacao.tipo === 'error' && 'Erro'}
                </Badge>
                <span className="text-sm text-slate-500">
                  {isValidDate(notificacao.created_date)
                    ? format(new Date(notificacao.created_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt })
                    : "Data inválida"
                  }
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mensagem Completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-slate-700 leading-relaxed break-words whitespace-pre-wrap">
              {notificacao.mensagem}
            </p>
          </div>
          
          {notificacao.link_acao && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Link de Ação</span>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-700 break-all"
                onClick={() => window.open(notificacao.link_acao, '_blank')}
              >
                {notificacao.link_acao}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PortalNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [filteredNotificacoes, setFilteredNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotificacao, setSelectedNotificacao] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  useEffect(() => {
    filterNotificacoes();
  }, [notificacoes, searchTerm]);

  const fetchNotificacoes = async () => {
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    if (!cooperadoId) {
      toast.error("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const data = await CooperadoNotificacao.filter({ 
        cooperado_id: cooperadoId 
      });
      const sortedData = data?.sort((a, b) => 
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      ) || [];
      setNotificacoes(sortedData);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      toast.error("Erro ao carregar notificações");
    } finally {
      setLoading(false);
    }
  };

  const filterNotificacoes = () => {
    let filtered = [...notificacoes];

    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.mensagem?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotificacoes(filtered);
  };

  const handleMarkAsRead = async (notificacao) => {
    try {
      await CooperadoNotificacao.update(notificacao.id, { 
        lida: true,
        data_leitura: new Date().toISOString()
      });
      await fetchNotificacoes();
      toast.success("Notificação marcada como lida");
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      toast.error("Erro ao atualizar notificação");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notificacoes.filter(n => !n.lida);
    if (unreadNotifications.length === 0) {
      toast.info("Todas as notificações já foram lidas");
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map(n => 
          CooperadoNotificacao.update(n.id, { 
            lida: true,
            data_leitura: new Date().toISOString()
          })
        )
      );
      await fetchNotificacoes();
      toast.success("Todas as notificações foram marcadas como lidas");
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      toast.error("Erro ao atualizar notificações");
    }
  };

  const stats = {
    total: notificacoes.length,
    naoLidas: notificacoes.filter(n => !n.lida).length,
    recentes: notificacoes.filter(n => {
      const agora = new Date();
      const notifData = new Date(n.created_date);
      const diffDias = (agora - notifData) / (1000 * 60 * 60 * 24);
      return diffDias <= 7;
    }).length
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              Minhas Notificações
            </h1>
            <p className="text-slate-600 mt-1">Acompanhe as comunicações da cooperativa</p>
          </div>
          {stats.naoLidas > 0 && (
            <Button 
              onClick={handleMarkAllAsRead}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar Todas como Lidas
            </Button>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600 opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Não Lidas</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.naoLidas}</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 border border-orange-200">
                  {stats.naoLidas > 0 ? 'Novas' : 'Em dia'}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-green-600">{stats.recentes}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border border-green-200">
                  Recentes
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pesquisa */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar nas notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Notificações */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600">Carregando notificações...</p>
            </div>
          ) : filteredNotificacoes.length > 0 ? (
            filteredNotificacoes.map((notificacao) => (
              <NotificacaoCard
                key={notificacao.id}
                notificacao={notificacao}
                onViewDetails={() => {
                  setSelectedNotificacao(notificacao);
                  setShowDetails(true);
                  if (!notificacao.lida) {
                    handleMarkAsRead(notificacao);
                  }
                }}
                onMarkAsRead={() => handleMarkAsRead(notificacao)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {searchTerm ? "Nenhuma notificação encontrada" : "Nenhuma notificação"}
              </h3>
              <p className="text-slate-500">
                {searchTerm 
                  ? "Não há notificações que correspondam à sua pesquisa."
                  : "Você não possui notificações no momento."
                }
              </p>
            </div>
          )}
        </div>

        {/* Modal de Detalhes */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Notificação</DialogTitle>
            </DialogHeader>
            {selectedNotificacao && (
              <DetalhesNotificacao notificacao={selectedNotificacao} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
}