import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  User,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const tipoConfig = {
  info: { icon: Info, color: "blue", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  warning: { icon: AlertTriangle, color: "yellow", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  success: { icon: CheckCircle, color: "green", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  error: { icon: XCircle, color: "red", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" }
};

export default function NotificacaoCard({ 
  notificacao, 
  cooperado, 
  isGrupo = false, 
  quantidade = 1, 
  onViewDetails, 
  onEdit 
}) {
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
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                {notificacao.titulo}
                {isGrupo && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Users className="w-3 h-3 mr-1" />
                    Anúncio Geral
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-4 mt-1">
                {isGrupo ? (
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Users className="w-3 h-3" />
                    <span>{quantidade} cooperados</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <User className="w-3 h-3" />
                    <span>{cooperado?.nome_completo || `ID: ${notificacao.cooperado_id}`}</span>
                  </div>
                )}
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
            <Badge variant={notificacao.lida ? "secondary" : "default"}>
              {isGrupo ? 
                (notificacao.lida ? "Todas Lidas" : "Algumas Não Lidas") :
                (notificacao.lida ? "Lida" : "Não Lida")
              }
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white p-3 rounded-lg border">
          <p className="text-slate-700 line-clamp-3">
            {notificacao.mensagem}
          </p>
        </div>

        {notificacao.link_acao && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate">{notificacao.link_acao}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm text-slate-500">
            {isGrupo ? (
              <div>
                <strong>Enviado para:</strong> {quantidade} cooperados
                <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700">
                  Anúncio
                </Badge>
              </div>
            ) : (
              <div>
                <strong>Cooperado:</strong> #{cooperado?.numero_associado || notificacao.cooperado_id}
                {cooperado?.status && (
                  <Badge variant="outline" className="ml-2">
                    {cooperado.status}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </Button>
            {!isGrupo && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}