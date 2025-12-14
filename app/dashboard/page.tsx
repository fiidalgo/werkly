"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function DashboardPage() {
  const [query, setQuery] = useState("")

  const handleSubmit = () => {
    if (!query.trim()) return
    // TODO: Handle query submission
    console.log("Query:", query)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        {/* Welcome Message */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-900 mb-2">
            What can I help with?
          </h1>
        </div>

        {/* Chat Input */}
        <div className="relative">
          <div className="relative flex items-end">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="w-full rounded-3xl border-2 border-slate-200 px-6 py-4 pr-24 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-orange-500 transition-colors resize-none min-h-[52px] max-h-[200px]"
            />
            <div className="absolute right-3 bottom-2 flex items-center gap-2">
              {/* Paperclip Icon */}
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                title="Attach file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  />
                </svg>
              </button>
              {/* Submit Button */}
              <Button
                type="button"
                size="icon"
                disabled={!query.trim()}
                onClick={handleSubmit}
                className="rounded-full bg-orange-600 hover:bg-orange-700 disabled:opacity-30 disabled:hover:bg-orange-600 h-10 w-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 14a.75.75 0 01-.75-.75V4.56L4.03 7.78a.75.75 0 01-1.06-1.06l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 11-1.06 1.06L8.75 4.56v8.69A.75.75 0 018 14z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500">
          Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘</kbd> + <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Enter</kbd> to send
        </p>
      </div>
    </div>
  )
}
