import React from 'react';
import { Vote, ShieldCheck, Heart, ExternalLink, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { ElectionSettings } from '../types';

interface FooterProps {
  settings?: ElectionSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const schoolName = settings?.school_name || 'SMA Negeri 1 Teladan';
  const orgName = settings?.organization_name || 'Komisi Pemilihan Umum OSIS & MPK';
  const period = settings?.period || 'Periode 2026/2027';
  const address = settings?.school_address || 'Jl. Pemuda Pendidikan No. 45';
  const city = settings?.school_city || 'Jakarta Selatan';

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-16 pb-12 no-print print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings?.school_logo ? (
                <img
                  src={settings.school_logo}
                  alt={schoolName}
                  className="w-10 h-10 rounded-xl object-cover border border-blue-400/40 shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Vote className="w-6 h-6 text-amber-300" />
                </div>
              )}
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  E-VOTING <span className="text-blue-400">OSIS</span>
                </span>
                <p className="text-xs text-slate-400">{schoolName}</p>
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

          {/* Legal / Panitia Lembaga */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sekretariat Penyelenggara
            </h4>
            <div className="text-xs text-slate-400 leading-relaxed space-y-1">
              <p className="font-semibold text-slate-300">{orgName}</p>
              <p className="flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{address}, {city}</span>
              </p>
              {settings?.contact_phone && (
                <p className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{settings.contact_phone}</span>
                </p>
              )}
              {settings?.contact_email && (
                <p className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{settings.contact_email}</span>
                </p>
              )}
              <p className="text-[11px] text-blue-400 font-medium pt-1">{period}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} E-Voting OSIS • {schoolName}. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk Pesta Demokrasi Pelajar &amp; Regenerasi Kepemimpinan
          </p>
        </div>
      </div>
    </footer>
  );
};
