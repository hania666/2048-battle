import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://khopjdqiwetyyydyosij.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaG9wamRxaXdldHl5ZHlvc2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODA0MjgsImV4cCI6MjA4OTk1NjQyOH0.9pHFlQVlFytrW_99J42UCXUVdRh1EJ6xZsFrMFCE6yg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
