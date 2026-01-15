-- Fix Contact Form Submission Issue
-- This script updates the stage constraint to allow 'General Inquiry'
-- Run this in Supabase SQL Editor if your contact form is not submitting

-- Drop the old constraint
ALTER TABLE contact_submissions 
DROP CONSTRAINT IF EXISTS contact_submissions_stage_check;

-- Add new constraint with 'General Inquiry' included
ALTER TABLE contact_submissions 
ADD CONSTRAINT contact_submissions_stage_check 
CHECK (stage IN ('student', 'bootstrapped', 'funded', 'msme', 'General Inquiry'));

-- Verify the fix
SELECT 
  constraint_name, 
  check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'contact_submissions_stage_check';

-- Test with a sample insert (will be rolled back)
DO $$
BEGIN
  -- Try to insert with 'General Inquiry'
  INSERT INTO contact_submissions (name, contact, stage, services, message)
  VALUES ('Test User', 'test@example.com', 'General Inquiry', 'Test Subject', 'Test Message');
  
  -- If we got here, it worked!
  RAISE NOTICE '✅ Fix successful! Contact form can now accept "General Inquiry" stage.';
  
  -- Rollback the test insert
  RAISE EXCEPTION 'Rolling back test insert';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test completed (insert rolled back)';
END $$;
