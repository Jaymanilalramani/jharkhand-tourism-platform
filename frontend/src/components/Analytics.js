import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';

const CHAT_RESPONSES = {
  default: "Analyzing Jharkhand tourism data. Ranchi shows highest visitor growth at 12.5%. Ask me about revenue, forecasts, or specific districts.",
  revenue: "Total revenue is up 8.2% this month, reaching Rs.232Cr. Would you like the breakdown by category?",
  forecast: "Predictive model expects 54,300 visitors next month. This is a 15% increase vs last year.",
  greeting: "Hello! I can help navigate tourism analytics. Try asking about revenue or visitor forecasts.",
  weather: "Weather across Jharkhand is ideal for tourism. Ranchi: 24C, Jamshedpur: 26C.",
  peakSeason: "Peak tourist season is October-March. Bookings at 78% capacity for next month."
};

const DEMO_DATA = {
  visitorsByDistrict: [
    { district: "Ranchi", visitors: 12500, growth: 12, x: 178, y: 210, color: '#10B981' },
    { district: "Jamshedpur", visitors: 9800, growth: 8, x: 245, y: 275, color: '#3B82F6' },
    { district: "Dhanbad", visitors: 8700, growth: 5, x: 265, y: 175, color: '#F59E0B' },
    { district: "Bokaro", visitors: 6500, growth: 15, x: 235, y: 195, color: '#8B5CF6' },
    { district: "Hazaribagh", visitors: 5200, growth: -2, x: 200, y: 165, color: '#EF4444' },
    { district: "Deoghar", visitors: 7800, growth: 20, x: 290, y: 135, color: '#EC4899' },
    { district: "Netarhat", visitors: 3400, growth: 18, x: 140, y: 220, color: '#06B6D4' },
  ],
  revenueTrends: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    data: [45,52,49,60,70,85,95,90,78,82,88,105],
    categories: {
      adventure: [12,15,14,18,22,28,32,30,25,24,26,32],
      cultural: [10,12,11,14,16,19,22,21,18,19,20,24],
      pilgrimage: [15,16,15,18,20,23,25,24,22,23,24,28],
      wildlife: [8,9,9,10,12,15,16,15,13,16,18,21]
    }
  },
  categoryPerformance: [
    { category: "Adventure", revenue: 42, trend: "up", percentage: 28 },
    { category: "Cultural", revenue: 35, trend: "up", percentage: 23 },
    { category: "Pilgrimage", revenue: 28, trend: "stable", percentage: 19 },
    { category: "Wildlife", revenue: 22, trend: "down", percentage: 15 },
    { category: "Heritage", revenue: 18, trend: "up", percentage: 12 },
    { category: "Eco-tourism", revenue: 5, trend: "up", percentage: 3 }
  ],
  demographicData: {
    ageGroups: [
      { group: "18-25", percentage: 25, count: 12375 },
      { group: "26-35", percentage: 35, count: 17325 },
      { group: "36-45", percentage: 22, count: 10890 },
      { group: "46-55", percentage: 12, count: 5940 },
      { group: "56+", percentage: 6, count: 2970 },
    ],
    sources: [
      { source: "Direct", percentage: 30 },
      { source: "Online Agencies", percentage: 40 },
      { source: "Social Media", percentage: 15 },
      { source: "Referrals", percentage: 10 },
      { source: "Other", percentage: 5 },
    ],
    gender: [
      { type: "Male", percentage: 52 },
      { type: "Female", percentage: 45 },
      { type: "Other", percentage: 3 }
    ],
    travelPurpose: [
      { purpose: "Leisure", percentage: 45 },
      { purpose: "Pilgrimage", percentage: 25 },
      { purpose: "Business", percentage: 15 },
      { purpose: "Adventure", percentage: 10 },
      { purpose: "Education", percentage: 5 }
    ],
    monthlyDistribution: [
      { month:"Jan",visitors:11200 },{ month:"Feb",visitors:12400 },
      { month:"Mar",visitors:11800 },{ month:"Apr",visitors:13500 },
      { month:"May",visitors:14800 },{ month:"Jun",visitors:16200 },
      { month:"Jul",visitors:17800 },{ month:"Aug",visitors:16900 },
      { month:"Sep",visitors:15200 },{ month:"Oct",visitors:15800 },
      { month:"Nov",visitors:16500 },{ month:"Dec",visitors:18200 }
    ]
  },
  realTimeVisitors: [
    { id:1, location:"Ranchi", time:"2 min ago", activity:"Viewing waterfalls", status:"active", visitors:234 },
    { id:2, location:"Jamshedpur", time:"5 min ago", activity:"Zoo visit", status:"active", visitors:156 },
    { id:3, location:"Deoghar", time:"7 min ago", activity:"Temple visit", status:"active", visitors:445 },
    { id:4, location:"Netarhat", time:"10 min ago", activity:"Sunset point", status:"active", visitors:89 },
    { id:5, location:"Bokaro", time:"12 min ago", activity:"City tour", status:"inactive", visitors:123 },
    { id:6, location:"Dhanbad", time:"15 min ago", activity:"Museum visit", status:"active", visitors:167 },
  ],
  liveStats: {
    totalActive: 1214,
    peakHour: "4:00 PM",
    busiestLocation: "Deoghar",
    checkinsToday: 3245,
    popularActivities: ["Temple visits","Waterfalls","Wildlife safaris"]
  },
  predictiveInsights: {
    nextMonthVisitors: 54300,
    recommendedFocus: "Adventure",
    expectedGrowth: 15.2,
    peakPeriod: "Nov-Dec",
    monthlyForecast: [
      { month:"Nov", predicted:18500, confidence:92 },
      { month:"Dec", predicted:21500, confidence:88 },
      { month:"Jan", predicted:19800, confidence:85 },
      { month:"Feb", predicted:17600, confidence:82 }
    ],
    revenueProjection: 285,
    riskFactors: [
      { factor:"Weather", impact:"Low", probability:15 },
      { factor:"Economic", impact:"Medium", probability:25 },
      { factor:"Competition", impact:"High", probability:35 }
    ],
    recommendations: [
      "Increase adventure tourism marketing",
      "Develop monsoon special packages",
      "Enhance digital presence for youth",
      "Partner with travel influencers"
    ]
  },
  feedbackData: {
    overall: 4.2,
    totalReviews: 15423,
    satisfaction: { excellent:45, good:35, average:15, poor:5 },
    categories: [
      { name:"Accommodation", rating:4.0, reviews:3210 },
      { name:"Food", rating:4.3, reviews:2890 },
      { name:"Transport", rating:3.8, reviews:2450 },
      { name:"Attractions", rating:4.5, reviews:3560 },
      { name:"Hospitality", rating:4.4, reviews:3313 }
    ],
    recentFeedback: [
      { user:"Rajesh K.", rating:5, comment:"Beautiful experience at Ranchi waterfalls!", date:"Jan 15" },
      { user:"Priya S.", rating:4, comment:"Deoghar temples were peaceful and serene", date:"Jan 14" },
      { user:"Amit M.", rating:3, comment:"Transportation needs improvement", date:"Jan 13" },
      { user:"Sunita R.", rating:5, comment:"Jamshedpur zoo is amazing for family", date:"Jan 12" }
    ],
    improvementAreas: [
      "Public transport connectivity",
      "Washroom facilities at tourist spots",
      "Signage and directions",
      "Evening entertainment options"
    ]
  }
};

