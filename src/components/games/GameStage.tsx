import React from 'react';
import { TopicQuest } from '../../types';
import { 
  Zap, 
  Shield, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Database,
  Search,
  GitBranch
} from 'lucide-react';

interface GameStageProps {
  quest: TopicQuest;
  visualState: any;
  isPassed: boolean;
}

export const GameStage: React.FC<GameStageProps> = ({ quest, visualState, isPassed }) => {
  const questId = quest.id;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Interactive Mini-Game Simulator
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded text-cyan-300">
            {quest.gameName}
          </span>
          {isPassed ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stage Cleared
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Awaiting Solution
            </span>
          )}
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="p-6 relative min-h-[220px] flex flex-col justify-center items-center bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90">
        
        {/* GAME 1: Gem Collector */}
        {questId === 'quest-1' && (
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                { name: 'Ruby', power: 10, color: 'from-rose-500 to-red-600', border: 'border-rose-500/50' },
                { name: 'Emerald', power: 20, color: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/50' },
                { name: 'Sapphire', power: 30, color: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/50' }
              ].map((gem) => (
                <div 
                  key={gem.name} 
                  className={`p-3 rounded-xl border ${gem.border} bg-slate-900/80 flex flex-col items-center transition-all duration-300 ${
                    isPassed ? 'scale-105 shadow-lg shadow-cyan-500/20' : 'opacity-85'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${gem.color} flex items-center justify-center text-white mb-1 shadow-md`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{gem.name}</span>
                  <span className="text-[11px] font-mono text-cyan-300">+{gem.power} GW</span>
                </div>
              ))}
            </div>

            {/* Core Reactor */}
            <div className={`w-full p-4 rounded-xl border transition-all duration-500 flex items-center justify-between ${
              isPassed 
                ? 'border-emerald-500/60 bg-emerald-950/30 shadow-lg shadow-emerald-500/10' 
                : 'border-slate-800 bg-slate-950/60'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPassed ? 'bg-emerald-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">MULTIPLIER: 2X BOOST</div>
                  <div className="text-sm font-bold text-slate-200">Spaceship Energy Core</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono">STATUS</div>
                <div className={`text-base font-bold font-mono ${isPassed ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isPassed ? 'CORE: 120 GW' : 'OFFLINE (0 GW)'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAME 2: Dungeon Gatekeeper */}
        {questId === 'quest-2' && (
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300">Knight Armor: <strong className="text-cyan-300">60</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">Mana: <strong className="text-amber-300">40</strong></span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Seal: False</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Gold Gate', req: 'Seal & Mana >= 80', active: false, color: 'border-amber-500/40' },
                { name: 'Silver Gate', req: 'Armor/Mana >= 50', active: isPassed, color: 'border-cyan-400/60' },
                { name: 'Portcullis', req: 'Default Lock', active: !isPassed, color: 'border-slate-700' }
              ].map((g) => (
                <div 
                  key={g.name}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    g.active 
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105' 
                      : 'bg-slate-900/60 opacity-60'
                  }`}
                >
                  <div className={`text-xs font-bold mb-1 ${g.active ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {g.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2">{g.req}</div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    g.active ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {g.active ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME 3: Starlight Conveyor */}
        {questId === 'quest-3' && (
          <div className="w-full max-w-lg flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
              <span>CONVEYOR FLOW ➔</span>
              <span>CAPACITY: 60 MAX</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full py-2 px-1">
              {[10, -5, 25, 30, -2, 50].map((val, idx) => (
                <div 
                  key={idx}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                    val < 0 
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-400 line-through' 
                      : isPassed && idx <= 3 
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 scale-105' 
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                  }`}
                >
                  {val > 0 ? `+${val}` : val}
                </div>
              ))}
            </div>
            <div className="w-full bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">Accumulated Starlight Power:</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {isPassed ? '60 / 60 Units (Cap Reached)' : '0 / 60 Units'}
              </span>
            </div>
          </div>
        )}

        {/* GAME 4: Array Railway Sorter */}
        {questId === 'quest-4' && (
          <div className="w-full max-w-md flex flex-col items-center gap-4">
            <div className="text-xs text-slate-400 font-mono">CYBERNETIC CARGO TRAIN (SLICING & REVERSE)</div>
            <div className="flex items-center gap-1.5 w-full justify-center">
              {(isPassed 
                ? ['Epsilon', 'Delta', 'Gamma', 'Beta', 'Alpha']
                : ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']
              ).map((car, idx) => (
                <div 
                  key={idx}
                  className={`px-2.5 py-3 rounded-lg border font-mono text-xs font-semibold text-center transition-all ${
                    isPassed 
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' 
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 mb-0.5">#{idx}</div>
                  {car}
                </div>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Command: <span className="text-amber-300 font-bold">REVERSE</span> ➔ Slice <span className="text-cyan-300">[ : : -1 ]</span>
            </div>
          </div>
        )}

        {/* GAME 5: Dual Laser Targeter */}
        {questId === 'quest-5' && (
          <div className="w-full max-w-md flex flex-col items-center gap-4">
            <div className="flex justify-between w-full text-xs font-mono text-slate-400">
              <span className="text-rose-400 font-bold">Laser L [0] ➔</span>
              <span className="text-cyan-300">Target Voltage: 9</span>
              <span className="text-sky-400 font-bold">⬅ Laser R [1]</span>
            </div>
            <div className="flex gap-2 w-full justify-center">
              {[2, 7, 11, 15].map((num, idx) => {
                const isLeft = isPassed && idx === 0;
                const isRight = isPassed && idx === 1;
                return (
                  <div 
                    key={idx}
                    className={`w-14 py-3 rounded-xl border text-center font-mono font-bold text-sm transition-all ${
                      isLeft 
                        ? 'border-rose-500 bg-rose-950/40 text-rose-300 scale-110 shadow-lg shadow-rose-500/20' 
                        : isRight 
                          ? 'border-sky-500 bg-sky-950/40 text-sky-300 scale-110 shadow-lg shadow-sky-500/20'
                          : 'border-slate-800 bg-slate-900/60 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500">[{idx}]</div>
                    {num}
                  </div>
                );
              })}
            </div>
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              {isPassed ? '✓ 2 + 7 = 9 (Pointers Locked at [0, 1])' : 'Awaiting two pointer convergence...'}
            </div>
          </div>
        )}

        {/* GAME 6: Tower of Brackets */}
        {questId === 'quest-6' && (
          <div className="w-full max-w-md flex items-center justify-around gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-mono mb-2">RUNES STREAM</span>
              <div className="flex gap-1.5 font-mono text-sm">
                {['{', '[', '(', ')', ']', '}'].map((b, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 rounded text-cyan-300 font-bold">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-mono mb-2">STACK TOWER (LIFO)</span>
              <div className="w-24 h-24 border-b-2 border-x-2 border-cyan-500/60 rounded-b-xl bg-slate-950/80 flex flex-col justify-end p-1.5 items-center">
                {isPassed ? (
                  <span className="text-xs text-emerald-400 font-bold mb-4 font-mono text-center">
                    CLEARED<br/>(Balanced)
                  </span>
                ) : (
                  <div className="flex flex-col gap-1 w-full">
                    <div className="bg-cyan-500/20 border border-cyan-500/40 text-center font-mono text-xs rounded text-cyan-300 py-0.5">{'['}</div>
                    <div className="bg-cyan-500/20 border border-cyan-500/40 text-center font-mono text-xs rounded text-cyan-300 py-0.5">{'{'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GAME 7: Spaceport Landing Dock */}
        {questId === 'quest-7' && (
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>QUEUE: FIFO</span>
              <span className="text-amber-400">VIP PRIORITY OVERRIDE</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 mb-2 font-mono">DOCK QUEUE (deque)</div>
                <div className="space-y-1.5">
                  <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300 font-mono flex items-center justify-between">
                    <span>VIP:ShuttleOne</span>
                    <span className="text-[10px] bg-amber-500 text-slate-950 px-1 rounded font-bold">FRONT</span>
                  </div>
                  <div className="p-1.5 bg-slate-800 rounded text-xs text-slate-300 font-mono">
                    Falcon
                  </div>
                  <div className="p-1.5 bg-slate-800 rounded text-xs text-slate-300 font-mono">
                    Viper
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 mb-2 font-mono">DOCKED ORDER</div>
                {isPassed ? (
                  <div className="space-y-1.5">
                    <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-xs text-emerald-300 font-mono">
                      1. ShuttleOne
                    </div>
                    <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-xs text-emerald-300 font-mono">
                      2. Falcon
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-4 text-center">
                    Awaiting docking commands...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GAME 8: Cipher Alchemist */}
        {questId === 'quest-8' && (
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="text-xs font-mono text-slate-400 text-center">
              HASH MAP O(1) RUNIC FREQUENCY ANALYSIS
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Fire', count: 3, color: 'from-amber-500 to-rose-600', dominant: true },
                { name: 'Water', count: 2, color: 'from-cyan-500 to-blue-600', dominant: false },
                { name: 'Earth', count: 1, color: 'from-emerald-500 to-teal-600', dominant: false }
              ].map((rune) => (
                <div 
                  key={rune.name}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isPassed && rune.dominant 
                      ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20 scale-105' 
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200 mb-1">{rune.name}</div>
                  <div className="text-lg font-bold font-mono text-cyan-300">×{rune.count}</div>
                  {isPassed && rune.dominant && (
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">DOMINANT</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME 9: Vault Codecracker */}
        {questId === 'quest-9' && (
          <div className="w-full max-w-md flex flex-col items-center gap-4">
            <div className="flex justify-between w-full text-xs font-mono text-slate-400">
              <span>TARGET: <strong className="text-amber-400">40</strong></span>
              <span>COMPLEXITY: <strong className="text-cyan-400">O(log N)</strong></span>
            </div>
            <div className="flex gap-1.5 w-full justify-center">
              {[10, 20, 30, 40, 50, 60, 70].map((code, idx) => {
                const isMid = idx === 3;
                return (
                  <div 
                    key={idx}
                    className={`px-2.5 py-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all ${
                      isPassed && isMid 
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 scale-110 shadow-lg shadow-emerald-500/20' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {code}
                    <div className="text-[9px] text-slate-500 mt-0.5">[{idx}]</div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              {isPassed ? '✓ Unlocked at Index [3] in just 1 comparison!' : 'Halving search space [low ... mid ... high]'}
            </div>
          </div>
        )}

        {/* GAME 10: Rune Tree Weaver */}
        {questId === 'quest-10' && (
          <div className="w-full max-w-md flex flex-col items-center gap-3">
            <div className="text-xs font-mono text-slate-400">IN-ORDER TRAVERSAL: LEFT ➔ ROOT ➔ RIGHT</div>
            <div className="relative w-48 h-28 flex flex-col items-center justify-between">
              {/* Root */}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                isPassed ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-slate-700 bg-slate-900 text-slate-400'
              }`}>
                4
              </div>
              {/* Level 1 */}
              <div className="w-full flex justify-between px-6">
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                  isPassed ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}>
                  2
                </div>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                  isPassed ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}>
                  5
                </div>
              </div>
              {/* Level 2 */}
              <div className="w-32 flex justify-between">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold ${
                  isPassed ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}>
                  1
                </div>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold ${
                  isPassed ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}>
                  3
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Traversed: <strong className="text-cyan-300">{isPassed ? '[1, 2, 3, 4, 5]' : 'Awaiting traversal...'}</strong>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
