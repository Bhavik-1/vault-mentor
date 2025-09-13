-- Remove the two_factor_enabled column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS two_factor_enabled;