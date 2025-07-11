'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

import type { User, GPUStatsData, Session, CreateNodeDto } from '../../types';
import './Dashboard.css';
import { ControlPanel } from '../../components/ControlPanel/ControlPanel';
import { SessionHistory } from '../../components/SessionHistory/SessionHistory';
import { GPUStats } from '../../components/GPUStats/GPUStats';
import { StatsOverview } from '../../components/StatsOverview/StatsOverview';
import { NodeRegistrationForm } from '../../components/NodeRegistrationForm/NodeRegistrationForm';

interface DashboardProps {
  user: User | null; // Allow user to be null
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

  const [node, setNode] = useState<Node | null>(null);
  const [isLoadingNode, setIsLoadingNode] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Default values for preferences to avoid undefined errors
  const defaultMaxTemperature = 80; // Reasonable default
  const defaultMaxPowerUsage = 300; // Reasonable default

  // Fetch user's node on mount
  useEffect(() => {
    const fetchNode = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("parsedUser = ", parsedUser);
        const ownerId = parsedUser.id;
        try {
          const response = await fetch(`http://localhost:8000/api/nodes/owner/${ownerId}`, {method: 'GET'});
          if (response.ok) {
            const data = await response.json();
            setNode(data);
          } else {
            setNode(null);
          }
        } catch (error) {
          console.error('Failed to fetch node:', error);
          setNode(null);
        } finally {
          setIsLoadingNode(false);
        }
      } else {
        setIsLoadingNode(false);
      }
    };
    fetchNode();
  }, []);

  console.log(node);

  // Register a new node
  const handleRegisterNode = async (nodeData: CreateNodeDto) => {
    try {
      const response = await fetch('http://localhost:8000/api/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
      });
      if (response.ok) {
        const newNode = await response.json();
        setNode(newNode);
        setShowRegistrationForm(false);
      } else {
        console.error('Failed to register node');
      }
    } catch (error) {
      console.error('Error registering node:', error);
    }
  };

  // Simulate GPU stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGpuStats((prev) => ({
        usage: isSharing
          ? Math.min(95, (prev.usage ?? 0) + Math.random() * 10 - 5)
          : Math.max(0, (prev.usage ?? 0) - 2),
        temperature: isSharing
          ? Math.min(
              user?.preferences?.maxTemperature ?? defaultMaxTemperature,
              (prev.temperature ?? 45) + Math.random() * 4 - 2,
            )
          : Math.max(45, (prev.temperature ?? 45) - 1),
        memory: isSharing
          ? Math.min(90, (prev.memory ?? 20) + Math.random() * 8 - 4)
          : Math.max(20, (prev.memory ?? 20) - 1),
        power: isSharing
          ? Math.min(
              user?.preferences?.maxPowerUsage ?? defaultMaxPowerUsage,
              (prev.power ?? 150) + Math.random() * 20 - 10,
            )
          : Math.max(150, (prev.power ?? 150) - 5),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSharing, user?.preferences?.maxTemperature, user?.preferences?.maxPowerUsage]);

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
        totalEarnings: (user?.totalEarnings ?? 0) + pointsEarned,
        totalSessions: (user?.totalSessions ?? 0) + 1,
        totalHours: (user?.totalHours ?? 0) + sessionTime / 3600,
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

  if (isLoadingNode) {
    return <div>Loading...</div>;
  }

  if (!node) {
    if (showRegistrationForm) {
      const storedUser = localStorage.getItem('user');
      const ownerId = storedUser ? JSON.parse(storedUser).id : '';
      return (
        
        <NodeRegistrationForm
          onSubmit={handleRegisterNode}
          ownerId={ownerId}
        />
      );
      
    } else {
      return (
        <div className="dashboard">
          <div className="dashboard-grid">
            <StatsOverview
            user={user ?? {}} // Pass empty object if user is null
            sessionTime={sessionTime}
            totalDeposits={totalDeposits}
            isSharing={isSharing}
            />
            <div>
              <p>No GPU node registered.</p>
              <button onClick={() => setShowRegistrationForm(true)}>Register GPU</button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="dashboard">
      <StatsOverview
        user={user ?? {}} // Pass empty object if user is null
        sessionTime={sessionTime}
        totalDeposits={totalDeposits}
        isSharing={isSharing}
      />

      <div className="dashboard-grid">
        <GPUStats
          stats={gpuStats}
          maxTemperature={user?.preferences?.maxTemperature ?? defaultMaxTemperature}
          maxPowerUsage={user?.preferences?.maxPowerUsage ?? defaultMaxPowerUsage}
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