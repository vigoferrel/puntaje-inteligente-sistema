
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChatSettingsPanel } from "./ChatSettingsPanel";

export const ChatSettingsButton = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Configuración del chat"
          title="Configuración"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-w-lg mx-auto">
          <ChatSettingsPanel />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
