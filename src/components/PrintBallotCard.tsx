import React, { useState } from 'react';
import {
  Printer,
  FileText,
  UserCheck,
  CheckCircle2,
  QrCode,
  Sparkles,
  ArrowLeft,
  Stamp,
  ShieldCheck,
  Info,
  Filter,
} from 'lucide-react';
import { Candidate, ElectionSettings, User } from '../types';

interface PrintBallotCardProps {
  candidates: Candidate[];
  users: User[];
  settings: ElectionSettings;
  onBack?: () => void;
}

export const PrintBallotCard: React.FC<PrintBallotCardProps> = ({
  candidates,
  users,
  settings,
  onBack,
}) => {
  const [activeMode, setActiveMode] = useState<'surat-suara' | 'kartu-pemilih'>('surat-suara');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const schoolName = settings.school_name || 'SMA NEGERI 1 TELADAN';
  const orgName = settings.organization_name || 'KOMISI PEMILIHAN UMUM OSIS & MPK';
  const schoolAddress = settings.school_address || 'Jl. Pemuda Pendidikan No. 45';
  const schoolCity = settings.school_city || 'Jakarta Selatan';
  const period = settings.period || 'Periode 2026/2027';
  const kpuChairman = settings.kpu_chairman || 'Muhammad Rian Pratama';

  // Extract unique classes for filter
  const classes = Array.from(new Set(users.map((u) => u.kelas).filter(Boolean))) as string[];

  const filteredUsers = selectedClass === 'all' 
    ? users.filter(u => u.role === 'siswa') 
    : users.filter(u => u.role === 'siswa' && u.kelas === selectedClass);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 print:min-h-0 print:bg-white print:p-0 print:m-0">
      <div className="max-w-5xl mx-auto space-y-6 print:max-w-none print:space-y-0 print:m-0 print:p-0">
        {/* Navigation & Control Toolbar (Hidden in Print) */}
        <div className="no-print print:hidden p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Printer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Cetak Kartu &amp; Surat Suara Pemilu</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Format dokumen resmi standar KPU siap cetak ke kertas A4 atau simpan sebagai PDF.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveMode('surat-suara')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMode === 'surat-suara'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Surat Suara Resmi</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('kartu-pemilih')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMode === 'kartu-pemilih'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Kartu Pemilih (DPT)</span>
              </button>
            </div>

            {/* Print Action Button */}
            <button
              id="btn-print-action"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (A4 / PDF)</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar for Kartu Pemilih (Hidden in Print) */}
        {activeMode === 'kartu-pemilih' && (
          <div className="no-print p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-blue-950 dark:text-blue-200">
                Filter Kelas Pemilih:
              </span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kelas ({users.filter(u => u.role === 'siswa').length} Pemilih)</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls} ({users.filter(u => u.role === 'siswa' && u.kelas === cls).length} Siswa)
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
              Menampilkan {filteredUsers.length} Kartu Pemilih DPT
            </span>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 1: SURAT SUARA RESMI PEMILIHAN (BALLOT PAPER)           */}
        {/* ============================================================ */}
        {activeMode === 'surat-suara' && (
          <div className="bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-300 print-page p-6 sm:p-10 font-sans space-y-6">
            {/* Kop Resmi Surat Suara */}
            <div className="border-b-4 border-double border-slate-900 pb-4 text-center relative">
              <div className="flex items-center justify-between gap-4">
                {settings.school_logo ? (
                  <img
                    src={settings.school_logo}
                    alt="Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl">
                    OSIS
                  </div>
                )}

                <div className="space-y-0.5 flex-1">
                  <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-700">
                    {orgName}
                  </h3>
                  <h2 className="text-lg sm:text-2xl font-black tracking-tight uppercase text-slate-900">
                    {schoolName}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    {schoolAddress}, {schoolCity}
                  </p>
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-slate-900 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold p-1 text-center">
                  <QrCode className="w-8 h-8 text-slate-800 mb-0.5" />
                  <span>KPU SAH</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-300">
                <span className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-black tracking-wider uppercase mb-1">
                  SURAT SUARA PEMILIHAN UMUM
                </span>
                <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-wide">
                  KETUA &amp; WAKIL KETUA OSIS {period.toUpperCase()}
                </h1>
                <p className="text-xs text-slate-600 italic">
                  Gunakan hak suara Anda dengan mencoblos pada satu kotak pasangan calon pilihan Anda
                </p>
              </div>
            </div>

            {/* Kotak Kandidat Surat Suara */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border-2 border-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between text-center bg-slate-50 relative overflow-hidden"
                >
                  {/* Nomor Urut Lingkaran Besar */}
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center mb-3 shadow-md">
                    0{candidate.nomor_urut}
                  </div>

                  {/* Foto Paslon */}
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-400 mb-3 bg-slate-200">
                    <img
                      src={candidate.foto}
                      alt={candidate.nama_ketua}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Nama Paslon */}
                  <div className="space-y-1 mb-4 flex-1">
                    <div className="bg-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Calon Ketua &amp; Wakil
                    </div>
                    <h3 className="font-black text-sm text-slate-900 leading-tight">
                      {candidate.nama_ketua}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700">
                      &amp; {candidate.nama_wakil}
                    </p>
                    {candidate.kelas_ketua && (
                      <span className="text-[10px] text-slate-500 block">
                        ({candidate.kelas_ketua} &bull; {candidate.kelas_wakil})
                      </span>
                    )}
                  </div>

                  {/* Area Coblosan Surat Suara */}
                  <div className="w-full pt-3 border-t-2 border-dashed border-slate-400">
                    <div className="w-20 h-16 mx-auto rounded-xl border-2 border-slate-900 border-dashed bg-white flex flex-col items-center justify-center p-1">
                      <span className="text-[9px] font-extrabold uppercase text-slate-500">
                        KOTAK COBLOS
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        NO. 0{candidate.nomor_urut}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Petunjuk Coblos & Pengesahan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t-2 border-slate-300 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <h4 className="font-extrabold uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tata Cara Pencoblosan Surat Suara yang Sah:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-600 text-[11px]">
                  <li>Surat suara dinyatakan sah jika terdapat tanda coblosan paku pada satu nomor urut, foto, atau nama pasangan calon.</li>
                  <li>Tidak membubuhkan coretan tulisan tangan selain tanda coblosan pada kotak pasangan calon.</li>
                  <li>Surat suara harus dalam keadaan bersih dan ditandatangani oleh Ketua KPU OSIS.</li>
                </ol>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <p className="text-[11px] text-slate-600">{schoolCity}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-[11px] font-bold text-slate-800 uppercase">Ketua Komisi Pemilihan OSIS</p>
                <div className="h-12 flex items-center justify-center sm:justify-end">
                  <div className="text-[10px] text-slate-400 italic border border-slate-300 border-dashed px-3 py-1 rounded">
                    [Tanda Tangan &amp; Cap Basah]
                  </div>
                </div>
                <p className="text-xs font-black underline text-slate-900 uppercase">
                  {kpuChairman}
                </p>
              </div>
            </div>

            {/* Watermark Security Code */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>DOC ID: KPU-OSIS-{period.replace(/[^a-zA-Z0-9]/g, '')}-BALLOT</span>
              <span>DOKUMEN RESMI PEMILU OSIS &bull; ASLI DAN RAHASIA</span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: KARTU PESERTA PEMILIH (KARTU SUARA DPT SISWA)        */}
        {/* ============================================================ */}
        {activeMode === 'kartu-pemilih' && (
          <div className="space-y-6">
            <div className="no-print p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Kartu pemilih ini dicetak dan dibagikan kepada setiap siswa sebagai surat undangan memilih / bukti hak suara resmi untuk registrasi di bilik suara digital.
              </span>
            </div>

            {/* Grid of Voter Cards (Fit 4-6 cards per A4 page) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUsers.map((user, idx) => (
                <div
                  key={user.id}
                  className="bg-white text-slate-900 border-2 border-dashed border-slate-400 rounded-2xl p-4 shadow-sm print-break-inside-avoid flex flex-col justify-between space-y-3 relative overflow-hidden"
                >
                  {/* Card Header with School Logo */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      {settings.school_logo ? (
                        <img
                          src={settings.school_logo}
                          alt="Logo"
                          className="w-8 h-8 rounded-md object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                          OSIS
                        </div>
                      )}
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-blue-900 leading-none">
                          KARTU PEMILIH RESMI (DPT)
                        </h4>
                        <p className="text-[9px] font-bold text-slate-700">
                          {schoolName}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-black font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      NO #{idx + 1}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1 flex-1">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                          Nama Siswa (Pemilih):
                        </span>
                        <h3 className="font-black text-sm text-slate-900 leading-tight">
                          {user.nama}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-semibold">NISN:</span>
                          <p className="font-mono font-bold text-slate-800">{user.nisn}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-semibold">Kelas:</span>
                          <p className="font-bold text-slate-800">{user.kelas || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Validation Box */}
                    <div className="w-16 h-16 rounded-xl border border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-1 text-center shrink-0">
                      <QrCode className="w-10 h-10 text-slate-800" />
                      <span className="text-[7px] font-mono font-bold uppercase text-slate-500">
                        VERIFIKASI
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Period & Instructions */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                    <span>Pemilihan Ketua OSIS {period}</span>
                    <span className="font-bold text-blue-900 uppercase">Bawa ke Bilik Suara</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
