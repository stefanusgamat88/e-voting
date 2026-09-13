import React from 'react';
import { ShieldAlert, LogIn, ArrowRight, Lock } from 'lucide-react';

interface SessionExpiredModalProps {
  reason: string;
  onClose: () => void;
  onReLogin: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  reason,
  onClose,
  onReLogin,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-5">
        {/* Security Warning Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Header Title */}
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sesi Berakhir Otomatis
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Perlindungan Keamanan Sesi Pemilihan E-Voting
          </p>
        </div>

        {/* Message Box */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400/90 leading-normal pl-6">
            Sistem secara otomatis menutup sesi guna mencegah hak suara menggantung, melindungi kerahasiaan pilihan, dan menjaga integritas database pemilihan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
          <button
            id="btn-session-relogin"
            onClick={onReLogin}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Kembali</span>
          </button>
          <button
            id="btn-session-close"
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};
