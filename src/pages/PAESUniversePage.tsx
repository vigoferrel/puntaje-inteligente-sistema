
import React from "react";
import { AppLayout } from "@/components/app-layout";
import PAESUniverseDashboard from "@/components/paes-universe/PAESUniverseDashboard";

const PAESUniversePage = () => {
  return (
    <AppLayout>
      <div className="h-screen">
        <PAESUniverseDashboard />
      </div>
    </AppLayout>
  );
};

export default PAESUniversePage;
