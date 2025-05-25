
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { ModernDashboardHub } from "@/components/dashboard/modern/ModernDashboardHub";
import { WelcomeTour } from "@/components/dashboard/welcome-tour";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  const { profile } = useAuth();
  const [showTour, setShowTour] = useState(false);

  // Check if first-time user
  useEffect(() => {
    const firstVisit = localStorage.getItem('firstDashboardVisit') !== 'false';
    if (firstVisit && profile) {
      setShowTour(true);
      localStorage.setItem('firstDashboardVisit', 'false');
    }
  }, [profile]);

  return (
    <AppInitializer>
      <AppLayout>
        {showTour && (
          <WelcomeTour 
            userName={profile?.name}
            onComplete={() => setShowTour(false)}
          />
        )}
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ModernDashboardHub />
        </motion.div>
      </AppLayout>
    </AppInitializer>
  );
};

export default Index;
