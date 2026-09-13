import React from 'react';
import {
  Vote,
  BarChart3,
  Users,
  ShieldCheck,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Database,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSupabaseModal: () => void;
  isSupabaseActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenLogin,
  darkMode,
  setDarkMode,
  onOpenSupabaseModal,
  isSupabaseActive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & School Branding */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('beranda')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Vote className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  E-VOTING <span className="text-blue-600 dark:text-blue-400">OSIS</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE 2026/2027
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                SMA Negeri 1 Teladan
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-beranda"
              onClick={() => setActiveTab('beranda')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'beranda'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Beranda
            </button>
            <button
              id="nav-kandidat"
              onClick={() => {
                setActiveTab('beranda');
                setTimeout(() => {
                  document.getElementById('section-kandidat')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Kandidat
            </button>
            <button
              id="nav-alur"
              onClick={() => {
                setActiveTab('beranda');
                setTimeout(() => {
                  document.getElementById('section-alur')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Alur Pemilihan
            </button>
            <button
              id="nav-quickcount"
              onClick={() => setActiveTab('quickcount')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'quickcount'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Quick Count
            </button>
            <button
              id="nav-voting"
              onClick={() => {
                if (!currentUser) {
                  onOpenLogin();
                } else {
                  setActiveTab('voting');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'voting'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Vote className="w-4 h-4 text-amber-500" />
              Bilik Suara
            </button>
            <button
              id="nav-admin"
              onClick={() => {
                if (!currentUser || currentUser.role !== 'admin') {
                  setActiveTab('admin');
                } else {
                  setActiveTab('admin');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Admin Panel
            </button>
          </nav>

          {/* Right Controls: Supabase status, Dark Mode & User Profile/Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Pill */}
            <button
              id="btn-supabase-status"
              onClick={onOpenSupabaseModal}
              title="Klik untuk konfigurasi database Supabase & Realtime"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors"
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseActive ? 'text-emerald-500' : 'text-blue-500'}`} />
              <span className="text-slate-700 dark:text-slate-300">
                {isSupabaseActive ? 'Supabase Connected' : 'Realtime Engine'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Ganti tema"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Current User or Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {currentUser.nama.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]">
                      {currentUser.nama}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {currentUser.role === 'admin' ? (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Administrator</span>
                      ) : (
                        <span>{currentUser.kelas || 'Siswa'}</span>
                      )}
                      {currentUser.sudah_memilih && (
                        <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center font-semibold">
                          • Sudah Vote
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Keluar"
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub Navigation Row */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 overflow-x-auto">
          <button
            onClick={() => setActiveTab('beranda')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap ${
              activeTab === 'beranda' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => {
              setActiveTab('beranda');
              setTimeout(() => {
                document.getElementById('section-kandidat')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="py-1 px-2.5 rounded-lg whitespace-nowrap"
          >
            Kandidat
          </button>
          <button
            onClick={() => setActiveTab('quickcount')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'quickcount' ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : ''
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Quick Count
          </button>
          <button
            onClick={() => {
              if (!currentUser) onOpenLogin();
              else setActiveTab('voting');
            }}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'voting' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' : ''
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            Bilik Suara
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-1 px-2.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'admin' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' : ''
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
