import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmployeeManagement } from "@/components/employees/employee-management"

export default async function EmployeesPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Employees</h1>
        <p className="text-slate-600 mb-8">
          Manage your company's employees
        </p>

        <EmployeeManagement />
      </div>
    </div>
  )
}
