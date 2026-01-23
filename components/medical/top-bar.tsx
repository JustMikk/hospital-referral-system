"use client";

import { Bell, Search, Moon, Sun, AlertTriangle, Check, X, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNotifications } from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "emergency" | "accepted" | "rejected" | "message";
  title: string;
  message: string;
  time: Date;
  link: string;
  priority: "high" | "normal";
}

export function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
        setEmergencyCount(data.emergencyCount);
        setUnreadMessages(data.unreadMessages);
      } catch (error) {
        // Silently fail - user might not be logged in
      }
    };

    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients, referrals, records..."
          className="pl-9 bg-muted/50 border-0 focus-visible:bg-background focus-visible:ring-1"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {(emergencyCount > 0 || notifications.length > 0) && (
                <span className={cn(
                  "absolute right-1.5 top-1.5 h-2 w-2 rounded-full",
                  emergencyCount > 0 ? "bg-destructive animate-pulse" : "bg-primary"
                )} />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {emergencyCount > 0 && (
                <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                  {emergencyCount} emergency
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer",
                    notification.type === "emergency" && "bg-red-50 dark:bg-red-900/10"
                  )}
                  onClick={() => router.push(notification.link)}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    notification.type === "emergency" && "bg-red-100 dark:bg-red-900/30 text-red-600",
                    notification.type === "accepted" && "bg-green-100 dark:bg-green-900/30 text-green-600",
                    notification.type === "rejected" && "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
                    notification.type === "message" && "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                  )}>
                    {notification.type === "emergency" && <AlertTriangle className="h-4 w-4" />}
                    {notification.type === "accepted" && <Check className="h-4 w-4" />}
                    {notification.type === "rejected" && <X className="h-4 w-4" />}
                    {notification.type === "message" && <MessageSquare className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm",
                      notification.type === "emergency" && "text-red-700 dark:text-red-400"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            {unreadMessages > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-primary"
                  onClick={() => router.push("/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {unreadMessages} unread message{unreadMessages > 1 ? "s" : ""}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-2 hover:bg-muted"
            >
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium text-foreground">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.role ? formatRole(user.role) : ""}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name || "User"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email || ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
