import type React from 'react';
import type { Session } from '../../types';
import './SessionHistory.css';

interface SessionHistoryProps {
  sessions: Session[];
  currentSession: Session | null;
  sessionTime: number;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  currentSession,
  sessionTime,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime12Hour = (date: Date): string => {
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>
          <i className="fas fa-history"></i> Recent Sessions
        </h3>
        <p>Your latest GPU sharing sessions</p>
      </div>
      <div className="card-content">
        <div className="sessions-list">
          {currentSession && (
            <div className="session-item current-session">
              <div className="session-info">
                <span className="session-badge active">Current Session</span>
                <div className="session-details">
                  Started: {formatTime12Hour(currentSession.startTime)}
                  <br />
                  Duration: {formatTime(sessionTime)}
                </div>
              </div>
              <div className="session-earnings">
                <div className="session-points earning">
                  {Math.floor(sessionTime * 0.1)} pts
                </div>
                <div className="session-status">Earning</div>
              </div>
            </div>
          )}

          {sessions.length === 0 && !currentSession ? (
            <div className="empty-sessions">
              <p>No sessions yet. Start sharing to see your history!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <span className="session-badge completed">Completed</span>
                  <div className="session-details">
                    {formatDate(session.startTime)} at{' '}
                    {formatTime12Hour(session.startTime)}
                    <br />
                    Duration: {formatTime(session.duration)}
                  </div>
                </div>
                <div className="session-earnings">
                  <div className="session-points earned">
                    +{session.pointsEarned} pts
                  </div>
                  <div className="session-status">Earned</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
