import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, DollarSign, Users, Target, PieChart as PieIcon } from 'lucide-react';

export interface FinancialData {
  revenueProjections: { year: string; revenue: number; expenses: number; profit: number }[];
  marketSize: { segment: string; value: number }[];
  fundingAllocation: { category: string; amount: number; percentage: number }[];
  customerGrowth: { quarter: string; customers: number }[];
  breakEvenData: { month: string; revenue: number; costs: number }[];
}

interface BusinessPlanChartsProps {
  financialData?: FinancialData;
  className?: string;
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const defaultFinancialData: FinancialData = {
  revenueProjections: [
    { year: 'Year 1', revenue: 150000, expenses: 120000, profit: 30000 },
    { year: 'Year 2', revenue: 350000, expenses: 220000, profit: 130000 },
    { year: 'Year 3', revenue: 650000, expenses: 380000, profit: 270000 },
  ],
  marketSize: [
    { segment: 'TAM', value: 50000000 },
    { segment: 'SAM', value: 15000000 },
    { segment: 'SOM', value: 3000000 },
  ],
  fundingAllocation: [
    { category: 'Product Development', amount: 40000, percentage: 40 },
    { category: 'Marketing', amount: 25000, percentage: 25 },
    { category: 'Operations', amount: 20000, percentage: 20 },
    { category: 'Reserve', amount: 15000, percentage: 15 },
  ],
  customerGrowth: [
    { quarter: 'Q1', customers: 50 },
    { quarter: 'Q2', customers: 150 },
    { quarter: 'Q3', customers: 350 },
    { quarter: 'Q4', customers: 600 },
    { quarter: 'Q5', customers: 950 },
    { quarter: 'Q6', customers: 1400 },
  ],
  breakEvenData: [
    { month: 'M1', revenue: 8000, costs: 15000 },
    { month: 'M3', revenue: 18000, costs: 16000 },
    { month: 'M6', revenue: 35000, costs: 22000 },
    { month: 'M9', revenue: 55000, costs: 28000 },
    { month: 'M12', revenue: 80000, costs: 35000 },
  ],
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export const BusinessPlanCharts: React.FC<BusinessPlanChartsProps> = ({ 
  financialData = defaultFinancialData,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Revenue Projections Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            3-Year Revenue Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData.revenueProjections} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} width={60} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Size Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Market Size Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={financialData.marketSize} 
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="segment" type="category" tick={{ fontSize: 12 }} width={40} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">TAM</p>
                <p className="font-semibold text-sm">{formatCurrency(financialData.marketSize[0]?.value || 0)}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">SAM</p>
                <p className="font-semibold text-sm">{formatCurrency(financialData.marketSize[1]?.value || 0)}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">SOM</p>
                <p className="font-semibold text-sm">{formatCurrency(financialData.marketSize[2]?.value || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funding Allocation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <PieIcon className="h-5 w-5 mr-2 text-primary" />
              Funding Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialData.fundingAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                    label={({ name, percentage }) => `${percentage}%`}
                    labelLine={false}
                  >
                    {financialData.fundingAllocation.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {financialData.fundingAllocation.map((item, index) => (
                <div key={item.category} className="flex items-center gap-1.5 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth Projection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Customer Growth Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData.customerGrowth} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} customers`, 'Customers']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#customerGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Break-Even Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            Break-Even Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData.breakEvenData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} width={60} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  name="Costs" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPlanCharts;
