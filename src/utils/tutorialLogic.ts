import { TROUBLESHOOTING_PRESETS, TroubleshootingPreset } from '../data/tutorialData';

export interface TerminalEnvState {
  pythonInstalled: boolean;
  cppInstalled: boolean;
  pipUpgraded: boolean;
  pipxInstalled: boolean;
  pipxPathConfigured: boolean;
  lucidadlInstalled: boolean;
  terminalRestartedAfterPath: boolean;
}

export interface TerminalExecutionResult {
  outputLines: string[];
  status: 'success' | 'warning' | 'error' | 'info';
  nextState: TerminalEnvState;
  completedStepId?: string;
}

export const INITIAL_TERMINAL_ENV: TerminalEnvState = {
  pythonInstalled: true,
  cppInstalled: true,
  pipUpgraded: false,
  pipxInstalled: false,
  pipxPathConfigured: false,
  lucidadlInstalled: false,
  terminalRestartedAfterPath: true,
};

export function simulateCommand(
  rawCommand: string,
  currentEnv: TerminalEnvState
): TerminalExecutionResult {
  const trimmed = rawCommand.trim();
  const normalized = trimmed.toLowerCase().replace(/\s+/g, ' ');

  if (!trimmed) {
    return {
      outputLines: [],
      status: 'info',
      nextState: { ...currentEnv },
    };
  }

  if (normalized === 'cls' || normalized === 'clear') {
    return {
      outputLines: ['__CLEAR__'],
      status: 'info',
      nextState: { ...currentEnv },
    };
  }

  if (normalized === 'help') {
    return {
      outputLines: [
        'Daftar perintah instalasi yang tersedia di simulator ini:',
        '  1. python --version',
        '  2. python -m ensurepip --upgrade',
        '  3. python -m pip install pipx',
        '  4. python -m pipx ensurepath',
        '  5. python -m pipx install lucidadl',
        '  6. lucida.exe',
        '  7. lucida.exe --help',
        '  8. cls (bersihkan layar terminal)',
      ],
      status: 'info',
      nextState: { ...currentEnv },
    };
  }

  if (normalized === 'python --version' || normalized === 'py --version') {
    if (!currentEnv.pythonInstalled) {
      return {
        outputLines: [
          "python : The term 'python' is not recognized as the name of a cmdlet.",
          '[Solusi] Pastikan Python sudah diinstal dan "Add python.exe to PATH" dicentang.',
        ],
        status: 'error',
        nextState: { ...currentEnv },
      };
    }
    return {
      outputLines: [
        'Python 3.12.1 (tags/v3.12.1:2305ca5, Dec  7 2023, 22:03:25) [MSC v.1937 64 bit (AMD64)]',
        '[OK] Python terdeteksi di PATH Windows.',
      ],
      status: 'success',
      nextState: { ...currentEnv },
      completedStepId: 'step-1-python',
    };
  }

  if (normalized === 'where cl') {
    if (!currentEnv.cppInstalled) {
      return {
        outputLines: [
          'INFO: Could not find files for the given pattern(s).',
          '[Peringatan] Microsoft Visual C++ Build Tools belum terdeteksi.',
        ],
        status: 'warning',
        nextState: { ...currentEnv },
      };
    }
    return {
      outputLines: [
        'C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools\\VC\\Tools\\MSVC\\14.39.33519\\bin\\Hostx64\\x64\\cl.exe',
        '[OK] Kompilator Microsoft C++ Build Tools v143 siap digunakan.',
      ],
      status: 'success',
      nextState: { ...currentEnv },
      completedStepId: 'step-2-cpp',
    };
  }

  if (
    normalized === 'python -m ensurepip --upgrade' ||
    normalized === 'py -m ensurepip --upgrade'
  ) {
    return {
      outputLines: [
        'Looking in links: c:\\Users\\DevUser\\AppData\\Local\\Temp\\tmp8k2x9_1z',
        'Requirement already satisfied: setuptools in c:\\Users\\DevUser\\AppData\\Local\\Programs\\Python\\Python312\\Lib\\site-packages (69.0.2)',
        'Successfully installed pip-24.0',
        '[OK] Modul pip berhasil diinisialisasi dan diperbarui.',
      ],
      status: 'success',
      nextState: {
        ...currentEnv,
        pipUpgraded: true,
      },
      completedStepId: 'step-3-ensurepip',
    };
  }

  if (
    normalized === 'python -m pip install pipx' ||
    normalized === 'py -m pip install pipx'
  ) {
    return {
      outputLines: [
        'Collecting pipx',
        '  Downloading pipx-1.6.0-py3-none-any.whl.metadata (15 kB)',
        'Collecting userpath>=1.9.1 (from pipx)',
        'Collecting argcomplete>=1.9.4 (from pipx)',
        'Collecting packaging>=20.0 (from pipx)',
        'Installing collected packages: userpath, packaging, argcomplete, pipx',
        'Successfully installed argcomplete-3.2.3 packaging-24.0 pipx-1.6.0 userpath-1.9.2',
        '[OK] Paket pipx berhasil terinstal. Lanjutkan dengan: python -m pipx ensurepath',
      ],
      status: 'success',
      nextState: {
        ...currentEnv,
        pipxInstalled: true,
      },
    };
  }

  if (
    normalized === 'python -m pipx ensurepath' ||
    normalized === 'py -m pipx ensurepath'
  ) {
    if (!currentEnv.pipxInstalled) {
      return {
        outputLines: [
          'C:\\Python312\\python.exe: No module named pipx',
          '[Solusi] Jalankan "python -m pip install pipx" terlebih dahulu.',
        ],
        status: 'error',
        nextState: { ...currentEnv },
      };
    }
    return {
      outputLines: [
        'Success! Added C:\\Users\\DevUser\\.local\\bin to the PATH environment variable.',
        'Consider adding shell completions for pipx. Run "pipx completions" for instructions.',
        'You will need to open a new terminal or re-login for the PATH changes to take effect.',
        '[OK] PATH pipx terdaftar. Lanjutkan dengan: python -m pipx install lucidadl',
      ],
      status: 'success',
      nextState: {
        ...currentEnv,
        pipxPathConfigured: true,
      },
    };
  }

  if (
    normalized === 'python -m pipx install lucidadl' ||
    normalized === 'py -m pipx install lucidadl'
  ) {
    if (!currentEnv.pipxInstalled) {
      return {
        outputLines: [
          'C:\\Python312\\python.exe: No module named pipx',
          '[Solusi] Instal pipx terlebih dahulu dengan: python -m pip install pipx',
        ],
        status: 'error',
        nextState: { ...currentEnv },
      };
    }
    if (!currentEnv.cppInstalled) {
      return {
        outputLines: [
          'Installing to existing venv "lucidadl"...',
          'error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools".',
          '[Error] Silakan instal Microsoft C++ Build Tools pada Langkah 02.',
        ],
        status: 'error',
        nextState: { ...currentEnv },
      };
    }
    return {
      outputLines: [
        'Creating virtual environment for lucidadl...',
        'Installing lucidadl from PyPI (compiling native extensions with MSVC v143)...',
        '  installed package lucidadl 1.2.0, installed using Python 3.12.1',
        '  These apps are now globally available:',
        '    - lucida.exe',
        'done! ✨ 🌟 ✨',
        '[OK] Instalasi lucidadl selesai! Sekarang ketik: lucida.exe',
      ],
      status: 'success',
      nextState: {
        ...currentEnv,
        lucidadlInstalled: true,
      },
      completedStepId: 'step-4-pipx',
    };
  }

  if (
    normalized === 'lucida.exe' ||
    normalized === 'lucida' ||
    normalized === './lucida.exe' ||
    normalized === '.\\lucida.exe' ||
    normalized.startsWith('lucida.exe ')
  ) {
    if (!currentEnv.lucidadlInstalled) {
      return {
        outputLines: [
          "lucida.exe : The term 'lucida.exe' is not recognized as the name of a cmdlet, function, script file, or operable program.",
          '[Belum Terinstal] Jalankan urutan perintah pada Langkah 04 (pipx install lucidadl) terlebih dahulu.',
        ],
        status: 'error',
        nextState: { ...currentEnv },
      };
    }

    if (normalized.includes('--help') || normalized.includes('-h')) {
      return {
        outputLines: [
          'LucidaDL CLI v1.2.0 (Windows x64 - MSVC 1937)',
          'Usage: lucida.exe [OPTIONS] <URL_OR_QUERY>',
          '',
          'Options:',
          '  -o, --output <DIR>     Direktori penyimpanan unduhan (default: .\\Downloads)',
          '  -f, --format <FMT>     Format berkas keluaran (flac, mp3, wav, original)',
          '  -r, --retries <NUM>    Jumlah percobaan ulang otomatis saat koneksi terputus (default: 3)',
          '  -v, --verbose          Tampilkan log diagnostik secara mendetail',
          '  -h, --help             Tampilkan halaman bantuan ini',
        ],
        status: 'success',
        nextState: { ...currentEnv },
        completedStepId: 'step-5-run-lucida',
      };
    }

    return {
      outputLines: [
        '==============================================================',
        '  LUCIDADL CLI v1.2.0 · Windows Native Runtime Active',
        '  Binary Path : C:\\Users\\DevUser\\.local\\bin\\lucida.exe',
        '  Environment : Python 3.12.1 (Isolated pipx venv)',
        '==============================================================',
        '[status] LucidaDL siap menerima perintah! Ketik "lucida.exe --help" untuk melihat opsi parameter.',
      ],
      status: 'success',
      nextState: { ...currentEnv },
      completedStepId: 'step-5-run-lucida',
    };
  }

  return {
    outputLines: [
      `PS C:\\Users\\DevUser> Perintah "${trimmed}" dieksekusi.`,
      'Ketik "help" untuk melihat daftar perintah instalasi lucidadl yang didukung di simulator.',
    ],
    status: 'info',
    nextState: { ...currentEnv },
  };
}

