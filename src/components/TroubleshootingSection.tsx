import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
} from 'lucide-react';
import { TROUBLESHOOTING_PRESETS, TroubleshootingPreset } from '../data/tutorialData';
import { diagnoseInstallIssue } from '../utils/tutorialLogic';

interface TroubleshootingSectionProps {
  onRunInSimulator: (command: string) => void;
}

export const TroubleshootingSection: React.FC<TroubleshootingSectionProps> = ({
  onRunInSimulator,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    TROUBLESHOOTING_PRESETS[0].id
  );
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Interactive Custom Diagnostic Input (Powered by server-side Gemini 4 Argon HIGH thinking + local fallback)
  const [customQuery, setCustomQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    source: string;
    analysis: string;
    recommendedCommand?: string;
  } | null>(null);

  const activePreset: TroubleshootingPreset =
    TROUBLESHOOTING_PRESETS.find((p) => p.id === selectedPresetId) ||
    TROUBLESHOOTING_PRESETS[0];

  const handleCopy = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      // Fallback
    }
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const handleAnalyzeError = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customQuery.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setAiResponse(null);

    try {
      const response = await fetch('/api/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorLog: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse({
          source: data.source || 'Analisis Diagnostik Sistem',
          analysis: data.analysis,
          recommendedCommand: data.recommendedCommand,
        });
      } else {
        const localMatch = diagnoseInstallIssue(trimmed);
        setAiResponse({
          source: 'Mesin Diagnostik Lokal Windows',
          analysis: `Penyebab Terdeteksi: ${localMatch.matchedPreset.cause}\n\nLangkah Perbaikan:\n${localMatch.matchedPreset.solutionSteps
            .map((s, i) => `${i + 1}. ${s}`)
            .join('\n')}`,
          recommendedCommand: localMatch.matchedPreset.fixCommand,
        });
      }
    } catch {
      const localMatch = diagnoseInstallIssue(trimmed);
      setAiResponse({
        source: 'Mesin Diagnostik Lokal Windows',
        analysis: `Penyebab Terdeteksi: ${localMatch.matchedPreset.cause}\n\nLangkah Perbaikan:\n${localMatch.matchedPreset.solutionSteps
          .map((s, i) => `${i + 1}. ${s}`)
          .join('\n')}`,
        recommendedCommand: localMatch.matchedPreset.fixCommand,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="troubleshooting" className="scroll-mt-24 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-sky-700">Panduan Pemecahan Masalah</span>
          <span aria-hidden="true">·</span>
          <span>Solusi Error Umum Windows 10 & Windows 11</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Troubleshooting & Diagnostik Instalasi
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
          Mengalami kendala saat menjalankan perintah di PowerShell atau Command Prompt? Pilih kasus
          error yang paling sering terjadi di bawah ini atau tempel pesan error terminal Anda untuk
          mendapatkan langkah perbaikan instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Preset Error Selector & Solution Viewer */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700">
              Pilih Gejala Error di Windows Terminal:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TROUBLESHOOTING_PRESETS.map((preset) => {
                const isSelected = preset.id === activePreset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/90 border-sky-300 text-slate-900'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-semibold line-clamp-1">{preset.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{preset.symptom}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Error Detail */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-500">Contoh Pesan Error di Terminal:</div>
              <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
                {activePreset.errorSnippet}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Akar Penyebab:</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{activePreset.cause}</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Langkah Perbaikan:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-700 leading-relaxed">
                {activePreset.solutionSteps.map((stepText, idx) => (
                  <li key={idx}>{stepText}</li>
                ))}
              </ol>
            </div>

            {activePreset.fixCommand && (
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-400">Perintah Perbaikan Cepat:</div>
                  <code className="text-xs font-mono text-emerald-300">
                    {activePreset.fixCommand}
                  </code>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRunInSimulator(activePreset.fixCommand!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-sky-300 bg-sky-950 hover:bg-sky-900 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Coba di Simulator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(activePreset.fixCommand!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedCmd === activePreset.fixCommand ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Deep Diagnostic Assistant */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900">
                Asisten Diagnostik Log Error
              </h3>
            </div>
            <span className="text-xs text-slate-500">Penalaran Mendalam</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Tempelkan baris error dari PowerShell atau Command Prompt Anda di bawah ini untuk
            menganalisis penyebab spesifik dan mendapatkan perintah solusinya.
          </p>

          <form onSubmit={handleAnalyzeError} className="space-y-3">
            <div>
              <label htmlFor="error-log-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                Pesan Error / Keluaran Terminal Windows
              </label>
              <textarea
                id="error-log-input"
                rows={4}
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Contoh: error: Microsoft Visual C++ 14.0 or greater is required atau 'lucida.exe' is not recognized..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCustomQuery(
                      "lucida.exe : The term 'lucida.exe' is not recognized as the name of a cmdlet"
                    )
                  }
                  className="text-xs text-sky-700 hover:underline cursor-pointer"
                >
                  Contoh Error PATH
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() =>
                    setCustomQuery(
                      'error: Microsoft Visual C++ 14.0 or greater is required'
                    )
                  }
                  className="text-xs text-sky-700 hover:underline cursor-pointer"
                >
                  Contoh Error C++
                </button>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !customQuery.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menganalisis Log...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analisis Solusi</span>
                    <Send className="w-3 h-3 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {aiResponse && (
            <div
              data-testid="diagnostic-result"
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-800">Hasil Analisis Diagnostik</span>
                <span>{aiResponse.source}</span>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {aiResponse.analysis}
              </div>
              {aiResponse.recommendedCommand && (
                <div className="pt-1 flex items-center justify-between gap-2 bg-slate-900 text-emerald-300 px-3 py-2 rounded font-mono text-xs">
                  <span className="truncate">{aiResponse.recommendedCommand}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(aiResponse.recommendedCommand!)}
                    className="text-slate-300 hover:text-white text-xs underline shrink-0 cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
