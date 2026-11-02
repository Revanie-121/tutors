export interface SubChapter {
  id: string;
  code: string;
  title: string;
  summary: string;
  details: string[];
  criticalNote?: string;
  verificationCommand?: {
    command: string;
    expectedOutput: string;
  };
}

export interface CommandItem {
  id: string;
  command: string;
  label: string;
  explanation: string;
}

export interface TutorialStep {
  id: string;
  number: string;
  title: string;
  category: 'prerequisite' | 'terminal' | 'execution';
  estimatedTime: string;
  requirementLevel: string;
  overview: string;
  externalUrl?: {
    label: string;
    url: string;
    domain: string;
  };
  commands: CommandItem[];
  subChapters: SubChapter[];
  illustration: {
    src: string;
    alt: string;
    caption: string;
    highlightPoint: string;
  };
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'step-1-python',
    number: '01',
    title: 'Menginstal Python untuk Windows',
    category: 'prerequisite',
    estimatedTime: 'Estimasi 3 menit',
    requirementLevel: 'Wajib · Python 3.10 atau lebih baru',
    overview:
      'LucidaDL dibangun di atas ekosistem Python modern. Anda wajib menginstal interpreter Python resmi untuk Windows dan memastikan variabel PATH sistem dikonfigurasi agar perintah python dapat dikenali dari terminal mana pun.',
    externalUrl: {
      label: 'Unduh Installer Resmi di Python.org',
      url: 'https://python.org/downloads/',
      domain: 'python.org/downloads',
    },
    commands: [
      {
        id: 'cmd-py-ver',
        command: 'python --version',
        label: 'Verifikasi Instalasi Python',
        explanation: 'Memastikan perintah python sudah terdaftar di PATH Windows dan menampilkan versi 3.10+.',
      },
    ],
    subChapters: [
      {
        id: 'sub-1-1',
        code: 'Sub-bab 1.1',
        title: 'Wajib Mencentang "Add python.exe to PATH"',
        summary: 'Langkah paling krusial saat jendela instalasi pertama kali terbuka.',
        details: [
          'Jalankan file installer Python (.exe) yang telah diunduh dari halaman resmi python.org/downloads.',
          'Pada bagian paling bawah jendela awal installer, centang kotak "Add python.exe to PATH" sebelum menekan tombol "Install Now".',
          'Apabila kotak ini terlewat, Windows PowerShell dan Command Prompt tidak akan mengenali perintah python di tahap berikutnya.',
        ],
        criticalNote:
          'Jika Anda terlanjur menginstal tanpa mencentang PATH, jalankan ulang file installer Python, pilih "Modify", lalu aktifkan "Add Python to environment variables".',
      },
      {
        id: 'sub-1-2',
        code: 'Sub-bab 1.2',
        title: 'Menonaktifkan Path Length Limit Windows',
        summary: 'Mencegah kegagalan instalasi paket Python yang memiliki struktur direktori panjang.',
        details: [
          'Saat proses instalasi Python selesai, layar terakhir akan menampilkan opsi "Disable path length limit".',
          'Klik opsi tersebut dan setujui konfirmasi Administrator (UAC) agar Windows mengizinkan jalur file lebih dari 260 karakter.',
          'Anda juga dapat mengikuti referensi video tutorial instalasi Python di YouTube jika ingin melihat demonstrasi visual secara langsung.',
        ],
        verificationCommand: {
          command: 'python --version',
          expectedOutput: 'Python 3.12.1',
        },
      },
    ],
    illustration: {
      src: '/src/assets/images/python_installer_path_setup_1793613199285.jpg',
      alt: 'Jendela instalasi Python 3.12 di Windows dengan opsi Add python.exe to PATH dicentang',
      caption: 'Gambar 1.1 · Pastikan kotak "Add python.exe to PATH" di bagian bawah tercentang sebelum klik Install Now.',
      highlightPoint: 'Centang "Add python.exe to PATH" + Pilih "Install Now"',
    },
  },
  {
    id: 'step-2-cpp',
    number: '02',
    title: 'Menginstal Microsoft Visual C++ Build Tools',
    category: 'prerequisite',
    estimatedTime: 'Estimasi 10–15 menit',
    requirementLevel: 'Wajib · Kompilator Native C++',
    overview:
      'Beberapa dependensi pemrosesan media dan enkripsi pada lucidadl membutuhkan kompilasi ekstensi C/C++ secara lokal saat diinstal melalui pipx. Tanpa Microsoft C++ Build Tools, instalasi akan berhenti dengan pesan error "Microsoft Visual C++ 14.0 or greater is required".',
    externalUrl: {
      label: 'Unduh Visual Studio Build Tools Resmi',
      url: 'https://visualstudio.microsoft.com/visual-cpp-build-tools/#:~:text=Visual%20Studio%20Build%20Tools%20for,and%20scripts%20Download%20Build%20Tools',
      domain: 'visualstudio.microsoft.com/visual-cpp-build-tools',
    },
    commands: [
      {
        id: 'cmd-cl-check',
        command: 'where cl',
        label: 'Cek Keberadaan Kompilator MSVC (Opsional)',
        explanation: 'Memeriksa ketersediaan toolchain C++ pada Developer Command Prompt.',
      },
    ],
    subChapters: [
      {
        id: 'sub-2-1',
        code: 'Sub-bab 2.1',
        title: 'Memilih Workload "Desktop development with C++"',
        summary: 'Jangan biarkan installer kosong; pilih paket kompilator C++ yang tepat.',
        details: [
          'Buka tautan Microsoft Visual C++ Build Tools lalu klik tombol "Download Build Tools" untuk mengunduh vs_BuildTools.exe.',
          'Setelah Visual Studio Installer terbuka, pada tab "Workloads", beri tanda centang pada kartu "Desktop development with C++".',
          'Pastikan pada panel "Installation details" di sebelah kanan, komponen "MSVC v143 - VS 2022 C++ x64/x86 build tools" dan "Windows 11 SDK" (atau Windows 10 SDK) sudah ikut tercentang secara otomatis.',
        ],
        criticalNote:
          'Ukuran unduhan sekitar 6 GB. Pastikan koneksi internet stabil dan ruang penyimpanan pada drive C: mencukupi sebelum menekan tombol Install di pojok kanan bawah.',
      },
      {
        id: 'sub-2-2',
        code: 'Sub-bab 2.2',
        title: 'Restart Komputer Setelah Instalasi Selesai',
        summary: 'Memastikan registri SDK Windows dan variabel kompiler aktif sepenuhnya.',
        details: [
          'Setelah progres penginstalan Visual Studio Build Tools mencapai 100%, installer biasanya meminta "Reboot required".',
          'Simpan pekerjaan Anda dan lakukan Restart Windows terlebih dahulu sebelum melanjutkan ke langkah terminal.',
        ],
      },
    ],
    illustration: {
      src: '/src/assets/images/vs_build_tools_cpp_workload_1793613200523.jpg',
      alt: 'Tampilan Visual Studio Build Tools 2022 dengan workload Desktop development with C++ dicentang',
      caption: 'Gambar 2.1 · Pada tab Workloads, centang "Desktop development with C++" lalu klik tombol Install di kanan bawah.',
      highlightPoint: 'Pilih Workload "Desktop development with C++"',
    },
  },
  {
    id: 'step-3-ensurepip',
    number: '03',
    title: 'Membuka Terminal & Memperbarui Pip',
    category: 'terminal',
    estimatedTime: 'Estimasi 1 menit',
    requirementLevel: 'Wajib · Windows PowerShell / CMD',
    overview:
      'Setelah Python dan C++ Build Tools terpasang, buka Windows Terminal (PowerShell atau Command Prompt) dan jalankan modul ensurepip untuk memastikan pengelola paket pip terinstal dan diperbarui ke rilis terbaru.',
    commands: [
      {
        id: 'cmd-ensurepip',
        command: 'python -m ensurepip --upgrade',
        label: 'Inisialisasi & Upgrade Pip',
        explanation: 'Memastikan modul pip bawaan Python aktif dan diperbarui ke versi paling stabil.',
      },
    ],
    subChapters: [
      {
        id: 'sub-3-1',
        code: 'Sub-bab 3.1',
        title: 'Cara Membuka Terminal dengan Cepat di Windows',
        summary: 'Menggunakan pintasan keyboard Windows + X atau menu Start.',
        details: [
          'Tekan kombinasi tombol Windows + X pada keyboard, kemudian pilih "Terminal" atau "Windows PowerShell".',
          'Anda tidak wajib menggunakan mode Administrator untuk perintah ini karena instalasi akan ditempatkan di direktori pengguna lokal.',
          'Ketik atau tempel perintah python -m ensurepip --upgrade lalu tekan Enter.',
        ],
      },
      {
        id: 'sub-3-2',
        code: 'Sub-bab 3.2',
        title: 'Memahami Output ensurepip',
        summary: 'Mengetahui apakah pip sudah siap digunakan untuk menginstal pipx.',
        details: [
          'Jika pip belum ada, perintah ini akan menginstal pip dan setuptools secara otomatis.',
          'Jika pip sudah terpasang dari installer Python, terminal akan menampilkan pesan "Requirement already satisfied: pip in ..." yang menandakan sistem Anda siap ke langkah 4.',
        ],
        verificationCommand: {
          command: 'python -m ensurepip --upgrade',
          expectedOutput: 'Successfully installed pip / Requirement already satisfied',
        },
      },
    ],
    illustration: {
      src: '/src/assets/images/powershell_pipx_install_terminal_1793613201693.jpg',
      alt: 'Terminal PowerShell menjalankan perintah python -m ensurepip dan python -m pipx install lucidadl',
      caption: 'Gambar 3.1 · Eksekusi perintah di Windows PowerShell untuk menginisialisasi pip dan menginstal lucidadl.',
      highlightPoint: 'Jalankan di Windows PowerShell atau Command Prompt',
    },
  },
  {
    id: 'step-4-pipx',
    number: '04',
    title: 'Menginstal Pipx & Paket LucidaDL',
    category: 'terminal',
    estimatedTime: 'Estimasi 2–3 menit',
    requirementLevel: 'Wajib · 3 Perintah Berurutan',
    overview:
      'Pipx adalah alat standar untuk menginstal aplikasi CLI berbasis Python di dalam lingkungan virtual (virtual environment) yang terisolasi, sehingga dependensi lucidadl tidak bentrok dengan paket Python lain di komputer Anda.',
    commands: [
      {
        id: 'cmd-install-pipx',
        command: 'python -m pip install pipx',
        label: 'Langkah 4A · Instal Paket Pipx',
        explanation: 'Mengunduh dan memasang modul pipx melalui pengelola paket pip.',
      },
      {
        id: 'cmd-ensurepath',
        command: 'python -m pipx ensurepath',
        label: 'Langkah 4B · Daftarkan Direktori Pipx ke PATH',
        explanation: 'Menambahkan folder ~/.local/bin ke Environment Variables Windows agar lucida.exe bisa dipanggil dari mana saja.',
      },
      {
        id: 'cmd-install-lucidadl',
        command: 'python -m pipx install lucidadl',
        label: 'Langkah 4C · Instal Aplikasi LucidaDL',
        explanation: 'Mengunduh, mengompilasi dependensi, dan mengekspos binary lucida.exe secara global.',
      },
    ],
    subChapters: [
      {
        id: 'sub-4-1',
        code: 'Sub-bab 4.1',
        title: 'Mengapa Harus Menggunakan Pipx?',
        summary: 'Isolasi lingkungan otomatis dan registrasi binary CLI yang bersih.',
        details: [
          'Berbeda dengan pip install biasa yang mencampur semua pustaka di tingkat global, pipx membuat virtual environment khusus untuk lucidadl di C:\\Users\\<NamaUser>\\.local\\pipx\\venvs\\lucidadl.',
          'Selain itu, pipx secara otomatis membuat file eksekusi lucida.exe di dalam folder C:\\Users\\<NamaUser>\\.local\\bin.',
        ],
      },
      {
        id: 'sub-4-2',
        code: 'Sub-bab 4.2',
        title: 'Wajib Restart Jendela Terminal Setelah "pipx ensurepath"',
        summary: 'Langkah penting agar perintah lucida.exe langsung dikenali.',
        details: [
          'Setelah Anda menjalankan python -m pipx ensurepath, Windows memperbarui daftar PATH pengguna.',
          'Namun jendela terminal yang sedang terbuka belum memuat perubahan PATH tersebut.',
          'Setelah ketiga perintah di Langkah 4 selesai dijalankan, TUTUP jendela terminal Anda dan buka jendela terminal baru sebelum menjalankan lucida.exe.',
        ],
        criticalNote:
          'Melewatkan penutupan dan pembukaan ulang jendela terminal setelah pipx ensurepath adalah penyebab nomor satu munculnya pesan error "lucida.exe is not recognized".',
      },
    ],
    illustration: {
      src: '/src/assets/images/powershell_pipx_install_terminal_1793613201693.jpg',
      alt: 'Output sukses instalasi pipx dan lucidadl di Windows Terminal',
      caption: 'Gambar 4.1 · Tanda centang hijau menunjukkan virtual environment lucidadl berhasil dibuat dan diekspos ke PATH.',
      highlightPoint: 'Pastikan muncul pesan "These apps are now globally available"',
    },
  },
  {
    id: 'step-5-run-lucida',
    number: '05',
    title: 'Menjalankan Tools LucidaDL',
    category: 'execution',
    estimatedTime: 'Siap digunakan',
    requirementLevel: 'Eksekusi CLI · Terminal Baru',
    overview:
      'Kini proses instalasi telah selesai sepenuhnya. Buka jendela terminal baru (PowerShell atau Command Prompt) dan panggil eksekusi lucida.exe untuk mulai menggunakan fitur pengunduhan dan sinkronisasi.',
    commands: [
      {
        id: 'cmd-run-lucida',
        command: 'lucida.exe',
        label: 'Jalankan Aplikasi LucidaDL',
        explanation: 'Memulai antarmuka baris perintah (CLI) lucida.exe dan menampilkan opsi penggunaan.',
      },
      {
        id: 'cmd-lucida-help',
        command: 'lucida.exe --help',
        label: 'Lihat Daftar Argumen & Opsi Lengkap',
        explanation: 'Menampilkan dokumentasi flag seperti penentuan direktori tujuan, kualitas, dan sumber URL.',
      },
    ],
    subChapters: [
      {
        id: 'sub-5-1',
        code: 'Sub-bab 5.1',
        title: 'Cara Penggunaan Dasar & Argumen Baris Perintah',
        summary: 'Memahami parameter dasar saat memanggil lucida.exe.',
        details: [
          'Ketik lucida.exe lalu tekan Enter untuk memverifikasi bahwa binary dapat dipanggil tanpa error.',
          'Gunakan lucida.exe --help untuk melihat seluruh flag yang didukung oleh versi terbaru.',
          'Anda dapat menjalankan perintah ini dari folder mana pun (misalnya C:\\Users\\Nama\\Downloads) karena lokasinya sudah terdaftar di PATH global pengguna.',
        ],
      },
      {
        id: 'sub-5-2',
        code: 'Sub-bab 5.2',
        title: 'Cara Memperbarui LucidaDL di Kemudian Hari',
        summary: 'Menjaga tools tetap mutakhir hanya dengan satu perintah pipx.',
        details: [
          'Jika terdapat pembaruan versi lucidadl di masa mendatang, Anda tidak perlu mengulang instalasi dari awal.',
          'Cukup buka terminal dan ketik: python -m pipx upgrade lucidadl.',
        ],
        verificationCommand: {
          command: 'lucida.exe',
          expectedOutput: 'Lucida CLI v1.2.0 initialized',
        },
      },
    ],
    illustration: {
      src: '/src/assets/images/lucida_exe_cli_running_1793613202983.jpg',
      alt: 'Tampilan Windows Terminal saat menjalankan lucida.exe',
      caption: 'Gambar 5.1 · Tampilan antarmuka baris perintah saat lucida.exe berhasil dijalankan di Windows Terminal.',
      highlightPoint: 'Ketik lucida.exe pada jendela terminal baru',
    },
  },
];

