"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Employee {
  id: string
  email: string
  is_employer: boolean
  created_at: string
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (!response.ok) throw new Error('Failed to load employees')
      const data = await response.json()
      setEmployees(data.employees || [])
    } catch (error) {
      console.error('Error loading employees:', error)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add employee')
      }

      setSuccess(`Successfully added ${email} to your company!`)
      setEmail("")
      await loadEmployees()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Add Employee Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Add Employee
        </h2>
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Employee Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@example.com"
              required
              disabled={loading}
              className="max-w-md"
            />
            <p className="text-sm text-slate-500 mt-2">
              Enter the email of an existing user to add them to your company
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !email.trim()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? 'Adding...' : 'Add Employee'}
          </Button>
        </form>
      </div>

      {/* Employees List */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Company Employees ({employees.length})
          </h2>
        </div>

        {employees.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No employees yet. Add your first employee above.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-slate-900">{employee.email}</div>
                  <div className="text-sm text-slate-500">
                    {employee.is_employer ? 'Employer' : 'Employee'} • Joined{' '}
                    {new Date(employee.created_at).toLocaleDateString()}
                  </div>
                </div>
                {employee.is_employer && (
                  <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
