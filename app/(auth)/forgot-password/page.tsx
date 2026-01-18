"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">Refero</span>
        </div>

        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Reset your password
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we will send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={error ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
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
                    Sending instructions...
                  </>
                ) : (
                  "Send reset instructions"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Check your email
              </h2>
              <p className="text-sm text-muted-foreground">
                We have sent password reset instructions to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Please check your inbox and follow the link to reset your password.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Did not receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline"
                >
                  try another email address
                </button>
                .
              </p>
            </div>
          </div>
        )}

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
