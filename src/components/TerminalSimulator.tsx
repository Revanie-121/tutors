import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, CheckCircle2, AlertTriangle, CornerDownLeft } from 'lucide-react';
import {
  TerminalEnvState,
  simulateCommand,
} from '../utils/tutorialLogic';

interface HistoryEntry {
  id: string;
  command: string;
  outputLines: string[];
  status: 'success' | 'warning' | 'error' | 'info';
}

interface TerminalSimulatorProps {
  envState: TerminalEnvState;
  onUpdateEnvState: (next: TerminalEnvState) => void;
  onCompleteStep: (stepId: string) => void;
  externalCommandRequest: { command: string; nonce: number } | null;
}

const QUICK_COMMANDS = [
  { label: '1. ensurepip --upgrade', command: 'python -m ensurepip --upgrade' },
  { label: '2. pip install pipx', command: 'python -m pip install pipx' },
  { label: '3. pipx ensurepath', command: 'python -m pipx ensurepath' },
  { label: '4. pipx install lucidadl', command: 'python -m pipx install lucidadl' },
  { label: '5. lucida.exe', command: 'lucida.exe' },
];

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  envState,
  onUpdateEnvState,
  onCompleteStep,
  externalCommandRequest,
}) => {
  const [inputCmd, setInputCmd] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init-banner',
      command: 'python --version',
      outputLines: [
        'Python 3.12.1 (tags/v3.12.1:2305ca5, Dec  7 2023, 22:03:25) [MSC v.1937 64 bit (AMD64)]',
        'Simulator Windows PowerShell siap. Klik tombol perintah cepat di bawah atau ketik perintah secara langsung.',
      ],
      status: 'info',
    },
  ]);

  const executeCommand = (cmdToRun: string) => {
    const result = simulateCommand(cmdToRun, envState);
    onUpdateEnvState(result.nextState);
    if (result.completedStepId) {
      onCompleteStep(result.completedStepId);
    }

    if (result.outputLines[0] === '__CLEAR__') {
      setHistory([]);
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        command: cmdToRun,
        outputLines: result.outputLines,
        status: result.status,
      },
    ]);
  };

  React.useEffect(() => {
    if (externalCommandRequest && externalCommandRequest.command) {
      executeCommand(externalCommandRequest.command);
    }
  }, [externalCommandRequest?.nonce]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    executeCommand(inputCmd);
    setInputCmd('');
  };

  const handleRunFullSequence = () => {
    let current = {
      pythonInstalled: true,
      cppInstalled: true,
      pipUpgraded: false,
      pipxInstalled: false,
      pipxPathConfigured: false,
      lucidadlInstalled: false,
      terminalRestartedAfterPath: true,
    };

    const cmds = [
      'python -m ensurepip --upgrade',
      'python -m pip install pipx',
      'python -m pipx ensurepath',
      'python -m pipx install lucidadl',
      'lucida.exe',
    ];

    const newEntries: HistoryEntry[] = [];
    for (const cmd of cmds) {
      const res = simulateCommand(cmd, current);
      current = res.nextState;
      if (res.completedStepId) {
        onCompleteStep(res.completedStepId);
      }
      newEntries.push({
        id: `${Date.now()}-${cmd}`,
        command: cmd,
        outputLines: res.outputLines,
        status: res.status,
      });
    }

    onUpdateEnvState(current);
    setHistory(newEntries);
  };

  const handleReset = () => {
    onUpdateEnvState({
      pythonInstalled: true,
      cppInstalled: true,
      pipUpgraded: false,
      pipxInstalled: false,
      pipxPathConfigured: false,
      lucidadlInstalled: false,
      terminalRestartedAfterPath: true,
    });
    setHistory([
      {
        id: 'reset-banner',
        command: 'cls',
        outputLines: ['Sesi terminal di-reset ke kondisi awal (Python 3.12 & MSVC C++ aktif).'],
        status: 'info',
      },
    ]);
  };

  return (
    <div className="h-full flex-1 bg-[#0F172A] text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col">
      {/* Window Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[#1E293B] border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs font-medium text-slate-200 tracking-wide whitespace-nowrap truncate">
            Windows PowerShell
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRunFullSequence}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-sky-300 bg-sky-950/80 hover:bg-sky-900/80 border border-sky-800/70 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Simulasikan Semua Langkah
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset Simulator Terminal"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Environment State Bar (Unboxed clean metadata with middle dot separator) */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-300 font-medium">Status Lingkungan:</span>
          <span className={envState.pipUpgraded ? 'text-emerald-400' : 'text-slate-400'}>
            {envState.pipUpgraded ? '✓ Pip Terbaru' : '○ Pip Standar'}
          </span>
          <span aria-hidden="true">·</span>
          <span className={envState.pipxInstalled ? 'text-emerald-400' : 'text-slate-400'}>
            {envState.pipxInstalled ? '✓ Pipx Terinstal' : '○ Pipx Belum Ada'}
          </span>
          <span aria-hidden="true">·</span>
          <span className={envState.pipxPathConfigured ? 'text-emerald-400' : 'text-slate-400'}>
            {envState.pipxPathConfigured ? '✓ PATH Terdaftar' : '○ PATH Belum Diatur'}
          </span>
          <span aria-hidden="true">·</span>
          <span className={envState.lucidadlInstalled ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
            {envState.lucidadlInstalled ? '✓ lucida.exe Siap' : '○ lucida.exe Belum Terinstal'}
          </span>
        </div>
      </div>

      {/* Quick Command Bar */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800/80 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-400 mr-1">Uji Cepat:</span>
        {QUICK_COMMANDS.map((item) => (
          <button
            key={item.command}
            type="button"
            onClick={() => executeCommand(item.command)}
            className="px-2.5 py-1 text-xs font-mono text-slate-200 bg-slate-800/90 hover:bg-sky-900/60 hover:text-sky-200 border border-slate-700/80 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Console Output Area */}
      <div
        data-testid="terminal-output"
        className="flex-1 p-4 font-mono text-xs leading-relaxed space-y-3 min-h-[280px] max-h-[420px] overflow-y-auto bg-[#0B1120]"
      >
        <div className="text-slate-400">
          Windows PowerShell
          <br />
          Copyright (C) Microsoft Corporation. All rights reserved.
        </div>

        {history.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center gap-1.5 text-sky-300">
              <span className="text-slate-400 select-none">PS C:\Users\DevUser&gt;</span>
              <span className="font-semibold text-white">{entry.command}</span>
            </div>
            <div className="pl-3 space-y-0.5">
              {entry.outputLines.map((line, idx) => {
                const isOk = line.startsWith('[OK]') || line.includes('Successfully') || line.includes('done!');
                const isErr =
                  line.startsWith('[Error]') ||
                  line.startsWith('[Solusi]') ||
                  line.startsWith('[Belum Terinstal]') ||
                  line.includes('not recognized') ||
                  line.includes('No module named');
                return (
                  <div
                    key={idx}
                    className={
                      isOk
                        ? 'text-emerald-400 flex items-center gap-1.5'
                        : isErr
                        ? 'text-amber-300 flex items-center gap-1.5'
                        : 'text-slate-300'
                    }
                  >
                    {isOk && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" />}
                    {isErr && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 inline" />}
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Command Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] border-t border-slate-800"
      >
        <label htmlFor="terminal-cmd-input" className="text-xs font-mono text-slate-400 shrink-0">
          PS C:\Users\DevUser&gt;
        </label>
        <input
          id="terminal-cmd-input"
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder="Ketik perintah (mis. python -m ensurepip --upgrade atau lucida.exe)..."
          className="w-full bg-transparent text-xs font-mono text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Jalankan</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
