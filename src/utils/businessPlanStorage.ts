import { supabase } from '@/integrations/supabase/client';

export interface BusinessPlanData {
  id?: string;
  title?: string;
  executiveSummary: string;
  businessDescription: string;
  marketAnalysis: string;
  organization: string;
  products: string;
  marketing: string;
  funding: string;
  financials: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const saveBusinessPlan = async (planData: BusinessPlanData): Promise<BusinessPlanData> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save business plan');
  }

  const planPayload = {
    user_id: user.id,
    title: planData.title || 'Untitled Business Plan',
    executive_summary: planData.executiveSummary,
    business_description: planData.businessDescription,
    market_analysis: planData.marketAnalysis,
    organization: planData.organization,
    products: planData.products,
    marketing: planData.marketing,
    funding: planData.funding,
    financials: planData.financials,
  };

  let result;

  if (planData.id) {
    // Update existing plan
    const { data, error } = await supabase
      .from('business_plans')
      .update(planPayload)
      .eq('id', planData.id)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  } else {
    // Create new plan
    const { data, error } = await supabase
      .from('business_plans')
      .insert(planPayload)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  }

  return {
    id: result.id,
    title: result.title,
    executiveSummary: result.executive_summary,
    businessDescription: result.business_description,
    marketAnalysis: result.market_analysis,
    organization: result.organization,
    products: result.products,
    marketing: result.marketing,
    funding: result.funding,
    financials: result.financials,
    userId: result.user_id,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
};

export const loadBusinessPlans = async (): Promise<BusinessPlanData[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to load business plans');
  }

  const { data, error } = await supabase
    .from('business_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data.map(plan => ({
    id: plan.id,
    title: plan.title,
    executiveSummary: plan.executive_summary,
    businessDescription: plan.business_description,
    marketAnalysis: plan.market_analysis,
    organization: plan.organization,
    products: plan.products,
    marketing: plan.marketing,
    funding: plan.funding,
    financials: plan.financials,
    userId: plan.user_id,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  }));
};

export const deleteBusinessPlan = async (planId: string): Promise<void> => {
  const { error } = await supabase
    .from('business_plans')
    .delete()
    .eq('id', planId);

  if (error) throw error;
};

export const loadBusinessPlan = async (planId: string): Promise<BusinessPlanData> => {
  const { data, error } = await supabase
    .from('business_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    executiveSummary: data.executive_summary,
    businessDescription: data.business_description,
    marketAnalysis: data.market_analysis,
    organization: data.organization,
    products: data.products,
    marketing: data.marketing,
    funding: data.funding,
    financials: data.financials,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};