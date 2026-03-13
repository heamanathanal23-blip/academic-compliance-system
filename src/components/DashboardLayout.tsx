import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileMenu } from "@/components/ProfileMenu";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-12 flex items-center justify-between border-b border-border/50 px-6 bg-background/50 backdrop-blur-sm"
          >
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <ProfileMenu />
            </div>
          </motion.header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
