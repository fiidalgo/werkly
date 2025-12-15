import * as pdf from 'pdf-parse'
import mammoth from 'mammoth'

export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
  try {
    switch (fileType) {
      case 'application/pdf':
        return await extractFromPDF(buffer)

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return await extractFromDOCX(buffer)

      case 'text/plain':
      case 'text/markdown':
        return buffer.toString('utf-8')

      default:
        throw new Error(`Unsupported file type: ${fileType}`)
    }
  } catch (error) {
    console.error('Text extraction error:', error)
    throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  // @ts-ignore
  const pdfParse = pdf.default || pdf
  const data = await pdfParse(buffer)
  return data.text
}

async function extractFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 200): string[] {
  // Clean and normalize text
  const cleanedText = text
    .replace(/\s+/g, ' ') // Replace multiple whitespaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim()

  if (cleanedText.length === 0) {
    return []
  }

  // If text is smaller than chunk size, return as single chunk
  if (cleanedText.length <= maxChunkSize) {
    return [cleanedText]
  }

  const chunks: string[] = []
  let startIndex = 0

  while (startIndex < cleanedText.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + maxChunkSize

    // If this is not the last chunk, try to break at a sentence or word boundary
    if (endIndex < cleanedText.length) {
      // Look for sentence boundary (. ! ? followed by space)
      const sentenceEnd = cleanedText.lastIndexOf('. ', endIndex)
      const questionEnd = cleanedText.lastIndexOf('? ', endIndex)
      const exclamationEnd = cleanedText.lastIndexOf('! ', endIndex)

      const bestSentenceEnd = Math.max(sentenceEnd, questionEnd, exclamationEnd)

      if (bestSentenceEnd > startIndex) {
        endIndex = bestSentenceEnd + 1 // Include the period/question/exclamation
      } else {
        // No sentence boundary found, try word boundary
        const lastSpace = cleanedText.lastIndexOf(' ', endIndex)
        if (lastSpace > startIndex) {
          endIndex = lastSpace
        }
      }
    }

    // Extract chunk
    const chunk = cleanedText.slice(startIndex, endIndex).trim()
    if (chunk.length > 0) {
      chunks.push(chunk)
    }

    // Move start index for next chunk, accounting for overlap
    startIndex = endIndex - overlap

    // Make sure we're making progress
    if (startIndex <= chunks.length * maxChunkSize - overlap * chunks.length) {
      startIndex = endIndex
    }
  }

  return chunks
}

export function estimateTokens(text: string): number {
  // ~4 characters per token for English text
  return Math.ceil(text.length / 4)
}
