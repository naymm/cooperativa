import React, { useState, useEffect, useCallback } from 'react';
import { CrmNotificacao } from '@/api/entities';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, UserCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

const iconMap = {
  inscricao: <UserCheck className="w-4 h-4 text-blue-500" />,
  pagamento: <CreditCard className="w-4 h-4 text-green-500" />,
  default: <Bell className="w-4 h-4 text-slate-500" />
};

export default function NotificationBell() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CrmNotificacao.list("-created_date", 20); // Buscar as 20 mais recentes
      setNotificacoes(data || []);
      const unread = data?.filter(n => !n.lida).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Opcional: Adicionar um intervalo para buscar notificações periodicamente
    const interval = setInterval(fetchNotifications, 60000); // A cada 1 minuto
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNotificationClick = async (notificacao) => {
    if (!notificacao.lida) {
      try {
        await CrmNotificacao.update(notificacao.id, { lida: true });
        fetchNotifications();
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error);
      }
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notificacoes.filter(n => !n.lida);
    if (unreadNotifications.length === 0) return;

    try {
      await Promise.all(
        unreadNotifications.map(n => CrmNotificacao.update(n.id, { lida: true }))
      );
      fetchNotifications();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notificações
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-3 h-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <DropdownMenuItem disabled>Carregando...</DropdownMenuItem>
        ) : notificacoes.length === 0 ? (
          <DropdownMenuItem disabled>Nenhuma notificação</DropdownMenuItem>
        ) : (
          notificacoes.map(notif => (
            <Link 
              key={notif.id} 
              to={notif.link_destino || '#'} 
              onClick={() => handleNotificationClick(notif)}
              className="w-full"
            >
              <DropdownMenuItem className={`cursor-pointer items-start ${!notif.lida ? 'bg-blue-50' : ''}`}>
                <div className="flex-shrink-0 mr-3 mt-1">
                  {iconMap[notif.tipo] || iconMap.default}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${!notif.lida ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.titulo}
                  </p>
                  <p className="text-xs text-slate-500">{notif.mensagem}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(notif.created_date), { addSuffix: true, locale: pt })}
                  </p>
                </div>
                {!notif.lida && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>}
              </DropdownMenuItem>
            </Link>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}