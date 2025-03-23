-- Update the existing admin user's password
UPDATE auth.users
SET 
  encrypted_password = crypt('vik9550038093', gen_salt('bf')),
  updated_at = NOW(),
  role = 'authenticated'
WHERE email = 'vtu8022@gmail.com';

-- If the user doesn't exist (which we now know isn't the case), this would create them
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
SELECT 
  uuid_generate_v4(),
  'vtu8022@gmail.com',
  crypt('vik9550038093', gen_salt('bf')),
  NOW(),
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'vtu8022@gmail.com'
);

-- Make sure the user has admin privileges in your custom table if you have one
-- You might have a separate admins table or a field in a users table
-- This is just an example - adjust according to your actual schema
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
    INSERT INTO admins (user_id)
    SELECT id FROM auth.users WHERE email = 'vtu8022@gmail.com'
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

