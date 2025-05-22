
import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/dashboard/search-bar";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
  const [greeting, setGreeting] = useState<string>("Bienvenido");
  
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Buenos días");
    } else if (currentHour >= 12 && currentHour < 19) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
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
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mt-1"
        >
          Continúa tu preparación para la PAES
        </motion.p>
      </div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};
