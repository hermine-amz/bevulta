/**
 * Script de ping Keep-Alive pour Supabase
 * Envoie une requête périodique à l'API Supabase pour maintenir le projet éveillé.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kcwpyatrqyvmvoosmzmn.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjd3B5YXRycXl2bXZvb3Ntem1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDU3ODQsImV4cCI6MjA5Nzk4MTc4NH0.jh5F5guKj7osSU_a3yfeFv8SwPHZMB2ZXsv-1IMDPas';

async function pingSupabase() {
  const endpoint = `${SUPABASE_URL}/rest/v1/products?select=id&limit=1`;
  console.log(`[${new Date().toISOString()}] Envoi du ping Keep-Alive vers : ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    console.log(`[${new Date().toISOString()}] Statut reçu : ${res.status} (${res.statusText})`);
    if (res.ok) {
      console.log('✅ Projet Supabase réveillé et maintenu actif avec succès !');
    } else {
      console.log(`ℹ️ Réponse reçue : ${res.status}. Le serveur Supabase a bien enregistré l'activité.`);
    }
  } catch (err) {
    console.error(`⚠️ Erreur lors du ping Supabase :`, err.message);
  }
}

pingSupabase();
