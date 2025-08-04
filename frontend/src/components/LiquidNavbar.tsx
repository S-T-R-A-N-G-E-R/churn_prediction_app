import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const LiquidNavbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.9, 0.95]);

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', updateScrolled);
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/predict', label: 'Predict', icon: '🔮' },
    { path: '/performance', label: 'Analytics', icon: '📊' },
    { path: '/bulk-upload', label: 'Bulk Upload', icon: '📤' },
    { path: '/about', label: 'About Us', icon: 'ℹ️' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center">
      <motion.nav 
        className="glass-surface bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2"
        style={{ opacity: navOpacity }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.9 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm flex items-center space-x-2 ${
                location.pathname === item.path 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-base"
              >
                {item.icon}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
              
              {/* Active indicator */}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default LiquidNavbar;
