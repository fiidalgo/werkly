import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai, createEmbedding } from '@/lib/openai/client'

export async function POST(request: NextRequest) {
  try {
    const { messages, useContext = true } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
    }

    let systemMessage = `You are Werkly AI, an intelligent workplace assistant designed to help employees with onboarding, training, and company-specific questions.

Your primary function is to provide accurate, helpful information based on company documentation and policies.

Key guidelines:
- Be professional, friendly, and concise
- Cite sources when referencing specific documents
- If you don't know something, admit it rather than guessing
- Provide step-by-step instructions when appropriate
- Ask clarifying questions if needed`

    let contextMessages = messages

    if (useContext) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (profile?.company_id) {
          console.log(`Searching for: "${lastMessage.content}" in company ${profile.company_id}`)

          const queryEmbedding = await createEmbedding(lastMessage.content)
          console.log(`Query embedding generated (length: ${queryEmbedding.length})`)

          // Search with lower threshold - similarity scores of 0.35+ are good matches
          const { data: allMatches, error: searchError } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            query_company_id: profile.company_id,
            match_threshold: 0.25, // Low threshold to see all potential matches
            match_count: 10,
          })

          if (searchError) {
            console.error('Search error:', searchError)
          } else if (allMatches && allMatches.length > 0) {
            console.log(`Found ${allMatches.length} potential chunks:`)
            allMatches.forEach((m: any, i: number) => {
              console.log(`  ${i + 1}. Similarity: ${m.similarity?.toFixed(3)} - ${m.metadata?.filename || 'Unknown'}`)
            })

            // Filter to best matches (threshold 0.35 - good for semantic search)
            const matches = allMatches.filter((m: any) => m.similarity >= 0.35)

            if (matches.length > 0) {
              console.log(`Using top ${matches.length} chunks (similarity >= 0.35)`)

              const contextText = matches
                .slice(0, 5) // Only use top 5
                .map((result: any, index: number) => {
                  return `[Source ${index + 1}: ${result.metadata?.filename || 'Unknown'}]
${result.content}
---`
                })
                .join('\n\n')

              systemMessage += `\n\n## Relevant Company Documentation\n\nUse the following context to answer the user's question. Reference specific sources when applicable.\n\n${contextText}`

              console.log(`Added ${Math.min(matches.length, 5)} context chunks to prompt`)
            } else {
              console.log('No chunks above 0.35 similarity threshold. Best match:', allMatches[0]?.similarity?.toFixed(3))
            }
          } else {
            console.log('No embeddings found for this company. Have documents been uploaded and processed?')
          }
        }
      } catch (contextError) {
        console.error('Error fetching context:', contextError)
      }
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [
        { role: 'system', content: systemMessage },
        ...contextMessages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
