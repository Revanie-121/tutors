import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { diagnoseInstallIssue } from './src/utils/tutorialLogic';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.post('/api/troubleshoot', async (req, res) => {
  const { errorLog } = req.body ?? {};
  if (!errorLog || typeof errorLog !== 'string') {
    res.status(400).json({ error: 'Parameter errorLog wajib diisi.' });
    return;
  }

  const localFallback = diagnoseInstallIssue(errorLog);
  const ai = getGeminiClient();

  if (!ai) {
    res.json({
      source: 'Diagnostik Cepat Windows',
      analysis: `Penyebab Terdeteksi:\n${localFallback.matchedPreset.cause}\n\nLangkah Perbaikan:\n${localFallback.matchedPreset.solutionSteps
        .map((s, idx) => `${idx + 1}. ${s}`)
        .join('\n')}`,
      recommendedCommand: localFallback.matchedPreset.fixCommand,
    });
    return;
  }

  try {
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
    res.json({
      source: 'Analisis Mendalam Gemini 4 Argon (High Thinking)',
      analysis: text.trim(),
      recommendedCommand: localFallback.matchedPreset.fixCommand,
    });
  } catch (err) {
    res.json({
      source: 'Diagnostik Cepat Windows',
      analysis: `Penyebab Terdeteksi:\n${localFallback.matchedPreset.cause}\n\nLangkah Perbaikan:\n${localFallback.matchedPreset.solutionSteps
        .map((s, idx) => `${idx + 1}. ${s}`)
        .join('\n')}`,
      recommendedCommand: localFallback.matchedPreset.fixCommand,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
