import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Check,
  X,
  Eye,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const statusColors = {
  pendente: "bg-orange-100 text-orange-800 border-orange-200",
  aprovado: "bg-green-100 text-green-800 border-green-200",
  rejeitado: "bg-red-100 text-red-800 border-red-200"
};

export default function InscricaoCard({ 
  inscricao, 
  onViewDetails, 
  onAprovar, 
  onRejeitar, 
  processing, 
  readonly = false 
}) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    if (rejectReason.trim()) {
      onRejeitar(rejectReason);
      setShowRejectDialog(false);
      setRejectReason("");
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{inscricao.nome_completo}</h3>
                  <Badge className={`${statusColors[inscricao.status]} border`}>
                    {inscricao.status.charAt(0).toUpperCase() + inscricao.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{inscricao.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{inscricao.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{inscricao.provincia}, {inscricao.municipio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(inscricao.created_date), "dd/MM/yyyy")}</span>
                </div>
              </div>

              {inscricao.observacoes && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <strong>Observações:</strong> {inscricao.observacoes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Detalhes
              </Button>

              {!readonly && inscricao.status === "pendente" && (
                <>
                  <Button
                    size="sm"
                    onClick={onAprovar}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={processing}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Rejeitar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Inscrição</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600 mb-4">
              Por favor, informe o motivo da rejeição:
            </p>
            <Textarea
              placeholder="Motivo da rejeição..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Rejeitar Inscrição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}