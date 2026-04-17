import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterMutation, useVerifyAccountMutation, useResendOtpMutation } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { UserPlus, Mail, Lock, AlertCircle, User, Eye, EyeOff, BookOpen, GraduationCap } from "lucide-react";

export function Register() {
  const [role, setRole] = useState("STUDENT");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    gender: "MALE",
    birthday: "",
    studentCode: "",
    street: "",
    city: "",
    country: "",
    // Teacher specific
    department: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegisterMutation();
  const verifyAccountMutation = useVerifyAccountMutation();
  const resendOtpMutation = useResendOtpMutation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "STUDENT") {
      if (!formData.birthday) newErrors.birthday = "Birthday is required";
      if (!formData.studentCode) newErrors.studentCode = "Student code is required";
      if (!formData.street) newErrors.street = "Street address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.country) newErrors.country = "Country is required";
    }

    if (role === "TEACHER" && !formData.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: role
    };

    if (role === "STUDENT") {
      payload = {
        ...payload,
        gender: formData.gender,
        birthday: formData.birthday,
        studentCode: formData.studentCode,
        address: {
          street: formData.street,
          city: formData.city,
          country: formData.country,
          addressType: 1
        }
      };
    } else {
      payload = {
        ...payload,
        department: formData.department
      };
    }

    registerMutation.mutate(payload, {
      onSuccess: () => {
        setIsVerifying(true);
        toast({ title: "Account Created!", description: "Please verify your email with the OTP sent.", variant: "success" });
      },
      onError: (err) => {
        toast({ title: "Registration Failed", description: err?.response?.data?.message || "Something went wrong.", variant: "error" });
      }
    });
  };

  const handleVerify = () => {
    if (!otp) {
      toast({ title: "Error", description: "Please enter OTP.", variant: "error" });
      return;
    }
    verifyAccountMutation.mutate({ email: formData.email, otp }, {
       onSuccess: () => {
         toast({ title: "Account Verified", description: "Welcome! Please login.", variant: "success" });
         navigate("/login");
       },
       onError: (err) => {
         toast({ title: "Verification Failed", description: err?.response?.data?.message || "Invalid OTP.", variant: "error" });
       }
    });
  };

  const handleResend = () => {
    resendOtpMutation.mutate(formData.email, {
       onSuccess: () => toast({ title: "OTP Sent", description: "A new OTP has been sent.", variant: "success" }),
       onError: () => toast({ title: "Error", description: "Could not resend OTP.", variant: "error" })
    });
  };

  if (isVerifying) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-md mx-auto mt-20">
        <Card className="glass border-white/40 shadow-2xl backdrop-blur-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>Enter the OTP sent to {formData.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>One-Time Password</Label>
              <Input 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                placeholder="123456" 
                className="text-center tracking-widest text-lg h-12"
              />
            </div>
            <Button 
              className="w-full h-12" 
              onClick={handleVerify}
              disabled={verifyAccountMutation.isPending}
            >
              {verifyAccountMutation.isPending ? "Verifying..." : "Verify Account"}
            </Button>
            <div className="text-center pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary" 
                onClick={handleResend}
                disabled={resendOtpMutation.isPending}
              >
                {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 w-full max-w-xl mx-auto">
      <Card className="glass border-white/40 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === "STUDENT" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === "TEACHER" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Teacher
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Create a {role === "STUDENT" ? "Student" : "Teacher"} account
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Enter your details to register
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2 col-span-1">
                <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                <Input
                  id="firstName" name="firstName" type="text" placeholder="John"
                  className={`h-11 bg-white/50 border-slate-200/60 ${errors.firstName ? "border-red-300" : ""}`}
                  value={formData.firstName} onChange={handleInputChange}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2 col-span-1">
                <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                <Input
                  id="lastName" name="lastName" type="text" placeholder="Doe"
                  className={`h-11 bg-white/50 border-slate-200/60 ${errors.lastName ? "border-red-300" : ""}`}
                  value={formData.lastName} onChange={handleInputChange}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                <Input
                  id="username" name="username" type="text" placeholder="johndoe123"
                  className={`h-11 bg-white/50 border-slate-200/60 ${errors.username ? "border-red-300" : ""}`}
                  value={formData.username} onChange={handleInputChange}
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email" name="email" type="email" placeholder="name@domain.com"
                  className={`h-11 bg-white/50 border-slate-200/60 ${errors.email ? "border-red-300" : ""}`}
                  value={formData.email} onChange={handleInputChange}
                />
                 {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Conditionally Rendered Fields */}
            {role === "STUDENT" ? (
              <div className="space-y-5 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-700 font-medium">Gender</Label>
                    <select
                      id="gender" name="gender"
                      className="w-full h-11 px-3 py-2 bg-white/50 border-slate-200/60 border rounded-lg text-sm outline-none focus:border-primary"
                      value={formData.gender} onChange={handleInputChange}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="birthday" className="text-slate-700 font-medium">Birthday</Label>
                    <Input
                      id="birthday" name="birthday" type="date"
                      className={`h-11 ${errors.birthday ? "border-red-300" : ""}`}
                      value={formData.birthday} onChange={handleInputChange}
                    />
                     {errors.birthday && <p className="text-xs text-red-500">{errors.birthday}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCode" className="text-slate-700 font-medium">Student Code</Label>
                  <Input
                    id="studentCode" name="studentCode" type="text" placeholder="STU-10001"
                    className={`h-11 ${errors.studentCode ? "border-red-300" : ""}`}
                    value={formData.studentCode} onChange={handleInputChange}
                  />
                  {errors.studentCode && <p className="text-xs text-red-500">{errors.studentCode}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Address</Label>
                  <div className="grid grid-cols-6 gap-2">
                    <Input name="street" placeholder="Street" value={formData.street} onChange={handleInputChange} className={`col-span-3 h-11 ${errors.street ? "border-red-300" : ""}`} />
                    <Input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className={`col-span-2 h-11 ${errors.city ? "border-red-300" : ""}`} />
                    <Input name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} className={`col-span-1 h-11 ${errors.country ? "border-red-300" : ""}`} />
                  </div>
                  {(errors.street || errors.city || errors.country) && <p className="text-xs text-red-500">Full address details are required</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-5 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-slate-700 font-medium">Department</Label>
                  <Input
                    id="department" name="department" type="text" placeholder="e.g. Computer Science"
                    className={`h-11 ${errors.department ? "border-red-300" : ""}`}
                    value={formData.department} onChange={handleInputChange}
                  />
                  {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-11 pr-10 bg-white/50 border-slate-200/60 ${errors.password ? "border-red-300" : ""}`}
                    value={formData.password} onChange={handleInputChange}
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
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword" name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-11 pr-10 bg-white/50 border-slate-200/60 ${errors.confirmPassword ? "border-red-300" : ""}`}
                    value={formData.confirmPassword} onChange={handleInputChange}
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-center text-sm text-slate-500 w-full border-t border-slate-100 pt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-secondary transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
