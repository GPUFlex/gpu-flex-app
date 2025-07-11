import type React from 'react';
import type { User } from '../../types';
import './StatsOverview.css';

interface StatsOverviewProps {
  user: User;
  sessionTime: number;
  totalDeposits: number;
  isSharing: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  user,
  sessionTime,
  totalDeposits,
  isSharing,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    {
      icon: 'fas fa-coins',
      label: 'Total Points',
      value: user?.totalEarnings?.toLocaleString() ?? '',
      iconClass: 'coins',
    },
    {
      icon: 'fas fa-dollar-sign',
      label: 'Total Deposits',
      value: `$${totalDeposits}`,
      iconClass: 'dollar',
    },
    {
      icon: 'fas fa-clock',
      label: 'Session Time',
      value: formatTime(sessionTime),
      iconClass: 'clock',
    },
    {
      icon: 'fas fa-chart-line',
      label: 'Status',
      value: isSharing ? 'Sharing' : 'Idle',
      iconClass: 'chart',
      badge: true,
      badgeClass: isSharing ? 'sharing' : 'idle',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className={`stat-icon ${stat.iconClass}`}>
            <i className={stat.icon}></i>
          </div>
          <div className="stat-content">
            <div className="stat-label">{stat.label}</div>
            {stat.badge ? (
              <div className={`stat-badge ${stat.badgeClass}`}>
                {stat.value}
              </div>
            ) : (
              <div className="stat-value">{stat.value}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
