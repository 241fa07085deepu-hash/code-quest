/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Topic } from './types';
import { api } from './services/api';
import { TOPICS_DATA } from './data/topics';
import { Navbar } from './components/Navbar';
import { TopicsCarousel } from './components/TopicsCarousel';
import { QuestArena } from './components/QuestArena';
import { Leaderboard } from './components/Leaderboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { RefreshCw, Sparkles, Terminal, Gamepad2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<Topic[]>(TOPICS_DATA);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'topics' | 'quest' | 'leaderboard' | 'student' | 'admin'>('topics');
  
  // Auth Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);

  // Initialize topics and session
  useEffect(() => {
    const initApp = async () => {
      try {
        // Fetch topics from backend
        const topicsRes = await api.getTopics();
        if (topicsRes.topics && topicsRes.topics.length > 0) {
          setTopics(topicsRes.topics);
        }
      } catch (e) {
        console.warn('Using local topic seed fallback:', e);
        setTopics(TOPICS_DATA);
      }

      // Check stored token or default to demo student Alex Byte
      const storedToken = localStorage.getItem('codequest_token');
      if (storedToken) {
        try {
          const userRes = await api.getMe(storedToken);
          setCurrentUser(userRes.user);
        } catch {
          localStorage.removeItem('codequest_token');
          // Auto login default demo student
          autoLoginDefaultStudent();
        }
      } else {
        autoLoginDefaultStudent();
      }

      setLoading(false);
    };

    initApp();
  }, []);

  const autoLoginDefaultStudent = async () => {
    try {
      const res = await api.login({ email: 'student@codequest.dev', password: 'student123' });
      setCurrentUser(res.user);
      localStorage.setItem('codequest_token', res.token);
    } catch {
      // Offline fallback
      setCurrentUser({
        _id: 'user_student_001',
        name: 'Alex Byte',
        email: 'student@codequest.dev',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        xp: 850,
        level: 4,
        streakDays: 5,
        completedQuests: ['quest-1', 'quest-2', 'quest-3'],
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    localStorage.setItem('codequest_token', token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codequest_token');
  };

  const handleQuickSwitchUser = async (role: 'student' | 'admin') => {
    try {
      const email = role === 'admin' ? 'admin@codequest.dev' : 'student@codequest.dev';
      const pass = role === 'admin' ? 'admin123' : 'student123';
      const res = await api.login({ email, password: pass });
      setCurrentUser(res.user);
      localStorage.setItem('codequest_token', res.token);
      if (role === 'admin') {
        setActiveView('admin');
      } else {
        setActiveView('student');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTopic = (topicId: number) => {
    setSelectedTopicId(topicId);
    setActiveView('quest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
        }}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onQuickSwitchUser={handleQuickSwitchUser}
      />

      {/* Main Viewport Window Area (No scroll down needed!) */}
      <main className="flex-1 overflow-hidden p-2 sm:p-3 w-full flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <div className="text-sm font-mono text-slate-400">
              Connecting to Code Quest MongoDB Engine...
            </div>
          </div>
        ) : (
          <>
            {activeView === 'topics' && (
              <TopicsCarousel
                topics={topics}
                currentUser={currentUser}
                onSelectTopic={handleSelectTopic}
              />
            )}

            {activeView === 'quest' && selectedTopic && (
              <QuestArena
                topic={selectedTopic}
                allTopics={topics}
                currentUser={currentUser}
                onBack={() => setActiveView('topics')}
                onNavigateTopic={(nextId) => setSelectedTopicId(nextId)}
                onUserUpdate={(u) => setCurrentUser(u)}
                onRequireAuth={() => handleOpenAuth('login')}
              />
            )}

            {activeView === 'leaderboard' && (
              <div className="h-full overflow-y-auto pr-1">
                <Leaderboard currentUser={currentUser} />
              </div>
            )}

            {activeView === 'student' && (
              <div className="h-full overflow-y-auto pr-1">
                <StudentDashboard
                  currentUser={currentUser}
                  topics={topics}
                  onSelectTopic={handleSelectTopic}
                  onOpenAuth={() => handleOpenAuth('login')}
                />
              </div>
            )}

            {activeView === 'admin' && (
              <div className="h-full overflow-y-auto pr-1">
                <AdminDashboard
                  currentUser={currentUser}
                  onOpenAuth={() => handleOpenAuth('login')}
                  onRefreshUser={async () => {
                    const token = localStorage.getItem('codequest_token');
                    if (token) {
                      const res = await api.getMe(token);
                      setCurrentUser(res.user);
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Compact Status Bar (Window Fit) */}
      <footer className="hidden sm:flex flex-shrink-0 border-t border-slate-900 bg-slate-950 px-4 py-1.5 items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-300">Code Quest</span>
          <span>•</span>
          <span>10 Topics • 10 Playable Mini-Games</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">● MongoDB Synced</span>
          <span>•</span>
          <span>Python 3.12 AST Runner</span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
