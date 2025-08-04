// src/Layout.tsx
import React from "react";
import LiquidNavbar from "./components/LiquidNavbar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Fixed Gradient Background with Animated Orbs */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10">
        <div
          className="absolute top-20 -left-48 w-96 h-96 rounded-full opacity-20 animate-liquid-float"
          style={{
            background: "linear-gradient(135deg, #007AFF, #5856D6)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-96 -right-32 w-64 h-64 rounded-full opacity-20 animate-liquid-float"
          style={{
            background: "linear-gradient(135deg, #5856D6, #AF52DE)",
            filter: "blur(40px)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full opacity-20 animate-liquid-float"
          style={{
            background: "linear-gradient(135deg, #34C759, #007AFF)",
            filter: "blur(50px)",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Navbar */}
      <LiquidNavbar />

      {/* Main content with padding top to avoid navbar overlap */}
      <main className="relative z-10 pt-28 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
