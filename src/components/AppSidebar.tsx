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
        <h2 className="text-base font-bold text-white">MarmoERP</h2>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs px-2 text-white/70 font-medium">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative ${
                        isActive
                          ? "bg-blue-500 text-white font-bold shadow-lg before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-400 before:rounded-r-full"
                          : "hover:bg-white/10 text-white/80 hover:text-white"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0 z-10 relative" />
                    <span className="text-sm font-medium z-10 relative">{item.title}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
