import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function SegurancaCard({ 
  cooperado, 
  loading = false, 
  onAlterarSenha,
  ultimoLogin 
}) {
  const getStatusSeguranca = () => {
    if (!cooperado) return 'desconhecido';
    
    // Verificar se tem email válido
    const temEmail = cooperado.email && cooperado.email.includes('@');
    
    // Verificar se tem telefone
    const temTelefone = cooperado.telefone && cooperado.telefone.length >= 8;
    
    // Verificar se tem documentos anexados
    const temDocumentos = cooperado.documentos_anexados && 
      (cooperado.documentos_anexados.bi_frente_verso || cooperado.documentos_anexados.foto_passe);
    
    if (temEmail && temTelefone && temDocumentos) return 'excelente';
    if ((temEmail && temTelefone) || (temEmail && temDocumentos) || (temTelefone && temDocumentos)) return 'bom';
    if (temEmail || temTelefone || temDocumentos) return 'regular';
    return 'fraco';
  };

  const statusConfig = {
    excelente: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      label: "Excelente",
      description: "Seu perfil está bem protegido"
    },
    bom: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: ShieldCheck,
      label: "Bom",
      description: "Seu perfil tem boa segurança"
    },
    regular: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: AlertTriangle,
      label: "Regular",
      description: "Considere melhorar a segurança"
    },
    fraco: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertTriangle,
      label: "Fraco",
      description: "Recomendamos melhorar a segurança"
    },
    desconhecido: {
      color: "bg-slate-100 text-slate-800 border-slate-200",
      icon: Clock,
      label: "Carregando...",
      description: "Verificando segurança..."
    }
  };

  const status = getStatusSeguranca();
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const getRecomendacoes = () => {
    if (!cooperado) return [];
    
    const recomendacoes = [];
    
    if (!cooperado.email || !cooperado.email.includes('@')) {
      recomendacoes.push('Adicionar email válido para recuperação de conta');
    }
    
    if (!cooperado.telefone || cooperado.telefone.length < 8) {
      recomendacoes.push('Adicionar número de telefone para verificação');
    }
    
    if (!cooperado.documentos_anexados?.bi_frente_verso) {
      recomendacoes.push('Anexar documento de identificação');
    }
    
    if (recomendacoes.length === 0) {
      recomendacoes.push('Seu perfil está bem configurado');
    }
    
    return recomendacoes;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Segurança da Conta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Status de Segurança */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Status de Segurança</p>
            <Badge className={`${config.color} border flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAlterarSenha}
            disabled={loading}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Alterar Senha
          </Button>
        </div>

        {/* Descrição do Status */}
        <p className="text-sm text-slate-600">
          {config.description}
        </p>

        {/* Último Login */}
        {ultimoLogin && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Último login: {ultimoLogin}</span>
          </div>
        )}

        {/* Recomendações */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Recomendações:</p>
          <ul className="space-y-1">
            {getRecomendacoes().map((recomendacao, index) => (
              <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {recomendacao}
              </li>
            ))}
          </ul>
        </div>

        {/* Dicas de Segurança */}
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-700 mb-2">Dicas de Segurança:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Use uma senha forte e única</li>
            <li>• Ative a verificação em duas etapas se disponível</li>
            <li>• Mantenha seus dados de contato atualizados</li>
            <li>• Não compartilhe suas credenciais de login</li>
            <li>• Faça logout ao usar dispositivos públicos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 