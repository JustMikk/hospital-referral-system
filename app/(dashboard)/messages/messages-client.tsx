"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Search, MessageSquare, User } from "lucide-react";
import { PageHeader } from "@/components/medical/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { sendMessage, markMessagesAsRead } from "@/app/actions/messages";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { NewMessageDialog } from "@/components/medical/new-message-dialog";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date | string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  participantHospital: string;
  lastMessage: string;
  lastMessageTime: Date | string;
  unreadCount: number;
  messages: Message[];
}

interface MessagesClientProps {
  initialConversations: Conversation[];
  currentUserId: string;
}

export default function MessagesClient({ initialConversations, currentUserId }: MessagesClientProps) {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    initialConversations[0] || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Update selected conversation when initialConversations changes
  useEffect(() => {
    if (selectedConversation) {
      const updated = initialConversations.find(c => c.id === selectedConversation.id);
      if (updated) {
        setSelectedConversation(updated);
      }
    } else if (initialConversations.length > 0) {
      setSelectedConversation(initialConversations[0]);
    }
  }, [initialConversations]);

  const filteredConversations = initialConversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participantHospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // Mark messages as read when a conversation is selected
    if (selectedConversation && selectedConversation.unreadCount > 0) {
      markMessagesAsRead(selectedConversation.id).then(() => {
        router.refresh();
      });
    }
  }, [selectedConversation?.id, selectedConversation?.messages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(selectedConversation.id, newMessage);
      setNewMessage("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (date: Date | string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return String(date);
    }
  };

  const existingConversationIds = initialConversations.map((c) => c.id);

  return (
    <div className="h-[calc(100vh-64px-48px)] flex flex-col">
      <PageHeader
        title="Messages"
        description="Secure communication with other healthcare providers"
        className="shrink-0"
      >
        <NewMessageDialog existingConversationIds={existingConversationIds} />
      </PageHeader>

      <Card className="mt-4 flex-1 shadow-sm border-border/40 overflow-hidden bg-background/50 backdrop-blur-xl">
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-80 border-r border-border flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border/40 bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all"
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
                      "w-full p-4 flex items-start gap-3 hover:bg-muted/60 transition-all duration-200 text-left border-b border-border/40 group relative",
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : "border-l-2 border-l-transparent"
                    )}
                  >
                    <Avatar className={cn(
                      "h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-105",
                      selectedConversation?.id === conversation.id && "ring-2 ring-primary/20"
                    )}>
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials(conversation.participantName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "font-medium text-sm truncate transition-colors",
                          selectedConversation?.id === conversation.id ? "text-primary" : "text-foreground"
                        )}>
                          {conversation.participantName}
                        </p>
                        <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap font-medium">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                        {conversation.participantRole}
                      </p>
                      <p className="text-xs text-muted-foreground/80 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
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
                <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center gap-4 backdrop-blur-sm">
                  <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(selectedConversation.participantName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {selectedConversation.participantName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-primary/80">{selectedConversation.participantRole}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{selectedConversation.participantHospital}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 group",
                          isCurrentUser && "flex-row-reverse"
                        )}
                      >
                        <Avatar className="h-8 w-8 shrink-0 ring-2 ring-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <AvatarFallback
                            className={cn(
                              "text-[10px] font-medium",
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
                              "rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed",
                              isCurrentUser
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-white dark:bg-muted/50 text-foreground rounded-tl-sm border border-border/50"
                            )}
                          >
                            <p>{message.content}</p>
                          </div>
                          <p
                            className={cn(
                              "text-[10px] text-muted-foreground/60 font-medium px-1",
                              isCurrentUser && "text-right"
                            )}
                          >
                            {formatTime(message.timestamp)}
                            {isCurrentUser && (
                              <span className="ml-1.5 inline-block">
                                {message.read ? "Read" : "Delivered"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border/40 bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-full border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-background shadow-sm"
                    >
                      <Paperclip className="h-4 w-4" />
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
                      className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 h-9"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="rounded-full h-9 w-9 shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      End-to-end Encrypted • HIPAA Compliant
                    </p>
                  </div>
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


