-- Create the store_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL DEFAULT 'Skool Store',
  store_description TEXT DEFAULT 'The ultimate online store for educational products',
  contact_email TEXT NOT NULL DEFAULT 'contact@skoolstore.com',
  support_phone TEXT,
  business_address TEXT,
  currency TEXT DEFAULT 'USD',
  tax_rate DECIMAL DEFAULT 8.5, 
  shipping_fee DECIMAL DEFAULT 5.99,
  free_shipping_threshold DECIMAL DEFAULT 50.0,
  enable_user_reviews BOOLEAN DEFAULT true,
  enable_wishlist BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  social_media JSONB DEFAULT '{"facebook": "https://facebook.com/skoolstore", "twitter": "https://twitter.com/skoolstore", "instagram": "https://instagram.com/skoolstore"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for store settings table

-- Everyone can read the default store settings
CREATE POLICY "Anyone can read default store settings"
  ON public.store_settings
  FOR SELECT USING (
    id = 'default'
  );

-- Only admins can read any store settings
CREATE POLICY "Admins can read any store settings"
  ON public.store_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can insert store settings
CREATE POLICY "Admins can insert store settings"
  ON public.store_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update store settings
CREATE POLICY "Admins can update store settings"
  ON public.store_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can delete store settings
CREATE POLICY "Admins can delete store settings"
  ON public.store_settings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_store_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION update_store_settings_updated_at();

-- Insert default settings if they don't exist
INSERT INTO public.store_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING; 