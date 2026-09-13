import React from 'react';
import {
  Vote,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle,
  Radio,
  Clock,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { QuickCountStats, ElectionSettings, User } from '../types';

interface HeroSectionProps {
  stats: QuickCountStats;
  settings: ElectionSettings;
  currentUser: User | null;
  onStartVoting: () => void;
  onViewQuickCount: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  settings,
  currentUser,
  onStartVoting,
  onViewQuickCount,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061838] via-[#0A2660] to-[#14479E] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Tech / Mesh Accents */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-400 blur-3xl" />
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{settings.school_name} • {settings.period}</span>
            </div>

            {/* Main Big Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-sm">
              PEMILIHAN KETUA &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                WAKIL KETUA OSIS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed font-normal">
              Wujudkan regenerasi kepemimpinan pelajar yang berkarakter, berintegritas, dan inovatif.
              Gunakan hak suaramu secara cerdas, jujur, dan bertanggung jawab melalui sistem voting digital yang transparan dan anti double-vote.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              {/* Primary Yellow Button */}
              <button
                id="btn-hero-vote"
                onClick={onStartVoting}
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Vote className="w-5 h-5 text-slate-950 group-hover:rotate-6 transition-transform" />
                <span>{currentUser && currentUser.sudah_memilih ? 'Lihat Bukti Pilihan Saya' : 'Masuk & Mulai Memilih'}</span>
                <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Outline White Button */}
              <button
                id="btn-hero-quickcount"
                onClick={onViewQuickCount}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-base text-white border-2 border-white/60 hover:border-white hover:bg-white/15 backdrop-blur-sm shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
              >
                <BarChart3 className="w-5 h-5 text-cyan-300" />
                <span>Lihat Quick Count</span>
              </button>
            </div>

            {/* Security Guarantee Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-blue-200/80 font-medium border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Sistem Anti Double-Vote
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-300" />
                Enkripsi Suara Terverifikasi
              </span>
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
                Real-Time Quick Count
              </span>
            </div>
          </div>

          {/* Right Column: Card Status */}
          <div className="lg:col-span-5">
            <div
              id="hero-status-card"
              className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-2xl shadow-blue-950/50 text-white"
            >
              {/* Card Header & Status */}
              <div className="flex items-center justify-between pb-6 border-b border-white/15">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-blue-200">
                    Status Pemilihan
                  </p>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    Live Status E-Voting
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{settings.status}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {/* Total Paslon */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
                    <Users className="w-4 h-4 text-amber-300" />
                    <span>Total Paslon</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats.candidateStats.length}{' '}
                    <span className="text-sm font-normal text-blue-200">Kandidat</span>
                  </div>
                  <p className="text-[11px] text-blue-200/70 mt-1">
                    3 Pasangan Calon Resmi
                  </p>
                </div>

                {/* Jumlah Pemilih (DPT) */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
                    <Vote className="w-4 h-4 text-cyan-300" />
                    <span>Jumlah Pemilih</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stats.totalDPT.toLocaleString('id-ID')}{' '}
                    <span className="text-sm font-normal text-blue-200">Siswa</span>
                  </div>
                  <p className="text-[11px] text-blue-200/70 mt-1">
                    Daftar Pemilih Tetap (DPT)
                  </p>
                </div>
              </div>

              {/* Progress Bar Suara Masuk */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-blue-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Progress Suara Masuk
                  </span>
                  <span className="text-amber-300 font-bold text-sm">
                    {stats.persentasePartisipasi}%
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 shadow-sm transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(stats.persentasePartisipasi, 3)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-blue-200/80 pt-1">
                  <span>
                    <strong className="text-white">{stats.totalSuaraMasuk}</strong> Suara Telah Masuk
                  </span>
                  <span>
                    <strong className="text-white">{stats.totalBelumMemilih}</strong> Belum Memilih
                  </span>
                </div>
              </div>

              {/* Card Footer Ticker */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-300" />
                  Pemilihan dibuka s.d 16:00 WIB
                </span>
                <button
                  onClick={onViewQuickCount}
                  className="text-amber-300 hover:text-amber-200 font-semibold hover:underline flex items-center gap-1"
                >
                  Detail Suara &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
