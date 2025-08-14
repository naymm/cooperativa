import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const provincias = [
  "Luanda", "Benguela", "Huíla", "Huambo", "Bié", "Cunene", "Cuando Cubango",
  "Cabinda", "Zaire", "Uíge", "Malanje", "Lunda Norte", "Lunda Sul", 
  "Moxico", "Namibe", "Kuanza Norte", "Kuanza Sul", "Bengo"
];

export default function FiltrosCooperados({ filters, setFilters }) {
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
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="inativo">Inativo</SelectItem>
          <SelectItem value="suspenso">Suspenso</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.provincia}
        onValueChange={(value) => setFilters(prev => ({ ...prev, provincia: value }))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Província" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {provincias.map(provincia => (
            <SelectItem key={provincia} value={provincia}>{provincia}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.orderBy}
        onValueChange={(value) => setFilters(prev => ({ ...prev, orderBy: value }))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nome">Nome</SelectItem>
          <SelectItem value="data_inscricao">Data Inscrição</SelectItem>
          <SelectItem value="numero_associado">Número</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}