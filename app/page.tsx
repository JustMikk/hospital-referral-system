"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Clock,
  FileText,
  MessageSquare,
  Lock,
  Stethoscope,
  Building2,
  Heart,
  Activity,
  Bell,
  CheckCircle2,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const heroData = {
  title: "Hospital Referrals Made Simple",
  subtitle:
    "Secure, HIPAA-compliant platform for seamless patient transfers between healthcare providers",
  cta: "Get Started",
  stats: [
    { value: "70%", label: "Faster Referrals" },
    { value: "5+", label: "Hospitals" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ],
};

const services = [
  {
    icon: <Stethoscope className="h-8 w-8" />,
    title: "Medical Referrals",
    description:
      "Streamline patient transfers between hospitals and specialists with automated workflows.",
    features: [
      "Instant referral submission",
      "Real-time status tracking",
      "Priority-based routing",
    ],
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Digital Records",
    description:
      "Secure, encrypted medical record sharing with granular access controls.",
    features: ["HIPAA compliant", "End-to-end encryption", "Audit trail"],
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Care Coordination",
    description:
      "Real-time communication between healthcare teams for better patient outcomes.",
    features: ["Secure messaging", "Video consultations", "Team collaboration"],
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Analytics & Insights",
    description:
      "Data-driven insights to optimize referral processes and patient care.",
    features: ["Performance metrics", "Trend analysis", "Quality reporting"],
    color: "bg-amber-500/10 text-amber-600",
  },
];

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Enterprise Security",
    description:
      "Bank-level encryption, HIPAA compliance, and SOC 2 certification.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Processing",
    description: "Reduce referral processing time from days to minutes.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Multi-Role Platform",
    description: "Tailored interfaces for doctors, nurses, and administrators.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 Availability",
    description:
      "Round-the-clock access for emergency cases and urgent referrals.",
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Real-time Updates",
    description: "Live tracking of referral status and patient transfers.",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Smart Routing",
    description:
      "AI-powered suggestions for optimal hospital and specialist matching.",
  },
];

const testimonials = [
  {
    name: "Dr. Amanuel Solomon",
    role: "Chief of Medicine, Metropolitan Hospital",
    content:
      "Reduced our referral processing time by 80%. The platform has revolutionized how we coordinate patient care.",
    avatar: "SC",
    color: "bg-blue-500/10",
  },
  {
    name: "Nurse Selamawit Bekele",
    role: "Emergency Department Lead",
    content:
      "The real-time updates and secure messaging have transformed our emergency response coordination.",
    avatar: "MT",
    color: "bg-emerald-500/10",
  },
  {
    name: "Dr. Tewelde Gebremedhin",
    role: "Cardiology Specialist",
    content:
      "Finally, a platform that understands healthcare workflows. The secure document sharing is a game-changer.",
    avatar: "JW",
    color: "bg-purple-500/10",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      const role = user?.role as any;
      if (role === "SYSTEM_ADMIN" || role === "HOSPITAL_ADMIN") {
        router.push("/admin/analytics");
      } else if (role === "NURSE") {
        router.push("/tasks");
      } else {
        router.push("/referrals");
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-50/30 dark:to-gray-900/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Refero
                </span>
                <p className="text-xs text-muted-foreground">
                  Hospital Referral System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/contact-hospitals">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Contact Hospitals
                </Button>
              </Link>
              {user ? (
                <Button onClick={handleGetStarted} className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleGetStarted} className="gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </nav>

          {/* Hero Content */}
          <div className="py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                <Sparkles className="h-3 w-3 mr-2" />
                Trusted by Leading Healthcare Providers
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="block">Streamline</span>
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Hospital Referrals
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                A secure, HIPAA-compliant platform connecting healthcare
                providers for efficient patient transfers, real-time
                collaboration, and seamless medical record sharing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="h-14 px-8 text-lg gap-3"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/contact-hospitals")}
                  className="h-14 px-8 text-lg"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Contact Hospitals
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {heroData.stats.map((stat, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-6 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4",
                      "hover:shadow-lg hover:border-primary/30",
                    )}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for efficient hospital coordination and
              patient care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className={cn(
                  "group border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-xl",
                  "hover:-translate-y-1",
                )}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`inline-flex p-3 rounded-xl ${service.color} mb-4`}
                  >
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Enterprise-Grade Features
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Built for Modern Healthcare
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Designed with input from healthcare professionals to address
                real-world challenges in patient referral and care coordination.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20" />
                <img
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80"
                  alt="Healthcare professionals using Refero platform"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Instant</div>
                    <div className="text-sm text-muted-foreground">
                      Notifications
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-background border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-muted-foreground">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              See how hospitals are transforming their referral processes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center ${testimonial.color} font-bold`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-none bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/5">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Modernize Your Referral Process?
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  Join hundreds of healthcare providers using Refero for secure,
                  efficient patient care coordination.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="h-14 px-8 text-lg gap-3"
                  >
                    {user ? "Go to Dashboard" : "Start Free Trial"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/contact-hospitals")}
                    className="h-14 px-8 text-lg"
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    Contact Hospitals
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  No credit card required • HIPAA compliant
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Refero</span>
                <p className="text-sm text-muted-foreground">
                  Hospital Referral System
                </p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Refero. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              HIPAA compliant • SOC 2 certified • End-to-end encrypted
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
