import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Vote as VoteIcon,
  TrendingUp,
  RefreshCw,
  Award,
  Clock,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { QuickCountStats, Candidate, Vote, User } from '../types';
import { formatTimeShort } from '../lib/utils';
import { submitVote } from '../lib/supabase';

interface QuickCountProps {
  stats: QuickCountStats;
  candidates: Candidate[];
  votes: Vote[];
  users: User[];
  onRefresh: () => void;
  isRealtimeActive: boolean;
}

export const QuickCount: React.FC<QuickCountProps> = ({
  stats,
  candidates,
  votes,
  users,
  onRefresh,
  isRealtimeActive,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  // Handle simulate quick vote for demoing real-time changes
  const handleSimulateVote = async () => {
    // Pick an unvoted student
    const unvotedStudent = users.find((u) => u.role === 'siswa' && !u.sudah_memilih);
    if (!unvotedStudent) {
      setSimulationMessage('Semua siswa terdaftar telah memberikan hak suaranya!');
      setTimeout(() => setSimulationMessage(null), 3500);
      return;
    }

    // Pick random candidate
    const randomCand = candidates[Math.floor(Math.random() * candidates.length)];
    setIsSimulating(true);

    try {
      const res = await submitVote(unvotedStudent.id, randomCand.id, true);
      if (res.success) {
        setSimulationMessage(`Simulasi Suara Baru Masuk untuk Paslon 0${randomCand.nomor_urut} oleh siswa (${unvotedStudent.nama})`);
        onRefresh();
      } else {
        setSimulationMessage(res.message);
      }
    } catch {
      setSimulationMessage('Simulasi selesai.');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setSimulationMessage(null), 4000);
    }
  };

  return (
    <div id="quickcount-container" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Quick Count Realtime
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Pemutakhiran hasil tabulasi suara langsung dari bilik suara digital
              </p>
            </div>
          </div>
        </div>

        {/* Action controls: Live status & refresh */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Realtime Live Broadcast</span>
          </div>

          <button
            id="btn-simulate-vote"
            onClick={handleSimulateVote}
            disabled={isSimulating}
            title="Klik untuk mensimulasikan satu suara baru masuk dari pemilih acak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simulasi 1 Suara</span>
          </button>

          <button
            id="btn-manual-refresh"
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            {simulationMessage}
          </span>
          <span className="text-[11px] opacity-75">Tersinkronisasi</span>
        </div>
      )}

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Suara Masuk */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Suara Masuk</span>
            <VoteIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalSuaraMasuk}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Dari total {stats.totalDPT} DPT
          </p>
        </div>

        {/* Persentase Partisipasi */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Partisipasi Pemilih</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.persentasePartisipasi}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Tingkat partisipasi aktif
          </p>
        </div>

        {/* Belum Memilih */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Belum Memberi Suara</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalBelumMemilih}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Pemilih terdaftar tersisa
          </p>
        </div>

        {/* Total DPT Terdaftar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>Total DPT Resmi</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalDPT}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Ditetapkan oleh KPU OSIS
          </p>
        </div>
      </div>

      {/* Candidate Breakdown with Progress Bars */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Perolehan Suara Pasangan Calon
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stats.candidateStats.map((item) => {
            const { candidate, voteCount, percentage, isLeading } = item;
            const nomorFormatted = candidate.nomor_urut < 10 ? `0${candidate.nomor_urut}` : candidate.nomor_urut;

            const barColor =
              candidate.nomor_urut === 1
                ? 'from-blue-600 to-indigo-600'
                : candidate.nomor_urut === 2
                ? 'from-amber-400 to-yellow-500'
                : 'from-emerald-500 to-teal-600';

            return (
              <div
                key={candidate.id}
                className={`relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-800 border transition-all ${
                  isLeading
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-xl'
                    : 'border-slate-200 dark:border-slate-700/80 shadow-md'
                }`}
              >
                {/* Leading Badge */}
                {isLeading && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Memimpin Suara Terbanyak</span>
                  </div>
                )}

                <div>
                  {/* Candidate Header with Photo Thumbnail */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={candidate.foto}
                        alt={candidate.nama_ketua}
                        className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-slate-800 shadow">
                        {nomorFormatted}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Paslon {nomorFormatted}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {candidate.nama_ketua}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        &amp; {candidate.nama_wakil}
                      </p>
                    </div>
                  </div>

                  {/* Percentage & Vote Count */}
                  <div className="flex items-baseline justify-between pt-2 pb-1">
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {percentage}%
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">{voteCount}</strong> Suara
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700 mt-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>

                {/* Candidate Tagline */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/70 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="truncate italic">"{candidate.tagline}"</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0 ml-2">
                    {voteCount > 0 ? `${voteCount} pemilih` : 'Belum ada suara'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Comparative Bar Stack */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Distribusi Suara Komparatif
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proporsi perolehan suara dari keseluruhan suara sah yang telah masuk
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Total {stats.totalSuaraMasuk} Suara
          </span>
        </div>

        {/* Stacked Progress Bar */}
        {stats.totalSuaraMasuk > 0 ? (
          <div className="w-full h-8 rounded-2xl overflow-hidden flex bg-slate-100 dark:bg-slate-700 p-1 shadow-inner gap-1">
            {stats.candidateStats.map((item) => {
              if (item.percentage === 0) return null;
              const bg =
                item.candidate.nomor_urut === 1
                  ? 'bg-blue-600'
                  : item.candidate.nomor_urut === 2
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-emerald-600';
              return (
                <div
                  key={item.candidate.id}
                  className={`h-full rounded-xl flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ${bg}`}
                  style={{ width: `${item.percentage}%` }}
                  title={`Paslon 0${item.candidate.nomor_urut}: ${item.percentage}% (${item.voteCount} suara)`}
                >
                  {item.percentage >= 10 ? `Paslon 0${item.candidate.nomor_urut} (${item.percentage}%)` : `0${item.candidate.nomor_urut}`}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-8 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
            Belum ada suara yang masuk untuk dikomparasikan
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Paslon 01: M. Rizky &amp; Amanda</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Paslon 02: Farhan &amp; Keisha</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Paslon 03: Bima &amp; Siti Nurhaliza</span>
          </div>
        </div>
      </div>

      {/* Live Voting Stream / Audit Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Log Verifikasi Suara Masuk (Live Stream)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ID Pemilih disamarkan demi kerahasiaan
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-60 overflow-y-auto">
          {votes.slice(0, 8).map((vt, index) => {
            const maskedUser = `SISWA-***${vt.id.slice(-4)}`;
            return (
              <div key={vt.id || index} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Suara Sah Terverifikasi ({maskedUser})
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Hash Kripto: {vt.hash || `VOTE-${vt.id.substring(0, 8)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatTimeShort(vt.timestamp)} WIB
                  </span>
                </div>
              </div>
            );
          })}
          {votes.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              Belum ada aktivitas suara yang terekam.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
