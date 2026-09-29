import { User, Topic, Submission, LeaderboardEntry } from '../types';

export const api = {
  // Auth
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register');
    }
    return res.json() as Promise<{ user: User; token: string }>;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to login');
    }
    return res.json() as Promise<{ user: User; token: string }>;
  },

  async getMe(token: string) {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json() as Promise<{ user: User }>;
  },

  // Topics
  async getTopics() {
    const res = await fetch('/api/topics');
    if (!res.ok) throw new Error('Failed to load topics');
    return res.json() as Promise<{ topics: Topic[] }>;
  },

  async getTopic(id: number) {
    const res = await fetch(`/api/topics/${id}`);
    if (!res.ok) throw new Error('Failed to load topic');
    return res.json() as Promise<{ topic: Topic }>;
  },

  // Run & Submit Quest
  async runQuest(questId: string, code: string) {
    const res = await fetch(`/api/quests/${questId}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    if (!res.ok) throw new Error('Execution failed');
    return res.json();
  },

  async submitQuest(questId: string, code: string, userId?: string) {
    const res = await fetch(`/api/quests/${questId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, userId })
    });
    if (!res.ok) throw new Error('Submission failed');
    return res.json();
  },

  // Leaderboard
  async getLeaderboard() {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json() as Promise<{ leaderboard: LeaderboardEntry[] }>;
  },

  // Student Dashboard
  async getStudentDashboard(userId: string) {
    const res = await fetch(`/api/student/dashboard/${userId}`);
    if (!res.ok) throw new Error('Failed to load student dashboard');
    return res.json();
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch('/api/admin/overview');
    if (!res.ok) throw new Error('Failed to load admin overview');
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to load users');
    return res.json() as Promise<{ users: User[] }>;
  },

  async updateUser(userId: string, data: Partial<User>) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json() as Promise<{ user: User }>;
  },

  async getAdminSubmissions() {
    const res = await fetch('/api/admin/submissions');
    if (!res.ok) throw new Error('Failed to load submissions');
    return res.json() as Promise<{ submissions: Submission[] }>;
  },

  async getDbStatus() {
    const res = await fetch('/api/db/status');
    if (!res.ok) throw new Error('Failed to load database status');
    return res.json();
  },

  async getRawDb() {
    const res = await fetch('/api/admin/raw-db');
    if (!res.ok) throw new Error('Failed to load raw MongoDB data');
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch('/api/admin/reset-db', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset DB');
    return res.json();
  }
};
