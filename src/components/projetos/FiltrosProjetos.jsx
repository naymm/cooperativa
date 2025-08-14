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

export default function FiltrosProjetos({ filters, setFilters }) {
  return (
    <div className="flex gap-3">
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="planejamento">Planejamento</SelectItem>
          <SelectItem value="construcao">Construção</SelectItem>
          <SelectItem value="pronto">Pronto</SelectItem>
          <SelectItem value="entregue">Entregue</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.tipo}
        onValueChange={(value) => setFilters(prev => ({ ...prev, tipo: value }))}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="T0">T0</SelectItem>
          <SelectItem value="T1">T1</SelectItem>
          <SelectItem value="T2">T2</SelectItem>
          <SelectItem value="T3">T3</SelectItem>
          <SelectItem value="T4">T4</SelectItem>
          <SelectItem value="T5">T5</SelectItem>
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
    </div>
  );
}