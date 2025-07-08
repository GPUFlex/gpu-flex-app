'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

import type { User, GPUStatsData, Session } from '../../types';
import './Dashboard.css';
import { ControlPanel } from '../../components/ControlPanel/ControlPanel';
import { SessionHistory } from '../../components/SessionHistory/SessionHistory';
import { GPUStats } from '../../components/GPUStats/GPUStats';
import { StatsOverview } from '../../components/StatsOverview/StatsOverview';

interface DashboardProps {
  user: User;
  onUserUpdate: (updates: Partial<User>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate }) => {
  const [gpuStats, setGpuStats] = useState<GPUStatsData>({
    usage: 0,
    temperature: 45,
    memory: 20,
    power: 150,
  });

  const [isSharing, setIsSharing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Simulate GPU stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGpuStats((prev) => ({
        usage: isSharing
          ? Math.min(95, prev.usage + Math.random() * 10 - 5)
          : Math.max(0, prev.usage - 2),
        temperature: isSharing
          ? Math.min(
              user.preferences.maxTemperature,
              prev.temperature + Math.random() * 4 - 2,
            )
          : Math.max(45, prev.temperature - 1),
        memory: isSharing
          ? Math.min(90, prev.memory + Math.random() * 8 - 4)
          : Math.max(20, prev.memory - 1),
        power: isSharing
          ? Math.min(
              user.preferences.maxPowerUsage,
              prev.power + Math.random() * 20 - 10,
            )
          : Math.max(150, prev.power - 5),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [
    isSharing,
    user.preferences.maxTemperature,
    user.preferences.maxPowerUsage,
  ]);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSharing) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSharing]);

  const handleStartSharing = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      pointsEarned: 0,
      status: 'active',
    };
    setCurrentSession(newSession);
    setIsSharing(true);
    setSessionTime(0);
  };

  const handlePauseSharing = () => {
    setIsSharing(false);
  };

  const handleStopSharing = () => {
    if (currentSession) {
      const pointsEarned = Math.floor(sessionTime * 0.1);
      const completedSession: Session = {
        ...currentSession,
        endTime: new Date(),
        duration: sessionTime,
        pointsEarned,
        status: 'completed',
      };

      setSessions((prev) => [completedSession, ...prev]);
      onUserUpdate({
        totalEarnings: user.totalEarnings + pointsEarned,
        totalSessions: user.totalSessions + 1,
        totalHours: user.totalHours + sessionTime / 3600,
      });
      setCurrentSession(null);
    }
    setIsSharing(false);
    setSessionTime(0);
  };

  const handleResumeSharing = () => {
    setIsSharing(true);
  };

  const totalDeposits = 225; // Mock data

  return (
    <div className="dashboard">
      <StatsOverview
        user={user}
        sessionTime={sessionTime}
        totalDeposits={totalDeposits}
        isSharing={isSharing}
      />

      <div className="dashboard-grid">
        <GPUStats
          stats={gpuStats}
          maxTemperature={user.preferences.maxTemperature}
          maxPowerUsage={user.preferences.maxPowerUsage}
        />

        <ControlPanel
          sessionTime={sessionTime}
          isSharing={isSharing}
          currentSession={currentSession}
          onStartSharing={handleStartSharing}
          onPauseSharing={handlePauseSharing}
          onStopSharing={handleStopSharing}
          onResumeSharing={handleResumeSharing}
        />
      </div>

      <SessionHistory
        sessions={sessions}
        currentSession={currentSession}
        sessionTime={sessionTime}
      />
    </div>
  );
};
