import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiquidNavbar from './components/LiquidNavbar';
import LiquidHomePage from './pages/LiquidHomePage';
import LiquidPredictionPage from './pages/LiquidPredictionPage';
import LiquidModelPerformancePage from './pages/LiquidModelPerformancePage';  // Fixed import

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Liquid Glass Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Animated Background Orbs */}
          <div className="absolute top-20 -left-48 w-96 h-96 rounded-full opacity-20 animate-liquid-float"
               style={{
                 background: 'linear-gradient(135deg, #007AFF, #5856D6)',
                 filter: 'blur(60px)',
               }}
          />
          <div className="absolute top-96 -right-32 w-64 h-64 rounded-full opacity-20 animate-liquid-float"
               style={{
                 background: 'linear-gradient(135deg, #5856D6, #AF52DE)',
                 filter: 'blur(40px)',
                 animationDelay: '2s'
               }}
          />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full opacity-20 animate-liquid-float"
               style={{
                 background: 'linear-gradient(135deg, #34C759, #007AFF)',
                 filter: 'blur(50px)',
                 animationDelay: '4s'
               }}
          />
        </div>

        {/* Floating Navigation */}
        <LiquidNavbar />
        
        {/* Main Content with Glass Container */}
        <main className="relative z-10 pt-20">
          <Routes>
            <Route path="/" element={<LiquidHomePage />} />
            <Route path="/predict" element={<LiquidPredictionPage />} />
            <Route path="/performance" element={<LiquidModelPerformancePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
