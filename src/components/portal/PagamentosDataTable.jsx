import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  Download,
  Filter,
  X
} from "lucide-react";
import { format, isValid } from "date-fns";

// Função para validar se uma data é válida
const isValidDate = (date) => {
  return date && !isNaN(new Date(date).getTime()) && isValid(new Date(date));
};

// Componente para exibir badge de status
const StatusBadge = ({ status }) => {
  const statusConfig = {
    confirmado: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      icon: "✓",
      label: "Confirmado"
    },
    pendente: { 
      color: "bg-orange-100 text-orange-800 border-orange-200", 
      icon: "⏳",
      label: "Pendente"
    },
    cancelado: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: "✗",
      label: "Rejeitado"
    },
    atrasado: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: "⚠",
      label: "Atrasado"
    }
  };
  
  const config = statusConfig[status] || statusConfig.pendente;
  
  return (
    <Badge className={`${config.color} border flex items-center gap-1 text-xs`}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  );
};

// Componente principal da data table
export default function PagamentosDataTable({ 
  pagamentos, 
  loading = false,
  onViewComprovante,
  itemsPerPage = 10 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Filtrar e ordenar dados
  const filteredAndSortedData = useMemo(() => {
    let filtered = pagamentos;

    // Aplicar filtro de status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Aplicar busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.tipo?.toLowerCase().includes(term) ||
        p.mes_referencia?.toLowerCase().includes(term) ||
        p.referencia?.toLowerCase().includes(term) ||
        p.observacoes?.toLowerCase().includes(term) ||
        p.valor?.toString().includes(term)
      );
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "valor":
          aValue = a.valor || 0;
          bValue = b.valor || 0;
          break;
        case "data_pagamento":
          aValue = new Date(a.data_pagamento || a.created_date).getTime();
          bValue = new Date(b.data_pagamento || b.created_date).getTime();
          break;
        case "tipo":
          aValue = a.tipo || "";
          bValue = b.tipo || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          aValue = new Date(a.created_date).getTime();
          bValue = new Date(b.created_date).getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [pagamentos, searchTerm, sortField, sortDirection, statusFilter]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Função para ordenar
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setCurrentPage(1);
  };

  // Gerar páginas para paginação
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-slate-600">Carregando pagamentos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Histórico de Pagamentos</span>
          <div className="text-sm text-slate-500">
            {filteredAndSortedData.length} de {pagamentos.length} registros
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar por tipo, referência, valor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="confirmado">Confirmados</option>
              <option value="pendente">Pendentes</option>
              <option value="cancelado">Rejeitados</option>
            </select>
            
            {(searchTerm || statusFilter !== "todos") && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("tipo")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Tipo
                    {sortField === "tipo" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("valor")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Valor
                    {sortField === "valor" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("data_pagamento")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Data
                    {sortField === "data_pagamento" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Status
                    {sortField === "status" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium capitalize">
                          {pagamento.tipo?.replace('_', ' ')}
                        </div>
                        {pagamento.mes_referencia && (
                          <div className="text-xs text-slate-500">
                            {pagamento.mes_referencia}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {pagamento.referencia || "-"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {pagamento.valor?.toLocaleString()} Kz
                      </div>
                    </TableCell>
                    <TableCell>
                      {isValidDate(pagamento.data_pagamento) 
                        ? format(new Date(pagamento.data_pagamento), "dd/MM/yyyy")
                        : format(new Date(pagamento.created_date), "dd/MM/yyyy")
                      }
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pagamento.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {pagamento.comprovante_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewComprovante?.(pagamento)}
                            className="h-8 w-8 p-0"
                            title="Ver comprovante"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                        {pagamento.observacoes && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title={pagamento.observacoes}
                          >
                            <span className="text-xs">📝</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-slate-500">
                      {searchTerm || statusFilter !== "todos" 
                        ? "Nenhum pagamento encontrado com os filtros aplicados."
                        : "Nenhum pagamento registrado."
                      }
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-500">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAndSortedData.length)} de {filteredAndSortedData.length} registros
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 