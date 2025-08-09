
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
  Trash2,
  LogIn,
  Copy,
  Link
} from 'lucide-react';
import { toast } from 'sonner';
import { generateBusinessPlanPDF } from '@/utils/pdfGenerator';
import { saveBusinessPlan, loadBusinessPlans, deleteBusinessPlan, loadBusinessPlan, BusinessPlanData } from '@/utils/businessPlanStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load saved plans only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedPlans();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
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
      // Don't show error toast for auth issues, just log
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
      showToast({
        title: 'Generation Failed',
        description: err?.message || 'Unable to generate content. Please try again.',
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
