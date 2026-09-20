import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  LogIn,
  TrendingUp,
  Calendar,
  Clock,
  Timer,
  Hourglass,
  AlertCircle,
} from 'lucide-react';
import { QuickCountStats, ElectionSettings, User } from '../types';
import {
  formatElectionTimeRange,
  getElectionScheduleStatus,
  calculateElectionCountdown,
  CountdownTime,
} from '../lib/utils';

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

  // Dynamic live countdown state updated every second
  const [countdown, setCountdown] = useState<CountdownTime>(() =>
    calculateElectionCountdown(settings.start_date, settings.end_date, settings.status)
  );

  useEffect(() => {
    // Initial calculation
    setCountdown(
      calculateElectionCountdown(settings.start_date, settings.end_date, settings.status)
    );

    const interval = setInterval(() => {
      setCountdown(
        calculateElectionCountdown(settings.start_date, settings.end_date, settings.status)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.start_date, settings.end_date, settings.status]);

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

            {/* Mobile / Compact Quick Countdown Status Banner */}
            {countdown.status === 'ongoing' && (
              <div className="pt-1 flex items-center gap-2 text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white shadow-sm">
                  <Timer className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="text-blue-100 font-medium">Sisa Waktu Memilih:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {countdown.days > 0 ? `${countdown.days}h ` : ''}
                    {String(countdown.hours).padStart(2, '0')}:
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Clean Status Card with Countdown Timer */}
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
              </div>

              {/* DYNAMIC COUNTDOWN TIMER VISUALIZATION */}
              <div
                id="hero-countdown-timer-box"
                className="mt-4 p-4 rounded-2xl bg-slate-950/30 backdrop-blur-md border border-white/20 shadow-inner space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Timer
                      className={`w-4 h-4 text-amber-400 ${
                        countdown.status === 'ongoing' ? 'animate-spin-slow' : ''
                      }`}
                    />
                    <span className="tracking-wide uppercase text-[11px] font-black text-amber-300">
                      {countdown.title}
                    </span>
                  </div>
                  {countdown.status === 'ongoing' ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  ) : countdown.status === 'upcoming' ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 text-[10px] font-black tracking-wider">
                      AKAN DATANG
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/25 border border-red-400/40 text-red-300 text-[10px] font-black tracking-wider">
                      DITUTUP
                    </span>
                  )}
                </div>

                {countdown.status === 'ended' ? (
                  <div className="py-2.5 px-3 rounded-xl bg-red-950/40 border border-red-500/30 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-red-300 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Pemungutan Suara Resmi Berakhir</span>
                    </div>
                    <p className="text-[11px] text-blue-100/80">
                      Bilik suara digital telah disegel. Silakan pantau rekapitulasi perolehan suara.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 4 Digit Tiles: Hari, Jam, Menit, Detik */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {/* Hari */}
                      <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl py-2 px-1 flex flex-col items-center transition-colors">
                        <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                          {String(countdown.days).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider text-blue-200/90 uppercase mt-0.5">
                          Hari
                        </span>
                      </div>

                      {/* Jam */}
                      <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl py-2 px-1 flex flex-col items-center transition-colors">
                        <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tracking-tight drop-shadow-md">
                          {String(countdown.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider text-blue-200/90 uppercase mt-0.5">
                          Jam
                        </span>
                      </div>

                      {/* Menit */}
                      <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl py-2 px-1 flex flex-col items-center transition-colors">
                        <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                          {String(countdown.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider text-blue-200/90 uppercase mt-0.5">
                          Menit
                        </span>
                      </div>

                      {/* Detik (Pulsing live counter) */}
                      <div className="bg-amber-400/20 hover:bg-amber-400/25 border border-amber-300/40 rounded-xl py-2 px-1 flex flex-col items-center transition-colors relative overflow-hidden">
                        <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tracking-tight drop-shadow-md">
                          {String(countdown.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-black tracking-wider text-amber-200 uppercase mt-0.5">
                          Detik
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Election Window */}
                    {countdown.status === 'ongoing' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[10px] text-blue-100/90 font-semibold">
                          <span className="flex items-center gap-1">
                            <Hourglass className="w-3 h-3 text-amber-300" />
                            <span>Durasi Waktu Berjalan</span>
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            {countdown.percentageElapsed > 0
                              ? `${countdown.percentageElapsed.toFixed(0)}% Selesai`
                              : 'Baru Dimulai'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-700 ease-out"
                            style={{
                              width: `${Math.min(100, Math.max(3, countdown.percentageElapsed))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 2-Column Grid: Total Paslon & Hak Pilih DPT */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 mb-4">
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

