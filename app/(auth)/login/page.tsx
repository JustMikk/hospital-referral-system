"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Stethoscope, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80",
    title: "Secure Hospital Referral System",
    description: "Streamline patient referrals and share medical records securely across healthcare facilities in real-time.",
  },
  {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
    title: "Connected Healthcare Network",
    description: "Join a network of 500+ hospitals sharing patient data securely and efficiently.",
  },
  {
    url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
    title: "Real-time Collaboration",
    description: "Enable doctors and nurses to communicate and collaborate on patient care instantly.",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80",
    title: "HIPAA Compliant Platform",
    description: "Your patient data is protected with enterprise-grade security and encryption.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      {/* Left side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-900/80" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Refero</span>
          </div>

          <div className="space-y-6">
            {carouselImages.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "transition-all duration-700",
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute"
                )}
              >
                {index === currentSlide && (
                  <>
                    <h1 className="text-4xl font-bold leading-tight text-balance">
                      {slide.title}
                    </h1>
                    <p className="text-lg text-white/80 max-w-md text-pretty mt-4">
                      {slide.description}
                    </p>
                  </>
                )}
              </div>
            ))}
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

          <div className="space-y-4">
            {/* Carousel Indicators */}
            <div className="flex gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-white/60">
              HIPAA Compliant | SOC 2 Certified | End-to-End Encrypted
            </p>
          </div>
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
            <Link href="/contact-hospitals" className="text-primary hover:underline">
              Contact your hospital administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