// SVG Icon Components
const Icons = {
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  DollarSign: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Star: ({ filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Map: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-3.43 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.87-1.29Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-3.43 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.87-1.29Z"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Bot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Lightbulb: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  Person: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

// ChatBot Component
const ChatBot = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Jharkhand Tourism Assistant. Ask me about revenue, forecasts, or districts.", isBot: true, timestamp: Date.now() }
  ]);
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const getBotResponse = useCallback((text) => {
    const t = text.toLowerCase();
    if (t.includes("revenue")) return CHAT_RESPONSES.revenue;
    if (t.includes("forecast") || t.includes("predict")) return CHAT_RESPONSES.forecast;
    if (t.includes("weather") || t.includes("temperature")) return CHAT_RESPONSES.weather;
    if (t.includes("peak") || t.includes("season")) return CHAT_RESPONSES.peakSeason;
    if (t.includes("hello") || t.includes("hi") || t.includes("hey")) return CHAT_RESPONSES.greeting;
    return CHAT_RESPONSES.default;
  }, []);

  const handleSend = useCallback((e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const sent = inputVal;
    setMessages(prev => [...prev, { text: sent, isBot: false, timestamp: Date.now() }]);
    setInputVal("");
    setMessages(prev => [...prev, { text: "...", isBot: true, isLoading: true, timestamp: Date.now() }]);
    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading);
        return [...filtered, { text: getBotResponse(sent), isBot: true, timestamp: Date.now() }];
      });
    }, 900);
  }, [inputVal, getBotResponse]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)' }}
        className="fixed z-50 flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-transform shadow-2xl bottom-6 right-6 rounded-2xl hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <Icons.Bot />
        AI Assistant
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed z-50 bottom-6 right-6 w-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex flex-col overflow-hidden shadow-2xl rounded-2xl" style={{ height: '420px', background: '#0f1f1a', border: '1px solid #1a3a2f' }}>
        <div style={{ background: 'linear-gradient(135deg, #065f46, #047857)' }} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-white">
            <Icons.Bot />
            <span className="text-sm font-bold">Analytics Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 transition-colors rounded text-white/70 hover:text-white">
            <Icons.X />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[82%] px-3 py-2 rounded-xl text-sm ${m.isBot ? 'text-gray-200 rounded-bl-none' : 'text-white rounded-br-none'}`}
                style={{ background: m.isBot ? '#1a3a2f' : '#047857' }}>
                {m.isLoading ? (
                  <div className="flex gap-1 py-1">
                    {[0,1,2].map(n => (
                      <div key={n} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${n * 0.15}s` }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <p>{m.text}</p>
                    <span className="block mt-1 text-xs opacity-40">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2 p-3 border-t" style={{ borderColor: '#1a3a2f' }}>
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask about data..."
            className="flex-1 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 rounded-xl focus:outline-none"
            style={{ background: '#1a3a2f', border: '1px solid #2d5a46' }}
          />
          <button type="submit" disabled={!inputVal.trim()}
            className="p-2 text-white transition-colors rounded-xl disabled:opacity-40"
            style={{ background: '#047857' }}>
            <Icons.Send />
          </button>
        </form>
      </div>
    </div>
  );
});

