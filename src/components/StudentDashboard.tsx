import React, { useState, useEffect } from 'react';
import { User, Topic, Submission } from '../types';
import { api } from '../services/api';
import { 
  UserCheck, 
  Award, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Code2, 
  ShieldCheck, 
  Brain, 
  Crown,
  RefreshCw,
  X
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User | null;
  topics: Topic[];
  onSelectTopic: (topicId: number) => void;
  onOpenAuth: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  topics,
  onSelectTopic,
  onOpenAuth
}) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [inspectSubmission, setInspectSubmission] = useState<Submission | null>(null);

  const fetchDashboard = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getStudentDashboard(currentUser._id);
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [currentUser?._id, currentUser?.xp, currentUser?.completedQuests]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">Sign in to View Your Student Dashboard</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Track your Python DSA game progress, view completed quests, examine your execution history, and inspect earned badges.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const completedCount = currentUser.completedQuests.length;
  const progressPercent = Math.round((completedCount / topics.length) * 100);
  const xpCurrent = currentUser.xp;
  const xpForNextLevel = currentUser.level * 200;
  const levelProgress = Math.min(100, Math.round(((xpCurrent % 200) / 200) * 100));

  // Find next uncompleted topic
  const nextUncompleted = topics.find(t => !currentUser.completedQuests.includes(t.quest.id));

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      
      {/* Student Profile Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-cyan-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-100">{currentUser.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
              
              <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-4 h-4 fill-current" />
                  <strong>{currentUser.streakDays} Day Streak</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Zap className="w-4 h-4 fill-current" />
                  <strong>{currentUser.xp} Total XP</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress Circle */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 w-full sm:w-64 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Current Rank:</span>
              <strong className="text-emerald-400 text-sm">Level {currentUser.level}</strong>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 text-right font-mono">
              {xpCurrent % 200} / 200 XP to Level {currentUser.level + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Next Quest Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Quest Progress */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>CURRICULUM MASTERY</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono">
            {completedCount} <span className="text-slate-600 text-lg">/ {topics.length}</span>
          </div>
          <p className="text-xs text-slate-400">
            {completedCount === 10
              ? '🎉 Outstanding! You have cleared all 10 Python DSA mini-games!'
              : `${10 - completedCount} more mini-games remaining to achieve Questmaster status.`}
          </p>
        </div>

        {/* Metric 2: Next Recommended Quest */}
        <div className="md:col-span-2 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {nextUncompleted ? (
            <>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 font-bold">
                  Recommended Next Quest
                </span>
                <h4 className="text-lg font-bold text-slate-100">
                  Topic #{nextUncompleted.id}: {nextUncompleted.title}
                </h4>
                <p className="text-xs text-slate-400">
                  Game: <strong className="text-cyan-300">{nextUncompleted.quest.gameName}</strong> • {nextUncompleted.quest.conceptName}
                </p>
              </div>

              <button
                onClick={() => onSelectTopic(nextUncompleted.id)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition shadow-md shadow-cyan-500/20 whitespace-nowrap"
              >
                <span>Launch Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="py-2 text-center w-full">
              <span className="text-emerald-400 font-bold font-mono text-sm">
                🏆 All 10 Quests Completed! Replay any game to optimize your execution times.
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Badges & Achievements Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Achievements & Badges
            </h3>
            <p className="text-xs text-slate-400">Earn trophies as you clear Python DSA milestones</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            {completedCount >= 10 ? '4/4 Unlocked' : completedCount >= 7 ? '3/4 Unlocked' : completedCount >= 4 ? '2/4 Unlocked' : completedCount >= 1 ? '1/4 Unlocked' : '0/4 Unlocked'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "First Blood",
              desc: "Clear your very first Python game quest",
              unlocked: completedCount >= 1,
              icon: Zap,
              color: "text-amber-400"
            },
            {
              title: "Array Apprentice",
              desc: "Complete 4 linear data structure stages",
              unlocked: completedCount >= 4,
              icon: ShieldCheck,
              color: "text-cyan-400"
            },
            {
              title: "DSA Explorer",
              desc: "Master 7 algorithmic challenges",
              unlocked: completedCount >= 7,
              icon: Brain,
              color: "text-indigo-400"
            },
            {
              title: "Grand Questmaster",
              desc: "Conquer all 10 Python DSA game topics",
              unlocked: completedCount >= 10,
              icon: Crown,
              color: "text-emerald-400"
            }
          ].map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  b.unlocked
                    ? 'bg-slate-950/80 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/30 border-slate-800/80 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  b.unlocked ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-200 text-xs">{b.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-1">{b.desc}</p>
                </div>
                <div className="mt-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    b.unlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-slate-950/70 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Recent Code Submissions (MongoDB Log)
            </h4>
          </div>
          <button
            onClick={fetchDashboard}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {dashboardData?.recentSubmissions && dashboardData.recentSubmissions.length > 0 ? (
            dashboardData.recentSubmissions.map((sub: Submission) => (
              <div
                key={sub._id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 transition"
              >
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span>{sub.topicTitle}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold uppercase ${
                      sub.status === 'passed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {sub.status === 'passed' ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Submitted: {new Date(sub.timestamp).toLocaleString()} • Tests Passed: {sub.passedCount}/{sub.totalCount}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-amber-400 font-mono font-bold text-xs">
                    +{sub.xpEarned} XP
                  </span>
                  <button
                    onClick={() => setInspectSubmission(sub)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect Code</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 font-mono text-xs">
              No recent submissions recorded yet. Head into a quest and click "Submit Quest" to test your code!
            </div>
          )}
        </div>
      </div>

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
                  Recorded at {new Date(inspectSubmission.timestamp).toLocaleString()}
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
                <label className="text-xs font-mono text-slate-400 block mb-1">Submitted Python Code:</label>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{inspectSubmission.code}</code>
                </pre>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Execution Terminal Log:</label>
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
