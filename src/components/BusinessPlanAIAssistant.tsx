import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BusinessInfo {
  business_name?: string;
  business_type?: string;
  business_description?: string;
  business_address?: string;
  business_email?: string;
  business_phone?: string;
}

interface BusinessPlanAIAssistantProps {
  section: string;
  onSuggestionGenerated: (content: string) => void;
  currentContent?: string;
  planTitle?: string;
}

const sectionTips: Record<string, string[]> = {
  executiveSummary: [
    "Investors read this first - make it compelling and concise",
    "Include your mission statement and unique value proposition",
    "Highlight key financial projections and funding needs",
    "Keep it to 1-2 pages maximum"
  ],
  businessDescription: [
    "Clearly explain what problem your business solves",
    "Describe your target customer and why they need you",
    "Highlight your competitive advantages",
    "Include your business model and revenue streams"
  ],
  marketAnalysis: [
    "Include TAM (Total Addressable Market), SAM, and SOM",
    "Analyze at least 3 direct competitors with strengths/weaknesses",
    "Identify market trends that favor your business",
    "Include a SWOT analysis for credibility"
  ],
  organization: [
    "Highlight relevant experience of key team members",
    "Show a clear organizational structure",
    "Include advisory board members if applicable",
    "Describe your company culture and values"
  ],
  products: [
    "Detail your product/service features and benefits",
    "Explain your pricing strategy and justification",
    "Include your product roadmap and future plans",
    "Highlight intellectual property or unique technology"
  ],
  marketing: [
    "Define your brand positioning clearly",
    "Include customer acquisition cost (CAC) estimates",
    "Describe your sales funnel and conversion strategy",
    "Allocate a realistic marketing budget"
  ],
  funding: [
    "Be specific about how funds will be used",
    "Include funding milestones and stages",
    "Show potential investor returns",
    "List potential funding sources you're targeting"
  ],
  financials: [
    "Provide 3-5 year projections by quarter for year 1",
    "Include break-even analysis with timeline",
    "Show key metrics: gross margin, CAC, LTV, burn rate",
    "Clearly state your assumptions"
  ]
};

const sectionPrompts: Record<string, string> = {
  executiveSummary: `Generate a compelling executive summary for a business plan. Include:
1. A powerful opening statement about the business opportunity
2. Mission statement and vision
3. Unique value proposition that differentiates from competitors
4. Key success factors and competitive advantages
5. Brief financial highlights (revenue potential, growth projections)
6. Funding needs summary (if applicable)
7. Call to action for investors/stakeholders

Make it investor-ready, concise (2-3 paragraphs), and compelling.`,

  businessDescription: `Generate a detailed business description including:
1. Clear explanation of what the business does and the problem it solves
2. Business model and how the company makes money
3. Revenue streams (primary and secondary)
4. Target customer personas with demographics and pain points
5. Competitive advantages and barriers to entry
6. Industry positioning and market category
7. Company history and key milestones (if established)

Be specific and avoid generic statements. Focus on what makes this business unique.`,

  marketAnalysis: `Generate a comprehensive market analysis including:
1. Market size: TAM (Total Addressable Market), SAM (Serviceable Addressable Market), SOM (Serviceable Obtainable Market) with dollar values
2. Target market demographics, psychographics, and buying behaviors
3. Market trends and growth drivers
4. Competitor analysis: Identify 3-5 competitors with their strengths, weaknesses, and market share
5. SWOT Analysis: Strengths, Weaknesses, Opportunities, Threats
6. Market entry strategy and positioning
7. Customer segments and prioritization

Use realistic estimates and cite industry sources where applicable.`,

  organization: `Generate an organization and management section including:
1. Leadership team structure with key roles and responsibilities
2. Key personnel backgrounds and relevant experience
3. Organizational hierarchy and reporting structure
4. Advisory board members and their expertise (if applicable)
5. Hiring plan for the first 12-24 months
6. Company culture and core values
7. Key partnerships and strategic alliances

Focus on building credibility through team experience and clear structure.`,

  products: `Generate a detailed products and services section including:
1. Complete product/service descriptions with features and benefits
2. Pricing strategy with justification (cost-plus, value-based, competitive)
3. Product lifecycle and current stage
4. Product roadmap and future development plans
5. Differentiation from competitor offerings
6. Intellectual property, patents, or proprietary technology
7. Supply chain and fulfillment (if applicable)

Be specific about what you offer and why customers would choose you.`,

  marketing: `Generate a marketing and sales strategy including:
1. Brand positioning statement
2. Marketing channels: digital (SEO, PPC, social media), traditional (print, events), partnerships
3. Customer acquisition strategy with estimated CAC
4. Sales funnel: awareness → consideration → decision → retention
5. Sales process and team structure
6. Customer retention and loyalty programs
7. First-year marketing budget allocation by channel
8. Key performance indicators (KPIs) and success metrics

Include specific tactics and realistic budget estimates.`,

  funding: `Generate a funding requirements section including:
1. Total capital requirements with detailed breakdown
2. Funding stages and corresponding milestones
3. Use of funds: specific allocations (personnel, marketing, operations, R&D)
4. Current funding status and sources
5. Potential funding sources (VC, angel investors, loans, grants)
6. Investor value proposition
7. Expected returns and exit strategy timeline
8. Financial runway and burn rate projections

Be specific about amounts and how they align with growth milestones.`,

  financials: `Generate financial projections section including:
1. 3-year revenue projections (quarterly for year 1, annual for years 2-3)
2. Expense forecasts by category (personnel, marketing, operations, overhead)
3. Break-even analysis with specific timeline
4. Key financial metrics: gross margin, net margin, CAC, LTV, LTV:CAC ratio
5. Cash flow projections and runway
6. Profitability timeline
7. Key assumptions clearly stated
8. Sensitivity analysis for different scenarios (conservative, moderate, aggressive)

Use realistic numbers and clearly explain your assumptions.`
};

