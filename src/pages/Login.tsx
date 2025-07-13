
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Mail, Lock, User, Chrome } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { login, register, loginWithGoogle, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.onboardingComplete) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await login(loginData.email, loginData.password);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please check your email and confirm your account');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } else {
      toast.success('Welcome back!');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    const { error } = await register(registerData.email, registerData.password, registerData.name);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else if (error.message.includes('Password should be at least')) {
        toast.error('Password must be at least 6 characters long');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } else {
      toast.success('Account created! Please check your email to confirm your account.');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await loginWithGoogle();
    
    if (error) {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/90 transition-colors">
            <Rocket className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">BizLaunch360</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-bizNeutral-900">
              Welcome to BizLaunch360
            </CardTitle>
            <CardDescription className="text-bizNeutral-600">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password (min. 6 characters)"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-bizNeutral-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-bizNeutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-bizNeutral-500">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-bizNeutral-200 hover:bg-bizNeutral-50"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-white/80 hover:text-white text-sm transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
