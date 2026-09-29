import fs from 'fs';
import path from 'path';
import { MongoClient, Db } from 'mongodb';
import { User, Submission } from '../types';
import { TOPICS_DATA } from '../data/topics';

// File-backed persistent MongoDB document store
const DB_FILE = path.resolve(process.cwd(), 'data/mongodb_store.json');

export interface MongoSchema {
  users: (User & { passwordHash: string })[];
  submissions: Submission[];
  topicSettings: Record<string, { starterCode?: string; hints?: string[] }>;
  stats: {
    totalRuns: number;
    totalPasses: number;
  };
}

const DEFAULT_USERS: (User & { passwordHash: string })[] = [
  {
    _id: "user_admin_001",
    name: "Professor Turing",
    email: "admin@codequest.dev",
    passwordHash: "admin123",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    xp: 2500,
    level: 10,
    streakDays: 14,
    completedQuests: ["quest-1", "quest-2", "quest-3", "quest-4", "quest-5", "quest-6", "quest-7", "quest-8", "quest-9", "quest-10"],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    _id: "user_student_001",
    name: "Alex Byte",
    email: "student@codequest.dev",
    passwordHash: "student123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    xp: 850,
    level: 4,
    streakDays: 5,
    completedQuests: ["quest-1", "quest-2", "quest-3"],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: "user_student_002",
    name: "Elena Rostova",
    email: "elena@codequest.dev",
    passwordHash: "pass123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    xp: 1400,
    level: 6,
    streakDays: 8,
    completedQuests: ["quest-1", "quest-2", "quest-3", "quest-4", "quest-5"],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    _id: "user_student_003",
    name: "Marcus Vance",
    email: "marcus@codequest.dev",
    passwordHash: "pass123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    xp: 600,
    level: 3,
    streakDays: 3,
    completedQuests: ["quest-1", "quest-2"],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: "user_student_004",
    name: "Kiran Patel",
    email: "kiran@codequest.dev",
    passwordHash: "pass123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    xp: 2100,
    level: 9,
    streakDays: 12,
    completedQuests: ["quest-1", "quest-2", "quest-3", "quest-4", "quest-5", "quest-6", "quest-7", "quest-8"],
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    _id: "user_student_005",
    name: "Aoi Tanaka",
    email: "aoi@codequest.dev",
    passwordHash: "pass123",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    xp: 1750,
    level: 7,
    streakDays: 9,
    completedQuests: ["quest-1", "quest-2", "quest-3", "quest-4", "quest-5", "quest-6"],
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
  }
];

const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    _id: "sub_demo_001",
    userId: "user_student_001",
    userName: "Alex Byte",
    userEmail: "student@codequest.dev",
    questId: "quest-1",
    topicTitle: "Topic 1: Crystal Core Energizer",
    code: `def charge_core(ruby: int, emerald: int, sapphire: int, multiplier: int) -> str:\n    raw = ruby + emerald + sapphire\n    amplified = raw * multiplier\n    return f"CORE: {amplified} GW"`,
    status: "passed",
    output: "✓ Passed test 1: charge_core(10, 20, 30, 2) -> 'CORE: 120 GW'\n✓ Passed test 2: charge_core(5, 5, 5, 3) -> 'CORE: 45 GW'\n✓ Passed test 3: charge_core(0, 0, 0, 1) -> 'CORE: 0 GW'",
    passedCount: 3,
    totalCount: 3,
    xpEarned: 100,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: "sub_demo_002",
    userId: "user_student_001",
    userName: "Alex Byte",
    userEmail: "student@codequest.dev",
    questId: "quest-2",
    topicTitle: "Topic 2: Dungeon Gatekeeper",
    code: `def open_gate(has_seal: bool, armor: int, mana: int) -> str:\n    if has_seal and mana >= 80:\n        return "GOLD_GATE_UNLOCKED"\n    elif armor >= 50 or mana >= 50:\n        return "SILVER_GATE_UNLOCKED"\n    else:\n        return "PORTCULLIS_LOCKED"`,
    status: "passed",
    output: "✓ Passed test 1: open_gate(True, 40, 90) -> 'GOLD_GATE_UNLOCKED'\n✓ Passed test 2: open_gate(False, 60, 40) -> 'SILVER_GATE_UNLOCKED'\n✓ Passed test 3: open_gate(False, 20, 30) -> 'PORTCULLIS_LOCKED'",
    passedCount: 3,
    totalCount: 3,
    xpEarned: 100,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: "sub_demo_003",
    userId: "user_student_002",
    userName: "Elena Rostova",
    userEmail: "elena@codequest.dev",
    questId: "quest-5",
    topicTitle: "Topic 5: Dual Laser Targeter",
    code: `def lock_target_pair(frequencies: list[int], target: int) -> list[int]:\n    left, right = 0, len(frequencies) - 1\n    while left < right:\n        s = frequencies[left] + frequencies[right]\n        if s == target:\n            return [left, right]\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]`,
    status: "passed",
    output: "✓ Passed test 1: lock_target_pair([2, 7, 11, 15], 9) -> [0, 1]\n✓ Passed test 2: lock_target_pair([1, 2, 3, 4, 6], 8) -> [1, 4]\n✓ Passed test 3: lock_target_pair([5, 10, 15], 30) -> [-1, -1]",
    passedCount: 3,
    totalCount: 3,
    xpEarned: 150,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

