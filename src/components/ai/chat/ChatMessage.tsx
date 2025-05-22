
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChatMessageType } from "./types";
import { useChatSettings } from "@/components/lectoguia/chat-settings/ChatSettingsContext";

export const ChatMessage = ({
  role,
  content,
  timestamp,
  imageUrl,
}: ChatMessageType) => {
  const { settings } = useChatSettings();
  const [isImageExpanded, setIsImageExpanded] = React.useState(settings.autoExpandImages);
  
  // Format timestamp if present
  const formattedTime = timestamp
    ? format(new Date(timestamp), "HH:mm", { locale: es })
    : "";

  // Different styles based on role
  const isUser = role === "user";

  // Font size classes based on settings
  const fontSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Spacing classes based on settings
  const spacingClasses = {
    compact: "py-1.5 px-2",
    normal: "py-2 px-3",
    relaxed: "py-3 px-4",
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
              Tú
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
            <div className="mb-2">
              <div className="relative inline-block">
                <img
                  src={imageUrl}
                  alt="Imagen adjunta"
                  className={cn(
                    "rounded-md border border-border object-contain cursor-pointer transition-all",
                    isImageExpanded ? "max-h-80 w-auto" : "h-20 w-auto"
                  )}
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                />
              </div>
            </div>
          )}

          {/* Text content */}
          <div className="whitespace-pre-wrap">{content}</div>
        </Card>

        {/* Timestamp */}
        {settings.showTimestamps && timestamp && (
          <span className="mt-1 text-xs text-muted-foreground">
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};
