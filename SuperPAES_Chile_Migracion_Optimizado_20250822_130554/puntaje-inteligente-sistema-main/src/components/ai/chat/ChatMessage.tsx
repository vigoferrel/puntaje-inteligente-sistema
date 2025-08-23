/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Card } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import { ChatMessageType } from "./types";
import { useChatSettings } from "../../../components/lectoguia/chat-settings/ChatSettingsContext";
import { ChatImagePreview } from "./ChatImagePreview";

export const ChatMessage = ({
  role,
  content,
  timestamp,
  imageUrl
}: ChatMessageType) => {
  const { settings } = useChatSettings();
  const [isImageExpanded, setIsImageExpanded] = useState(settings.autoExpandImages);
  
  // Format timestamp if present and valid
  const formattedTime = timestamp && timestamp !== ""
    ? (() => {
        try {
          return format(new Date(timestamp), "HH:mm", { locale: es });
        } catch (error) {
          console.error("Error formatting timestamp:", error);
          return "";
        }
      })()
    : "";

  // Different styles based on role
  const isUser = role === "user";

  // Font size classes based on settings
  const fontSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // Spacing classes based on settings
  const spacingClasses = {
    compact: "py-1.5 px-2",
    normal: "py-2 px-3",
    relaxed: "py-3 px-4"
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 py-1",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-secondary")}>
          {isUser ? (
            <AvatarFallback className="bg-primary text-primary-foreground">
              TÃº
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              AI
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Message content */}
      <div className={cn("flex max-w-[85%] flex-col", isUser && "items-end")}>
        <Card
          className={cn(
            spacingClasses[settings.messageSpacing],
            fontSizeClasses[settings.fontSize],
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card"
          )}
        >
          {/* Image if present */}
          {imageUrl && (
            <ChatImagePreview
              imageUrl={imageUrl}
              isExpanded={isImageExpanded}
              onToggleExpand={() => setIsImageExpanded(!isImageExpanded)}
            />
          )}

          {/* Text content */}
          <div className="whitespace-pre-wrap">{content}</div>
        </Card>

        {/* Timestamp */}
        {settings.showTimestamps && formattedTime && (
          <span className="mt-1 text-xs text-muted-foreground">
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};

