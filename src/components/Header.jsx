import React from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogoutMutation } from "@/hooks/useAuth";
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
  const location = useLocation();
  const { pageTitle } = useCourses();

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

        <Popover>
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
          <PopoverContent align="end" className="w-80 rounded-2xl glass p-0">
            <div className="flex items-center justify-between border-b border-white/20 p-4">
              <h4 className="font-semibold">Notifications</h4>
              <Badge variant="secondary" className="rounded-full">
                3 New
              </Badge>
            </div>
            <div className="grid gap-1 p-2">
              <div className="grid gap-1 rounded-xl p-3 hover:bg-black/5 transition-colors cursor-pointer">
                <p className="text-sm font-medium leading-none">
                  Assignment Graded
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  CS101: Midterm Project has been graded.
                </p>
              </div>
              <div className="grid gap-1 rounded-xl p-3 hover:bg-black/5 transition-colors cursor-pointer">
                <p className="text-sm font-medium leading-none">
                  New Announcement
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Campus will be closed on Friday.
                </p>
              </div>
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
            className="w-64 rounded-2xl glass p-2"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-2">
                <p className="text-base font-medium leading-none">
                  {user?.name}
                </p>
                <p className="text-sm leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <div className="pt-2">
                  <Badge
                    variant={
                      user?.role === "Admin"
                        ? "destructive"
                        : user?.role === "Lecturer"
                          ? "default"
                          : "secondary"
                    }
                    className="rounded-full px-3"
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-2">
              Switch Role (Testing)
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer"
              onClick={() => switchRole("Student")}
            >
              Student View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer"
              onClick={() => switchRole("Lecturer")}
            >
              Lecturer View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer"
              onClick={() => switchRole("Admin")}
            >
              Admin View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
