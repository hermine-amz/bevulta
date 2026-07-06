import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://kcwpyatrqyvmvoosmzmn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjd3B5YXRycXl2bXZvb3Ntem1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMTE1MzcsImV4cCI6MjA1Njc4NzUzN30.K9vQG-2tU7e4_U305Z1J0OIfK5n8JqHnZ-C1_k4m_yI');

async function test() {
  const { data, error } = await supabase.from('products').select('id, name, description').limit(1);
  if (error) {
    console.error("Select error:", error);
    return;
  }
  
  const p = data[0];
  console.log("Product before:", p);
  
  const { error: updateErr } = await supabase.from('products').update({ name: p.name + " Test" }).eq('id', p.id);
  if (updateErr) {
    console.error("Update error:", updateErr);
  } else {
    console.log("Update success!");
    // revert
    await supabase.from('products').update({ name: p.name }).eq('id', p.id);
  }
}

test();
