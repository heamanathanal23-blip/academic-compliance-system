import { LayoutDashboard, Users, MessageSquare, BarChart3, GraduationCap, AlertCircle, Briefcase, Settings, BookOpen, TrendingUp, ClipboardCheck } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const getNavItems = (role: string | undefined) => {
  const baseItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
  ];

  const adminItems = [
    ...baseItems,
    { title: "Students", url: "/students", icon: Users },
    { title: "Faculty", url: "/faculty", icon: Briefcase },
    { title: "Departments", url: "/departments", icon: Building },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Risk Alerts", url: "/risk-alerts", icon: AlertCircle },
    { title: "Interventions", url: "/interventions", icon: ClipboardCheck },
    { title: "Reports", url: "/reports", icon: TrendingUp },
    { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const facultyItems = [
    ...baseItems,
    { title: "Students", url: "/students", icon: Users },
    { title: "Departments", url: "/departments", icon: Building },
    { title: "Risk Alerts", url: "/risk-alerts", icon: AlertCircle },
    { title: "Interventions", url: "/interventions", icon: ClipboardCheck },
    { title: "Reports", url: "/reports", icon: TrendingUp },
    { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const studentItems = [
    ...baseItems,
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  if (role === "admin") return adminItems;
  if (role === "faculty") return facultyItems;
  if (role === "student") return studentItems;
  return baseItems;
};

import { Building, CalendarCheck } from "lucide-react";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = getNavItems(user?.role);
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
          {!collapsed && (
            <span className="font-heading text-base font-bold text-foreground">Academic Compass</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "" : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
