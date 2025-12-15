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

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const conversationId = searchParams?.get('conversation')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    } else {
      setMessages([])
      setCurrentConversationId(null)
    }
  }, [conversationId])

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

          // Notify sidebar to refresh conversation list
          window.dispatchEvent(new Event('conversationUpdated'))
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

        // Notify sidebar to refresh conversation list
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
