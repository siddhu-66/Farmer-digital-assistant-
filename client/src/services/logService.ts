import { apiClient } from '../lib/apiClient';

export interface SystemLog {
  id: number;
  time: string;
  level: string;
  msg: string;
  color: string;
}

const FALLBACK_LOGS: SystemLog[] = [
  { id: 1, msg: 'System Boot', level: 'SUCCESS', color: 'text-green-400', time: '10:00:01' },
  { id: 2, msg: 'Database Connected', level: 'SUCCESS', color: 'text-green-400', time: '10:00:05' },
  { id: 3, msg: 'New Verification: Rajesh Kumar', level: 'INFO', color: 'text-blue-400', time: '10:05:22' },
  { id: 4, msg: 'Document Rejected: Land Records', level: 'ERROR', color: 'text-red-400', time: '10:12:45' },
];

const LOG_POOL = [
  { msg: 'New customer registration from Punjab region', level: 'INFO', color: 'text-blue-400' },
  { msg: 'Database connection optimized - Latency: 12ms', level: 'SUCCESS', color: 'text-green-400' },
  { msg: 'Unauthorized API access blocked from segment 102.x', level: 'WARN', color: 'text-orange-400' },
  { msg: 'Salesman contract #CX-992 published successfully', level: 'INFO', color: 'text-blue-400' },
  { msg: 'Weather API quota at 85% - Scaling request sent', level: 'WARN', color: 'text-orange-400' },
  { msg: 'AI model re-training completed for yield prediction', level: 'SUCCESS', color: 'text-green-400' },
  { msg: 'Cache invalidated for Market Prices (Hapur Mandi)', level: 'INFO', color: 'text-gray-500' },
  { msg: 'Document "Aadhar Card" verified for Rajesh Kumar', level: 'SUCCESS', color: 'text-green-400' },
  { msg: 'Kiran Devi uploaded "Land Records" for verification', level: 'INFO', color: 'text-blue-400' },
  { msg: 'Wait: 4 pending verifications in queue', level: 'WARN', color: 'text-orange-400' },
];

export const logService = {
  /** Fetches initial system logs from backend, falls back to demo data */
  getInitialLogs: async (): Promise<SystemLog[]> => {
    const response = await apiClient.get<{ success: boolean; data: SystemLog[] } | { success: false }>('/admin/logs');
    return (response && 'data' in response && Array.isArray(response.data) && response.data.length > 0) 
      ? response.data 
      : FALLBACK_LOGS;
  },

  /**
   * Generates a new random log (simulated locally).
   * Eventually will be replaced by a WebSocket or SSE connection.
   */
  getNextLog: (): SystemLog => {
    const randomLog = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    return { ...randomLog, id: Date.now(), time: timeStr };
  },
};
