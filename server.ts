import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db';
import { TOPICS_DATA } from './src/data/topics';
import { executePythonQuest } from './src/services/pythonRunner';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes

// 1. Health check & DB Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: db.getStatus().mode,
    dbStatus: db.getStatus(),
    engine: 'Python DSA Quest Core v3.12',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db/status', (req, res) => {
  res.json(db.getStatus());
});

// 2. Authentication: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
  const newUser = db.users.insertOne({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: password,
    role: role === 'admin' ? 'admin' : 'student',
    avatar,
    xp: role === 'admin' ? 2000 : 100,
    level: 1,
    streakDays: 1,
    completedQuests: []
  });

  const { passwordHash: _, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe, token: `token_${newUser._id}` });
});

// 3. Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.findOne({ email: email.toLowerCase().trim() });
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { passwordHash: _, ...userSafe } = user;
  res.json({ user: userSafe, token: `token_${user._id}` });
});

// 4. Current User Session
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const userId = authHeader.replace('Bearer ', '').replace('token_', '');
  const user = db.users.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: 'User session expired or not found' });
  }

  const { passwordHash: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

// 5. Topics list & detail
app.get('/api/topics', (req, res) => {
  res.json({ topics: TOPICS_DATA });
});

app.get('/api/topics/:id', (req, res) => {
  const topicId = Number(req.params.id);
  const topic = TOPICS_DATA.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json({ topic });
});

// 6. Code Execution & Testing
app.post('/api/quests/:id/run', (req, res) => {
  const questId = req.params.id;
  const { code } = req.body;
  const topic = TOPICS_DATA.find(t => t.quest.id === questId);
  if (!topic) {
    return res.status(404).json({ error: 'Quest not found' });
  }

  const runResult = executePythonQuest(questId, code || '', topic.quest.testCases);
  res.json(runResult);
});

// 7. Quest Submission & Scoring
app.post('/api/quests/:id/submit', (req, res) => {
  const questId = req.params.id;
  const { code, userId } = req.body;

  const topic = TOPICS_DATA.find(t => t.quest.id === questId);
  if (!topic) {
    return res.status(404).json({ error: 'Quest not found' });
  }

  const runResult = executePythonQuest(questId, code || '', topic.quest.testCases);
  const user = userId ? db.users.findOne({ _id: userId }) : null;

  let xpEarned = 0;
  if (runResult.success) {
    xpEarned = topic.quest.difficulty === 'Beginner' ? 100 : topic.quest.difficulty === 'Intermediate' ? 150 : 250;
  }

  const submission = db.submissions.insertOne({
    userId: user ? user._id : 'guest',
    userName: user ? user.name : 'Guest Cadet',
    userEmail: user ? user.email : 'guest@codequest.dev',
    questId,
    topicTitle: topic.title,
    code,
    status: runResult.success ? 'passed' : 'failed',
    output: runResult.terminalOutput.slice(0, 500),
    passedCount: runResult.passedCount,
    totalCount: runResult.totalCount,
    xpEarned
  });

  // Award XP and complete quest for user if passed
  if (user && runResult.success) {
    const isFirstTime = !user.completedQuests.includes(questId);
    const newCompleted = isFirstTime ? [...user.completedQuests, questId] : user.completedQuests;
    const addedXp = isFirstTime ? xpEarned : Math.floor(xpEarned * 0.25);
    const newXp = user.xp + addedXp;
    const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);

    db.users.updateOne(
      { _id: user._id },
      {
        xp: newXp,
        level: newLevel,
        completedQuests: newCompleted,
        streakDays: Math.min(30, user.streakDays + (isFirstTime ? 1 : 0))
      }
    );
  }

  res.json({
    runResult,
    submission,
    xpEarned,
    isCompleted: runResult.success
  });
});

// 8. Leaderboard API
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = db.getLeaderboard();
  res.json({ leaderboard });
});

// 9. Student Dashboard Data
app.get('/api/student/dashboard/:userId', (req, res) => {
  const user = db.users.findOne({ _id: req.params.userId });
  if (!user) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const submissions = db.submissions.find({ userId: user._id });
  const totalTopics = TOPICS_DATA.length;
  const completedCount = user.completedQuests.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  const { passwordHash: _, ...safeUser } = user;
  res.json({
    user: safeUser,
    completedCount,
    totalTopics,
    progressPercent,
    recentSubmissions: submissions.slice(0, 5),
    badges: [
      { id: 'first_blood', name: 'First Quest Cleared', unlocked: completedCount >= 1, icon: 'Zap' },
      { id: 'apprentice', name: 'Array Apprentice', unlocked: completedCount >= 4, icon: 'ShieldCheck' },
      { id: 'algorithm_master', name: 'DSA Explorer', unlocked: completedCount >= 7, icon: 'Brain' },
      { id: 'quest_god', name: 'Grand Questmaster', unlocked: completedCount === 10, icon: 'Crown' }
    ]
  });
});

// 10. Admin Dashboard Data & Endpoints
app.get('/api/admin/overview', (req, res) => {
  const overview = db.getOverview();
  res.json(overview);
});

app.get('/api/admin/users', (req, res) => {
  const users = db.users.find().map(({ passwordHash: _, ...u }) => u);
  res.json({ users });
});

app.patch('/api/admin/users/:id', (req, res) => {
  const { role, xp, level } = req.body;
  const updated = db.users.updateOne({ _id: req.params.id }, { role, xp, level });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safe } = updated;
  res.json({ user: safe });
});

