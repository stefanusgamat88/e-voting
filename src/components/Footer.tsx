import React from 'react';
import { Vote, ShieldCheck, Heart, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Vote className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  E-VOTING <span className="text-blue-400">OSIS</span>
                </span>
                <p className="text-xs text-slate-400">SMA Negeri 1 Teladan</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Platform e-voting pemilihan Ketua &amp; Wakil Ketua OSIS modern dengan quick count real-time, transparansi hasil, dan proteksi anti double-vote berstandar enkripsi digital.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Luber &amp; Jurdil
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-cyan-400" />
                Anti Double Vote
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#section-kandidat" className="hover:text-blue-400 transition-colors">
                  Profil 3 Pasangan Calon
                </a>
              </li>
              <li>
                <a href="#section-alur" className="hover:text-blue-400 transition-colors">
                  Petunjuk &amp; Alur Voting
                </a>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  Rekapitulasi Quick Count
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  Portal Masuk Siswa
                </span>
              </li>
            </ul>
          </div>

          {/* Legal / Panitia */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Panitia KPU OSIS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Komisi Pemilihan Umum OSIS <br />
              Sekretariat: Ruang OSIS / MPK Lt. 2 <br />
              SMA Negeri 1 Teladan <br />
              Tahun Ajaran 2026/2027
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 E-Voting OSIS SMAN 1 Teladan. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan dedikasi untuk Pesta Demokrasi Pelajar Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
