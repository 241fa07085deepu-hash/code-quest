import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Topic, User } from '../types';
import { api } from '../services/api';
import { RunResult } from '../services/pythonRunner';
import { GameStage } from './games/GameStage';
import { CodeEditor } from './CodeEditor';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Gamepad2, 
  Zap, 
  Copy, 
  Check, 
  Clock, 
  Layers, 
  AlertCircle,
  XCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

interface QuestArenaProps {
  topic: Topic;
  allTopics: Topic[];
  currentUser: User | null;
  onBack: () => void;
  onNavigateTopic: (topicId: number) => void;
  onUserUpdate: (updatedUser: User) => void;
  onRequireAuth: () => void;
}

export const QuestArena: React.FC<QuestArenaProps> = ({
  topic,
  allTopics,
  currentUser,
  onBack,
  onNavigateTopic,
  onUserUpdate,
  onRequireAuth
}) => {
  const quest = topic.quest;
  const [code, setCode] = useState<string>(quest.starterCode);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Right-deck tabs: 'terminal' | 'hints' | 'solution' | 'tests'
  const [deckTab, setDeckTab] = useState<'terminal' | 'hints' | 'solution'>('terminal');
  
  // Left-panel tabs: 'game' | 'picture' | 'theory'
  const [leftTab, setLeftTab] = useState<'game' | 'picture' | 'theory'>('game');

  const [revealedHints, setRevealedHints] = useState<number[]>([0]);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync starter code when topic changes
  useEffect(() => {
    setCode(quest.starterCode);
    setRunResult(null);
    setDeckTab('terminal');
    setRevealedHints([0]);
  }, [quest.id]);

  const isCompleted = currentUser?.completedQuests.includes(quest.id);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await api.runQuest(quest.id, code);
      setRunResult(res);
      setDeckTab('terminal');
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setToastMessage('✨ All test cases passed! Ready to submit.');
      } else {
        setRevealedHints([0, 1, 2]); // Reveal hints on mistake
        setToastMessage('❌ Test mismatch detected. Check hints or solution tab!');
      }
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitQuest(quest.id, code, currentUser._id);
      setRunResult(res.runResult);

      if (res.isCompleted) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setToastMessage(`🎉 Quest Cleared! +${res.xpEarned} XP awarded!`);
        
        const token = localStorage.getItem('codequest_token');
        if (token) {
          const fresh = await api.getMe(token);
          onUserUpdate(fresh.user);
        }
      } else {
        setDeckTab('solution');
        setRevealedHints([0, 1, 2]);
        setToastMessage('Mistake detected! Inspecting verified solution.');
      }
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(quest.starterCode);
  };

  const handleApplySolution = () => {
    setCode(quest.solutionCode);
    setApplied(true);
    setDeckTab('terminal');
    setToastMessage('✓ Solution applied to editor! Click Run Code to test.');
    setTimeout(() => {
      setApplied(false);
      setToastMessage(null);
    }, 3000);
  };

  const copySolution = () => {
    navigator.clipboard.writeText(quest.solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const prevTopic = allTopics.find(t => t.id === topic.id - 1);
  const nextTopic = allTopics.find(t => t.id === topic.id + 1);

  return (
    <div className="h-full flex flex-col justify-between max-w-7xl mx-auto w-full overflow-hidden select-none">
      
      {/* Top Bar: Nav Breadcrumb & Topic Title (Single Compact Line) */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800/80 flex-shrink-0 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition py-1 px-2 rounded-lg hover:bg-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Carousel</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">
            STAGE #{topic.id.toString().padStart(2, '0')}: {quest.gameName}
          </span>
          <span className="text-slate-500 hidden md:inline">• {quest.conceptName}</span>
        </div>

        {/* Next / Prev Quick Switcher */}
        <div className="flex items-center gap-2">
          {toastMessage && (
            <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 animate-pulse">
              {toastMessage}
            </span>
          )}

          <div className="flex items-center gap-1">
            {prevTopic && (
              <button
                onClick={() => onNavigateTopic(prevTopic.id)}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                title={`Previous: ${prevTopic.title}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-bold">
              {topic.id} / 10
            </span>

            {nextTopic && (
              <button
                onClick={() => onNavigateTopic(nextTopic.id)}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                title={`Next: ${nextTopic.title}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Cockpit: Left Visual Simulator / Right Editor & Action Deck */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 my-1.5 overflow-hidden">
        
        {/* LEFT PANEL (5 cols): Game Stage Simulator, Picture, Objective */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden p-3 gap-2">
          
          {/* Left Sub-Header with Mode Selector */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setLeftTab('game')}
                className={`px-2.5 py-1 rounded-md transition ${
                  leftTab === 'game' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mini-Game Stage
              </button>
              <button
                onClick={() => setLeftTab('picture')}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                  leftTab === 'picture' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                Art
              </button>
              <button
                onClick={() => setLeftTab('theory')}
                className={`px-2.5 py-1 rounded-md transition ${
                  leftTab === 'theory' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Theory
              </button>
            </div>

            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current text-amber-400" />
              <span>{quest.timeComplexity}</span>
            </div>
          </div>

          {/* Left Visual Display Area */}
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            {leftTab === 'game' && (
              <GameStage
                quest={quest}
                visualState={runResult?.visualStateUpdate || quest.initialGameState}
                isPassed={Boolean(runResult?.success || isCompleted)}
              />
            )}

            {leftTab === 'picture' && (
              <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-800 bg-slate-950 flex items-center justify-center">
                <img
                  src={topic.image}
                  alt={quest.gameName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-xs font-mono text-slate-200 flex justify-between items-center">
                  <span className="font-bold">{quest.gameName}</span>
                  <span className="text-cyan-400 text-[10px]">{topic.category}</span>
                </div>
              </div>
            )}

            {leftTab === 'theory' && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 h-full overflow-y-auto text-xs text-slate-300 space-y-2">
                <div className="font-bold text-cyan-300 font-mono">Concept Guide:</div>
                <div className="whitespace-pre-wrap leading-relaxed text-[11px] text-slate-300">
                  {topic.theoryExplanation}
                </div>
              </div>
            )}
          </div>

          {/* Mission Objective Bar (Bottom Left) */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">
              Objective:
            </div>
            <p className="text-slate-200 text-xs leading-snug">
              {quest.objective}
            </p>
          </div>

        </div>

        {/* RIGHT PANEL (7 cols): Code Editor + Action Deck (Terminal / Hints / Solution) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden p-3 gap-2">
          
          {/* Top Half: Python Code Editor */}
          <div className="h-[48%] min-h-[180px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Bottom Half: Unified Action Deck (Terminal / Hints / Solution Tabs) */}
          <div className="h-[50%] min-h-[200px] flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            
            {/* Deck Tab Bar */}
            <div className="bg-slate-900/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDeckTab('terminal')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition ${
                    deckTab === 'terminal'
                      ? 'bg-slate-800 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Terminal</span>
                  {runResult && (
                    <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                      runResult.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {runResult.passedCount}/{runResult.totalCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setDeckTab('hints')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition ${
                    deckTab === 'hints'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hints ({quest.hints.length})</span>
                </button>

                <button
                  onClick={() => setDeckTab('solution')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs flex items-center gap-1.5 transition ${
                    deckTab === 'solution'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Correct Answer</span>
                  {runResult && !runResult.success && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                  )}
                </button>
              </div>

              {/* Status in Deck Bar */}
              <div className="font-mono text-[11px] text-slate-500 hidden sm:block">
                {deckTab === 'solution' ? 'Verified Code Ready' : 'Python 3.12 Runner'}
              </div>
            </div>

            {/* Deck Body (Scrollable inside, but whole window never scrolls!) */}
            <div className="flex-1 p-3 overflow-y-auto text-xs font-mono leading-relaxed select-text">
              
              {/* TAB 1: TERMINAL OUTPUT */}
              {deckTab === 'terminal' && (
                <div>
                  {runResult ? (
                    <div className="space-y-2">
                      <pre className="whitespace-pre-wrap text-slate-300 text-xs">
                        {runResult.terminalOutput}
                      </pre>
                      
                      {/* Test badges list */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                        {runResult.testResults.map((tc, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 ${
                              tc.passed
                                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                            }`}
                          >
                            {tc.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            Test #{idx + 1}: {tc.passed ? 'PASSED' : 'MISMATCH'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-6 text-center">
                      Click <strong className="text-cyan-400">"Run Code"</strong> to execute tests and view terminal trace.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROGRESSIVE HINTS */}
              {deckTab === 'hints' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-sans mb-1 flex items-center justify-between">
                    <span>Unlock clues one by one if you are stuck:</span>
                    <button
                      onClick={() => setRevealedHints([0, 1, 2])}
                      className="text-amber-400 hover:text-amber-300 font-bold"
                    >
                      Reveal All
                    </button>
                  </div>

                  {quest.hints.map((hint, idx) => {
                    const isRev = revealedHints.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border transition ${
                          isRev
                            ? 'bg-amber-950/15 border-amber-500/40 text-amber-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div
                          onClick={() => {
                            if (!isRev) setRevealedHints([...revealedHints, idx]);
                          }}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold">
                            Hint #{idx + 1}: {isRev ? hint : 'Click to uncover hint'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: FULL CORRECT ANSWER & VERIFIED CODE */}
              {deckTab === 'solution' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Verified Solution & Learn from Mistake:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copySolution}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={handleApplySolution}
                        className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Apply to Editor</span>
                      </button>
                    </div>
                  </div>

                  {/* Clean Python solution code block */}
                  <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-cyan-300 text-xs overflow-x-auto leading-relaxed">
                    <code>{quest.solutionCode}</code>
                  </pre>

                  {/* Concise logic bullets */}
                  <div className="space-y-1 font-sans text-xs text-slate-300 pt-1">
                    <div className="font-bold text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                      Why this solution works:
                    </div>
                    {quest.solutionExplanation.map((exp, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <span className="text-cyan-400 font-bold font-mono">#{i + 1}</span>
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
