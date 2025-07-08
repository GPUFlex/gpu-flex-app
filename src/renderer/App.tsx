'use client';

import type React from 'react';
import { useState } from 'react';
import { Navigation } from './components/Navigation/Navigation';
import { Dashboard } from './pages/Dashboard/Dashboard';
import type { User } from './types';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState<User>({
    id: 'user_123',
    username: 'GPUMiner2024',
    email: 'user@example.com',
    avatar: '/placeholder.svg?height=100&width=100',
    joinDate: new Date('2024-01-15'),
    totalEarnings: 2450,
    totalSessions: 47,
    totalHours: 156.5,
    tier: 'Gold',
    preferences: {
      notifications: true,
      autoStart: false,
      maxTemperature: 80,
      maxPowerUsage: 300,
    },
    stats: {
      totalPointsEarned: 15420,
      totalPointsSpent: 2970,
      averageSessionLength: 3.3,
      longestSession: 8.5,
    },
  });

  const handleUserUpdate = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onUserUpdate={handleUserUpdate} />;

      default:
        return <Dashboard user={user} onUserUpdate={handleUserUpdate} />;
    }
  };

  return (
    <div className="app">
      <Navigation
        user={user}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <main className="main-content">{renderCurrentPage()}</main>
    </div>
  );
};

export default App;
