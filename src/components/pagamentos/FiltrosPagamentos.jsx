import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FiltrosPagamentos({ filters, setFilters }) {
  return (
    <div className="flex gap-3">
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="confirmado">Confirmado</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="atrasado">Atrasado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.metodo}
        onValueChange={(value) => setFilters(prev => ({ ...prev, metodo: value }))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Método" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="transferencia">Transferência</SelectItem>
          <SelectItem value="deposito">Depósito</SelectItem>
          <SelectItem value="multicaixa">Multicaixa</SelectItem>
          <SelectItem value="dinheiro">Dinheiro</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.periodo}
        onValueChange={(value) => setFilters(prev => ({ ...prev, periodo: value }))}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="7dias">7 dias</SelectItem>
          <SelectItem value="30dias">30 dias</SelectItem>
          <SelectItem value="90dias">90 dias</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}