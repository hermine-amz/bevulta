import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://kcwpyatrqyvmvoosmzmn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjd3B5YXRycXl2bXZvb3Ntem1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDU3ODQsImV4cCI6MjA5Nzk4MTc4NH0.jh5F5guKj7osSU_a3yfeFv8SwPHZMB2ZXsv-1IMDPas');

async function check() {
  console.log("Checking products...");
  const { data, error } = await supabase.from('products').select('*');
  console.log("Products Data length:", data ? data.length : null);
  console.log("Products Error:", error);
}

check();
