import React from 'react';
import { X, Award, CheckCircle, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { Candidate, User } from '../types';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  currentUser: User | null;
  onClose: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  currentUser,
  onClose,
  onSelectCandidate,
}) => {
  if (!candidate) return null;

  const nomorFormatted = candidate.nomor_urut < 10 ? `0${candidate.nomor_urut}` : candidate.nomor_urut;
  const isVoted = currentUser?.voted_candidate_id === candidate.id;
  const hasVoted = currentUser?.sudah_memilih;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with half-body candidate photo & info */}
        <div className="relative p-6 sm:p-7 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pr-10">
            {/* Foto Portrait Setengah Badan */}
            <div className="w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 bg-slate-800 shrink-0 relative">
              <img
                src={candidate.foto}
                alt={candidate.nama_ketua}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                {nomorFormatted}
              </div>
            </div>

            {/* Candidate Identification & Names */}
            <div className="flex-1 min-w-0">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-1.5 border border-amber-400/30">
                Pasangan Calon No. Urut {nomorFormatted}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                {candidate.nama_ketua}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-slate-300">
                &amp; {candidate.nama_wakil}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-300">
                <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                  Ketua: {candidate.kelas_ketua || 'Kelas XI'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                  Wakil: {candidate.kelas_wakil || 'Kelas X'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Tagline */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              "{candidate.tagline || 'Pemimpin Berkarakter, Cerdas, dan Melayani'}"
            </p>
          </div>

          {/* Visi */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <Award className="w-5 h-5 text-amber-500" />
              <h3>Visi Kepemimpinan</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 italic">
              "{candidate.visi}"
            </p>
          </div>

          {/* Misi */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3>Misi &amp; Sasaran Strategis</h3>
            </div>
            <ul className="space-y-2.5">
              {candidate.misi.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Program Unggulan */}
          {candidate.program_unggulan && candidate.program_unggulan.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h3>Program Kerja Unggulan</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidate.program_unggulan.map((prog, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{prog}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>

          <button
            id={`btn-modal-vote-${candidate.nomor_urut}`}
            onClick={() => {
              onClose();
              onSelectCandidate(candidate);
            }}
            disabled={Boolean(hasVoted)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              isVoted
                ? 'bg-emerald-600 text-white shadow-md'
                : hasVoted
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02]'
            }`}
          >
            {isVoted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Pilihan Sah Anda</span>
              </>
            ) : hasVoted ? (
              <span>Sudah Memberi Suara</span>
            ) : (
              <>
                <span>Pilih Paslon Ini ({nomorFormatted})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
