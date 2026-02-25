// Supabase is no longer used. Kept as a compatibility stub so existing imports don't crash.
// The project has been migrated to Firebase.
export const supabase = null
export function requireSupabase() {
  throw new Error('Supabase is no longer configured. This project now uses Firebase.')
}
