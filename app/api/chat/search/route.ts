import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createEmbedding } from '@/lib/openai/client'

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5, threshold = 0.7 } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'User not associated with a company' }, { status: 400 })
    }

    console.log(`Searching for: "${query}" in company ${profile.company_id}`)

    const queryEmbedding = await createEmbedding(query)

    const { data: matches, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      query_company_id: profile.company_id,
      match_threshold: threshold,
      match_count: limit,
    })

    if (searchError) {
      console.error('Search error:', searchError)
      throw searchError
    }

    console.log(`Found ${matches?.length || 0} relevant chunks`)

    return NextResponse.json({
      results: matches || [],
      query,
      count: matches?.length || 0,
    })
  } catch (error) {
    console.error('Vector search error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
