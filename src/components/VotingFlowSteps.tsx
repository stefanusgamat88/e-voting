import React from 'react';
import { LogIn, UserCheck, CheckSquare, FileCheck2, ArrowRight } from 'lucide-react';

export const VotingFlowSteps: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Login Pemilih',
      desc: 'Masuk menggunakan NISN atau scan QR code akses yang telah diverifikasi oleh panitia KPU OSIS.',
      icon: LogIn,
      color: 'bg-blue-600 text-white',
      border: 'border-blue-200 dark:border-blue-900',
    },
    {
      number: '02',
      title: 'Pilih Kandidat',
      desc: 'Tinjau profil, visi, misi, dan program unggulan dari ketiga paslon, kemudian tentukan pilihan terbaik Anda.',
      icon: UserCheck,
      color: 'bg-indigo-600 text-white',
      border: 'border-indigo-200 dark:border-indigo-900',
    },
    {
      number: '03',
      title: 'Konfirmasi Suara',
      desc: 'Sistem memunculkan dialog verifikasi pilihan untuk memastikan tidak terjadi kesalahan saat memilih.',
      icon: CheckSquare,
      color: 'bg-amber-500 text-slate-950 font-bold',
      border: 'border-amber-200 dark:border-amber-900',
    },
    {
      number: '04',
      title: 'Selesai & Bukti',
      desc: 'Suara Anda langsung terenkripsi ke database e-voting secara real-time dan Anda memperoleh bukti tanda terima sah.',
      icon: FileCheck2,
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-200 dark:border-emerald-900',
    },
  ];

  return (
    <section id="section-alur" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <span>Panduan Memilih</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Alur Pemilihan Suara Digital
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Hanya 4 langkah mudah untuk menggunakan hak suara Anda dalam hitungan detik. Cepat, aman, dan tanpa kertas.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Step Number & Connector */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${step.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-600 tracking-wider">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>

                {/* Right Arrow indicator on desktop between cards */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
