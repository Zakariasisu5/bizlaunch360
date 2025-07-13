
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (requireOnboarding && !user.onboardingComplete) {
        navigate('/onboarding');
      }
    }
  }, [user, isLoading, navigate, requireOnboarding]);

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

  if (!user) {
    return null;
  }

  if (requireOnboarding && !user.onboardingComplete) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
