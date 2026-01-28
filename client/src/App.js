import React from 'react';
import Chatbot from './components/Chatbot';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <div className="background-overlay"></div>
      
      <main className="main-content">
        <header className="header">
          <h1>Mental Health Companion</h1>
          <p className="tagline">
            A safe space to talk • You're not alone
          </p>
        </header>

        <div className="chat-wrapper">
          <div className="welcome-card">
            <p>Hi! I'm here whenever you need to talk.</p>
            <p>What's on your mind today?</p>
          </div>

          <Chatbot />
        </div>

        <footer className="footer">
          <p>
            Not a substitute for professional help • 
            In crisis call: <strong>Tele MANAS (14416), (1-800-891-4416)</strong> or <strong>KIRAN (1800-599-0019)</strong>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;