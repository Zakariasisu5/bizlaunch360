
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Save, 
  Edit3, 
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Lightbulb,
  FolderOpen,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { generateBusinessPlanPDF } from '@/utils/pdfGenerator';
import { saveBusinessPlan, loadBusinessPlans, deleteBusinessPlan, loadBusinessPlan, BusinessPlanData } from '@/utils/businessPlanStorage';
import { useToast } from '@/hooks/use-toast';

const BusinessPlan = () => {
  const { toast: showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<BusinessPlanData[]>([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planData, setPlanData] = useState<BusinessPlanData>({
    executiveSummary: '',
    businessDescription: '',
    marketAnalysis: '',
    organization: '',
    products: '',
    marketing: '',
    funding: '',
    financials: ''
  });

  const steps = [
    { id: 1, title: 'Business Overview', icon: Target },
    { id: 2, title: 'Market Analysis', icon: Users },
    { id: 3, title: 'Financial Planning', icon: DollarSign },
    { id: 4, title: 'Strategy & Growth', icon: TrendingUp }
  ];

  // Load saved plans on component mount
  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const plans = await loadBusinessPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading saved plans:', error);
      showToast({
        title: "Error",
        description: "Failed to load saved business plans",
        variant: "destructive"
      });
    }
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPlanData({
      executiveSummary: `Our technology consulting firm aims to bridge the gap between complex technical solutions and business needs. We provide strategic technology guidance, implementation services, and ongoing support to help businesses leverage technology for growth and efficiency.

Key Success Factors:
• Deep technical expertise combined with business acumen
• Proven track record of successful implementations
• Strong client relationships and referral network
• Agile methodology and rapid delivery capabilities`,
      
      businessDescription: `TechSolutions Pro is a boutique technology consulting firm specializing in digital transformation, cloud migration, and custom software development. Founded in 2024, we serve small to medium-sized businesses looking to modernize their operations and gain competitive advantages through technology.

Our Services:
• Strategic Technology Planning
• Cloud Infrastructure Design & Migration  
• Custom Software Development
• Digital Process Automation
• Technology Training & Support

Target Market: SMBs with 10-500 employees across various industries seeking to modernize their technology stack and improve operational efficiency.`,

      marketAnalysis: `Market Size: The global IT consulting market is valued at $530 billion and growing at 6.1% annually.

Target Market Analysis:
• Primary: SMBs in healthcare, finance, and retail sectors
• Secondary: Startups needing technical co-founding support
• Market Gap: Affordable, high-quality consulting for mid-market companies

Competitive Landscape:
• Large firms (Deloitte, Accenture): High cost, less personal
• Freelancers: Limited scope, reliability concerns  
• Our Advantage: Boutique service quality with competitive pricing

Market Trends:
• Increased demand for cloud migration (40% growth)
• Focus on cybersecurity and compliance
• Remote work technology needs`,

      organization: `Leadership Team:
• CEO/Founder: Technology strategy and client relations
• CTO: Technical architecture and implementation oversight
• Lead Developer: Software development and mentoring
• Business Development Manager: Sales and partnerships

Organizational Structure:
• Flat structure promoting collaboration
• Project-based teams with cross-functional skills
• Quarterly all-hands for alignment and growth planning
• Continuous learning and certification programs

Key Personnel Needs:
• Senior cloud architect (Year 1)
• Additional developers (Years 2-3)
• Sales representatives (Year 2)`,

      products: `Core Service Offerings:

1. Technology Strategy Consulting ($150/hour)
   • Technology audits and assessments
   • Digital transformation roadmaps
   • Vendor selection and negotiation

2. Implementation Services ($125/hour)
   • Cloud migration projects
   • Custom software development
   • System integration and APIs

3. Ongoing Support Packages ($2,500-$10,000/month)
   • Managed cloud services
   • Help desk and technical support
   • Monitoring and maintenance

4. Training and Workshops ($1,500/day)
   • Team training on new technologies
   • Best practices workshops
   • Technology leadership development`,

      marketing: `Marketing Strategy:

Digital Marketing:
• Content marketing (blog, whitepapers, case studies)
• LinkedIn and industry publication presence
• Search engine optimization for key terms
• Webinar series on technology trends

Relationship Building:
• Industry networking events and conferences
• Strategic partnerships with complementary firms
• Referral program for existing clients
• Speaking engagements at business events

Sales Process:
• Initial consultation (free 1-hour assessment)
• Proposal with detailed scope and timeline
• Phased implementation approach
• Regular check-ins and success measurement

Client Retention:
• Quarterly business reviews
• Proactive technology recommendations
• Loyalty program with preferred pricing`,

      funding: `Funding Requirements: $75,000

Startup Costs:
• Equipment and software: $15,000
• Office setup and deposits: $20,000
• Initial marketing and branding: $10,000
• Legal and professional fees: $5,000
• Working capital: $25,000

Funding Sources:
• Personal investment: $30,000 (40%)
• Small business loan: $25,000 (33%)
• Angel investor: $20,000 (27%)

Use of Funds:
• 60% - Operations and working capital
• 20% - Marketing and business development
• 15% - Equipment and technology
• 5% - Legal and professional services`,

      financials: `Financial Projections (3-Year):

Year 1:
• Revenue: $180,000
• Expenses: $150,000
• Net Profit: $30,000 (17% margin)
• Clients: 15 active clients

Year 2:
• Revenue: $320,000
• Expenses: $240,000
• Net Profit: $80,000 (25% margin)
• Clients: 25 active clients

Year 3:
• Revenue: $500,000
• Expenses: $350,000
• Net Profit: $150,000 (30% margin)
• Clients: 35 active clients

Key Assumptions:
• Average project value: $12,000
• Monthly recurring revenue growth: 15%
• Client retention rate: 85%
• Billable hours per month: 120-150

Break-even Analysis:
• Fixed costs: $8,000/month
• Variable costs: 60% of revenue
• Break-even point: $20,000/month (Month 6)`
    });
    
    setIsGenerating(false);
    toast.success('AI business plan generated successfully!');
  };

  const handleSave = async () => {
    if (!planTitle.trim()) {
      showToast({
        title: "Title Required",
        description: "Please enter a title for your business plan",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const planToSave = {
        ...planData,
        id: currentPlanId || undefined,
        title: planTitle.trim()
      };

      const savedPlan = await saveBusinessPlan(planToSave);
      setCurrentPlanId(savedPlan.id!);
      
      showToast({
        title: "Success",
        description: "Business plan saved successfully!",
        variant: "default"
      });
      
      await loadSavedPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      showToast({
        title: "Error",
        description: "Failed to save business plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!planTitle.trim()) {
      showToast({
        title: "Title Required",
        description: "Please enter a title before generating PDF",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await generateBusinessPlanPDF({
        ...planData,
        title: planTitle
      });
      
      showToast({
        title: "Success",
        description: "PDF generated and downloaded successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleLoadPlan = async (planId: string) => {
    try {
      const plan = await loadBusinessPlan(planId);
      setPlanData(plan);
      setPlanTitle(plan.title || '');
      setCurrentPlanId(plan.id!);
      setShowSavedPlans(false);
      
      showToast({
        title: "Success",
        description: "Business plan loaded successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error loading plan:', error);
      showToast({
        title: "Error",
        description: "Failed to load business plan",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deleteBusinessPlan(planId);
      await loadSavedPlans();
      
      if (currentPlanId === planId) {
        setCurrentPlanId(null);
        setPlanTitle('');
        setPlanData({
          executiveSummary: '',
          businessDescription: '',
          marketAnalysis: '',
          organization: '',
          products: '',
          marketing: '',
          funding: '',
          financials: ''
        });
      }
      
      showToast({
        title: "Success",
        description: "Business plan deleted successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      showToast({
        title: "Error",
        description: "Failed to delete business plan",
        variant: "destructive"
      });
    }
  };

  const handleNewPlan = () => {
    setCurrentPlanId(null);
    setPlanTitle('');
    setPlanData({
      executiveSummary: '',
      businessDescription: '',
      marketAnalysis: '',
      organization: '',
      products: '',
      marketing: '',
      funding: '',
      financials: ''
    });
    setCurrentStep(1);
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-bizNeutral-900">Business Plan Generator</h1>
            <p className="text-bizNeutral-600 mt-2 text-sm md:text-base">Create a comprehensive business plan with AI assistance</p>
          </div>
          
          {/* Action Buttons - Mobile First */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <Dialog open={showSavedPlans} onOpenChange={setShowSavedPlans}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Load Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Saved Business Plans</DialogTitle>
                  <DialogDescription>
                    Load or manage your saved business plans
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {savedPlans.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No saved business plans yet</p>
                  ) : (
                    savedPlans.map((plan) => (
                      <div key={plan.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{plan.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            Updated: {new Date(plan.updatedAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadPlan(plan.id!)}
                            className="flex-1 sm:flex-none"
                          >
                            Load
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id!)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleNewPlan} className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              New Plan
            </Button>
            
            <Button variant="outline" onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            
            <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="w-full sm:w-auto btn-primary">
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* Plan Title Input */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="planTitle">Business Plan Title</Label>
              <Input
                id="planTitle"
                placeholder="Enter a title for your business plan..."
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Generator Card */}
        <Card className="gradient-card border-2 border-bizPrimary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-bizPrimary mr-2" />
              AI Business Plan Generator
            </CardTitle>
            <CardDescription>
              Let our AI create a comprehensive business plan tailored to your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="btn-primary"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Business Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
            {isGenerating && (
              <div className="mt-4">
                <Progress value={66} className="w-full" />
                <p className="text-sm text-bizNeutral-600 mt-2">
                  Analyzing your business data and market trends...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Plan Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          {/* Navigation - Mobile Horizontal Scroll */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Plan Sections</CardTitle>
                <Progress value={progressPercentage} className="w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <Button
                        key={step.id}
                        variant={currentStep === step.id ? "default" : "ghost"}
                        className="flex-shrink-0 lg:flex-shrink lg:w-full lg:justify-start whitespace-nowrap lg:whitespace-normal"
                        onClick={() => setCurrentStep(step.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline lg:inline">{step.title}</span>
                        <span className="sm:hidden lg:hidden">{step.id}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content - Always visible, better mobile spacing */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs value="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit Plan</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="mt-6 space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Executive Summary</CardTitle>
                        <CardDescription className="text-sm">A brief overview of your business concept and key success factors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your business concept, mission, and key success factors..."
                          value={planData.executiveSummary}
                          onChange={(e) => setPlanData({ ...planData, executiveSummary: e.target.value })}
                          rows={6}
                          className="min-h-[120px] text-sm"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Business Description</CardTitle>
                        <CardDescription className="text-sm">Detailed description of your business, products, and services</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Provide detailed information about your business, what you offer, and your target market..."
                          value={planData.businessDescription}
                          onChange={(e) => setPlanData({ ...planData, businessDescription: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Market Analysis</CardTitle>
                        <CardDescription className="text-sm">Analysis of your target market, competition, and industry trends</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Analyze your target market, competitors, market size, and industry trends..."
                          value={planData.marketAnalysis}
                          onChange={(e) => setPlanData({ ...planData, marketAnalysis: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Organization & Management</CardTitle>
                        <CardDescription className="text-sm">Your organizational structure and key team members</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your organizational structure, key team members, and their roles..."
                          value={planData.organization}
                          onChange={(e) => setPlanData({ ...planData, organization: e.target.value })}
                          rows={6}
                          className="min-h-[120px] text-sm"
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Funding Request</CardTitle>
                        <CardDescription className="text-sm">Your funding requirements and how you plan to use the funds</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your funding needs, sources, and planned use of funds..."
                          value={planData.funding}
                          onChange={(e) => setPlanData({ ...planData, funding: e.target.value })}
                          rows={6}
                          className="min-h-[120px] text-sm"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Financial Projections</CardTitle>
                        <CardDescription className="text-sm">Revenue forecasts, expense projections, and profitability analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Include revenue projections, expense forecasts, break-even analysis, and cash flow statements..."
                          value={planData.financials}
                          onChange={(e) => setPlanData({ ...planData, financials: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Products & Services</CardTitle>
                        <CardDescription className="text-sm">Detailed description of your offerings and pricing strategy</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your products or services, pricing strategy, and competitive advantages..."
                          value={planData.products}
                          onChange={(e) => setPlanData({ ...planData, products: e.target.value })}
                          rows={6}
                          className="min-h-[120px] text-sm"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Marketing & Sales Strategy</CardTitle>
                        <CardDescription className="text-sm">How you plan to attract and retain customers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Outline your marketing strategy, sales process, and customer acquisition plans..."
                          value={planData.marketing}
                          onChange={(e) => setPlanData({ ...planData, marketing: e.target.value })}
                          rows={6}
                          className="min-h-[120px] text-sm"
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Navigation Buttons - Better mobile layout */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={currentStep === 4}
                    className="w-full sm:w-auto btn-primary order-1 sm:order-2"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Business Plan Preview</CardTitle>
                    <CardDescription className="text-sm">Review your complete business plan</CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-sm sm:prose max-w-none">
                    <div className="space-y-6 sm:space-y-8">
                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Executive Summary</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.executiveSummary || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Business Description</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.businessDescription || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Market Analysis</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.marketAnalysis || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Organization & Management</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.organization || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Products & Services</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.products || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Marketing & Sales</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.marketing || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Funding Request</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.funding || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-lg sm:text-xl font-bold text-bizNeutral-900 mb-3 sm:mb-4">Financial Projections</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700 text-sm sm:text-base leading-relaxed">
                          {planData.financials || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPlan;