app.get('/api/admin/submissions', (req, res) => {
  const submissions = db.submissions.find();
  res.json({ submissions });
});

app.get('/api/admin/raw-db', (req, res) => {
  const users = db.users.find().map(({ passwordHash: _, ...u }) => u);
  const submissions = db.submissions.find();
  const dbStatus = db.getStatus();
  res.json({
    dbStatus,
    collections: {
      users,
      submissions,
      stats: db.getOverview()
    }
  });
});

app.post('/api/admin/reset-db', (req, res) => {
  db.resetToDefaults();
  res.json({ message: 'MongoDB data store reset to default seed state' });
});

// 11. Postman Collection Export Endpoint
app.get('/api/docs/postman-collection', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const postmanCollection = {
    info: {
      name: "Python DSA Quest - MongoDB Full-Stack API",
      _postman_id: "codequest-dsa-api-collection-v1",
      description: "Complete API collection for Python DSA Code Quest with MongoDB persistence, Auth, Code Execution, and Leaderboards.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
      {
        key: "baseUrl",
        value: baseUrl,
        type: "string"
      },
      {
        key: "authToken",
        value: "token_user_student_001",
        type: "string"
      }
    ],
    item: [
      {
        name: "System & Health",
        item: [
          {
            name: "1. Health Check",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/health",
                host: ["{{baseUrl}}"],
                path: ["api", "health"]
              }
            }
          },
          {
            name: "2. Database & MongoDB Status",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/db/status",
                host: ["{{baseUrl}}"],
                path: ["api", "db", "status"]
              }
            }
          }
        ]
      },
      {
        name: "Authentication",
        item: [
          {
            name: "1. Register New Student",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  name: "Grace Hopper",
                  email: "grace@codequest.dev",
                  password: "securepassword123",
                  role: "student"
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/auth/register",
                host: ["{{baseUrl}}"],
                path: ["api", "auth", "register"]
              }
            }
          },
          {
            name: "2. Login User",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  email: "student@codequest.dev",
                  password: "student123"
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/auth/login",
                host: ["{{baseUrl}}"],
                path: ["api", "auth", "login"]
              }
            }
          },
          {
            name: "3. Get Current User (Me)",
            request: {
              method: "GET",
              header: [
                { key: "Authorization", value: "Bearer {{authToken}}" }
              ],
              url: {
                raw: "{{baseUrl}}/api/auth/me",
                host: ["{{baseUrl}}"],
                path: ["api", "auth", "me"]
              }
            }
          }
        ]
      },
      {
        name: "Topics & Quests",
        item: [
          {
            name: "1. List All Topics",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/topics",
                host: ["{{baseUrl}}"],
                path: ["api", "topics"]
              }
            }
          },
          {
            name: "2. Get Single Topic by ID",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/topics/1",
                host: ["{{baseUrl}}"],
                path: ["api", "topics", "1"]
              }
            }
          },
          {
            name: "3. Run Quest Python Code (Dry Run)",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  code: "def charge_core(ruby: int, emerald: int, sapphire: int, multiplier: int) -> str:\n    raw = ruby + emerald + sapphire\n    amplified = raw * multiplier\n    return f\"CORE: {amplified} GW\""
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/quests/quest-1/run",
                host: ["{{baseUrl}}"],
                path: ["api", "quests", "quest-1", "run"]
              }
            }
          },
          {
            name: "4. Submit Quest Python Code (Grades & Awards XP)",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  userId: "user_student_001",
                  code: "def charge_core(ruby: int, emerald: int, sapphire: int, multiplier: int) -> str:\n    raw = ruby + emerald + sapphire\n    amplified = raw * multiplier\n    return f\"CORE: {amplified} GW\""
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/quests/quest-1/submit",
                host: ["{{baseUrl}}"],
                path: ["api", "quests", "quest-1", "submit"]
              }
            }
          }
        ]
      },
      {
        name: "Leaderboard & Student",
        item: [
          {
            name: "1. Global Leaderboard",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/leaderboard",
                host: ["{{baseUrl}}"],
                path: ["api", "leaderboard"]
              }
            }
          },
          {
            name: "2. Student Dashboard Stats",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/student/dashboard/user_student_001",
                host: ["{{baseUrl}}"],
                path: ["api", "student", "dashboard", "user_student_001"]
              }
            }
          }
        ]
      },
      {
        name: "Admin & MongoDB Management",
        item: [
          {
            name: "1. Admin Overview",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/admin/overview",
                host: ["{{baseUrl}}"],
                path: ["api", "admin", "overview"]
              }
            }
          },
          {
            name: "2. Admin Users Collection",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/admin/users",
                host: ["{{baseUrl}}"],
                path: ["api", "admin", "users"]
              }
            }
          },
          {
            name: "3. Admin Submissions Collection",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/admin/submissions",
                host: ["{{baseUrl}}"],
                path: ["api", "admin", "submissions"]
              }
            }
          },
          {
            name: "4. Raw MongoDB JSON Dump",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/admin/raw-db",
                host: ["{{baseUrl}}"],
                path: ["api", "admin", "raw-db"]
              }
            }
          },
          {
            name: "5. Reset DB to Defaults",
            request: {
              method: "POST",
              header: [],
              url: {
                raw: "{{baseUrl}}/api/admin/reset-db",
                host: ["{{baseUrl}}"],
                path: ["api", "admin", "reset-db"]
              }
            }
          }
        ]
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="CodeQuest_API.postman_collection.json"');
  res.json(postmanCollection);
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Code Quest Fullstack Engine] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
