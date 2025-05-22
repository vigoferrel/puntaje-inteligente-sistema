
import React from "react";
import { SearchBar } from "@/components/dashboard/search-bar";

interface WelcomeHeaderProps {
  userName: string | undefined;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const WelcomeHeader = ({ 
  userName, 
  loading, 
  searchQuery, 
  setSearchQuery 
}: WelcomeHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {!loading && userName ? `Bienvenido, ${userName}` : 'Cargando...'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Continúa tu preparación para la PAES
        </p>
      </div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};
