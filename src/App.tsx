import React, { useState } from 'react';
import {
  Check,
  Copy,
  Terminal,
  CheckCircle2,
  ExternalLink,
  X,
  BookOpen,
  Play,
  Layers,
} from 'lucide-react';
import { TUTORIAL_STEPS, TutorialStep } from './data/tutorialData';
import {
  INITIAL_TERMINAL_ENV,
  TerminalEnvState,
  calculateProgress,
  generateBatchPowerShellScript,
} from './utils/tutorialLogic';
import { TerminalSimulator } from './components/TerminalSimulator';
import { StepCard } from './components/StepCard';
import { TroubleshootingSection } from './components/TroubleshootingSection';

export default function App() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'prerequisite' | 'terminal' | 'execution'
  >('all');
  const [envState, setEnvState] = useState<TerminalEnvState>(INITIAL_TERMINAL_ENV);
  const [externalCommandRequest, setExternalCommandRequest] = useState<{
    command: string;
    nonce: number;
  } | null>(null);
  const [copiedFullScript, setCopiedFullScript] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
    caption: string;
  } | null>(null);

  const allStepIds = TUTORIAL_STEPS.map((s) => s.id);
  const progress = calculateProgress(completedSteps, allStepIds);

  const filteredSteps: TutorialStep[] =
    categoryFilter === 'all'
      ? TUTORIAL_STEPS
      : TUTORIAL_STEPS.filter((s) => s.category === categoryFilter);

  const handleToggleComplete = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleMarkStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
  };

  const handleRunInSimulator = (command: string) => {
    setExternalCommandRequest({ command, nonce: Date.now() + Math.random() });
    const simEl = document.getElementById('simulator-stage');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyFullScript = async () => {
    const script = generateBatchPowerShellScript({
      includeEnsurePip: true,
      includeEnsurePath: true,
      autoRunLucida: true,
    });
    try {
      await navigator.clipboard.writeText(script);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = script;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedFullScript(true);
    setTimeout(() => setCopiedFullScript(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            LucidaDL Windows Guide
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#prasyarat"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Prasyarat Sistem
            </a>
            <a
              href="#langkah-instalasi"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Langkah Instalasi
            </a>
            <a
              href="#simulator-stage"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Simulator CLI
            </a>
            <a
              href="#troubleshooting"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Troubleshooting
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyFullScript}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedFullScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Skrip Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Skrip Lengkap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-16">
        {/* Hero & Interactive Sandbox Two-Zone Stage */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Editorial Overview & Quick Summary */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-white p-6 md:p-8 rounded-xl border border-slate-200">
            <div className="space-y-4">
              {/* Unboxed metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-sky-700">Tutorial Instalasi Windows</span>
                <span aria-hidden="true">·</span>
                <span>Windows 10 & Windows 11 (64-bit)</span>
                <span aria-hidden="true">·</span>
                <span>5 Tahap Lengkap</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight balance-text">
                Cara Menginstal & Menjalankan Tools LucidaDL di Windows
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Panduan teknis lengkap mulai dari instalasi interpreter{' '}
                <strong className="font-semibold text-slate-800">Python</strong>, konfigurasi
                kompilator <strong className="font-semibold text-slate-800">Microsoft C++ Build Tools</strong>,
                pembaruan <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">ensurepip</code>,
                isolasi lingkungan dengan <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">pipx</code>,
                hingga eksekusi <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">lucida.exe</code>.
              </p>

              {/* Progress Tracker Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Progres Penyelesaian Instalasi Anda
                  </span>
                  <span
                    data-testid="progress-counter"
                    className="font-mono font-semibold text-sky-700 tabular-nums"
                  >
                    {progress.completedCount} / {progress.totalCount} Langkah Selesai ({progress.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 transition-all duration-200"
                    style={{ width: `${Math.max(progress.percentage, 4)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {progress.isAllComplete
                      ? 'Seluruh langkah instalasi selesai! lucida.exe siap digunakan.'
                      : 'Centang setiap langkah di bawah setelah Anda menyelesaikannya di PC Anda.'}
                  </span>
                  {completedSteps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCompletedSteps([])}
                      className="text-slate-600 hover:text-slate-900 underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Reset Progres
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Summary of the 5 Steps */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700">
                Ringkasan Cepat 5 Perintah Utama:
              </div>
              <div className="p-3.5 rounded-lg bg-[#0F172A] border border-slate-800 font-mono text-xs text-slate-200 space-y-1 overflow-x-auto">
                <div className="text-slate-400"># 1 & 2. Instal Python (Add to PATH) & Microsoft C++ Build Tools</div>
                <div className="text-emerald-300">python -m ensurepip --upgrade</div>
                <div className="text-emerald-300">python -m pip install pipx</div>
                <div className="text-emerald-300">python -m pipx ensurepath</div>
                <div className="text-emerald-300">python -m pipx install lucidadl</div>
                <div className="text-sky-300">lucida.exe</div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#langkah-instalasi"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mulai Panduan Langkah demi Langkah</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleRunInSimulator('python -m ensurepip --upgrade')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-sky-600" />
                  <span>Coba di Simulator Terminal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive PowerShell Simulator */}
          <div id="simulator-stage" className="lg:col-span-6 flex flex-col scroll-mt-24">
            <TerminalSimulator
              envState={envState}
              onUpdateEnvState={setEnvState}
              onCompleteStep={handleMarkStepComplete}
              externalCommandRequest={externalCommandRequest}
            />
          </div>
        </section>

        {/* Prerequisites Matrix Section */}
        <section id="prasyarat" className="scroll-mt-24 bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-sky-700">Bagian 0 · Prasyarat & Arsitektur</span>
                <span aria-hidden="true">·</span>
                <span>Komponen Wajib Sebelum Eksekusi CLI</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Daftar Tools yang Dibutuhkan di Windows
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Pastikan kedua installer prasyarat di bawah ini diunduh dari situs resmi pengembangnya
              sebelum menjalankan perintah instalasi pipx.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-medium">
                  <span>Komponen 01</span>
                  <span aria-hidden="true"> · </span>
                  <span>Runtime Utama</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Python 3.10+ (64-bit)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyediakan interpreter bahasa Python beserta modul{' '}
                  <code className="font-mono">ensurepip</code> untuk menyiapkan lingkungan paket.
                  Wajib mencentang opsi <strong>Add python.exe to PATH</strong>.
                </p>
              </div>
              <a
                href="https://python.org/downloads/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 pt-2 whitespace-nowrap shrink-0"
              >
                <span>python.org/downloads</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-medium">
                  <span>Komponen 02</span>
                  <span aria-hidden="true"> · </span>
                  <span>Kompilator C/C++</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Microsoft C++ Build Tools</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyediakan kompilator MSVC v143 dan Windows SDK yang diperlukan saat membangun
                  modul ekstensi native selama proses <code className="font-mono">pipx install lucidadl</code>.
                </p>
              </div>
              <a
                href="https://visualstudio.microsoft.com/visual-cpp-build-tools/#:~:text=Visual%20Studio%20Build%20Tools%20for,and%20scripts%20Download%20Build%20Tools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 pt-2 whitespace-nowrap shrink-0"
              >
                <span>visualstudio.microsoft.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-medium">
                  <span>Komponen 03</span>
                  <span aria-hidden="true"> · </span>
                  <span>Manajer Aplikasi CLI</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Pipx & Terminal Windows</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengisolasi instalasi <code className="font-mono">lucidadl</code> dalam virtual
                  environment khusus dan mendaftarkan file eksekusi <code className="font-mono">lucida.exe</code>{' '}
                  secara otomatis ke PATH pengguna.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-700 pt-2">
                Diinstal via: python -m pip install pipx
              </div>
            </div>
          </div>
        </section>

        {/* Detailed 5-Step Installation Guide with Filter Controls */}
        <section id="langkah-instalasi" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-sky-700">Panduan Lengkap Berurutan</span>
                <span aria-hidden="true">·</span>
                <span>Dilengkapi Sub-Bab Penting & Ilustrasi Tahap Instalasi</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Tahapan Instalasi LucidaDL di Windows
              </h2>
            </div>

            {/* Functional Segmented Filter Controls */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/75 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Tahap (5)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('prerequisite')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === 'prerequisite'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1–2. Unduhan & Installer (2)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('terminal')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === 'terminal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3–4. Perintah Terminal (2)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('execution')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === 'execution'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5. Eksekusi Lucida.exe (1)
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {filteredSteps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                isCompleted={completedSteps.includes(step.id)}
                onToggleComplete={handleToggleComplete}
                onRunInSimulator={handleRunInSimulator}
                onInspectImage={(img) => setLightboxImage(img)}
              />
            ))}
          </div>
        </section>

        {/* Troubleshooting & AI Diagnostic Section */}
        <TroubleshootingSection onRunInSimulator={handleRunInSimulator} />
      </main>

      {/* Clean Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Panduan Instalasi LucidaDL untuk Windows · Disusun untuk mempermudah instalasi Python,
            Microsoft C++ Build Tools, Pipx, dan Lucida CLI.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://python.org/downloads/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 underline-offset-4 hover:underline"
            >
              Python Downloads
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://visualstudio.microsoft.com/visual-cpp-build-tools/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 underline-offset-4 hover:underline"
            >
              Microsoft C++ Build Tools
            </a>
          </div>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Gambar Instalasi"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <span className="text-xs font-semibold text-white">{lightboxImage.alt}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Tutup Pratinjau Gambar"
                className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black flex items-center justify-center">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="px-4 py-3 bg-slate-900 text-xs text-slate-300">
              {lightboxImage.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
