import React from 'react';
import {
  Sparkles,
  LogIn,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react';
import { QuickCountStats, ElectionSettings, User } from '../types';
import { formatElectionTimeRange, getElectionScheduleStatus } from '../lib/utils';

interface HeroSectionProps {
  stats: QuickCountStats;
  settings: ElectionSettings;
  currentUser: User | null;
  onStartVoting: () => void;
  onViewQuickCount: () => void;
  onViewBallot?: () => void;
  onViewRecap?: () => void;
  onViewReport?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  settings,
  currentUser,
  onStartVoting,
  onViewQuickCount,
}) => {
  const schedule = getElectionScheduleStatus(
    settings.start_date,
    settings.end_date,
    settings.status
  );
  const timeRangeFormatted = formatElectionTimeRange(
    settings.start_date,
    settings.end_date
  );
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1d5ce5] via-[#2165f1] to-[#2563eb] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title & Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-800 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>E-Voting Resmi Siswa &amp; Guru</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PEMILIHAN KETUA &amp; WAKIL KETUA OSIS
            </h1>

            {/* Description Subtitle */}
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl leading-relaxed">
              Selamat datang di portal pemilihan OSIS resmi{' '}
              <span className="font-bold text-white">
                {settings.school_name || 'SMA NEGERI 1 INDONESIA'}
              </span>{' '}
              Tahun Ajaran {settings.period || '2025/2026'}. Gunakan hak suara Anda dengan jujur, adil, dan transparan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Masuk & Mulai Memilih (Yellow Pill Button) */}
              <button
                id="btn-hero-vote"
                onClick={onStartVoting}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm sm:text-base bg-[#fbb017] hover:bg-[#e5a013] text-slate-950 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>
                  {currentUser && currentUser.sudah_memilih
                    ? 'Lihat Bukti Pilihan'
                    : 'Masuk & Mulai Memilih'}
                </span>
              </button>

              {/* Lihat Quick Count (Outline Pill Button) */}
              <button
                id="btn-hero-quickcount"
                onClick={onViewQuickCount}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm sm:text-base border border-white/80 hover:border-white hover:bg-white/10 text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-white" />
                <span>Lihat Quick Count</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Status Card */}
          <div className="lg:col-span-5">
            <div
              id="hero-status-card"
              className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 sm:p-7 text-white shadow-xl"
            >
              {/* Header: Status Pemilihan & Pill Tag */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/95">
                  Status Pemilihan
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold tracking-wide shadow-sm ${
                    schedule.status === 'ongoing'
                      ? 'bg-[#16a34a]'
                      : schedule.status === 'upcoming'
                      ? 'bg-amber-600'
                      : 'bg-red-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full bg-white ${
                      schedule.status === 'ongoing' ? 'animate-pulse' : ''
                    }`}
                  />
                  <span>
                    {schedule.status === 'ongoing'
                      ? (settings.status || 'Sedang Berlangsung').toUpperCase()
                      : schedule.status === 'upcoming'
                      ? 'BELUM DIMULAI'
                      : 'DITUTUP'}
                  </span>
                </div>
              </div>

              {/* Rentang Waktu Pemilihan Card */}
              <div className="mt-3 p-3 rounded-2xl bg-white/10 border border-white/15 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-blue-100/90 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">Rentang Waktu Pemilihan:</span>
                </div>
                <p className="text-white font-mono text-[11px] sm:text-xs pl-5 font-semibold">
                  {timeRangeFormatted}
                </p>
                {schedule.timeRemaining && (
                  <div className="flex items-center gap-1.5 pt-1 pl-5 text-[11px] text-amber-300 font-bold">
                    <Clock className="w-3 h-3 animate-spin-slow shrink-0" />
                    <span>
                      {schedule.status === 'ongoing'
                        ? `Sisa Waktu: ${schedule.timeRemaining}`
                        : `Mulai dalam: ${schedule.timeRemaining}`}
                    </span>
                  </div>
                )}
              </div>

              {/* 2-Column Grid: Total Paslon & Hak Pilih DPT */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5 mb-4">
                {/* Total Paslon */}
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <p className="text-xs text-blue-100/80 font-medium">
                    Total Paslon
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    {stats.candidateStats.length} Pasangan
                  </p>
                </div>

                {/* Hak Pilih DPT */}
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <p className="text-xs text-blue-100/80 font-medium">
                    Hak Pilih DPT
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    {stats.totalDPT} Pemilih
                  </p>
                </div>
              </div>

              {/* Suara Masuk Saat Ini & Progress Bar */}
              <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                <p className="text-xs text-blue-100/80 font-medium">
                  Suara Masuk Saat Ini
                </p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-xl sm:text-2xl font-extrabold text-white">
                    {stats.totalSuaraMasuk} Suara
                  </p>
                  <span className="inline-block bg-[#fbb017] text-slate-950 font-bold text-xs px-2 py-0.5 rounded">
                    {stats.persentasePartisipasi.toFixed(1)}%
                  </span>
                </div>

                {/* Yellow Thin Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden mt-3">
                  <div
                    className="h-full rounded-full bg-[#fbb017] transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(
                        Math.max(stats.persentasePartisipasi, 2),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

