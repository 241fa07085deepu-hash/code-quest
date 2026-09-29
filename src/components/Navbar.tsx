import React, { useState } from 'react';
import { User } from '../types';
import { 
  Gamepad2, 
  Trophy, 
  UserCheck, 
  ShieldCheck, 
  Flame, 
  Zap, 
  LogOut, 
  LogIn, 
  Compass, 
  ChevronDown,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeView: 'topics' | 'quest' | 'leaderboard' | 'student' | 'admin';
  onNavigate: (view: 'topics' | 'quest' | 'leaderboard' | 'student' | 'admin') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onQuickSwitchUser: (role: 'student' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onQuickSwitchUser
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('topics')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                CODE QUEST
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-semibold">
                Python DSA
              </span>
            </div>
            <div className="text-[11px] text-slate-400">10 Topics • 10 Mini-Games</div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => onNavigate('topics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === 'topics' || activeView === 'quest'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Quests & Games</span>
          </button>

          <button
            onClick={() => onNavigate('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === 'leaderboard'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => onNavigate('student')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === 'student'
                ? 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Student Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeView === 'admin'
                ? 'bg-slate-800 text-indigo-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Admin Console</span>
            {currentUser?.role === 'admin' && (
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            )}
          </button>
        </nav>

        {/* User Status / Quick Switch & Profile */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Gamification Stats */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="flex items-center gap-1 text-amber-400" title="Streak Days">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <strong>{currentUser.streakDays}d</strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-cyan-300" title="Experience Points">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <strong>{currentUser.xp} XP</strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-bold" title="Level">
                  Lv.{currentUser.level}
                </span>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-850 border border-transparent hover:border-slate-800 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-200 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono uppercase">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs">
                    <div className="p-3 border-b border-slate-800/80 mb-2">
                      <div className="font-bold text-slate-100">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          currentUser.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          Role: {currentUser.role}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {currentUser.completedQuests.length}/10 Quests
                        </span>
                      </div>
                    </div>

                    {/* Quick Role Switcher Buttons */}
                    <div className="px-2 py-1 text-[11px] font-semibold text-slate-400">
                      Quick Demo Switcher:
                    </div>
                    <button
                      onClick={() => {
                        onQuickSwitchUser('student');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Student: Alex Byte
                      </span>
                      {currentUser.role === 'student' && <span className="text-[10px] text-emerald-400 font-bold">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        onQuickSwitchUser('admin');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Admin: Prof. Turing
                      </span>
                      {currentUser.role === 'admin' && <span className="text-[10px] text-indigo-400 font-bold">Active</span>}
                    </button>

                    <div className="border-t border-slate-800/80 my-2" />

                    <button
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-300 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-md shadow-cyan-500/20"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 px-2 text-xs">
        <button
          onClick={() => onNavigate('topics')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'topics' || activeView === 'quest' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Quests</span>
        </button>
        <button
          onClick={() => onNavigate('leaderboard')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'leaderboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span className="text-[10px]">Rank</span>
        </button>
        <button
          onClick={() => onNavigate('student')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'student' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[10px]">Student</span>
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'admin' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px]">Admin</span>
        </button>
      </div>
    </header>
  );
};
