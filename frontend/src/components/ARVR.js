import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

// ── Custom hook for keyboard shortcuts ──
const useKeyboardShortcuts = (handlers, deps) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (handlers[e.key]) handlers[e.key](e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, deps]);
};

// ── Optimized Hotspot Component ──
const Hotspot = memo(({ hotspot, onClick }) => (
  <button
    className="absolute flex items-center justify-center w-8 h-8 transition-all -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-lg bg-rose-500/70 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-white"
    style={{
      left: `${hotspot.x}%`,
      top: `${hotspot.y}%`,
      animation: 'hotspotPulse 2s ease-in-out infinite',
    }}
    onClick={(e) => onClick(hotspot, e)}
    title={hotspot.title}
    aria-label={`Hotspot: ${hotspot.title}`}
  >
    <span className="text-xs font-bold text-white">+</span>
  </button>
));

Hotspot.displayName = 'Hotspot';

// ── Memoized Control Button ──
const ControlButton = memo(({ icon, action, title, className = '' }) => (
  <button
    onClick={action}
    title={title}
    className={`flex items-center justify-center text-base text-white transition border rounded-full w-9 h-9 bg-black/50 backdrop-blur-sm hover:bg-black/70 border-white/10 ${className}`}
    aria-label={title}
  >
    {icon}
  </button>
));

ControlButton.displayName = 'ControlButton';

