import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateElectionPage from './pages/CreateElectionPage';
import DashboardPage from './pages/DashboardPage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';
import { getCurrentUser, login, logout } from './services/api';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (requestError) => {
        if (requestError.response?.status === 401) {
          setUser(null);
        }
        return Promise.reject(requestError);
      }
    );

    sessionStorage.removeItem('isAuthenticated');
    getCurrentUser()
      .then((result) => setUser(result.authenticated ? result.user : null))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));

    return () => axios.interceptors.response.eject(interceptorId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      const result = await getCurrentUser();
      const authenticatedUser = result.authenticated ? result.user : null;
      setUser(authenticatedUser);
      if (authenticatedUser?.role !== 'admin') {
        setError('This account does not have administrator access.');
      }
    } catch (requestError) {
      setUser(null);
      setError(requestError.response?.data?.error || 'Login failed. Please check your credentials.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setPassword('');
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError('Sign out could not be confirmed.');
      return;
    }

    setUser(null);
    setPassword('');
  };

  const isAdmin = user?.role === 'admin';

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {authLoading ? (
          <div className="min-h-screen flex items-center justify-center">Checking admin session...</div>
        ) : !isAdmin ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className={`bg-white rounded-lg p-8 max-w-md w-full shadow-2xl transform transition-transform ${shake ? 'animate-shake' : ''}`}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Authentication</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
                    autoComplete="username"
                    required
                  />
                  <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    autoFocus
                  />
                  {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Login'}
                </button>
              </form>
              {user && user.role !== 'admin' && (
                <button type="button" onClick={handleLogout} className="w-full mt-3 text-sm text-gray-600 underline">
                  Sign out of voter account
                </button>
              )}
            </div>
          </div>
        ) : null}

        {isAdmin && (
          <>
            <Navbar onLogout={handleLogout} />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route
                  path="/create-election"
                  element={
                    <ProtectedRoute>
                      <CreateElectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/elections/:id"
                  element={
                    <ProtectedRoute>
                      <ElectionDetailsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

// Add the shake animation to your CSS
const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-10px); }
      80% { transform: translateX(10px); }
      100% { transform: translateX(0); }
    }
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);
};

// Inject the styles when the component mounts
if (typeof window !== 'undefined') {
  injectGlobalStyles();
}

export default App;