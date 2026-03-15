import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Welcome to your Jharkhand Tourism Dashboard! How can I assist you today?", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { text: chatInput, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I can help you navigate your stats or find specific tourism resources. What would you like to know?";
      const input = chatInput.toLowerCase();
      
      if (input.includes("revenue")) botResponse = "Your current revenue is ₹8.72 Cr, showing a steady growth this quarter.";
      else if (input.includes("visitor")) botResponse = "You have 24,583 total visitors. Ranchi and Deoghar are currently the top destinations.";
      else if (input.includes("booking")) botResponse = "There are 1,247 active bookings. The most recent was for Hundru Falls 2 hours ago.";
      else if (input.includes("help") || input.includes("hi")) botResponse = "Hello! I'm your Dashboard Assistant. You can ask me about visitors, revenue, or recent activities.";

      setChatMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-8 text-2xl font-bold text-center">Tourism Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 text-center text-white bg-blue-500 rounded-lg">
          <h3 className="text-lg font-bold">Total Visitors</h3>
          <p className="mt-2 text-3xl">24,583</p>
        </div>
        <div className="p-6 text-center text-white bg-green-500 rounded-lg">
          <h3 className="text-lg font-bold">Destinations</h3>
          <p className="mt-2 text-3xl">42</p>
        </div>
        <div className="p-6 text-center text-white bg-purple-500 rounded-lg">
          <h3 className="text-lg font-bold">Revenue</h3>
          <p className="mt-2 text-3xl">₹8.72 Cr</p>
        </div>
        <div className="p-6 text-center text-white bg-yellow-500 rounded-lg">
          <h3 className="text-lg font-bold">Bookings</h3>
          <p className="mt-2 text-3xl">1,247</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/itinerary" className="block p-3 bg-gray-100 rounded hover:bg-gray-200">
              Create New Itinerary
            </Link>
            <Link to="/marketplace" className="block p-3 bg-gray-100 rounded hover:bg-gray-200">
              Browse Marketplace
            </Link>
            <Link to="/arvr" className="block p-3 bg-gray-100 rounded hover:bg-gray-200">
              Explore AR/VR Experiences
            </Link>
            <Link to="/analytics" className="block p-3 bg-gray-100 rounded hover:bg-gray-200">
              View Analytics
            </Link>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-bold">Recent Activity</h3>
          <div className="space-y-3">
            <div className="pb-3 border-b">
              <p className="font-semibold">New booking for Hundru Falls</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
            <div className="pb-3 border-b">
              <p className="font-semibold">Itinerary generated for 4 days</p>
              <p className="text-sm text-gray-600">5 hours ago</p>
            </div>
            <div className="pb-3 border-b">
              <p className="font-semibold">Product purchased from marketplace</p>
              <p className="text-sm text-gray-600">Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Assistant */}
      <div className="fixed z-50 bottom-6 right-6">
        {chatOpen ? (
          <div className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-2xl w-80 h-96">
            <div className="flex items-center justify-between p-4 text-white bg-blue-600">
              <span className="font-bold">Dashboard AI</span>
              <button onClick={() => setChatOpen(false)} className="hover:text-gray-200">✕</button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
              {chatMessages.map((m, i) => (
                <div key={i} className={`max-w-[80%] p-2 rounded-lg text-sm ${m.isBot ? 'bg-white text-gray-800 self-start shadow-sm' : 'bg-blue-500 text-white self-end ml-auto'}`}>
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div className="self-start p-2 text-xs text-gray-800 bg-white rounded-lg shadow-sm">
                  AI is thinking...
                </div>
              )}
            </div>
            <form onSubmit={handleChatSend} className="flex gap-2 p-3 bg-white border-t">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about stats..."
                className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                Send
              </button>
            </form>
          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 p-4 text-white transition-all bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
          >
            <span className="text-xl">💬</span>
            <span className="font-medium">Assistant</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .self-start { align-self: flex-start; }
        .self-end { align-self: flex-end; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bg-white.w-80 {
          animation: fadeIn 0.3s ease-out;
        }

        .typing-dot {
          width: 4px;
          height: 4px;
          background: #94a3b8;
          border-radius: 50%;
          display: inline-block;
          margin-right: 2px;
          animation: wave 1.3s infinite;
        }

        @keyframes wave {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        @media (max-width: 640px) {
          .fixed.bottom-6 {
            bottom: 1rem;
            right: 1rem;
          }
          .bg-white.w-80 {
            width: calc(100vw - 2rem);
            height: 70vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;