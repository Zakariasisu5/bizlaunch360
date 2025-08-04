
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Rocket, Building, Briefcase, CheckCircle, Users, Target, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Onboarding = () => {
  const { user, updateUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Update progress based on form completion
  useEffect(() => {
    let newProgress = 0;
    if (formData.businessName) newProgress += 50;
    if (formData.businessType) newProgress += 50;
    setProgress(newProgress);
  }, [formData]);

  const businessTypes = [
    'Technology',
    'Retail',
    'Healthcare',
    'Education',
    'Finance',
    'Manufacturing',
    'Food & Beverage',
    'Real Estate',
    'Consulting',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.businessType) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await updateUser({
        businessName: formData.businessName,
        businessType: formData.businessType,
        onboardingComplete: true
      });
      
      toast.success('🎉 Welcome to BizLaunch360! Your workspace is ready.');
      
      // Navigate immediately after successful update
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bizPrimary-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Progress */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center text-primary mb-6">
            <Rocket className="h-10 w-10 mr-3" />
            <span className="text-3xl font-bold">BizLaunch360</span>
          </div>
          
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Setup Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome, {user?.name}!
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Let's set up your business profile to unlock all features
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="p-2 bg-primary/10 rounded-full w-fit mx-auto mb-2">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Business Planning</p>
              </div>
              <div className="text-center">
                <div className="p-2 bg-primary/10 rounded-full w-fit mx-auto mb-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">CRM & Appointments</p>
              </div>
              <div className="text-center">
                <div className="p-2 bg-primary/10 rounded-full w-fit mx-auto mb-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Financial Tracking</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="business-name" className="text-base font-medium">
                  What's your business name?
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="e.g., Acme Solutions LLC"
                    className="pl-11 h-12 text-base"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                  {formData.businessName && (
                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="business-type" className="text-base font-medium">
                  What industry are you in?
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-muted-foreground z-10" />
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    required
                  >
                    <SelectTrigger className="pl-11 h-12 text-base">
                      <SelectValue placeholder="Choose your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-base">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.businessType && (
                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500 z-10" />
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                  disabled={loading || !formData.businessName || !formData.businessType}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Setting up your workspace...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Complete Setup & Launch Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>🔒 Your data is secure and encrypted • 🚀 Get started in under 60 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
