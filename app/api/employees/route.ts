import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isEmployer = user.user_metadata?.is_employer === true

    if (!isEmployer) {
      return NextResponse.json(
        { error: 'Only employers can view employees' },
        { status: 403 }
      )
    }

    const { data: employees, error } = await supabase.rpc('get_company_employees', {
      p_employer_id: user.id,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ employees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isEmployer = user.user_metadata?.is_employer === true

    if (!isEmployer) {
      return NextResponse.json(
        { error: 'Only employers can add employees' },
        { status: 403 }
      )
    }

    const { data: result, error } = await supabase.rpc('add_employee_to_company', {
      p_employer_id: user.id,
      p_employee_email: email.toLowerCase().trim(),
    })

    if (error) {
      throw error
    }

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error adding employee:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
