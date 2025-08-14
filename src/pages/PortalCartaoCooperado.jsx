
import React, { useState, useEffect, useRef } from 'react';
import { Cooperado, AssinaturaPlano } from "@/api/entities";
import CartaoDigitalDisplay from "@/components/portal/CartaoDigitalDisplay";
import { Button } from "@/components/ui/button";
import { Printer, Download, RotateCcw, Loader2 } from "lucide-react";
import PortalLayout from "@/components/portal/PortalLayout"; // Para o título da página no layout
import { toast } from "sonner";

// URL da logo (pode ser a mesma do PortalLayout ou específica)
const LOGO_URL = "https://gruposanep.co.ao/wp-content/uploads/2025/06/logowhite-scaled.png";

export default function PortalCartaoCooperado() {
  const [cooperado, setCooperado] = useState(null);
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartaoRef = useRef();

  const fetchDados = async () => {
    setLoading(true);
    setError(null);
    const cooperadoId = localStorage.getItem('loggedInCooperadoId');
    if (!cooperadoId) {
      setError("Cooperado não autenticado.");
      setLoading(false);
      return;
    }

    try {
      const cooperadoData = await Cooperado.filter({ numero_associado: cooperadoId });
      if (cooperadoData.length > 0) {
        const coop = cooperadoData[0];
        setCooperado(coop);
        if (coop.assinatura_plano_id) {
          try {
            const planoData = await AssinaturaPlano.get(coop.assinatura_plano_id);
            setPlano(planoData);
          } catch (planoError) {
            console.warn("Erro ao buscar plano de assinatura:", planoError);
            setPlano(null); // Continuar mesmo se o plano não for encontrado
          }
        }
      } else {
        setError("Dados do cooperado não encontrados.");
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Falha ao carregar dados do cartão. Tente novamente.");
      toast.error("Erro ao carregar dados do cartão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handlePrint = () => {
    const printContents = cartaoRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Cartão de Cooperado - CoopHabitat</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none; }
            }
            /* Adicione estilos específicos para impressão se necessário */
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
            .cartao-container { width: 320px; /* Aproximadamente 8.5cm */ margin: 20px; }
          </style>
        </head>
        <body>
          <div class="cartao-container">
            ${printContents}
          </div>
          <script>
            setTimeout(() => { // Adiciona um pequeno delay para garantir que o conteúdo seja renderizado
              window.print();
              window.onafterprint = function() { window.close(); }
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  if (loading) {
    return (
      <PortalLayout currentPageName="Cartão Digital">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1f3664] mb-4" />
          <p className="text-slate-600 font-medium text-lg">A carregar o seu cartão digital...</p>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout currentPageName="Cartão Digital">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center bg-red-50 p-6 rounded-lg">
          <RotateCcw className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Erro ao Carregar Cartão</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={fetchDados} variant="destructive">
            <RotateCcw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </PortalLayout>
    );
  }
  
  if (!cooperado) {
     return (
      <PortalLayout currentPageName="Cartão Digital">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <p className="text-slate-600 font-medium text-lg">Não foi possível carregar os dados do cooperado.</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout currentPageName="Cartão Digital">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Seu Cartão de Cooperado Digital</h1>
          <p className="text-slate-600 mt-1">Apresente este cartão para identificação e acesso aos benefícios.</p>
        </div>

        <CartaoDigitalDisplay ref={cartaoRef} cooperado={cooperado} plano={plano} logoUrl={LOGO_URL} />

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 no-print">
          <Button 
            onClick={handlePrint} 
            className="w-full sm:w-auto bg-[#1f3664] hover:bg-[#162a52] text-white px-8 py-3 text-base"
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimir Cartão
          </Button>
          {/* <Button 
            variant="outline"
            className="w-full sm:w-auto px-8 py-3 text-base border-[#1f3664] text-[#1f3664] hover:bg-[#1f3664]/10"
            // onClick={handleDownload} // Implementar download se necessário
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar como Imagem
          </Button> */}
        </div>
         <p className="text-center text-xs text-slate-500 mt-6 no-print">
            Dica: Ao imprimir, você pode escolher "Salvar como PDF" nas opções da impressora para gerar um arquivo PDF.
          </p>
      </div>
    </PortalLayout>
  );
}

