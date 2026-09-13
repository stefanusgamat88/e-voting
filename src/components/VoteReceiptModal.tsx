import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, Download, BarChart3, QrCode, X, Calendar } from 'lucide-react';
import { Candidate, User, Vote } from '../types';
import { formatDateIndonesian } from '../lib/utils';

interface VoteReceiptModalProps {
  vote: Vote | null;
  candidate: Candidate | null;
  user: User | null;
  onClose: () => void;
  onViewQuickCount: () => void;
}

export const VoteReceiptModal: React.FC<VoteReceiptModalProps> = ({
  vote,
  candidate,
  user,
  onClose,
  onViewQuickCount,
}) => {
  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!candidate || !user) return null;

  const nomorFormatted = candidate.nomor_urut < 10 ? `0${candidate.nomor_urut}` : candidate.nomor_urut;
  const voteTime = vote?.timestamp ? formatDateIndonesian(vote.timestamp) : formatDateIndonesian(new Date().toISOString());
  const receiptHash = vote?.hash || `HASH-${user.nisn.slice(-4)}-${Date.now()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Suara Anda Berhasil Direkam!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Terima kasih telah berpartisipasi dalam Pemilihan Ketua &amp; Wakil Ketua OSIS
          </p>
        </div>

        {/* Digital Ballot Receipt Certificate Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/90 dark:to-slate-800/40 border border-blue-200/70 dark:border-blue-900/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Tanda Terima Digital Resmi
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                KPU OSIS SMA Negeri 1 Teladan
              </h4>
            </div>
            <div className="p-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
              <QrCode className="w-7 h-7 text-slate-800 dark:text-slate-200" />
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold">
                Nama Pemilih
              </span>
              <p className="font-bold text-slate-900 dark:text-white truncate">
                {user.nama}
              </p>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold">
                NISN / Kelas
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {user.nisn} ({user.kelas || 'Siswa'})
              </p>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold">
                Pilihan Suara Sah
              </span>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                Paslon No. {nomorFormatted}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                {candidate.nama_ketua}
              </p>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-semibold">
                Status Verifikasi
              </span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tersimpan &amp; Sah
              </p>
            </div>
          </div>

          {/* Timestamp & Hash */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Waktu Pemilihan:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{voteTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Kode Validasi:</span>
              <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {receiptHash}
              </code>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Cetak / Simpan Bukti</span>
          </button>

          <button
            id="btn-receipt-quickcount"
            onClick={() => {
              onClose();
              onViewQuickCount();
            }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Pantau Quick Count</span>
          </button>
        </div>
      </div>
    </div>
  );
};
