"use client";

import * as React from "react";

import { motion } from "framer-motion";
import { MessageCircle, Mic, MoreHorizontal, Send, User } from "lucide-react";

import {
  FlowyCard,
  FlowyCardContent,
  FlowyCardFooter,
  FlowyCardHeader,
  FlowyCardSubtitle,
  FlowyCardTitle,
} from "@/components/ui/flowy-card";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isUser?: boolean;
  avatar?: string;
}

interface ConversationCardProps {
  contact: string;
  platform: string;
  messages: Message[];
  expanded?: boolean;
  onExpand?: () => void;
  onSend?: (message: string) => void;
  variant?:
    | "mercury"
    | "mercury-elevated"
    | "mercury-float"
    | "mercury-glass"
    | "default"
    | "elevated"
    | "transparent"
    | "glass";
  className?: string;
}

export function ConversationCard({
  contact,
  platform,
  messages,
  expanded = false,
  onExpand,
  onSend,
  variant,
  className,
}: ConversationCardProps) {
  const [replyText, setReplyText] = React.useState("");

  const handleSend = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (replyText.trim() && onSend) {
      onSend(replyText);
      setReplyText("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (replyText.trim() && onSend) {
        onSend(replyText);
        setReplyText("");
      }
    }
  };

  return (
    <FlowyCard
      variant={variant || "glass"}
      size="md"
      expandable
      expanded={expanded}
      onExpand={onExpand}
      className={cn("max-w-md mx-auto", className)}
    >
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                <MessageCircle className="h-2.5 w-2.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <FlowyCardTitle className="truncate text-base">
                  {contact} @{contact.toLowerCase().replace(" ", "")}
                </FlowyCardTitle>
                <FlowyCardSubtitle className="truncate">
                  {platform} Conversation
                </FlowyCardSubtitle>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Mic className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`max-w-[80%] ${message.isUser ? "order-2" : "order-1"}`}
              >
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {contact}
                    </span>
                  </div>
                )}

                <div
                  className={`p-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-500/20 text-blue-900 dark:text-blue-100 border border-blue-200/50"
                      : "bg-gray-500/20 text-gray-900 dark:text-gray-100 border border-gray-200/50"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>

                <div
                  className={`text-xs text-gray-500 mt-1 ${message.isUser ? "text-right" : "text-left"}`}
                >
                  {message.timestamp}
                </div>
              </div>
            </motion.div>
          ))}

          {messages.length > 2 && (
            <div className="text-center">
              <div className="inline-block px-3 py-1 text-xs bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200/50">
                NEW MESSAGES
              </div>
            </div>
          )}
        </div>
      </FlowyCardContent>

      <FlowyCardFooter className="border-t-0 pt-4">
        <div className="flex items-center space-x-2 w-full">
          <div className="flex-1 relative">
            <motion.textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Reply..."
              className="w-full px-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              rows={1}
              style={{ minHeight: "38px" }}
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <motion.button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!replyText.trim()}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="mt-3 flex items-center justify-center">
          <motion.button
            className="flex items-center text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreHorizontal className="h-3 w-3 mr-1" />
            More actions
          </motion.button>
        </div>
      </FlowyCardFooter>
    </FlowyCard>
  );
}
