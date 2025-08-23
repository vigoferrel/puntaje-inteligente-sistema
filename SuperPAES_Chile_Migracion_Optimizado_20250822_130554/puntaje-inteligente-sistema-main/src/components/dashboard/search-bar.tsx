﻿/* eslint-disable react-refresh/only-export-components */

import { Input } from "../../components/ui/input";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative w-full md:w-1/3">
      <Input
        type="text"
        placeholder="Buscar temÃ¡ticas, ejercicios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      <Button 
        size="sm" 
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-stp-primary hover:bg-stp-primary/90"
      >
        Consultar
      </Button>
    </div>
  );
};

