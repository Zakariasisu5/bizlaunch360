
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user && requireOnboarding && !user.onboardingComplete) {
      // Redirect to onboarding if user hasn't completed it
      if (location.pathname !== '/onboarding') {
        navigate('/onboarding');
      }
    }
  }, [user, isLoading, navigate, requireOnboarding, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Block access if onboarding is required but not complete
  if (requireOnboarding && !user.onboardingComplete) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
