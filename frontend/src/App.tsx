// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import LiquidHomePage from "./pages/LiquidHomePage";
import LiquidPredictionPage from "./pages/LiquidPredictionPage";
import LiquidModelPerformancePage from "./pages/LiquidModelPerformancePage";
import BulkUpload from "./pages/BulkUpload";
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LiquidHomePage />} />
          <Route path="/predict" element={<LiquidPredictionPage />} />
          <Route path="/performance" element={<LiquidModelPerformancePage />} />
          <Route path="/bulk-upload" element={<BulkUpload />} />
          <Route path="/about" element={<AboutUs />} />
          {/* Add more routes like Login, About Us, Contact Us once created */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
