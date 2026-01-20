"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Stethoscope, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.user) {
        setLoginSuccess(true);
        // Small delay to show success state
        setTimeout(() => {
          const role = result.user?.role as any;
          if (role === "SYSTEM_ADMIN") {
            router.push("/admin/analytics");
          } else if (role === "HOSPITAL_ADMIN") {
            router.push("/admin/analytics");
          } else if (role === "NURSE") {
            router.push("/tasks");
          } else {
            router.push("/referrals");
          }
        }, 800);
      } else {
        setAuthError(result.error || "Invalid email or password");
        setIsLoading(false);
      }
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-700" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Refero</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              Secure Hospital Referral System
            </h1>
            <p className="text-lg text-white/80 max-w-md text-pretty">
              Streamline patient referrals and share medical records securely
              across healthcare facilities in real-time.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-white/70">Hospitals</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-white/70">Doctors</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">1M+</p>
                <p className="text-sm text-white/70">Patients</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60">
            HIPAA Compliant | SOC 2 Certified | End-to-End Encrypted
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Refero</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your dashboard and manage referrals
            </p>
          </div>

          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {loginSuccess && (
            <Alert className="border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Login successful! Redirecting...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loginSuccess ? "Redirecting..." : "Signing in..."}
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <p className="font-medium">Doctor:</p>
                <p className="text-muted-foreground">emily.wilson@centralmed.com</p>
              </div>
              <div>
                <p className="font-medium">Nurse:</p>
                <p className="text-muted-foreground">jane.miller@centralmed.com</p>
              </div>
              <div>
                <p className="font-medium">Hosp Admin:</p>
                <p className="text-muted-foreground">admin@centralmed.com</p>
              </div>
              <div>
                <p className="font-medium">Sys Admin:</p>
                <p className="text-muted-foreground">admin@system.com</p>
              </div>
            </div>
            <p className="text-[10px] mt-2 text-muted-foreground italic">Password: password123</p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Need access?{" "}
            <span className="text-primary">
              Contact your hospital administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
