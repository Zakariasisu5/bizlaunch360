import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  ArrowRight,
  CheckCircle,
  Play,
  TrendingUp,
  Heart,
  Coffee
} from 'lucide-react';
import ProductTour from '@/components/landing/ProductTour';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import ScrollReveal from '@/components/landing/ScrollReveal';
import StreamingChatbot from '@/components/StreamingChatbot';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg shadow-primary/25">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground">
                BizLaunch<span className="text-primary">360</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-6 py-2 text-sm sm:text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
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
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          {/* Friendly intro badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 animate-fade-in">
            <Coffee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Built for real entrepreneurs, not just spreadsheets</span>
          </div>
          
          {/* Main Headline - more conversational */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Stop juggling tools.
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-primary via-primary/80 to-indigo-500 bg-clip-text text-transparent">
              Start growing.
            </span>
          </h1>
          
          {/* Subheadline - human and direct */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed animate-fade-in px-2" style={{ animationDelay: '0.2s' }}>
            Business plans, invoices, appointments, customers — we put everything in one place so you can focus on what you actually love doing.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.3s' }}>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
                <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Try it free
              </Button>
            </Link>
            <ProductTour
              trigger={
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-accent text-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  See how it works
                </Button>
              }
            />
          </div>
          
          {/* Simple reassurance - feels human */}
          <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
            No credit card needed • Takes 2 minutes to set up
          </p>
        </div>
        
        {/* Scroll indicator - hidden on small screens */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal delay={100}>
        <FAQ />
      </ScrollReveal>

      {/* CTA Section - more conversational */}
      <ScrollReveal delay={150}>
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-indigo-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          
          <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground/80" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
              Your business deserves better than chaos
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
              We built this because we were tired of switching between 10 different apps. Maybe you are too?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-background text-primary hover:bg-background/90 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Get started for free
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-primary-foreground/70 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer - simple and clean */}
      <footer className="bg-card border-t border-border py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-card-foreground">BizLaunch360</span>
            </div>
            <div className="flex items-center gap-6 text-xs sm:text-sm text-muted-foreground">
              <span>© 2025 BizLaunch360. Made with care.</span>
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
