-- Create business_plans table for saving draft plans
CREATE TABLE public.business_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Business Plan',
  executive_summary TEXT,
  business_description TEXT,
  market_analysis TEXT,
  organization TEXT,
  products TEXT,
  marketing TEXT,
  funding TEXT,
  financials TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for business plans
CREATE POLICY "Users can view their own business plans" 
ON public.business_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business plans" 
ON public.business_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business plans" 
ON public.business_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business plans" 
ON public.business_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_plans_updated_at
BEFORE UPDATE ON public.business_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();