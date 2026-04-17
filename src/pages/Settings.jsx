import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Bell,
  Lock,
  User,
  Globe,
  Moon,
  Sun,
  Monitor,
  Shield,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useChangePasswordMutation } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";

export function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const changePasswordMutation = useChangePasswordMutation();

  const [passwordState, setPasswordState] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = () => {
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "error" });
      return;
    }
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "error" });
      return;
    }

    changePasswordMutation.mutate({
      oldPassword: passwordState.currentPassword,
      newPassword: passwordState.newPassword
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Password updated successfully.", variant: "success" });
        setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err?.response?.data?.message || "Failed to update password.", variant: "error" });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
            Settings
          </h2>
          <p className="text-lg text-slate-500 mt-1">
            Manage your account preferences and application settings.
          </p>
        </div>
        <Button className="rounded-2xl shadow-md shadow-primary/20">
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-14 rounded-2xl bg-white/40 p-1 border border-slate-200/60 shadow-sm mb-8">
          <TabsTrigger
            value="profile"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-6">
              <CardTitle className="font-display text-2xl">
                Personal Information
              </CardTitle>
              <CardDescription className="text-base">
                Update your personal details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl font-display font-bold text-primary shadow-inner border-4 border-white">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-white/50 hover:bg-white shadow-sm border-slate-200/60"
                  >
                    Change Avatar
                  </Button>
                </div>
                <div className="flex-1 space-y-6 w-full">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={user?.name}
                      className="bg-white/70 border-slate-200/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email}
                      className="bg-white/70 border-slate-200/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-slate-700"
                    >
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      placeholder="A short bio about yourself"
                      className="bg-white/70 border-slate-200/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-6">
              <CardTitle className="font-display text-2xl">
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-base">
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Email Notifications
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50 hover:bg-white/60 transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium text-slate-900">
                      Course Updates
                    </Label>
                    <p className="text-sm text-slate-500">
                      Receive emails about new materials, announcements, and
                      syllabus changes.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50 hover:bg-white/60 transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium text-slate-900">
                      Assignment Deadlines
                    </Label>
                    <p className="text-sm text-slate-500">
                      Get reminders 24 hours before an assignment is due.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50 hover:bg-white/60 transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium text-slate-900">
                      Grades Posted
                    </Label>
                    <p className="text-sm text-slate-500">
                      Be notified immediately when a new grade is published.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Push Notifications
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50 hover:bg-white/60 transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium text-slate-900">
                      Direct Messages
                    </Label>
                    <p className="text-sm text-slate-500">
                      Receive push notifications for messages from lecturers or
                      peers.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50 hover:bg-white/60 transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium text-slate-900">
                      System Alerts
                    </Label>
                    <p className="text-sm text-slate-500">
                      Important system maintenance or security alerts.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-6">
              <CardTitle className="font-display text-2xl">
                Appearance
              </CardTitle>
              <CardDescription className="text-base">
                Customize how IUniverse looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium text-slate-900">
                  Theme
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-full h-24 rounded-2xl border-2 border-primary bg-slate-50 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                      <Sun className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      Light
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group opacity-50">
                    <div className="w-full h-24 rounded-2xl border-2 border-transparent bg-slate-900 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                      <Moon className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      Dark (Coming Soon)
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 cursor-pointer group opacity-50">
                    <div className="w-full h-24 rounded-2xl border-2 border-transparent bg-gradient-to-br from-slate-100 to-slate-800 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                      <Monitor className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      System
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Label className="text-base font-medium text-slate-900">
                  Language & Region
                </Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="language"
                      className="text-sm font-medium text-slate-700"
                    >
                      Language
                    </Label>
                    <select
                      id="language"
                      className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="en">English (US)</option>
                      <option value="vi">Tiếng Việt</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="timezone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Timezone
                    </Label>
                    <select
                      id="timezone"
                      className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="utc">
                        UTC (Coordinated Universal Time)
                      </option>
                      <option value="ict">ICT (Indochina Time)</option>
                      <option value="est">EST (Eastern Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-6">
              <CardTitle className="font-display text-2xl">
                Security Settings
              </CardTitle>
              <CardDescription className="text-base">
                Manage your password and account security.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Change Password
                </h3>
                <div className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="current-password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordState.currentPassword}
                      onChange={(e) => setPasswordState({...passwordState, currentPassword: e.target.value})}
                      className="bg-white/70 border-slate-200/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="new-password"
                      className="text-sm font-medium text-slate-700"
                    >
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({...passwordState, newPassword: e.target.value})}
                      className="bg-white/70 border-slate-200/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({...passwordState, confirmPassword: e.target.value})}
                      className="bg-white/70 border-slate-200/60 shadow-sm rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                  <Button 
                    className="w-fit mt-2 rounded-xl shadow-sm"
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100/50">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          MacBook Pro - Chrome
                        </p>
                        <p className="text-xs text-slate-500">
                          Ho Chi Minh City, Vietnam • Active now
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-600 border-none rounded-lg"
                    >
                      Current
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          iPhone 14 Pro - Safari
                        </p>
                        <p className="text-xs text-slate-500">
                          Ho Chi Minh City, Vietnam • Last active: 2 hours ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
