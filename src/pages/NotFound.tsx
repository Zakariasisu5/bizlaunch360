
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bizNeutral-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Number */}
        <div className="gradient-hero bg-clip-text text-transparent text-8xl font-bold mb-4">
          404
        </div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-bizNeutral-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-bizNeutral-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="btn-primary">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-bizNeutral-300 hover:bg-bizNeutral-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-soft border border-bizNeutral-200">
          <h3 className="font-semibold text-bizNeutral-900 mb-2">Need Help?</h3>
          <p className="text-sm text-bizNeutral-600">
            If you believe this is an error, please contact our support team or check our help documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
