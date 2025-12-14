import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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

        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-orange-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Document Upload</h2>
            <p className="text-slate-600">
              Coming soon... You'd be able to upload PDFs, documents, and other files for the RAG.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