// ── Main InteractiveViewer Component ──
const InteractiveViewer = memo(({
  selectedLocation,
  locationMap,
  isFullscreen,
  setIsFullscreen,
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  resetView,
  showHotspots,
  setShowHotspots,
  showInfo,
  toggleInfo,
  audioEnabled,
  toggleAudio,
  viewMode,
  changeViewMode,
  isPlaying,
  chatOpen,
  setChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  handleChatSend,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentHotspot, setCurrentHotspot] = useState(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  
  const viewerRef = useRef(null);
  const touchStartRef = useRef(null);

  // ── Drag handlers with performance optimization ──
  const handleDragStart = useCallback((clientX, clientY) => {
    setIsDragging(true);
    setStartPosition({ x: clientX, y: clientY });
  }, []);

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    
    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(() => {
      const deltaX = clientX - startPosition.x;
      const deltaY = clientY - startPosition.y;
      
      setRotation((prev) => ({
        x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.4)),
        y: (prev.y + deltaX * 0.4) % 360, // Wrap around for continuous rotation
      }));
      
      setStartPosition({ x: clientX, y: clientY });
    });
  }, [isDragging, startPosition]);

  // ── Event handlers ──
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e) => {
    e.preventDefault();
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [handleDragMove]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    touchStartRef.current = null;
  }, []);

  // ── Wheel handler with debounce ──
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Debounce wheel events
    if (handleWheel.timeout) clearTimeout(handleWheel.timeout);
    handleWheel.timeout = setTimeout(() => {
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    }, 10);
  }, [handleZoomIn, handleZoomOut]);

  // ── Hotspot click handler ──
  const handleHotspotClick = useCallback((hotspot, e) => {
    e.stopPropagation();
    setCurrentHotspot(hotspot);
    
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => setCurrentHotspot(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // ── Share handler ──
  const handleShare = useCallback(async () => {
    const url = locationMap[selectedLocation]?.url || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedLocation} - Jharkhand AR/VR Tour`,
          text: locationMap[selectedLocation]?.description,
          url: url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  }, [selectedLocation, locationMap]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    });
  }, []);

  // ── Keyboard shortcuts ──
  useKeyboardShortcuts({
    'ArrowUp': () => setRotation(p => ({ ...p, x: Math.max(-90, p.x - 8) })),
    'ArrowDown': () => setRotation(p => ({ ...p, x: Math.min(90, p.x + 8) })),
    'ArrowLeft': () => setRotation(p => ({ ...p, y: p.y - 8 })),
    'ArrowRight': () => setRotation(p => ({ ...p, y: p.y + 8 })),
    '+': handleZoomIn,
    '-': handleZoomOut,
    '0': resetView,
    'Escape': () => {
      if (isFullscreen) setIsFullscreen(false);
      if (currentHotspot) setCurrentHotspot(null);
    },
    'h': () => setShowHotspots(p => !p),
    'i': toggleInfo,
    'm': toggleAudio,
    'f': () => setIsFullscreen(p => !p),
  }, [isFullscreen, currentHotspot]);

  // ── Event listeners ──
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      window.addEventListener('touchcancel', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleDragEnd);
        window.removeEventListener('touchcancel', handleDragEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleDragEnd, handleTouchMove]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const loc = locationMap[selectedLocation];

  return (
    <div
      ref={viewerRef}
      className={`relative overflow-hidden select-none touch-none ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-[480px] rounded-2xl shadow-2xl'
      }`}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        background: '#0f172a',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="application"
      aria-label={`360° view of ${selectedLocation}`}
    >
      {/* ── Background image with hardware acceleration ── */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url(${loc.image})`,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoomLevel})`,
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
          filter: viewMode === 'AR' ? 'sepia(0.3) saturate(1.5) hue-rotate(5deg)' : 
                  viewMode === 'VR' ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.95)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      />

      {/* ── VR overlay ── */}
      {viewMode === 'VR' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-white/30" />
          </div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </>
      )}

      {/* ── Hotspots ── */}
      {showHotspots && loc.hotspots.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} onClick={handleHotspotClick} />
      ))}

      {/* ── Hotspot popup ── */}
      {currentHotspot && (
        <div
          className="absolute z-20 p-4 text-white -translate-x-1/2 -translate-y-1/2 border shadow-2xl w-72 top-1/2 left-1/2 bg-gray-900/95 backdrop-blur-md rounded-xl border-white/10"
          style={{ animation: 'fadeIn 0.2s cubic-bezier(0.2, 0, 0, 1)' }}
          role="dialog"
          aria-label="Hotspot information"
        >
          <button
            className="absolute text-lg top-2 right-3 text-white/60 hover:text-white focus:outline-none focus:text-white"
            onClick={() => setCurrentHotspot(null)}
            aria-label="Close"
          >✕</button>
          <h4 className="pr-6 mb-2 text-base font-bold">{currentHotspot.title}</h4>
          <p className="text-sm leading-relaxed text-white/80">{currentHotspot.description}</p>
          <div className="mt-3 text-xs text-white/40">
            Click anywhere to close • Auto-closes in 5s
          </div>
        </div>
      )}

      {/* ── Top controls ── */}
      <div className="absolute flex gap-2 top-4 right-4">
        <ControlButton 
          icon={showInfo ? 'ⓘ' : 'ⓘ'} 
          action={toggleInfo} 
          title="Toggle info (I)" 
        />
        <ControlButton 
          icon={showHotspots ? '📍' : '📍'} 
          action={() => setShowHotspots(!showHotspots)} 
          title="Toggle hotspots (H)" 
        />
        <ControlButton 
          icon={audioEnabled ? '🔊' : '🔇'} 
          action={toggleAudio} 
          title="Toggle audio (M)" 
        />
        <ControlButton 
          icon={isFullscreen ? '⛶' : '⛶'} 
          action={() => setIsFullscreen(!isFullscreen)} 
          title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'} 
        />
        <ControlButton 
          icon="🔗" 
          action={handleShare} 
          title="Share this location" 
        />
      </div>

      {/* ── Copy toast ── */}
      {showCopiedToast && (
        <div className="absolute px-4 py-2 text-sm text-white bg-green-600 rounded-lg shadow-lg top-20 right-4 animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      {/* ── Info panel ── */}
      {showInfo && (
        <div 
          className="absolute max-w-xs p-4 text-white border shadow-xl top-4 left-4 bg-gray-900/90 backdrop-blur-md rounded-xl border-white/10"
          style={{ animation: 'slideIn 0.2s ease-out' }}
        >
          <h4 className="mb-1 text-base font-bold">{selectedLocation}</h4>
          <p className="mb-3 text-xs leading-relaxed text-white/75">{loc.description}</p>
          
          {/* ── View mode selector ── */}
          <div className="flex gap-2 mb-3">
            {['360', 'VR', 'AR'].map((mode) => (
              <button
                key={mode}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
                onClick={() => changeViewMode(mode)}
                aria-pressed={viewMode === mode}
              >
                {mode}
              </button>
            ))}
          </div>
          
          {/* ── Quick stats ── */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="px-2 py-1 rounded bg-white/5">
              <span className="text-white/40">Hotspots</span>
              <span className="block font-medium text-white">{loc.hotspots.length}</span>
            </div>
            <div className="px-2 py-1 rounded bg-white/5">
              <span className="text-white/40">View</span>
              <span className="block font-medium text-white">{viewMode}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── D-pad navigation ── */}
      <div className="absolute p-2 border bottom-20 right-4 bg-gray-900/60 backdrop-blur-sm rounded-xl border-white/10">
        <div className="grid grid-cols-3 gap-1">
          <div></div>
          <button 
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
            onClick={() => setRotation(p => ({ ...p, x: Math.max(-90, p.x - 10) }))}
            aria-label="Look up"
          >▲</button>
          <div></div>
          
          <button 
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
            onClick={() => setRotation(p => ({ ...p, y: p.y - 10 }))}
            aria-label="Look left"
          >◀</button>
          <button 
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
            onClick={() => setRotation(p => ({ ...p, x: Math.min(90, p.x + 10) }))}
            aria-label="Look down"
          >▼</button>
          <button 
            className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
            onClick={() => setRotation(p => ({ ...p, y: p.y + 10 }))}
            aria-label="Look right"
          >▶</button>
        </div>
      </div>

      {/* ── Zoom controls ── */}
      <div className="absolute flex flex-col gap-1 p-2 border bottom-20 left-4 bg-gray-900/60 backdrop-blur-sm rounded-xl border-white/10">
        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
          aria-label="Zoom in"
        >+</button>
        <button
          onClick={resetView}
          className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
          aria-label="Reset view"
        >⟳</button>
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white transition-colors rounded-lg hover:bg-white/20 active:bg-white/30"
          aria-label="Zoom out"
        >−</button>
      </div>

      {/* ── Zoom level indicator ── */}
      <div className="absolute px-3 py-1 text-xs text-white border rounded-full bg-black/50 backdrop-blur-sm top-4 left-4 border-white/10">
        {Math.round(zoomLevel * 100)}%
      </div>

      {/* ── Bottom hint bar ── */}
      <div className="absolute flex items-center gap-3 px-4 py-2 text-xs text-white -translate-x-1/2 border rounded-full bottom-4 left-1/2 bg-gray-900/60 backdrop-blur-sm border-white/10 whitespace-nowrap">
        <span>🖱 Drag to look</span>
        <span className="opacity-40">|</span>
        <span>⌨️ Arrow keys</span>
        <span className="opacity-40">|</span>
        <span>🔍 Scroll to zoom</span>
        <span className="opacity-40">|</span>
        <span>📍 Tap hotspots</span>
      </div>

      {/* ── Chat interface ── */}
      <div className="absolute z-20 bottom-20 right-4">
        {chatOpen ? (
          <div 
            className="flex flex-col overflow-hidden border shadow-2xl w-80 bg-gray-900/95 backdrop-blur-md border-white/10 rounded-2xl"
            style={{ height: '400px' }}
            role="dialog"
            aria-label="Chat with tour guide"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-blue-900/40">
              <div className="flex items-center gap-2">
                <span className="text-base" role="img" aria-label="AI">🤖</span>
                <span className="text-sm font-semibold text-white">Tour Guide AI</span>
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 bg-green-400 rounded-full"></span>
                </span>
              </div>
              <button 
                className="transition-colors text-white/60 hover:text-white"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >✕</button>
            </div>
            
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`text-xs px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.isBot
                        ? 'bg-blue-800/50 text-white rounded-tl-none'
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleChatSend} className="flex gap-2 p-3 border-t border-white/10">
              <input
                className="flex-1 px-3 py-2 text-xs text-white transition-all border rounded-lg outline-none bg-white/10 placeholder-white/40 border-white/10 focus:border-blue-400 focus:bg-white/20"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about this place..."
                aria-label="Chat input"
              />
              <button 
                type="submit" 
                className="px-3 py-2 text-xs font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                disabled={!chatInput.trim()}
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-white transition-all bg-blue-600 border rounded-full shadow-lg hover:bg-blue-500 hover:shadow-blue-500/30 hover:shadow-xl border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open chat"
          >
            💬 <span className="font-medium">Ask Guide</span>
            <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">AI</span>
          </button>
        )}
      </div>
    </div>
  );
});

