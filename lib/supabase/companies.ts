import { createClient } from './client'
import type { Database } from '../types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

type Company = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']
type Profile = Database['public']['Tables']['profiles']['Row']

export async function createCompanyForUser(
  supabaseClient: SupabaseClient<Database>,
  userId: string,
  companyName: string
): Promise<{ company: Company | null; error: Error | null }> {
  const supabase = supabaseClient

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('No active session found')
    }

    // Use rpc function with SECURITY DEFINER to bypass RLS during signup only
    // @ts-ignore
    const { data, error: rpcError } = await supabase.rpc('create_company_for_user', {
      p_user_id: userId,
      p_company_name: companyName
    })

    if (rpcError) {
      throw new Error(`Failed to create company: ${rpcError.message}`)
    }

    if (!data) {
      throw new Error('Company was not created')
    }

    const company = data as any as Company
    return { company, error: null }
  } catch (error) {
    return { company: null, error: error as Error }
  }
}

export async function getUserCompany(
  supabaseClient: SupabaseClient<Database>,
  userId: string
): Promise<{ company: Company | null; error: Error | null }> {
  const supabase = supabaseClient

  try {
    // Get user's profile to find company_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single()

    if (profileError) {
      throw profileError
    }

    // @ts-ignore
    if (!profile?.company_id) {
      return { company: null, error: null }
    }

    // Get company details
    // @ts-ignore
    const companyId = profile.company_id
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      // @ts-ignore 
      .eq('id', companyId)
      .single()

    if (companyError) {
      throw companyError
    }

    return { company, error: null }
  } catch (error) {
    return { company: null, error: error as Error }
  }
}

export async function updateCompanyName(
  supabaseClient: SupabaseClient<Database>,
  companyId: string,
  newName: string
): Promise<{ error: Error | null }> {
  const supabase = supabaseClient

  try {
    const { error } = await supabase
      .from('companies')
      // @ts-ignore
      .update({ name: newName })
      .eq('id', companyId)

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}
