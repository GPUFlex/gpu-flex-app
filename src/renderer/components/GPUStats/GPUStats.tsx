import type React from 'react';
import type { GPUStatsData } from '../../types';
import './GPUStats.css';

interface GPUStatsProps {
  stats: GPUStatsData;
  maxTemperature: number;
  maxPowerUsage: number;
}

export const GPUStats: React.FC<GPUStatsProps> = ({
  stats,
  maxTemperature,
  maxPowerUsage,
}) => {
  const gpuMetrics = [
    {
      label: 'GPU Usage',
      value: `${stats.usage.toFixed(1)}%`,
      progress: stats.usage,
      icon: null,
    },
    {
      label: 'Temperature',
      value: `${stats.temperature.toFixed(1)}°C`,
      progress: (stats.temperature / maxTemperature) * 100,
      icon: 'fas fa-thermometer-half',
    },
    {
      label: 'Memory',
      value: `${stats.memory.toFixed(1)}%`,
      progress: stats.memory,
      icon: 'fas fa-memory',
    },
    {
      label: 'Power',
      value: `${stats.power.toFixed(0)}W`,
      progress: (stats.power / maxPowerUsage) * 100,
      icon: 'fas fa-bolt',
    },
  ];

  return (
    <div className="card gpu-stats-card">
      <div className="card-header">
        <h3>
          <i className="fas fa-microchip"></i> GPU Statistics
        </h3>
        <p>Real-time hardware monitoring</p>
      </div>
      <div className="card-content">
        {gpuMetrics.map((metric, index) => (
          <div key={index} className="gpu-stat">
            <div className="gpu-stat-header">
              <span>
                {metric.icon && <i className={metric.icon}></i>}
                {metric.label}
              </span>
              <span>{metric.value}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(metric.progress, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
