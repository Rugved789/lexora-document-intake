import React, { useState, useRef, useEffect } from 'react';

function ConversationPanel({ messages, onSendMessage, sending }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !sending) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-paper rounded-2xl shadow-paper border border-primary/5">
      {/* Header */}
      <div className="px-6 py-4 border-b border-primary/10 bg-background-subtle rounded-t-2xl">
        <h2 className="text-lg font-bold text-primary font-serif">Conversation</h2>
        <p className="text-sm text-secondary mt-1">
          Share your wishes naturally — we'll help structure the information
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">Start the conversation</h3>
              <p className="text-secondary text-sm">
                Tell me about your wishes, and I'll help organize the information into a clear document.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
              )}
              
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-paper shadow-md'
                    : 'bg-white border border-primary/10 text-primary shadow-sm'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                {msg.role === 'assistant' && msg.clarification && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 flex-shrink-0 mt-0.5">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                      <span className="text-sm text-amber-800 font-medium">Needs clarification</span>
                    </div>
                  </div>
                )}
                {msg.createdAt && (
                  <div className="mt-2 text-xs opacity-60">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              )}
            </div>
          ))
        )}
        {sending && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div className="bg-white border border-primary/10 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-primary/10 bg-background-subtle rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            rows="2"
            disabled={sending}
            className="flex-1 px-5 py-3 bg-white border-2 border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-primary placeholder-secondary-light resize-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="px-6 py-3 bg-primary text-paper rounded-xl font-semibold hover:bg-primary-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md flex items-center gap-2 h-fit"
          >
            <span>{sending ? 'Sending...' : 'Send'}</span>
            {!sending && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConversationPanel;
