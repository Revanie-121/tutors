import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Terminal,
  CheckCircle2,
  Circle,
  ZoomIn,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TutorialStep } from '../data/tutorialData';
import { STEP_IMAGES } from '../data/tutorialImages';

interface StepCardProps {
  step: TutorialStep;
  isCompleted: boolean;
  onToggleComplete: (stepId: string) => void;
  onRunInSimulator: (command: string) => void;
  onInspectImage: (image: { src: string; alt: string; caption: string }) => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  isCompleted,
  onToggleComplete,
  onRunInSimulator,
  onInspectImage,
}) => {
  const resolvedImageSrc = STEP_IMAGES[step.id] || step.illustration.src;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSubChapters, setExpandedSubChapters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    step.subChapters.forEach((sc) => {
      initial[sc.id] = true;
    });
    return initial;
  });
  const [imgError, setImgError] = useState(false);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  const toggleSubChapter = (subId: string) => {
    setExpandedSubChapters((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const handleCopyAllStepCommands = () => {
    const combined = step.commands.map((c) => c.command).join('\n');
    handleCopy(`all-${step.id}`, combined);
  };

  return (
    <article
      id={step.id}
      className={`scroll-mt-24 rounded-xl border transition-colors bg-white ${
        isCompleted ? 'border-emerald-300/90' : 'border-slate-200'
      } p-6 md:p-8`}
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          {/* Unboxed static metadata with middle dots (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-sky-700">Langkah {step.number}</span>
            <span aria-hidden="true">·</span>
            <span>{step.requirementLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{step.estimatedTime}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight balance-text">
            {step.number}. {step.title}
          </h3>
        </div>

        {/* Completion Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onToggleComplete(step.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Langkah {step.number} Selesai</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span>Tandai Selesai ({step.number})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Split: Left Instructions & Commands, Right Visual Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{step.overview}</p>

          {/* Official Download Link if applicable */}
          {step.externalUrl && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-medium text-slate-500">Tautan Unduhan Resmi</div>
                <div className="text-xs font-mono text-slate-700 truncate">{step.externalUrl.url}</div>
              </div>
              <a
                href={step.externalUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (!isCompleted) onToggleComplete(step.id);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>{step.externalUrl.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Terminal Commands Box */}
          {step.commands.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Perintah Terminal ({step.commands.length} perintah)
                </span>
                {step.commands.length > 1 && (
                  <button
                    type="button"
                    onClick={handleCopyAllStepCommands}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedId === `all-${step.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Semua Perintah Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin {step.commands.length} Perintah Sekaligus</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {step.commands.map((cmdItem) => {
                  const isCopied = copiedId === cmdItem.id;
                  return (
                    <div
                      key={cmdItem.id}
                      className="rounded-lg border border-slate-800 bg-[#0F172A] overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[#1E293B] border-b border-slate-800">
                        <span className="text-xs font-medium text-slate-300">{cmdItem.label}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRunInSimulator(cmdItem.command)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-300 hover:text-white bg-sky-950/80 hover:bg-sky-800 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Terminal className="w-3 h-3" />
                            <span>Uji di Simulator</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(cmdItem.id, cmdItem.command)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="p-3.5 flex items-center justify-between gap-4 overflow-x-auto">
                        <code className="text-sm font-mono text-emerald-300 select-all">
                          {cmdItem.command}
                        </code>
                      </div>
                      <div className="px-3.5 py-2 bg-slate-900/70 border-t border-slate-800/80 text-xs text-slate-400">
                        {cmdItem.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Chapters ("Sub-bab penting dalam tahap penginstalan") */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-700">
              Sub-Bab Penting & Catatan Teknis ({step.subChapters.length} bagian)
            </div>
            <div className="space-y-3">
              {step.subChapters.map((sub) => {
                const isExpanded = !!expandedSubChapters[sub.id];
                return (
                  <div
                    key={sub.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSubChapter(sub.id)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-slate-100/80 transition-colors cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs text-slate-500 font-medium">
                          <span>{sub.code}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{sub.summary}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{sub.title}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-200/70 bg-white">
                        <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-600 leading-relaxed">
                          {sub.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ol>

                        {sub.criticalNote && (
                          <div className="p-3 rounded-lg bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">Penting: </span>
                              {sub.criticalNote}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Installation Example Image */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Contoh Visual Saat Penginstalan
              </span>
              <button
                type="button"
                onClick={() =>
                  onInspectImage({
                    ...step.illustration,
                    src: resolvedImageSrc,
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Perbesar Gambar</span>
              </button>
            </div>

            {!imgError ? (
              <div className="relative group bg-slate-900 aspect-video overflow-hidden">
                <img
                  src={resolvedImageSrc}
                  alt={step.illustration.alt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3.5 flex items-end justify-between gap-2">
                  <span className="text-xs font-medium text-white">
                    Fokus Utama: {step.illustration.highlightPoint}
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-slate-900 text-slate-200 p-6 flex flex-col items-center justify-center text-center gap-2">
                <Terminal className="w-8 h-8 text-sky-400" />
                <div className="text-sm font-semibold">{step.title}</div>
                <div className="text-xs text-slate-400">{step.illustration.highlightPoint}</div>
              </div>
            )}

            <div className="p-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
              {step.illustration.caption}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
