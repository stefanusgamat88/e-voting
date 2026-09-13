import React from 'react';
import { CheckCircle2, ChevronRight, Sparkles, UserCheck, Award } from 'lucide-react';
import { Candidate, User } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  currentUser: User | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  currentUser,
  onSelectCandidate,
  onViewDetails,
}) => {
  const isVotedByMe = currentUser?.voted_candidate_id === candidate.id;
  const hasUserVoted = currentUser?.sudah_memilih;

  // Nomor urut formatting with leading zero
  const nomorFormatted = candidate.nomor_urut < 10 ? `0${candidate.nomor_urut}` : candidate.nomor_urut;

  // Dynamic accents per candidate number
  const accentColor =
    candidate.nomor_urut === 1
      ? 'from-blue-600 to-indigo-600 text-blue-600'
      : candidate.nomor_urut === 2
      ? 'from-amber-500 to-orange-500 text-amber-500'
      : 'from-emerald-600 to-teal-600 text-emerald-600';

  const badgeBg =
    candidate.nomor_urut === 1
      ? 'bg-blue-600 text-white shadow-blue-500/30'
      : candidate.nomor_urut === 2
      ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 font-black'
      : 'bg-emerald-600 text-white shadow-emerald-500/30';

  return (
    <div
      id={`candidate-card-${candidate.nomor_urut}`}
      className={`group relative flex flex-col rounded-3xl bg-white dark:bg-slate-800/90 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${
        isVotedByMe
          ? 'border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/30'
          : 'border-slate-200 dark:border-slate-700/80 shadow-lg hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      {/* Top Banner & Candidate Photo (Half-Body / Setengah Badan) */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] min-h-[360px] max-h-[480px] overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/80">
        <img
          src={candidate.foto}
          alt={`Foto Paslon ${nomorFormatted} - ${candidate.nama_ketua}`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Circular Number Badge (Top-Left) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center font-black text-2xl shadow-xl ring-4 ring-white/30 backdrop-blur-sm ${badgeBg}`}
          >
            {nomorFormatted}
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-white font-black text-xs border border-white/20 uppercase tracking-wider shadow-md">
            Paslon {nomorFormatted}
          </span>
        </div>

        {/* Status Pill if voted (Top-Right) */}
        {isVotedByMe && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-lg animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pilihan Anda</span>
          </div>
        )}
      </div>

      {/* Body: Slogan, Names, Vision & Mission (Slogan diposisikan di sini agar TIDAK menutupi muka) */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Slogan & Moto Paslon: Desain banner emas yang mencolok & rapi di bawah foto */}
          {candidate.tagline && (
            <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/25 flex items-start gap-2.5 shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                  Slogan &amp; Moto Paslon
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200 leading-snug">
                  "{candidate.tagline}"
                </p>
              </div>
            </div>
          )}

          {/* Nama Paslon Ketua & Wakil */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Kandidat Pemimpin OSIS No. Urut {nomorFormatted}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {candidate.nama_ketua}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
              &amp; {candidate.nama_wakil}
            </p>

            {/* Class badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">
                Ketua: {candidate.kelas_ketua || 'Kelas XI'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">
                Wakil: {candidate.kelas_wakil || 'Kelas X'}
              </span>
            </div>
          </div>

          {/* Visi */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Visi Utama
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              "{candidate.visi}"
            </p>
          </div>
        </div>

        {/* Misi (Bullet List) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Misi Unggulan
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {candidate.misi.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </span>
                <span className="line-clamp-2 leading-tight">{item}</span>
              </li>
            ))}
            {candidate.misi.length > 3 && (
              <li className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pl-6">
                + {candidate.misi.length - 3} program misi lainnya
              </li>
            )}
          </ul>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
          {/* Main Vote Button */}
          <button
            id={`btn-vote-candidate-${candidate.nomor_urut}`}
            onClick={() => onSelectCandidate(candidate)}
            disabled={Boolean(hasUserVoted)}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isVotedByMe
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 cursor-default'
                : hasUserVoted
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:scale-[1.01]'
            }`}
          >
            {isVotedByMe ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pilihan Suara Sah Anda</span>
              </>
            ) : hasUserVoted ? (
              <>
                <span>Hak Suara Telah Digunakan</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Pilih Paslon {nomorFormatted}</span>
              </>
            )}
          </button>

          {/* Secondary Details Button */}
          <button
            id={`btn-detail-candidate-${candidate.nomor_urut}`}
            onClick={() => onViewDetails(candidate)}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Lihat Visi-Misi &amp; Program Kerja Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