// Metric Card
const MetricCard = memo(({ icon, title, value, change, accent = '#10B981', subtitle }) => (
  <div className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5 hover:shadow-xl" style={{ background: '#0f1f1a', border: '1px solid #1a3a2f' }}>
    <div className="flex items-start justify-between">
      <div className="p-2 rounded-xl" style={{ background: `${accent}22` }}>
        <div style={{ color: accent }}>{icon}</div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
          style={{ background: change >= 0 ? '#05260e' : '#2a0f0f' }}>
          {change >= 0 ? <Icons.TrendUp /> : <Icons.TrendDown />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-xs tracking-wider text-gray-500 uppercase">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
      {change !== undefined && (
        <p className="mt-1 text-xs text-gray-600">{subtitle || 'vs last month'}</p>
      )}
    </div>
  </div>
));

// SVG Bar Chart
const BarChart = ({ data, labelKey, valueKey, color = '#10B981', height = 180 }) => {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="relative" style={{ height }}>
      <div className="flex items-end h-full gap-1 pt-4">
        {data.map((item, i) => {
          const pct = (item[valueKey] / max) * (height - 40);
          return (
            <div key={i} className="relative flex flex-col items-center flex-1 cursor-pointer group"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {hovered === i && (
                <div className="absolute z-20 px-3 py-2 mb-2 text-xs text-white -translate-x-1/2 shadow-xl bottom-full left-1/2 rounded-xl whitespace-nowrap"
                  style={{ background: '#0a1812', border: '1px solid #1a3a2f' }}>
                  <div className="font-bold text-emerald-400">{item[labelKey]}</div>
                  <div className="text-gray-300">{typeof item[valueKey] === 'number' && item[valueKey] > 1000 ? item[valueKey].toLocaleString() : item[valueKey]}</div>
                  {item.growth !== undefined && (
                    <div className={item.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {item.growth >= 0 ? '+' : ''}{item.growth}% growth
                    </div>
                  )}
                </div>
              )}
              <div className="w-full transition-all duration-300 rounded-t-md"
                style={{ height: Math.max(pct, 4), background: hovered === i ? `${color}` : `${color}99` }} />
              <span className="w-full mt-2 text-xs text-center text-gray-500 truncate">{item[labelKey]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Progress Bar
const ProgressBar = ({ label, value, max = 100, color = '#10B981', suffix = '%', rightLabel }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-300">{rightLabel || `${value}${suffix}`}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full" style={{ background: '#1a3a2f' }}>
      <div className="h-full transition-all duration-700 rounded-full"
        style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  </div>
);

// SVG Map of Jharkhand
const JharkhandMap = ({ districts, onDistrictHover, hoveredDistrict }) => (
  <div className="relative w-full overflow-hidden rounded-2xl" style={{ background: '#0a1812', border: '1px solid #1a3a2f' }}>
    <svg viewBox="0 0 420 360" className="w-full" style={{ minHeight: 300 }}>
      {/* Jharkhand outline - simplified polygon */}
      <path
        d="M80,80 L120,50 L160,45 L200,50 L240,42 L280,48 L320,60 L350,80 L360,110 L355,140 L340,160 L330,190 L320,220 L300,250 L270,280 L240,300 L210,310 L180,305 L155,295 L130,275 L105,255 L85,230 L70,205 L65,180 L70,150 L75,120 Z"
        fill="#0d2b1f" stroke="#1a5c3a" strokeWidth="2" opacity="0.7"
      />
      {/* Forest texture dots */}
      {Array.from({length: 40}, (_, i) => (
        <circle key={i} cx={100 + (i % 8) * 28} cy={80 + Math.floor(i / 8) * 44}
          r="1.5" fill="#1a5c3a" opacity="0.3" />
      ))}
      {/* Rivers */}
      <path d="M180,55 Q200,120 220,160 Q240,200 250,250" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 2"/>
      <path d="M280,80 Q270,130 260,170 Q250,200 245,240" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.3" strokeDasharray="4 2"/>
      {/* District markers */}
      {districts.map((d, i) => {
        const isHovered = hoveredDistrict === d.district;
        const radius = Math.sqrt(d.visitors / 12500) * 18 + 6;
        return (
          <g key={i} onMouseEnter={() => onDistrictHover(d.district)} onMouseLeave={() => onDistrictHover(null)}
            style={{ cursor: 'pointer' }}>
            <circle cx={d.x} cy={d.y} r={radius + (isHovered ? 4 : 0)}
              fill={d.color} opacity={isHovered ? 0.9 : 0.5} />
            <circle cx={d.x} cy={d.y} r={radius / 2}
              fill={d.color} opacity={0.9} />
            <circle cx={d.x} cy={d.y} r={3} fill="white" />
            {isHovered && (
              <g>
                <rect x={d.x + 12} y={d.y - 32} width={110} height={52} rx="6"
                  fill="#0a1812" stroke={d.color} strokeWidth="1.5" />
                <text x={d.x + 18} y={d.y - 16} className="text-xs" fontSize="10" fill={d.color} fontWeight="bold">{d.district}</text>
                <text x={d.x + 18} y={d.y - 4} fontSize="9" fill="#9ca3af">{d.visitors.toLocaleString()} visitors</text>
                <text x={d.x + 18} y={d.y + 10} fontSize="9" fill={d.growth >= 0 ? '#10B981' : '#ef4444'}>
                  {d.growth >= 0 ? '+' : ''}{d.growth}% growth
                </text>
              </g>
            )}
          </g>
        );
      })}
      {/* District labels */}
      {districts.map((d, i) => (
        <text key={i} x={d.x} y={d.y + Math.sqrt(d.visitors / 12500) * 18 + 18}
          textAnchor="middle" fontSize="8" fill="#6b7280">{d.district}</text>
      ))}
      {/* Compass */}
      <g transform="translate(370, 50)">
        <circle cx="0" cy="0" r="16" fill="#0d2b1f" stroke="#1a5c3a" strokeWidth="1"/>
        <text x="0" y="-5" textAnchor="middle" fontSize="8" fill="#10B981" fontWeight="bold">N</text>
        <line x1="0" y1="-10" x2="0" y2="-2" stroke="#10B981" strokeWidth="1.5"/>
        <line x1="0" y1="10" x2="0" y2="2" stroke="#374151" strokeWidth="1"/>
      </g>
      {/* Scale */}
      <g transform="translate(30, 320)">
        <line x1="0" y1="0" x2="40" y2="0" stroke="#374151" strokeWidth="1.5"/>
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#374151" strokeWidth="1.5"/>
        <line x1="40" y1="-3" x2="40" y2="3" stroke="#374151" strokeWidth="1.5"/>
        <text x="20" y="12" textAnchor="middle" fontSize="8" fill="#6b7280">50 km</text>
      </g>
    </svg>
    {/* Legend */}
    <div className="absolute flex flex-col gap-2 bottom-4 left-4">
      {[
        { label: 'High Visitors', color: '#10B981' },
        { label: 'Medium Visitors', color: '#3B82F6' },
        { label: 'Growth Leader', color: '#EC4899' },
      ].map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: l.color, opacity: 0.8 }} />
          <span className="text-xs text-gray-500">{l.label}</span>
        </div>
      ))}
    </div>
  </div>
);

// Line Chart SVG
const LineChart = ({ data, color = '#10B981', height = 160 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * w},${100 - ((v - min) / range) * 90}`).join(' ');
  const area = `0,100 ${pts} ${100},100`;
  return (
    <svg viewBox="0 0 100 110" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#lineGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={i * w} cy={100 - ((v - min) / range) * 90} r="2"
          fill={color} opacity="0.8" />
      ))}
    </svg>
  );
};

// Donut Chart SVG
const DonutChart = ({ segments, size = 120 }) => {
  const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.24;
  let cumulative = 0;
  const slices = segments.map(s => {
    const start = cumulative;
    cumulative += s.percentage;
    return { ...s, start, end: cumulative };
  });
  const toRad = p => (p / 100) * Math.PI * 2 - Math.PI / 2;
  const arc = (s, e) => {
    const x1 = cx + r * Math.cos(toRad(s)), y1 = cy + r * Math.sin(toRad(s));
    const x2 = cx + r * Math.cos(toRad(e)), y2 = cy + r * Math.sin(toRad(e));
    const xi1 = cx + ir * Math.cos(toRad(s)), yi1 = cy + ir * Math.sin(toRad(s));
    const xi2 = cx + ir * Math.cos(toRad(e)), yi2 = cy + ir * Math.sin(toRad(e));
    const large = e - s > 50 ? 1 : 0;
    return `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${ir},${ir} 0 ${large},0 ${xi1},${yi1} Z`;
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {slices.map((s, i) => (
        <path key={i} d={arc(s.start, s.end)} fill={s.color} opacity="0.85" stroke="#0f1f1a" strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r={ir * 0.9} fill="#0f1f1a" />
    </svg>
  );
};

// Main Dashboard
const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [liveCount, setLiveCount] = useState(DEMO_DATA.liveStats.totalActive);

  useEffect(() => { setTimeout(() => setIsLoading(false), 1200); }, []);

  useEffect(() => {
    if (activeTab !== "realtime") return;
    const id = setInterval(() => {
      setLiveCount(v => v + Math.floor(Math.random() * 10 - 4));
    }, 3000);
    return () => clearInterval(id);
  }, [activeTab]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <Icons.BarChart /> },
    { id: "visitors", label: "Visitors", icon: <Icons.Users /> },
    { id: "revenue", label: "Revenue", icon: <Icons.DollarSign /> },
    { id: "demographics", label: "Demographics", icon: <Icons.Chart /> },
    { id: "geospatial", label: "Map View", icon: <Icons.Map /> },
    { id: "realtime", label: "Live", icon: <Icons.Zap /> },
    { id: "predictive", label: "Predictive", icon: <Icons.Brain /> },
    { id: "feedback", label: "Feedback", icon: <Icons.MessageSquare /> },
  ];

  const genderColors = ['#3B82F6','#EC4899','#F59E0B'];
  const purposeColors = ['#10B981','#8B5CF6','#F59E0B','#3B82F6','#EF4444'];

  return (
    <div className="min-h-screen" style={{ background: '#071510', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a1812; }
        ::-webkit-scrollbar-thumb { background: #1a5c3a; border-radius: 3px; }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: rgba(16,185,129,0.08); }
        .tab-active { border-bottom: 2px solid #10B981 !important; color: #10B981 !important; }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4);} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0);} }
        .pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes fade-up { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        .fade-up { animation: fade-up 0.4s ease forwards; }
        .card { border-radius: 16px; background: #0f1f1a; border: 1px solid #1a3a2f; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: 'rgba(7,21,16,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a3a2f' }}>
        <div className="flex flex-col items-start justify-between gap-4 px-6 py-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: 'linear-gradient(135deg, #065f46, #047857)' }}>
              <Icons.Activity />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Jharkhand Tourism Analytics
              </h1>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 transition-colors rounded-xl hover:text-white"
              style={{ background: '#0f1f1a', border: '1px solid #1a3a2f' }}>
              <Icons.Filter />
              Filters
            </button>
            <select value={timeRange} onChange={e => setTimeRange(e.target.value)}
              className="px-4 py-2 text-sm text-gray-300 cursor-pointer rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              style={{ background: '#0f1f1a', border: '1px solid #1a3a2f' }}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl"
              style={{ background: '#05260e', border: '1px solid #10B981', color: '#10B981' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse pulse-glow" />
              Live Data
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 px-6 py-4 fade-up" style={{ borderTop: '1px solid #1a3a2f', background: '#0a1812' }}>
            {[
              { label: 'District', options: ['All Districts', ...DEMO_DATA.visitorsByDistrict.map(d => d.district)], value: selectedDistrict, onChange: setSelectedDistrict },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <label className="text-xs tracking-wider text-gray-500 uppercase">{f.label}</label>
                <select value={f.value} onChange={e => f.onChange(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-300 cursor-pointer rounded-xl focus:outline-none"
                  style={{ background: '#0f1f1a', border: '1px solid #1a3a2f', minWidth: 160 }}>
                  {f.options.map((o, j) => <option key={j}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="flex items-end">
              <button className="px-5 py-2 text-sm font-semibold text-white transition-colors rounded-xl"
                style={{ background: '#047857' }}>Apply</button>
            </div>
          </div>
        )}

        <div className="flex gap-1 px-6 overflow-x-auto" style={{ borderTop: '1px solid #1a3a2f' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 border-transparent transition-colors ${activeTab === tab.id ? 'tab-active' : 'text-gray-500 hover:text-gray-300'}`}>
              {tab.icon}
              {tab.label}
              {tab.id === 'realtime' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 h-96">
            <div className="w-12 h-12 border-2 rounded-full border-emerald-600 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-6 fade-up">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard icon={<Icons.Users />} title="Total Visitors" value="49,500" change={12.5} accent="#3B82F6" />
                  <MetricCard icon={<Icons.DollarSign />} title="Total Revenue" value="Rs. 232Cr" change={8.2} accent="#10B981" />
                  <MetricCard icon={<Icons.Calendar />} title="Avg. Stay Duration" value="3.2 days" change={-0.3} accent="#8B5CF6" />
                  <MetricCard icon={<Icons.Star />} title="Satisfaction Score" value="94%" change={2} accent="#F59E0B" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Visitors by District</h3>
                      <span className="px-3 py-1 text-xs rounded-full text-emerald-400 bg-emerald-400/10">Live</span>
                    </div>
                    <BarChart data={DEMO_DATA.visitorsByDistrict} labelKey="district" valueKey="visitors" color="#10B981" height={220} />
                  </div>

                  <div className="p-6 card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Revenue Trend</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-emerald-400 rounded" />
                        <span className="text-xs text-gray-500">{timeRange}</span>
                      </div>
                    </div>
                    <LineChart data={DEMO_DATA.revenueTrends.data} color="#10B981" height={180} />
                    <div className="flex justify-between px-1 mt-2">
                      {DEMO_DATA.revenueTrends.labels.map((l, i) => (
                        <span key={i} className="text-xs text-gray-600">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 card">
                  <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Category Performance</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {DEMO_DATA.categoryPerformance.map((item, i) => {
                      const colors = ['#10B981','#3B82F6','#8B5CF6','#F59E0B','#EC4899','#06B6D4'];
                      return (
                        <div key={i} className="p-4 rounded-xl hover:scale-[1.01] transition-transform cursor-default"
                          style={{ background: '#071510', border: '1px solid #1a3a2f' }}>
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-semibold text-gray-200">{item.category}</h4>
                            <span className={`text-xs font-semibold ${item.trend === 'up' ? 'text-emerald-400' : item.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}`}>
                              {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : '~'}
                            </span>
                          </div>
                          <div className="mt-3">
                            <span className="text-2xl font-bold text-white">Rs.{item.revenue}Cr</span>
                          </div>
                          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a3a2f' }}>
                            <div className="h-full transition-all duration-700 rounded-full"
                              style={{ width: `${item.percentage}%`, background: colors[i] }} />
                          </div>
                          <p className="mt-1 text-xs text-gray-600">{item.percentage}% of total revenue</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VISITORS */}
            {activeTab === 'visitors' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>District-wise Visitors</h3>
                    <BarChart data={DEMO_DATA.visitorsByDistrict} labelKey="district" valueKey="visitors" color="#3B82F6" height={200} />
                  </div>
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Monthly Distribution</h3>
                    <BarChart data={DEMO_DATA.demographicData.monthlyDistribution} labelKey="month" valueKey="visitors" color="#8B5CF6" height={200} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Peak Month', value: 'December', sub: '18,200 visitors', color: '#10B981' },
                    { label: 'Daily Average', value: '1,650', sub: 'visitors per day', color: '#3B82F6' },
                    { label: 'YoY Growth', value: '+12.5%', sub: 'year over year', color: '#8B5CF6' },
                  ].map((s, i) => (
                    <div key={i} className="p-5 card">
                      <p className="mb-2 text-xs tracking-wider text-gray-500 uppercase">{s.label}</p>
                      <p className="text-3xl font-bold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                      <p className="mt-1 text-sm text-gray-600">{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 card">
                  <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>District Growth Ranking</h3>
                  <div className="space-y-3">
                    {[...DEMO_DATA.visitorsByDistrict].sort((a, b) => b.growth - a.growth).map((d, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 transition-colors rounded-xl hover:bg-white/5">
                        <span className="w-8 text-2xl font-bold text-gray-700">#{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-200">{d.district}</span>
                            <span className={`text-sm font-bold ${d.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {d.growth >= 0 ? '+' : ''}{d.growth}%
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a3a2f' }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.abs(d.growth) * 5}%`, background: d.color }} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{d.visitors.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* REVENUE */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard icon={<Icons.DollarSign />} title="Total Revenue" value="Rs. 799Cr" change={8.2} accent="#10B981" />
                  <MetricCard icon={<Icons.TrendUp />} title="Best Month" value="December" accent="#F59E0B" />
                  <MetricCard icon={<Icons.Target />} title="Avg Monthly" value="Rs. 66.5Cr" change={3.1} accent="#3B82F6" />
                  <MetricCard icon={<Icons.Activity />} title="Projected Next" value="Rs. 285Cr" change={12.3} accent="#8B5CF6" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-2 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Monthly Revenue (Rs. Crore)</h3>
                    <LineChart data={DEMO_DATA.revenueTrends.data} color="#10B981" height={180} />
                    <div className="flex justify-between mt-2">
                      {DEMO_DATA.revenueTrends.labels.map((l, i) => (
                        <span key={i} className="text-xs text-gray-600">{l}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Revenue by Category</h3>
                    <div className="space-y-4">
                      {Object.entries(DEMO_DATA.revenueTrends.categories).map(([key, vals], i) => {
                        const total = vals.reduce((a, b) => a + b, 0);
                        const colors = ['#F59E0B','#10B981','#8B5CF6','#3B82F6'];
                        return (
                          <ProgressBar key={i} label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={total} max={260} suffix="Cr" color={colors[i]}
                            rightLabel={`Rs.${total}Cr`} />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 card">
                  <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Category-wise Revenue Breakdown</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(DEMO_DATA.revenueTrends.categories).map(([key, vals], i) => {
                      const total = vals.reduce((a, b) => a + b, 0);
                      const colors = ['#F59E0B','#10B981','#8B5CF6','#3B82F6'];
                      const pct = Math.round((total / 780) * 100);
                      return (
                        <div key={i} className="p-4 text-center rounded-xl" style={{ background: '#071510', border: `1px solid ${colors[i]}33` }}>
                          <p className="text-xs tracking-wider text-gray-500 uppercase">{key}</p>
                          <p className="mt-2 text-2xl font-bold" style={{ color: colors[i] }}>Rs.{total}Cr</p>
                          <p className="mt-1 text-xs text-gray-600">{pct}% of total</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DEMOGRAPHICS */}
            {activeTab === 'demographics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Age Distribution</h3>
                    <div className="space-y-4">
                      {DEMO_DATA.demographicData.ageGroups.map((item, i) => {
                        const colors = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899'];
                        return (
                          <ProgressBar key={i} label={item.group} value={item.percentage} color={colors[i]}
                            rightLabel={`${item.percentage}% (${item.count.toLocaleString()})`} />
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Visitor Sources</h3>
                    <div className="space-y-4">
                      {DEMO_DATA.demographicData.sources.map((item, i) => {
                        const colors = ['#10B981','#3B82F6','#8B5CF6','#F59E0B','#6B7280'];
                        return (
                          <ProgressBar key={i} label={item.source} value={item.percentage} color={colors[i]} />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Gender Distribution</h3>
                    <div className="flex items-center gap-8">
                      <DonutChart size={140} segments={DEMO_DATA.demographicData.gender.map((g, i) => ({ ...g, color: genderColors[i] }))} />
                      <div className="space-y-3">
                        {DEMO_DATA.demographicData.gender.map((g, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: genderColors[i] }} />
                            <div>
                              <p className="text-sm font-semibold text-gray-200">{g.type}</p>
                              <p className="text-xs text-gray-500">{g.percentage}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Travel Purpose</h3>
                    <div className="flex items-center gap-8">
                      <DonutChart size={140} segments={DEMO_DATA.demographicData.travelPurpose.map((p, i) => ({ ...p, color: purposeColors[i], percentage: p.percentage }))} />
                      <div className="space-y-3">
                        {DEMO_DATA.demographicData.travelPurpose.map((p, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: purposeColors[i] }} />
                            <div>
                              <p className="text-sm font-semibold text-gray-200">{p.purpose}</p>
                              <p className="text-xs text-gray-500">{p.percentage}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GEOSPATIAL */}
            {activeTab === 'geospatial' && (
              <div className="space-y-6">
                <div className="p-6 card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Visitor Geographic Distribution</h3>
                    <span className="px-3 py-1 text-xs rounded-full text-emerald-400 bg-emerald-400/10">Interactive Map</span>
                  </div>
                  <JharkhandMap districts={DEMO_DATA.visitorsByDistrict} onDistrictHover={setHoveredDistrict} hoveredDistrict={hoveredDistrict} />
                  <p className="mt-4 text-xs text-center text-gray-600">Hover over markers to see district details. Circle size represents visitor volume.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {DEMO_DATA.visitorsByDistrict.map((d, i) => (
                    <div key={i} className="card p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-default"
                      style={{ borderColor: hoveredDistrict === d.district ? d.color : '#1a3a2f' }}>
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl"
                        style={{ background: `${d.color}22` }}>
                        <div style={{ color: d.color, width: 20, height: 20 }}>
                          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-200">{d.district}</p>
                        <p className="text-xs text-gray-500">{d.visitors.toLocaleString()} visitors</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${d.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {d.growth >= 0 ? '+' : ''}{d.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REALTIME */}
            {activeTab === 'realtime' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard icon={<Icons.Users />} title="Active Right Now" value={liveCount.toLocaleString()} accent="#10B981" />
                  <MetricCard icon={<Icons.CheckCircle />} title="Check-ins Today" value={DEMO_DATA.liveStats.checkinsToday.toLocaleString()} accent="#3B82F6" />
                  <MetricCard icon={<Icons.Target />} title="Busiest Location" value={DEMO_DATA.liveStats.busiestLocation} accent="#EC4899" />
                  <MetricCard icon={<Icons.Calendar />} title="Peak Hour" value={DEMO_DATA.liveStats.peakHour} accent="#F59E0B" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="p-6 card lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Live Activity Feed</h3>
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Updates every 5s
                      </div>
                    </div>
                    <div className="space-y-3">
                      {DEMO_DATA.realTimeVisitors.map((v, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 transition-colors rounded-xl hover:bg-white/5">
                          <div className="relative">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: '#1a3a2f' }}>
                              <Icons.Person />
                            </div>
                            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${v.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-200">{v.location}</p>
                            <p className="text-xs text-gray-500">{v.activity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{v.visitors}</p>
                            <p className="text-xs text-gray-600">{v.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Live Pulse</h3>
                    <div className="space-y-4">
                      <div className="p-4 text-center rounded-xl" style={{ background: '#071510', border: '1px solid #1a3a2f' }}>
                        <p className="text-4xl font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{liveCount.toLocaleString()}</p>
                        <p className="mt-1 text-xs text-gray-500">Active tourists</p>
                      </div>
                      <LineChart data={[900,1050,980,1100,1214,liveCount]} color="#10B981" height={100} />
                      <div className="space-y-2">
                        <p className="text-xs tracking-wider text-gray-500 uppercase">Trending Activities</p>
                        {DEMO_DATA.liveStats.popularActivities.map((a, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-emerald-400"
                            style={{ background: '#05260e' }}>
                            <Icons.Activity />
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREDICTIVE */}
            {activeTab === 'predictive' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard icon={<Icons.Users />} title="Next Month Forecast" value="54,300" change={15.2} accent="#3B82F6" />
                  <MetricCard icon={<Icons.DollarSign />} title="Revenue Projection" value="Rs.285Cr" change={12.3} accent="#10B981" />
                  <MetricCard icon={<Icons.Target />} title="Recommended Focus" value="Adventure" accent="#8B5CF6" />
                  <MetricCard icon={<Icons.Calendar />} title="Peak Period" value="Nov-Dec" accent="#F59E0B" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Monthly Forecast</h3>
                    <div className="space-y-5">
                      {DEMO_DATA.predictiveInsights.monthlyForecast.map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-300">{item.month} 2025</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-white">{item.predicted.toLocaleString()}</span>
                              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{item.confidence}% conf.</span>
                            </div>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full" style={{ background: '#1a3a2f' }}>
                            <div className="h-full rounded-full" style={{ width: `${(item.predicted / 25000) * 100}%`, background: `hsl(${150 - i * 15}, 70%, 45%)` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Risk Assessment</h3>
                    <div className="space-y-5">
                      {DEMO_DATA.predictiveInsights.riskFactors.map((risk, i) => {
                        const color = risk.impact === 'High' ? '#ef4444' : risk.impact === 'Medium' ? '#f59e0b' : '#10B981';
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-300">{risk.factor}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color, background: `${color}22` }}>{risk.impact}</span>
                                <span className="text-xs text-gray-500">{risk.probability}%</span>
                              </div>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full" style={{ background: '#1a3a2f' }}>
                              <div className="h-full rounded-full" style={{ width: `${risk.probability}%`, background: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 card" style={{ background: 'linear-gradient(135deg, #071510 0%, #0d1f16 100%)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Icons.Lightbulb />
                    <h3 className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI Recommendations</h3>
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full ml-auto">AI Powered</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {DEMO_DATA.predictiveInsights.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#0a1812', border: '1px solid #1a3a2f' }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#10B98122' }}>
                          <div className="scale-75 text-emerald-400"><Icons.CheckCircle /></div>
                        </div>
                        <p className="text-sm text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FEEDBACK */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard icon={<Icons.Star />} title="Overall Rating" value="4.2 / 5.0" change={0.3} accent="#F59E0B" />
                  <MetricCard icon={<Icons.MessageSquare />} title="Total Reviews" value="15,423" change={12} accent="#3B82F6" />
                  <MetricCard icon={<Icons.TrendUp />} title="Satisfaction Rate" value="80%" change={5} accent="#10B981" />
                  <MetricCard icon={<Icons.AlertTriangle />} title="Improvement Areas" value="4 items" accent="#EF4444" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Satisfaction Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Excellent', value: 45, color: '#10B981' },
                        { label: 'Good', value: 35, color: '#3B82F6' },
                        { label: 'Average', value: 15, color: '#F59E0B' },
                        { label: 'Poor', value: 5, color: '#EF4444' },
                      ].map((s, i) => (
                        <ProgressBar key={i} label={s.label} value={s.value} color={s.color} />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Category Ratings</h3>
                    <div className="space-y-4">
                      {DEMO_DATA.feedbackData.categories.map((cat, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-sm text-gray-400 w-28">{cat.name}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <div key={s} className={s <= Math.round(cat.rating) ? 'text-yellow-400' : 'text-gray-700'}>
                                <Icons.Star filled={s <= Math.round(cat.rating)} />
                              </div>
                            ))}
                          </div>
                          <span className="ml-1 text-sm font-bold text-white">{cat.rating}</span>
                          <span className="ml-auto text-xs text-gray-600">({cat.reviews.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Reviews</h3>
                    <div className="space-y-4">
                      {DEMO_DATA.feedbackData.recentFeedback.map((fb, i) => (
                        <div key={i} className="p-4 rounded-xl" style={{ background: '#071510', border: '1px solid #1a3a2f' }}>
                          <div className="flex items-start justify-between">
                            <span className="text-sm font-semibold text-gray-200">{fb.user}</span>
                            <span className="text-xs text-gray-600">{fb.date}</span>
                          </div>
                          <div className="flex gap-0.5 mt-2">
                            {[1,2,3,4,5].map(s => (
                              <div key={s} className={s <= fb.rating ? 'text-yellow-400' : 'text-gray-700'}>
                                <Icons.Star filled={s <= fb.rating} />
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-gray-500">{fb.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 card">
                    <h3 className="mb-6 font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Improvement Areas</h3>
                    <div className="space-y-3">
                      {DEMO_DATA.feedbackData.improvementAreas.map((area, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#1a0a0a', border: '1px solid #3a1a1a' }}>
                          <div className="text-red-400"><Icons.AlertTriangle /></div>
                          <span className="text-sm text-gray-300">{area}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 mt-6 rounded-xl" style={{ background: '#071510', border: '1px solid #10B98133' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-emerald-400"><Icons.Lightbulb /></div>
                        <h5 className="text-sm font-semibold text-white">Priority Action</h5>
                      </div>
                      <p className="text-sm text-gray-500">Prioritize improving public transport and basic amenities at popular tourist locations to enhance visitor satisfaction scores.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between px-4 py-3 text-xs rounded-xl" style={{ background: '#0f1f1a', border: '1px solid #1a3a2f' }}>
              <div className="flex items-center gap-2 text-gray-500">
                <Icons.RefreshCw />
                Demo data — all metrics are sample figures
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Last refreshed: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </main>

      <ChatBot />
    </div>
  );
};

export default Analytics;