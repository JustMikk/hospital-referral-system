"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Search, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/medical/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { conversations, currentUser } from "@/lib/mock-data";
import type { Conversation, Message } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participantHospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Simulate sending message (in a real app, this would be an API call)
    setNewMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Secure communication with other healthcare providers"
      />

      <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06] overflow-hidden">
        <div className="flex h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversation List */}
          <div className="w-80 border-r border-border flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No conversations found
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border",
                      selectedConversation?.id === conversation.id && "bg-muted"
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(conversation.participantName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">
                          {conversation.participantName}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {conversation.participantRole} | {conversation.participantHospital}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedConversation.participantName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {selectedConversation.participantName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.participantRole} |{" "}
                      {selectedConversation.participantHospital}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isCurrentUser && "flex-row-reverse"
                        )}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback
                            className={cn(
                              "text-xs",
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {getInitials(message.senderName)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[70%] space-y-1",
                            isCurrentUser && "items-end"
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2.5",
                              isCurrentUser
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted text-foreground rounded-tl-sm"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p
                            className={cn(
                              "text-xs text-muted-foreground",
                              isCurrentUser && "text-right"
                            )}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {getInitials(selectedConversation.participantName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <Paperclip className="h-5 w-5" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Messages are encrypted and HIPAA compliant
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Select a conversation
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose a conversation from the list to start messaging with other
                  healthcare providers.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}


