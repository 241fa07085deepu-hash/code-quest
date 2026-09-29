import React, { useState, useEffect } from 'react';
import { TopicQuest } from '../types';
import { 
  Lightbulb, 
  BookOpen, 
  Check, 
  Copy, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface SolutionAndHintsProps {
  quest: TopicQuest;
  hasMistake: boolean;
  onApplySolution: (code: string) => void;
}

export const SolutionAndHints: React.FC<SolutionAndHintsProps> = ({
  quest,
  hasMistake,
  onApplySolution
}) => {
  const [activeTab, setActiveTab] = useState<'hints' | 'solution'>('hints');
  const [revealedHints, setRevealedHints] = useState<number[]>([0]); // First hint always unlocked
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  // Auto switch or alert if student made a mistake
  useEffect(() => {
    if (hasMistake) {
      // Keep student aware they can inspect the solution
      setRevealedHints([0, 1, 2]); // Reveal all hints on mistake
    }
  }, [hasMistake]);

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter(i => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const copySolution = () => {
    navigator.clipboard.writeText(quest.solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplySolution(quest.solutionCode);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-6">
      {/* Tab Navigation */}
      <div className="bg-slate-950/70 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hints')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'hints'
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Hints & Guidance</span>
            <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded-full text-amber-300 font-mono">
              {quest.hints.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('solution')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'solution'
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Full Correct Solution & Learn</span>
            {hasMistake && (
              <span className="animate-pulse flex items-center gap-1 text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                <AlertCircle className="w-3 h-3" /> Solution Ready
              </span>
            )}
          </button>
        </div>

        {/* Complexity Pills */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time: <strong className="text-slate-200">{quest.timeComplexity}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Space: <strong className="text-slate-200">{quest.spaceComplexity}</strong>
          </span>
        </div>
      </div>

      {/* Tab 1: Progressive Hints */}
      {activeTab === 'hints' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Stuck on this problem? Unlock hints progressively:</span>
            <button
              onClick={() => setRevealedHints([0, 1, 2])}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Reveal All Hints
            </button>
          </div>

          <div className="space-y-3">
            {quest.hints.map((hintText, index) => {
              const isRevealed = revealedHints.includes(index);
              return (
                <div
                  key={index}
                  className={`border rounded-xl transition-all duration-200 ${
                    isRevealed
                      ? 'bg-slate-950/60 border-amber-500/30 text-slate-200'
                      : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleHint(index)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                          isRevealed
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span>
                        {isRevealed
                          ? `Hint ${index + 1}: ${hintText.split(':')[0] || 'Clue'}`
                          : `Hint ${index + 1}: Click to unlock hint`}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {isRevealed ? 'Hide' : 'Show'}
                    </span>
                  </button>

                  {isRevealed && (
                    <div className="px-4 pb-3.5 pt-1 text-xs text-slate-300 font-mono leading-relaxed border-t border-slate-800/60 bg-amber-950/10">
                      {hintText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick prompt to see full solution */}
          <div className="pt-2 flex items-center justify-between text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">
              Made an error and want to study the complete verified code?
            </span>
            <button
              onClick={() => setActiveTab('solution')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Open Complete Solution <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Full Correct Solution & Deep Dive */}
      {activeTab === 'solution' && (
        <div className="p-6 space-y-6">
          {hasMistake && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-semibold text-rose-300">
                  Mistake detected during execution!
                </div>
                <div className="text-slate-300">
                  Don't worry — making mistakes is how great engineers learn. Examine the verified solution below, inspect the line-by-line explanation, and click <strong>"Apply to Editor"</strong> to run it!
                </div>
              </div>
            </div>
          )}

          {/* Code Showcase with Copy & Apply */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-inner">
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">
                  Official Verified Python Solution
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySolution}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleApply}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 transition shadow"
                >
                  {applied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {applied ? 'Applied to Editor!' : 'Apply to Editor'}
                </button>
              </div>
            </div>
            <pre className="p-4 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto bg-slate-950/80">
              <code>{quest.solutionCode}</code>
            </pre>
          </div>

          {/* Step-by-Step Logic Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Step-by-Step Logic Breakdown
            </h4>
            <div className="grid gap-2">
              {quest.solutionExplanation.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold flex-shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Insights Box */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <h5 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Key DSA Takeaway
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              This problem tests <strong>{quest.conceptName}</strong>. By achieving <strong>{quest.timeComplexity}</strong> time and <strong>{quest.spaceComplexity}</strong> space, the solution guarantees optimal runtime without memory leaks or excessive loops.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
