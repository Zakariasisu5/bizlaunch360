import { FinancialData } from '@/components/BusinessPlanCharts';

interface BusinessPlanData {
  executiveSummary: string;
  businessDescription: string;
  marketAnalysis: string;
  organization: string;
  products: string;
  marketing: string;
  funding: string;
  financials: string;
}

// Helper to extract numbers from text
const extractNumber = (text: string, patterns: RegExp[]): number | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let numStr = match[1] || match[0];
      // Clean the string
      numStr = numStr.replace(/[$,]/g, '');
      
      // Handle K, M, B suffixes
      const multiplierMatch = numStr.match(/(\d+(?:\.\d+)?)\s*([KMBkmb])/);
      if (multiplierMatch) {
        const num = parseFloat(multiplierMatch[1]);
        const suffix = multiplierMatch[2].toUpperCase();
        if (suffix === 'K') return num * 1000;
        if (suffix === 'M') return num * 1000000;
        if (suffix === 'B') return num * 1000000000;
      }
      
      // Try to parse as regular number
      const num = parseFloat(numStr.replace(/[^\d.]/g, ''));
      if (!isNaN(num)) return num;
    }
  }
  return null;
};

// Extract year-based revenue projections
const extractRevenueProjections = (financials: string, executiveSummary: string): FinancialData['revenueProjections'] => {
  const text = `${financials} ${executiveSummary}`;
  const projections: FinancialData['revenueProjections'] = [];
  
  // Look for Year 1, Year 2, Year 3 patterns with revenue/expenses/profit
  const yearPatterns = [
    /Year\s*1[:\s]*\$?([\d,.]+[KMB]?)/gi,
    /Year\s*2[:\s]*\$?([\d,.]+[KMB]?)/gi,
    /Year\s*3[:\s]*\$?([\d,.]+[KMB]?)/gi,
  ];
  
  // Try to extract structured data from tables
  const tableRowPattern = /Year\s*(\d+)[|\s]+\$?([\d,]+(?:\.\d+)?[KMB]?)[|\s]+\$?([\d,]+(?:\.\d+)?[KMB]?)[|\s]+\$?([\d,]+(?:\.\d+)?[KMB]?)/gi;
  const matches = [...text.matchAll(tableRowPattern)];
  
  if (matches.length >= 2) {
    matches.slice(0, 3).forEach((match) => {
      const year = `Year ${match[1]}`;
      const revenue = parseFinancialNumber(match[2]);
      const expenses = parseFinancialNumber(match[3]);
      const profit = parseFinancialNumber(match[4]) || (revenue - expenses);
      
      if (revenue > 0) {
        projections.push({ year, revenue, expenses, profit });
      }
    });
  }
  
  // Fallback: Look for individual year mentions
  if (projections.length < 2) {
    const fallbackPatterns = [
      { year: 'Year 1', patterns: [/Year\s*1[^$]*\$?([\d,.]+[KMB]?)/i, /first\s*year[^$]*\$?([\d,.]+[KMB]?)/i] },
      { year: 'Year 2', patterns: [/Year\s*2[^$]*\$?([\d,.]+[KMB]?)/i, /second\s*year[^$]*\$?([\d,.]+[KMB]?)/i] },
      { year: 'Year 3', patterns: [/Year\s*3[^$]*\$?([\d,.]+[KMB]?)/i, /third\s*year[^$]*\$?([\d,.]+[KMB]?)/i] },
    ];
    
    projections.length = 0; // Clear any partial results
    
    fallbackPatterns.forEach((item, index) => {
      const revenue = extractNumber(text, item.patterns);
      if (revenue && revenue > 0) {
        // Estimate expenses as 75-85% of revenue if not found
        const expenseRatio = 0.85 - (index * 0.05);
        const expenses = Math.round(revenue * expenseRatio);
        const profit = revenue - expenses;
        projections.push({ year: item.year, revenue, expenses, profit });
      }
    });
  }
  
  // If still no data, return default projections with reasonable growth
  if (projections.length < 2) {
    const baseRevenue = extractNumber(text, [/\$?([\d,.]+[KMB]?)\s*(?:revenue|sales|annually)/i]) || 500000;
    return [
      { year: 'Year 1', revenue: baseRevenue, expenses: Math.round(baseRevenue * 0.85), profit: Math.round(baseRevenue * 0.15) },
      { year: 'Year 2', revenue: Math.round(baseRevenue * 1.5), expenses: Math.round(baseRevenue * 1.5 * 0.8), profit: Math.round(baseRevenue * 1.5 * 0.2) },
      { year: 'Year 3', revenue: Math.round(baseRevenue * 2.2), expenses: Math.round(baseRevenue * 2.2 * 0.75), profit: Math.round(baseRevenue * 2.2 * 0.25) },
    ];
  }
  
  return projections;
};

