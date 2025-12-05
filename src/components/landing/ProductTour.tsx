import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ProductTourProps {
  trigger: React.ReactNode;
}

const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 5200, expenses: 2800 },
  { month: 'Mar', revenue: 6800, expenses: 3200 },
  { month: 'Apr', revenue: 8500, expenses: 3600 },
  { month: 'May', revenue: 11200, expenses: 4100 },
  { month: 'Jun', revenue: 14800, expenses: 4800 },
];

const appointmentData = [
  { day: 'Mon', appointments: 8 },
  { day: 'Tue', appointments: 12 },
  { day: 'Wed', appointments: 15 },
  { day: 'Thu', appointments: 10 },
  { day: 'Fri', appointments: 18 },
  { day: 'Sat', appointments: 6 },
  { day: 'Sun', appointments: 3 },
];

const customerData = [
  { name: 'Active', value: 65, color: '#10b981' },
  { name: 'New', value: 25, color: '#6366f1' },
  { name: 'Returning', value: 10, color: '#f59e0b' },
];

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  color: string;
  chart?: 'revenue' | 'appointments' | 'customers';
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: 'AI Business Plan Generator',
    description: 'Create comprehensive, investor-ready business plans in minutes with our intelligent AI assistant. Simply answer a few questions and watch as AI crafts your complete business strategy.',
    icon: FileText,
    color: 'bg-primary',
    features: [
      'Executive summary generation',
      'Market analysis with real data',
      'Financial projections & forecasts',
      'Export to PDF instantly'
    ]
  },
  {
    id: 2,
    title: 'Finance & Invoicing',
    description: 'Track your revenue, manage expenses, and create professional invoices that get you paid faster. Our integrated financial tools give you complete visibility into your business health.',
    icon: DollarSign,
    color: 'bg-emerald-500',
    features: [
      'Professional invoice templates',
      'Expense tracking & categorization',
      'Revenue analytics & trends',
      'Stripe payment integration'
    ],
    chart: 'revenue'
  },
  {
    id: 3,
    title: 'Appointment Booking',
    description: 'Let customers book appointments 24/7 with our intuitive scheduling system. Automated reminders reduce no-shows and keep your calendar full.',
    icon: Calendar,
    color: 'bg-indigo-500',
    features: [
      '24/7 online booking',
      'Automated email reminders',
      'Calendar sync integration',
      'Custom availability settings'
    ],
    chart: 'appointments'
  },
  {
    id: 4,
    title: 'Customer Management',
    description: 'Build lasting relationships with integrated CRM and customer tracking. Know your customers better and deliver personalized experiences that drive loyalty.',
    icon: Users,
    color: 'bg-purple-500',
    features: [
      'Complete customer profiles',
      'Interaction history tracking',
      'Customer segmentation',
      'Notes & follow-up reminders'
    ],
    chart: 'customers'
  },
  {
    id: 5,
    title: 'Analytics Dashboard',
    description: 'Make data-driven decisions with real-time insights and growth metrics. See exactly how your business is performing at a glance.',
    icon: BarChart3,
    color: 'bg-amber-500',
    features: [
      'Real-time revenue tracking',
      'Customer acquisition metrics',
      'Appointment conversion rates',
      'Growth trend analysis'
    ],
    chart: 'revenue'
  },
  {
    id: 6,
    title: 'Smart Automation',
    description: 'Save hours every week by automating routine tasks and workflows. Focus on growing your business while BizLaunch360 handles the rest.',
    icon: Sparkles,
    color: 'bg-cyan-500',
    features: [
      'Automated invoice reminders',
      'Appointment confirmations',
      'Follow-up email sequences',
      'Task scheduling & alerts'
    ]
  }
];

const ProductTour: React.FC<ProductTourProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderChart = () => {
    switch (step.chart) {
      case 'revenue':
        return (
          <div className="h-36 sm:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} width={30} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      case 'appointments':
        return (
          <div className="h-36 sm:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} width={25} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="appointments" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'customers':
        return (
          <div className="h-36 sm:h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 sm:gap-2 ml-2">
              {customerData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-36 sm:h-48 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Icon className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">Interactive preview</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto bg-card border-border p-4 sm:p-6">
        <DialogTitle className="sr-only">BizLaunch360 Product Tour</DialogTitle>
        <DialogDescription className="sr-only">
          An interactive walkthrough of BizLaunch360 features including business planning, invoicing, appointments, CRM, analytics, and automation.
        </DialogDescription>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 sm:gap-2">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-6 sm:w-8 bg-primary' 
                      : index < currentStep 
                        ? 'w-1.5 sm:w-2 bg-primary/50' 
                        : 'w-1.5 sm:w-2 bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </span>
          </div>

          {/* Content area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left: Feature info */}
            <div className="space-y-3 sm:space-y-4">
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 ${step.color} rounded-xl sm:rounded-2xl`}>
                <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">{step.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              
              <ul className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Visual/Chart */}
            <div className="bg-muted/30 rounded-xl p-3 sm:p-4 relative overflow-hidden min-h-[180px] sm:min-h-[200px]">
              {renderChart()}
              
              {/* Decorative stats */}
              {step.chart === 'revenue' && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-card rounded-lg p-2 sm:p-3 shadow-lg border border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">+127%</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Revenue growth</p>
                </div>
              )}
              
              {step.chart === 'appointments' && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-card rounded-lg p-2 sm:p-3 shadow-lg border border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">72</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">This week</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 0}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
              size="sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            
            {currentStep === tourSteps.length - 1 ? (
              <Button onClick={() => setIsOpen(false)} className="gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-4" size="sm">
                Get Started
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-4" size="sm">
                Next
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTour;
