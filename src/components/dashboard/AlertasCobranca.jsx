import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { SendEmail } from "@/api/integrations";

export default function AlertasCobranca({ alertas, loading }) {
  const enviarLembrete = async (cooperado, tipo, valor, vencimento) => {
    try {
      const assunto = tipo === 'atraso' 
        ? `Pagamento em Atraso - CoopHabitat`
        : `Lembrete: Pagamento Próximo do Vencimento - CoopHabitat`;
      
      const mensagem = tipo === 'atraso'
        ? `Prezado(a) ${cooperado.nome_completo},

Informamos que seu pagamento mensal no valor de ${valor?.toLocaleString()} Kz encontra-se em atraso desde ${format(vencimento, 'dd/MM/yyyy')}.

Para regularizar sua situação, entre em contato conosco ou efetue o pagamento o quanto antes.

Atenciosamente,
Equipe CoopHabitat`
        : `Prezado(a) ${cooperado.nome_completo},

Lembramos que seu pagamento mensal no valor de ${valor?.toLocaleString()} Kz vence em ${format(vencimento, 'dd/MM/yyyy')}.

Para evitar atrasos, efetue o pagamento dentro do prazo estabelecido.

Atenciosamente,
Equipe CoopHabitat`;

      await SendEmail({
        to: cooperado.email,
        subject: assunto,
        body: mensagem,
        from_name: "CoopHabitat"
      });
      
      alert(`Lembrete enviado para ${cooperado.nome_completo}`);
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
      alert("Erro ao enviar lembrete. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Sistema de Cobrança
          {alertas.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alertas.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alertas.length > 0 ? (
          <>
            {alertas.slice(0, 5).map((alerta, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  alerta.tipo === 'atraso' 
                    ? 'bg-red-50 border-red-500 hover:bg-red-100' 
                    : 'bg-orange-50 border-orange-500 hover:bg-orange-100'
                } transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {alerta.tipo === 'atraso' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600" />
                      )}
                      <h4 className="font-semibold text-slate-800">
                        {alerta.cooperado.nome_completo}
                      </h4>
                      <Badge 
                        className={
                          alerta.tipo === 'atraso' 
                            ? "bg-red-100 text-red-800" 
                            : "bg-orange-100 text-orange-800"
                        }
                      >
                        {alerta.tipo === 'atraso' 
                          ? `${alerta.dias} dias em atraso`
                          : `Vence em ${alerta.dias} dias`
                        }
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Valor:</span>
                        <span>{alerta.valor?.toLocaleString()} Kz</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(alerta.vencimento, 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{alerta.cooperado.telefone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{alerta.cooperado.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => enviarLembrete(
                        alerta.cooperado, 
                        alerta.tipo, 
                        alerta.valor, 
                        alerta.vencimento
                      )}
                      className={
                        alerta.tipo === 'atraso'
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Enviar Lembrete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {alertas.length > 5 && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-slate-500">
                  E mais {alertas.length - 5} cooperados necessitam de atenção
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Ver Todos os Alertas
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Todos os pagamentos estão em dia!</p>
            <p className="text-sm mt-1">Nenhum alerta de cobrança no momento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}