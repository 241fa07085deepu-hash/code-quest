import React, { useState, useEffect } from 'react';
import { User, Submission } from '../types';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  FileCode, 
  CheckCircle2, 
  XCircle, 
  Database, 
  RefreshCw, 
  RotateCcw, 
  Search, 
  Eye, 
  Edit3, 
  X,
  Server,
  Zap,
  Activity,
  Copy,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onRefreshUser: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onOpenAuth,
  onRefreshUser
}) => {
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'submissions' | 'raw_db'>('overview');
  const [inspectSubmission, setInspectSubmission] = useState<Submission | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [rawDbData, setRawDbData] = useState<any>(null);
  const [selectedRawCol, setSelectedRawCol] = useState<'users' | 'submissions' | 'stats' | 'dbStatus'>('users');
  const [copiedRaw, setCopiedRaw] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ov, us, subs, raw] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminSubmissions(),
        api.getRawDb().catch(() => null)
      ]);
      setOverview(ov);
      setUsers(us.users);
      setSubmissions(subs.submissions);
      setRawDbData(raw);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      await api.updateUser(user._id, { role: newRole });
      setActionMessage(`Updated ${user.name}'s role to ${newRole}`);
      setTimeout(() => setActionMessage(null), 3000);
      fetchAdminData();
      if (currentUser?._id === user._id) {
        onRefreshUser();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddXp = async (user: User, amount: number) => {
    try {
      const newXp = Math.max(0, user.xp + amount);
      const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);
      await api.updateUser(user._id, { xp: newXp, level: newLevel });
      setActionMessage(`Awarded ${amount} XP to ${user.name}`);
      setTimeout(() => setActionMessage(null), 3000);
      fetchAdminData();
      if (currentUser?._id === user._id) {
        onRefreshUser();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset MongoDB store to initial seed state? This will restore default users and sample submissions.')) {
      return;
    }
    try {
      await api.resetDatabase();
      setActionMessage('Database store reset successfully!');
      setTimeout(() => setActionMessage(null), 3000);
      fetchAdminData();
      onRefreshUser();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-100 tracking-tight">Admin & Professor Console</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold uppercase">
                  Root Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monitor student submissions, evaluate test pass rates, manage user roles, and inspect the MongoDB data layer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDb}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Database Seed</span>
            </button>
            <button
              onClick={fetchAdminData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto inline-flex text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & MongoDB Metrics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>User & Student Management</span>
          <span className="text-[10px] bg-slate-700 px-1.5 py-0.2 rounded-full font-mono">
            {users.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Live Submissions Log</span>
          <span className="text-[10px] bg-slate-700 px-1.5 py-0.2 rounded-full font-mono">
            {submissions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('raw_db')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'raw_db'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>MongoDB JSON Explorer</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>TOTAL STUDENTS</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-slate-100 font-mono">
                {overview.totalStudents}
              </div>
              <div className="text-[11px] text-slate-500">Active learners in MongoDB</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>TOTAL SUBMISSIONS</span>
                <FileCode className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-slate-100 font-mono">
                {overview.totalSubmissions}
              </div>
              <div className="text-[11px] text-slate-500">Code runs recorded</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>GLOBAL PASS RATE</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {overview.passRate}%
              </div>
              <div className="text-[11px] text-slate-500">{overview.passedSubmissions} passed successfully</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>DATABASE ENGINE</span>
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-indigo-300 font-mono pt-1">
                MongoDB Store
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active & Synced
              </div>
            </div>
          </div>

          {/* Database System Inspection Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                MongoDB Architecture & Database Connection Specs
              </h3>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                MongoDB Connected & Operational
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-slate-500">Database Engine & Driver:</div>
                <div className="text-emerald-400 font-bold">{overview.dbStatus?.driver || 'Official MongoDB Driver'}</div>
                <div className="text-slate-300 text-[11px] mt-1">Mode: <strong className="text-cyan-300">{overview.dbStatus?.mode || 'Active'}</strong></div>
                <div className="text-slate-400 text-[11px]">URI: {overview.dbStatus?.configuredUri || 'Standard'}</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-slate-500">MongoDB Collections:</div>
                <div className="text-slate-200 font-bold">• users ({overview.totalStudents + overview.totalAdmins} docs)</div>
                <div className="text-slate-200 font-bold">• submissions ({overview.totalSubmissions} docs)</div>
                <div className="text-slate-200 font-bold">• topics ({overview.totalTopics} stages)</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-slate-500">API Gateway & Sandbox:</div>
                <div className="text-cyan-300 font-bold">Express 4.21 REST Endpoints</div>
                <div className="text-slate-400">/api/auth/*, /api/quests/*</div>
                <div className="text-slate-400">Python 3.12 AST Sandbox</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER & STUDENT MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-slate-950/70 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>REGISTERED USERS & ROLES</span>
            <span>Total: {users.length}</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {users.map((u) => (
              <div key={u._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/30 transition">
                <div className="flex items-center gap-4">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{u.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {u.email} • ID: {u._id}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-3">
                      <span>Level {u.level}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">{u.xp} XP</span>
                      <span>•</span>
                      <span>{u.completedQuests.length}/10 Quests Cleared</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddXp(u, 100)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs flex items-center gap-1 transition"
                    title="Grant 100 bonus XP"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>+100 XP</span>
                  </button>

                  <button
                    onClick={() => handleRoleToggle(u)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
                  >
                    Switch to {u.role === 'admin' ? 'Student' : 'Admin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SUBMISSIONS LOG */}
      {activeTab === 'submissions' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-slate-950/70 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>LIVE CODE RUNS & SUBMISSIONS STREAM</span>
            <span>Total: {submissions.length}</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {submissions.map((sub) => (
              <div key={sub._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/30 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{sub.topicTitle}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold uppercase ${
                      sub.status === 'passed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {sub.status === 'passed' ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Student: <strong className="text-slate-300">{sub.userName}</strong> ({sub.userEmail}) • {new Date(sub.timestamp).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Test Assertions: {sub.passedCount} / {sub.totalCount} passed
                  </div>
                </div>

                <button
                  onClick={() => setInspectSubmission(sub)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Code</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MONGODB RAW DOCUMENT EXPLORER */}
      {activeTab === 'raw_db' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">
                  MongoDB Document Collections Viewer
                </h3>
              </div>

              {/* Collection selector */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedRawCol('users')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedRawCol === 'users' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  db.users ({users.length})
                </button>
                <button
                  onClick={() => setSelectedRawCol('submissions')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedRawCol === 'submissions' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  db.submissions ({submissions.length})
                </button>
                <button
                  onClick={() => setSelectedRawCol('stats')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedRawCol === 'stats' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  db.overview & stats
                </button>
                <button
                  onClick={() => setSelectedRawCol('dbStatus')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedRawCol === 'dbStatus' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  connection.status
                </button>
              </div>

              {/* Actions: Copy & Download Postman */}
              <div className="flex items-center gap-2">
                <a
                  href="/api/docs/postman-collection"
                  download="CodeQuest_API.postman_collection.json"
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-200 text-xs font-mono flex items-center gap-1.5 transition"
                  title="Download pre-configured Postman Collection (v2.1)"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span>Postman Collection</span>
                </a>

                <button
                  onClick={() => {
                    const content = selectedRawCol === 'users' ? users : selectedRawCol === 'submissions' ? submissions : selectedRawCol === 'stats' ? overview : rawDbData?.dbStatus;
                    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
                    setCopiedRaw(true);
                    setTimeout(() => setCopiedRaw(false), 2000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition"
                >
                  {copiedRaw ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRaw ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold">1. In App / UI:</span>
                <p className="text-slate-500 text-[11px]">Inspect real-time documents right in this viewer or in Users / Submissions tabs.</p>
              </div>
              <div className="space-y-1">
                <span className="text-cyan-400 font-bold">2. Via Browser / REST API:</span>
                <p className="text-slate-500 text-[11px]">Open <code className="text-cyan-300">/api/db/status</code> or <code className="text-cyan-300">/api/admin/raw-db</code> in your browser.</p>
              </div>
              <div className="space-y-1">
                <span className="text-emerald-400 font-bold">3. In Files / Atlas:</span>
                <p className="text-slate-500 text-[11px]">Local store file is at <code className="text-emerald-300">data/mongodb_store.json</code>. Set <code className="text-amber-300">MONGODB_URI</code> to connect Atlas!</p>
              </div>
            </div>

            {/* Formatted JSON Display */}
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 max-h-[500px] overflow-y-auto leading-relaxed select-text">
                <code>
                  {JSON.stringify(
                    selectedRawCol === 'users'
                      ? users
                      : selectedRawCol === 'submissions'
                      ? submissions
                      : selectedRawCol === 'stats'
                      ? overview
                      : rawDbData?.dbStatus || { status: 'Connected' },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Code Inspection Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h4 className="font-bold text-slate-100 text-sm">
                  {inspectSubmission.topicTitle}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono">
                  By {inspectSubmission.userName} ({inspectSubmission.userEmail})
                </div>
              </div>
              <button
                onClick={() => setInspectSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Student's Python Code:</label>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{inspectSubmission.code}</code>
                </pre>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Terminal Execution Trace:</label>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto whitespace-pre-wrap">
                  {inspectSubmission.output}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
