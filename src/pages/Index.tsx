import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  FileText, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
  Trophy,
  TrendingUp,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import ProductTour from '@/components/landing/ProductTour';
import Testimonials from '@/components/landing/Testimonials';
import StreamingChatbot from '@/components/StreamingChatbot';
import { ThemeToggle } from '@/components/ThemeToggle';

const features = [
  {
    icon: FileText,
    title: 'AI Business Plan Generator',
    description: 'Create comprehensive, investor-ready business plans with smart AI assistance in minutes',
    color: 'bg-primary'
  },
  {
    icon: DollarSign,
    title: 'Finance & Invoicing',
    description: 'Manage invoices, track expenses, and monitor cash flow with powerful financial tools',
    color: 'bg-emerald-500'
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description: 'Let customers book appointments 24/7 with automated scheduling and reminders',
    color: 'bg-indigo-500'
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Build lasting relationships with integrated CRM and customer tracking',
    color: 'bg-purple-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Make data-driven decisions with real-time insights and growth metrics',
    color: 'bg-amber-500'
  },
  {
    icon: Sparkles,
    title: 'Smart Automation',
    description: 'Save hours every week by automating routine tasks and workflows',
    color: 'bg-cyan-500'
  }
];

const stats = [
  { label: 'Revenue Tracked', value: '$50K+', color: 'bg-emerald-500', icon: DollarSign },
  { label: 'Active Users', value: '1,200+', color: 'bg-primary', icon: Users },
  { label: 'Appointments Booked', value: '500+', color: 'bg-indigo-500', icon: Calendar },
  { label: 'Success Rate', value: '95%', color: 'bg-purple-500', icon: Trophy }
];

const trustBadges = [
  { icon: Shield, text: 'Bank-Level Security' },
  { icon: Zap, text: 'Lightning Fast' },
  { icon: Star, text: '5-Star Rated' }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary/25">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                BizLaunch<span className="text-primary">360</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Business Management</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Launch & Scale Your
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-indigo-500 bg-clip-text text-transparent">
              Business Faster
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            From business plans to customer management, invoicing to appointments — everything you need to run a successful business in one powerful platform.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
                <Rocket className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <ProductTour
              trigger={
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-accent text-foreground px-8 py-6 text-lg font-semibold rounded-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Take a Tour
                </Button>
              }
            />
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are already scaling their businesses with BizLaunch360
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group bg-background rounded-2xl p-8 shadow-lg border border-border text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help entrepreneurs launch, manage, and grow their ventures with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-indigo-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs who are already growing with BizLaunch360. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto bg-background text-primary hover:bg-background/90 px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Your Success Story
              </Button>
            </Link>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-8 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center mr-3">
                <Rocket className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-card-foreground">BizLaunch360</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 BizLaunch360. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Streaming Chatbot */}
      <StreamingChatbot />
    </div>
  );
};

export default Index;
