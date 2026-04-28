import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, ChevronRight, LogOut, User, GraduationCap, Shield, Settings, LifeBuoy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogoutMutation } from "@/hooks/useAuth";
import { studentApi } from "@/api/student.api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useLocation, Link } from "react-router-dom";
import { useCourses } from "@/contexts/CourseContext";

export function Header() {
  const { user, switchRole, logout } = useAuth();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pageTitle } = useCourses();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    studentApi.getNotifications(user?.role)
      .then(res => setNotifications(res.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.role]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => logout()
    });
  };

  const pathnames = location.pathname.split("/").filter((x) => x);
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "default"}`;

  return (
    <header className="sticky top-4 z-30 mx-4 mt-4 flex h-16 items-center justify-between rounded-2xl glass px-6 lg:mx-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          // If last segment is a number (e.g. course ID) and we have a real name, use it
          const isNumeric = /^\d+$/.test(value);
          const label = isLast && isNumeric && pageTitle
            ? pageTitle
            : value.replace(/-/g, " ");
          return (
            <React.Fragment key={to}>
              <ChevronRight className="h-4 w-4 opacity-50" />
              {isLast ? (
                <span className="font-medium text-foreground capitalize">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses, users... (Cmd+K)"
            className="h-10 w-full rounded-full bg-white/50 pl-10 shadow-sm border-white/40"
          />
        </div>

        <Popover onOpenChange={(open) => { if (open) fetchNotifications(); }}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full bg-white/50 shadow-sm border border-white/40 hover:bg-white/80"
            >
              <Bell className="h-5 w-5 text-foreground/80" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-2xl glass p-0 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/40 p-4">
              <h4 className="font-semibold text-slate-800">Notifications</h4>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                  {notifications.length} New
                </Badge>
              )}
            </div>
            <div className="grid gap-1 p-2 max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="grid gap-1 rounded-xl p-3 hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {notif.content}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(notif.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-400">
                  You have no new notifications.
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 ring-2 ring-white shadow-sm"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 rounded-3xl bg-white p-3 border border-slate-200 shadow-2xl ring-1 ring-slate-900/5"
            align="end"
            forceMount
          >
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl mb-2">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={user?.avatar || avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-base font-semibold text-slate-900 truncate">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-slate-100 my-2" />
            
            <DropdownMenuItem 
              className="rounded-xl cursor-pointer hover:bg-slate-50 text-slate-700 mb-1"
              onClick={() => navigate("/profile")}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/50 text-slate-500 shrink-0">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium">My Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-xl cursor-pointer hover:bg-slate-50 text-slate-700 mb-1"
              onClick={() => navigate("/settings")}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/50 text-slate-500 shrink-0">
                <Settings className="h-4 w-4" />
              </div>
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-slate-50 text-slate-700 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/50 text-slate-500 shrink-0">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <span className="font-medium">Help Center</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 my-2" />
            
            <DropdownMenuItem
              className="rounded-xl cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100/50 shrink-0">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-semibold">{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
