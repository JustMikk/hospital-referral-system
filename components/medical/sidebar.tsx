"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  MessageSquare,
  ClipboardList,
  Building2,
  Settings,
  ChevronLeft,
  Stethoscope,
  LogOut,
  Shield,
  UserCog,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@/context/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
}

const navItems: NavItem[] = [
  // Clinical Routes
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["doctor", "nurse", "hospital_admin"] },
  { label: "Patients", href: "/patients", icon: Users, roles: ["doctor", "nurse"] },
  { label: "Tasks", href: "/tasks", icon: ClipboardCheck, roles: ["nurse"] },
  { label: "Referrals", href: "/referrals", icon: FileText, roles: ["doctor", "nurse", "hospital_admin"] },
  { label: "Medical Records", href: "/records", icon: FolderKanban, roles: ["doctor", "nurse"] },
  { label: "Messages", href: "/messages", icon: MessageSquare, roles: ["doctor", "nurse"] },

  // Hospital Admin Routes
  { label: "Staff Mgmt", href: "/staff", icon: Users, roles: ["hospital_admin"] },
  { label: "Departments", href: "/departments", icon: Building2, roles: ["hospital_admin"] },
  { label: "Emergency Access", href: "/emergency-access", icon: AlertTriangle, roles: ["hospital_admin"] },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["hospital_admin", "system_admin"] },

  // System Admin Routes (Hidden from Hospital Admin)
  { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["system_admin"] },
  { label: "Hospital Mgmt", href: "/admin/hospitals", icon: Building2, roles: ["system_admin"] },
  { label: "System Staff", href: "/admin/staff", icon: UserCog, roles: ["system_admin"] },
  { label: "Permissions", href: "/admin/permissions", icon: Shield, roles: ["system_admin"] },

  // Shared
  { label: "Audit Logs", href: "/audit-logs", icon: ClipboardList, roles: ["hospital_admin", "doctor", "system_admin"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["doctor", "nurse", "hospital_admin", "system_admin"] },
];

export function Sidebar() {
  const { userRole, logout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) return false;
    return true;
  });

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold text-foreground">
                  Refero
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                isCollapsed && "absolute -right-4 top-6 bg-card border border-border shadow-sm"
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              const navLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navLink;
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/login");
                    }}
                    className="w-full flex items-center justify-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Sign out
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
