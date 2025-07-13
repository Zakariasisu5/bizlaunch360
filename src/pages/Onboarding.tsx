
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, Building, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const Onboarding = () => {
  const { user, updateUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
  });
  const [loading, setLoading] = useState(false);

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
      
      toast.success('Welcome to BizLaunch360!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
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
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center text-white">
            <Rocket className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">BizLaunch360</span>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-bizNeutral-900">
              Welcome, {user?.name}!
            </CardTitle>
            <CardDescription className="text-bizNeutral-600">
              Let's set up your business profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="Enter your business name"
                    className="pl-10"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400 z-10" />
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    required
                  >
                    <SelectTrigger className="pl-10">
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
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
