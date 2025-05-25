
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { PAESUnifiedDashboard } from "@/components/paes-unified/PAESUnifiedDashboard";

const PAESDashboard = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4">
        <PAESUnifiedDashboard />
      </div>
    </AppLayout>
  );
};

export default PAESDashboard;
