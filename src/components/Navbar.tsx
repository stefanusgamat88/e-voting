import React from 'react';
import { Home, LogIn, Shield, Vote, LogOut, Moon, Sun } from 'lucide-react';
import { ElectionSettings, User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSupabaseModal?: () => void;
  isSupabaseActive?: boolean;
  settings?: ElectionSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c1328] border-b border-slate-800/80 text-white select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Beranda (Matching uploaded image exactly) */}
          <button
            id="nav-beranda-btn"
            onClick={() => setActiveTab('beranda')}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'beranda'
                ? 'text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 text-slate-300" />
            <span>Beranda</span>
          </button>

          {/* Right: Masuk Pemilih & Admin (Matching uploaded image exactly) */}
          <div className="flex items-center gap-3">
            {/* Masuk Pemilih (Vibrant Blue Pill Button) */}
            {currentUser && currentUser.role === 'siswa' ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-voting-active"
                  onClick={() => setActiveTab('voting')}
                  className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Vote className="w-4 h-4" />
                  <span>Bilik Suara ({currentUser.nama.split(' ')[0]})</span>
                </button>
                <button
                  id="nav-logout-user"
                  onClick={onLogout}
                  title="Keluar"
                  className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-masuk-pemilih"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Pemilih</span>
              </button>
            )}

            {/* Admin (Outline Pill Button) */}
            <div className="flex items-center gap-1.5">
              <button
                id="nav-admin-btn"
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'border-blue-400 text-white bg-blue-950/40'
                    : 'border-slate-500/70 hover:border-slate-300 text-slate-200 hover:text-white bg-transparent'
                }`}
              >
                <Shield className="w-4 h-4 text-slate-300" />
                <span>Admin</span>
              </button>

              {currentUser && currentUser.role === 'admin' && (
                <button
                  id="nav-logout-admin"
                  onClick={onLogout}
                  title="Keluar Admin"
                  className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
