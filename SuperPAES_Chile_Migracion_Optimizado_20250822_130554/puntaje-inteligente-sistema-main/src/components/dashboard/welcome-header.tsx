/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from "react";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { SearchBar } from "../../components/dashboard/search-bar";
import { motion } from "framer-motion";
import { Sparkles, Calculator, BookOpen, FlaskConical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import { TPAESPrueba, TPAESHabilidad } from "../../types/system-types";

interface WelcomeHeaderProps {
  userName: string | undefined;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  topSkills?: {skill: TPAESHabilidad, level: number}[];
  selectedPrueba?: TPAESPrueba;
}

export const WelcomeHeader = ({ 
  userName, 
  loading, 
  searchQuery, 
  setSearchQuery,
  topSkills,
  selectedPrueba
}: WelcomeHeaderProps) => {
  const [greeting, setGreeting] = useState<string>("Bienvenido");
  
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Buenos dÃ­as");
    } else if (currentHour >= 12 && currentHour < 19) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }
  }, []);

  const getTestIcon = (prueba?: TPAESPrueba) => {
    if (!prueba) return null;
    
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        return <BookOpen className="h-6 w-6 text-blue-600" />;
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        return <Calculator className="h-6 w-6 text-purple-600" />;
      case 'CIENCIAS':
        return <FlaskConical className="h-6 w-6 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {!loading && userName ? (
              <>
                <span className="text-primary">{greeting},</span>{" "}
                <span className="relative">
                  {userName}
                  <span className="absolute -top-1 -right-4">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </span>
                </span>
              </>
            ) : (
              <span className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
            )}
          </h1>
          {selectedPrueba && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2"
            >
              {getTestIcon(selectedPrueba)}
            </motion.div>
          )}
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mt-1"
        >
          ContinÃºa tu preparaciÃ³n para la PAES
        </motion.p>
        
        {topSkills && topSkills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            <span className="text-sm text-muted-foreground">Tus competencias destacadas:</span>
            {topSkills.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                      {item.skill}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel: {Math.round(item.level * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </motion.div>
        )}
      </motion.div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};

