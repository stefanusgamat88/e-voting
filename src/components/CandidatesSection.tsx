import React from 'react';
import { Candidate, User } from '../types';
import { CandidateCard } from './CandidateCard';
import { Users, Info, ShieldAlert } from 'lucide-react';

interface CandidatesSectionProps {
  candidates: Candidate[];
  currentUser: User | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidatesSection: React.FC<CandidatesSectionProps> = ({
  candidates,
  currentUser,
  onSelectCandidate,
  onViewDetails,
}) => {
  // Sort candidates by nomor_urut
  const sortedCandidates = [...candidates].sort((a, b) => a.nomor_urut - b.nomor_urut);

  return (
    <section id="section-kandidat" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Pasangan Calon Pemimpin OSIS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Kandidat Ketua &amp; Wakil Ketua OSIS
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Kenali profil, integritas, visi strategis, dan program kerja unggulan dari setiap pasangan calon. Tentukan pilihan terbaik demi kemajuan OSIS kita.
        </p>

        {currentUser?.sudah_memilih && (
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Anda telah memberikan hak suara. Terima kasih atas partisipasi Anda dalam pesta demokrasi sekolah!</span>
          </div>
        )}
      </div>

      {/* Candidates Grid - Centered dynamically */}
      <div
        className={`grid gap-8 justify-center mx-auto ${
          sortedCandidates.length === 1
            ? 'grid-cols-1 max-w-md'
            : sortedCandidates.length === 2
            ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
            : sortedCandidates.length === 4
            ? 'grid-cols-1 md:grid-cols-2 max-w-5xl'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl'
        }`}
      >
        {sortedCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            currentUser={currentUser}
            onSelectCandidate={onSelectCandidate}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>
            Pilihan Anda bersifat rahasia, bebas, dan langsung dienkripsi ke database e-voting.
          </span>
        </p>
      </div>
    </section>
  );
};
