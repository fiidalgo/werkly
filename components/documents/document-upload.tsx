"use client"

import { useState, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Database } from "@/lib/types/database"

type Document = Database['public']['Tables']['documents']['Row']

interface DocumentUploadProps {
  userId: string
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function DocumentUpload({ userId }: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (err) {
      console.error('Error loading documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 50MB.`
    }

    const fileType = file.type
    const validTypes = Object.keys(ACCEPTED_FILE_TYPES)
    if (!validTypes.includes(fileType)) {
      return `File "${file.name}" has an unsupported format. Please upload PDF, DOCX, DOC, TXT, or MD files.`
    }

    return null
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validationErrors: string[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        validationErrors.push(error)
      }
    })

    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'))
      return
    }

    setError(null)
    setFiles(prev => [...prev, ...fileArray])
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      // Get user's company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single()

      if (profileError || !profile?.company_id) {
        throw new Error('Company not found. Please contact support.')
      }

      const companyId = profile.company_id

      for (const file of files) {
        const fileId = `${Date.now()}-${file.name}`
        const filePath = `${companyId}/${fileId}`

        // Update progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw uploadError
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }))

        // Create document record
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            company_id: companyId,
            uploaded_by: userId,
            filename: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            status: 'pending'
          })

        if (dbError) {
          throw dbError
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      }

      // Reload documents
      await loadDocuments()

      // Clear files
      setFiles([])
      setUploadProgress({})
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const deleteDocument = async (doc: Document) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path])

      if (storageError) {
        throw storageError
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id)

      if (dbError) {
        throw dbError
      }

      // Reload documents
      await loadDocuments()
    } catch (err) {
      console.error('Error deleting document:', err)
      setError('Failed to delete document')
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDFs, Word documents, or text files for AI training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-slate-300 hover:border-slate-400'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(',')}
              onChange={handleChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2 text-sm text-slate-600">
                Drag files here or click to upload
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, DOCX, DOC, TXT, or MD up to 50MB
              </p>
            </label>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm text-slate-900">Selected Files:</h4>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploadProgress[file.name] !== undefined && (
                      <Progress value={uploadProgress[file.name]} className="mt-2 h-1" />
                    )}
                  </div>
                  {!uploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="ml-4"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={uploadFiles}
                disabled={uploading}
                className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
              >
                {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-600">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-slate-600">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{doc.filename}</p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${doc.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : doc.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : doc.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : ''} •{' '}
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(doc)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
