import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  SUPABASE_ANON_KEY,
  SUPABASE_SQL_SCHEMA,
  SUPABASE_URL,
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  onClose: () => void;
  onRefresh: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  onClose,
  onRefresh,
}) => {
  const [urlInput, setUrlInput] = useState(SUPABASE_URL || '');
  const [keyInput, setKeyInput] = useState(SUPABASE_ANON_KEY || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      localStorage.setItem('evoting_supabase_url', urlInput.trim());
    } else {
      localStorage.removeItem('evoting_supabase_url');
    }

    if (keyInput.trim()) {
      localStorage.setItem('evoting_supabase_key', keyInput.trim());
    } else {
      localStorage.removeItem('evoting_supabase_key');
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onRefresh();
      window.location.reload();
    }, 1200);
  };

  const handleResetToLocal = () => {
    localStorage.removeItem('evoting_supabase_url');
    localStorage.removeItem('evoting_supabase_key');
    setUrlInput('');
    setKeyInput('');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Integrasi Database Supabase &amp; Realtime
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Konfigurasi PostgreSQL cloud Supabase &amp; arsitektur clean data
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Status card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500 animate-ping' : 'bg-blue-500'
                }`}
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isSupabaseConfigured ? 'Supabase Live Connected' : 'Simulasi Real-Time Interaktif Aktif'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isSupabaseConfigured
                    ? 'Aplikasi terhubung ke instance Supabase Anda.'
                    : 'Aplikasi beroperasi mulus dengan Local Real-Time Engine & LocalStorage.'}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {isSupabaseConfigured ? 'Production Live' : 'High-Fidelity Engine'}
            </span>
          </div>

          {/* Automatic Session Expiry & Security Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-blue-900 dark:text-blue-200">
                Pengecekan Otomatis Sesi &amp; Auto-Logout Aktif
              </p>
              <p className="text-blue-700 dark:text-blue-400 leading-relaxed">
                Sistem memonitor token Supabase dan sesi pemilih secara berkala. Jika token kedaluwarsa atau sesi berakhir, pengguna akan otomatis dilogout untuk menjaga kerahasiaan suara dan mencegah sesi menggantung.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveKeys} className="space-y-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                Project URL Supabase
              </label>
              <input
                type="text"
                placeholder="https://xyzproject.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={handleResetToLocal}
                  className="text-xs text-red-500 hover:underline"
                >
                  Lepas Koneksi &amp; Gunakan Local Engine
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                {savedSuccess ? 'Tersimpan!' : 'Simpan Kredensial'}
              </button>
            </div>
          </form>

          {/* SQL Migration Script Copy Box */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Skrip SQL PostgreSQL Supabase (users, candidates, votes, RLS, Realtime)
              </span>
              <button
                onClick={handleCopySQL}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Tersalin!' : 'Salin SQL 1-Klik'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-300 text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800 leading-relaxed select-all">
              {SUPABASE_SQL_SCHEMA}
            </pre>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Salin dan tempel skrip di atas ke menu <strong>SQL Editor</strong> di dashboard Supabase Anda untuk membuat seluruh tabel dan fungsi realtime secara otomatis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
