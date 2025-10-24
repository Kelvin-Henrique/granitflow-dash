import { LayoutDashboard, Users, Briefcase, Package, FileText, ClipboardList, Calendar, DollarSign, Calculator, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clientes", url: "/customers", icon: Users },
  { title: "Projetos", url: "/projects", icon: Briefcase },
  { title: "Materiais", url: "/materials", icon: Package },
  { title: "Orçamentos", url: "/quotes", icon: FileText },
  { title: "Ordens de Serviço", url: "/orders", icon: ClipboardList },
  { title: "Agenda", url: "/schedule", icon: Calendar },
  { title: "Financeiro", url: "/finance", icon: DollarSign },
  { title: "Calculadora", url: "/calculator", icon: Calculator },
  { title: "Equipe", url: "/team", icon: UsersRound },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border w-64">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <h2 className="text-base font-bold text-sidebar-foreground">MarmoERP</h2>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs px-2">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium border-l-2 border-primary"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
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
