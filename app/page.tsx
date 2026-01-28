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
  CheckCircle,
  Shield,
  Zap,
  BarChart,
  Users,
  Clock,
  FileText,
  MessageSquare,
  Lock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80",
    title: "Secure Hospital Referral System",
    description:
      "Streamline patient referrals and share medical records securely across healthcare facilities in real-time.",
  },
  {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
    title: "Connected Healthcare Network",
    description:
      "Join a network of 500+ hospitals sharing patient data securely and efficiently.",
  },
  {
    url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
    title: "Real-time Collaboration",
    description:
      "Enable doctors and nurses to communicate and collaborate on patient care instantly.",
  },
];

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Referrals",
    description:
      "Submit and process patient referrals in minutes instead of days with our streamlined workflow.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "HIPAA Compliant",
    description:
      "Enterprise-grade security with end-to-end encryption and compliance with healthcare regulations.",
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description:
      "Track referral metrics, patient outcomes, and hospital performance with real-time analytics.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Multi-role Access",
    description:
      "Role-based access for doctors, nurses, administrators, and hospital staff with appropriate permissions.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-time Updates",
    description:
      "Get instant notifications on referral status, patient transfers, and medical record updates.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Digital Records",
    description:
      "Convert paper-based medical records to secure digital format with easy search and retrieval.",
  },
];

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer, City General Hospital",
    content:
      "Refero has reduced our referral processing time by 70%. Patient transfers that used to take days now happen in hours.",
  },
  {
    name: "Michael Chen",
    role: "IT Director, Regional Health Network",
    content:
      "The security features give us peace of mind. End-to-end encryption ensures patient data is always protected.",
  },
  {
    name: "Nurse Emma Rodriguez",
    role: "Emergency Department, Memorial Hospital",
    content:
      "The real-time messaging and status updates have revolutionized how we coordinate emergency patient transfers.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === currentSlide ? "opacity-100" : "opacity-0",
              )}
            >
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-900/80" />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Refero</span>
              <Badge
                variant="secondary"
                className="ml-2 bg-white/20 text-white backdrop-blur-sm"
              >
                new
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={handleGetStarted} variant="secondary">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
              Trusted by 500+ Hospitals
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Revolutionizing
              <span className="block text-blue-200">Hospital Referrals</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl">
              A secure, HIPAA-compliant platform that connects healthcare
              providers for seamless patient referrals, real-time collaboration,
              and efficient medical record sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={handleGetStarted}
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Everything you need for
              <span className="text-primary"> seamless referrals</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform combines security, efficiency, and collaboration
              tools designed specifically for healthcare professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/40 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Lock className="mr-2 h-3 w-3" />
                Enterprise Security
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Your patients&apos; data is
                <span className="text-primary"> always protected</span>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>HIPAA & GDPR compliant with end-to-end encryption</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Role-based access control with audit trails</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>SOC 2 Type II certified infrastructure</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automatic data retention and deletion policies</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80"
                  alt="Security dashboard showing encrypted data"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background border border-border rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-primary">99.99%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
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
              Trusted by healthcare leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              See what hospitals and medical professionals are saying about
              Refero.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/40">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
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
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your referral process?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join hundreds of hospitals already using Refero to improve patient
            care and streamline operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={handleGetStarted}
            >
              {user ? "Go to Dashboard" : "Start Now"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Refero</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure hospital referral system connecting healthcare providers
                for better patient care.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-primary">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-primary">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/hipaa" className="hover:text-primary">
                    HIPAA Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/gdpr" className="hover:text-primary">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Refero. All rights reserved.
            </p>
            <p className="mt-2">
              Designed for healthcare professionals by healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
