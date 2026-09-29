import React, { useState } from 'react';
import { Topic, User } from '../types';
import { 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight, 
  Filter, 
  BrainCircuit, 
  Terminal,
  Trophy,
  Layers
} from 'lucide-react';

interface TopicsListProps {
  topics: Topic[];
  currentUser: User | null;
  onSelectTopic: (topicId: number) => void;
}

export const TopicsList: React.FC<TopicsListProps> = ({
  topics,
  currentUser,
  onSelectTopic
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fundamentals', 'Linear DSA', 'Algorithms', 'Trees & Hashing'];

  const filteredTopics = selectedCategory === 'All'
    ? topics
    : topics.filter(t => t.category === selectedCategory);

  const completedCount = currentUser?.completedQuests.length || 0;
  const progressPercent = Math.round((completedCount / topics.length) * 100);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner with Futuristic Cyber Learning Aesthetics */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none bg-gradient-to-l from-cyan-500/20 via-indigo-500/10 to-transparent" />
        
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Gamepad2 className="w-3.5 h-3.5" />
            10 Topics • 10 Interactive Mini-Games
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            Learn Python & DSA <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Through Playable Games
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Conquer real data structures and algorithmic challenges by commanding spacecraft, cracking quantum vaults, balancing runic portals, and weaving magical binary trees. Run real Python in your browser terminal with instant hints and complete verified solutions.
          </p>

          {/* Quick Progress Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Quests:</span>
              <strong className="text-cyan-400 text-sm">10 Stages</strong>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400">Completed:</span>
              <strong className="text-emerald-400 text-sm">{completedCount} / 10</strong>
            </div>

            <div className="flex-1 min-w-[200px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Progress</span>
                <span className="text-cyan-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Filter Track:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 10 Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => {
          const isCompleted = currentUser?.completedQuests.includes(topic.quest.id);
          const xp = topic.quest.difficulty === 'Beginner' ? 100 : topic.quest.difficulty === 'Intermediate' ? 150 : 250;

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`group relative rounded-3xl border transition-all duration-300 p-6 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isCompleted
                  ? 'bg-slate-900/40 border-emerald-500/40 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10'
                  : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10'
              }`}
            >
              {/* Top Row with ID & Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-bold">
                      TOPIC #{topic.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {topic.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      topic.difficulty === 'Beginner'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                        : topic.difficulty === 'Intermediate'
                          ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20'
                          : 'border-amber-500/30 text-amber-400 bg-amber-950/20'
                    }`}>
                      {topic.difficulty}
                    </span>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    )}
                  </div>
                </div>

                {/* Game Title & Topic Name */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    GAME: {topic.quest.gameName}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {topic.summary}
                  </p>
                </div>

                {/* Concept & Complexity Bar */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 mb-5">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{topic.quest.conceptName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Big-O:</span>
                    <span className="text-cyan-300 font-bold">{topic.quest.timeComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {topic.estimatedMinutes}m
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    +{xp} XP
                  </span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform font-semibold font-mono">
                  <span>Enter Game</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
