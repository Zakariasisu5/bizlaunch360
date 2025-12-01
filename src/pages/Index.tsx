import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  TrendingUp
} from 'lucide-react';
import VideoDemo from '@/components/VideoDemo';
import StreamingChatbot from '@/components/StreamingChatbot';
import { ThemeToggle } from '@/components/ThemeToggle';

const features = [
  {
    icon: FileText,
    title: 'AI Business Plan Generator',
    description: 'Create comprehensive business plans with AI assistance',
    color: 'bg-primary'
  },
  {
    icon: DollarSign,
    title: 'Finance & Invoicing',
    description: 'Manage invoices, track expenses, and accept payments',
    color: 'bg-emerald-500'
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description: 'Let customers book appointments online easily',
    color: 'bg-indigo-500'
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Organize and track all your customer relationships',
    color: 'bg-purple-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Monitor your business growth with detailed insights',
    color: 'bg-primary/80'
  },
  {
    icon: Sparkles,
    title: 'Smart Automation',
    description: 'Automate routine tasks and focus on growth',
    color: 'bg-cyan-500'
  }
];

const stats = [
  { label: 'Revenue Tracked', value: '$50K+', color: 'bg-emerald-500', icon: DollarSign },
  { label: 'Customers Managed', value: '1,200+', color: 'bg-primary', icon: Users },
  { label: 'Appointments Booked', value: '500+', color: 'bg-indigo-500', icon: Calendar },
  { label: 'Success Rate', value: '95%', color: 'bg-purple-500', icon: Trophy }
];

const Index = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                BizLaunch<span className="text-primary">360</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary text-sm sm:text-base px-2 sm:px-4">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative py-12 sm:py-20 overflow-hidden min-h-[80vh] flex items-center">
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
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-background/70 dark:bg-background/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                Welcome to Your
                <span className="block text-primary">Business Success!</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Launch, manage, and grow your business with our AI-powered platform. 
                Everything you need in one beautiful dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                </Link>
                <VideoDemo
                  trigger={
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto border-border bg-background hover:bg-accent text-primary px-8 py-4 text-lg rounded-xl transition-all duration-200"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Right side - Dashboard Preview */}
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-card-foreground">Welcome, John!</h3>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Main Action Card */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 mb-6 text-primary-foreground">
                  <div className="flex items-center">
                    <Rocket className="w-8 h-8 mr-4" />
                    <div>
                      <h4 className="text-lg font-semibold">Create a Business Plan</h4>
                      <p className="text-primary-foreground/80">Generate a custom business plan</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-500 rounded-xl p-4 text-white">
                    <div className="text-2xl font-bold">$2,500</div>
                    <div className="text-emerald-100">Income</div>
                  </div>
                  <div className="bg-primary/80 rounded-xl p-4 text-primary-foreground">
                    <div className="text-2xl font-bold">$1,200</div>
                    <div className="text-primary-foreground/80">Expenses</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-500 rounded-xl p-4 text-white">
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 mr-2" />
                      <div>
                        <div className="text-xl font-bold">15</div>
                        <div className="text-indigo-100 text-sm">Bookings</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-500 rounded-xl p-4 text-white">
                    <div className="flex items-center">
                      <Trophy className="w-6 h-6 mr-2" />
                      <div>
                        <div className="text-xl font-bold">Top</div>
                        <div className="text-purple-100 text-sm">Customer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our platform has helped entrepreneurs achieve
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-background rounded-xl p-6 shadow-lg border border-border text-center hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help entrepreneurs launch, manage, and grow their ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Join thousands of entrepreneurs who are already growing with BizLaunch360.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <TrendingUp className="mr-2 h-5 w-5" />
              Start Your Success Story
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center mr-2">
                <Rocket className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-card-foreground">BizLaunch360</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 BizLaunch360. All rights reserved.
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