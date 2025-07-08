'use client';

import type React from 'react';
import type { Session } from '../../types';
import './ControlPanel.css';

interface ControlPanelProps {
  sessionTime: number;
  isSharing: boolean;
  currentSession: Session | null;
  onStartSharing: () => void;
  onPauseSharing: () => void;
  onStopSharing: () => void;
  onResumeSharing: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  sessionTime,
  isSharing,
  currentSession,
  onStartSharing,
  onPauseSharing,
  onStopSharing,
  onResumeSharing,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pointsEarning = Math.floor(sessionTime * 0.1);

  const renderButtons = () => {
    if (!currentSession) {
      return (
        <button className="btn btn-primary" onClick={onStartSharing}>
          <i className="fas fa-play"></i> Start Sharing
        </button>
      );
    }

    if (isSharing) {
      return (
        <>
          <button className="btn btn-secondary" onClick={onPauseSharing}>
            <i className="fas fa-pause"></i> Pause
          </button>
          <button className="btn btn-danger" onClick={onStopSharing}>
            <i className="fas fa-stop"></i> Stop & Save
          </button>
        </>
      );
    }

    return (
      <>
        <button className="btn btn-primary" onClick={onResumeSharing}>
          <i className="fas fa-play"></i> Resume
        </button>
        <button className="btn btn-danger" onClick={onStopSharing}>
          <i className="fas fa-stop"></i> Stop & Save
        </button>
      </>
    );
  };

  return (
    <div className="card control-panel-card">
      <div className="card-header">
        <h3>Resource Sharing Control</h3>
        <p>Manage your GPU resource sharing session</p>
      </div>
      <div className="card-content">
        <div className="session-timer">
          <div className="timer-display">{formatTime(sessionTime)}</div>
          {currentSession && (
            <div className="points-earning">
              Points earning: {pointsEarning} points
            </div>
          )}
        </div>

        <div className="control-buttons">{renderButtons()}</div>

        {isSharing && (
          <div className="training-status">
            <div className="status-indicator">
              <div className="pulse-dot"></div>
              <span>AI Model Training Active</span>
            </div>
            <p>Your GPU is contributing to distributed AI training</p>
          </div>
        )}
      </div>
    </div>
  );
};
