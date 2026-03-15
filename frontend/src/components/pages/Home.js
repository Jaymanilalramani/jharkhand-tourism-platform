import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="fade-in">Discover Jharkhand — nature, culture & adventure</h2>
          <p className="fade-in">
            Plan your trip with AI itineraries, explore destinations in AR/VR,
            support local communities, and book unique experiences.
          </p>
          <Link to="/destinations" className="primary fade-in">
            Explore Destinations
          </Link>
        </div>
      </section>

      <section className="container px-4 py-12 mx-auto">
        <h2 className="mb-8 text-2xl font-bold text-center">Experience the Best of Jharkhand</h2>
        
        {/* Cards with Animation Classes */}
        <div className="feature-grid">
          <div className="card slide-in-left">
            <div className="flex items-center justify-center bg-gray-200 card-img">
              <img 
                src="https://www.scenicitinerary.com/wp-content/uploads/2025/01/Ai-travel-planner.png" 
                alt="AI Itinerary"  
                width={200} 
                height={200}
              />
            </div>
            <h2>AI-Powered Itinerary</h2>
            <p>Get personalized travel plans based on your interests, budget, and time.</p>
            <Link to="/itinerary" className="inline-block mt-4">
              <button>Try Itinerary Planner</button>
            </Link>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-center bg-gray-200 card-img">
              <img 
                src="https://tse1.mm.bing.net/th/id/OIP.vyW-w52Lb2B6CZc2OubhcgHaFj?pid=Api&P=0&h=180" 
                alt="Marketplace" 
                width={200} 
                height={200}
              />
            </div>
            <h2>Local Marketplace</h2>
            <p>Discover and purchase authentic tribal handicrafts and local products.</p>
            <Link to="/marketplace" className="inline-block mt-4">
              <button>Explore Marketplace</button>
            </Link>
          </div>
          
          <div className="card slide-in-right">
            <div className="flex items-center justify-center bg-gray-200 card-img">
              <img 
                src="https://tse2.mm.bing.net/th/id/OIP.rMe95JpjFCpyVaHv7fg9YQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" 
                alt="AR/VR Experiences" 
                width={200} 
                height={200}
              />
            </div>
            <h2>AR/VR Previews</h2>
            <p>Explore Jharkhand's attractions through immersive virtual experiences.</p>
            <Link to="/arvr" className="inline-block mt-4">
              <button>View Experiences</button>
            </Link>
          </div>
        </div>
      </section>

      {/* CSS ko separate file mein ya inline style mein move karein */}
      <style>{`
        /* Hero Section with Background Image */
        .hero {
          position: relative;
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1580135390424-701bd6cce890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amhhcmtoYW5kJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80');
          background-size: cover;
          background-position: center;
          color: white;
          text-align: center;
          padding: 0 1rem;
        }
        
        .hero-content {
          max-width: 800px;
          z-index: 1;
        }
        
        .hero-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }
        
        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        
        .primary {
          display: inline-block;
          padding: 0.8rem 2rem;
          background-color: #3B82F6;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        
        .primary:hover {
          background-color: #2563EB;
        }
        
        /* Feature Grid and Cards */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          padding: 1.5rem;
          text-align: center;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        
        .card-img {
          height: 200px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        
        .card h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1F2937;
        }
        
        .card p {
          color: #6B7280;
          margin-bottom: 1.5rem;
        }
        
        .card button {
          padding: 0.5rem 1.5rem;
          background-color: #3B82F6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .card button:hover {
          background-color: #2563EB;
        }
        
        /* Animation Classes */
        .fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }
        
        .slide-in-left {
          animation: slideInLeft 1s ease-out;
        }
        
        .slide-in-right {
          animation: slideInRight 1s ease-out;
        }
        
        /* Keyframes for Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content h2 {
            font-size: 2rem;
          }
          
          .hero-content p {
            font-size: 1rem;
          }
          
          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;