export interface TroubleshootingPreset {
  id: string;
  title: string;
  symptom: string;
  errorSnippet: string;
  cause: string;
  solutionSteps: string[];
  fixCommand?: string;
}

export const TROUBLESHOOTING_PRESETS: TroubleshootingPreset[] = [
  {
    id: 'err-python-not-found',
    title: 'Perintah python tidak dikenali di Terminal',
    symptom: 'Saat mengetik python -m ensurepip --upgrade muncul pesan error merah.',
    errorSnippet: "python : The term 'python' is not recognized as the name of a cmdlet, function, script file, or operable program.",
    cause: 'Kotak "Add python.exe to PATH" belum dicentang saat menginstal Python pada Langkah 1, atau terminal belum di-restart setelah instalasi Python.',
    solutionSteps: [
      'Tutup semua jendela PowerShell / Command Prompt lalu buka kembali.',
      'Jika masih gagal, jalankan kembali file installer Python (.exe) di folder Downloads Anda.',
      'Pilih menu "Modify", klik "Next", lalu beri tanda centang pada "Add Python to environment variables" dan klik "Install".',
      'Alternatif cepat: gunakan peluncur bawaan Windows dengan mengganti kata python menjadi py (contoh: py -m ensurepip --upgrade).',
    ],
    fixCommand: 'py -m ensurepip --upgrade',
  },
  {
    id: 'err-msvc-missing',
    title: 'Gagal kompilasi saat pipx install lucidadl (C++ 14.0 Required)',
    symptom: 'Proses instalasi berhenti di tengah jalan ketika membangun wheel paket dependensi.',
    errorSnippet: 'error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/',
    cause: 'Microsoft Visual C++ Build Tools belum terinstal, atau workload "Desktop development with C++" lupa dicentang di dalam Visual Studio Installer.',
    solutionSteps: [
      'Buka aplikasi "Visual Studio Installer" dari Start Menu Windows.',
      'Klik tombol "Modify" pada bagian Visual Studio Build Tools.',
      'Beri tanda centang pada kartu "Desktop development with C++" di tab Workloads.',
      'Pastikan komponen MSVC v143 dan Windows SDK tercentang di panel kanan, lalu klik "Modify" dan restart PC setelah selesai.',
    ],
  },
  {
    id: 'err-lucida-not-found',
    title: 'Perintah lucida.exe tidak ditemukan setelah instalasi selesai',
    symptom: 'Instalasi pipx berhasil, tetapi saat mengetik lucida.exe terminal menolak perintah.',
    errorSnippet: "lucida.exe : The term 'lucida.exe' is not recognized as the name of a cmdlet, function, script file, or operable program.",
    cause: 'Perintah python -m pipx ensurepath belum dijalankan, atau jendela terminal belum ditutup dan dibuka ulang sehingga variabel PATH baru belum dimuat.',
    solutionSteps: [
      'Jalankan perintah python -m pipx ensurepath di terminal.',
      'Tutup jendela Windows Terminal / PowerShell secara penuh, lalu buka jendela baru.',
      'Apabila masih belum dikenali, panggil langsung dari jalur penuh: %USERPROFILE%\\.local\\bin\\lucida.exe',
    ],
    fixCommand: 'python -m pipx ensurepath',
  },
  {
    id: 'err-pipx-execution-policy',
    title: 'PowerShell memblokir eksekusi skrip (PSSecurityException)',
    symptom: 'PowerShell menolak menjalankan skrip lingkungan virtual karena kebijakan keamanan default.',
    errorSnippet: 'File cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies.',
    cause: 'Kebijakan eksekusi Windows PowerShell masih berstatus Restricted untuk pengguna saat ini.',
    solutionSteps: [
      'Buka Windows PowerShell, lalu izinkan skrip lokal yang ditandatangani dengan menjalankan perintah Set-ExecutionPolicy untuk CurrentUser.',
      'Setelah itu, ulangi kembali perintah instalasi pipx Anda.',
    ],
    fixCommand: 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser',
  },
];
