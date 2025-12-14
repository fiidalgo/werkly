import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-orange-600">Werkly</span>
            <form action={handleSignOut}>
              <Button variant="ghost" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome to Werkly</h1>
            <p className="text-lg text-slate-600">You're logged in as {user.email}</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Dashboard</h2>
            <p className="text-slate-600">
              This is your dashboard. Features coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
