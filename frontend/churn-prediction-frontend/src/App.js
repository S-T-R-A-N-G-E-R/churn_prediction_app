import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './index.css'; // Ensure Tailwind is included

// Placeholder components (we'll build these later)
import PredictionPage from './components/PredictionPage';
import ModelPerformancePage from './components/ModelPerformancePage';
import FeatureImportancePage from './components/FeatureImportancePage';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/model-performance" element={<ModelPerformancePage />} />
            <Route path="/feature-importance" element={<FeatureImportancePage />} />
            <Route path="/" element={<Navigate to="/predict" />} /> {/* Redirect root to /predict */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;