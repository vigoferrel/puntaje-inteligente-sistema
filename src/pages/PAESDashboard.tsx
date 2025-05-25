
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { PAESProvider } from "@/contexts/PAESContext";
import { PAESUnifiedDashboard } from "@/components/paes-unified/PAESUnifiedDashboard";

const PAESDashboard = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4">
        <PAESProvider>
          <PAESUnifiedDashboard />
        </PAESProvider>
      </div>
    </AppLayout>
  );
};

export default PAESDashboard;
