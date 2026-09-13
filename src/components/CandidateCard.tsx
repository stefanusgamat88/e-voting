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
      {/* Top Banner & Number Badge */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={candidate.foto}
          alt={`Kandidat Paslon ${nomorFormatted}`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

        {/* Circular Number Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-2xl shadow-xl ring-4 ring-white/30 backdrop-blur-sm ${badgeBg}`}
          >
            {nomorFormatted}
          </div>
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs border border-white/20 uppercase tracking-wide">
            Paslon {nomorFormatted}
          </span>
        </div>

        {/* Status Pill if voted */}
        {isVotedByMe && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-lg animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pilihan Anda</span>
          </div>
        )}

        {/* Bottom Photo Overlay Info */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {candidate.tagline || 'Pemimpin Berintegritas & Visioner'}
          </p>
          <div className="mt-1">
            <h3 className="text-lg font-bold leading-snug drop-shadow-sm text-white">
              {candidate.nama_ketua}
            </h3>
            <p className="text-sm font-medium text-slate-200">
              &amp; {candidate.nama_wakil}
            </p>
          </div>
        </div>
      </div>

      {/* Body: Vision & Mission Content */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-5">
        {/* Class badges */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">
            Ketua: {candidate.kelas_ketua || 'Kelas XI'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">
            Wakil: {candidate.kelas_wakil || 'Kelas X'}
          </span>
        </div>

        {/* Visi */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Visi Utama
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed italic">
            "{candidate.visi}"
          </p>
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
