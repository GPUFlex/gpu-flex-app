export interface User {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  joinDate?: Date;
  totalEarnings?: number;
  totalSessions?: number;
  totalHours?: number;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  preferences?: {
    notifications?: boolean;
    autoStart?: boolean;
    maxTemperature?: number;
    maxPowerUsage?: number;
  };
  stats?: {
    totalPointsEarned?: number;
    totalPointsSpent?: number;
    averageSessionLength?: number;
    longestSession?: number;
  };
}

export interface Node {
  id: string;
  gpuModel?: string;
  nodeUrl: string;
  totalMemoryMb: number;
  freeMemoryMb?: number;
  status: 'ONLINE' | 'OFFLINE' | 'UNKNOWN';
  lastHeartbeat?: string;
  ownerId: string;
}

export interface CreateNodeDto {
  gpuModel: string;
  nodeUrl: string;
  totalMemoryMb: number;
  ownerId: string;
}

export interface GPUStatsData {
  usage?: number;
  temperature?: number;
  memory?: number;
  power?: number;
}

export interface Session {
  id?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  pointsEarned?: number;
  status?: 'active' | 'completed';
}

export interface Deposit {
  id?: string;
  amount?: number;
  date?: Date;
  platform?: string;
  pointsRedeemed?: number;
}

export interface Reward {
  id?: number;
  name?: string;
  description?: string;
  cost?: number;
  category?: string;
  icon?: string;
  available?: boolean;
}

export interface Tier {
  name?: string;
  requirement?: number;
  multiplier?: string;
  color?: string;
  unlocked?: boolean;
}