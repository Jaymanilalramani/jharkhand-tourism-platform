import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/pages/Home';
import Destinations from './components/pages/Destinations';
import Dashboard from './components/pages/Dashboard';
import AIItinerary from './components/AIItinerary';
import Analytics from './components/Analytics';
import ARVR from './components/ARVR';
import Marketplace from './components/Marketplace';
import './App.css';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/itinerary" element={<AIItinerary />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/arvr" element={<ARVR />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;