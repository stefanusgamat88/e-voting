import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Link2,
  AlertCircle,
  FileImage,
} from 'lucide-react';
import { Candidate } from '../types';

interface CandidatePhotoUploadModalProps {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  onClose: () => void;
  onSavePhoto: (candidateId: string, photoUrl: string) => void;
}

// Preset formal photos suited for student election candidates (Half-body portraits)
const PRESET_PHOTOS = [
  {
    label: 'Paslon Jas Formal / Setengah Badan Pria',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Paslon Jas Almamater / Setengah Badan Wanita',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Paslon Siswa Karismatik Setengah Badan',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Paslon Siswi Kemeja Formal Setengah Badan',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  },
];

export const CandidatePhotoUploadModal: React.FC<CandidatePhotoUploadModalProps> = ({
  candidates,
  selectedCandidate,
  onClose,
  onSavePhoto,
}) => {
  const [activeCandidateId, setActiveCandidateId] = useState<string>(
    selectedCandidate?.id || candidates[0]?.id || ''
  );
  const currentCandidate = candidates.find((c) => c.id === activeCandidateId) || candidates[0];

  const [previewUrl, setPreviewUrl] = useState<string>(currentCandidate?.foto || '');
  const [urlInput, setUrlInput] = useState<string>(currentCandidate?.foto || '');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // When candidate changes, update preview
  const handleSelectCandidate = (cand: Candidate) => {
    setActiveCandidateId(cand.id);
    setPreviewUrl(cand.foto);
    setUrlInput(cand.foto);
    setErrorMessage(null);
  };

  // Process image file to compressed base64 data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Berkas harus berupa gambar (.png, .jpg, .jpeg, .webp)');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize resolution: max width 800px, max height 1066px (3:4 ratio)
        const maxWidth = 800;
        const maxHeight = 1066;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreviewUrl(compressedDataUrl);
          setUrlInput(compressedDataUrl);
        } else {
          setPreviewUrl(event.target?.result as string);
          setUrlInput(event.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMessage('Gagal memproses gambar. Pastikan format valid.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage('Terjadi kesalahan saat membaca berkas.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMessage('Masukkan tautan URL foto kandidat');
      return;
    }
    setErrorMessage(null);
    setPreviewUrl(urlInput.trim());
  };

  const handleSave = () => {
    if (!previewUrl) {
      setErrorMessage('Silakan pilih atau upload foto terlebih dahulu.');
      return;
    }
    onSavePhoto(activeCandidateId, previewUrl);
    onClose();
  };

  const handleResetToOriginal = () => {
    if (currentCandidate) {
      setPreviewUrl(currentCandidate.foto);
      setUrlInput(currentCandidate.foto);
      setErrorMessage(null);
    }
  };

  if (!currentCandidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Upload Foto Pasangan Calon OSIS</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black">
                  No. 0{currentCandidate.nomor_urut}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih berkas foto dari komputer/HP untuk tampil resmi di Surat Suara &amp; Kartu Pemilihan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pilih Paslon */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
            Pilih Paslon:
          </span>
          {candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCandidate(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeCandidateId === c.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                0{c.nomor_urut}
              </span>
              <span>{c.nama_ketua.split(' ')[0]} &amp; {c.nama_wakil.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Sisi Kiri: Dropzone & Opsi Upload (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              {/* Drag and Drop Zone */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  1. Pilih Berkas Foto dari Komputer / Smartphone
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/40 dark:hover:bg-slate-800 hover:border-blue-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-1">
                    <FileImage className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {isProcessing ? 'Memproses gambar...' : 'Klik untuk Upload atau Tarik Foto ke Sini'}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                    Mendukung format JPG, PNG, WEBP. Foto otomatis disesuaikan dengan proporsi tegak (portrait 3:4) resmi surat suara.
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Pilih File Foto
                  </button>
                </div>
              </div>

              {/* URL Input Alternatif */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  2. Atau Tempel Tautan URL Gambar Eksternal
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/foto-paslon.jpg"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Gunakan URL
                  </button>
                </div>
              </div>

              {/* Preset Foto Formal Siswa */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Atau Gunakan Contoh Foto Paslon Siap Pakai:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPreviewUrl(preset.url);
                        setUrlInput(preset.url);
                        setErrorMessage(null);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 flex items-center gap-2 text-left cursor-pointer transition-all hover:shadow-xs group"
                    >
                      <img
                        src={preset.url}
                        alt="Preset"
                        className="w-9 h-11 rounded-lg object-cover object-top border border-slate-300 shrink-0"
                      />
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 line-clamp-2">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Pratinjau Tampilan Surat Suara (5 Cols) */}
            <div className="md:col-span-5">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Pratinjau Hasil di Surat Suara:
              </label>
              <div className="border-2 border-slate-900 rounded-2xl p-4 bg-slate-50 text-center shadow-md relative overflow-hidden">
                {/* Nomor Urut Bulat */}
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                  0{currentCandidate.nomor_urut}
                </div>

                {/* Bingkai Foto Portrait Paslon */}
                <div className="w-full max-w-[180px] mx-auto aspect-[3/4] rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-200 mb-3 shadow-xs relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={currentCandidate.nama_ketua}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-[10px]">Belum ada foto</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                    3:4 Portrait
                  </span>
                </div>

                {/* Info Paslon */}
                <div className="space-y-0.5 mb-3">
                  <span className="inline-block bg-slate-200 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-slate-700">
                    Calon Ketua &amp; Wakil
                  </span>
                  <h4 className="font-black text-xs text-slate-900 leading-tight">
                    {currentCandidate.nama_ketua}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-700">
                    &amp; {currentCandidate.nama_wakil}
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    ({currentCandidate.kelas_ketua || 'XI'} &bull; {currentCandidate.kelas_wakil || 'X'})
                  </span>
                </div>

                {/* Kotak Coblos */}
                <div className="pt-2 border-t-2 border-dashed border-slate-400">
                  <div className="w-18 h-12 mx-auto rounded-lg border-2 border-slate-900 border-dashed bg-white flex flex-col items-center justify-center p-0.5">
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase">
                      KOTAK COBLOS
                    </span>
                    <span className="text-[11px] font-black text-slate-900">
                      NO. 0{currentCandidate.nomor_urut}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center text-[11px] text-slate-500">
                <span>Foto proporsional, tidak terpotong</span>
                <button
                  type="button"
                  onClick={handleResetToOriginal}
                  className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan &amp; Terapkan Foto Paslon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
