import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Rocket, Building2, Phone, Globe, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
    businessDescription: ''
  });

  // Redirect if already completed onboarding
  useEffect(() => {
    if (!authLoading && user?.onboardingComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          business_type: formData.businessType,
          business_description: formData.businessDescription || null,
          business_address: formData.businessAddress,
          business_phone: formData.businessPhone,
          business_email: formData.businessEmail,
          business_website: formData.businessWebsite || null,
          onboarding_complete: true
        });

      if (error) throw error;
      
      toast({
        title: "Welcome to BizLaunch360!",
        description: "Your business profile has been set up successfully.",
      });
      
      // Force a page reload to refresh auth state with new business data
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName.trim() !== '' && formData.businessType.trim() !== '';
      case 2:
        return formData.businessAddress.trim() !== '' && formData.businessPhone.trim() !== '';
      case 3:
        return formData.businessEmail.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted font-montserrat font-bold">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-black text-foreground">
                BizLaunch<span className="text-primary">360</span>
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black text-foreground">Setup Your Business</h1>
            <span className="text-sm font-bold text-muted-foreground">Step {currentStep} of 3</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-black text-foreground">
              {currentStep === 1 && "Business Information"}
              {currentStep === 2 && "Contact Details"}
              {currentStep === 3 && "Additional Information"}
            </CardTitle>
            <CardDescription className="font-semibold text-muted-foreground">
              {currentStep === 1 && "Let's start with the basics about your business"}
              {currentStep === 2 && "How can customers reach you?"}
              {currentStep === 3 && "Almost done! Just a few more details"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Business Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-primary font-bold mb-4">
                  <Building2 className="h-5 w-5" />
                  <span>Business Basics</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="font-bold text-foreground">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter your business name"
                    className="font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType" className="font-bold text-foreground">Business Type *</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    placeholder="e.g., Restaurant, Consulting, E-commerce"
                    className="font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription" className="font-bold text-foreground">Business Description</Label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description of what your business does"
                    className="w-full p-3 border rounded-md font-semibold bg-background text-foreground border-input"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-primary font-bold mb-4">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="font-bold text-foreground">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your business address"
                    className="font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone" className="font-bold text-foreground">Phone Number *</Label>
                  <Input
                    id="businessPhone"
                    name="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    placeholder="Enter your business phone"
                    className="font-semibold"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-primary font-bold mb-4">
                  <Globe className="h-5 w-5" />
                  <span>Online Presence</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail" className="font-bold text-foreground">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your business email"
                    className="font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessWebsite" className="font-bold text-foreground">Website (Optional)</Label>
                  <Input
                    id="businessWebsite"
                    name="businessWebsite"
                    type="url"
                    value={formData.businessWebsite}
                    onChange={handleInputChange}
                    placeholder="https://yourbusiness.com"
                    className="font-semibold"
                  />
                </div>

                {/* Summary */}
                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="font-black text-foreground mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Business Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold"><span className="text-muted-foreground">Business:</span> {formData.businessName}</p>
                    <p className="font-bold"><span className="text-muted-foreground">Type:</span> {formData.businessType}</p>
                    <p className="font-bold"><span className="text-muted-foreground">Address:</span> {formData.businessAddress}</p>
                    <p className="font-bold"><span className="text-muted-foreground">Phone:</span> {formData.businessPhone}</p>
                    <p className="font-bold"><span className="text-muted-foreground">Email:</span> {formData.businessEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="font-bold"
              >
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="font-bold"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!isStepValid() || isLoading}
                  className="font-bold"
                >
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;