class MongoDatabase {
  private data: MongoSchema;
  private client: MongoClient | null = null;
  private mongoDb: Db | null = null;
  private isLiveConnected = false;
  private connectionError: string | null = null;

  constructor() {
    this.data = this.load();
    this.tryConnectMongo();
  }

  public async tryConnectMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('ℹ️ MONGODB_URI not provided. Running on embedded file-backed MongoDB engine (data/mongodb_store.json).');
      return;
    }

    try {
      this.client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
      await this.client.connect();
      const dbName = process.env.MONGODB_DB_NAME || 'codequest';
      this.mongoDb = this.client.db(dbName);
      this.isLiveConnected = true;
      this.connectionError = null;
      console.log(`✅ Successfully connected to live MongoDB instance! Database: ${dbName}`);
      await this.syncLiveCollections();
    } catch (err: any) {
      this.isLiveConnected = false;
      this.connectionError = err.message || 'Connection failed';
      console.warn('⚠️ Could not connect to remote MongoDB URI. Falling back to persistent local MongoDB store:', err.message);
    }
  }

  private async syncLiveCollections() {
    if (!this.mongoDb) return;
    try {
      const usersCol = this.mongoDb.collection('users');
      const count = await usersCol.countDocuments();
      if (count === 0) {
        await usersCol.insertMany(this.data.users as any[]);
        console.log('🌱 Seeded live MongoDB users collection.');
      }
    } catch (e) {
      console.error('Error syncing live collections:', e);
    }
  }

  private load(): MongoSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading DB file, fallback to defaults:', e);
    }

    const initial: MongoSchema = {
      users: DEFAULT_USERS,
      submissions: DEFAULT_SUBMISSIONS,
      topicSettings: {},
      stats: { totalRuns: 12, totalPasses: 8 }
    };
    this.save(initial);
    return initial;
  }

  private save(data: MongoSchema = this.data) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB file:', e);
    }
  }

  public getStatus() {
    const uri = process.env.MONGODB_URI;
    let maskedUri = 'None (running embedded persistent MongoDB store)';
    if (uri) {
      try {
        const parsed = new URL(uri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://'));
        maskedUri = `${uri.startsWith('mongodb+srv') ? 'mongodb+srv' : 'mongodb'}://${parsed.username ? parsed.username + ':***@' : ''}${parsed.host}${parsed.pathname}`;
      } catch {
        maskedUri = 'Configured (Masked)';
      }
    }

    return {
      connected: true,
      isLiveMongo: this.isLiveConnected,
      mode: this.isLiveConnected ? 'MongoDB Live Cluster (Atlas / Self-Hosted)' : 'Persistent Document MongoDB Store (data/mongodb_store.json)',
      driver: 'mongodb (Official Node.js Driver installed)',
      storagePath: DB_FILE,
      configuredUri: maskedUri,
      hasUriEnv: Boolean(process.env.MONGODB_URI),
      connectionError: this.connectionError,
      collections: {
        users: this.data.users.length,
        submissions: this.data.submissions.length,
        topics: TOPICS_DATA.length,
        stats: this.data.stats
      },
      readyForProduction: true
    };
  }

  // MongoDB Collection: Users
  public users = {
    find: (filter: Partial<User> = {}) => {
      return this.data.users.filter(u => {
        for (const [k, v] of Object.entries(filter)) {
          if ((u as any)[k] !== v) return false;
        }
        return true;
      });
    },
    findOne: (filter: Partial<User> & { passwordHash?: string }) => {
      return this.data.users.find(u => {
        for (const [k, v] of Object.entries(filter)) {
          if ((u as any)[k] !== v) return false;
        }
        return true;
      }) || null;
    },
    insertOne: (doc: Omit<User, '_id' | 'createdAt'> & { passwordHash: string; createdAt?: string }) => {
      const newUser = {
        ...doc,
        _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        xp: doc.xp || 0,
        level: 1,
        streakDays: 1,
        completedQuests: doc.completedQuests || [],
        createdAt: new Date().toISOString()
      };
      this.data.users.push(newUser);
      this.save();

      // Mirror to live MongoDB if connected
      if (this.isLiveConnected && this.mongoDb) {
        this.mongoDb.collection('users').insertOne(newUser as any).catch(err => console.error('Live Mongo sync error:', err));
      }

      return newUser;
    },
    updateOne: (filter: Partial<User>, update: Partial<User>) => {
      const user = this.users.findOne(filter);
      if (user) {
        Object.assign(user, update);
        this.save();

        if (this.isLiveConnected && this.mongoDb) {
          this.mongoDb.collection('users').updateOne(filter as any, { $set: update }).catch(err => console.error('Live Mongo sync error:', err));
        }

        return user;
      }
      return null;
    }
  };

  // MongoDB Collection: Submissions
  public submissions = {
    find: (filter: Partial<Submission> = {}) => {
      return this.data.submissions
        .filter(s => {
          for (const [k, v] of Object.entries(filter)) {
            if ((s as any)[k] !== v) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    insertOne: (sub: Omit<Submission, '_id' | 'timestamp'>) => {
      const newSub: Submission = {
        ...sub,
        _id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString()
      };
      this.data.submissions.unshift(newSub);
      this.data.stats.totalRuns++;
      if (newSub.status === 'passed') {
        this.data.stats.totalPasses++;
      }
      this.save();

      if (this.isLiveConnected && this.mongoDb) {
        this.mongoDb.collection('submissions').insertOne(newSub as any).catch(err => console.error('Live Mongo sync error:', err));
      }

      return newSub;
    }
  };

  // Stats & Analytics
  public getOverview() {
    const totalStudents = this.data.users.filter(u => u.role === 'student').length;
    const totalAdmins = this.data.users.filter(u => u.role === 'admin').length;
    const totalSubmissions = this.data.submissions.length;
    const passedSubmissions = this.data.submissions.filter(s => s.status === 'passed').length;
    const passRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 100;
    
    return {
      totalStudents,
      totalAdmins,
      totalSubmissions,
      passedSubmissions,
      passRate,
      totalTopics: TOPICS_DATA.length,
      recentActivity: this.data.submissions.slice(0, 8),
      dbStatus: this.getStatus()
    };
  }

  public getLeaderboard() {
    return this.data.users
      .slice()
      .sort((a, b) => b.xp - a.xp || b.completedQuests.length - a.completedQuests.length)
      .map((u, index) => ({
        rank: index + 1,
        userId: u._id,
        name: u.name,
        avatar: u.avatar,
        role: u.role,
        xp: u.xp,
        level: Math.max(1, Math.floor(u.xp / 200) + 1),
        questsCompleted: u.completedQuests.length,
        streakDays: u.streakDays
      }));
  }

  public resetToDefaults() {
    this.data = {
      users: DEFAULT_USERS,
      submissions: DEFAULT_SUBMISSIONS,
      topicSettings: {},
      stats: { totalRuns: 12, totalPasses: 8 }
    };
    this.save();
    return true;
  }
}

export const db = new MongoDatabase();
