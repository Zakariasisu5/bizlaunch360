
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Building, Target, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessDescription: '',
    goals: '',
    monthlyRevenue: ''
  });

  const businessTypes = [
    'Technology',
    'Retail',
    'Healthcare',
    'Education',
    'Food & Beverage',
    'Professional Services',
    'Manufacturing',
    'Real Estate',
    'Other'
  ];

  const revenueRanges = [
    'Just starting (0-$1K)',
    'Growing ($1K-$10K)',
    'Scaling ($10K-$50K)',
    'Established ($50K+)'
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!formData.businessName || !formData.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateUser({
      businessName: formData.businessName,
      businessType: formData.businessType,
      onboardingComplete: true
    });
    
    toast.success('Welcome to BizLaunch360! Your account is now set up.');
    navigate('/dashboard');
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-bizNeutral-900">
              Welcome to BizLaunch360!
            </CardTitle>
            <CardDescription className="text-bizNeutral-600">
              Let's set up your business profile to get started
            </CardDescription>
            <div className="mt-4">
              <Progress value={progressPercentage} className="w-full" />
              <div className="text-sm text-bizNeutral-500 mt-2">
                Step {currentStep} of 3
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <Building className="h-12 w-12 text-bizPrimary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-bizNeutral-900 mb-2">
                    Tell us about your business
                  </h3>
                  <p className="text-bizNeutral-600">
                    Basic information to customize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="Briefly describe what your business does..."
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <Target className="h-12 w-12 text-bizPrimary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-bizNeutral-900 mb-2">
                    What are your goals?
                  </h3>
                  <p className="text-bizNeutral-600">
                    Help us understand your business objectives
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goals">Primary Business Goals</Label>
                    <Textarea
                      id="goals"
                      placeholder="What do you want to achieve with your business? (e.g., increase revenue, expand customer base, improve efficiency...)"
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue">Current Monthly Revenue</Label>
                    <Select
                      value={formData.monthlyRevenue}
                      onValueChange={(value) => setFormData({ ...formData, monthlyRevenue: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-bizSuccess mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-bizNeutral-900 mb-2">
                    You're all set!
                  </h3>
                  <p className="text-bizNeutral-600">
                    Review your information and start using BizLaunch360
                  </p>
                </div>

                <div className="bg-bizNeutral-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-bizNeutral-900 mb-4">Your Business Profile:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-bizNeutral-600">Business Name:</span>
                      <span className="font-medium">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bizNeutral-600">Type:</span>
                      <span className="font-medium">{formData.businessType}</span>
                    </div>
                    {formData.monthlyRevenue && (
                      <div className="flex justify-between">
                        <span className="text-bizNeutral-600">Revenue:</span>
                        <span className="font-medium">{formData.monthlyRevenue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-bizPrimary/10 to-bizAccent/10 p-6 rounded-xl">
                  <h4 className="font-semibold text-bizNeutral-900 mb-2">What's Next?</h4>
                  <ul className="text-sm space-y-1 text-bizNeutral-700">
                    <li>• Access your personalized dashboard</li>
                    <li>• Create your first AI-powered business plan</li>
                    <li>• Set up your finance and invoicing system</li>
                    <li>• Start managing customers and appointments</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-bizNeutral-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && (!formData.businessName || !formData.businessType)}
                  className="btn-primary flex items-center"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="btn-success flex items-center"
                >
                  Complete Setup
                  <CheckCircle className="ml-2 h-4 w-4" />
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
