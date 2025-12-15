import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { extractText, chunkText } from '@/lib/text-extraction'
import { createEmbedding } from '@/lib/openai/client'

export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const supabaseService = createServiceClient()

    // Get document details (using regular client for RLS)
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update status to processing
    await supabaseService
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId)

    try {
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabaseService.storage
        .from('documents')
        .download(document.file_path)

      if (downloadError || !fileData) {
        throw new Error('Failed to download file from storage')
      }

      // Convert to buffer
      const arrayBuffer = await fileData.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Extract text
      console.log(`Extracting text from ${document.filename}...`)
      const text = await extractText(buffer, document.file_type || '')

      if (!text || text.trim().length === 0) {
        throw new Error('No text extracted from document')
      }

      console.log(`Extracted ${text.length} characters`)

      // Chunk text
      const chunks = chunkText(text, 1000, 200)
      console.log(`Created ${chunks.length} chunks`)

      if (chunks.length === 0) {
        throw new Error('No chunks created from text')
      }

      // Generate embeddings and store
      const embeddingPromises = chunks.map(async (chunk, index) => {
        try {
          // Generate embedding
          const embedding = await createEmbedding(chunk)

          // Store in database
          const { error: embeddingError } = await supabaseService
            .from('document_embeddings')
            .insert({
              document_id: documentId,
              company_id: document.company_id,
              content: chunk,
              embedding: embedding,
              chunk_index: index,
              metadata: {
                filename: document.filename,
                file_type: document.file_type,
                chunk_size: chunk.length,
              },
            })

          if (embeddingError) {
            console.error(`Error storing embedding for chunk ${index}:`, embeddingError)
            throw embeddingError
          }

          return { success: true, index }
        } catch (error) {
          console.error(`Error processing chunk ${index}:`, error)
          return { success: false, index, error }
        }
      })

      const results = await Promise.all(embeddingPromises)
      const failedChunks = results.filter(r => !r.success)

      if (failedChunks.length > 0) {
        console.error(`${failedChunks.length} chunks failed to process`)
      }

      // Update document status to completed
      await supabaseService
        .from('documents')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId)

      return NextResponse.json({
        success: true,
        documentId,
        chunksProcessed: chunks.length,
        chunksFailed: failedChunks.length,
      })
    } catch (processingError) {
      // Update document status to failed
      await supabaseService
        .from('documents')
        .update({
          status: 'failed',
          error_message: processingError instanceof Error ? processingError.message : 'Processing failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId)

      throw processingError
    }
  } catch (error) {
    console.error('Document processing error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
