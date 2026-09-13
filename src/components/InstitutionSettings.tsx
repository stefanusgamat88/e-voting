import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  School,
  Save,
  RotateCcw,
  CheckCircle2,
  Mail,
  Phone,
  UserCheck,
  Calendar,
  Image as ImageIcon,
  FileBadge,
  UploadCloud,
  Trash2,
  Link as LinkIcon,
  Sparkles,
  ArrowLeftRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { ElectionSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';

interface InstitutionSettingsProps {
  settings: ElectionSettings;
  onSave: (updated: ElectionSettings) => void;
  initialSection?: 'logos' | 'profile' | 'committee' | 'schedule';
}

export const PRESET_LOGOS_LEFT = [
  {
    name: 'Tut Wuri Handayani / Pendidikan',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    tag: 'Sekolah',
  },
  {
    name: 'Lambang Garuda Pancasila',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
    tag: 'Nasional',
  },
  {
    name: 'Sains & Riset Sekolah',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=80',
    tag: 'Akademik',
  },
  {
    name: 'Perisai Pendidikan Teladan',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
    tag: 'Kehormatan',
  },
];

export const PRESET_LOGOS_RIGHT = [
  {
    name: 'Logo OSIS Nasional Modern',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80',
    tag: 'OSIS',
  },
  {
    name: 'KPU Pemilihan Umum Siswa',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    tag: 'KPU OSIS',
  },
  {
    name: 'Majelis Perwakilan Kelas (MPK)',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
    tag: 'MPK',
  },
  {
    name: 'Demokrasi & Bintang Suara',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=80',
    tag: 'Demokrasi',
  },
];

export const InstitutionSettings: React.FC<InstitutionSettingsProps> = ({
  settings,
  onSave,
  initialSection = 'logos',
}) => {
  const [formData, setFormData] = useState<ElectionSettings>({
    ...INITIAL_SETTINGS,
    ...settings,
    school_logo_left: settings.school_logo_left || settings.school_logo || INITIAL_SETTINGS.school_logo_left,
    school_logo_right: settings.school_logo_right || INITIAL_SETTINGS.school_logo_right,
  });

  const [activeSection, setActiveSection] = useState<'logos' | 'profile' | 'committee' | 'schedule'>(initialSection);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastText, setToastText] = useState('Seting lembaga berhasil disimpan!');

  // File input refs for Left and Right Logos
  const fileInputLeftRef = useRef<HTMLInputElement>(null);
  const fileInputRightRef = useRef<HTMLInputElement>(null);

  // Drag states
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: ElectionSettings = {
      ...formData,
      school_logo: formData.school_logo_left || formData.school_logo,
    };
    onSave(updated);
    setToastText('Seting lembaga & logo kop surat berhasil disimpan!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data lembaga dan logo ke setelan bawaan?')) {
      setFormData(INITIAL_SETTINGS);
      onSave(INITIAL_SETTINGS);
      setToastText('Seluruh data berhasil dikembalikan ke bawaan!');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Helper to process uploaded image file and resize via Canvas
  const processImageFile = (file: File, side: 'left' | 'right') => {
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar yang valid (PNG, JPG, JPEG, WEBP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 450;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png', 0.92);
          if (side === 'left') {
            setFormData((prev) => ({ ...prev, school_logo_left: dataUrl, school_logo: dataUrl }));
          } else {
            setFormData((prev) => ({ ...prev, school_logo_right: dataUrl }));
          }
        } else {
          if (side === 'left') {
            setFormData((prev) => ({ ...prev, school_logo_left: rawData, school_logo: rawData }));
          } else {
            setFormData((prev) => ({ ...prev, school_logo_right: rawData }));
          }
        }
        setToastText(`Logo ${side === 'left' ? 'Kiri' : 'Kanan'} berhasil diunggah! Klik Simpan Perubahan.`);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      };
      img.onerror = () => {
        if (side === 'left') {
          setFormData((prev) => ({ ...prev, school_logo_left: rawData, school_logo: rawData }));
        } else {
          setFormData((prev) => ({ ...prev, school_logo_right: rawData }));
        }
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    if (side === 'left') setIsDraggingLeft(true);
    else setIsDraggingRight(true);
  };

  const handleDragLeave = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    if (side === 'left') setIsDraggingLeft(false);
    else setIsDraggingRight(false);
  };

  const handleDrop = (e: React.DragEvent, side: 'left' | 'right') => {
    e.preventDefault();
    if (side === 'left') setIsDraggingLeft(false);
    else setIsDraggingRight(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0], side);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0], side);
    }
  };

  const currentLogoLeft = formData.school_logo_left || formData.school_logo || PRESET_LOGOS_LEFT[0].url;
  const currentLogoRight = formData.school_logo_right || PRESET_LOGOS_RIGHT[0].url;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputLeftRef}
        onChange={(e) => handleFileChange(e, 'left')}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRightRef}
        onChange={(e) => handleFileChange(e, 'right')}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/95 via-indigo-900/90 to-slate-900 border border-blue-800/60 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-1">
              <School className="w-3.5 h-3.5" />
              <span>Identitas Resmi &amp; Kop Surat Lembaga</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Seting Lembaga &amp; Upload Logo Kiri / Kanan
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/80 max-w-xl mt-0.5">
              Atur Logo Sekolah (kiri), Logo OSIS/KPU (kanan), dan teks kop surat resmi untuk Berita Acara, C1 Rekapitulasi, dan Surat Suara.
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
            onClick={() => handleSubmit()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fade-in text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{toastText}</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            Tersimpan
          </span>
        </div>
      )}

      {/* LIVE PREVIEW: KOP SURAT DIGITAL LEMBAGA (Standard Indonesian Formal Layout) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 gap-2">
          <div className="flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Pratinjau Langsung Kop Surat (Live Preview)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tampilan persis yang dicetak pada Berita Acara Pleno, Sertifikat C1 Rekapitulasi, dan Surat Suara
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('logos')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ganti / Upload Logo</span>
            </button>
          </div>
        </div>

        {/* Live Formal Kop Document Canvas */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-inner">
          <div className="border-b-4 border-double border-slate-900 dark:border-slate-300 pb-4">
            <div className="flex items-center justify-between gap-4">
              {/* LOGO KIRI (Sekolah / Lambang Daerah) */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group cursor-pointer" onClick={() => fileInputLeftRef.current?.click()}>
                  <img
                    src={currentLogoLeft}
                    alt="Logo Kiri (Sekolah)"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-opacity">
                    <UploadCloud className="w-4 h-4 mb-0.5" />
                    <span>Ganti Kiri</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                  Logo Kiri (Sekolah)
                </span>
              </div>

              {/* CENTER KOP TEXT */}
              <div className="space-y-0.5 flex-1 text-center font-sans px-2">
                <h3 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-700 dark:text-slate-300">
                  {formData.organization_name || 'KOMISI PEMILIHAN UMUM OSIS & MPK'}
                </h3>
                <h2 className="text-base sm:text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white leading-tight">
                  {formData.school_name || 'SMA NEGERI 1 TELADAN'}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {formData.school_address || 'Jl. Pemuda Pendidikan No. 45, Kebayoran Baru'}
                  {formData.school_city ? `, ${formData.school_city}` : ''}
                  {formData.school_province ? `, ${formData.school_province}` : ''}
                </p>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 pt-0.5">
                  {formData.contact_phone && <span>Telp: {formData.contact_phone}</span>}
                  {formData.contact_email && <span>Email: {formData.contact_email}</span>}
                  {formData.website_url && <span>Web: {formData.website_url}</span>}
                </div>
              </div>

              {/* LOGO KANAN (OSIS / KPU Pemilihan) */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group cursor-pointer" onClick={() => fileInputRightRef.current?.click()}>
                  <img
                    src={currentLogoRight}
                    alt="Logo Kanan (OSIS/KPU)"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-opacity">
                    <UploadCloud className="w-4 h-4 mb-0.5" />
                    <span>Ganti Kanan</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                  Logo Kanan (OSIS/KPU)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs for Institution Management */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 text-xs sm:text-sm font-bold">
          <button
            id="subtab-upload-logos"
            type="button"
            onClick={() => setActiveSection('logos')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'logos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Logo Kiri &amp; Kanan</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-400 text-slate-950 font-black">
              Kop Surat
            </span>
          </button>

          <button
            id="subtab-institution-profile"
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Profil &amp; Identitas Sekolah</span>
          </button>

          <button
            id="subtab-institution-committee"
            type="button"
            onClick={() => setActiveSection('committee')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'committee'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Penyelenggara &amp; Pimpinan</span>
          </button>

          <button
            id="subtab-institution-schedule"
            type="button"
            onClick={() => setActiveSection('schedule')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'schedule'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Judul Acara &amp; Periode</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* SECTION: UPLOAD LOGO KIRI & KANAN (DEDICATED MENU)            */}
        {/* ============================================================ */}
        {activeSection === 'logos' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-950 dark:text-blue-200">
                <p className="font-bold">Panduan Logo Kop Surat Resmi:</p>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                  &bull; <strong>Logo Kiri:</strong> Biasanya merupakan lambang resmi sekolah, Tut Wuri Handayani, atau logo Dinas Pendidikan daerah.<br />
                  &bull; <strong>Logo Kanan:</strong> Lambang resmi OSIS, MPK, atau Komisi Pemilihan Umum Siswa (KPU).<br />
                  &bull; Format yang didukung: <strong>PNG, JPG, WEBP, SVG</strong> (disarankan PNG transparan).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* -------------------------------------------------------- */}
              {/* CARD 1: UPLOAD LOGO KIRI (SEKOLAH / DINAS PENDIDIKAN)   */}
              {/* -------------------------------------------------------- */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                      KIRI
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Logo Kiri (Sekolah / Dinas)
                      </h4>
                      <p className="text-[11px] text-slate-500">Tampil di sisi kiri kop surat</p>
                    </div>
                  </div>
                  {formData.school_logo_left && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, school_logo_left: '', school_logo: '' })}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      title="Hapus Logo Kiri"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => handleDragOver(e, 'left')}
                  onDragLeave={(e) => handleDragLeave(e, 'left')}
                  onDrop={(e) => handleDrop(e, 'left')}
                  onClick={() => fileInputLeftRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDraggingLeft
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-sm">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Klik untuk Pilih File atau Seret ke Sini
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Format PNG, JPG, WEBP, atau SVG (Maksimal 5MB)
                  </p>
                  <span className="mt-3 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm shadow-blue-500/20">
                    Pilih File dari Perangkat
                  </span>
                </div>

                {/* URL Direct Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span>Atau Masukkan URL Gambar Logo Kiri:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/logo-sekolah.png"
                      value={formData.school_logo_left || ''}
                      onChange={(e) => setFormData({ ...formData, school_logo_left: e.target.value, school_logo: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Preset Choices for Left Logo */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                    Atau Pilih Contoh Lambang Pendidikan:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRESET_LOGOS_LEFT.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, school_logo_left: preset.url, school_logo: preset.url })}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          formData.school_logo_left === preset.url
                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-8 h-8 rounded-lg object-cover bg-white"
                        />
                        <div className="truncate text-left">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            {preset.name}
                          </p>
                          <span className="text-[9px] text-blue-600 font-semibold uppercase">
                            {preset.tag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* CARD 2: UPLOAD LOGO KANAN (OSIS / MPK / KPU PEMILIHAN)   */}
              {/* -------------------------------------------------------- */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                      KANAN
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Logo Kanan (OSIS / MPK / KPU)
                      </h4>
                      <p className="text-[11px] text-slate-500">Tampil di sisi kanan kop surat</p>
                    </div>
                  </div>
                  {formData.school_logo_right && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, school_logo_right: '' })}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      title="Hapus Logo Kanan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => handleDragOver(e, 'right')}
                  onDragLeave={(e) => handleDragLeave(e, 'right')}
                  onDrop={(e) => handleDrop(e, 'right')}
                  onClick={() => fileInputRightRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDraggingRight
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-sm">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Klik untuk Pilih File atau Seret ke Sini
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Format PNG, JPG, WEBP, atau SVG (Maksimal 5MB)
                  </p>
                  <span className="mt-3 px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-sm shadow-indigo-500/20">
                    Pilih File dari Perangkat
                  </span>
                </div>

                {/* URL Direct Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Atau Masukkan URL Gambar Logo Kanan:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/logo-osis.png"
                      value={formData.school_logo_right || ''}
                      onChange={(e) => setFormData({ ...formData, school_logo_right: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Preset Choices for Right Logo */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                    Atau Pilih Contoh Lambang OSIS / KPU:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRESET_LOGOS_RIGHT.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, school_logo_right: preset.url })}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          formData.school_logo_right === preset.url
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-8 h-8 rounded-lg object-cover bg-white"
                        />
                        <div className="truncate text-left">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            {preset.name}
                          </p>
                          <span className="text-[9px] text-indigo-600 font-semibold uppercase">
                            {preset.tag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 1: PROFIL & IDENTITAS SEKOLAH                         */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* SECTION 2: PENYELENGGARA & PIMPINAN                         */}
        {/* ============================================================ */}
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

        {/* ============================================================ */}
        {/* SECTION 3: JUDUL ACARA & PERIODE                             */}
        {/* ============================================================ */}
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
            Perubahan logo dan identitas lembaga akan langsung disinkronkan ke seluruh dokumen resmi e-voting.
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
