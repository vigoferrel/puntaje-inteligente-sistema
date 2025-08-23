﻿/* eslint-disable react-refresh/only-export-components */

import { Settings } from "lucide-react";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../../components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../../../components/ui/drawer";
import { ChatSettingsPanel } from "./ChatSettingsPanel";

export const ChatSettingsButton = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="ConfiguraciÃ³n del chat"
          title="ConfiguraciÃ³n"
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

