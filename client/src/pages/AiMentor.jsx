import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import axios from 'axios';

// A custom, lightweight, 100% reliable Markdown Renderer to avoid Vite/ESM runtime dependency conflicts
const MarkdownRenderer = ({ text }) => {
  if (!text) return null;

  // Split by newlines to render structured lists and paragraphs
  const lines = text.split("\n");

  const parseBoldAndItalic = (str) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{part}</strong>;
      }
      
      const italicParts = part.split(/\*(.*?)\*/g);
      return italicParts.map((subPart, j) => {
        if (j % 2 === 1) {
          return <em key={j} style={{ fontStyle: 'italic' }}>{subPart}</em>;
        }
        return subPart;
      });
    });
  };

  return (
    <div className="markdown-content">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: '0.5rem' }}></div>;

        // Check for step/header lines: **Step 1: Research**
        const isBoldHeader = trimmed.match(/^\*\*(.*?)\*\*\s*$/);
        if (isBoldHeader) {
          return <h3 key={idx} style={{ margin: '1rem 0 0.5rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{isBoldHeader[1]}</h3>;
        }

        // Check for bold lists: 1. **Fastweb**: A popular...
        const orderedBoldList = trimmed.match(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*)/);
        if (orderedBoldList) {
          const [_, num, boldText, restText] = orderedBoldList;
          return (
            <div key={idx} style={{ paddingLeft: '1.25rem', textIndent: '-1.25rem', margin: '0.4rem 0' }}>
              <strong>{num}. {boldText}</strong>: {parseBoldAndItalic(restText)}
            </div>
          );
        }

        // Check for standard lists: 1. **College Website**
        const standardList = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (standardList) {
          const [_, num, content] = standardList;
          return (
            <div key={idx} style={{ paddingLeft: '1.25rem', textIndent: '-1.25rem', margin: '0.4rem 0' }}>
              {num}. {parseBoldAndItalic(content)}
            </div>
          );
        }

        // Normal paragraph line
        return <p key={idx} style={{ margin: '0.5rem 0' }}>{parseBoldAndItalic(trimmed)}</p>;
      })}
    </div>
  );
};

const AiMentor = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Campus Mentor. Ask me about placements, professors, scholarships, or career advice.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: userMsg,
        history: messages
      });
      
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error("AI Error:", error);
      const errMsg = error.response?.data?.error || "Sorry, I am having trouble connecting to my brain right now. Make sure you set your GROQ_API_KEY inside server/.env";
      setMessages(prev => [...prev, { sender: 'bot', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
      <div className="flex items-center gap-3 mb-6">
        <Bot size={32} color="var(--accent-color)" />
        <h2>AI Campus Mentor</h2>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              {msg.sender === 'bot' && <div style={{background: 'var(--bg-card-hover)', padding: '0.5rem', borderRadius: '50%'}}><Bot size={16}/></div>}
              
              <div style={{
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'var(--bg-card-hover)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderTopRightRadius: msg.sender === 'user' ? 0 : '1rem',
                borderTopLeftRadius: msg.sender === 'bot' ? 0 : '1rem',
              }}>
                <MarkdownRenderer text={msg.text} />
              </div>

              {msg.sender === 'user' && <div style={{background: 'var(--bg-card-hover)', padding: '0.5rem', borderRadius: '50%'}}><User size={16}/></div>}
            </div>
          ))}
          {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)' }}>AI is thinking...</div>}
        </div>

        <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Ask anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AiMentor;
