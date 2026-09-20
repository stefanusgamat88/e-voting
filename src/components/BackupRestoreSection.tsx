import React, { useState, useRef } from 'react';
import {
  Download,
  UploadCloud,
  Database,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  Vote as VoteIcon,
  Building2,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Candidate, ElectionSettings, User, Vote } from '../types';
import { formatDateIndonesian } from '../lib/utils';
import {
  saveCandidates,
  saveSettings,
  saveUsers,
  saveVotes,
} from '../lib/supabase';

export interface AppBackupData {
  appName: string;
  version: string;
  exportedAt: string;
  backupType: 'full';
  systemInfo: {
    totalCandidates: number;
    totalUsers: number;
    totalVoters: number;
    totalVotes: number;
    schoolName: string;
    electionTitle: string;
    period: string;
  };
  data: {
    candidates: Candidate[];
    users: User[];
    votes: Vote[];
    settings: ElectionSettings;
  };
}

interface BackupRestoreSectionProps {
  candidates: Candidate[];
  users: User[];
  votes: Vote[];
  settings: ElectionSettings;
  onRefresh: () => void;
  onOpenImportStudents?: () => void;
}

export const BackupRestoreSection: React.FC<BackupRestoreSectionProps> = ({
  candidates,
  users,
  votes,
  settings,
  onRefresh,
  onOpenImportStudents,
}) => {
  const [uploadedBackup, setUploadedBackup] = useState<AppBackupData | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] = useState(false);

  // Selective restore checkboxes
  const [restoreOptions, setRestoreOptions] = useState({
    candidates: true,
    users: true,
    votes: true,
    settings: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Export & Download Backup JSON
  const handleDownloadBackup = () => {
    try {
      const studentCount = users.filter((u) => u.role === 'siswa').length;
      const backupPayload: AppBackupData = {
        appName: 'E-Voting Pilketos OSIS',
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        backupType: 'full',
        systemInfo: {
          totalCandidates: candidates.length,
          totalUsers: users.length,
          totalVoters: studentCount,
          totalVotes: votes.length,
          schoolName: settings.school_name || 'Sekolah',
          electionTitle: settings.title || 'Pemilihan Ketua OSIS',
          period: settings.period || '2025/2026',
        },
        data: {
          candidates,
          users,
          votes,
          settings,
        },
      };

      const jsonString = JSON.stringify(backupPayload, null, 2);
      const cleanSchool = (settings.school_name || 'Pilketos')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_');
      const now = new Date();
      const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
      const fileName = `Backup_Pilketos_${cleanSchool}_${dateStr}.json`;

      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification(`Backup JSON berhasil diunduh (${fileName})`);
    } catch (err) {
      console.error('Gagal membuat backup JSON:', err);
      alert('Terjadi kesalahan saat mengekspor data backup.');
    }
  };

  // Inspect uploaded JSON file
  const processUploadedFile = (file: File) => {
    setParseError(null);
    setUploadedBackup(null);
    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation check: Either structured format or raw legacy format
        let normalizedBackup: AppBackupData;

        if (parsed.data && parsed.data.candidates && parsed.data.users) {
          // Standard full backup format
          normalizedBackup = parsed as AppBackupData;
        } else if (Array.isArray(parsed.candidates) && Array.isArray(parsed.users)) {
          // Flattened backup format
          normalizedBackup = {
            appName: parsed.appName || 'E-Voting Pilketos',
            version: parsed.version || '1.0.0',
            exportedAt: parsed.exportedAt || new Date().toISOString(),
            backupType: 'full',
            systemInfo: {
              totalCandidates: parsed.candidates.length,
              totalUsers: parsed.users.length,
              totalVoters: parsed.users.filter((u: any) => u.role === 'siswa').length,
              totalVotes: Array.isArray(parsed.votes) ? parsed.votes.length : 0,
              schoolName: parsed.settings?.school_name || 'Lembaga',
              electionTitle: parsed.settings?.title || 'Pemilihan OSIS',
              period: parsed.settings?.period || '',
            },
            data: {
              candidates: parsed.candidates,
              users: parsed.users,
              votes: Array.isArray(parsed.votes) ? parsed.votes : [],
              settings: parsed.settings || settings,
            },
          };
        } else {
          throw new Error('Format file JSON tidak sesuai struktur data E-Voting.');
        }

        setUploadedBackup(normalizedBackup);
      } catch (err: any) {
        setParseError(`Gagal membaca file backup: ${err.message || 'Format JSON tidak valid'}`);
        setUploadedBackup(null);
      }
    };
    reader.onerror = () => {
      setParseError('Gagal membuka file backup.');
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Perform Restore
  const handleExecuteRestore = () => {
    if (!uploadedBackup) return;

    setIsRestoring(true);
    try {
      const { data } = uploadedBackup;

      if (restoreOptions.candidates && data.candidates) {
        saveCandidates(data.candidates);
      }

      if (restoreOptions.users && data.users) {
        saveUsers(data.users);
      }

      if (restoreOptions.votes && data.votes) {
        saveVotes(data.votes);
      }

      if (restoreOptions.settings && data.settings) {
        saveSettings({
          ...settings,
          ...data.settings,
        });
      }

      setShowConfirmRestoreModal(false);
      showNotification('Data backup berhasil dipulihkan ke sistem!');
      onRefresh();
    } catch (err) {
      console.error('Gagal memulihkan backup:', err);
      alert('Gagal memulihkan database.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/80 via-blue-900/60 to-slate-900 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 font-bold text-xs border border-indigo-400/20">
              <Database className="w-3.5 h-3.5" />
              <span>Pusat Cadangan &amp; Pemulihan Database (Backup &amp; Restore)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Cadangkan &amp; Pulihkan Seluruh Data Pemilihan
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Unduh salinan arsip data dalam format file JSON kapan saja, dan pulihkan kembali ke server atau browser lain dengan aman tanpa kehilangan suara, paslon, maupun data siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Backup JSON Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-xs sm:text-sm font-bold animate-in fade-in duration-300 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Two Column Layout: Backup Downloader & Restore Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: UNDUH BACKUP JSON */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  1. Buat &amp; Unduh Backup JSON
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Menghasilkan file arsip mandiri (.json) yang memuat semua data sistem saat ini
                </p>
              </div>
            </div>

            {/* Current Database Summary Chips */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Cakupan Data yang Disimpan dalam File Backup:
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">{candidates.length} Paslon</span>
                    <span className="text-[10px] text-slate-400">Profil, visi, misi, foto</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <VoteIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">
                      {users.filter((u) => u.role === 'siswa').length} DPT Siswa
                    </span>
                    <span className="text-[10px] text-slate-400">Daftar pemilih tetap</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">{votes.length} Suara Sah</span>
                    <span className="text-[10px] text-slate-400">Rekapitulasi kotak suara</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Profil Lembaga</span>
                    <span className="text-[10px] text-slate-400">Kop surat, logo, pejabat</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                File cadangan dapat disimpan di flashdisk, Google Drive, atau komputer panitia untuk arsip resmi dan pemulihan darurat jika terjadi kerusakan perangkat.
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download File Backup (.json)</span>
          </button>
        </div>

        {/* CARD 2: UNGGAH & PULIHKAN BACKUP JSON (RESTORE) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  2. Unggah &amp; Pulihkan Backup JSON
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload file .json hasil backup sebelumnya untuk memulihkan database
                </p>
              </div>
            </div>

            {/* Drag & Drop File Selector */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/60 dark:bg-slate-900/40 transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {uploadFileName ? (
                  <span className="text-blue-600 dark:text-blue-400">{uploadFileName}</span>
                ) : (
                  'Pilih atau Drag File Backup (.json) ke Sini'
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pastikan file berasal dari menu backup sistem Pilketos ini
              </p>
            </div>

            {/* Parsing error */}
            {parseError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-2 text-xs text-red-600 dark:text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{parseError}</span>
              </div>
            )}

            {/* Inspection Preview of Uploaded Backup */}
            {uploadedBackup && (
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    File Terverifikasi: {uploadedBackup.systemInfo.schoolName}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {formatDateIndonesian(uploadedBackup.exportedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Kandidat</span>
                    <strong className="text-slate-900 dark:text-white text-sm">
                      {uploadedBackup.data.candidates?.length || 0}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Total DPT</span>
                    <strong className="text-slate-900 dark:text-white text-sm">
                      {uploadedBackup.data.users?.filter((u) => u.role === 'siswa').length || 0}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Kotak Suara</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                      {uploadedBackup.data.votes?.length || 0}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Periode</span>
                    <strong className="text-slate-900 dark:text-white text-xs truncate block">
                      {uploadedBackup.systemInfo.period || 'Aktif'}
                    </strong>
                  </div>
                </div>

                {/* Selective Checkboxes */}
                <div className="pt-2 border-t border-blue-200/50 dark:border-blue-900/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block uppercase">
                    Pilih Komponen yang Ingin Dipulihkan:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={restoreOptions.candidates}
                        onChange={(e) =>
                          setRestoreOptions({ ...restoreOptions, candidates: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>Paslon Kandidat ({uploadedBackup.data.candidates?.length || 0})</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={restoreOptions.users}
                        onChange={(e) =>
                          setRestoreOptions({ ...restoreOptions, users: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>Data Pemilih / DPT ({uploadedBackup.data.users?.length || 0})</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={restoreOptions.votes}
                        onChange={(e) =>
                          setRestoreOptions({ ...restoreOptions, votes: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>Kotak Suara Masuk ({uploadedBackup.data.votes?.length || 0})</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={restoreOptions.settings}
                        onChange={(e) =>
                          setRestoreOptions({ ...restoreOptions, settings: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>Seting Lembaga &amp; Kop</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!uploadedBackup || isRestoring}
            onClick={() => setShowConfirmRestoreModal(true)}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              uploadedBackup && !isRestoring
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Terapkan &amp; Pulihkan Backup ke Database</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Restore */}
      {showConfirmRestoreModal && uploadedBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="font-black text-lg text-slate-900 dark:text-white">
              Konfirmasi Pemulihan Database
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Anda akan memulihkan data dari backup{' '}
              <strong className="text-slate-900 dark:text-white">
                {uploadedBackup.systemInfo.schoolName}
              </strong>{' '}
              ({formatDateIndonesian(uploadedBackup.exportedAt)}). Tindakan ini akan memperbarui data lokal dan server sesuai komponen yang dipilih.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmRestoreModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Ya, Pulihkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
