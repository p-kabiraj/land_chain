import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  ShieldCheck,
  UserCircle2,
  LogOut,
  Blocks,
  PlusSquare,
  Inbox,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const userItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Lands", url: "/lands", icon: Landmark },
  { title: "Transfer Land", url: "/transfer", icon: ArrowLeftRight },
  { title: "Verify Land", url: "/verify", icon: ShieldCheck },
  { title: "Profile", url: "/profile", icon: UserCircle2 },
];

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Add Land", url: "/admin/add-land", icon: PlusSquare },
  { title: "Transfer Requests", url: "/admin/transfers", icon: Inbox },
];

export function AppSidebar({ variant = "user" }: { variant?: "user" | "admin" }) {
  const items = variant === "admin" ? adminItems : userItems;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-primary shadow-elegant">
            <Blocks className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-lg font-bold leading-tight">LandChain</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
              {variant === "admin" ? "Admin Console" : "Owner Portal"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{variant === "admin" ? "Administration" : "Navigation"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Switch view</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={variant === "admin" ? "User Portal" : "Admin Console"}>
                  <Link to={variant === "admin" ? "/dashboard" : "/admin"}>
                    <ShieldCheck className="h-4 w-4" />
                    <span>{variant === "admin" ? "User Portal" : "Admin Console"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <Link to="/login">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
