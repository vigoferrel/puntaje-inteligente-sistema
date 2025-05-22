
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { supabase } from "@/integrations/supabase/client";
import { useDiagnosticoGenerator } from "./useDiagnosticoGenerator";

export const useDiagnosticoDashboard = () => {
  const {
    tests,
    diagnostics,
    loading,
    loadingTests,
    selectedTestId,
    setSelectedTestId,
    handleCreateDiagnostic
  } = useDiagnosticoGenerator();

  const [filteredDiagnostics, setFilteredDiagnostics] = useState<DiagnosticTest[]>(diagnostics);
  const [searchTerm, setSearchTerm] = useState("");
  const [testFilter, setTestFilter] = useState<string | null>(null);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalCompletions: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch stats data
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      
      // Get total unique users who have completed diagnostic tests
      const { data: usersData, error: usersError } = await supabase
        .from('user_diagnostic_results')
        .select('user_id', { count: 'exact', head: true });
        
      if (usersError) throw usersError;
      
      // Get total completed diagnostics
      const { count: completionsCount, error: completionsError } = await supabase
        .from('user_diagnostic_results')
        .select('*', { count: 'exact', head: true });
        
      if (completionsError) throw completionsError;
      
      setStatsData({
        totalUsers: usersData?.length || 0,
        totalCompletions: completionsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive"
      });
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...diagnostics];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(diag => 
        diag.title.toLowerCase().includes(term) || 
        diag.description?.toLowerCase().includes(term)
      );
    }
    
    // Apply test filter
    if (testFilter) {
      result = result.filter(diag => diag.testId === parseInt(testFilter));
    }
    
    setFilteredDiagnostics(result);
  }, [diagnostics, searchTerm, testFilter]);
  
  // Initialize stats data
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterByTest = (testId: string) => {
    setTestFilter(testId);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setTestFilter(null);
  };

  const handleViewDiagnostic = (id: string) => {
    toast({
      title: "Ver diagnóstico",
      description: `Visualización del diagnóstico ${id}`
    });
    // Implementar funcionalidad de visualización detallada
  };

  const handleEditDiagnostic = (id: string) => {
    toast({
      title: "Editar diagnóstico",
      description: `Edición del diagnóstico ${id}`
    });
    // Implementar funcionalidad de edición
  };

  const handleDeleteDiagnostic = (id: string) => {
    toast({
      title: "Eliminar diagnóstico",
      description: `¿Estás seguro de eliminar el diagnóstico ${id}?`,
      variant: "destructive"
    });
    // Implementar confirmación y eliminación
  };

  const handleViewExercises = (id: string) => {
    toast({
      title: "Ver ejercicios",
      description: `Visualización de ejercicios del diagnóstico ${id}`
    });
    // Implementar visualización de ejercicios
  };

  return {
    tests,
    diagnostics: filteredDiagnostics,
    loading: loading || loadingStats,
    loadingTests,
    selectedTestId,
    setSelectedTestId,
    handleCreateDiagnostic,
    handleSearch,
    handleFilterByTest,
    handleResetFilters,
    handleViewDiagnostic,
    handleEditDiagnostic,
    handleDeleteDiagnostic,
    handleViewExercises,
    statsData
  };
};