// Parse financial numbers with K, M, B suffixes
const parseFinancialNumber = (str: string): number => {
  if (!str) return 0;
  const cleaned = str.replace(/[$,]/g, '').trim();
  
  const multiplierMatch = cleaned.match(/([\d.]+)\s*([KMBkmb])/);
  if (multiplierMatch) {
    const num = parseFloat(multiplierMatch[1]);
    const suffix = multiplierMatch[2].toUpperCase();
    if (suffix === 'K') return num * 1000;
    if (suffix === 'M') return num * 1000000;
    if (suffix === 'B') return num * 1000000000;
  }
  
  return parseFloat(cleaned) || 0;
};

// Extract market size (TAM/SAM/SOM)
const extractMarketSize = (marketAnalysis: string): FinancialData['marketSize'] => {
  const text = marketAnalysis;
  
  // Pattern for TAM, SAM, SOM
  const tamPatterns = [/TAM[:\s]*\$?([\d,.]+[KMB]?)/i, /total\s*addressable\s*market[:\s]*\$?([\d,.]+[KMB]?)/i];
  const samPatterns = [/SAM[:\s]*\$?([\d,.]+[KMB]?)/i, /serviceable\s*addressable\s*market[:\s]*\$?([\d,.]+[KMB]?)/i];
  const somPatterns = [/SOM[:\s]*\$?([\d,.]+[KMB]?)/i, /serviceable\s*obtainable\s*market[:\s]*\$?([\d,.]+[KMB]?)/i];
  
  const tam = extractNumber(text, tamPatterns) || 50000000;
  const sam = extractNumber(text, samPatterns) || tam * 0.3;
  const som = extractNumber(text, somPatterns) || sam * 0.1;
  
  return [
    { segment: 'TAM', value: tam },
    { segment: 'SAM', value: sam },
    { segment: 'SOM', value: som },
  ];
};

// Extract funding allocation
const extractFundingAllocation = (funding: string): FinancialData['fundingAllocation'] => {
  const text = funding;
  const allocations: FinancialData['fundingAllocation'] = [];
  
  // Common funding categories with patterns
  const categories = [
    { name: 'Product Development', patterns: [/product\s*(?:development)?[:\s|]*\$?([\d,.]+[KMB]?)/i, /R&D[:\s|]*\$?([\d,.]+[KMB]?)/i, /engineering[:\s|]*\$?([\d,.]+[KMB]?)/i] },
    { name: 'Marketing', patterns: [/marketing[:\s|]*\$?([\d,.]+[KMB]?)/i, /sales\s*(?:&|and)?\s*marketing[:\s|]*\$?([\d,.]+[KMB]?)/i] },
    { name: 'Operations', patterns: [/operations?[:\s|]*\$?([\d,.]+[KMB]?)/i, /working\s*capital[:\s|]*\$?([\d,.]+[KMB]?)/i] },
    { name: 'Equipment', patterns: [/equipment[:\s|]*\$?([\d,.]+[KMB]?)/i, /technology[:\s|]*\$?([\d,.]+[KMB]?)/i] },
    { name: 'Staffing', patterns: [/staffing?[:\s|]*\$?([\d,.]+[KMB]?)/i, /hiring[:\s|]*\$?([\d,.]+[KMB]?)/i, /personnel[:\s|]*\$?([\d,.]+[KMB]?)/i] },
  ];
  
  let total = 0;
  categories.forEach((cat) => {
    const amount = extractNumber(text, cat.patterns);
    if (amount && amount > 0) {
      allocations.push({ category: cat.name, amount, percentage: 0 });
      total += amount;
    }
  });
  
  // Calculate percentages
  if (allocations.length > 0 && total > 0) {
    allocations.forEach((item) => {
      item.percentage = Math.round((item.amount / total) * 100);
    });
  }
  
  // Return default if nothing found
  if (allocations.length < 2) {
    const totalFunding = extractNumber(text, [/total[:\s]*\$?([\d,.]+[KMB]?)/i, /seeking[:\s]*\$?([\d,.]+[KMB]?)/i, /raising[:\s]*\$?([\d,.]+[KMB]?)/i]) || 200000;
    return [
      { category: 'Product Development', amount: Math.round(totalFunding * 0.35), percentage: 35 },
      { category: 'Marketing', amount: Math.round(totalFunding * 0.25), percentage: 25 },
      { category: 'Operations', amount: Math.round(totalFunding * 0.25), percentage: 25 },
      { category: 'Reserve', amount: Math.round(totalFunding * 0.15), percentage: 15 },
    ];
  }
  
  return allocations;
};

