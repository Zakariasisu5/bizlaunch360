
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
  CheckCircle
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: 'AI Business Plan Generator',
      description: 'Create comprehensive business plans with AI assistance'
    },
    {
      icon: DollarSign,
      title: 'Finance & Invoicing',
      description: 'Manage invoices, track expenses, and accept payments'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Let customers book appointments online easily'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Organize and track all your customer relationships'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Monitor your business growth with detailed insights'
    },
    {
      icon: Sparkles,
      title: 'Smart Automation',
      description: 'Automate routine tasks and focus on growth'
    }
  ];

  const benefits = [
    'Complete business management solution',
    'AI-powered tools and insights',
    'Professional invoicing and payments',
    'Customer booking system',
    'Growth analytics and reporting',
    'Mobile-friendly interface'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-bizPrimary mr-2" />
              <span className="text-lg sm:text-2xl font-bold text-bizNeutral-900">BizLaunch360</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-bizNeutral-700 hover:text-bizPrimary text-sm sm:text-base px-2 sm:px-4">
                  Login
                </Button>
              </Link>
              <Link to="/login">
                <Button className="btn-primary text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Launch & Grow Your
              <span className="block">Business with AI</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              BizLaunch360 is your all-in-one business management platform. From AI-powered business plans 
              to customer management, we've got everything you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-white text-bizPrimary hover:bg-bizNeutral-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-soft hover:scale-105 transition-all duration-200">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bizNeutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-bizNeutral-600 max-w-2xl mx-auto px-4">
              Powerful tools designed to help entrepreneurs and business owners launch, manage, and grow their ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-6 sm:p-8 rounded-xl shadow-soft card-hover border border-bizNeutral-200"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-bizPrimary/10 rounded-xl mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-bizPrimary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-bizNeutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-bizNeutral-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-bizNeutral-900 mb-4 sm:mb-6">
                Why Choose BizLaunch360?
              </h2>
              <p className="text-base sm:text-lg text-bizNeutral-600 mb-6 sm:mb-8">
                We combine the power of artificial intelligence with intuitive design to create 
                the ultimate business management experience.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-bizSuccess mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-bizNeutral-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto btn-primary">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="bg-gradient-to-br from-bizPrimary/10 to-bizAccent/10 rounded-2xl p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-soft">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-bizSuccess mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-bizNeutral-900">$50K+</div>
                    <div className="text-xs sm:text-sm text-bizNeutral-600">Revenue Tracked</div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-soft">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-bizPrimary mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-bizNeutral-900">1,200+</div>
                    <div className="text-xs sm:text-sm text-bizNeutral-600">Customers Managed</div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-soft">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-bizAccent mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-bizNeutral-900">500+</div>
                    <div className="text-xs sm:text-sm text-bizNeutral-600">Appointments Booked</div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-soft">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-bizWarning mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-bizNeutral-900">95%</div>
                    <div className="text-xs sm:text-sm text-bizNeutral-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 px-4">
            Join thousands of entrepreneurs who are already growing with BizLaunch360.
          </p>
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto bg-white text-bizPrimary hover:bg-bizNeutral-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-soft hover:scale-105 transition-all duration-200">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bizNeutral-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-bizPrimary mr-2" />
              <span className="text-base sm:text-lg font-semibold">BizLaunch360</span>
            </div>
            <div className="text-xs sm:text-sm text-bizNeutral-400">
              © 2024 BizLaunch360. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
