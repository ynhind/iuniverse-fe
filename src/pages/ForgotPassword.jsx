import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Mail, KeyRound, AlertCircle, ArrowLeft } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      toast({
        title: "Link Sent",
        description: "Check your email for the reset link.",
        variant: "success",
      });
    }, 1500);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Card className="glass border-white/40 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/30">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              {isSent 
                ? "We've sent a password reset link to your email." 
                : "Enter your email to receive a password reset link."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@iu.edu"
                      className={`pl-10 h-12 bg-white/50 border-slate-200/60 focus:bg-white/80 transition-all ${
                        errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
                      }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm text-emerald-800 text-center font-medium">
                  If an account exists for {email}, you will receive a reset link shortly.
                </p>
              </div>
              <Button
                type="button"
                className="w-full h-12 text-base font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
                onClick={() => {
                  setIsSent(false);
                  setEmail("");
                }}
              >
                Try another email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="mt-2 text-center text-sm text-slate-500 w-full flex justify-center">
            <Link to="/login" className="font-semibold text-primary hover:text-secondary transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
