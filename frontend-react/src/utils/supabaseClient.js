import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://lzeydgdaeywdnrjhydyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXlkZ2RhZXl3ZG5yamh5ZHl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE4ODY5NCwiZXhwIjoyMDkxNzY0Njk0fQ.k0B-uGhMzazwJtyAcdoS-6genEWtR0UJiEAG7xrmPLw';

export const supabase = createClient(supabaseUrl, supabaseKey);