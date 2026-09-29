import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, User } from '../types';
import { api } from '../services/api';
import { Trophy, Medal, Crown, Flame, Zap, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User | null;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const res = await api.getLeaderboard();
      setEntries(res.leaderboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Real-time Quest Standings
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          Hall of Questmasters
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Students climb the ranks by completing Python & DSA game quests, maintaining coding streaks, and writing optimal solutions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-cyan-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="font-mono text-xs">Querying leaderboard from MongoDB...</span>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
              {/* Rank 2 (Silver) */}
              <div className="order-2 md:order-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center space-y-3 relative shadow-xl">
                <div className="w-10 h-10 rounded-full bg-slate-700 text-slate-200 font-bold flex items-center justify-center mx-auto absolute -top-5 left-1/2 -translate-x-1/2 shadow-lg border-2 border-slate-600">
                  #2
                </div>
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-16 h-16 rounded-2xl mx-auto bg-slate-800 border-2 border-slate-600 mt-2"
                />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{topThree[1].name}</h4>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase">{topThree[1].role}</span>
                </div>
                <div className="flex justify-center gap-3 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current" /> {topThree[1].xp} XP
                  </span>
                  <span>•</span>
                  <span>{topThree[1].questsCompleted}/10 Quests</span>
                </div>
              </div>

              {/* Rank 1 (Gold - Elevated) */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-8 text-center space-y-3 relative shadow-2xl scale-105 z-10">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center mx-auto absolute -top-6 left-1/2 -translate-x-1/2 shadow-xl border-2 border-amber-300">
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="w-20 h-20 rounded-2xl mx-auto bg-slate-800 border-2 border-amber-400 mt-2 shadow-lg shadow-amber-500/20"
                />
                <div>
                  <h4 className="font-extrabold text-slate-100 text-base">{topThree[0].name}</h4>
                  <span className="text-xs font-mono text-amber-400 uppercase font-bold">GRAND CHAMPION</span>
                </div>
                <div className="flex justify-center gap-4 text-xs font-mono text-slate-200 pt-3 border-t border-slate-800">
                  <span className="text-amber-300 font-extrabold flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-current text-amber-400" /> {topThree[0].xp} XP
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{topThree[0].questsCompleted}/10 Quests</span>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="order-3 md:order-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center space-y-3 relative shadow-xl">
                <div className="w-10 h-10 rounded-full bg-amber-800/80 text-amber-200 font-bold flex items-center justify-center mx-auto absolute -top-5 left-1/2 -translate-x-1/2 shadow-lg border-2 border-amber-700">
                  #3
                </div>
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-16 h-16 rounded-2xl mx-auto bg-slate-800 border-2 border-amber-700 mt-2"
                />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{topThree[2].name}</h4>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase">{topThree[2].role}</span>
                </div>
                <div className="flex justify-center gap-3 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current" /> {topThree[2].xp} XP
                  </span>
                  <span>•</span>
                  <span>{topThree[2].questsCompleted}/10 Quests</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Standings Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-slate-950/70 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
              <span>Overall Standings</span>
              <button
                onClick={fetchBoard}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 normal-case font-sans font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="divide-y divide-slate-800/60 text-xs">
              {entries.map((entry) => {
                const isCurrent = currentUser && currentUser._id === entry.userId;
                return (
                  <div
                    key={entry.userId}
                    className={`px-6 py-4 flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-cyan-950/30 border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-7 text-center font-mono font-bold text-sm ${
                        entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-slate-300' : entry.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        #{entry.rank}
                      </span>

                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700"
                      />

                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-2">
                          <span>{entry.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                          <span className="uppercase text-cyan-400">{entry.role}</span>
                          <span>•</span>
                          <span>Level {entry.level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono">
                      <div className="hidden sm:flex items-center gap-1 text-amber-400" title="Streak Days">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{entry.streakDays}d</span>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-cyan-300 flex items-center justify-end gap-1">
                          <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span>{entry.xp}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {entry.questsCompleted} / 10 Quests
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
