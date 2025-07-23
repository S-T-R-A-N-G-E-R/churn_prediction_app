import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import ModelPerformancePage from './pages/ModelPerformancePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/performance" element={<ModelPerformancePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
