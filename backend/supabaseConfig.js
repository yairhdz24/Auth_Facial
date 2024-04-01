import { createClient } from '@supabase/supabase-js';

// Lee las variables de entorno desde el archivo .env
const SUPABASE_URL = ".";
// https://cfdrkjqgibsxervlmzpr.supabase.co
const SUPABASE_KEY = ".";
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHJranFnaWJzeGVydmxtenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3ODM0NTksImV4cCI6MjAyNzM1OTQ1OX0.0VOI328Aqwi3x_-9LRWLxPla3QOm9Cfme9htvJQ3YWc

// Configura Supabase con las credenciales
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


export default supabase;