// Extract customer growth projections
const extractCustomerGrowth = (planData: BusinessPlanData): FinancialData['customerGrowth'] => {
  const text = `${planData.financials} ${planData.marketing} ${planData.executiveSummary}`;
  
  // Try to find quarterly or monthly customer data
  const quarterPattern = /Q(\d+)[:\s|]*([\d,]+)\s*(?:customers?|users?)?/gi;
  const matches = [...text.matchAll(quarterPattern)];
  
  if (matches.length >= 3) {
    return matches.slice(0, 6).map((match) => ({
      quarter: `Q${match[1]}`,
      customers: parseInt(match[2].replace(/,/g, ''), 10),
    }));
  }
  
  // Look for growth rate or starting customer count
  const startingCustomers = extractNumber(text, [
    /starting\s*(?:with\s*)?([\d,]+)\s*customers?/i,
    /initial\s*customers?[:\s]*([\d,]+)/i,
    /([\d,]+)\s*customers?\s*(?:in|by)\s*(?:month|year)\s*1/i,
  ]) || 50;
  
  const growthRate = extractNumber(text, [
    /(\d+(?:\.\d+)?)\s*%\s*(?:monthly|month-over-month|MoM)\s*growth/i,
    /growth\s*rate[:\s]*(\d+(?:\.\d+)?)\s*%/i,
  ]) || 20;
  
  // Generate projected growth curve
  const projections: FinancialData['customerGrowth'] = [];
  let customers = startingCustomers;
  const monthlyGrowth = growthRate / 100;
  
  for (let q = 1; q <= 6; q++) {
    projections.push({ quarter: `Q${q}`, customers: Math.round(customers) });
    customers *= (1 + monthlyGrowth) ** 3; // Quarterly compounding
  }
  
  return projections;
};

// Extract break-even data
const extractBreakEvenData = (financials: string): FinancialData['breakEvenData'] => {
  const text = financials;
  
  // Try to find break-even month
  const breakEvenMonth = extractNumber(text, [
    /break-?\s*even[:\s]*(?:point[:\s]*)?(?:month\s*)?(\d+)/i,
    /month\s*(\d+)[\s:]+break-?\s*even/i,
    /profitable\s*(?:by|in)\s*month\s*(\d+)/i,
  ]) || 8;
  
  // Extract monthly revenue target if available
  const monthlyRevenue = extractNumber(text, [
    /monthly\s*(?:revenue|break-?\s*even)[:\s]*\$?([\d,.]+[KMB]?)/i,
    /\$?([\d,.]+[KMB]?)\s*(?:per|\/)\s*month/i,
  ]) || 50000;
  
  // Generate break-even trajectory
  const startingRevenue = monthlyRevenue * 0.3;
  const monthlyCosts = monthlyRevenue * 0.9; // Assuming costs are slightly below break-even revenue
  
  return [
    { month: 'M1', revenue: Math.round(startingRevenue), costs: Math.round(monthlyCosts * 0.8) },
    { month: 'M3', revenue: Math.round(startingRevenue * 1.8), costs: Math.round(monthlyCosts * 0.85) },
    { month: 'M6', revenue: Math.round(monthlyRevenue * 0.7), costs: Math.round(monthlyCosts * 0.9) },
    { month: `M${breakEvenMonth}`, revenue: Math.round(monthlyRevenue), costs: Math.round(monthlyRevenue * 0.95) },
    { month: 'M12', revenue: Math.round(monthlyRevenue * 1.3), costs: Math.round(monthlyRevenue) },
  ];
};

// Main extraction function
export const extractFinancialData = (planData: BusinessPlanData): FinancialData => {
  // Check if there's any content to extract from
  const hasContent = Object.values(planData).some(v => v && v.trim().length > 50);
  
  if (!hasContent) {
    // Return null to indicate no data could be extracted
    return {
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
  }
  
  return {
    revenueProjections: extractRevenueProjections(planData.financials, planData.executiveSummary),
    marketSize: extractMarketSize(planData.marketAnalysis),
    fundingAllocation: extractFundingAllocation(planData.funding),
    customerGrowth: extractCustomerGrowth(planData),
    breakEvenData: extractBreakEvenData(planData.financials),
  };
};

export default extractFinancialData;
