'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation/Navigation';
import { Dashboard } from './pages/Dashboard/Dashboard';
import type { User } from './types';
import './App.css';
import LoginPage from './pages/Login/LoginPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null); // initially not logged in

  // Load from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleUserUpdate = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard'); // ✅ redirect to dashboard after login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onUserUpdate={handleUserUpdate} />;
      default:
        return <Dashboard user={user} onUserUpdate={handleUserUpdate} />;
    }
  };

  return (
    <div className="app">
      {user && (
        <Navigation
          user={user}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      <main className="main-content">{renderCurrentPage()}</main>
    </div>
  );
};

export default App;