export interface ProgressSummary {
  completedCount: number;
  totalCount: number;
  percentage: number;
  isAllComplete: boolean;
  nextStepId: string | null;
}

export function calculateProgress(
  completedSteps: string[],
  allStepIds: string[]
): ProgressSummary {
  const uniqueCompleted = new Set(
    completedSteps.filter((id) => allStepIds.includes(id))
  );
  const completedCount = uniqueCompleted.size;
  const totalCount = allStepIds.length;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const nextStepId =
    allStepIds.find((id) => !uniqueCompleted.has(id)) ?? null;

  return {
    completedCount,
    totalCount,
    percentage,
    isAllComplete: totalCount > 0 && completedCount === totalCount,
    nextStepId,
  };
}

export function generateBatchPowerShellScript(options: {
  includeEnsurePip: boolean;
  includeEnsurePath: boolean;
  autoRunLucida: boolean;
}): string {
  const lines: string[] = [
    '# Skrip Otomatis Instalasi LucidaDL untuk Windows PowerShell',
    '# Prasyarat: Python 3.10+ (Add to PATH) & Microsoft C++ Build Tools sudah terinstal',
    '',
  ];

  if (options.includeEnsurePip) {
    lines.push('python -m ensurepip --upgrade');
  }

  lines.push('python -m pip install pipx');

  if (options.includeEnsurePath) {
    lines.push('python -m pipx ensurepath');
  }

  lines.push('python -m pipx install lucidadl');

  if (options.autoRunLucida) {
    lines.push('lucida.exe');
  }

  return lines.join('\n');
}

