import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  Shield, 
  TrendingUp,
  Users,
  Target,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface BusinessPlanVisualsProps {
  swotData?: SWOTData;
  milestones?: { title: string; timeline: string; status: 'completed' | 'in-progress' | 'upcoming' }[];
  competitorComparison?: { name: string; ourScore: number; competitorScore: number }[];
}

const defaultSWOT: SWOTData = {
  strengths: ['Innovative product', 'Experienced team', 'Strong brand identity', 'Low operational costs'],
  weaknesses: ['Limited market presence', 'New to industry', 'Small team size'],
  opportunities: ['Growing market demand', 'Partnership potential', 'International expansion'],
  threats: ['Established competitors', 'Economic uncertainty', 'Regulatory changes']
};

const defaultMilestones = [
  { title: 'Product Development', timeline: 'Q1', status: 'completed' as const },
  { title: 'Beta Launch', timeline: 'Q2', status: 'in-progress' as const },
  { title: 'Marketing Campaign', timeline: 'Q3', status: 'upcoming' as const },
  { title: 'Series A Funding', timeline: 'Q4', status: 'upcoming' as const },
  { title: 'Market Expansion', timeline: 'Year 2', status: 'upcoming' as const },
];

const defaultCompetitors = [
  { name: 'Price', ourScore: 85, competitorScore: 70 },
  { name: 'Quality', ourScore: 90, competitorScore: 85 },
  { name: 'Support', ourScore: 95, competitorScore: 75 },
  { name: 'Features', ourScore: 80, competitorScore: 88 },
];

export const BusinessPlanVisuals: React.FC<BusinessPlanVisualsProps> = ({
  swotData = defaultSWOT,
  milestones = defaultMilestones,
  competitorComparison = defaultCompetitors,
}) => {
  return (
    <div className="space-y-6">
      {/* SWOT Analysis Visual */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            SWOT Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-700 dark:text-green-400">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {swotData.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-amber-700 dark:text-amber-400">Weaknesses</h4>
              </div>
              <ul className="space-y-2">
                {swotData.weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">Opportunities</h4>
              </div>
              <ul className="space-y-2">
                {swotData.opportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-700 dark:text-red-400">Threats</h4>
              </div>
              <ul className="space-y-2">
                {swotData.threats.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Milestones Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Business Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-2">
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                    milestone.status === 'completed' 
                      ? 'bg-green-500 border-green-500' 
                      : milestone.status === 'in-progress'
                      ? 'bg-primary border-primary animate-pulse'
                      : 'bg-background border-muted-foreground'
                  }`} />
                  
                  <div className="flex-1 ml-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-sm">{milestone.title}</h4>
                      <p className="text-xs text-muted-foreground">{milestone.timeline}</p>
                    </div>
                    <Badge 
                      variant={
                        milestone.status === 'completed' ? 'default' : 
                        milestone.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                      className="w-fit"
                    >
                      {milestone.status === 'completed' ? '✓ Completed' : 
                       milestone.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Competitive Advantage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorComparison.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    Us: {item.ourScore}% | Competition: {item.competitorScore}%
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 space-y-1">
                    <Progress value={item.ourScore} className="h-2" />
                  </div>
                  <Badge 
                    variant={item.ourScore > item.competitorScore ? 'default' : 'secondary'}
                    className="text-xs w-16 justify-center"
                  >
                    {item.ourScore > item.competitorScore ? '+' : ''}
                    {item.ourScore - item.competitorScore}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-primary">$650K</p>
            <p className="text-xs text-muted-foreground">Year 3 Revenue</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">42%</p>
            <p className="text-xs text-muted-foreground">Profit Margin</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">1,400</p>
            <p className="text-xs text-muted-foreground">Target Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">6 mo</p>
            <p className="text-xs text-muted-foreground">Break-Even</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessPlanVisuals;
