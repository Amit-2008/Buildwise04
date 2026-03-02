-- Create profiles table for storing user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  email TEXT,
  full_name TEXT,
  is_guest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create estimations table for storing user cost estimates
CREATE TABLE public.estimations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  area NUMERIC NOT NULL,
  floors INTEGER NOT NULL,
  state TEXT NOT NULL,
  city TEXT,
  building_type TEXT NOT NULL,
  quality TEXT NOT NULL,
  total_cost NUMERIC NOT NULL,
  material_cost NUMERIC NOT NULL,
  labor_cost NUMERIC NOT NULL,
  materials_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimations ENABLE ROW LEVEL SECURITY;

-- Profiles policies: authenticated users can manage their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR is_guest = true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_guest = true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Guest profiles can be created by anyone
CREATE POLICY "Anyone can create guest profile"
  ON public.profiles FOR INSERT
  WITH CHECK (is_guest = true);

-- Estimations policies
CREATE POLICY "Users can view their own estimations"
  ON public.estimations FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid() OR is_guest = true
    )
  );

CREATE POLICY "Users can insert their own estimations"
  ON public.estimations FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid() OR is_guest = true
    )
  );

CREATE POLICY "Users can delete their own estimations"
  ON public.estimations FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_estimations_profile_id ON public.estimations(profile_id);