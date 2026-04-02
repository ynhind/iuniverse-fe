import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Shield,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const MOCK_USERS = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@iu.edu",
    role: "Student",
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: "2",
    name: "Dr. Bob Smith",
    email: "bsmith@iu.edu",
    role: "Lecturer",
    status: "Active",
    lastLogin: "1 day ago",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@iu.edu",
    role: "Student",
    status: "Inactive",
    lastLogin: "2 weeks ago",
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@iu.edu",
    role: "Admin",
    status: "Active",
    lastLogin: "Just now",
  },
  {
    id: "5",
    name: "Diana Prince",
    email: "diana@iu.edu",
    role: "Student",
    status: "Active",
    lastLogin: "5 mins ago",
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-3 w-3 mr-1" />;
      case "Lecturer":
        return <GraduationCap className="h-3 w-3 mr-1" />;
      default:
        return <Users className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "Lecturer":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
            User Management
          </h2>
          <p className="text-lg text-slate-500 mt-1">
            Manage system users, roles, and permissions.
          </p>
        </div>
        <Button className="rounded-2xl shadow-md shadow-primary/20">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="glass border-none shadow-xl shadow-slate-200/40 overflow-hidden">
        <CardHeader className="pb-6 bg-white/40 border-b border-slate-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="font-display text-2xl">All Users</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-9 bg-white/70 border-slate-200/60 shadow-sm rounded-2xl focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100/50">
                <TableHead className="font-semibold text-slate-600 pl-6">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Last Login
                </TableHead>
                <TableHead className="w-[80px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors border-slate-100/50"
                >
                  <TableCell className="font-medium text-slate-900 pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm border border-white shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex items-center w-fit px-2.5 py-0.5 rounded-lg border ${getRoleColor(user.role)}`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-lg px-2.5 py-0.5 border-none ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-2xl glass border-white/40 shadow-xl p-2"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1.5">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-slate-100 focus:bg-slate-100">
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-slate-100 focus:bg-slate-100">
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 my-1" />
                        <DropdownMenuItem className="rounded-xl cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
