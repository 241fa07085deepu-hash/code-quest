import React, { useState, useEffect, useRef } from 'react';
import { Topic, User } from '../types';
import { 
  Gamepad2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap, 
  BrainCircuit, 
  Play, 
  Layers,
  ArrowRight,
  Shield,
  Flame,
  Award
} from 'lucide-react';

interface TopicsCarouselProps {
  topics: Topic[];
  currentUser: User | null;
  onSelectTopic: (topicId: number) => void;
}

export const TopicsCarousel: React.FC<TopicsCarouselProps> = ({
  topics,
  currentUser,
  onSelectTopic
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Fundamentals', 'Linear DSA', 'Algorithms', 'Trees & Hashing'];

  // Filter topics if selected, otherwise show all 10
  const filteredTopics = filterCategory === 'All'
    ? topics
    : topics.filter(t => t.category === filterCategory);

  // Keep index in bounds
  const activeTopic = filteredTopics[currentIndex] || filteredTopics[0] || topics[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredTopics.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredTopics.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation Left & Right arrows
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filteredTopics.length]);

  // Scroll active thumbnail into view smoothly
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeEl = thumbnailStripRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentIndex]);

  const isCompleted = currentUser?.completedQuests.includes(activeTopic.quest.id);
  const completedCount = currentUser?.completedQuests.length || 0;
  const progressPercent = Math.round((completedCount / topics.length) * 100);

  const xpReward = activeTopic.quest.difficulty === 'Beginner' ? 100 : activeTopic.quest.difficulty === 'Intermediate' ? 150 : 250;

  return (
    <div className="h-full flex flex-col justify-between max-w-7xl mx-auto w-full select-none overflow-hidden py-1 sm:py-2">
      
      {/* Top Quick Status & Category Bar (Single Line) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1.5 border-b border-slate-800/80 flex-shrink-0">
        
        {/* Left Track Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400">STAGE</span>
            <strong className="text-cyan-300 text-sm font-bold">
              #{activeTopic.id.toString().padStart(2, '0')} / 10
            </strong>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Progress:</span>
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-emerald-400 font-bold">{completedCount}/10</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl transition whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Carousel Hero Stage Window (Fits exactly inside viewport) */}
      <div className="flex-1 relative flex items-center justify-between my-2 overflow-hidden px-1">
        
        {/* Prev Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Game Stage"
          className="absolute left-2 z-20 w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-cyan-300 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95 hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next Game Stage"
          className="absolute right-2 z-20 w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-cyan-300 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95 hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Central Stage Card (Large Visual + Clean Punchy Data) */}
        <div className="w-full h-full max-h-[520px] rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/90 overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* LEFT: Cinematic 3D Game Art Picture (Dominant Visual Presence) */}
          <div className="relative md:w-7/12 h-56 md:h-full overflow-hidden bg-slate-950 flex items-center justify-center group">
            <img
              src={activeTopic.image}
              alt={activeTopic.quest.gameName}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-slate-950/40 md:to-slate-950" />

            {/* Over-image Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                MINI-GAME #{activeTopic.id}
              </span>
              {isCompleted && (
                <span className="px-3 py-1 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED
                </span>
              )}
            </div>

            {/* Big Play Overlay Icon */}
            <div 
              onClick={() => onSelectTopic(activeTopic.id)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-slate-950/40 backdrop-blur-[2px]"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
            </div>
          </div>

          {/* RIGHT: Punchy Game Action Card ("Less Data, More Picture") */}
          <div className="md:w-5/12 p-5 sm:p-7 flex flex-col justify-between relative z-10">
            
            {/* Top Metadata */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  {activeTopic.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    activeTopic.difficulty === 'Beginner'
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                      : activeTopic.difficulty === 'Intermediate'
                        ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30'
                        : 'border-amber-500/40 text-amber-400 bg-amber-950/30'
                  }`}>
                    {activeTopic.difficulty}
                  </span>
                </div>
              </div>

              {/* Title & Game Name */}
              <div>
                <div className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  GAME: {activeTopic.quest.gameName}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight leading-tight mt-1">
                  {activeTopic.title}
                </h2>
              </div>

              {/* Concise Mission Objective (1-2 Punchy sentences) */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                {activeTopic.quest.objective}
              </p>

              {/* Visual Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">CONCEPT</div>
                  <div className="text-xs font-bold text-slate-200 truncate mt-0.5" title={activeTopic.quest.conceptName}>
                    {activeTopic.quest.conceptName.split(' ')[0]}
                  </div>
                </div>

                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">TIME (BIG-O)</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">
                    {activeTopic.quest.timeComplexity}
                  </div>
                </div>

                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">REWARD</div>
                  <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 fill-current" />
                    +{xpReward} XP
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Launch Action Button */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => onSelectTopic(activeTopic.id)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black font-mono text-sm flex items-center justify-center gap-2.5 transition shadow-xl shadow-cyan-500/25 active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY {activeTopic.quest.gameName.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                <span>Use ◀ / ▶ arrows or click below</span>
                <span>Python AST 3.12 Runner</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom 10-Stage Visual Carousel Thumbnail Strip */}
      <div className="pt-1 flex-shrink-0">
        <div className="flex items-center justify-between px-2 mb-1.5 text-xs text-slate-400 font-mono">
          <span>SELECT ANY QUEST (1 TO 10):</span>
          <span className="text-cyan-400">Click card to slide</span>
        </div>

        <div 
          ref={thumbnailStripRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none"
        >
          {topics.map((t, idx) => {
            const isCurrent = t.id === activeTopic.id;
            const isCompletedThumb = currentUser?.completedQuests.includes(t.quest.id);

            return (
              <div
                key={t.id}
                onClick={() => {
                  const filteredIdx = filteredTopics.findIndex(ft => ft.id === t.id);
                  if (filteredIdx !== -1) {
                    setCurrentIndex(filteredIdx);
                  } else {
                    setFilterCategory('All');
                    setCurrentIndex(t.id - 1);
                  }
                }}
                className={`relative flex-shrink-0 w-28 sm:w-32 h-16 sm:h-20 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-200 ${
                  isCurrent
                    ? 'ring-2 ring-cyan-400 border-cyan-400 scale-105 shadow-lg shadow-cyan-500/30'
                    : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={t.image}
                  alt={t.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-1.5 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-950/80 text-cyan-300">
                      #{t.id}
                    </span>
                    {isCompletedThumb && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-100 truncate font-mono">
                    {t.quest.gameName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
