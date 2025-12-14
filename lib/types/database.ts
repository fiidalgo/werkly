export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          company_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          company_id: string
          uploaded_by: string
          filename: string
          file_path: string
          file_type: string | null
          file_size: number | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          uploaded_by: string
          filename: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          uploaded_by?: string
          filename?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_embeddings: {
        Row: {
          id: string
          document_id: string
          company_id: string
          content: string
          embedding: number[] | null
          metadata: Record<string, any>
          chunk_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          company_id: string
          content: string
          embedding?: number[] | null
          metadata?: Record<string, any>
          chunk_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          company_id?: string
          content?: string
          embedding?: number[] | null
          metadata?: Record<string, any>
          chunk_index?: number | null
          created_at?: string
        }
      }
    }
    Functions: {
      create_company_for_user: {
        Args: {
          p_user_id: string
          p_company_name: string
        }
        Returns: {
          id: string
          name: string
          created_at: string
        }
      }
      match_documents: {
        Args: {
          query_embedding: number[]
          query_company_id: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          document_id: string
          content: string
          similarity: number
          metadata: Record<string, any>
        }[]
      }
    }
  }
}
