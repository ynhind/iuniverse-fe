import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, logout } = useAuth();

  const mainNav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "My Courses", path: "/courses", icon: BookOpen },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Grades", path: "/grades", icon: GraduationCap },
  ];

  return (
    <aside className="relative z-20 m-4 hidden flex-col rounded-[2rem] glass w-[260px] lg:flex h-[calc(100vh-2rem)]">
      <div className="flex h-20 items-center px-8">
        <div className="flex items-center gap-3 font-bold text-primary">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
            IU
          </div>
          <span className="font-display text-xl tracking-tight">IUniverse</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-2 px-4">
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-black/5 p-2">
          <nav className="grid gap-1">
            <button className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground">
              <HelpCircle className="h-4 w-4" />
              Help
            </button>
            <button className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
}
