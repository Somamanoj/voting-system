import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, ChevronRight } from 'lucide-react';
import { selectIsLoggedIn } from '../../store/userSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authLoading = useSelector((state) => state.user.authLoading);

  return (
    <nav className="fixed w-full top-0 z-50">
      <div className="relative">
        {/* Enhanced Blur Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-md border-b border-gray-100" />

        <div className="relative mx-auto max-w-7xl px-4 py-2 md:py-4">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex-shrink-0 ml-2">
              <Link to="/" className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Elections
                </span>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  System
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/elections">Elections</NavLink>
              <NavLink to="/news">News</NavLink>
              <NavLink to="/research">Research</NavLink>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {authLoading ? null : isLoggedIn ? (
                <Link
                  to="/account"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center border border-transparent rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                <div
                  className={`w-6 transform transition-all duration-300 ${isMobileMenuOpen ? "rotate-90" : "rotate-0"
                    }`}
                >
                  {!isMobileMenuOpen ? <Menu size={24} /> : <X size={24} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white/70 backdrop-blur-md transform transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          style={{ top: "55px" }}
        >
          <div className="p-6 space-y-8">
            <div className="space-y-6">
              <MobileNavLink to="/" icon="🏠">
                Home
              </MobileNavLink>
              <MobileNavLink to="/Elections" icon="🗳️">
                elections
              </MobileNavLink>
              <MobileNavLink to="/news" icon="📰">
                News
              </MobileNavLink>
              <MobileNavLink to="/research" icon="ℹ️">
                Research
              </MobileNavLink>
            </div>
            <div className="space-y-4">
              {authLoading ? null : isLoggedIn ? (
                <Link
                  to="/account"
                  className="w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:opacity-90 transition-opacity"
                >
                  My Account
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="w-full px-6 py-3 text-base font-medium text-blue-600 text-center block hover:text-blue-800 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="group relative px-2 py-1">
    <span className="font-semibold relative z-10 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
      {children}
    </span>
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-100 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-100" />
  </Link>
);

const MobileNavLink = ({
  to,
  children,
  icon,
}) => (
  <Link
    to={to}
    className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <span className="text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
        {children}
      </span>
    </div>
    <ChevronRight
      size={20}
      className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
    />
  </Link>
);

export default Navbar;