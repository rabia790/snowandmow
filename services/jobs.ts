// File: src/services/jobs.ts
import { supabase } from './supbaseClient.ts'

export const createJob = async (
  clientId: string,
  serviceType: 'snow_removal' | 'lawn_mowing',
  address: string,
  price: number,
  description?: string
) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([{ client_id: clientId, service_type: serviceType, address, price, description }])
    
  return { data, error }
}

export const getPendingJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
  return { data, error }
}

// --- Accept Job (Paste this at the bottom) ---
export const acceptJob = async (jobId: string, providerId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'accepted', provider_id: providerId })
    .eq('id', jobId)
  return { data, error }
}