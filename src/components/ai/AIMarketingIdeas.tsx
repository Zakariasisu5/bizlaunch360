import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, Loader2, Sparkles, RefreshCw, Clock, DollarSign, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MarketingIdea {
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  cost: 'free' | '$' | '$$';
  timeframe: 'immediate' | 'this week' | 'this month';
  expectedImpact: string;
}

interface AIMarketingIdeasProps {
  businessInfo?: {
    type?: string;
    industry?: string;
    location?: string;
    customerCount?: number;
  };
}

export const AIMarketingIdeas: React.FC<AIMarketingIdeasProps> = ({ businessInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<MarketingIdea[]>([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('Low budget');

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-emerald-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCostIcon = (cost: string) => {
    switch (cost) {
      case 'free': return <span className="text-emerald-500 text-xs font-bold">FREE</span>;
      case '$': return <span className="text-amber-500 text-xs font-bold">$</span>;
      case '$$': return <span className="text-destructive text-xs font-bold">$$</span>;
      default: return null;
    }
  };

  const generateIdeas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-marketing-ideas', {
        body: { businessInfo, targetAudience, budget }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setIdeas(data.ideas || []);
      toast.success('Marketing ideas generated!');
    } catch (error: any) {
      console.error('Error generating ideas:', error);
      toast.error(error.message || 'Failed to generate ideas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Marketing Ideas</CardTitle>
          </div>
          {ideas.length > 0 && (
            <Button 
              onClick={generateIdeas} 
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <CardDescription>
          Get tailored marketing ideas for your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ideas.length === 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input
                  placeholder="e.g., Young professionals"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <Input
                  placeholder="e.g., $100/month"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={generateIdeas} 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Brainstorming...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generate Marketing Ideas
                </>
              )}
            </Button>
          </>
        )}

        {ideas.length > 0 && (
          <div className="space-y-4">
            {ideas.map((idea, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-sm">{idea.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getCostIcon(idea.cost)}
                    <Badge className={`text-xs ${getEffortColor(idea.effort)}`}>
                      {idea.effort} effort
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {idea.timeframe}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {idea.expectedImpact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
