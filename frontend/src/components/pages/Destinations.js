import React, { useState } from 'react';

const Destinations = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [itineraryAdded, setItineraryAdded] = useState(false);
  const [itineraryDays, setItineraryDays] = useState([
    { day: 1, date: '2023-10-15', destinations: [] },
    { day: 2, date: '2023-10-16', destinations: [] },
    { day: 3, date: '2023-10-17', destinations: [] }
  ]);
  const [currentARView, setCurrentARView] = useState('default');
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Namaste! I'm your Jharkhand Destination Guide. Which place are you planning to visit?", isBot: true }
  ]);

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { text: chatInput, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      let botResponse = "Jharkhand has amazing spots! Ranchi is famous for waterfalls, while Deoghar is great for spiritual peace. Would you like to see the best time to visit any specific location?";
      const input = chatInput.toLowerCase();
      if (input.includes("hundru")) botResponse = "Hundru Falls is 45km from Ranchi. It's best visited between July and March for the most spectacular views!";
      else if (input.includes("temple") || input.includes("baidyanath")) botResponse = "Baidyanath Dham in Deoghar is one of the 12 Jyotirlingas. It's very peaceful for meditation.";
      else if (input.includes("fee") || input.includes("cost")) botResponse = "Most natural sites like waterfalls have a nominal entry fee of ₹25-50. Temples are generally free.";
      
      setChatMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 800);
  };

  const destinations = [
    {
      id: 1,
      name: 'Hundru Falls',
      type: 'Waterfall',
      district: 'Ranchi',
      description: 'One of the most famous waterfalls in Jharkhand, perfect for nature lovers.',
      image: 'https://tse2.mm.bing.net/th/id/OIP.n75-mNt9l6z2A90WQ5fTgAHaEK?pid=Api&P=0&h=180',
      details: "Hundru Falls is one of the highest waterfalls in Jharkhand, formed by the Subarnarekha River. The water drops from a height of 98 meters (322 feet), creating a spectacular sight especially during the monsoon season. The pool at the bottom is perfect for swimming and the surrounding rocks make for great picnic spots.",
      bestTime: "July to March",
      entryFee: "₹25 per person",
      activities: ["Photography", "Swimming", "Picnics", "Trekking"],
      howToReach: "Located 45 km from Ranchi. Well connected by road. Nearest airport is Birsa Munda Airport in Ranchi.",
      arExperience: "Experience a virtual tour of Hundru Falls with our AR technology. See the waterfall from different angles and get a preview of the stunning views before you visit.",
      arImages: [
        "https://tse2.mm.bing.net/th/id/OIP.n75-mNt9l6z2A90WQ5fTgAHaEK?pid=Api&P=0&h=180",
        "https://tse2.mm.bing.net/th/id/OIP.n75-mNt9l6z2A90WQ5fTgAHaEK?pid=Api&P=0&h=180"
      ]
    },
    {
      id: 2,
      name: 'Baidyanath Dham',
      type: 'Religious',
      district: 'Deoghar',
      description: 'A major Jyotirlinga temple attracting lakhs of devotees every year.',
      image: 'https://tse1.mm.bing.net/th/id/OIP.8rBqw4B6SxQI-yHhhHws0wAAAA?pid=Api&P=0&h=180',
      details: "Baidyanath Dham, also known as Baba Dham, is one of the twelve Jyotirlingas in India. It's an important pilgrimage site for Hindus, especially during the month of Shravan when millions of devotees carry water from the Ganges in Sultanganj to offer at the temple. The temple complex consists of the main temple of Baba Baidyanath and 21 other temples.",
      bestTime: "July to August (Shravan season) and October to March",
      entryFee: "Free (Special darshan tickets available)",
      activities: ["Prayer", "Meditation", "Participate in Aarti"],
      howToReach: "Well connected by road and rail. Deoghar has its own railway station and airport.",
      arExperience: "Explore the temple complex through our AR experience. View the intricate architecture and learn about the history and significance of this sacred site.",
      arImages: [
        "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1600055882386-5d18b02a0d51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGVtcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=80"
      ]
    }
  ];

  const handleExploreClick = (destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
    setActiveModalType(null);
    setItineraryAdded(false);
    setCurrentARView('default');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
    setActiveModalType(null);
    setCurrentARView('default');
  };

  const handleAddToItinerary = () => {
    setActiveModalType('itinerary');
  };

  const handleViewInAR = () => {
    setActiveModalType('ar');
  };

  const confirmAddToItinerary = () => {
    if (selectedDate) {
      // Find the day object for the selected date
      const selectedDay = itineraryDays.find(day => day.date === selectedDate) || itineraryDays[0];
      
      // Add the destination to the itinerary
      const updatedDays = itineraryDays.map(day => {
        if (day.date === selectedDay.date) {
          return {
            ...day,
            destinations: [...day.destinations, selectedDestination]
          };
        }
        return day;
      });
      
      setItineraryDays(updatedDays);
      setItineraryAdded(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setActiveModalType(null);
        setItineraryAdded(false);
        setSelectedDate('');
      }, 2000);
    }
  };

  const renderItineraryModal = () => (
    <div className="itinerary-modal">
      <h3>Add to Your Itinerary</h3>
      {!itineraryAdded ? (
        <>
          <p>Select a date to add {selectedDestination.name} to your itinerary:</p>
          <div className="date-picker">
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Select a day</option>
              {itineraryDays.map(day => (
                <option key={day.day} value={day.date}>
                  Day {day.day} ({new Date(day.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div className="itinerary-preview">
            <h4>Your Itinerary Preview:</h4>
            {itineraryDays.map(day => (
              <div key={day.day} className="itinerary-day">
                <h5>Day {day.day} - {new Date(day.date).toLocaleDateString()}</h5>
                {day.destinations.length > 0 ? (
                  <ul>
                    {day.destinations.map((dest, index) => (
                      <li key={index}>{dest.name}</li>
                    ))}
                    {selectedDate === day.date && <li className="new-item">+ {selectedDestination.name}</li>}
                  </ul>
                ) : selectedDate === day.date ? (
                  <p className="new-item">+ {selectedDestination.name}</p>
                ) : (
                  <p className="no-destinations">No destinations added yet</p>
                )}
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button className="secondary-btn" onClick={() => setActiveModalType(null)}>Cancel</button>
            <button 
              className="primary-btn" 
              onClick={confirmAddToItinerary}
              disabled={!selectedDate}
            >
              Confirm Addition
            </button>
          </div>
        </>
      ) : (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <p>{selectedDestination.name} has been added to your itinerary!</p>
          <button 
            className="primary-btn" 
            onClick={() => setActiveModalType(null)}
            style={{marginTop: '1rem'}}
          >
            Continue Exploring
          </button>
        </div>
      )}
    </div>
  );

  const renderARModal = () => (
    <div className="ar-modal">
      <h3>AR Experience: {selectedDestination.name}</h3>
      
      <div className="ar-view-container">
        {currentARView === 'default' ? (
          <div className="ar-placeholder">
            <div className="ar-icon">👓</div>
            <p>Point your camera to view {selectedDestination.name} in augmented reality</p>
            <div className="ar-sample">
              <img src={selectedDestination.arImages[0]} alt={selectedDestination.name} />
              <div className="ar-overlay">
                <span>Move device to explore</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="ar-detail-view">
            <img src={selectedDestination.arImages[1]} alt={`${selectedDestination.name} detailed view`} />
            <p>{selectedDestination.arExperience}</p>
          </div>
        )}
      </div>
      
      <div className="ar-controls">
        <button 
          className={`ar-btn ${currentARView === 'default' ? 'active' : ''}`}
          onClick={() => setCurrentARView('default')}
        >
          360° View
        </button>
        <button 
          className={`ar-btn ${currentARView === 'detail' ? 'active' : ''}`}
          onClick={() => setCurrentARView('detail')}
        >
          Detailed Explore
        </button>
        <button className="ar-btn">Take AR Photo</button>
      </div>
      
      <p className="ar-description">{selectedDestination.arExperience}</p>
      
      <div className="modal-actions">
        <button className="secondary-btn" onClick={() => setActiveModalType(null)}>Back</button>
        <button className="primary-btn">Start AR Experience</button>
      </div>
    </div>
  );

  return (
    <div className="destinations-container">
      <div className="destinations-header">
        <h2>Explore Jharkhand's Beautiful Destinations</h2>
        <p>Discover the natural beauty, cultural heritage, and adventure opportunities across Jharkhand</p>
      </div>
      
      <div className="filter-container">
        <div className="filter-buttons">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Waterfalls</button>
          <button className="filter-btn">Religious</button>
        </div>
      </div>
      
      <div className="destinations-grid">
        {destinations.map(destination => (
          <div key={destination.id} className="destination-card">
            <div className="card-image">
              <img src={destination.image} alt={destination.name} />
              <div className="card-overlay">
                <span className="district-badge">{destination.district}</span>
              </div>
            </div>
            <div className="card-content">
              <h3>{destination.name}</h3>
              <p className="destination-type">{destination.type}</p>
              <p className="destination-description">{destination.description}</p>
              <button 
                className="explore-btn"
                onClick={() => handleExploreClick(destination)}
              >
                Explore More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Assistant */}
      <div className="destinations-chat-wrapper">
        {chatOpen ? (
          <div className="dest-chat-window">
            <div className="dest-chat-header">
              <span>Destination Guide</span>
              <button onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div className="dest-chat-messages">
              {chatMessages.map((m, i) => (
                <div key={i} className={`dest-msg ${m.isBot ? 'bot' : 'user'}`}>
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div className="dest-msg bot typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
            </div>
            <form onSubmit={handleChatSend} className="dest-chat-input">
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Ask about destinations..." 
              />
              <button type="submit">Send</button>
            </form>
          </div>
        ) : (
          <button className="dest-chat-toggle" onClick={() => setChatOpen(true)}>💬 Ask Guide</button>
        )}
      </div>

      {isModalOpen && selectedDestination && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            
            {activeModalType === 'itinerary' ? (
              renderItineraryModal()
            ) : activeModalType === 'ar' ? (
              renderARModal()
            ) : (
              <>
                <div className="modal-header">
                  <img src={selectedDestination.image} alt={selectedDestination.name} />
                  <div className="modal-title">
                    <h2>{selectedDestination.name}</h2>
                    <p>{selectedDestination.type} • {selectedDestination.district}</p>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="detail-section">
                    <h3>About</h3>
                    <p>{selectedDestination.details}</p>
                  </div>
                  
                  <div className="detail-cards">
                    <div className="detail-card">
                      <h4>Best Time to Visit</h4>
                      <p>{selectedDestination.bestTime}</p>
                    </div>
                    <div className="detail-card">
                      <h4>Entry Fee</h4>
                      <p>{selectedDestination.entryFee}</p>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Activities</h3>
                    <div className="activities-list">
                      {selectedDestination.activities.map((activity, index) => (
                        <span key={index} className="activity-tag">{activity}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>How to Reach</h3>
                    <p>{selectedDestination.howToReach}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="primary-btn" onClick={handleAddToItinerary}>
                    Add to Itinerary
                  </button>
                  <button className="secondary-btn" onClick={handleViewInAR}>
                    View in AR
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .destinations-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .destinations-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .destinations-header h2 {
          font-size: 2.5rem;
          color: #1e3a8a;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        
        .destinations-header p {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .filter-container {
          margin-bottom: 2rem;
          overflow-x: auto;
          padding: 0.5rem 0;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 0.5rem 1.2rem;
          border: none;
          border-radius: 50px;
          background: #f1f5f9;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-btn:hover, .filter-btn.active {
          background: #3b82f6;
          color: white;
        }
        
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .destination-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .destination-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .destination-card:hover .card-image img {
          transform: scale(1.05);
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7));
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }
        
        .district-badge {
          background: rgba(255, 255, 255, 0.9);
          color: #1e40af;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .card-content {
          padding: 1.5rem;
        }
        
        .card-content h3 {
          font-size: 1.4rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .destination-type {
          color: #3b82f6;
          font-weight: 600;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
        }
        
        .destination-description {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .explore-btn {
          width: 100%;
          padding: 0.8rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .explore-btn:hover {
          background: #2563eb;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-header {
          position: relative;
          height: 250px;
        }
        
        .modal-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        
        .modal-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
        }
        
        .modal-title h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .modal-body {
          padding: 2rem;
        }
        
        .detail-section {
          margin-bottom: 2rem;
        }
        
        .detail-section h3 {
          color: #1e3a8a;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }
        
        .detail-section p {
          line-height: 1.6;
          color: #475569;
        }
        
        .detail-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .detail-card {
          background: #f8fafc;
          padding: 1.2rem;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        
        .detail-card h4 {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .detail-card p {
          color: #1e293b;
          font-weight: 500;
        }
        
        .activities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }
        
        .activity-tag {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .modal-footer {
          padding: 1.5rem 2rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        
        .primary-btn, .secondary-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .primary-btn {
          background: #3b82f6;
          color: white;
          border: none;
        }
        
        .primary-btn:hover {
          background: #2563eb;
        }
        
        .primary-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        
        .secondary-btn {
          background: transparent;
          color: #3b82f6;
          border: 1px solid #3b82f6;
        }
        
        .secondary-btn:hover {
          background: #e0f2fe;
        }
        
        /* Itinerary Modal Styles */
        .itinerary-modal {
          padding: 2rem;
        }
        
        .itinerary-modal h3 {
          color: #1e3a8a;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .date-picker {
          margin: 1.5rem 0;
          display: flex;
          justify-content: center;
        }
        
        .date-picker select {
          padding: 0.8rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 1rem;
          width: 100%;
          max-width: 300px;
        }
        
        .itinerary-preview {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .itinerary-day {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .itinerary-day:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .itinerary-day h5 {
          color: #475569;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .itinerary-day ul {
          list-style: none;
          padding: 0;
        }
        
        .itinerary-day li {
          padding: 0.3rem 0;
          color: #64748b;
        }
        
        .new-item {
          color: #3b82f6 !important;
          font-weight: 600;
        }
        
        .no-destinations {
          color: #94a3b8;
          font-style: italic;
        }
        
        .success-message {
          text-align: center;
          padding: 2rem 0;
        }
        
        .success-icon {
          font-size: 3rem;
          color: #22c55e;
          margin-bottom: 1rem;
        }
        
        /* AR Modal Styles */
        .ar-modal {
          padding: 2rem;
        }
        
        .ar-modal h3 {
          color: #1e3a8a;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .ar-view-container {
          margin: 1.5rem 0;
          border-radius: 8px;
          overflow: hidden;
          background: #f8fafc;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .ar-placeholder {
          text-align: center;
          padding: 2rem;
        }
        
        .ar-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .ar-sample {
          position: relative;
          margin-top: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .ar-sample img {
          width: 100%;
          max-width: 300px;
          display: block;
        }
        
        .ar-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem;
          text-align: center;
          font-size: 0.8rem;
        }
        
        .ar-detail-view {
          padding: 1rem;
          text-align: center;
        }
        
        .ar-detail-view img {
          max-width: 100%;
          max-height: 250px;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        
        .ar-controls {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }
        
        .ar-btn {
          padding: 0.6rem 1.2rem;
          background: #f1f5f9;
          border: none;
          border-radius: 50px;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .ar-btn:hover, .ar-btn.active {
          background: #3b82f6;
          color: white;
        }
        
        .ar-description {
          color: #64748b;
          text-align: center;
          margin: 1.5rem 0;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .destinations-header h2 {
            font-size: 2rem;
          }
          
          .destinations-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .modal-content {
            margin: 1rem;
            max-height: 85vh;
          }
          
          .modal-header {
            height: 200px;
          }
          
          .modal-title h2 {
            font-size: 1.5rem;
          }
          
          .modal-footer {
            flex-direction: column;
          }
          
          .primary-btn, .secondary-btn {
            width: 100%;
          }
          
          .ar-controls {
            flex-direction: column;
            align-items: center;
          }
          
          .ar-btn {
            width: 200px;
          }
        }

        .destinations-chat-wrapper {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1001;
        }
        .dest-chat-toggle {
          background: #1e3a8a;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          font-weight: 600;
        }
        .dest-chat-window {
          width: 300px;
          height: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .dest-chat-header {
          background: #1e3a8a;
          color: white;
          padding: 0.8rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dest-chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .dest-msg {
          padding: 0.6rem 0.8rem;
          border-radius: 10px;
          font-size: 0.85rem;
          max-width: 85%;
        }
        .dest-msg.bot { background: #f1f5f9; align-self: flex-start; }
        .dest-msg.user { background: #3b82f6; color: white; align-self: flex-end; }
        
        .typing .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-right: 3px;
          background: #94a3b8;
          border-radius: 50%;
          animation: wave 1.3s linear infinite;
        }

        .typing .dot:nth-child(2) { animation-delay: -1.1s; }
        .typing .dot:nth-child(3) { animation-delay: -0.9s; }

        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }

        .dest-chat-input {
          padding: 0.8rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.5rem;
        }
        .dest-chat-input input { flex: 1; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 4px; }
        .dest-chat-input button { background: #1e3a8a; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Destinations;