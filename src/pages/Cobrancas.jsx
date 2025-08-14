import React from "react";
import Layout from "./Layout";
import GerenciadorCobrancas from "@/components/cobranca/GerenciadorCobrancas";
import ConfiguracaoSMTP from "@/components/cobranca/ConfiguracaoSMTP";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertTriangle, Info, Settings } from "lucide-react";

export default function Cobrancas() {
  console.log("[Cobrancas] Página carregada");
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Cobranças
          </h1>
          <p className="text-gray-600">
            Gerencie e envie emails de cobrança para pagamentos em atraso
          </p>
        </div>

        {/* Informações sobre o sistema */}
        <div className="mb-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Sobre o Sistema de Cobranças:</strong><br />
              • Identifica automaticamente pagamentos em atraso<br />
              • Envia emails personalizados baseados no tempo de atraso<br />
              • Controla frequência de envio para evitar spam<br />
              • Gera relatórios detalhados de cobranças
            </AlertDescription>
          </Alert>
        </div>

        {/* Configuração SMTP */}
        <div className="mb-6">
          <ConfiguracaoSMTP />
        </div>

        {/* Tipos de cobrança */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Tipos de Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Cobrança Inicial</h4>
                  <p className="text-sm text-yellow-700 mb-2">1-14 dias em atraso</p>
                  <p className="text-xs text-yellow-600">
                    Lembrete amigável sobre o pagamento em atraso
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Cobrança Urgente</h4>
                  <p className="text-sm text-orange-700 mb-2">15-29 dias em atraso</p>
                  <p className="text-xs text-orange-600">
                    Aviso sobre possíveis consequências do não pagamento
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Cobrança Crítica</h4>
                  <p className="text-sm text-red-700 mb-2">30+ dias em atraso</p>
                  <p className="text-xs text-red-600">
                    Última notificação antes de medidas mais drásticas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gerenciador de cobranças */}
        <GerenciadorCobrancas />
      </div>
    </Layout>
  );
} 