export function diagnoseInstallIssue(query: string): {
  matchedPreset: TroubleshootingPreset;
  confidence: 'high' | 'medium';
} {
  const q = query.toLowerCase();

  if (
    q.includes('c++') ||
    q.includes('14.0') ||
    q.includes('msvc') ||
    q.includes('build tools') ||
    q.includes('cl.exe')
  ) {
    return {
      matchedPreset: TROUBLESHOOTING_PRESETS[1],
      confidence: 'high',
    };
  }

  if (
    q.includes('lucida.exe') ||
    q.includes('ensurepath') ||
    q.includes('.local\\bin') ||
    (q.includes('lucida') && q.includes('not recognized'))
  ) {
    return {
      matchedPreset: TROUBLESHOOTING_PRESETS[2],
      confidence: 'high',
    };
  }

  if (
    q.includes('executionpolicy') ||
    q.includes('running scripts is disabled') ||
    q.includes('pssecurityexception') ||
    q.includes('remotesigned')
  ) {
    return {
      matchedPreset: TROUBLESHOOTING_PRESETS[3],
      confidence: 'high',
    };
  }

  return {
    matchedPreset: TROUBLESHOOTING_PRESETS[0],
    confidence: q.includes('python') || q.includes('path') ? 'high' : 'medium',
  };
}
