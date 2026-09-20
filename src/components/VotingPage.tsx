import React, { useState } from 'react';
import {
  Vote as VoteIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  ArrowLeft,
  QrCode,
  Award,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Candidate, ElectionSettings, User } from '../types';
import { formatDateIndonesian, formatElectionTimeRange, getElectionScheduleStatus } from '../lib/utils';

interface VotingPageProps {
  candidates: Candidate[];
  currentUser: User | null;
  settings?: ElectionSettings;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenLogin: () => void;
  onViewQuickCount: () => void;
  onViewReceipt: () => void;
}

export const VotingPage: React.FC<VotingPageProps> = ({
  candidates,
  currentUser,
  settings,
  onSelectCandidate,
  onOpenLogin,
  onViewQuickCount,
  onViewReceipt,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const schedule = settings
    ? getElectionScheduleStatus(settings.start_date, settings.end_date, settings.status)
    : null;
  const timeRangeFormatted = settings
    ? formatElectionTimeRange(settings.start_date, settings.end_date)
    : '';

  // If election has not started yet
  if (schedule?.status === 'upcoming' && currentUser?.role !== 'admin') {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-md">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs">
            Bilik Suara Belum Dibuka
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Waktu Pemilihan Belum Dimulai
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Bilik suara digital saat ini masih dalam tahap sosialisasi dan persiapan. Pemungutan suara akan dibuka sesuai jadwal resmi berikut:
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-left space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Jadwal Rentang Waktu:</span>
          </div>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white pl-6">
            {timeRangeFormatted}
          </p>
          {schedule.timeRemaining && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold pl-6">
              Akan dibuka dalam: <strong>{schedule.timeRemaining}</strong>
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onViewQuickCount}
            className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Pantau Bilik Informasi
          </button>
        </div>
      </div>
    );
  }

  // If election is already closed or ended
  if (schedule?.status === 'ended' && !currentUser?.sudah_memilih && currentUser?.role !== 'admin') {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center shadow-md">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 font-bold text-xs">
            Bilik Suara Ditutup
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Waktu Pemilihan Telah Berakhir
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Batas rentang waktu pemungutan suara telah selesai. Kotak suara digital telah disegel secara otomatis.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-left space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-red-500" />
            <span>Rentang Waktu Pelaksanaan:</span>
          </div>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white pl-6">
            {timeRangeFormatted}
          </p>
        </div>

        <button
          onClick={onViewQuickCount}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Lihat Hasil Rekapitulasi Suara
        </button>
      </div>
    );
  }

  // If not logged in
  if (!currentUser) {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center shadow-md">
          <VoteIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Bilik Suara Digital Terkunci
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Untuk menjaga integritas pemilihan dan mencegah double-voting, silakan masuk terlebih dahulu menggunakan NISN Anda.
          </p>
        </div>
        <button
          onClick={onOpenLogin}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
        >
          Masuk dengan NISN Sekarang
        </button>
      </div>
    );
  }

  // If user has already voted
  if (currentUser.sudah_memilih) {
    const votedCandidate = candidates.find((c) => c.id === currentUser.voted_candidate_id);
    const voteTime = currentUser.voted_at
      ? formatDateIndonesian(currentUser.voted_at)
      : 'Waktu tercatat dalam sistem';

    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              Hak Suara Telah Digunakan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Terima Kasih, {currentUser.nama}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Satu suara Anda sangat berharga bagi masa depan sekolah kita. Sistem anti double-vote telah mengunci hak suara akun Anda.
            </p>
          </div>

          {/* Voted Candidate Badge */}
          {votedCandidate && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-4 text-left">
              <img
                src={votedCandidate.foto}
                alt={votedCandidate.nama_ketua}
                className="w-14 h-14 rounded-xl object-cover object-top border border-blue-200"
              />
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Paslon Pilihan Sah No. 0{votedCandidate.nomor_urut}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {votedCandidate.nama_ketua} &amp; {votedCandidate.nama_wakil}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Waktu: {voteTime}
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="btn-view-digital-receipt"
              onClick={onViewReceipt}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Lihat Tanda Terima Digital</span>
            </button>

            <button
              id="btn-voting-quickcount"
              onClick={onViewQuickCount}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <VoteIcon className="w-4 h-4" />
              <span>Pantau Quick Count Terkini</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Voting Screen
  const sortedCandidates = [...candidates].sort((a, b) => a.nomor_urut - b.nomor_urut);
  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <VoteIcon className="w-3.5 h-3.5" />
          <span>Surat Suara Digital</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Surat Suara Pemilihan OSIS
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Selamat datang, <strong className="text-slate-900 dark:text-white">{currentUser.nama}</strong> ({currentUser.kelas || 'Siswa'}).
          Pilih salah satu pasangan calon di bawah ini kemudian klik konfirmasi.
        </p>
      </div>

      {/* Rentang Waktu Pemilihan Banner */}
      {timeRangeFormatted && (
        <div className="max-w-2xl mx-auto p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Rentang Waktu:</strong> {timeRangeFormatted}
            </span>
          </div>
          {schedule?.timeRemaining && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>Sisa Waktu: {schedule.timeRemaining}</span>
            </div>
          )}
        </div>
      )}

      {/* 3 Candidates Voting Ballot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedCandidates.map((candidate) => {
          const isSelected = selectedCandidateId === candidate.id;
          const nomorFormatted = candidate.nomor_urut < 10 ? `0${candidate.nomor_urut}` : candidate.nomor_urut;

          return (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidateId(candidate.id)}
              className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-2xl scale-[1.02] ring-4 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-md hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg'
              }`}
            >
              {/* Radio Indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {nomorFormatted}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-transparent'
                  }`}
                >
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Photo */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
                <img
                  src={candidate.foto}
                  alt={candidate.nama_ketua}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Info */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Paslon {nomorFormatted}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {candidate.nama_ketua}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calon Wakil: {candidate.nama_wakil}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 pt-1">
                  "{candidate.visi}"
                </p>
              </div>

              {/* Select Button */}
              <button
                type="button"
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paslon Dipilih</span>
                  </>
                ) : (
                  <span>Pilih Paslon Ini</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Confirmation Action Bar */}
      <div className="sticky bottom-6 z-30 max-w-2xl mx-auto p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Pilihan Terpilih:</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {selectedCandidate
              ? `Paslon 0${selectedCandidate.nomor_urut}: ${selectedCandidate.nama_ketua}`
              : 'Belum ada paslon yang dipilih'}
          </p>
        </div>

        <button
          id="btn-submit-ballot"
          onClick={() => {
            if (selectedCandidate) {
              onSelectCandidate(selectedCandidate);
            }
          }}
          disabled={!selectedCandidate}
          className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
            selectedCandidate
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Lanjutkan ke Konfirmasi Suara</span>
        </button>
      </div>
    </div>
  );
};
