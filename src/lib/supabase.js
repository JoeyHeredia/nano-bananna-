import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const supabase = createClient(
  'https://tckfakmwfortjgqbsorn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja2Zha213Zm9ydGpncWJzb3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODgxOTIsImV4cCI6MjA5MTc2NDE5Mn0.ew_n8EaJOmTgy3tdnf3HHyXXp2bM9vZegybx6aSlP-o'
)
