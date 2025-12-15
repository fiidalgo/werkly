"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Suggestion {
  id: string
  filename: string
  reason: string
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const conversationId = searchParams?.get('conversation')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Don't reload if we're in the middle of creating a conversation
    if (isCreatingConversation) {
      return
    }

    if (conversationId) {
      loadConversation(conversationId)
    } else {
      setMessages([])
      setCurrentConversationId(null)
      loadSuggestions()
    }
  }, [conversationId, isCreatingConversation])

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/suggestions')
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setCurrentConversationId(id)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const generateTitle = (firstMessage: string): string => {
    const truncated = firstMessage.slice(0, 50)
    return truncated.length < firstMessage.length ? `${truncated}...` : truncated
  }

  const saveMessage = async (convId: string, role: 'user' | 'assistant', content: string) => {
    try {
      await fetch(`/api/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      })
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    const userContent = input.trim()
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    let convId = currentConversationId

    try {
      if (!convId && messages.length === 0) {
        setIsCreatingConversation(true)
        const title = generateTitle(userContent)
        const createResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        })

        if (createResponse.ok) {
          const data = await createResponse.json()
          convId = data.conversation.id
          setCurrentConversationId(convId)
          window.history.pushState({}, '', `/dashboard?conversation=${convId}`)

          // Don't dispatch conversationUpdated yet - wait until messages are saved
        }
      }

      if (convId) {
        await saveMessage(convId, 'user', userContent)
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          useContext: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let assistantMessage = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
          }
          return newMessages
        })
      }

      if (convId && assistantMessage) {
        await saveMessage(convId, 'assistant', assistantMessage)

        // Now that both messages are saved, notify sidebar and allow reloading
        setIsCreatingConversation(false)
        window.dispatchEvent(new Event('conversationUpdated'))
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
      setIsCreatingConversation(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center p-6 bg-white">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-semibold text-slate-900 mb-2">
                What can I help with?
              </h1>
              <p className="text-slate-600">
                Ask me anything about company policies, procedures, or technical setup.
              </p>
            </div>

            {/* Centered Input */}
            <div className="relative">
              <div className="relative flex items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  rows={1}
                  disabled={isLoading}
                  className="w-full rounded-3xl border-2 border-slate-200 px-6 py-4 pr-16 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-orange-500 transition-colors resize-none min-h-[52px] max-h-[200px] disabled:opacity-50"
                />
                <div className="absolute right-3 bottom-2">
                  <Button
                    type="button"
                    size="icon"
                    disabled={!input.trim() || isLoading}
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
              <p className="mt-2 text-center text-sm text-slate-500">
                Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘</kbd> + <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Enter</kbd> to send
              </p>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Suggested for you
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => setInput(`Tell me about ${suggestion.filename}`)}
                      className="group text-left p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                            {suggestion.filename.replace(/\.md$/, '').replace(/-/g, ' ')}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {suggestion.reason}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-slate-300 group-hover:text-orange-600 transition-colors"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-white"
          >
            <div className="mx-auto max-w-3xl p-6 space-y-6">
              {messages.map((message, index) => (
                message.content && (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                        }`}
                    >
                      {message.role === 'user' ? (
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-code:bg-slate-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-slate-900 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-800 prose-pre:text-slate-100">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Container - Bottom */}
          <div className="bg-white p-4">
            <div className="mx-auto max-w-3xl">
              <div className="relative flex items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  rows={1}
                  disabled={isLoading}
                  className="w-full rounded-3xl border-2 border-slate-200 px-6 py-4 pr-16 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-orange-500 transition-colors resize-none min-h-[52px] max-h-[200px] disabled:opacity-50"
                />
                <div className="absolute right-3 bottom-2">
                  <Button
                    type="button"
                    size="icon"
                    disabled={!input.trim() || isLoading}
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
              <p className="mt-2 text-center text-sm text-slate-500">
                Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘</kbd> + <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Enter</kbd> to send
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
