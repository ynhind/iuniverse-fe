import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
  FileEdit,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogoutMutation } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, logout } = useAuth();
  const logoutMutation = useLogoutMutation();

  const role = String(user?.role || "STUDENT").toUpperCase();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
      },
    });
  };

  const studentNav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "My Courses", path: "/courses", icon: BookOpen },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Grades", path: "/gradebook", icon: GraduationCap },
  ];

  const adminNav = [
    { name: "Review Queue", path: "/admin/review", icon: FileEdit },
    { name: "Announcements", path: "/admin/announcements", icon: BookOpen },
    { name: "User Management", path: "/users", icon: Users },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const teacherNav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "My Created Courses", path: "/teacher/courses", icon: BookOpen },
    { name: "Course Creator", path: "/create-course", icon: FileEdit },
    { name: "Student Submissions", path: "/teacher/submissions", icon: Users },
  ];

  const renderNavItems = (items) => {
    return items.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
          )
        }
      >
        <item.icon className="h-4 w-4" />
        {item.name}
      </NavLink>
    ));
  };

  const getRoleLabel = () => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "TEACHER":
        return "Teacher";
      default:
        return "Student";
    }
  };

  const getNavByRole = () => {
    switch (role) {
      case "ADMIN":
        return adminNav;
      case "TEACHER":
        return teacherNav;
      default:
        return studentNav;
    }
  };

  const currentNav = getNavByRole();
  const roleLabel = getRoleLabel();

  return (
    <aside className="relative z-20 m-4 hidden w-[260px] flex-col rounded-[2rem] glass lg:flex">
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
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            {roleLabel} Dashboard
          </div>

          {renderNavItems(currentNav)}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-black/5 p-2">
          <nav className="grid gap-1">
            <NavLink
              to="/help"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </NavLink>

            <NavLink
              to="/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
}