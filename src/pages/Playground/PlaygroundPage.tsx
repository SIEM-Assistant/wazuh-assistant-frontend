import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { SendHorizonal, Sparkles, AlertTriangle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import PromptCard from '../../components/Chat/PromptCard/PromptCard'
import CodeBlock from '../../components/Chat/CodeBlock/CodeBlock'
import QueryEditor from '../../components/Chat/QueryEditor/QueryEditor'
import ExecutionResult from '../../components/Chat/ExecutionResult/ExecutionResult'
import TypingAnimation from '../../components/Chat/TypingAnimation/TypingAnimation'
import { useAppContext, type ChatMessage } from '../../contexts/AppContext'
import { executeQuery, generateQuery, summarizeLogs } from '../../services/api'

const suggestedPrompts = [
  'Generate a Wazuh query for failed SSH login attempts',
  'Show me authentication failures in the last 24 hours',
  'Find PowerShell execution events',
  'Show Windows Event ID 4625',
  'Generate query for GuardDuty findings',
  'Find EC2 instances with suspicious outbound traffic',
]

const PlaygroundPage = () => {
  const { messages, setMessages, sidebarOpen, setIsMobile } = useAppContext()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftQuery, setDraftQuery] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 900)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [setIsMobile])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendPrompt = async (prompt: string) => {
    if (!prompt.trim()) return
    setError(null)
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: prompt }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Generating query...',
      status: 'loading',
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const generated = await generateQuery({ prompt })
      const query = generated.query || generated.generated_query || ''
      const summary = generated.summary || ''
      const assistantContent = query || generated.message || 'I could not generate a query.'
      setMessages((prev) => prev.map((message) => (message.id === assistantMessage.id ? { ...message, content: assistantContent, query, summary, status: 'idle' } : message)))
    } catch (err) {
      setMessages((prev) => prev.map((message) => (message.id === assistantMessage.id ? { ...message, content: 'I hit a snag while generating the query.', status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } : message)))
      setError('The backend could not generate a response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendPrompt(input)
  }

  const handleRunQuery = async (message: ChatMessage) => {
    if (!message.query) return
    setLoading(true)
    setError(null)
    setMessages((prev) => prev.map((entry) => (entry.id === message.id ? { ...entry, status: 'loading' } : entry)))

    try {
      const result = await executeQuery({ query: message.query })
      setMessages((prev) => prev.map((entry) => (entry.id === message.id ? { ...entry, executionResult: result.result || result.data || result.output, status: 'idle' } : entry)))
      if (message.query) {
        const summaryResponse = await summarizeLogs({ content: JSON.stringify(result.result || result.data || result.output || {}) })
        setMessages((prev) => prev.map((entry) => (entry.id === message.id ? { ...entry, summary: summaryResponse.summary || summaryResponse.message || '' } : entry)))
      }
    } catch (err) {
      setMessages((prev) => prev.map((entry) => (entry.id === message.id ? { ...entry, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } : entry)))
      setError('The backend failed to execute the query.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Silently fail for unsupported environments
    }
  }

  const startEditing = (message: ChatMessage) => {
    if (!message.query) return
    setEditingId(message.id)
    setDraftQuery(message.query)
  }

  const saveEdit = (message: ChatMessage) => {
    setMessages((prev) => prev.map((entry) => (entry.id === message.id ? { ...entry, query: draftQuery, content: draftQuery } : entry)))
    setEditingId(null)
  }

  const pageTitle = useMemo(() => (sidebarOpen ? 'Playground' : 'Playground'), [sidebarOpen])

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <Header />
        <main className="main-panel-content">
          <div className="chat-container">
            <div className="page-header">
              <div>
                <h2 className="mb-1">Playground</h2>
                <p className="text-muted mb-0">Generate and execute Wazuh queries using natural language.</p>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Sparkles size={16} color="#10A37F" />
                <span className="small">{pageTitle}</span>
              </div>
            </div>

            <div className="chat-card">
              <div className="chat-thread">
                {messages.length === 0 && !loading && (
                  <div className="text-center py-5">
                    <h4 className="mb-3">Start with a natural-language request</h4>
                    <p className="text-muted">Ask for a Wazuh query, run it, and inspect the result.</p>
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`message-row ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                  >
                    <div className={`message-bubble ${message.role === 'user' ? 'message-bubble-user' : 'message-bubble-assistant'}`}>
                      {message.role === 'user' ? <div>{message.content}</div> : (
                        <div>
                          <div className="mb-2">{message.content}</div>
                          {message.query && editingId === message.id ? (
                            <QueryEditor value={draftQuery} onChange={setDraftQuery} onSave={() => saveEdit(message)} />
                          ) : message.query ? (
                            <>
                              <CodeBlock
                                code={message.query}
                                onCopy={() => void handleCopy(message.query || '')}
                                onRun={() => void handleRunQuery(message)}
                                onEdit={() => startEditing(message)}
                              />
                              {message.executionResult ? <ExecutionResult result={message.executionResult} /> : null}
                              {message.summary ? <div className="rounded-4 p-3 mt-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}><div className="small mb-2" style={{ color: '#4b5563' }}>Summary</div><ReactMarkdown>{message.summary}</ReactMarkdown></div> : null}
                            </>
                          ) : null}
                          {message.status === 'loading' ? <div className="mt-3"><TypingAnimation /></div> : null}
                          {message.status === 'error' ? (
                            <div className="rounded-4 p-3 mt-3" style={{ background: '#3b1d1d' }}>
                              <div className="d-flex align-items-center gap-2 text-danger"><AlertTriangle size={16} /> <span>Execution failed</span></div>
                              <div className="small mt-2">{message.error}</div>
                              <button type="button" className="btn btn-sm btn-outline-light mt-2" onClick={() => void handleRunQuery(message)}>Retry</button>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {loading ? (
                  <div className="d-flex justify-content-start">
                    <TypingAnimation />
                  </div>
                ) : null}
                <div ref={endRef} />
              </div>

              {error ? (
                <div className="alert alert-danger rounded-4" role="alert">
                  <div className="d-flex align-items-center gap-2"><AlertTriangle size={16} /> {error}</div>
                  <button type="button" className="btn btn-sm btn-outline-light mt-2" onClick={() => setError(null)}>Dismiss</button>
                </div>
              ) : null}

              <div className="prompt-list">
                {suggestedPrompts.map((prompt) => (
                  <PromptCard key={prompt} label={prompt} onClick={() => setInput(prompt)} />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="chat-input-row">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Describe the logs or query you want to generate..."
                  className="form-control"
                  rows={3}
                  style={{ background: '#ffffff', color: '#111827', borderColor: '#d1d5db' }}
                />
                <button type="submit" className="btn btn-success px-3" disabled={loading}>
                  <SendHorizonal size={18} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PlaygroundPage
