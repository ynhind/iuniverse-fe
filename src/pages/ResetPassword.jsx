import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useChangePasswordMutation } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { KeyRound, Eye, EyeOff, AlertCircle } from "lucide-react";

export function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [errors, setErrors] = useState({});

  const changePasswordMutation = useChangePasswordMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("secretKey");
    if (key) setSecretKey(key);
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!secretKey) {
      newErrors.secretKey = "Missing secret key. Please use the link provided in your email.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    changePasswordMutation.mutate({
      secretKey: secretKey,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    }, {
      onSuccess: () => {
        toast({ title: "Password Reset", description: "Your password has been successfully reset. Please log in.", variant: "success" });
        navigate("/login");
      },
      onError: (err) => {
        toast({ title: "Reset Failed", description: err?.response?.data?.message || "Invalid or expired secret key.", variant: "error" });
      }
    });
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-md mx-auto">
      <Card className="glass border-white/40 shadow-2xl shadow-primary/10 backdrop-blur-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/30">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Reset Password
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Enter your new password below.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.secretKey && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{errors.secretKey}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-11 pr-10 bg-white/50 border-slate-200/60 ${errors.password ? "border-red-300" : ""}`}
                    value={formData.password} onChange={handleChange}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword" name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-11 pr-10 bg-white/50 border-slate-200/60 ${errors.confirmPassword ? "border-red-300" : ""}`}
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                  <button
                    type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-4 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 transition-all"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <Link to="/login" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
            Return to Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
