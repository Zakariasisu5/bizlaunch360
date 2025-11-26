import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessPlanAIAssistantProps {
  section: string;
  onSuggestionGenerated: (content: string) => void;
  currentContent?: string;
}

const BusinessPlanAIAssistant: React.FC<BusinessPlanAIAssistantProps> = ({
  section,
  onSuggestionGenerated,
  currentContent
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const { toast } = useToast();

  const sectionPrompts: Record<string, string> = {
    executiveSummary: 'Generate a compelling executive summary for a business plan. Include mission statement, key objectives, and unique value proposition.',
    businessDescription: 'Generate a detailed business description including the business model, target market, and competitive advantages.',
    marketAnalysis: 'Generate a comprehensive market analysis including target market demographics, market size, trends, and competitive landscape.',
    products: 'Generate a detailed products and services section including features, benefits, pricing strategy, and lifecycle.',
    marketing: 'Generate a marketing and sales strategy including channels, tactics, customer acquisition, and retention strategies.',
    organization: 'Generate an organization and management section including team structure, key personnel, advisors, and company culture.',
    financials: 'Generate a financial projections section including revenue forecasts, expense budgets, profit margins, and break-even analysis.',
    funding: 'Generate a funding requirements section including capital needs, use of funds, funding sources, and return on investment.'
  };

  const generateSuggestion = async () => {
    setIsGenerating(true);
    setSuggestion('');

    const prompt = currentContent 
      ? `Improve and expand this ${section} section of a business plan:\n\n${currentContent}\n\nProvide specific, actionable suggestions.`
      : sectionPrompts[section] || 'Generate content for this business plan section.';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, type: 'business' }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to generate suggestion');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullSuggestion = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullSuggestion += content;
                setSuggestion(fullSuggestion);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      toast({
        title: "Suggestion Generated",
        description: "AI has generated content suggestions for this section",
      });
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = () => {
    onSuggestionGenerated(suggestion);
    setSuggestion('');
    toast({
      title: "Applied",
      description: "Suggestion has been applied to the section",
    });
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={generateSuggestion}
        disabled={isGenerating}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Get AI Suggestions
          </>
        )}
      </Button>

      {suggestion && (
        <Card className="p-4 space-y-3 bg-muted/50">
          <div className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Suggestion
          </div>
          <div className="text-sm whitespace-pre-wrap">{suggestion}</div>
          <div className="flex gap-2">
            <Button onClick={applySuggestion} size="sm">
              Apply Suggestion
            </Button>
            <Button onClick={() => setSuggestion('')} variant="outline" size="sm">
              Dismiss
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BusinessPlanAIAssistant;
