import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // for auto-scroll

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: input });
      const botMessage = { text: res.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { text: "I'm sorry, I had trouble responding... Could you try again?", sender: 'bot' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div 
        className="chat-container" 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px', 
          background: '#f8f9fa' 
        }}
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`message ${msg.sender}`}
            style={{
              margin: '12px 0',
              padding: '12px 16px',
              borderRadius: '18px',
              maxWidth: '80%',
              lineHeight: '1.4',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#007aff' : '#e5e5ea',
              color: msg.sender === 'user' ? 'white' : 'black',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px',
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div 
            className="message bot" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <div className="typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
            <span style={{ color: '#666', fontStyle: 'italic' }}>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          padding: '12px', 
          background: 'white', 
          borderTop: '1px solid #ddd' 
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="How are you feeling right now?"
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #ccc',
            borderRadius: '24px',
            marginRight: '8px',
            fontSize: '1rem'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: loading ? '#aaa' : '#007aff',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </form>

      {/* Add this to styles.css or inline */}
      <style jsx>{`
        .typing-indicator span {
          animation: typing 1.4s infinite;
          opacity: 0;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;