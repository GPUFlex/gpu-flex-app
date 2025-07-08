'use client';

import type React from 'react';
import type { User } from '../../types';
import './Navigation.css';

interface NavigationProps {
  user: User;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  currentPage,
  onPageChange,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'home', label: 'Home', icon: 'fas fa-tachometer-alt' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo">
          <i className="fas fa-microchip"></i>
        </div>
        <span className="nav-title">GPUFlex</span>
      </div>

      <div className="nav-menu">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <i className={item.icon}></i>
            {item.label}
          </button>
        ))}
      </div>

      <div className="nav-user">
        <div className="points-display">
          <i className="fas fa-coins"></i>
          <span>{user.totalEarnings.toLocaleString()}</span>
        </div>
        <div className="user-avatar">
          <img
            src={user.avatar || '/placeholder.svg?height=40&width=40'}
            alt="User"
          />
          <div className="user-tier">{user.tier}</div>
        </div>
      </div>
    </nav>
  );
};
