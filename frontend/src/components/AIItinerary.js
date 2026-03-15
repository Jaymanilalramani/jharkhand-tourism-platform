import React, { useState } from 'react';
import axios from 'axios';
import './AIItinerary.css';

const AIItinerary = () => {
  const [interests, setInterests] = useState('historical sites, nature');
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState('moderate');
  const [includeNightlife, setIncludeNightlife] = useState(false);
  const [budget, setBudget] = useState('mid');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi! I'm your Jharkhand travel assistant. Need help refining your itinerary?", isBot: true }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/itinerary', { 
        interests, 
        days, 
        pace, 
        includeNightlife, 
        budget 
      });
      setResult(res.data);
      setActiveTab('result');
    } catch (err) {
      setResult({ message: 'Error fetching itinerary. Please try again later.' });
      setActiveTab('result');
    }
    setLoading(false);
  };

  const handleDemo = () => {
    setInterests('waterfalls, tribal culture, wildlife');
    setDays(4);
    setPace('relaxed');
    setIncludeNightlife(false);
    setBudget('budget');
    
    // Simulate API response for demo
    setTimeout(() => {
      setResult({
        message: 'Your Jharkhand Adventure Itinerary',
        itinerary: [
          { day: 1, place: 'Ranchi', activity: 'Visit Hundru Falls and Jonha Falls', notes: 'Great for photography' },
          { day: 2, place: 'Betla National Park', activity: 'Jungle safari and wildlife spotting', notes: 'Early morning recommended' },
          { day: 3, place: 'Netarhat', activity: 'Explore tribal villages and enjoy sunset point', notes: 'Try local cuisine' },
          { day: 4, place: 'Dassam Falls', activity: 'Trekking and swimming', notes: 'Wear comfortable shoes' }
        ],
        tips: [
          'Carry sufficient water during treks',
          'Hire local guides for better experience',
          'Try local tribal cuisine for authentic experience'
        ]
      });
      setActiveTab('result');
      setLoading(false);
    }, 1500);
    
    setLoading(true);
  };

  const handleQuickSample = () => {
    setInterests('historical sites, temples'); 
    setDays(2); 
    setPace('fast'); 
    setBudget('mid');
    
    // Simulate API response for quick sample
    setTimeout(() => {
      setResult({
        message: 'Jharkhand Heritage Tour',
        itinerary: [
          { day: 1, place: 'Deoghar', activity: 'Visit Baidyanath Temple and Naulakha Mandir', notes: 'Respect temple customs' },
          { day: 2, place: 'Ranchi', activity: 'Explore Jagannath Temple and Tribal Museum', notes: 'Guided tours available' }
        ],
        tips: [
          'Dress modestly for temple visits',
          'Check temple timings in advance',
          'Hire authorized guides only'
        ]
      });
      setActiveTab('result');
      setLoading(false);
    }, 1500);
    
    setLoading(true);
  };

  const resetForm = () => {
    setInterests('historical sites, nature');
    setDays(3);
    setPace('moderate');
    setIncludeNightlife(false);
    setBudget('mid');
    setResult(null);
    setActiveTab('input');
    setShowDownloadOptions(false);
    setShowShareOptions(false);
    setEmail('');
    setEmailSent(false);
  };

  const downloadItinerary = (format) => {
    // In a real app, this would generate an actual file
    // For this demo, we'll just show a success message
    setShowDownloadOptions(false);
    
    // Simulate download process
    setTimeout(() => {
      alert(`Your itinerary has been downloaded as ${format.toUpperCase()}!`);
    }, 500);
  };

  const shareItinerary = (method) => {
    if (method === 'email') {
      if (!email) {
        alert('Please enter an email address');
        return;
      }
      
      // Simulate sending email
      setTimeout(() => {
        setEmailSent(true);
        setTimeout(() => {
          setShowShareOptions(false);
          setEmailSent(false);
          setEmail('');
          alert(`Itinerary successfully sent to ${email}!`);
        }, 2000);
      }, 1000);
    } else {
      setShowShareOptions(false);
      alert(`Itinerary shared via ${method}!`);
    }
  };

  const copyToClipboard = () => {
    // Create a text version of the itinerary
    const itineraryText = `Jharkhand Travel Itinerary\n\n${result.message}\n\n` +
      result.itinerary.map(item => 
        `Day ${item.day}: ${item.place} - ${item.activity}${item.notes ? ` (${item.notes})` : ''}`
      ).join('\n') +
      `\n\nTravel Tips:\n` +
      result.tips.map(tip => `• ${tip}`).join('\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(itineraryText)
      .then(() => {
        alert('Itinerary copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
    
    setShowShareOptions(false);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { text: chatInput, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      let botResponse = "That sounds like a great addition! I can help you adjust the travel pace or suggest nearby hidden gems in Jharkhand.";
      
      const lowerInput = chatInput.toLowerCase();
      if (lowerInput.includes("hotel") || lowerInput.includes("stay")) 
        botResponse = "For your budget, I recommend staying near the Main Road in Ranchi or the eco-resorts in Netarhat.";
      else if (lowerInput.includes("food") || lowerInput.includes("eat")) 
        botResponse = "You must try Dhuska and Litti Chokha while you're there! Would you like me to add food stops to your plan?";
      else if (lowerInput.includes("transport") || lowerInput.includes("car")) 
        botResponse = "Hiring a private taxi is best for waterfalls, while trains are great for reaching Deoghar or Jamshedpur.";
      else if (lowerInput.includes("hello") || lowerInput.includes("hi")) 
        botResponse = "Hello! How can I help you customize your Jharkhand trip today?";

      setChatMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="ai-itinerary-container">
      <div className="header">
        <h2>AI-Powered Jharkhand Itinerary Planner</h2>
        <p>Let our AI create the perfect travel plan based on your preferences</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Plan Your Trip
        </button>
        <button 
          className={`tab ${activeTab === 'result' ? 'active' : ''}`}
          onClick={() => result && setActiveTab('result')}
          disabled={!result}
        >
          Itinerary Results
        </button>
      </div>

      {activeTab === 'input' && (
        <div className="input-section">
          <div className="demo-buttons">
            <button onClick={handleDemo} className="demo-btn">
              Try Demo (Nature & Culture)
            </button>
            <button onClick={handleQuickSample} className="demo-btn">
              Quick Sample (Heritage Tour)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="itinerary-form">
            <div className="form-group">
              <label className="form-label">Your Interests:</label>
              <input 
                value={interests} 
                onChange={e => setInterests(e.target.value)} 
                required 
                className="form-input"
                placeholder="e.g., waterfalls, temples, wildlife, adventure"
              />
              <div className="form-tip">Separate interests with commas</div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Number of Days:</label>
              <input 
                type="number" 
                value={days} 
                min={1} 
                max={14}
                onChange={e => setDays(Number(e.target.value))} 
                required 
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Travel Pace:</label>
              <div className="option-group">
                <button
                  type="button"
                  className={`option-btn ${pace === 'relaxed' ? 'selected' : ''}`}
                  onClick={() => setPace('relaxed')}
                >
                  Relaxed
                </button>
                <button
                  type="button"
                  className={`option-btn ${pace === 'moderate' ? 'selected' : ''}`}
                  onClick={() => setPace('moderate')}
                >
                  Moderate
                </button>
                <button
                  type="button"
                  className={`option-btn ${pace === 'fast' ? 'selected' : ''}`}
                  onClick={() => setPace('fast')}
                >
                  Fast-paced
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Budget Level:</label>
              <div className="option-group">
                <button
                  type="button"
                  className={`option-btn ${budget === 'budget' ? 'selected' : ''}`}
                  onClick={() => setBudget('budget')}
                >
                  Budget
                </button>
                <button
                  type="button"
                  className={`option-btn ${budget === 'mid' ? 'selected' : ''}`}
                  onClick={() => setBudget('mid')}
                >
                  Mid-range
                </button>
                <button
                  type="button"
                  className={`option-btn ${budget === 'luxury' ? 'selected' : ''}`}
                  onClick={() => setBudget('luxury')}
                >
                  Luxury
                </button>
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={includeNightlife} 
                  onChange={e => setIncludeNightlife(e.target.checked)} 
                  className="checkbox-input"
                />
                <span className="checkmark"></span>
                Include nightlife and evening activities
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Planning Your Journey...
                </>
              ) : (
                'Generate My Itinerary'
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'result' && result && (
        <div className="result-section">
          <div className="result-header">
            <h3>{result.message}</h3>
            <button onClick={resetForm} className="new-plan-btn">
              Create New Plan
            </button>
          </div>
          
          {result.itinerary && (
            <div className="itinerary-days">
              {result.itinerary.map((item, idx) => (
                <div key={idx} className="day-card">
                  <div className="day-header">
                    <span className="day-badge">Day {item.day}</span>
                    <span className="day-place">{item.place}</span>
                  </div>
                  <div className="day-content">
                    <p className="day-activity">{item.activity}</p>
                    {item.notes && (
                      <div className="day-notes">
                        <span className="notes-label">Tips:</span> {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {result.tips && (
            <div className="tips-section">
              <h4>Local Tips & Recommendations</h4>
              <ul className="tips-list">
                {result.tips.map((t, i) => (
                  <li key={i} className="tip-item">
                    <span className="tip-icon">💡</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="actions">
            <div className="action-group">
              <button 
                className="action-btn"
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              >
                Download Itinerary
                <span className={`arrow ${showDownloadOptions ? 'up' : 'down'}`}>▼</span>
              </button>
              
              {showDownloadOptions && (
                <div className="dropdown-menu">
                  <button onClick={() => downloadItinerary('pdf')} className="dropdown-item">
                    <span className="icon">📄</span> PDF Document
                  </button>
                  <button onClick={() => downloadItinerary('text')} className="dropdown-item">
                    <span className="icon">📝</span> Text File
                  </button>
                  <button onClick={() => downloadItinerary('image')} className="dropdown-item">
                    <span className="icon">🖼️</span> Image (for sharing)
                  </button>
                </div>
              )}
            </div>
            
            <div className="action-group">
              <button 
                className="action-btn secondary"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                Share with Travel Companions
                <span className={`arrow ${showShareOptions ? 'up' : 'down'}`}>▼</span>
              </button>
              
              {showShareOptions && (
                <div className="dropdown-menu">
                  <div className="share-option">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="email-input"
                    />
                    <button 
                      onClick={() => shareItinerary('email')}
                      className="email-send-btn"
                      disabled={emailSent}
                    >
                      {emailSent ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                  <button onClick={copyToClipboard} className="dropdown-item">
                    <span className="icon">📋</span> Copy to Clipboard
                  </button>
                  <button onClick={() => shareItinerary('whatsapp')} className="dropdown-item">
                    <span className="icon">💬</span> WhatsApp
                  </button>
                  <button onClick={() => shareItinerary('other apps')} className="dropdown-item">
                    <span className="icon">📱</span> Other Apps
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Assistant Toggle */}
      <div className="chat-assistant-wrapper">
        {chatOpen ? (
          <div className={`chat-window ${chatMinimized ? 'minimized' : ''}`}>
            <div className="chat-header">
              <span onClick={() => setChatMinimized(!chatMinimized)} className="cursor-pointer">
                Trip Assistant {chatMinimized ? '▲' : '▼'}
              </span>
              <div className="chat-header-actions">
                <button onClick={() => setChatOpen(false)} title="Close">✕</button>
              </div>
            </div>
            {!chatMinimized && (
              <>
                <div className="chat-messages">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`chat-bubble ${m.isBot ? 'bot' : 'user'}`}>
                      {m.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="chat-bubble bot typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  )}
                </div>
                <form onSubmit={handleChatSend} className="chat-input-area">
                  <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    autoFocus
                  />
                  <button type="submit" disabled={!chatInput.trim()}>Send</button>
                </form>
              </>
            )}
          </div>
        ) : (
          <button 
            className="chat-toggle-btn"
            onClick={() => setChatOpen(true)}
          >
            💬 Ask Assistant
          </button>
        )}
      </div>

      <style jsx>{`
        .ai-itinerary-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .header h2 {
          font-size: 2rem;
          color: #1e3a8a;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        
        .header p {
          color: #64748b;
          font-size: 1.1rem;
        }
        
        .tabs {
          display: flex;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 2rem;
        }
        
        .tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          position: relative;
        }
        
        .tab.active {
          color: #3b82f6;
        }
        
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #3b82f6;
        }
        
        .tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .demo-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .demo-btn {
          flex: 1;
          padding: 0.8rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .demo-btn:hover {
          background: #e0f2fe;
          border-color: #3b82f6;
          color: #3b82f6;
        }
        
        .itinerary-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
        }
        
        .form-input {
          padding: 0.8rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        
        .form-tip {
          font-size: 0.8rem;
          color: #6b7280;
        }
        
        .option-group {
          display: flex;
          gap: 0.5rem;
        }
        
        .option-btn {
          flex: 1;
          padding: 0.7rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .option-btn.selected {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .checkbox-group {
          margin: 1rem 0;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          padding-left: 2rem;
        }
        
        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        
        .checkmark {
          position: absolute;
          left: 0;
          height: 1.2rem;
          width: 1.2rem;
          background-color: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        
        .checkbox-input:checked ~ .checkmark {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        
        .checkbox-input:checked ~ .checkmark:after {
          display: block;
          left: 0.4rem;
          top: 0.1rem;
          width: 0.3rem;
          height: 0.7rem;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .submit-btn {
          padding: 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.3s ease;
        }
        
        .submit-btn:hover {
          background: #2563eb;
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .result-section {
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .result-header h3 {
          color: #1e3a8a;
          font-size: 1.5rem;
        }
        
        .new-plan-btn {
          padding: 0.6rem 1.2rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .new-plan-btn:hover {
          background: #e0f2fe;
          border-color: #3b82f6;
          color: #3b82f6;
        }
        
        .itinerary-days {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .day-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          border-left: 4px solid #3b82f6;
        }
        
        .day-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .day-badge {
          background: #3b82f6;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .day-place {
          font-weight: 600;
          color: #1e293b;
        }
        
        .day-activity {
          color: #475569;
          margin-bottom: 0.5rem;
        }
        
        .day-notes {
          background: #e0f2fe;
          padding: 0.7rem;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #0369a1;
        }
        
        .notes-label {
          font-weight: 600;
        }
        
        .tips-section {
          background: #f0f9ff;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .tips-section h4 {
          color: #0369a1;
          margin-bottom: 1rem;
        }
        
        .tips-list {
          list-style: none;
          padding: 0;
        }
        
        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          padding: 0.7rem 0;
          border-bottom: 1px solid #bae6fd;
        }
        
        .tip-item:last-child {
          border-bottom: none;
        }
        
        .tip-icon {
          font-size: 1.2rem;
        }
        
        .actions {
          display: flex;
          gap: 1rem;
          position: relative;
        }
        
        .action-group {
          flex: 1;
          position: relative;
        }
        
        .action-btn {
          width: 100%;
          padding: 0.8rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .action-btn:hover {
          background: #2563eb;
        }
        
        .action-btn.secondary {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }
        
        .action-btn.secondary:hover {
          background: #e2e8f0;
        }
        
        .arrow {
          font-size: 0.7rem;
          transition: transform 0.3s ease;
        }
        
        .arrow.up {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 0.5rem;
          padding: 0.5rem;
          z-index: 10;
          animation: fadeIn 0.3s ease;
        }
        
        .dropdown-item {
          width: 100%;
          padding: 0.8rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: #f1f5f9;
        }
        
        .share-option {
          display: flex;
          gap: 0.5rem;
          padding: 0.8rem;
        }
        
        .email-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .email-send-btn {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .email-send-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .chat-assistant-wrapper {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .chat-toggle-btn {
          background: #1e3a8a;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          font-weight: 600;
        }

        .chat-window {
          width: 300px;
          height: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chat-window.minimized {
          height: auto;
        }

        .chat-header {
          background: #1e3a8a;
          color: white;
          padding: 0.8rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chat-header-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chat-bubble {
          padding: 0.6rem 0.8rem;
          border-radius: 12px;
          max-width: 85%;
          font-size: 0.9rem;
        }

        .chat-bubble.bot {
          background: #f1f5f9;
          align-self: flex-start;
        }

        .chat-bubble.user {
          background: #3b82f6;
          color: white;
          align-self: flex-end;
        }

        .chat-input-area {
          padding: 0.8rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.5rem;
        }

        .chat-input-area input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 0.4rem;
        }

        .typing .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-right: 3px;
          background: #94a3b8;
          border-radius: 50%;
          animation: wave 1.3s linear infinite;
        }

        .typing .dot:nth-child(2) {
          animation-delay: -1.1s;
        }

        .typing .dot:nth-child(3) {
          animation-delay: -0.9s;
        }

        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
        
        @media (max-width: 768px) {
          .ai-itinerary-container {
            padding: 1.5rem;
          }
          
          .header h2 {
            font-size: 1.7rem;
          }
          
          .demo-buttons {
            flex-direction: column;
          }
          
          .option-group {
            flex-direction: column;
          }
          
          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .actions {
            flex-direction: column;
          }
          
          .share-option {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AIItinerary;