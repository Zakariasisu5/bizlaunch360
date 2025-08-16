-- Fix security vulnerabilities in complaints and ussd_sessions tables

-- 1. Fix complaints table - restrict access to only admin users and complaint creators
DROP POLICY IF EXISTS "Complaints viewable by authenticated users" ON public.complaints;
DROP POLICY IF EXISTS "Authenticated users can update complaints" ON public.complaints;

-- Create a security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ttfpp_profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  );
$$;

-- New policies for complaints table
CREATE POLICY "Admin can view all complaints" 
ON public.complaints 
FOR SELECT 
USING (public.is_admin_user());

CREATE POLICY "Admin can update complaints" 
ON public.complaints 
FOR UPDATE 
USING (public.is_admin_user());

-- 2. Fix ussd_sessions table - restrict to service role only
DROP POLICY IF EXISTS "Service can manage USSD sessions" ON public.ussd_sessions;
DROP POLICY IF EXISTS "USSD sessions viewable by authenticated users" ON public.ussd_sessions;

-- USSD sessions should only be managed by the service, not by regular users
CREATE POLICY "Service role can manage USSD sessions" 
ON public.ussd_sessions 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. Add additional protection to sensitive application tables
-- Ensure volunteer_applications are only viewable by admin or the applicant
DROP POLICY IF EXISTS "Users can view their own volunteer applications" ON public.volunteer_applications;

CREATE POLICY "Users can view their own volunteer applications" 
ON public.volunteer_applications 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin_user());

-- Same for partnership_requests  
DROP POLICY IF EXISTS "Users can view their own partnership requests" ON public.partnership_requests;

CREATE POLICY "Users can view their own partnership requests" 
ON public.partnership_requests 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin_user());

-- Same for project_proposals
DROP POLICY IF EXISTS "Users can view their own project proposals" ON public.project_proposals;

CREATE POLICY "Users can view their own project proposals" 
ON public.project_proposals 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin_user());