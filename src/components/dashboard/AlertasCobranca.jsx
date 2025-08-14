import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SendEmail } from "@/api/integrations";
import { toast } from "sonner";

export default function AlertasCobranca({ alertas, loading }) {
  
  // Gerar template HTML completo para email de cobrança
  const gerarTemplateEmail = (cooperado, tipo, valor, vencimento, dias) => {
    const hoje = new Date();
    const dataAtual = format(hoje, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const dataVencimento = format(vencimento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    const isAtraso = tipo === 'atraso';
    const diasTexto = isAtraso ? `${dias} dias` : `${dias} dias`;
    const statusTexto = isAtraso ? 'em atraso' : 'para vencer';
    
    const corPrimaria = isAtraso ? '#dc2626' : '#ea580c';
    const corSecundaria = isAtraso ? '#fef2f2' : '#fff7ed';
    const corBorda = isAtraso ? '#fecaca' : '#fed7aa';
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isAtraso ? 'Pagamento em Atraso' : 'Lembrete de Pagamento'} - Cooperativa Sanep</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
          }
          .header p { 
            margin: 5px 0 0 0; 
            font-size: 16px; 
            opacity: 0.9; 
          }
          .content { 
            padding: 30px 20px; 
          }
          .alert-box { 
            background-color: ${corSecundaria}; 
            border: 2px solid ${corBorda}; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .alert-icon { 
            font-size: 48px; 
            margin-bottom: 10px; 
          }
          .alert-title { 
            color: ${corPrimaria}; 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0 0 10px 0; 
          }
          .alert-subtitle { 
            color: ${corPrimaria}; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0; 
          }
          .cooperado-info { 
            background-color: #f8fafc; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            padding-bottom: 8px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .info-row:last-child { 
            border-bottom: none; 
            margin-bottom: 0; 
          }
          .info-label { 
            font-weight: 600; 
            color: #475569; 
          }
          .info-value { 
            font-weight: 500; 
            color: #1e293b; 
          }
          .payment-details { 
            background-color: #f0f9ff; 
            border: 1px solid #bae6fd; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .payment-title { 
            color: #0369a1; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0 0 15px 0; 
            text-align: center; 
          }
          .payment-amount { 
            font-size: 32px; 
            font-weight: 700; 
            color: #0369a1; 
            text-align: center; 
            margin: 10px 0; 
          }
          .contact-section { 
            background-color: #f0fdf4; 
            border: 1px solid #bbf7d0; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .contact-title { 
            color: #166534; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0 0 15px 0; 
          }
          .contact-info { 
            display: flex; 
            justify-content: space-around; 
            flex-wrap: wrap; 
            gap: 15px; 
          }
          .contact-item { 
            text-align: center; 
          }
          .contact-label { 
            font-weight: 600; 
            color: #166534; 
            font-size: 14px; 
            margin-bottom: 5px; 
          }
          .contact-value { 
            color: #15803d; 
            font-size: 16px; 
            font-weight: 500; 
          }
          .footer { 
            background-color: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            border-top: 1px solid #e2e8f0; 
          }
          .footer p { 
            margin: 5px 0; 
            color: #64748b; 
            font-size: 14px; 
          }
          .urgent-notice { 
            background-color: #fef2f2; 
            border: 2px solid #fecaca; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 20px 0; 
            text-align: center; 
          }
          .urgent-notice h3 { 
            color: #dc2626; 
            margin: 0 0 10px 0; 
            font-size: 16px; 
            font-weight: 600; 
          }
          .urgent-notice p { 
            color: #991b1b; 
            margin: 0; 
            font-size: 14px; 
          }
          @media (max-width: 600px) {
            .container { margin: 0; }
            .content { padding: 20px 15px; }
            .header { padding: 20px 15px; }
            .header h1 { font-size: 24px; }
            .contact-info { flex-direction: column; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Cabeçalho -->
          <div class="header">
            <h1>🏠 CoopHabitat</h1>
            <p>Cooperativa de Habitação</p>
          </div>

                      
            <!-- Mensagem Final -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                ${isAtraso 
                  ? `Prezado(a) <strong>${cooperado.nome_completo}</strong>,<br><br>
                     Informamos que seu pagamento mensal encontra-se <strong>${diasTexto} em atraso</strong>.<br>
                     Para regularizar sua situação e evitar consequências, entre em contato conosco o quanto antes.`
                  : `Prezado(a) <strong>${cooperado.nome_completo}</strong>,<br><br>
                     Lembramos que seu pagamento mensal vence em <strong>${diasTexto}</strong>.<br>
                     Para evitar atrasos, efetue o pagamento dentro do prazo estabelecido.`
                }
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Atenciosamente,<br>
                Equipe Cooperativa Sanep</strong>
              </p>
            </div>
          </div>

            
            <!-- Detalhes do Pagamento -->
            <div class="payment-details">
              <h3 class="payment-title">💰 Detalhes do Pagamento</h3>
              <div class="info-row">
                <span class="info-label">Valor da Mensalidade:</span>
                <span class="info-value">${valor?.toLocaleString()} Kz</span>
              </div>
              <div class="info-row">
                <span class="info-label">Data de Vencimento:</span>
                <span class="info-value">${dataVencimento}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value" style="color: ${corPrimaria}; font-weight: 600;">
                  ${isAtraso ? 'EM ATRASO' : 'PRÓXIMO DO VENCIMENTO'}
                </span>
              </div>
              ${isAtraso ? `
              <div class="info-row">
                <span class="info-label">Dias em Atraso:</span>
                <span class="info-value" style="color: ${corPrimaria}; font-weight: 600;">
                  ${dias} dias
                </span>
              </div>
              ` : ''}
            </div>
            
            ${isAtraso ? `
            <!-- Aviso Urgente para Pagamentos em Atraso -->
            <div class="urgent-notice">
              <h3>🚨 ATENÇÃO IMPORTANTE</h3>
              <p>
                O não pagamento pode resultar em:<br>
                • Suspensão de benefícios da cooperativa<br>
                • Acúmulo de juros e multas<br>
                • Possível cancelamento da associação
              </p>
            </div>
            ` : ''}
            

          
          <!-- Rodapé -->
          <div class="footer">
            <p><strong>Cooperativa Sanep - Habitação e Construção</strong></p>
            <p>📧 cobranca@cooperativasanep.co.ao | 📞 +244 123 456 789</p>
            <p>📍 Luanda, Angola</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
              Este é um email automático. Por favor, não responda a esta mensagem.<br>
              Data de envio: ${dataAtual}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const enviarLembrete = async (cooperado, tipo, valor, vencimento, dias) => {
    try {
      // Verificar se o sistema está configurado
      if (typeof SendEmail !== 'function') {
        toast.error("Sistema de email não configurado. Configure o SMTP primeiro.");
        return;
      }

      const assunto = tipo === 'atraso' 
        ? `🚨 PAGAMENTO EM ATRASO - ${dias} dias - Cooperativa Sanep`
        : `⏰ Lembrete: Pagamento vence em ${dias} dias - Cooperativa Sanep`;
      
      // Gerar template HTML completo
      const templateHTML = gerarTemplateEmail(cooperado, tipo, valor, vencimento, dias);

      await SendEmail({
        to: cooperado.email,
        subject: assunto,
        body: templateHTML,
        from_name: "Cooperativa Sanep"
      });
      
      toast.success(`Lembrete enviado com sucesso para ${cooperado.nome_completo}`);
      
      // Log do envio
      console.log(`[AlertasCobranca] Email enviado para ${cooperado.email}:`, {
        tipo,
        valor,
        vencimento: format(vencimento, 'dd/MM/yyyy'),
        dias
      });
      
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
      toast.error("Erro ao enviar lembrete. Tente novamente.");
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
                        alerta.vencimento,
                        alerta.dias
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