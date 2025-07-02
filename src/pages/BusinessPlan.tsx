
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

const BusinessPlan = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planData, setPlanData] = useState({
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

  const handleSave = () => {
    // Save to localStorage or backend
    localStorage.setItem('businessPlan', JSON.stringify(planData));
    toast.success('Business plan saved successfully!');
  };

  const handleDownloadPDF = () => {
    // Generate and download PDF
    toast.success('PDF download started!');
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bizNeutral-900">Business Plan Generator</h1>
            <p className="text-bizNeutral-600 mt-2">Create a comprehensive business plan with AI assistance</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan Sections</CardTitle>
                <Progress value={progressPercentage} className="w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Button
                      key={step.id}
                      variant={currentStep === step.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {step.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Tabs value="edit" className="w-full">
              <TabsList>
                <TabsTrigger value="edit">Edit Plan</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Executive Summary</CardTitle>
                        <CardDescription>A brief overview of your business concept and key success factors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your business concept, mission, and key success factors..."
                          value={planData.executiveSummary}
                          onChange={(e) => setPlanData({ ...planData, executiveSummary: e.target.value })}
                          rows={8}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Business Description</CardTitle>
                        <CardDescription>Detailed description of your business, products, and services</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Provide detailed information about your business, what you offer, and your target market..."
                          value={planData.businessDescription}
                          onChange={(e) => setPlanData({ ...planData, businessDescription: e.target.value })}
                          rows={10}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Analysis</CardTitle>
                        <CardDescription>Analysis of your target market, competition, and industry trends</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Analyze your target market, competitors, market size, and industry trends..."
                          value={planData.marketAnalysis}
                          onChange={(e) => setPlanData({ ...planData, marketAnalysis: e.target.value })}
                          rows={10}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Organization & Management</CardTitle>
                        <CardDescription>Your organizational structure and key team members</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your organizational structure, key team members, and their roles..."
                          value={planData.organization}
                          onChange={(e) => setPlanData({ ...planData, organization: e.target.value })}
                          rows={8}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Funding Request</CardTitle>
                        <CardDescription>Your funding requirements and how you plan to use the funds</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your funding needs, sources, and planned use of funds..."
                          value={planData.funding}
                          onChange={(e) => setPlanData({ ...planData, funding: e.target.value })}
                          rows={8}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Projections</CardTitle>
                        <CardDescription>Revenue forecasts, expense projections, and profitability analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Include revenue projections, expense forecasts, break-even analysis, and cash flow statements..."
                          value={planData.financials}
                          onChange={(e) => setPlanData({ ...planData, financials: e.target.value })}
                          rows={10}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Products & Services</CardTitle>
                        <CardDescription>Detailed description of your offerings and pricing strategy</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Describe your products or services, pricing strategy, and competitive advantages..."
                          value={planData.products}
                          onChange={(e) => setPlanData({ ...planData, products: e.target.value })}
                          rows={8}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Marketing & Sales Strategy</CardTitle>
                        <CardDescription>How you plan to attract and retain customers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Outline your marketing strategy, sales process, and customer acquisition plans..."
                          value={planData.marketing}
                          onChange={(e) => setPlanData({ ...planData, marketing: e.target.value })}
                          rows={8}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={currentStep === 4}
                    className="btn-primary"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Plan Preview</CardTitle>
                    <CardDescription>Review your complete business plan</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <div className="space-y-8">
                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Executive Summary</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.executiveSummary || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Business Description</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.businessDescription || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Market Analysis</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.marketAnalysis || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Organization & Management</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.organization || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Products & Services</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.products || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Marketing & Sales</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.marketing || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Funding Request</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
                          {planData.funding || 'No content yet. Use the AI generator or edit manually.'}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold text-bizNeutral-900 mb-4">Financial Projections</h2>
                        <div className="whitespace-pre-wrap text-bizNeutral-700">
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