const BusinessPlanAIAssistant: React.FC<BusinessPlanAIAssistantProps> = ({
  section,
  onSuggestionGenerated,
  currentContent,
  planTitle
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [showTips, setShowTips] = useState(false);
  const { toast } = useToast();

  // Fetch user's business info for context
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('business_name, business_type, business_description, business_address, business_email, business_phone')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (data) {
            setBusinessInfo(data);
          }
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };

    fetchBusinessInfo();
  }, []);

  const generateSuggestion = async (isImprove: boolean = false) => {
    setIsGenerating(true);
    setSuggestion('');

    let prompt = '';
    
    if (isImprove && currentContent) {
      prompt = `Improve and enhance this ${section} section of a business plan. Make it more compelling, specific, and investor-ready.

Current content:
${currentContent}

${businessInfo ? `Business context:
- Business Name: ${businessInfo.business_name}
- Business Type: ${businessInfo.business_type}
- Description: ${businessInfo.business_description}` : ''}

${planTitle ? `Business Plan Title: ${planTitle}` : ''}

Provide an improved version that:
1. Adds more specific details and metrics where appropriate
2. Strengthens the value proposition
3. Uses professional business language
4. Maintains the original intent but makes it more compelling

IMPORTANT: Do not use any markdown formatting. Write in clear paragraphs with numbered lists only when necessary.`;
    } else {
      prompt = `${sectionPrompts[section] || 'Generate professional content for this business plan section.'}

${businessInfo ? `Generate content specifically for this business:
- Business Name: ${businessInfo.business_name}
- Business Type: ${businessInfo.business_type}
- Description: ${businessInfo.business_description}
- Location: ${businessInfo.business_address}` : ''}

${planTitle ? `Business Plan Title: ${planTitle}` : ''}

IMPORTANT: Do not use any markdown formatting (no hashtags, asterisks, or bullet points with dashes). Write in clear, professional paragraphs. Use numbered lists only when listing specific steps or items.`;
    }

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

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (response.status === 402) {
          throw new Error('AI usage limit reached. Please add credits to continue.');
        }
        throw new Error('Failed to generate suggestion');
      }

      if (!response.body) {
        throw new Error('No response body');
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
        description: isImprove ? "AI has improved your content" : "AI has generated content for this section",
      });
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate suggestion. Please try again.",
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

  const tips = sectionTips[section] || [];

  return (
    <div className="space-y-3">
      {/* Tips Section */}
      {tips.length > 0 && (
        <div className="border-l-4 border-primary/30 bg-primary/5 p-3 rounded-r-lg">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-2 text-sm font-medium text-primary w-full text-left"
          >
            <Lightbulb className="h-4 w-4" />
            Tips for this section
            <span className="text-xs text-muted-foreground ml-auto">
              {showTips ? 'Hide' : 'Show'}
            </span>
          </button>
          {showTips && (
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => generateSuggestion(false)}
          disabled={isGenerating}
          variant="outline"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate New
            </>
          )}
        </Button>
        
        {currentContent && (
          <Button
            onClick={() => generateSuggestion(true)}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Improve Content
              </>
            )}
          </Button>
        )}
      </div>

      {/* Suggestion Display */}
      {suggestion && (
        <Card className="p-4 space-y-3 bg-muted/50 border-primary/20">
          <div className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Suggestion
          </div>
          <div className="text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
            {suggestion}
          </div>
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
