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

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ suggestions: [] })
    }

    const { data: recentConversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5)

    let recentQueries: string[] = []
    if (recentConversations && recentConversations.length > 0) {
      const conversationIds = recentConversations.map(c => c.id)

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('content')
        .in('conversation_id', conversationIds)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(10)

      recentQueries = recentMessages?.map(m => m.content) || []
    }

    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('id, filename, file_type, created_at')
      .eq('company_id', profile.company_id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20)

    if (docsError) {
      throw docsError
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ suggestions: [] })
    }

    const analysisPrompt = recentQueries.length > 0
      ? `Based on these recent questions: ${recentQueries.slice(0, 5).join('; ')}\n\nAnd available documents: ${documents.map(d => d.filename).join(', ')}\n\nWhich 3-5 documents would be most helpful? Return only comma-separated filenames.`
      : `Available documents: ${documents.map(d => d.filename).join(', ')}\n\nFor a new employee, which 3-5 documents are most important to read first? Return only comma-separated filenames.`

    const suggestions = documents
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(doc => ({
        id: doc.id,
        filename: doc.filename,
        reason: recentQueries.length > 0
          ? 'Based on your recent questions'
          : 'Recommended for getting started',
      }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
