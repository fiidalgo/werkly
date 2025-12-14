import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DocumentUpload } from "@/components/documents/document-upload"

export default async function DocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const isEmployer = user.user_metadata?.is_employer === true

  if (!isEmployer) {
    redirect("/dashboard")
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents</h1>
        <p className="text-slate-600 mb-8">
          Upload and manage company documentation
        </p>

        <DocumentUpload userId={user.id} />
      </div>
    </div>
  )
}
