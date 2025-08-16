-- Create admin check function if it doesn't exist
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

-- Fix USSD sessions - the critical security issue
DROP POLICY IF EXISTS "Service can manage USSD sessions" ON public.ussd_sessions;
DROP POLICY IF EXISTS "USSD sessions viewable by authenticated users" ON public.ussd_sessions;

-- USSD sessions should only be managed by service role, not regular users
CREATE POLICY "Service role only can manage USSD sessions" 
ON public.ussd_sessions 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');