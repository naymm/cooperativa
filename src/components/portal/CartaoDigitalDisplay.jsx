
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react"; // Usaremos o ícone como placeholder

const CartaoDigitalDisplay = React.forwardRef(({ cooperado, plano, logoUrl }, ref) => {
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };

  const dataValidade = new Date();
  dataValidade.setFullYear(dataValidade.getFullYear() + 1);

  const statusCooperado = cooperado?.status?.charAt(0).toUpperCase() + cooperado?.status?.slice(1) || "Indefinido";
  const statusColor = cooperado?.status === 'ativo' ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <div ref={ref} className="p-4 md:p-0">
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#1f3664] to-[#2a4a87] text-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">CARTÃO DE COOPERADO</h2>
            </div>
            {logoUrl && (
              <img src={logoUrl} alt="CoopHabitat Logo" className="h-12 w-auto rounded-sm" />
            )}
          </div>

          <div className="flex items-center space-x-5 mb-8">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={cooperado?.documentos_anexados?.foto_passe || cooperado?.foto_url} alt={cooperado?.nome_completo} />
              <AvatarFallback className="text-3xl bg-blue-200 text-[#1f3664] font-semibold">
                {getInitials(cooperado?.nome_completo)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold leading-tight">{cooperado?.nome_completo || "Nome do Cooperado"}</h3>
              <p className="text-blue-200 text-sm">Nº Sócio: {cooperado?.numero_associado || "00000"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 text-sm">
            <div>
              <p className="text-blue-200 opacity-80">Plano de Assinatura</p>
              <p className="font-medium">{plano?.nome_plano || "Não Associado"}</p>
            </div>
            <div>
              <p className="text-blue-200 opacity-80">Status</p>
              <Badge className={`${statusColor} text-white text-xs px-2 py-0.5`}>{statusCooperado}</Badge>
            </div>
            <div>
              <p className="text-blue-200 opacity-80">BI / Identificação</p>
              <p className="font-medium">{cooperado?.bi || "N/A"}</p>
            </div>
            <div>
              <p className="text-blue-200 opacity-80">Validade do Cartão</p>
              <p className="font-medium">{dataValidade.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-inner">
            <div className="text-[#1f3664] flex flex-col items-center">
              {/* Placeholder para QR Code */}
              <QrCode size={80} className="mb-2 text-gray-400" />
              <p className="text-xs text-center text-gray-600">
                Apresente este cartão para identificação. <br/>
                (QR Code para validação digital)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black/20 px-6 py-3 text-center">
          <p className="text-xs text-blue-100 opacity-70">Este cartão é pessoal e intransmissível.</p>
        </div>
      </div>
    </div>
  );
});

export default CartaoDigitalDisplay;

