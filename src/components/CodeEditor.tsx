import React, { useRef, useEffect } from 'react';
import { Play, Send, RotateCcw, Code2, Sparkles, Terminal } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onSubmit,
  onReset,
  isRunning,
  isSubmitting
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle Tab key insertion for Python indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    '; // 4 spaces for standard Python PEP8

      const updated = code.substring(0, start) + spaces + code.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun();
    }
  };

  const lineCount = Math.max(code.split('\n').length, 12);
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Editor Header */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            solution.py
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            (Python 3)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset code to original template"
            className="p-1.5 px-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>Run Code</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-md active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>Submit Quest</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-xs bg-slate-950">
        {/* Line Numbers */}
        <div className="w-12 py-3 bg-slate-950 text-slate-600 select-none text-right pr-3 border-r border-slate-800/80 overflow-hidden font-mono leading-relaxed">
          {lines.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex-1 relative h-full">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full p-3 font-mono text-xs text-slate-100 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-cyan-500/30 selection:text-white overflow-y-auto"
            placeholder="# Write your Python solution here..."
          />
        </div>
      </div>

      {/* Footer shortcut bar */}
      <div className="bg-slate-900/60 px-4 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span>Tab: 4 spaces</span>
          <span>•</span>
          <span>Shortcut: <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[10px]">Ctrl+Enter</kbd> to Run</span>
        </div>
        <div>
          Lines: {code.split('\n').length} | Chars: {code.length}
        </div>
      </div>
    </div>
  );
};
