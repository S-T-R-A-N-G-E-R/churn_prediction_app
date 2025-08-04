import React from 'react';
import headshot1 from '../assets/Swapnil.JPG';
import headshot2 from '../assets/Rupsha.jpg';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Title Section */}
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-glass mb-2">
          About Us
        </h1>
        <p className="text-glass-secondary">
          Meet the team behind our AI-driven churn prediction college project
        </p>
      </div>

      {/* Glass Card for Team and Info */}
      <div className="glass-card p-6 sm:p-8 rounded-lg animate-fade-in">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Team Section */}
          <div className="flex flex-col md:flex-row gap-10 md:w-2/3">
            {/* Swapnil Section */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={headshot1}
                alt="Swapnil Roy"
                aria-label="Headshot of Swapnil Roy"
                className="rounded-full w-48 h-48 object-cover border border-glass/30 shadow-glass"
              />
              <h2 className="text-xl font-semibold text-glass">Swapnil Roy</h2>
              <p className="text-center text-glass-secondary">M.Sc Data Science</p>
              <p className="text-center text-glass-secondary text-sm">Reg. No: 2448365</p>
              <p className="text-center text-glass-secondary text-sm">
                <a
                  href="mailto:swapnil.roy@msds.christuniversity.in"
                  className="text-accent hover:underline"
                >
                  swapnil.roy@msds.christuniversity.in
                </a>
              </p>
            </div>
            {/* Rupsha Section */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={headshot2}
                alt="Rupsha Das"
                aria-label="Headshot of Rupsha Das"
                className="rounded-full w-48 h-48 object-cover border border-glass/30 shadow-glass"
              />
              <h2 className="text-xl font-semibold text-glass">Rupsha Das</h2>
              <p className="text-center text-glass-secondary">M.Sc Data Science</p>
              <p className="text-center text-glass-secondary text-sm">Reg. No: 2448351</p>
              <p className="text-center text-glass-secondary text-sm">
                <a
                  href="mailto:rupsha.das@msds.christuniversity.in"
                  className="text-accent hover:underline"
                >
                  rupsha.das@msds.christuniversity.in
                </a>
              </p>
            </div>
          </div>
          {/* Info Section */}
          <div className="md:w-1/3 space-y-6">
            <h3 className="text-xl font-semibold text-glass flex items-center">
              <span className="mr-2">🌟</span>
              About Our Project
            </h3>
            <p className="text-glass-secondary text-sm">
              We are students pursuing M.Sc Data Science at Christ (Deemed to be University), Bangalore. This project, developed as part of our academic curriculum, focuses on predicting customer churn using advanced machine learning techniques.
            </p>
            <p className="text-glass-secondary text-sm">
              Our goal is to create an AI-driven solution that helps businesses understand and reduce customer churn through predictive analytics and actionable insights.
            </p>
            <p className="text-glass-secondary text-sm">
              Reach out to us for collaboration or inquiries via our individual emails listed above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}