InteractiveViewer.displayName = 'InteractiveViewer';

// ── Location colors data ──
const LOCATION_COLORS = {
  'Betla National Park': { from: '#134e1a', to: '#1a7a2a', emoji: '🐯', light: '#22c55e' },
  'Hundru Falls':        { from: '#1a3a5c', to: '#1e6fa8', emoji: '💧', light: '#3b82f6' },
  'Jonha Falls':         { from: '#1a3a5c', to: '#1e8fa8', emoji: '🌊', light: '#06b6d4' },
  'Baidyanath Dham':     { from: '#4a1a1a', to: '#8b2a2a', emoji: '🛕', light: '#ef4444' },
  'Patratu Valley':      { from: '#2a3a1a', to: '#4a6a1a', emoji: '🏔️', light: '#84cc16' },
};

// ── Location Card Component ──
const LocationCard = memo(({ location, isSelected, onClick }) => {
  const colors = LOCATION_COLORS[location];
  
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl p-4 text-left transition-all duration-300 border ${
        isSelected
          ? 'border-blue-400 shadow-lg shadow-blue-500/30 scale-105'
          : 'border-white/5 hover:border-white/20 hover:scale-102'
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
          : 'rgba(255,255,255,0.04)',
      }}
      aria-pressed={isSelected}
    >
      <div className="mb-2 text-3xl">{colors.emoji}</div>
      <div className="text-xs font-semibold leading-tight text-white">{location}</div>
      {isSelected && (
        <>
          <div className="absolute w-2 h-2 bg-blue-400 rounded-full top-2 right-2 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent" />
        </>
      )}
    </button>
  );
});

