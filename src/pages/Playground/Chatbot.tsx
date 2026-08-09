import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Menu,
  Plus,
  MessageSquare,
  Settings,
  Send,
  User,
  Bot,
  Copy,
  Check,
  Terminal,
  ChevronLeft,
} from "lucide-react";

import "./Chatbot.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  query?: string;
};

const Chatbot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
   const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const text = message.trim();

    if (!text) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");

    // Temporary response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "I generated a Wazuh query based on your request.",
        query:
          'rule.id:5710 AND location:"/var/log/auth.log"',
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    }, 800);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleCopy = async (
    query: string,
    index: number
  ) => {
    try {
      await navigator.clipboard.writeText(query);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="siem-chatbot">

      {/* SIDEBAR */}

      <aside
        className={
          sidebarOpen
            ? "siem-sidebar"
            : "siem-sidebar closed"
        }
      >

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <Shield size={21} />
          </div>

          <div className="sidebar-title">
            SIEM Assistant
          </div>

        </div>

        <button
          className="new-chat"
          onClick={handleNewChat}
        >
          <Plus size={17} />
          New Chat
        </button>

        <div className="sidebar-label">
          Workspace
        </div>

        <div className="sidebar-item active" onClick={() => navigate("/playground")}>
          <Terminal size={17} />
          Playground
        </div>

        <div className="sidebar-item">
          <MessageSquare size={17} />
          Chat History
        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-item">
            <Settings size={17} />
            Settings
          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="siem-main">

        {/* HEADER */}

        <header className="siem-header">

          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >

            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <Menu size={20} />
            )}

          </button>
      
          <div className="header-title" onClick={() => navigate("/playground")}>
      

            <Terminal size={17} />

            Playground

            <span>• Wazuh</span>

          </div>

          <div className="backend-status">

            <span className="status-dot" />

            Backend Connected

          </div>

        </header>

        {/* CHAT AREA */}

        <section className="chat-area">

          {messages.length === 0 ? (

            <div className="welcome">

              <div className="welcome-logo">
                <Shield size={34} />
              </div>

              <h1 className="welcome-title">
                How can I help with your SIEM?
              </h1>

              <p className="welcome-text">
                Generate, customize and execute
                Wazuh queries using natural language.
                You stay in control of every query.
              </p>

            </div>

          ) : (

            <div className="messages">

              {messages.map(
                (item, index) => (

                  <div
                    key={index}
                    className="message-row"
                  >

                    <div
                      className={
                        item.role === "user"
                          ? "avatar user-avatar"
                          : "avatar assistant-avatar"
                      }
                    >

                      {item.role === "user" ? (
                        <User size={17} />
                      ) : (
                        <Bot size={17} />
                      )}

                    </div>

                    <div className="message-content">

                      <div className="message-name">

                        {item.role === "user"
                          ? "You"
                          : "SIEM Assistant"}

                      </div>

                      <div className="message-text">
                        {item.content}
                      </div>

                      {item.query && (

                        <div className="query-card">

                          <div className="query-header">

                            <Terminal size={14} />

                            <span>
                              Wazuh Query
                            </span>

                            <button
                              className="copy-button"
                              onClick={() =>
                                handleCopy(
                                  item.query!,
                                  index
                                )
                              }
                            >

                              {copiedIndex ===
                              index ? (
                                <>
                                  <Check size={14} />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  Copy
                                </>
                              )}

                            </button>

                          </div>

                          <pre className="query-code">
                            {item.query}
                          </pre>

                          <div className="query-actions">

                            <button className="query-button">
                              Edit Query
                            </button>

                            <button className="query-button run-button">
                              Run Query
                            </button>

                          </div>

                        </div>

                      )}

                    </div>

                  </div>

                )
              )}

              <div ref={messagesEndRef} />

            </div>

          )}

        </section>

        {/* INPUT */}

        <div className="input-area">

          <div className="input-box">

            <textarea
              ref={textareaRef}
              className="message-input"
              rows={1}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message SIEM Assistant..."
            />

            <button
              className="send-button"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send size={17} />
            </button>

          </div>

          <div className="disclaimer">
            SIEM Assistant generates Wazuh queries.
            Verify queries before execution.
          </div>

        </div>

      </main>

    </div>
  );
};

export default Chatbot;