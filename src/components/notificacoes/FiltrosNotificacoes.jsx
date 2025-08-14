import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FiltrosNotificacoes({ filters, setFilters, cooperados }) {
  return (
    <div className="flex gap-3">
      <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Tipos</SelectItem>
          <SelectItem value="info">Informação</SelectItem>
          <SelectItem value="warning">Aviso</SelectItem>
          <SelectItem value="success">Sucesso</SelectItem>
          <SelectItem value="error">Erro</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.lida} onValueChange={(value) => setFilters({...filters, lida: value})}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="lida">Lidas</SelectItem>
          <SelectItem value="nao_lida">Não Lidas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.cooperado} onValueChange={(value) => setFilters({...filters, cooperado: value})}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Cooperado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Cooperados</SelectItem>
          {cooperados.map(cooperado => (
            <SelectItem key={cooperado.numero_associado} value={cooperado.numero_associado}>
              {cooperado.nome_completo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}