LocationCard.displayName = 'LocationCard';

// ── Info Card Component ──
const InfoCard = memo(({ icon, title, items }) => (
  <div className="p-5 transition-all border bg-white/5 border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10">
    <h4 className="flex items-center gap-2 mb-3 font-bold text-white">
      <span className="text-xl">{icon}</span>
      <span>{title}</span>
    </h4>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1 h-1 bg-blue-400 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  </div>
));

InfoCard.displayName = 'InfoCard';

// ── Main ARVR Component ──
const ARVR = () => {
  const [selectedLocation, setSelectedLocation] = useState('Betla National Park');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [viewMode, setViewMode] = useState('360');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState(() => [
    { text: 'Welcome to the virtual tour! Ask me anything about this location.', isBot: true },
  ]);

  // ── Location data with high-quality images ──
  const locationMap = {
    'Betla National Park': {
      url: 'https://jharkhandtourism.gov.in/betla',
      description: 'Explore the wilderness of Betla National Park, home to tigers, elephants, and diverse flora. Spread over 1,100 sq km, it\'s one of India\'s finest tiger reserves.',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&h=900&fit=crop',
      hotspots: [
        { id: 1, x: 30, y: 40, title: 'Jungle Trail', description: 'Explore the dense forest pathways where you might spot wildlife' },
        { id: 2, x: 60, y: 25, title: 'Historic Ruins', description: 'Discover ancient structures dating back to the Mughal era' },
        { id: 3, x: 70, y: 60, title: 'Watch Tower', description: 'Panoramic views of the park - perfect for tiger spotting' },
        { id: 4, x: 45, y: 75, title: 'Water Hole', description: 'Animals gather here, especially during summer months' },
      ],
    },
    'Hundru Falls': {
      url: 'https://jharkhandtourism.gov.in/hundru',
      description: 'Witness the majestic Hundru Falls, one of the highest waterfalls in Jharkhand. The water plunges from 320 feet creating a spectacular sight.',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1600&h=900&fit=crop',
      hotspots: [
        { id: 1, x: 50, y: 30, title: 'Top View', description: 'See the waterfall from above - breathtaking perspective' },
        { id: 2, x: 25, y: 60, title: 'Base Camp', description: 'Feel the mist on your face at the bottom of the falls' },
        { id: 3, x: 75, y: 70, title: 'Viewpoint', description: 'Perfect photo opportunity with rainbow views' },
      ],
    },
    'Jonha Falls': {
      url: 'https://jharkhandtourism.gov.in/jonha',
      description: 'Discover Jonha Falls, also known as Gautamdhara Falls. A serene horseshoe-shaped waterfall surrounded by lush forests.',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=900&fit=crop',
      hotspots: [
        { id: 1, x: 40, y: 50, title: 'Main Falls', description: 'The primary waterfall cascading down 140 feet' },
        { id: 2, x: 60, y: 30, title: 'Rock Formations', description: 'Unique geological features millions of years old' },
        { id: 3, x: 20, y: 70, title: 'Bridge View', description: 'Scenic overlook from the historic bridge' },
      ],
    },
    'Baidyanath Dham': {
      url: 'https://jharkhandtourism.gov.in/baidyanath',
      description: 'Experience the spiritual aura of Baidyanath Dham, one of the twelve Jyotirlingas. A sacred Hindu temple complex with ancient architecture.',
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&h=900&fit=crop',
      hotspots: [
        { id: 1, x: 50, y: 40, title: 'Main Temple', description: 'The sacred Jyotirlinga shrine, center of pilgrimage' },
        { id: 2, x: 30, y: 60, title: 'Prayer Hall', description: 'Space for devotional activities and meditation' },
        { id: 3, x: 70, y: 20, title: 'Temple Complex', description: 'Overview of the entire area with multiple shrines' },
      ],
    },
    'Patratu Valley': {
      url: 'https://jharkhandtourism.gov.in/patratu',
      description: 'Breathtaking views of Patratu Valley with its serpentine roads and lush landscapes. Often called the "Mini Kashmir" of Jharkhand.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
      hotspots: [
        { id: 1, x: 40, y: 30, title: 'Valley Overview', description: 'Panoramic view of the entire valley' },
        { id: 2, x: 60, y: 50, title: 'Serpentine Road', description: 'The famous winding road with 99 curves' },
        { id: 3, x: 20, y: 70, title: 'Sunset Point', description: 'Best spot for photography during golden hour' },
      ],
    },
  };

  // ── Handlers ──
  const handleShowPreview = useCallback(() => {
    setPreviewUrl(locationMap[selectedLocation].url);
    setIsLoading(true);
    setIsPlaying(false);
    
    // Simulate loading with progress
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 1800);
  }, [selectedLocation]);

  const toggleInfo = useCallback(() => setShowInfo(p => !p), []);
  const toggleAudio = useCallback(() => setAudioEnabled(p => !p), []);
  
  const handleZoomIn = useCallback(() => {
    setZoomLevel(p => Math.min(p + 0.15, 2.5));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(p => Math.max(p - 0.15, 0.5));
  }, []);
  
  const resetView = useCallback(() => {
    setZoomLevel(1);
  }, []);

  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
    if (mode === 'VR') {
      // Provide haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(50);
    }
  }, []);

  const handleChatSend = useCallback((e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { text: chatInput, isBot: false, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    
    const question = chatInput.toLowerCase();
    setChatInput('');
    
    // Simulate AI thinking
    setTimeout(() => {
      let response = '';
      
      // Enhanced AI responses
      if (question.includes('best time') || question.includes('when to visit')) {
        response = `The best time to visit ${selectedLocation} is from October to March when the weather is pleasant. Avoid monsoon (July-September) as waterfalls get too powerful and roads may be slippery.`;
      } else if (question.includes('how to reach') || question.includes('transport')) {
        response = `${selectedLocation} is well-connected by road. Nearest railway station is Ranchi Junction (about 45-60 km). You can hire a taxi or take a bus from Ranchi. I can share specific route details if you tell me your starting point!`;
      } else if (question.includes('history') || question.includes('origin')) {
        response = `${selectedLocation} has rich historical significance. ${selectedLocation === 'Baidyanath Dham' ? 'It\'s one of the 12 Jyotirlingas mentioned in ancient scriptures.' : 'The area has been inhabited since ancient times with tribal communities preserving unique cultural traditions.'}`;
      } else if (question.includes('wildlife') || question.includes('animals') || question.includes('tiger')) {
        response = `At ${selectedLocation}, you might spot elephants, tigers, leopards, sambar deer, and various bird species. The park is part of Project Tiger reserve. Early morning safaris offer the best wildlife viewing!`;
      } else if (question.includes('waterfall') || question.includes('height')) {
        response = `The waterfall here drops from over ${selectedLocation.includes('Hundru') ? '320' : '140'} feet! During monsoon (July-September), it's absolutely breathtaking but also dangerous for swimming. Winter offers the clearest views.`;
      } else if (question.includes('hello') || question.includes('hi') || question.includes('hey')) {
        response = `Hello! 👋 I'm your AI tour guide for ${selectedLocation}. Feel free to ask about attractions, best times to visit, local culture, or anything else!`;
      } else if (question.includes('thank')) {
        response = `You're welcome! 😊 Enjoy your virtual tour of ${selectedLocation}. Let me know if you need anything else!`;
      } else if (question.includes('temple') || question.includes('holy') || question.includes('shrine')) {
        response = `The temples here showcase ancient Nagara-style architecture. Devotees believe a visit here fulfills wishes. The main shrine opens at 4 AM for morning prayers (Mangala Aarti).`;
      } else if (question.includes('photo') || question.includes('picture') || question.includes('camera')) {
        response = `Great question! The best photo spots are marked with 🔍 icons in the viewer. For ${selectedLocation}, try the main viewpoint around coordinates (40,30) for stunning shots!`;
      } else if (question.includes('nearby') || question.includes('other places')) {
        response = `Nearby attractions include other stunning locations in our app! You can explore them from the main menu. Within 50km, you'll find several waterfalls and viewpoints.`;
      } else {
        response = `${selectedLocation} is known for its unique geography and cultural significance. Would you like to know about specific attractions, best visiting times, or local legends? I'm here to help!`;
      }
      
      setChatMessages(prev => [...prev, { text: response, isBot: true, timestamp: Date.now() }]);
    }, 800);
  }, [selectedLocation, chatInput]);

  const colors = LOCATION_COLORS[selectedLocation];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 ${isFullscreen ? 'p-0' : 'p-6'}`}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes hotspotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      {!isFullscreen && (
        <>
          {/* ── Header with gradient ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                🌄 Jharkhand AR/VR
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Immersive virtual tours of Jharkhand's most stunning destinations
              </p>
            </div>
            <button
              onClick={() => setShowTutorial(p => !p)}
              className="px-5 py-2.5 text-sm font-medium text-blue-300 transition-all border bg-blue-900/40 border-blue-700/40 rounded-xl hover:bg-blue-800/40 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {showTutorial ? '🙈 Hide Tips' : '💡 Show Guide'}
            </button>
          </div>

          {/* ── Enhanced Tutorial Banner ── */}
          {showTutorial && (
            <div className="relative p-4 mb-6 overflow-hidden border rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/30">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
              <div className="relative flex items-start gap-4">
                <span className="text-3xl">💡</span>
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-blue-200">Pro Tips for Best Experience:</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm text-blue-200/80 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs rounded bg-blue-800/50">↑↓←→</kbd>
                      <span>Arrow keys to navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs rounded bg-blue-800/50">+</kbd>
                      <span>Zoom in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs rounded bg-blue-800/50">-</kbd>
                      <span>Zoom out</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs rounded bg-blue-800/50">0</kbd>
                      <span>Reset view</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs rounded bg-blue-800/50">F</kbd>
                      <span>Fullscreen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400">📍</span>
                      <span>Click glowing dots for info</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Location Cards Grid ── */}
          <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3 lg:grid-cols-5">
            {Object.keys(locationMap).map((loc) => (
              <LocationCard
                key={loc}
                location={loc}
                isSelected={loc === selectedLocation}
                onClick={() => setSelectedLocation(loc)}
              />
            ))}
          </div>

          {/* ── Start Button with Stats ── */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={handleShowPreview}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-xl">🚀</span>
              <span>Start Experience</span>
            </button>
            
            {isPlaying && (
              <div className="flex items-center gap-3 px-4 py-2 border bg-green-900/30 rounded-xl border-green-500/30">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                </span>
                <span className="text-sm text-green-400">
                  Now exploring: <strong>{selectedLocation}</strong>
                </span>
              </div>
            )}
            
            <div className="flex gap-2 ml-auto">
              <span className="px-3 py-1 text-xs border rounded-full bg-white/5 border-white/10 text-slate-300">
                {locationMap[selectedLocation].hotspots.length} Hotspots
              </span>
              <span className="px-3 py-1 text-xs border rounded-full bg-white/5 border-white/10 text-slate-300">
                {viewMode} Mode
              </span>
            </div>
          </div>
        </>
      )}

      {/* ── Loading State with Progress ── */}
      {isLoading ? (
        <div className="h-[480px] rounded-2xl overflow-hidden relative flex flex-col items-center justify-center bg-slate-800 border border-white/5">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            }}
          />
          
          {/* Animated circles */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 rounded-full border-blue-500/30 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 rounded-full border-purple-500/30 border-t-purple-500 animate-spin animate-delay-150" />
            </div>
          </div>
          
          <p className="z-10 mb-2 text-xl font-bold text-white">{selectedLocation}</p>
          <p className="z-10 mb-4 text-sm text-slate-400">Loading immersive environment...</p>
          
          {/* Progress bar */}
          <div className="w-64 h-2 overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"
              style={{ width: '60%' }}
            />
          </div>
          
          <p className="z-10 mt-6 text-xs text-slate-500">
            💡 Tip: Use headphones for spatial audio experience
          </p>
        </div>
      ) : previewUrl ? (
        <InteractiveViewer
          selectedLocation={selectedLocation}
          locationMap={locationMap}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          zoomLevel={zoomLevel}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          resetView={resetView}
          showHotspots={showHotspots}
          setShowHotspots={setShowHotspots}
          showInfo={showInfo}
          toggleInfo={toggleInfo}
          audioEnabled={audioEnabled}
          toggleAudio={toggleAudio}
          viewMode={viewMode}
          changeViewMode={changeViewMode}
          isPlaying={isPlaying}
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSend={handleChatSend}
        />
      ) : (
        <div className="h-[480px] rounded-2xl border border-white/5 bg-slate-800/50 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          
          <div className="relative z-10">
            <div className="mb-6 text-7xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
              {colors.emoji}
            </div>
            
            <h2 className="mb-3 text-3xl font-bold text-white">
              {selectedLocation}
            </h2>
            
            <p className="max-w-md mb-6 text-sm leading-relaxed text-slate-400">
              {locationMap[selectedLocation].description}
            </p>
            
            <button
              onClick={handleShowPreview}
              className="px-8 py-3 text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30"
            >
              Start Virtual Tour →
            </button>
          </div>
          
          {/* Preview hotspots */}
          <div className="absolute inset-0 pointer-events-none">
            {locationMap[selectedLocation].hotspots.map((h, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 border-2 rounded-full border-white/10"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom Info Cards ── */}
      {!isFullscreen && (
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
          <InfoCard
            icon="🎮"
            title="Navigation"
            items={[
              '↔️ Drag or arrow keys to look around',
              '🖱 Scroll wheel or +/- keys to zoom',
              '📍 Click hotspots for detailed info',
              '⌨️ Press 0 to reset view',
            ]}
          />
          <InfoCard
            icon="📱"
            title="Device Support"
            items={[
              '💻 Desktop: Mouse + keyboard',
              '📱 Mobile: Touch gestures',
              '🥽 VR headsets supported',
              '🎧 Spatial audio ready',
            ]}
          />
          <InfoCard
            icon="⚡"
            title="Pro Features"
            items={[
              '🤖 AI tour guide in chat',
              '🔍 4+ hotspots per location',
              '🔄 360°, VR & AR modes',
              '📤 Share locations easily',
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ARVR;