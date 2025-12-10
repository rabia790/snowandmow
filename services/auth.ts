import { supabase } from './supbaseClient.ts'

export const signUp = async (email: string, password: string, fullName: string, userType: 'client' | 'provider') => {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) return { error: authError }

  // Insert profile linked to auth.users
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: authData.user?.id, email, full_name: fullName, user_type: userType }])

  if (profileError) return { error: profileError }
  return { user: authData.user }
}


// --- Login Function 
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user?.id)
    .single()

  if (profileError) return { error: profileError }
  return { user: data.user, profile }
}