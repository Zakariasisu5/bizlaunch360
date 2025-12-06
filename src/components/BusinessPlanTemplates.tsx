import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  UtensilsCrossed, 
  Laptop, 
  ShoppingBag, 
  Building2, 
  Heart, 
  GraduationCap,
  Factory,
  Truck,
  Palette,
  Coffee
} from 'lucide-react';

export interface IndustryTemplate {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  executiveSummary: string;
  businessDescription: string;
  marketAnalysis: string;
  organization: string;
  products: string;
  marketing: string;
  funding: string;
  financials: string;
}

const industryTemplates: IndustryTemplate[] = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: UtensilsCrossed,
    description: 'Full-service restaurant or quick-service eatery',
    executiveSummary: `[Restaurant Name] is a [cuisine type] restaurant located in [city/neighborhood], offering an authentic dining experience that combines traditional recipes with modern presentation. Our mission is to provide exceptional food quality, warm hospitality, and a memorable atmosphere that keeps customers returning.

Key Highlights:
• Target market: Food enthusiasts aged 25-55 within a 10-mile radius
• Average check: $35-50 per person
• Seating capacity: 80 seats with private dining option
• Projected Year 1 revenue: $850,000
• Break-even point: Month 8 of operations

Our unique value proposition centers on [specific differentiator: farm-to-table ingredients, family recipes, unique fusion cuisine, etc.]. With an experienced management team bringing over 20 years combined restaurant experience, we are well-positioned to capture significant market share in the growing local dining scene.`,
    businessDescription: `[Restaurant Name] operates as a full-service [cuisine type] restaurant in [location]. We serve lunch and dinner seven days a week, with brunch service on weekends.

Business Model:
• Dine-in service (70% of revenue)
• Takeout and delivery (20% of revenue)
• Catering services (10% of revenue)

Restaurant Concept:
Our concept focuses on [describe unique angle - e.g., "authentic Italian cuisine using imported ingredients" or "health-conscious Asian fusion"]. The ambiance features [describe interior - industrial chic, rustic farmhouse, elegant modern, etc.] design elements that appeal to our target demographic.

Location Advantages:
• High foot traffic area with 50,000+ daily passersby
• Ample parking (25 dedicated spaces)
• Proximity to office buildings and residential areas
• Previous successful restaurant location

Operating Hours:
• Monday-Thursday: 11:00 AM - 10:00 PM
• Friday-Saturday: 11:00 AM - 11:00 PM
• Sunday: 10:00 AM - 9:00 PM (brunch from 10 AM - 2 PM)`,
    marketAnalysis: `Market Overview:
The restaurant industry in [city/region] generates approximately $X billion annually, with [cuisine type] restaurants representing a growing segment. Post-pandemic dining trends show strong recovery with consumers prioritizing quality dining experiences.

Target Market Segments:
1. Primary (60%): Young professionals, 25-40, income $60K+
2. Secondary (25%): Families with children, seeking quality casual dining
3. Tertiary (15%): Special occasion diners and corporate clients

Market Size (TAM/SAM/SOM):
• TAM: $500M (total restaurant spending in metro area)
• SAM: $75M ([cuisine type] restaurants in target neighborhoods)
• SOM: $2M (realistic capture in Year 1-2)

Competitive Analysis:
| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| [Competitor 1] | Established brand | Outdated menu | Fresh, modern offerings |
| [Competitor 2] | Prime location | Poor service | Superior customer experience |
| [Competitor 3] | Large capacity | Generic food | Authentic, quality cuisine |

SWOT Analysis:
Strengths: Experienced team, unique concept, prime location
Weaknesses: New brand, limited initial capital
Opportunities: Growing demand for quality dining, catering market
Threats: Economic downturn, rising food costs, labor shortages`,
    organization: `Management Team:

Executive Chef / Co-Owner: [Name]
• 15 years culinary experience at Michelin-starred restaurants
• Culinary Institute of America graduate
• Expertise in [cuisine type]

General Manager / Co-Owner: [Name]
• 10 years restaurant management experience
• MBA in Hospitality Management
• Previous experience: [Notable restaurants]

Staff Structure:
• Kitchen Staff (12): Executive Chef, Sous Chef, Line Cooks (6), Prep Cooks (2), Dishwashers (2)
• Front of House (15): General Manager, Assistant Manager, Servers (8), Host (2), Bartenders (2)
• Part-time/Seasonal Staff: 5-8 as needed

Advisors:
• [Name], Former restaurant owner with 3 successful exits
• [Name], Food & Beverage industry consultant
• [Name], CPA specializing in restaurant accounting

Company Culture:
We believe in creating a family-like environment where every team member is valued. Our core values include:
• Quality first in everything we do
• Genuine hospitality and service excellence
• Continuous learning and improvement
• Sustainability and community involvement`,
    products: `Menu Overview:
Our menu features [X] carefully crafted dishes that showcase authentic [cuisine] flavors while accommodating modern dietary preferences.

Menu Categories:
1. Appetizers ($8-16): 10 options including vegetarian/vegan choices
2. Main Courses ($18-38): 15 signature dishes
3. Desserts ($8-14): 6 house-made options
4. Beverages: Full bar, curated wine list (40+ selections), craft cocktails

Signature Dishes:
• [Signature Dish 1] - $28 (projected bestseller)
• [Signature Dish 2] - $24
• [Signature Dish 3] - $32

Pricing Strategy:
• Food cost target: 28-32%
• Beverage cost target: 20-25%
• Menu pricing based on ingredient cost, preparation time, and market comparison

Dietary Accommodations:
• Vegetarian options: 30% of menu
• Vegan options: 15% of menu
• Gluten-free options: 25% of menu
• Allergen information clearly marked

Seasonal Updates:
Menu will be refreshed quarterly with 3-4 seasonal specials to maintain customer interest and utilize peak-season ingredients.`,
    marketing: `Brand Positioning:
[Restaurant Name] positions itself as the go-to destination for authentic [cuisine] dining in [location], targeting discerning diners who value quality, ambiance, and exceptional service.

Marketing Channels:
1. Digital Marketing (40% of budget - $24,000/year)
   • Social media (Instagram, Facebook, TikTok)
   • Google My Business optimization
   • Email marketing campaigns
   • Influencer partnerships

2. Local Marketing (30% of budget - $18,000/year)
   • Community event sponsorships
   • Local publication advertising
   • Chamber of Commerce membership
   • Networking events

3. PR & Events (20% of budget - $12,000/year)
   • Grand opening event
   • Food blogger outreach
   • Press releases and media coverage
   • Seasonal tasting events

4. Loyalty & Referral (10% of budget - $6,000/year)
   • Loyalty program with points/rewards
   • Referral bonuses
   • Birthday/anniversary specials

Customer Acquisition Cost (CAC): $25
Customer Lifetime Value (LTV): $450
LTV:CAC Ratio: 18:1

Sales Strategy:
• Week 1-4: Soft opening with friends & family
• Month 2: Grand opening with media event
• Ongoing: Weekly specials, happy hours, private events`,
    funding: `Funding Requirements:
Total capital needed: $350,000

Use of Funds:
| Category | Amount | Percentage |
|----------|--------|------------|
| Leasehold improvements | $120,000 | 34% |
| Kitchen equipment | $80,000 | 23% |
| Furniture & fixtures | $45,000 | 13% |
| Initial inventory | $25,000 | 7% |
| Working capital (6 months) | $50,000 | 14% |
| Marketing & grand opening | $20,000 | 6% |
| Licenses, permits, legal | $10,000 | 3% |

Funding Sources:
• Owner equity: $100,000 (29%)
• SBA 7(a) loan: $175,000 (50%)
• Private investors: $75,000 (21%)

Investor Returns:
• Projected ROI: 25% annually starting Year 2
• Investor equity stake: 15% for $75,000 investment
• Preferred return: 8% annually
• Exit strategy: Buyout option at Year 5 at 3x revenue multiple

Loan Terms:
• SBA 7(a): 10-year term, 6.5% interest
• Monthly payment: $1,985
• Collateral: Equipment and personal guarantee`,
    financials: `Revenue Projections:
| Year | Revenue | Expenses | Net Profit | Margin |
|------|---------|----------|------------|--------|
| Year 1 | $850,000 | $765,000 | $85,000 | 10% |
| Year 2 | $1,100,000 | $935,000 | $165,000 | 15% |
| Year 3 | $1,350,000 | $1,080,000 | $270,000 | 20% |

Monthly Projections (Year 1):
| Month | Revenue | Food Cost | Labor | Overhead | Net |
|-------|---------|-----------|-------|----------|-----|
| M1-2 | $45,000 | $14,400 | $18,000 | $15,000 | -$2,400 |
| M3-4 | $60,000 | $18,600 | $21,000 | $15,000 | $5,400 |
| M5-6 | $72,000 | $22,320 | $24,000 | $15,000 | $10,680 |
| M7-12 | $85,000 | $25,500 | $26,000 | $15,000 | $18,500 |

Key Financial Metrics:
• Average check: $42
• Table turnover: 2.5x dinner, 3x lunch
• Food cost: 30%
• Labor cost: 32%
• Occupancy cost: 8%
• Operating margin: 10-20%

Break-Even Analysis:
• Monthly break-even: $63,500
• Average covers to break even: 1,512/month (50/day)
• Break-even point: Month 8

Cash Flow Assumptions:
• 95% of sales in cash/credit (immediate)
• 30-day terms with major suppliers
• Quarterly tax payments
• Equipment depreciation: 7 years`
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    icon: Laptop,
    description: 'SaaS, app, or technology company',
    executiveSummary: `[Company Name] is a B2B SaaS platform that helps [target customers] solve [specific problem] through our innovative [solution description]. Our AI-powered platform reduces [pain point] by up to 70% while increasing [benefit] by 3x.

Key Metrics & Highlights:
• Current MRR: $[X] with 40% month-over-month growth
• Total users: [X] across [X] paying customers
• Market opportunity: $[X]B TAM growing at 25% CAGR
• Seeking: $2M Seed round at $10M pre-money valuation
• Runway: 18 months post-funding

Our founding team brings deep domain expertise from [relevant companies/experience]. We've achieved product-market fit with a Net Promoter Score of 72 and 95% customer retention rate. With this funding, we will scale our sales team, expand product features, and capture the rapidly growing market opportunity.`,
    businessDescription: `[Company Name] is a cloud-based SaaS platform that revolutionizes how [target market] manages [specific workflow/process].

Product Overview:
Our platform consists of three core modules:
1. [Module 1]: Automates [specific task] using machine learning
2. [Module 2]: Provides real-time analytics and insights
3. [Module 3]: Enables seamless collaboration and workflow management

Technology Stack:
• Frontend: React.js with TypeScript
• Backend: Node.js microservices on AWS
• Database: PostgreSQL with Redis caching
• AI/ML: Python with TensorFlow
• Infrastructure: Kubernetes, Docker, CI/CD pipeline

Business Model:
• Subscription-based SaaS (monthly/annual plans)
• Tiered pricing: Starter ($49/mo), Professional ($149/mo), Enterprise (custom)
• Average contract value: $15,000/year
• Gross margin: 85%

Revenue Streams:
• Subscription revenue (80%)
• Implementation & onboarding fees (10%)
• API access & integrations (10%)

Current Traction:
• 150+ paying customers
• $180K ARR
• 15% monthly growth rate
• <2% monthly churn`,
    marketAnalysis: `Market Overview:
The global [industry] software market is valued at $[X]B and projected to reach $[X]B by 2028, representing a CAGR of 25%.

Market Drivers:
• Digital transformation acceleration post-COVID
• Increasing demand for automation and efficiency
• Growing adoption of AI/ML in enterprise software
• Remote work driving cloud software adoption

Target Market:
Primary: Mid-market companies (100-1000 employees)
• 50,000+ potential customers in North America
• Average technology budget: $500K-$2M annually

Market Size:
• TAM: $15B (global [industry] software)
• SAM: $3B (North American mid-market)
• SOM: $150M (achievable in 5 years)

Competitive Landscape:
| Competitor | Valuation | Weakness | Our Advantage |
|------------|-----------|----------|---------------|
| [Legacy Co] | $500M | Outdated UX | Modern, intuitive platform |
| [Startup A] | $50M | Limited features | Comprehensive solution |
| [Startup B] | $30M | Poor support | White-glove onboarding |

Competitive Advantages:
1. Proprietary AI technology (3 patents pending)
2. 10x faster implementation than competitors
3. Industry-specific customization
4. Superior customer success program`,
    organization: `Founding Team:

CEO: [Name]
• 10+ years in [industry]
• Previously: VP Product at [Notable Company]
• Stanford MBA, MIT Computer Science

CTO: [Name]
• 15 years software engineering
• Previously: Principal Engineer at [FAANG]
• Built systems processing 1B+ transactions/day

VP Sales: [Name]
• $50M+ enterprise sales experience
• Previously: Regional Director at Salesforce
• Track record of 150%+ quota attainment

Current Team (15 employees):
• Engineering: 8 (5 backend, 2 frontend, 1 DevOps)
• Sales & Marketing: 4
• Customer Success: 2
• Operations: 1

Hiring Plan (Post-Funding):
Q1: 5 engineers, 2 sales reps
Q2: 3 engineers, 2 sales reps, 1 marketing
Q3-Q4: 5 engineers, 3 sales reps, 2 customer success

Advisory Board:
• [Name] - Former CTO of [Major Company]
• [Name] - Partner at [VC Firm]
• [Name] - Industry expert with 25+ years experience

Equity Pool:
• 20% reserved for employee stock options
• Standard 4-year vesting with 1-year cliff`,
    products: `Product Suite:

Core Platform Features:
1. Dashboard & Analytics
   • Real-time metrics and KPIs
   • Custom report builder
   • Automated alerts and notifications

2. AI-Powered Automation
   • Intelligent workflow automation
   • Predictive analytics
   • Natural language processing

3. Collaboration Tools
   • Team workspaces
   • Document sharing and version control
   • Integrated communication

4. Integration Hub
   • 50+ native integrations (Salesforce, HubSpot, Slack, etc.)
   • REST API for custom integrations
   • Webhook support

Pricing Tiers:
| Plan | Price | Users | Features |
|------|-------|-------|----------|
| Starter | $49/mo | 5 | Core features |
| Professional | $149/mo | 25 | + AI features, integrations |
| Enterprise | Custom | Unlimited | + SSO, SLA, dedicated support |

Product Roadmap:
Q1 2024: Mobile app launch, 20 new integrations
Q2 2024: Advanced AI features, industry templates
Q3 2024: Enterprise security features (SOC 2 Type II)
Q4 2024: International expansion features

Technology Moat:
• 3 patents pending on core AI algorithms
• Proprietary data model built on 2 years of customer data
• 99.99% uptime SLA with multi-region deployment`,
    marketing: `Go-to-Market Strategy:

Target Buyer Personas:
1. VP of Operations - Primary decision maker
2. IT Director - Technical evaluator
3. C-Suite - Budget approver

Marketing Channels:
1. Content Marketing (30% of spend)
   • SEO-optimized blog (50+ articles)
   • Whitepapers and case studies
   • Webinar series (monthly)

2. Paid Acquisition (35% of spend)
   • Google Ads (branded + category keywords)
   • LinkedIn Ads (account-based marketing)
   • Retargeting campaigns

3. Events & Partnerships (20% of spend)
   • Industry conferences (3-4/year)
   • Partner channel program
   • Community building

4. Sales Team (15% of spend)
   • Outbound SDR team
   • Account executives for demos
   • Customer success for expansion

Customer Acquisition:
• Current CAC: $3,500
• Target CAC: $2,500 (with scale)
• LTV: $45,000 (3-year average)
• LTV:CAC Ratio: 12.8:1

Sales Cycle:
• Average: 45 days
• Starter: 14 days (self-serve)
• Enterprise: 90 days (high-touch)`,
    funding: `Funding Round: Seed

Raising: $2,000,000
Pre-Money Valuation: $10,000,000
Post-Money Valuation: $12,000,000

Use of Funds:
| Category | Amount | Percentage |
|----------|--------|------------|
| Engineering & Product | $800,000 | 40% |
| Sales & Marketing | $700,000 | 35% |
| Operations & Infrastructure | $300,000 | 15% |
| G&A / Buffer | $200,000 | 10% |

Milestone-Based Deployment:
• Months 1-6: Hire core team, launch v2.0
• Months 7-12: Scale sales, hit $1M ARR
• Months 13-18: Expand market, prepare Series A

Cap Table (Post-Round):
| Stakeholder | Ownership |
|-------------|-----------|
| Founders | 60% |
| Seed Investors | 16.7% |
| Employee Pool | 20% |
| Advisors | 3.3% |

Previous Funding:
• Pre-seed: $500K from angels (2022)
• Grants: $100K from [Accelerator]

Investor Rights:
• Board seat for lead investor
• Pro-rata rights for follow-on
• Standard protective provisions`,
    financials: `Financial Projections:

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| ARR | $500K | $2M | $6M |
| MRR Growth | 15% | 12% | 10% |
| Customers | 100 | 350 | 900 |
| Employees | 25 | 50 | 100 |
| Burn Rate | $150K/mo | $250K/mo | $350K/mo |

Unit Economics:
• Monthly ARPU: $400
• Gross Margin: 85%
• Net Revenue Retention: 115%
• CAC Payback: 9 months

Revenue Breakdown (Year 3):
• Subscription: $5.1M (85%)
• Services: $600K (10%)
• API/Usage: $300K (5%)

Expense Breakdown (Year 1):
• Personnel: 65% ($975K)
• Infrastructure: 12% ($180K)
• Marketing: 15% ($225K)
• G&A: 8% ($120K)

Path to Profitability:
• Break-even ARR: $4M
• Projected break-even: Month 30
• Long-term margin target: 20%

Key Assumptions:
• 15% monthly growth in Year 1
• 90% annual gross retention
• $3,000 average CAC
• 36-month average customer lifetime`
  },
  {
    id: 'retail',
    name: 'Retail Store',
    icon: ShoppingBag,
    description: 'Brick-and-mortar or e-commerce retail',
    executiveSummary: `[Store Name] is a [retail category] store serving [target demographic] in [location]. We offer a curated selection of [products] that combine quality, style, and value in an engaging shopping experience.

Business Highlights:
• Store size: 2,500 sq ft in high-traffic shopping district
• Product lines: [X] brands, [X]+ SKUs
• Target revenue: $600,000 Year 1
• Gross margin: 55%
• Break-even: Month 6

Our omnichannel approach combines an inviting physical store with a robust e-commerce platform, allowing customers to shop however they prefer. With [X] years of retail experience and deep supplier relationships, we're positioned to become the go-to destination for [product category] in [market area].`,
    businessDescription: `[Store Name] operates as a specialty retail store focusing on [product category].

Retail Format:
• Primary: 2,500 sq ft flagship store in [location]
• Secondary: E-commerce website (Shopify-based)
• Future: Pop-up locations at seasonal events

Product Categories:
1. [Category 1] - 40% of inventory
2. [Category 2] - 30% of inventory
3. [Category 3] - 20% of inventory
4. Accessories & add-ons - 10% of inventory

Supplier Network:
• 25+ established vendor relationships
• Mix of wholesale, consignment, and direct-to-consumer brands
• Average payment terms: Net 30

Operating Model:
• Store hours: 10 AM - 8 PM (Mon-Sat), 11 AM - 6 PM (Sun)
• E-commerce: 24/7 with same-day local delivery option
• Staff: 1 manager, 4 full-time, 6 part-time associates

Location Details:
• Main Street location with 15,000 daily foot traffic
• Adjacent to complementary businesses
• 3-year lease with 2 renewal options`,
    marketAnalysis: `Industry Overview:
The [product category] retail market is valued at $[X]B with [X]% annual growth driven by [trends].

Local Market Analysis:
• Population within 10-mile radius: 250,000
• Average household income: $85,000
• Target demographic concentration: High

Target Customer Profile:
• Age: 25-45
• Income: $60,000+
• Values: Quality, sustainability, local business
• Shopping behavior: Mix of planned and impulse purchases

Market Size:
• TAM: $50M (regional market)
• SAM: $15M (target demographic spending)
• SOM: $1.5M (realistic Year 3 capture)

Competitive Analysis:
Direct Competitors:
• [Competitor 1]: National chain, lower prices, impersonal
• [Competitor 2]: Local boutique, limited selection
• [Competitor 3]: Online-only, no local presence

Our Differentiation:
• Curated, unique product selection
• Exceptional customer service and expertise
• Community-focused events and programming
• Seamless omnichannel experience`,
    organization: `Ownership & Management:

Owner/Operator: [Name]
• 12 years retail management experience
• Previously: Store Manager at [Major Retailer]
• Buyer experience with strong vendor relationships

Store Manager: [Name]
• 8 years specialty retail experience
• Visual merchandising expertise
• Staff training and development focus

Staff Structure:
• Store Manager (1)
• Full-time Associates (4)
• Part-time Associates (6)
• Seasonal Staff (2-4)

Organizational Values:
• Customer-first mentality
• Product expertise and education
• Community involvement
• Continuous improvement

Training Program:
• 40-hour onboarding program
• Monthly product knowledge sessions
• Quarterly sales training
• Annual team development retreat`,
    products: `Product Assortment:

Core Categories:
1. [Main Category] ($20-200 price range)
   • 500+ SKUs
   • 60% of revenue
   
2. [Secondary Category] ($15-150)
   • 300+ SKUs
   • 25% of revenue

3. [Accessories] ($5-75)
   • 200+ SKUs
   • 15% of revenue

Pricing Strategy:
• Competitive with specialty retailers
• Keystone markup (2x wholesale) baseline
• Premium positioning for exclusive items
• Regular promotions (20-30% off select items)

Inventory Management:
• Turn rate target: 4x annually
• Minimum stock levels by category
• Seasonal planning (4 seasons + holidays)
• Clearance strategy for aging inventory

Exclusive/Private Label:
• 15% of assortment planned as exclusive
• Private label development in Year 2
• Higher margins (65% vs 50%)

Product Sourcing:
• 60% domestic suppliers
• 30% imported (direct relationships)
• 10% local artisan/maker partnerships`,
    marketing: `Brand Strategy:
Position [Store Name] as the trusted local authority for [product category], emphasizing expertise, curation, and community connection.

Marketing Mix:

1. Digital Marketing (35% - $21,000/year)
   • Social media (Instagram, Facebook, Pinterest)
   • Google Ads (local search focus)
   • Email marketing (weekly newsletter)
   • Influencer partnerships

2. Local Marketing (30% - $18,000/year)
   • Local event sponsorships
   • Print advertising in local publications
   • Chamber of Commerce membership
   • Cross-promotions with neighbors

3. In-Store Experience (20% - $12,000/year)
   • Visual merchandising updates
   • Events and workshops (monthly)
   • Loyalty program
   • Exceptional service training

4. PR & Community (15% - $9,000/year)
   • Grand opening event
   • Charitable partnerships
   • Local media outreach
   • Community board/event hosting

Customer Acquisition:
• CAC: $15 (blended)
• Average transaction: $65
• Customer lifetime value: $520
• Repeat customer rate target: 60%`,
    funding: `Startup Capital Required: $175,000

Sources of Funding:
• Owner investment: $75,000 (43%)
• SBA Microloan: $60,000 (34%)
• Friends & Family: $40,000 (23%)

Use of Funds:
| Category | Amount | % |
|----------|--------|---|
| Inventory | $60,000 | 34% |
| Leasehold improvements | $40,000 | 23% |
| Fixtures & displays | $25,000 | 14% |
| POS & technology | $10,000 | 6% |
| Working capital | $25,000 | 14% |
| Marketing/launch | $10,000 | 6% |
| Legal/permits | $5,000 | 3% |

Loan Terms:
• SBA Microloan: 6-year term, 7.5% interest
• Monthly payment: $1,040

Exit Strategy:
• Build to 3 locations over 7 years
• Potential acquisition by regional chain
• Franchise model exploration`,
    financials: `Revenue Projections:
| Year | Revenue | COGS | Gross Profit | Net Income |
|------|---------|------|--------------|------------|
| Year 1 | $600,000 | $270,000 | $330,000 | $45,000 |
| Year 2 | $780,000 | $343,000 | $437,000 | $85,000 |
| Year 3 | $975,000 | $419,000 | $556,000 | $140,000 |

Monthly Projections (Year 1):
• Months 1-3: $35,000/mo (ramp-up)
• Months 4-6: $45,000/mo
• Months 7-9: $50,000/mo
• Months 10-12: $60,000/mo (holiday peak)

Key Metrics:
• Gross margin: 55%
• Operating margin: 7.5% (Year 1)
• Inventory turns: 4x annually
• Sales per sq ft: $240
• Average transaction: $65

Operating Expenses (Monthly):
• Rent: $4,500
• Payroll: $12,000
• Utilities: $800
• Insurance: $400
• Marketing: $1,500
• Other: $1,800
• Total: $21,000

Break-Even Analysis:
• Monthly break-even: $38,000
• Break-even point: Month 6
• Daily sales needed: $1,267`
  },
  {
    id: 'consulting',
    name: 'Consulting Firm',
    icon: Building2,
    description: 'Professional services and consulting',
    executiveSummary: `[Firm Name] is a boutique consulting firm specializing in [area of expertise] for [target clients]. We help organizations [key outcome] through our proven methodologies and deep industry expertise.

Firm Highlights:
• Founding team: [X] years combined experience
• Target clients: [Industry] companies with $10M-$500M revenue
• Service offerings: Strategy, operations, technology consulting
• Year 1 revenue target: $750,000
• Target utilization rate: 70%
• Average project size: $75,000

Our differentiation lies in [unique value proposition]. With established relationships and a track record of delivering [specific results], we are positioned to capture significant share of the growing consulting market.`,
    businessDescription: `[Firm Name] provides management consulting services to [target industry] companies seeking to [primary client objective].

Service Lines:
1. Strategic Advisory (40% of revenue)
   • Market entry strategy
   • Competitive analysis
   • Growth planning

2. Operational Excellence (35% of revenue)
   • Process optimization
   • Cost reduction programs
   • Performance improvement

3. Technology & Digital (25% of revenue)
   • Digital transformation
   • Technology selection
   • Implementation support

Engagement Models:
• Project-based: Fixed fee for defined deliverables
• Retainer: Monthly advisory for ongoing support
• Value-based: Success fees tied to outcomes

Billing Rates:
• Partner: $500/hour
• Senior Consultant: $350/hour
• Consultant: $250/hour
• Analyst: $150/hour`,
    marketAnalysis: `Industry Overview:
The management consulting market is valued at $300B globally, with the [specialty] segment growing at 8% annually.

Target Market:
• Primary: Mid-market [industry] companies ($10M-$500M revenue)
• Geography: [Region/National]
• Estimated target companies: 5,000+

Market Drivers:
• Increasing complexity requiring external expertise
• Digital transformation demand
• Cost pressure driving efficiency initiatives
• Regulatory changes requiring compliance support

Competitive Landscape:
• Big 4 firms: Too expensive for mid-market
• Boutique competitors: Limited capabilities
• Independent consultants: Inconsistent quality

Our Position:
• Right-sized for mid-market needs
• Deep industry specialization
• Practical, implementable solutions
• Competitive pricing with premium results`,
    organization: `Partners:

Managing Partner: [Name]
• 20 years consulting experience (McKinsey, Deloitte)
• [Industry] sector expertise
• MBA, Harvard Business School

Partner: [Name]
• 15 years operations experience
• Former COO of [Notable Company]
• Six Sigma Black Belt

Team Structure (Year 1):
• Partners: 2
• Senior Consultants: 2
• Consultants: 2
• Analysts: 1
• Operations/Admin: 1

Growth Plan:
Year 2: Add 2 consultants, 1 analyst
Year 3: Add 1 partner, 3 consultants

Professional Development:
• Mentorship program
• Annual training budget
• Conference attendance
• Certification support`,
    products: `Service Portfolio:

1. Strategy Consulting
   • Corporate strategy
   • Market analysis
   • M&A due diligence
   • Typical engagement: 6-12 weeks, $50-150K

2. Operations Consulting
   • Process improvement
   • Supply chain optimization
   • Organizational design
   • Typical engagement: 8-16 weeks, $75-200K

3. Technology Consulting
   • Digital strategy
   • System selection/RFP
   • Implementation oversight
   • Typical engagement: 12-24 weeks, $100-300K

4. Advisory Retainers
   • Board advisory
   • Executive coaching
   • Ongoing strategic counsel
   • Monthly fee: $10-25K

Methodology:
• Proprietary frameworks and tools
• Data-driven approach
• Client capability building
• Knowledge transfer emphasis`,
    marketing: `Business Development Strategy:

1. Thought Leadership (30%)
   • Industry publications and whitepapers
   • Speaking engagements (8-10/year)
   • Podcast appearances
   • LinkedIn content strategy

2. Network & Referrals (40%)
   • Alumni network cultivation
   • Client referral program
   • Industry association involvement
   • Private equity relationships

3. Direct Outreach (20%)
   • Targeted account list (100 companies)
   • Executive networking events
   • Conference attendance
   • Warm introductions

4. Digital Presence (10%)
   • SEO-optimized website
   • Case study library
   • Email nurture campaigns
   • Webinar series

Sales Process:
• Average sales cycle: 60-90 days
• Typical close rate: 35%
• Key decision makers: CEO, CFO, COO`,
    funding: `Startup Capital: $200,000

Funding Sources:
• Partner contributions: $150,000 (75%)
• Line of credit: $50,000 (25%)

Use of Funds:
| Category | Amount |
|----------|--------|
| Operating capital (6 months) | $100,000 |
| Office setup & technology | $30,000 |
| Marketing & BD launch | $25,000 |
| Legal & professional | $15,000 |
| Insurance & compliance | $10,000 |
| Reserve | $20,000 |

Capital Requirements:
• Low capital intensity
• Cash flow positive by Month 9
• Self-funding growth thereafter

Partner Equity:
• Equal partnership (50/50)
• Profit-sharing based on contribution
• Buy-sell agreement in place`,
    financials: `Revenue Projections:
| Year | Revenue | Expenses | Net Profit | Margin |
|------|---------|----------|------------|--------|
| Year 1 | $750,000 | $600,000 | $150,000 | 20% |
| Year 2 | $1,500,000 | $1,050,000 | $450,000 | 30% |
| Year 3 | $2,500,000 | $1,625,000 | $875,000 | 35% |

Key Assumptions:
• Average billing rate: $300/hour
• Target utilization: 70%
• Average project size: $75,000
• Projects per year: 10 (Year 1), 20 (Year 2)

Monthly Operating Costs:
• Compensation: $40,000
• Office/overhead: $5,000
• Marketing: $3,000
• Technology: $1,500
• Insurance/professional: $1,000
• Total: $50,500

Break-Even:
• Monthly revenue needed: $72,000
• Billable hours needed: 240/month
• Break-even point: Month 6

Partner Compensation:
• Base: $120,000/year each
• Profit distribution: 50/50 above threshold`
  },
  {
    id: 'healthcare',
    name: 'Healthcare Practice',
    icon: Heart,
    description: 'Medical, dental, or wellness practice',
    executiveSummary: `[Practice Name] is a [specialty] healthcare practice dedicated to providing exceptional patient care in [location]. Our patient-centered approach combines advanced medical techniques with compassionate service.

Practice Highlights:
• Specialty: [Medical specialty]
• Capacity: [X] patients per day
• Providers: [X] physicians, [X] support staff
• Year 1 revenue projection: $1,200,000
• Target patient satisfaction: 95%+

With [X] years of clinical experience and a commitment to evidence-based care, we are positioned to become the leading [specialty] practice in [service area].`,
    businessDescription: `[Practice Name] operates as a [specialty] medical practice providing comprehensive care for [conditions/services].

Services Offered:
• Primary/preventive care
• Diagnostic services
• Treatment procedures
• Follow-up and monitoring

Patient Population:
• Primary: Adults 35-65
• Secondary: Seniors 65+
• Insurance mix: Private (60%), Medicare (30%), Self-pay (10%)

Practice Model:
• Fee-for-service with value-based components
• Accept 15+ insurance plans
• Telehealth options available
• Same-day appointments for urgent needs

Facility:
• 3,000 sq ft medical office
• 6 exam rooms
• On-site diagnostics
• ADA compliant`,
    marketAnalysis: `Healthcare Market Overview:
The [specialty] market is growing at 5% annually, driven by aging population and increased health awareness.

Service Area Analysis:
• Population: 150,000 within 15-mile radius
• Demographics: 22% over 55, growing
• Competitor practices: 4 in immediate area
• Underserved segments: [specific populations]

Patient Demand Drivers:
• Aging population
• Chronic disease prevalence
• Preventive care emphasis
• Access and convenience

Competitive Position:
• Modern facility and equipment
• Extended hours for convenience
• Shorter wait times (target: <15 min)
• Comprehensive services under one roof`,
    organization: `Medical Staff:

Lead Physician: [Name], MD
• Board certified in [specialty]
• 15 years clinical experience
• [Hospital/academic] affiliation

Associate Physician: [Name], MD/DO
• [Specialty] training
• 8 years experience
• Bilingual capability

Support Staff:
• Practice Manager (1)
• Medical Assistants (3)
• Front desk/scheduling (2)
• Billing specialist (1)

Quality & Compliance:
• HIPAA compliant operations
• Malpractice insurance coverage
• Regular staff training
• Patient safety protocols`,
    products: `Service Menu:

1. Office Visits
   • New patient evaluation: $200-300
   • Follow-up visits: $100-150
   • Annual wellness exams: $175

2. Diagnostic Services
   • Lab work (in-house): $50-200
   • Imaging referrals: Coordinated
   • Specialty testing: $100-500

3. Procedures
   • Minor procedures: $200-800
   • Specialized treatments: $500-2,000
   • Cosmetic services: Market rates

4. Chronic Disease Management
   • Monthly monitoring programs
   • Care coordination services
   • Patient education

Telehealth:
• Video visits: $75-100
• Follow-up consultations
• Prescription management`,
    marketing: `Patient Acquisition Strategy:

1. Physician Referrals (40%)
   • Relationship building with PCPs
   • Specialist network development
   • Referral tracking and follow-up

2. Digital Marketing (30%)
   • Google Ads (local search)
   • Healthgrades and Zocdoc profiles
   • Patient review management
   • Social media presence

3. Community Outreach (20%)
   • Health fairs and screenings
   • Community education seminars
   • Local partnership sponsorships

4. Patient Retention (10%)
   • Recall and reminder systems
   • Patient satisfaction surveys
   • Loyalty/referral programs

Patient Experience Focus:
• Online scheduling
• Minimal wait times
• Clear communication
• Follow-up care coordination`,
    funding: `Startup Capital Required: $400,000

Funding Structure:
• Physician investment: $150,000
• Medical practice loan: $200,000
• Equipment financing: $50,000

Use of Funds:
| Category | Amount |
|----------|--------|
| Leasehold improvements | $100,000 |
| Medical equipment | $120,000 |
| IT and EMR system | $40,000 |
| Initial working capital | $80,000 |
| Marketing/launch | $30,000 |
| Licensing/credentialing | $30,000 |

Financing Terms:
• Practice loan: 7-year, 6.5%
• Equipment: 5-year lease
• Monthly debt service: $4,500`,
    financials: `Financial Projections:
| Year | Revenue | Expenses | Net Income | Margin |
|------|---------|----------|------------|--------|
| Year 1 | $1,200,000 | $1,020,000 | $180,000 | 15% |
| Year 2 | $1,600,000 | $1,280,000 | $320,000 | 20% |
| Year 3 | $2,000,000 | $1,500,000 | $500,000 | 25% |

Revenue Per Provider:
• Target: $600,000/year per physician
• Patient visits: 20/day average
• Average revenue per visit: $150

Operating Expenses:
• Physician compensation: 40%
• Staff salaries: 20%
• Rent and facilities: 10%
• Supplies and equipment: 8%
• Insurance: 7%
• Administrative: 15%

Key Metrics:
• Patients per day: 40 (2 providers)
• Collection rate: 95%
• Days in A/R: 35
• Patient satisfaction: 95%+`
  },
  {
    id: 'education',
    name: 'Education/Training',
    icon: GraduationCap,
    description: 'Tutoring, training center, or online courses',
    executiveSummary: `[Company Name] is an education company providing [type of instruction] to [target students] through [delivery method]. Our proven methodology has helped [number] students achieve [specific outcomes].

Business Highlights:
• Programs: [X] courses/programs offered
• Delivery: In-person and online options
• Student capacity: [X] per month
• Year 1 revenue target: $400,000
• Student success rate: 90%+

With experienced instructors and a curriculum designed for results, we are positioned to capture growing demand for quality [subject area] education.`,
    businessDescription: `[Company Name] delivers educational services focused on [subject/skill area].

Program Offerings:
1. Core Programs
   • Beginner courses
   • Intermediate programs
   • Advanced/certification prep

2. Delivery Methods
   • In-person classes
   • Live online instruction
   • Self-paced courses
   • Hybrid options

3. Target Students
   • K-12 supplemental education
   • College prep
   • Professional development
   • Corporate training

Facility/Platform:
• 2,000 sq ft learning center (if applicable)
• Proprietary online learning platform
• Small class sizes (max 8:1 ratio)
• Modern technology and resources`,
    marketAnalysis: `Education Market:
The [education segment] market is valued at $[X]B, growing at [X]% annually.

Target Market:
• Local population: [X] families with school-age children
• Corporate clients: [X] companies seeking training
• Online reach: National potential

Market Drivers:
• Academic achievement pressure
• Skills gap in workforce
• Remote learning acceptance
• Lifelong learning trend

Competitive Analysis:
• National chains: Standardized, less personalized
• Individual tutors: Inconsistent quality
• Online-only: Limited engagement
• Our advantage: Best of all approaches`,
    organization: `Team:

Founder/Lead Instructor: [Name]
• [X] years teaching experience
• [Credentials/degrees]
• Curriculum development expertise

Program Director: [Name]
• Educational program management
• Student success tracking
• Quality assurance

Instructors (4-6):
• Subject matter experts
• Background checked
• Ongoing training

Support Staff:
• Administrative coordinator
• Marketing/enrollment
• IT support (part-time)`,
    products: `Program Catalog:

1. Academic Tutoring
   • Math (all levels): $60-80/hour
   • Science: $60-80/hour
   • Test prep (SAT/ACT): $75-100/hour

2. Skills Training
   • Coding bootcamps: $2,000-5,000
   • Professional certifications: $500-1,500
   • Workshop series: $200-400

3. Corporate Training
   • On-site programs: Custom pricing
   • Team development: $5,000-20,000
   • Executive coaching: $200-400/hour

4. Online Courses
   • Self-paced programs: $99-499
   • Subscription access: $29/month
   • Live cohorts: $299-999

Pricing Strategy:
• Competitive with quality providers
• Package discounts (10-20%)
• Scholarship fund: 10% of students`,
    marketing: `Student Acquisition:

1. Local Marketing (40%)
   • School partnerships
   • Community events
   • Parent network outreach
   • Local advertising

2. Digital Marketing (35%)
   • Google Ads (local search)
   • Social media (Facebook, Instagram)
   • Content marketing (blog, YouTube)
   • Email nurture campaigns

3. Referral Program (15%)
   • Current student referrals
   • Alumni network
   • Free trial sessions

4. Corporate Development (10%)
   • HR department outreach
   • Industry partnerships
   • Lunch-and-learn demos

Student Lifecycle:
• Trial session → Enrollment → Programs → Advocacy
• Retention focus: 80% re-enrollment target`,
    funding: `Startup Capital: $150,000

Funding Sources:
• Owner investment: $80,000
• Small business loan: $50,000
• Education grants: $20,000

Use of Funds:
| Category | Amount |
|----------|--------|
| Facility setup | $40,000 |
| Technology/platform | $30,000 |
| Curriculum development | $20,000 |
| Marketing launch | $25,000 |
| Working capital | $25,000 |
| Legal/licensing | $10,000 |

Cash Flow:
• Revenue begins Month 2
• Break-even by Month 8
• Self-sustaining Year 2`,
    financials: `Financial Projections:
| Year | Revenue | Expenses | Net Profit | Margin |
|------|---------|----------|------------|--------|
| Year 1 | $400,000 | $340,000 | $60,000 | 15% |
| Year 2 | $650,000 | $520,000 | $130,000 | 20% |
| Year 3 | $950,000 | $712,000 | $238,000 | 25% |

Revenue Mix:
• Individual tutoring: 50%
• Group programs: 25%
• Online courses: 15%
• Corporate: 10%

Key Metrics:
• Average student value: $1,200/year
• Student acquisition cost: $50
• Retention rate: 80%
• Instructor utilization: 75%

Operating Costs:
• Instructor compensation: 45%
• Facility: 15%
• Marketing: 12%
• Technology: 8%
• Admin: 20%`
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    description: 'Product manufacturing or production',
    executiveSummary: `[Company Name] manufactures [product type] for [target market]. Our state-of-the-art facility produces high-quality products at competitive prices with a focus on [key differentiator: sustainability, customization, speed, etc.].

Business Highlights:
• Product lines: [X] SKUs across [X] categories
• Production capacity: [X] units per month
• Target markets: [Industries/geographies]
• Year 1 revenue: $2,000,000
• Gross margin: 35%

With experienced operations leadership and established supplier relationships, we are positioned to capture growing demand in the [industry] manufacturing sector.`,
    businessDescription: `[Company Name] operates a manufacturing facility producing [products].

Product Lines:
1. [Product Line 1] - Flagship
2. [Product Line 2] - Growth
3. [Product Line 3] - Emerging

Manufacturing Capabilities:
• [Process type] manufacturing
• Custom/made-to-order options
• Quick turnaround capability
• Quality certifications (ISO, etc.)

Facility:
• 15,000 sq ft production facility
• Modern equipment and machinery
• Expansion capacity to 25,000 sq ft

Distribution:
• Direct to OEMs
• Distributor network
• E-commerce for small orders`,
    marketAnalysis: `Industry Overview:
The [product] manufacturing market is valued at $[X]B with [X]% growth.

Target Markets:
• OEM customers: [X] companies
• Distributors: Regional and national
• Direct customers: Small businesses

Competitive Position:
• Smaller than industry giants (nimble)
• Larger than job shops (capacity)
• Regional focus for service advantage

Key Success Factors:
• Quality consistency
• On-time delivery (95%+)
• Competitive pricing
• Technical support`,
    organization: `Management Team:

CEO/Owner: [Name]
• 20 years manufacturing experience
• Operations expertise
• Industry relationships

Operations Manager: [Name]
• Production management
• Lean manufacturing certification
• Quality systems experience

Staff:
• Production workers: 12
• Quality control: 2
• Shipping/receiving: 2
• Administrative: 2
• Sales: 2`,
    products: `Product Portfolio:

Standard Products:
• [Product A]: $[X] per unit
• [Product B]: $[X] per unit
• [Product C]: $[X] per unit

Custom Manufacturing:
• Engineering support
• Prototype development
• Production runs

Quality Standards:
• ISO 9001 certified
• Industry-specific certifications
• In-process quality checks
• Final inspection protocols

Lead Times:
• Stock items: 2-3 days
• Standard orders: 2-3 weeks
• Custom products: 4-6 weeks`,
    marketing: `Sales Strategy:

1. Direct Sales (60%)
   • Outside sales team
   • Trade show presence
   • Key account management

2. Distributor Network (25%)
   • Regional distributors
   • Industry-specific partners

3. Inside Sales (10%)
   • Inbound lead handling
   • Customer service
   • Reorder management

4. Digital/Marketing (5%)
   • Industry directories
   • Website and SEO
   • Trade publications

Customer Retention:
• Technical support
• Quality guarantees
• Volume pricing programs
• Quick response capability`,
    funding: `Capital Requirements: $750,000

Funding Structure:
• Owner equity: $250,000
• SBA loan: $400,000
• Equipment financing: $100,000

Use of Funds:
| Category | Amount |
|----------|--------|
| Equipment/machinery | $350,000 |
| Facility improvements | $100,000 |
| Initial inventory | $150,000 |
| Working capital | $100,000 |
| Setup costs | $50,000 |

Loan Terms:
• SBA: 10-year, 7% interest
• Equipment: 5-year lease`,
    financials: `Financial Projections:
| Year | Revenue | COGS | Gross Profit | Net Income |
|------|---------|------|--------------|------------|
| Year 1 | $2,000,000 | $1,300,000 | $700,000 | $150,000 |
| Year 2 | $3,000,000 | $1,890,000 | $1,110,000 | $350,000 |
| Year 3 | $4,500,000 | $2,745,000 | $1,755,000 | $650,000 |

Key Metrics:
• Gross margin: 35%
• Operating margin: 7.5%
• Inventory turns: 6x
• Capacity utilization: 70%

Operating Costs:
• Direct labor: 25%
• Materials: 40%
• Overhead: 12%
• SG&A: 15%
• R&D: 3%`
  },
  {
    id: 'logistics',
    name: 'Logistics/Delivery',
    icon: Truck,
    description: 'Delivery service, freight, or logistics',
    executiveSummary: `[Company Name] provides [logistics services] to [target customers] in [service area]. We specialize in [specific service] with a focus on reliability, technology integration, and customer service.

Key Highlights:
• Fleet: [X] vehicles
• Service area: [Geographic coverage]
• Capacity: [X] deliveries/shipments per day
• Year 1 revenue target: $1,500,000
• On-time delivery rate: 98%+

With experienced logistics leadership and modern fleet technology, we deliver superior service at competitive rates.`,
    businessDescription: `[Company Name] operates logistics and delivery services.

Service Offerings:
• Local delivery (same-day/next-day)
• Regional freight
• Last-mile delivery
• Warehousing/fulfillment

Fleet:
• Vans: [X] vehicles
• Trucks: [X] vehicles
• Specialized equipment

Technology:
• GPS tracking and routing
• Real-time delivery updates
• Electronic proof of delivery
• Customer portal

Service Area:
• Primary: [Local metro]
• Secondary: [Regional]
• Expansion: [Future markets]`,
    marketAnalysis: `Logistics Market:
The logistics market is growing at 8% annually, driven by e-commerce and demand for faster delivery.

Target Customers:
• E-commerce businesses
• Retailers requiring delivery
• Healthcare/medical
• B2B distributors

Competitive Advantages:
• Local market knowledge
• Flexible, responsive service
• Technology-enabled operations
• Competitive pricing

Market Size:
• TAM: $50M (regional logistics)
• SAM: $15M (target segments)
• SOM: $3M (Year 3)`,
    organization: `Leadership:

Owner/GM: [Name]
• 15 years logistics experience
• Operations management background
• CDL certified

Operations Manager: [Name]
• Fleet management expertise
• Routing optimization
• Driver management

Team:
• Drivers: 10
• Dispatch: 2
• Warehouse: 3
• Admin/sales: 2`,
    products: `Service Menu:

1. Local Delivery
   • Same-day: $15-50
   • Next-day: $10-35
   • Scheduled: $8-25

2. Freight Services
   • LTL: $0.50-1.50/mile
   • FTL: Custom quote
   • Expedited: Premium rates

3. Fulfillment
   • Storage: $25/pallet/month
   • Pick/pack: $2-5/order
   • Integration: Monthly fee

4. Specialty Services
   • White glove delivery
   • Temperature controlled
   • Oversized items

Pricing Model:
• Per-delivery for local
• Per-mile for freight
• Monthly contracts available`,
    marketing: `Customer Acquisition:

1. Direct Sales (50%)
   • Business development team
   • Industry networking
   • Cold outreach

2. Partnerships (30%)
   • E-commerce platforms
   • Complementary businesses
   • Referral agreements

3. Digital (15%)
   • Local SEO
   • Google Ads
   • Industry directories

4. Retention (5%)
   • Account management
   • Service quality focus
   • Loyalty pricing

Key Relationships:
• E-commerce shippers
• Retail chains
• Healthcare providers
• Manufacturing/distribution`,
    funding: `Startup Capital: $500,000

Funding Sources:
• Owner investment: $150,000
• Vehicle financing: $250,000
• Working capital loan: $100,000

Use of Funds:
| Category | Amount |
|----------|--------|
| Vehicles (5 vans, 2 trucks) | $300,000 |
| Technology/systems | $50,000 |
| Warehouse setup | $75,000 |
| Working capital | $50,000 |
| Insurance/licensing | $25,000 |

Vehicle Terms:
• 5-year financing at 6%
• Monthly: $5,500`,
    financials: `Financial Projections:
| Year | Revenue | Expenses | Net Profit | Margin |
|------|---------|----------|------------|--------|
| Year 1 | $1,500,000 | $1,350,000 | $150,000 | 10% |
| Year 2 | $2,250,000 | $1,912,000 | $338,000 | 15% |
| Year 3 | $3,500,000 | $2,800,000 | $700,000 | 20% |

Key Metrics:
• Revenue per vehicle: $150,000
• Cost per delivery: $12
• Average delivery revenue: $18
• Fleet utilization: 80%

Operating Costs:
• Driver wages: 35%
• Fuel: 15%
• Vehicle maintenance: 8%
• Insurance: 10%
• Overhead: 22%`
  },
  {
    id: 'creative',
    name: 'Creative Agency',
    icon: Palette,
    description: 'Design, marketing, or creative services',
    executiveSummary: `[Agency Name] is a full-service creative agency helping brands [primary outcome] through [services]. We combine strategic thinking with exceptional creative execution to deliver measurable results.

Agency Highlights:
• Services: Brand strategy, design, digital marketing
• Target clients: Growing businesses $1M-$50M revenue
• Team: [X] creative professionals
• Year 1 revenue target: $500,000
• Client retention rate: 90%+

With award-winning creative work and a results-driven approach, we help clients stand out in crowded markets.`,
    businessDescription: `[Agency Name] provides integrated creative and marketing services.

Service Lines:
1. Branding & Identity
   • Brand strategy
   • Visual identity design
   • Brand guidelines

2. Design Services
   • Graphic design
   • Web design/development
   • Packaging design

3. Digital Marketing
   • Social media management
   • Content marketing
   • Paid advertising

4. Video & Photography
   • Commercial video production
   • Product photography
   • Event coverage

Engagement Models:
• Project-based
• Monthly retainers
• Hybrid arrangements`,
    marketAnalysis: `Creative Services Market:
The marketing and creative services market is valued at $500B globally, with digital growing fastest.

Target Clients:
• Growing consumer brands
• Professional services firms
• Technology companies
• E-commerce businesses

Competitive Position:
• Too small for big agency attention
• Need more capability than freelancers
• Want strategic + creative integration

Agency Differentiation:
• Strategy-first approach
• Senior talent on every account
• Transparent pricing
• Results accountability`,
    organization: `Team:

Creative Director/Owner: [Name]
• 12 years agency experience
• Award-winning portfolio
• Strategic brand expertise

Account Director: [Name]
• Client relationship management
• Project management
• New business development

Creative Team:
• Senior Designer (1)
• Designer (2)
• Web Developer (1)
• Content Strategist (1)
• Social Media Manager (1)

Freelance Network:
• Photographers
• Videographers
• Copywriters
• Specialists`,
    products: `Service Packages:

1. Brand Foundation
   • Brand strategy
   • Logo & identity
   • Brand guidelines
   • Price: $15,000-30,000

2. Website Design & Development
   • UX/UI design
   • Development
   • CMS integration
   • Price: $10,000-50,000

3. Marketing Retainers
   • Content creation
   • Social management
   • Monthly reporting
   • Price: $3,000-10,000/month

4. Campaign Projects
   • Creative development
   • Multi-channel execution
   • Performance tracking
   • Price: $5,000-25,000

Hourly Rates:
• Strategy: $200/hour
• Creative: $150/hour
• Production: $100/hour`,
    marketing: `Business Development:

1. Portfolio & Case Studies (35%)
   • Website showcase
   • Award submissions
   • Speaking/presentations

2. Referral Network (35%)
   • Client referrals
   • Industry partnerships
   • Professional network

3. Content Marketing (20%)
   • Blog/thought leadership
   • Social media presence
   • Email newsletter

4. Outbound (10%)
   • Targeted prospecting
   • RFP responses
   • Industry events

New Business Process:
• Discovery call
• Proposal/pitch
• Contract
• Onboarding

Win Rate: 40% on qualified opportunities`,
    funding: `Startup Capital: $100,000

Funding Sources:
• Owner investment: $60,000
• Line of credit: $40,000

Use of Funds:
| Category | Amount |
|----------|--------|
| Equipment/software | $25,000 |
| Office setup | $15,000 |
| Website/portfolio | $10,000 |
| Marketing launch | $15,000 |
| Working capital | $25,000 |
| Legal/admin | $10,000 |

Low Capital Model:
• Service business with low overhead
• Freelancer model reduces fixed costs
• Client payments fund growth`,
    financials: `Financial Projections:
| Year | Revenue | Expenses | Net Profit | Margin |
|------|---------|----------|------------|--------|
| Year 1 | $500,000 | $400,000 | $100,000 | 20% |
| Year 2 | $850,000 | $637,000 | $213,000 | 25% |
| Year 3 | $1,300,000 | $910,000 | $390,000 | 30% |

Revenue Mix:
• Project work: 60%
• Retainers: 40%

Key Metrics:
• Average project size: $15,000
• Average retainer: $5,000/month
• Client lifetime value: $50,000
• Utilization rate: 70%

Operating Costs:
• Salaries: 50%
• Freelancers: 15%
• Software/tools: 8%
• Office: 7%
• Marketing: 5%
• Admin: 15%`
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    icon: Coffee,
    description: 'Coffee shop, bakery, or specialty food',
    executiveSummary: `[Business Name] is a [type: coffee shop/bakery/specialty food] establishment offering [products] in [location]. We provide quality products in a welcoming atmosphere that brings the community together.

Business Highlights:
• Location: High-traffic [area type]
• Products: [Core offerings]
• Capacity: [X] customers/day
• Year 1 revenue target: $450,000
• Target gross margin: 65%

With experienced operators and a unique concept, we're positioned to become a neighborhood destination.`,
    businessDescription: `[Business Name] operates as a [type] serving [products].

Product Categories:
• Coffee/beverages
• Baked goods/food items
• Retail products
• Catering services

Operations:
• Hours: 6 AM - 8 PM daily
• Seating: 30 inside, 15 patio
• Service style: Counter service
• Drive-thru: [Yes/No]

Location:
• 1,500 sq ft retail space
• High-visibility corner location
• Ample parking nearby
• Outdoor seating permit

Sourcing:
• Local roaster partnership
• In-house baking
• Local supplier network`,
    marketAnalysis: `Coffee/Food Service Market:
The specialty coffee market grows at 7% annually, with increasing demand for quality and experience.

Local Market:
• Target radius: 3 miles
• Population: 50,000
• Demographics: Urban professionals, families

Competitive Landscape:
• Chain stores: 3 within 1 mile
• Independent cafes: 2 nearby
• Differentiation opportunity

Consumer Trends:
• Quality over convenience
• Local and sustainable
• Experience-driven
• Third-wave coffee culture`,
    organization: `Team:

Owner/Operator: [Name]
• Barista and café experience
• Food service management
• Customer service focus

Kitchen Manager: [Name]
• Culinary training
• Menu development
• Production management

Staff:
• Baristas: 4-6
• Kitchen: 2-3
• Part-time: 3-4

Culture:
• Hospitality focused
• Quality commitment
• Team development
• Community involvement`,
    products: `Menu:

Beverages:
• Espresso drinks: $3-6
• Drip coffee: $2.50-4
• Tea and specialty: $3-5
• Seasonal drinks: $5-7

Food:
• Pastries: $3-5
• Breakfast items: $6-12
• Lunch items: $8-14
• Grab-and-go: $4-8

Retail:
• Coffee beans: $15-20
• Merchandise: $10-30
• Gift cards

Catering:
• Coffee service: $5/person
• Event catering: Custom quotes

Quality Standards:
• Fresh baked daily
• Specialty-grade coffee
• Seasonal menu updates`,
    marketing: `Marketing Strategy:

1. Local Presence (40%)
   • Community events
   • Local partnerships
   • Neighborhood marketing
   • Loyalty program

2. Social Media (30%)
   • Instagram (primary)
   • Facebook community
   • User-generated content
   • Influencer visits

3. Digital (15%)
   • Google Business optimization
   • Yelp and review management
   • Local SEO
   • Email newsletter

4. Grand Opening (15%)
   • Soft opening week
   • Grand opening event
   • Press and media
   • Promotional offers

Customer Experience:
• Welcoming atmosphere
• Consistent quality
• Fast, friendly service
• Remember regulars`,
    funding: `Startup Capital: $200,000

Funding Sources:
• Owner investment: $80,000
• SBA loan: $100,000
• Equipment lease: $20,000

Use of Funds:
| Category | Amount |
|----------|--------|
| Leasehold improvements | $60,000 |
| Equipment | $50,000 |
| Initial inventory | $15,000 |
| Working capital | $40,000 |
| Marketing/opening | $20,000 |
| Permits/legal | $15,000 |

Monthly Overhead:
• Rent: $4,000
• Utilities: $800
• Insurance: $300
• Loan payment: $1,200`,
    financials: `Financial Projections:
| Year | Revenue | COGS | Gross Profit | Net Income |
|------|---------|------|--------------|------------|
| Year 1 | $450,000 | $157,500 | $292,500 | $45,000 |
| Year 2 | $575,000 | $195,500 | $379,500 | $85,000 |
| Year 3 | $700,000 | $231,000 | $469,000 | $135,000 |

Key Metrics:
• Food cost: 30%
• Beverage cost: 25%
• Labor: 35%
• Average ticket: $9
• Customers/day: 150

Daily Revenue Goals:
• Weekday: $1,100
• Weekend: $1,500
• Average: $1,230

Break-Even:
• Monthly: $32,000
• Daily: $1,070
• Transactions: 119/day
• Point: Month 5`
  }
];

interface BusinessPlanTemplatesProps {
  onSelectTemplate: (template: IndustryTemplate) => void;
}

const BusinessPlanTemplates: React.FC<BusinessPlanTemplatesProps> = ({ onSelectTemplate }) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (template: IndustryTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Building2 className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Industry Templates</DialogTitle>
          <DialogDescription>
            Choose an industry template to get started with pre-filled content tailored to your business type
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {industryTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => handleSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-base">
                      <Icon className="h-5 w-5 mr-2 text-primary" />
                      {template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPlanTemplates;
