import React, { useState } from 'react';
import { Terminal as TerminalIcon, CheckCircle2, XCircle, Copy, Check, Play, RefreshCw } from 'lucide-react';
import { RunResult } from '../services/pythonRunner';

interface TerminalViewProps {
  runResult: RunResult | null;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  runResult,
  isRunning,
  onRun,
  onReset
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');

  const copyOutput = () => {
    if (!runResult?.terminalOutput) return;
    navigator.clipboard.writeText(runResult.terminalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[320px]">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700/60">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-medium">bash - python3.12</span>
          </div>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                activeTab === 'console'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Console Logs
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] flex items-center gap-1.5 transition-colors ${
                activeTab === 'tests'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Cases
              {runResult && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    runResult.success
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {runResult.passedCount}/{runResult.totalCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={copyOutput}
            title="Copy Output"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed text-slate-200 select-text">
        {isRunning ? (
          <div className="flex items-center gap-2 text-cyan-400 py-4">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Compiling and executing Python AST in isolated runner...</span>
          </div>
        ) : activeTab === 'console' ? (
          <div>
            {runResult ? (
              <pre className="whitespace-pre-wrap font-mono text-slate-300">
                {runResult.terminalOutput}
              </pre>
            ) : (
              <div className="text-slate-500 italic py-6">
                Terminal ready. Click <span className="text-cyan-400 font-semibold">"Run Code"</span> or press Ctrl+Enter to execute.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {runResult?.testResults && runResult.testResults.length > 0 ? (
              runResult.testResults.map((tc, idx) => (
                <div
                  key={tc.id || idx}
                  className={`p-3 rounded-xl border text-xs ${
                    tc.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold flex items-center gap-1.5">
                      {tc.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={tc.passed ? 'text-emerald-300' : 'text-rose-300'}>
                        Test #{idx + 1}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {tc.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <div>
                      <span className="text-slate-500">Input:</span>{' '}
                      <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">{tc.description}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected:</span>{' '}
                      <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">{tc.expected}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">Actual:</span>{' '}
                      <code className={`${tc.passed ? 'text-emerald-300' : 'text-rose-300'} bg-slate-900 px-1 py-0.5 rounded`}>
                        {tc.actual}
                      </code>
                    </div>
                    {tc.error && (
                      <div className="text-rose-400 text-[11px] mt-1 pt-1 border-t border-rose-500/20">
                        {tc.error}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic py-6">
                No test results recorded yet. Run the code to view test assertions.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Footer with Quick Stats */}
      <div className="bg-slate-900/60 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>Target: Python 3.12</span>
          <span>•</span>
          <span className="text-emerald-400">Memory: 4.2 MB</span>
        </div>
        <div className="flex items-center gap-2">
          {runResult && (
            <span
              className={`font-semibold ${
                runResult.success ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {runResult.success ? 'All Tests Passing ✨' : 'Failures Detected - See Hints Below'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
