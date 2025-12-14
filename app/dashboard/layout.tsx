import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const isEmployer = user.user_metadata?.is_employer === true

  return (
    <DashboardLayout email={user.email!} isEmployer={isEmployer}>
      {children}
    </DashboardLayout>
  )
}
