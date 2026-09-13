import React, { useState } from 'react';
import {
  Building2,
  School,
  Save,
  RotateCcw,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Shield,
  FileBadge,
} from 'lucide-react';
import { ElectionSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';

interface InstitutionSettingsProps {
  settings: ElectionSettings;
  onSave: (updated: ElectionSettings) => void;
}

const PRESET_LOGOS = [
  {
    name: 'Akademik Modern',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Logo Garuda / Nasional',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sains & Teknologi',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Perisai Kehormatan',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
  },
];

export const InstitutionSettings: React.FC<InstitutionSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<ElectionSettings>({
    ...INITIAL_SETTINGS,
    ...settings,
  });

  const [activeSection, setActiveSection] = useState<'profile' | 'committee' | 'schedule'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data lembaga ke setelan bawaan?')) {
      setFormData(INITIAL_SETTINGS);
      onSave(INITIAL_SETTINGS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-slate-900 border border-blue-800/60 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-1">
              <School className="w-3.5 h-3.5" />
              <span>Identitas Resmi Sekolah / Lembaga</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Seting Lembaga &amp; Penyelenggara Pemilihan
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/80 max-w-xl mt-0.5">
              Kelola nama instansi, logo, penanggung jawab, kontak resmi, dan kop surat digital yang ditampilkan di seluruh sistem e-voting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fade-in text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Seting lembaga berhasil disimpan dan langsung diperbarui di seluruh aplikasi!</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            Tersimpan otomatis
          </span>
        </div>
      )}

      {/* LIVE PREVIEW: KOP SURAT DIGITAL LEMBAGA */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FileBadge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Pratinjau Langsung (Live Kop Surat Digital)
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Tampilan pada Beranda &amp; Sertifikat Tanda Terima
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={formData.school_logo || PRESET_LOGOS[0].url}
            alt="Logo Lembaga"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500/30 shadow-sm shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {formData.organization_name || 'Komisi Pemilihan Umum OSIS & MPK'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {formData.school_name || 'SMA NEGERI 1 TELADAN'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {formData.school_address || 'Jl. Pemuda Pendidikan No. 45'}
              {formData.school_city ? `, ${formData.school_city}` : ''}
              {formData.school_province ? `, ${formData.school_province}` : ''}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              {formData.contact_phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-500" /> {formData.contact_phone}
                </span>
              )}
              {formData.contact_email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-500" /> {formData.contact_email}
                </span>
              )}
              {formData.period && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  {formData.period}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs for Form */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <School className="w-4 h-4" />
            <span>1. Profil &amp; Identitas Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('committee')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'committee'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Penyelenggara &amp; Pimpinan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('schedule')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'schedule'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. Judul Acara &amp; Periode</span>
          </button>
        </div>

        {/* SECTION 1: PROFIL & IDENTITAS SEKOLAH */}
        {activeSection === 'profile' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Data Identitas Sekolah / Lembaga</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Resmi Sekolah / Lembaga Pendidikan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMA NEGERI 1 TELADAN"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Nama ini akan muncul pada Navbar, Hero banner, judul bukti suara, dan rekapitulasi.
                </p>
              </div>

              {/* Preset Logos */}
              <div className="sm:col-span-2 space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Pilihan Lambang / Logo Lembaga
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_LOGOS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, school_logo: preset.url })}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                        formData.school_logo === preset.url
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {preset.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Atau Masukkan URL Logo Kustom
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://domain-sekolah.sch.id/logo.png"
                    value={formData.school_logo || ''}
                    onChange={(e) => setFormData({ ...formData, school_logo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  {formData.school_logo && (
                    <img
                      src={formData.school_logo}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <input
                  type="text"
                  placeholder="Jl. Pemuda Pendidikan No. 45"
                  value={formData.school_address || ''}
                  onChange={(e) => setFormData({ ...formData, school_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kota / Kabupaten
                </label>
                <input
                  type="text"
                  placeholder="Jakarta Selatan"
                  value={formData.school_city || ''}
                  onChange={(e) => setFormData({ ...formData, school_city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  placeholder="DKI Jakarta"
                  value={formData.school_province || ''}
                  onChange={(e) => setFormData({ ...formData, school_province: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Website Resmi Sekolah
                </label>
                <input
                  type="url"
                  placeholder="https://sman1teladan.sch.id"
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Resmi Sekolah / Panitia
                </label>
                <input
                  type="email"
                  placeholder="info@sman1teladan.sch.id"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PENYELENGGARA & PIMPINAN */}
        {activeSection === 'committee' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Data Panitia Penyelenggara &amp; Pimpinan Lembaga</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Organisasi / Komisi Penyelenggara
                </label>
                <input
                  type="text"
                  placeholder="Komisi Pemilihan Umum OSIS & MPK"
                  value={formData.organization_name || ''}
                  onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Kepala Sekolah / Pimpinan Lembaga
                </label>
                <input
                  type="text"
                  placeholder="Drs. H. Bambang Sudirman, M.Pd."
                  value={formData.headmaster_name || ''}
                  onChange={(e) => setFormData({ ...formData, headmaster_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  NIP / Identitas Pimpinan
                </label>
                <input
                  type="text"
                  placeholder="19750812 200003 1 002"
                  value={formData.headmaster_nip || ''}
                  onChange={(e) => setFormData({ ...formData, headmaster_nip: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ketua Panitia Pemilihan (KPU OSIS)
                </label>
                <input
                  type="text"
                  placeholder="Muhammad Rian Pratama"
                  value={formData.kpu_chairman || ''}
                  onChange={(e) => setFormData({ ...formData, kpu_chairman: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Sekretaris Panitia
                </label>
                <input
                  type="text"
                  placeholder="Anindya Larasati"
                  value={formData.kpu_secretary || ''}
                  onChange={(e) => setFormData({ ...formData, kpu_secretary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor Telepon / Kontak WhatsApp Bantuan Siswa
                </label>
                <input
                  type="text"
                  placeholder="0812-3456-7890 / 0857-1234-5678"
                  value={formData.contact_phone || ''}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: JUDUL ACARA & PERIODE */}
        {activeSection === 'schedule' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>Format Judul Pemilihan &amp; Periode Masa Bakti</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Utama Pemilihan
                </label>
                <input
                  type="text"
                  required
                  placeholder="PEMILIHAN KETUA & WAKIL KETUA OSIS"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Periode / Tahun Ajaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Periode 2026/2027"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Status Bilik Suara
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                >
                  <option value="Sedang Berlangsung">Sedang Berlangsung (Bilik Terbuka)</option>
                  <option value="Ditutup">Ditutup (Pemilihan Selesai)</option>
                  <option value="Belum Dimulai">Belum Dimulai (Tahap Sosialisasi)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Waktu Mulai Pemilihan
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date ? formData.start_date.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Waktu Selesai Pemilihan
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date ? formData.end_date.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perubahan pada menu Seting Lembaga akan langsung tersimpan dan disinkronkan ke seluruh pengguna.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Batalkan / Bawaan
            </button>

            <button
              id="btn-save-institution"
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Seting Lembaga</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
