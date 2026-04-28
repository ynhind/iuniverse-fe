import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Mail, Shield, BookOpen, Award, Calendar, Edit3, Camera } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "default"}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">My Profile</h2>
        <p className="text-lg text-slate-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass border-none shadow-xl shadow-slate-200/40 md:col-span-1">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={user?.avatar || avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-display text-3xl">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
            
            <h3 className="font-display text-2xl font-semibold text-slate-900">{user?.name || "Student Name"}</h3>
            <div className="flex items-center gap-2 mt-2 text-slate-500 bg-slate-50 px-3 py-1 rounded-full text-sm border border-slate-200">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium capitalize">{user?.role?.toLowerCase() || "Student"} Account</span>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="font-display text-xl">Personal Information</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-xl">
                <Edit3 className="w-4 h-4 mr-2" /> Edit
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <p className="text-slate-900 font-medium">{user?.name || "Student Name"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {user?.email || "student@iuniverse.edu"}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Username</label>
                  <p className="text-slate-900 font-medium">{user?.username || "student123"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Joined Date</label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    September 2025
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {(user?.role === "STUDENT" || user?.role === "Student") && (
            <Card className="glass border-none shadow-xl shadow-slate-200/40">
              <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-4">
                <CardTitle className="font-display text-xl">Academic Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:bg-blue-50 cursor-default">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">4</p>
                      <p className="text-sm text-slate-500 font-medium">Active Courses</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:bg-emerald-50 cursor-default">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">A-</p>
                      <p className="text-sm text-slate-500 font-medium">Average Grade</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
