import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { diagnoseInstallIssue } from '../src/utils/tutorialLogic';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { errorLog } = req.body ?? {};
  if (!errorLog || typeof errorLog !== 'string') {
    res.status(400).json({ error: 'Parameter errorLog wajib diisi.' });
    return;
  }

  const localFallback = diagnoseInstallIssue(errorLog);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.status(200).json({
      source: 'Diagnostik Cepat Windows',
      analysis: `Penyebab Terdeteksi:\n${localFallback.matchedPreset.cause}\n\nLangkah Perbaikan:\n${localFallback.matchedPreset.solutionSteps
        .map((s, idx) => `${idx + 1}. ${s}`)
        .join('\n')}`,
      recommendedCommand: localFallback.matchedPreset.fixCommand,
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: `Pengguna sedang menginstal tools lucidadl di Windows dengan tahapan:
1. Install Python (https://python.org/downloads/)
2. Install Microsoft C++ Build Tools (Desktop development with C++)
3. python -m ensurepip --upgrade
4. python -m pip install pipx && python -m pipx ensurepath && python -m pipx install lucidadl
5. lucida.exe

Pengguna mengalami pesan error atau kendala berikut di terminal Windows:
"${errorLog}"

Berikan solusi teknis yang ringkas, jelas, dan langsung ke inti permasalahan dalam Bahasa Indonesia (maksimal 120 kata), disertai perintah perbaikan jika ada.`,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const text = response.text || '';
    res.status(200).json({
      source: 'Analisis Mendalam Gemini 4 Argon (High Thinking)',
      analysis: text.trim(),
      recommendedCommand: localFallback.matchedPreset.fixCommand,
    });
  } catch {
    res.status(200).json({
      source: 'Diagnostik Cepat Windows',
      analysis: `Penyebab Terdeteksi:\n${localFallback.matchedPreset.cause}\n\nLangkah Perbaikan:\n${localFallback.matchedPreset.solutionSteps
        .map((s, idx) => `${idx + 1}. ${s}`)
        .join('\n')}`,
      recommendedCommand: localFallback.matchedPreset.fixCommand,
    });
  }
}
