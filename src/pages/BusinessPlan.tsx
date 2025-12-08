import React, { useState, useEffect, useMemo } from 'react';
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
  Target,
  DollarSign,
  Users,
  TrendingUp,
  FolderOpen,
  Trash2,
  LogIn,
  Link,
  Building2,
  AlertCircle,
  BarChart3,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { generateBusinessPlanPDF } from '@/utils/pdfGenerator';
import { saveBusinessPlan, loadBusinessPlans, deleteBusinessPlan, loadBusinessPlan, BusinessPlanData } from '@/utils/businessPlanStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BusinessPlanAIAssistant from '@/components/BusinessPlanAIAssistant';
import BusinessPlanCharts, { FinancialData } from '@/components/BusinessPlanCharts';
import BusinessPlanVisuals from '@/components/BusinessPlanVisuals';
import BusinessPlanTemplates, { IndustryTemplate } from '@/components/BusinessPlanTemplates';
import { extractFinancialData } from '@/utils/financialDataExtractor';

interface BusinessInfo {
  business_name: string;
  business_type: string;
  business_description: string | null;
  business_address: string;
  business_email: string;
  business_phone: string;
  business_website: string | null;
}

const BusinessPlan = () => {
  const { toast: showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<BusinessPlanData[]>([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [planTitle, setPlanTitle] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
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
    { id: 1, title: 'Business Overview', icon: Target, description: 'Executive summary and business description' },
    { id: 2, title: 'Market Analysis', icon: Users, description: 'Market research and organization structure' },
    { id: 3, title: 'Financial Planning', icon: DollarSign, description: 'Funding requirements and projections' },
    { id: 4, title: 'Strategy & Growth', icon: TrendingUp, description: 'Products, marketing, and growth plans' }
  ];

  // Check authentication and load business info on mount
  useEffect(() => {
    checkAuthAndLoadBusiness();
  }, []);

  // Load saved plans only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedPlans();
    }
  }, [isAuthenticated]);

  const checkAuthAndLoadBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        // Fetch business info for AI context
        const { data: business } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (business) {
          setBusinessInfo(business);
          // Auto-fill plan title with business name if not set
          if (!planTitle && business.business_name) {
            setPlanTitle(`${business.business_name} Business Plan`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const loadSavedPlans = async () => {
    if (!isAuthenticated) return;
    
    try {
      const plans = await loadBusinessPlans();
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading saved plans:', error);
      if (error instanceof Error && !error.message.includes('authenticated')) {
        showToast({
          title: "Error",
          description: "Failed to load saved business plans",
          variant: "destructive"
        });
      }
    }
  };

  const handleGenerateWithAI = async () => {
    if (!planTitle.trim()) {
      showToast({
        title: "Title Required",
        description: "Please enter a title so AI can tailor your plan",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-business-plan', {
        body: {
          title: planTitle.trim(),
          context: planData,
          businessInfo: businessInfo, // Pass business context
        },
      });

      if (error) {
        throw error;
      }

      const aiPlan = (data as any)?.plan;
      if (!aiPlan) {
        throw new Error('No plan returned from AI');
      }

      setPlanData({
        executiveSummary: aiPlan.executiveSummary || '',
        businessDescription: aiPlan.businessDescription || '',
        marketAnalysis: aiPlan.marketAnalysis || '',
        organization: aiPlan.organization || '',
        products: aiPlan.products || '',
        marketing: aiPlan.marketing || '',
        funding: aiPlan.funding || '',
        financials: aiPlan.financials || '',
      });

      toast.success('AI business plan generated successfully!');
    } catch (err: any) {
      console.error('AI generation error:', err);
      let errorMessage = 'Unable to generate content. Please try again.';
      if (err?.message?.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (err?.message?.includes('402') || err?.message?.includes('credits')) {
        errorMessage = 'AI usage limit reached. Please add credits to continue.';
      }
      showToast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
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
        handleNewPlan();
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
        description: "Failed to delete business plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = async () => {
    if (!currentPlanId) {
      showToast({
        title: "No Plan Selected",
        description: "Please save the plan first to generate a shareable link",
        variant: "destructive"
      });
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/business-plan/share/${currentPlanId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      showToast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error copying link:', error);
      showToast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNewPlan = () => {
    setCurrentPlanId(null);
    setPlanTitle(businessInfo?.business_name ? `${businessInfo.business_name} Business Plan` : '');
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Business Plan Generator</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Create a comprehensive, investor-ready business plan with AI assistance</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <Dialog open={showSavedPlans} onOpenChange={setShowSavedPlans}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto" 
                  disabled={!isAuthenticated}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Load Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Saved Business Plans</DialogTitle>
                  <DialogDescription>
                    {isAuthenticated ? 
                      "Load or manage your saved business plans" :
                      "Sign in to access your saved business plans"
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {!isAuthenticated ? (
                    <div className="text-center py-8 space-y-4">
                      <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Please sign in to save and load business plans</p>
                        <Button variant="outline" className="mt-3" onClick={() => setShowSavedPlans(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : savedPlans.length === 0 ? (
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
            
            <BusinessPlanTemplates 
              onSelectTemplate={(template: IndustryTemplate) => {
                setPlanTitle(template.name + ' Business Plan');
                setPlanData({
                  executiveSummary: template.executiveSummary,
                  businessDescription: template.businessDescription,
                  marketAnalysis: template.marketAnalysis,
                  organization: template.organization,
                  products: template.products,
                  marketing: template.marketing,
                  funding: template.funding,
                  financials: template.financials,
                });
                setCurrentPlanId(null);
                toast.success(`${template.name} template loaded!`);
              }}
            />
            
            <Button 
              variant="outline" 
              onClick={handleSave} 
              disabled={isSaving || !isAuthenticated} 
              className="w-full sm:w-auto"
              title={!isAuthenticated ? "Sign in to save business plans" : ""}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button 
              variant="outline" 
              onClick={handleCopyLink} 
              disabled={!currentPlanId || !isAuthenticated}
              className="w-full sm:w-auto"
              title={!currentPlanId ? "Save the plan first to get a shareable link" : !isAuthenticated ? "Sign in to copy link" : ""}
            >
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            
            <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* Business Context Card */}
        {businessInfo && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">Your Business Context</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">AI will use this</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>{businessInfo.business_name}</strong> • {businessInfo.business_type}
                    {businessInfo.business_description && ` • ${businessInfo.business_description.substring(0, 100)}${businessInfo.business_description.length > 100 ? '...' : ''}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!businessInfo && isAuthenticated && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Complete Your Business Profile</p>
                  <p className="text-sm text-amber-700">
                    Add your business information in Settings to get more personalized AI-generated content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              AI Business Plan Generator
            </CardTitle>
            <CardDescription>
              Generate a comprehensive, investor-ready business plan tailored to your business. 
              {businessInfo && ` AI will use your ${businessInfo.business_type} business profile for personalized content.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Comprehensive Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Complete Business Plan
                </>
              )}
            </Button>
            {isGenerating && (
              <div className="mt-4">
                <Progress value={66} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Analyzing market data, financials, and creating your personalized business plan...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Plan Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Plan Sections</CardTitle>
                <Progress value={progressPercentage} className="w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
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

          {/* Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                        <CardDescription className="text-sm">
                          The most critical section - investors read this first. Include your mission, value proposition, and key highlights.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Describe your business concept, mission, unique value proposition, and key success factors..."
                          value={planData.executiveSummary}
                          onChange={(e) => setPlanData({ ...planData, executiveSummary: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="executiveSummary"
                          currentContent={planData.executiveSummary}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, executiveSummary: content })}
                          planTitle={planTitle}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Business Description</CardTitle>
                        <CardDescription className="text-sm">
                          Detail your business model, products/services, target market, and competitive advantages.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Provide detailed information about your business model, what you offer, revenue streams, and target market..."
                          value={planData.businessDescription}
                          onChange={(e) => setPlanData({ ...planData, businessDescription: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="businessDescription"
                          currentContent={planData.businessDescription}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, businessDescription: content })}
                          planTitle={planTitle}
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
                        <CardDescription className="text-sm">
                          Include TAM/SAM/SOM, competitor analysis, market trends, and SWOT analysis.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Analyze your target market size (TAM, SAM, SOM), competitors, market trends, and include a SWOT analysis..."
                          value={planData.marketAnalysis}
                          onChange={(e) => setPlanData({ ...planData, marketAnalysis: e.target.value })}
                          rows={10}
                          className="min-h-[200px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="marketAnalysis"
                          currentContent={planData.marketAnalysis}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, marketAnalysis: content })}
                          planTitle={planTitle}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Organization & Management</CardTitle>
                        <CardDescription className="text-sm">
                          Describe your team structure, key personnel, advisors, and company culture.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Describe your organizational structure, key team members with their experience, advisory board, and company culture..."
                          value={planData.organization}
                          onChange={(e) => setPlanData({ ...planData, organization: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="organization"
                          currentContent={planData.organization}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, organization: content })}
                          planTitle={planTitle}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Funding Requirements</CardTitle>
                        <CardDescription className="text-sm">
                          Detail your capital needs, use of funds, funding sources, and investor value proposition.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Describe your funding needs with specific amounts, how funds will be used, potential funding sources, and expected returns..."
                          value={planData.funding}
                          onChange={(e) => setPlanData({ ...planData, funding: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="funding"
                          currentContent={planData.funding}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, funding: content })}
                          planTitle={planTitle}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Financial Projections</CardTitle>
                        <CardDescription className="text-sm">
                          Provide 3-year projections, break-even analysis, key metrics (gross margin, CAC, LTV), and assumptions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Include 3-year revenue projections, expense forecasts, break-even analysis, key financial metrics, and clearly state your assumptions..."
                          value={planData.financials}
                          onChange={(e) => setPlanData({ ...planData, financials: e.target.value })}
                          rows={10}
                          className="min-h-[200px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="financials"
                          currentContent={planData.financials}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, financials: content })}
                          planTitle={planTitle}
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
                        <CardDescription className="text-sm">
                          Describe your offerings, pricing strategy, product roadmap, and differentiation.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Describe your products/services in detail, pricing strategy with justification, product roadmap, and competitive differentiation..."
                          value={planData.products}
                          onChange={(e) => setPlanData({ ...planData, products: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="products"
                          currentContent={planData.products}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, products: content })}
                          planTitle={planTitle}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Marketing & Sales Strategy</CardTitle>
                        <CardDescription className="text-sm">
                          Detail your marketing channels, customer acquisition strategy, sales funnel, and retention programs.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Outline your brand positioning, marketing channels, customer acquisition strategy with CAC, sales funnel, and retention programs..."
                          value={planData.marketing}
                          onChange={(e) => setPlanData({ ...planData, marketing: e.target.value })}
                          rows={8}
                          className="min-h-[160px] text-sm"
                        />
                        <BusinessPlanAIAssistant
                          section="marketing"
                          currentContent={planData.marketing}
                          onSuggestionGenerated={(content) => setPlanData({ ...planData, marketing: content })}
                          planTitle={planTitle}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Navigation Buttons */}
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
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-6 space-y-6">
                {/* Preview Sub-tabs */}
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="content" className="text-xs sm:text-sm">
                      <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="charts" className="text-xs sm:text-sm">
                      <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Charts</span>
                    </TabsTrigger>
                    <TabsTrigger value="visuals" className="text-xs sm:text-sm">
                      <Target className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Analysis</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Content Preview */}
                  <TabsContent value="content">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">Business Plan Content</CardTitle>
                        <CardDescription className="text-sm">Review your complete business plan before downloading</CardDescription>
                      </CardHeader>
                      <CardContent className="prose prose-sm sm:prose max-w-none">
                        <div className="space-y-6 sm:space-y-8">
                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Executive Summary</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.executiveSummary || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Business Description</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.businessDescription || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Market Analysis</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.marketAnalysis || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Organization & Management</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.organization || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Products & Services</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.products || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Marketing & Sales</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.marketing || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Funding Requirements</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.funding || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>

                          <section>
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Financial Projections</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {planData.financials || 'No content yet. Use the AI generator or edit manually.'}
                            </div>
                          </section>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Charts Preview */}
                  <TabsContent value="charts">
                    <div className="space-y-4">
                      <Card className="border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Financial Projections & Charts</CardTitle>
                          <CardDescription>Visual representation of your business financials</CardDescription>
                        </CardHeader>
                      </Card>
                      <BusinessPlanCharts financialData={extractFinancialData(planData)} />
                    </div>
                  </TabsContent>

                  {/* Visual Analysis */}
                  <TabsContent value="visuals">
                    <div className="space-y-4">
                      <Card className="border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Strategic Analysis & Milestones</CardTitle>
                          <CardDescription>SWOT analysis, competitive positioning, and business milestones</CardDescription>
                        </CardHeader>
                      </Card>
                      <BusinessPlanVisuals />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessPlan;
