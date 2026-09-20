import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  Users,
  Copy,
} from 'lucide-react';
import { User } from '../types';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingUsers: User[];
  onImportSuccess: (importedUsers: User[], mode: 'append' | 'replace') => void;
}

interface ParsedStudent {
  nisn: string;
  nama: string;
  kelas: string;
  isValid: boolean;
  status: 'ready' | 'duplicate_existing' | 'duplicate_in_file' | 'invalid_nisn' | 'invalid_name';
  errorMessage?: string;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  existingUsers,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [filterPreview, setFilterPreview] = useState<'all' | 'valid' | 'invalid'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Template CSV Download
  const handleDownloadTemplate = () => {
    const csvContent =
      'NISN,Nama Siswa,Kelas\n' +
      '0051234567,Ahmad Fauzi,XI MIPA 1\n' +
      '0052345678,Bunga Citra Lestari,XI IPS 2\n' +
      '0063456789,Dimas Pratama,X-A\n' +
      '0064567890,Fitriani Rahmawati,X-B\n' +
      '0055678901,Gilang Ramadhan,XI MIPA 3\n';

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Template_Impor_DPT_Siswa.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Parse lines of text (CSV/TSV/Separated)
  const parseRows = (text: string, sourceName?: string) => {
    setErrorNotice(null);
    if (!text.trim()) {
      setParsedData([]);
      return;
    }

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setErrorNotice('File atau teks yang dimasukkan kosong.');
      return;
    }

    // Check if first line is header
    const firstLine = lines[0].toLowerCase();
    const hasHeader =
      firstLine.includes('nisn') ||
      firstLine.includes('nama') ||
      firstLine.includes('kelas') ||
      firstLine.includes('siswa');

    const dataLines = hasHeader ? lines.slice(1) : lines;

    const existingNisns = new Set(
      existingUsers.filter((u) => u.role === 'siswa').map((u) => u.nisn.trim())
    );
    const seenInFile = new Set<string>();

    const results: ParsedStudent[] = [];

    dataLines.forEach((line) => {
      // Determine separator: tab, semicolon, comma
      let tokens: string[] = [];
      if (line.includes('\t')) {
        tokens = line.split('\t');
      } else if (line.includes(';')) {
        tokens = line.split(';');
      } else if (line.includes(',')) {
        // Simple comma split respecting quotes if present
        tokens = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      } else {
        // Fallback whitespace split if at least 2 tokens
        tokens = line.split(/\s{2,}|\t/);
      }

      tokens = tokens.map((t) => t.replace(/^["']|["']$/g, '').trim());

      if (tokens.length === 0 || (tokens.length === 1 && !tokens[0])) return;

      let nisn = '';
      let nama = '';
      let kelas = '';

      // Detection heuristic:
      // If token 0 is purely digits or alphanumeric 8-12 length -> nisn
      if (tokens.length >= 3) {
        nisn = tokens[0];
        nama = tokens[1];
        kelas = tokens[2];
      } else if (tokens.length === 2) {
        if (/^\d+$/.test(tokens[0])) {
          nisn = tokens[0];
          nama = tokens[1];
          kelas = 'Siswa';
        } else if (/^\d+$/.test(tokens[1])) {
          nama = tokens[0];
          nisn = tokens[1];
          kelas = 'Siswa';
        } else {
          nisn = tokens[0];
          nama = tokens[1];
          kelas = 'Siswa';
        }
      } else if (tokens.length === 1) {
        nisn = tokens[0];
        nama = `Siswa ${tokens[0]}`;
        kelas = 'Siswa';
      }

      nisn = nisn.replace(/[^a-zA-Z0-9]/g, '');

      // Validation
      let isValid = true;
      let status: ParsedStudent['status'] = 'ready';
      let errorMessage: string | undefined;

      if (!nisn || nisn.length < 4) {
        isValid = false;
        status = 'invalid_nisn';
        errorMessage = 'NISN tidak valid (minimal 4 karakter)';
      } else if (!nama || nama.length < 2) {
        isValid = false;
        status = 'invalid_name';
        errorMessage = 'Nama siswa terlalu pendek/kosong';
      } else if (seenInFile.has(nisn)) {
        isValid = false;
        status = 'duplicate_in_file';
        errorMessage = 'NISN terduplikasi di dalam file impor ini';
      } else if (importMode === 'append' && existingNisns.has(nisn)) {
        isValid = false;
        status = 'duplicate_existing';
        errorMessage = 'NISN sudah terdaftar di DPT sebelumnya';
      }

      if (nisn) seenInFile.add(nisn);

      results.push({
        nisn,
        nama,
        kelas: kelas || 'Siswa',
        isValid,
        status,
        errorMessage,
      });
    });

    setParsedData(results);
    if (sourceName) setFileName(sourceName);
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      parseRows(content, file.name);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorNotice('Gagal membaca file. Pastikan file berformat teks atau CSV.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  // Handle Drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      parseRows(content, file.name);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  // Re-run parsing when mode changes
  const handleModeChange = (mode: 'append' | 'replace') => {
    setImportMode(mode);
    if (parsedData.length > 0) {
      const existingNisns = new Set(
        existingUsers.filter((u) => u.role === 'siswa').map((u) => u.nisn.trim())
      );
      const seenInFile = new Set<string>();

      const updated = parsedData.map((item) => {
        let isValid = true;
        let status: ParsedStudent['status'] = 'ready';
        let errorMessage: string | undefined;

        if (!item.nisn || item.nisn.length < 4) {
          isValid = false;
          status = 'invalid_nisn';
          errorMessage = 'NISN tidak valid';
        } else if (!item.nama || item.nama.length < 2) {
          isValid = false;
          status = 'invalid_name';
          errorMessage = 'Nama kosong';
        } else if (seenInFile.has(item.nisn)) {
          isValid = false;
          status = 'duplicate_in_file';
          errorMessage = 'Duplikat dalam file ini';
        } else if (mode === 'append' && existingNisns.has(item.nisn)) {
          isValid = false;
          status = 'duplicate_existing';
          errorMessage = 'Sudah ada di DPT';
        }

        if (item.nisn) seenInFile.add(item.nisn);

        return {
          ...item,
          isValid,
          status,
          errorMessage,
        };
      });
      setParsedData(updated);
    }
  };

  // Execute Import
  const handleCommitImport = () => {
    const validRows = parsedData.filter((p) => p.isValid);
    if (validRows.length === 0) {
      setErrorNotice('Tidak ada baris data valid yang dapat diimpor.');
      return;
    }

    const newUsersToImport: User[] = validRows.map((r, idx) => ({
      id: `usr-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      nama: r.nama,
      nisn: r.nisn,
      role: 'siswa',
      sudah_memilih: false,
      kelas: r.kelas,
    }));

    onImportSuccess(newUsersToImport, importMode);
    onClose();
  };

  const validCount = parsedData.filter((p) => p.isValid).length;
  const invalidCount = parsedData.filter((p) => !p.isValid).length;

  const displayList = parsedData.filter((p) => {
    if (filterPreview === 'valid') return p.isValid;
    if (filterPreview === 'invalid') return !p.isValid;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Impor Data Siswa (DPT)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tambah daftar pemilih secara massal melalui file CSV, Excel, atau Salin-Tempel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Method Subtabs & Template Download */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File CSV / TXT</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'paste'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin &amp; Tempel Teks</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Contoh Template CSV</span>
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.txt,.tsv"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {fileName ? (
                  <span className="text-blue-600 dark:text-blue-400">{fileName}</span>
                ) : (
                  'Tarik & Lepaskan File CSV / TXT di sini, atau Klik untuk Memilih'
                )}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mendukung format koma (,), titik koma (;), atau tab pemisah (kolom: NISN, Nama Siswa, Kelas)
              </p>
            </div>
          )}

          {/* Tab 2: Paste Raw Text */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Tempel Data Siswa (Satu baris per siswa)</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Format: NISN, Nama Siswa, Kelas
                </span>
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  parseRows(e.target.value, 'Input Teks');
                }}
                placeholder={`0051234567, Ahmad Fauzi, XI MIPA 1\n0052345678, Bunga Citra, XI IPS 2\n0063456789, Dimas Pratama, X-A`}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Import Mode: Append vs Replace */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Metode Impor ke Database DPT
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => handleModeChange('append')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  importMode === 'append'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => handleModeChange('append')}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Tambahkan ke Data yang Ada (Rekomendasi)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Mempertahankan pemilih yang sudah ada, hanya menambahkan siswa baru dan mengabaikan NISN yang duplikat.
                  </p>
                </div>
              </label>

              <label
                onClick={() => handleModeChange('replace')}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  importMode === 'replace'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => handleModeChange('replace')}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white text-amber-600 dark:text-amber-400">
                    Ganti Seluruh Data Siswa (Reset DPT)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Menghapus seluruh daftar pemilih siswa lama dan menggantinya dengan data baru dari file ini.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Error Notice if any */}
          {errorNotice && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Preview Table of Parsed Data */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Hasil Pratinjau ({parsedData.length} Baris Terdeteksi)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    {validCount} Siap Impor
                  </span>
                  {invalidCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                      {invalidCount} Dilewati / Duplikat
                    </span>
                  )}
                </div>

                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setFilterPreview('all')}
                    className={`px-2.5 py-1 rounded ${filterPreview === 'all' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Semua ({parsedData.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterPreview('valid')}
                    className={`px-2.5 py-1 rounded ${filterPreview === 'valid' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Valid ({validCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterPreview('invalid')}
                    className={`px-2.5 py-1 rounded ${filterPreview === 'invalid' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Masalah ({invalidCount})
                  </button>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase z-10">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">NISN</th>
                      <th className="py-2 px-3">Nama Siswa</th>
                      <th className="py-2 px-3">Kelas</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {displayList.slice(0, 100).map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.isValid
                            ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                            : 'bg-red-50/30 dark:bg-red-950/20 text-red-900 dark:text-red-200'
                        }
                      >
                        <td className="py-2 px-3 text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold">{row.nisn || '-'}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                          {row.nama || '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {row.kelas || '-'}
                        </td>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400" title={row.errorMessage}>
                              <AlertTriangle className="w-3 h-3" />
                              {row.errorMessage || 'Tidak Valid'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {displayList.length > 100 && (
                      <tr>
                        <td colSpan={5} className="py-2 text-center text-slate-400 italic text-[11px]">
                          ... dan {displayList.length - 100} baris lainnya
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {parsedData.length > 0 ? (
              <span>
                Total <strong className="text-slate-800 dark:text-white">{validCount} siswa</strong>{' '}
                akan dimasukkan ke DPT.
              </span>
            ) : (
              <span>Pilih file atau tempel teks untuk memulai pratinjau.</span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={validCount === 0 || isProcessing}
              onClick={handleCommitImport}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                validCount > 0 && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Impor {validCount > 0 ? `${validCount} Siswa` : 'Data Siswa'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
