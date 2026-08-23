import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Shield, Menu, Play, User, Bot, Copy, Check, Send, Terminal } from "lucide-react";
import Editor from "@monaco-editor/react";
import "./Chatbot.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Message = {
  role: "user" | "assistant";
  content: string;
  query?: string;
  result?: any;
  queryError?: string;
};

const defaultPlaygroundQuery = {
  size: 5,
  _source: [
    "@timestamp",
    "agent.name",
    "agent.ip",
    "rule.id",
    "rule.level",
    "rule.description",
    "decoder.name",
    "full_log"
  ],
  query: {
    bool: {
      filter: [
        {
          term: {
            "rule.id": "550"
          }
        }
      ]
    }
  },
  sort: [
    {
      "@timestamp": {
        order: "desc"
      }
    }
  ]
};

function flattenObject(obj: any, prefix = ""): any {
  let result: any = {};
  Object.keys(obj || {}).forEach((key) => {
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, `${prefix}${key}.`));
    } else {
      result[`${prefix}${key}`] = Array.isArray(value) ? value.join(", ") : value;
    }
  });
  return result;
}

export default function Chatbot() {
  const [activeTab, setActiveTab] = useState<"chat" | "playground">("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [playgroundQuery, setPlaygroundQuery] = useState(
    JSON.stringify(defaultPlaygroundQuery, null, 2)
  );
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundError, setPlaygroundError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Ref to track if the state change was triggered by typing in the editor
  const isEditingRef = useRef(false);

  useEffect(() => {
    // Only scroll to bottom if we are NOT currently editing an existing query
    if (activeTab === "chat" && !isEditingRef.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }
    // Reset flag after render
    isEditingRef.current = false;
  }, [messages, activeTab]);

  // Chat Handlers
  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;

    isEditingRef.current = false; // New message sent: allow auto-scroll
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text
      }
    ]);

    setMessage("");
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_prompt: text
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error ${response.status}`);
      }

      const data = await response.json();

      isEditingRef.current = false; // Response received: allow auto-scroll
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "Query generated successfully.",
          query: JSON.stringify(data.query, null, 2)
        }
      ]);
    } catch {
      isEditingRef.current = false;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to generate query."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Run edited chat query
  const handleRunChatQuery = async (index: number) => {
    const current = messages[index];
    if (!current.query) return;

    let parsedQuery;
    try {
      parsedQuery = JSON.parse(current.query);
    } catch {
      isEditingRef.current = true;
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index
            ? { ...msg, queryError: "Invalid JSON format. Please correct it before running." }
            : msg
        )
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/indexer-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedQuery)
      });

      if (!response.ok) {
        throw new Error(`Backend error ${response.status}`);
      }

      const data = await response.json();

      isEditingRef.current = true; // Keep viewport position on result update
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index
            ? {
                ...msg,
                result: data,
                queryError: undefined
              }
            : msg
        )
      );
    } catch {
      isEditingRef.current = true;
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index
            ? { ...msg, queryError: "Failed executing query against indexer." }
            : msg
        )
      );
    }
  };

  // Update query state on Monaco editor change without triggering scroll
  const handleQueryChange = (index: number, newQuery: string | undefined) => {
    isEditingRef.current = true; // Flag editor change
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index
          ? {
              ...msg,
              query: newQuery ?? "",
              queryError: undefined
            }
          : msg
      )
    );
  };

  const handleCopy = async (query: string, index: number) => {
    await navigator.clipboard.writeText(query);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Playground Execution Handler
  const executePlaygroundQuery = async () => {
    setPlaygroundLoading(true);
    setPlaygroundError("");
    setPlaygroundResult(null);

    try {
      const parsedQuery = JSON.parse(playgroundQuery);

      const response = await fetch(`${API_BASE_URL}/indexer-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedQuery)
      });

      if (!response.ok) {
        throw new Error(`Backend error ${response.status}`);
      }

      const data = await response.json();
      setPlaygroundResult(data);
    } catch (err: any) {
      setPlaygroundError(err.message || "Failed executing query");
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const playgroundRows = playgroundResult?.hits?.hits?.map((item: any) =>
    flattenObject(item._source)
  ) || [];

  const playgroundColumns =
    playgroundRows.length > 0 ? Object.keys(playgroundRows[0]) : [];

  return (
    <div className="siem-chatbot">
      {/* Sidebar */}
      <aside className={`siem-sidebar ${!sidebarOpen ? "closed" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Shield size={20} />
          </div>
          <span className="sidebar-title">SIEM Portal</span>
        </div>
        <div
          className={`sidebar-item ${activeTab === "playground" ? "active" : ""}`}
          onClick={() => setActiveTab("playground")}
        >
          <Terminal size={18} />
          <span>Playground</span>
        </div>
        <div
          className={`sidebar-item ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <Bot size={18} />
          <span>Chatbot</span>
        </div>
      </aside>

      <main className="siem-main">
        <header className="siem-header">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
          <span className="header-title">
            {activeTab === "chat" ? "SIEM Query Assistant" : "Wazuh Query Playground"}
          </span>
        </header>

        {/* VIEW 1: CHATBOT */}
        {activeTab === "chat" ? (
          <>
            <div className="chat-area">
              <div className="messages">
                {messages.length === 0 ? (
                  <div>
                    <h1>How can I help with your SIEM!</h1>
                    <p>Generate and execute Wazuh OpenSearch queries using natural language.</p>
                  </div>
                ) : (
                  messages.map((item, index) => {
                    const hits = item.result?.hits?.hits || [];
                    const rows = hits.map((hit: any) => flattenObject(hit._source));
                    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

                    return (
                      <div key={index} className="message-row">
                        <div
                          className={`avatar ${
                            item.role === "user" ? "user-avatar" : "assistant-avatar"
                          }`}
                        >
                          {item.role === "user" ? <User size={18} /> : <Bot size={18} />}
                        </div>

                        <div className="message-content">
                          <div className="message-name">
                            {item.role === "user" ? "You" : "SIEM Assistant"}
                          </div>

                          <div className="message-text">{item.content}</div>

                          {/* Monaco Code Editor Query Card */}
                          {item.query !== undefined && (
                            <div className="query-card">
                              <div className="query-header">
                                <span>Generated Query (Editable)</span>
                                <button
                                  className="copy-button"
                                  onClick={() => handleCopy(item.query!, index)}
                                >
                                  {copiedIndex === index ? (
                                    <Check size={14} />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                  {copiedIndex === index ? "Copied" : "Copy"}
                                </button>
                              </div>

                              <div className="editor-container chat-editor">
                                <Editor
                                  height="260px"
                                  defaultLanguage="json"
                                  theme="vs-dark"
                                  value={item.query}
                                  onChange={(val) => handleQueryChange(index, val)}
                                  options={{
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    tabSize: 2,
                                    padding: { top: 10, bottom: 10 },
                                    fixedOverflowWidgets: true,
                                    scrollbar: {
                                      alwaysConsumeMouseWheel: false
                                    }
                                  }}
                                />
                              </div>

                              {item.queryError && (
                                <div className="playground-error" style={{ marginTop: "8px" }}>
                                  <AlertTriangle size={16} />
                                  <span>{item.queryError}</span>
                                </div>
                              )}

                              <div className="query-actions">
                                <button
                                  className="query-button run-button"
                                  onClick={() => handleRunChatQuery(index)}
                                >
                                  <Play size={14} style={{ marginRight: "6px" }} />
                                  Run Query
                                </button>
                              </div>
                            </div>
                          )}
                          {item.result && (
                            <div className="table-container">
                              <div className="table-title">Wazuh Results</div>
                              <div className="table-subtitle">
                                Total Hits: {item.result?.hits?.total?.value || 0}
                              </div>

                              {rows.length > 0 ? (
                                <table className="result-table">
                                  <thead>
                                    <tr>
                                      {columns.map((col) => (
                                        <th key={col}>{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rows.map((row: any, rowIndex: number) => (
                                      <tr key={rowIndex}>
                                        {columns.map((col) => (
                                          <td key={col}>{row[col] ?? "-"}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="no-records">No records found</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="input-area">
              <div className="input-box">
                <textarea
                  className="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask SIEM assistant..."
                  rows={1}
                />
                <button
                  className="send-button"
                  onClick={handleSend}
                  disabled={chatLoading || !message.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="disclaimer">
                Queries are executed against the Wazuh Indexer backend proxy.
              </div>
            </div>
          </>
        ) : (
          /* VIEW 2: PLAYGROUND EMBEDDED */
          <div className="playground-view">
            <div className="playground-container">
              <h2>Wazuh Query Playground</h2>
              <p className="playground-subtitle">
                Write an OpenSearch JSON query and execute it against Wazuh Indexer.
              </p>

              <div className="playground-card">
                <div className="editor-container playground-editor">
                  <Editor
                    height="350px"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={playgroundQuery}
                    onChange={(val) => setPlaygroundQuery(val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      tabSize: 2,
                      padding: { top: 10, bottom: 10 },
                      fixedOverflowWidgets: true,
                      scrollbar: {
                        alwaysConsumeMouseWheel: false
                      }
                    }}
                  />
                </div>

                <button
                  className="query-button run-button playground-execute-btn"
                  onClick={executePlaygroundQuery}
                  disabled={playgroundLoading}
                >
                  <Play size={18} />
                  {playgroundLoading ? "Executing..." : "Execute Query"}
                </button>

                {playgroundError && (
                  <div className="playground-error">
                    <AlertTriangle size={18} />
                    <span>{playgroundError}</span>
                  </div>
                )}
              </div>

              {playgroundResult && (
                <div className="table-container playground-results-card">
                  <div className="table-title">Wazuh Results</div>
                  <div className="table-subtitle">
                    Total Hits: {playgroundResult?.hits?.total?.value || 0}
                  </div>

                  {playgroundRows.length > 0 ? (
                    <table className="result-table">
                      <thead>
                        <tr>
                          {playgroundColumns.map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {playgroundRows.map((row: any, index: number) => (
                          <tr key={index}>
                            {playgroundColumns.map((col) => (
                              <td key={col}>{row[col] ?? "-"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-records">No records found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}