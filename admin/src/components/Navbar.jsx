import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  PlusCircle,
  Menu,
  X,
  ListChecks
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      to: "/",
      label: "Dashboard",
      icon: <Home size={20} className="mr-2" />
    },
    {
      to: "/create-election",
      label: "Create Election",
      icon: <PlusCircle size={20} className="mr-2" />
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <ListChecks size={30} />
          <h1 className="text-2xl font-bold tracking-wider">
            Voting System Admin
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <motion.div
              key={link.to}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.to}
                className="flex items-center px-4 py-2 rounded-md 
                  hover:bg-white/20 transition-colors duration-300"
              >
                {link.icon}
                {link.label}
              </Link>
            </motion.div>
          ))}
          <button type="button" onClick={onLogout} className="flex items-center px-4 py-2 rounded-md hover:bg-white/20 transition-colors duration-300">
            Sign Out
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <motion.button
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/10 backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <motion.div
                  key={link.to}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    onClick={toggleMobileMenu}
                    className="flex items-center px-4 py-3 rounded-md 
                      text-white hover:bg-white/20 transition-colors duration-300"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <button type="button" onClick={onLogout} className="flex items-center px-4 py-3 rounded-md text-white hover:bg-white/20 transition-colors duration-300">
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;