import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dhqrtlmcqchbifjnyapj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocXJ0bG1jcWNoYmlmam55YXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTc0NzUsImV4cCI6MjA5NDU3MzQ3NX0._YSJ3LB1huYOz6s5lPyrK9JnCsEZ5eUlvZqle122vgo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})