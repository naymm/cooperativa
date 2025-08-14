import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const tipoConfig = {
  info: { icon: Info, color: "blue", label: "Informação" },
  warning: { icon: AlertTriangle, color: "yellow", label: "Aviso" },
  success: { icon: CheckCircle, color: "green", label: "Sucesso" },
  error: { icon: XCircle, color: "red", label: "Erro" }
};

export default function DetalhesNotificacao({ notificacao, cooperado }) {
  const config = tipoConfig[notificacao.tipo] || tipoConfig.info;
  const Icon = config.icon;

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Notificação */}
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
                  {config.label}
                </Badge>
                <Badge variant={notificacao.lida ? "secondary" : "default"}>
                  {notificacao.lida ? "Lida" : "Não Lida"}
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

      {/* Conteúdo da Notificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mensagem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {notificacao.mensagem}
            </p>
          </div>
          
          {notificacao.link_acao && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Link de Ação</span>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-700"
                onClick={() => window.open(notificacao.link_acao, '_blank')}
              >
                {notificacao.link_acao}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações do Cooperado */}
      {cooperado && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações do Cooperado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-slate-800">{cooperado.nome_completo}</p>
                  <p className="text-sm text-slate-600">#{cooperado.numero_associado}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{cooperado.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{cooperado.telefone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{cooperado.provincia}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <Badge variant={cooperado.status === 'ativo' ? 'default' : 'secondary'}>
                    {cooperado.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600">Data de Inscrição</p>
                  <p className="text-sm font-medium">
                    {isValidDate(cooperado.data_inscricao)
                      ? format(new Date(cooperado.data_inscricao), "dd/MM/yyyy", { locale: pt })
                      : "Não informado"
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600">Profissão</p>
                  <p className="text-sm font-medium">{cooperado.profissao || "Não informado"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico da Notificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">Notificação criada</span>
              <span className="text-slate-500">
                {isValidDate(notificacao.created_date)
                  ? format(new Date(notificacao.created_date), "dd/MM/yyyy 'às' HH:mm")
                  : "Data inválida"
                }
              </span>
            </div>
            
            {notificacao.lida && notificacao.data_leitura && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">Notificação lida pelo cooperado</span>
                <span className="text-slate-500">
                  {isValidDate(notificacao.data_leitura)
                    ? format(new Date(notificacao.data_leitura), "dd/MM/yyyy 'às' HH:mm")
                    : "Data inválida"
                  }
                </span>
              </div>
            )}
            
            {notificacao.updated_date && notificacao.updated_date !== notificacao.created_date && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-slate-600">Notificação atualizada</span>
                <span className="text-slate-500">
                  {isValidDate(notificacao.updated_date)
                    ? format(new Date(notificacao.updated_date), "dd/MM/yyyy 'às' HH:mm")
                    : "Data inválida"
                  }
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}