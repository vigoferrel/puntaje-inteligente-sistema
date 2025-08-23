/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from "react";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DiagnosticTest } from "../../types/diagnostic";
import { Search, Filter, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { DiagnosticCard } from "./DiagnosticCard";
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface DiagnosticBrowserProps {
  tests: DiagnosticTest[];
  loading: boolean;
  selectedTestId: string | null;
  onTestSelect: (testId: string) => void;
  onStartTest: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  total?: number;
}

export const DiagnosticBrowser = ({
  tests,
  loading,
  selectedTestId,
  onTestSelect,
  onStartTest,
  onLoadMore,
  hasMore = false,
  total = 0
}: DiagnosticBrowserProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filteredTests, setFilteredTests] = useState<DiagnosticTest[]>(tests);

  // Filter tests based on search and type
  useEffect(() => {
    let filtered = tests;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(test => 
        test.title.toLowerCase().includes(term) ||
        test.description?.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(test => test.testId.toString() === filterType);
    }
    
    setFilteredTests(filtered);
  }, [tests, searchTerm, filterType]);

  // Get unique test types for filter
  const testTypes = Array.from(new Set(tests.map(test => test.testId)))
    .map(id => ({
      id: id.toString(),
      name: `Prueba ${id}`
    }));

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">DiagnÃ³sticos Disponibles</h2>
          <p className="text-muted-foreground">
            {filteredTests.length} de {total} diagnÃ³sticos
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y BÃºsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar diagnÃ³sticos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de prueba" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las pruebas</SelectItem>
                {testTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTests.length === 0 ? (
        <Card className="text-center p-8">
          <CardTitle className="mb-2">No se encontraron diagnÃ³sticos</CardTitle>
          <CardDescription>
            {searchTerm || filterType !== "all" 
              ? "Intenta ajustar los filtros de bÃºsqueda"
              : "No hay diagnÃ³sticos disponibles en este momento"
            }
          </CardDescription>
        </Card>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <DiagnosticCard
                  test={test}
                  selected={selectedTestId === test.id}
                  onSelect={onTestSelect}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Load more button */}
          {hasMore && onLoadMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={onLoadMore}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Cargar mÃ¡s diagnÃ³sticos
              </Button>
            </div>
          )}

          {/* Start test button */}
          {selectedTestId && (
            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button onClick={onStartTest} size="lg" className="gap-2">
                Comenzar diagnÃ³stico seleccionado
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};


