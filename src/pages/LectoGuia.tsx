
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { LectoGuiaHeader } from "@/components/lectoguia/LectoGuiaHeader";
import { LectoGuiaContent } from "@/components/lectoguia/LectoGuiaContent";
import { Toaster } from "@/components/ui/toaster";
import { ChatSettingsProvider } from "@/components/lectoguia/chat-settings/ChatSettingsContext";
import { LectoGuiaProvider } from "@/contexts/LectoGuiaContext";

// Componente principal de LectoGuía convertido en asistente completo
const LectoGuia = () => {
  return (
    <AppLayout>
      <LectoGuiaProvider>
        <ChatSettingsProvider>
          <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col space-y-4">
              <LectoGuiaHeader />
              <LectoGuiaContent />
            </div>
          </div>
          <Toaster />
        </ChatSettingsProvider>
      </LectoGuiaProvider>
    </AppLayout>
  );
};

export default LectoGuia;
