import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Loader2, Sparkles, DollarSign, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ForecastData {
  revenueProjection: { month1: number; month3: number; month6: number; month12: number };
  expenseProjection: { month1: number; month3: number; month6: number; month12: number };
  profitProjection: { month1: number; month3: number; month6: number; month12: number };
  insights: string[];
  recommendations: string[];
}

interface AIFinancialForecastProps {
  financialData: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    totalCustomers: number;
    averageTransaction?: number;
  };
  businessInfo?: {
    businessType?: string;
    industry?: string;
  };
}

export const AIFinancialForecast: React.FC<AIFinancialForecastProps> = ({ 
  financialData, 
  businessInfo 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  const generateForecast = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-financial-forecast', {
        body: { businessInfo, financialData }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setForecast(data.forecast);
      toast.success('Forecast generated successfully!');
    } catch (error: any) {
      console.error('Error generating forecast:', error);
      toast.error(error.message || 'Failed to generate forecast');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = forecast ? [
    { month: 'Month 1', revenue: forecast.revenueProjection.month1, expenses: forecast.expenseProjection.month1, profit: forecast.profitProjection.month1 },
    { month: 'Month 3', revenue: forecast.revenueProjection.month3, expenses: forecast.expenseProjection.month3, profit: forecast.profitProjection.month3 },
    { month: 'Month 6', revenue: forecast.revenueProjection.month6, expenses: forecast.expenseProjection.month6, profit: forecast.profitProjection.month6 },
    { month: 'Month 12', revenue: forecast.revenueProjection.month12, expenses: forecast.expenseProjection.month12, profit: forecast.profitProjection.month12 },
  ] : [];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Financial Forecast</CardTitle>
          </div>
          <Button 
            onClick={generateForecast} 
            disabled={isLoading}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Forecast
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Get AI-powered revenue, expense, and profit projections for the next 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!forecast && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Generate Forecast" to see your AI-powered financial projections</p>
          </div>
        )}

        {forecast && (
          <div className="space-y-6">
            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            {forecast.insights && forecast.insights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {forecast.insights.map((insight, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {forecast.recommendations && forecast.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <div className="flex flex-wrap gap-2">
                  {forecast.recommendations.map((rec, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
